// ===================== v20: main menu as a one-screen launcher =====================
(()=>{const S=$('setup');if(!S||S.dataset.v20)return;S.dataset.v20=1;
 const kids=[...S.children];const A=document.createElement('div'),B=document.createElement('div');A.id='setA';B.id='setB2';
 // column A: airport + position; column B: time, challenge, start
 const idx=id=>kids.findIndex(k=>k.id===id||k.querySelector&&k.querySelector('#'+id));
 const hs=kids.filter(k=>k.tagName==='H3');
 const colA=[hs[0],$('apc'),hs[1],$('mdc'),$('xtra')];
 const top=document.createElement('div');top.id='setTop';
 const first=kids.indexOf(hs[0]);kids.slice(0,first).forEach(k=>top.appendChild(k));
 for(const k of kids){if(top.contains(k))continue;(colA.includes(k)?A:B).appendChild(k)}
 S.appendChild(top);S.appendChild(A);S.appendChild(B);
 const st=document.createElement('style');st.textContent=`
 #setA h3:first-child,#setB2 h3:first-child{margin-top:0}
 @media(min-width:1000px){
  .shero{padding-block:14px 12px;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)}
  .shero h1{font-size:clamp(28px,2.7vw,40px);max-width:none}
  .shero .sub,.shero .shl>div:not(.eyebrow){display:none}
  .strip{transform:scale(.8) rotate(-1deg);transform-origin:right center}
  #setup{display:grid!important;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:26px;align-items:start}
  #setA .cards{grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  #setA #mdc{grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
  #setA #mdc .card .cd,#setA #mdc .card small{font-size:11px}
  #setTop{grid-column:1/-1}#setTop:empty{display:none}
  #setB2{position:sticky;top:12px}
  #tsel .tsc{height:70px}
  #tsel{padding:10px 12px}
 }
 @media(min-width:1000px) and (max-height:820px){#setA .card canvas,#setA .card svg{max-height:96px}}
 `;document.head.appendChild(st);
})();
