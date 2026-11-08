// ===================== v14: settings, save/load, scenarios, daily challenge, tutorial, sequence lists =====================
const SET=Object.assign({vol:1,rate:1,night:'auto',diff:'normal'},(()=>{try{return JSON.parse(localStorage.getItem('atc_set')||'{}')}catch(e){return{}}})());
const saveSet=()=>{try{localStorage.setItem('atc_set',JSON.stringify(SET))}catch(e){}};
NIGHTM=SET.night;
const SCN={k:'std'},DIFF={easy:[.6,.04],normal:[1,.09],busy:[1.4,.12],expert:[1.8,.17]},SCNS={std:'Standard day',storm:'Thunderstorms',lvp:'Low visibility (LVP)',xwind:'Strong crosswind',rush:'Rush hour',snow:'Snow & de-icing',emg:'Emergency day'};
let DAILY=null,TUT=null;const RND0=Math.random;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// ---- scenarios + difficulty applied around init()
{const _nt=newTarget;newTarget=function(){_nt();const k=SCN.k;if(!WT||NET.client)return;
  if(k==='storm'){WT.ci=Math.max(WT.ci,4);WT.ws=Math.max(WT.ws,12);WT.vis=Math.min(WT.vis,6)}
  else if(k==='lvp'){WT.vis=.3+Math.random()*.4;WT.ci=6}
  else if(k==='xwind'){const R=RW[FLW&&FLW[1]&&FLW[1][0]];if(R){WT.wd=nrm(R.h+(Math.random()<.5?1:-1)*(55+Math.random()*15));WT.ws=20+Math.random()*7}}
  else if(k==='snow'){WT.t=-4+Math.random()*3;WT.vis=Math.min(WT.vis,2.5);WT.ci=Math.max(WT.ci,5)}}}
{const _init=init;init=function(){const df=TUT?DIFF.easy:(DIFF[SET.diff]||DIFF.normal);SC.arr=df[0]*(SCN.k==='rush'?1.6:1);RBP=df[1];_init();if(NET.client)return;applyScn()}}
function applyScn(){const k=SCN.k;if(k==='std'||!WX)return;const R=RW[FLW[1][0]];
 if(k==='storm'){WX.ci=5;WX.cld=CLD[5];WX.ws=Math.max(WX.ws,14);WX.vis=Math.min(WX.vis,5);for(let i=0;i<2;i++){const b=Math.random()*360,d=14+Math.random()*22;CELLS.push({x:SIN(b)*d,y:COS(b)*d,r:3+Math.random()*3,life:2400,hit:new Set()})}CELT=300}
 else if(k==='lvp'){WX.vis=.45;WX.ci=6;WX.cld=CLD[6]}
 else if(k==='xwind'&&R){WX.wd=nrm(R.h+58);WX.ws=23}
 else if(k==='snow'){WX.t=-4;WX.vis=1.8;WX.ci=5;WX.cld=CLD[5]}
 else if(k==='emg')EMT=150+Math.random()*120;
 ATIS.s={wd:WX.wd,ws:WX.ws,q:WX.q,vis:WX.vis,cld:WX.cld,t:WX.t};if(WX.vis<1.5)ATIS.s.vis=WX.vis;newTarget();
 setTimeout(()=>say('Scenario: '+SCNS[k]+(DAILY?' · daily challenge':''),'sys'),600)}
{const _step=step;step=function(dt){if(SCN.k==='emg'&&EMT>900)EMT=900;_step(dt)}}
// ---- save / load (single player)
function saveGame(){try{if(NET.on||!ac.length||!$('game')||$('game').hidden)return false;const o={v:1,ap,MODE,CMB,flow,T,score,land,dpt,viol,WX,ATIS,uid,startH,scn:SCN.k,CELLS:CELLS.map(c=>({x:c.x,y:c.y,r:c.r,life:c.life})),closed:gates.filter(g=>g.closed).map(g=>g.n),
  ac:ac.map(a=>{const q=ser(a);if(a.path){q.path=a.path.map(p=>[Math.round(p[0]*1e4)/1e4,Math.round(p[1]*1e4)/1e4,p[2]||0]);q.pi=a.pi}return q}),saved:Date.now()};localStorage.setItem('atc_save',JSON.stringify(o));return true}catch(e){return false}}
function loadGame(){let o=null;try{o=JSON.parse(localStorage.getItem('atc_save'))}catch(e){}if(!o||!AP[o.ap])return false;
 selAp=o.ap;ap=o.ap;MODE=o.MODE;CMB=!!o.CMB;selMd=CMB?'X':MODE;SCN.k=o.scn||'std';FORCEFLOW=o.flow;startH=12;$('menu').hidden=true;$('game').hidden=false;init();FORCEFLOW=null;
 T=o.T;score=o.score;land=o.land;dpt=o.dpt;viol=o.viol;WX=o.WX;ATIS=o.ATIS;uid=o.uid;CELLS=(o.CELLS||[]).map(c=>Object.assign({hit:new Set()},c));
 for(const g of gates){g.use=0;g.closed=(o.closed||[]).includes(g.n)}
 ac=o.ac.map(x=>deser(x,null));for(const a of ac)if(a.gate&&gates.includes(a.gate)&&['parked','gate','park','push','taxiin'].includes(a.ph))a.gate.use=a.id;
 const b=$('brief');if(b)b.remove();paused=false;sel=null;if(!started){started=true;requestAnimationFrame(loop)}say('Saved game loaded.','sys');return true}
setInterval(()=>{if(!NET.on&&!document.hidden&&$('game')&&!$('game').hidden&&!paused)saveGame()},45000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!NET.on)saveGame()});
// ---- menu block: scenario, difficulty, daily, tutorial, continue, settings
const xtra=document.createElement('div');xtra.id='xtra';xtra.innerHTML=`<h3>4 · Challenge</h3><div class="xrow"><label>Scenario<select id="scnS">${Object.keys(SCNS).map(k=>`<option value="${k}">${SCNS[k]}</option>`).join('')}</select></label>
 <label>Difficulty<select id="difS"><option value="easy">Relaxed</option><option value="normal">Normal</option><option value="busy">Busy</option><option value="expert">Expert</option></select></label></div>
 <div class="xrow"><button class="xb" id="dailyB"></button><button class="xb" id="tutB">Guided tutorial</button><button class="xb" id="contB" hidden></button><button class="xb" id="setMB">⚙ Settings</button></div><div id="dailyH" class="small"></div>`;
{const l=$('liveWx')?$('liveWx').parentNode:$('start');l.before(xtra);$('scnS').value=SCN.k;$('difS').value=SET.diff;
 $('scnS').onchange=e=>{SCN.k=e.target.value};$('difS').onchange=e=>{SET.diff=e.target.value;saveSet()};
 $('setMB').onclick=()=>openSet();$('contB').onclick=()=>{if(!loadGame())say('No saved game found.','sys')};$('dailyB').onclick=()=>startDaily();$('tutB').onclick=()=>startTut()}
function dailyCfg(){const d=new Date(),s=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(),r=mulberry(s);return{s,ap:['MUC','FRA','LHR'][r()*3|0],md:['G','T','C'][r()*3|0],sc:Object.keys(SCNS).slice(1)[r()*6|0],h:Math.floor(r()*24)}}
function menuX(){const c=dailyCfg();let best=null;try{best=JSON.parse(localStorage.getItem('atc_daily_'+c.s)||'null')}catch(e){}
 $('dailyB').textContent='Daily challenge · '+AP[c.ap].icao+' '+MODES[c.md][0]+' · '+SCNS[c.sc]+' · '+String(c.h).padStart(2,'0')+':00';
 let h='';try{const L=JSON.parse(localStorage.getItem('atc_daily_hist')||'[]').slice(-5).reverse();if(L.length)h='Recent dailies: '+L.map(x=>x.d.slice(5)+' '+x.ap+' '+x.score).join(' · ')}catch(e){}
 $('dailyH').textContent=(best?'Today’s best: '+best.s+' ('+best.g+'). ':'')+h;
 let sv=null;try{sv=JSON.parse(localStorage.getItem('atc_save')||'null')}catch(e){}const cb=$('contB');cb.hidden=!sv;if(sv)cb.textContent='Continue saved game · '+AP[sv.ap].icao+' '+MODES[sv.CMB?'T':sv.MODE][0]+' · '+new Date(sv.saved).toLocaleString([], {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
{const _bm=buildMenu;buildMenu=function(){_bm();try{menuX()}catch(e){}}}
function startDaily(){const c=dailyCfg();selAp=c.ap;selMd=c.md;SCN.k=c.sc;SET.diff='normal';$('difS').value='normal';$('scnS').value=c.sc;$('stt').value=c.h;DAILY=c;Math.random=mulberry(c.s);$('start').click()}
{const _b=$('back').onclick;$('back').onclick=()=>{Math.random=RND0;DAILY=null;TUT=null;const t=$('tut');if(t)t.remove();_b()}}
$('endB').addEventListener('click',()=>{if(!DAILY)return;try{const r=gradeOf(),k='atc_daily_'+DAILY.s;let b=null;try{b=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}if(!b||score>b.s)localStorage.setItem(k,JSON.stringify({s:score,g:r.g}));
 const L=JSON.parse(localStorage.getItem('atc_daily_hist')||'[]');L.push({d:new Date().toISOString().slice(0,10),ap:ap,score});localStorage.setItem('atc_daily_hist',JSON.stringify(L.slice(-30)))}catch(e){}});
// ---- settings dialog
const SM=document.createElement('div');SM.id='setm';SM.hidden=true;SM.innerHTML=`<div class="smc"><h2>Settings</h2>
 <div class="sg"><b>Voice</b><label><input type="checkbox" id="sVo"> Spoken radio calls</label><label>Volume <input type="range" id="sVol" min="0.2" max="1" step="0.1"></label><label>Speed <input type="range" id="sRate" min="0.7" max="1.4" step="0.05"></label><button id="sTest">Test voice</button></div>
 <div class="sg"><b>Display</b><label>Day / night <select id="sNight"><option value="auto">Automatic</option><option value="day">Always day</option><option value="night">Always night</option></select></label></div>
 <div class="sg"><b>Game</b><label>Difficulty <select id="sDiff"><option value="easy">Relaxed</option><option value="normal">Normal</option><option value="busy">Busy</option><option value="expert">Expert</option></select></label><small>Applies to the next shift.</small></div>
 <div class="sg"><b>Saved game</b><div class="xrow"><button id="sSave">Save now</button><button id="sLoad">Load</button><button id="sDel">Delete save</button></div><small>The game also saves automatically every minute while you play (single player).</small></div>
 <div class="xrow"><button id="sClose" class="go2">Close</button></div></div>`;document.body.appendChild(SM);
function openSet(){SM.hidden=false;$('sVo').checked=voice;$('sVol').value=SET.vol;$('sRate').value=SET.rate;$('sNight').value=SET.night;$('sDiff').value=SET.diff}
$('sVo').onchange=e=>{voice=e.target.checked;$('vo').textContent=voice?'🔊':'🔇';if(!voice&&window.speechSynthesis)speechSynthesis.cancel()};
$('sVol').oninput=e=>{SET.vol=+e.target.value;saveSet()};$('sRate').oninput=e=>{SET.rate=+e.target.value;saveSet()};
$('sNight').onchange=e=>{SET.night=e.target.value;NIGHTM=SET.night;saveSet()};$('sDiff').onchange=e=>{SET.diff=e.target.value;saveSet();$('difS').value=SET.diff};
$('sTest').onclick=()=>{const w=voice;voice=true;speak('Lufthansa 4 5 2, runway 2 6 right, wind 2 7 0 degrees 1 2 knots, cleared for takeoff','atc');voice=w};
$('sSave').onclick=()=>{$('sSave').textContent=saveGame()?'Saved ✓':'Nothing to save';setTimeout(()=>$('sSave').textContent='Save now',1500)};$('sLoad').onclick=()=>{SM.hidden=true;loadGame()};
$('sDel').onclick=()=>{try{localStorage.removeItem('atc_save')}catch(e){}menuX()};$('sClose').onclick=()=>{SM.hidden=true};
{const b=document.createElement('button');b.id='setB';b.textContent='⚙';b.title='Settings';b.onclick=openSet;$('endB').before(b)}
// ---- guided tutorial
const TUTS={
 G:[['A departure is calling Delivery – it shows a CLNC badge. Tap its strip in the list.',t=>sel&&sel.ph==='gate'&&sel.dl&&(TUT.t=sel)],
  ['Choose “Clearances → Cleared to …” and send it. Read the pilot’s read-back carefully.',t=>TUT.t.cl],
  ['Now hand it over: “Contact Ground …”.',t=>!TUT.t.dl],
  ['Wait 1–2 minutes (use the 4× button) until it asks for pushback.',t=>TUT.t.req==='push'||TUT.t.ph!=='gate'],
  ['Approve “Pushback” – pick a direction (face …).',t=>TUT.t.ph!=='gate'],
  ['When the push is done, give a taxi clearance: “Taxi clearance → Quick: holding point …”.',t=>['taxi','hold','lineup','roll','air'].includes(TUT.t.ph)||TUT.t.ctrl==='T'],
  ['It taxis now. Keep an eye out for runway crossings. At the holding point hand it to Tower.',t=>TUT.t.ctrl==='T'||['lineup','roll','air'].includes(TUT.t.ph)]],
 T:[['Speed up (4×) until a departure reports ready (DEP badge). Then tap its strip.',t=>sel&&['hold','lineup','ready'].includes(sel.ph)&&(TUT.t=sel)],
  ['Check the runway is free, then “Line up and wait”.',t=>['lineup','ready','roll','air'].includes(TUT.t.ph)],
  ['“Cleared for takeoff” – watch the wake-turbulence timer.',t=>['roll','air'].includes(TUT.t.ph)],
  ['Now an arrival: when LAND appears, tap it and give “Cleared to land” (only if the runway is free).',t=>ac.some(a=>!a.dep&&a.clr)],
  ['Good! Hand arrivals to Ground after they vacate. Keep going or end the shift.',t=>false]],
 C:[['Tap an arrival with the ID badge. Give “Radar contact”.',t=>sel&&sel.ph==='air'&&!sel.dep&&sel.rc&&(TUT.t=sel)],
  ['Descend it to 5000 ft (Altitude).',t=>TUT.t.ta<=5000],
  ['Vector it towards the airport: use a heading or “Direct …”.',t=>!!TUT.t.dct||Math.abs(dif(TUT.t.th,TUT.t.hdg))<90&&TUT.t.ta<=5000&&TUT.t.s<=230||TUT.t.ils||TUT.t.cleared],
  ['Slow to 190 kt and clear it for the ILS once it is near the extended centreline.',t=>TUT.t.cleared||TUT.t.ils],
  ['When it is established, “Contact Tower”.',t=>TUT.t.ctrl==='T'],
  ['Well done! Try “Hold at …” for the next one, or end the shift.',t=>false]]};
function startTut(){const md=selMd==='X'?'T':selMd;TUT={md,i:0,t:null};SCN.k='std';$('stt').value=12;$('start').click();
 setTimeout(()=>{const b=$('brief');if(b){const bt=b.querySelector('button');bt&&bt.click()}if(md==='G'||md==='T'){const d=ac.filter(a=>a.dep&&a.ph==='parked').sort((p,q)=>p.sched-q.sched)[0];if(d)d.sched=T-230}},700);
 let el=$('tut');if(!el){el=document.createElement('div');el.id='tut';el.className='panel';$('ctl').before(el)}}
setInterval(()=>{const el=$('tut');if(!TUT||!el||$('game').hidden){if(el&&!TUT)el.remove();return}const L=TUTS[TUT.md],s=L[TUT.i];
 try{if(s&&TUT.i<L.length-1&&(TUT.i===0||TUT.t)&&s[1](TUT))TUT.i++}catch(e){}
 const n=TUT.i,tot=L.length,done=n>=tot-1&&TUT.i===tot-1;el.innerHTML=`<div class="small"><b style="color:var(--ok)">Tutorial ${Math.min(n+1,tot)}/${tot}</b> <button id="tutX" style="float:right;padding:3px 9px">Skip tutorial</button></div><div style="margin-top:4px;font-size:14px">${L[Math.min(n,tot-1)][0]}</div><div class="tbar"><i style="width:${Math.round(100*Math.min(n,tot-1)/(tot-1))}%"></i></div>`;
 const x=$('tutX');if(x)x.onclick=()=>{TUT=null;el.remove()}},500);
// ---- sequence lists (arrivals by ETA with wake gaps, departures by readiness)
(()=>{const host=$('strips').closest('.panel');if(!host)return;const p=document.createElement('div');p.className='panel';p.id='seq';p.hidden=true;host.after(p);
 const eta=a=>{const R=RW[a.rw];if(!R)return 1e9;const d=Math.hypot(a.x-R.T0.x,a.y-R.T0.y);return{d,t:d/Math.max(a.s||150,140)*3600}};
 const mm=s=>Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0');
 setInterval(()=>{if($('game').hidden||(MODE==='G'&&!CMB)){p.hidden=true;return}const arr=ac.filter(a=>a.ph==='air'&&!a.dep&&!a.ovf&&a.rw&&RW[a.rw]).map(a=>({a,e:eta(a)})).sort((x,y)=>x.e.t-y.e.t).slice(0,8);
  const dep=ac.filter(a=>a.dep&&['taxi','hold','lineup','ready'].includes(a.ph)&&a.rw).sort((x,y)=>['lineup','ready','hold','taxi'].indexOf(x.ph)-['lineup','ready','hold','taxi'].indexOf(y.ph)).slice(0,6);
  let h='<div class="small"><b>Sequence</b> · arrivals by ETA</div>';
  if(!arr.length)h+='<div class="small dim">No arrivals inbound.</div>';
  const last={};arr.forEach(({a,e},i)=>{const ph=RW[a.rw].ph,L=last[ph];let gap='',cls='';if(L){const gN=e.d-L.d,need=((WKA[WKC(L.a.type)]||{})[WKC(a.type)])||3;gap=gN.toFixed(1)+' NM';if(gN<need)cls='bad';gap+=' / '+need+' req'}last[ph]={a,d:e.d};
   h+=`<div class="sq ${cls}" data-id="${a.id}"><b>${a.cs}</b><span>${a.rw}</span><span>${WKC(a.type)}</span><span>${mm(e.t)}</span><span class="g">${gap||'lead'}</span></div>`});
  if(dep.length){h+='<div class="small" style="margin-top:6px"><b>Departures</b> · by readiness</div>';for(const a of dep){const w=typeof wakeWait==='function'?wakeWait(a):0;h+=`<div class="sq" data-id="${a.id}"><b>${a.cs}</b><span>${a.rw}</span><span>${WKC(a.type)}</span><span>${a.ph}</span><span class="g">${w>0?'wake '+Math.ceil(w)+' s':'ok'}</span></div>`}}
  p.hidden=false;if(p.dataset.h!==h){p.dataset.h=h;p.innerHTML=h}},1000);
 p.onclick=e=>{const r=e.target.closest('.sq');if(!r)return;sel=ac.find(a=>a.id==+r.dataset.id)||null;psig='';ui()}})();
const xst=document.createElement('style');xst.textContent=`#xtra{margin:14px 0 6px}.xrow{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin:8px 0}.xrow label{display:grid;gap:4px;font-size:13px;color:var(--dim)}
#xtra select,#setm select{background:rgba(0,0,0,.25);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:9px;font:inherit;min-width:150px}
.xb,#setm button{border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--fg);border-radius:12px;padding:10px 14px;cursor:pointer;font:inherit}.xb:hover,#setm button:hover{border-color:var(--acc)}
#setm{position:fixed;inset:0;z-index:70;background:rgba(3,7,14,.7);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:5vh 16px}#setm[hidden]{display:none}
.smc{width:100%;max-width:520px;border:1px solid var(--line);border-radius:18px;background:#0c1626;padding:18px;display:grid;gap:14px}.smc h2{margin:0;font:700 24px var(--disp)}.sg{display:grid;gap:8px}.sg label{display:flex;gap:10px;align-items:center;font-size:14px}.sg small{color:var(--dim)}.sg input[type=range]{flex:1}
#tut{border-color:var(--ok)}.tbar{height:4px;border-radius:4px;background:rgba(255,255,255,.1);margin-top:8px;overflow:hidden}.tbar i{display:block;height:100%;background:var(--ok);transition:width .4s}
#seq .sq{display:grid;grid-template-columns:1.3fr .7fr .4fr .7fr 1.4fr;gap:6px;font-size:12px;padding:4px 6px;border-radius:8px;cursor:pointer;align-items:center}#seq .sq:hover{background:rgba(255,255,255,.05)}#seq .sq.bad{background:rgba(255,93,115,.14)}#seq .g{color:var(--dim);text-align:right}#seq .bad .g{color:var(--warn)}
#setB{margin-right:2px}`;document.head.appendChild(xst);
try{menuX()}catch(e){}
