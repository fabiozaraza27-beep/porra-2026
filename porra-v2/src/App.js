import { useState, useEffect, useCallback, useRef } from "react";
 
/* ═══════════════════════════════════════════
   GOOGLE SHEETS CONFIG
═══════════════════════════════════════════ */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbxa9fyRzj_ctpTU3E3EJcFlW0tb2UiIomX5fAUeGpLlPDP0P3VLqZMb-R5KeFRD_OIw/exec";
 
async function dbRead() {
  const r = await fetch(SHEET_URL, { method: "GET" });
  if (!r.ok) throw new Error("read error");
  return await r.json();
}
 
async function dbWrite(data) {
  await fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
 
const ADMIN_PIN = "2026";
 
/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const GROUPS = [
  { id:"A", flag:"🇲🇽", teams:["México","Sudáfrica","Corea del Sur","Rep. Checa"],
    matches:[
      {id:"A1",j:1,day:"11 jun",home:"México",away:"Sudáfrica",venue:"Cd. México"},
      {id:"A2",j:1,day:"11 jun",home:"Corea del Sur",away:"Rep. Checa",venue:"Guadalajara"},
      {id:"A3",j:2,day:"18 jun",home:"Rep. Checa",away:"Sudáfrica",venue:"Atlanta"},
      {id:"A4",j:2,day:"18 jun",home:"México",away:"Corea del Sur",venue:"Guadalajara"},
      {id:"A5",j:3,day:"24 jun",home:"Rep. Checa",away:"México",venue:"Cd. México"},
      {id:"A6",j:3,day:"24 jun",home:"Sudáfrica",away:"Corea del Sur",venue:"Monterrey"},
    ]},
  { id:"B", flag:"🇨🇦", teams:["Canadá","Bosnia y Herz.","Qatar","Suiza"],
    matches:[
      {id:"B1",j:1,day:"12 jun",home:"Canadá",away:"Bosnia y Herz.",venue:"Toronto"},
      {id:"B2",j:1,day:"13 jun",home:"Qatar",away:"Suiza",venue:"San Francisco"},
      {id:"B3",j:2,day:"18 jun",home:"Suiza",away:"Bosnia y Herz.",venue:"Los Ángeles"},
      {id:"B4",j:2,day:"18 jun",home:"Canadá",away:"Qatar",venue:"Vancouver"},
      {id:"B5",j:3,day:"24 jun",home:"Suiza",away:"Canadá",venue:"Vancouver"},
      {id:"B6",j:3,day:"24 jun",home:"Bosnia y Herz.",away:"Qatar",venue:"Seattle"},
    ]},
  { id:"C", flag:"🇧🇷", teams:["Brasil","Marruecos","Haití","Escocia"],
    matches:[
      {id:"C1",j:1,day:"13 jun",home:"Brasil",away:"Marruecos",venue:"Nueva York"},
      {id:"C2",j:1,day:"13 jun",home:"Haití",away:"Escocia",venue:"Boston"},
      {id:"C3",j:2,day:"19 jun",home:"Escocia",away:"Marruecos",venue:"Boston"},
      {id:"C4",j:2,day:"19 jun",home:"Brasil",away:"Haití",venue:"Filadelfia"},
      {id:"C5",j:3,day:"24 jun",home:"Escocia",away:"Brasil",venue:"Miami"},
      {id:"C6",j:3,day:"24 jun",home:"Marruecos",away:"Haití",venue:"Atlanta"},
    ]},
  { id:"D", flag:"🇺🇸", teams:["EE.UU.","Paraguay","Australia","Turquía"],
    matches:[
      {id:"D1",j:1,day:"12 jun",home:"EE.UU.",away:"Paraguay",venue:"Los Ángeles"},
      {id:"D2",j:1,day:"13 jun",home:"Australia",away:"Turquía",venue:"Vancouver"},
      {id:"D3",j:2,day:"19 jun",home:"Turquía",away:"Paraguay",venue:"San Francisco"},
      {id:"D4",j:2,day:"19 jun",home:"EE.UU.",away:"Australia",venue:"Seattle"},
      {id:"D5",j:3,day:"25 jun",home:"Turquía",away:"EE.UU.",venue:"Los Ángeles"},
      {id:"D6",j:3,day:"25 jun",home:"Paraguay",away:"Australia",venue:"San Francisco"},
    ]},
  { id:"E", flag:"🇩🇪", teams:["Alemania","Curazao","C. de Marfil","Ecuador"],
    matches:[
      {id:"E1",j:1,day:"14 jun",home:"Alemania",away:"Curazao",venue:"Houston"},
      {id:"E2",j:1,day:"14 jun",home:"C. de Marfil",away:"Ecuador",venue:"Filadelfia"},
      {id:"E3",j:2,day:"20 jun",home:"Alemania",away:"C. de Marfil",venue:"Toronto"},
      {id:"E4",j:2,day:"20 jun",home:"Ecuador",away:"Curazao",venue:"Kansas City"},
      {id:"E5",j:3,day:"25 jun",home:"Ecuador",away:"Alemania",venue:"Nueva York"},
      {id:"E6",j:3,day:"25 jun",home:"Curazao",away:"C. de Marfil",venue:"Filadelfia"},
    ]},
  { id:"F", flag:"🇳🇱", teams:["P. Bajos","Japón","Suecia","Túnez"],
    matches:[
      {id:"F1",j:1,day:"14 jun",home:"P. Bajos",away:"Japón",venue:"Dallas"},
      {id:"F2",j:1,day:"14 jun",home:"Suecia",away:"Túnez",venue:"Monterrey"},
      {id:"F3",j:2,day:"20 jun",home:"P. Bajos",away:"Suecia",venue:"Houston"},
      {id:"F4",j:2,day:"20 jun",home:"Túnez",away:"Japón",venue:"Guadalajara"},
      {id:"F5",j:3,day:"25 jun",home:"Japón",away:"Suecia",venue:"Dallas"},
      {id:"F6",j:3,day:"25 jun",home:"Túnez",away:"P. Bajos",venue:"Kansas City"},
    ]},
  { id:"G", flag:"🇧🇪", teams:["Bélgica","Egipto","Irán","Nueva Zelanda"],
    matches:[
      {id:"G1",j:1,day:"15 jun",home:"Bélgica",away:"Egipto",venue:"Seattle"},
      {id:"G2",j:1,day:"15 jun",home:"Irán",away:"Nueva Zelanda",venue:"Los Ángeles"},
      {id:"G3",j:2,day:"21 jun",home:"Bélgica",away:"Irán",venue:"Los Ángeles"},
      {id:"G4",j:2,day:"21 jun",home:"Nueva Zelanda",away:"Egipto",venue:"Vancouver"},
      {id:"G5",j:3,day:"26 jun",home:"Egipto",away:"Irán",venue:"Seattle"},
      {id:"G6",j:3,day:"26 jun",home:"Nueva Zelanda",away:"Bélgica",venue:"Vancouver"},
    ]},
  { id:"H", flag:"🇪🇸", teams:["España","Cabo Verde","Arabia Saudita","Uruguay"],
    matches:[
      {id:"H1",j:1,day:"15 jun",home:"España",away:"Cabo Verde",venue:"Atlanta"},
      {id:"H2",j:1,day:"15 jun",home:"Arabia Saudita",away:"Uruguay",venue:"Miami"},
      {id:"H3",j:2,day:"21 jun",home:"España",away:"Arabia Saudita",venue:"Atlanta"},
      {id:"H4",j:2,day:"21 jun",home:"Uruguay",away:"Cabo Verde",venue:"Miami"},
      {id:"H5",j:3,day:"26 jun",home:"Cabo Verde",away:"Arabia Saudita",venue:"Houston"},
      {id:"H6",j:3,day:"26 jun",home:"Uruguay",away:"España",venue:"Guadalajara"},
    ]},
  { id:"I", flag:"🇫🇷", teams:["Francia","Senegal","Iraq","Noruega"],
    matches:[
      {id:"I1",j:1,day:"16 jun",home:"Francia",away:"Senegal",venue:"Nueva York"},
      {id:"I2",j:1,day:"16 jun",home:"Iraq",away:"Noruega",venue:"Boston"},
      {id:"I3",j:2,day:"22 jun",home:"Francia",away:"Iraq",venue:"Filadelfia"},
      {id:"I4",j:2,day:"22 jun",home:"Noruega",away:"Senegal",venue:"Nueva York"},
      {id:"I5",j:3,day:"26 jun",home:"Noruega",away:"Francia",venue:"Boston"},
      {id:"I6",j:3,day:"26 jun",home:"Senegal",away:"Iraq",venue:"Toronto"},
    ]},
  { id:"J", flag:"🇦🇷", teams:["Argentina","Argelia","Austria","Jordania"],
    matches:[
      {id:"J1",j:1,day:"16 jun",home:"Argentina",away:"Argelia",venue:"Kansas City"},
      {id:"J2",j:1,day:"16 jun",home:"Austria",away:"Jordania",venue:"San Francisco"},
      {id:"J3",j:2,day:"22 jun",home:"Argentina",away:"Austria",venue:"Dallas"},
      {id:"J4",j:2,day:"22 jun",home:"Jordania",away:"Argelia",venue:"San Francisco"},
      {id:"J5",j:3,day:"27 jun",home:"Argelia",away:"Austria",venue:"Kansas City"},
      {id:"J6",j:3,day:"27 jun",home:"Jordania",away:"Argentina",venue:"Dallas"},
    ]},
  { id:"K", flag:"🇵🇹", teams:["Portugal","Congo DR","Uzbekistán","Colombia"],
    matches:[
      {id:"K1",j:1,day:"17 jun",home:"Portugal",away:"Congo DR",venue:"Houston"},
      {id:"K2",j:1,day:"17 jun",home:"Uzbekistán",away:"Colombia",venue:"Cd. México"},
      {id:"K3",j:2,day:"23 jun",home:"Portugal",away:"Uzbekistán",venue:"Houston"},
      {id:"K4",j:2,day:"23 jun",home:"Congo DR",away:"Colombia",venue:"Guadalajara"},
      {id:"K5",j:3,day:"27 jun",home:"Colombia",away:"Portugal",venue:"Miami"},
      {id:"K6",j:3,day:"27 jun",home:"Congo DR",away:"Uzbekistán",venue:"Atlanta"},
    ]},
  { id:"L", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", teams:["Inglaterra","Croacia","Ghana","Panamá"],
    matches:[
      {id:"L1",j:1,day:"17 jun",home:"Inglaterra",away:"Croacia",venue:"Dallas"},
      {id:"L2",j:1,day:"17 jun",home:"Ghana",away:"Panamá",venue:"Toronto"},
      {id:"L3",j:2,day:"23 jun",home:"Inglaterra",away:"Ghana",venue:"Boston"},
      {id:"L4",j:2,day:"23 jun",home:"Panamá",away:"Croacia",venue:"Toronto"},
      {id:"L5",j:3,day:"27 jun",home:"Panamá",away:"Inglaterra",venue:"Nueva York"},
      {id:"L6",j:3,day:"27 jun",home:"Croacia",away:"Ghana",venue:"Filadelfia"},
    ]},
];
 
const ALL_MATCHES = GROUPS.flatMap(g => g.matches);
 
/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const COLS = ["#e8634a","#f0b429","#43c78a","#5aaddc","#a78bfa","#f472b6","#34d399","#fb923c","#60a5fa","#4ade80"];
const acolor = n => { let h=0; for(let c of n) h=(h*31+c.charCodeAt(0))%COLS.length; return COLS[Math.abs(h)]; };
const ini = n => n.trim().charAt(0).toUpperCase();
 
function calcPts(pred, real) {
  if (!real||real.home==null||real.away==null) return null;
  if (!pred||pred.home==null||pred.away==null) return 0;
  const ph=+pred.home,pa=+pred.away,rh=+real.home,ra=+real.away;
  if (ph===rh&&pa===ra) return 3;
  const s=x=>x>0?1:x<0?-1:0;
  if (s(ph-pa)===s(rh-ra)) return 1;
  return 0;
}
 
function totals(scores, off) {
  let p=0,ex=0,co=0;
  for (const m of ALL_MATCHES) {
    const r=off[m.id]; if(!r||r.home==null||r.away==null) continue;
    const v=calcPts(scores[m.id],r); p+=v; if(v===3)ex++; else if(v===1)co++;
  }
  return {p,ex,co};
}
 
function calcStandings(gid, scores) {
  const g=GROUPS.find(x=>x.id===gid), tbl={};
  g.teams.forEach(t=>{tbl[t]={pt:0,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0};});
  g.matches.forEach(m=>{
    const s=scores[m.id]; if(!s||s.home==null||s.away==null) return;
    const h=+s.home,a=+s.away; if(isNaN(h)||isNaN(a)) return;
    tbl[m.home].pj++;tbl[m.away].pj++;
    tbl[m.home].gf+=h;tbl[m.home].gc+=a;
    tbl[m.away].gf+=a;tbl[m.away].gc+=h;
    if(h>a){tbl[m.home].pt+=3;tbl[m.home].pg++;tbl[m.away].pp++;}
    else if(h<a){tbl[m.away].pt+=3;tbl[m.away].pg++;tbl[m.home].pp++;}
    else{tbl[m.home].pt++;tbl[m.home].pe++;tbl[m.away].pt++;tbl[m.away].pe++;}
  });
  return Object.entries(tbl).map(([n,s])=>({n,...s,gd:s.gf-s.gc}))
    .sort((a,b)=>b.pt-a.pt||b.gd-a.gd||b.gf-a.gf);
}
 
function calcBracket(scores) {
  const cl={};
  const thirds=[];
  GROUPS.forEach(g=>{
    const rows=calcStandings(g.id,scores);
    cl[g.id]={first:rows[0]?.n||`1° G.${g.id}`,second:rows[1]?.n||`2° G.${g.id}`};
    if(rows[2]) thirds.push({...rows[2],gid:g.id});
  });
  const b8=[...thirds].sort((a,b)=>b.pt-a.pt||b.gd-a.gd||b.gf-a.gf).slice(0,8).map(t=>t.n);
  const c=id=>cl[id], bt=i=>b8[i]||`3° #${i+1}`;
  const r32=[
    {id:"R01",day:"4 jul", home:c("A").second,away:c("B").second,venue:"Houston"},
    {id:"R02",day:"4 jul", home:c("E").first, away:bt(0),         venue:"Filadelfia"},
    {id:"R03",day:"5 jul", home:c("F").first, away:c("C").second, venue:"Nueva Jersey"},
    {id:"R04",day:"5 jul", home:c("C").first, away:c("F").second, venue:"Cd. México"},
    {id:"R05",day:"6 jul", home:c("D").first, away:bt(1),         venue:"Dallas"},
    {id:"R06",day:"6 jul", home:c("I").first, away:bt(2),         venue:"Seattle"},
    {id:"R07",day:"7 jul", home:c("A").first, away:bt(3),         venue:"Atlanta"},
    {id:"R08",day:"7 jul", home:c("L").first, away:bt(4),         venue:"Vancouver"},
    {id:"R09",day:"8 jul", home:c("G").first, away:bt(5),         venue:"Guadalajara"},
    {id:"R10",day:"8 jul", home:c("B").first, away:bt(6),         venue:"Vancouver"},
    {id:"R11",day:"8 jul", home:c("E").second,away:c("I").second, venue:"Filadelfia"},
    {id:"R12",day:"8 jul", home:c("K").second,away:c("L").second, venue:"Toronto"},
    {id:"R13",day:"9 jul", home:c("H").first, away:c("J").second, venue:"Miami"},
    {id:"R14",day:"9 jul", home:c("J").first, away:c("H").second, venue:"Los Ángeles"},
    {id:"R15",day:"9 jul", home:c("K").first, away:bt(7),         venue:"Kansas City"},
    {id:"R16",day:"9 jul", home:c("D").second,away:c("G").second, venue:"Dallas"},
  ];
  const w=(mid,arr,sc)=>{
    const m=arr.find(x=>x.id===mid); if(!m) return "?";
    const s=sc[mid]; if(!s||s.home==null||s.away==null) return `G.${mid}`;
    return +s.home>=+s.away?m.home:m.away;
  };
  const r16=[
    {id:"O1",day:"12 jul",home:w("R01",r32,scores),away:w("R02",r32,scores),venue:"Houston"},
    {id:"O2",day:"12 jul",home:w("R03",r32,scores),away:w("R04",r32,scores),venue:"Filadelfia"},
    {id:"O3",day:"13 jul",home:w("R05",r32,scores),away:w("R06",r32,scores),venue:"Dallas"},
    {id:"O4",day:"13 jul",home:w("R07",r32,scores),away:w("R08",r32,scores),venue:"Nueva Jersey"},
    {id:"O5",day:"14 jul",home:w("R09",r32,scores),away:w("R10",r32,scores),venue:"Boston"},
    {id:"O6",day:"14 jul",home:w("R11",r32,scores),away:w("R12",r32,scores),venue:"Seattle"},
    {id:"O7",day:"15 jul",home:w("R13",r32,scores),away:w("R14",r32,scores),venue:"Atlanta"},
    {id:"O8",day:"15 jul",home:w("R15",r32,scores),away:w("R16",r32,scores),venue:"Los Ángeles"},
  ];
  const qf=[
    {id:"Q1",day:"9 jul", home:w("O1",r16,scores),away:w("O2",r16,scores),venue:"Boston"},
    {id:"Q2",day:"10 jul",home:w("O3",r16,scores),away:w("O4",r16,scores),venue:"Los Ángeles"},
    {id:"Q3",day:"11 jul",home:w("O5",r16,scores),away:w("O6",r16,scores),venue:"Miami"},
    {id:"Q4",day:"11 jul",home:w("O7",r16,scores),away:w("O8",r16,scores),venue:"Kansas City"},
  ];
  const sf=[
    {id:"S1",day:"14 jul",home:w("Q1",qf,scores),away:w("Q2",qf,scores),venue:"Dallas"},
    {id:"S2",day:"15 jul",home:w("Q3",qf,scores),away:w("Q4",qf,scores),venue:"Atlanta"},
  ];
  const lo=(mid,arr,sc)=>{
    const m=arr.find(x=>x.id===mid); if(!m) return "?";
    const s=sc[mid]; if(!s||s.home==null||s.away==null) return `Per.${mid}`;
    return +s.home<+s.away?m.home:m.away;
  };
  return {
    r32,r16,qf,sf,
    third:[{id:"T1",day:"18 jul",home:lo("S1",sf,scores),away:lo("S2",sf,scores),venue:"Miami"}],
    fin:  [{id:"FIN",day:"19 jul",home:w("S1",sf,scores),away:w("S2",sf,scores),venue:"MetLife · N. Jersey"}],
  };
}
 
/* ═══════════════════════════════════════════
   CSS
═══════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body,#root{min-height:100vh;background:#0d1b2a;color:#eef2f8;font-family:'Nunito Sans',system-ui,sans-serif;}
input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
input[type=number]{-moz-appearance:textfield;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:#122035;}
::-webkit-scrollbar-thumb{background:#2e4068;border-radius:2px;}
.app{min-height:100vh;display:flex;flex-direction:column;}
 
/* HEADER */
.hdr{background:linear-gradient(160deg,#0a1628,#122035,#162a50);
  border-bottom:2px solid #2e4068;padding:14px 20px;
  display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;}
.hdr::after{content:'';position:absolute;left:-60px;top:-60px;width:280px;height:280px;
  background:radial-gradient(ellipse,rgba(240,180,41,.1) 0%,transparent 70%);pointer-events:none;}
.hdr-logo{flex-shrink:0;width:64px;height:64px;position:relative;z-index:1;
  display:flex;align-items:center;justify-content:center;}
.hdr-logo img{width:100%;height:100%;object-fit:contain;}
.hdr-text{flex:1;min-width:0;position:relative;z-index:1;}
.hdr-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;
  font-size:clamp(20px,4.5vw,36px);color:#fff;line-height:.95;}
.hdr-title span{color:#f0b429;}
.hdr-pills{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;}
.hdr-pill{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  border-radius:100px;padding:2px 10px;font-size:11px;font-weight:600;color:#7a91b0;}
.hdr-pill.gold{color:#f0b429;border-color:rgba(240,180,41,.3);background:rgba(240,180,41,.08);}
.hdr-pill.blue{color:#5aaddc;border-color:rgba(90,173,220,.3);background:rgba(90,173,220,.08);}
.hdr-right{position:relative;z-index:1;display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
.hdr-user{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.13);border-radius:50px;padding:7px 13px;
  font-size:13px;font-weight:700;}
.hdr-logout{background:transparent;border:none;font-size:11px;color:#3d526e;
  cursor:pointer;text-decoration:underline;}
 
/* TABS */
.tabs{background:#122035;border-bottom:1px solid #243352;display:flex;
  overflow-x:auto;position:sticky;top:0;z-index:99;
  box-shadow:0 4px 20px rgba(0,0,0,.4);-webkit-overflow-scrolling:touch;}
.tab{padding:12px 15px;font-family:'Barlow Condensed',sans-serif;font-size:14px;
  font-weight:700;letter-spacing:.5px;background:transparent;border:none;
  cursor:pointer;border-bottom:3px solid transparent;color:#7a91b0;
  white-space:nowrap;flex-shrink:0;transition:color .15s;}
.tab:hover{color:#eef2f8;}
.tab.active{color:#f0b429;border-bottom-color:#f0b429;}
.tab.adm{color:#e8634a;}.tab.adm.active{border-bottom-color:#e8634a;}
 
/* MAIN */
.main{flex:1;padding:16px 20px;max-width:1600px;margin:0 auto;width:100%;}
 
/* NOTICES */
.notice{background:rgba(240,180,41,.07);border:1px solid rgba(240,180,41,.2);
  border-radius:8px;padding:10px 14px;font-size:12px;color:#f0b429;
  font-weight:600;margin-bottom:16px;}
.notice.blue{background:rgba(90,173,220,.07);border-color:rgba(90,173,220,.2);color:#5aaddc;}
.notice.red{background:rgba(224,80,80,.07);border-color:rgba(224,80,80,.2);color:#e05050;}
 
/* FILTER */
.gf-bar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.gf-btn{background:transparent;border:1px solid #2e4068;color:#7a91b0;
  font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;
  padding:5px 13px;cursor:pointer;border-radius:6px;transition:all .15s;letter-spacing:.5px;}
.gf-btn:hover{border-color:#f0b429;color:#f0b429;}
.gf-btn.active{background:#f0b429;border-color:#f0b429;color:#0d1b2a;}
 
/* GRIDS */
.group-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;}
.ko-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;}
.admin-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;}
 
/* CARD */
.card{background:#162540;border:1px solid #243352;border-radius:12px;overflow:hidden;
  box-shadow:0 2px 12px rgba(0,0,0,.3);transition:border-color .2s,transform .2s;}
.card:hover{border-color:#2e4068;transform:translateY(-1px);}
.card.final{border-color:rgba(240,180,41,.5);background:linear-gradient(135deg,#1a2b4a,#162540);}
 
/* GROUP HEADER */
.g-hdr{padding:12px 15px;background:#1a2b4a;border-bottom:1px solid #243352;
  display:flex;align-items:center;gap:11px;}
.g-badge{width:42px;height:42px;border-radius:9px;
  background:linear-gradient(135deg,#f0b429,#b8862a);
  display:flex;align-items:center;justify-content:center;
  font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;
  color:#0d1b2a;flex-shrink:0;box-shadow:0 4px 12px rgba(240,180,41,.2);}
.g-info{flex:1;min-width:0;}
.g-lbl{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
  color:#7a91b0;margin-bottom:2px;}
.g-teams{font-size:11px;font-weight:600;color:#eef2f8;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;opacity:.85;}
.g-flag{font-size:24px;}
 
/* JORNADA */
.j-lbl{padding:5px 14px;font-size:9px;font-weight:700;letter-spacing:3px;
  text-transform:uppercase;color:#5aaddc;background:rgba(90,173,220,.07);
  border-bottom:1px solid #243352;}
 
/* MATCH ROW */
.m-row{border-bottom:1px solid rgba(36,51,82,.6);transition:background .15s;}
.m-row:hover{background:rgba(240,180,41,.03);}
.m-grid{display:grid;grid-template-columns:42px 1fr 58px;align-items:center;
  padding:9px 14px;gap:8px;}
.m-date{font-size:10px;color:#7a91b0;line-height:1.3;}
.m-day{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;
  color:#eef2f8;display:block;}
.m-center{display:flex;align-items:center;min-width:0;}
.team{font-size:12px;font-weight:700;flex:1;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;transition:color .2s;}
.team.away{text-align:right;}
.s-block{display:flex;align-items:center;gap:2px;padding:0 5px;flex-shrink:0;}
.s-in{width:28px;height:26px;background:rgba(13,27,42,.9);border:1px solid #2e4068;
  color:#f0b429;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;
  text-align:center;border-radius:5px;outline:none;transition:border-color .15s,box-shadow .15s;}
.s-in:focus{border-color:#f0b429;box-shadow:0 0 0 2px rgba(240,180,41,.15);}
.s-sep{font-size:12px;color:#3d526e;}
.off-s{display:flex;align-items:center;gap:2px;padding:0 5px;flex-shrink:0;}
.off-n{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:900;
  color:#fff;width:18px;text-align:center;}
.m-venue{font-size:9px;color:#3d526e;font-weight:700;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;text-align:right;}
.pt-b{display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;border-radius:5px;font-family:'Barlow Condensed',sans-serif;
  font-size:13px;font-weight:800;flex-shrink:0;}
.pt-b.ex{background:rgba(67,199,138,.15);color:#43c78a;border:1px solid rgba(67,199,138,.3);}
.pt-b.co{background:rgba(90,173,220,.12);color:#5aaddc;border:1px solid rgba(90,173,220,.25);}
.pt-b.wr{background:rgba(224,80,80,.1);color:#e05050;border:1px solid rgba(224,80,80,.2);}
.pt-b.pe{background:rgba(61,82,110,.15);color:#3d526e;border:1px solid #3d526e;}
 
/* STANDINGS */
.st-wrap{border-top:2px solid #243352;background:rgba(9,18,34,.5);}
.st-hdr{padding:5px 14px;font-size:9px;font-weight:700;letter-spacing:3px;
  text-transform:uppercase;color:#2eb8a0;background:rgba(46,184,160,.07);
  border-bottom:1px solid #243352;display:flex;justify-content:space-between;align-items:center;}
.st-cols{display:flex;}
.st-col{width:22px;text-align:center;font-size:9px;color:#3d526e;}
.st-col.pts{width:28px;color:#f0b429;font-weight:700;}
.st-row{display:grid;grid-template-columns:20px 1fr 22px 22px 22px 22px 26px 28px;
  align-items:center;padding:5px 14px;border-bottom:1px solid rgba(36,51,82,.4);font-size:11px;}
.st-row:last-child{border-bottom:none;}
.st-row.q{background:rgba(67,199,138,.05);}
.st-pos{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;
  text-align:center;color:#3d526e;}
.st-pos.q{color:#43c78a;}.st-pos.t{color:#5aaddc;}
.st-name{font-size:11px;font-weight:700;padding-right:5px;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;}
.st-row.q .st-name{color:#43c78a;}
.st-n{text-align:center;color:#7a91b0;}
.st-gd{text-align:center;font-size:10px;color:#7a91b0;}
.st-pts-v{text-align:center;font-family:'Barlow Condensed',sans-serif;
  font-size:18px;font-weight:800;color:#f0b429;}
 
/* KO */
.ko-sec{margin-bottom:26px;}
.ko-hdr{display:flex;align-items:center;gap:10px;margin-bottom:12px;
  padding-bottom:8px;border-bottom:2px solid #2e4068;}
.ko-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:#fff;}
.ko-title.final{color:#f0b429;font-size:28px;}
.ko-match{padding:11px 14px;}
.ko-row{display:flex;align-items:center;min-width:0;margin-bottom:5px;}
.ko-team{font-size:13px;font-weight:700;flex:1;white-space:nowrap;
  overflow:hidden;text-overflow:ellipsis;}
.ko-team.away{text-align:right;}
.ko-meta{display:flex;justify-content:space-between;align-items:center;}
.ko-venue{font-size:9px;color:#3d526e;font-weight:700;}
.ko-sim{font-size:10px;color:#5aaddc;margin-top:3px;font-weight:600;}
 
/* RANKING */
.rank-hdr{padding:18px 20px;background:#1a2b4a;border-bottom:1px solid #243352;}
.rank-hdr h2{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:#fff;}
.rank-legend{display:flex;gap:14px;margin-top:9px;flex-wrap:wrap;}
.rl{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:#7a91b0;}
.rl-dot{width:9px;height:9px;border-radius:2px;}
.rank-row{display:flex;align-items:center;gap:12px;padding:14px 20px;
  border-bottom:1px solid rgba(36,51,82,.5);transition:background .15s;}
.rank-row:hover{background:rgba(255,255,255,.02);}
.rank-row:last-child{border-bottom:none;}
.rank-row.me{background:rgba(240,180,41,.04);border-left:3px solid #f0b429;}
.rank-pos{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;
  width:34px;text-align:center;flex-shrink:0;}
.rank-name{font-size:15px;font-weight:700;flex:1;}
.rank-pts{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;
  color:#f0b429;flex-shrink:0;}
.rank-pts small{font-size:11px;font-weight:600;color:#7a91b0;
  font-family:'Nunito Sans',sans-serif;margin-left:2px;}
.rank-badges{display:flex;gap:5px;flex-direction:column;align-items:flex-end;}
.rb{border-radius:100px;padding:2px 9px;font-size:11px;font-weight:700;}
.rb.ex{background:rgba(67,199,138,.12);color:#43c78a;border:1px solid rgba(67,199,138,.25);}
.rb.co{background:rgba(90,173,220,.1);color:#5aaddc;border:1px solid rgba(90,173,220,.2);}
 
/* ADMIN */
.adm-banner{background:rgba(232,99,74,.08);border:1px solid rgba(232,99,74,.25);
  border-radius:10px;padding:13px 18px;margin-bottom:18px;}
.adm-banner h3{font-family:'Barlow Condensed',sans-serif;font-weight:900;
  font-size:18px;color:#e8634a;}
.adm-banner p{font-size:12px;color:#7a91b0;margin-top:3px;}
.adm-sec{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;
  color:#5aaddc;margin:20px 0 10px;padding-bottom:6px;border-bottom:1px solid #2e4068;}
.adm-match{display:flex;align-items:center;gap:7px;padding:8px 14px;
  border-bottom:1px solid rgba(36,51,82,.5);}
.adm-match:last-child{border-bottom:none;}
.adm-teams{flex:1;min-width:0;}
.adm-h{font-size:11px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.adm-a{font-size:11px;color:#7a91b0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.adm-score{display:flex;align-items:center;gap:3px;}
.adm-in{width:32px;height:28px;background:rgba(13,27,42,.9);border:1px solid #2e4068;
  color:#e8634a;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;
  text-align:center;border-radius:6px;outline:none;transition:border-color .15s;}
.adm-in:focus{border-color:#e8634a;}
.adm-in.set{border-color:rgba(232,99,74,.4);background:rgba(232,99,74,.05);}
.adm-sep{font-size:12px;color:#3d526e;}
.adm-day{font-size:9px;color:#3d526e;font-weight:700;flex-shrink:0;}
 
/* AVATAR */
.av{border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Barlow Condensed',sans-serif;font-weight:900;color:#0d1b2a;flex-shrink:0;}
 
/* LOGIN */
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;
  padding:16px;background:linear-gradient(160deg,#0a1628 0%,#0d1b2a 60%,#122035 100%);}
.login-card{background:#162540;border:1px solid #2e4068;border-radius:16px;
  padding:32px 26px;width:100%;max-width:400px;
  box-shadow:0 24px 64px rgba(0,0,0,.6);text-align:center;}
.login-logo{width:110px;height:110px;margin:0 auto 18px;
  display:flex;align-items:center;justify-content:center;}
.login-logo img{width:100%;height:100%;object-fit:contain;}
.login-title{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;
  color:#fff;margin-bottom:7px;}
.login-sub{font-size:13px;color:#7a91b0;margin-bottom:22px;line-height:1.6;}
.login-rules{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:22px;}
.login-rule{background:rgba(13,27,42,.6);border-radius:10px;padding:12px 6px;
  border:1px solid #243352;}
.login-rule .val{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;
  display:block;margin-bottom:3px;}
.login-rule .lbl{font-size:10px;color:#7a91b0;font-weight:600;}
.inp{width:100%;background:rgba(13,27,42,.8);border:1px solid #2e4068;border-radius:8px;
  padding:12px 14px;font-size:15px;font-weight:600;color:#eef2f8;outline:none;
  display:block;margin-bottom:12px;font-family:'Nunito Sans',sans-serif;
  transition:border-color .15s,box-shadow .15s;}
.inp:focus{border-color:#f0b429;box-shadow:0 0 0 2px rgba(240,180,41,.15);}
.inp::placeholder{color:#3d526e;}
.btn-gold{width:100%;padding:13px;background:#f0b429;border:none;border-radius:8px;
  font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;
  letter-spacing:1px;color:#0d1b2a;cursor:pointer;transition:all .15s;}
.btn-gold:hover{background:#ffd166;transform:translateY(-1px);
  box-shadow:0 6px 20px rgba(240,180,41,.3);}
.btn-gold:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none;}
.adm-link{margin-top:13px;font-size:11px;color:#3d526e;cursor:pointer;
  text-decoration:underline;display:inline-block;transition:color .15s;}
.adm-link:hover{color:#7a91b0;}
.parts-list{margin-top:20px;text-align:left;}
.parts-title{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
  color:#3d526e;margin-bottom:10px;}
.part-row{display:flex;align-items:center;gap:9px;padding:7px 0;
  border-bottom:1px solid #243352;}
.part-row:last-child{border-bottom:none;}
.part-name{flex:1;font-size:13px;font-weight:600;}
.part-pts{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#f0b429;}
.part-preds{font-size:11px;color:#7a91b0;}
 
/* PIN BOX */
.pin-info{background:rgba(232,99,74,.08);border:1px solid rgba(232,99,74,.2);
  border-radius:8px;padding:10px 14px;margin-bottom:16px;text-align:left;}
.pin-info p{font-size:12px;color:#7a91b0;margin-bottom:4px;}
.pin-info strong{font-family:'Barlow Condensed',sans-serif;font-size:20px;
  color:#e8634a;letter-spacing:3px;}
 
/* LOADING */
.loading{display:flex;align-items:center;justify-content:center;gap:12px;
  min-height:100vh;color:#7a91b0;font-size:14px;}
.spinner{width:24px;height:24px;border:2px solid #2e4068;border-top-color:#f0b429;
  border-radius:50%;animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
 
/* MOBILE */
@media(max-width:480px){
  .hdr{padding:10px 14px;gap:10px;}
  .hdr-logo{width:50px;height:50px;}
  .main{padding:10px 12px;}
  .group-grid,.ko-grid,.admin-grid{grid-template-columns:1fr;}
  .m-grid{grid-template-columns:38px 1fr 50px;padding:8px 10px;gap:5px;}
  .m-venue{display:none;}
  .tabs .tab{padding:10px 12px;font-size:13px;}
  .rank-badges{display:none;}
  .login-card{padding:24px 18px;}
  .login-logo{width:88px;height:88px;}
}
@media(max-width:360px){
  .hdr-user span{display:none;}
  .s-in{width:25px;height:24px;font-size:14px;}
}
`;
 
/* ═══════════════════════════════════════════
   LOGO OFICIAL FIFA 2026
═══════════════════════════════════════════ */
function Logo({size=64}) {
  const [ok,setOk] = useState(true);
  if (!ok) return <span style={{fontSize:size*.6}}>🏆</span>;
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/2026_FIFA_World_Cup_logo.svg/800px-2026_FIFA_World_Cup_logo.svg.png"
      alt="FIFA World Cup 2026"
      width={size} height={size}
      style={{objectFit:"contain"}}
      onError={()=>setOk(false)}
    />
  );
}
 
/* ═══════════════════════════════════════════
   APP
═══════════════════════════════════════════ */
export default function App() {
  const [db,      setDb]      = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [user,    setUser]    = useState(()=>localStorage.getItem("pu")||null);
  const [isAdmin, setIsAdmin] = useState(()=>localStorage.getItem("pa")==="1");
  const [tab,     setTab]     = useState("grupos");
  const [gf,      setGf]      = useState("all");
  const [nameIn,  setNameIn]  = useState("");
  const [pinIn,   setPinIn]   = useState("");
  const [lmode,   setLmode]   = useState("user");
  const pollRef = useRef(null);
  const saveRef = useRef(null);
 
  /* ── DB ── */
  const load = useCallback(async()=>{
    try {
      const d = await dbRead();
      setDb(d); setError(null);
    } catch(e) {
      // Si falla lectura, usar localStorage como fallback
      const local = localStorage.getItem("porra_db");
      if (local) setDb(JSON.parse(local));
      else setDb({official:{},participants:{}});
      setError("Modo offline — datos guardados localmente");
    } finally { setLoading(false); }
  },[]);
 
  useEffect(()=>{
    load();
    pollRef.current = setInterval(load, 15000);
    return ()=>clearInterval(pollRef.current);
  },[load]);
 
  const persist = useCallback((data)=>{
    // Guardar siempre en localStorage como backup
    localStorage.setItem("porra_db", JSON.stringify(data));
    // Intentar guardar en Google Sheets
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(async()=>{
      setSaving(true);
      try {
        await dbWrite(data);
        setError(null);
      } catch(e) {
        setError("Sin conexión — guardado localmente");
      } finally { setSaving(false); }
    }, 800);
  },[]);
 
  /* ── AUTH ── */
  const join = ()=>{
    const n=nameIn.trim(); if(!n) return;
    localStorage.setItem("pu",n); localStorage.setItem("pa","0");
    setUser(n); setIsAdmin(false);
    const upd=JSON.parse(JSON.stringify(db||{official:{},participants:{}}));
    if(!upd.participants[n]){upd.participants[n]={scores:{},ts:Date.now()};setDb(upd);persist(upd);}
  };
 
  const adminLogin=()=>{
    if(pinIn===ADMIN_PIN){
      localStorage.setItem("pu","Admin"); localStorage.setItem("pa","1");
      setUser("Admin"); setIsAdmin(true); setTab("admin");
    } else alert("PIN incorrecto");
  };
 
  const logout=()=>{
    localStorage.removeItem("pu"); localStorage.removeItem("pa");
    setUser(null); setIsAdmin(false); setNameIn(""); setPinIn(""); setLmode("user");
  };
 
  /* ── SCORES ── */
  const setPred=(mid,side,val)=>{
    if(!user||isAdmin||!db) return;
    const upd=JSON.parse(JSON.stringify(db));
    if(!upd.participants[user]) upd.participants[user]={scores:{},ts:Date.now()};
    if(!upd.participants[user].scores[mid]) upd.participants[user].scores[mid]={home:null,away:null};
    upd.participants[user].scores[mid][side]=val===""?null:Math.max(0,parseInt(val)||0);
    setDb(upd); persist(upd);
  };
 
  const setOff=(mid,side,val)=>{
    if(!isAdmin||!db) return;
    const upd=JSON.parse(JSON.stringify(db));
    if(!upd.official[mid]) upd.official[mid]={home:null,away:null};
    upd.official[mid][side]=val===""?null:Math.max(0,parseInt(val)||0);
    setDb(upd); persist(upd);
  };
 
  /* ── DERIVED ── */
  const mysc    = db&&user&&!isAdmin?db.participants?.[user]?.scores||{}:{};
  const off     = db?.official||{};
  const parts   = db?Object.entries(db.participants||{}):[];
  const played  = Object.values(off).filter(s=>s.home!=null&&s.away!=null).length;
  const myTot   = totals(mysc,off);
  const predCnt = Object.values(mysc).filter(s=>s.home!=null&&s.away!=null).length;
  const bracket = calcBracket(mysc);
  const visG    = gf==="all"?GROUPS:GROUPS.filter(g=>g.id===gf);
 
  /* ── COMPONENTS ── */
  function Av({n,sz=28}) {
    return <div className="av" style={{width:sz,height:sz,background:acolor(n),fontSize:sz*.42}}>{ini(n)}</div>;
  }
 
  function PtBadge({mid}) {
    const r=off[mid],pr=mysc[mid];
    if(!r||r.home==null||r.away==null) return <span className="pt-b pe">?</span>;
    const v=calcPts(pr,r);
    if(v===3) return <span className="pt-b ex">3</span>;
    if(v===1) return <span className="pt-b co">1</span>;
    return <span className="pt-b wr">0</span>;
  }
 
  function ScoreCell({mid}) {
    const r=off[mid], sc=mysc[mid]||{home:null,away:null};
    const pl=r&&r.home!=null&&r.away!=null;
    if(pl) return (
      <div className="off-s">
        <span className="off-n">{r.home}</span>
        <span style={{fontSize:13,color:"#3d526e",width:10,textAlign:"center"}}>:</span>
        <span className="off-n">{r.away}</span>
      </div>
    );
    return (
      <div className="s-block">
        <input className="s-in" type="number" min="0" max="99"
          value={sc.home!=null?sc.home:""} placeholder="–"
          onChange={e=>setPred(mid,"home",e.target.value)}/>
        <span className="s-sep">:</span>
        <input className="s-in" type="number" min="0" max="99"
          value={sc.away!=null?sc.away:""} placeholder="–"
          onChange={e=>setPred(mid,"away",e.target.value)}/>
      </div>
    );
  }
 
  function MRow({m}) {
    const r=off[m.id]; const pl=r&&r.home!=null&&r.away!=null;
    const hc=pl?(r.home>r.away?"#43c78a":r.home===r.away?"#5aaddc":"#eef2f8"):"#eef2f8";
    const ac=pl?(r.away>r.home?"#43c78a":r.home===r.away?"#5aaddc":"#eef2f8"):"#eef2f8";
    return (
      <div className="m-row">
        <div className="m-grid">
          <div className="m-date">
            <span className="m-day">{m.day.split(" ")[0]}</span>
            {m.day.split(" ")[1]}
          </div>
          <div className="m-center">
            <span className="team home" style={{color:hc}}>{m.home}</span>
            <ScoreCell mid={m.id}/>
            <span className="team away" style={{color:ac}}>{m.away}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <PtBadge mid={m.id}/>
            {!pl&&<div className="m-venue">{m.venue}</div>}
          </div>
        </div>
      </div>
    );
  }
 
  function Standings({gid}) {
    const sc=isAdmin?off:mysc;
    const rows=calcStandings(gid,sc);
    return (
      <div className="st-wrap">
        <div className="st-hdr">
          <span>Posiciones {isAdmin?"(Reales)":"(Mis pred.)"}</span>
          <div className="st-cols">
            {["PJ","G","E","P","DG"].map(c=><span key={c} className="st-col">{c}</span>)}
            <span className="st-col pts">PTS</span>
          </div>
        </div>
        {rows.map((r,i)=>(
          <div key={r.n} className={`st-row${i<2?" q":""}`}>
            <span className={`st-pos${i<2?" q":i===2?" t":""}`}>{i+1}</span>
            <span className="st-name">{r.n}</span>
            {[r.pj,r.pg,r.pe,r.pp].map((v,k)=><span key={k} className="st-n">{v||"–"}</span>)}
            <span className="st-gd">{r.pj>0?(r.gd>=0?`+${r.gd}`:`${r.gd}`):"–"}</span>
            <span className="st-pts-v">{r.pt}</span>
          </div>
        ))}
      </div>
    );
  }
 
  function GroupCard({g}) {
    return (
      <div className="card">
        <div className="g-hdr">
          <div className="g-badge">{g.id}</div>
          <div className="g-info">
            <div className="g-lbl">Grupo {g.id}</div>
            <div className="g-teams">{g.teams.join(" · ")}</div>
          </div>
          <span className="g-flag">{g.flag}</span>
        </div>
        {[1,2,3].map(j=>(
          <div key={j}>
            <div className="j-lbl">Jornada {j}</div>
            {g.matches.filter(m=>m.j===j).map(m=><MRow key={m.id} m={m}/>)}
          </div>
        ))}
        <Standings gid={g.id}/>
      </div>
    );
  }
 
  function KOCard({m,isFinal=false}) {
    const r=off[m.id]; const pl=r&&r.home!=null&&r.away!=null;
    const hc=pl?(r.home>r.away?"#43c78a":r.home===r.away?"#5aaddc":"#eef2f8"):"#eef2f8";
    const ac=pl?(r.away>r.home?"#43c78a":r.home===r.away?"#5aaddc":"#eef2f8"):"#eef2f8";
    const sim=m.home&&!m.home.startsWith("G.")&&!m.home.startsWith("?")&&
      !m.home.startsWith("1°")&&!m.home.startsWith("2°")&&
      !m.home.startsWith("Per.")&&m.home!=="?";
    return (
      <div className={`card${isFinal?" final":""}`}>
        <div className="ko-match">
          <div className="ko-row">
            <span className="ko-team home" style={{color:hc}}>{m.home}</span>
            {pl
              ? <div className="off-s" style={{padding:"0 7px"}}>
                  <span className="off-n">{r.home}</span>
                  <span style={{fontSize:13,color:"#3d526e",width:10,textAlign:"center"}}>:</span>
                  <span className="off-n">{r.away}</span>
                </div>
              : <span style={{padding:"0 9px",fontSize:13,color:"#3d526e",fontWeight:700}}>vs</span>
            }
            <span className="ko-team away" style={{color:ac}}>{m.away}</span>
          </div>
          <div className="ko-meta">
            <span className="ko-venue">📅 {m.day} · {m.venue}</span>
          </div>
          {sim&&<div className="ko-sim">⚡ Calculado desde tus predicciones</div>}
        </div>
      </div>
    );
  }
 
  function KOSec({title,emoji,matches,isFinal=false}) {
    const done=matches.filter(m=>{const o=off[m.id];return o&&o.home!=null&&o.away!=null;}).length;
    return (
      <div className="ko-sec">
        <div className="ko-hdr">
          <span style={{fontSize:22}}>{emoji}</span>
          <span className={`ko-title${isFinal?" final":""}`}>{title}</span>
          <span style={{marginLeft:"auto",fontSize:11,color:"#7a91b0"}}>{done}/{matches.length} jugados</span>
        </div>
        <div className="ko-grid">
          {matches.map(m=><KOCard key={m.id} m={m} isFinal={isFinal}/>)}
        </div>
      </div>
    );
  }
 
  /* ── LOADING ── */
  if(loading) return (
    <><style>{css}</style>
    <div className="loading"><div className="spinner"/>Cargando porra…</div></>
  );
 
  /* ── LOGIN ── */
  if(!user) return (
    <><style>{css}</style>
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo"><Logo size={100}/></div>
        {lmode==="user"?(
          <>
            <div className="login-title">Porra Mundial 2026</div>
            <div className="login-sub">Predice todos los partidos, ve tu bracket simulado y compite con tus amigos en tiempo real.</div>
            <div className="login-rules">
              <div className="login-rule">
                <span className="val" style={{color:"#43c78a"}}>3</span>
                <span className="lbl">Exacto</span>
              </div>
              <div className="login-rule">
                <span className="val" style={{color:"#5aaddc"}}>1</span>
                <span className="lbl">Resultado</span>
              </div>
              <div className="login-rule">
                <span className="val" style={{color:"#e05050"}}>0</span>
                <span className="lbl">Error</span>
              </div>
            </div>
            {error&&<div className="notice red" style={{marginBottom:14,textAlign:"left"}}>⚠️ {error}</div>}
            <input className="inp" placeholder="Tu nombre o apodo…"
              value={nameIn} onChange={e=>setNameIn(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&join()} maxLength={24}/>
            <button className="btn-gold" onClick={join} disabled={!nameIn.trim()}>
              ENTRAR A LA PORRA
            </button>
            {parts.length>0&&(
              <div className="parts-list">
                <div className="parts-title">Ya participan ({parts.length})</div>
                {parts.map(([n,d])=>{
                  const t=totals(d.scores||{},off);
                  const pr=Object.values(d.scores||{}).filter(s=>s.home!=null&&s.away!=null).length;
                  return (
                    <div key={n} className="part-row">
                      <Av n={n} sz={26}/>
                      <span className="part-name">{n}</span>
                      {played>0&&<span className="part-pts">{t.p}pts</span>}
                      <span className="part-preds">{pr} pred.</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="adm-link" onClick={()=>setLmode("admin")}>Soy el administrador →</div>
          </>
        ):(
          <>
            <div className="login-title">Acceso Admin</div>
            <div className="login-sub">Ingresa el PIN para registrar los resultados oficiales y activar el sistema de puntos.</div>
            <div className="pin-info">
              <p>PIN de administrador:</p>
              <strong>{ADMIN_PIN}</strong>
            </div>
            <input className="inp" type="password" placeholder="Ingresa el PIN…"
              value={pinIn} onChange={e=>setPinIn(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&adminLogin()}/>
            <button className="btn-gold" onClick={adminLogin} disabled={!pinIn}>
              ENTRAR COMO ADMIN
            </button>
            <div className="adm-link" onClick={()=>setLmode("user")}>← Volver</div>
          </>
        )}
      </div>
    </div></>
  );
 
  /* ── APP PRINCIPAL ── */
  return (
    <><style>{css}</style>
    <div className="app">
 
      {/* HEADER */}
      <div className="hdr">
        <div className="hdr-logo"><Logo size={58}/></div>
        <div className="hdr-text">
          <div className="hdr-title">PORRA <span>MUNDIAL 2026</span></div>
          <div className="hdr-pills">
            <span className="hdr-pill">📋 {predCnt} pred.</span>
            {played>0&&<span className="hdr-pill gold">{myTot.p}pts · {myTot.ex}✓✓ · {myTot.co}✓</span>}
            {saving&&<span className="hdr-pill blue">💾 Guardando…</span>}
            {!saving&&!error&&<span className="hdr-pill blue">✓ Sincronizado</span>}
          </div>
        </div>
        <div className="hdr-right">
          <div className="hdr-user"><Av n={user} sz={28}/><span>{user}</span></div>
          <button className="hdr-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
 
      {/* TABS */}
      <div className="tabs">
        {!isAdmin&&<button className={`tab${tab==="grupos"?" active":""}`} onClick={()=>setTab("grupos")}>📋 Grupos</button>}
        {!isAdmin&&<button className={`tab${tab==="bracket"?" active":""}`} onClick={()=>setTab("bracket")}>⚔️ Mi Bracket</button>}
        <button className={`tab${tab==="ranking"?" active":""}`} onClick={()=>setTab("ranking")}>🏆 Ranking</button>
        {isAdmin&&<button className={`tab adm${tab==="admin"?" active":""}`} onClick={()=>setTab("admin")}>⚙️ Resultados</button>}
      </div>
 
      <div className="main">
        {error&&<div className="notice red">⚠️ {error}</div>}
 
        {/* GRUPOS */}
        {tab==="grupos"&&(
          <>
            <div className="notice">
              💡 Ingresa tus predicciones. El bracket se genera automáticamente. Los puntos aparecen cuando el Admin ingresa resultados oficiales.
            </div>
            <div className="gf-bar">
              {["all",...GROUPS.map(g=>g.id)].map(id=>(
                <button key={id} className={`gf-btn${gf===id?" active":""}`} onClick={()=>setGf(id)}>
                  {id==="all"?"Todos":id}
                </button>
              ))}
            </div>
            <div className="group-grid">
              {visG.map(g=><GroupCard key={g.id} g={g}/>)}
            </div>
          </>
        )}
 
        {/* BRACKET */}
        {tab==="bracket"&&(
          <>
            <div className="notice blue">
              ⚡ Bracket generado automáticamente con tus predicciones. Se actualiza en tiempo real conforme predices más partidos.
            </div>
            <KOSec title="Ronda de 32"      emoji="⚔️" matches={bracket.r32}/>
            <KOSec title="Octavos de Final" emoji="🔥" matches={bracket.r16}/>
            <KOSec title="Cuartos de Final" emoji="⭐" matches={bracket.qf}/>
            <KOSec title="Semifinales"      emoji="🌟" matches={bracket.sf}/>
            <KOSec title="Tercer Lugar"     emoji="🥉" matches={bracket.third}/>
            <KOSec title="FINAL"            emoji="🏆" matches={bracket.fin} isFinal/>
          </>
        )}
 
        {/* RANKING */}
        {tab==="ranking"&&(
          <div className="card" style={{maxWidth:720}}>
            <div className="rank-hdr">
              <h2>🏆 Tabla de la Porra</h2>
              <div style={{fontSize:12,color:"#7a91b0",marginTop:3}}>
                {played} de {ALL_MATCHES.length} partidos jugados · {parts.length} participantes
              </div>
              <div className="rank-legend">
                {[["#43c78a","Exacto = 3pts"],["#5aaddc","Resultado = 1pt"],["#e05050","Error = 0"]].map(([clr,l])=>(
                  <div key={l} className="rl"><div className="rl-dot" style={{background:clr}}/>{l}</div>
                ))}
              </div>
            </div>
            {parts.length===0&&<div style={{padding:40,textAlign:"center",color:"#7a91b0"}}>Nadie se ha unido todavía.</div>}
            {[...parts].map(([n,d])=>({n,...totals(d.scores||{},off)}))
              .sort((a,b)=>b.p-a.p||b.ex-a.ex||b.co-a.co)
              .map(({n,p,ex,co},i)=>{
                const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1;
                const pc=i===0?"#f0b429":i===1?"#c0c0c0":i===2?"#cd7f32":"#3d526e";
                return (
                  <div key={n} className={`rank-row${n===user?" me":""}`}>
                    <span className="rank-pos" style={{color:pc}}>{medal}</span>
                    <Av n={n} sz={36}/>
                    <span className="rank-name">{n}{n===user?" (tú)":""}</span>
                    <span className="rank-pts">{p}<small>pts</small></span>
                    <div className="rank-badges">
                      <span className="rb ex">✓✓ {ex} exactos</span>
                      <span className="rb co">✓ {co} correctos</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
 
        {/* ADMIN */}
        {tab==="admin"&&isAdmin&&(
          <div style={{maxWidth:880}}>
            <div className="adm-banner">
              <h3>⚙️ Panel Admin — Resultados Oficiales</h3>
              <p>Ingresa los marcadores reales. Los puntos de todos los participantes se calculan y sincronizan automáticamente.</p>
            </div>
            <div className="adm-sec">Fase de Grupos</div>
            <div className="admin-grid">
              {GROUPS.map(g=>{
                const done=g.matches.filter(m=>{const o=off[m.id];return o&&o.home!=null&&o.away!=null;}).length;
                return (
                  <div key={g.id} className="card">
                    <div className="g-hdr">
                      <div className="g-badge" style={{width:34,height:34,fontSize:18}}>{g.id}</div>
                      <span style={{fontWeight:700,fontSize:13,flex:1}}>{g.flag} Grupo {g.id}</span>
                      <span style={{fontSize:11,color:"#7a91b0"}}>{done}/{g.matches.length}</span>
                    </div>
                    {g.matches.map(m=>{
                      const o=off[m.id]||{};
                      const hv=o.home!=null?o.home:"";
                      const av=o.away!=null?o.away:"";
                      return (
                        <div key={m.id} className="adm-match">
                          <div className="adm-teams">
                            <div className="adm-h">{m.home}</div>
                            <div className="adm-a">{m.away}</div>
                          </div>
                          <div className="adm-score">
                            <input className={`adm-in${hv!==""?" set":""}`} type="number" min="0" max="99"
                              value={hv} placeholder="–" onChange={e=>setOff(m.id,"home",e.target.value)}/>
                            <span className="adm-sep">:</span>
                            <input className={`adm-in${av!==""?" set":""}`} type="number" min="0" max="99"
                              value={av} placeholder="–" onChange={e=>setOff(m.id,"away",e.target.value)}/>
                          </div>
                          <span className="adm-day">{m.day}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div></>
  );
}
