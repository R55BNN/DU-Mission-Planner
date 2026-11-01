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
let svg,routeLayer,baseLayer;
function node(tag,attributes,parent){const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attributes||{})) n.setAttribute(k,String(v));(parent||svg).appendChild(n);return n;}
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
  // Fixed map: selecting a leg only highlights its position.

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
const arrow=node("marker",{id:"tv-route-arrow",viewBox:"0 0 12 12",refX:10,refY:6,markerWidth:8,markerHeight:8,orient:"auto",markerUnits:"userSpaceOnUse"},defs);
node("path",{d:"M1 1L11 6L1 11Z",fill:"#ffc38b"},arrow);
const grid=node("pattern",{id:"tv-map-grid",width:235,height:235,patternUnits:"userSpaceOnUse"},defs);
node("path",{d:"M235 0H0V235",fill:"none",stroke:"#6889a0","stroke-opacity":".13"},grid);
const planet=node("radialGradient",{id:"tv-planet-core",cx:"28%",cy:"24%",r:"78%"},defs);
for(const [offset,color] of [["0%","#d2efff"],["32%","#639bc9"],["70%","#244c72"],["100%","#081d36"]])node("stop",{offset,"stop-color":color},planet);
const haze=node("radialGradient",{id:"tv-stellar-haze"},defs);
node("stop",{offset:"0%","stop-color":"#458c99","stop-opacity":".22"},haze);
node("stop",{offset:"65%","stop-color":"#294b6a","stop-opacity":".10"},haze);
node("stop",{offset:"100%","stop-color":"#09101c","stop-opacity":"0"},haze);
const vignette=node("radialGradient",{id:"tv-map-vignette",cx:"50%",cy:"49%",r:"70%"},defs);
node("stop",{offset:"45%","stop-color":"#06101a","stop-opacity":"0"},vignette);
node("stop",{offset:"100%","stop-color":"#00040a","stop-opacity":".75"},vignette);
baseLayer=node("g",{class:"tv-map-background"});
node("rect",{width:1569,height:959,fill:"#030b14"},baseLayer);
node("ellipse",{cx:390,cy:660,rx:650,ry:560,fill:"url(#tv-stellar-haze)"},baseLayer);
node("ellipse",{cx:1140,cy:180,rx:560,ry:420,fill:"url(#tv-stellar-haze)",opacity:".8"},baseLayer);
const dust=node("g",{opacity:".78"},baseLayer);
for(let i=0;i<1850;i++){
 let x=(i*263.791+73)%1569,y=(i*149.377+31)%959;
 if(i<690){x=(i*137.17+23)%1569;y=(.57*x+167+Math.sin(i*17.13)*92+959)%959;}
 const rare=i%57===0,r=rare?1.65:i%11===0?1.05:.43;
 node("circle",{cx:x,cy:y,r,fill:i%17===0?"#e3ab7a":i%9===0?"#7fb6e9":"#d2e0ef",opacity:rare?.9:i%8===0?.67:.27},dust);
}
node("rect",{width:1569,height:959,fill:"url(#tv-map-grid)"},baseLayer);
node("rect",{width:1569,height:959,fill:"url(#tv-map-vignette)"},baseLayer);
node("path",{d:"M0 480H1569 M784 0V959",fill:"none",stroke:"#7a9bb0","stroke-opacity":".09","stroke-dasharray":"3 12"},baseLayer);
routeLayer=node("g",{class:"tv-route-layer"});
const markerLayer=node("g");
for(const [name,p] of Object.entries(layout)){
const group=node("g",{class:"tv-body","data-name":name,role:"button",tabindex:0,"aria-label":name},markerLayer);
node("circle",{cx:p[0],cy:p[1],r:17,class:"tv-marker-halo"},group);
node("circle",{cx:p[0],cy:p[1],r:11.5,fill:"url(#tv-planet-core)",stroke:"#a1cee8","stroke-width":1.2},group);
node("path",{d:"M "+(p[0]-12)+" "+(p[1]+4)+" Q "+p[0]+" "+(p[1]+11)+" "+(p[0]+12)+" "+(p[1]+4),fill:"none",stroke:"#83b7d9","stroke-opacity":".65","stroke-width":"1"},group);
const positions={"Thades":[-12,33],"Madis":[15,42],"Alioth":[15,32],"Symeon":[-27,32],"Ion":[25,34],"Sicari":[-5,30],"Sinnen":[23,35]};
const off=positions[name]||[0,34];const label=node("text",{x:p[0]+off[0],y:p[1]+off[1],"text-anchor":"middle"},group);label.textContent=name.toUpperCase();
node("title",{},group).textContent=name;
group.addEventListener("click",()=>{const select=document.getElementById("startPlanet");if(select&&[...select.options].some(o=>o.value===name)){select.value=name;select.dispatchEvent(new Event("change",{bubbles:true}));}const status=document.getElementById("tv-map-status");if(status)status.textContent=name+" · atlas centre "+world[name].map(Math.round).join(", ")+" m";});
group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();group.dispatchEvent(new Event("click"));}});
markers[name]=group;
}
clear();
}
window.TerraVerseSystemMap={plot,clear,planetNames:Object.keys(layout),worldCoordinates:world};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();