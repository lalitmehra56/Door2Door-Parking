// Debug script to check authentication state
// Open browser console (F12) and paste this code

console.log('=== Authentication Debug ===');

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

if (!token) {
  console.log('❌ NOT LOGGED IN - No token found');
  console.log('Solution: Login or Register first');
} else {
  console.log('✅ Token exists:', token.substring(0, 20) + '...');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log('✅ User data found:');
    console.log('   Name:', user.fullName);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   ID:', user.id);
    
    if (user.role === 'USER') {
      console.log('⚠️ You are logged in as a regular USER');
      console.log('Solution: Click "Become a Space Owner" button on the home page');
      console.log('         OR register a new account and check "I want to list parking spaces"');
    } else if (user.role === 'SPACE_OWNER' || user.role === 'ADMIN') {
      console.log('✅ You have permission to access Dashboard');
      console.log('   You should be able to see the Dashboard link in the navbar');
    }
  } else {
    console.log('❌ Token exists but no user data');
    console.log('Solution: Logout and login again');
  }
}

console.log('========================');
