// ===================== v19: airline stands whose pushback point is far from any visible taxiway are not assigned =====================
{const _pg=pickGate;pickGate=function(...a){const bad=[];try{for(const g of gates){if(g.nopick===undefined){g.nopick=false;if(g.pb&&D&&D.tp&&!['GA','PK','CGO','CGA'].includes(g.cat)){let bd=1e9;for(const s of D.tp){const r=segDist(g.pb[0]*NM,g.pb[1]*NM,s[0],s[1],s[2],s[3]);if(r[0]<bd)bd=r[0]}g.nopick=bd>60}}
   if(g.nopick&&!g.closed){g.closed=true;bad.push(g)}}
  return _pg(...a)}finally{for(const g of bad)g.closed=false}}}

// ===================== v19 layout: aircraft list as strip bar / left column, map sized to the viewport, 3-column console on wide screens =====================
(()=>{const st=document.createElement('style');st.textContent=`
@media(min-width:820px){#game .left{display:flex;justify-content:center;background:#050c17;border-radius:18px;position:sticky;top:8px;align-self:start}canvas#cv{aspect-ratio:auto}}
@media(min-width:1280px){
 .wrap:has(#game:not([hidden])){max-width:1900px}
 #game .gwrap.tri{grid-template-columns:260px minmax(0,1fr) 410px;grid-template-rows:auto auto auto auto;align-items:start}
 #game .gwrap.tri #strBar{grid-column:1;grid-row:1/span 4;position:sticky;top:8px;margin:0;max-height:calc(100dvh - 16px);overflow:auto}
 #game .gwrap.tri #strBar .bays{flex-direction:column;overflow:visible;gap:10px}
 #game .gwrap.tri #strBar .bay{flex-direction:column;align-items:stretch;gap:6px}
 #game .gwrap.tri #strBar .bh{flex-direction:row;justify-content:space-between;min-width:0}
 #game .gwrap.tri #strBar .strip2{width:100%;min-width:0}
 #game .gwrap.tri .left{grid-column:2;grid-row:1}
 #game .gwrap.tri #cfb{grid-column:2;grid-row:2}
 #game .gwrap.tri .right{grid-column:3;grid-row:1/span 4}
 #strBar #seq{background:none;border:0;border-top:1px solid var(--line);border-radius:0;padding:8px 0 0;margin-top:10px}
 #game .gwrap.tri.hasCfb{grid-template-rows:auto auto auto}
 #game .gwrap.tri.hasCfb .left{grid-column:2;grid-row:1}
 #game .gwrap.tri.hasCfb .right{grid-column:3;grid-row:1/span 4}
}`;document.head.appendChild(st);
 const layout=()=>{try{const gm=$('game');if(gm.hidden)return;const g=gm.querySelector('.gwrap'),sp=$('strips').closest('.panel'),R=gm.querySelector('.right');if(!g||!sp)return;sp.id='strBar';
  const sq=$('seq'),help=$('help');
  const tri=innerWidth>=1280;
  if(tri){if(sp.parentNode!==g||g.firstElementChild!==sp)g.prepend(sp);g.classList.add('tri');if(sq&&sq.parentNode!==sp)sp.appendChild(sq);}
  else{g.classList.remove('tri');if(sp.parentNode===g||sp.nextElementSibling!==g)g.before(sp);if(sq&&sq.parentNode!==R)R.insertBefore(sq,help);}}catch(e){}};
 const _u=ui;ui=function(){_u();layout()};setInterval(layout,500);window.addEventListener('resize',layout);
})();

// ---- radio overlay on the map: latest calls fade out after a while (full history stays in the log panel)
(()=>{const L=document.querySelector('#game .left'),log=$('log');if(!L||!log)return;const ov=document.createElement('div');ov.id='mapLog';L.appendChild(ov);
 const st=document.createElement('style');st.textContent='#mapLog{position:absolute;left:10px;bottom:30px;width:min(58%,480px);display:none;flex-direction:column;gap:3px;pointer-events:none;z-index:3}@media(min-width:820px){#mapLog{display:flex}}#mapLog div{font:500 12px/1.3 system-ui;padding:4px 8px;border-radius:8px;background:rgba(6,11,20,.72);backdrop-filter:blur(4px);color:#cfe3ff;transition:opacity .6s;border-left:3px solid #35507a}#mapLog .plt{color:#8ff0d6;border-left-color:#5eead4}#mapLog .atc{color:#bfe6ff;border-left-color:#4cc9f0}';document.head.appendChild(st);
 const seen=new WeakSet();const sync=()=>{const kids=[...log.children].slice(-3);for(const k of kids){if(seen.has(k))continue;seen.add(k);const d=document.createElement('div');d.className=k.className;d.textContent=k.textContent;d.dataset.t=Date.now();ov.appendChild(d)}
  while(ov.children.length>3)ov.firstChild.remove()};
 new MutationObserver(sync).observe(log,{childList:true});
 setInterval(()=>{const n=Date.now();for(const d of [...ov.children]){const a=n-(+d.dataset.t);if(a>16000)d.remove();else d.style.opacity=a>11000?.25:1}},1000)})();
// ---- duplicate command labels (e.g. two identical "Vacate via B10") are shown once
{const _ud=ui;ui=function(){_ud();try{const c=$('ctl');if(!c)return;for(const cb of c.querySelectorAll('.cb')){const seen=new Set();for(const b of [...cb.children]){const t=b.textContent.trim();if(b.tagName==='BUTTON'&&/^Vacate via /.test(t)){if(seen.has(t))b.remove();else seen.add(t)}}}}catch(e){}}}
