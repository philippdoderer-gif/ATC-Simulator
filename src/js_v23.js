/* v23: local pilot profile (stats, rank, badges) – stored on this device only */
(function(){
const KEY='atc_prof',RANKS=[[0,'Trainee'],[200,'Assistant'],[600,'Controller'],[1500,'Senior Controller'],[3500,'Supervisor'],[8000,'Chief Controller']];
const ld=()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(p&&p.tot)return p}catch(e){}return{tot:{sh:0,land:0,dpt:0,viol:0,hrs:0,xp:0},per:{},badges:{},hist:[],aps:{},mds:{},daily:0}};
const sv=p=>{try{localStorage.setItem(KEY,JSON.stringify(p))}catch(e){}};
const BG=[
['first','First shift','Finish your first shift',(p,r)=>p.tot.sh>=1],
['m10','Warming up','10 movements in one shift',(p,r)=>r&&r.mov>=10],
['m30','Busy hour','30 movements in one shift',(p,r)=>r&&r.mov>=30],
['clean','Clean sheet','15+ movements with no violations',(p,r)=>r&&r.mov>=15&&r.viol===0],
['gA','Top grade','Finish a shift with grade A',(p,r)=>r&&r.g==='A'],
['t100','Century','100 movements in total',p=>p.tot.land+p.tot.dpt>=100],
['t500','Workhorse','500 movements in total',p=>p.tot.land+p.tot.dpt>=500],
['s5','Regular','Finish 5 shifts',p=>p.tot.sh>=5],
['s25','Veteran','Finish 25 shifts',p=>p.tot.sh>=25],
['tour','World tour','Work shifts at Munich, Frankfurt and Heathrow',p=>['MUC','FRA','LHR'].every(a=>p.aps[a])],
['all','All-rounder','Work Ground, Tower and Center',p=>['G','T','C'].every(m=>p.mds[m])],
['dly','Daily driver','Finish a daily challenge',p=>p.daily>=1],
['hrs','Long haul','10 hours on frequency',p=>p.tot.hrs>=10]];
const rankOf=x=>{let i=0;RANKS.forEach((r,j)=>{if(x>=r[0])i=j});return i};
let lastRec='';
function record(){try{if(typeof gradeOf!=='function')return;const r=gradeOf();if(r.mov<3)return;const id=ap+'|'+MODE+'|'+score+'|'+(T|0);if(id===lastRec)return;lastRec=id;
 const p=ld(),md=CMB?'X':MODE,k=ap+md,xp=Math.max(0,r.mov*10+r.pts);
 p.tot.sh++;p.tot.land+=land;p.tot.dpt+=dpt;p.tot.viol+=viol;p.tot.hrs+=r.hrs;p.tot.xp+=xp;
 const q=p.per[k]||(p.per[k]={sh:0,best:-1e9,g:'–'});q.sh++;if(score>q.best){q.best=score;q.g=r.g}
 p.aps[ap]=1;if(MODE)p.mds[CMB?'G':MODE]=1;if(CMB)p.mds.T=1;if(typeof DAILY!=='undefined'&&DAILY)p.daily++;
 p.hist.unshift({d:new Date().toISOString().slice(0,10),ap,md,score,g:r.g,mov:r.mov});p.hist=p.hist.slice(0,8);
 const nb=[];for(const b of BG)if(!p.badges[b[0]]&&b[3](p,{mov:r.mov,viol,g:r.g})){p.badges[b[0]]=new Date().toISOString().slice(0,10);nb.push(b[1])}
 sv(p);render();if(nb.length&&typeof say==='function')say('New badge: '+nb.join(', '),'sys')}catch(e){}}
document.getElementById('endB').addEventListener('click',record,true);
const css=`#profPage{position:fixed;inset:0;z-index:9000;overflow:auto;background:radial-gradient(900px 420px at 10% 110%,rgba(255,150,50,.16),transparent 62%),radial-gradient(1000px 520px at 90% -10%,rgba(88,110,230,.28),transparent 60%),#070a15;color:var(--fg,#f3efe7)}
#profPage[hidden]{display:none}
.pp-top{position:sticky;top:0;display:flex;align-items:center;gap:16px;padding:14px max(16px,calc((100% - 1100px)/2));background:rgba(7,10,21,.92);backdrop-filter:blur(8px);z-index:2;border-bottom:1px solid rgba(170,185,230,.14)}
.pp-top button{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:inherit;border-radius:99px;padding:8px 16px;font:600 14px var(--disp);cursor:pointer}
.pp-top span{font:600 16px var(--disp);color:#9aa3bd}
.pp-in{max-width:1100px;margin:0 auto;padding:28px 16px 80px}
#prof h2{font:700 clamp(30px,5vw,46px) var(--disp);margin:0 0 20px}
.pf-io{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.pf-io button{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:inherit;border-radius:99px;padding:7px 14px;font:600 13px var(--disp);cursor:pointer}
.pf-io textarea{width:100%;margin-top:8px;min-height:90px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.35);color:inherit;font:12px var(--mono);padding:8px}
.pf{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:18px}
.pf>div{align-self:start;border-radius:22px;border:1px solid var(--m-line,rgba(170,185,230,.14));background:var(--m-glass,rgba(20,26,50,.8));padding:20px}
.pf-id{display:flex;gap:16px;align-items:center}
.pf-av{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;font:700 24px var(--disp);color:#1b1203;background:linear-gradient(135deg,#ffb23e,#ff8a3d);box-shadow:0 0 0 4px rgba(255,178,62,.18);flex:none}
.pf-id input{background:none;border:0;border-bottom:1px dashed rgba(255,255,255,.25);color:var(--fg,#f3efe7);font:700 22px var(--disp);width:100%;padding:2px 0}
.pf-rank{font:600 14px var(--mono);color:#ffb23e;margin-top:4px}
.pf-bar{height:8px;border-radius:9px;background:rgba(255,255,255,.08);margin:16px 0 6px;overflow:hidden}.pf-bar i{display:block;height:100%;background:linear-gradient(90deg,#ffb23e,#ff8a3d);border-radius:9px}
.pf-sm{color:#8d97b4;font-size:13px}
.pf-st{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:16px}
.pf-st div{padding:12px;border-radius:14px;background:rgba(255,255,255,.04)}.pf-st b{display:block;font:700 26px var(--disp)}.pf-st span{font-size:12px;color:#8d97b4}
.pf-bd{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.pf-b{padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);opacity:.45}.pf-b.on{opacity:1;border-color:rgba(255,178,62,.55);background:rgba(255,178,62,.08)}
.pf-b b{display:block;font:600 14px var(--disp)}.pf-b span{font-size:12px;color:#9aa3bd}
.pf h4{font:600 16px var(--disp);margin:0 0 12px}.pf h4:not(:first-child){margin-top:20px}
.pf-t{width:100%;border-collapse:collapse;font-size:13px}.pf-t td,.pf-t th{padding:6px 4px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left}.pf-t th{color:#8d97b4;font-weight:500}
.pf-rs{background:none;border:0;color:#8d97b4;font-size:12px;text-decoration:underline;cursor:pointer;margin-top:14px}
@media(max-width:820px){.pf{grid-template-columns:1fr}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const page=document.createElement('div');page.id='profPage';page.hidden=true;
page.innerHTML='<div class="pp-top"><button id="ppBack" type="button">‹ Back to menu</button><span>Pilot profile</span></div><div class="pp-in"><section id="prof"></section></div>';
document.body.appendChild(page);const sec=page.querySelector('#prof');
const nl=document.querySelector('.slinks');let pl=null;if(nl){pl=Object.assign(document.createElement('a'),{href:'#profile',textContent:'Profile'});nl.insertBefore(pl,nl.children[0])}
function openP(){render();page.hidden=false;document.documentElement.style.overflow='hidden';page.scrollTop=0;if(location.hash!=='#profile')history.pushState(null,'','#profile')}
function closeP(){page.hidden=true;document.documentElement.style.overflow='';if(location.hash==='#profile')history.replaceState(null,'',location.pathname+location.search)}
const hb=document.querySelector('.hbtns');if(hb){const b=document.createElement('a');b.href='#profile';b.className='ghost';b.textContent='My profile';b.addEventListener('click',e=>{e.preventDefault();openP()});hb.appendChild(b)}
if(pl)pl.addEventListener('click',e=>{e.preventDefault();openP()});
page.querySelector('#ppBack').onclick=closeP;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!page.hidden)closeP()});
window.addEventListener('popstate',()=>{if(location.hash==='#profile')openP();else if(!page.hidden){page.hidden=true;document.documentElement.style.overflow=''}});
window.openProfile=openP;
const MN={G:'Ground',T:'Tower',C:'Center',X:'Tower+Ground'},AN={MUC:'Munich',FRA:'Frankfurt',LHR:'Heathrow'};
function render(){const p=ld();let nm='';try{nm=localStorage.getItem('atc_name')||''}catch(e){}
 const ri=rankOf(p.tot.xp),nx=RANKS[ri+1],cur=RANKS[ri][0],pc=nx?Math.round((p.tot.xp-cur)/(nx[0]-cur)*100):100;
 const rows=Object.entries(p.per).sort((a,b)=>b[1].best-a[1].best).slice(0,8).map(([k,v])=>`<tr><td>${AN[k.slice(0,3)]||k.slice(0,3)}</td><td>${MN[k.slice(3)]||k.slice(3)}</td><td>${v.best}</td><td>${v.g}</td><td>${v.sh}</td></tr>`).join('');
 const hs=p.hist.map(h=>`<tr><td>${h.d}</td><td>${AN[h.ap]||h.ap}</td><td>${MN[h.md]||h.md}</td><td>${h.score}</td><td>${h.g}</td></tr>`).join('');
 sec.innerHTML=`<h2>Your profile</h2><div class="pf"><div><div class="pf-id"><div class="pf-av" id="pfAv">${(nm||'P').slice(0,2).toUpperCase()}</div><div style="flex:1;min-width:0"><input id="pfNm" maxlength="14" placeholder="Your callsign" value="${nm.replace(/"/g,'')}" aria-label="Callsign"><div class="pf-rank">${RANKS[ri][1]}</div></div></div>
 <div class="pf-bar"><i style="width:${pc}%"></i></div><div class="pf-sm">${p.tot.xp} XP${nx?' · next rank '+nx[1]+' at '+nx[0]:' · top rank reached'}</div>
 <div class="pf-st"><div><b>${p.tot.sh}</b><span>Shifts</span></div><div><b>${p.tot.land+p.tot.dpt}</b><span>Movements</span></div><div><b>${p.tot.hrs.toFixed(1)}</b><span>Hours on frequency</span></div><div><b>${p.tot.viol}</b><span>Violations</span></div></div>
 <div class="pf-io"><button id="pfEx">Export profile</button><button id="pfIm">Import profile</button><button id="pfCp" hidden>Copy</button></div><textarea id="pfTx" hidden spellcheck="false"></textarea><button class="pf-rs" id="pfRs">Reset profile</button><div class="pf-sm" style="margin-top:8px">Saved on this device only. Press End on a shift to record it.</div></div>
 <div><h4>Badges (${Object.keys(p.badges).length}/${BG.length})</h4><div class="pf-bd">${BG.map(b=>`<div class="pf-b${p.badges[b[0]]?' on':''}"><b>${b[1]}</b><span>${b[2]}</span></div>`).join('')}</div>
 <h4>Best scores</h4>${rows?`<table class="pf-t"><tr><th>Airport</th><th>Position</th><th>Score</th><th>Grade</th><th>Shifts</th></tr>${rows}</table>`:'<div class="pf-sm">No shifts recorded yet.</div>'}
 ${hs?`<h4>Recent shifts</h4><table class="pf-t"><tr><th>Date</th><th>Airport</th><th>Position</th><th>Score</th><th>Grade</th></tr>${hs}</table>`:''}</div></div>`;
 const n=document.getElementById('pfNm');n.onchange=()=>{const v=(n.value||'').trim().slice(0,14);try{if(v)localStorage.setItem('atc_name',v);else localStorage.removeItem('atc_name')}catch(e){}if(typeof NET!=='undefined'&&v)NET.name=v;document.getElementById('pfAv').textContent=(v||'P').slice(0,2).toUpperCase()};
 const tx=document.getElementById('pfTx'),cp=document.getElementById('pfCp');let imp=false;
 document.getElementById('pfEx').onclick=()=>{imp=false;tx.hidden=false;cp.hidden=false;cp.textContent='Copy';tx.value=btoa(unescape(encodeURIComponent(JSON.stringify(ld()))));tx.select()};
 cp.onclick=()=>{if(imp){try{const o=JSON.parse(decodeURIComponent(escape(atob(tx.value.trim()))));if(!o.tot)throw 0;sv(o);render()}catch(e){alert('This code is not a valid profile.')}}else{tx.select();try{navigator.clipboard.writeText(tx.value);cp.textContent='Copied'}catch(e){document.execCommand('copy')}}};
 document.getElementById('pfIm').onclick=()=>{imp=true;tx.hidden=false;cp.hidden=false;cp.textContent='Load this profile';tx.value='';tx.placeholder='Paste your profile code here';tx.focus()};
 document.getElementById('pfRs').onclick=()=>{if(confirm('Delete all profile statistics on this device?')){try{localStorage.removeItem(KEY)}catch(e){}render()}}}
render();if(location.hash==='#profile')openP();
})();
