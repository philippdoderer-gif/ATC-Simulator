// ===================== v12: live weather, runway choice by wind, crosswind / tailwind limits =====================
const LIVE={},ICAO3={EDDM:'MUC',EDDF:'FRA',EGLL:'LHR'};
function parseMetar(o){try{const wd=typeof o.wdir==='number'?o.wdir:null,ws=+o.wspd||0;let vis=o.visib;vis=vis==null?10:(typeof vis==='string'?parseFloat(vis):vis);vis=Math.min(10,vis*1.609);
 let cld='CAVOK';const cl=(o.clouds||[]).filter(c=>c.base!=null&&/BKN|OVC|SCT|FEW/.test(c.cover)),pri=cl.find(c=>/BKN|OVC/.test(c.cover))||cl[0];if(pri)cld=pri.cover+' '+Math.round(pri.base/100)*100+'FT';
 return{wd:wd==null?null:wd,ws,vis:Math.max(.2,vis),cld,t:o.temp,q:o.altim?Math.round(o.altim):null,raw:o.rawOb||''}}catch(e){return null}}
async function prefetchWx(){try{const c=new AbortController(),t=setTimeout(()=>c.abort(),6000);const r=await fetch('https://aviationweather.gov/api/data/metar?ids=EDDM,EDDF,EGLL&format=json',{signal:c.signal});clearTimeout(t);if(!r.ok)return;const L=await r.json();for(const o of L){const k=ICAO3[o.icaoId];if(k){const p=parseMetar(o);if(p&&p.wd!=null)LIVE[k]=p}}}catch(e){}}
prefetchWx();setInterval(prefetchWx,600000);
let LIVEWX=true;try{LIVEWX=localStorage.getItem('atc_live')!=='0'}catch(e){}
(()=>{const st=$('start');if(!st)return;const l=document.createElement('label');l.className='lvx';l.innerHTML='<input type="checkbox" id="liveWx"> Use live weather (real METAR) <small id="liveSt"></small>';st.before(l);const c=$('liveWx');c.checked=LIVEWX;c.onchange=()=>{LIVEWX=c.checked;try{localStorage.setItem('atc_live',c.checked?'1':'0')}catch(e){}};
 setInterval(()=>{const e=$('liveSt');if(e)e.textContent=Object.keys(LIVE).length?'· available':'· not reachable, simulated'},2000);
 const s=document.createElement('style');s.textContent='.lvx{display:flex;gap:8px;align-items:center;margin:10px 0;font-size:14px;color:var(--fg)}.lvx small{color:var(--dim)}';document.head.appendChild(s)})();
// pick the runway direction that fits the wind
{const _init=init;init=function(){const live=LIVEWX&&!NET.client&&LIVE[selAp];let ff=null;
  if(live&&!FORCEFLOW){let best=null,bd=999;for(const k of Object.keys(AP[ap||selAp].F)){const d=Math.abs(dif(live.wd,parseInt(AP[ap||selAp].F[k][1][0])*10));if(d<bd){bd=d;best=k}}FORCEFLOW=best;ff=best}
  _init();if(ff)FORCEFLOW=null;
  if(live&&WX){WX.wd=live.wd;WX.ws=Math.max(1,live.ws);WX.vis=live.vis;WX.cld=live.cld;if(live.t!=null)WX.t=live.t;if(live.q)WX.q=live.q;ATIS.s={wd:WX.wd,ws:WX.ws,q:WX.q,vis:WX.vis,cld:WX.cld,t:WX.t};WX.live=1;try{newTarget()}catch(e){}
   setTimeout(()=>say('Live weather loaded: '+(live.raw||'METAR')+' – runway direction chosen by the wind.','sys'),800)}}}
// crosswind / tailwind on final: gusts can force go-arounds; periodic advisory
{const _step=step;step=function(dt){_step(dt);if(NET.client)return;
  for(const a of ac){if(a.ph==='air'&&!a.dep&&a.ils&&!a.xwChk&&a.rw&&RW[a.rw]){const R=RW[a.rw],d=Math.hypot(a.x-R.T0.x,a.y-R.T0.y);if(d<1.3){a.xwChk=1;const xw=Math.abs(WX.ws*SIN(WX.wd-R.h)),tw=-WX.ws*COS(WX.wd-R.h),p=Math.max((xw-26)/18,(tw-8)/9,0);if(Math.random()<p){goAround(a);say(rc(a)+': going around, '+(tw>8?'tailwind '+Math.round(tw)+' kt':'crosswind '+Math.round(xw)+' kt')+' above limits','plt')}}}}
  if(!WXA.t||T-WXA.t>900){WXA.t=T;const R=RW[FLW[1][0]];if(R){const xw=Math.abs(WX.ws*SIN(WX.wd-R.h)),tw=-WX.ws*COS(WX.wd-R.h);if(xw>24||tw>6){say('⚠ Wind check for runway '+FLW[1][0]+': '+(tw>6?'tailwind '+Math.round(tw)+' kt – ':'')+(xw>24?'crosswind '+Math.round(xw)+' kt – ':'')+'expect go-arounds'+(tw>6?'; a runway change is advisable':''),'sys')}}}}}
const WXA={t:0};
