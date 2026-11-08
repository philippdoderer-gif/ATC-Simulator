// ===================== v16: multiplayer extras: ready check, spectator, host-left notice =====================
RCOL.S='#9aa7bd';NET.spec=false;
{const _s=NET.send;NET.send=(t,d)=>{if(NET.spec&&t==='cmd'){say('Spectators cannot issue commands.','sys');return}_s(t,d)}}
{const _i=init;init=function(){if(NET.on&&NET.role==='S'){NET.spec=true;MODE='T';CMB=false}else NET.spec=false;_i()}}
{const _j=joinAssign;joinAssign=function(){if(NET.role==='S')return;_j()}}
{const _sr=setRole;setRole=function(r){if(r==='S'&&!NET.client)return;_sr(r);if(r==='S'&&NET.room)NET.room.presence({rdy:true})}}
NET.rdy=false;
function setReady(v){NET.rdy=v;if(NET.room)NET.room.presence({rdy:v});lobbyRender()}
{const _lr=lobbyRender;lobbyRender=function(){_lr();if(LB.hidden)return;
 const me=document.querySelector('#lbPl .lbp.me .mprole');
 if(me&&NET.client){const b=document.createElement('button');b.dataset.r='S';b.textContent='Spectator';if(NET.role==='S')b.className='on';me.appendChild(b)}
 document.querySelectorAll('#lbPl .lbp').forEach((row,i)=>{const p=PEERS[i];if(!p)return;const pr=p.presence||{},sm=row.querySelector('small');
  if(!sm)return;const isHost=!!pr.host;const ok=isHost||pr.rdy||pr.role==='S';sm.innerHTML=(pr.host?'Host':pr.role==='S'?'Spectator':'Player')+(p.isMe?' · you':'')+(isHost?'':` · <span style="color:${ok?'var(--ok)':'var(--warn)'}">${ok?'ready ✓':'not ready'}</span>`)});
 if(NET.client&&!$('lbRdy')){const b=document.createElement('button');b.id='lbRdy';b.textContent='Ready';b.onclick=()=>setReady(!NET.rdy);$('lbWait').after(b)}
 const rb=$('lbRdy');if(rb){rb.hidden=!NET.client;rb.textContent=NET.rdy?'✓ Ready (tap to undo)':'I am ready';rb.className=NET.rdy?'go2':''}
 if(!NET.client){const n=PEERS.filter(p=>!p.isMe&&!(p.presence&&(p.presence.rdy||p.presence.role==='S'))).length;$('lbStart').textContent=n?`Start anyway (${n} not ready)`:'Start game';$('lbWait').textContent=n?n+' player(s) not ready yet.':'Everyone is ready.'}}}
{const _ml=mpLeave;mpLeave=function(){NET.rdy=false;NET.spec=false;_ml()}}
// host disappears during a running client game
let HOSTSEEN=0;setInterval(()=>{if(!NET.on||!NET.client||!(NET.gameOn||NET.ready))return;const h=PEERS.some(p=>p.presence&&p.presence.host);
 if(h){HOSTSEEN=Date.now();const b=$('hostGone');if(b)b.remove();return}
 if(HOSTSEEN&&Date.now()-HOSTSEEN>8000&&!$('hostGone')){const d=document.createElement('div');d.id='hostGone';d.innerHTML='The host has left or lost connection. The game is paused for you. <button id="hgL">Leave session</button>';d.style.cssText='position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:90;background:#2a1118;border:1px solid var(--warn);color:var(--fg);padding:10px 14px;border-radius:14px;max-width:90vw;font-size:14px';document.body.appendChild(d);$('hgL').onclick=()=>{d.remove();mpLeave();$('game').hidden=true;$('menu').hidden=false}}},2000);
// spectator badge
setInterval(()=>{if(!NET.spec||$('game').hidden)return;const t=$('ttl');if(t&&!/Spectator/.test(t.textContent))t.textContent='👁 Spectator · '+t.textContent},1000);
