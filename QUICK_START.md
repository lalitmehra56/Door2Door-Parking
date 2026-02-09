# Quick Start Guide

Get started with the ParkSpace Parking Rental application in minutes!

## 🚀 Setup

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` and automatically load sample data.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000` (or similar port).

## 🎯 What You'll See

### Home Page
- Hero section with search functionality
- Featured parking spaces section (displays 6 sample spaces)
- Feature highlights and how-it-works guide
- Call-to-action sections

### Login Page
- Login form
- **Helpful tip box** showing test account credentials for easy access
- Link to registration page

## 🧪 Testing Different User Roles

### 1. Test as a Regular User
**Login:** `john.doe@example.com` / `password123`

**What you can do:**
- Browse all available parking spaces on the home page
- Search for spaces by location (try "New York", "Brooklyn", "Queens")
- Filter spaces by type (Standard, EV Charging, Motorcycle, etc.)
- Filter by price range
- View space details including amenities and rates
- Book a parking space (select dates/times)
- View your bookings on the "My Bookings" page
- Cancel pending or confirmed bookings
- Upgrade to Space Owner account

**Existing bookings for John:**
- 1 confirmed booking for tomorrow at Downtown Covered Parking
- 1 pending booking for Airport parking (5 days from now)
- 1 completed booking (past)

### 2. Test as a Space Owner
**Login:** `mike.johnson@example.com` / `password123`

**What you can do:**
- Access the Dashboard showing your statistics
- View all your listed parking spaces
- Create new parking spaces (will require admin approval)
- Edit existing spaces
- Change space status (Available, Maintenance, Inactive)
- View bookings for your spaces
- Confirm pending bookings
- Complete active bookings
- Cancel bookings if needed

**Mike's existing spaces:**
- Downtown Covered Parking (Manhattan) - $5/hr
- Airport Long-Term Parking (Queens) - $4/hr
- Times Square Premium Parking - $12/hr

### 3. Test as an Admin
**Login:** `admin@parkspace.com` / `admin123`

**What you can do:**
- View system-wide statistics
- Manage all users (view, change roles, delete)
- View all parking spaces
- **Approve or reject pending spaces** - Try approving "Queens Budget Parking"!
- Request more information from space owners
- View all bookings across the system
- Access comprehensive admin dashboard

## 🏢 Sample Parking Spaces

The database includes 8 diverse parking spaces:

| Space | Location | Rate | Features | Status |
|-------|----------|------|----------|--------|
| Downtown Covered | Manhattan | $5/hr | Covered, Security, 24/7 | ✅ Approved |
| Airport Long-Term | Queens | $4/hr | Covered, Security, 24/7 | ✅ Approved |
| Brooklyn Heights Driveway | Brooklyn | $3.50/hr | Outdoor | ✅ Approved |
| Manhattan EV Charging | Manhattan | $8/hr | EV Charging, Security, 24/7 | ✅ Approved |
| Bronx Motorcycle | Bronx | $2/hr | Security, 24/7 | ✅ Approved |
| Staten Island Garage | Staten Island | $4.50/hr | Covered, Security, 24/7 | ✅ Approved |
| Times Square Premium | Manhattan | $12/hr | Covered, EV, Security, 24/7 | ✅ Approved |
| Queens Budget | Queens | $2.50/hr | Outdoor | ⏳ Pending |

## 📝 Testing Workflows

### Workflow 1: Book a Parking Space
1. Login as John Doe (regular user)
2. Go to "Find Spaces" or search from home page
3. Click on any available space
4. Select start/end date and time
5. Enter vehicle details
6. Confirm booking
7. View it in "My Bookings"

### Workflow 2: Manage Bookings as Owner
1. Login as Mike Johnson (space owner)
2. Go to Dashboard
3. View "Incoming Bookings" section
4. See John's pending booking
5. Confirm or cancel the booking
6. Check updated statistics

### Workflow 3: Admin Approval Process
1. Login as Admin
2. Go to "Admin Panel" → "Pending Approvals"
3. See "Queens Budget Parking" waiting for approval
4. Review space details, documents, and amenities
5. Either:
   - Approve the space (add optional notes)
   - Reject with a reason
   - Request more information
6. Owner will be notified of the decision

### Workflow 4: Upgrade to Space Owner
1. Login as Jane Smith (regular user)
2. Notice the orange banner on home page: "Have a parking space to rent?"
3. Click "Become a Space Owner"
4. Confirm the upgrade
5. Account is now upgraded - you can list spaces!
6. Go to Dashboard and create your first space

## 🔍 Testing Search & Filters

### Search Examples
- **By city:** "New York", "Brooklyn", "Queens", "Bronx", "Staten Island"
- **By zip code:** "10001", "11430", "11201"
- **By street:** "Main Street", "Airport Road", "5th Avenue"

### Filter Examples
- **Type:** Try filtering by "EV_CHARGING" or "MOTORCYCLE"
- **Price:** Set min $2, max $6 to find budget options
- **Combine:** Search "Manhattan" + filter by "Standard" type

## 🎨 Frontend Features to Notice

### Home Page
- **Search bar** in hero section - try it!
- **Featured Spaces** section showing real sample data
- **Become Owner banner** (only shows for regular users when logged in)

### Login Page
- **Test credentials helper box** - no need to remember passwords!
- Quick links to registration

### Space List
- **Grid layout** with space cards
- **Filters panel** (click "Filters" button)
- **Pagination** (when more than 10 results)
- Each card shows key amenities with icons

### Dashboards
- **Owner dashboard:** Statistics, quick actions, bookings list
- **Admin dashboard:** System stats, user management, pending approvals

## 📊 Expected Data Counts

When the application starts with sample data:
- **Users:** 6 total (2 regular, 3 owners, 1 admin)
- **Parking Spaces:** 8 total (7 approved, 1 pending)
- **Bookings:** 6 total (various statuses)

## 🔄 Reset Sample Data

To reset and reload the sample data:

1. Stop the backend application
2. Delete the H2 database file (usually in the project root or target directory)
3. Restart the backend - sample data will reload automatically

## 💡 Tips

- **Passwords are simple** for testing: `password123` for all users, `admin123` for admin
- **Phone numbers are visible** in user profiles
- **All spaces have images** from Unsplash
- **Booking times are relative** to current date/time
- **Try all user roles** to see different perspectives
- **Admin can do everything** - use this account to explore all features

## 🎉 Ready to Go!

You now have a fully functional parking rental platform with realistic sample data. Explore the features, test different workflows, and see how everything works together!

For detailed information about the sample data, see [SAMPLE_DATA.md](SAMPLE_DATA.md).
