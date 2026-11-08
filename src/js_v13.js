// ===================== v13: radio realism – wrong read-backs, standby, pilot requests =====================
let RBP=.09;REQL.dev='WX';REQL.dreq='DCT';HINT.dev='Weather deviation request: "Approve deviation" or "Negative". Cells are marked red on the radar.';HINT.dreq='Direct request: "Approve direct" if nothing is in the way.';
function mutateRb(s){const o=[];
 let m=s.match(/(heading |hdg )(\d{3})/);if(m){const h=+m[2],n=((h+[-20,-10,10,20][Math.random()*4|0])+360)%360||360;o.push({s:s.replace(m[0],m[1]+String(n).padStart(3,'0')),kind:'hdg',val:n})}
 m=s.match(/FL(\d{2,3})/);if(m){const v=+m[1]+[-20,-10,10,20][Math.random()*4|0];o.push({s:s.replace(m[0],'FL'+v),kind:'alt',val:v*100})}
 m=s.match(/(\d{4,5}) (feet|ft)/);if(m){const v=+m[1]+[-1000,1000][Math.random()*2|0];if(v>=1000)o.push({s:s.replace(m[0],v+' '+m[2]),kind:'alt',val:v})}
 m=s.match(/\b(\d{3})\.(\d{2,3})\b/);if(m){const d=m[2],nd=d.slice(0,-1)+((+d.slice(-1)+5)%10);o.push({s:s.replace(m[0],m[1]+'.'+nd),kind:'frq'})}
 m=s.match(/QNH (\d{4})/);if(m){o.push({s:s.replace(m[0],'QNH '+(+m[1]+[-2,2][Math.random()*2|0])),kind:'qnh'})}
 m=s.match(/runway (\d{2})([LR])/);if(m){o.push({s:s.replace(m[0],'runway '+m[1]+(m[2]==='L'?'R':'L')),kind:'rwy'})}
 return o.length?o[Math.random()*o.length|0]:null}
{const _a=atc;atc=function(a,t,r){if(r!==null&&!NET.client&&!/^negative/i.test(t)&&!a.sqr&&!a.rbw&&!a.nomut&&Math.random()<RBP){const base=(r||t),w=mutateRb(base);if(w){a.rbw={t,orig:base,kind:w.kind,val:w.val,due:T+28,said:w.s};r=w.s}}a.nomut=0;_a(a,t,r)}}
def('G','Information','rbneg',()=>'Negative – I say again (wrong read-back)',a=>one(O(a)&&a.rbw),a=>{const w=a.rbw;a.rbw=null;a.nomut=1;score+=4;atc(a,'negative, I say again: '+w.t,w.orig)});
def('T','Information','rbneg',()=>'Negative – I say again (wrong read-back)',a=>one(O(a)&&a.rbw),a=>{const w=a.rbw;a.rbw=null;a.nomut=1;score+=4;atc(a,'negative, I say again: '+w.t,w.orig)});
def('C','Information','rbneg',()=>'Negative – I say again (wrong read-back)',a=>one(O(a)&&a.rbw),a=>{const w=a.rbw;a.rbw=null;a.nomut=1;score+=4;atc(a,'negative, I say again: '+w.t,w.orig)});
// standby: resets the "no reply" timers of a pending request
for(const m of['G','T','C'])def(m,'Information','stby',()=>'Standby',a=>one(O(a)&&a.req&&(a.sb||0)<3),a=>{a.sb=(a.sb||0)+1;a.t=Math.min(a.t,0);a.xwait=0;atc(a,'standby','standing by')});
// pilot-initiated requests
for(const m of['C'])def(m,'Information','devok',()=>'Approve weather deviation',a=>one(O(a)&&a.req==='dev'),a=>{const c=cellNear(a);let h=a.hdg;if(c){const away=brg(a.x-c.x,a.y-c.y),s=dif(a.hdg,away)>=0?1:-1;h=nrm(away+s*55)}a.th=Math.round(h)%360;a.dct=null;a.req=null;a.devHold=T+240;score+=3;atc(a,'deviation approved, turn '+(dif(a.th,a.hdg)<0?'left':'right')+' heading '+pad(a.th||360,3)+', report clear of weather','deviating, heading '+pad(a.th||360,3)+', will report clear')});
def('C','Information','devno',()=>'Negative – unable deviation',a=>one(O(a)&&a.req==='dev'),a=>{a.req=null;a.devd=2;atc(a,'unable deviation, maintain heading','unable, maintaining heading, will keep an eye on it')});
def('C','Information','dreqok',()=>'Approve direct',a=>one(O(a)&&a.req==='dreq'&&a.ex&&WP[a.ex[0]]),a=>{a.dct=WP[a.ex[0]].slice();a.cleared=false;a.orb=0;a.req=null;score+=2;atc(a,'proceed direct '+a.ex[0],'direct '+a.ex[0])});
def('C','Information','dreqno',()=>'Negative – continue as filed',a=>one(O(a)&&a.req==='dreq'),a=>{a.req=null;atc(a,'negative, continue on present routing','continue present routing')});
function cellNear(a){let b=null,bd=1e9;for(const c of CELLS){const d=Math.hypot(c.x-a.x,c.y-a.y);if(d<bd){bd=d;b=c}}return b}
{const _step=step;step=function(dt){_step(dt);if(NET.client)return;
 for(const a of ac){
  if(a.rbw&&T>=a.rbw.due){const w=a.rbw;a.rbw=null;score-=8;viol+=0;if(w.kind==='hdg'&&!a.ils&&a.ph==='air'){a.th=w.val%360;a.dct=null}else if(w.kind==='alt'&&a.ph==='air'&&!a.ils)a.ta=Math.max(1000,w.val);say('⚠ '+a.cs+' read back "'+w.said+'" – wrong read-back not corrected (−8)','sys')}
  if(a.ph!=='air'||a.ils||a.req||a.ctrl!=='C'||!HS('C'))continue;
  if(!a.devd&&CELLS.length&&!a.ovf){const c=cellNear(a);if(c&&Math.hypot(c.x-a.x,c.y-a.y)<c.r+9&&Math.abs(dif(brg(c.x-a.x,c.y-a.y),a.hdg))<50){a.devd=1;a.devT=T;ask(a,'dev','request deviation around weather.')}}
  if(a.dep&&a.dreqw===undefined)a.dreqw=Math.random()<.25;
  if(a.dep&&a.dreqw&&!a.dreqd&&a.alt>7000&&a.ex&&WP[a.ex[0]]&&!a.dct&&Math.random()<.01){a.dreqd=1;ask(a,'dreq','request direct '+a.ex[0]+'.')}}
 for(const a of ac){if(a.req==='dev'&&T-a.devT>70){a.req=null;const c=cellNear(a);if(c){const away=brg(a.x-c.x,a.y-c.y),s=dif(a.hdg,away)>=0?1:-1;a.th=Math.round(nrm(away+s*55))%360}score-=3;say(rc(a)+': deviating around weather on own initiative, heading '+pad(a.th||360,3),'plt')}
  if(a.req==='dreq'&&T-(a.dreqT||(a.dreqT=T))>120){a.req=null}}}}
