# Dashboard Access Debug Guide

## Problem
When clicking on Dashboard, you're being redirected to the login page instead of seeing the Dashboard.

## Possible Causes

### 1. **Not Logged In as Space Owner**
The Dashboard is only accessible to users with `SPACE_OWNER` or `ADMIN` roles.

**Solution:** Make sure you're logged in with one of these accounts:
- `mike.johnson@example.com` / `password123` (Space Owner)
- `sarah.williams@example.com` / `password123` (Space Owner)
- `david.brown@example.com` / `password123` (Space Owner)
- `admin@parkspace.com` / `admin123` (Admin)

❌ **Don't use:**
- `john.doe@example.com` - This is a regular USER, not a Space Owner
- `jane.smith@example.com` - This is also a regular USER

### 2. **Check Browser Console**

Open your browser's Developer Tools (F12) and check:

1. **Console Tab** - Look for errors
2. **Network Tab** - Check if API calls are failing with 401/403 errors
3. **Application Tab** → Local Storage → Check these items:
   - `token` - Should exist
   - `user` - Should contain role: "SPACE_OWNER" or "ADMIN"

### 3. **Check LocalStorage Data**

In browser console, run:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
const user = JSON.parse(localStorage.getItem('user'));
console.log('User Role:', user?.role);
```

Expected output for Space Owner:
```
Token: eyJhbGc... (a long JWT token)
User: {"id":3,"fullName":"Mike Johnson","email":"mike.johnson@example.com","phone":"","role":"SPACE_OWNER"}
User Role: SPACE_OWNER
```

### 4. **Clear Browser Cache & Retry**

Sometimes old tokens cause issues:

1. Open browser console (F12)
2. Run:
   ```javascript
   localStorage.clear();
   ```
3. Refresh the page
4. Login again with Space Owner credentials

## Step-by-Step Testing

### Test 1: Login as Space Owner
1. Go to login page: `http://localhost:3000/login` (or your port)
2. Use credentials: `mike.johnson@example.com` / `password123`
3. After login, you should be redirected to home page
4. Check if you see "Dashboard" and "List Space" links in the navbar
5. If you see these links, click "Dashboard"
6. You should now see the Dashboard page with stats and bookings

### Test 2: Check Route Protection
1. Login as regular user: `john.doe@example.com` / `password123`
2. Check navbar - You should NOT see "Dashboard" or "List Space" links
3. Try to manually go to: `http://localhost:3000/dashboard`
4. You should be redirected to home page (not login) because you're authenticated but don't have the right role

### Test 3: Check Backend Connection
1. Login as Space Owner
2. Open browser DevTools (F12) → Network tab
3. Click Dashboard
4. You should see these API calls:
   - `GET /api/bookings/space-bookings?page=0&size=10`
   - `GET /api/spaces/owner/stats`
   - `GET /api/bookings/owner/stats`
5. All should return status 200

## Common Errors & Fixes

### Error: "Redirected to login immediately"
**Cause:** Not logged in or token expired
**Fix:**
1. Clear localStorage: `localStorage.clear()`
2. Login again

### Error: "Redirected to home page (not login)"
**Cause:** Logged in as regular USER, not SPACE_OWNER
**Fix:** Logout and login with Space Owner account

### Error: "Dashboard link not visible in navbar"
**Cause:** User role is not SPACE_OWNER or ADMIN
**Fix:** Check localStorage user role, login with correct account

### Error: "401 Unauthorized on API calls"
**Cause:** Token is invalid or expired
**Fix:** Logout and login again

### Error: "403 Forbidden on /owner/stats"
**Cause:** Backend endpoints might not be deployed or user doesn't have permission
**Fix:**
1. Make sure backend is running
2. Check backend console for errors
3. Verify the new endpoints are compiled (restart backend)

## Quick Fix Command

If nothing works, run this in browser console:
```javascript
// Clear everything
localStorage.clear();

// Refresh
location.reload();

// Then login again with: mike.johnson@example.com / password123
```

## Verify Backend is Running

Make sure:
1. Backend is running on `http://localhost:8080`
2. Sample data is loaded (check backend console for "=== Sample Data Loaded Successfully ===")
3. No errors in backend console

## Test Backend Directly

Test if the backend endpoints work:

### Using curl (in command prompt):
```bash
# First login to get token
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"mike.johnson@example.com\",\"password\":\"password123\"}"

# Copy the token from response, then test:
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:8080/api/spaces/owner/stats
```

Or test in browser console after logging in:
```javascript
fetch('http://localhost:8080/api/spaces/owner/stats', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(console.log);
```

Expected response:
```json
{
  "totalSpaces": 3,
  "availableSpaces": 3
}
```
