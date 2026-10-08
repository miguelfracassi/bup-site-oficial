(()=>{
const L=[['/','Início'],['/expressoes','Expressões'],['/como-funciona','Como funciona'],['/faq','Perguntas frequentes']],p=location.pathname.replace(/\.html$/,'').replace(/(.)\/$/,'$1');
const n=document.getElementById('nav');if(n)n.outerHTML='<header class="nav"><div class="nin"><a class="logo" href="/">BUP</a><nav aria-label="Principal">'+L.map(([h,t])=>`<a href="${h}"${p===h?' aria-current="page"':''}>${t}</a>`).join('')+'</nav><a class="btn" href="/conversar">Conversar</a></div></header>';
const f=document.getElementById('foot');if(f)f.outerHTML=`<footer><div class="fin"><div><a href="https://ticord.website" target="_blank" rel="noopener"><img src="/assets/ticord.png" alt="Ticord Grupo"></a><p>Bots, sites e automações. Grupo Ticord.</p></div>
<div>${L.map(([h,t])=>`<a href="${h}">${t}</a>`).join('')}<a href="/conversar">Conversar com o Bup</a><a href="/privacidade">Política de Privacidade</a></div>
<div><a href="https://ticord.website" target="_blank" rel="noopener">ticord.website</a><a href="tel:+5519999894031">(19) 99989-4031</a><a href="mailto:helpticord@gmail.com">helpticord@gmail.com</a></div></div><div class="copy">© 2026 Todos os direitos reservados. Bup é um projeto do Grupo Ticord.</div></footer>`;
})();
