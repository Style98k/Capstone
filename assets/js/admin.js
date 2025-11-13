// Simple admin render functions

function renderAdmin(){
  const users = getUsers();
  const gigs = getAllGigs();
  const uout = document.getElementById('admin-users');
  const gout = document.getElementById('admin-gigs');
  if(uout) uout.innerHTML = users.map(us => `<div class="card"><strong>${us.name}</strong> (${us.role}) - ${us.verified? 'Verified':'Unverified'} <button onclick="toggleVerify('${us.id}')">Toggle Verify</button></div>`).join('');
  if(gout) gout.innerHTML = gigs.map(g => `<div class="card"><strong>${g.title}</strong> • ₱${g.pay} <button onclick="removeGig('${g.id}')">Remove</button></div>`).join('');
}

function toggleVerify(userId){
  const users = getUsers();
  const u = users.find(x=>x.id===userId);
  if(u){ u.verified = !u.verified; saveUsers(users); renderAdmin(); }
}
function removeGig(gid){
  let gigs = getAllGigs();
  gigs = gigs.filter(x=>x.id!==gid);
  saveGigs(gigs);
  renderAdmin();
}
