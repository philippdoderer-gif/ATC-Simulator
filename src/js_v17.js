// ===================== v17: tablet (iPad) layout: fixed full-screen app, no page scrolling =====================
(()=>{const R=document.querySelector('#game .right');if(R&&!$('colA')){const A=document.createElement('div'),B=document.createElement('div');A.id='colA';B.id='colB';
 const ids=['ctrb','coach','ctl','atisBox','team'];const kids=[...R.children];R.prepend(A,B);for(const k of kids){if(k.id==='help')continue;(ids.includes(k.id)?A:B).appendChild(k)}
 const st0=document.createElement('style');st0.textContent='#colA,#colB{display:contents}';document.head.appendChild(st0)}
 const st=document.createElement('style');st.textContent=`
@media(min-width:820px) and (pointer:coarse){
 html,body{overscroll-behavior:none}
 #game:not([hidden]){display:flex;flex-direction:column;height:calc(100dvh - 24px);padding:6px 10px 8px;box-sizing:border-box;overflow:hidden}
 #game .bar{flex:0 0 auto;flex-wrap:nowrap;white-space:nowrap;overflow-x:auto;gap:6px;margin:0 0 6px;scrollbar-width:none}
 #game .bar::-webkit-scrollbar{display:none}
 #game .bar button{flex:0 0 auto;min-height:44px;padding:8px 13px;font-size:15px}#game .bar #ttl{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
 #game .hud{flex:0 0 auto;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0 0 6px}#game .hud>div{padding:3px 10px}#game .hud b{font-size:17px}#game .hud #clk{white-space:nowrap;font-size:13px!important}
 #game .gwrap{flex:1 1 auto;min-height:0;display:grid;gap:8px;grid-template-columns:minmax(0,1.45fr) minmax(360px,1fr);grid-template-rows:minmax(0,1fr)}
 #game .left{min-height:0;height:100%}
 #game .left{display:flex;align-items:center;justify-content:center;background:#050c17;border-radius:18px}canvas#cv{aspect-ratio:auto!important}
 #game .right{display:flex;flex-direction:column;gap:8px;min-height:0;height:100%;overflow:hidden}
 #game .right .panel{min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
 #ctrb{flex:0 1 36%}#coach{flex:0 0 auto}
 #ctl{flex:1 1 40%;max-height:none!important}
 #game .panel:has(#strips){flex:0 1 18%}
 #seq{flex:0 1 11%}
 #game .panel:has(#log){flex:0 0 94px;padding:6px 10px}#log{height:100%!important}
 #game .right #help{display:none}
 .cb button,.strip,#seq .sq{min-height:40px}.cb button{font-size:14px;padding:9px 12px}.strip{display:flex;align-items:center}
 #seq .sq{min-height:30px}
 #atisBox:not([hidden]){position:fixed;z-index:80;left:50%;top:80px;transform:translateX(-50%);width:min(480px,92vw);max-height:70dvh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.7);background:#0c1626}
 .zb button{width:52px;height:52px;font-size:24px}
}
@media(min-width:820px) and (pointer:coarse) and (orientation:portrait){
 #game .gwrap{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,52%) minmax(0,1fr)}
 #game .left{grid-row:1}
 #game .right{grid-row:2;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;overflow:hidden}
 #colA,#colB{display:flex;flex-direction:column;gap:8px;min-height:0;overflow-y:auto;overscroll-behavior:contain}
 #colA>.panel{flex:0 0 auto;max-height:none}#ctl{flex:1 0 auto!important}
 #colB>.panel{flex:0 0 auto}#colB>.panel:has(#strips){flex:1 1 40%!important;min-height:120px}#colB>.panel:has(#log){flex:0 0 110px!important}#colB #seq{flex:0 0 auto!important;max-height:30%}
}`;document.head.appendChild(st);
 // iOS: prevent double-tap zoom & pinch of the page itself (map handles its own gestures)
 document.addEventListener('gesturestart',e=>e.preventDefault());
 let lt=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lt<300&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))e.preventDefault();lt=n},{passive:false});
 // the map bitmap is square -> size the canvas as a square that fits the available area (never stretch)
 const fitCv=()=>{try{const g=$('game');if(g.hidden)return;const L=cv.parentNode;const touch=matchMedia('(pointer:coarse)').matches,small=innerWidth<820;
  if(!(small||touch&&innerWidth>=820)){cv.style.width=cv.style.height='';return}
  cv.style.width=cv.style.height='0px';const r=L.getBoundingClientRect();let w=L.clientWidth,h;
  if(small){const R=document.querySelector('#game .right').getBoundingClientRect();h=R.top-r.top-4}else h=L.clientHeight;
  const s=Math.max(180,Math.floor(Math.min(w,h)));cv.style.width=cv.style.height=s+'px'}catch(e){}};
 setInterval(fitCv,400);window.addEventListener('resize',fitCv);
 const fit=()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}};window.addEventListener('orientationchange',()=>setTimeout(fit,250));
})();
