// Authentication and user management using localStorage

function getUsers(){ return readLS('quickgig.users') || []; }
function saveUsers(u){ writeLS('quickgig.users', u); }

function registerUser(user){
  const users = getUsers();
  if(!user.name || !user.email || !user.password) return {success:false,message:'Please fill required fields.'};
  if(users.find(x=>x.email===user.email)) return {success:false,message:'Email already registered.'};
  const newUser = { id: uid('u'), name: user.name, email: user.email, password: user.password, role: user.role||'student', schoolId: user.schoolId||'', verified: user.role==='admin' ? true : false };
  users.push(newUser); saveUsers(users);
  return {success:true, message:'Registered.'};
}

function login(identifier, password){
  const users = getUsers();
  const u = users.find(x=> (x.email===identifier || x.schoolId===identifier) && x.password===password );
  if(!u) return {success:false, message:'Invalid credentials.'};
  writeLS('quickgig.currentUser', u);
  // redirect based on role
  const redirect = u.role==='student' ? '/student/dashboard.html' : (u.role==='client' ? '/client/dashboard.html' : '/admin/dashboard.html');
  return {success:true, redirect};
}

function currentUser(){ return readLS('quickgig.currentUser'); }
function logout(){
  localStorage.removeItem('quickgig.currentUser');
  window.location.href = '/index.html';
}
