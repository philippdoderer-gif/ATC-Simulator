// ===================== lobby, team chat & shared activity =====================
NET.name=(()=>{let n='';try{n=localStorage.getItem('atc_name')||''}catch(e){}return n||('Pilot'+(100+Math.random()*900|0))})();
NET.me=()=>({n:NET.name,r:NET.role});NET.feed=[];NET.sels={};NET.gameOn=false;NET.lob=null;NET.who=null;
const ESC=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RCOL={G:'#ffd166',T:'#5eead4',C:'#4cc9f0'};
const pname=p=>(p&&p.presence&&p.presence.name)||'Player';
function feedAdd(it){NET.feed.push(it);if(NET.feed.length>90)NET.feed.shift();renderFeed()}
function feedHtml(it){const col=RCOL[it.r]||'#8296b4';
 if(it.k==='chat')return `<div class="fm"><b style="color:${col}">${ESC(it.n)}</b> ${ESC(it.t)}</div>`;
 if(it.k==='act')return `<div class="fa"><b style="color:${col}">${ESC(it.n)}</b> <span>${MPR[it.r]||''}</span> → ${ESC(it.cs||'')}: ${ESC(it.t)}</div>`;
 return `<div class="fs">${ESC(it.t)}</div>`}
function renderFeed(){const h=NET.feed.map(feedHtml).join('');for(const id of['lbChat','tmFeed']){const e=$(id);if(!e)continue;const nb=e.scrollTop+e.clientHeight>=e.scrollHeight-30;e.innerHTML=h;if(nb)e.scrollTop=1e6}}
NET.act=(a,t)=>{if(!NET.who)return;const it={k:'act',n:NET.who.n,r:NET.who.r,cs:rc(a),t:String(t).slice(0,140)};feedAdd(it);NET.send('act',it)};
function sendChat(inp){const t=(inp.value||'').trim().slice(0,200);if(!t||!NET.on)return;inp.value='';const d={n:NET.name,r:NET.role,t};feedAdd(Object.assign({k:'chat'},d));NET.send('chat',d)}
function onChat(m){const d=m.data;if(!d||!d.t)return;feedAdd({k:'chat',n:String(d.n||'?').slice(0,16),r:d.r,t:String(d.t).slice(0,240)})}
function onAct(m){const d=m.data;if(!d||!d.t)return;feedAdd({k:'act',n:String(d.n||'?').slice(0,16),r:d.r,cs:String(d.cs||'').slice(0,30),t:String(d.t).slice(0,160)})}
function onSel(m){const d=m.data||{};NET.sels[m.peer]={i:d.i||0,n:d.n,r:d.r}}
function onLob(m){if(!NET.client||NET.gameOn)return;NET.lob=m.data;lobbyRender()}
// ---- lobby overlay
const LB=document.createElement('div');LB.id='lobby';LB.hidden=true;LB.innerHTML=`<div class="lbcard">
 <div class="lbhead"><div><h2>Lobby</h2><div class="lbsub" id="lbSub">Waiting for the host to start the game</div></div>
  <div class="lbcode"><span>Session code</span><b id="lbCode">-----</b><button id="lbCopy">Copy</button></div></div>
 <div class="lbset" id="lbSet"></div>
 <div class="lbcols"><section><h4>Players</h4><div id="lbPl"></div>
   <label class="lbname">Your name<input id="lbName" maxlength="14" autocomplete="off" spellcheck="false"></label>
   <p class="small" id="lbBots"></p></section>
  <section><h4>Chat</h4><div id="lbChat"></div><form id="lbForm"><input id="lbMsg" maxlength="200" autocomplete="off" placeholder="Message to the team…"><button>Send</button></form></section></div>
 <div class="lbfoot"><button id="lbLeave">Leave</button><span class="lbwait" id="lbWait"></span><button id="lbStart" class="go2">Start game</button></div></div>`;
document.body.appendChild(LB);
const APN={MUC:'Munich (EDDM)',FRA:'Frankfurt (EDDF)',LHR:'London Heathrow (EGLL)'};
const hh=h=>h<0?'live local time':String(Math.floor(h)).padStart(2,'0')+':00';
function lobbyRender(){if(LB.hidden)return;const host=!NET.client,taken={};for(const p of PEERS){const r=p.presence&&p.presence.role;if(MPR[r]&&!p.isMe)taken[r]=1}
 $('lbCode').textContent=(NET.code||'').toUpperCase();
 const set=host?{ap:selAp,h:+$('stt').value}:(NET.lob||{});
 if(host){if(!$('lbAp')){$('lbSet').innerHTML=`<span>Airport</span><select id="lbAp">${Object.keys(APN).map(k=>`<option value="${k}">${APN[k]}</option>`).join('')}</select><span>Start time</span><select id="lbHr"><option value="-2">Live local time</option>${Array.from({length:24},(_,i)=>`<option value="${i}">${String(i).padStart(2,'0')}:00</option>`).join('')}</select>`;
   $('lbAp').onchange=e=>{const v=+$('stt').value;selAp=e.target.value;buildMenu();$('stt').value=v};$('lbHr').onchange=e=>{$('stt').value=e.target.value}}
  $('lbAp').value=selAp;const hv=+$('stt').value;$('lbHr').value=String(hv<0&&hv!==-2?-2:hv)}else
 $('lbSet').innerHTML=set.ap?`<span>Airport</span><b>${APN[set.ap]||set.ap}</b><span>Start time</span><b>${hh(set.h==null?-1:set.h)}</b>`:'<span>Waiting for the host…</span>';
 let rows='';for(const p of PEERS){const pr=p.presence||{},me=p.isMe;rows+=`<div class="lbp${me?' me':''}"><i class="av" style="background:${RCOL[pr.role]||'#556'}">${ESC((pr.name||'?')[0]||'?').toUpperCase()}</i><div class="pn"><b>${ESC(pr.name||'Player')}</b><small>${pr.host?'Host':'Player'}${me?' · you':''}</small></div><div class="mprole">${['G','T','C'].map(r=>`<button data-r="${r}" class="${pr.role===r?'on':''}" ${me&&(!taken[r]||pr.role===r)?'':'disabled'}>${MPR[r]}</button>`).join('')}</div></div>`}
 $('lbPl').innerHTML=rows;
 const free=['G','T','C'].filter(r=>!NET.staff.has(r)&&!Object.keys(taken).includes(r)&&NET.role!==r).map(r=>MPR[r]);
 $('lbBots').textContent=free.length?'Run by bots: '+free.join(', ')+'.':'All three positions are staffed by players.';
 $('lbStart').hidden=!host;$('lbWait').textContent=host?'You are the host – start when everyone is ready.':'Waiting for the host to start…';
 $('lbSub').textContent=host?'Share the code, pick your position, then start the game':'Pick your position – the host starts the game'}
$('lbPl').onclick=e=>{const b=e.target.closest('button[data-r]');if(!b||b.disabled)return;setRole(b.dataset.r)};
function setRole(r){NET.role=r;if(NET.room)NET.room.presence({role:r});if(!NET.client)staffUpdate();lobbyRender()}
$('lbName').value=NET.name;$('lbName').onchange=e=>{const n=(e.target.value||'').trim().slice(0,14)||NET.name;NET.name=n;e.target.value=n;try{localStorage.setItem('atc_name',n)}catch(x){}if(NET.room)NET.room.presence({name:n})};
$('lbForm').onsubmit=e=>{e.preventDefault();sendChat($('lbMsg'))};
$('lbCopy').onclick=()=>{const c=(NET.code||'').toUpperCase();try{navigator.clipboard.writeText(c)}catch(e){}$('lbCopy').textContent='Copied';setTimeout(()=>$('lbCopy').textContent='Copy',1200)};
$('lbLeave').onclick=()=>mpLeave();
$('lbStart').onclick=()=>hostStart();
function lobbyOpen(){LB.hidden=false;if($('lbAp'))$('lbSet').innerHTML='';$('lbName').value=NET.name;NET.feed=[];renderFeed();lobbyRender();feedAdd({k:'sys',t:'Welcome – session '+(NET.code||'').toUpperCase()+'. Chat with your team here.'})}
setInterval(()=>{if(NET.on&&!NET.client&&!NET.gameOn&&NET.room&&NET.lobbyUp){NET.send('lob',{ap:selAp,h:+$('stt').value});lobbyRender()}},1000);
function mpLeave(){if(NET.room){try{NET.room.leave().catch(()=>{})}catch(e){}NET.room=null}NET.on=false;NET.client=false;NET.ready=false;NET.gameOn=false;NET.lobbyUp=false;NET.staff=new Set();NET.sels={};NET.feed=[];NET.known=null;PEERS=[];LB.hidden=true;const b=$('mpb');if(b)b.remove();const t=$('team');if(t)t.hidden=true;$('mpCode').hidden=true}
function hostStart(){if(NET.client||!NET.on)return;startH=+$('stt').value;if(startH===-2)startH=nowLocal(selAp);ap=selAp;MODE=NET.role;CMB=false;LB.hidden=true;$('menu').hidden=true;$('game').hidden=false;init();NET.gameOn=true;staffUpdate();
 say('Game started – session '+NET.code.toUpperCase()+'. You are '+MPR[MODE]+'.','sys');if(!started){started=true;requestAnimationFrame(loop)}NET.send('cfg',{ap,flow,code:NET.code});feedAdd({k:'sys',t:'Game started.'})}
// join: pick a free position / refuse when the session is full
function joinAssign(){const taken=new Set(PEERS.filter(p=>!p.isMe).map(p=>p.presence&&p.presence.role));if(!taken.has(NET.role))return;const f=['T','C','G'].find(r=>!taken.has(r));if(f)setRole(f);else{mpLeave();$('menu').hidden=false;$('mpMsg').textContent='This session is full – all three positions are taken.'}}
// ---- who is doing what: selection rings
const _drawL=draw;draw=function(){_drawL();if(!NET.on||!Object.keys(NET.sels).length)return;try{const W=cv.clientWidth,dpr=devicePixelRatio||1,k=W/2/view.r,c=W/2;cx.save();cx.setTransform(dpr,0,0,dpr,0,0);cx.font='600 11px system-ui';cx.textBaseline='middle';const used={};
 for(const p of PEERS){if(p.isMe)continue;const s=NET.sels[p.peer];if(!s||!s.i)continue;const a=ac.find(q=>q.id===s.i);if(!a||a.ph==='parked')continue;const x=c+(a.x-view.x)*k,y=c-(a.y-view.y)*k;if(x<-30||y<-30||x>W+30||y>W+30)continue;const col=RCOL[(p.presence||{}).role]||'#fff',n=used[a.id]=(used[a.id]||0)+1;
  cx.strokeStyle=col;cx.lineWidth=2;cx.setLineDash([5,3]);cx.beginPath();cx.arc(x,y,15+3*(n-1),0,7);cx.stroke();cx.setLineDash([]);const lab=pname(p),w=cx.measureText(lab).width+10;cx.fillStyle='rgba(6,11,20,.82)';cx.fillRect(x+16,y-24-(n-1)*16,w,15);cx.fillStyle=col;cx.fillText(lab,x+21,y-16.5-(n-1)*16)}
 cx.restore()}catch(e){}};
setInterval(()=>{if(!NET.on||!(NET.gameOn||NET.ready))return;const id=sel?sel.id:0;if(id!==NET.lastSel){NET.lastSel=id;NET.send('sel',{i:id,n:NET.name,r:NET.role})}},400);
// ---- in-game team panel
(()=>{const pl=$('log').closest('.panel');if(!pl)return;const t=document.createElement('div');t.className='panel';t.id='team';t.hidden=true;
 t.innerHTML=`<div class="tmh"><b>Team</b><span id="tmPl"></span></div><div id="tmFeed"></div><form id="tmForm"><input id="tmMsg" maxlength="200" autocomplete="off" placeholder="Message the team…"><button>Send</button></form>`;pl.after(t);
 $('tmForm').onsubmit=e=>{e.preventDefault();sendChat($('tmMsg'))};
 setInterval(()=>{const on=NET.on&&(NET.gameOn||NET.ready);t.hidden=!on;if(!on)return;$('tmPl').innerHTML=PEERS.map(p=>{const pr=p.presence||{},s=NET.sels[p.peer],a=s&&s.i&&ac.find(q=>q.id===s.i);return `<span class="tc"><i style="background:${RCOL[pr.role]||'#556'}">${(pr.role||'?')}</i>${ESC(pr.name||'Player')}${p.isMe?' (you)':''}${a&&!p.isMe?` <em>${ESC(a.cs)}</em>`:''}</span>`}).join('')},800)})();
const lbst=document.createElement('style');lbst.textContent=`#lobby{position:fixed;inset:0;z-index:60;background:radial-gradient(1200px 700px at 50% -10%,#10213b,#060b14);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:max(16px,env(safe-area-inset-top)) 16px 24px}
#lobby[hidden]{display:none}.lbcard{width:100%;max-width:860px;border:1px solid var(--line);border-radius:20px;background:var(--glass);backdrop-filter:blur(10px);padding:20px;margin-top:4vh;display:grid;gap:16px}
.lbhead{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-start}.lbhead h2{margin:0;font:700 30px var(--disp)}.lbsub{color:var(--dim);font-size:14px;margin-top:4px}
.lbcode{display:flex;align-items:center;gap:10px;border:1px solid var(--line);border-radius:14px;padding:8px 12px;background:rgba(0,0,0,.25)}.lbcode span{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dim)}.lbcode b{font:600 26px var(--mono);letter-spacing:.25em;color:var(--sel)}
.lbset{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:6px 12px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:10px 14px;font-size:14px}.lbset span{color:var(--dim)}.lbset select{background:rgba(0,0,0,.25);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:8px;font:inherit;min-width:0}
.lbcols{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px}.lbcols section{min-width:0;display:grid;gap:10px;align-content:start}.lbcols h4{margin:0;font:600 17px var(--disp)}
.lbp{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border:1px solid var(--line);border-radius:12px;padding:8px 10px;background:rgba(255,255,255,.03)}.lbp.me{border-color:var(--acc)}.lbp .pn{display:grid;min-width:90px;flex:1}.lbp small{color:var(--dim)}
.av{width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:700 14px system-ui;font-style:normal;color:#04121c}
.lbp .mprole button{padding:6px 10px;font-size:13px}.lbp .mprole button:disabled{opacity:.35;cursor:default}
.lbname{display:grid;gap:4px;font-size:13px;color:var(--dim)}.lbname input,#lbMsg,#tmMsg{background:rgba(0,0,0,.25);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:9px 11px;font:inherit;min-width:0;width:100%}
#lbChat,#tmFeed{height:210px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:8px 10px;background:rgba(0,0,0,.2);font-size:13px;display:flex;flex-direction:column;gap:3px}#tmFeed{height:9.5em}
.fm b,.fa b{margin-right:4px}.fa{color:var(--dim)}.fa span{font-size:11px;opacity:.8}.fs{color:var(--dim);font-style:italic}
#lbForm,#tmForm{display:flex;gap:8px}#lbForm button,#tmForm button,.lbfoot button{border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--fg);border-radius:10px;padding:9px 14px;cursor:pointer}
.lbfoot{display:flex;align-items:center;gap:12px;flex-wrap:wrap}[hidden]{display:none!important}.lbwait{flex:1;color:var(--dim);font-size:14px}.lbfoot .go2{border:0;font-size:16px;padding:12px 22px}
#team .tmh{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px}#tmPl{display:flex;gap:6px;flex-wrap:wrap}.tc{font-size:12px;border:1px solid var(--line);border-radius:99px;padding:2px 9px 2px 3px;display:inline-flex;gap:5px;align-items:center;color:var(--fg)}.tc i{width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:700 10px system-ui;font-style:normal;color:#04121c}.tc em{color:var(--sel);font-style:normal}
#tmFeed{margin-bottom:6px}
@media(max-width:700px){.lbcols{grid-template-columns:1fr}.lbset{grid-template-columns:auto 1fr}}`;document.head.appendChild(lbst);
