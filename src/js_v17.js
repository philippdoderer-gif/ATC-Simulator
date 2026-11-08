// ===================== v17: phone helper: square map canvas that fits above the bottom sheet (tablets keep the original scrolling layout) =====================
(()=>{
 const fitCv=()=>{try{const g=$('game');if(g.hidden)return;const L=cv.parentNode;
  if(innerWidth>=820){cv.style.width=cv.style.height='';return}
  cv.style.width=cv.style.height='0px';const r=L.getBoundingClientRect();const R=document.querySelector('#game .right').getBoundingClientRect();
  const s=Math.max(180,Math.floor(Math.min(L.clientWidth,R.top-r.top-4)));cv.style.width=cv.style.height=s+'px'}catch(e){}};
 setInterval(fitCv,400);window.addEventListener('resize',fitCv);window.addEventListener('orientationchange',()=>setTimeout(fitCv,250));
})();
