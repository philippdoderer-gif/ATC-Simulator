/* v21: premium main-menu look (scoped to #menu; game UI untouched) */
(function(){
const css=`
#menu{--m-bg:#070a15;--m-ink:#f3efe7;--m-dim:#9aa3bd;--m-amber:#ffb23e;--m-amber2:#ff8a3d;--m-blue:#6aa8ff;--m-teal:#4fe0b6;--m-line:rgba(170,185,230,.14);--m-glass:linear-gradient(160deg,rgba(28,34,62,.82),rgba(14,18,38,.78));
 --acc:var(--m-amber);--ok:var(--m-teal);--line:var(--m-line);--fg:var(--m-ink);--dim:var(--m-dim);--sel:var(--m-amber);--glass:var(--m-glass);
 --stripInk:#14182b;--strip:#f1ead6}
body:has(#menu:not([hidden])){background:
 radial-gradient(900px 420px at 12% 108%,rgba(255,150,50,.20),transparent 62%),
 radial-gradient(1100px 600px at 85% -12%,rgba(88,110,230,.30),transparent 60%),
 linear-gradient(180deg,#0a0e20,#070a15 55%,#0b0a14)}
#menu{position:relative}
#menu .snav{background:linear-gradient(rgba(7,10,21,.92) 65%,transparent);backdrop-filter:blur(6px)}
#menu .brand{letter-spacing:.2em}
#menu .bmark{border-color:var(--m-amber);box-shadow:0 0 14px rgba(255,178,62,.45)}#menu .bmark::after{background:var(--m-amber)}
#menu .slinks a{border-radius:99px;padding:7px 14px}
#menu .slinks .scta{background:linear-gradient(135deg,var(--m-amber),var(--m-amber2));color:#1b1203;box-shadow:0 8px 24px -8px rgba(255,150,50,.7)}
#menu .slinks .scta:hover{background:linear-gradient(135deg,#ffc668,#ff9a52);color:#1b1203}
#menu .shero{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:40px;padding-block:34px 48px}
#menu .shero h1{font-weight:700;font-size:clamp(38px,5.6vw,72px);line-height:.98;letter-spacing:-.02em;max-width:13ch;
 background:linear-gradient(180deg,#fff 20%,#c9d3f5);-webkit-background-clip:text;background-clip:text;color:transparent}
#menu .eyebrow{color:var(--m-amber);font:600 13px var(--mono);letter-spacing:.04em;display:inline-flex;align-items:center;gap:10px}
#menu .eyebrow::before{content:"";width:28px;height:2px;background:linear-gradient(90deg,transparent,var(--m-amber))}
#menu .shero .sub{color:#aeb6cf;font-size:17px}
#menu .go2{background:linear-gradient(135deg,var(--m-amber),var(--m-amber2));color:#1b1203;border-radius:99px;padding:14px 26px;box-shadow:0 14px 34px -12px rgba(255,150,50,.75);transition:transform .2s,box-shadow .2s}
#menu .go2:hover{background:linear-gradient(135deg,#ffc668,#ff9a52);transform:translateY(-2px)}
#menu .ghost{border-radius:99px;padding:14px 24px;background:rgba(255,255,255,.04)}
/* scope */
.scope{position:relative;justify-self:end;width:100%;max-width:520px;aspect-ratio:1}
.scope svg.sc{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.scope .glass{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(40,70,120,.28),rgba(8,14,30,.92) 72%);border:1px solid rgba(120,160,255,.28);box-shadow:0 0 0 10px rgba(255,255,255,.025),0 0 0 11px rgba(120,160,255,.12),0 40px 80px -30px rgba(0,0,0,.9),inset 0 0 60px rgba(80,140,255,.15)}
.scope .sweep{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(79,224,182,0) 0deg,rgba(79,224,182,0) 270deg,rgba(79,224,182,.34) 358deg,rgba(79,224,182,.0) 360deg);animation:mspin 7s linear infinite}
@keyframes mspin{to{transform:rotate(360deg)}}
.scope .bl{position:absolute;display:grid;gap:1px;font:600 11px/1.2 var(--mono);color:var(--m-teal);white-space:nowrap;transform:translate(8px,-4px)}
.scope .bl::before{content:"";position:absolute;left:-14px;top:3px;width:7px;height:7px;border-radius:50%;background:var(--m-teal);box-shadow:0 0 10px var(--m-teal);animation:mpulse 3.5s ease-in-out infinite}
.scope .bl.a{color:var(--m-amber)}.scope .bl.a::before{background:var(--m-amber);box-shadow:0 0 10px var(--m-amber)}
.scope .bl span{color:#9fb0d8;font-weight:500}
@keyframes mpulse{50%{opacity:.35;transform:scale(.7)}}
.scope .strip{position:absolute;right:-6px;bottom:-14px;width:min(300px,64%);transform:rotate(-2.5deg);border-left-color:var(--m-amber);z-index:2}
/* setup */
#menu .setup{border-top:0;padding-top:0}
#menu h3{font:600 20px var(--disp);letter-spacing:0;text-transform:none;color:var(--m-ink);margin:34px 2px 14px;display:flex;align-items:center;gap:12px}
#menu h3::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--m-line),transparent)}
#menu .card{border-radius:22px;background:var(--m-glass);border:1px solid var(--m-line);transition:transform .3s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .3s}
#menu .card:hover{transform:translateY(-5px);border-color:rgba(255,178,62,.45)}
#menu .card.on{border-color:var(--m-amber);box-shadow:0 0 0 1px var(--m-amber),0 24px 60px -20px rgba(255,150,50,.5)}
#menu .card .tag{background:rgba(7,10,21,.8);color:var(--m-amber);border-color:rgba(255,178,62,.35)}
#menu .card b{font:700 18px var(--disp);letter-spacing:.01em}
#menu .tsc button i{background:linear-gradient(180deg,rgba(106,168,255,.8),rgba(90,100,230,.35))}
#menu .tsc button.n i{background:linear-gradient(180deg,rgba(150,160,200,.4),rgba(90,100,150,.22))}
#menu .tsc button.on i{background:linear-gradient(180deg,#ffd27a,var(--m-amber2));box-shadow:0 0 0 2px rgba(255,178,62,.3),0 8px 22px -4px rgba(255,150,50,.7)}
#menu .tsq button.on{border-color:var(--m-amber);background:rgba(255,178,62,.14);color:#ffe9c4}
#menu .tsq button{border-radius:99px}
#menu .tsbig{font-size:34px}
#menu .go{background:linear-gradient(135deg,var(--m-amber),var(--m-amber2));color:#1b1203;border-radius:20px;padding:19px;font:700 20px var(--disp);letter-spacing:.03em;box-shadow:0 22px 50px -18px rgba(255,150,50,.8);transition:transform .2s,box-shadow .2s}
#menu .go:hover{transform:translateY(-2px);box-shadow:0 28px 60px -18px rgba(255,150,50,.95)}
#menu select,#menu #xtra button{border-radius:12px}
#menu #xtra{border-radius:22px;border:1px solid var(--m-line);background:rgba(255,255,255,.025)}
#menu button.on{background:rgba(255,178,62,.18)!important;border-color:var(--m-amber)!important;color:#ffe9c4!important}
/* info sections */
#menu .ss{border-top:0;margin-top:56px;padding-top:0}
#menu .ss h2{font-size:38px;letter-spacing:-.01em}
#menu .g4 article{padding:20px;border-radius:20px;border:1px solid var(--m-line);background:var(--m-glass);position:relative;overflow:hidden}
#menu .g4 article::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(var(--m-amber),transparent)}
#menu .g4 article:nth-child(2)::before{background:linear-gradient(var(--m-blue),transparent)}
#menu .g4 article:nth-child(3)::before{background:linear-gradient(var(--m-teal),transparent)}
#menu .g4 article:nth-child(4)::before{background:linear-gradient(#c9a0ff,transparent)}
#menu .g4 h4{font-size:20px}
#menu .tblw{border:1px solid var(--m-line);border-radius:20px;background:var(--m-glass);padding:6px 10px}
#menu .atb th{color:var(--m-amber)}
#menu .rl li{padding:14px 16px;border:1px solid var(--m-line);border-radius:16px;background:rgba(255,255,255,.025)}
#menu .rl b{color:var(--m-amber)}
#menu .steps b{color:var(--m-amber)}
#menu .sfoot{border-color:var(--m-line)}
@media(max-width:820px){#menu .shero{grid-template-columns:1fr}.scope{justify-self:center;max-width:380px;margin-top:6px}.scope .strip{right:0}}
@media(prefers-reduced-motion:reduce){.scope .sweep,.scope .bl::before{animation:none}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const hero=document.querySelector('.shero');if(!hero)return;
const strip=hero.querySelector('.strip');
const sc=document.createElement('div');sc.className='scope';sc.setAttribute('aria-hidden','true');
let rings='';[.2,.4,.6,.8,.98].forEach(r=>rings+=`<circle cx="50" cy="50" r="${r*50}" fill="none" stroke="rgba(130,170,255,${r>.9?.35:.16})" stroke-width=".25"/>`);
sc.innerHTML=`<div class="glass"></div><svg class="sc" viewBox="0 0 100 100">${rings}
<path d="M50 1V99M1 50H99" stroke="rgba(130,170,255,.14)" stroke-width=".2"/><path d="M15.4 15.4L84.6 84.6M84.6 15.4L15.4 84.6" stroke="rgba(130,170,255,.07)" stroke-width=".2"/>
<g stroke="rgba(255,178,62,.55)" stroke-width=".35" fill="none"><path d="M34 82L47 52L66 38L80 22"/><path d="M20 30L47 52"/></g>
<g fill="rgba(255,178,62,.9)"><path d="M47 49.4l2.4 4.2h-4.8z"/><path d="M66 35.6l2.4 4.2h-4.8z" opacity=".7"/></g>
<g font-family="JetBrains Mono,monospace" font-size="2.3" fill="rgba(170,190,240,.55)"><text x="49" y="5">N</text><text x="94.5" y="51.2">E</text><text x="49" y="98.6">S</text><text x="2" y="51.2">W</text></g>
<g stroke="rgba(79,224,182,.35)" stroke-width=".3" fill="none"><path d="M62 70l7-3M69 67l5-6"/></g></svg>
<div class="sweep"></div>
<div class="bl" style="left:62%;top:70%"><b>DLH4AB</b><span>FL240 ↑ 310</span></div>
<div class="bl a" style="left:60%;top:30%;animation-delay:1s"><b>BAW73C</b><span>FL090 ↓ 250</span></div>
<div class="bl" style="left:27%;top:36%"><b>EWG8M</b><span>FL180 → 280</span></div>
<div class="bl" style="left:40%;top:78%"><b>RYR5GH</b><span>FL060 ↓ 210</span></div>`;
if(strip)sc.appendChild(strip);hero.appendChild(sc);
const lang=[...document.querySelectorAll('.scope .bl')];lang.forEach((b,i)=>b.style.setProperty('--d',i));
})();
