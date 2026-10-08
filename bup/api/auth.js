// GET = quem sou eu | POST {action: signup | login | logout}
const { sql, init, uid, setCookie, clear, hash, check, body } = require('./_lib');
const tries = new Map();
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) return res.status(500).json({ error: 'Configure DATABASE_URL e AUTH_SECRET na Vercel.' });
  try {
    await init();
    if (req.method === 'GET') {
      const id = uid(req); if (!id) return res.status(401).json({ error: 'off' });
      const [u] = await sql`SELECT id, name, email FROM users WHERE id = ${id}`;
      if (!u) { clear(res); return res.status(401).json({ error: 'off' }); }
      return res.status(200).json({ user: u });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
    const b = body(req);
    if (b.action === 'logout') { clear(res); return res.status(200).json({ ok: true }); }

    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'x', now = Date.now();
    const recent = (tries.get(ip) || []).filter((t) => now - t < 600000);
    if (recent.length >= 15) return res.status(429).json({ error: 'Muitas tentativas. Espere alguns minutos.' });
    recent.push(now); tries.set(ip, recent);

    const email = String(b.email || '').trim().toLowerCase().slice(0, 120), pass = String(b.password || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'E-mail inválido.' });
    if (pass.length < 8 || pass.length > 100) return res.status(400).json({ error: 'A senha precisa ter entre 8 e 100 caracteres.' });

    if (b.action === 'signup') {
      const name = String(b.name || '').trim().slice(0, 30);
      if (name.length < 2) return res.status(400).json({ error: 'Diga seu nome pro Bup (mínimo 2 letras).' });
      const [dup] = await sql`SELECT 1 FROM users WHERE email = ${email}`;
      if (dup) return res.status(409).json({ error: 'Esse e-mail já tem conta. Tente entrar.' });
      const [u] = await sql`INSERT INTO users(name, email, pass) VALUES (${name}, ${email}, ${hash(pass)}) RETURNING id, name, email`;
      await sql`INSERT INTO pets(user_id) VALUES (${u.id})`;
      setCookie(res, u.id);
      return res.status(200).json({ user: u });
    }
    if (b.action === 'login') {
      const [u] = await sql`SELECT id, name, email, pass FROM users WHERE email = ${email}`;
      if (!u || !check(pass, u.pass)) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      setCookie(res, u.id);
      return res.status(200).json({ user: { id: u.id, name: u.name, email: u.email } });
    }
    return res.status(400).json({ error: 'ação inválida' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro no servidor. Tente de novo.' });
  }
};
