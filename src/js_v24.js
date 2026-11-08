/* v24: main menu as separate pages instead of one long scroll */
(function(){
const menu=document.getElementById('menu');if(!menu)return;
const q=s=>document.querySelector(s);
const PG=[['play','Play'],['profile','Profile'],['positions','Positions'],['airports','Airports'],['realism','Realism'],['howto','How it works']];
const MAP={play:['.shero','#setup'],profile:['#prof'],positions:['#positions'],airports:['#airports'],realism:['#realism'],howto:['#howto']};
const ALIAS={top:'play',setup:'play',start:'play',prof:'profile'};
const css=`.pgnav{position:sticky;top:0;z-index:30;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:10px max(16px,calc((100% - 1180px)/2));background:rgba(7,10,21,.9);backdrop-filter:blur(8px);border-bottom:1px solid rgba(170,185,230,.14)}
.pgnav::-webkit-scrollbar{display:none}
.pgnav a{flex:none;padding:9px 18px;border-radius:99px;font:600 15px var(--disp);color:#aab3cf;text-decoration:none;border:1px solid transparent;white-space:nowrap}
.pgnav a:hover{color:#fff;background:rgba(255,255,255,.06)}
.pgnav a.on{color:#1b1203;background:linear-gradient(135deg,#ffb23e,#ff8a3d);box-shadow:0 8px 22px -10px rgba(255,150,50,.8)}
#menu .snav .slinks{display:none}
.pg-off{display:none!important}
.ss.pgp{margin-top:34px}
.pgback{margin:26px 0 10px}.pgback a{color:#ffb23e;font:600 15px var(--disp);text-decoration:none}
#menu .snav{position:static}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const nav=document.createElement('nav');nav.className='pgnav';nav.setAttribute('aria-label','Menu pages');
nav.innerHTML=PG.map(p=>`<a href="#${p[0]}" data-p="${p[0]}">${p[1]}</a>`).join('');
const sn=q('#menu .snav');sn.parentNode.insertBefore(nav,sn.nextSibling);
// mark page members
for(const k in MAP)MAP[k].forEach(s=>{const e=q(s);if(e){e.dataset.pg=k;if(k!=='play')e.classList.add('pgp')}});
let cur='';
function go(p,scroll){p=ALIAS[p]||p;if(!MAP[p])p='play';cur=p;
 document.querySelectorAll('#menu [data-pg]').forEach(e=>e.classList.toggle('pg-off',e.dataset.pg!==p));
 nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.dataset.p===p));
 if(p==='profile'&&window.profRender)profRender();
 if(location.hash!=='#'+p){try{history.pushState(null,'','#'+p)}catch(e){}}
 if(scroll!==false)window.scrollTo(0,0);}
window.goPage=go;
menu.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href').slice(1);
 const p=ALIAS[id]||(MAP[id]?id:null);if(!p)return;e.preventDefault();go(p);
});
window.addEventListener('popstate',()=>go(location.hash.slice(1)||'play',false));
// footer link to start on every page
const ft=q('.sfoot');
go(location.hash.slice(1)||'play',false);
})();
