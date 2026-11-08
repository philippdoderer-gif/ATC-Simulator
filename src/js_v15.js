// ===================== v15: mobile layout (map + bottom command sheet), PWA registration =====================
(()=>{const st=document.createElement('style');st.textContent=`
@media(max-width:819px){
 #game:not([hidden]){--sh:42dvh}#game.sheetmin{--sh:15dvh}
 #game .bar{position:sticky;top:0;z-index:30;background:rgba(6,11,20,.92);backdrop-filter:blur(8px);overflow-x:auto;flex-wrap:nowrap;white-space:nowrap;padding:6px 4px}
 #game .bar button{flex:0 0 auto;padding:7px 10px}#game .bar #ttl{flex:0 0 auto;max-width:none;font-size:12px;padding:0 8px}
 #game .hud{grid-template-columns:repeat(6,minmax(0,1fr));gap:4px;margin-bottom:4px}#game .hud>div{padding:3px 5px}#game .hud b{font-size:14px!important}#game .hud i{font-size:7px;letter-spacing:.04em;white-space:nowrap;overflow:hidden}#game .hud b,#game .hud #clk{white-space:nowrap;font-size:12px!important}#game .hud>div{min-width:0;overflow:hidden}
 #game .left{display:flex;justify-content:center;background:#050c17;border-radius:12px}canvas#cv{aspect-ratio:auto;border-radius:12px}
 #game .right{position:fixed;left:0;right:0;bottom:0;height:var(--sh);overflow-y:auto;z-index:40;background:rgba(8,14,26,.97);border-top:1px solid var(--line);border-radius:18px 18px 0 0;padding:32px 8px 10px;display:flex;flex-direction:column;gap:8px;box-shadow:0 -10px 30px rgba(0,0,0,.5);overscroll-behavior:contain}
 #shH{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--sh) - 24px);z-index:45;width:90px;height:26px;border-radius:14px 14px 0 0;border:1px solid var(--line);border-bottom:0;background:#0c1626;color:var(--dim);font-size:15px;padding:0;line-height:1}
 #game .panel{padding:8px}#ctl{max-height:none!important}
 #seq{display:none!important}.legend{display:none}.zb{top:6px;right:6px}.zb button{width:40px;height:40px}
 body{overscroll-behavior:none}
}
@media(min-width:820px){#shH{display:none}}`;document.head.appendChild(st);
 const h=document.createElement('button');h.id='shH';h.textContent='⌃⌄';h.onclick=()=>{$('game').classList.toggle('sheetmin');setTimeout(()=>window.dispatchEvent(new Event('resize')),50)};document.body.appendChild(h);
 setInterval(()=>{h.style.display=$('game').hidden?'none':''},500);
 const sel0=()=>{if(window.innerWidth<820&&$('game').classList.contains('sheetmin'))$('game').classList.remove('sheetmin')};
 cv.addEventListener('pointerup',()=>setTimeout(sel0,60));
 // PWA: only on real https/http origins that are not the artifact sandbox
 try{const ok=/^https?:$/.test(location.protocol)&&/github\.io$|localhost$/.test(location.hostname);
  if('serviceWorker' in navigator&&ok)navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}
})();
