// ===================== v11: realistic arrival flow (staggered, wake-aware, holding) =====================
const SC={arr:1,dep:1,name:'Standard'};
const ARRCAP=()=>Math.round((IPAD()?9:7)*(SC.arr>1.2?1.3:1));
traffic=function(dt){const h=lt((T/3600)%24),ra=A.rate*prof(ap+'_a',h),tot=ra*2*DAYF*(1+.35*Math.sin(T/1700+WPH))*(WX.vis<1.5?.7:1)*SC.arr;spT-=dt;if(spT>0)return;
 const act=ac.filter(a=>a.ph!=='parked'&&a.ph!=='park'&&!a.ovf).length;if(act>=(IPAD()?22:16)){spT=10;return}if(tot<.03){spT=120;return}
 if(ac.filter(a=>a.ph==='air'&&!a.dep&&!a.ovf).length>=ARRCAP()){spT=15;return}
 const n0=ac.length;mk(false);const a=ac.length>n0?ac[ac.length-1]:null;
 if(a&&a.ph==='air'&&!a.dep){
  // keep 14 NM from every other arrival at the entry point
  if(ac.some(q=>q!==a&&q.ph==='air'&&!q.dep&&!q.ovf&&Math.hypot(q.x-a.x,q.y-a.y)<14)){ac.pop();if(a.gate)a.gate.use=0;spT=14+Math.random()*10;return}
  a.alt=10000+(Math.random()*4|0)*1000;a.ta=a.alt;a.s=a.ts=(WKC(a.type)==='M'?250:270)+(Math.random()*16|0);
  const lead=ARRL;let gap=0;if(lead&&T-lead.t<400){const c=WKC(lead.type);if(c==='J')gap=70;else if(c==='H')gap=35}
  ARRL={t:T,type:a.type};spT=(100+Math.random()*120)/(tot/2)+gap}
 else spT=25}
let ARRL=null;
// initial arrivals: spread along the approach path instead of all sitting at the border
{const _pop=populate;populate=function(){_pop();const L=ac.filter(a=>a.ph==='air'&&!a.dep&&!a.ovf),done=[];
 for(const a of L){const d0=Math.hypot(a.x,a.y)||1;let ok=false;for(let k=0;k<40&&!ok;k++){const d=24+Math.random()*28,x=a.x/d0*d,y=a.y/d0*d;if(done.every(q=>Math.hypot(q.x-x,q.y-y)>14)){a.x=x;a.y=y;ok=true}}
  a.alt=Math.max(6000,Math.min(13000,Math.round((Math.hypot(a.x,a.y)*210+1500)/1000)*1000));a.ta=a.alt;a.s=a.ts=250+(Math.random()*16|0);snap(a);done.push(a)}}}
// holding: fly to a fix and orbit there until given something else
def('C','Heading','hldf',(a,g)=>'Hold at '+g,a=>{if(!(O(a)&&PH(a,'air')&&!a.dep&&!a.ils&&!a.ovf))return[];const d=n=>Math.hypot(WP[n][0]-a.x,WP[n][1]-a.y);return A.ent.map(e=>e[0]).filter(n=>WP[n]&&d(n)>3).sort((p,q)=>d(p)-d(q)).slice(0,3)},
 (a,g)=>{a.dct=WP[g].slice();a.holdAt=1;a.hfix=g;a.orb=0;a.cleared=false;atc(a,'hold at '+g+', expect further clearance','hold at '+g)});
{const _step=step;step=function(dt){_step(dt);for(const a of ac){if(!a.holdAt)continue;if(a.holdAt===1&&!a.dct&&!a.orb){a.orb=1;a.holdAt=2;a.ts=Math.min(a.ts,220);say(rc(a)+': established in the hold at '+a.hfix,'plt')}else if(a.holdAt===2&&!a.orb)a.holdAt=0;else if(a.holdAt===1&&a.orb)a.holdAt=0}}}
// ===================== v11: ground realism =====================
// wing-span aware blocking, slower in turns / low visibility, runway inspection vehicle
blocked=function(a){const hx=SIN(a.hdg),hy=COS(a.hdg),sa=SPAN[a.type]||36;return ac.some(o=>o!==a&&GP.includes(o.ph)&&Math.hypot(o.x-a.x,o.y-a.y)<Math.max(.03,((sa+(SPAN[o.type]||36))/2)/NM+.016)&&(o.x-a.x)*hx+(o.y-a.y)*hy>0&&Math.abs(dif(o.hdg,a.hdg))<100)};
{const _gm=gmove;gmove=function(a,dt,v){if(!a.vx&&a.path&&a.ph!=='vacate'&&a.ph!=='lineup'){const P=a.path,i=a.pi,p0=P[i],p3=P[Math.min(i+4,P.length-1)];
  if(p0&&p3&&p3!==p0){const t1=brg(p0[0]-a.x,p0[1]-a.y),t2=brg(p3[0]-p0[0],p3[1]-p0[1]),tt=Math.abs(dif(t2,t1));if(tt>25)v=Math.min(v,tt>70?7:10)}
  if(WX.vis<1.5)v*=.7}return _gm(a,dt,v)}}
// ---- runway inspection (Tower): an airport vehicle asks to enter a runway for a few minutes
const VEH={st:0,rw:null,t:0,until:0,next:null,msg:0};
const vehOn=rwy=>VEH.st===2&&VEH.rw&&RW[rwy]&&RW[VEH.rw]&&RW[RW[VEH.rw].id||VEH.rw]&&RW[rwy].ph===RW[VEH.rw].ph;
function vehTick(dt){if(NET.client)return;if(VEH.next==null)VEH.next=T+900+Math.random()*1500;
 if(VEH.st===0&&T>=VEH.next&&HS('T')&&WX.vis>=1){const rw=rnd(FLW[2].concat(FLW[1]));VEH.rw=rw;VEH.st=1;VEH.t=T;say('Tower, Airport Operations 2, vehicle request to inspect runway '+rw+'.','plt');VEH.msg=1}
 else if(VEH.st===1&&T-VEH.t>420){VEH.st=0;VEH.next=T+1200;say('Airport Operations 2: no reply, vehicle stays at the holding point.','plt')}
 else if(VEH.st===2){if(T>=VEH.until){say('Airport Operations 2: runway '+VEH.rw+' inspection complete, vacated.','plt');VEH.st=0;VEH.next=T+1500+Math.random()*1800}
  else{for(const a of ac){if(a.ph==='air'&&!a.dep&&(a.cleared||a.ils)&&a.rw&&vehOn(a.rw)){const R=RW[a.rw],d=Math.hypot(a.x-R.T0.x,a.y-R.T0.y);if(d<1.4){goAround(a);say('⚠ '+a.cs+' goes around – vehicle on runway '+a.rw,'sys');score-=10}}}}}}
{const _step=step;step=function(dt){_step(dt);vehTick(dt)}}
// the approval lives in the Tower panel as an aircraft-independent button
function vehButtons(){const host=$('ctl');if(!host)return;let b=$('vehB');if(!(VEH.st>0&&(MODE==='T'||CMB))){if(b)b.remove();return}
 if(!b){b=document.createElement('div');b.id='vehB';b.className='panel';b.style.cssText='border-color:var(--amb)';host.before(b)}
 const h=VEH.st===1?`<div class="small"><b style="color:var(--amb)">Airport Operations 2</b> requests runway <b>${VEH.rw}</b> for inspection (≈4 min)</div><div class="mprole"><button id="vehY" class="on">Approve</button><button id="vehN">Deny</button></div>`:`<div class="small"><b style="color:var(--amb)">Vehicle on runway ${VEH.rw}</b> · ${Math.max(0,Math.round((VEH.until-T)/60*10)/10)} min left – no take-offs or landings</div>`;
 if(b.dataset.h!==h){b.dataset.h=h;b.innerHTML=h;const y=$('vehY');if(y)y.onclick=()=>vehAct(1);const n=$('vehN');if(n)n.onclick=()=>vehAct(0)}}
function vehAct(ok){if(NET.client){NET.send('cmd',{i:0,c:'veh',g:ok?'1':'0'});return}if(VEH.st!==1)return;if(ok){const R=RW[VEH.rw];if(occ(VEH.rw)){say('Runway '+VEH.rw+' is occupied','sys');return}if(arrClose(VEH.rw,3)){say('Traffic on short final – the vehicle must wait','sys');return}VEH.st=2;VEH.until=T+240;say('Airport Operations 2, enter and inspect runway '+VEH.rw+', report vacated.','atc');say('Enter and inspect runway '+VEH.rw+', report vacated, Airport Operations 2','plt')}else{VEH.st=0;VEH.next=T+1200;say('Airport Operations 2, negative, hold position.','atc')}}
setInterval(()=>{try{vehButtons()}catch(e){}},500);
// block clearances while the vehicle is on the runway
for(const d of CM){if(['lu','to','land','cto'].includes(d.id)&&d.m.includes('T')){const f=d.f;d.f=function(a,g){if(a.rw&&vehOn(a.rw)&&d.id!=='cto'){say('Runway '+a.rw+' is occupied by an airport vehicle','sys');score-=25;viol++;return}return f.call(this,a,g)}}}
// vehicle marker on the map
{const _dv=draw;draw=function(){_dv();if(VEH.st!==2)return;try{const R=RW[VEH.rw],W=cv.clientWidth,dpr=devicePixelRatio||1,k=W/2/view.r,c=W/2,fr=Math.min(1,(T-(VEH.until-240))/240),x=R.T0.x+R.dir[0]*1.8*Math.abs(Math.sin(fr*Math.PI*2)),y=R.T0.y+R.dir[1]*1.8*Math.abs(Math.sin(fr*Math.PI*2));cx.save();cx.setTransform(dpr,0,0,dpr,0,0);cx.fillStyle='#ffb454';cx.strokeStyle='#000';cx.lineWidth=1;cx.beginPath();cx.arc(c+(x-view.x)*k,c-(y-view.y)*k,4,0,7);cx.fill();cx.stroke();cx.restore()}catch(e){}}}
