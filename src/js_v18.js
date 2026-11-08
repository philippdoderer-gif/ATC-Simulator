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
