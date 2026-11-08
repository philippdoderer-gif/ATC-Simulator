// ===================== v17: phone helper: square map canvas that fits above the bottom sheet (tablets keep the original scrolling layout) =====================
(()=>{
 const fitCv=()=>{try{const g=$('game');if(g.hidden)return;const L=cv.parentNode;
  cv.style.width=cv.style.height='0px';const r=L.getBoundingClientRect();
  if(innerWidth>=820){const gw=document.querySelector('#game .gwrap'),cf=$('cfb'),cfH=gw.classList.contains('tri')?(cf&&!cf.hidden?cf.offsetHeight+10:0):0,top=gw.getBoundingClientRect().top+scrollY;
   const s=Math.max(380,Math.floor(Math.min(L.clientWidth,innerHeight-top-28-cfH)));cv.style.width=cv.style.height=s+'px';return}
  const R=document.querySelector('#game .right').getBoundingClientRect();
  const s=Math.max(180,Math.floor(Math.min(L.clientWidth,R.top-r.top-4)));cv.style.width=cv.style.height=s+'px'}catch(e){}};
 setInterval(fitCv,400);window.addEventListener('resize',fitCv);window.addEventListener('orientationchange',()=>setTimeout(fitCv,250));
})();
