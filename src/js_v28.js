/* v28: stand/taxiway data clean-up – MARS stands block each other, no taxiway labels on runways */
for(const k in DATA){const d=DATA[k];if(!d||!d.lb||!d.rw)continue;
 if(d.st)d.st=d.st.filter(s=>!(k==='FRA'&&(s[2]==='N'||s[2]==='N4')));
 d.lb=d.lb.filter(l=>!/^(TERMINAL|PIER|SATELLIT|CENTER|CENTRE)/i.test(l[0]));
 d.lbAll=d.lb;d.lbShow=d.lb.filter(l=>!d.rw.some(r=>{const ax=r.a[0],ay=r.a[1],bx=r.b[0],by=r.b[1],L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,s=(l[1]-ax)*ux+(l[2]-ay)*uy,o=Math.abs((l[1]-ax)*uy-(l[2]-ay)*ux);return s>-30&&s<L+30&&o<Math.max(r.w,45)/2+12}))}
{const _i=init;init=function(...a){for(const k in DATA)if(DATA[k]&&DATA[k].lbAll)DATA[k].lb=DATA[k].lbAll;const r=_i.apply(this,a);if(D&&D.lbShow)D.lb=D.lbShow;try{const G=geoOf(ap);G.ln=null;G.sl=null}catch(e){}return r}}
{const _pg=pickGate;pickGate=function(...a){const tmp=[];try{
  for(const q of ac)if(q.gate&&q.gate.x!=null)q.gate.usp=Math.max(q.gate.usp||0,SPAN[q.type]||36);
  for(const g of gates){if(!g.mars){g.mars=gates.filter(h=>h!==g&&Math.hypot(h.x-g.x,h.y-g.y)*NM<26)}}
  const SP=SPAN[PICKT]||36,U=gates.filter(o=>o.use);
  for(const g of gates)if(!g.closed&&!g.use&&(g.mars.some(h=>h.use)||U.some(o=>Math.hypot(o.x-g.x,o.y-g.y)*NM<(SP+(o.usp||36))/2+3))){g.closed=true;tmp.push(g)}
  return _pg(...a)}finally{for(const g of tmp)g.closed=false}}}

// parked aircraft: keep the nose clear of the terminal (stand points sit at the nose-wheel stop line)
{const segD=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1e-9,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/L2));return Math.hypot(px-ax-dx*t,py-ay-dy*t)};
 const ahead=(g)=>{if(g._db!=null)return g._db;const polys=(D.bd||[]).concat(D.tm||[]),gx=g.x*NM,gy=g.y*NM,h=g.h*Math.PI/180,ux=Math.sin(h),uy=Math.cos(h);let best=1e9;
  // distance to the nearest building edge in front of the nose (probe points along the heading)
  for(let s=0;s<=110;s+=3){const px=gx+ux*s,py=gy+uy*s;let inside=false,dmin=1e9;for(const P of polys){for(let i=0,j=P.length-2;i<P.length;j=i,i+=2){const d=segD(px,py,P[j],P[j+1],P[i],P[i+1]);if(d<dmin)dmin=d}}if(dmin<3){best=s;break}}
  g._db=best;return best};
 const REM=['GA','PK','CGA'];
 const fix=()=>{if(MODE==='C')return;for(const a of ac){const g=a.gate;if(!g||g.x==null||g.h==null||(a.ph!=='gate'&&a.ph!=='parked')){a._sh=null;continue}if(a._sh===g)continue;
  if(Math.hypot(a.x-g.x,a.y-g.y)*NM>8)continue;a._sh=g;const len=(SPAN[a.type]||36)*1.08,db=ahead(g);if(db>=1e8)continue;
  // nose 6 m short of the terminal / jet bridge; remote and GA stands only get pushed back when they would overlap
  let d=db-6-len/2;if(REM.includes(g.cat)||g.cat==='R')d=Math.min(0,d);d=Math.max(-45,Math.min(55,d));if(Math.abs(d)<2)continue;
  const h=g.h*Math.PI/180;a.x+=Math.sin(h)*d/NM;a.y+=Math.cos(h)*d/NM}};
 const _d=draw;draw=function(){try{fix()}catch(e){}_d()}}
