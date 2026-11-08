/* v28: stand/taxiway data clean-up – MARS stands block each other, no taxiway labels on runways */
for(const k in DATA){const d=DATA[k];if(!d||!d.lb||!d.rw)continue;
 d.lb=d.lb.filter(l=>!d.rw.some(r=>{const ax=r.a[0],ay=r.a[1],bx=r.b[0],by=r.b[1],L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,s=(l[1]-ax)*ux+(l[2]-ay)*uy,o=Math.abs((l[1]-ax)*uy-(l[2]-ay)*ux);return s>-30&&s<L+30&&o<Math.max(r.w,45)/2+12}))}
{const _pg=pickGate;pickGate=function(...a){const tmp=[];try{
  for(const g of gates){if(!g.mars){g.mars=gates.filter(h=>h!==g&&Math.hypot(h.x-g.x,h.y-g.y)*NM<26)}}
  for(const g of gates)if(!g.closed&&!g.use&&g.mars.some(h=>h.use)){g.closed=true;tmp.push(g)}
  return _pg(...a)}finally{for(const g of tmp)g.closed=false}}}
