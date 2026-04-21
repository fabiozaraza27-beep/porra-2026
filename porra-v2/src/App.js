import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

/* ── CONFIG ── */
const ADMIN_PIN = '2026';
const BIN_ID    = '69e6d2d036566621a8d4f205';
const API_KEY   = '$2a$10$zQer8I5zhsrOei59Z794/Oxye1i9WFmFP5a2AqsN7MsXJkLKr1wam';
const BIN_URL   = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HDRS      = { 'Content-Type':'application/json','X-Master-Key':API_KEY,'X-Bin-Versioning':'false' };

async function dbRead() {
  const r = await fetch(BIN_URL, { headers: HDRS });
  if (!r.ok) throw new Error('read error');
  const j = await r.json();
  return j.record || { official:{}, participants:{} };
}
async function dbWrite(data) {
  const r = await fetch(BIN_URL, { method:'PUT', headers:HDRS, body:JSON.stringify(data) });
  if (!r.ok) throw new Error('write error');
}

/* ── DATA ── */
const GROUPS = [
  { id:'A', flag:'🇲🇽', teams:['México','Sudáfrica','Corea del Sur','Rep. Checa'],
    matches:[
      {id:'A1',j:1,day:'11 jun',home:'México',away:'Sudáfrica',venue:'Cd. México'},
      {id:'A2',j:1,day:'11 jun',home:'Corea del Sur',away:'Rep. Checa',venue:'Guadalajara'},
      {id:'A3',j:2,day:'18 jun',home:'Rep. Checa',away:'Sudáfrica',venue:'Atlanta'},
      {id:'A4',j:2,day:'18 jun',home:'México',away:'Corea del Sur',venue:'Guadalajara'},
      {id:'A5',j:3,day:'24 jun',home:'Rep. Checa',away:'México',venue:'Cd. México'},
      {id:'A6',j:3,day:'24 jun',home:'Sudáfrica',away:'Corea del Sur',venue:'Monterrey'},
    ]},
  { id:'B', flag:'🇨🇦', teams:['Canadá','Bosnia y Herz.','Qatar','Suiza'],
    matches:[
      {id:'B1',j:1,day:'12 jun',home:'Canadá',away:'Bosnia y Herz.',venue:'Toronto'},
      {id:'B2',j:1,day:'13 jun',home:'Qatar',away:'Suiza',venue:'San Francisco'},
      {id:'B3',j:2,day:'18 jun',home:'Suiza',away:'Bosnia y Herz.',venue:'Los Ángeles'},
      {id:'B4',j:2,day:'18 jun',home:'Canadá',away:'Qatar',venue:'Vancouver'},
      {id:'B5',j:3,day:'24 jun',home:'Suiza',away:'Canadá',venue:'Vancouver'},
      {id:'B6',j:3,day:'24 jun',home:'Bosnia y Herz.',away:'Qatar',venue:'Seattle'},
    ]},
  { id:'C', flag:'🇧🇷', teams:['Brasil','Marruecos','Haití','Escocia'],
    matches:[
      {id:'C1',j:1,day:'13 jun',home:'Brasil',away:'Marruecos',venue:'Nueva York'},
      {id:'C2',j:1,day:'13 jun',home:'Haití',away:'Escocia',venue:'Boston'},
      {id:'C3',j:2,day:'19 jun',home:'Escocia',away:'Marruecos',venue:'Boston'},
      {id:'C4',j:2,day:'19 jun',home:'Brasil',away:'Haití',venue:'Filadelfia'},
      {id:'C5',j:3,day:'24 jun',home:'Escocia',away:'Brasil',venue:'Miami'},
      {id:'C6',j:3,day:'24 jun',home:'Marruecos',away:'Haití',venue:'Atlanta'},
    ]},
  { id:'D', flag:'🇺🇸', teams:['EE.UU.','Paraguay','Australia','Turquía'],
    matches:[
      {id:'D1',j:1,day:'12 jun',home:'EE.UU.',away:'Paraguay',venue:'Los Ángeles'},
      {id:'D2',j:1,day:'13 jun',home:'Australia',away:'Turquía',venue:'Vancouver'},
      {id:'D3',j:2,day:'19 jun',home:'Turquía',away:'Paraguay',venue:'San Francisco'},
      {id:'D4',j:2,day:'19 jun',home:'EE.UU.',away:'Australia',venue:'Seattle'},
      {id:'D5',j:3,day:'25 jun',home:'Turquía',away:'EE.UU.',venue:'Los Ángeles'},
      {id:'D6',j:3,day:'25 jun',home:'Paraguay',away:'Australia',venue:'San Francisco'},
    ]},
  { id:'E', flag:'🇩🇪', teams:['Alemania','Curazao','C. de Marfil','Ecuador'],
    matches:[
      {id:'E1',j:1,day:'14 jun',home:'Alemania',away:'Curazao',venue:'Houston'},
      {id:'E2',j:1,day:'14 jun',home:'C. de Marfil',away:'Ecuador',venue:'Filadelfia'},
      {id:'E3',j:2,day:'20 jun',home:'Alemania',away:'C. de Marfil',venue:'Toronto'},
      {id:'E4',j:2,day:'20 jun',home:'Ecuador',away:'Curazao',venue:'Kansas City'},
      {id:'E5',j:3,day:'25 jun',home:'Ecuador',away:'Alemania',venue:'Nueva York'},
      {id:'E6',j:3,day:'25 jun',home:'Curazao',away:'C. de Marfil',venue:'Filadelfia'},
    ]},
  { id:'F', flag:'🇳🇱', teams:['P. Bajos','Japón','Suecia','Túnez'],
    matches:[
      {id:'F1',j:1,day:'14 jun',home:'P. Bajos',away:'Japón',venue:'Dallas'},
      {id:'F2',j:1,day:'14 jun',home:'Suecia',away:'Túnez',venue:'Monterrey'},
      {id:'F3',j:2,day:'20 jun',home:'P. Bajos',away:'Suecia',venue:'Houston'},
      {id:'F4',j:2,day:'20 jun',home:'Túnez',away:'Japón',venue:'Guadalajara'},
      {id:'F5',j:3,day:'25 jun',home:'Japón',away:'Suecia',venue:'Dallas'},
      {id:'F6',j:3,day:'25 jun',home:'Túnez',away:'P. Bajos',venue:'Kansas City'},
    ]},
  { id:'G', flag:'🇧🇪', teams:['Bélgica','Egipto','Irán','Nueva Zelanda'],
    matches:[
      {id:'G1',j:1,day:'15 jun',home:'Bélgica',away:'Egipto',venue:'Seattle'},
      {id:'G2',j:1,day:'15 jun',home:'Irán',away:'Nueva Zelanda',venue:'Los Ángeles'},
      {id:'G3',j:2,day:'21 jun',home:'Bélgica',away:'Irán',venue:'Los Ángeles'},
      {id:'G4',j:2,day:'21 jun',home:'Nueva Zelanda',away:'Egipto',venue:'Vancouver'},
      {id:'G5',j:3,day:'26 jun',home:'Egipto',away:'Irán',venue:'Seattle'},
      {id:'G6',j:3,day:'26 jun',home:'Nueva Zelanda',away:'Bélgica',venue:'Vancouver'},
    ]},
  { id:'H', flag:'🇪🇸', teams:['España','Cabo Verde','Arabia Saudita','Uruguay'],
    matches:[
      {id:'H1',j:1,day:'15 jun',home:'España',away:'Cabo Verde',venue:'Atlanta'},
      {id:'H2',j:1,day:'15 jun',home:'Arabia Saudita',away:'Uruguay',venue:'Miami'},
      {id:'H3',j:2,day:'21 jun',home:'España',away:'Arabia Saudita',venue:'Atlanta'},
      {id:'H4',j:2,day:'21 jun',home:'Uruguay',away:'Cabo Verde',venue:'Miami'},
      {id:'H5',j:3,day:'26 jun',home:'Cabo Verde',away:'Arabia Saudita',venue:'Houston'},
      {id:'H6',j:3,day:'26 jun',home:'Uruguay',away:'España',venue:'Guadalajara'},
    ]},
  { id:'I', flag:'🇫🇷', teams:['Francia','Senegal','Iraq','Noruega'],
    matches:[
      {id:'I1',j:1,day:'16 jun',home:'Francia',away:'Senegal',venue:'Nueva York'},
      {id:'I2',j:1,day:'16 jun',home:'Iraq',away:'Noruega',venue:'Boston'},
      {id:'I3',j:2,day:'22 jun',home:'Francia',away:'Iraq',venue:'Filadelfia'},
      {id:'I4',j:2,day:'22 jun',home:'Noruega',away:'Senegal',venue:'Nueva York'},
      {id:'I5',j:3,day:'26 jun',home:'Noruega',away:'Francia',venue:'Boston'},
      {id:'I6',j:3,day:'26 jun',home:'Senegal',away:'Iraq',venue:'Toronto'},
    ]},
  { id:'J', flag:'🇦🇷', teams:['Argentina','Argelia','Austria','Jordania'],
    matches:[
      {id:'J1',j:1,day:'16 jun',home:'Argentina',away:'Argelia',venue:'Kansas City'},
      {id:'J2',j:1,day:'16 jun',home:'Austria',away:'Jordania',venue:'San Francisco'},
      {id:'J3',j:2,day:'22 jun',home:'Argentina',away:'Austria',venue:'Dallas'},
      {id:'J4',j:2,day:'22 jun',home:'Jordania',away:'Argelia',venue:'San Francisco'},
      {id:'J5',j:3,day:'27 jun',home:'Argelia',away:'Austria',venue:'Kansas City'},
      {id:'J6',j:3,day:'27 jun',home:'Jordania',away:'Argentina',venue:'Dallas'},
    ]},
  { id:'K', flag:'🇵🇹', teams:['Portugal','Congo DR','Uzbekistán','Colombia'],
    matches:[
      {id:'K1',j:1,day:'17 jun',home:'Portugal',away:'Congo DR',venue:'Houston'},
      {id:'K2',j:1,day:'17 jun',home:'Uzbekistán',away:'Colombia',venue:'Cd. México'},
      {id:'K3',j:2,day:'23 jun',home:'Portugal',away:'Uzbekistán',venue:'Houston'},
      {id:'K4',j:2,day:'23 jun',home:'Congo DR',away:'Colombia',venue:'Guadalajara'},
      {id:'K5',j:3,day:'27 jun',home:'Colombia',away:'Portugal',venue:'Miami'},
      {id:'K6',j:3,day:'27 jun',home:'Congo DR',away:'Uzbekistán',venue:'Atlanta'},
    ]},
  { id:'L', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', teams:['Inglaterra','Croacia','Ghana','Panamá'],
    matches:[
      {id:'L1',j:1,day:'17 jun',home:'Inglaterra',away:'Croacia',venue:'Dallas'},
      {id:'L2',j:1,day:'17 jun',home:'Ghana',away:'Panamá',venue:'Toronto'},
      {id:'L3',j:2,day:'23 jun',home:'Inglaterra',away:'Ghana',venue:'Boston'},
      {id:'L4',j:2,day:'23 jun',home:'Panamá',away:'Croacia',venue:'Toronto'},
      {id:'L5',j:3,day:'27 jun',home:'Panamá',away:'Inglaterra',venue:'Nueva York'},
      {id:'L6',j:3,day:'27 jun',home:'Croacia',away:'Ghana',venue:'Filadelfia'},
    ]},
];

const ALL_MATCHES = GROUPS.flatMap(g => g.matches);

/* ── HELPERS ── */
const COLS = ['#e8634a','#f0b429','#43c78a','#5aaddc','#a78bfa','#f472b6','#34d399','#fb923c','#60a5fa','#4ade80'];
const acolor = n => { let h=0; for(let c of n) h=(h*31+c.charCodeAt(0))%COLS.length; return COLS[Math.abs(h)]; };
const ini    = n => n.trim().charAt(0).toUpperCase();

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
    {id:'R01',day:'4 jul', home:c('A').second,away:c('B').second,venue:'Houston'},
    {id:'R02',day:'4 jul', home:c('E').first, away:bt(0),        venue:'Filadelfia'},
    {id:'R03',day:'5 jul', home:c('F').first, away:c('C').second,venue:'Nueva Jersey'},
    {id:'R04',day:'5 jul', home:c('C').first, away:c('F').second,venue:'Cd. México'},
    {id:'R05',day:'6 jul', home:c('D').first, away:bt(1),        venue:'Dallas'},
    {id:'R06',day:'6 jul', home:c('I').first, away:bt(2),        venue:'Seattle'},
    {id:'R07',day:'7 jul', home:c('A').first, away:bt(3),        venue:'Atlanta'},
    {id:'R08',day:'7 jul', home:c('L').first, away:bt(4),        venue:'Vancouver'},
    {id:'R09',day:'8 jul', home:c('G').first, away:bt(5),        venue:'Guadalajara'},
    {id:'R10',day:'8 jul', home:c('B').first, away:bt(6),        venue:'Vancouver'},
    {id:'R11',day:'8 jul', home:c('E').second,away:c('I').second,venue:'Filadelfia'},
    {id:'R12',day:'8 jul', home:c('K').second,away:c('L').second,venue:'Toronto'},
    {id:'R13',day:'9 jul', home:c('H').first, away:c('J').second,venue:'Miami'},
    {id:'R14',day:'9 jul', home:c('J').first, away:c('H').second,venue:'Los Ángeles'},
    {id:'R15',day:'9 jul', home:c('K').first, away:bt(7),        venue:'Kansas City'},
    {id:'R16',day:'9 jul', home:c('D').second,away:c('G').second,venue:'Dallas'},
  ];
  const w=(mid,arr,sc)=>{
    const m=arr.find(x=>x.id===mid); if(!m) return '?';
    const s=sc[mid]; if(!s||s.home==null||s.away==null) return `G.${mid}`;
    return +s.home>=+s.away?m.home:m.away;
  };
  const r16=[
    {id:'O1',day:'12 jul',home:w('R01',r32,scores),away:w('R02',r32,scores),venue:'Houston'},
    {id:'O2',day:'12 jul',home:w('R03',r32,scores),away:w('R04',r32,scores),venue:'Filadelfia'},
    {id:'O3',day:'13 jul',home:w('R05',r32,scores),away:w('R06',r32,scores),venue:'Dallas'},
    {id:'O4',day:'13 jul',home:w('R07',r32,scores),away:w('R08',r32,scores),venue:'Nueva Jersey'},
    {id:'O5',day:'14 jul',home:w('R09',r32,scores),away:w('R10',r32,scores),venue:'Boston'},
    {id:'O6',day:'14 jul',home:w('R11',r32,scores),away:w('R12',r32,scores),venue:'Seattle'},
    {id:'O7',day:'15 jul',home:w('R13',r32,scores),away:w('R14',r32,scores),venue:'Atlanta'},
    {id:'O8',day:'15 jul',home:w('R15',r32,scores),away:w('R16',r32,scores),venue:'Los Ángeles'},
  ];
  const qf=[
    {id:'Q1',day:'9 jul', home:w('O1',r16,scores),away:w('O2',r16,scores),venue:'Boston'},
    {id:'Q2',day:'10 jul',home:w('O3',r16,scores),away:w('O4',r16,scores),venue:'Los Ángeles'},
    {id:'Q3',day:'11 jul',home:w('O5',r16,scores),away:w('O6',r16,scores),venue:'Miami'},
    {id:'Q4',day:'11 jul',home:w('O7',r16,scores),away:w('O8',r16,scores),venue:'Kansas City'},
  ];
  const sf=[
    {id:'S1',day:'14 jul',home:w('Q1',qf,scores),away:w('Q2',qf,scores),venue:'Dallas'},
    {id:'S2',day:'15 jul',home:w('Q3',qf,scores),away:w('Q4',qf,scores),venue:'Atlanta'},
  ];
  const lo=(mid,arr,sc)=>{
    const m=arr.find(x=>x.id===mid); if(!m) return '?';
    const s=sc[mid]; if(!s||s.home==null||s.away==null) return `Per.${mid}`;
    return +s.home<+s.away?m.home:m.away;
  };
  return {
    r32, r16, qf, sf,
    third:[{id:'T1',day:'18 jul',home:lo('S1',sf,scores),away:lo('S2',sf,scores),venue:'Miami'}],
    fin:  [{id:'FIN',day:'19 jul',home:w('S1',sf,scores),away:w('S2',sf,scores),venue:'MetLife · N. Jersey'}],
  };
}

/* ── COMPONENTS ── */
function Av({n,sz=28}) {
  return <div className="av" style={{width:sz,height:sz,background:acolor(n),fontSize:sz*0.42}}>{ini(n)}</div>;
}

function Logo({size=56}) {
  const [ok,setOk]=useState(true);
  return ok
    ? <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/2026_FIFA_World_Cup_logo.svg/800px-2026_FIFA_World_Cup_logo.svg.png"
        alt="FIFA World Cup 2026" width={size} height={size} style={{objectFit:'contain'}}
        onError={()=>setOk(false)}/>
    : <span style={{fontSize:size*0.65}}>🏆</span>;
}

function PtBadge({mid,mysc,off}) {
  const r=off[mid],pr=mysc[mid];
  if(!r||r.home==null||r.away==null) return <span className="pt-b pe">?</span>;
  const v=calcPts(pr,r);
  if(v===3) return <span className="pt-b ex">3</span>;
  if(v===1) return <span className="pt-b co">1</span>;
  return <span className="pt-b wr">0</span>;
}

function ScoreCell({mid,mysc,off,onPred}) {
  const r=off[mid], sc=mysc[mid]||{home:null,away:null};
  const played=r&&r.home!=null&&r.away!=null;
  if(played) return (
    <div className="off-s">
      <span className="off-n">{r.home}</span>
      <span style={{fontSize:13,color:'#3d526e',width:10,textAlign:'center'}}>:</span>
      <span className="off-n">{r.away}</span>
    </div>
  );
  return (
    <div className="s-block">
      <input className="s-in" type="number" min="0" max="99"
        value={sc.home!=null?sc.home:''} placeholder="–"
        onChange={e=>onPred(mid,'home',e.target.value)}/>
      <span className="s-sep">:</span>
      <input className="s-in" type="number" min="0" max="99"
        value={sc.away!=null?sc.away:''} placeholder="–"
        onChange={e=>onPred(mid,'away',e.target.value)}/>
    </div>
  );
}

function MRow({m,mysc,off,onPred}) {
  const r=off[m.id]; const pl=r&&r.home!=null&&r.away!=null;
  const hc=pl?(r.home>r.away?'#43c78a':r.home===r.away?'#5aaddc':'#eef2f8'):'#eef2f8';
  const ac=pl?(r.away>r.home?'#43c78a':r.home===r.away?'#5aaddc':'#eef2f8'):'#eef2f8';
  return (
    <div className="m-row">
      <div className="m-grid">
        <div className="m-date"><span className="m-day">{m.day.split(' ')[0]}</span>{m.day.split(' ')[1]}</div>
        <div className="m-center">
          <span className="team" style={{color:hc}}>{m.home}</span>
          <ScoreCell mid={m.id} mysc={mysc} off={off} onPred={onPred}/>
          <span className="team away" style={{color:ac}}>{m.away}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:4}}>
          <PtBadge mid={m.id} mysc={mysc} off={off}/>
          {!pl&&<div className="m-venue">{m.venue}</div>}
        </div>
      </div>
    </div>
  );
}

function Standings({gid,mysc,off,isAdmin}) {
  const sc=isAdmin?off:mysc;
  const rows=calcStandings(gid,sc);
  return (
    <div className="st-wrap">
      <div className="st-hdr">
        <span>Posiciones {isAdmin?'(Reales)':'(Mis pred.)'}</span>
        <div className="st-cols">
          {['PJ','G','E','P','DG'].map(c=><span key={c} className="st-col">{c}</span>)}
          <span className="st-col pts">PTS</span>
        </div>
      </div>
      {rows.map((r,i)=>(
        <div key={r.n} className={`st-row${i<2?' q':''}`}>
          <span className={`st-pos${i<2?' q':i===2?' t':''}`}>{i+1}</span>
          <span className="st-name">{r.n}</span>
          {[r.pj,r.pg,r.pe,r.pp].map((v,k)=><span key={k} className="st-n">{v||'–'}</span>)}
          <span className="st-gd">{r.pj>0?(r.gd>=0?`+${r.gd}`:`${r.gd}`):'–'}</span>
          <span className="st-pts-v">{r.pt}</span>
        </div>
      ))}
    </div>
  );
}

function GroupCard({g,mysc,off,isAdmin,onPred}) {
  return (
    <div className="card">
      <div className="g-hdr">
        <div className="g-badge">{g.id}</div>
        <div className="g-info">
          <div className="g-lbl">Grupo {g.id}</div>
          <div className="g-teams">{g.teams.join(' · ')}</div>
        </div>
        <span style={{fontSize:22}}>{g.flag}</span>
      </div>
      {[1,2,3].map(j=>(
        <div key={j}>
          <div className="j-lbl">Jornada {j}</div>
          {g.matches.filter(m=>m.j===j).map(m=>(
            <MRow key={m.id} m={m} mysc={mysc} off={off} onPred={onPred}/>
          ))}
        </div>
      ))}
      <Standings gid={g.id} mysc={mysc} off={off} isAdmin={isAdmin}/>
    </div>
  );
}

function KOCard({m,off,isFinal=false}) {
  const r=off[m.id]; const pl=r&&r.home!=null&&r.away!=null;
  const hc=pl?(r.home>r.away?'#43c78a':r.home===r.away?'#5aaddc':'#eef2f8'):'#eef2f8';
  const ac=pl?(r.away>r.home?'#43c78a':r.home===r.away?'#5aaddc':'#eef2f8'):'#eef2f8';
  const sim=!m.home.startsWith('G.')&&!m.home.startsWith('?')&&!m.home.startsWith('1°')
    &&!m.home.startsWith('2°')&&!m.home.startsWith('Per.')&&m.home!=='?';
  return (
    <div className={`card${isFinal?' final':''}`}>
      <div className="ko-match">
        <div className="ko-row">
          <span className="ko-team" style={{color:hc}}>{m.home}</span>
          {pl
            ? <div className="off-s" style={{padding:'0 6px'}}>
                <span className="off-n">{r.home}</span>
                <span style={{fontSize:13,color:'#3d526e',width:10,textAlign:'center'}}>:</span>
                <span className="off-n">{r.away}</span>
              </div>
            : <span style={{padding:'0 8px',fontSize:13,color:'#3d526e',fontWeight:700}}>vs</span>
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

function KOSec({title,emoji,matches,off,isFinal=false}) {
  const done=matches.filter(m=>{const o=off[m.id];return o&&o.home!=null&&o.away!=null;}).length;
  return (
    <div className="ko-sec">
      <div className="ko-hdr">
        <span style={{fontSize:20}}>{emoji}</span>
        <span className={`ko-title${isFinal?' final':''}`}>{title}</span>
        <span style={{marginLeft:'auto',fontSize:11,color:'#7a91b0'}}>{done}/{matches.length} jugados</span>
      </div>
      <div className="ko-grid">
        {matches.map(m=><KOCard key={m.id} m={m} off={off} isFinal={isFinal}/>)}
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function App() {
  const [db,      setDb]      = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [user,    setUser]    = useState(()=>localStorage.getItem('pu')||null);
  const [isAdmin, setIsAdmin] = useState(()=>localStorage.getItem('pa')==='1');
  const [tab,     setTab]     = useState('grupos');
  const [gf,      setGf]      = useState('all');
  const [nameIn,  setNameIn]  = useState('');
  const [pinIn,   setPinIn]   = useState('');
  const [lmode,   setLmode]   = useState('user');
  const pollRef = useRef(null);
  const saveRef = useRef(null);

  const load = useCallback(async()=>{
    try { const d=await dbRead(); setDb(d); setError(null); }
    catch { setError('Sin conexión.'); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{
    load();
    pollRef.current=setInterval(load,15000);
    return ()=>clearInterval(pollRef.current);
  },[load]);

  const persist = useCallback((data)=>{
    if(saveRef.current) clearTimeout(saveRef.current);
    saveRef.current=setTimeout(async()=>{
      setSaving(true);
      try { await dbWrite(data); setError(null); }
      catch { setError('Error al guardar.'); }
      finally { setSaving(false); }
    },800);
  },[]);

  const join=()=>{
    const n=nameIn.trim(); if(!n) return;
    localStorage.setItem('pu',n); localStorage.setItem('pa','0');
    setUser(n); setIsAdmin(false);
    const upd=JSON.parse(JSON.stringify(db||{official:{},participants:{}}));
    if(!upd.participants[n]){upd.participants[n]={scores:{},ts:Date.now()};setDb(upd);persist(upd);}
  };

  const adminLogin=()=>{
    if(pinIn===ADMIN_PIN){
      localStorage.setItem('pu','Admin');localStorage.setItem('pa','1');
      setUser('Admin');setIsAdmin(true);setTab('admin');
    } else alert('PIN incorrecto');
  };

  const logout=()=>{
    localStorage.removeItem('pu');localStorage.removeItem('pa');
    setUser(null);setIsAdmin(false);setNameIn('');setPinIn('');setLmode('user');
  };

  const setPred=(mid,side,val)=>{
    if(!user||isAdmin||!db) return;
    const upd=JSON.parse(JSON.stringify(db));
    if(!upd.participants[user]) upd.participants[user]={scores:{},ts:Date.now()};
    if(!upd.participants[user].scores[mid]) upd.participants[user].scores[mid]={home:null,away:null};
    upd.participants[user].scores[mid][side]=val===''?null:Math.max(0,parseInt(val)||0);
    setDb(upd);persist(upd);
  };

  const setOff=(mid,side,val)=>{
    if(!isAdmin||!db) return;
    const upd=JSON.parse(JSON.stringify(db));
    if(!upd.official[mid]) upd.official[mid]={home:null,away:null};
    upd.official[mid][side]=val===''?null:Math.max(0,parseInt(val)||0);
    setDb(upd);persist(upd);
  };

  const mysc   = db&&user&&!isAdmin?db.participants?.[user]?.scores||{}:{};
  const off    = db?.official||{};
  const parts  = db?Object.entries(db.participants||{}):[];
  const played = Object.values(off).filter(s=>s.home!=null&&s.away!=null).length;
  const myTot  = totals(mysc,off);
  const predCnt= Object.values(mysc).filter(s=>s.home!=null&&s.away!=null).length;
  const bracket= calcBracket(mysc);
  const visG   = gf==='all'?GROUPS:GROUPS.filter(g=>g.id===gf);

  if(loading) return (
    <div className="loading"><div className="spinner"/>Cargando porra…</div>
  );

  if(!user) return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo"><Logo size={90}/></div>
        {lmode==='user'?(
          <>
            <div className="login-title">Porra Mundial 2026</div>
            <div className="login-sub">Predice todos los partidos, ve tu bracket y compite con tus amigos.</div>
            <div className="login-rules">
              <div className="login-rule">
                <span className="val" style={{color:'#43c78a'}}>3</span>
                <span className="lbl">Exacto</span>
              </div>
              <div className="login-rule">
                <span className="val" style={{color:'#5aaddc'}}>1</span>
                <span className="lbl">Resultado</span>
              </div>
              <div className="login-rule">
                <span className="val" style={{color:'#e05050'}}>0</span>
                <span className="lbl">Error</span>
              </div>
            </div>
            {error&&<div className="notice red" style={{marginBottom:14,textAlign:'left'}}>⚠️ {error}</div>}
            <input className="inp" placeholder="Tu nombre o apodo…"
              value={nameIn} onChange={e=>setNameIn(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&join()} maxLength={24}/>
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
            <div className="adm-link" onClick={()=>setLmode('admin')}>Soy el administrador →</div>
          </>
        ):(
          <>
            <div className="login-title">Acceso Admin</div>
            <div className="login-sub">Ingresa el PIN para registrar resultados oficiales.</div>
            <input className="inp" type="password" placeholder="PIN de administrador…"
              value={pinIn} onChange={e=>setPinIn(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&adminLogin()}/>
            <button className="btn-gold" onClick={adminLogin} disabled={!pinIn}>ENTRAR COMO ADMIN</button>
            <div className="adm-link" onClick={()=>setLmode('user')}>← Volver</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-logo"><Logo size={50}/></div>
        <div className="hdr-text">
          <div className="hdr-title">PORRA <span>MUNDIAL 2026</span></div>
          <div className="hdr-pills">
            <span className="hdr-pill">📋 {predCnt} pred.</span>
            {played>0&&<span className="hdr-pill gold">{myTot.p}pts · {myTot.ex}✓✓ · {myTot.co}✓</span>}
            {saving&&<span className="hdr-pill blue">💾 Guardando…</span>}
          </div>
        </div>
        <div className="hdr-right">
          <div className="hdr-user"><Av n={user} sz={26}/><span>{user}</span></div>
          <button className="hdr-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="tabs">
        {!isAdmin&&<button className={`tab${tab==='grupos'?' active':''}`} onClick={()=>setTab('grupos')}>📋 Grupos</button>}
        {!isAdmin&&<button className={`tab${tab==='bracket'?' active':''}`} onClick={()=>setTab('bracket')}>⚔️ Mi Bracket</button>}
        <button className={`tab${tab==='ranking'?' active':''}`} onClick={()=>setTab('ranking')}>🏆 Ranking</button>
        {isAdmin&&<button className={`tab adm${tab==='admin'?' active':''}`} onClick={()=>setTab('admin')}>⚙️ Resultados</button>}
      </div>

      <div className="main">
        {error&&<div className="notice red">⚠️ {error}</div>}

        {tab==='grupos'&&(
          <>
            <div className="notice">💡 Ingresa tus predicciones. El bracket se genera automáticamente.</div>
            <div className="gf-bar">
              {['all',...GROUPS.map(g=>g.id)].map(id=>(
                <button key={id} className={`gf-btn${gf===id?' active':''}`} onClick={()=>setGf(id)}>
                  {id==='all'?'Todos':id}
                </button>
              ))}
            </div>
            <div className="group-grid">
              {visG.map(g=><GroupCard key={g.id} g={g} mysc={mysc} off={off} isAdmin={isAdmin} onPred={setPred}/>)}
            </div>
          </>
        )}

        {tab==='bracket'&&(
          <>
            <div className="notice blue">⚡ Bracket simulado con tus predicciones. Se actualiza en tiempo real.</div>
            <KOSec title="Ronda de 32"      emoji="⚔️" matches={bracket.r32}   off={off}/>
            <KOSec title="Octavos de Final" emoji="🔥" matches={bracket.r16}   off={off}/>
            <KOSec title="Cuartos de Final" emoji="⭐" matches={bracket.qf}    off={off}/>
            <KOSec title="Semifinales"      emoji="🌟" matches={bracket.sf}    off={off}/>
            <KOSec title="Tercer Lugar"     emoji="🥉" matches={bracket.third} off={off}/>
            <KOSec title="FINAL"            emoji="🏆" matches={bracket.fin}   off={off} isFinal/>
          </>
        )}

        {tab==='ranking'&&(
          <div className="card" style={{maxWidth:700}}>
            <div className="rank-hdr">
              <h2>🏆 Tabla de la Porra</h2>
              <div style={{fontSize:12,color:'#7a91b0',marginTop:3}}>{played} partidos jugados · {parts.length} participantes</div>
              <div className="rank-legend">
                {[['#43c78a','Exacto = 3pts'],['#5aaddc','Resultado = 1pt'],['#e05050','Error = 0']].map(([clr,l])=>(
                  <div key={l} className="rl"><div className="rl-dot" style={{background:clr}}/>{l}</div>
                ))}
              </div>
            </div>
            {parts.length===0&&<div style={{padding:40,textAlign:'center',color:'#7a91b0'}}>Nadie se ha unido todavía.</div>}
            {[...parts].map(([n,d])=>({n,...totals(d.scores||{},off)}))
              .sort((a,b)=>b.p-a.p||b.ex-a.ex||b.co-a.co)
              .map(({n,p,ex,co},i)=>{
                const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1;
                const pc=i===0?'#f0b429':i===1?'#c0c0c0':i===2?'#cd7f32':'#3d526e';
                return (
                  <div key={n} className={`rank-row${n===user?' me':''}`}>
                    <span className="rank-pos" style={{color:pc}}>{medal}</span>
                    <Av n={n} sz={34}/>
                    <span className="rank-name">{n}{n===user?' (tú)':''}</span>
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

        {tab==='admin'&&isAdmin&&(
          <div style={{maxWidth:860}}>
            <div className="adm-banner">
              <h3>⚙️ Panel Admin — Resultados Oficiales</h3>
              <p>Ingresa los marcadores reales. Los puntos de todos se actualizan automáticamente.</p>
            </div>
            <div className="adm-sec">Fase de Grupos</div>
            <div className="admin-grid">
              {GROUPS.map(g=>{
                const done=g.matches.filter(m=>{const o=off[m.id];return o&&o.home!=null&&o.away!=null;}).length;
                return (
                  <div key={g.id} className="card">
                    <div className="g-hdr">
                      <div className="g-badge" style={{width:32,height:32,fontSize:17}}>{g.id}</div>
                      <span style={{fontWeight:700,fontSize:13,flex:1}}>{g.flag} Grupo {g.id}</span>
                      <span style={{fontSize:11,color:'#7a91b0'}}>{done}/{g.matches.length}</span>
                    </div>
                    {g.matches.map(m=>{
                      const o=off[m.id]||{};
                      const hv=o.home!=null?o.home:'';
                      const av=o.away!=null?o.away:'';
                      return (
                        <div key={m.id} className="adm-match">
                          <div className="adm-teams">
                            <div className="adm-h">{m.home}</div>
                            <div className="adm-a">{m.away}</div>
                          </div>
                          <div className="adm-score">
                            <input className={`adm-in${hv!==''?' set':''}`} type="number" min="0" max="99"
                              value={hv} placeholder="–" onChange={e=>setOff(m.id,'home',e.target.value)}/>
                            <span className="adm-sep">:</span>
                            <input className={`adm-in${av!==''?' set':''}`} type="number" min="0" max="99"
                              value={av} placeholder="–" onChange={e=>setOff(m.id,'away',e.target.value)}/>
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
    </div>
  );
}
