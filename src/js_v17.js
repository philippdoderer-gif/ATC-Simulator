// ===================== v17: tablet (iPad) layout: fixed full-screen app, no page scrolling =====================
(()=>{const st=document.createElement('style');st.textContent=`
@media(min-width:820px) and (pointer:coarse){
 html,body{overscroll-behavior:none}
 #game:not([hidden]){display:flex;flex-direction:column;height:100dvh;padding:6px 10px 8px;box-sizing:border-box;overflow:hidden}
 #game .bar{flex:0 0 auto;flex-wrap:nowrap;white-space:nowrap;overflow-x:auto;gap:6px;margin:0 0 6px;scrollbar-width:none}
 #game .bar::-webkit-scrollbar{display:none}
 #game .bar button{flex:0 0 auto;min-height:44px;padding:8px 13px;font-size:15px}#game .bar #ttl{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
 #game .hud{flex:0 0 auto;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:0 0 6px}#game .hud>div{padding:3px 10px}#game .hud b{font-size:17px}#game .hud #clk{white-space:nowrap;font-size:13px!important}
 #game .gwrap{flex:1 1 auto;min-height:0;display:grid;gap:8px;grid-template-columns:minmax(0,1.45fr) minmax(360px,1fr);grid-template-rows:minmax(0,1fr)}
 #game .left{min-height:0;height:100%}
 canvas#cv{aspect-ratio:auto!important;height:100%!important;width:100%}
 #game .right{display:flex;flex-direction:column;gap:8px;min-height:0;height:100%;overflow:hidden}
 #game .right>.panel{min-height:0;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
 #ctl{flex:1 1 52%;max-height:none!important}
 #game .right>.panel:has(#strips){flex:0 1 22%}
 #seq{flex:0 1 15%}
 #game .right>.panel:has(#log){flex:0 0 94px;padding:6px 10px}#log{height:100%!important}
 #game .right #help{display:none}
 .cb button,.strip,#seq .sq{min-height:40px}.cb button{font-size:14px;padding:9px 12px}.strip{display:flex;align-items:center}
 #seq .sq{min-height:30px}
 #atisBox:not([hidden]){position:fixed;z-index:80;left:50%;top:80px;transform:translateX(-50%);width:min(480px,92vw);max-height:70dvh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.7);background:#0c1626}
 .zb button{width:52px;height:52px;font-size:24px}
}
@media(min-width:820px) and (pointer:coarse) and (orientation:portrait){
 #game .gwrap{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:minmax(0,46%) minmax(0,.95fr) minmax(0,.55fr) 94px}
 #game .left{grid-column:1/3;grid-row:1}
 #game .right{display:contents}
 #game .right>*{min-height:0}
 #ctl{grid-column:1;grid-row:2/5;overflow-y:auto}
 #game .right>.panel:has(#strips){grid-column:2;grid-row:2}
 #seq{grid-column:2;grid-row:3}
 #game .right>.panel:has(#log){grid-column:2;grid-row:4}
}`;document.head.appendChild(st);
 // iOS: prevent double-tap zoom & pinch of the page itself (map handles its own gestures)
 document.addEventListener('gesturestart',e=>e.preventDefault());
 let lt=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lt<300&&!/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))e.preventDefault();lt=n},{passive:false});
 const fit=()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}};window.addEventListener('orientationchange',()=>setTimeout(fit,250));
})();
