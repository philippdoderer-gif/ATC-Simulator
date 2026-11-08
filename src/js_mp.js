
// ===================== multiplayer (room capability) =====================
const LOCALCMD=new Set(['tb','tv','tu','tx','info','batch']);
function RUN(d,a,g){if(!NET.client){NET.who=NET.on?NET.me():null;try{return d.f(a,g)}finally{NET.who=null}}if(LOCALCMD.has(d.id))return d.f(a,g);
 if(d.id==='gw'){say('Give way is not available in multiplayer – use Hold position / Continue.','sys');return}
 NET.send('cmd',{i:a.id,c:d.id,g,st:a.tb?a.tb.steps.map(s=>s.nm):null});if(d.id==='th'||d.id==='tg')a.tb=null}
function FINE(a,c){if(NET.client){NET.send('cmd',{i:a.id,c:'fine',g:c});return}NET.who=NET.on?NET.me():null;try{fine(a,c)}finally{NET.who=null}}
const MPR={G:'Ground',T:'Tower',C:'Center'};
NET.send=(t,d)=>{if(NET.room)NET.room.emit(t,d).catch(()=>{})};
NET.mpSel='G';NET.sp='single';
function rcode(){const A='abcdefghjkmnpqrstuvwxyz23456789';let s='';for(let i=0;i<5;i++)s+=A[Math.random()*A.length|0];return s}
const entRef=e=>{if(!e)return null;for(const id in ENT){const i=ENT[id].indexOf(e);if(i>=0)return[id,i]}return null};
const KEEP=new Set(['tb','pend','bay','ord']),SKIP=new Set(['tb','pend','bay','ord','gate','ent','pre','path','trail']);
const r4=v=>Math.round(v*1e4)/1e4;
function ser(a){const o={};for(const k in a){if(SKIP.has(k))continue;const v=a[k];if(typeof v==='function')continue;if(typeof v==='number')o[k]=Math.abs(v)<1e3?Math.round(v*1e5)/1e5:Math.round(v*10)/10;else o[k]=v}
 o.gate=gates.includes(a.gate)?a.gate.n:{n:a.gate.n,x:a.gate.x,y:a.gate.y};o.ent=entRef(a.ent);o.pre=entRef(a.pre);
 if(a.path)o.path=a.path.slice(a.pi,a.pi+40).map(p=>[r4(p[0]),r4(p[1]),p[2]||0]),o.pi=0;
 o.trail=(a.trail||[]).slice(-6).map(p=>[r4(p[0]),r4(p[1])]);return o}
function deser(o,old){const a=old||{};for(const k in a)if(!KEEP.has(k))delete a[k];Object.assign(a,o);
 a.gate=typeof o.gate==='string'?(gates.find(g=>g.n===o.gate)||{n:o.gate,x:0,y:0}):o.gate;a.ent=o.ent?ENT[o.ent[0]][o.ent[1]]:null;a.pre=o.pre?ENT[o.pre[0]][o.pre[1]]:null;return a}
// ---- host: broadcast
let MPT={g:0,a:0,p:0,m:0,c:0},MPQ=0;
function chunks(list){const out=[];let cur=[],sz=0;for(const o of list){const s=JSON.stringify(o);if(sz+s.length>3200&&cur.length){out.push(cur);cur=[];sz=0}cur.push(o);sz+=s.length+1}if(cur.length)out.push(cur);return out}
function hostTick(){const now=performance.now();if(!NET.on||NET.client||!NET.room||!NET.gameOn)return;
 const act=ac.filter(a=>a.ph!=='parked'||a.t<8),pk=ac.filter(a=>a.ph==='parked'&&a.t>=8);
 if(now-MPT.c>3000){MPT.c=now;NET.send('cfg',{ap,flow,code:NET.code})}
 if(now-MPT.g>1000){MPT.g=now;NET.send('g',{T:Math.round(T),score,land,dpt,viol,WX,ATIS,FLW,spd,paused,CELLS:CELLS.map(c=>({x:c.x,y:c.y,r:c.r,life:c.life})),closed:gates.filter(g=>g.closed).map(g=>g.n),staff:[...NET.staff],veh:[VEH.st,VEH.rw,VEH.until]})}
 if(now-MPT.a>1000){MPT.a=now;const q=++MPQ,ch=chunks(act.map(ser));ch.forEach((c,i)=>NET.send('st',{q,i,n:ch.length,ids:i?null:act.map(a=>a.id),A:c}));if(!ch.length)NET.send('st',{q,i:0,n:1,ids:[],A:[]})}
 if(now-MPT.p>4000){MPT.p=now;const q=++MPQ,ch=chunks(pk.map(ser));ch.forEach((c,i)=>NET.send('pk',{q,i,n:ch.length,ids:i?null:pk.map(a=>a.id),A:c}));if(!ch.length)NET.send('pk',{q,i:0,n:1,ids:[],A:[]})}
 if(now-MPT.m>250){MPT.m=now;const L=ac.filter(a=>a.ph!=='parked').map(a=>[a.id,r4(a.x),r4(a.y),Math.round(a.alt),Math.round(a.hdg),Math.round(a.s),a.ph,a.p?[r4(a.p.x),r4(a.p.y),Math.round(a.p.alt),Math.round(a.p.h),Math.round(a.p.s)]:0]);
  chunks(L).forEach(c=>NET.send('mv',c))}}
setInterval(hostTick,100);
const _say3=say;say=function(s,k){_say3(s,k);if(NET.on&&!NET.client&&NET.room)NET.send('lg',[String(s).slice(0,600),k||''])};
function onCmd(m){if(NET.client)return;const role=(peerRole(m.peer)||'');const d=m.data||{};if(d.c==='veh'){if(role==='T')vehAct(d.g==='1');return}const a=ac.find(q=>q.id===d.i);if(!a||!MPR[role])return;
 const m0=MODE,g0=GF,pr0=PEERS.find(x=>x.peer===m.peer);NET.who={n:pname(pr0),r:role};MODE=role;GF=a.dl?'D':'G';try{
  if(d.c==='combo'){if(a.ctrl===role)try{ctrCombo(a,JSON.parse(d.g))}catch(e){}return}
  if(d.c==='fine'){if(a.ctrl===role)fine(a,String(d.g));return}
  const def_=CM.find(q=>q.id===d.c&&q.m.includes(role));if(!def_)return;
  if(d.c==='th'||d.c==='tg'){tbStart(a);for(const nm of d.st||[])tbVia(a,nm)}
  if(!def_.args(a).map(String).includes(String(d.g))){if(d.c==='th'||d.c==='tg')a.tb=null;return}
  def_.f(a,d.g)}catch(e){console.warn(e)}finally{MODE=m0;GF=g0;psig='';NET.who=null}}
// ---- client: receive
let CA=new Map(),ACT=new Set(),PKS=new Set(),BUF={st:{},pk:{}};
function rebuild(){const keep=new Set([...ACT,...PKS]);for(const id of [...CA.keys()])if(!keep.has(id))CA.delete(id);ac=[...CA.values()];
 for(const g of gates)g.use=0;for(const a of ac)if(a.gate&&gates.includes(a.gate)&&['parked','gate','park','push','taxiin'].includes(a.ph))a.gate.use=a.id;if(sel&&!CA.has(sel.id))sel=null}
function onChunk(kind,m){if(!NET.client||!NET.ready)return;const d=m.data;if(!d||!Array.isArray(d.A))return;let b=BUF[kind][d.q];if(!b)b=BUF[kind][d.q]={n:d.n,got:0,A:[],ids:null};
 b.got++;b.A.push(...d.A);if(d.ids)b.ids=d.ids;if(b.got<b.n||!b.ids)return;delete BUF[kind][d.q];for(const k in BUF[kind])if(+k<d.q)delete BUF[kind][k];
 for(const o of b.A)CA.set(o.id,deser(o,CA.get(o.id)));(kind==='st'?ACT:PKS).clear();b.ids.forEach(i=>(kind==='st'?ACT:PKS).add(i));rebuild()}
function onMv(m){if(!NET.client||!NET.ready||!Array.isArray(m.data))return;for(const r of m.data){const a=CA.get(r[0]);if(!a)continue;a.x=r[1];a.y=r[2];a.alt=r[3];a.hdg=r[4];a.s=r[5];a.ph=r[6];if(r[7])a.p={x:r[7][0],y:r[7][1],alt:r[7][2],h:r[7][3],s:r[7][4]}}}
function onG(m){if(!NET.client||!NET.ready)return;const d=m.data||{};T=d.T;score=d.score;land=d.land;dpt=d.dpt;viol=d.viol;if(d.WX)WX=d.WX;if(d.ATIS)ATIS=d.ATIS;spd=d.spd;paused=d.paused;CELLS=(d.CELLS||[]).map(c=>Object.assign({hit:new Set()},c));
 if(d.FLW&&JSON.stringify(d.FLW)!==JSON.stringify(FLW)){FLW=d.FLW;FLW[1].forEach(id=>{const R=RW[id];if(R){WP['IF'+id]=[R.T0.x-R.dir[0]*15,R.T0.y-R.dir[1]*15];WP['FA'+id]=[R.T0.x-R.dir[0]*8,R.T0.y-R.dir[1]*8]}})}
 const cs=new Set(d.closed||[]);gates.forEach(g=>g.closed=cs.has(g.n));NET.staff=new Set(d.staff||[]);if(d.veh){VEH.st=d.veh[0];VEH.rw=d.veh[1];VEH.until=d.veh[2]}mpBadge()}
function onCfg(m){if(!NET.client||NET.ready)return;const d=m.data||{};if(!AP[d.ap])return;
 NET.ready=true;NET.gameOn=true;LB.hidden=true;NET.hostPeer=m.peer;ap=d.ap;selAp=d.ap;MODE=NET.role;CMB=false;FORCEFLOW=d.flow;$('menu').hidden=true;$('game').hidden=false;init();FORCEFLOW=null;
 const b=$('brief');if(b)b.remove();ac=[];CA.clear();paused=false;logs=[];$('log').innerHTML='';say('Joined session '+NET.code.toUpperCase()+' as '+MPR[MODE]+'. The host runs the clock.','sys');
 if(!started){started=true;requestAnimationFrame(loop)}mpBadge()}
function onLg(m){if(!NET.client||!NET.ready)return;const d=m.data;if(Array.isArray(d))_say3(String(d[0]),d[1]||undefined)}
// ---- standalone transport (PeerJS / WebRTC) used outside claude.ai
function loadPeer(){return new Promise((ok,no)=>{if(window.Peer)return ok();const s=document.createElement('script');s.src='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';s.onload=()=>ok();s.onerror=()=>no(new Error('could not load the network library'));document.head.appendChild(s)})}
async function peerRoom(code,host){await loadPeer();const id='atcsim-'+code,H={},PH=[],P=new Map();let me='',conns=[],hc=null,myPres={};
 const peersArr=()=>[...P.entries()].map(([peer,presence])=>({peer,presence,isMe:peer===me,sameTab:peer===me,by:null,kind:'viewer',guest:false}));
 const firePeers=(joined=[],left=[])=>{const pa=peersArr();PH.forEach(f=>f({peers:pa,joined,left,updated:[]}))};
 const deliver=(topic,data,peer)=>(H[topic]||[]).forEach(f=>{try{f({topic,data,peer,isMe:peer===me,sameTab:peer===me,by:null,kind:'viewer',guest:false})}catch(e){console.warn(e)}});
 const peer=new Peer(host?id:undefined,{debug:0});
 await new Promise((ok,no)=>{peer.on('open',x=>{me=x;ok()});peer.on('error',e=>no(new Error(e.type==='unavailable-id'?'this code is already in use':e.type==='peer-unavailable'?'no session with this code':e.message||e.type)))});
 const bcastPeers=()=>{const list=[...P.entries()];conns.forEach(c=>c.open&&c.send({t:'peers',list}));firePeers()};
 if(host){P.set(me,{});peer.on('connection',c=>{c.on('open',()=>{conns.push(c);P.set(c.peer,{});bcastPeers()});
   c.on('data',m=>{if(!m||typeof m!=='object')return;if(m.t==='pres'){P.set(c.peer,m.p||{});bcastPeers()}else if(m.t==='emit'){deliver(m.topic,m.data,c.peer);conns.forEach(o=>o!==c&&o.open&&o.send({t:'emit',topic:m.topic,data:m.data,peer:c.peer}))}});
   c.on('close',()=>{conns=conns.filter(o=>o!==c);const p=P.get(c.peer);P.delete(c.peer);bcastPeers();PH.forEach(f=>f({peers:peersArr(),joined:[],left:[{peer:c.peer,presence:p||{}}],updated:[]}))})})}
 else{hc=peer.connect(id,{reliable:true});await new Promise((ok,no)=>{const t=setTimeout(()=>no(new Error('no session with this code')),20000);hc.on('open',()=>{clearTimeout(t);ok()});peer.on('error',e=>{clearTimeout(t);no(new Error(e.type==='peer-unavailable'?'no session with this code':e.message||e.type))})});
  hc.on('data',m=>{if(!m||typeof m!=='object')return;if(m.t==='peers'){P.clear();m.list.forEach(([k,v])=>P.set(k,v));firePeers()}else if(m.t==='emit')deliver(m.topic,m.data,m.peer)});
  hc.on('close',()=>{const hp=id;PH.forEach(f=>f({peers:[],joined:[],left:[{peer:hp,presence:{host:true}}],updated:[]}))})}
 return{name:code,
  emit:async(topic,data)=>{if(host)conns.forEach(c=>c.open&&c.send({t:'emit',topic,data,peer:me}));else if(hc&&hc.open)hc.send({t:'emit',topic,data})},
  on:(t,f)=>{(H[t]=H[t]||[]).push(f);return()=>{H[t]=H[t].filter(x=>x!==f)}},
  presence:async p=>{myPres=Object.assign(myPres,p);P.set(me,myPres);if(host)bcastPeers();else if(hc&&hc.open)hc.send({t:'pres',p:myPres})},
  onPeers:f=>{PH.push(f);setTimeout(()=>f({peers:peersArr(),joined:peersArr(),left:[],updated:[]}),0);return()=>{}},peers:peersArr,connected:()=>!!(host||hc&&hc.open),
  leave:async()=>{try{peer.destroy()}catch(e){}}}}
// ---- standalone transport #1: public MQTT brokers over WebSocket (pure relay, works through any NAT/firewall)
function loadMqtt(){return new Promise((ok,no)=>{if(window.mqtt)return ok();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js';s.onload=()=>window.mqtt?ok():no(new Error('network library missing'));s.onerror=()=>no(new Error('could not load the network library'));document.head.appendChild(s)})}
const MQB=['wss://broker.emqx.io:8084/mqtt','wss://broker.hivemq.com:8884/mqtt','wss://test.mosquitto.org:8081'];
function mqttConn(url,opts){return new Promise((ok,no)=>{let c;try{c=mqtt.connect(url,Object.assign({connectTimeout:6000,reconnectPeriod:0,keepalive:30,clean:true},opts))}catch(e){return no(e)}let done=0;const t=setTimeout(()=>{if(!done){done=1;try{c.end(true)}catch(e){}no(new Error('timeout'))}},7500);c.once('connect',()=>{if(!done){done=1;clearTimeout(t);ok(c)}});c.once('error',e=>{if(!done){done=1;clearTimeout(t);try{c.end(true)}catch(x){}no(e)}})})}
async function mqttRoom(code,host){await loadMqtt();const base='atcsim-v1/'+code,me=Math.random().toString(36).slice(2,10),H={},PH=[],P=new Map(),seen=new Map(),last=new Map(),buf=new Map();let myPres={},c=null,mid=0,hostSeen=false,timers=[];
 const will={topic:base+'/p',payload:JSON.stringify({id:me,leave:1}),qos:0,retain:false};let lastErr;
 for(const u of MQB){try{c=await mqttConn(u,{clientId:'atcsim_'+me,will});break}catch(e){lastErr=e}}
 if(!c)throw new Error('could not reach the network ('+((lastErr&&lastErr.message)||'blocked')+')');
 c.options.reconnectPeriod=2000;
 const dec=p=>typeof p==='string'?p:new TextDecoder().decode(p),pub=(t,o)=>{try{c.publish(base+t,JSON.stringify(o),{qos:0,retain:false})}catch(e){}};
 const peersArr=()=>[...P.entries()].map(([peer,presence])=>({peer,presence,isMe:peer===me,sameTab:peer===me,by:null,kind:'viewer',guest:false}));
 const fire=(joined=[],left=[])=>{const pa=peersArr();PH.forEach(f=>f({peers:pa,joined,left,updated:[]}))};
 const deliver=(topic,data,peer)=>(H[topic]||[]).forEach(f=>{try{f({topic,data,peer,isMe:false,sameTab:false,by:null,kind:'viewer',guest:false})}catch(e){console.warn(e)}});
 const announce=()=>pub('/p',{id:me,p:myPres,h:host?1:0});
 const drop=id=>{if(!P.has(id))return;const p=P.get(id);P.delete(id);seen.delete(id);last.delete(id);fire([],[{peer:id,presence:p}])};
 c.on('message',(topic,payload)=>{let m;try{m=JSON.parse(dec(payload))}catch(e){return}if(!m||m.p===me||m.id===me)return;
  if(topic===base+'/p'){if(m.leave)return drop(m.id);if(m.h)hostSeen=true;const nw=!P.has(m.id),js=JSON.stringify(m.p||{});P.set(m.id,m.p||{});seen.set(m.id,Date.now());if(nw){announce();fire([{peer:m.id,presence:m.p||{}}],[])}else if(last.get(m.id)!==js)fire();last.set(m.id,js);return}
  if(topic===base+'/e'){if(m.n){const key=m.p+'/'+m.i;let b=buf.get(key);if(!b){b={parts:[],got:0};buf.set(key,b);if(buf.size>40)buf.delete(buf.keys().next().value)}b.parts[m.k]=m.s;b.got++;if(b.got===m.n){buf.delete(key);try{deliver(m.t,JSON.parse(b.parts.join('')),m.p)}catch(e){}}return}deliver(m.t,m.d,m.p)}});
 await new Promise((ok,no)=>c.subscribe([base+'/p',base+'/e'],{qos:0},e=>e?no(e):ok()));
 P.set(me,myPres);announce();
 const W=ms=>new Promise(r=>setTimeout(r,ms));
 const fail=m=>{try{c.end(true)}catch(e){}const e=new Error(m);throw e};
 if(host){await W(1500);if(hostSeen){try{c.end(true)}catch(e){}const e=new Error('this code is already in use');e.noFb=true;throw e}}
 else{for(let i=0;i<20&&!hostSeen;i++){await W(250);if(i%4===3)announce()}if(!hostSeen)fail('no session with this code')}
 timers.push(setInterval(announce,3000),setInterval(()=>{const n=Date.now();for(const [id,t] of seen)if(n-t>10000)drop(id)},2500));
 return{name:code,
  emit:async(topic,data)=>{const s=JSON.stringify(data===undefined?null:data),Z=30000;if(s.length<=Z)pub('/e',{p:me,t:topic,d:data===undefined?null:data});else{const id=++mid,n=Math.ceil(s.length/Z);for(let k=0;k<n;k++)pub('/e',{p:me,t:topic,i:id,n,k,s:s.slice(k*Z,(k+1)*Z)})}},
  on:(t,f)=>{(H[t]=H[t]||[]).push(f);return()=>{H[t]=H[t].filter(x=>x!==f)}},
  presence:async p=>{myPres=Object.assign(myPres,p);P.set(me,myPres);announce()},
  onPeers:f=>{PH.push(f);setTimeout(()=>f({peers:peersArr(),joined:peersArr(),left:[],updated:[]}),0);return()=>{}},peers:peersArr,connected:()=>!!c.connected,
  leave:async()=>{timers.forEach(clearInterval);pub('/p',{id:me,leave:1});setTimeout(()=>{try{c.end()}catch(e){}},200)}}}
// ---- room / lobby
let PEERS=[];const peerRole=p=>{const q=PEERS.find(x=>x.peer===p);return q&&q.presence&&q.presence.role};
function staffUpdate(){if(NET.client)return;const s=new Set();for(const p of PEERS){const r=p.presence&&p.presence.role;if(MPR[r])s.add(r)}if(NET.role)s.add(NET.role);NET.staff=s;mpBadge()}
async function mpConnect(code,role,host){let r=null;if(window.claude&&typeof claude.use==='function'){try{r=await claude.use('room')}catch(e){r=null}}
 let R=null;if(r)R=await r.join('atc-'+code);else{try{R=await mqttRoom(code,host)}catch(e){if(e.noFb)throw e;console.warn('mqtt:',e.message)}if(!R)R=await peerRoom(code,host)}
 NET.room=R;NET.code=code;NET.role=role;NET.on=true;NET.client=!host;NET.ready=host;
 R.on('st',m=>onChunk('st',m));R.on('pk',m=>onChunk('pk',m));R.on('mv',onMv);R.on('g',onG);R.on('cfg',onCfg);R.on('lg',onLg);R.on('cmd',onCmd);R.on('lob',onLob);R.on('chat',onChat);R.on('act',onAct);R.on('sel',onSel);let first=true;
 R.onPeers(ch=>{PEERS=ch.peers.slice();staffUpdate();mpLobby();NET.known=NET.known||new Set();for(const p of PEERS)if(!p.isMe&&p.presence&&p.presence.name&&!NET.known.has(p.peer)){NET.known.add(p.peer);if(!first)feedAdd({k:'sys',t:p.presence.name+' joined'})}for(const p of ch.left){if(NET.known.delete(p.peer))feedAdd({k:'sys',t:pname(p)+' left'});delete NET.sels[p.peer]}if(PEERS.length>1||ch.peers.length)setTimeout(()=>{first=false},1500);lobbyRender();if(NET.client&&NET.hostPeer&&ch.left.some(p=>p.peer===NET.hostPeer))say('⚠ The host left the session – the game is frozen. Back to the menu to start a new one.','sys')});
 await R.presence({role,host:!!host,code,name:NET.name});NET.lobbyUp=true;if(NET.client)setTimeout(joinAssign,1000);return R}
function mpBadge(){const t=$('ttl');if(!t||!NET.on)return;let b=$('mpb');if(!b){b=document.createElement('span');b.id='mpb';t.after(b)}
 b.innerHTML=`<span class="mpc">${NET.code.toUpperCase()}</span>`+['G','T','C'].map(r=>`<i class="${NET.staff.has(r)?'on':''}${r===MODE?' me':''}" title="${MPR[r]}${NET.staff.has(r)?' staffed':' (bot)'}">${r}</i>`).join('')}
function mpLobby(){const el=$('mpst');if(!el)return;const by={};for(const p of PEERS){const r=p.presence&&p.presence.role;if(MPR[r])(by[r]=by[r]||[]).push(p)}
 el.innerHTML=['G','T','C'].map(r=>`<span class="mpr ${by[r]?'on':''}">${MPR[r]}: ${by[r]?by[r].map(p=>(p.isMe&&p.sameTab?'you':'player')+(p.presence.host?' (host)':'')).join(', '):'free – bot'}</span>`).join('')}
// menu UI
(()=>{const h3=[...document.querySelectorAll('#menu h3')].find(x=>/Airport/.test(x.textContent));if(!h3)return;
 const box=document.createElement('div');box.id='mpbox';box.innerHTML=`
 <div class="spm" role="tablist"><button id="mSingle" class="on" role="tab">Singleplayer</button><button id="mMulti" role="tab">Multiplayer</button></div>
 <div id="mpPanel" hidden><div class="mpgrid">
  <section><h4>Host a session</h4><p class="small">Uses the airport and start hour picked below. You get a code to share.</p>
   <div class="mprole" data-for="h"><button data-r="G" class="on">Ground</button><button data-r="T">Tower</button><button data-r="C">Center</button></div>
   <button class="go2" id="mpHost">Create session</button><div id="mpCode" class="mpcode" hidden></div></section>
  <section><h4>Join with a code</h4><p class="small">Enter the host's 5-character code and pick a free position.</p>
   <input id="mpIn" maxlength="5" autocomplete="off" spellcheck="false" placeholder="e.g. K7RQ2" aria-label="Session code">
   <div class="mprole" data-for="j"><button data-r="G">Ground</button><button data-r="T" class="on">Tower</button><button data-r="C">Center</button></div>
   <button class="go2" id="mpJoin">Join session</button></section></div>
  <div id="mpst" class="mpst"></div><p class="small" id="mpMsg">Share the code with the other players. Positions nobody takes are run by bots.</p></div>`;
 h3.before(box);
 const role={h:'G',j:'T'};box.querySelectorAll('.mprole').forEach(g=>g.onclick=e=>{const b=e.target.closest('[data-r]');if(!b)return;role[g.dataset.for]=b.dataset.r;g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))});
 const setSP=m=>{NET.sp=m;$('mSingle').classList.toggle('on',m==='single');$('mMulti').classList.toggle('on',m==='multi');$('mpPanel').hidden=m!=='multi';$('start').hidden=m==='multi';const x=document.querySelector('#mdc [data-m="X"]');if(x)x.hidden=m==='multi'};
 $('mSingle').onclick=()=>setSP('single');$('mMulti').onclick=()=>setSP('multi');
 const msg=t=>{$('mpMsg').innerHTML=t};
 $('mpHost').onclick=async()=>{const code=rcode();msg('Connecting\u2026');try{await mpConnect(code,role.h,true)}catch(e){msg('Could not create the session: '+(e.message||e));NET.on=false;return}
  msg('');startH=+$('stt').value;staffUpdate();lobbyOpen()};
 $('mpJoin').onclick=async()=>{const code=($('mpIn').value||'').trim().toLowerCase();if(!/^[a-z0-9]{5}$/.test(code)){msg('Enter the 5-character code from the host.');return}msg('Connecting…');
  try{await mpConnect(code,role.j,false)}catch(e){msg('Could not join: '+(e.message||e)+'.');NET.on=false;return}
  msg('');lobbyOpen()};
 const _bm=buildMenu;buildMenu=function(){_bm();const x=document.querySelector('#mdc [data-m="X"]');if(x)x.hidden=NET.sp==='multi'};
 // client: speed/pause are the host's
 document.addEventListener('click',e=>{if(!NET.client)return;if(e.target.closest('.sp,#pz')){e.stopPropagation();e.preventDefault();say('Only the host controls speed and pause.','sys')}},true);
 const _back=$('back').onclick;$('back').onclick=()=>{mpLeave();msg('Share the code with the other players. Positions nobody takes are run by bots.');_back()};
 const st=document.createElement('style');st.textContent=`#mpbox{margin:6px 0 4px}.spm{display:inline-flex;border:1px solid var(--line);border-radius:12px;padding:3px;gap:3px;background:var(--glass)}.spm button{border:0;background:transparent;color:var(--dim);padding:9px 16px;border-radius:9px;font-weight:600;cursor:pointer}#mpbox .spm button.on{background:var(--ok);color:#04121c;border:0}#mpIn::placeholder{text-transform:none;letter-spacing:.05em;font-size:15px}
#mpPanel{margin-top:12px;border:1px solid var(--line);border-radius:16px;padding:14px;background:var(--glass)}.mpgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.mpgrid section{min-width:0;display:grid;gap:10px;align-content:start}.mpgrid h4{margin:0;font:600 17px var(--disp)}.mpgrid p{margin:0}
.mprole{display:flex;gap:6px;flex-wrap:wrap}.mprole button{border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--fg);border-radius:10px;padding:8px 12px;cursor:pointer}.mprole button.on{border-color:var(--acc);background:rgba(76,201,240,.15)}
#mpIn{font:600 22px var(--mono);letter-spacing:.3em;text-transform:uppercase;background:rgba(0,0,0,.25);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:10px 12px;width:100%;max-width:240px}
.mpgrid .go2{border:0;cursor:pointer;justify-self:start}.mpcode{font:500 15px var(--mono)}.mpcode b{font-size:26px;letter-spacing:.2em;color:var(--sel)}
.mpst{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 6px}.mpr{font-size:12px;border:1px solid var(--line);border-radius:99px;padding:4px 10px;color:var(--dim)}.mpr.on{color:var(--ok);border-color:rgba(94,234,212,.45)}
#mpb{display:inline-flex;gap:4px;align-items:center;margin-left:8px}#mpb .mpc{font:600 12px var(--mono);letter-spacing:.15em;color:var(--sel);margin-right:4px}#mpb i{font:600 11px var(--mono);font-style:normal;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid var(--line);color:var(--dim)}#mpb i.on{color:var(--ok);border-color:rgba(94,234,212,.5)}#mpb i.me{background:rgba(94,234,212,.15)}
@media(max-width:700px){.mpgrid{grid-template-columns:1fr}}`;document.head.appendChild(st)})();
