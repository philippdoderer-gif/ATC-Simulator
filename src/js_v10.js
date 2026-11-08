
// ===================== v10 additions =====================
let NIGHTM='auto';const isNight=()=>NIGHTM==='day'?false:NIGHTM==='night'?true:isNight0();const isNight0=()=>{const h=lt((T/3600)%24),m=new Date().getMonth(),sr=[8,7.3,6.5,6.5,5.7,5.2,5.4,6,6.8,7.5,7.3,8][m],ss=[16.6,17.4,18.2,20,20.8,21.3,21.2,20.5,19.4,18.3,16.7,16.3][m];return h<sr||h>=ss};
const WKC=t=>t==='A388'?'J':['A306','B763','B77F','MD11','A333','A359','A35K','B77W','B772','B789','B788','B748','A346'].includes(t)?'H':'M';
const WKD={J:{H:120,M:180},H:{M:120}},WKA={J:{J:0,H:6,M:7},H:{H:4,M:5}};
const DELF={EDDF:'122.035',EDDM:'121.730',EGLL:'121.980'},DEIF={EDDF:'121.985',EDDM:'121.855',EGLL:'121.855'};
REQL.deice='DE-ICE';
let SH={t0:0,miss:0,wk:0,emg:0,emgOk:0},WK={},WKP=new Set(),EMT=1800,CELLS=[],CELT=600,COACH=false,LHRSW=null;
try{COACH=localStorage.getItem('atc_coach')==='1'}catch(e){}
// --- position card: Tower + Ground combined
MODES.X=['Tower + Ground','Combined position (as at night): runways and taxiways – push, taxi, line up, take off, land.'];
const _ico=icoSvg;icoSvg=function(m){if(m!=='X')return _ico(m);return `<svg class="art" viewBox="0 0 120 60" preserveAspectRatio="xMidYMid meet" style="background:linear-gradient(160deg,#0f2342,#0a1424)"><g transform="translate(10,-2) scale(1,.9)"><rect x="8" y="62" width="44" height="3" fill="#8296b4"/><rect x="25" y="34" width="10" height="28" fill="#6c7fa3"/><path d="M18 20 H42 L45 34 H15 Z" fill="#4cc9f0" opacity=".85"/><path d="M58 66 H78 V48 H96" stroke="#ffb454" stroke-width="3" fill="none"/><circle cx="96" cy="48" r="4" fill="#ffd166"/></g></svg>`};
$('start').onclick=()=>{startH=+$('stt').value;if(startH===-2)startH=nowLocal(selAp);ap=selAp;CMB=selMd==='X';MODE=CMB?'T':selMd;$('menu').hidden=true;$('game').hidden=false;init();if(!started){started=true;requestAnimationFrame(loop)}};
// --- init hook
const _init=init;init=function(){SH={t0:0,miss:0,wk:0,emg:0,emgOk:0};WK={};WKP=new Set();CELLS=[];EMT=1200+Math.random()*1800;CELT=300+Math.random()*900;LHRSW=null;
 _init();SH.t0=T;ac.forEach(q=>q.rt=-150);
 if(CMB){$('ttl').innerHTML=ap+' '+A.icao+' <small>Tower + Ground · RWY '+FLW[1].join('/')+' in use</small>';$('help').textContent=MODES.X[1]}
 if(lhrAlt(true)){$('brief')&&$('brief').remove();briefing()}coachBox()};
// --- LHR runway alternation (westerly ops): 06:00–15:00 arrivals 27R / departures 27L, then swap
function lhrAlt(silent){if(ap!=='LHR'||flow!=='W')return;const h=lt((T/3600)%24),sw=h>=15||h<6;if(LHRSW===sw)return;const first=LHRSW===null;LHRSW=sw;
 const arr=sw?'27L':'27R',dep=sw?'27R':'27L';if(FLW[1][0]===arr)return false;FLW=[RW[arr].h,[arr],[dep]];for(const a of ac){if(a.dep&&PH(a,'parked','gate'))a.rw=dep;if(!a.dep&&a.ph==='air'&&!a.ils&&!a.cleared)a.rw=arr}const R=RW[arr];WP['IF'+arr]=[R.T0.x-R.dir[0]*15,R.T0.y-R.dir[1]*15];WP['FA'+arr]=[R.T0.x-R.dir[0]*8,R.T0.y-R.dir[1]*8];
 $('ttl').innerHTML=ap+' '+A.icao+' <small>'+(CMB?'Tower + Ground':MODES[MODE][0])+' · RWY '+arr+' in use</small>';
 if(!silent&&!first){ATIS.prev=ATIS.l;ATIS.l=String.fromCharCode(65+(ATIS.l.charCodeAt(0)-64)%26);ATIS.t=T;say('Runway alternation '+(sw?'15:00':'06:00')+': arrivals now '+arr+', departures '+dep+'. New ATIS information '+ATIS.l+'.')}return true}
// --- say hook (count missed instructions) + voice per aircraft
const _say=say;say=function(s,k){if(/no reply|no instruction/.test(s))SH.miss++;_say(s,k)};
let SPK=null;const _atc=atc;atc=function(a,t,r){SPK=a;if(NET.who&&NET.on&&NET.act)NET.act(a,t);_atc(a,t,r)};const _ask=ask;ask=function(a,k,t){SPK=a;_ask(a,k,t)};
let VOICES=[];const BADV=/whisper|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|wobble|zarvox|albert|fred|junior|ralph|kathy|princess|agnes|bruce|vicki|victoria/i,GOODV=/premium|enhanced|natural|neural|online|google|microsoft|siri|daniel|oliver|arthur|serena|samantha|karen|moira|tessa|aaron|nicky|libby|ryan|sonia/i;
const loadV=()=>{try{let v=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)&&!BADV.test(v.name));const g=v.filter(x=>/GB|US|AU|IE|ZA|IN/i.test(x.lang));const sc=x=>(GOODV.test(x.name)?4:0)+(/compact/i.test(x.name)?-3:0)+(/en-GB/i.test(x.lang)?1:0);VOICES=(g.length?g:v).sort((a,b)=>sc(b)-sc(a)||a.name.localeCompare(b.name));VOICES=VOICES.filter(x=>sc(x)>=sc(VOICES[0])-3).slice(0,6)}catch(e){}};if(window.speechSynthesis){loadV();speechSynthesis.onvoiceschanged=loadV}
const NATO={A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliett',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu'};
const DW=['zero','one','two','three','four','five','six','seven','eight','nine'],DS=n=>String(n).split('').map(c=>DW[+c]||c).join(' ');
function aviaText(s){s=s.replace(/⚠/g,'');
 s=s.replace(/\b(\d{3})\.(\d{1,3})\b/g,(m,a,b)=>DS(a)+' decimal '+DS(b));
 s=s.replace(/\b(\d{1,2})([LRC])\b/g,(m,n,l)=>DS(n)+' '+({L:'left',R:'right',C:'centre'})[l]);
 s=s.replace(/\bFL\s?(\d{2,3})\b/g,(m,n)=>'flight level '+DS(n));
 s=s.replace(/\b([A-Z])(\d{1,3})([A-Z]?)\b/g,(m,l,n,x)=>NATO[l]+' '+DS(n)+(x?' '+NATO[x]:''));
 s=s.replace(/\b(\d{1,3})([A-Z])\b/g,(m,n,l)=>DS(n)+' '+NATO[l]);
 s=s.replace(/\b([A-HJ-Z])\b/g,(m,l)=>NATO[l]);
 s=s.replace(/\b(squawk|QNH|heading|hdg|runway|rwy)\s*(\d+)/gi,(m,w,n)=>w+' '+DS(n));
 s=s.replace(/\b(\d{1,2})(\d)00\b/g,(m,t,h)=>DS(t)+' thousand'+(+h?' '+DS(h)+' hundred':''));
 s=s.replace(/\b(\d+)\s?(kt|kts|knots)\b/gi,(m,n)=>DS(n)+' knots');
 s=s.replace(/\d/g,m=>' '+DW[+m]+' ');s=s.replace(/([a-z])([A-Z]{2,})/g,'$1 $2');
 s=s.replace(/\b(ILS|IFR|QNH|SID|VOR|NDB|TMA|CTR|DME|ATC|RWY|UTC)\b/g,m=>m==='RWY'?'runway':m.split('').join(' '));
 s=s.replace(/\bft\b/g,'feet').replace(/\bhPa\b/g,'hectopascal').replace(/\bATIS\b/g,'ay-tiss').replace(/\b([A-Z])([A-Z]{3,})\b/g,(m,x,y)=>x+y.toLowerCase());
 return s.replace(/\s+/g,' ').replace(/ ,/g,',')}
speak=function(s,k){if(!voice||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(aviaText(s));u.lang='en-GB';u.volume=SET.vol;
 if(k==='plt'&&SPK){const id=SPK.id;u.pitch=1+(id%5)*.04;u.rate=1.0+(id%3)*.04;if(VOICES.length>1)u.voice=VOICES[id%VOICES.length]}else{u.pitch=1;u.rate=1;const v=VOICES.find(v=>/en-GB/i.test(v.lang))||VOICES[0];if(v)u.voice=v}
 u.rate*=SET.rate;speechSynthesis.speak(u)};
// --- de-icing
const needDeice=a=>WX.t<=3&&a.dep;
def('G','Taxi clearance','dei',()=>'Taxi to de-icing, contact De-icing '+(DEIF[A.icao]),a=>one(O(a)&&PH(a,'tw0')&&a.di===1),a=>{a.di=2;a.req=null;setPh(a,'deice');a.diT=150+Math.random()*150;const t='taxi to de-icing pad, contact De-icing on '+DEIF[A.icao];atc(a,t,t);score+=3});
// --- squawk readback correction
def('G','Clearance','sqc',a=>'Negative – squawk '+a.sq,a=>one(O(a)&&a.sqr),a=>{atc(a,'negative, squawk '+a.sq,'squawk '+a.sq);a.sqr=null;score+=4});
// --- emergencies
function emergency(){if(!HS('T')&&!HS('C'))return;const L=ac.filter(a=>!a.dep&&!a.ovf&&a.ph==='air'&&!a.emg&&!a.ils&&Math.hypot(a.x,a.y)>14&&(HS('C')?a.ctrl==='C':true));if(!L.length)return;const a=rnd(L);
 a.emg=Math.random()<.45?'MAYDAY':'PAN';a.sq=a.emg==='MAYDAY'?'7700':a.sq;SH.emg++;const why=rnd(a.emg==='MAYDAY'?['engine failure','smoke in the cabin','hydraulic failure']:['medical emergency on board','sick passenger, request priority','bird strike, minor damage']);
 SPK=a;say((a.emg==='MAYDAY'?'MAYDAY MAYDAY MAYDAY, ':'PAN PAN, PAN PAN, PAN PAN, ')+rc(a)+', '+why+', request priority landing runway '+a.rw+'.','plt');
 if(HS('C'))a.rc=true}
// --- step hook
const _step=step;step=function(dt){_step(dt);
 lhrAlt(false);
 if(HS('T')||HS('C')){EMT-=dt;if(EMT<=0){EMT=1800+Math.random()*2700;emergency()}}
 for(const a of ac){
  if(a.ph==='roll'&&!a.rollT){a.rollT=T;WK[RW[a.rw].ph]={t:T,c:WKC(a.type),cs:a.cs}}
  if(a.ph==='tw0'&&a.t<1&&!a.di&&needDeice(a)){a.di=1;if(HS('G'))ask(a,'deice','pushback complete, request de-icing.');else{a.di=2;setPh(a,'deice');a.diT=150+Math.random()*120}}
  if(a.ph==='taxi'&&a.t<1&&!a.di&&needDeice(a)&&!HS('G')&&a.dep){a.di=2;setPh(a,'deice');a.diT=150+Math.random()*120}
  if(a.ph==='deice'){a.s=0;if(a.t>a.diT){a.di=3;if(HS('G')){setPh(a,'tw0');a.req=null;ask(a,'taxi','de-icing complete, request taxi.')}else startTaxi(a)}}
  if(a.ph==='taxi'&&a.di===1){a.di=3;score-=10;say('⚠ '+a.cs+' taxied without de-icing (−10)','sys')}
  if(a.sqr&&a.ph==='taxi'){say('⚠ '+a.cs+' squawking '+a.sqr+' instead of '+a.sq+' – wrong readback not corrected (−8)','sys');score-=8;a.sqr=null}
  if(a.emg&&a.ph==='vacate'&&!a.emgD){a.emgD=1;SH.emgOk++;score+=150;say('Fire services attending '+a.cs+' – emergency landing completed (+150).','sys')}
 }
 // non-T modes: bots must respect wake turbulence on departure
 // arrival wake / LVP spacing on the ILS (Center)
 if(HS('C')){const lvp=WX.vis<.6;for(const id of FLW[1]){const L=ac.filter(a=>!a.dep&&a.ph==='air'&&a.ils&&a.rw===id).map(a=>({a,d:geo(a,RW[id]).dist})).sort((p,q)=>p.d-q.d);
  for(let i=1;i<L.length;i++){const ld=L[i-1],fo=L[i],cl=WKC(ld.a.type),cf=WKC(fo.a.type),need=Math.max(((WKA[cl]||{})[cf])||0,lvp?5:0),gap=fo.d-ld.d,key=ld.a.id+'>'+fo.a.id;
   if(need&&gap<need-.2&&!WKP.has(key)){WKP.add(key);viol++;SH.wk++;score-=20;say('⚠ '+(lvp&&need===5?'LVP spacing':'Wake turbulence')+': '+fo.a.cs+' ('+cf+') only '+gap.toFixed(1)+' NM behind '+ld.a.cs+' ('+cl+'), needs '+need+' NM','sys')}}}}
 // thunderstorm cells (Center)
 if(HS('C')){CELT-=dt;if(CELT<=0){CELT=900+Math.random()*1800;if(CELLS.length<3&&(WX.ci>=3||Math.random()<.35)){const b=Math.random()*360,d=15+Math.random()*30;CELLS.push({x:SIN(b)*d,y:COS(b)*d,r:2.5+Math.random()*3,life:1500+Math.random()*1800,hit:new Set()});say('Weather: thunderstorm cell developing '+Math.round(d)+' NM '+['north','north-east','east','south-east','south','south-west','west','north-west'][Math.round(b/45)%8]+' of the field.')}}
  for(const c of CELLS){c.life-=dt;const wv=(WX.ws*.6)/3600*dt;c.x+=SIN(WX.wd+180)*wv;c.y+=COS(WX.wd+180)*wv;
   for(const a of ac){if(a.ph!=='air'||a.ctrl!=='C'||a.alt<1500||a.ovf&&a.alt>30000)continue;const d=Math.hypot(a.x-c.x,a.y-c.y);a.wxw=a.wxw&&d<c.r+6;if(d<c.r+6&&Math.abs(dif(brg(c.x-a.x,c.y-a.y),a.hdg))<40)a.wxw=true;
    if(d<c.r&&!c.hit.has(a.id)){c.hit.add(a.id);score-=15;SPK=a;say(rc(a)+': we are in severe turbulence, request deviation!','plt');say('⚠ '+a.cs+' flew into a thunderstorm (−15)','sys')}}}
  CELLS=CELLS.filter(c=>c.life>0)}};
// --- wake turbulence on departure (Tower)
const _clearTO=clearTO;clearTO=function(a,imm){const w=WK[RW[a.rw].ph];if(w&&['hold','lineup','ready'].includes(a.ph)&&!occ(a.rw,a)){const need=((WKD[w.c]||{})[WKC(a.type)])||0,el=T-w.t;
 if(need&&el<need){viol++;SH.wk++;score-=30;say('⚠ Wake turbulence: '+a.cs+' ('+WKC(a.type)+') cleared '+fmtS(el)+' after '+w.cs+' ('+w.c+') – needs '+fmtS(need),'sys')}}_clearTO(a,imm)};
const fmtS=s=>Math.floor(s/60)+':'+pad(Math.floor(s%60),2);
const wakeWait=a=>{if(!a.dep||!RW[a.rw])return 0;const w=WK[RW[a.rw].ph];if(!w)return 0;const need=((WKD[w.c]||{})[WKC(a.type)])||0;return Math.max(0,need-(T-w.t))};
// auto (bot) takeoffs in Ground/Center respect wake time
{const _s2=step;step=function(dt){for(const a of ac)if(a.ph==='ready'&&!HS('T')&&!a.clr&&wakeWait(a)>0)a.t=0;_s2(dt)}}
// --- panel extras: wake countdown, squawk, emergency
const _panel=panel;panel=function(){_panel();const a=sel;if(!a)return;const e=$('ctl');let x='';
 if(a.emg)x+=`<div class="v10b emg">${a.emg==='MAYDAY'?'MAYDAY · squawk 7700':'PAN PAN'} – give priority, clear to land as soon as possible.</div>`;
 if((MODE==='T')&&a.dep&&PH(a,'hold','lineup','ready'))x+=`<div class="v10b" id="wkw"></div>`;
 if(a.sq&&(MODE==='C'||MODE==='G'||CMB))x+=`<div class="small" style="margin-top:4px">Squawk ${a.sq}${a.sqr?' · <b style="color:var(--warn)">read back '+a.sqr+'!</b>':''} · Wake cat. ${WKC(a.type)}</div>`;
 if(x)e.insertAdjacentHTML('beforeend',x);refresh()};
const _refresh=refresh;refresh=function(){_refresh();const w=$('wkw');if(w&&sel){const s=wakeWait(sel),L=WK[RW[sel.rw].ph];w.className='v10b'+(s>0?' warn':' ok');w.textContent=s>0?`Wake turbulence: wait ${fmtS(s)} behind ${L.cs} (${L.c})`:'Wake turbulence: clear for takeoff'}};
// --- strips: emergency highlight
const _sr=stripsRender;stripsRender=function(){_sr();for(const a of ac)if(a.emg){const el=document.querySelector(`#strips [data-id="${a.id}"]`);if(el)el.classList.add('emg')}};
// --- frequency buttons with numbers
const _fr=freqRender;freqRender=function(){_fr();const f=$('freq');if(!f||f.hidden)return;const d=f.querySelector('[data-f="D"]'),g=f.querySelector('[data-f="G"]');if(d&&!d.dataset.n){d.dataset.n=1;d.insertAdjacentHTML('beforeend',' <small style="opacity:.6">'+DELF[A.icao]+'</small>')}if(g&&!g.dataset.n){g.dataset.n=1;g.insertAdjacentHTML('beforeend',' <small style="opacity:.6">'+(A.icao==='EGLL'?'121.705/.855/.905':A.icao==='EDDM'?'121.830':'121.805')+'</small>')}};
// --- briefing extras
const _brief=briefing;briefing=function(){_brief();const el=$('brief');if(!el)return;const ul=el.querySelector('section.wide ul');const add=t=>{if(ul)ul.insertAdjacentHTML('beforeend','<li>'+t+'</li>')};
 if(A.icao==='EDDF')add('Night flight ban 23:00–05:00 LT – no scheduled movements.');if(A.icao==='EGLL')add('Night quota period 23:30–06:00 LT. Westerly runway alternation at 06:00 and 15:00 LT.');if(A.icao==='EDDM')add('Night restrictions 22:00–06:00 LT – reduced traffic.');
 if(WX.t<=3)add('De-icing on De-icing frequency '+DEIF[A.icao]+'.');add('Wake turbulence separation applies: departures 2 min behind Heavy, 3 min behind Super (A380); arrivals 4–7 NM.');
 // departures column: add turnarounds of arrivals
 const rows=el.querySelectorAll('table.bt')[0];if(rows){const tr=rows.querySelectorAll('tr');tr.forEach((r,i)=>{if(!i)return;const td=r.querySelectorAll('td');if(td.length<3)return;const arr=+td[1].textContent.replace(/\D/g,''),dep=+td[2].textContent;td[2].textContent='≈ '+Math.round(dep+(i===1?.4:.85)*arr)})}
 const p=el.querySelector('section.wide p.dim');if(p)p.textContent='Departures include aircraft already on stand plus expected turnarounds of arriving aircraft.'};
// --- drawing overlay (before aircraft)
window.preAc=function(X,Y,k,Rg,W){
 if(MODE==='C'){ // SIDs/STARs (schematic) + weather
  cx.save();cx.setLineDash([3,5]);cx.lineWidth=1;cx.font='9px system-ui';const cl2=p=>{const d=Math.hypot(p[0],p[1]),f=d>57?57/d:1;return[p[0]*f,p[1]*f]};
  for(const id of FLW[2]){const R=RW[id];for(const e of A.ex){const p=cl2(xs(e[1]));cx.strokeStyle='rgba(255,180,84,.28)';cx.beginPath();cx.moveTo(X(R.E[0]),Y(R.E[1]));cx.lineTo(X(R.E[0]+R.dir[0]*4),Y(R.E[1]+R.dir[1]*4));cx.lineTo(X(p[0]),Y(p[1]));cx.stroke();
   if(Rg<45){const m=[(R.E[0]+p[0])/2,(R.E[1]+p[1])/2];cx.fillStyle='rgba(255,180,84,.55)';cx.fillText(sidOf({ex:[e[0]],rw:id}),X(m[0]),Y(m[1]))}}}
  for(const id of FLW[1]){const ifp=WP['IF'+id];if(!ifp)continue;for(const e of A.ent){const p=cl2(xs(e[1]));cx.strokeStyle='rgba(94,234,212,.25)';cx.beginPath();cx.moveTo(X(p[0]),Y(p[1]));cx.lineTo(X(ifp[0]),Y(ifp[1]));cx.stroke();
   if(Rg<45){const m=[(p[0]*.6+ifp[0]*.4),(p[1]*.6+ifp[1]*.4)];cx.fillStyle='rgba(94,234,212,.55)';cx.fillText(e[0]+' '+(1+hsh(e[0])%9)+'ABCDEFGHJKLMNPQRSTUVWXYZ'[hsh(id)%24],X(m[0]),Y(m[1]))}}}
  cx.setLineDash([]);
  for(const c of CELLS){const g=cx.createRadialGradient(X(c.x),Y(c.y),0,X(c.x),Y(c.y),c.r*k*1.6);g.addColorStop(0,'rgba(255,60,80,.55)');g.addColorStop(.45,'rgba(255,200,60,.35)');g.addColorStop(.75,'rgba(80,220,120,.18)');g.addColorStop(1,'rgba(80,220,120,0)');cx.fillStyle=g;cx.beginPath();cx.arc(X(c.x),Y(c.y),c.r*k*1.6,0,7);cx.fill();cx.fillStyle='rgba(255,220,220,.8)';cx.fillText('CB',X(c.x)-6,Y(c.y)+3)}
  for(const a of ac)if(a.wxw&&a.ph==='air'){cx.strokeStyle='rgba(255,180,84,.9)';cx.setLineDash([2,3]);cx.beginPath();cx.arc(X(a.p.x),Y(a.p.y),11,0,7);cx.stroke();cx.setLineDash([])}
  cx.restore();return}
 // stop bars at holding points of runways in use (ground views)
 if(Rg<=2){const act=new Set(FLW[1].concat(FLW[2]));cx.save();cx.lineCap='round';
  for(const id of act)for(const e of ENT[id]||[]){const ux=e.p[0]-e.cs[0],uy=e.p[1]-e.cs[1],l=Math.hypot(ux,uy)||1,nx=-uy/l,ny=ux/l,hw=15/NM,q=[e.q[0]-ux/l*6/NM,e.q[1]-uy/l*6/NM];
   const green=ac.some(a=>a.ent===e&&a.rw===id&&(PH(a,'lineup','ready','roll')));cx.strokeStyle=green?'rgba(90,255,140,.95)':'rgba(255,60,70,.95)';cx.lineWidth=Math.max(2,4/NM*k);cx.shadowColor=cx.strokeStyle;cx.shadowBlur=isNight()?8:0;
   cx.beginPath();cx.moveTo(X(q[0]+nx*hw),Y(q[1]+ny*hw));cx.lineTo(X(q[0]-nx*hw),Y(q[1]-ny*hw));cx.stroke()}
  cx.restore()}};
// --- coach
const HINT={radar:'Identify it: tap the aircraft → "Radar contact".',ifr:'IFR clearance: tap the aircraft → Clearance "Cleared to … squawk …". Check the read-back!',push:'Approve "Push and start" (or start-up first). Check nobody is taxiing right behind the stand.',taxi:'Give a taxi route: "Build taxi route" or a quick holding point / stand.',deice:'Cold weather: send it to de-icing first ("Taxi to de-icing").',cross:'Runway crossing: only "Cross runway" if no aircraft is landing or taking off there – otherwise "Hold short".',handoff:'Hand it to the next controller ("Contact Tower / Ground / Departure / next sector").',dep:'Departure ready: runway free and no arrival inside ~3 NM? → "Line up" / "Cleared for takeoff". Watch the wake timer.',land:'Arrival on final: runway free? → "Cleared to land", otherwise "Continue approach".'};
function coachBox(){let b=$('coach');if(!b){b=document.createElement('div');b.id='coach';b.className='panel';$('ctl').parentNode.insertBefore(b,$('ctl'))}b.hidden=!COACH;$('coB').classList.toggle('on',COACH)}
$('coB').onclick=()=>{COACH=!COACH;try{localStorage.setItem('atc_coach',COACH?'1':'0')}catch(e){}coachBox();coachTick()};
let COH='';function coachTick(){const b=$('coach');if(!b||!COACH)return;const setH=h=>{if(h!==COH){COH=h;b.innerHTML=h}};const mineF=a=>a.ctrl===MODE||CMB&&a.ctrl==='G',L=ac.filter(a=>a.req&&(mineF(a)||a.req==='cross'&&MODE==='T')).sort((p,q)=>(q.emg?1:0)-(p.emg?1:0)||p.t-q.t);
 if(!L.length){setH('<div class="small"><b style="color:var(--ok)">Coach</b> · Nothing waiting. Watch the radar / map and use 2×–8× to speed up quiet periods.</div>');return}
 const a=L[0];setH(`<div class="small"><b style="color:var(--ok)">Coach</b> · <button class="cobtn" data-id="${a.id}">${a.cs}</button> ${a.emg?'<b style="color:var(--warn)">EMERGENCY – handle first.</b> ':''}${MODE==='G'&&!O(a)?`<b>Switch to the ${a.dl?'Delivery':'Ground'} frequency</b> – then: `:''}${HINT[a.req]||'Waiting for your instruction.'}${L.length>1?` <span style="opacity:.6">(+${L.length-1} more waiting)</span>`:''}</div>`);
 const bt=b.querySelector('.cobtn');if(bt)bt.onclick=()=>{sel=ac.find(q=>q.id===+bt.dataset.id)||null;psig='';ui()}}
const _ui=ui;ui=function(){_ui();coachTick()};
// --- end of shift / evaluation
function gradeOf(){const hrs=Math.max(.25,(T-SH.t0)/3600),mov=land+dpt,rate=mov/hrs,pts=100-viol*9-SH.miss*4+Math.min(15,rate*.8)+SH.emgOk*4-(SH.emg-SH.emgOk)*3;return{hrs,mov,rate,pts:Math.round(pts),g:mov<3?'–':pts>=95?'A':pts>=85?'B':pts>=72?'C':pts>=60?'D':pts>=45?'E':'F'}}
$('endB').onclick=()=>{paused=true;$('pz').textContent='▶';const r=gradeOf(),key='atc_best_'+ap+(CMB?'X':MODE);let best=null;try{best=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
 const isBest=!best||score>best.s;if(isBest){try{localStorage.setItem(key,JSON.stringify({s:score,g:r.g,d:new Date().toISOString().slice(0,10)}))}catch(e){}}
 let el=$('evl');if(!el){el=document.createElement('div');el.id='evl';document.body.appendChild(el)}
 el.innerHTML=`<div class="bcard" style="max-width:560px"><div class="bk">Shift report</div><h2>${A.n} ${A.icao} · ${CMB?'Tower + Ground':MODES[MODE][0]}</h2><div class="bsub">${hm(SH.t0+LOFF[ap]*3600)}–${hm(T+LOFF[ap]*3600)} LT · ${r.hrs.toFixed(1)} h on position</div>
 <div class="evg"><div class="grade g${r.g}">${r.g}</div><table class="bt"><tr><td>Score</td><td><b>${score}</b>${isBest?' <span style="color:var(--ok)">★ new best</span>':' (best '+best.s+')'}</td></tr><tr><td>Landings / departures</td><td>${land} / ${dpt} (${r.rate.toFixed(0)} movements per hour)</td></tr><tr><td>Violations</td><td>${viol}${SH.wk?' (of which wake turbulence '+SH.wk+')':''}</td></tr><tr><td>Pilots acting without instruction</td><td>${SH.miss}</td></tr><tr><td>Emergencies</td><td>${SH.emg?SH.emgOk+' of '+SH.emg+' landed':'none'}</td></tr></table></div>
 <p class="dim">${r.g==='–'?'Too few movements to grade yet – keep working the traffic.':r.g<='B'?'Clean, safe and efficient – well done.':viol?'Most points were lost through separation/runway violations – check the runway and wake timer before every clearance.':SH.miss?'Pilots had to act on their own – answer requests faster (the Coach button helps).':'Try a busier hour for more movements per hour.'}</p>
 <div class="row" style="gap:10px;margin-top:14px"><button class="bgo" id="evC" style="flex:1">Continue shift</button><button class="bgo" id="evM" style="flex:1;background:#24324a;color:#e7eefb">Back to menu</button></div></div>`;
 el.hidden=false;$('evC').onclick=()=>{el.hidden=true};$('evM').onclick=()=>{el.hidden=true;$('back').onclick()}};
// best scores in the menu
const _bm2=buildMenu;buildMenu=function(){_bm2();let h='';for(const k of Object.keys(AP))for(const m of ['C','T','G','X']){try{const b=JSON.parse(localStorage.getItem('atc_best_'+k+m)||'null');if(b)h+=`<span class="pill" style="margin:3px 6px 0 0">${k} ${MODES[m][0]}: ${b.s} (${b.g})</span>`}catch(e){}}
 let el=$('bests');if(!el){el=document.createElement('div');el.id='bests';el.style.marginTop='12px';$('start').insertAdjacentElement('afterend',el)}el.innerHTML=h?'<div class="small" style="margin-bottom:4px">Your best shifts</div>'+h:''};
(()=>{const s=document.createElement('style');s.textContent=`.v10b{margin-top:8px;padding:8px 10px;border-radius:10px;font-size:13px;background:rgba(94,234,212,.08);border:1px solid rgba(94,234,212,.25)}.v10b.warn{background:rgba(255,180,84,.1);border-color:rgba(255,180,84,.45);color:#ffd9a8}.v10b.ok{color:#a8f5e6}.v10b.emg{background:rgba(255,93,115,.14);border-color:rgba(255,93,115,.6);color:#ffc2cb;font-weight:600}
.strip2.emg{box-shadow:inset 3px 0 0 #ff5d73,0 0 0 1px rgba(255,93,115,.6)!important;background:rgba(255,93,115,.12)!important}
#coach{border-color:rgba(94,234,212,.35)}#coach .cobtn{font-size:12px;padding:3px 8px;margin:0 4px}#coB.on{border-color:var(--ok);color:var(--ok)}
#evl{position:fixed;inset:0;background:rgba(3,8,16,.78);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:60;padding:16px}#evl[hidden]{display:none}
.evg{display:flex;gap:18px;align-items:center;margin-top:14px}#evl .bcard{width:100%;max-width:560px;background:#0b1626;border:1px solid #23395a;border-radius:16px;padding:22px;color:#dbe7f7;box-shadow:0 20px 60px rgba(0,0,0,.5)}#evl .bk{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5eead4}#evl h2{margin:4px 0 2px;font-size:22px}#evl .bsub,#evl .dim{color:#8aa0bf;font-size:13px}#evl table.bt{width:100%;border-collapse:collapse;font-size:14px}#evl .bt td{padding:5px 4px;border-top:1px solid #1a2c47}#evl .bt td:first-child{color:#8aa0bf}#evl .bgo{padding:12px;font-size:15px;font-weight:600;border-radius:10px;background:#5eead4;color:#04121c;border:0;cursor:pointer}
.grade{font:800 64px/1 system-ui;width:96px;height:96px;border-radius:24px;display:flex;align-items:center;justify-content:center;background:rgba(94,234,212,.12);color:#5eead4;flex:none}.grade.gC,.grade.gD{color:#ffd166;background:rgba(255,209,102,.12)}.grade.gE,.grade.gF{color:#ff5d73;background:rgba(255,93,115,.12)}
@media(max-width:600px){.evg{flex-direction:column;align-items:flex-start}}`;document.head.appendChild(s)})();
// site: stand counts
(()=>{for(const k of ['MUC','FRA','LHR']){const e=$('n'+k);if(e)e.textContent=DATA[k].st.length}})();

// --- phonetic alphabet in displayed radio calls, and the controller's "readback correct"
(function(){const _s=say;say=function(t,k){if(k==='plt'||k==='atc')t=t.replace(/(^|[ ,(])([A-HJ-Z])(?=[ ,.)]|$)/g,(m,p,l)=>p+NATO[l]);_s(t,k)};
 const _a=atc;atc=function(a,t,r){if(a.rbp&&!a.sqr&&!/^negative/i.test(t)){t='readback correct, '+t}a.rbp=false;_a(a,t,r);if(r!==null)setTimeout(()=>{a.rbp=!a.sqr&&!a.rbw},700)}})();
