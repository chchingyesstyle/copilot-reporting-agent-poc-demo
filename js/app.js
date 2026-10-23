(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// Tabs
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',x===b)});
 $$('.panel').forEach(p=>p.classList.toggle('active',p.id===b.dataset.tab));});
// Architecture
const lab={rec:'Recommended POC path',later:'Later / optional',std:'Component'};
function show(id){const n=NODES[id];$$('.node').forEach(g=>g.classList.toggle('sel',g.dataset.id===id));
 $('#detail').innerHTML=`<span class="tag ${n.k}">${lab[n.k]}</span><h3>${n.t}</h3><p>${n.d}</p><p><b>Owner:</b> ${n.o}</p><h4>Caveats</h4><ul>${n.c.map(c=>`<li class="cav">${c}</li>`).join('')}</ul><p class="watermark">SAMPLE / MOCK DESCRIPTION</p>`;}
$$('.node').forEach(g=>{g.onclick=()=>show(g.dataset.id);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(g.dataset.id)}}});
// Ask
let cur=null,running=false,last=null;
const pr=$('#presets');
PRESETS.forEach(p=>{const b=document.createElement('button');b.className='preset';b.textContent=p.title;b.onclick=()=>{if(running)return;cur=p;$$('.preset').forEach(x=>x.classList.toggle('sel',x===b));$('#promptbox').value=p.prompt;$('#runbtn').disabled=false;resetOut();};pr.appendChild(b);});
function resetOut(){$('#steps').innerHTML='';$('#report').className='empty';$('#report').textContent='Run the simulation to see a mock report.';$('#dl').hidden=true;last=null;}
$('#resetbtn').onclick=()=>{if(running)return;resetOut();};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function chart(p){const W=520,H=240,m=34,rows=p.rows,n=p.cols.length-1;
 const series=p.id==='it'?[3]:(p.id==='lic'?[3]:[1,2,3]);
 const colors=['#0078d4','#ff9900','#1e8e3e'];let max=0;
 if(p.series){max=Math.max(...rows.map(r=>Math.max(...p.series.map(i=>r[i]))));}else if(p.id==='it'){max=Math.max(...rows.map(r=>Math.max(r[1],r[2])));}else{max=Math.max(...rows.map(r=>Math.max(...series.map(i=>r[i]))));}
 max=Math.ceil(max*1.1);const sers=p.series||(p.id==='it'?[1,2]:series);const gw=(W-m-10)/rows.length,bw=gw*0.8/sers.length;
 let s=`<svg viewBox="0 0 ${W} ${H+40}" role="img" aria-label="Sample chart"><rect width="${W}" height="${H+40}" fill="#fff"/>`;
 for(let t=0;t<=4;t++){const y=H-(H-20)*t/4;s+=`<line x1="${m}" x2="${W-6}" y1="${y}" y2="${y}" stroke="#e5e8ec"/><text x="${m-4}" y="${y+4}" text-anchor="end" font-size="10" fill="#667">${Math.round(max*t/4)}</text>`;}
 rows.forEach((r,i)=>{sers.forEach((c,j)=>{const h=(H-20)*r[c]/max,x=m+i*gw+gw*0.1+j*bw,y=H-h;s+=`<rect x="${x}" y="${y}" width="${bw-2}" height="${h}" fill="${colors[j]}"><title>${esc(r[0])} ${esc(p.cols[c])}: ${r[c]}</title></rect>`;});
  s+=`<text x="${m+i*gw+gw/2}" y="${H+14}" text-anchor="middle" font-size="10" fill="#334">${esc(r[0])}</text>`;});
 sers.forEach((c,j)=>{s+=`<rect x="${m+j*110}" y="${H+24}" width="10" height="10" fill="${colors[j]}"/><text x="${m+j*110+14}" y="${H+33}" font-size="10" fill="#334">${esc(p.cols[c])}</text>`});
 return s+`<text x="${W-6}" y="12" text-anchor="end" font-size="10" fill="#c0392b" font-weight="700">SAMPLE DATA</text></svg>`;}
function table(p){return `<table class="t"><tr>${p.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${p.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table>`;}
function reportInner(p){return `<p class="watermark">SIMULATED OUTPUT – SAMPLE DATA – NOT A LIVE COPILOT CONNECTION</p><h2>${esc(p.title)}</h2><p><i>Prompt:</i> ${esc(p.prompt)}</p><h3>Data table</h3>${table(p)}<h3>Chart</h3>${chart(p)}<h3>Narrative (written by LLM – simulated)</h3><blockquote>${esc(p.narr)}</blockquote><h3>Sources</h3><ul><li>Aggregated table: ${esc(p.table)}</li>${p.docs.map(d=>`<li>${esc(d[0])}</li>`).join('')}</ul>`;}
$('#runbtn').onclick=async()=>{if(!cur||running)return;running=true;$('#runbtn').disabled=true;resetOut();const p=cur;
 const steps=[["sys","Agent receives prompt; checks user permissions (simulated)",`Prompt accepted: “${p.title}”`],
 ["dw","Read aggregated sample table (from SharePoint library file)",`${p.table}: ${p.rows.length} rows, ${p.cols.length} columns`],
 ["m365","Pull M365 sample document snippets (permission-trimmed)",p.docs.map(d=>d[0]+' → '+d[1]).join(' | ')],
 ["dw","Calculations done by the DW (SQL), not by the LLM",p.dw],
 ["ci","Verification by code interpreter (preview, simulated)",p.ci],
 ["llm","Copilot LLM writes narrative (integration of text only)","Draft narrative generated (simulated)"],
 ["sys","Agent flow assembles report and offers download","Mock report ready – SAMPLE"]];
 const tag={sys:'AGENT',dw:'DW (SQL)',m365:'M365',ci:'CODE INTERPRETER',llm:'COPILOT LLM'};
 const ol=$('#steps');const lis=steps.map(s=>{const li=document.createElement('li');li.innerHTML=`<span class="who ${s[0]}">${tag[s[0]]}</span>${esc(s[1])}<small>${esc(s[2])}</small>`;ol.appendChild(li);return li;});
 for(const li of lis){li.classList.add('run');await sleep(window.FAST?10:800);li.classList.replace('run','done');}
 $('#report').className='rep';$('#report').innerHTML=reportInner(p);$('#dl').hidden=false;last=p;running=false;$('#runbtn').disabled=false;};
function dl(name,type,txt){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
$('#dlhtml').onclick=()=>{if(!last)return;const css='body{font-family:Segoe UI,Arial;max-width:800px;margin:20px auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:5px;text-align:right}td:first-child,th:first-child{text-align:left}.watermark{color:#c0392b;font-weight:700}blockquote{border-left:4px solid #0078d4;padding-left:10px;background:#f2f8fe}';
 dl(`SAMPLE_${last.id}_report.html`,'text/html',`<!DOCTYPE html><html><head><meta charset="utf-8"><title>SAMPLE report</title><style>${css}</style></head><body>${reportInner(last)}</body></html>`);};
$('#dlcsv').onclick=()=>{if(!last)return;const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
 dl(`SAMPLE_${last.id}_data.csv`,'text/csv',[last.cols,...last.rows].map(r=>r.map(q).join(',')).join('\r\n')+'\r\n# SAMPLE DATA - fictional\r\n');};
// Questions
const KEY='copilotPocDemoChecks';let st={};try{st=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function prog(){const all=$$('#qlists input');$('#prog').textContent=`${all.filter(x=>x.checked).length} / ${all.length} done`;}
QS.forEach((g,gi)=>{const d=document.createElement('div');d.className='qgroup';d.innerHTML=`<h3>${esc(g.g)}</h3>`;
 g.i.forEach((q,qi)=>{const id=gi+'-'+qi;const l=document.createElement('label');l.className='q'+(st[id]?' ck':'');
  l.innerHTML=`<input type="checkbox" ${st[id]?'checked':''}><span class="t1">${esc(q[0])}</span>${q[1]?'<span class="unv">UNVERIFIED</span>':''}`;
  l.querySelector('input').onchange=e=>{st[id]=e.target.checked;l.classList.toggle('ck',e.target.checked);save();prog();};d.appendChild(l);});
 $('#qlists').appendChild(d);});
$('#clearq').onclick=()=>{st={};save();$$('#qlists input').forEach(i=>i.checked=false);$$('.q').forEach(q=>q.classList.remove('ck'));prog();};
prog();show('agent');
})();
