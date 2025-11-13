// Utilities and localStorage helpers for QuickGig static prototype

function uid(prefix='id'){
  return prefix + '-' + Math.random().toString(36).slice(2,9);
}

function readLS(key){
  try{ return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e){ return null; }
}
function writeLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

// initial seed data
(function seed(){
  if(!readLS('quickgig.seeded')){
    const users = [
      {id: uid('u'), name: 'Admin User', email: 'admin@quickgig.test', password: 'admin123', role:'admin', verified:true},
      {id: uid('u'), name: 'Client One', email: 'client@quickgig.test', password: 'client123', role:'client', verified:true},
      {id: uid('u'), name: 'Student One', email: 'student@quickgig.test', password: 'student123', role:'student', schoolId:'S-1001', verified:true}
    ];
    const gigs = [
      {id: uid('g'), title: 'Math Tutoring - Algebra', category:'Tutoring', location:'Local', duration:'2 hours', pay:300, shortDesc:'Basic algebra tutoring', fullDesc:'Assist student with algebra topics', ownerId: users[1].id, created: Date.now()},
      {id: uid('g'), title: 'House Cleaning', category:'Household', location:'Local', duration:'3 hours', pay:450, shortDesc:'Light cleaning', fullDesc:'Sweep, mop, tidy room', ownerId: users[1].id, created: Date.now()-3600000}
    ];
    writeLS('quickgig.users', users);
    writeLS('quickgig.gigs', gigs);
    writeLS('quickgig.apps', []); // applications
    writeLS('quickgig.seeded', true);
  }
})();
