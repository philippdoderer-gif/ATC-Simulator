// ================= taxiway graph, named taxi routes, nose-in stands & pushback =================
let TG=null;
const CW=h=>['north','east','south','west'][Math.round(nrm(h)/90)%4];
function segDist(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1e-9,t=cl(((px-ax)*dx+(py-ay)*dy)/L2,0,1),qx=ax+dx*t,qy=ay+dy*t;return[Math.hypot(px-qx,py-qy),qx,qy,t]}
function buildTG(){
 const S=D.tp.concat(D.tl||[]).map(r=>[r[0],r[1],r[2],r[3]]),n=S.length,cuts=S.map(()=>[0,1]);
 // split segments where they cross or touch (T-junctions)
 for(let i=0;i<n;i++){const[ax,ay,bx,by]=S[i],rx=bx-ax,ry=by-ay,Li=Math.hypot(rx,ry)||1;
  for(let j=i+1;j<n;j++){const[cx_,cy,dx,dy]=S[j];
   if(Math.max(ax,bx)<Math.min(cx_,dx)-6||Math.max(cx_,dx)<Math.min(ax,bx)-6||Math.max(ay,by)<Math.min(cy,dy)-6||Math.max(cy,dy)<Math.min(ay,by)-6)continue;
   const sx=dx-cx_,sy=dy-cy,Lj=Math.hypot(sx,sy)||1,den=rx*sy-ry*sx;
   if(Math.abs(den)>1e-6){const t=((cx_-ax)*sy-(cy-ay)*sx)/den,u=((cx_-ax)*ry-(cy-ay)*rx)/den,et=5/Li,eu=5/Lj;
    if(t>-et&&t<1+et&&u>-eu&&u<1+eu){cuts[i].push(cl(t,0,1));cuts[j].push(cl(u,0,1));continue}}
   // endpoint lying on the other segment
   for(const[px,py,tgt,oth] of[[cx_,cy,i,j],[dx,dy,i,j],[ax,ay,j,i],[bx,by,j,i]]){const s=S[tgt],r=segDist(px,py,s[0],s[1],s[2],s[3]);if(r[0]<6)cuts[tgt].push(r[3])}}}
 const N=[],H=new Map(),E=[],adj=[],seen=new Set();let curVis=1;
 const nid=(x,y)=>{const gx=Math.floor(x/10),gy=Math.floor(y/10);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=H.get((gx+a)+','+(gy+b));if(L)for(const q of L)if(Math.hypot(N[q][0]-x,N[q][1]-y)<7)return q}
  N.push([x,y]);adj.push([]);const kk=gx+','+gy;if(!H.has(kk))H.set(kk,[]);H.get(kk).push(N.length-1);return N.length-1};
 const addE=(u,v)=>{if(u===v)return;const kk=u<v?u+'_'+v:v+'_'+u;if(seen.has(kk))return;seen.add(kk);const L=Math.hypot(N[u][0]-N[v][0],N[u][1]-N[v][1]);E.push({a:u,b:v,L,nm:null,vis:curVis});adj[u].push(E.length-1);adj[v].push(E.length-1)};
 S.forEach((s,i)=>{curVis=i<D.tp.length?1:0;const ts=[...new Set(cuts[i].map(t=>Math.round(t*1e4)/1e4))].sort((p,q)=>p-q);let prev=null;for(const t of ts){const k=nid(s[0]+(s[2]-s[0])*t,s[1]+(s[3]-s[1])*t);if(prev!==null)addE(prev,k);prev=k}});
 curVis=0;
 // close small gaps: dead ends get linked to the nearest other node within 40 m
 for(let i=0;i<N.length;i++){if(adj[i].length!==1)continue;let bj=-1,bd=40;for(let j=0;j<N.length;j++){if(j===i||!adj[j].length)continue;const d=Math.hypot(N[i][0]-N[j][0],N[i][1]-N[j][1]);if(d<bd&&!adj[i].some(e=>E[e].a===j||E[e].b===j)){bd=d;bj=j}}if(bj>=0)addE(i,bj)}
 // join isolated pieces (stand lanes drawn separately on the chart) to the main network
 for(let pass=0;pass<4;pass++){const cm=new Int32Array(N.length).fill(-1);let nc=0;const sz=[];for(let i=0;i<N.length;i++){if(cm[i]>=0||!adj[i].length)continue;const st=[i];cm[i]=nc;let c=0;while(st.length){const u=st.pop();c++;for(const e of adj[u]){const v=E[e].a===u?E[e].b:E[e].a;if(cm[v]<0){cm[v]=nc;st.push(v)}}}sz.push(c);nc++}
  if(nc<2)break;let mc=0;for(let i=1;i<nc;i++)if(sz[i]>sz[mc])mc=i;let done=0;
  for(let c=0;c<nc;c++){if(c===mc)continue;let bi=-1,bj=-1,bd=260;for(let i=0;i<N.length;i++){if(cm[i]!==c)continue;for(let j=0;j<N.length;j++){if(cm[j]!==mc)continue;const d=Math.hypot(N[i][0]-N[j][0],N[i][1]-N[j][1]);if(d<bd){bd=d;bi=i;bj=j}}}if(bi>=0){addE(bi,bj);done++}}
  if(!done)break}
 const oth=(e,v)=>E[e].a===v?E[e].b:E[e].a,dirA=(u,v)=>Math.atan2(N[v][1]-N[u][1],N[v][0]-N[u][0]);
 // ---- names: seed from chart labels, grow along straight continuations (multi-source, nearest first)
 const Q=[];const nameOk=s=>/^[A-Z]{1,2}\d{0,2}[A-Z]?$/.test(s)&&!/^(RWY|APN|TWR)$/.test(s);
 for(const l of D.lb){if(!nameOk(l[0]))continue;let best=-1,bd=70;E.forEach((e,i)=>{const r=segDist(l[1],l[2],N[e.a][0],N[e.a][1],N[e.b][0],N[e.b][1]);if(r[0]<bd){bd=r[0];best=i}});
  if(best<0||E[best].nm)continue;E[best].nm=l[0];Q.push([0,best,E[best].a],[0,best,E[best].b])}
 while(Q.length){let mi=0;for(let i=1;i<Q.length;i++)if(Q[i][0]<Q[mi][0])mi=i;const[d,e,v]=Q.splice(mi,1)[0];if(d>7000)continue;
  const u=oth(e,v),din=dirA(u,v);let bt=99,be=-1;for(const e2 of adj[v]){if(e2===e||E[e2].nm)continue;const t=Math.abs(((dirA(v,oth(e2,v))-din)*180/Math.PI+540)%360-180);if(t<bt){bt=t;be=e2}}
  // stop if an already named edge continues straighter than the free one
  let named=99;for(const e2 of adj[v]){if(e2===e||!E[e2].nm)continue;const t=Math.abs(((dirA(v,oth(e2,v))-din)*180/Math.PI+540)%360-180);named=Math.min(named,t)}
  if(be>=0&&bt<38&&bt<=named){E[be].nm=E[e].nm;Q.push([d+E[be].L,be,oth(be,v)])}}
 TG={N,E,adj,oth};
 TG.rwn=E.map(e=>{for(const v of[e.a,e.b])for(const r of D.rw){const ax=r.a[0],ay=r.a[1],bx=r.b[0],by=r.b[1];if(segDist(N[v][0],N[v][1],ax,ay,bx,by)[0]<28)return 1}return 0});
 // ---- stands: nose towards the building, pushback point on the apron lane behind the tail
 const bdc=(D.bd||[]).map(b=>{let x=0,y=0;const m=b.length/2;for(let i=0;i<b.length;i+=2){x+=b[i];y+=b[i+1]}return[x/m,y/m]});
 for(const g of gates){const gx=g.x*NM,gy=g.y*NM;let best=null;
  for(const only of[1,0]){best=null;for(const e of E){if(only&&!e.vis)continue;const r=segDist(gx,gy,N[e.a][0],N[e.a][1],N[e.b][0],N[e.b][1]);if(r[0]>=18&&(!best||r[0]<best[0])){if(g.hh!=null){const tx=-SIN(g.hh),ty=-COS(g.hh);if(((r[1]-gx)*tx+(r[2]-gy)*ty)<r[0]*.6)continue}best=[r[0],r[1],r[2],e]}}if(best&&best[0]<220)break}
  let h,pb,ld;
  if(best&&best[0]<220){h=g.hh!=null?g.hh:brg(gx-best[1],gy-best[2]);pb=[best[1],best[2]];const e=best[3];ld=brg(N[e.b][0]-N[e.a][0],N[e.b][1]-N[e.a][1])}
  else{let c=null,cd=1e9;for(const q of bdc){const d=Math.hypot(q[0]-gx,q[1]-gy);if(d<cd){cd=d;c=q}}h=c?brg(c[0]-gx,c[1]-gy):0;pb=[gx-SIN(h)*60,gy-COS(h)*60];ld=nrm(h+90)}
  g.h=h;g.pb=[pb[0]/NM,pb[1]/NM];g.fd=[nrm(ld),nrm(ld+180)];g.node=nearNode(pb[0],pb[1])}
 // stand lanes: a paved strip from every stand to its taxiway, so each stand is part of one continuous apron surface
 {const q=new Path2D(),hw=17;let cnt=0;for(const g of gates){if(!g.pb)continue;const gx=g.x*NM,gy=g.y*NM,px=g.pb[0]*NM,py=g.pb[1]*NM,L=Math.hypot(px-gx,py-gy);if(L<14||L>240)continue;const ux=(px-gx)/L,uy=(py-gy)/L,nx=-uy*hw,ny=ux*hw,ex=ux*10,ey=uy*10;
  q.moveTo((gx+nx-ex)/NM,(gy+ny-ey)/NM);q.lineTo((px+nx+ex)/NM,(py+ny+ey)/NM);q.lineTo((px-nx+ex)/NM,(py-ny+ey)/NM);q.lineTo((gx-nx-ex)/NM,(gy-ny-ey)/NM);q.closePath();cnt++}
  geoOf(ap).ln=(ap==='LHR'||ap==='FRA')?null:q}
 // holding points: walk outwards along the real taxiway until ~95 m from the runway centreline
 for(const id in ENT){const R=RW[id];let sg=1;const off=v=>sg*((N[v][0]/NM-R.T0.x)*R.dir[1]-(N[v][1]/NM-R.T0.y)*R.dir[0])*NM;
  for(const e of ENT[id]){sg=Math.sign((e.p[0]-R.T0.x)*R.dir[1]-(e.p[1]-R.T0.y)*R.dir[0])||1;let cur=nearNode(e.p[0]*NM,e.p[1]*NM),prev=-1;const HP=95;
   for(let it=0;it<40&&cur>=0&&off(cur)<HP;it++){let bw=-1,bo=off(cur)+0.5;for(const ed of adj[cur]){const w=oth(ed,cur);if(w===prev)continue;const o=off(w);if(o>bo){bo=o;bw=w}}if(bw<0)break;prev=cur;cur=bw}
   if(cur<0){e.node=nearNode(e.q[0]*NM,e.q[1]*NM);continue}
   let qx=N[cur][0],qy=N[cur][1];if(prev>=0){const o0=off(prev),o1=off(cur);if(o1>HP&&o1>o0){const t=(HP-o0)/(o1-o0);qx=N[prev][0]+(N[cur][0]-N[prev][0])*t;qy=N[prev][1]+(N[cur][1]-N[prev][1])*t}
    e.qd=[(N[cur][0]-N[prev][0]),(N[cur][1]-N[prev][1])]}
   e.q=[qx/NM,qy/NM];e.node=cur;
   if(e.qd){const l=Math.hypot(...e.qd),ox=e.qd[0]/l,oy=e.qd[1]/l,ang=(x,y)=>Math.acos(cl(x*R.dir[0]+y*R.dir[1],-1,1))*180/Math.PI;e.depOK=ang(-ox,-oy)<=115;e.arrOK=ang(ox,oy)<=115}}}
 for(const a of ac)if(a.ph==='gate'&&a.gate.h!=null)a.hdg=a.gate.h}

// ---- routing on the real taxiway graph (replaces the free-space grid search for ground movement)
function routeEdge(x,y){let best=null;for(let i=0;i<TG.E.length;i++){const e=TG.E[i],r=segDist(x,y,TG.N[e.a][0],TG.N[e.a][1],TG.N[e.b][0],TG.N[e.b][1]);if(!best||r[0]<best[0])best=[r[0],r[1],r[2],i]}return best}
function route(f,t){if(!TG||!TG.rwn)return routeGrid(f,t);const{N,E,adj,oth}=TG,n=N.length,fx=f[0]*NM,fy=f[1]*NM,tx=t[0]*NM,ty=t[1]*NM,ps=routeEdge(fx,fy),pt=routeEdge(tx,ty);
 if(!ps||!pt)return routeGrid(f,t);
 const dist=new Float64Array(n).fill(Infinity),pe=new Int32Array(n).fill(-1),done=new Uint8Array(n),open=[];
 const es=E[ps[3]],et=E[pt[3]];
 for(const v of[es.a,es.b]){const d=Math.hypot(N[v][0]-ps[1],N[v][1]-ps[2]);if(d<dist[v]){dist[v]=d;open.push(v)}}
 const same=ps[3]===pt[3];
 while(open.length){let mi=0;for(let i=1;i<open.length;i++)if(dist[open[i]]<dist[open[mi]])mi=i;const u=open.splice(mi,1)[0];if(done[u])continue;done[u]=1;
  for(const e of adj[u]){const v=oth(e,u),nd=dist[u]+E[e].L*(TG.rwn[e]?30:1);if(nd<dist[v]){dist[v]=nd;pe[v]=e;open.push(v)}}}
 let bv=-1,bc=Infinity;for(const v of[et.a,et.b]){const c=dist[v]+Math.hypot(N[v][0]-pt[1],N[v][1]-pt[2]);if(c<bc){bc=c;bv=v}}
 const direct=Math.hypot(ps[1]-pt[1],ps[2]-pt[2]);
 if(bv<0||!isFinite(bc))return routeGrid(f,t);
 const nodes=[];let v=bv;nodes.push(v);while(pe[v]>=0&&!(v===es.a||v===es.b)){v=oth(pe[v],v);nodes.push(v)}nodes.reverse();
 const pts=[[f[0],f[1]]];
 if(same&&direct<bc-1){pts.push([ps[1]/NM,ps[2]/NM],[pt[1]/NM,pt[2]/NM])}
 else{pts.push([ps[1]/NM,ps[2]/NM]);for(const q of nodes)pts.push([N[q][0]/NM,N[q][1]/NM]);pts.push([pt[1]/NM,pt[2]/NM])}
 pts.push([t[0],t[1]]);
 // drop spurs: a point that doubles back onto the previous segment
 const o=[pts[0]];for(let i=1;i<pts.length;i++){const p=pts[i],l=o[o.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])*NM<0.5)continue;o.push(p)}
 return densify(o)}
function nearNode(x,y,h){const N=TG.N;let b=-1,bd=1e9;for(let i=0;i<N.length;i++){if(!TG.adj[i].length)continue;let d=Math.hypot(N[i][0]-x,N[i][1]-y);if(h!=null&&d>8&&Math.abs(dif(brg(N[i][0]-x,N[i][1]-y),h))>100)d+=400;if(d<bd){bd=d;b=i}}return b}
// Dijkstra restricted to edges whose name is free (unnamed) or the current taxiway
function tgSearch(s,cur,hdg){const{N,E,adj,oth}=TG,n=N.length,dist=new Float64Array(n).fill(Infinity),pe=new Int32Array(n).fill(-1),done=new Uint8Array(n);dist[s]=0;
 const open=[s];while(open.length){let mi=0;for(let i=1;i<open.length;i++)if(dist[open[i]]<dist[open[mi]])mi=i;const u=open.splice(mi,1)[0];if(done[u])continue;done[u]=1;if(dist[u]>4500)break;
  for(const e of adj[u]){const nm=E[e].nm;if(nm&&nm!==cur)continue;const v=oth(e,u);if(u===s&&hdg!=null&&Math.abs(dif(brg(N[v][0]-N[u][0],N[v][1]-N[u][1]),hdg))>110)continue;
   const nd=dist[u]+E[e].L;if(nd<dist[v]){dist[v]=nd;pe[v]=e;open.push(v)}}}
 return{dist,pe}}
function tgPath(sr,t){const out=[t];let v=t;while(sr.pe[v]>=0){v=TG.oth(sr.pe[v],v);out.push(v)}return out.reverse()}
function tbEnd(a){const t=a.tb;return t.steps.length?t.steps[t.steps.length-1].nodes.slice(-1)[0]:t.start}
function tbCompute(a){const t=a.tb,s=tbEnd(a),cur=t.steps.length?t.steps[t.steps.length-1].nm:null,sr=tgSearch(s,cur,t.steps.length?null:t.h0),{E}=TG,names={};
 E.forEach(e=>{if(!e.nm||e.nm===cur||t.steps.some(q=>q.nm===e.nm))return;for(const v of[e.a,e.b]){const d=sr.dist[v];if(d<4500&&(!names[e.nm]||d<names[e.nm][0]))names[e.nm]=[d,v]}});
 t.names=Object.entries(names).sort((p,q)=>p[1][0]-q[1][0]).slice(0,10).map(([k,v])=>[k,v[1]]);
 t.hps=[];if(a.dep)for(const id of FLW[2])ENT[id].forEach((e,i)=>{if(e.depOK!==false&&e.node>=0&&sr.dist[e.node]<5000)t.hps.push([id+'.'+i,sr.dist[e.node]])});t.hps.sort((p,q)=>p[1]-q[1]);t.hps=t.hps.slice(0,6).map(p=>p[0]);
 t.stand=!a.dep&&a.gate.node>=0&&sr.dist[a.gate.node]<5000;t.sr=sr}
function tbStart(a){const h=a.ph==='tw0'?a.hdg:null;a.tb={start:nearNode(a.x*NM,a.y*NM,h),h0:h,steps:[]};tbCompute(a)}
function tbVia(a,nm){const t=a.tb,c=t.names.find(q=>q[0]===nm);if(!c)return;t.steps.push({nm,nodes:tgPath(t.sr,c[1])});tbCompute(a)}
function tbUndo(a){a.tb.steps.pop();tbCompute(a)}
function tbPts(a){const t=a.tb,N=TG.N,pts=[[a.x,a.y]];const add=v=>{const p=[N[v][0]/NM,N[v][1]/NM],l=pts[pts.length-1];if(Math.hypot(p[0]-l[0],p[1]-l[1])>1e-5)pts.push(p)};add(t.start);for(const s of t.steps)s.nodes.forEach(add);return pts}
function tbFinish(a,arg){const t=a.tb,via=t.steps.map(s=>s.nm),vt=via.length?' via '+via.join(', '):'';
 if(arg==='stand'){const nodes=tgPath(t.sr,a.gate.node),pts=tbPts(a),N=TG.N;nodes.forEach(v=>pts.push([N[v][0]/NM,N[v][1]/NM]));pts.push([a.gate.pb[0],a.gate.pb[1]],[a.gate.x,a.gate.y]);
  setPh(a,'taxiin');a.path=densify(pts);a.pi=0;a.stop=false;a.vx=0;a.gw=0;a.req=null;a.tb=null;const s='taxi to stand '+a.gate.n+vt;atc(a,s,s);score+=via.length?5:3;return}
 const[id,i]=arg.split('.'),e=ENT[id][+i];if(!e)return;const nodes=tgPath(t.sr,e.node),pts=tbPts(a),N=TG.N;nodes.forEach(v=>pts.push([N[v][0]/NM,N[v][1]/NM]));pts.push([e.q[0],e.q[1]]);
 a.rw=id;a.ent=e;setPh(a,'taxi');a.path=densify(pts);a.pi=0;a.stop=false;a.vx=0;a.gw=0;a.req=null;a.tb=null;
 const v2=via.length&&via[via.length-1]===e.lb?via.slice(0,-1):via,s='taxi to holding point '+(e.lb?e.lb+' ':'')+'runway '+id+(v2.length?' via '+v2.join(', '):'')+', hold short';atc(a,s,s);score+=via.length?5:3}
// polyline (NM) -> 14 m steps with runway-crossing hold points (same rules as route())
function densify(P){const G=GR,out=[],step=14/NM;out.push([P[0][0],P[0][1],0,0]);for(let q=1;q<P.length;q++){const A0=P[q-1],B0=P[q],L=Math.hypot(B0[0]-A0[0],B0[1]-A0[1]),n=Math.max(1,Math.ceil(L/step));for(let s=1;s<=n;s++){const x=A0[0]+(B0[0]-A0[0])*s/n,y=A0[1]+(B0[1]-A0[1])*s/n,c=cellOf(G,x,y),r=G.rwid[c[1]*G.w+c[0]]||0;out.push([x,y,0,r])}}
 let was=0;for(let q=0;q<out.length;q++){const r=out[q][3];if(r&&!was){const k=Math.max(0,q-3);if(!out[k][2])out[k][2]=r}was=r}return out.slice(1).map(p=>[p[0],p[1],p[2]])}
// ---- pushback
function pushStart(a,face,withStart,auto){if(a.ph!=='gate')return;const g=a.gate;let fh=g.fd?g.fd.find(h=>CW(h)===face):null;
 if(fh==null&&g.fd){const e=depEntry(a.rw),tg=e?e.q:[RW[a.rw].T0.x,RW[a.rw].T0.y],b=brg(tg[0]-g.pb[0],tg[1]-g.pb[1]);fh=Math.abs(dif(g.fd[0],b))<Math.abs(dif(g.fd[1],b))?g.fd[0]:g.fd[1]}
 a.face=fh;a.pst=0;a.ent=depEntry(a.rw);a.su=1;a.req=null;setPh(a,'push');
 if(!auto){const t=(withStart?'push and start approved':'pushback approved')+(fh!=null?', face '+CW(fh):'');atc(a,t,t);score+=withStart?4:3}}
function push(a,auto){pushStart(a,null,true,auto)}
function pushMove(a,dt){const g=a.gate;if(!g.pb){a.s=0;return a.t>15}
 if(a.pst===0){const dx=g.pb[0]-a.x,dy=g.pb[1]-a.y,d=Math.hypot(dx,dy),st=4/3600*dt;a.s=4;if(a.t<4){a.s=0;return false}if(d<=st){a.x=g.pb[0];a.y=g.pb[1];a.pst=1}else{a.x+=dx/d*st;a.y+=dy/d*st}return false}
 if(a.pst===1){const df=dif(a.face==null?a.hdg:a.face,a.hdg);a.s=2;if(Math.abs(df)<1.5){if(a.face!=null)a.hdg=a.face;a.pst=2;a.t=0;a.s=0;return false}a.hdg=nrm(a.hdg+cl(df,-7*dt,7*dt));return false}
 a.s=0;if(!a.est)a.est=25+Math.random()*35;return a.t>a.est}
function toGate(a,auto){if(a.ph!=='vacated')return;setPh(a,'taxiin');const g=a.gate;a.path=g.pb?route([a.x,a.y],g.pb).concat([[g.x,g.y,0]]):route([a.x,a.y],[g.x,g.y]);a.pi=0;a.stop=false;a.vx=0;a.gw=0;a.req=null;a.tb=null;if(!auto){atc(a,'taxi to stand '+g.n,'taxi to stand '+g.n);score+=3}}
// ---- drawing: taxi routes with direction arrows, route builder preview, pushback
function drawRoute(X,Y,pts,col,w,dash,arrows){if(pts.length<2)return;cx.strokeStyle=col;cx.lineWidth=w;cx.setLineDash(dash||[]);cx.beginPath();cx.moveTo(X(pts[0][0]),Y(pts[0][1]));for(const p of pts)cx.lineTo(X(p[0]),Y(p[1]));cx.stroke();cx.setLineDash([]);
 if(!arrows)return;cx.fillStyle=col;let acc=0;for(let i=1;i<pts.length;i++){const x0=X(pts[i-1][0]),y0=Y(pts[i-1][1]),x1=X(pts[i][0]),y1=Y(pts[i][1]),l=Math.hypot(x1-x0,y1-y0);acc+=l;if(acc>70&&l>0.5){acc=0;const an=Math.atan2(y1-y0,x1-x0);cx.save();cx.translate(x1,y1);cx.rotate(an);cx.beginPath();cx.moveTo(5,0);cx.lineTo(-4,-4);cx.lineTo(-4,4);cx.closePath();cx.fill();cx.restore()}}}
function drawTaxi(X,Y,k,Rg){if(MODE==='C'||Rg>3.2)return;
 for(const a of ac){if(!['taxi','taxiin','vacate','lineup'].includes(a.ph)||!a.path)continue;const own=a.ctrl===MODE,me=a===sel;if(!me&&!own)continue;
  const pts=[[a.x,a.y]].concat(a.path.slice(a.pi));drawRoute(X,Y,pts,me?'rgba(255,209,102,.9)':'rgba(94,234,212,.35)',me?2.5:1.5,me?null:[5,5],me||Rg<1.2);
  const e=pts[pts.length-1];if(me){cx.strokeStyle='#ffd166';cx.lineWidth=2;cx.beginPath();cx.arc(X(e[0]),Y(e[1]),5,0,7);cx.stroke()}}
 for(const a of ac){if(a.ph!=='push'||!a.gate.pb)continue;cx.strokeStyle='rgba(255,180,84,.8)';cx.setLineDash([3,3]);cx.lineWidth=1.5;cx.beginPath();cx.moveTo(X(a.x),Y(a.y));cx.lineTo(X(a.gate.pb[0]),Y(a.gate.pb[1]));cx.stroke();cx.setLineDash([])}
 const a=sel;if(a&&a.tb&&TG){const t=a.tb,N=TG.N,{E}=TG;
  // highlight the taxiways that can be chosen next
  const cand=new Set(t.names.map(q=>q[0]));cx.lineWidth=4;cx.strokeStyle='rgba(201,184,255,.35)';cx.beginPath();for(const e of E)if(cand.has(e.nm)){cx.moveTo(X(N[e.a][0]/NM),Y(N[e.a][1]/NM));cx.lineTo(X(N[e.b][0]/NM),Y(N[e.b][1]/NM))}cx.stroke();
  cx.font='bold 11px system-ui';const done=new Set();for(const[nm,v]of t.names){if(done.has(nm))continue;done.add(nm);const x=X(N[v][0]/NM),y=Y(N[v][1]/NM);cx.fillStyle='rgba(20,10,40,.85)';cx.fillRect(x-2,y-13,cx.measureText(nm).width+6,15);cx.fillStyle='#c9b8ff';cx.fillText(nm,x+1,y-2)}
  for(const id of t.hps){const[r,i]=id.split('.'),e=ENT[r][+i];cx.fillStyle='#ffd166';cx.font='bold 10px system-ui';cx.fillText('HP '+r+(e.lb?' '+e.lb:''),X(e.q[0])+6,Y(e.q[1])+12)}
  drawRoute(X,Y,tbPts(a),'#e879f9',3,null,true)}}
