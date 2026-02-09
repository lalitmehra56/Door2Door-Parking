# Separate Login System - User Guide

## Overview

The ParkSpace application now features **separate login pages** for two distinct user types:

1. **Users** - People who need to find and rent parking spaces
2. **Space Owners (Renters)** - People who list and rent out their parking spaces

## Login Pages

### 🚗 User Login (`/user-login`)

**Purpose:** For customers who want to find and book parking spaces

**Features:**
- Blue-themed interface with UserCircle icon
- Redirects to `/spaces` (Find Parking page) after successful login
- Can be accessed by users with role: `USER`, `SPACE_OWNER`, or `ADMIN`
- Demo account: `john.doe@example.com / password123`

**Access:**
- From homepage: Click "Sign in as User" in the "Get Started Today" section
- Direct URL: `http://localhost:3000/user-login`

### 🏢 Renter Login (`/renter-login`)

**Purpose:** For space owners who want to manage their parking spaces and view bookings

**Features:**
- Orange-themed interface with Building2 icon
- Redirects to `/dashboard` (Owner Dashboard) after successful login
- Only accessible by users with role: `SPACE_OWNER` or `ADMIN`
- Demo account: `mike.johnson@example.com / password123`

**Access:**
- From homepage: Click "Sign in as Space Owner" in the "Get Started Today" section
- Direct URL: `http://localhost:3000/renter-login`

## Role Validation

Each login page validates the user's role after authentication:

### User Login
```typescript
if (userData.role === 'USER' || userData.role === 'SPACE_OWNER' || userData.role === 'ADMIN') {
  navigate('/spaces'); // Find parking
} else {
  setError('This account type cannot access user features...');
}
```

### Renter Login
```typescript
if (userData.role === 'SPACE_OWNER' || userData.role === 'ADMIN') {
  navigate('/dashboard'); // Owner dashboard
} else {
  setError('This account is not a space owner...');
}
```

## Home Page Integration

The home page now displays a **"Get Started Today"** section (only for non-authenticated users) with two cards:

### Card 1: I Need Parking
- **Icon:** UserCircle (blue)
- **Description:** Find and book available parking spaces
- **Button:** "Sign in as User" → `/user-login`
- **Color scheme:** Blue

### Card 2: I Have Parking
- **Icon:** Building2 (orange)
- **Description:** List parking space and earn income
- **Button:** "Sign in as Space Owner" → `/renter-login`
- **Color scheme:** Orange

This section only appears when `!isAuthenticated` (user is not logged in).

## User Roles

### USER
- Can browse parking spaces
- Can book parking spaces
- Can view their own bookings
- **Cannot** create or manage parking spaces
- **Login via:** `/user-login`

### SPACE_OWNER
- Has all USER permissions
- Can create parking spaces
- Can view their dashboard with stats
- Can manage their own spaces
- Can view bookings for their spaces
- **Login via:** `/renter-login` (or `/user-login` if they want to book parking)

### ADMIN
- Has all SPACE_OWNER permissions
- Can access admin panel
- Can view all data
- **Login via:** Either login page

## Navigation Flow

### For Regular Users:
1. Visit homepage
2. Click "Sign in as User" (blue button)
3. Login with user credentials
4. Redirected to `/spaces` (Find Parking)
5. Browse and book parking spaces

### For Space Owners:
1. Visit homepage
2. Click "Sign in as Space Owner" (orange button)
3. Login with owner credentials
4. Redirected to `/dashboard` (Owner Dashboard)
5. View stats, manage spaces, view bookings

### For Users Who Want to Become Owners:
1. Login as regular user
2. See "Become a Space Owner" banner on homepage
3. Click "Become a Space Owner" button
4. Account upgraded to SPACE_OWNER role
5. Can now access `/renter-login` and owner features

## Cross-Login Links

Each login page has a link to switch to the other:

**On User Login page:**
```
Have a parking space to rent?
Sign in as Space Owner →
```

**On Renter Login page:**
```
Looking for parking?
Sign in as User →
```

## Demo Accounts

### User Account
- **Email:** john.doe@example.com
- **Password:** password123
- **Role:** USER
- **Use for:** Booking parking spaces

### Space Owner Account
- **Email:** mike.johnson@example.com
- **Password:** password123
- **Role:** SPACE_OWNER
- **Use for:** Managing parking spaces

### Admin Account
- **Email:** admin@parkspace.com
- **Password:** admin123
- **Role:** ADMIN
- **Use for:** Full system access

## Files Changed

### New Files Created:
1. `frontend/src/pages/UserLogin.tsx` - User login page
2. `frontend/src/pages/RenterLogin.tsx` - Renter login page

### Modified Files:
1. `frontend/src/App.tsx` - Added routes for new login pages
2. `frontend/src/pages/Home.tsx` - Added "Get Started Today" section with login options
3. `frontend/src/context/AuthContext.tsx` - Updated login function to return User object

## Routes

```typescript
<Route path="/login" element={<Login />} />          // Original (generic)
<Route path="/user-login" element={<UserLogin />} /> // New (for users)
<Route path="/renter-login" element={<RenterLogin />} /> // New (for owners)
<Route path="/register" element={<Register />} />    // Existing registration
```

## Benefits

1. **Clear User Intent**: Users immediately know which login to use
2. **Better UX**: Appropriate redirect based on user type
3. **Role Validation**: Prevents wrong account types from accessing incorrect features
4. **Visual Distinction**: 
   - Blue = Users looking for parking
   - Orange = Owners renting out spaces
5. **Easy Switching**: Links between login pages for users who clicked wrong one

## Testing

### Test User Login:
1. Go to `http://localhost:3000/user-login`
2. Enter: `john.doe@example.com / password123`
3. Click "Sign in to Find Parking"
4. Should redirect to `/spaces`
5. Should see parking spaces available for booking

### Test Renter Login:
1. Go to `http://localhost:3000/renter-login`
2. Enter: `mike.johnson@example.com / password123`
3. Click "Sign in as Space Owner"
4. Should redirect to `/dashboard`
5. Should see owner dashboard with stats

### Test Role Validation:
1. Try logging into **User Login** with owner account → Should work (owners can be users)
2. Try logging into **Renter Login** with regular user account → Should show error
3. Error message: "This account is not a space owner. Please upgrade your account or use user login."

## Original `/login` Route

The original `/login` route still exists and redirects to homepage after login. It's a generic login that doesn't do role-based validation. The new separate login pages provide a better user experience.

## Summary

This separate login system provides a clear, user-friendly way for different user types to access the appropriate features of the ParkSpace application. Users looking for parking use the blue "User Login", while space owners use the orange "Renter Login".
