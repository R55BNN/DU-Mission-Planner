(function(){
"use strict";
function byId(id){return document.getElementById(id);}
const api=window.TerraVersePlannerComparison;
if(!api)return;
const options=byId("tv-compare-options"),empty=byId("tv-compare-empty"),note=byId("tv-compare-note");
let lastStrategies=[];
const money=n=>Number.isFinite(n)?Math.round(n).toLocaleString("en-GB"):"—";
const hours=n=>Number.isFinite(n)?api.fmtH(n):"—";
const dist=n=>Number.isFinite(n)?Math.round(n).toLocaleString("en-GB"):"—";
function total(missions){return {count:missions.length,totalCollateral:missions.reduce((s,m)=>s+(m.collateral||0),0)};}
function clear(){
 lastStrategies=[];if(options){options.hidden=true;options.replaceChildren();}
 if(empty)empty.hidden=false;if(note)note.hidden=true;
}
function stats(result){const h=result.totalTime||0;return {q:result.totalReward||0,h,k:result.totalKm||0,rate:h>0?(result.totalReward||0)/h:0};}
function build(){
 const chosen=api.getChosen(),start=byId("startPlanet")?.value||"Alioth",end=byId("endPlanet")?.value||start;
 if(!chosen.length){clear();return;}
 const rawBudget=Number(byId("timeBudget")?.value);const limited=!!byId("limitTime")?.checked&&rawBudget>0;
 const candidates=[];
 const full=api.planCollectOptimized(start,chosen);
 if(full&&Array.isArray(full.route)){
  const result=limited?api.applyTimeBudget(full,start,end,rawBudget,true,true):api.appendReturnLeg(full,start,end);
  candidates.push({title:"All selected missions",detail:"Complete planned route",result,missions:chosen,selected:!!byId("runAllMissions")?.checked});
 }
 const subset=api.bestSubsetByQph(start,chosen);
 if(subset&&Array.isArray(subset.route)){
  const used=subset.missionsUsed||chosen;
  const result=limited?api.applyTimeBudget(subset,start,end,rawBudget,true,true):api.appendReturnLeg(subset,start,end);
  candidates.push({title:"Best subset by q/hr",detail:used.length+" of "+chosen.length+" selected missions",result,missions:used,selected:false});
 }
 lastStrategies=candidates;
 if(!options)return;
 options.replaceChildren();
 candidates.forEach((entry,index)=>{
  const s=stats(entry.result);
  const card=document.createElement("article");card.className="tv-compare-card";
  const heading=document.createElement("div");heading.className="tv-compare-label";heading.textContent=entry.title;card.appendChild(heading);
  const sub=document.createElement("div");sub.className="tv-compare-sub";sub.textContent=entry.detail;card.appendChild(sub);
  const values=[["Total reward",money(s.q)+" q"],["Effective q/hr",money(s.rate)],["Flight time",hours(s.h)],["Travel distance",dist(s.k)+" km"]];
  const grid=document.createElement("div");grid.className="tv-compare-stats";
  values.forEach(([label,value])=>{const item=document.createElement("div");item.className="tv-compare-stat";const small=document.createElement("span");small.textContent=label;const strong=document.createElement("strong");strong.textContent=value;item.append(small,strong);grid.appendChild(item);});
  card.appendChild(grid);
  const button=document.createElement("button");button.type="button";button.className="ghost";button.textContent="View this route";
  button.addEventListener("click",()=>{
    api.renderPlan(entry.result,total(entry.missions),end,limited?rawBudget:0,limited,entry.title);
    document.querySelectorAll(".tv-compare-card").forEach(c=>c.classList.remove("active"));
    card.classList.add("active");
  });card.appendChild(button);
  options.appendChild(card);
 });
 options.hidden=false;if(empty)empty.hidden=true;if(note)note.hidden=false;
}
byId("planQph")?.addEventListener("click",()=>{if(api.getChosen().length)build();else clear();});
byId("clearRoute")?.addEventListener("click",clear);
byId("clearSelection")?.addEventListener("click",clear);
byId("selectAll")?.addEventListener("click",clear);
for(const id of ["timeBudget","limitTime","startPlanet","endPlanet","shipCapVol"]){byId(id)?.addEventListener("change",clear);}
clear();
})();