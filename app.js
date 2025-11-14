// DU Mission Runner — Best q/hr (baked only) + explicit pickup/deliver cargo + volume capacity warning
const PLANETS = ["Alioth","Thades","Madis","Talemai","Teoma","Sinnen","Sicari","Jago"];
const distances = {"Alioth":{"Alioth":0.0,"Thades":155.6,"Madis":143.1,"Talemai":286.6,"Teoma":488.1,"Sinnen":393.88,"Sicari":394.9,"Jago":475.3},"Thades":{"Alioth":155.6,"Thades":0.0,"Madis":83.1,"Talemai":308.8,"Teoma":338.8,"Sinnen":295.53,"Sicari":296.9,"Jago":616.9},"Madis":{"Alioth":143.1,"Thades":83.1,"Madis":0.0,"Talemai":225.7,"Teoma":355.1,"Sinnen":314.29,"Sicari":315.5,"Jago":560.5},"Talemai":{"Alioth":286.6,"Thades":308.8,"Madis":225.7,"Talemai":0.0,"Teoma":470.6,"Sinnen":442.09,"Sicari":442.6,"Jago":458.5},"Teoma":{"Alioth":488.1,"Thades":338.8,"Madis":355.1,"Talemai":470.6,"Teoma":0.0,"Sinnen":329.54,"Sicari":330.0,"Jago":899.8},"Sinnen":{"Alioth":393.88,"Thades":295.53,"Madis":314.29,"Talemai":442.09,"Teoma":329.54,"Sinnen":0.0,"Sicari":1.57,"Jago":788.09},"Sicari":{"Alioth":394.9,"Thades":296.9,"Madis":315.5,"Talemai":442.6,"Teoma":330.0,"Sinnen":1.57,"Jago":788.8},"Jago":{"Alioth":475.3,"Thades":616.9,"Madis":560.5,"Talemai":458.5,"Teoma":899.8,"Sinnen":788.09,"Sicari":788.8,"Jago":0.0}};;
const BAKED_MISSIONS = [{"name": "Madis Core Samples", "pickupPlanet": "Madis", "dropPlanet": "Alioth", "reward": 900000.0, "collateral": 180000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "High Temperature Rock", "pickupPlanet": "Madis", "dropPlanet": "Thades", "reward": 670000.0, "collateral": 134000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Vanadium Shipment", "pickupPlanet": "Madis", "dropPlanet": "Sicari", "reward": 6000000.0, "collateral": 1200000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Advanced Agile Railgun Shipment", "pickupPlanet": "Madis", "dropPlanet": "Alioth", "reward": 2000000.0, "collateral": 400000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Kergon-X1 fuel Shipment", "pickupPlanet": "Madis", "dropPlanet": "Thades", "reward": 1800000.0, "collateral": 360000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Carbon Scrap Shipment", "pickupPlanet": "Madis", "dropPlanet": "Teoma", "reward": 3800000.0, "collateral": 760000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Glass Panel Shipment", "pickupPlanet": "Madis", "dropPlanet": "Jago", "reward": 5500000.0, "collateral": 1100000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Concrete Shipment", "pickupPlanet": "Madis", "dropPlanet": "Teoma", "reward": 6400000.0, "collateral": 1280000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Iron Shipment", "pickupPlanet": "Madis", "dropPlanet": "Jago", "reward": 8100000.0, "collateral": 1620000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Anti-Gravity Generator L", "pickupPlanet": "Madis", "dropPlanet": "Talemai", "reward": 2700000.0, "collateral": 540000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Nickel Scrap Shipment", "pickupPlanet": "Madis", "dropPlanet": "Sicari", "reward": 3500000.0, "collateral": 700000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Radar equipment", "pickupPlanet": "Alioth", "dropPlanet": "Thades", "reward": 950000.0, "collateral": 190000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Computer Parts", "pickupPlanet": "Alioth", "dropPlanet": "Madis", "reward": 900000.0, "collateral": 180000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Glossy Carbon Shipment", "pickupPlanet": "Alioth", "dropPlanet": "Thades", "reward": 2100000.0, "collateral": 420000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Firework Fireball Blue Shipment ", "pickupPlanet": "Alioth", "dropPlanet": "Madis", "reward": 2000000.0, "collateral": 400000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Sliding Door Shipment", "pickupPlanet": "Alioth", "dropPlanet": "Teoma", "reward": 4900000.0, "collateral": 980000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Black Pattern Wood Shipment", "pickupPlanet": "Alioth", "dropPlanet": "Jago", "reward": 4800000.0, "collateral": 960000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Stained Gray Pattern Wood Shipment", "pickupPlanet": "Alioth", "dropPlanet": "Teoma", "reward": 7500000.0, "collateral": 1500000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Glossy Dark Purple Plastic Shipment", "pickupPlanet": "Alioth", "dropPlanet": "Jago", "reward": 7400000.0, "collateral": 1480000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Advanced Reinforced Frame L", "pickupPlanet": "Alioth", "dropPlanet": "Talemai", "reward": 3200000.0, "collateral": 640000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Warp Cell Delivery", "pickupPlanet": "Alioth", "dropPlanet": "Sinnen", "reward": 4100000.0, "collateral": 820000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Industry Unit Parts", "pickupPlanet": "Thades", "dropPlanet": "Alioth", "reward": 950000.0, "collateral": 190000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "IDEA Furniture", "pickupPlanet": "Thades", "dropPlanet": "Madis", "reward": 670000.0, "collateral": 134000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "XS Gas Cylinder Shipment", "pickupPlanet": "Thades", "dropPlanet": "Alioth", "reward": 2100000.0, "collateral": 420000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Screws Shipment", "pickupPlanet": "Thades", "dropPlanet": "Madis", "reward": 1800000.0, "collateral": 360000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Blue Pattern Marble Shipment", "pickupPlanet": "Thades", "dropPlanet": "Teoma", "reward": 3700000.0, "collateral": 740000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Magnets Shipment", "pickupPlanet": "Thades", "dropPlanet": "Jago", "reward": 6000000.0, "collateral": 1200000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Power Systems Shipment", "pickupPlanet": "Thades", "dropPlanet": "Teoma", "reward": 6200000.0, "collateral": 1240000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "XS Screen Shipment", "pickupPlanet": "Thades", "dropPlanet": "Jago", "reward": 8600000.0, "collateral": 1720000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Uncommon Ore Scanner L ", "pickupPlanet": "Thades", "dropPlanet": "Talemai", "reward": 3400000.0, "collateral": 680000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Laser Thermic Ammo", "pickupPlanet": "Thades", "dropPlanet": "Sicari", "reward": 5900000.0, "collateral": 1180000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Fluorine Shipment", "pickupPlanet": "Talemai", "dropPlanet": "Jago", "reward": 4700000.0, "collateral": 940000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Anti-Gravity Parts", "pickupPlanet": "Talemai", "dropPlanet": "Madis", "reward": 5300000.0, "collateral": 1060000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Retro-Rockets Brake M", "pickupPlanet": "Talemai", "dropPlanet": "Alioth", "reward": 3200000.0, "collateral": 640000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Catalyst 4", "pickupPlanet": "Talemai", "dropPlanet": "Thades", "reward": 3400000.0, "collateral": 680000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Metal Throne S", "pickupPlanet": "Talemai", "dropPlanet": "Teoma", "reward": 4800000.0, "collateral": 960000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Spaceship Hologram L", "pickupPlanet": "Talemai", "dropPlanet": "Alioth", "reward": 5800000.0, "collateral": 1160000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Territory Scanner", "pickupPlanet": "Talemai", "dropPlanet": "Teoma", "reward": 7300000.0, "collateral": 1460000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Basic Vertical Booster L", "pickupPlanet": "Talemai", "dropPlanet": "Jago", "reward": 7200000.0, "collateral": 1440000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Uncommon Quantum Cores Shipment", "pickupPlanet": "Talemai", "dropPlanet": "Sicari", "reward": 7100000.0, "collateral": 1420000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Blank Clones", "pickupPlanet": "Sicari", "dropPlanet": "Teoma", "reward": 3600000.0, "collateral": 720000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Warp Beacon Parts", "pickupPlanet": "Sicari", "dropPlanet": "Talemai", "reward": 7100000.0, "collateral": 1420000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "TI-NB Supraconductive Product Shipment", "pickupPlanet": "Sicari", "dropPlanet": "Jago", "reward": 10000000.0, "collateral": 2000000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Pure Copper Shipment", "pickupPlanet": "Sicari", "dropPlanet": "Alioth", "reward": 6700000.0, "collateral": 1340000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Large Stabilizers Shipment", "pickupPlanet": "Sicari", "dropPlanet": "Madis", "reward": 3500000.0, "collateral": 700000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Basic Gas Cylinder Shipment", "pickupPlanet": "Sicari", "dropPlanet": "Thades", "reward": 5900000.0, "collateral": 1180000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Pure Sulfur Shipment", "pickupPlanet": "Sicari", "dropPlanet": "Sinnen", "reward": 370000.0, "collateral": 74000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Cobalt Shipment", "pickupPlanet": "Sinnen", "dropPlanet": "Teoma", "reward": 3700000.0, "collateral": 740000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Construction Equipment", "pickupPlanet": "Sinnen", "dropPlanet": "Thades", "reward": 5900000.0, "collateral": 1180000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Fluoropolymere Product Shipment", "pickupPlanet": "Sinnen", "dropPlanet": "Alioth", "reward": 6700000.0, "collateral": 1340000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Pure Gold Shipment", "pickupPlanet": "Sinnen", "dropPlanet": "Madis", "reward": 6000000.0, "collateral": 1200000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "orange Carbon Panels Shipment", "pickupPlanet": "Sinnen", "dropPlanet": "Talemai", "reward": 4500000.0, "collateral": 900000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Advanced Maneuver Atmospheric Engine L Shipment", "pickupPlanet": "Sinnen", "dropPlanet": "Alioth", "reward": 6700000.0, "collateral": 1340000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Biological Matter Product Shipment", "pickupPlanet": "Sinnen", "dropPlanet": "Jago", "reward": 7500000.0, "collateral": 1500000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Lumber", "pickupPlanet": "Teoma", "dropPlanet": "Sinnen", "reward": 3700000.0, "collateral": 740000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Container Parts", "pickupPlanet": "Teoma", "dropPlanet": "Sicari", "reward": 3600000.0, "collateral": 720000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "XS Lights Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Madis", "reward": 6400000.0, "collateral": 1280000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Electric Engines S Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Alioth", "reward": 7500000.0, "collateral": 1500000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Aged Steel Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Thades", "reward": 6200000.0, "collateral": 1240000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Sulfur Acid Product Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Madis", "reward": 3800000.0, "collateral": 760000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Luminescent Icy Blue Glass Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Alioth", "reward": 4900000.0, "collateral": 980000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Deco Fireplace Black Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Thades", "reward": 3700000.0, "collateral": 740000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Titanium Scraps", "pickupPlanet": "Teoma", "dropPlanet": "Talemai", "reward": 7300000.0, "collateral": 1460000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Sky Lithium Panels Shipment", "pickupPlanet": "Teoma", "dropPlanet": "Sinnen", "reward": 6200000.0, "collateral": 1240000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Mining Unit Parts", "pickupPlanet": "Jago", "dropPlanet": "Talemai", "reward": 4700000.0, "collateral": 940000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Water Run Alpha", "pickupPlanet": "Jago", "dropPlanet": "Madis", "reward": 8100000.0, "collateral": 1620000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "S Missile SIlo Shipment", "pickupPlanet": "Jago", "dropPlanet": "Alioth", "reward": 7400000.0, "collateral": 1480000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Steel Column Shipment", "pickupPlanet": "Jago", "dropPlanet": "Thades", "reward": 8600000.0, "collateral": 1720000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "XS Avanced Laser Chamber Shipment", "pickupPlanet": "Jago", "dropPlanet": "Madis", "reward": 5500000.0, "collateral": 1100000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "XS Advanced Shield Generator Shipment", "pickupPlanet": "Jago", "dropPlanet": "Alioth", "reward": 4800000.0, "collateral": 960000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Aged Copper Shipment", "pickupPlanet": "Jago", "dropPlanet": "Thades", "reward": 6000000.0, "collateral": 1200000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}, {"name": "Xeron Fuel", "pickupPlanet": "Jago", "dropPlanet": "Talemai", "reward": 7200000.0, "collateral": 1440000.0, "mass_t": 1800.0, "volume_kl": 400.0, "size_class": "verylarge"}, {"name": "Cobalt Scrap Shipment", "pickupPlanet": "Jago", "dropPlanet": "Sicari", "reward": 7500000.0, "collateral": 1500000.0, "mass_t": 437.5, "volume_kl": 125.0, "size_class": "large"}];

const el = (id)=>document.getElementById(id);
const SU_TO_KM=200, SPEED=50000;
let missions = [];            // baked dataset
let filtered = [];            // filtered by search
let selectedIds = new Set();  // ids of selected missions (stable per load)

// ---- helpers ----
function parseMassT(v){ if(v==null)return 0; if(typeof v==='number')return v; const s=String(v).toLowerCase(); const m=s.match(/([\d.]+)/); if(!m)return 0; const n=parseFloat(m[1]); return s.includes('kt')?n*1000:n; }
function parseVolkL(v){ if(v==null)return 0; if(typeof v==='number')return v; const s=String(v).toLowerCase(); const m=s.match(/([\d.]+)/); if(!m)return 0; const n=parseFloat(m[1]); if(s.includes('kl'))return n; if(s.includes('l'))return n/1000; return n; }
const SIZE_MAP={small:{mass_t:15,volume_kl:20},medium:{mass_t:87.5,volume_kl:35},large:{mass_t:437.5,volume_kl:125},verylarge:{mass_t:1800,volume_kl:400}};
function sizeFromText(o){const hay=`${o.size||''} ${o.size_class||''} ${o.sizeClass||''} ${o.package||''} ${o.description||''} ${o.name||''}`.toLowerCase(); if(/very\s*large|verylarge|verylargestuff|verylargepackage|xl|x-large/.test(hay))return'verylarge'; if(/large|largestuff|largepackage|largepackage1/.test(hay))return'large'; if(/medium|mediumstuff|mediumpackage/.test(hay))return'medium'; if(/small|smallstuff|smallpackage|smallpackage1/.test(hay))return'small'; return null;}
function coerceMassVol(o){ let mt=Number(o.mass_t); let vk=Number(o.volume_kl); if(!(mt>0)) mt=parseMassT(o.mass||o.massT||o.mass_t); if(!(vk>0)) vk=parseVolkL(o.volume||o.volume_kL||o.volume_kl||o.vol); if(!(mt>0)||!(vk>0)){ const sz=sizeFromText(o); if(sz&&SIZE_MAP[sz]){mt=SIZE_MAP[sz].mass_t; vk=SIZE_MAP[sz].volume_kl;}} o.mass_t=mt>0?mt:0; o.volume_kl=vk>0?vk:0; return o;}
function fmtQ(n){ return (n||0).toLocaleString('en-US'); }
function fmtH(h){ const hh=Math.floor(h); const mm=Math.round((h-hh)*60); return `${hh}h ${String(mm).padStart(2,'0')}m`; }
function fmtKT(tonnes){ const kt=(tonnes||0)/1000; return (Math.round(kt*1000)/1000).toLocaleString('en-US'); }
function suBetween(a,b){ if(a===b) return 0; return distances[a]?.[b] ?? distances[b]?.[a] ?? Infinity; }
function suToKm(x){ return x*SU_TO_KM; } function kmToH(km){ return km/SPEED; }

// ---------- Repeat-cycle evaluator (single mission loop or reciprocal pair) ----------
function computeBestRepeating(start, chosen){
  let __repeatStart = start;
  if(!chosen || !chosen.length) return null;
  // Map by (from,to) for quick reciprocal lookup
  const byKey = new Map();
  for(const m of chosen){
    const key = `${m.pickupPlanet}→${m.dropPlanet}`;
    if(!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(m);
  }
  function cycleForSingle(m){
    const P = m.pickupPlanet, D = m.dropPlanet;
    const suPD = suBetween(P,D);
    const suDP = suBetween(D,P);
    if(!isFinite(suPD) || !isFinite(suDP)) return null;
    const kmLeg = suToKm(suPD), hLeg = kmToH(kmLeg);
    const kmBack = suToKm(suDP), hBack = kmToH(kmBack);
    const reward = m.reward || 0;
    const cycleH = hLeg + hBack;
    const qph = cycleH>0 ? reward / cycleH : 0;
    // Build a representative single cycle route
    const route = [];
    // reposition to pickup (one-off). Keep as deadhead so UI shows it; excluded from rate comparison below.
    const repSu = suBetween(__repeatStart,P); if(isFinite(repSu) && repSu>0){
      const repKm = suToKm(repSu), repH = kmToH(repKm);
      route.push({type:'deadhead', from:start, to:P, su:repSu, km:repKm, h:repH, cargoBeforeVol:0, cargoAfterVol:0});
      __repeatStart = P;
    }
    // pickup
    route.push({type:'pickup', picked:[m.name], from:P, to:P, su:0, km:0, h:0, deltaMass:(m.mass_t||0), deltaVol:(m.volume_kl||0),
                cargoBeforeVol:0, cargoAfterVol:(m.volume_kl||0)});
    // deliver
    route.push({type:'deliver', missions:[m], from:P, to:D, su:suPD, km:kmLeg, h:hLeg, reward:reward,
                deltaMass:-(m.mass_t||0), deltaVol:-(m.volume_kl||0), cargoBeforeVol:(m.volume_kl||0), cargoAfterVol:0});
    // deadhead back
    route.push({type:'deadhead', from:D, to:P, su:suDP, km:kmBack, h:hBack, cargoBeforeVol:0, cargoAfterVol:0});
    return {route, totalKm: kmLeg+kmBack, totalTime: hLeg+hBack, totalReward: reward, cycleH, cycleReward: reward, label:`Repeat: ${m.name}`, key:`single:${P}→${D}`, missionsUsed:[m]};
  }
  function cycleForPair(m1, m2){
    const P = m1.pickupPlanet, D = m1.dropPlanet; // m2 should be D->P
    const suPD = suBetween(P,D);
    const suDP = suBetween(D,P);
    if(!isFinite(suPD) || !isFinite(suDP)) return null;
    const kmPD = suToKm(suPD), hPD = kmToH(kmPD);
    const kmDP = suToKm(suDP), hDP = kmToH(kmDP);
    const reward = (m1.reward||0)+(m2.reward||0);
    const cycleH = hPD + hDP;
    const qph = cycleH>0 ? reward / cycleH : 0;
    const route = [];
    // reposition to pickup P
    const repSu = suBetween(__repeatStart,P); if(isFinite(repSu) && repSu>0){
      const repKm = suToKm(repSu), repH = kmToH(repKm);
      route.push({type:'deadhead', from:start, to:P, su:repSu, km:repKm, h:repH, cargoBeforeVol:0, cargoAfterVol:0});
      __repeatStart = P;
    }
    // pick A at P
    route.push({type:'pickup', picked:[m1.name], from:P, to:P, su:0, km:0, h:0, deltaMass:(m1.mass_t||0), deltaVol:(m1.volume_kl||0),
                cargoBeforeVol:0, cargoAfterVol:(m1.volume_kl||0)});
    // deliver A to D
    route.push({type:'deliver', missions:[m1], from:P, to:D, su:suPD, km:kmPD, h:hPD, reward:(m1.reward||0),
                deltaMass:-(m1.mass_t||0), deltaVol:-(m1.volume_kl||0), cargoBeforeVol:(m1.volume_kl||0), cargoAfterVol:0});
    // pick B at D
    route.push({type:'pickup', picked:[m2.name], from:D, to:D, su:0, km:0, h:0, deltaMass:(m2.mass_t||0), deltaVol:(m2.volume_kl||0),
                cargoBeforeVol:0, cargoAfterVol:(m2.volume_kl||0)});
    // deliver B back to P
    route.push({type:'deliver', missions:[m2], from:D, to:P, su:suDP, km:kmDP, h:hDP, reward:(m2.reward||0),
                deltaMass:-(m2.mass_t||0), deltaVol:-(m2.volume_kl||0), cargoBeforeVol:(m2.volume_kl||0), cargoAfterVol:0});
    return {route, totalKm: kmPD+kmDP, totalTime: hPD+hDP, totalReward: reward, cycleH, cycleReward: reward, label:`Repeat Pair: ${m1.name} ↔ ${m2.name}`, key:`pair:${P}↔${D}`, missionsUsed:[m1,m2]};
  }

  let best = null, bestQph = -1;
  // Single-mission loops
  for(const m of chosen){
    const cand = cycleForSingle(m);
    if(!cand) continue;
    const qph = cand.cycleReward / cand.cycleH;
    if(qph > bestQph){ bestQph=qph; best=cand; }
  }
  // Reciprocal pairs
  for(const m of chosen){
    const revList = byKey.get(`${m.dropPlanet}→${m.pickupPlanet}`) || [];
    for(const n of revList){
      const cand = cycleForPair(m,n);
      if(!cand) continue;
      const qph = cand.cycleReward / cand.cycleH;
      if(qph > bestQph){ bestQph=qph; best=cand; }
    }
  }
  if(!best) return null;
  // Provide overcap info (volume only)
  const capV = parseFloat(el('shipCapVol').value); // volume-only capacity
  const limitVol = Number.isFinite(capV) && capV>0 ? capV : Infinity;
  const overcapLegs=[];
  for(let i=0;i<best.route.length;i++){
    const L = best.route[i];
    const vol = L.cargoAfterVol!=null ? L.cargoAfterVol : L.cargoBeforeVol;
    if (vol > limitVol) overcapLegs.push(i);
  }
  return { ...best, overcapLegs, limitVol, label: best.label, key: best.key };
}

function initUI(){
  const start=el('startPlanet'); const end=el('endPlanet');
  PLANETS.forEach(p=>{ const o=document.createElement('option'); o.value=o.textContent=p; start.appendChild(o); });
  PLANETS.forEach(p=>{ const o=document.createElement('option'); o.value=o.textContent=p; end.appendChild(o); });
  start.value="Alioth"; end.value="Alioth";
}

function hydrate(arr){ return (arr||[]).map((m,i)=> ({id:i+1, ...coerceMassVol(m)})); }

function rowHTML(m){
  return `<div class="rowItem" data-id="${m.id}">
    <input type="checkbox" class="chk" ${selectedIds.has(m.id)?'checked':''} />
    <div class="name">${m.name}</div>
    <div>${m.pickupPlanet} <span class="badgeMini">→</span> ${m.dropPlanet}</div>
    <div class="right">${fmtQ(m.reward)} q</div>
    <div class="right">${fmtQ(m.collateral||0)} q</div>
    <div class="right">${m.mass_t||0} t / ${m.volume_kl||0} kL</div>
  </div>`;
}

function renderList(){
  const box = el('missionList');
  box.innerHTML = filtered.map(rowHTML).join("");
  box.querySelectorAll('.rowItem').forEach(div=>{
    const id = parseInt(div.getAttribute('data-id'), 10);
    const chk = div.querySelector('.chk');
    div.addEventListener('click', (e)=>{
      if (e.target === chk) return;
      chk.checked = !chk.checked;
      if (chk.checked) selectedIds.add(id); else selectedIds.delete(id);
      updateSelCount();
    });
    chk.addEventListener('change', ()=>{
      if (chk.checked) selectedIds.add(id); else selectedIds.delete(id);
      updateSelCount();
    });
  });
  updateSelCount();
}

function updateSelCount(){
  const byId = new Map(filtered.map(m=> [m.id, m]));
  let sumR=0, sumC=0;
  for (const id of selectedIds){ const m=byId.get(id); if (m){ sumR+=(m.reward||0); sumC+=(m.collateral||0); } }
  el('selCount').textContent = `${selectedIds.size} selected of ${filtered.length} shown (${missions.length} total) — ${fmtQ(sumR)} q reward, ${fmtQ(sumC)} q collateral`;
  const hasSel = selectedIds.size>0;
  el('planQph').disabled = !hasSel;
  (function(){var _b=el('exportCsv'); if(_b) _b.disabled=!hasSel; })();
}

function applySearch(q){
  const s=(q||'').toLowerCase().trim();
  if(!s){ filtered=missions.slice(); return; }
  const tokens=s.split(/\s+/).filter(Boolean);
  filtered=missions.filter(m=>{
    const hay=`${m.name||''} ${m.pickupPlanet||''} ${m.dropPlanet||''} ${m.size_class||''} ${m.reward||0} ${m.collateral||0}`.toLowerCase();
    return tokens.every(t=> hay.includes(t));
  });
}

function useBaked(){
  missions = hydrate(BAKED_MISSIONS.map(coerceMassVol));
  filtered = missions.slice();
  selectedIds.clear();
  renderList();
  clearRouteUI();
  el('status').textContent = `Loaded ${missions.length} missions (baked).`;
}

function getChosen(){ const map=new Map(missions.map(m=>[m.id,m])); return Array.from(selectedIds).map(id=> map.get(id)).filter(Boolean); }
function clearRouteUI(){ el('route').innerHTML=''; el('summary').innerHTML=''; const w=el('warning'); if(w){w.classList.add('hidden'); w.textContent='';} el('results').classList.add('hidden'); }

// ------- Optimization helpers -------
function tspOrderFrom(start, nodes){
  const n=nodes.length; if(n<=1) return nodes.slice();
  const dStart = nodes.map(p=> suBetween(start,p));
  const d=Array.from({length:n},()=>Array(n).fill(Infinity));
  for(let i=0;i<n;i++){ for(let j=0;j<n;j++){ d[i][j]= i===j?0:suBetween(nodes[i],nodes[j]); } }
  const SIZE=1<<n, dp=Array.from({length:SIZE},()=>Array(n).fill(Infinity)), parent=Array.from({length:SIZE},()=>Array(n).fill(-1));
  for(let i=0;i<n;i++) dp[1<<i][i]=dStart[i];
  for(let mask=1; mask<SIZE; mask++){
    for(let j=0;j<n;j++){ if(!(mask&(1<<j))) continue; const prev=mask^(1<<j); if(prev===0) continue;
      for(let k=0;k<n;k++){ if(!(prev&(1<<k))) continue; const cand=dp[prev][k]+d[k][j]; if(cand<dp[mask][j]){ dp[mask][j]=cand; parent[mask][j]=k; } } } }
  let best=Infinity, endIdx=0, full=SIZE-1; for(let j=0;j<n;j++){ if(dp[full][j]<best){ best=dp[full][j]; endIdx=j; } }
  const order=[]; let mask=full, j=endIdx; while(j!==-1){ order.push(nodes[j]); const pj=parent[mask][j]; mask^=(1<<j); j=pj; } order.reverse(); return order;
}

// ---------- Planner with explicit cargo accounting & volume capacity enforcement ----------

// ---------- Planner with GLOBAL planet-level TSP + same-planet batching ----------

// ---------- Precedence-Constrained TSP (nearest eligible neighbor) + same-planet batching ----------

// ---------- Exact Mission DP Optimizer (global optimum over pickups & deliveries) ----------
// Minimizes total SU traveled while respecting pickup-before-drop for each mission.
// Allows revisits when needed (e.g., A→B and B→A missions simultaneously).
function planCollectOptimized(start, chosen){
  const capV = parseFloat(el('shipCapVol').value);
  const limitVol = Number.isFinite(capV) && capV>0 ? capV : Infinity;

  // If no missions, no route
  if(!chosen || !chosen.length){
    return {route:[], totalKm:0, totalTime:0, totalReward:0, overcapLegs:[], limitVol};
  }

  // Build planet list from start + all pickups/drops
  const planetSet = new Set([start]);
  for(const m of chosen){ planetSet.add(m.pickupPlanet); planetSet.add(m.dropPlanet); }
  const planets = Array.from(planetSet);
  const pIndex = Object.fromEntries(planets.map((p,i)=>[p,i]));

  // Fast distance helpers using existing suBetween
  function SU(a,b){ return suBetween(a,b); }
  function SUi(i,j){ return SU(planets[i], planets[j]); }

  // Precompute per-planet mission indices for quick state updates
  const M = chosen.length;
  const picksAt = new Array(planets.length).fill(0).map(()=>[]);
  const dropsAt = new Array(planets.length).fill(0).map(()=>[]);
  for(let mi=0; mi<M; mi++){
    picksAt[pIndex[chosen[mi].pickupPlanet]].push(mi);
    dropsAt[pIndex[chosen[mi].dropPlanet]].push(mi);
  }
  const ALL = (1<<M) - 1;

  // DP state: dp[pickedMask][deliveredMask][atPlanetIndex] = minimal SU cost
  // We compact into a Map keyed by "picked|delivered|at"
  function key(pm, dm, at){ return pm+"|"+dm+"|"+at; }

  const dp = new Map();
  const parent = new Map(); // key -> [prevKey, moveToPlanetIndex]

  // At start, apply local actions (deliver/pickup available on start) at zero travel
  function applyLocal(pm, dm, at){
    // Deliver anything for 'at' that has been picked
    let newPm = pm, newDm = dm;
    // Deliver first
    for(const mi of dropsAt[at]){
      if( (newPm & (1<<mi)) && !(newDm & (1<<mi)) ){
        newDm |= (1<<mi);
      }
    }
    // Then pick up all here
    for(const mi of picksAt[at]){
      if(!(newPm & (1<<mi))){
        newPm |= (1<<mi);
      }
    }
    // Deliver again in case pickup+drop are same planet
    for(const mi of dropsAt[at]){
      if( (newPm & (1<<mi)) && !(newDm & (1<<mi)) ){
        newDm |= (1<<mi);
      }
    }
    return [newPm, newDm];
  }

  const startIdx = pIndex[start];
  let [p0, d0] = applyLocal(0,0,startIdx);
  const k0 = key(p0, d0, startIdx);
  dp.set(k0, 0);
  parent.set(k0, null);

  // Enumerate states using a frontier expansion
  // Complexity roughly O( (3^M) * P^2 ), but M is small in UI use.
  const queue = [k0];
  while(queue.length){
    const curK = queue.shift();
    const [pmStr, dmStr, atStr] = curK.split("|");
    const pm = +pmStr, dm = +dmStr, at = +atStr;
    const curCost = dp.get(curK);

    if(dm === ALL){
      // all delivered — no expansion
      continue;
    }

    // Potential next planets: any planet that has a pickup not yet picked OR a drop picked but not delivered
    const targets = new Set();
    for(let pi=0; pi<planets.length; pi++){
      // pickup candidates
      for(const mi of picksAt[pi]){
        if(!(pm & (1<<mi))) { targets.add(pi); break; }
      }
      // drop candidates
      for(const mi of dropsAt[pi]){
        if( (pm & (1<<mi)) && !(dm & (1<<mi)) ) { targets.add(pi); break; }
      }
    }
    if(targets.size === 0){
      // No pending work, will return later
      continue;
    }

    for(const nx of targets){
      if(nx === at){
        // staying here can only make sense via local apply, but we already canonicalized it
        continue;
      }
      const step = SUi(at, nx);
      const newCost = curCost + step;
      // On arrival, apply local actions at nx
      let [pm2, dm2] = applyLocal(pm, dm, nx);
      const nk = key(pm2, dm2, nx);
      const prev = dp.get(nk);
      if(prev === undefined || newCost < prev - 1e-9){
        dp.set(nk, newCost);
        parent.set(nk, [curK, nx]);
        queue.push(nk);
      }
    }
  }

  // Choose best terminal state (all delivered) with minimal cost + return to start
  let bestK = null, bestTotal = Infinity;
  for(const [k, cost] of dp){
    const [pmStr, dmStr, atStr] = k.split("|");
    const pm = +pmStr, dm = +dmStr, at = +atStr;
    if(dm !== ALL) continue;
    const ret = SUi(at, startIdx);
    const tot = cost + ret;
    if(tot < bestTotal - 1e-9){
      bestTotal = tot;
      bestK = k;
    }
  }

  // Reconstruct planet path
  const path = [];
  let cur = bestK;
  if(!cur){
    // Fallback: return simple greedy
    return {route:[], totalKm:0, totalTime:0, totalReward:0, overcapLegs:[], limitVol};
  }
  const endAt = +cur.split("|")[2];
  while(cur){
    const ent = parent.get(cur);
    if(ent && ent[1]!=null) path.push(ent[1]); // pushed planets we moved TO
    cur = ent ? ent[0] : null;
  }
  path.reverse();
  // Prepend start planet and append start for return
  const planetPath = [startIdx, ...path, startIdx].map(i=> planets[i]);

  // Now simulate this path into legs with batching and capacity warnings.
  let route = [], totalKm=0, totalTime=0, totalReward=0;
  const overcapLegs = [];
  let current = start;
  let cargoMass=0, cargoVol=0;

  function addLeg(leg){
    route.push(leg);
    totalKm   += (leg.km||0);
    totalTime += (leg.h||0);
    if(leg.type==='deliver') totalReward += (leg.reward||0);
    const vol = leg.cargoAfterVol!=null ? leg.cargoAfterVol : leg.cargoBeforeVol;
    if (vol > limitVol) overcapLegs.push(route.length-1);
  }
  function travelTo(p, type){
    if(current===p) return;
    const su = suBetween(current, p);
    const km = suToKm(su), h = kmToH(km);
    addLeg({type, from:current, to:p, su, km, h,
      cargoBeforeMass:cargoMass, cargoBeforeVol:cargoVol,
      cargoAfterMass:cargoMass,  cargoAfterVol:cargoVol});
    current = p;
  }
  function doDeliverHere(){
    const toDrop = chosen.filter((m,mi)=> m.dropPlanet===current && ((pPicked>>mi)&1) && !((pDelivered>>mi)&1));
    if(!toDrop.length) return 0;
    const dm = toDrop.reduce((a,m)=> a + (m.mass_t||0), 0);
    const dv = toDrop.reduce((a,m)=> a + (m.volume_kl||0), 0);
    const rew = toDrop.reduce((a,m)=> a + (m.reward||0), 0);
    const bm = cargoMass, bv = cargoVol;
    cargoMass = Math.max(0, cargoMass - dm);
    cargoVol  = Math.max(0, cargoVol  - dv);
    addLeg({type:'deliver', missions:toDrop, from:current, to:current, su:0, km:0, h:0,
      reward:rew, deltaMass:-dm, deltaVol:-dv,
      cargoBeforeMass:bm, cargoBeforeVol:bv,
      cargoAfterMass:cargoMass, cargoAfterVol:cargoVol});
    return toDrop.length;
  }
  function doPickupHere(){
    const toPick = chosen.filter((m,mi)=> m.pickupPlanet===current && !((pPicked>>mi)&1));
    if(!toPick.length) return 0;
    const dm = toPick.reduce((a,m)=> a + (m.mass_t||0), 0);
    const dv = toPick.reduce((a,m)=> a + (m.volume_kl||0), 0);
    const bm = cargoMass, bv = cargoVol;
    cargoMass += dm; cargoVol += dv;
    // set picked bits
    for (let mi = 0; mi < M; mi++) {
      if (chosen[mi].pickupPlanet === current && !((pPicked>>mi)&1)) pPicked |= (1<<mi);
    }
    addLeg({type:'pickup', from:current, to:current, su:0, km:0, h:0,
      picked:toPick.map(x=>x.name), deltaMass:+dm, deltaVol:+dv,
      cargoBeforeMass:bm, cargoBeforeVol:bv,
      cargoAfterMass:cargoMass, cargoAfterVol:cargoVol});
    // if any of these also drop here, deliver immediately to keep masks consistent
    let deliveredNow = false;
    for (let mi = 0; mi < M; mi++) {
      if (chosen[mi].dropPlanet === current && (pPicked & (1<<mi)) && !((pDelivered>>mi)&1)) {
        pDelivered |= (1<<mi);
        deliveredNow = true;
      }
    }
    if (deliveredNow) {
      doDeliverHere();
    }
    return toPick.length;
  }

  // Simulate with masks the same way DP did, to generate legs
  let pPicked = 0, pDelivered = 0;
  // start actions
  doDeliverHere(); doPickupHere();
  // ✅ FIX: sync masks for start planet so next leg can deliver correctly
  for (let mi = 0; mi < M; mi++) {
    if (chosen[mi].pickupPlanet === current) pPicked |= (1 << mi);
  }
  for (let mi = 0; mi < M; mi++) {
    if (chosen[mi].dropPlanet === current && (pPicked & (1 << mi))) {
      pDelivered |= (1 << mi);
    }
  }

  for(let i=1; i<planetPath.length; i++){
    const next = planetPath[i];
    travelTo(next, i<planetPath.length-1 ? 'deadhead' : 'return');
    // on arrival
    // Deliver first, then pickup
    for(let mi=0; mi<M; mi++){
      // Update masks to reflect deliver/pick like DP did
    }
    // but to keep consistency, call helpers which also build legs
    doDeliverHere();
    doPickupHere();
    // Update masks after actions
    for(let mi=0; mi<M; mi++){
      if(chosen[mi].pickupPlanet===current) pPicked |= (1<<mi);
      if(chosen[mi].dropPlanet===current && (pPicked & (1<<mi))) pDelivered |= (1<<mi);
    }
  }

  return {route, totalKm, totalTime, totalReward, overcapLegs, limitVol};
}





// Expand a repeating route plan into a finite number of cycles for display.
function expandRepeatCycles(res, cycles){
  try{
    if(!res || !res.route || !res.route.length) return res;
    const n = Math.max(1, cycles|0);
    const body = res.route.slice(); // a single representative cycle
    const out = [];
    let totalKm = 0, totalTime = 0, totalReward = 0;
    for(let i=0;i<n;i++){
      for(const leg of body){
        out.push({...leg}); 
        totalKm += (leg.km||0);
        totalTime += (leg.h||0);
        if(leg.type==='deliver') totalReward += (leg.reward||0);
      }
    }
    return {...res, route: out, totalKm, totalTime, totalReward};
  }catch(e){ return res; }
}
function appendReturnLeg(res, start, end){
  const route = res.route.slice();
  const lastStop = route.length ? route[route.length-1].to : start;
  if(!end || end===lastStop) return res;
  const su=suBetween(lastStop,end); if(!Number.isFinite(su)) return res;
  const km=suToKm(su), h=kmToH(km);
  route.push({type:'return', from:lastStop, to:end, su, km, h,
              cargoBeforeMass:0, cargoBeforeVol:0, cargoAfterMass:0, cargoAfterVol:0});
  return {...res, route, totalKm: res.totalKm+km, totalTime: res.totalTime+h};
}

function timeToEnd(from, end){ if(!end) return 0; const su=suBetween(from,end); return kmToH(suToKm(su)); }


function applyTimeBudget(res, start, end, budgetH, includeReturn, repeatable){
  if(!isFinite(budgetH) || budgetH <= 0) return res;
  const route = [];
  let totalKm = 0, totalTime = 0, totalReward = 0;
  let cur = start;
  const overcapLegs = [];
  const limitVol = res.limitVol;

  function tryPush(leg){
    const nextT = totalTime + (leg.h || 0);
    const extraR = includeReturn ? timeToEnd(leg.to, end) : 0;
    if(nextT + extraR <= budgetH){
      route.push(leg);
      totalKm += (leg.km || 0);
      totalTime += (leg.h || 0);
      if(leg.type === 'deliver') totalReward += (leg.reward || 0);
      if(leg.cargoAfterVol > limitVol) overcapLegs.push(route.length-1);
      cur = leg.to;
      return true;
    }
    return false;
  }

  let cycles = repeatable ? 200 : 1;
  outer: while(cycles-- > 0){
    for(let idx=0; idx<res.route.length; idx++){
      const leg = res.route[idx];
      if(!tryPush(leg)) break outer;
    }
  }

  if(includeReturn){
    const rT=timeToEnd(cur, end);
    const su=suBetween(cur, end);
    const km=suToKm(su);
    if(isFinite(rT) && totalTime + rT <= budgetH){
      const leg = {type:'return', from:cur, to:end, su, km, h:rT, cargoBeforeMass:0, cargoBeforeVol:0, cargoAfterMass:0, cargoAfterVol:0};
      route.push(leg);
      totalKm += km;
      totalTime += rT;
    }
  }
  return {route, totalKm, totalTime, totalReward, overcapLegs, limitVol};
}

function renderPlan(res, totals, end, budgetH=0, limited=false, pickedLabel){
  const c=el('route'); c.innerHTML=''; let idx=1; let peakMass=0, peakVol=0;
  const overcapSet = new Set(res.overcapLegs||[]);

  for(let i=0;i<res.route.length;i++){
    const leg = res.route[i];
    peakMass = Math.max(peakMass, leg.cargoBeforeMass||0, leg.cargoAfterMass||0);
    peakVol  = Math.max(peakVol, leg.cargoBeforeVol||0,  leg.cargoAfterVol||0);
    const div=document.createElement('div'); div.className='leg';
    if (overcapSet.has(i)) div.classList.add('overcap');

    let badgeLabel=''; 
    if(leg.type==='pickup') badgeLabel='Pickup';
    else if(leg.type==='deliver') badgeLabel=`Mission ${idx++}`;
    else if(leg.type==='return') badgeLabel='Return';
    else badgeLabel='Deadhead';
    const badge=document.createElement('div'); badge.className='badge'; badge.textContent=badgeLabel;
    const main=document.createElement('div'); const meta=document.createElement('div'); meta.className='meta';
    const cargo=document.createElement('div'); cargo.className='cargo';
    let title;
    if (leg.type==='pickup' || leg.type==='deliver') {
      // Show only the planet name for pickups and deliveries
      const pname = (leg.type==='deliver' ? (leg.to||leg.from) : (leg.to||leg.from));
      title = `<strong>${pname}</strong>`;
    } else {
      title = `<strong>${leg.from}</strong> → <strong>${leg.to}</strong>`;
    }
const tripMeta = (leg.type==='pickup') ? '' : `<div class="meta">${leg.su.toFixed(1)} SU · ${(leg.km).toLocaleString('en-US')} km · ${fmtH(leg.h)}</div>`;main.innerHTML = `${title}${tripMeta}`;
    if(leg.type==='pickup'){
      const list=(leg.picked||[]).slice(0,3).join(', ')+((leg.picked||[]).length>3?'…':'');
      meta.textContent = `Collect: ${leg.picked?.length||0} mission(s) · +${leg.deltaVol||0} kL` + (list?` · ${list}`:'');
    } else if(leg.type==='deliver'){
      const totalR = leg.reward||0;
      const names = leg.missions.map(m=>m.name).slice(0,3).join(', ')+ (leg.missions.length>3?'…':'');
      meta.textContent = `Deliver: ${leg.missions.length} mission(s) · −${Math.abs(leg.deltaVol||0)} kL · ${fmtQ(totalR)} q total (${names})`;
    } else {
      meta.textContent = leg.type==='return' ? 'Return-to-end flight' : 'Positioning flight (no cargo change)';
    }
    const before = `${(leg.cargoBeforeVol||0)} kL`; const after  = `${(leg.cargoAfterVol||0)} kL`;
    const beforeMassKT = fmtKT(leg.cargoBeforeMass||0);
    const afterMassKT  = fmtKT(leg.cargoAfterMass||0);
    cargo.innerHTML = `Volume: ${before} → ${after}<br/>Weight: ${beforeMassKT} kT → ${afterMassKT} kT`;
    const side=document.createElement('div'); side.style.textAlign='right';
    if(leg.type==='deliver'){ side.innerHTML = `<div><strong>+${fmtQ(leg.reward||0)} q</strong></div>`; } else { side.innerHTML = `<div>&nbsp;</div>`; }
    div.appendChild(badge); div.appendChild(main); div.appendChild(side); main.appendChild(meta); main.appendChild(cargo); c.appendChild(div);
  }
  const qph = res.totalReward/Math.max(res.totalTime,0.0001);
  const budgetLine = limited ? `<div>Time budget: <strong>${fmtH(budgetH)}</strong> · Unused: <strong>${fmtH(Math.max(0, budgetH-res.totalTime))}</strong></div>` : '';
  el('summary').innerHTML = `${budgetLine}
                             <div>Peak weight carried: <strong>${fmtKT(peakMass)}</strong> kT<br/>Peak volume carried: <strong>${peakVol} kL</strong> (Capacity: ${isFinite(res.limitVol)?res.limitVol:'∞'} kL)</div>
                             <div>Total distance: <strong>${Math.round(res.totalKm).toLocaleString('en-US')} km</strong> (${Math.round(res.totalKm/200).toLocaleString('en-US')} SU)</div>
                             <div>Total flight time: <strong>${fmtH(res.totalTime)}</strong></div>
                             <div>Total reward: <strong>${fmtQ(res.totalReward)} q</strong> · Effective <strong>${fmtQ(Math.round(qph))} q/hr</strong></div>
                             <div>Total collateral (selected): <strong>${fmtQ(totals.totalCollateral||0)} q</strong> across ${totals.count||0} missions</div>`;
  el('results').classList.remove('hidden');

  // Capacity warning
  const warnEl = el('warning');
  if (warnEl){
    if ((res.overcapLegs||[]).length){
      warnEl.classList.remove('hidden');
      warnEl.textContent = `⚠ Over capacity on ${res.overcapLegs.length} leg(s). Overfilling is allowed but risky — consider increasing Ship Capacity or reducing selection.`;
    } else {
      warnEl.classList.add('hidden');
      warnEl.textContent = '';
    }
  }
}


function planFullRoute(){
  const chosen = getChosen();
  if(!chosen || !chosen.length){
    el('status').textContent='Select at least one mission.';
    return;
  }

  const start = (typeof getStartPlanet==='function')
    ? getStartPlanet()
    : (document.getElementById('startPlanet')?.value || 'Alioth');
  const end = (typeof getEndPlanet==='function')
    ? getEndPlanet()
    : (document.getElementById('endPlanet')?.value || 'Alioth');

  const budgetH = parseFloat(el('timeBudget')?.value || 'NaN');
  const limit = !!(el('limitTime')?.checked && isFinite(budgetH) && budgetH>0);

  const totals = {
    totalCollateral: chosen.reduce((a,m)=>a+(m.collateral||0),0),
    count: chosen.length
  };

  // Build full route across ALL selected missions
  let res = planCollectOptimized(start, chosen);

  if(!res || !Array.isArray(res.route)){
    el('status').textContent = 'Could not build a route. Check mission selection/data.';
    return;
  }

  // Enforce selected Start
  // Enforce selected Start (if route doesn’t begin there, add a deadhead leg)
  if (res.route.length && res.route[0].from !== start) {
    const firstFrom = res.route[0].from;
    const su = suBetween(start, firstFrom);
    if (isFinite(su) && su > 0) {
      const km = suToKm(su);
      const h = kmToH(km);
      res.route.unshift({
        type: 'deadhead',
        from: start,
        to: firstFrom,
        su,
        km,
        h,
        cargoBeforeMass: 0,
        cargoBeforeVol: 0,
        cargoAfterMass: 0,
        cargoAfterVol: 0
      });
      res.totalKm += km;
      res.totalTime += h;
    }
  }

  if(!limit){
    const finalRes = appendReturnLeg(res, start, end);
    el('status').textContent = 'Mode: Full route (run all selected)';
    renderPlan(finalRes, totals, end, 0, false, 'Full route');
    return;
  }

  const trimmed = applyTimeBudget(res, start, end, budgetH, true, /*repeatable*/ true);
  el('status').textContent = 'Mode: Full route (time-limited)';
  renderPlan(trimmed, totals, end, budgetH, true, 'Full route');
}
function setupHandlers(){
  el('searchBox').addEventListener('input', (e)=>{ applySearch(e.target.value); renderList(); });
  el('selectAll').addEventListener('click', ()=>{ filtered.forEach(m=> selectedIds.add(m.id)); renderList(); });
  el('clearSelection').addEventListener('click', ()=>{ selectedIds.clear(); renderList(); });

  
function bestSubsetByQph(start, chosen){
  if(!chosen || !chosen.length) return null;
  const endPlanet = el('endPlanet').value;
  function rateRes(res, includeReturn){
    const endP = endPlanet;
    const lastTo = res.route.length ? res.route[res.route.length-1].to : start;
    const retH = includeReturn ? timeToEnd(lastTo, endP) : 0;
    const t = res.totalTime + retH;
    return t>0 ? (res.totalReward / t) : 0;
  }
  let best = null, bestQhr = -1;
  const M = chosen.length;
  if (M <= 12){
    const max = 1<<M;
    for(let mask=1; mask<max; mask++){
      const subset=[];
      for(let i=0;i<M;i++) if((mask>>i)&1) subset.push(chosen[i]);
      const r = planCollectOptimized(start, subset);
      const qhr = rateRes(r, true);
      if(qhr>bestQhr){ bestQhr=qhr; best={...r, label:`Subset: ${subset.length} missions`, missionsUsed: subset}; }
    }
    return best;
  }
  // Greedy fallback for large M
  let pool = chosen.slice();
  let current = [];
  let improved = true;
  let currentBest = null, currentBestQhr=-1;
  while(improved && pool.length){
    improved=false;
    let pickIndex=-1, pickRes=null, pickQhr=-1;
    for(let i=0;i<pool.length;i++){
      const trySet = current.concat([pool[i]]);
      const r = planCollectOptimized(start, trySet);
      const qhr = rateRes(r, true);
      if(qhr>pickQhr){ pickQhr=qhr; pickRes=r; pickIndex=i; }
    }
    if(pickQhr>currentBestQhr){
      current.push(pool[pickIndex]);
      pool.splice(pickIndex,1);
      currentBestQhr=pickQhr;
      currentBest=pickRes;
      improved=true;
    }else{
      break;
    }
  }
  if(currentBest){ currentBest.label = `Subset: ${current.length} missions`; currentBest.missionsUsed = current.slice(); }
  return currentBest;
}
function planBestQph(){
    // NOTE: repeatable flag detection now keys off `pick.key` prefixes ('pair:' | 'single:')
    // so repeating cycles actually loop inside applyTimeBudget.
    // Compare full route vs repeating subset; choose higher q/hr
    const chosen=getChosen(); if(!chosen.length){ el('status').textContent='Select at least one mission.'; return; }
    const start=el('startPlanet').value; const end=el('endPlanet').value;
    const budgetH=parseFloat(el('timeBudget').value); const limit=el('limitTime').checked && isFinite(budgetH) && budgetH>0;

    let base=planCollectOptimized(start, chosen);
    const subsetBest = bestSubsetByQph(start, chosen);
    const repeat = computeBestRepeating(start, chosen);

    // Decide which strategy yields higher q/hr
    let pick = base, pickedLabel = 'Full route';
    function rate(res, includeReturn){
      const endPlanet = el('endPlanet').value;
      const returnH = includeReturn ? timeToEnd(res.route.length ? res.route[res.route.length-1].to : start, endPlanet) : 0;
      const t = res.totalTime + returnH;
      return t>0 ? (res.totalReward / t) : 0;
    }
    if(repeat){
      const r1 = rate(base, true);
      const r2 = (repeat.cycleReward / repeat.cycleH); // steady-state
      if(r2 > r1){ pick = repeat; pickedLabel = repeat.label; }
      if(pickedLabel && pickedLabel.startsWith('Repeat')){
        el('status').textContent='Using repeating loop plan for higher quanta/hour.';
      } else {
        el('status').textContent='';
      }
    }

    // Compare against best subset route by Q/hr
    if (subsetBest){
      const sbQ = rate(subsetBest, true);
      const curQ = rate(pick, true);
      if (sbQ > curQ){ pick = subsetBest; pickedLabel = subsetBest.label; }
    }

    // Decide which missions are actually being run for totals/collateral
    let missionsForTotals = chosen;
    if (pick && Array.isArray(pick.missionsUsed) && pick.missionsUsed.length){
      missionsForTotals = pick.missionsUsed;
    }
    const totals={
      totalCollateral: missionsForTotals.reduce((a,m)=>a+(m.collateral||0),0),
      count: missionsForTotals.length
    };

    if(!limit){
      const res=appendReturnLeg(pick,start,end);
      renderPlan(res, totals, end, 0, false, pickedLabel);
      return;
    }
    const t=applyTimeBudget(
      pick,
      start,
      end,
      budgetH,
      true,
      /* repeatable */ true
    );
    renderPlan(t, totals, end, budgetH, true, pickedLabel);
  }

el('clearRoute').addEventListener('click', clearRouteUI);
  el('exportCsv').addEventListener('click', ()=>{
    const src=getChosen(); if(!src.length){ el('status').textContent='Select at least one mission to export.'; return; }
    const rows=[['Name','From','To','Reward (q)','Collateral (q)','Vol (kL)','Size']];
    for(const m of src) rows.push([m.name,m.pickupPlanet,m.dropPlanet,m.reward,m.collateral||0,m.volume_kl,m.size_class||'']);
    const csv=rows.map(r=> r.map(v=> String(v).includes(',')?'\"'+v+'\"':String(v)).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='du-missions-export.csv'; a.click(); URL.revokeObjectURL(url);
  });
  // Plan button: branch by mode
  el('planQph').addEventListener('click', ()=>{
    const chosen = getChosen();
    if (!chosen || !chosen.length){
      el('status').textContent = 'Select at least one mission.';
      return;
    }
    const runAll = el('runAllMissions') && el('runAllMissions').checked;
    if (runAll) {
      el('status').textContent = 'Planning full route...';
      planFullRoute();
    } else {
      el('status').textContent = 'Optimizing for best quanta/hour...';
      planBestQph();
    }
  });

  // Mutually exclusive toggles
  const cbOpt = el('optimizeQph');
  const cbAll = el('runAllMissions');
  if (cbOpt && cbAll){
    cbOpt.addEventListener('change', ()=>{ if(cbOpt.checked) cbAll.checked = false; });
    cbAll.addEventListener('change', ()=>{ if(cbAll.checked) cbOpt.checked = false; });
  }

}

function main(){ initUI(); useBaked(); setupHandlers(); setupHelpPersistence(); }
function setupHelpPersistence(){
  const d = document.getElementById('helpDetails');
  if(!d) return;
  try{
    const v = localStorage.getItem('du_help_open');
    if(v === '1') d.setAttribute('open','');
  }catch(e){}
  d.addEventListener('toggle', ()=>{
    try{ localStorage.setItem('du_help_open', d.open ? '1' : '0'); }catch(e){}
  });
}

main();


// === Theme Toggle ===
(function(){
  const btn = document.getElementById('themeToggle');
  function apply(theme){
    const body = document.body;
    if (theme === 'light') { body.classList.add('theme-light'); }
    else { body.classList.remove('theme-light'); }
    if (btn) btn.textContent = theme === 'light' ? '☀️ Light' : '🌙 Dark';
  }
  const saved = localStorage.getItem('du-theme') || 'dark';
  apply(saved);
  if (btn){
    btn.addEventListener('click', () => {
      const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('du-theme', next);
      apply(next);
    });
  }
})();

function ensurePlanets(){
  const sp = el('startPlanet'), ep = el('endPlanet');
  if(sp && !sp.options.length){ PLANETS.forEach(p=>{ const o=document.createElement('option'); o.value=o.textContent=p; sp.appendChild(o); }); }
  if(ep && !ep.options.length){ PLANETS.forEach(p=>{ const o=document.createElement('option'); o.value=o.textContent=p; ep.appendChild(o); }); }
}
document.addEventListener('DOMContentLoaded', ensurePlanets);
