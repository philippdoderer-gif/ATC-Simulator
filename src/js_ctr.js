
// ===================== Center: draft steppers, typed instructions, fill-in phrases =====================
const FX=()=>Object.keys(WP).filter(n=>!/^(IF|FA)/.test(n)).sort();
// execute a combined center instruction (runs on the host / single player)
function ctrCombo(a,o){if(!a||a.ph!=='air')return;const parts=[],rb=[];
 if(o.rc&&!a.rc){a.rc=true;if(a.req==='radar')a.req=null;parts.push('radar contact');rb.push('roger');score+=3}
 if(o.ga){goAround(a,1);return}
 if(o.dct&&WP[o.dct]){a.dct=WP[o.dct].slice();a.cleared=false;a.orb=0;a.ils=false;parts.push('proceed direct '+o.dct);rb.push('direct '+o.dct)}
 if(o.h!=null&&!o.dct){a.ils=false;a.cleared=false;a.wp=null;a.dct=null;a.orb=0;const h=nrm(Math.round(o.h))||360,d=o.turn||(dif(h,a.hdg)<0?'left':'right');a.th=h===360?0:h;parts.push('turn '+d+' heading '+pad(h,3));rb.push(d+' heading '+pad(h,3))}
 if(o.orb){a.orb=o.orb==='left'?-1:1;a.dct=null;a.cleared=false;parts.push('orbit '+o.orb);rb.push('orbit '+o.orb)}
 if(o.alt!=null){if(a.ils&&!o.cancel)say(rc(a)+': unable altitude change, established on the localiser','plt');else{const v=Math.round(o.alt/100)*100,up=v>a.alt;a.ta=v;a.exp=0;parts.push((up?'climb':'descend')+' and maintain '+fl(v));rb.push((up?'climb ':'descend ')+fl(v))}}
 if(o.exp){a.exp=90;parts.push('expedite '+(a.ta>a.alt?'climb':'descent'));rb.push('expediting')}
 if(o.spd!=null){if(o.spd==='N'){a.ts=a.ovf?450:a.dep?250:230;parts.push('resume normal speed');rb.push('normal speed')}else{const v=cl(+o.spd,a.ovf?300:a.dep?180:140,a.ovf?520:a.dep?320:280);a.ts=v;parts.push('speed '+v+' knots');rb.push('speed '+v)}}
 if(o.ils&&!a.dep){a.cleared=true;a.dct=null;a.orb=0;parts.push('cleared ILS approach runway '+a.rw);rb.push('cleared ILS runway '+a.rw)}
 if(o.qnh){parts.push('QNH '+Math.round(WX.q));rb.push('QNH '+Math.round(WX.q))}
 if(o.twr&&!a.dep&&a.ils){a.ctrl='T';a.req=null;a.clr=true;parts.push('contact tower');rb.push('contact tower');score+=3}
 if(o.sect&&a.dep&&a.alt>=9500&&!a.lv){a.lv=4;a.req=null;parts.push('contact next sector');rb.push('contact next sector')}
 if(!parts.length)return;score+=1;atc(a,parts.join(', '),rb.join(', '));psig=''}
function sendCombo(a,o){if(NET.client){NET.send('cmd',{i:a.id,c:'combo',g:JSON.stringify(o)});return}NET.who=NET.on?NET.me():null;try{ctrCombo(a,o)}finally{NET.who=null}}
// ---- text parser
function parseCmd(txt){let s=' '+txt.toLowerCase().replace(/[,;]/g,' ').replace(/\s+/g,' ')+' ';const o={};let m;let tgt=null;
 const cs=s.trim().split(' ')[0];if(/^[a-z]{3}\d{1,4}$/.test(cs)){tgt=cs.toUpperCase();s=s.replace(' '+cs+' ',' ')}
 if(/radar contact|identified/.test(s))o.rc=1;
 if(/go ?around/.test(s))o.ga=1;
 if(m=s.match(/(?:direct|dct|proceed(?: direct)?(?: to)?)\s+([a-z0-9]{2,6})\b/)){const f=FX().concat(Object.keys(WP)).find(n=>n.toLowerCase()===m[1]);if(f)o.dct=f;else o.err='unknown fix '+m[1].toUpperCase()}
 if(m=s.match(/(?:turn\s+)?(left|right)\s+(?:by\s+)?(\d{1,3})\s*(?:deg|degrees|°)\b/))o.rel=[m[1],+m[2]];
 else if(m=s.match(/(?:turn\s+(left|right)\s+)?(?:heading|hdg|h)\s*(\d{1,3})\b/)){o.h=+m[2];if(m[1])o.turn=m[1]}
 if(/present heading/.test(s))o.mph=1;
 if(m=s.match(/(?:climb|descend|maintain|alt(?:itude)?|cl|de|c|d)\s*(?:and maintain\s*)?(?:to\s*)?(fl\s*)?(\d{2,5})\s*(ft|feet)?\b/)){let v=+m[2];if(m[1]||(!m[3]&&v<=600))v*=100;o.alt=v}
 else if(m=s.match(/\bfl\s*(\d{2,3})\b/))o.alt=+m[1]*100;
 if(/normal speed|resume speed/.test(s))o.spd='N';else if(m=s.match(/(?:speed|spd|reduce(?: speed)?(?: to)?|increase(?: speed)?(?: to)?|s)\s*(\d{3})\b/))o.spd=+m[1];
 if(/\bils\b|cleared (?:for )?(?:the )?approach/.test(s))o.ils=1;
 if(/expedite/.test(s))o.exp=1;
 if(m=s.match(/orbit (left|right)/))o.orb=m[1];
 if(/\bqnh\b/.test(s))o.qnh=1;
 if(/contact tower|\btwr\b|\btower\b/.test(s))o.twr=1;
 if(/next sector|contact (?:munich|langen|london)?\s*(?:radar|control|center|centre)|\bsector\b/.test(s))o.sect=1;
 return{o,tgt}}
function applyText(txt){const{o,tgt}=parseCmd(txt);let a=sel;if(tgt){a=ac.find(q=>q.cs===tgt)||ac.find(q=>q.cs.endsWith(tgt.replace(/^[A-Z]+/,''))&&q.cs.startsWith(tgt.slice(0,3)));if(!a)return'No aircraft '+tgt+' on the scope.';sel=a;psig='';CTR.id=null}
 if(!a)return'Select an aircraft first (tap it) or start with its callsign, e.g. "DLH123 heading 270".';
 if(a.ctrl!=='C'||a.ph!=='air')return a.cs+' is not on your frequency.';
 if(o.err)return o.err+'.';
 if(o.rel){o.h=nrm(Math.round(a.th)+(o.rel[0]==='left'?-1:1)*o.rel[1]);o.turn=o.rel[0]}
 if(o.mph){o.h=Math.round(a.hdg)}
 delete o.rel;delete o.mph;if(!Object.keys(o).length)return'Not understood. Try "heading 270 descend 5000 speed 220" or "direct ROKIL".';
 sendCombo(a,o);return''}
// ---- UI box
const CTR={id:null,dh:null,da:null,ds:null};
function ctrBox(){let b=$('ctrb');if(MODE!=='C'){if(b)b.hidden=true;return}
 if(!b){b=document.createElement('div');b.id='ctrb';b.className='panel';$('ctl').before(b)}
 const a=sel,mine=a&&a.ctrl==='C'&&a.ph==='air';b.hidden=false;
 if(!mine){if(CTR.id!=='none'){CTR.id='none';b.innerHTML=`<div class="cgl">Type an instruction</div><form id="ctf" class="ctf"><input id="ctx" autocomplete="off" spellcheck="false" placeholder="DLH123 heading 270 descend 5000 speed 220" aria-label="Instruction"><button>Send</button></form><div class="small" id="ctm">Start with a callsign, or tap an aircraft first.</div>`;wireText()}return}
 if(CTR.id===a.id){ctrVals(a);return}
 CTR.id=a.id;CTR.dh=null;CTR.da=null;CTR.ds=null;const fx=FX();
 b.innerHTML=`<div class="cgl">Instruction for ${a.cs}</div>
 <div class="stp"><span class="l">HDG</span><button data-k="h" data-v="-10">−10</button><button data-k="h" data-v="-5">−5</button><b id="dh"></b><button data-k="h" data-v="5">+5</button><button data-k="h" data-v="10">+10</button></div>
 <div class="stp"><span class="l">ALT</span><button data-k="a" data-v="-1000">−1000</button><button data-k="a" data-v="-500">−500</button><b id="da"></b><button data-k="a" data-v="500">+500</button><button data-k="a" data-v="1000">+1000</button></div>
 <div class="stp"><span class="l">SPD</span><button data-k="s" data-v="-20">−20</button><button data-k="s" data-v="-10">−10</button><b id="ds"></b><button data-k="s" data-v="10">+10</button><button data-k="s" data-v="20">+20</button></div>
 <div class="row" style="gap:8px;margin-top:6px"><button class="on" id="cSend">Send instruction</button><button id="cReset">Reset</button><span class="small" id="cPrev"></span></div>
 <div class="cgl">Fill in the blanks</div>
 <div class="clz"><form data-t="h">Turn <select id="zt"><option>left</option><option>right</option></select> heading <input id="zh" inputmode="numeric" maxlength="3" size="3" placeholder="270"> <button>Send</button></form>
 <form data-t="a"><select id="zc"><option>Descend</option><option>Climb</option></select> and maintain <input id="za" inputmode="numeric" maxlength="5" size="5" placeholder="5000"> ft <button>Send</button></form>
 <form data-t="s">Speed <input id="zs" inputmode="numeric" maxlength="3" size="3" placeholder="220"> knots <button>Send</button></form>
 <form data-t="d">Proceed direct <select id="zd">${fx.map(n=>`<option>${n}</option>`).join('')}</select> <button>Send</button></form>
 ${a.dep?'':`<form data-t="i">Turn <select id="zit"><option>left</option><option>right</option></select> heading <input id="zih" inputmode="numeric" maxlength="3" size="3" placeholder="${pad(Math.round(nrm(RW[a.rw].h-30)),3)}">, cleared ILS runway ${a.rw} <button>Send</button></form>`}</div>
 <div class="cgl">Type an instruction</div><form id="ctf" class="ctf"><input id="ctx" autocomplete="off" spellcheck="false" placeholder="heading 270 descend 5000 speed 220" aria-label="Instruction"><button>Send</button></form><div class="small" id="ctm">Examples: <i>left 20 degrees</i>, <i>FL120</i>, <i>direct ROKIL</i>, <i>cleared ILS</i>, <i>contact tower</i>, <i>radar contact</i>, <i>expedite</i>, <i>orbit left</i>.</div>`;
 b.querySelectorAll('.stp button').forEach(x=>x.onclick=()=>{const k=x.dataset.k,v=+x.dataset.v;const A=sel;if(!A)return;
  if(k==='h')CTR.dh=nrm((CTR.dh!=null?CTR.dh:Math.round(A.th))+v);if(k==='a')CTR.da=cl((CTR.da!=null?CTR.da:Math.round(A.ta/100)*100)+v,2000,45000);if(k==='s')CTR.ds=cl((CTR.ds!=null?CTR.ds:Math.round(A.ts))+v,140,520);ctrVals(A)});
 $('cReset').onclick=()=>{CTR.dh=CTR.da=CTR.ds=null;ctrVals(sel)};
 $('cSend').onclick=()=>{const A=sel;if(!A)return;const o={};if(CTR.dh!=null)o.h=CTR.dh;if(CTR.da!=null)o.alt=CTR.da;if(CTR.ds!=null)o.spd=CTR.ds;if(!Object.keys(o).length)return;sendCombo(A,o);CTR.dh=CTR.da=CTR.ds=null;ctrVals(A)};
 b.querySelectorAll('.clz form').forEach(f=>f.onsubmit=e=>{e.preventDefault();const A=sel;if(!A)return;const t=f.dataset.t,o={};
  if(t==='h'){const v=+$('zh').value;if(!(v>=1&&v<=360))return;o.h=v;o.turn=$('zt').value}
  if(t==='a'){let v=+$('za').value;if(!v)return;if(v<=600)v*=100;o.alt=v}
  if(t==='s'){const v=+$('zs').value;if(!v)return;o.spd=v}
  if(t==='d')o.dct=$('zd').value;
  if(t==='i'){const v=+$('zih').value;if(v>=1&&v<=360){o.h=v;o.turn=$('zit').value}o.ils=1}
  sendCombo(A,o);f.querySelectorAll('input').forEach(i=>i.value='')});
 wireText();ctrVals(a)}
function wireText(){const f=$('ctf');if(!f)return;f.onsubmit=e=>{e.preventDefault();const v=$('ctx').value.trim();if(!v)return;const r=applyText(v);$('ctm').textContent=r||'Sent: '+v;$('ctm').style.color=r?'var(--warn)':'var(--ok)';if(!r)$('ctx').value=''}}
function ctrVals(a){if(!a||!$('dh'))return;const ch=k=>CTR[k]!=null;
 $('dh').textContent=pad(Math.round(ch('dh')?CTR.dh:a.th)%360||360,3)+'°';$('da').textContent=(ch('da')?CTR.da:Math.round(a.ta/100)*100)+' ft';$('ds').textContent=Math.round(ch('ds')?CTR.ds:a.ts)+' kt';
 ['dh','da','ds'].forEach(k=>$(k).classList.toggle('chg',ch(k)));
 const p=[];if(ch('dh'))p.push('HDG '+pad(Math.round(CTR.dh)%360||360,3));if(ch('da'))p.push(fl(CTR.da));if(ch('ds'))p.push(CTR.ds+' kt');$('cPrev').textContent=p.length?'Pending: '+p.join(' · '):'Adjust, then send once.';$('cSend').disabled=!p.length}
const _ui4=ui;ui=function(){_ui4();try{ctrBox()}catch(e){console.warn(e)}};
(()=>{const s=document.createElement('style');s.textContent=`#ctrb .stp{display:grid;grid-template-columns:44px repeat(2,minmax(0,1fr)) minmax(84px,1.2fr) repeat(2,minmax(0,1fr));gap:6px;align-items:center;margin:6px 0}#ctrb .stp b{text-align:center;font:600 16px var(--mono,ui-monospace);color:var(--sel)}#ctrb .stp b.chg{color:#5eead4;text-decoration:underline dotted}#ctrb .l{color:var(--dim);font-size:12px}
#ctrb button[disabled]{opacity:.45;cursor:default}.clz{display:grid;gap:6px}.clz form{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:14px;padding:6px 8px;border:1px dashed var(--line);border-radius:10px}
.clz input,.clz select,.ctf input{background:rgba(0,0,0,.28);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:6px 8px;font:600 14px var(--mono,ui-monospace)}.clz input{width:5.2em;text-align:center}.clz form button{margin-left:auto}
.ctf{display:flex;gap:6px}.ctf input{flex:1;min-width:0;font-weight:500}`;document.head.appendChild(s)})();
