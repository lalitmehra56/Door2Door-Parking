# Test: Parking Space Creation & Display

## What You Want to Test

**Goal:** When a space owner creates a parking space, it should immediately appear on the "Find Parking" page for renters to see and book.

## How It Works

### Backend Flow:
1. Space owner fills form and submits
2. Backend creates space with:
   - `status = AVAILABLE`
   - `approvalStatus = APPROVED`
3. Space is saved to database
4. Space is immediately searchable

### Frontend Flow:
1. "Find Parking" page calls `GET /api/spaces/available`
2. Backend returns all spaces where `status = 'AVAILABLE'`
3. Spaces are displayed as cards
4. Each card shows the data the owner entered

## Step-by-Step Test

### Step 1: Login as Space Owner
1. Go to login page
2. Use credentials: `mike.johnson@example.com` / `password123`
3. You should see "Dashboard" and "List Space" in navbar

### Step 2: Create a New Parking Space
1. Click **"List Space"** or **"Dashboard" → "Add New Space"**
2. Fill in ALL required fields:
   - **Title:** "Test Downtown Parking"
   - **Description:** "My test parking space"
   - **Address:** "456 Test Street"
   - **City:** "Test City"
   - **State:** "NY"
   - **ZIP:** "10002"
   - **Hourly Rate:** 8.00
   - **Space Type:** Standard
   - **Vehicle Type:** Car
3. **Upload an image** (important!)
4. Set features (covered, 24/7, etc.) if desired
5. Click **"Create Space"** button

### Step 3: Verify Creation
After clicking "Create Space":
1. You should be redirected to **"My Spaces"** page
2. You should see your new space in the list
3. Status should show as **"Available"**

### Step 4: Check "Find Parking" Page
1. **Logout** or open a **new incognito window**
2. Go to the home page
3. Click **"Find Parking"** in navbar (or from home page)
4. **Your new space should appear!**

### Step 5: Verify Display
On the "Find Parking" page, you should see:

✅ **Card shows:**
- Image you uploaded
- Title: "Test Downtown Parking"
- Address: "456 Test Street, Test City"
- Price: $8.00/hour
- Space type badge: "Standard"
- Any features you selected (24/7, Security, etc.)

### Step 6: Test Search
1. In the search box, type "Test City"
2. Your space should appear in search results
3. Try searching by:
   - City name
   - Address
   - ZIP code

### Step 7: Test Filters
1. Click **"Filters"** button
2. Filter by:
   - **Space Type:** Select "Standard" → Your space appears
   - **Price Range:** Set min $5, max $10 → Your space appears

## Expected Results

✅ **Success Indicators:**
- Space created successfully
- Redirected to "My Spaces"
- Space visible in owner's dashboard
- **Space immediately appears on "Find Parking" page**
- Card displays all entered information
- Image is visible
- Search and filters work

❌ **If Space Doesn't Appear:**

### Check 1: Backend Status
Look at backend console logs when creating space:
- Should see: `status = AVAILABLE`
- Should see: `approvalStatus = APPROVED`

### Check 2: Database
If backend is running, the space should be in database with:
- `status` = "AVAILABLE"
- `approval_status` = "APPROVED"

### Check 3: API Response
Open browser DevTools → Network tab:
1. Go to "Find Parking" page
2. Look for: `GET /api/spaces/available?page=0&size=10`
3. Check Response → Should include your new space

### Check 4: Frontend Console
Open browser console (F12):
- Look for any errors
- Check if spaces are being fetched
- Verify data structure

## Troubleshooting

### Problem: Space not showing on "Find Parking"

**Possible Causes:**

1. **Backend not restarted**
   - Solution: Restart backend after code changes

2. **Status not AVAILABLE**
   - Solution: Check `ParkingSpaceService.createSpace()`
   - Should have: `space.setStatus(ParkingSpace.SpaceStatus.AVAILABLE)`

3. **Frontend cache**
   - Solution: Hard refresh (Ctrl+Shift+R) or clear cache

4. **Image upload failed**
   - Solution: Check if image was uploaded successfully
   - Check console for errors

5. **Database issue**
   - Solution: Check if H2 database is running
   - Verify data was saved

### Problem: Card shows wrong data

**Check:**
- Form submission worked correctly
- All fields were filled
- Image was converted to base64
- Backend saved all fields

### Problem: Image not displaying

**Causes:**
- Image file too large (>5MB might cause issues)
- Base64 conversion failed
- Image format not supported

**Solution:**
- Use smaller image (<500KB recommended)
- Use JPG or PNG format
- Check console for errors

## Quick Verification Commands

### Check backend is running:
```bash
# Try accessing:
http://localhost:8080/h2-console
```

### Check API directly:
Open browser and go to:
```
http://localhost:8080/api/spaces/available?page=0&size=10
```

Should see JSON with your spaces.

### Check frontend:
In browser console:
```javascript
fetch('http://localhost:8080/api/spaces/available?page=0&size=10', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log('Spaces:', data.content));
```

## Summary

**The system is already configured correctly!**

When you create a parking space:
1. ✅ It's automatically set to AVAILABLE
2. ✅ It's automatically APPROVED
3. ✅ It appears immediately on "Find Parking"
4. ✅ All data you entered is shown in the card
5. ✅ Image is displayed
6. ✅ Searchable and filterable

**Just make sure:**
- Backend is running
- You fill all required fields
- You upload an image
- You refresh the "Find Parking" page

Everything should work! 🎉
