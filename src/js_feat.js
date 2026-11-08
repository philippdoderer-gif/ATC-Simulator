// ================= v23 features: strip bays, delivery frequency, overflights =================
const hsh=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))%9973;return h},sidOf=a=>(a.ex?a.ex[0]:'DCT')+' '+(1+hsh(a.ex?a.ex[0]:'x')%9)+'ABCDEFGHJKLMNPQRSTUVWXYZ'[hsh(a.rw||'')%24],
 sqOf=a=>{if(!a.sq){let s;do{s=String(1+Math.random()*6|0);for(let i=0;i<3;i++)s+=Math.floor(Math.random()*8)}while(/^(7[567]00|2000|1000|7000|1200)$/.test(s)||ac.some(o=>o!==a&&o.sq===s));a.sq=s}return a.sq},wrongSq=s=>{const i=1+Math.random()*3|0;return s.slice(0,i)+((+s[i]+1+Math.random()*6|0)%8)+s.slice(i+1)};
// ground frequencies (LHR from the Ground Movement Control Map; others to be confirmed)
const gndF=a=>{if(A.icao==='EGLL'){const n=String(a.gate.n);return /^5/.test(n)?'121.855':/^2/.test(n)?'121.905':'121.705'}return A.icao==='EDDM'?'121.830':'121.805'};
// ---- overflights (only talk to Center)
let OVT=200;
function mkOvf(){const fx=A.ent.concat(A.ex).filter(f=>WP[f[0]]);if(fx.length<3)return;const ang=f=>brg(WP[f[0]][0],WP[f[0]][1]);
 const e1=rnd(fx),far=fx.filter(f=>Math.abs(dif(ang(f),ang(e1)+180))<75);const e2=far.length?rnd(far):fx.slice().sort((p,q)=>Math.abs(dif(ang(q),ang(e1)+180))-Math.abs(dif(ang(p),ang(e1)+180)))[0];
 const al=rnd(Object.keys(AIRL).filter(k=>AIRL[k].k==='P')),A0=AIRL[al],cs=al+(100+Math.random()*899|0);if(ac.some(x=>x.cs===cs))return;
 const dst=rnd(Object.keys(DEST)),d=DEST[dst],type=rnd(Math.random()<.25?A0.w:A0.n),b1=ang(e1),b2=ang(e2),alt=rnd([28000,30000,32000,34000,36000,38000,40000]);
 const x=SIN(b1)*58,y=COS(b1)*58,t=[SIN(b2)*70,COS(b2)*70],hdg=brg(t[0]-x,t[1]-y);
 if(ac.some(q=>q.ph==='air'&&Math.hypot(q.x-x,q.y-y)<8&&Math.abs(q.alt-alt)<2000))return;
 const a={id:uid++,cs,radio:A0.r,type,code:dst,city:d.c,dep:true,ovf:1,rw:FLW[1][0],gate:{n:'–',x:0,y:0},fl:alt/100,t:0,sched:T,ph:'air',ctrl:'C',kind:'P',x,y,hdg,alt,s:450,th:hdg,ta:alt,ts:450,trail:[],info:ATIS.l,need:false,rc:false,req:null,ex:[e2[0],b2],dct:t,conf:false};
 snap(a);ac.push(a);if(HS('C'))ask(a,'radar','FL'+Math.round(alt/100)+', overflying, routing '+e2[0]+'.');return a}
function ovfSpawn(dt,force){if(force){for(let i=0;i<force;i++){const a=mkOvf();if(a){const k=.2+Math.random()*.5;a.x*=k;a.y*=k;const t=a.dct;a.hdg=a.th=brg(t[0]-a.x,t[1]-a.y);snap(a)}}return}
 OVT-=dt;if(OVT>0)return;const h=lt((T/3600)%24);OVT=(200+Math.random()*320)/Math.max(.35,DAYF*(h>6&&h<22?1:.4));if(ac.filter(a=>a.ovf).length>=4)return;mkOvf()}
function ovfAir(a,dt){
 if(a.lv>0){a.lv-=dt;if(a.lv<=0){a.gone=1;score+=30;say(rc(a)+': leaving frequency, good day.','plt');return}}
 if(HS('C')&&a.ctrl==='C'&&!a.rc){a.rt=(a.rt||0)+dt;if(a.rt>150&&!a.rp){a.rp=1;score-=5;say('Unidentified traffic '+a.cs+': radar contact missing','sys')}}
 if(a.dct){if(Math.hypot(a.dct[0]-a.x,a.dct[1]-a.y)<2)a.dct=null;else a.th=brg(a.dct[0]-a.x,a.dct[1]-a.y)}
 const r=Math.hypot(a.x,a.y),out=a.x*SIN(a.hdg)+a.y*COS(a.hdg)>0;
 if(HS('C')&&a.ctrl==='C'&&!a.req&&!a.lv&&out&&r>38)a.req='handoff';
 a.hdg=nrm(a.hdg+cl(dif(a.th,a.hdg),-3*dt,3*dt));a.alt+=cl(a.ta-a.alt,-(a.exp>0?55:28)*dt,(a.exp>0?55:28)*dt);if(a.exp>0)a.exp-=dt;a.s+=cl(a.ts-a.s,-1.5*dt,1.5*dt);
 a.x+=SIN(a.hdg)*a.s/3600*dt;a.y+=COS(a.hdg)*a.s/3600*dt;
 if(Math.hypot(a.x,a.y)>62){a.gone=1;if(HS('C')&&a.ctrl==='C'&&!a.lv){score-=10;say(a.cs+' left the sector without handover')}}}
// ---- strip bays
let BAYS=[{id:'dep',n:'Departures'},{id:'arr',n:'Arrivals'},{id:'ovf',n:'Overflights'}],bayN=0,dragS=null;
const bayOf=o=>{const b=o.bay&&BAYS.some(q=>q.id===o.bay)?o.bay:null;return b||(o.ovf?'ovf':o.dep?'dep':'arr')},ordOf=o=>o.ord!=null?o.ord:o.id;
function stripList(){return ac.filter(o=>o.ph!=='parked'&&!o.gone&&(MODE==='C'?o.ph==='air':MODE==='G'?o.ph!=='air':!(o.ovf)))}
function stripsRender(){if(dragS)return;const L=stripList(),host=$('strips');if(host.dataset.m!==MODE){host.dataset.m=MODE}
 const bays=BAYS.filter(b=>b.id!=='ovf'||MODE==='C'||L.some(o=>bayOf(o)==='ovf'));
 let h='<div class="bays">';
 for(const b of bays){const items=L.filter(o=>bayOf(o)===b.id).sort((p,q)=>ordOf(p)-ordOf(q));
  h+=`<div class="bay" data-bay="${b.id}"><div class="bh"><span>${b.n}</span><i>${items.length}</i>${b.c?`<b class="bx" data-x="${b.id}">×</b>`:''}</div>`+
   items.map(o=>`<div class="strip2 ${o===sel?'sel':''} ${O(o)?'mine':''} ${o.conf?'conf':''}" data-id="${o.id}"><span class="grip" data-g="${o.id}">⠿</span><div class="sb"><div class="s1"><b>${o.cs}</b> ${o.ovf?'→':o.dep?'↑':'↓'}${o.req&&(O(o)||o.req==='cross')&&!(MODE==='G'&&o.ph==='gate'&&!O(o))?' <i class="rq">'+REQL[o.req]+'</i>':''}${o.pend&&o.pend.length?' <i class="pq">●</i>':''}</div><div class="s2">${o.type} · ${o.ovf?'FL'+Math.round(o.alt/100):(o.dep?o.code:A.icao)}</div></div></div>`).join('')+'</div>'}
 h+='<button class="addbay" data-add="1">+ Bay</button></div>';
 if(host.dataset.h!==h){host.dataset.h=h;host.innerHTML=h}}
function bayDrop(id,x,y){const o=ac.find(q=>q.id===id);if(!o)return;const el=document.elementFromPoint(x,y),bay=el&&el.closest('.bay');if(!bay)return;
 const bid=bay.dataset.bay;o.bay=bid;const others=[...bay.querySelectorAll('.strip2')].filter(e=>+e.dataset.id!==id);let before=null;for(const e of others){const r=e.getBoundingClientRect();if(y<r.top+r.height/2){before=e;break}}
 const key=e=>ordOf(ac.find(q=>q.id===+e.dataset.id)||{id:0});let v;if(!others.length)v=o.id;else if(!before)v=key(others[others.length-1])+1;else{const i=others.indexOf(before);v=i===0?key(before)-1:(key(others[i-1])+key(before))/2}o.ord=v}
$('strips').onclick=e=>{if(e.target.closest('.grip'))return;const x=e.target.closest('[data-x]');if(x){BAYS=BAYS.filter(b=>b.id!==x.dataset.x);dragS=null;stripsRender();return}
 if(e.target.closest('.addbay')){bayN++;BAYS.push({id:'c'+bayN,n:'Bay '+(bayN+3),c:1});$('strips').dataset.h='';stripsRender();return}
 const s=e.target.closest('.strip2');if(!s)return;sel=ac.find(a=>a.id==+s.dataset.id)||null;psig='';ui()};
$('strips').addEventListener('pointerdown',e=>{const g=e.target.closest('.grip');if(!g)return;e.preventDefault();const id=+g.dataset.g,src=g.closest('.strip2'),gh=src.cloneNode(true);gh.classList.add('ghost');const r=src.getBoundingClientRect();gh.style.width=r.width+'px';document.body.appendChild(gh);dragS={id,gh,src};src.style.opacity=.35;
 const mv=ev=>{gh.style.left=(ev.clientX-20)+'px';gh.style.top=(ev.clientY-14)+'px';const el=document.elementFromPoint(ev.clientX,ev.clientY),b=el&&el.closest('.bay');document.querySelectorAll('.bay').forEach(q=>q.classList.toggle('over',q===b))};
 const up=ev=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up);gh.remove();document.querySelectorAll('.bay').forEach(q=>q.classList.remove('over'));if(ev.type==='pointerup')bayDrop(id,ev.clientX,ev.clientY);dragS=null;$('strips').dataset.h='';stripsRender()};
 window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);mv(e)});
// ---- ground: delivery / ground frequency
function freqRender(){let f=$('freq');if(MODE!=='G'){if(f)f.hidden=true;return}
 if(!f){f=document.createElement('div');f.id='freq';f.className='panel';$('ctl').parentNode.insertBefore(f,$('ctl'));f.onclick=e=>{const b=e.target.closest('button');if(!b)return;GF=b.dataset.f;psig='';ui()}}
 f.hidden=false;const nD=ac.filter(a=>a.req&&a.ph==='gate'&&a.dl&&a.ctrl==='G').length,nG=ac.filter(a=>a.ctrl==='G'&&a.req&&!(a.ph==='gate'&&a.dl)).length;
 const h=`<div class="row"><span class="small">Frequency</span><button data-f="D" class="${GF==='D'?'on':''}">Delivery${nD&&GF!=='D'?' <i class="rq">'+nD+'</i>':''}</button><button data-f="G" class="${GF==='G'?'on':''}">Ground${nG&&GF!=='G'?' <i class="rq">'+nG+'</i>':''}</button></div>`;
 if(f.dataset.h!==h){f.dataset.h=h;f.innerHTML=h}}
(()=>{const s=document.createElement('style');s.textContent=`.strips{display:block!important}.bays{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;align-items:start}.bay{background:rgba(255,255,255,.03);border:1px dashed var(--line);border-radius:12px;padding:6px;min-height:52px}.bay.over{border-color:var(--acc);background:rgba(76,201,240,.08)}.bh{display:flex;gap:6px;align-items:center;font:600 10px system-ui;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);margin:0 2px 5px}.bh i{font-style:normal;background:rgba(255,255,255,.08);border-radius:8px;padding:0 6px}.bh .bx{margin-left:auto;cursor:pointer;padding:0 4px}.strip2{display:flex;align-items:stretch;gap:6px;background:rgba(255,255,255,.05);border:1px solid var(--line);border-left:4px solid #35507a;border-radius:8px;margin-bottom:5px;cursor:pointer}.strip2.mine{border-left-color:var(--ok)}.strip2.sel{border-color:var(--sel);background:rgba(255,209,102,.12)}.strip2.conf{border-color:var(--warn);color:var(--warn)}.grip{display:flex;align-items:center;padding:0 6px;color:var(--dim);touch-action:none;cursor:grab;user-select:none;font-size:15px}.sb{padding:4px 6px 4px 0;min-width:0}.s1{font-size:13px}.s2{font-size:11px;color:var(--dim)}.pq{color:#e879f9;font-style:normal}.addbay{align-self:start;background:rgba(255,255,255,.04)!important;border:1px dashed var(--line)!important;border-radius:12px!important;padding:6px 10px!important;font-size:12px;color:var(--dim)}.strip2.ghost{position:fixed;z-index:99;pointer-events:none;opacity:.92;box-shadow:0 8px 24px rgba(0,0,0,.5);margin:0}#freq .row{gap:8px}`;document.head.appendChild(s)})();

// ---- start-time selector (24-hour traffic bar chart)
const TSQ=[['Random',-1],['Now',-2],['Morning peak',7],['Midday',12],['Evening peak',18],['Night',2]];
function tsLabel(k,h){const a=PROF[k+'_a'],d=PROF[k+'_d'],v=a[h]+d[h],mx=Math.max(...a.map((x,i)=>x+d[i]));
 if(v<.15)return 'Night curfew – almost no traffic';if(v<.6)return h<12?'Early hours – first movements':'Late evening – traffic winding down';
 if(v>=mx*.92)return 'Peak hour – heaviest traffic';if(v>=mx*.75)return 'Busy';return 'Moderate traffic'}
function nowLocal(k){const d=new Date();return (d.getUTCHours()+LOFF[k]+24)%24}
function drawTsel(){if(!$('tsC'))return;const k=selAp,a=PROF[k+'_a'],d=PROF[k+'_d'],tot=a.map((x,i)=>x+d[i]),mx=Math.max(...tot),v=+$('stt').value,cur=v===-2?nowLocal(k):v;
 $('tsC').innerHTML=tot.map((t,h)=>`<button data-h="${h}" class="${h===cur?'on':''} ${h<6||h>=22?'n':''}" role="option" aria-selected="${h===cur}" title="${String(h).padStart(2,'0')}:00 · ${tsLabel(k,h)}" aria-label="${String(h).padStart(2,'0')}:00"><i style="height:${Math.max(6,Math.round(t/mx*100))}%"></i></button>`).join('');
 $('tsQ').innerHTML=TSQ.map(([n,h])=>`<button data-q="${h}" class="${h===v?'on':''}">${n}${h>=0?' <span style="color:var(--dim)">'+String(h).padStart(2,'0')+':00</span>':''}</button>`).join('');
 if(v===-1){$('tsT').textContent='Random';$('tsI').textContent='🎲';$('tsL').textContent='A random hour of the day at '+AP[k].n}
 else{$('tsT').textContent=String(cur).padStart(2,'0')+':00';$('tsI').textContent=cur>=7&&cur<19?'☀️':cur>=5&&cur<21?'🌅':'🌙';$('tsL').textContent=(v===-2?'Current local time · ':'')+tsLabel(k,cur)}}
function setT(h){$('stt').value=h;drawTsel()}
(()=>{const C=$('tsC');if(!C)return;let drag=false;const at=e=>{const r=C.getBoundingClientRect(),x=Math.min(r.width-1,Math.max(0,e.clientX-r.left));return Math.floor(x/r.width*24)};
 C.addEventListener('pointerdown',e=>{drag=true;C.setPointerCapture(e.pointerId);setT(at(e))});C.addEventListener('pointermove',e=>{if(drag){const h=at(e);if(h!==+$('stt').value)setT(h)}});
 C.addEventListener('pointerup',()=>drag=false);C.addEventListener('pointercancel',()=>drag=false);
 C.addEventListener('keydown',e=>{let v=+$('stt').value;if(v<0)v=12;if(e.key==='ArrowRight')setT((v+1)%24);else if(e.key==='ArrowLeft')setT((v+23)%24);else return;e.preventDefault()});
 $('tsQ').addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b)setT(+b.dataset.q)});
 const _bm=buildMenu;buildMenu=function(){_bm();drawTsel()};})();
