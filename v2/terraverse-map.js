(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const layout={
"Sicari":[321,77],"Sinnen":[382,147],"Teoma":[72,463],"Lacobus":[341,357],
"Thades":[549,418],"Madis":[572,446],"Alioth":[739,422],"Talemai":[645,567],
"Symeon":[821,330],"Ion":[879,327],"Feli":[963,829],"Jago":[1453,569]};
const world={
"Madis":[17465536,22665536,-34464],"Alioth":[-8,-8,-126303],"Thades":[29165536,10865536,65536],
"Talemai":[-13234464,55765536,465536],"Sicari":[52765536,27165536,52065536],
"Sinnen":[52718347.17,26962117.31,51830774.69],"Teoma":[80865536,54665536,-934464],
"Jago":[-94134464,12765536,-3634464],"Feli":[-43534464,22565536,-48934464],
"Ion":[2865536,-99034464,-934464],"Symeon":[14165536,-85634464,-934464],
"Lacobus":[98865536,-13534464,-934464]};
const markers={};
let svg,routeLayer,baseLayer,view={x:0,y:0,w:1569,h:959};
function node(tag,attributes,parent){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attributes||{})) n.setAttribute(k,String(v));(parent||svg).appendChild(n);return n;}
function updateView(){svg.setAttribute("viewBox",[view.x,view.y,view.w,view.h].join(" "));}
function zoom(factor){const x=view.x+view.w/2,y=view.y+view.h/2;view.w=Math.max(160,Math.min(4707,view.w*factor));view.h=view.w*959/1569;view.x=x-view.w/2;view.y=y-view.h/2;updateView();}
let currentSegments=[];
function legList(){return document.getElementById("tv-journey-legs");}
function setActiveLeg(index,focus=false){
  currentSegments.forEach((entry,i)=>{
    entry.path.classList.toggle("tv-leg-active",index===i);
    entry.badge.classList.toggle("tv-leg-active",index===i);
    entry.row?.classList.toggle("tv-leg-active",index===i);
    entry.path.classList.toggle("tv-leg-muted",index!==i);
  });
  if(index<0){currentSegments.forEach(e=>e.path.classList.remove("tv-leg-muted"));return;}
  const e=currentSegments[index];if(!e)return;
  if(focus){
    const [ax,ay]=layout[e.leg.from], [bx,by]=layout[e.leg.to];
    view.x=(ax+bx)/2-view.w/2;view.y=(ay+by)/2-view.h/2;updateView();
  }
}
function clear(){
 currentSegments=[];if(routeLayer)routeLayer.replaceChildren();
 Object.values(markers).forEach(m=>m.classList.remove("on-route"));
 const list=legList();if(list){list.replaceChildren();list.hidden=true;}
 const status=document.getElementById("tv-map-status");if(status)status.textContent="Select missions and plan a route to display it here.";
}
function plot(result){
 clear();if(!routeLayer||!result||!Array.isArray(result.route))return;
 const travel=result.route.filter(l=>l.from&&l.to&&l.from!==l.to&&layout[l.from]&&layout[l.to]);
 const visit=new Set(),pairCount=new Map(),list=legList();
 if(list)list.hidden=travel.length===0;
 travel.forEach((leg,index)=>{
  const a=layout[leg.from],b=layout[leg.to];
  const canonical=[leg.from,leg.to].sort().join("|");
  const pass=pairCount.get(canonical)||0;pairCount.set(canonical,pass+1);
  const dx=b[0]-a[0],dy=b[1]-a[1],distance=Math.hypot(dx,dy)||1;
  const canonicalDirection=leg.from<leg.to?1:-1;
  const offset=pass===0?0:(Math.ceil(pass/2)*30*(pass%2===1?1:-1));
  const nx=-dy/distance,ny=dx/distance;
  const mx=(a[0]+b[0])/2+nx*offset*canonicalDirection;
  const my=(a[1]+b[1])/2+ny*offset*canonicalDirection;
  // Shorten both ends so arrows land just outside the planet symbols.
  const inset=Math.min(17,distance*.19);
  const sx=a[0]+dx/distance*inset,sy=a[1]+dy/distance*inset;
  const ex=b[0]-dx/distance*inset,ey=b[1]-dy/distance*inset;
  const d="M "+sx+" "+sy+" Q "+(2*mx-(sx+ex)/2)+" "+(2*my-(sy+ey)/2)+" "+ex+" "+ey;
  const path=node("path",{d,class:"tv-leg-path","marker-end":"url(#tv-route-arrow)","data-leg":index},routeLayer);
  node("title",{},path).textContent="Leg "+(index+1)+": "+leg.from+" to "+leg.to;
  const badge=node("g",{class:"tv-leg-badge","data-leg":index},routeLayer);
  const labelX=mx,labelY=my;
  node("circle",{cx:labelX,cy:labelY,r:16},badge);
  const number=node("text",{x:labelX,y:labelY+5,"text-anchor":"middle"},badge);number.textContent=index+1;
  let row=null;
  if(list){
   row=document.createElement("button");row.type="button";row.className="tv-journey-step";
   const num=document.createElement("span");num.className="tv-journey-step-number";num.textContent=String(index+1).padStart(2,"0");
   const desc=document.createElement("span");desc.className="tv-journey-step-route";desc.textContent=leg.from+" → "+leg.to;
   const detail=document.createElement("span");detail.className="tv-journey-step-meta";
   const kind=leg.type==="return"?"Return":leg.type==="deadhead"?"Positioning":leg.type==="deliver"?"Delivery":leg.type==="pickup"?"Pickup":"Travel";
   const km=Number.isFinite(leg.km)?Math.round(leg.km).toLocaleString("en-GB")+" km":"";
   detail.textContent=[kind,km].filter(Boolean).join(" · ");
   row.append(num,desc,detail);list.appendChild(row);
   row.addEventListener("click",()=>setActiveLeg(index,true));
   row.addEventListener("mouseenter",()=>setActiveLeg(index,false));
   row.addEventListener("mouseleave",()=>setActiveLeg(-1,false));
   row.addEventListener("focus",()=>setActiveLeg(index,false));
   row.addEventListener("blur",()=>setActiveLeg(-1,false));
  }
  path.addEventListener("click",()=>setActiveLeg(index,false));
  badge.addEventListener("click",()=>setActiveLeg(index,false));
  currentSegments.push({path,badge,row,leg});
  visit.add(leg.from);visit.add(leg.to);
 });
 for(const name of visit)markers[name]?.classList.add("on-route");
 const status=document.getElementById("tv-map-status");
 if(status)status.textContent=travel.length?travel.length+" numbered travel legs in journey order · Select a leg below to highlight it.":"No interplanetary travel legs in this plan.";
}
function init(){
svg=document.getElementById("tv-system-map");if(!svg)return;
const defs=node("defs");
const arrow=node("marker",{id:"tv-route-arrow",viewBox:"0 0 12 12",refX:10,refY:6,markerWidth:7,markerHeight:7,orient:"auto",markerUnits:"userSpaceOnUse"},defs);
node("path",{d:"M 1 1 L 11 6 L 1 11 Z",fill:"#ffbd72"},arrow);
const pat=node("pattern",{id:"tv-map-grid",width:214,height:214,patternUnits:"userSpaceOnUse"},defs);
node("path",{d:"M214 0H0V214",fill:"none",stroke:"#7799b3","stroke-opacity":".2","stroke-width":1},pat);
const grad=node("radialGradient",{id:"tv-planet-core",cx:"32%",cy:"30%",r:"75%"},defs);
node("stop",{offset:"0%", "stop-color":"#d2f2ff"},grad);node("stop",{offset:"45%","stop-color":"#60a9de"},grad);node("stop",{offset:"100%","stop-color":"#15354f"},grad);
baseLayer=node("g");node("rect",{width:1569,height:959,fill:"url(#tv-map-grid)"},baseLayer);
for(let i=0;i<470;i++){const x=((i*137.51+31)%1569),y=((i*91.37+37)%959);node("circle",{cx:x,cy:y,r:i%13===0?1.15:.47,fill:i%6===0?"#9bb8ed":"#b4d1dc",opacity:i%7===0?.73:.38},baseLayer);}
routeLayer=node("g",{class:"tv-route-layer"});
const markerLayer=node("g");
for(const [name,p] of Object.entries(layout)){
const group=node("g",{class:"tv-body","data-name":name,role:"button",tabindex:0,"aria-label":name},markerLayer);
node("circle",{cx:p[0],cy:p[1],r:12,class:"tv-marker-halo"},group);
node("circle",{cx:p[0],cy:p[1],r:6.5,fill:"url(#tv-planet-core)",stroke:"#b8e4fb","stroke-width":1.1},group);
const positions={"Thades":[-12,33],"Madis":[15,42],"Alioth":[15,32],"Symeon":[-27,32],"Ion":[25,34],"Sicari":[-5,30],"Sinnen":[23,35]};
const off=positions[name]||[0,34];const label=node("text",{x:p[0]+off[0],y:p[1]+off[1],"text-anchor":"middle"},group);label.textContent=name.toUpperCase();
node("title",{},group).textContent=name;
group.addEventListener("click",()=>{const select=document.getElementById("startPlanet");if(select&&[...select.options].some(o=>o.value===name)){select.value=name;select.dispatchEvent(new Event("change",{bubbles:true}));}const status=document.getElementById("tv-map-status");if(status)status.textContent=name+" · atlas centre "+world[name].map(Math.round).join(", ")+" m";});
group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();group.dispatchEvent(new Event("click"));}});
markers[name]=group;
}
document.getElementById("tv-map-zoom-in")?.addEventListener("click",()=>zoom(.8));
document.getElementById("tv-map-zoom-out")?.addEventListener("click",()=>zoom(1.25));
document.getElementById("tv-map-reset")?.addEventListener("click",()=>{view={x:0,y:0,w:1569,h:959};updateView();});
svg.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY>0?1.12:.89);},{passive:false});
let drag=null;
svg.addEventListener("pointerdown",e=>{if(e.target.closest(".tv-body"))return;drag={x:e.clientX,y:e.clientY,ox:view.x,oy:view.y};svg.setPointerCapture(e.pointerId);});
svg.addEventListener("pointermove",e=>{if(!drag)return;const b=svg.getBoundingClientRect();view.x=drag.ox-(e.clientX-drag.x)*view.w/b.width;view.y=drag.oy-(e.clientY-drag.y)*view.h/b.height;updateView();});
svg.addEventListener("pointerup",()=>drag=null);svg.addEventListener("pointercancel",()=>drag=null);
clear();
}
window.TerraVerseSystemMap={plot,clear,planetNames:Object.keys(layout),worldCoordinates:world};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();