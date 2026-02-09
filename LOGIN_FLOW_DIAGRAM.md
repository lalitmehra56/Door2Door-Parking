# Login Flow Diagram

## Visual Flow Chart

```
                        HOMEPAGE (/)
                             |
                             |
              ┌──────────────┴──────────────┐
              │                             │
              │   Not Logged In?            │
              │   Show "Get Started Today"  │
              │                             │
              └──────────────┬──────────────┘
                             |
              ┌──────────────┴──────────────┐
              |                             |
      ┌───────▼───────┐            ┌───────▼───────┐
      │   👤 User      │            │  🏢 Renter    │
      │   Login Card   │            │  Login Card   │
      │   (Blue)       │            │  (Orange)     │
      └───────┬────────┘            └───────┬───────┘
              |                             |
              |                             |
      ┌───────▼────────┐           ┌────────▼───────┐
      │  /user-login   │           │ /renter-login  │
      │                │           │                │
      │ Blue Theme     │           │ Orange Theme   │
      │ UserCircle     │           │ Building2      │
      │                │           │                │
      │ john.doe@...   │           │ mike.john...   │
      │ password123    │           │ password123    │
      └───────┬────────┘           └────────┬───────┘
              |                             |
              |                             |
      ┌───────▼────────┐           ┌────────▼───────┐
      │ Login Success  │           │ Login Success  │
      │                │           │                │
      │ Check Role:    │           │ Check Role:    │
      │ USER, OWNER,   │           │ OWNER, ADMIN   │
      │ or ADMIN?      │           │ only           │
      └───────┬────────┘           └────────┬───────┘
              |                             |
              ✓                             ✓
      ┌───────▼────────┐           ┌────────▼───────┐
      │   /spaces      │           │  /dashboard    │
      │                │           │                │
      │ Find Parking   │           │ Owner Stats    │
      │ Browse Spaces  │           │ Manage Spaces  │
      │ Book Spaces    │           │ View Bookings  │
      └────────────────┘           └────────────────┘
```

## User Journey Map

### 🚗 User Journey (Need Parking)

```
Step 1: Homepage
   └─> See blue card "I Need Parking"
   
Step 2: Click "Sign in as User"
   └─> Navigate to /user-login
   
Step 3: Blue Login Page
   ├─> Icon: UserCircle (blue)
   ├─> Title: "Find Parking"
   ├─> Subtitle: "Sign in to book parking spaces"
   └─> Demo account shown: john.doe@example.com
   
Step 4: Enter Credentials
   └─> Email: john.doe@example.com
   └─> Password: password123
   
Step 5: Submit
   └─> Validate role (USER/SPACE_OWNER/ADMIN)
   
Step 6: Success
   └─> Redirect to /spaces (Find Parking page)
   
Step 7: Browse & Book
   └─> View available parking spaces
   └─> Book parking spaces
```

### 🏢 Renter Journey (List Parking)

```
Step 1: Homepage
   └─> See orange card "I Have Parking"
   
Step 2: Click "Sign in as Space Owner"
   └─> Navigate to /renter-login
   
Step 3: Orange Login Page
   ├─> Icon: Building2 (orange)
   ├─> Title: "List Your Space"
   ├─> Subtitle: "Sign in to manage your parking spaces"
   └─> Demo account shown: mike.johnson@example.com
   
Step 4: Enter Credentials
   └─> Email: mike.johnson@example.com
   └─> Password: password123
   
Step 5: Submit
   └─> Validate role (SPACE_OWNER or ADMIN only)
   
Step 6: Success
   └─> Redirect to /dashboard (Owner Dashboard)
   
Step 7: Manage Spaces
   └─> View statistics
   └─> Create new spaces
   └─> Manage existing spaces
   └─> View bookings
```

## Role Permission Matrix

```
┌──────────────────┬──────────┬──────────────┬───────────┐
│ Feature          │   USER   │ SPACE_OWNER  │   ADMIN   │
├──────────────────┼──────────┼──────────────┼───────────┤
│ Browse Spaces    │    ✓     │      ✓       │     ✓     │
│ Book Spaces      │    ✓     │      ✓       │     ✓     │
│ View My Bookings │    ✓     │      ✓       │     ✓     │
│ Create Spaces    │    ✗     │      ✓       │     ✓     │
│ Manage Spaces    │    ✗     │      ✓       │     ✓     │
│ Owner Dashboard  │    ✗     │      ✓       │     ✓     │
│ View All Data    │    ✗     │      ✗       │     ✓     │
│ Admin Panel      │    ✗     │      ✗       │     ✓     │
├──────────────────┼──────────┼──────────────┼───────────┤
│ User Login       │    ✓     │      ✓       │     ✓     │
│ Renter Login     │    ✗     │      ✓       │     ✓     │
└──────────────────┴──────────┴──────────────┴───────────┘

Legend:
✓ = Can access
✗ = Cannot access
```

## Login Page Comparison

```
┌─────────────────────────────┬─────────────────────────────┐
│       USER LOGIN            │      RENTER LOGIN           │
├─────────────────────────────┼─────────────────────────────┤
│ Route: /user-login          │ Route: /renter-login        │
│ Color: Blue (#2563EB)       │ Color: Orange (#EA580C)     │
│ Background: Blue gradient   │ Background: Orange gradient │
│ Icon: UserCircle            │ Icon: Building2             │
│ Title: "Find Parking"       │ Title: "List Your Space"    │
│                             │                             │
│ Subtitle:                   │ Subtitle:                   │
│ "Sign in to book parking    │ "Sign in to manage your     │
│  spaces"                    │  parking spaces"            │
│                             │                             │
│ Demo Account:               │ Demo Account:               │
│ john.doe@example.com        │ mike.johnson@example.com    │
│ password123                 │ password123                 │
│                             │                             │
│ Button:                     │ Button:                     │
│ "Sign in to Find Parking"   │ "Sign in as Space Owner"    │
│                             │                             │
│ Redirect After Login:       │ Redirect After Login:       │
│ → /spaces                   │ → /dashboard                │
│                             │                             │
│ Accepts Roles:              │ Accepts Roles:              │
│ • USER                      │ • SPACE_OWNER               │
│ • SPACE_OWNER               │ • ADMIN                     │
│ • ADMIN                     │                             │
│                             │                             │
│ Switch Link:                │ Switch Link:                │
│ "Sign in as Space Owner →"  │ "Sign in as User →"         │
└─────────────────────────────┴─────────────────────────────┘
```

## Error Handling Flow

### User Login Error
```
Try to login with role validation
   |
   ├─> Success (USER/SPACE_OWNER/ADMIN)
   │   └─> Navigate to /spaces
   │
   └─> Invalid credentials
       └─> Show error: "Invalid email or password"
```

### Renter Login Error
```
Try to login with role validation
   |
   ├─> Success (SPACE_OWNER/ADMIN)
   │   └─> Navigate to /dashboard
   |
   ├─> Success but USER role
   │   └─> Show error: "This account is not a space owner..."
   │
   └─> Invalid credentials
       └─> Show error: "Invalid email or password"
```

## Homepage Cards State

```
┌──────────────────────────────────────────────┐
│            HOMEPAGE                          │
├──────────────────────────────────────────────┤
│                                              │
│  IF NOT AUTHENTICATED:                       │
│  ┌────────────────────────────────────────┐ │
│  │  "Get Started Today" Section           │ │
│  │                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ User Login   │  │ Renter Login │  │ │
│  │  │   (Blue)     │  │  (Orange)    │  │ │
│  │  └──────────────┘  └──────────────┘  │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  IF AUTHENTICATED:                           │
│  [Section Hidden - User already logged in]   │
│                                              │
└──────────────────────────────────────────────┘
```

## Account Upgrade Flow

```
USER wants to become SPACE_OWNER:

1. Login as USER via /user-login
   └─> Redirected to /spaces
   
2. Navigate to Homepage (/)
   └─> See orange banner: "Become a Space Owner"
   
3. Click "Become a Space Owner"
   └─> Account role upgraded: USER → SPACE_OWNER
   
4. Now can access /renter-login
   └─> Login via /renter-login
   └─> Access /dashboard and owner features
```

## Technology Stack

```
Frontend:
├── React + TypeScript
├── React Router (routing)
├── Lucide React (icons)
└── Tailwind CSS (styling)

Authentication:
├── JWT tokens
├── localStorage (token storage)
└── Role-based access control

Pages:
├── UserLogin.tsx (new)
├── RenterLogin.tsx (new)
├── Login.tsx (original, still exists)
├── Register.tsx
└── Home.tsx (updated with cards)
```

## Summary

This visual flow shows how users navigate through the separate login system based on their needs:

- **Blue path** = Users looking for parking
- **Orange path** = Owners listing parking spaces

Each path has its own themed login page with appropriate redirects and role validation! 🎉
