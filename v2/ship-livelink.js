(function(){
"use strict";
const $=id=>document.getElementById(id);
const KEY="terraverse:v2:ship-profiles";
const CURRENT="terraverse:v2:active-ship";
let profiles=[];
let ws=null,lastSeen=0,refreshInterval=null;
function notify(message){const el=$("tv-ship-message");if(el)el.textContent=message;}
function load(){
 try{const data=JSON.parse(localStorage.getItem(KEY)||"[]");profiles=Array.isArray(data)?data.filter(p=>p&&typeof p.name==="string"&&Number.isFinite(Number(p.capacity))&&Number.isFinite(Number(p.speed))):[];}
 catch(e){profiles=[];notify("Browser storage was unavailable or corrupted; using manual settings.");}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(profiles));return true;}catch(e){notify("Could not save: browser storage is unavailable.");return false;}}
function selected(){return $("tv-ship-select")?.value||"";}
function options(){
 const select=$("tv-ship-select");if(!select)return;
 const old=selected();select.replaceChildren();
 const empty=document.createElement("option");empty.value="";empty.textContent="Manual settings";select.appendChild(empty);
 for(const p of profiles){const option=document.createElement("option");option.value=p.id;option.textContent=p.name;select.appendChild(option);}
 if([...select.options].some(x=>x.value===old))select.value=old;
}
function resetRoute(){
 const clear=$("clearRoute");if(clear)clear.click();
 const input=$("tv-ship-speed");if(input)input.dispatchEvent(new Event("change",{bubbles:true}));
}
function apply(){
 const p=profiles.find(x=>x.id===selected());
 if(!p){notify("Manual settings active. Change the capacity and planning speed as needed.");return;}
 $("tv-ship-name").value=p.name;
 $("shipCapVol").value=p.capacity;
 $("tv-ship-speed").value=p.speed;
 try{localStorage.setItem(CURRENT,p.id);}catch(e){}
 resetRoute();
 notify("Loaded "+p.name+". Re-plan to update travel times.");
}
function validate(){
 const name=$("tv-ship-name").value.trim(),capacity=Number($("shipCapVol").value),speed=Number($("tv-ship-speed").value);
 if(!name||name.length>64){notify("Enter a ship name (up to 64 characters).");return null;}
 if(!Number.isFinite(capacity)||capacity<=0||capacity>100000000){notify("Enter a valid cargo capacity greater than zero (kL).");return null;}
 if(!Number.isFinite(speed)||speed<=0||speed>200000){notify("Enter a planning speed between 1 and 200,000 km/h.");return null;}
 return {name,capacity,speed};
}
function persistProfile(){
 const value=validate();if(!value)return;
 const id=selected()||("ship-"+Date.now()+"-"+Math.floor(Math.random()*1e5));
 const existing=profiles.findIndex(x=>x.id===id);
 if(existing>=0)profiles[existing]={id,...value};else profiles.push({id,...value});
 if(!save())return;
 options();$("tv-ship-select").value=id;
 try{localStorage.setItem(CURRENT,id);}catch(e){}
 notify((existing>=0?"Updated ":"Saved ")+value.name+".");
 resetRoute();
}
function newProfile(){
 $("tv-ship-select").value="";$("tv-ship-name").value="";
 $("tv-ship-speed").value="50000";$("shipCapVol").value="";
 try{localStorage.removeItem(CURRENT);}catch(e){}
 resetRoute();notify("New ship: enter its name and capacity, then Save / Update.");
}
function deleteProfile(){
 const id=selected();if(!id){notify("Select a saved ship before deleting.");return;}
 const name=profiles.find(x=>x.id===id)?.name||"Ship";
 profiles=profiles.filter(x=>x.id!==id);if(!save())return;
 options();newProfile();notify("Deleted "+name+".");
}
function liveStatus(state,detail){
 $("tv-live-status").textContent=state;
 $("tv-live-note").textContent=detail;
 $("tv-live-indicator").classList.toggle("connected",state==="Connected");
 $("tv-live-indicator").classList.toggle("stale",state==="Stale");
}
function receive(raw){
 let payload;try{payload=JSON.parse(typeof raw==="string"?raw:String(raw));}catch(e){liveStatus("Invalid data","Message was not valid JSON.");return;}
 if(!payload||typeof payload!=="object"||Array.isArray(payload))return;
 const data=payload.telemetry&&typeof payload.telemetry==="object"?payload.telemetry:payload;
 const get=(...keys)=>{for(const key of keys)if(data[key]!==undefined&&data[key]!==null)return data[key];return null;};
 const name=get("shipName","ship","name"),spd=get("speedKmh","speed_kmh","speed"),alt=get("altitudeM","altitude_m","altitude"),dest=get("destination","targetName","target");
 if(name!==null)$("tv-live-ship").textContent=String(name).slice(0,80);
 if(Number.isFinite(Number(spd))&&spd!==null)$("tv-live-speed").textContent=Math.round(Number(spd)).toLocaleString()+" km/h";
 if(Number.isFinite(Number(alt))&&alt!==null)$("tv-live-alt").textContent=Math.round(Number(alt)).toLocaleString()+" m";
 if(dest!==null)$("tv-live-dest").textContent=String(dest).slice(0,80);
 lastSeen=Date.now();liveStatus("Connected","Telemetry received. This is a generic JSON adapter; field mapping may require updating for the TerraVerse companion.");
 $("tv-live-age").textContent="Updated just now";
}
function disconnect(){
 if(ws){const old=ws;ws=null;old.onclose=null;old.onerror=null;old.onmessage=null;try{old.close();}catch(e){}}
 lastSeen=0;liveStatus("Offline","Disconnected. Planner and saved ship profiles remain available offline.");
 $("tv-live-age").textContent="No active connection";
}
function connect(){
 const url=$("tv-live-url").value.trim();
 if(!/^wss:\/\//i.test(url)){liveStatus("Offline","Use a secure wss:// WebSocket endpoint. The existing local companion may need a secure bridge.");return;}
 try{
  disconnect();liveStatus("Connecting","Attempting secure WebSocket connection…");
  const socket=new WebSocket(url);ws=socket;
  socket.onopen=()=>{if(ws===socket)liveStatus("Waiting for data","Socket open; waiting for compatible JSON telemetry.");};
  socket.onmessage=e=>{if(ws===socket&&typeof e.data==="string")receive(e.data);};
  socket.onerror=()=>{if(ws===socket)liveStatus("Error","Connection failed. Check that your secure telemetry bridge is running and reachable.");};
  socket.onclose=()=>{if(ws===socket){ws=null;liveStatus("Offline","Connection closed. Data shown may be stale.");}};
 }catch(e){liveStatus("Error","Could not open the WebSocket address.");}
}
function init(){
 load();options();
 $("tv-ship-select")?.addEventListener("change",apply);
 $("tv-ship-save")?.addEventListener("click",persistProfile);
 $("tv-ship-new")?.addEventListener("click",newProfile);
 $("tv-ship-delete")?.addEventListener("click",deleteProfile);
 const current=(()=>{try{return localStorage.getItem(CURRENT);}catch(e){return null;}})();
 if(current&&profiles.some(p=>p.id===current)){$("tv-ship-select").value=current;apply();}
 $("tv-live-connect")?.addEventListener("click",connect);
 $("tv-live-disconnect")?.addEventListener("click",disconnect);
 refreshInterval=setInterval(()=>{
  if(lastSeen){const sec=Math.floor((Date.now()-lastSeen)/1000);
   $("tv-live-age").textContent="Last update "+sec+"s ago";
   if(sec>10&&ws)liveStatus("Stale","No fresh telemetry for more than ten seconds.");
  }
 },1000);
 window.addEventListener("pagehide",()=>{if(refreshInterval)clearInterval(refreshInterval);disconnect();});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
