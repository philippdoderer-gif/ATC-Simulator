/* v25: start page – the three airport cards are live flight boards */
(function(){
const bd0=document.getElementById('board');if(bd0)bd0.style.display='none';
const css=`#apc.cards{grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:16px}
#apc .card{background:linear-gradient(180deg,#0d1020,#06080f);border-color:rgba(255,178,62,.2);padding:0}
#apc .card .mb{padding:16px 14px 10px}
#apc .mh{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:8px}
#apc .mh b{font:700 21px var(--disp)}#apc .mh em{font:600 15px var(--mono);color:#ffb23e;font-style:normal}
#apc .ml{font:600 11px var(--mono);color:#7f89a6;margin:8px 0 3px;display:flex;justify-content:space-between}
#apc .mgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px 28px}#apc .mc{min-width:0}
#apc .mr{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)}#apc .mr .fl:last-child{justify-self:end}
#apc .mh b{font-size:26px}#apc .mh em{font-size:20px}
@media(max-width:900px){#apc .mgrid{grid-template-columns:1fr}}
#apc .mr .fl{font-size:14px;gap:2px}#apc .mr .fl .fc{width:.8em}
#apc .mf{padding:10px 14px 14px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.06);font-size:13px;color:#9aa3bd}
#apc .mf b{font:700 14px var(--disp);color:#ffb23e}

#apc .card .tag{display:none}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const F=()=>window.__bd;
function mini(k){const B=F();if(!B)return'';const sh=+(document.getElementById('stt')||{value:-1}).value,mn=new Date().getUTCMinutes(),now=sh>=0?sh*60+mn:B.lt(k);
 const rows=(m,n)=>B.gen(k,m).filter(f=>f.t+f.late>=now-(m==='D'?10:15)).slice(0,n).map((f,i)=>{const[s,c]=B.status(f,now,m);
  return `<div class="mr">${B.cells(B.hm(f.t),5,'w','m'+k+m+i+'t')}${B.cells(f.n,f.n.length,'dim','m'+k+m+i+'n')}${B.cells(f.dest,f.dest.length,'','m'+k+m+i+'d')}${B.cells(s,s.length,c,'m'+k+m+i+'s')}</div>`}).join('');
 return `<div class="mb"><div class="mh"><b>${AP[k].n}</b><em>${B.hm(now)}${sh>=0?' · shift start':''}</em></div><div class="mgrid"><div class="mc"><div class="ml"><span>DEPARTURES</span><span>${AP[k].icao}</span></div>${rows('D',6)}</div><div class="mc"><div class="ml"><span>ARRIVALS</span><span>${AP[k].icao}</span></div>${rows('A',6)}</div></div><div class="mf"><span>${DATA[k].rw.map(r=>r.n1+'/'+r.n2).join(' · ')}</span><b>${k===selAp?'Selected':'Choose'}</b></div>`}
function paint(){const c=document.getElementById('apc');if(!c)return;c.querySelectorAll('.card[data-a]').forEach(b=>{b.innerHTML=mini(b.dataset.a)})}
const ob=buildMenu;buildMenu=function(){ob.apply(this,arguments);paint()};
let sig='';setInterval(()=>{const m=document.getElementById('menu');if(m&&m.hidden)return;const s=selAp+'|'+((document.getElementById('stt')||{}).value);if(s!==sig){sig=s;paint()}},400);
setInterval(paint,20000);
paint();
})();
