/* v25: start page – the three airport cards are live flight boards */
(function(){
const bd0=document.getElementById('board');if(bd0)bd0.style.display='none';
const css=`#apc.cards{grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:16px}
#apc .card{background:linear-gradient(180deg,#0d1020,#06080f);border-color:rgba(255,178,62,.2);padding:0}
#apc .card .mb{padding:16px 14px 10px}
#apc .mh{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:8px}
#apc .mh b{font:700 21px var(--disp)}#apc .mh em{font:600 15px var(--mono);color:#ffb23e;font-style:normal}
#apc .ml{font:600 11px var(--mono);color:#7f89a6;margin:8px 0 3px;display:flex;justify-content:space-between}
#apc .mr{display:flex;gap:7px;align-items:center;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.05);overflow:hidden}
#apc .mr .fl{font-size:9.5px;gap:1px}#apc .mr .fl .fc{width:.8em}
#apc .mf{padding:10px 14px 14px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.06);font-size:13px;color:#9aa3bd}
#apc .mf b{font:700 14px var(--disp);color:#ffb23e}

#apc .card .tag{display:none}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const F=()=>window.__bd;
function mini(k){const B=F();if(!B)return'';const sh=+(document.getElementById('stt')||{value:-1}).value,mn=new Date().getUTCMinutes(),now=sh>=0?sh*60+mn:B.lt(k);
 const rows=(m,n)=>B.gen(k,m).filter(f=>f.t+f.late>=now-(m==='D'?10:15)).slice(0,n).map((f,i)=>{const[s,c]=B.status(f,now,m);
  return `<div class="mr">${B.cells(B.hm(f.t),5,'w','m'+k+m+i+'t')}${B.cells(f.n,6,'dim','m'+k+m+i+'n')}${B.cells(f.dest,10,'','m'+k+m+i+'d')}${B.cells(s.replace('Baggage ',''),10,c,'m'+k+m+i+'s')}</div>`}).join('');
 return `<div class="mb"><div class="mh"><b>${AP[k].n}</b><em>${B.hm(now)}</em></div><div class="ml"><span>DEPARTURES</span><span>${AP[k].icao}${sh>=0?' · shift start':' · local'}</span></div>${rows('D',4)}<div class="ml"><span>ARRIVALS</span><span></span></div>${rows('A',3)}</div><div class="mf"><span>${DATA[k].rw.map(r=>r.n1+'/'+r.n2).join(' · ')}</span><b>${k===selAp?'Selected':'Choose'}</b></div>`}
function paint(){const c=document.getElementById('apc');if(!c)return;c.querySelectorAll('.card[data-a]').forEach(b=>{b.innerHTML=mini(b.dataset.a)})}
const ob=buildMenu;buildMenu=function(){ob.apply(this,arguments);paint()};
let sig='';setInterval(()=>{const m=document.getElementById('menu');if(m&&m.hidden)return;const s=selAp+'|'+((document.getElementById('stt')||{}).value);if(s!==sig){sig=s;paint()}},400);
setInterval(paint,20000);
paint();
})();
