function getAllGigs(){ return readLS('quickgig.gigs') || []; }
function saveGigs(g){ writeLS('quickgig.gigs', g); }

function createGig(data){
  if(!data.title || !data.category) return {success:false,message:'Title and category required.'};
  const gigs = getAllGigs();
  const g = Object.assign({}, data, { id: uid('g'), created: Date.now(), ownerId: (currentUser()||{}).id || null });
  gigs.unshift(g); saveGigs(gigs);
  return {success:true,message:'Job posted.'};
}

function getGigById(id){ return getAllGigs().find(x=>x.id===id); }

function gigCardHTML(g){
  return `<div class="gig-card card">
    <h3>${escapeHtml(g.title)}</h3>
    <div class="meta">${g.category} • ${g.duration || ''} • ₱${g.pay}</div>
    <p>${escapeHtml(g.shortDesc || '')}</p>
    <div class="form-row">
      <a href="details.html?id=${encodeURIComponent(g.id)}" class="btn btn-sm">View</a>
      <span style="margin-left:auto;color:#666">Posted: ${new Date(g.created).toLocaleString()}</span>
    </div>
  </div>`;
}

function searchGigs({q='', loc='', sort='newest'}){
  let arr = getAllGigs();
  if(q) arr = arr.filter(x=> (x.title+x.category+x.shortDesc).toLowerCase().includes(q.toLowerCase()));
  if(loc) arr = arr.filter(x=> x.location===loc);
  if(sort==='pay-desc') arr = arr.sort((a,b)=> b.pay - a.pay);
  else arr = arr.sort((a,b)=> b.created - a.created);
  return arr;
}

function applyForGig(gigId){
  const u = currentUser();
  if(!u) return {success:false,message:'You must be logged in to apply.'};
  if(u.role !== 'student') return {success:false,message:'Only students can apply.'};
  const apps = readLS('quickgig.apps') || [];
  if(apps.find(a=>a.gigId===gigId && a.userId===u.id)) return {success:false,message:'Already applied.'};
  apps.push({id: uid('a'), gigId, userId: u.id, status:'Pending', appliedAt: Date.now()});
  writeLS('quickgig.apps', apps);
  return {success:true,message:'Application submitted.'};
}
function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
