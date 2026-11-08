/* v26: start flow as a wizard – one page per step */
(function(){
if(/nowz/.test(location.search))return;
const S=document.getElementById('setup'),hero=document.querySelector('.shero');if(!S||!hero)return;
const $=id=>document.getElementById(id),ch=[...S.children];
const el=i=>ch[i];
// children indices from the known layout (see tsetup): 0 mpbox,1 h3,2 apc,3 h3,4 mdc,5 h3,6 tsel,7 hint,8 xtra,9 liveWx label,10 start,11 bests,12 hint
const STEPS=[[],[0,1,2],[3,4],[5,6,7],[8,9,10,11,12]];
const T=['Welcome','Airport','Position','Start time','Challenge & start'];
const css=`.wz-p{display:flex;gap:6px;align-items:center;margin:8px 0 6px;flex-wrap:wrap}
.wz-p i{flex:1;min-width:34px;height:5px;border-radius:5px;background:rgba(255,255,255,.1)}.wz-p i.on{background:linear-gradient(90deg,#ffb23e,#ff8a3d)}
.wz-p span{font:600 14px var(--disp);color:#9aa3bd;margin-right:10px;white-space:nowrap}
.wz-n{display:flex;justify-content:space-between;gap:12px;margin:26px 0 0}
.wz-n button{border-radius:99px;padding:13px 24px;font:700 16px var(--disp);cursor:pointer;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:#f3efe7}
.wz-n button.nx{background:linear-gradient(135deg,#ffb23e,#ff8a3d)!important;color:#1b1203!important;border:0;box-shadow:0 12px 30px -12px rgba(255,150,50,.8)}
.st-off{display:none!important}
#apc.cards{grid-template-columns:1fr!important}
@media(max-width:560px){#apc .mr{gap:6px}#apc .mr .fl{font-size:9.5px;gap:1px}#apc .mh b{font-size:21px}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const prog=document.createElement('div');prog.className='wz-p';S.insertBefore(prog,S.firstChild);
const nav=document.createElement('div');nav.className='wz-n';S.appendChild(nav);
let step=0;
function set(n,noScroll){step=Math.max(0,Math.min(4,n));
 hero.classList.toggle('st-off',step>0);
 ch.forEach((e,i)=>{const ins=STEPS[step].includes(i);e.classList.toggle('st-off',step===0||!ins)});
 prog.classList.toggle('st-off',step===0);{const bs=$('bests');if(bs)bs.classList.toggle('st-off',step!==4)}
 prog.innerHTML=`<span>Step ${step} of 4 · ${T[step]}</span>`+[1,2,3,4].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('');
 nav.classList.toggle('st-off',step===0);
 nav.innerHTML=(step>1?'<button class="bk" type="button">‹ Back</button>':'<button class="bk" type="button">‹ Welcome</button>')+(step<4?'<button class="nx" type="button">Next ›</button>':'');
 nav.querySelector('.bk').onclick=()=>set(step-1);const nx=nav.querySelector('.nx');if(nx)nx.onclick=()=>set(step+1);
 if(!noScroll)window.scrollTo(0,0)}
window.wzStep=set;
document.getElementById('menu').addEventListener('click',e=>{const a=e.target.closest('a[href="#setup"],a[href="#start"],a[href="#top"]');if(!a)return;set(a.getAttribute('href')==='#top'?0:1)});
$('apc').addEventListener('click',e=>{if(e.target.closest('[data-a]')&&step===1)setTimeout(()=>set(2),220)});
$('mdc').addEventListener('click',e=>{if(e.target.closest('[data-m],.card')&&step===2)setTimeout(()=>set(3),220)});
set(0,true);
})();
