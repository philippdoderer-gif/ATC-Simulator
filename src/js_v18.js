// ===================== v18: Center compass rose around the selected aircraft =====================
{const _d=draw;draw=function(){_d();if(MODE!=='C'||!sel||sel.ph!=='air'||!vis(sel))return;
 try{const W=cv.clientWidth,dpr=devicePixelRatio||1,k=W/2/view.r,c=W/2,a=sel,x=c+(a.x-view.x)*k,y=c-(a.y-view.y)*k,R=W<500?62:84;
  cx.save();cx.setTransform(dpr,0,0,dpr,0,0);cx.textAlign='center';cx.textBaseline='middle';
  const ang=h=>[Math.sin(h*Math.PI/180),-Math.cos(h*Math.PI/180)];
  cx.fillStyle='rgba(6,11,20,.35)';cx.beginPath();cx.arc(x,y,R,0,7);cx.fill();
  cx.strokeStyle='rgba(180,215,255,.55)';cx.lineWidth=1.2;cx.beginPath();cx.arc(x,y,R,0,7);cx.stroke();
  for(let h=0;h<360;h+=10){const [sx,sy]=ang(h),big=h%30===0,mid=h%90===0,l=mid?12:big?9:5;cx.strokeStyle=mid?'#ffd166':'rgba(190,220,255,.8)';cx.lineWidth=mid?2:1;cx.beginPath();cx.moveTo(x+sx*R,y+sy*R);cx.lineTo(x+sx*(R-l),y+sy*(R-l));cx.stroke();
   if(big){cx.font=(mid?'700 12px':'600 10px')+' ui-monospace,Menlo,monospace';cx.fillStyle=mid?'#ffd166':'rgba(210,230,255,.95)';const t=h===0?'N':h===90?'E':h===180?'S':h===270?'W':String(h/10).padStart(2,'0');cx.fillText(t,x+sx*(R+13),y+sy*(R+13))}}
  // target heading (dashed amber) and current heading (solid cyan)
  const th=a.th!=null?a.th:a.hdg,[tx,ty]=ang(th),[hx,hy]=ang(a.hdg);
  cx.setLineDash([6,4]);cx.strokeStyle='#ffb84d';cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+tx*R,y+ty*R);cx.stroke();cx.setLineDash([]);
  cx.fillStyle='#ffb84d';cx.beginPath();cx.arc(x+tx*R,y+ty*R,4,0,7);cx.fill();
  cx.strokeStyle='#5eead4';cx.lineWidth=2.4;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+hx*(R-4),y+hy*(R-4));cx.stroke();
  cx.fillStyle='#5eead4';cx.beginPath();cx.moveTo(x+hx*R,y+hy*R);cx.lineTo(x+hx*(R-12)-hy*5,y+hy*(R-12)+hx*5);cx.lineTo(x+hx*(R-12)+hy*5,y+hy*(R-12)-hx*5);cx.closePath();cx.fill();
  // readout
  const f=v=>String(Math.round(((v%360)+360)%360)||360).padStart(3,'0'),lab='HDG '+f(a.hdg)+'°'+(Math.abs(((th-a.hdg+540)%360)-180)>1.5?'  →  '+f(th)+'°':'');
  cx.font='700 12px ui-monospace,Menlo,monospace';const w=cx.measureText(lab).width+14;cx.fillStyle='rgba(6,11,20,.88)';cx.fillRect(x-w/2,y+R+24,w,20);cx.strokeStyle='rgba(94,234,212,.5)';cx.lineWidth=1;cx.strokeRect(x-w/2,y+R+24,w,20);cx.fillStyle='#e6f2ff';cx.fillText(lab,x,y+R+34.5);
  cx.restore()}catch(e){}}}
// ---- Center: "Fill in the blanks" moves below the radar as a wide strip (desktop/tablet); the right column gets more room
{const st=document.createElement('style');st.textContent=`@media(min-width:820px){#cfb{grid-column:1;padding:8px 10px}#cfb .cgl{margin:0 0 6px}#cfb .clz{display:flex;flex-wrap:wrap;gap:8px}#cfb .clz form{flex:1 1 auto;flex-wrap:nowrap;white-space:nowrap}#cfb input,#cfb select{min-width:0}.gwrap.hasCfb{grid-template-rows:auto 1fr}.gwrap.hasCfb .left{grid-column:1;grid-row:1;align-self:start}.gwrap.hasCfb .right{grid-column:2;grid-row:1/span 2}#cfb{grid-row:2;align-self:start}}`;document.head.appendChild(st);
 const _cb=ctrBox;ctrBox=function(){_cb();try{const b=$('ctrb'),g=document.querySelector('#game .gwrap');let f=$('cfb');
  const c=b&&innerWidth>=820?b.querySelector('.clz'):null;
  if(c){if(!f){f=document.createElement('div');f.id='cfb';f.className='panel';g.appendChild(f)}f.hidden=false;const hd=c.previousElementSibling;f.innerHTML='';if(hd&&hd.classList.contains('cgl'))f.append(hd);f.append(c);g.classList.add('hasCfb')}
  else if(f&&(MODE!=='C'||CTR.id==='none'||innerWidth<820)){f.hidden=true;f.innerHTML='';g.classList.remove('hasCfb')}}catch(e){console.warn(e)}}}
// ---- Center: compact command menu: category chips (Approach / Heading / Waypoints / Altitude / Speed / Info), options shown for one category at a time
const CMP={k:'Heading'};
if(SET.desel===undefined)SET.desel=true;
const deselAfter=()=>{if(SET.desel&&MODE==='C'&&!BATCH)setTimeout(()=>{sel=null;psig='';ui()},0)};
{const _R=RUN;RUN=function(d,a,g){const r=_R(d,a,g);if(d&&d.id!=='batch')deselAfter();return r}}
{const _S=sendCombo;sendCombo=function(a,o){const r=_S(a,o);deselAfter();return r}}
{const _T=applyText;applyText=function(v){const r=_T(v);if(!r)deselAfter();return r}}
{const g=document.querySelector('#setm .sg:nth-of-type(3)')||document.querySelector('#setm .smc');const l=document.createElement('label');l.innerHTML='<input type="checkbox" id="sDesel"> Center: deselect aircraft after sending an instruction';
 const host=[...document.querySelectorAll('#setm .sg')].find(x=>/Game/.test(x.textContent))||g;host.insertBefore(l,host.querySelector('small')||null);
 const cb=l.querySelector('input');cb.checked=!!SET.desel;cb.onchange=()=>{SET.desel=cb.checked;saveSet()};
 const _o=openSet;openSet=function(){_o();cb.checked=!!SET.desel}}
{const st=document.createElement('style');st.textContent=`#cmpbar{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 6px}#cmpbar button{padding:8px 14px;border-radius:999px;font-size:14px;font-weight:600}#cmpbar button.on{background:var(--sel);color:#10151f;border-color:var(--sel)}#cmpbar button.em{opacity:.45}#cmpbody.cb{margin-top:2px}`;document.head.appendChild(st);
 const cat=t=>/^Direct |^Hold at /.test(t)?'Waypoints':/^(Radar contact|Cleared ILS)/.test(t)?'Approach':/^(Turn|Fly|Orbit)/.test(t)?'Heading':/^(Descend|Climb|Maintain)/.test(t)?'Altitude':/^(Speed|Normal speed|Reduce|Increase)/.test(t)?'Speed':'Info';
 const ORD=['Approach','Heading','Waypoints','Altitude','Speed','Info'];
 const _u=ui;ui=function(){_u();try{if(MODE!=='C')return;const c=$('ctl');if(!c||c.querySelector('#cmpbar'))return;const cbs=[...c.querySelectorAll(':scope>.cb')];if(!cbs.length)return;
  const G={};for(const cb of cbs)for(const b of [...cb.children])(G[cat(b.textContent.trim())]=G[cat(b.textContent.trim())]||[]).push(b);
  const keys=ORD.filter(k=>G[k]&&G[k].length);if(!keys.length)return;if(!keys.includes(CMP.k))CMP.k=keys[0];
  const bar=document.createElement('div');bar.id='cmpbar';const body=document.createElement('div');body.id='cmpbody';body.className='cb';
  const show=k=>{CMP.k=k;body.innerHTML='';G[k].forEach(b=>body.appendChild(b));bar.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.k===k))};
  for(const k of keys){const x=document.createElement('button');x.dataset.k=k;x.textContent=k+(k==='Heading'||k==='Altitude'||k==='Speed'?'':'');x.onclick=e=>{e.stopPropagation();show(k)};bar.appendChild(x)}
  {const d=document.createElement('button');d.textContent='✕ Deselect';d.title='Clear selection';d.onclick=e=>{e.stopPropagation();sel=null;psig='';ui()};bar.appendChild(d)}
  const first=cbs[0];c.querySelectorAll(':scope>.cgl').forEach(h=>{if(h.nextElementSibling&&h.nextElementSibling.classList.contains('cb'))h.remove()});
  first.before(bar);bar.after(body);cbs.forEach(cb=>cb.remove());show(CMP.k)}catch(e){console.warn(e)}}}
// ---- Center: real-radar style data block: callsign / FL + trend + ground speed / assigned values / type & destination
function radarBlock(a,p,px,py,col,mine){
 if(!a.rc){cx.save();cx.font='700 11px ui-monospace,Menlo,monospace';cx.fillStyle=a.req==='radar'?'#ffb454':col;cx.globalAlpha=.55+.45*(a.req==='radar'?Math.abs(Math.sin(performance.now()/350)):.4);cx.fillText(a.req==='radar'?a.cs+'  CHECK-IN':'UNKNOWN',px+10,py-6);cx.font='500 10px ui-monospace,Menlo,monospace';cx.globalAlpha=.7;cx.fillText('no radar contact',px+10,py+5);cx.restore();return}
 const fl=Math.round(p.alt/100),altT=p.alt>=5500?'FL'+pad(fl,3):String(Math.round(p.alt/100)*100),tr=a.ta>p.alt+50?'↑':a.ta<p.alt-50?'↓':'→',gs=Math.round(p.s),wk=typeof WKC==='function'?WKC(a.type):'';
 cx.save();cx.strokeStyle=col;cx.globalAlpha=.55;cx.lineWidth=1;cx.beginPath();cx.moveTo(px+4,py-4);cx.lineTo(px+9,py-9);cx.stroke();cx.globalAlpha=1;
 cx.font='700 11px ui-monospace,Menlo,monospace';cx.fillStyle=col;cx.fillText(a.cs+(wk&&wk!=='M'?' '+wk:''),px+10,py-6);
 cx.font='600 10px ui-monospace,Menlo,monospace';cx.fillText(altT+tr+' '+gs+'kt',px+10,py+5);
 let l3='';if(mine||a===sel){const parts=[];if(Math.abs(a.ta-p.alt)>50)parts.push('▸'+(a.ta>=5500?'FL'+pad(Math.round(a.ta/100),3):Math.round(a.ta/100)*100));if(Math.abs(((a.th-p.h+540)%360)-180)>2)parts.push('H'+pad(Math.round(a.th)%360||360,3));if(Math.abs(a.ts-gs)>5)parts.push('S'+Math.round(a.ts));l3=parts.join(' ')}
 cx.globalAlpha=.9;cx.fillStyle=l3?'#ffb454':col;cx.font='500 10px ui-monospace,Menlo,monospace';cx.fillText(l3||(a.type+' '+(a.ovf?a.ex[0]:a.dep?a.fix:A.icao.slice(0,4))),px+10,py+16);cx.restore()}

// ---- Center: overflights also check in on the frequency; aircraft list sits at the top of the right column
{const _st=step;step=function(dt){_st(dt);try{if(MODE==='C'||CMB||HS('C'))for(const a of ac){if(a.ovf&&a.ph==='air'&&a.ctrl==='C'&&!a.rc&&!a.cki){if(a.cdl==null)a.cdl=T+4+Math.random()*30;if(T>=a.cdl){a.cki=1;ask(a,'radar','flight level '+Math.round(a.fl)+', via '+(a.ex?a.ex[0]:'')+'.')}}}}catch(e){}}}
infoOpen=innerWidth>=820;
{const st=document.createElement('style');st.textContent=`#strBar{margin:0 0 8px;padding:6px 8px;overflow:hidden}#strBar .strips{display:block}#strBar .bays{display:flex;flex-wrap:nowrap;gap:12px;overflow-x:auto;padding-bottom:4px;align-items:stretch;-webkit-overflow-scrolling:touch}
#strBar .bay{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;gap:6px;flex:0 0 auto;border:1px dashed var(--line);border-radius:12px;padding:4px 8px;min-height:54px}
#strBar .bh{display:flex;flex-direction:column;gap:2px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);min-width:64px}#strBar .strip2{flex:0 0 auto;width:auto;min-width:130px;margin:0}`;document.head.appendChild(st)}
// aircraft list (Center): full-width horizontal strip bar between the stats and the radar
{const _u2=ui;ui=function(){_u2();try{const sp=$('strips').closest('.panel'),g=document.querySelector('#game .gwrap');if(!sp||!g)return;
  if(MODE==='C'){if(sp.id!=='strBar'||sp.nextElementSibling!==g){sp.id='strBar';g.before(sp)}}
  else if(sp.id==='strBar'){sp.id='';const R=document.querySelector('#game .right');R.insertBefore(sp,$('seq')||null)}}catch(e){}}}
