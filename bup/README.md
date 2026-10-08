# Bup
1. Suba a pasta num repositório e importe na Vercel.
2. Vercel > Storage > Neon (Postgres): conecte ao projeto. Isso cria `DATABASE_URL`.
3. Em Settings > Environment Variables adicione `GEMINI_API_KEY` (aistudio.google.com) e `AUTH_SECRET` (qualquer texto longo e aleatório, ex.: `openssl rand -hex 32`).
4. Deploy. As tabelas (users, pets, messages) são criadas sozinhas no primeiro acesso.

Páginas: `/` (início), `/expressoes`, `/como-funciona`, `/faq`, `/privacidade`, `/conversar` (login + chat). Menu e rodapé ficam em `site.js`; estilos em `site.css`.
