// export.js — single Export Route (comma CSV) with metadata header and totals
(function(){
  function hookRender(){
    if (!window.renderPlan || window.renderPlan.__duHooked) return;
    const orig = window.renderPlan;
    window.renderPlan = function(res, totals, end, budgetH=0, limited=false, pickedLabel){
      try { window.LAST_PLAN = { res, totals, end, budgetH, limited }; } catch(e){}
      const ret = orig.apply(this, arguments);
      try {
        const btn = document.getElementById('exportRoute');
        if (btn) btn.disabled = !(res && Array.isArray(res.route) && res.route.length);
      } catch(e){}
      return ret;
    };
    window.renderPlan.__duHooked = true;
  }

  function bindExport(){
    const btn = document.getElementById('exportRoute');
    if (!btn || btn.__duBound) return;
    btn.__duBound = true;

    // Helpers
    const fmtQ = (n)=> Math.round(Number(n||0)).toLocaleString('en-GB');
    const fmtVol = (v)=> {
      const num = Number(v||0);
      return Number.isInteger(num) ? num.toString() : num.toFixed(1);
    };
    const fmtKT = (v)=> Number(v||0).toFixed(3);

    btn.addEventListener('click', () => {
      const plan = window.LAST_PLAN;
      if (!plan || !plan.res || !Array.isArray(plan.res.route) || !plan.res.route.length){
        alert('No route to export yet.');
        return;
      }
      const route = plan.res.route;

      const rows = [];
      // Metadata header
      const now = new Date();
      rows.push(['Dual Universe Mission Planner Export']);
      rows.push(['Generated', now.toISOString().slice(0,19).replace('T',' ')]);
      rows.push(['Start', (document.getElementById('startPlanet')?.value||'')]);
      rows.push(['End', (document.getElementById('endPlanet')?.value||'')]);
      rows.push(['Ship Cap (kL)', (document.getElementById('shipCapVol')?.value||'')]);
      rows.push(['Time Budget (h)', (document.getElementById('timeBudget')?.value||'')]);
      rows.push([]);

      // Column headers
      rows.push(['Pickup/Deadhead/Mission','Starting Planet','Destination Planet','Missions','Mission Names','Reward (q)','Volume (kL)','Weight (kT)']);

      let totalReward = 0;
      for (let i=0;i<route.length;i++){
        const leg = route[i];
        const type = (leg.type === 'deliver') ? 'Mission' :
                     (leg.type === 'pickup') ? 'Pickup' :
                     (leg.type === 'return') ? 'Return' : 'Deadhead';
        const fromP = leg.from || '';
        const toP   = leg.to   || '';

        let missionCount = 0;
        let missionNames = '';
        if (Array.isArray(leg.missions) && leg.missions.length){
          missionCount = leg.missions.length;
          missionNames = leg.missions.map(m => m.name || '').filter(Boolean).join(', ');
        } else if (Array.isArray(leg.picked) && leg.picked.length){
          missionCount = leg.picked.length;
          missionNames = leg.picked.join(', ');
        }

        const reward = Number(leg.reward || 0);
        totalReward += reward;

        const volAfter = Number(leg.cargoAfterVol ?? 0);
        const massAfterKT = Number(leg.cargoAfterMass ?? 0) / 1000;

        rows.push([type, fromP, toP, missionCount, missionNames, fmtQ(reward), fmtVol(volAfter), fmtKT(massAfterKT)]);
      }

      const totalCollateral = (window.LAST_PLAN && window.LAST_PLAN.totals && Number(window.LAST_PLAN.totals.totalCollateral)) || 0;
      const profit = totalReward - totalCollateral;

      rows.push([]);
      rows.push(['','','','', 'TOTAL', fmtQ(totalReward), '', '']);
      rows.push(['','','','', 'COLLATERAL', fmtQ(totalCollateral), '', '']);
      rows.push(['','','','', 'PROFIT', fmtQ(profit), '', '' ]);

      // CSV with comma delimiter, CRLF and BOM
      const csvBody = rows.map(r => r.map(v => {
        const s = String(v);
        return /[",\r\n]/.test(s) ? ('"' + s.replace(/"/g,'""') + '"') : s;
      }).join(',')).join('\r\n');
      const csvWithBom = '\ufeff' + csvBody;

      const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
      const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
      const filename = `du-route-${stamp}.csv`;
      if (navigator.msSaveOrOpenBlob){ navigator.msSaveOrOpenBlob(blob, filename); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.style.display='none'; a.href=url; a.download=filename; document.body.appendChild(a); a.click();
      setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    hookRender(); bindExport();
    setTimeout(()=>{ hookRender(); bindExport(); }, 200);
  });
})();
