/* v27: map polish – compass frame, sector boundary, ILS ticks, scale bar, north arrow, wind, vignette */
{const _d=draw;draw=function(){_d();try{mapOver()}catch(e){}};
function mapOver(){const W=cv.clientWidth,dpr=devicePixelRatio||1,Rg=view.r,k=W/2/Rg,c=W/2,X=x=>c+(x-view.x)*k,Y=y=>c-(y-view.y)*k;
 cx.setTransform(dpr,0,0,dpr,0,0);cx.save();cx.lineJoin='round';
 const C=MODE==='C';
 // sector boundary + ILS distance ticks (Center)
 if(C||Rg>12){cx.setLineDash([2,6]);cx.strokeStyle='rgba(255,180,84,.38)';cx.lineWidth=1.2;cx.beginPath();cx.arc(X(0),Y(0),58*k,0,7);cx.stroke();cx.setLineDash([]);

  if(Rg>6){cx.font='600 9px system-ui';for(const id of FLW[1]){const R=RW[id];if(!R)continue;for(let d=5;d<=25;d+=5){const x=X(R.T0.x-R.dir[0]*d),y=Y(R.T0.y-R.dir[1]*d),nx=R.dir[1],ny=-R.dir[0];cx.strokeStyle='rgba(94,234,212,.7)';cx.lineWidth=1.2;cx.beginPath();cx.moveTo(x-nx*4,y+ny*4*-1);cx.lineTo(x+nx*4,y-ny*4*-1);cx.stroke();cx.fillStyle='rgba(159,232,214,.8)';cx.fillText(d,x+6,y-4)}}}}
 // vignette
 const v=cx.createRadialGradient(c,c,W*.42,c,c,W*.78);v.addColorStop(0,'rgba(2,6,14,0)');v.addColorStop(1,'rgba(2,6,14,.55)');cx.fillStyle=v;cx.fillRect(0,0,W,W);
 // compass frame (Center)
 if(C){const r=c-9;cx.strokeStyle='rgba(130,170,220,.35)';cx.fillStyle='rgba(170,195,235,.8)';cx.font='600 10px system-ui';cx.textAlign='center';cx.textBaseline='middle';
  for(let a=0;a<360;a+=10){const t=a*Math.PI/180,l=a%30===0?9:a%10===0?5:0,sx=Math.sin(t),sy=-Math.cos(t);cx.lineWidth=a%30===0?1.4:1;cx.beginPath();cx.moveTo(c+sx*r,c+sy*r);cx.lineTo(c+sx*(r-l),c+sy*(r-l));cx.stroke();
   if(a%30===0){const s=a===0?'N':a===90?'E':a===180?'S':a===270?'W':String(a).padStart(3,'0');if(W>420||a%90===0)cx.fillText(s,c+sx*(r-20),c+sy*(r-20))}}
  cx.textAlign='left';cx.textBaseline='alphabetic'}
 // scale bar
 {const nm=k;let L,lab;if(Rg>1.5){const opts=[1,2,5,10,20,50];L=opts.find(o=>o*nm>=70)||50;lab=L+' NM';L*=nm}else{const m=k/1852;const opts=[100,200,500,1000];const o=opts.find(o=>o*m>=70)||1000;L=o*m;lab=o+' m'}
  const x=16,y=W-18;cx.strokeStyle='rgba(230,238,250,.85)';cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y-5);cx.lineTo(x,y);cx.lineTo(x+L,y);cx.lineTo(x+L,y-5);cx.stroke();cx.fillStyle='rgba(230,238,250,.9)';cx.font='600 11px system-ui';cx.fillText(lab,x,y-9)}
 // north arrow + wind
 {const x=34,y=38;cx.strokeStyle='rgba(170,195,235,.6)';cx.lineWidth=1.2;cx.beginPath();cx.arc(x,y,17,0,7);cx.stroke();cx.fillStyle='#e6edf7';cx.beginPath();cx.moveTo(x,y-14);cx.lineTo(x+5,y+3);cx.lineTo(x,y);cx.lineTo(x-5,y+3);cx.closePath();cx.fill();cx.fillStyle='rgba(170,195,235,.9)';cx.font='700 9px system-ui';cx.textAlign='center';cx.fillText('N',x,y+14);
  if(typeof WX==='object'&&WX&&WX.wd!=null){const wx=34,wy=92,a=(WX.wd+180)*Math.PI/180;cx.strokeStyle='rgba(255,209,102,.85)';cx.fillStyle='rgba(255,209,102,.95)';cx.lineWidth=2;cx.beginPath();cx.moveTo(wx-Math.sin(a)*14,wy+Math.cos(a)*14);cx.lineTo(wx+Math.sin(a)*14,wy-Math.cos(a)*14);cx.stroke();const hx=wx+Math.sin(a)*14,hy=wy-Math.cos(a)*14;cx.beginPath();cx.moveTo(hx,hy);cx.lineTo(hx-Math.sin(a+.5)*8,hy+Math.cos(a+.5)*8);cx.lineTo(hx-Math.sin(a-.5)*8,hy+Math.cos(a-.5)*8);cx.closePath();cx.fill();cx.font='600 10px system-ui';cx.fillText(String(Math.round(WX.wd)).padStart(3,'0')+'°/'+Math.round(WX.ws)+'kt',wx,wy+28)}
  cx.textAlign='left'}
 cx.restore()}}
{const st=document.createElement('style');st.textContent='.row:has(>button[data-f]){flex-wrap:nowrap!important;gap:6px}.row:has(>button[data-f]) button{padding:8px 11px;font-size:13px;white-space:nowrap}@media(max-width:1400px){.row:has(>button[data-f])>.small{display:none}}';document.head.appendChild(st)}
