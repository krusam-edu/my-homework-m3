'use strict';
// Educational SVG renderer: value plugs/sockets, statement notches and C-shaped bodies.
// Layout is intentionally expanded for reading; names and connections follow MIT reference.
const palette={variables:'#d05f2d',lists:'#49a6d4',text:'#b32d5e',math:'#3f71b5',logic:'#77ab41',control:'#b18e35',procedures:'#7c5385',get:'#439970',set:'#266643'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const width=s=>Math.max(55,Array.from(s).reduce((n,c)=>n+(/[\u0e00-\u0e7f]/.test(c)?10:7.8),0)+26);
function layout(n){
 const rows=(n.inputs||[]).map(([label,node])=>({label,child:layout(node)}));
 const own=Math.max(width(n.label),...rows.map(r=>width(r.label)))+12;
 let y=32; for(const r of rows){r.y=y;r.x=own;y+=r.child.h+8;}
 const bodies=(n.bodies||[]).map(([label,nodes])=>({label,nodes:nodes.map(layout)}));
 let w=Math.max(own,...rows.map(r=>own+r.child.w));
 for(const b of bodies){b.labelY=y+18;y+=28;b.y=y;for(const c of b.nodes){c.y=y;y+=c.h;w=Math.max(w,32+c.w);}y+=18;b.end=y;}
 return {n,rows,bodies,own,w:Math.max(w,170),h:Math.max(y,36)};
}
const text=(x,y,s)=>'<text x="'+x+'" y="'+y+'">'+esc(s)+'</text>';
function draw(a,x,y){
 const {n,w,h,rows,bodies,own}=a;let d='M0 0 ';
 d+=n.kind==='statement'?'H20 l6 6 h12 l6 -6 ':'';
 d+='H'+w;
 let cursor=0;
 for(const r of rows){const cy=r.y+18;d+=' V'+(cy-6)+' H'+own+' c-8 0 -8 12 0 12 H'+w;cursor=cy+6;}
 for(const b of bodies){d+=' V'+b.y+' H76 l-6 6 H58 l-6 -6 H32 V'+(b.end-12)+' H52 l6 6 h12 l6 -6 H'+w;}
 d+=' V'+h;
 d+=n.kind==='statement'?' H44 l-6 6 H26 l-6 -6':'';
 d+=' H0';
 if(n.kind==='value')d+=' V18 c-8 0 -8 -12 0 -12';
 d+=' Z';
 let s='<g transform="translate('+x+' '+y+')"><path d="'+d+'" fill="'+palette[n.cat]+'" stroke="#000" stroke-opacity=".23" stroke-width="1"/>'+text(12,22,n.label);
 for(const r of rows){s+=text(12,r.y+23,r.label)+draw(r.child,own,r.y+6);}
 for(const b of bodies){s+=text(12,b.labelY,b.label);for(const c of b.nodes)s+=draw(c,32,c.y);}
 return s+'</g>';
}
function svg(guide,index){
 const nodes=guide.blocks.map(layout);let y=16,w=0,out='';
 for(const n of nodes){out+=draw(n,24,y);y+=n.h+28;w=Math.max(w,n.w+48);}
 return '<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+y+'" viewBox="0 0 '+w+' '+y+'" role="img" aria-labelledby="title desc"><title id="title">'+esc(guide.title)+'</title><desc id="desc">'+esc(guide.steps.join(' '))+'</desc><style>text{font-family:Arial,Tahoma,sans-serif;font-size:14px;fill:white}svg{background:#f5f7fa}</style>'+out+'</svg>';
}
module.exports={svg,layout};
