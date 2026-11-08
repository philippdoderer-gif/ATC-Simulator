Object.assign(AP.MUC,{F:{W:[0,['26R','26L'],['26R','26L'],'26R','26L'],E:[0,['08L','08R'],['08L','08R'],'08L','08R']}});
Object.assign(AP.FRA,{F:{W:[0,['25R','25L'],['25C']],E:[0,['07L','07R'],['07C']]}});
Object.assign(AP.LHR,{F:{W:[0,['27R'],['27L']],E:[0,['09L'],['09R']]}});
let NET={on:false,client:false,staff:new Set(),code:''},FORCEFLOW=null;const HS=m=>NET.on?NET.staff.has(m):(m===MODE||CMB&&(m==='G'||m==='T'));const MTMP=[0,1,5,9,14,17,19,19,15,10,5,1];let CMB=false,GF='D',startH=-1,WT=null,DAYF=1,WPH=0,WP={};
const LOFF={MUC:1,FRA:1,LHR:0},CLD=['CAVOK','FEW 4000FT','SCT 3000FT','BKN 2500FT','BKN 1500FT','BKN 800FT OVC 1200FT','OVC 400FT'];
const PROF={MUC_a:[.1,.05,.02,.02,.05,.5,1,1.1,1.1,1,1.1,1.2,1.2,1.2,1.2,1.2,1.3,1.4,1.5,1.4,1.2,1,.8,.4],MUC_d:[.05,.02,.02,.02,.05,.5,1.4,1.5,1.3,1.1,1.1,1.2,1.2,1.1,1,1.1,1.2,1.3,1.2,1,.8,.6,.3,.1],
 FRA_a:[0,0,0,0,0,1,1.5,1.3,1.2,1.1,1.1,1.3,1.5,1.3,1.1,1.1,1.2,1.4,1.5,1.4,1.3,1.1,.8,.2],FRA_d:[0,0,0,0,0,.1,1.2,1.5,1.4,1.1,1,1.2,1.5,1.2,1,1,1.2,1.4,1.5,1.4,1.2,1,.6,.1],
 LHR_a:[.1,.02,0,0,.5,1.5,1.6,1.4,1.2,1.1,1.1,1.2,1.2,1.2,1.2,1.3,1.3,1.4,1.4,1.3,1.2,1.1,.9,.4],LHR_d:[.05,.02,0,0,0,.2,1,1.4,1.4,1.3,1.2,1.2,1.2,1.1,1.1,1.2,1.3,1.5,1.5,1.4,1.2,1,.7,.2]};
const prof=(k,h)=>{const a=PROF[k],i=Math.floor(h)%24,f=h-Math.floor(h);return a[i]*(1-f)+a[(i+1)%24]*f},lt=h=>(h+LOFF[ap]+24)%24,tempAt=h=>MTMP[new Date().getMonth()]+(ap==='LHR'?2:0)+5*Math.sin((lt(h)-9)/24*6.2832),TV=()=>WX.vis<1.5?15:24,visTxt=v=>v>=10?'10 KM OR MORE':v.toFixed(1)+' KM';
const SPAN={B752:38,A306:45,B763:48,B77F:65,MD11:52,C68A:22,PC24:17,GLF6:30,GL7T:31,CL35:21,C56X:17,F900:19,A319:34,A320:36,A321:36,A220:36,E190:28,E195:29,B738:36,B739:36,A333:60,A359:65,A35K:65,A388:80,B77W:65,B772:61,B789:60,B788:60,B748:68,A346:63};
let ap='MUC',MODE='C',flow='W',A,D,LL,FLW,RW={},ENT={},gates=[],WX,ATIS,ac=[],sel=null,T=0,spd=1,paused=false,score=0,land=0,dpt=0,viol=0,sweep=0,pairs=new Set(),logs=[],uid=1,voice=false,psig='',infoOpen=false,spT=5,burst=0,view={x:0,y:0,r:60},started=false,GR=null,GC=[0,0],BX=null;
const cv=$('cv'),cx=cv.getContext('2d'),GP=['tw0','taxi','lineup','vacate','taxiin','hold','ready','vacated','roll'],IPAD=()=>innerWidth>=820,NM=1852;
const ll=s=>{const m=s.match(/([NS])(\d+) ([\d.]+) ([EW])(\d+) ([\d.]+)/),la=(+m[2]+m[3]/60)*(m[1]=='S'?-1:1),lo=(+m[5]+m[6]/60)*(m[4]=='W'?-1:1);return[la,lo]};
const xy=(la,lo)=>[(lo-LL[1])*60*Math.cos(LL[0]*rad),(la-LL[0])*60],xs=s=>{const p=ll(s);return xy(p[0],p[1])};
const hm=m=>pad(Math.floor(m/3600)%24,2)+':'+pad(Math.floor(m/60)%60,2),OWN={G:'GND',T:'TWR',C:'CTR'};
// ---------- cached geometry per airport
const GEO={};
function geoOf(k){if(GEO[k])return GEO[k];const d=DATA[k],g={};const mk=(rings,ev)=>{const p=new Path2D();for(const c of rings){p.moveTo(c[0]/NM,c[1]/NM);for(let i=2;i<c.length;i+=2)p.lineTo(c[i]/NM,c[i+1]/NM);p.closePath()}return p};
 d.tw=d.ap;g.ap=mk(d.ap);g.bd=mk(d.bd);g.gh=mk(d.gh||[]);g.tm=mk(d.tm||[]);{const t=new Path2D();for(const c of d.sl||[]){t.moveTo(c[0]/NM,c[1]/NM);for(let i=2;i<c.length;i+=2)t.lineTo(c[i]/NM,c[i+1]/NM)}g.sl=t}{const t=new Path2D();for(const c of d.tp){t.moveTo(c[0]/NM,c[1]/NM);for(let i=2;i<c.length;i+=2)t.lineTo(c[i]/NM,c[i+1]/NM)}g.tx=t}let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const c of d.ap.concat(d.tp))for(let i=0;i<c.length;i+=2){x0=Math.min(x0,c[i]);x1=Math.max(x1,c[i]);y0=Math.min(y0,c[i+1]);y1=Math.max(y1,c[i+1])}for(const r of d.rw)for(const p of[r.a,r.b]){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
 g.b=[x0,y0,x1,y1];g.c=[(x0+x1)/2/NM,(y0+y1)/2/NM];g.r=Math.max(x1-x0,y1-y0)/2/NM*1.08;return GEO[k]=g}
// ---------- menu art
const MODES={C:['Center','Radar: vector arrivals to the ILS, climb departures out via their fix.'],T:['Tower','Runways: clear to land, line up, take off. Keep runways free.'],G:['Ground','Aprons and taxiways: push back, taxi to the holding point and to the stands.']};
let selAp='MUC',selMd='C';
function paintCard(cn,k){const g=geoOf(k),d=DATA[k],w=cn.width=600,h=cn.height=300,c=cn.getContext('2d');
 const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#0b1d3a');gr.addColorStop(.55,'#183a5e');gr.addColorStop(1,'#07101e');c.fillStyle=gr;c.fillRect(0,0,w,h);
 c.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<40;i++){c.fillRect((i*97)%w,(i*53)%120,1.2,1.2)}
 const s=Math.min((w-60)/(g.b[2]-g.b[0]),(h-50)/(g.b[3]-g.b[1])),cxm=(g.b[0]+g.b[2])/2,cym=(g.b[1]+g.b[3])/2;
 c.save();c.translate(w/2,h/2+8);c.scale(s*NM/NM,-s);c.scale(NM,NM);c.translate(-cxm/NM,-cym/NM);
 c.shadowColor='rgba(76,201,240,.8)';c.shadowBlur=22;c.fillStyle='#2a6fa6';c.fill(g.ap);c.lineWidth=40/NM;c.lineCap=c.lineJoin='round';c.strokeStyle='#2a6fa6';c.stroke(g.tx);c.shadowBlur=0;c.fillStyle='#bfe6ff';c.globalAlpha=.55;c.fill(g.bd);c.globalAlpha=1;
 c.strokeStyle='#fff';c.lineCap='round';for(const r of d.rw){c.lineWidth=Math.max(r.w,70)/NM;c.beginPath();c.moveTo(r.a[0]/NM,r.a[1]/NM);c.lineTo(r.b[0]/NM,r.b[1]/NM);c.stroke()}c.restore();
 const v=c.createLinearGradient(0,h*.55,0,h);v.addColorStop(0,'rgba(7,16,30,0)');v.addColorStop(1,'rgba(7,16,30,.85)');c.fillStyle=v;c.fillRect(0,0,w,h)}
function icoSvg(m){const st='stroke="#4cc9f0" fill="none" stroke-width="1.6"';const p={
 C:`<g ${st}><circle cx="50" cy="40" r="30"/><circle cx="50" cy="40" r="20"/><circle cx="50" cy="40" r="10"/></g><g class="sweep"><path d="M50 40 L50 10 A30 30 0 0 1 76 25 Z" fill="rgba(94,234,212,.28)"/><line x1="50" y1="40" x2="50" y2="10" stroke="#5eead4" stroke-width="2"/></g><rect x="62" y="48" width="6" height="6" fill="none" stroke="#ffd166"/><rect x="34" y="26" width="5" height="5" fill="none" stroke="#5eead4"/>`,
 T:`<rect x="20" y="62" width="60" height="3" fill="#8296b4"/><rect x="45" y="30" width="10" height="32" fill="#6c7fa3"/><path d="M36 14 H64 L68 30 H32 Z" fill="#4cc9f0" opacity=".85"/><rect x="38" y="19" width="24" height="6" fill="#0b1424"/><path d="M8 70 H92" stroke="#fff" stroke-dasharray="6 5" stroke-width="2"/>`,
 G:`<path d="M10 66 H42 V44 H70 V22 H90" ${st} stroke-width="3" stroke="#ffb454"/><circle cx="90" cy="22" r="4" fill="#ffd166"/><path d="M6 66 l8 -4 v8 z" fill="#5eead4"/><rect x="50" y="52" width="22" height="3" fill="#8296b4"/>`}[m];
 return `<svg class="art" viewBox="0 0 120 60" preserveAspectRatio="xMidYMid meet" style="background:linear-gradient(160deg,#0f2342,#0a1424)"><g transform="translate(10,-2) scale(1,.9)">${p}</g></svg>`}
function buildMenu(){$('apc').innerHTML=Object.keys(AP).map(k=>`<button class="card ${k===selAp?'on':''}" data-a="${k}"><canvas data-k="${k}"></canvas><span class="tag">${AP[k].icao}</span><div class="t"><b>${AP[k].n}</b><span class="small">${DATA[k].rw.map(r=>r.n1+'/'+r.n2).join(' · ')}</span></div></button>`).join('');
 document.querySelectorAll('#apc canvas').forEach(c=>paintCard(c,c.dataset.k));
 $('mdc').innerHTML=Object.keys(MODES).map(k=>`<button class="card ${k===selMd?'on':''}" data-m="${k}">${icoSvg(k)}<div class="t"><b>${MODES[k][0]}</b><span class="small">${MODES[k][1]}</span></div></button>`).join('')}
$('apc').onclick=e=>{const b=e.target.closest('[data-a]');if(b){selAp=b.dataset.a;buildMenu()}};
$('mdc').onclick=e=>{const b=e.target.closest('[data-m]');if(b){selMd=b.dataset.m;buildMenu()}};
$('start').onclick=()=>{startH=+$('stt').value;if(startH===-2)startH=nowLocal(selAp);ap=selAp;MODE=selMd;$('menu').hidden=true;$('game').hidden=false;init();if(!started){started=true;requestAnimationFrame(loop)}};
$('back').onclick=()=>{$('game').hidden=true;$('menu').hidden=false;buildMenu()};
// ---------- sim
function say(s,k){logs.push([s,k||'sys']);if(logs.length>12)logs.shift();const e=$('log');e.innerHTML=logs.map(l=>'<div class="'+l[1]+'">'+l[0]+'</div>').join('');e.scrollTop=1e6;if(k)speak(s,k)}
const rc=a=>a.radio+' '+a.cs.replace(/^[A-Z]+/,''),STN={G:'Ground',T:'Tower',C:'Radar'},REQL={ifr:'CLNC',push:'PUSH',taxi:'TAXI',cross:'CROSS',handoff:'FREQ',dep:'DEP',land:'LAND',radar:'ID'};
function atc(a,t,r){say(rc(a)+', '+t,'atc');if(r!==null)setTimeout(()=>say((r||t)+', '+rc(a),'plt'),650)}
function ask(a,k,t){if(a.req===k)return;a.req=k;if(!NET.on&&MODE==='G'&&!!a.dl!==(GF==='D'))return;if(t)say((a.ctrl==='G'&&a.dl?'Delivery':STN[a.ctrl]||STN[MODE])+', '+rc(a)+', '+t,'plt')}
function speak(s,k){if(!voice||!window.speechSynthesis)return;if(speechSynthesis.pending)speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s.replace(/⚠/g,'').replace(/([A-Z]{3})(\d+)/g,(m,a,b)=>a+' '+b.split('').join(' ')));u.lang='en-GB';u.rate=1.1;u.pitch=k==='plt'?1.25:.85;speechSynthesis.speak(u)}
function geo(a,R){const px=a.x-R.T0.x,py=a.y-R.T0.y;return{dist:-(px*R.dir[0]+py*R.dir[1]),cross:px*R.dir[1]-py*R.dir[0]}}
// ---------- taxi grid + routing (runs on the chart polygons)
function buildGrid(){const cs=6,[x0,y0,x1,y1]=BX,X0=x0-80,Y1=y1+80,w=Math.ceil((x1-x0+160)/cs),h=Math.ceil((y1-y0+160)/cs);
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d',{willReadFrequently:true}),p=new Path2D();
 for(const r of D.ap){p.moveTo((r[0]-X0)/cs,(Y1-r[1])/cs);for(let i=2;i<r.length;i+=2)p.lineTo((r[i]-X0)/cs,(Y1-r[i+1])/cs);p.closePath()}
 g.fill(p);{g.lineWidth=30/cs;g.lineCap=g.lineJoin='round';const q=new Path2D();for(const r of D.tp){q.moveTo((r[0]-X0)/cs,(Y1-r[1])/cs);for(let i=2;i<r.length;i+=2)q.lineTo((r[i]-X0)/cs,(Y1-r[i+1])/cs)}g.stroke(q)}const px=g.getImageData(0,0,w,h).data,pass=new Uint8Array(w*h),rwid=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++)pass[i]=px[i*4+3]>60?1:0;
 const p2=pass.slice();for(let j=1;j<h-1;j++)for(let i=1;i<w-1;i++){const k=j*w+i;if(!pass[k]&&(pass[k-1]&&pass[k+1]||pass[k-w]&&pass[k+w]))p2[k]=1}
 D.rw.forEach((r,ri)=>{const a=r.a,b=r.b,L=Math.hypot(b[0]-a[0],b[1]-a[1]),d=[(b[0]-a[0])/L,(b[1]-a[1])/L],hw=Math.max(r.w,60)/2+24;
  const xa=Math.min(a[0],b[0])-hw,xb=Math.max(a[0],b[0])+hw,ya=Math.min(a[1],b[1])-hw,yb=Math.max(a[1],b[1])+hw;
  for(let j=Math.max(0,Math.floor((Y1-yb)/cs));j<Math.min(h,Math.ceil((Y1-ya)/cs));j++)for(let i=Math.max(0,Math.floor((xa-X0)/cs));i<Math.min(w,Math.ceil((xb-X0)/cs));i++){const X=X0+(i+.5)*cs-a[0],Y=Y1-(j+.5)*cs-a[1],s=X*d[0]+Y*d[1],cr=X*d[1]-Y*d[0];if(s>=0&&s<=L&&Math.abs(cr)<=hw){p2[j*w+i]=1;rwid[j*w+i]=ri+1}}});
 const BR=3,pb=p2.slice();for(let it=0;it<BR;it++){const q=pb.slice();for(let jj=1;jj<h-1;jj++)for(let ii=1;ii<w-1;ii++){const k=jj*w+ii;if(!pb[k]&&(pb[k-1]||pb[k+1]||pb[k-w]||pb[k+w]||pb[k-w-1]||pb[k-w+1]||pb[k+w-1]||pb[k+w+1]))q[k]=1}pb.set(q)}
 const dist=new Float32Array(w*h);for(let i=0;i<w*h;i++)dist[i]=p2[i]?1e4:0;
 for(let j=1;j<h;j++)for(let i=1;i<w-1;i++){const k=j*w+i;if(p2[k])dist[k]=Math.min(dist[k],dist[k-1]+1,dist[k-w]+1,dist[k-w-1]+1.4,dist[k-w+1]+1.4)}
 for(let j=h-2;j>=0;j--)for(let i=w-2;i>0;i--){const k=j*w+i;if(p2[k])dist[k]=Math.min(dist[k],dist[k+1]+1,dist[k+w]+1,dist[k+w+1]+1.4,dist[k+w-1]+1.4)}
 const cost=new Float32Array(w*h);for(let i=0;i<w*h;i++)cost[i]=!pb[i]?0:!p2[i]?7:rwid[i]?34:1+5/(1+dist[i]);
 return{cs,X0,Y1,w,h,pass:pb,rwid,dist,cost}}
const cellOf=(G,x,y)=>{const i=Math.floor((x*NM-G.X0)/G.cs),j=Math.floor((G.Y1-y*NM)/G.cs);return[Math.max(0,Math.min(G.w-1,i)),Math.max(0,Math.min(G.h-1,j))]};
function snapCell(G,i,j){if(G.pass[j*G.w+i])return j*G.w+i;for(let r=1;r<40;r++){let best=-1,bd=1e9;for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const ii=i+di,jj=j+dj;if(ii<0||jj<0||ii>=G.w||jj>=G.h)continue;const k=jj*G.w+ii;if(G.pass[k]){const d=di*di+dj*dj;if(d<bd){bd=d;best=k}}}if(best>=0)return best}return j*G.w+i}
function astar(G,s,t){const w=G.w,N=G.w*G.h,g=new Float32Array(N).fill(1e9),par=new Int32Array(N).fill(-1),cl=new Uint8Array(N),ti=t%w,tj=(t/w)|0;
 const hp=[],pr=[];const push=(k,f)=>{let i=hp.length;hp.push(k);pr.push(f);while(i>0){const q=(i-1)>>1;if(pr[q]<=f)break;hp[i]=hp[q];pr[i]=pr[q];i=q}hp[i]=k;pr[i]=f};
 const pop=()=>{const k=hp[0],lk=hp.pop(),lf=pr.pop();if(hp.length){let i=0;for(;;){let c=2*i+1;if(c>=hp.length)break;if(c+1<hp.length&&pr[c+1]<pr[c])c++;if(pr[c]>=lf)break;hp[i]=hp[c];pr[i]=pr[c];i=c}hp[i]=lk;pr[i]=lf}return k};
 g[s]=0;push(s,0);const H=(k)=>{const dx=Math.abs((k%w)-ti),dy=Math.abs(((k/w)|0)-tj);return Math.max(dx,dy)+.414*Math.min(dx,dy)};
 while(hp.length){const k=pop();if(cl[k])continue;cl[k]=1;if(k===t)break;const ki=k%w,kj=(k/w)|0;
  for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ii=ki+di,jj=kj+dj;if(ii<0||jj<0||ii>=w||jj>=G.h)continue;const n=jj*w+ii;if(!G.pass[n]||cl[n])continue;
   if(di&&dj&&(!G.pass[kj*w+ii]||!G.pass[jj*w+ki]))continue;const ng=g[k]+G.cost[n]*(di&&dj?1.414:1);if(ng<g[n]){g[n]=ng;par[n]=k;push(n,ng+H(n))}}}
 if(par[t]<0&&s!==t)return null;const out=[];for(let k=t;k>=0;k=par[k])out.push(k);return out.reverse()}
function los(G,a,b){const ai=a%G.w,aj=(a/G.w)|0,bi=b%G.w,bj=(b/G.w)|0,n=Math.max(Math.abs(bi-ai),Math.abs(bj-aj));for(let s=0;s<=n;s++){const i=Math.round(ai+(bi-ai)*s/n),j=Math.round(aj+(bj-aj)*s/n),k=j*G.w+i;if(!G.pass[k])return false;if(!G.rwid[k]&&G.dist[k]<2.2&&s>2&&s<n-2)return false;if(G.cost[k]>=7&&!G.rwid[k])return false}return true}
function routeGrid(f,t){const G=GR,a=snapCell(G,...cellOf(G,f[0],f[1])),b=snapCell(G,...cellOf(G,t[0],t[1])),cells=astar(G,a,b);if(!cells)return[[t[0],t[1],0]];
 const pts=[cells[0]];let i=0;while(i<cells.length-1){let j=cells.length-1;while(j>i+1&&!los(G,cells[i],cells[j]))j--;pts.push(cells[j]);i=j}
 const P=pts.map(k=>[(G.X0+((k%G.w)+.5)*G.cs)/NM,(G.Y1-(((k/G.w)|0)+.5)*G.cs)/NM]);P[0]=[f[0],f[1]];P[P.length-1]=[t[0],t[1]];
 const out=[];let inR=0,step=14/NM;for(let q=1;q<P.length;q++){const A0=P[q-1],B0=P[q],L=Math.hypot(B0[0]-A0[0],B0[1]-A0[1]),n=Math.max(1,Math.ceil(L/step));for(let s=1;s<=n;s++){const x=A0[0]+(B0[0]-A0[0])*s/n,y=A0[1]+(B0[1]-A0[1])*s/n,c=cellOf(G,x,y),r=G.rwid[c[1]*G.w+c[0]];out.push([x,y,0,r]);}}
 let was=0;for(let q=0;q<out.length;q++){const r=out[q][3];if(r&&!was){const k=Math.max(0,q-3);if(!out[k][2])out[k][2]=r}was=r}
 return out.map(p=>[p[0],p[1],p[2]])}
// ---------- init
function init(){A=AP[ap];D=DATA[ap];LL=ll(A.arp);flow=FORCEFLOW||(Math.random()<.7?'W':'E');FLW=A.F[flow];RW={};const g=geoOf(ap);BX=g.b;GR=buildGrid();
 D.rw.forEach((r,i)=>{[[r.n1,r.a,r.b],[r.n2,r.b,r.a]].forEach(([id,a,b])=>{const dx=(b[0]-a[0])/NM,dy=(b[1]-a[1])/NM,L=Math.hypot(dx,dy),dir=[dx/L,dy/L];RW[id]={id,ph:i,h:brg(dx,dy),dir,n:[dir[1],-dir[0]],T0:{x:a[0]/NM,y:a[1]/NM},E:[b[0]/NM,b[1]/NM],L,w:Math.max(r.w,60)/NM}})});
 FLW[0]=RW[FLW[1][0]].h;
 gates=D.st.map(s=>({n:s[2],x:s[0]/NM,y:s[1]/NM,use:0,hh:s[3]}));GC=[gates.reduce((s,q)=>s+q.x,0)/gates.length,gates.reduce((s,q)=>s+q.y,0)/gates.length];
 ENT={};Object.values(RW).forEach(R=>{const L=[];D.ac.forEach(a=>{if(a[2]!==R.ph)return;const p=[a[0]/NM,a[1]/NM],px=p[0]-R.T0.x,py=p[1]-R.T0.y,s=px*R.dir[0]+py*R.dir[1],cr=px*R.dir[1]-py*R.dir[0],off=-cr;
   const side=Math.sign(R.dir[0]*py-R.dir[1]*px)||1,cs=[R.T0.x+R.dir[0]*s,R.T0.y+R.dir[1]*s],ou=[(p[0]-cs[0]),(p[1]-cs[1])],ol=Math.hypot(...ou)||1,q=[p[0]+ou[0]/ol*45/NM,p[1]+ou[1]/ol*45/NM];
   let lb='',bd=170;D.lb.forEach(l=>{const d=Math.hypot(l[1]-a[0],l[2]-a[1]);if(d<bd&&/\d/.test(l[0])){bd=d;lb=l[0]}});L.push({s,side,p,q,cs,lb})});
  const cr=Math.sign(R.dir[0]*(GC[1]-R.T0.y)-R.dir[1]*(GC[0]-R.T0.x))||1;L.forEach(e=>e.apron=e.side===cr);L.sort((a,b)=>a.s-b.s);ENT[R.id]=L});
 {const e0=Object.values(ENT).flat()[0],G=GR,s=snapCell(G,...cellOf(G,e0.q[0],e0.q[1])),seen=new Uint8Array(G.w*G.h),st=[s];seen[s]=1;while(st.length){const k=st.pop(),ki=k%G.w,kj=(k/G.w)|0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const ii=ki+di,jj=kj+dj;if(ii<0||jj<0||ii>=G.w||jj>=G.h)continue;const q=jj*G.w+ii;if(G.pass[q]&&!seen[q]){seen[q]=1;st.push(q)}}}
  gates=gates.filter(g=>{const c=cellOf(G,g.x,g.y);return seen[snapCell(G,c[0],c[1])]});GC=[gates.reduce((s,q)=>s+q.x,0)/gates.length,gates.reduce((s,q)=>s+q.y,0)/gates.length]}
 buildTG();
 const h=startH<0?Math.random()*24:(startH-LOFF[ap]+24)%24+Math.random()*.4;T=h*3600;WX={wd:nrm(FLW[0]+Math.random()*80-40),ws:5+Math.random()*10,vis:10,ci:0,cld:CLD[0],t:tempAt(h%24),q:1000+Math.random()*25|0};newTarget();DAYF=.85+Math.random()*.3;WPH=Math.random()*6.28;
 WP={};A.ent.forEach(e=>WP[e[0]]=xs(e[1]));A.ex.forEach(e=>WP[e[0]]=xs(e[1]));FLW[1].forEach(id=>{const R=RW[id];WP['IF'+id]=[R.T0.x-R.dir[0]*15,R.T0.y-R.dir[1]*15];WP['FA'+id]=[R.T0.x-R.dir[0]*8,R.T0.y-R.dir[1]*8]});
 ATIS={l:String.fromCharCode(65+Math.random()*26|0),t:T,s:{wd:WX.wd,ws:WX.ws,q:WX.q,vis:WX.vis,cld:WX.cld,t:WX.t},nx:T+1500+Math.random()*1500};ATIS.prev=ATIS.l;
 ac=[];sel=null;score=0;land=0;dpt=0;viol=0;pairs=new Set();spT=3;burst=0;logs=[];$('log').innerHTML='';psig='\u0000';
 $('ttl').innerHTML=ap+' '+A.icao+' <small>'+MODES[MODE][0]+' · RWY '+FLW[1].join('/')+' in use</small>';$('help').textContent=MODES[MODE][1];
 const VRG=[Math.min(g.r,2.2),.12,Math.min(g.r,2.2)*2.2];VR.G=VRG;VR.T=[g.r*1.2,.12,30];
 view={x:0,y:0,r:VR[MODE][0]};if(MODE!=='C'){view.x=g.c[0];view.y=g.c[1]}if(MODE==='T'){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const id of FLW[1].concat(FLW[2])){const R=RW[id];for(const p of[[R.T0.x,R.T0.y],R.E]){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}}view.x=(x0+x1)/2;view.y=(y0+y1)/2;view.r=Math.max(x1-x0,y1-y0)/2*1.18+.25}
 $('lgd').textContent=MODE==='C'?'Rings in NM · SIDs/STARs schematic':'Map data © OpenStreetMap contributors (ODbL)';
 populate();ovfSpawn(0,2);
 say('Shift started at '+ap+'. ATIS information '+ATIS.l+' is current.');ui();briefing()}
const VR={C:[60,5,130],T:[3,.12,30],G:[1.5,.12,3]};
function pickRoute(dep,al0){const u=Math.random(),src=FORCEK?(FORCEK==='C'?A.CR:A.GR):al0?(al0.k==='C'?A.CR:al0.k==='G'?A.GR:A.R):(u<(A.cg||0)?A.CR:u<(A.cg||0)+(A.ga||0)?A.GR:A.R);let R=src.split(',');if(al0){const own=R.filter(x=>AIRL[x.split(':')[1]]===al0);if(own.length)R=own}c=rnd(R).split(':'),d=DEST[c[0]],al=AIRL[c[1]],dx=(d.lo-LL[1])*COS(LL[0])*60,dy=(d.la-LL[0])*60,b=brg(dx,dy),dist=Math.hypot(dx,dy);return{code:c[0],city:d.c,al,b,dist}}
function mk(dep,std){const o=pickRoute(dep),al=o.al,wide=al.k==='C'?Math.random()<.75:al.k==='G'?Math.random()<.3:o.dist>1500,type=rnd(wide?al.w:al.n),cs=Object.keys(AIRL).find(k=>AIRL[k]===al)+(100+Math.random()*899|0);if(ac.some(x=>x.cs===cs))return;PICKT=type;const g=pickGate(al,cs.slice(0,3),SPAN[type]>40);if(!g)return;
 const list=dep?A.ex:A.ent,best=list.map(f=>({f,d:Math.abs(dif(brg(...xs(f[1])),o.b))})).sort((a,b)=>a.d-b.d)[0].f,fx=xs(best[1]);
 let rw;if(FLW[3]){rw=fx[1]>0?FLW[3]:FLW[4]}else rw=rnd(dep?FLW[2]:FLW[1]);
 const R=RW[rw],a={id:uid++,cs,radio:al.r,type,code:o.code,city:o.city,dep,gate:g,rw,fix:best[0],fl:wide?(dep?380:360):(dep?340:320),t:0,sched:std||T,ph:dep?'parked':'gate',ctrl:'G',kind:al.k,x:g.x,y:g.y,hdg:R.h,alt:0,s:0,th:R.h,ta:0,ts:0,trail:[],info:Math.random()<.78?ATIS.l:ATIS.prev};
 if(dep){a.ex=[best[0],brg(fx[0],fx[1])];a.hdg=g.h!=null?g.h:nrm(R.h+rnd([-90,90,0,180]))}
 else{const dd=Math.hypot(fx[0],fx[1]),k=Math.min(1,52/dd);a.x=fx[0]*k;a.y=fx[1]*k;a.ph='air';a.ctrl='C';a.alt=7000+(Math.random()*3|0)*1000;a.hdg=brg(-a.x,-a.y);a.th=a.hdg;a.ta=a.alt;a.s=a.ts=230;if(ac.some(q=>q.ph==='air'&&Math.hypot(q.x-a.x,q.y-a.y)<7))return}
 g.use=a.id;a.rc=!(HS('C')&&!dep);snap(a);ac.push(a);a.need=a.info!==ATIS.l;
 if(!dep&&HS('C'))ask(a,'radar','inbound via '+a.fix+', '+a.alt+' feet, information '+a.info+'.');return a}
function snap(a){a.p={x:a.x,y:a.y,alt:a.alt,s:a.s,h:a.hdg};a.trail.push([a.x,a.y]);if(a.trail.length>6)a.trail.shift()}
function onRwy(o,R){const px=o.x-R.T0.x,py=o.y-R.T0.y,s=px*R.dir[0]+py*R.dir[1],cr=px*R.dir[1]-py*R.dir[0];return s>-.01&&s<R.L+.01&&Math.abs(cr)<R.w/2+.012}
const occ=(r,ex)=>{const R=RW[r];return ac.some(o=>o!==ex&&o.ph!=='air'&&o.ph!=='gate'&&o.ph!=='push'&&((RW[o.rw].ph===R.ph&&['lineup','ready','roll','vacate'].includes(o.ph))||onRwy(o,R)))},
 arrClose=(r,d)=>ac.some(o=>!o.dep&&RW[o.rw].ph===RW[r].ph&&o.ils&&o.ph==='air'&&geo(o,RW[o.rw]).dist<d),setPh=(a,p)=>{a.ph=p;a.t=0};
const physBusy=(ph,ex)=>{const ids=Object.keys(RW).filter(i=>RW[i].ph===ph);return ids.some(i=>occ(i,ex)||arrClose(i,3.2)||ac.some(o=>o!==ex&&o.rw===i&&o.ph==='roll'))};
function goAround(a,by){a.ils=false;a.cleared=false;a.clr=false;a.wp=null;a.th=RW[a.rw].h;a.ta=3000;a.ts=200;a.ctrl='C';a.req=null;a.cont=false;a.orb=0;a.dct=null;if(by)atc(a,'go around','going around');else say(rc(a)+': going around, runway '+a.rw,'plt')}
const apronSide=e=>e.filter(x=>x.apron);
function depEntry(id){const all=ENT[id].filter(e=>e.depOK!==false),pr=apronSide(all),L=pr.length?pr:all;if(!L.length)return null;const pool=L.filter(e=>e.s<RW[id].L*.35);const P=pool.length?pool:L;return Math.random()<.5?P[0]:rnd(P)}
function arrExit(id){const R=RW[id],all=ENT[id].filter(e=>e.arrOK!==false&&e.s>1250/NM&&e.s<Math.min(2900/NM,R.L*.88));if(!all.length)return ENT[id][ENT[id].length-1];const pr=apronSide(all),L=pr.length&&Math.random()<.8?pr:all;return rnd(L)}
function startTaxi(a,e){e=e||a.ent;a.ent=e;a.req=null;setPh(a,'taxi');a.path=e?route([a.x,a.y],e.q):[[RW[a.rw].T0.x,RW[a.rw].T0.y,0]];a.pi=0;a.stop=false;a.vx=0;a.gw=0}
function startup(a){if(a.ph!=='gate'||a.su)return;a.su=1;a.req=null;a.t=0;atc(a,'start-up approved','start-up approved');score+=1}
function push(a,auto){if(a.ph!=='gate')return;const e=depEntry(a.rw);a.ent=e;a.su=1;a.req=null;setPh(a,'push');if(!auto){atc(a,'pushback approved, expect runway '+a.rw,'pushback approved');score+=3}}
function clearTaxi(a,id,i){if(a.ph!=='tw0')return;const e=ENT[id][i];if(!e)return;a.rw=id;startTaxi(a,e);const t='taxi to holding point runway '+id+(e.lb?' via '+e.lb:'')+', hold short';atc(a,t,t);score+=3}
function toGate(a,auto){if(a.ph!=='vacated')return;setPh(a,'taxiin');a.path=route([a.x,a.y],[a.gate.x,a.gate.y]);a.pi=0;a.stop=false;a.vx=0;a.gw=0;a.req=null;if(!auto){atc(a,'taxi to stand '+a.gate.n,'taxi to stand '+a.gate.n);score+=3}}
function lineup(a,auto){if(a.ph!=='hold')return;if(occ(a.rw,a)){if(!auto)say('Runway '+a.rw+' occupied','sys');return}const e=a.ent;setPh(a,'lineup');a.req=null;a.path=[[e.p[0],e.p[1],0],[e.cs[0],e.cs[1],0]];a.pi=0;if(!auto)atc(a,'runway '+a.rw+', line up and wait','line up and wait runway '+a.rw)}
function clearTO(a,imm){if(!['hold','lineup','ready'].includes(a.ph))return;if(occ(a.rw,a)){say('Runway '+a.rw+' occupied','sys');return}if(arrClose(a.rw,imm?1.6:2.5)){score-=75;viol++;say('⚠ RUNWAY INCURSION '+a.rw+': arrival on short final','sys')}
 a.clr=true;a.imm=!!imm;a.req=null;atc(a,imm?'runway '+a.rw+', cleared immediate takeoff':'wind '+pad(Math.round(WX.wd)%360,3)+' degrees '+Math.round(WX.ws)+' knots, runway '+a.rw+' cleared for takeoff',imm?'immediate takeoff':'cleared for takeoff runway '+a.rw);if(a.ph==='hold')lineup(a,1)}
function cancelTO(a){if(a.ph==='roll'){a.ab=1;a.clr=false;atc(a,'stop immediately, stop immediately','stopping')}else if(['lineup','ready'].includes(a.ph)||a.clr){a.clr=false;a.imm=false;atc(a,'hold position, cancel takeoff clearance','holding position')}}
function vacCands(a){const R=RW[a.rw],g=geo(a,R),sn=Math.max(.15,-g.dist);return ENT[a.rw].filter(e=>e.arrOK!==false&&e.s>sn+.25&&e.s<R.L*.95)}
function vacate(a,kind,i){const L=vacCands(a);let e;if(kind==='x')e=L[+i];else if(kind==='n')e=L[0];else e=L.find(q=>q.side===(kind==='l'?1:-1));if(!e){say(rc(a)+': unable, no suitable exit','plt');return}
 const t=kind==='l'?'vacate left':kind==='r'?'vacate right':kind==='n'?'vacate next exit':'vacate via '+(e.lb||'exit');atc(a,'runway '+a.rw+', '+t,t);score+=2;
 if(a.ph==='air')a.pre=e;else{a.path=[[e.cs[0],e.cs[1],0],[e.p[0],e.p[1],0],[e.q[0],e.q[1],0]];a.pi=0;a.exl=e.lb}}
function toDep(a,cmd){a.ctrl='C';a.req=null;dpt++;a.rc=!HS('C');if(HS('C'))ask(a,'radar','passing '+Math.round(a.alt/100)*100+' feet, climbing '+(a.ta>=10000?'FL'+a.ta/100:a.ta+' feet')+'.');if(cmd){atc(a,'contact departure','contact departure');score+=2}}





function blocked(a){const hx=SIN(a.hdg),hy=COS(a.hdg);return ac.some(o=>o!==a&&GP.includes(o.ph)&&Math.hypot(o.x-a.x,o.y-a.y)<.045&&(o.x-a.x)*hx+(o.y-a.y)*hy>0&&Math.abs(dif(o.hdg,a.hdg))<100)}
function gmove(a,dt,v){const p=a.path[a.pi];if(!p)return true;const dx=p[0]-a.x,dy=p[1]-a.y,d=Math.hypot(dx,dy);if(d>.0003){const th=brg(dx,dy);a.hdg=nrm(a.hdg+cl(dif(th,a.hdg),-90*dt,90*dt))}
 if(a.vx>0)v=a.vx;
 const raw=blocked(a);a.bt=raw?(a.bt||0)+dt:0;if(a.bt>110)a.bt=0;const bl=raw&&a.bt<=90;
 let hold=a.stop||bl;a.xw=false;
 if(a.gw){const o=ac.find(q=>q.id===a.gw);a.gwT-=dt;if(!o||a.gwT<=0||o.ph==='air'||o.ph==='park')a.gw=0;else if(Math.hypot(o.x-a.x,o.y-a.y)<.1)hold=true}
 if(p[2]&&d<.004){if(!HS('C')&&a.xok!==p[2]){hold=true;if(a.req!=='cross'&&(!a.xh||T>=a.xh)){a.xwait=0;const n=D.rw[p[2]-1];ask(a,'cross','holding short runway '+n.n1+'/'+n.n2+', request to cross.')}if(a.req==='cross')a.xwait+=dt;if(a.xwait>75){score-=5;a.xok=p[2];a.req=null;say(rc(a)+': no reply, crossing runway on own initiative.','plt')}}
  else if(physBusy(p[2]-1,a)&&a.xf!==p[2]){hold=true;a.xw=true}}
 a.s=hold?0:v;const st=a.s/3600*dt;if(st>=d){if(!hold){a.x=p[0];a.y=p[1];if(p[2]){a.xok=0;a.xf=0;if(a.req==='cross')a.req=null}a.pi++;return a.pi>=a.path.length}return false}a.x+=dx/d*st;a.y+=dy/d*st;return false}
function auto(a,R,g){if(!a.wp){a.wp=[];if(g.dist<14){const s=g.cross>=0?1:-1;a.wp.push([R.T0.x-R.dir[0]*22+R.n[0]*s*12,R.T0.y-R.dir[1]*22+R.n[1]*s*12])}a.wp.push([R.T0.x-R.dir[0]*13,R.T0.y-R.dir[1]*13])}
 const w=a.wp[0];if(w){const dx=w[0]-a.x,dy=w[1]-a.y;a.th=brg(dx,dy);if(Math.hypot(dx,dy)<2.5)a.wp.shift()}else{a.th=R.h;a.cleared=true}a.ta=Math.min(a.ta,3500);a.ts=220}
function air(a,dt,R){if(a.ovf)return ovfAir(a,dt);const g=geo(a,R);
 if(a.lv>0){a.lv-=dt;if(a.lv<=0){a.gone=1;score+=50;say(rc(a)+': leaving frequency, next '+a.city,'plt');return}}
 if(HS('C')&&a.ctrl==='C'&&!a.rc){a.rt=(a.rt||0)+dt;if(a.rt>120&&!a.rp){a.rp=1;score-=5;say('Unidentified traffic '+a.cs+': radar contact missing','sys')}}
 if(HS('C')&&a.dep&&a.alt>=10000&&a.ctrl==='C'&&!a.req)a.req='handoff';
 if(a.dct){if(Math.hypot(a.dct[0]-a.x,a.dct[1]-a.y)<2)a.dct=null;else if(!a.ils&&HS('C')&&a.ctrl==='C')a.th=brg(a.dct[0]-a.x,a.dct[1]-a.y)}
 if(a.orb)a.th=nrm(a.hdg+a.orb*40);
 if(!a.dep){if(a.ctrl==='C'&&!HS('C')&&!a.ils)auto(a,R,g);
  if(a.cleared&&!a.ils&&g.dist<22&&g.dist>2&&Math.abs(g.cross)<2.5&&Math.abs(dif(a.hdg,R.h))<45&&a.alt<=g.dist*318+1500){a.ils=true;say(a.cs+' established ILS '+a.rw)}
  if(a.ils){a.th=R.h-cl(g.cross*12,-30,30);a.ta=Math.max(0,g.dist*318);a.ts=g.dist<6?140:g.dist<12?170:190;
   if(a.ctrl==='C'&&HS('C')&&g.dist<12&&!a.req)a.req='handoff';
   if(a.ctrl==='C'&&g.dist<7){if(HS('C')){score-=5;say(rc(a)+': no instruction, changing to tower on own initiative.','plt')}a.ctrl='T';a.req=null;if(!HS('T'))a.clr=true}
   if(a.ctrl==='T'&&HS('T')&&!a.clr&&!a.cont&&g.dist<10&&!a.req)ask(a,'land','established ILS runway '+a.rw+', '+Math.round(g.dist)+' miles.');
   if(g.dist<(a.cont?.35:.9)&&a.ctrl==='T'&&(!a.clr||occ(a.rw,a))){if(HS('T'))score-=30;goAround(a)}
   else if(g.dist<=0){const e=a.pre||arrExit(a.rw);a.pre=null;a.cont=false;a.req=null;a.x=R.T0.x+R.dir[0]*.15;a.y=R.T0.y+R.dir[1]*.15;a.alt=0;a.s=110;a.path=e?[[e.cs[0],e.cs[1],0],[e.p[0],e.p[1],0],[e.q[0],e.q[1],0]]:[[R.E[0],R.E[1],0]];a.pi=0;a.exl=e&&e.lb;setPh(a,'vacate');a.clr=false;a.ils=false;score+=100;land++;return}}
 }else{if(a.ctrl==='T'&&a.alt>1000){if(HS('T')){a.req='handoff';if(a.alt>4000){score-=10;toDep(a);say(rc(a)+': no instruction, contacting departure.','plt')}}else toDep(a)}
  if(a.ctrl==='T'&&a.dh!=null&&a.alt>350)a.th=a.dh;
  if(a.ctrl==='C'&&!HS('C')){a.th=a.alt>1500?a.ex[1]:(a.dh==null?R.h:a.dh);if(a.alt>3500)a.ta=12000;a.ts=250}}
 a.hdg=nrm(a.hdg+cl(dif(a.th,a.hdg),-3*dt,3*dt));const r=(a.dep?28:(a.ils?40:30))*(a.exp>0?2:1);if(a.exp>0)a.exp-=dt;a.alt+=cl(a.ta-a.alt,-r*dt,r*dt);a.s+=cl(a.ts-a.s,-1.5*dt,1.5*dt);
 a.x+=SIN(a.hdg)*a.s/3600*dt;a.y+=COS(a.hdg)*a.s/3600*dt;const wv=WX.ws/3600*dt;a.x+=SIN(WX.wd+180)*wv;a.y+=COS(WX.wd+180)*wv;
 if(Math.hypot(a.x,a.y)>60){a.gone=1;if(a.dep&&a.alt>=10000){score+=HS('C')?20:50;say(a.cs+' left the sector, next '+a.city,'sys')}else{score-=50;say(a.cs+' left the sector incorrectly')}}}
function newTarget(){const vr=[10,10,10,9,8,6,4,2.5,1.2,.7,.45,.3],bad=Math.random()<.25;WT={wd:nrm(WX.wd+(Math.random()-.5)*(bad?140:70)),ws:bad?10+Math.random()*14:3+Math.random()*11,vis:bad?vr[4+Math.random()*8|0]:vr[Math.random()*5|0],ci:bad?3+Math.random()*4|0:Math.random()*4|0,t:tempAt((T/3600)%24)+(Math.random()-.5)*4,q:WX.q+(Math.random()-.5)*8,next:T+900+Math.random()*2700}}
function weather(dt){if(T>=WT.next)newTarget();const k=dt/600;WX.wd=nrm(WX.wd+dif(WT.wd,WX.wd)*k+(Math.random()-.5)*.05*dt);WX.ws=cl(WX.ws+(WT.ws-WX.ws)*k+(Math.random()-.5)*.1*dt,1,28);WX.q+=(WT.q-WX.q)*k/3;WX.vis+=(WT.vis-WX.vis)*k*1.5;WX.t+=(WT.t-WX.t)*k/2;if(WX.ci!==WT.ci&&Math.random()<dt/240)WX.ci+=Math.sign(WT.ci-WX.ci);WX.cld=CLD[WX.ci];
 const S=ATIS.s;if(T>=ATIS.nx||Math.abs(dif(WX.wd,S.wd))>35||Math.abs(WX.ws-S.ws)>10||Math.abs(WX.q-S.q)>2||Math.abs(WX.vis-S.vis)>3.5||(WX.vis<1.5)!==(S.vis<1.5)||Math.abs(WX.ci-CLD.indexOf(S.cld))>=2){ATIS.prev=ATIS.l;ATIS.l=String.fromCharCode(65+(ATIS.l.charCodeAt(0)-64)%26);ATIS.t=T;ATIS.nx=T+1800+Math.random()*2400;ATIS.s={wd:WX.wd,ws:WX.ws,q:WX.q,vis:WX.vis,cld:WX.cld,t:WX.t};say('New ATIS information '+ATIS.l+' recorded'+(WX.vis<1.5?' – low visibility procedures':'')+'.');ac.forEach(a=>{if(a.info===ATIS.prev&&Math.random()<.5)a.need=false})}}
function atisTxt(){const S=ATIS.s;return A.icao+' '+A.n.toUpperCase()+' INFORMATION '+ATIS.l+' TIME '+hm(ATIS.t)+'Z.\nEXPECT ILS APPROACH RWY '+FLW[1].join(' AND ')+'. DEPARTURE RWY '+FLW[2].join(' AND ')+'.\n'+(S.vis<1.5?'LOW VISIBILITY PROCEDURES IN OPERATION.\n':'')+'WIND '+pad(Math.round(S.wd)%360,3)+' DEGREES '+Math.round(S.ws)+' KNOTS. VISIBILITY '+visTxt(S.vis)+'. '+S.cld+'.\nTEMPERATURE '+Math.round(S.t)+', QNH '+Math.round(S.q)+'. TRANSITION LEVEL BY ATC.\nADVISE ON INITIAL CONTACT YOU HAVE INFORMATION '+ATIS.l+'.'}
function traffic(dt){const h=lt((T/3600)%24),ra=A.rate*prof(ap+'_a',h),tot=ra*2*DAYF*(1+.35*Math.sin(T/1700+WPH))*(WX.vis<1.5?.7:1);spT-=dt;if(spT>0)return;const act=ac.filter(a=>a.ph!=='parked'&&a.ph!=='park'&&!a.ovf).length;if(act>=(IPAD()?22:16)){spT=10;return}if(tot<.03){spT=120;return}
 mk(false);if(burst>0){burst--;spT=6+Math.random()*12}else{spT=(75+Math.random()*130)/(tot/2);if(tot>1&&Math.random()<.3)burst=3+(Math.random()*5*tot|0);else if(Math.random()<.2)spT+=220}}
function step(dt){T+=dt;weather(dt);ovfSpawn(dt);traffic(dt);
 for(const a of ac){a.t+=dt;const R=RW[a.rw],ph=a.ph;
  if(ph==='gate'){if(!HS('G')&&!CMB){if(a.t>8)push(a,1)}else if(a.dl){if(!a.req&&a.t>6)ask(a,'ifr','stand '+a.gate.n+', information '+a.info+', request IFR clearance to '+a.city+'.');if(a.t>260&&a.req==='ifr'){score-=3;a.cl=1;a.dl=false;a.req=null;a.t=0;say(rc(a)+': no reply from delivery, contacting ground.','plt')}}else if(a.t>6&&!a.req)ask(a,'push',a.su?'ready for pushback.':'stand '+a.gate.n+', information '+a.info+', request start-up and pushback.')}
  else if(ph==='push'){if(pushMove(a,dt)){a.gate.use=0;if(HS('G')||CMB)setPh(a,'tw0');else startTaxi(a)}}
  else if(ph==='tw0'){if(a.t>4&&!a.req)ask(a,'taxi','pushback complete, request taxi.');if(a.t>(a.tb?240:80)){a.tb=null;score-=3;say(rc(a)+': no reply from ground, taxiing to holding point '+a.rw+'.','plt');startTaxi(a)}}
  else if(ph==='taxi'){if(gmove(a,dt,TV())){setPh(a,'hold');a.s=0;a.vx=0;a.ctrl=HS('G')?'G':'T';if(HS('G'))ask(a,'handoff','holding short runway '+a.rw+', request to contact tower.');else if(HS('T'))ask(a,'dep','holding point runway '+a.rw+', ready for departure.')}}
  else if(ph==='hold'){if(HS('T')&&a.hsT&&T>a.hsT&&!a.req){a.hsT=0;ask(a,'dep','holding point runway '+a.rw+', ready for departure.')}a.hdg=nrm(a.hdg+cl(dif(brg(a.ent.cs[0]-a.x,a.ent.cs[1]-a.y),a.hdg),-60*dt,60*dt));if(a.ctrl==='G'){if(a.t>45){score-=3;a.ctrl='T';a.req=null;a.t=0;say(rc(a)+': no instruction, contacting tower.','plt')}}else if(!HS('T')&&a.t>5&&!occ(a.rw,a)&&!arrClose(a.rw,5))lineup(a,1)}
  else if(ph==='lineup'){if(gmove(a,dt,15)){setPh(a,'ready');a.hdg=R.h;a.s=0;if(a.clr)setPh(a,'roll')}}
  else if(ph==='ready'){if(!HS('T')&&a.t>4&&!arrClose(a.rw,3.5))a.clr=true;else if(HS('T')&&a.t>3&&!a.clr&&!a.req)ask(a,'dep','lined up runway '+a.rw+', ready.');if(a.clr){setPh(a,'roll');a.req=null}}
  else if(ph==='roll'){if(a.ab)a.s=Math.max(0,a.s-10*dt);else a.s+=(a.imm?7:4)*dt;a.x+=SIN(a.hdg)*a.s/3600*dt;a.y+=COS(a.hdg)*a.s/3600*dt;if(a.ab&&a.s<=0){a.ab=0;a.imm=false;setPh(a,'ready')}else if(!a.ab&&a.s>=150){setPh(a,'air');a.alt=1;a.ta=5000;a.ts=220;a.th=R.h;a.clr=false;a.imm=false}}
  else if(ph==='vacate'){if(gmove(a,dt,a.pi<1?70:30)){setPh(a,'vacated');a.s=0;if(HS('T')&&!CMB){a.ctrl='T';ask(a,'handoff','vacated runway '+a.rw+(a.exl?' via '+a.exl:'')+'.')}else a.ctrl='G'}}
  else if(ph==='vacated'){if(a.ctrl==='T'){if(a.t>45){score-=5;a.ctrl='G';a.req=null;a.t=0;say(rc(a)+': no instruction, contacting ground.','plt')}}else if(!HS('G')&&!CMB){if(a.t>6)toGate(a,1)}else if(a.t>5&&!a.req)ask(a,'taxi','vacated runway '+a.rw+', request taxi to stand '+a.gate.n+'.')}
  else if(ph==='taxiin'){if(gmove(a,dt,a.pi>=a.path.length-1?6:TV())){setPh(a,'park');a.s=0;if(a.gate.h!=null)a.hdg=a.gate.h}}
  else if(ph==='park'){if(a.t>12)turnaround(a)}
  else if(ph==='parked'){if(T>=a.sched-240){setPh(a,'gate');a.info=Math.random()<.85?ATIS.l:ATIS.prev;a.need=a.info!==ATIS.l;a.req=null;a.cl=0;a.dl=HS('G')}}
  else if(ph==='air')air(a,dt,R)}
 ac=ac.filter(a=>{if(a.gone&&sel===a)sel=null;return!a.gone});
 ac.forEach(a=>a.conf=false);const now=new Set();
 if(HS('C'))for(let i=0;i<ac.length;i++)for(let j=i+1;j<ac.length;j++){const a=ac[i],b=ac[j];if(a.ph!=='air'||b.ph!=='air'||a.ctrl!=='C'||b.ctrl!=='C'||a.alt<300||b.alt<300)continue;
  if(Math.hypot(a.x-b.x,a.y-b.y)<3&&Math.abs(a.alt-b.alt)<1000){a.conf=b.conf=true;const k=a.id+'-'+b.id;now.add(k);if(!pairs.has(k)){viol++;score-=25;say('⚠ Loss of separation: '+a.cs+' / '+b.cs)}}}
 pairs=now;if(sweep<=0){ac.forEach(snap);sweep=4}sweep-=dt}
// ---------- drawing
const vis=a=>MODE==='C'?a.ph==='air':MODE==='G'?a.ph!=='air':true,P=a=>MODE==='C'?a.p:{x:a.x,y:a.y,alt:a.alt,s:a.s,h:a.hdg};
function plane(c,sz,col){c.fillStyle=col;c.beginPath();c.moveTo(0,-sz);c.quadraticCurveTo(sz*.16,-sz*.7,sz*.12,-sz*.15);c.lineTo(sz*.95,sz*.2);c.lineTo(sz*.95,sz*.34);c.lineTo(sz*.12,sz*.14);c.lineTo(sz*.1,sz*.62);c.lineTo(sz*.38,sz*.84);c.lineTo(sz*.38,sz*.95);c.lineTo(0,sz*.86);c.lineTo(-sz*.38,sz*.95);c.lineTo(-sz*.38,sz*.84);c.lineTo(-sz*.1,sz*.62);c.lineTo(-sz*.12,sz*.14);c.lineTo(-sz*.95,sz*.34);c.lineTo(-sz*.95,sz*.2);c.lineTo(-sz*.12,-sz*.15);c.quadraticCurveTo(-sz*.16,-sz*.7,0,-sz);c.fill()}
function draw(){const W=cv.clientWidth,dpr=devicePixelRatio||1;if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(W*dpr)}
 cx.setTransform(dpr,0,0,dpr,0,0);const Rg=view.r,k=W/2/Rg,c=W/2,X=x=>c+(x-view.x)*k,Y=y=>c-(y-view.y)*k,g=geoOf(ap);
 const bgG=cx.createRadialGradient(c,c,W*.1,c,c,W*.8);bgG.addColorStop(0,'#0a1830');bgG.addColorStop(1,'#040a14');cx.fillStyle=bgG;cx.fillRect(0,0,W,W);
 cx.lineWidth=1;cx.font='10px system-ui';
 if(Rg>8){const st=Rg>40?10:Rg>20?5:2;cx.strokeStyle='rgba(76,201,240,.12)';cx.fillStyle='rgba(130,170,220,.55)';for(let r=st;r<=130;r+=st){cx.beginPath();cx.arc(X(0),Y(0),r*k,0,7);cx.stroke();if(Math.abs(X(0)-c)<c)cx.fillText(r+' NM',X(0)+4,Y(0)-r*k+10)}}

 if(Rg<=14){cx.save();cx.setTransform(dpr*k,0,0,-dpr*k,dpr*(c-view.x*k),dpr*(c+view.y*k));const lw=1/k,m=1/NM,det=Rg<=4;cx.lineJoin='round';
  const TWD=22*m;cx.lineCap='square';cx.lineJoin='miter';
  const NT=isNight();cx.strokeStyle=NT?'#4a525c':'#aeb7c2';cx.lineWidth=TWD+2.6*lw;cx.stroke(g.tx);cx.strokeStyle='#6a93c2';cx.lineWidth=2.6*lw;cx.stroke(g.ap);if(g.ln)cx.stroke(g.ln);cx.fillStyle='#6a93c2';cx.fill(g.ap);if(g.ln)cx.fill(g.ln);
  cx.fillStyle=NT?'#1b2e44':'#2a4766';cx.fill(g.ap);if(g.ln)cx.fill(g.ln);cx.strokeStyle=NT?'#2f353d':'#6f7a87';cx.lineWidth=TWD;cx.stroke(g.tx);cx.fillStyle='#071226';cx.fill(g.gh);cx.strokeStyle='#4f74a0';cx.lineWidth=1.4*lw;cx.stroke(g.gh);cx.lineCap='butt';
  if(Rg<=1.3&&g.sl){cx.strokeStyle=NT?'rgba(200,180,110,.2)':'rgba(214,190,110,.4)';cx.lineWidth=Math.max(.7*lw,.8*m);cx.stroke(g.sl)}if(Rg<=3){cx.strokeStyle=NT?'rgba(200,180,110,.22)':'rgba(214,190,110,.4)';cx.lineWidth=Math.max(.7*lw,.8*m);cx.stroke(g.tx)}
  cx.lineJoin='round';cx.strokeStyle=NT?'#7d8aa0':'#c3cede';cx.lineWidth=2*lw;cx.stroke(g.bd);cx.fillStyle=NT?'#4b5466':'#7d8798';cx.fill(g.bd);cx.strokeStyle='#e6edf7';cx.lineWidth=2.6*lw;cx.stroke(g.tm);cx.fillStyle='#aab6c8';cx.fill(g.tm);
  for(const r of D.rw){const a=[r.a[0]/NM,r.a[1]/NM],b=[r.b[0]/NM,r.b[1]/NM],w=Math.max(r.w,60)*m,L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L,nx=-uy,ny=ux,ln=(p,q,wd,col,dash)=>{cx.strokeStyle=col;cx.lineWidth=wd;cx.setLineDash(dash||[]);cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(q[0],q[1]);cx.stroke();cx.setLineDash([])};
   cx.lineCap='butt';ln(a,b,w+4*m,'#7f9cc2');ln(a,b,w,'#0c1118');if(NT&&det){for(const sg of[-1,1]){const o=sg*(w/2+1*m);cx.lineCap='round';ln([a[0]+nx*o,a[1]+ny*o],[b[0]+nx*o,b[1]+ny*o],Math.max(2.4*lw,2.5*m),'rgba(255,240,200,.95)',[.1*m,60*m]);cx.lineCap='butt'}}
   if(det){for(const sg of[-1,1]){const o=sg*(w/2-4*m);ln([a[0]+nx*o,a[1]+ny*o],[b[0]+nx*o,b[1]+ny*o],Math.max(1.4*m,.9*lw),'#e9f2ff')}
    ln([a[0]+ux*70*m,a[1]+uy*70*m],[b[0]-ux*70*m,b[1]-uy*70*m],Math.max(1.3*m,.9*lw),'#e9f2ff',[30*m,20*m]);
    for(const e of[0,1]){const o=e?b:a,sg=e?-1:1;for(let i=-3;i<=3;i++){const f=i*w/8,p0=[o[0]+nx*f+ux*sg*8*m,o[1]+ny*f+uy*sg*8*m];ln(p0,[p0[0]+ux*sg*30*m,p0[1]+uy*sg*30*m],2.6*m,'#e9f2ff')}
     for(const s of[300,450,600]){for(const q of[-1,1]){const f=q*w*.2,p0=[o[0]+nx*f+ux*sg*s*m,o[1]+ny*f+uy*sg*s*m];ln(p0,[p0[0]+ux*sg*22*m,p0[1]+uy*sg*22*m],3*m,'#e9f2ff')}}}}}
  if(det)for(const R of Object.values(RW)){const dg=R.id.replace(/[LRC]/g,''),lt=(R.id.match(/[LRC]/)||[''])[0],sc=(30*m)/72;cx.fillStyle='rgba(233,242,255,.92)';cx.textAlign='center';cx.textBaseline='middle';cx.font='bold 100px system-ui';
   const put=(s,str)=>{cx.save();cx.translate(R.T0.x+R.dir[0]*s*m,R.T0.y+R.dir[1]*s*m);cx.rotate(Math.atan2(R.dir[1],R.dir[0])-Math.PI/2);cx.scale(sc,-sc);cx.fillText(str,0,0);cx.restore()};put(95,dg);if(lt)put(140,lt)}
  cx.textAlign='left';cx.textBaseline='alphabetic';
  if(Rg<=2){for(const R of Object.values(RW))for(const e of ENT[R.id]||[]){const ux=e.qd?e.qd[0]:e.p[0]-e.cs[0],uy=e.qd?e.qd[1]:e.p[1]-e.cs[1],l=Math.hypot(ux,uy)||1,dx=ux/l,dy=uy/l,nx=-dy,ny=dx;cx.strokeStyle='#ffd166';cx.lineWidth=Math.max(1.5*m,.9*lw);for(const o of[0,3.5]){cx.beginPath();cx.moveTo(e.q[0]+dx*o*m+nx*16*m,e.q[1]+dy*o*m+ny*16*m);cx.lineTo(e.q[0]+dx*o*m-nx*16*m,e.q[1]+dy*o*m-ny*16*m);cx.stroke()}}}
  cx.restore()}

 if(Rg>14)for(const R of Object.values(RW)){cx.strokeStyle='#5eead4';cx.lineWidth=2;cx.beginPath();cx.moveTo(X(R.T0.x),Y(R.T0.y));cx.lineTo(X(R.E[0]),Y(R.E[1]));cx.stroke();if(Rg<20){cx.fillStyle='#9fe8d6';cx.font='11px system-ui';cx.fillText(R.id,X(R.T0.x)-10,Y(R.T0.y)-8)}}
 for(const R of Object.values(RW)){if(Rg>3&&FLW[1].includes(R.id)){const d=Math.min(26,Rg*.9);cx.strokeStyle='rgba(94,234,212,.55)';cx.lineWidth=1;cx.setLineDash([4,4]);cx.beginPath();cx.moveTo(X(R.T0.x),Y(R.T0.y));cx.lineTo(X(R.T0.x-R.dir[0]*d),Y(R.T0.y-R.dir[1]*d));cx.stroke();cx.setLineDash([])}}
 if(MODE!=='C'&&Rg<=3.2){cx.font='bold 10px system-ui';cx.lineWidth=3;cx.lineJoin='round';const allL=Rg<=.85,drawn=[];for(const l of D.lb){const big=/^TERMINAL/.test(l[0]),main=/^[A-Z]{1,2}$/.test(l[0]);if(!allL&&!main&&!big)continue;const x=X(l[1]/NM),y=Y(l[2]/NM);if(!allL&&!big&&drawn.some(q=>q[0]===l[0]&&Math.hypot(q[1]-x,q[2]-y)<Rg*110))continue;if(!allL&&drawn.some(q=>Math.hypot(q[1]-x,q[2]-y)<16))continue;if(x>-20&&y>-20&&x<W+20&&y<W+20){drawn.push([l[0],x,y]);cx.strokeStyle='rgba(6,12,22,.9)';cx.strokeText(l[0],x-6,y+3);cx.fillStyle='#ffd166';cx.fillText(l[0],x-6,y+3)}}cx.lineWidth=1}
 if(Rg<=.7){cx.font='9px system-ui';for(const s of gates){const x=X(s.x),y=Y(s.y);if(x<-10||y<-10||x>W+10||y>W+10)continue;cx.fillStyle=s.closed?'rgba(255,93,115,.9)':s.use?'rgba(255,100,100,.5)':'rgba(94,234,212,.7)';cx.fillRect(x-2,y-2,4,4);if(s.closed){cx.strokeStyle='rgba(255,93,115,.9)';cx.beginPath();cx.moveTo(x-5,y-5);cx.lineTo(x+5,y+5);cx.moveTo(x+5,y-5);cx.lineTo(x-5,y+5);cx.stroke()}cx.fillStyle='rgba(180,210,240,.8)';cx.fillText(s.n,x+4,y-3)}}
 else if(Rg<=2.4){for(const s of gates){cx.fillStyle=s.use?'rgba(255,100,100,.4)':'rgba(94,234,212,.35)';cx.fillRect(X(s.x)-1.5,Y(s.y)-1.5,3,3)}}
 if(MODE==='C'||Rg>12){cx.font='10px system-ui';const cl2=p=>{const d=Math.hypot(p[0],p[1]),f=d>57?57/d:1;return[p[0]*f,p[1]*f]};
  for(const e of A.ent){const p=cl2(xs(e[1])),x=X(p[0]),y=Y(p[1]);cx.strokeStyle=cx.fillStyle='#5eead4';cx.strokeRect(x-3,y-3,6,6);cx.fillText(e[0],x+6,y+3)}
  cx.fillStyle='#ffb454';for(const e of A.ex){const p=cl2(xs(e[1]));cx.fillText('→'+e[0],X(p[0])-8,Y(p[1]))}
  cx.fillStyle=cx.strokeStyle='#c9b8ff';for(const id of FLW[1])for(const n of['IF'+id,'FA'+id]){const p=WP[n];if(!p)continue;const x=X(p[0]),y=Y(p[1]);cx.beginPath();cx.moveTo(x,y-5);cx.lineTo(x+5,y+4);cx.lineTo(x-5,y+4);cx.closePath();cx.stroke();cx.fillText(n,x+7,y+3)}}
 if(window.preAc)preAc(X,Y,k,Rg,W);for(const a of ac){if(!vis(a))continue;const p=P(a),mine=O(a),calling=a.ph==='gate'&&a.req&&(MODE!=='G'||O(a)),col=a.emg?'#ff7a8a':a.conf?'#ff5d73':a===sel?'#ffd166':a.ph==='parked'?'#4a5a72':calling?'#ffffff':mine?'#5eead4':'#6f86a8',px=X(p.x),py=Y(p.y);cx.strokeStyle=cx.fillStyle=col;cx.lineWidth=1.5;
  if(MODE==='C'&&a===sel){cx.globalAlpha=.4;a.trail.slice(0,-1).forEach(t=>cx.fillRect(X(t[0])-1.5,Y(t[1])-1.5,3,3));cx.globalAlpha=1}
  const span=(SPAN[a.type]||40)/NM*k,showPlane=Rg<=3.2&&(a.ph!=='air'||MODE!=='C');
  if(showPlane){const sz=Math.max(7,span*.55);cx.save();cx.translate(px,py);cx.rotate(p.h*rad);if(a===sel||a.conf||calling){cx.shadowColor=calling?'rgba(255,255,255,.95)':col;cx.shadowBlur=calling?10+6*Math.sin(performance.now()/250):12}plane(cx,sz,col);cx.restore();cx.shadowBlur=0;if(a.xw){cx.strokeStyle='#ffb454';cx.beginPath();cx.arc(px,py,sz+3,0,7);cx.stroke()}}
  else{cx.strokeRect(px-4,py-4,8,8);if(a.ph==='air'&&MODE!=='G'){const vl=MODE==='C'?p.s/3600*60*k:12;cx.beginPath();cx.moveTo(px,py);cx.lineTo(px+SIN(p.h)*vl,py-COS(p.h)*vl);cx.stroke()}}
  if(a.conf){cx.beginPath();cx.arc(px,py,3*Math.min(k,20),0,7);cx.stroke()}
  if(a.req&&(O(a)||a.req==='cross')&&!(a.ph==='gate'&&MODE==='G'&&!O(a))){cx.save();cx.strokeStyle='#ffb454';cx.globalAlpha=.55+.45*Math.sin(performance.now()/200);cx.lineWidth=2;cx.beginPath();cx.arc(px,py,14,0,7);cx.stroke();cx.restore()}
  cx.font='600 11px system-ui';cx.fillStyle=col;if((a.ph!=='parked'||a===sel||Rg<.2)&&!(a.ovf&&MODE!=='C'&&a!==sel)){cx.fillText(a.cs,px+10,py-6);cx.font='500 10px system-ui';cx.globalAlpha=.75;if(MODE==='C'&&a.ph==='air'){cx.globalAlpha=1;cx.font='600 10px ui-monospace,Menlo,monospace';cx.fillText(pad(Math.round(p.alt/100),3)+(a.ta>p.alt+50?'↑':a.ta<p.alt-50?'↓':' ')+' '+pad(Math.round(p.s/10),2),px+10,py+5);cx.font='500 10px system-ui';cx.globalAlpha=.75;cx.fillText(a.type+' '+(a.ovf?a.ex[0]:a.dep?a.fix:A.icao.slice(0,4)),px+10,py+16)}else cx.fillText(a.type,px+10,py+5);cx.globalAlpha=1;cx.font='600 11px system-ui'}if(a.emg){cx.fillStyle='#ff5d73';cx.fillText(a.emg==='MAYDAY'?'7700 EMERG':'PAN PAN',px+10,py-18);cx.fillStyle=col}if(a===sel)cx.fillText(MODE==='C'?'SQ '+(a.sq||'----'):a.ph,px+10,py+(MODE==='C'?28:17))}
 drawTaxi(X,Y,k,Rg)}
