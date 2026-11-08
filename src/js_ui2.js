let pick=null;
const fl=v=>v>=10000?'FL'+Math.round(v/100):v+' ft';
const CM=[],def=(m,g,id,lab,args,f)=>CM.push({m,g,id,lab,args,f});
let BATCH=false;const O=a=>(a.ctrl===MODE||(CMB&&a.ctrl==='G'))&&(MODE!=='G'||!!a.dl===(GF==='D')),PH=(a,...p)=>p.includes(a.ph),one=c=>c?['']:[];
const xAhead=a=>a.path&&PH(a,'taxi','taxiin')?a.path.slice(a.pi).find(p=>p[2]):null;
const sideRw=p=>{const n=D.rw[p[2]-1];return n.n1+'/'+n.n2};
// ---------------- GROUND
def('G','Clearance','cl',a=>'Cleared to '+a.city+' via '+sidOf(a)+', climb '+(A.icao==='EGLL'?6000:5000)+' ft, squawk '+sqOf(a),a=>one(O(a)&&PH(a,'gate')&&a.dl&&!a.cl),a=>{a.cl=1;a.req=null;score+=3;const t='cleared to '+a.city+' via '+sidOf(a)+' departure, initial climb '+(A.icao==='EGLL'?6000:5000)+' feet, squawk '+sqOf(a);let rb=t;if(Math.random()<.12){a.sqr=wrongSq(a.sq);rb=t.replace(/squawk \d+$/,'squawk '+a.sqr)}atc(a,t,rb)});
def('G','Clearance','dg',a=>'Contact Ground '+gndF(a)+' when ready for '+(A.icao==='EGLL'?'pushback':'start-up'),a=>one(O(a)&&PH(a,'gate')&&a.dl&&a.cl),a=>{a.dl=false;a.req=null;a.t=-(54+Math.random()*60);const t='contact Ground on '+gndF(a)+' when ready for '+(A.icao==='EGLL'?'pushback':'start-up and pushback');atc(a,t,'contact Ground '+gndF(a)+' when ready');score+=1});
def('G','Clearances','su',()=>'Start-up approved',a=>one(O(a)&&PH(a,'gate')&&!a.su),startup);
const faces=a=>a.gate.fd?[...new Set(a.gate.fd.map(CW))]:['auto'];
def('G','Clearances','ps',(a,g)=>'Push and start'+(g==='auto'?'':', face '+g),a=>O(a)&&PH(a,'gate')&&!a.su?faces(a):[],(a,g)=>pushStart(a,g,true));
def('G','Clearances','push',(a,g)=>'Pushback'+(g==='auto'?'':', face '+g),a=>O(a)&&PH(a,'gate')&&a.su?faces(a):[],(a,g)=>pushStart(a,g,false));
def('G','Taxi clearance','tb',a=>a.dep?'Build taxi route to runway…':'Build taxi route to stand '+a.gate.n+'…',a=>one(O(a)&&PH(a,'tw0','vacated')&&!a.tb&&TG),a=>tbStart(a));
def('G','Taxi route','tv',(a,g)=>'via '+g,a=>a.tb&&O(a)?a.tb.names.map(q=>q[0]):[],(a,g)=>tbVia(a,g));
def('G','Taxi route','th',(a,g)=>{const[id,i]=g.split('.'),e=ENT[id][+i];return '✓ Holding point '+id+(e.lb?' '+e.lb:'')},a=>a.tb&&O(a)&&a.dep?a.tb.hps:[],(a,g)=>tbFinish(a,g));
def('G','Taxi route','tg',a=>'✓ Stand '+a.gate.n,a=>one(a.tb&&O(a)&&!a.dep&&a.tb.stand),a=>tbFinish(a,'stand'));
def('G','Taxi route','tu',()=>'↶ Undo',a=>one(a.tb&&a.tb.steps.length),a=>tbUndo(a));
def('G','Taxi route','tx',()=>'✕ Cancel',a=>one(a.tb),a=>{a.tb=null});
def('G','Taxi clearance','taxi',(a,g)=>{const[id,i]=g.split('.'),e=ENT[id][+i];return 'Quick: holding point '+id+(e.lb?' '+e.lb:'')+' (auto route)'},
 a=>{if(!(O(a)&&PH(a,'tw0'))||a.tb)return[];const L=[];for(const id of FLW[2]){const all=ENT[id],pr=apronSide(all),B=(pr.length?pr:all).filter(e=>e.depOK!==false);B.map(e=>all.indexOf(e)).sort((p,q)=>Math.hypot(all[p].q[0]-a.x,all[p].q[1]-a.y)-Math.hypot(all[q].q[0]-a.x,all[q].q[1]-a.y)).slice(0,2).forEach(i=>L.push(id+'.'+i))}return L},
 (a,g)=>{const[id,i]=g.split('.');clearTaxi(a,id,+i)});
def('G','Taxi clearance','gate',a=>'Quick: stand '+a.gate.n+' (auto route)',a=>one(O(a)&&PH(a,'vacated')&&!a.tb),a=>toGate(a));
def('GT','Movement','hold',()=>'Hold position',a=>one(O(a)&&!a.stop&&(MODE==='G'||CMB?PH(a,'taxi','taxiin','tw0','lineup'):PH(a,'lineup'))),a=>{a.stop=true;atc(a,'hold position','holding position')});
def('GT','Movement','go',()=>'Continue',a=>one(O(a)&&a.stop),a=>{a.stop=false;atc(a,'continue','continuing')});
def('G','Movement','exp',()=>'Expedite taxi',a=>one(O(a)&&PH(a,'taxi','taxiin')&&a.vx!==34),a=>{a.vx=34;atc(a,'expedite taxi','expediting')});
def('G','Movement','slow',()=>'Reduce speed',a=>one(O(a)&&PH(a,'taxi','taxiin')&&a.vx!==12),a=>{a.vx=12;atc(a,'reduce taxi speed','slowing down')});
def('G','Movement','norm',()=>'Normal speed',a=>one(O(a)&&PH(a,'taxi','taxiin')&&a.vx>0),a=>{a.vx=0;atc(a,'resume normal taxi speed','normal speed')});
def('G','Movement','gw',()=>'Give way to… (tap aircraft)',a=>one(O(a)&&PH(a,'taxi','taxiin')),a=>{pick={a};say('Tap the aircraft that '+rc(a)+' should give way to.','sys')});
def('GT','Runway','cross',a=>{const p=xAhead(a);return 'Cross runway '+(p?sideRw(p):'')},a=>one((MODE==='T'||O(a))&&xAhead(a)),a=>{const p=xAhead(a);a.xok=p[2];if(a.req==='cross')a.req=null;if(physBusy(p[2]-1,a)&&MODE==='T'){a.xf=p[2];score-=75;viol++;say('⚠ RUNWAY INCURSION: '+rc(a)+' crossing an occupied runway','sys')}else score+=2;atc(a,'cross runway '+sideRw(p),'crossing runway '+sideRw(p))});
def('G','Frequency','twr',()=>'Contact Tower',a=>one(O(a)&&PH(a,'hold')),a=>{a.ctrl='T';a.req=null;a.t=0;atc(a,'contact tower','contact tower');score+=2});
// ---------------- TOWER
def('T','Departure','hs',()=>'Hold short runway',a=>one(O(a)&&PH(a,'hold')&&!a.hsT),a=>{a.req=null;a.hsT=T+45;atc(a,'hold short of runway '+a.rw,'hold short runway '+a.rw)});
def('T','Runway','hsx',()=>'Hold short, do not cross',a=>one(MODE==='T'&&a.req==='cross'),a=>{a.req=null;a.xh=T+30;a.xwait=0;atc(a,'hold short of the runway','holding short')});
def('T','Departure','lu',()=>'Line up and wait',a=>one(O(a)&&PH(a,'hold')),a=>lineup(a));
def('T','Departure','to',()=>'Cleared for takeoff',a=>one(O(a)&&PH(a,'hold','lineup','ready')&&!a.clr),a=>clearTO(a));
def('T','Departure','toi',()=>'Immediate takeoff',a=>one(O(a)&&PH(a,'hold','lineup','ready')&&!a.clr),a=>clearTO(a,1));
def('T','Departure','cto',a=>a.ph==='roll'?'Stop immediately':'Cancel takeoff clearance',a=>one(O(a)&&(PH(a,'roll')&&!a.ab||PH(a,'lineup','ready')&&a.clr)),a=>cancelTO(a));
def('T','Departure','dh',(a,g)=>g==='l'?'After departure turn left 30°':g==='r'?'After departure turn right 30°':'After departure runway heading',a=>O(a)&&a.dep&&PH(a,'hold','lineup','ready','roll')?['l','r','0']:[],
 (a,g)=>{const h=RW[a.rw].h;a.dh=g==='0'?null:nrm(h+(g==='l'?-30:30));const t=g==='0'?'after departure, fly runway heading':'after departure turn '+(g==='l'?'left':'right')+' heading '+pad(Math.round(a.dh),3);atc(a,t,t);score+=1});
def('T','Departure','dep',()=>'Contact Departure',a=>one(O(a)&&a.dep&&PH(a,'air')&&a.alt>300),a=>toDep(a,1));
def('T','Arrival','land',()=>'Cleared to land',a=>one(O(a)&&!a.dep&&PH(a,'air')&&!a.clr),a=>{a.clr=true;a.cont=false;a.req=null;atc(a,'wind '+pad(Math.round(WX.wd)%360,3)+' degrees '+Math.round(WX.ws)+' knots, runway '+a.rw+' cleared to land','cleared to land runway '+a.rw)});
def('T','Arrival','cont',()=>'Continue approach',a=>one(O(a)&&!a.dep&&PH(a,'air')&&!a.clr&&!a.cont),a=>{a.cont=true;a.req=null;atc(a,'continue approach, expect late landing clearance','continue approach')});
def('T','Arrival','ga',()=>'Go around',a=>one(O(a)&&!a.dep&&PH(a,'air')&&a.ils),a=>goAround(a,1));
def('T','Arrival','vac',(a,g)=>{if(g==='l')return'Vacate left';if(g==='r')return'Vacate right';if(g==='n')return'Vacate next exit';const e=vacCands(a)[+g.split('.')[1]];return 'Vacate via '+(e?e.lb:'')},
 a=>{if(!(O(a)&&!a.dep&&(PH(a,'air')&&a.ils||PH(a,'vacate'))))return[];const L=vacCands(a);return['l','r','n'].concat(L.slice(0,3).map((e,i)=>e.lb?'x.'+i:null).filter(Boolean))},
 (a,g)=>g.startsWith('x.')?vacate(a,'x',g.slice(2)):vacate(a,g));
def('T','Frequency','gnd',()=>'Contact Ground',a=>one(MODE==='T'&&a.ctrl==='T'&&PH(a,'vacated')),a=>{a.ctrl='G';a.req=null;a.t=0;atc(a,'contact ground','contact ground');score+=2});
def('T','Information','wind',()=>'Wind check',a=>one(O(a)&&PH(a,'air','hold','lineup','ready')),a=>atc(a,'wind '+pad(Math.round(WX.wd)%360,3)+' degrees '+Math.round(WX.ws)+' knots, QNH '+Math.round(WX.q),'copied wind'));
// ---------------- CENTER
def('C','Identification','rc',()=>'Radar contact',a=>one(O(a)&&PH(a,'air')&&!a.rc),a=>{a.rc=true;if(a.req==='radar')a.req=null;score+=3;atc(a,'radar contact','radar contact'.replace(/.*/,'roger'))});
def('C','Heading','hd',(a,g)=>g==='mph'?'Fly present heading':g==='rwy'?'Fly runway heading':g==='int'?'Turn to intercept localiser':'Turn '+(g[0]==='L'?'left ':'right ')+g.slice(1)+'°',
 a=>O(a)&&PH(a,'air')&&!a.ils?['L90','L45','L30','L20','L10','R10','R20','R30','R45','R90','rwy','mph'].concat(a.dep?[]:['int']):[],
 (a,g)=>{a.ils=false;a.cleared=false;a.wp=null;a.dct=null;a.orb=0;const R=RW[a.rw];
  if(g==='mph')a.th=Math.round(a.hdg);else if(g==='rwy')a.th=R.h;else if(g==='int'){const c=geo(a,R).cross;a.th=nrm(R.h-30*(c>=0?1:-1))}else a.th=nrm(a.hdg+(g[0]==='L'?-1:1)*+g.slice(1));
  const h=pad(Math.round(a.th)%360||360,3);atc(a,g==='int'?'turn '+(dif(a.th,a.hdg)<0?'left':'right')+' heading '+h+', intercept the localiser':'fly heading '+h,'heading '+h)});
def('C','Heading','dct',(a,g)=>'Direct '+g,a=>{if(!(O(a)&&PH(a,'air')&&!a.ils))return[];const all=A.ent.concat(A.ex).map(e=>e[0]).filter(n=>WP[n]),d=n=>Math.hypot(WP[n][0]-a.x,WP[n][1]-a.y);let L=all.filter(n=>d(n)>4).sort((p,q)=>d(p)-d(q));if(a.dep&&a.ex&&!a.ovf){L=[a.ex[0]].concat(L.filter(n=>n!==a.ex[0]))}if(!a.dep&&!a.ovf)L=L.concat(['IF'+a.rw,'FA'+a.rw].filter(n=>WP[n]));return L.slice(0,9)},
 (a,g)=>{const p=WP[g];if(!p)return;a.dct=p.slice();a.cleared=false;a.orb=0;atc(a,'proceed direct '+g,'direct '+g)});
def('C','Heading','orb',(a,g)=>'Orbit '+(g==='l'?'left':'right'),a=>O(a)&&PH(a,'air')&&!a.dep&&!a.ils?['l','r']:[],(a,g)=>{a.orb=g==='l'?-1:1;a.dct=null;a.cleared=false;atc(a,'orbit '+(g==='l'?'left':'right'),'orbit '+(g==='l'?'left':'right'))});
def('C','Altitude','alt',(a,g)=>(+g>a.ta?'Climb ':+g<a.ta?'Descend ':'Maintain ')+fl(+g),a=>{if(!(O(a)&&PH(a,'air')&&!a.ils))return[];const L=a.ovf?[24000,26000,28000,30000,32000,34000,36000,38000,40000]:a.dep?[5000,6000,7000,8000,10000,12000,15000,20000,24000,a.fl*100]:[10000,9000,8000,7000,6000,5000,4000,3000];return L.filter(v=>v!==a.ta).map(String)},
 (a,g)=>{const v=+g,up=v>a.ta;a.ta=v;a.exp=0;atc(a,(up?'climb':'descend')+' and maintain '+fl(v),(up?'climb ':'descend ')+fl(v))});
def('C','Altitude','exp',()=>'Expedite climb/descent',a=>one(O(a)&&PH(a,'air')&&!a.ils&&Math.abs(a.ta-a.alt)>500&&!(a.exp>0)),a=>{a.exp=90;atc(a,'expedite '+(a.ta>a.alt?'climb':'descent'),'expediting')});
def('C','Speed','spd',(a,g)=>g==='N'?'Normal speed':'Speed '+g+' kt',a=>{if(!(O(a)&&PH(a,'air')&&!a.ils))return[];return a.ovf?['520','500','480','450','420','N']:a.dep?['320','300','280','250','230','N']:['250','240','230','220','210','200','190','180','170','160','N']},
 (a,g)=>{a.ts=a.ovf?(g==='N'?450:cl(+g,300,520)):g==='N'?(a.dep?250:230):cl(+g,a.dep?180:140,a.dep?320:280);atc(a,g==='N'?'resume normal speed':'speed '+g+' knots','speed '+Math.round(a.ts))});
def('C','Approach','ils',a=>'Cleared ILS runway '+a.rw,a=>one(O(a)&&!a.dep&&PH(a,'air')&&!a.cleared&&!a.ils),a=>{a.cleared=true;a.dct=null;a.orb=0;atc(a,'cleared ILS approach runway '+a.rw,'cleared ILS runway '+a.rw)});
def('C','Approach','cils',()=>'Cancel approach clearance',a=>one(O(a)&&!a.dep&&PH(a,'air')&&(a.cleared||a.ils)),a=>{a.cleared=false;a.ils=false;atc(a,'cancel approach clearance, fly heading '+pad(Math.round(a.hdg)%360||360,3),'cancel approach')});
def('C','Approach','ga',()=>'Go around',a=>one(O(a)&&!a.dep&&PH(a,'air')&&(a.cleared||a.ils)),a=>goAround(a,1));
def('C','Frequency','twr',()=>'Contact Tower',a=>one(O(a)&&!a.dep&&PH(a,'air')&&a.ils),a=>{a.ctrl='T';a.req=null;a.clr=true;atc(a,'contact tower','contact tower');score+=3});
def('C','Frequency','sect',()=>'Contact next sector',a=>one(O(a)&&a.dep&&PH(a,'air')&&a.alt>=9500&&!a.lv),a=>{a.lv=4;a.req=null;atc(a,'contact next sector','contact next sector')});
def('C','Information','qnh',()=>'QNH',a=>one(O(a)&&PH(a,'air')),a=>atc(a,'QNH '+Math.round(WX.q),'QNH '+Math.round(WX.q)));
// info (all modes)
def('GTC','Information','adv',()=>'Advise information '+ATIS.l,a=>one(O(a)&&a.need),a=>{a.need=false;score+=5;atc(a,'advise you have information '+ATIS.l,'information '+ATIS.l)});
// ---------------- UI
const cmdsFor=a=>{const out={};CM.forEach(d=>{if(!d.m.includes(MODE)&&!(CMB&&d.m.includes('G')))return;const ar=d.args(a);ar.forEach(g=>{(out[d.g]=out[d.g]||[]).push([d,g])})});return out};
const GORD=['Identification','Clearance','Clearances','Taxi route','Taxi clearance','Departure','Arrival','Approach','Heading','Altitude','Speed','Movement','Runway','Frequency','Information'];
function ui(){$('sc').textContent=score;$('ln').textContent=land;$('dp').textContent=dpt;$('vi').textContent=viol;$('clk').innerHTML=hm(T)+'Z <small style="color:var(--dim)">'+hm(T+LOFF[ap]*3600)+' LT '+(lt((T/3600)%24)>=6.5&&lt((T/3600)%24)<19.5?'\u2600':'\uD83C\uDF19')+'</small>';$('atl').textContent=ATIS.l;
 const hw=WX.ws*COS(WX.wd-FLW[0]);$('wx').innerHTML=pad(Math.round(WX.wd)%360,3)+'°/'+Math.round(WX.ws)+'kt '+(hw<0?'<span style="color:var(--warn)">TAILWIND</span>':'');
 if(!$('atisBox').hidden)$('atisBox').textContent=atisTxt();
 const L=ac.filter(o=>o.ph!=='parked').sort((a,b)=>((b.req&&(b.ctrl===MODE||b.req==='cross'))-(a.req&&(a.ctrl===MODE||a.req==='cross')))||(b.ctrl===MODE)-(a.ctrl===MODE));
 stripsRender();freqRender();
 const sg=sel?[sel.id,sel.ph,sel.ctrl,sel.cleared,sel.clr,sel.need,infoOpen,sel.req,sel.su,sel.stop,sel.vx,sel.gw,sel.rc,sel.cont,sel.ils,sel.orb,!!sel.dct,sel.pend?sel.pend.length:0,BATCH,sel.dl,sel.cl,GF,sel.ta,sel.ab,sel.lv,sel.dh,!!xAhead(sel),sel.ph==='air'&&!sel.dep?vacCands(sel).length:0,sel.alt>300,sel.alt>=9500,sel.tb?sel.tb.steps.map(q=>q.nm).join('>')+'#':''].join():'';if(sg!==psig){psig=sg;panel()}refresh()}
function panel(){const a=sel,e=$('ctl');if(!a){e.innerHTML='<div class="small">Tap an aircraft or a strip to see its commands.</div>';return}
 const B=(c,t,on)=>`<button data-c="${c}" ${on?'class="on"':''}>${t}</button>`;
 let h=`<div class="row"><b style="color:var(--sel);font-size:15px">${a.cs}</b><span class="small">${a.ovf?'Overflight':a.dep?'Departure':'Arrival'} · ${a.ph==='parked'?'parked, STD '+hm(a.sched):a.ph} · ${OWN[a.ctrl]}${a.req?' · <span style="color:var(--amb)">'+REQL[a.req]+'</span>':''}</span>${B('info','Flight info '+(infoOpen||(IPAD()&&!matchMedia("(pointer:coarse)").matches)?'▴':'▾'))}${B('batch','Confirm mode: '+(BATCH?'ON':'off'),BATCH)}</div>`;
 if(infoOpen||(IPAD()&&!matchMedia("(pointer:coarse)").matches)){const route=a.ovf?`via ${a.ex[0]} · FL${a.fl}`:a.dep?`${A.icao} ${a.rw} ${a.ex[0]} DCT ${a.code} FL${a.fl}`:`${a.code} DCT ${a.fix} ${A.icao} ILS ${a.rw}`;
  h+=`<div class="info"><span>Aircraft</span><span>${a.type} · ${a.radio}</span><span>${a.dep?'To':'From'}</span><span>${a.city} (${a.code})</span><span>Plan</span><span>${route}</span><span>${a.dep?'STD':'STA'}</span><span>${hm(a.sched)}</span><span>Stand</span><span>${a.gate.n}</span><span>ATIS</span><span>information ${a.info}${a.need?' (outdated)':''}</span><span>Now</span><span id="nw"></span></div>`}
 
 if(a.tb)h+=`<div class="small" style="margin-top:6px;color:#e879f9">Taxi route: ${a.tb.steps.length?a.tb.steps.map(q=>q.nm).join(' → '):'pick the first taxiway'} – then pick ${a.dep?'a holding point':'the stand'}.</div>`;
 if(a.pend&&a.pend.length)h+=`<div class="cgl" style="color:#e879f9">Pending – not sent yet</div><div class="cb">${a.pend.map((q,i)=>B('rm:'+i,'× '+q.lab)).join('')}</div><div class="row" style="margin-top:6px">${B('send','✔ Send '+a.pend.length+' instruction'+(a.pend.length>1?'s':''),true)}${B('clrq','Clear')}</div>`;
 const cm=cmdsFor(a);let any=0;
 for(const g of GORD){if(!cm[g])continue;any=1;h+=`<div class="cgl">${g}</div><div class="cb">${cm[g].map(([d,arg])=>B(d.id+'|'+arg,d.lab(a,arg),a.pend&&a.pend.some(q=>q.key===d.id+'|'+arg))).join('')}</div>`}
 if(!any&&!(MODE==='C'&&O(a)&&PH(a,'air')))h+='<div class="small" style="margin-top:6px">'+(O(a)?'No instruction needed right now.':'With '+OWN[a.ctrl]+' – not on your frequency.')+'</div>';
 e.innerHTML=h;refresh()}
function refresh(){const a=sel;if(!a)return;if($('nw'))$('nw').textContent=Math.round(a.alt/100)*100+' ft · '+Math.round(a.s)+' kt · '+pad(Math.round(a.hdg)%360,3)+'°';if(!$('vh'))return;$('vh').textContent=pad(Math.round(a.th)%360,3)+'°';$('va').textContent=Math.round(a.ta/100)*100+' ft';$('vs').textContent=Math.round(a.ts)+' kt'}
function fine(a,c){if(a.ctrl!==MODE)return;
 if(c[0]==='H'){a.ils=false;a.cleared=false;a.wp=null;a.dct=null;a.orb=0;a.th=nrm(a.th+ +c.slice(1));atc(a,'fly heading '+pad(Math.round(a.th)%360||360,3),'heading '+pad(Math.round(a.th)%360||360,3))}
 else if(c[0]==='A'||c[0]==='S'){if(a.ils){say(rc(a)+': unable, established on ILS','plt');return}if(c[0]==='A'){a.ta=cl(a.ta+ +c.slice(1),2000,a.ovf?41000:a.dep?40000:15000);atc(a,(a.ta>a.alt?'climb':'descend')+' '+fl(a.ta),fl(a.ta))}else{a.ts=cl(Math.round(a.ts)+ +c.slice(1),a.ovf?300:a.dep?180:140,a.ovf?520:a.dep?320:280);atc(a,'speed '+Math.round(a.ts)+' knots','speed '+Math.round(a.ts))}}}
function runPend(a){const L=a.pend||[];a.pend=[];L.forEach(q=>q.run())}
$('ctl').onclick=e=>{const b=e.target.closest('button'),a=sel;if(!b||!a)return;const c=b.dataset.c;if(c==='info'){infoOpen=!infoOpen;psig='';ui();return}
 if(c==='batch'){BATCH=!BATCH;psig='';ui();return}
 if(c==='send'){runPend(a);psig='';ui();return}
 if(c==='clrq'){a.pend=[];psig='';ui();return}
 if(c.startsWith('rm:')){(a.pend||[]).splice(+c.slice(3),1);psig='';ui();return}
 if(c.includes('|')){const i=c.indexOf('|'),id=c.slice(0,i),arg=c.slice(i+1),d=CM.find(q=>q.id===id&&q.m.includes(MODE)&&q.args(a).includes(arg));
  if(d){if(BATCH){a.pend=(a.pend||[]).filter(q=>q.id!==id);a.pend.push({id,key:c,lab:d.lab(a,arg),run:()=>{const d2=CM.find(q=>q.id===id&&q.m.includes(MODE)&&q.args(a).includes(arg));if(d2)RUN(d2,a,arg)}})}else RUN(d,a,arg)}psig='';ui();return}
 if(a.ctrl!==MODE)return;
 if(BATCH){(a.pend=a.pend||[]).push({id:'f'+c,key:'f'+c,lab:({H:'HDG',A:'ALT',S:'SPD'})[c[0]]+' '+(+c.slice(1)>0?'+':'')+c.slice(1),run:()=>FINE(a,c)})}else FINE(a,c);
 psig='';ui()};
$('strips').onclick=e=>{const b=e.target.closest('button');if(!b)return;sel=ac.find(a=>a.id==+b.dataset.id)||null;psig='';ui()};
// ---------- zoom / pan / tap
const PT={};let drag=null,pin=0;const zoomBy=f=>{view.r=cl(view.r*f,VR[MODE][1],VR[MODE][2])},pc=()=>Object.keys(PT).length,pd=()=>{const v=Object.values(PT);return Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1])};
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);PT[e.pointerId]=[e.clientX,e.clientY];drag={x:e.clientX,y:e.clientY,vx:view.x,vy:view.y,m:0};pin=pc()===2?pd():0};
cv.onpointermove=e=>{if(!PT[e.pointerId])return;PT[e.pointerId]=[e.clientX,e.clientY];if(pc()===2){const d=pd();if(pin)zoomBy(pin/d);pin=d;drag.m=99}else if(drag){const k=cv.clientWidth/2/view.r,dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.m=Math.max(drag.m,Math.hypot(dx,dy));if(drag.m>6){view.x=drag.vx-dx/k;view.y=drag.vy+dy/k}}};
cv.onpointerup=e=>{const was=drag&&drag.m<6&&pc()===1;delete PT[e.pointerId];if(was){const r=cv.getBoundingClientRect(),k=r.width/2/view.r;let best=null,bd=32;for(const a of ac){if(!vis(a))continue;const p=P(a),d=Math.hypot(r.width/2+(p.x-view.x)*k-(e.clientX-r.left),r.height/2-(p.y-view.y)*k-(e.clientY-r.top));if(d<bd){bd=d;best=a}}
 if(pick){if(best&&best!==pick.a){pick.a.gw=best.id;pick.a.gwT=45;atc(pick.a,'give way to '+rc(best),'giving way to '+rc(best));score+=1}pick=null}
 else if(best){sel=best;psig='';ui()}}if(!pc())drag=null;pin=0};
cv.onpointercancel=e=>{delete PT[e.pointerId];drag=null};cv.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY>0?1.15:.87)},{passive:false});
$('zi').onclick=()=>zoomBy(.7);$('zo').onclick=()=>zoomBy(1.4);$('zf').onclick=()=>{const g=geoOf(ap);view.r=VR[MODE][0];view.x=MODE==='C'?0:g.c[0];view.y=MODE==='C'?0:g.c[1]};
$('atisB').onclick=()=>{const b=$('atisBox');b.hidden=!b.hidden;b.textContent=atisTxt()};
$('pz').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶':'⏸'};
document.querySelectorAll('.sp').forEach(b=>b.onclick=()=>{spd=+b.dataset.s;document.querySelectorAll('.sp').forEach(x=>x.classList.toggle('on',x===b))});
$('vo').onclick=e=>{voice=!voice;e.target.textContent=voice?'🔊':'🔇';if(!voice&&window.speechSynthesis)speechSynthesis.cancel();else say('Voice on')};
let last=performance.now(),acc=0,uiT=0;
function loop(n){const dt=Math.min(.25,(n-last)/1000);last=n;if(!$('game').hidden){if(!paused&&!NET.client){acc+=dt*spd;while(acc>=.5){step(.5);acc-=.5}}uiT+=dt;if(uiT>.4){uiT=0;ui()}draw()}requestAnimationFrame(loop)}
