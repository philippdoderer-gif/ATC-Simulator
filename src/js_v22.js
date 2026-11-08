/* v22: departures / arrivals board at the bottom of the main menu */
(function(){
const IATA={DLH:'LH',BAW:'BA',VIR:'VS',AAL:'AA',UAL:'UA',DAL:'DL',ACA:'AC',UAE:'EK',QTR:'QR',ETD:'EY',SIA:'SQ',CPA:'CX',THY:'TK',AFR:'AF',KLM:'KL',SWR:'LX',AUA:'OS',EWG:'EW',IBE:'IB',TAP:'TP',SAS:'SK',FIN:'AY',LOT:'LO',EZY:'U2',RYR:'FR'};
const css=`
#board{margin-top:56px}
.bd{border-radius:22px;border:1px solid rgba(255,178,62,.22);background:linear-gradient(180deg,#0d1020,#06080f);padding:18px 18px 12px;box-shadow:0 30px 70px -30px rgba(0,0,0,.9),inset 0 0 0 1px rgba(255,255,255,.03)}
.bd-h{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.bd-t{display:flex;gap:6px;background:rgba(255,255,255,.05);border-radius:99px;padding:4px}
.bd-t button{border:0;background:none;color:var(--m-dim,#9aa3bd);font:600 15px var(--disp);padding:8px 18px;border-radius:99px;cursor:pointer}
.bd-t button{background:none!important}#menu .bd-t button.on{background:linear-gradient(135deg,#ffb23e,#ff8a3d)!important;color:#1b1203!important;border:0!important}
.bd-clock{font:600 22px var(--mono);color:#ffb23e;display:flex;align-items:baseline;gap:10px}.bd-clock small{font:500 12px var(--mono);color:#7f89a6}
.bd-g{display:grid;grid-template-columns:70px 100px minmax(0,1fr) 62px 150px;gap:0 10px;align-items:center;font-family:var(--mono)}
.bd-g.hd{color:#7f89a6;font:500 12px var(--mono);padding:6px 8px;border-bottom:1px solid rgba(255,255,255,.08)}
.bd-r{padding:7px 8px;border-bottom:1px solid rgba(255,255,255,.05)}
.bd-r:nth-child(odd){background:rgba(255,255,255,.018)}
.fl{display:inline-flex;gap:2px;vertical-align:middle}
.fl{font-size:16px}.fc{flex:none;position:relative;display:inline-block;width:.78em;height:1.5em;line-height:1.5em;text-align:center;background:linear-gradient(180deg,#171b2c 0 49%,#0b0d18 51% 100%);border-radius:3px;color:#ffd27a;font:600 1em/1.5em var(--mono);overflow:hidden}
.fc::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(0,0,0,.7)}
.fc.f{animation:flip .28s ease-out}
@keyframes flip{0%{transform:rotateX(90deg)}100%{transform:none}}
.fl.w .fc{color:#f3efe7}.fl.dim .fc{color:#9aa3bd}
.st-ok .fc{color:#4fe0b6}.st-late .fc{color:#ff7a6b}.st-go .fc{color:#ffb23e}.st-na .fc{color:#9aa3bd}
.bd-note{margin:10px 4px 4px;color:#7f89a6;font-size:12px}
@media(max-width:700px){.bd-g{grid-template-columns:auto auto minmax(0,1fr) auto}.bd-g>:nth-child(4){display:none}.fl{font-size:9.5px;gap:1px}.fl .fc{width:.8em}.bd-g{gap:0 6px}.bd{padding:12px 6px}.bd-r{padding:6px 4px}.bd-g>:nth-child(3){overflow:hidden}}
@media(prefers-reduced-motion:reduce){.fc.f{animation:none}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const sec=document.createElement('section');sec.className='ss';sec.id='board';
sec.innerHTML='<h2>Live board</h2><div class="bd"><div class="bd-h"><div class="bd-t" role="tablist"><button class="on" data-m="D" role="tab">Departures</button><button data-m="A" role="tab">Arrivals</button></div><div class="bd-clock"><span id="bdT">--:--</span><small id="bdN"></small></div></div><div id="bdH"></div><div id="bdB"></div><div class="bd-note">Schedule for the airport you picked above, at its local time. These are the flights you will work in the game: the same callsigns, airlines and destinations appear on frequency. Not live data.</div></div>';
const pos=document.getElementById('positions');pos.parentNode.insertBefore(sec,pos);sec.style.marginTop='48px';const nl=document.querySelector('.slinks');if(nl)nl.insertBefore(Object.assign(document.createElement('a'),{href:'#board',textContent:'Board'}),nl.children[0]);document.addEventListener('click',e=>{if(e.target.closest('#tsel'))setTimeout(render,80)},true);
let mode='D',cache={},prev={};
function rng(s){return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function seedOf(str){let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h}
function lt(k){const d=new Date(),m=d.getUTCHours()*60+d.getUTCMinutes()+LOFF[k]*60;return((m%1440)+1440)%1440}
function gen(k,m){
 const key=k+m+new Date().toISOString().slice(0,10);if(cache[key])return cache[key];
 const R=AP[k].R.split(',').map(x=>x.split(':')),rn=rng(seedOf(key)),out=[];
 const dayBank=h=>h<5?.15:h<6?.4:h<9?1.3:h<12?1:h<16?.9:h<20?1.25:h<22?.7:.25;
 const noNight=k==='FRA';
 for(let t=0;t<1440;){const h=t/60|0;const rate=(noNight&&(h>=23||h<5))?0:dayBank(h);const gap=rate?Math.max(3,Math.round(9/rate+rn()*4)):60;t+=gap;if(t>=1440||!rate)continue;
  const r=R[rn()*R.length|0],al=r[1],dest=r[0],ia=IATA[al]||al.slice(0,2);
  const n=ia+' '+(m==='D'?100+(rn()*880|0):100+(rn()*880|0));
  const late=rn()<.13?5+(rn()*40|0):0;
  const g=m==='D'?'ABCDEFGH'[rn()*8|0]+(1+(rn()*60|0)):'';
  out.push({t,n,dir:m,alk:al,dc:dest,num:+n.split(' ')[1],al:AIRL[al].r,dest:DEST[dest]?DEST[dest].c:dest,late,g,belt:1+(rn()*9|0)});}
 cache[key]=out;return out}
function status(f,now,m){const t=f.t+f.late,d=t-now;
 if(m==='D'){if(d<-1)return['Departed','st-na'];if(d<=8)return['Last call','st-go'];if(d<=35)return['Boarding','st-go'];if(f.late)return['Late '+String(t/60|0).padStart(2,'0')+':'+String(t%60).padStart(2,'0'),'st-late'];return['On time','st-ok']}
 if(d<=-6)return['Belt '+f.belt,'st-ok'];if(d<=0)return['Landed','st-ok'];if(f.late)return['Late '+String(t/60|0).padStart(2,'0')+':'+String(t%60).padStart(2,'0'),'st-late'];if(d<=25)return['Approach','st-go'];return['Expected','st-na']}
function cells(txt,len,cls,key){const s=(txt+' '.repeat(len)).slice(0,len).toUpperCase(),p=prev[key]||'';prev[key]=s;
 return '<span class="fl '+(cls||'')+'">'+[...s].map((c,i)=>`<span class="fc${p[i]!==c&&p?' f':''}">${c===' '?'&nbsp;':c.replace('&','&amp;')}</span>`).join('')+'</span>'}
const hm=t=>String(t/60|0).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
function render(){
 const k=selAp,sh=+($('stt')||{value:-1}).value,now=sh>=0?sh*60+(new Date().getUTCMinutes()):lt(k),dest=mode==='D';
 $('bdT').textContent=hm(now);$('bdN').textContent=AP[k].icao+(sh>=0?' · your shift start':' local');
 $('bdH').innerHTML=`<div class="bd-g hd"><span>Time</span><span>Flight</span><span>${dest?'Destination':'From'}</span><span>${dest?'Gate':''}</span><span>Remarks</span></div>`;
 const list=gen(k,mode).filter(f=>f.t+f.late>=now-(dest?15:20)).slice(0,10);
 $('bdB').innerHTML=list.map((f,i)=>{const[s,c]=status(f,now,mode),key=mode+i;
  return `<div class="bd-g bd-r">${cells(hm(f.t),5,'w',key+'t')}${cells(f.n,6,'dim',key+'n')}${cells(f.dest,13,'',key+'d')}${dest?cells(f.g,3,'w',key+'g'):'<span></span>'}${cells(s,12,c,key+'s')}</div>`}).join('')||'<div class="bd-note">No more flights today.</div>';
}
window.__gen=gen;window.__bd={gen,cells,status,hm,lt};window.schedPick=function(dep){try{if(typeof T==='undefined')return null;const now=(T/60)%1440,used=new Set(ac.map(x=>x.cs));
 const l=gen(selAp,dep?'D':'A').filter(f=>f.t>=now-30&&f.t<=now+(dep?600:240)&&!used.has(f.alk+f.num));
 if(!l.length)return null;const f=l[Math.random()*l.length|0];return{dest:f.dc,alk:f.alk,num:f.num}}catch(e){window.__e=e.message;return null}};
sec.querySelector('.bd-t').onclick=e=>{const b=e.target.closest('button');if(!b)return;mode=b.dataset.m;prev={};sec.querySelectorAll('.bd-t button').forEach(x=>x.classList.toggle('on',x===b));render()};
const ob=buildMenu;buildMenu=function(){ob.apply(this,arguments);if(window.__bdAp!==selAp){window.__bdAp=selAp;prev={}}render()};
let sig='';setInterval(()=>{const s=selAp+'|'+($('stt')||{}).value;if(s!==sig){sig=s;if(!$('menu').hidden){prev={};render()}}},300);render();setInterval(()=>{if(!$('menu').hidden)render()},20000);
})();
