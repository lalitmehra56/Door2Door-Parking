# Test Dashboard Access - Step by Step

## Important: Follow These Steps Exactly

### Step 1: Make Sure Backend is Running
1. Open a terminal in the `backend` folder
2. Run: `mvn spring-boot:run`
3. Wait until you see "=== Sample Data Loaded Successfully ==="
4. Backend should be running on `http://localhost:8080`

### Step 2: Clear Browser Data
1. Open your browser (Chrome/Edge/Firefox)
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Run this command:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
5. The page will refresh

### Step 3: Login with Space Owner Account
1. Go to login page
2. Enter these credentials **EXACTLY**:
   - **Email:** `mike.johnson@example.com`
   - **Password:** `password123`
3. Click "Sign in"

### Step 4: Check Browser Console
After clicking "Sign in", check the console (F12). You should see:

```
Login response: {id: 3, fullName: "Mike Johnson", email: "mike.johnson@example.com", role: "SPACE_OWNER", token: "eyJ..."}
User role from backend: SPACE_OWNER
Logged in user object: {id: 3, fullName: "Mike Johnson", email: "mike.johnson@example.com", phone: "", role: "SPACE_OWNER"}
User role type: string
User saved to localStorage
Token: eyJhbGciOiJIUzI1NiJ9...
Login successful, redirecting...
```

**IMPORTANT:** Check that `role: "SPACE_OWNER"` is shown!

### Step 5: Check Navbar
After login, look at the navbar (top of page). You SHOULD see:
- ✅ "Dashboard" link
- ✅ "List Space" link
- ✅ Your name "Mike Johnson" with a dropdown

If you DON'T see "Dashboard" link, something is wrong with the role!

### Step 6: Click Dashboard
1. Click on "Dashboard" in the navbar
2. Check the console again - you should see:
   ```
   OwnerRoute - isLoading: false
   OwnerRoute - isAuthenticated: true
   OwnerRoute - user: {id: 3, fullName: "Mike Johnson", ...}
   OwnerRoute - user role: SPACE_OWNER
   OwnerRoute - Access granted
   ```

### Step 7: Dashboard Should Load
You should now see the Dashboard page with:
- Stats cards (Total Spaces, Available, Total Bookings, Active Bookings)
- Quick Links section
- Recent Bookings list

## Troubleshooting Based on Console Output

### If Console Shows: "User role from backend: USER"
**Problem:** You logged in with a regular user account, not a space owner.
**Solution:** 
- Make sure you typed `mike.johnson@example.com` (with the dot between mike and johnson)
- NOT `john.doe@example.com` or `jane.smith@example.com`

### If Console Shows: "OwnerRoute - Not authenticated, redirecting to login"
**Problem:** Token is not being saved or retrieved.
**Solution:**
1. Clear localStorage again
2. Check if backend is running
3. Try login again

### If Console Shows: "OwnerRoute - User role is not SPACE_OWNER or ADMIN, role is: USER"
**Problem:** You're logged in as a regular user.
**Solution:**
- Logout (click on your name → Logout)
- Clear localStorage: `localStorage.clear()`
- Login with `mike.johnson@example.com`

### If You See Network Errors
**Problem:** Backend is not running or wrong port.
**Solution:**
1. Check backend terminal - should show it's running
2. Try opening: `http://localhost:8080/h2-console` in browser
3. If it doesn't open, backend is not running

### If Login Button Does Nothing
**Problem:** Form validation or API error.
**Solution:**
1. Check console for errors (red text)
2. Check Network tab in DevTools
3. Look for API call to `/api/auth/login`
4. Check the response

## Manual Verification

After login, you can manually verify in console:

```javascript
// Check token
console.log('Token:', localStorage.getItem('token'));

// Check user
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('Role:', user.role);

// Should show:
// Token: eyJhbGciOiJIUzI1NiJ9... (a long string)
// User: {id: 3, fullName: "Mike Johnson", email: "mike.johnson@example.com", phone: "", role: "SPACE_OWNER"}
// Role: SPACE_OWNER
```

## Common Mistakes

❌ **Using wrong email:**
- john.doe@example.com ← This is a USER, not owner!
- jane.smith@example.com ← This is also a USER!

✅ **Correct emails for space owners:**
- mike.johnson@example.com ✓
- sarah.williams@example.com ✓
- david.brown@example.com ✓
- admin@parkspace.com ✓ (admin has all access)

## Still Not Working?

If you followed all steps and it's still not working, provide me with:

1. **Console output** after login (copy all console.log messages)
2. **Network tab** - Check if `/api/auth/login` request succeeded
3. **Application tab** → Local Storage → show what's stored in `token` and `user`
4. **Backend console** - Check if backend shows any errors

## Quick Reset Command

If everything seems broken, run this in browser console:

```javascript
// Clear everything and start fresh
localStorage.clear();
sessionStorage.clear();
console.clear();
alert('Storage cleared! Now reload and try logging in again.');
location.reload();
```

Then follow the steps from the beginning.
