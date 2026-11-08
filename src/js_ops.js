// ================= stand allocation, parked aircraft, turnarounds, shift briefing =================
function gateCat(n){if(ap==='MUC'){const c=n[0];if(c==='P')return'PK';if(c==='9')return'CGA';return c==='1'?'T1':c==='2'||c==='3'?'T2':c==='5'?'GA':c==='6'?'R':'CGO'}
 if(ap==='LHR'){if(n.length<3)return'R';const c=n[0];return c==='2'?'T2':c==='3'?'T3':c==='4'?'T4':c==='5'?'T5':c==='6'?'CGO':'R'}
 const c=n[0];return'BDF'.includes(c)?'T1':c==='H'?'T2':'CEG'.includes(c)?'CGO':'GA'}
const CATN={T1:'Terminal 1',T2:'Terminal 2',T3:'Terminal 3',T4:'Terminal 4',T5:'Terminal 5',R:'Remote stands',CGA:'Cargo / general aviation',PK:'Parking positions (D3)',CGO:'Cargo',GA:'General aviation'};
function homeCat(al,code){if(al.k==='C')return'CGO';if(al.k==='G')return'GA';const T=A.T||{};let star=null;for(const k in T){if(T[k]==='*')star=k;else if(T[k].split(',').includes(code))return k}return star||Object.keys(T)[0]||'T1'}
const grpOf=n=>String(n).replace(/^(.*\d)[A-Z]$/,'$1');
function prepGates(){for(const g of gates)g.grp=grpOf(g.n);for(const g of gates){g.cat=gateCat(g.n);let nd=1e9;for(const o of gates)if(o!==g&&o.grp!==g.grp)nd=Math.min(nd,Math.hypot(o.x-g.x,o.y-g.y)*NM);g.nd=nd;g.wide=nd>=46||g.cat==='CGO';g.span=g.cat==='CGO'?Math.max(80,2*nd-38):Math.max(17,Math.min(90,2*nd-39));g.nb=gates.filter(o=>o!==g&&Math.hypot(o.x-g.x,o.y-g.y)*NM<130)}}
function gateFits(g,sp){if(sp>g.span)return false;if(gates.some(o=>o!==g&&o.use&&o.grp===g.grp))return false;for(const o of g.nb){if(!o.use)continue;if(o.grp===g.grp)return false;const so=o.usp||36,d=Math.hypot(o.x-g.x,o.y-g.y)*NM;if(d<(sp+so)/2+3)return false}return true}
function pickGate(al,code,wide){if(!gates[0]||gates[0].cat==null)prepGates();const h=homeCat(al,code),SP=SPAN[PICKT]||36,free=gates.filter(g=>!g.use&&!g.closed&&gateFits(g,SP)),pax=c=>!['CGO','GA','PK','CGA'].includes(c);if(PKF){const L=free.filter(g=>g.cat==='PK');return L.length?(L[0].usp=SP,rnd(L)):null}
 const order=al.k==='C'?['CGO','CGA','R']:al.k==='G'?['GA','CGA','R']:[h,'R'];const tk=g=>{g.usp=SP;return g};for(const c of order){const L=free.filter(g=>g.cat===c);if(L.length)return tk(rnd(L))}
 if(al.k==='P'){const L=free.filter(g=>pax(g.cat));if(L.length)return tk(rnd(L));if(Math.random()<.5){const P2=free.filter(g=>g.cat==='PK');if(P2.length)return tk(rnd(P2))}}return null}
function depPlan(a,o){const best=A.ex.map(f=>({f,d:Math.abs(dif(brg(...xs(f[1])),o.b))})).sort((p,q)=>p.d-q.d)[0].f,fx=xs(best[1]);
 a.code=o.code;a.city=o.city;a.fix=best[0];a.ex=[best[0],brg(fx[0],fx[1])];a.rw=FLW[3]?(fx[1]>0?FLW[3]:FLW[4]):rnd(FLW[2]);a.fl=o.dist>1500?380:340}
function turnTime(a){const w=(SPAN[a.type]||36)>40;return 60*(a.kind==='C'?120+Math.random()*150:a.kind==='G'?60+Math.random()*240:w?85+Math.random()*70:40+Math.random()*35)}
function turnaround(a){const al=AIRL[a.cs.slice(0,3)]||rnd(Object.values(AIRL)),o=pickRoute(true,al);let cs;do cs=a.cs.slice(0,3)+(100+Math.random()*899|0);while(ac.some(x=>x.cs===cs));
 Object.assign(a,{cs,dep:true,ph:'parked',t:0,ctrl:'G',su:0,req:null,clr:false,path:null,pi:0,tb:null,need:false,stop:false,vx:0,s:0,alt:0,cleared:false,ils:false,cl:0,dl:false,trail:[],ent:null,pst:0,dh:null,xok:0,xf:0});
 depPlan(a,o);a.sched=T+turnTime(a);if(a.gate.h!=null)a.hdg=a.gate.h;a.x=a.gate.x;a.y=a.gate.y;snap(a)}
// how many aircraft stand at the gates at shift start, departure times follow the airport's departure profile
function populate(){prepGates();
 // NOTAM: a couple of stands out of service
 const cand=gates.filter(g=>!['CGO','GA','PK','CGA'].includes(g.cat));NOTAM.stands=[];for(let i=0;i<0&&cand.length;i++){const g=cand.splice(Math.random()*cand.length|0,1)[0];g.closed=true;NOTAM.stands.push(g.n)}
 const hh=lt((T/3600)%24),night=hh>=22||hh<6,occ=(night?.56:.34)+Math.random()*.08,xtra=(A.CR?Math.round(gates.filter(g=>(g.cat==='CGO'||g.cat==='CGA')&&!g.closed).length*.34):0)+(A.GR?Math.round(gates.filter(g=>(g.cat==='GA'||g.cat==='CGA')&&!g.closed).length*.2):0),n=Math.round(gates.filter(g=>!g.closed&&!['CGO','GA','PK','CGA'].includes(g.cat)).length*occ)+xtra,offs=[];
 let guard=0;while(offs.length<n&&guard++<n*60){const o=240+Math.random()*12*3600,w=.06+prof(ap+'_d',lt(((T+o)/3600)%24));if(Math.random()<w)offs.push(o)}
 offs.sort((p,q)=>p-q);if(offs[0]!=null)offs[0]=180+Math.random()*120;if(offs[1]!=null)offs[1]=Math.min(Math.max(offs[1],420+Math.random()*300),900);
 // freighters on the cargo apron and business jets on the GA apron
 for(const[k,c,pr]of[['C','CGO',.34],['G','GA',.2]]){if(!(k==='C'?A.CR:A.GR))continue;const n2=Math.round(gates.filter(g=>(g.cat===c||g.cat==='CGA')&&!g.closed).length*pr);FORCEK=k;for(let i=0;i<n2;i++){const o=offs.length?offs.splice(Math.random()*offs.length|0,1)[0]:1800+Math.random()*7200;mk(true,T+o+(k==='C'?3600:0))}FORCEK=null}
 {const pk=gates.filter(g=>g.cat==='PK'&&!g.closed);if(pk.length){PKF=true;const n3=Math.round(new Set(pk.map(g=>g.grp)).size*(.16+Math.random()*.16));for(let i=0;i<n3;i++)mk(true,T+(3+Math.random()*9)*3600);PKF=false}}
 for(const o of offs){let a=null;for(let k=0;k<6&&!a;k++)a=mk(true,T+o)}
 const na=Math.round(1+prof(ap+'_a',hh)*2.5);for(let i=0;i<na;i++)mk(false)}
// ---------------- shift briefing
const NOTAM={stands:[]};let FORCEK=null,PICKT=null,PKF=false;
function briefing(){paused=true;$('pz').textContent='▶';
 const hh=(T/3600)%24,L=lt(hh),pk=ac.filter(a=>a.ph==='parked'),R=FLW[1],D2=FLW[2];
 const cats={};gates.forEach(g=>{const c=cats[g.cat]=cats[g.cat]||[0,0];c[1]++;if(g.use)c[0]++});
 let rows='';for(let i=0;i<6;i++){const t0=T+i*3600,h0=lt((t0/3600)%24),arr=Math.round(3600*A.rate*prof(ap+'_a',h0)*DAYF/140),dep=pk.filter(a=>a.sched>=t0&&a.sched<t0+3600).length;
  rows+=`<tr><td>${pad(Math.floor(h0),2)}:00</td><td>≈ ${arr}</td><td>${dep}</td><td style="width:38%"><div class="bar" style="width:${Math.min(100,(arr+dep)*2)}%"></div></td></tr>`}
 const first=pk.slice().sort((p,q)=>p.sched-q.sched).slice(0,6).map(a=>`<tr><td>${hm(a.sched+LOFF[ap]*3600)}</td><td>${a.cs}</td><td>${a.type}</td><td>${a.gate.n}</td><td>${a.city}</td></tr>`).join('');
 const hw=WX.ws*COS(WX.wd-FLW[0]),thw=WT.ws*COS(WT.wd-FLW[0]),inMin=Math.max(5,Math.round((WT.next-T)/60));
 const notes=[];if(NOTAM.stands.length)notes.push(`Stands ${NOTAM.stands.join(' and ')} closed (maintenance) – not available for allocation.`);
 if(WX.t<3)notes.push('De-icing in operation – expect longer taxi times for departures.');
 notes.push(rnd([`Bird activity reported in the vicinity of RWY ${R[0]}.`,`Crane erected near the apron, height 45 m, lighted.`,`Follow-me service available on request.`,`ILS ${R[R.length-1]} glide path calibration flight possible this afternoon.`]));
 if(thw<-5)notes.push(`Wind trend shows a tailwind on ${R.join('/')} – a runway direction change is possible later in the shift.`);
 const catRows=Object.keys(cats).sort().map(c=>`<tr><td>${CATN[c]||c}</td><td>${cats[c][0]} / ${cats[c][1]}</td></tr>`).join('');
 const html=`<div class="bcard"><div class="bhd"><div><div class="bk">Shift briefing</div><h2>${A.n} ${A.icao} · ${MODES[MODE][0]}</h2><div class="bsub">Shift starts ${hm(T+LOFF[ap]*3600)} LT (${hm(T)}Z) · ${L>=6.5&&L<19.5?'daytime':'night'} · ATIS information ${ATIS.l}</div></div></div>
 <div class="bgrid">
 <section><h3>Runways</h3><p>Arrivals <b>${R.join(' / ')}</b> · departures <b>${D2.join(' / ')}</b> (${flow==='W'?'westerly':'easterly'} operations).${WX.vis<1.5?' <b class="warn">Low visibility procedures in force.</b>':''}</p></section>
 <section><h3>Weather</h3><p>Wind ${pad(Math.round(WX.wd)%360,3)}°/${Math.round(WX.ws)} kt${hw<0?' <b class="warn">(tailwind)</b>':''}, visibility ${visTxt(WX.vis)}, ${WX.cld}, ${Math.round(WX.t)} °C, QNH ${Math.round(WX.q)}.</p><p class="dim">Trend (in ~${inMin} min): wind ${pad(Math.round(WT.wd)%360,3)}°/${Math.round(WT.ws)} kt, visibility ${visTxt(WT.vis)}, ${CLD[WT.ci]}.</p></section>
 <section class="wide"><h3>Traffic outlook</h3><table class="bt"><tr><th>Hour (LT)</th><th>Arrivals</th><th>Departures*</th><th></th></tr>${rows}</table><p class="dim">* scheduled departures of aircraft already on stand; turnarounds of arriving aircraft come on top.</p></section>
 <section><h3>Stands at shift start</h3><table class="bt">${catRows}</table><p class="dim">${pk.length} aircraft parked · passenger aircraft at terminal / remote stands, freighters on cargo stands, business jets on the GA apron.</p></section>
 <section><h3>First departures</h3><table class="bt"><tr><th>STD</th><th>Callsign</th><th>Type</th><th>Stand</th><th>To</th></tr>${first}</table></section>
 <section class="wide"><h3>NOTAM / remarks</h3><ul>${notes.map(n=>'<li>'+n+'</li>').join('')}</ul></section></div>
 <button id="bgo" class="bgo">Start shift</button></div>`;
 let el=$('brief');if(!el){el=document.createElement('div');el.id='brief';document.body.appendChild(el)}el.innerHTML=html;el.hidden=false;
 $('bgo').onclick=()=>{el.hidden=true;paused=false;$('pz').textContent='⏸';say('Briefing complete – you have the frequency.','sys')}}
(()=>{const st=document.createElement('style');st.textContent=`#brief{position:fixed;inset:0;z-index:50;background:rgba(3,8,16,.82);backdrop-filter:blur(4px);overflow:auto;padding:24px 16px}
#brief .bcard{max-width:900px;margin:0 auto;background:#0b1626;border:1px solid #23395a;border-radius:16px;padding:22px 22px 18px;color:#dbe7f7;box-shadow:0 20px 60px rgba(0,0,0,.5)}
#brief .bk{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#5eead4}#brief h2{margin:4px 0 2px;font-size:22px}#brief .bsub{color:#8aa0bf;font-size:13px}
#brief .bgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}#brief section{background:#0f1d33;border:1px solid #1d3150;border-radius:12px;padding:12px 14px}#brief section.wide{grid-column:1/-1}
#brief h3{margin:0 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#9fb6d6}#brief p{margin:4px 0;font-size:14px;line-height:1.45}#brief .dim{color:#7f93b0;font-size:12px}#brief .warn{color:#ffb454}
#brief table.bt{width:100%;border-collapse:collapse;font-size:13px}#brief .bt th{text-align:left;color:#7f93b0;font-weight:500;padding:3px 4px}#brief .bt td{padding:3px 4px;border-top:1px solid #1a2c47}
#brief .bar{height:8px;border-radius:4px;background:linear-gradient(90deg,#5eead4,#ffd166)}#brief ul{margin:4px 0;padding-left:18px;font-size:14px;line-height:1.5}
#brief .bgo{margin-top:16px;width:100%;padding:12px;font-size:16px;font-weight:600;border-radius:10px;background:#5eead4;color:#04121c;border:0;cursor:pointer}
@media(max-width:700px){#brief .bgrid{grid-template-columns:1fr}#brief .bt td:nth-child(4){display:none}}`;document.head.appendChild(st)})();
