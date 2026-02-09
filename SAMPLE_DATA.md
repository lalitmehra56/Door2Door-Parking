# Sample Data Documentation

This document describes the sample data that is automatically loaded into the application when it first starts.

## Overview

The application includes a `DataLoader` component that automatically populates the database with sample data on first startup. This allows you to test all features of the application immediately without manual data entry.

## Test Accounts

### Regular Users (Renters)
These accounts can browse and book parking spaces:

| Name | Email | Password | Phone |
|------|-------|----------|-------|
| John Doe | john.doe@example.com | password123 | 1234567890 |
| Jane Smith | jane.smith@example.com | password123 | 9876543210 |

### Space Owners
These accounts can list parking spaces and manage bookings:

| Name | Email | Password | Phone |
|------|-------|----------|-------|
| Mike Johnson | mike.johnson@example.com | password123 | 5551234567 |
| Sarah Williams | sarah.williams@example.com | password123 | 5559876543 |
| David Brown | david.brown@example.com | password123 | 5555551234 |

### Admin
This account has full administrative access:

| Name | Email | Password | Phone |
|------|-------|----------|-------|
| Admin User | admin@parkspace.com | admin123 | 5550000000 |

## Parking Spaces

The database includes 8 sample parking spaces across New York City:

### 1. Downtown Covered Parking (Manhattan)
- **Owner:** Mike Johnson
- **Location:** 123 Main Street, New York, NY 10001
- **Type:** Standard (Car)
- **Rates:** $5/hr, $30/day, $400/month
- **Features:** Covered, Security Cameras, 24/7 Access
- **Status:** Approved & Available

### 2. Airport Long-Term Parking (Queens)
- **Owner:** Mike Johnson
- **Location:** 456 Airport Road, Queens, NY 11430
- **Type:** Large (Any Vehicle)
- **Rates:** $4/hr, $25/day, $350/month
- **Features:** Covered, Security Cameras, 24/7 Access
- **Status:** Approved & Available

### 3. Brooklyn Heights Private Driveway
- **Owner:** Sarah Williams
- **Location:** 789 Brooklyn Avenue, Brooklyn, NY 11201
- **Type:** Standard (Car)
- **Rates:** $3.50/hr, $20/day, $250/month
- **Features:** Outdoor parking
- **Status:** Approved & Available

### 4. Manhattan EV Charging Station
- **Owner:** Sarah Williams
- **Location:** 321 5th Avenue, New York, NY 10016
- **Type:** EV Charging (Car)
- **Rates:** $8/hr, $50/day, $600/month
- **Features:** Covered, EV Charging, Security Cameras, 24/7 Access
- **Status:** Approved & Available

### 5. Bronx Motorcycle Parking
- **Owner:** David Brown
- **Location:** 555 Bronx Boulevard, Bronx, NY 10451
- **Type:** Motorcycle
- **Rates:** $2/hr, $10/day, $100/month
- **Features:** Security Cameras, 24/7 Access
- **Status:** Approved & Available

### 6. Staten Island Garage Space
- **Owner:** David Brown
- **Location:** 100 Bay Street, Staten Island, NY 10301
- **Type:** Standard (Car)
- **Rates:** $4.50/hr, $28/day, $380/month
- **Features:** Covered, Security Cameras, 24/7 Access
- **Status:** Approved & Available

### 7. Times Square Premium Parking
- **Owner:** Mike Johnson
- **Location:** 200 W 42nd Street, New York, NY 10036
- **Type:** Standard (Any Vehicle)
- **Rates:** $12/hr, $80/day, $900/month
- **Features:** Covered, EV Charging, Security Cameras, 24/7 Access
- **Status:** Approved & Available

### 8. Queens Budget Parking
- **Owner:** Sarah Williams
- **Location:** 300 Queens Boulevard, Queens, NY 11373
- **Type:** Compact (Car)
- **Rates:** $2.50/hr, $15/day, $180/month
- **Features:** Outdoor parking
- **Status:** Pending Approval (for testing admin approval workflow)

## Bookings

The database includes 6 sample bookings with various statuses:

### 1. Confirmed Booking
- **Renter:** John Doe
- **Space:** Downtown Covered Parking
- **Time:** Tomorrow, 8 hours
- **Amount:** $40.00
- **Status:** Confirmed, Paid
- **Vehicle:** ABC1234 (Sedan)

### 2. Pending Booking
- **Renter:** John Doe
- **Space:** Airport Long-Term Parking
- **Time:** 5 days from now, 5 days duration
- **Amount:** $125.00
- **Status:** Pending
- **Vehicle:** ABC1234 (Sedan)
- **Notes:** Traveling for vacation

### 3. Active Booking
- **Renter:** Jane Smith
- **Space:** Brooklyn Heights Private Driveway
- **Time:** Started 2 days ago, ends in 3 days
- **Amount:** $100.00
- **Status:** Active, Paid
- **Vehicle:** XYZ5678 (SUV)
- **Notes:** Extended stay

### 4. Confirmed EV Charging
- **Renter:** Jane Smith
- **Space:** Manhattan EV Charging Station
- **Time:** 2 days from now, 8 hours
- **Amount:** $64.00
- **Status:** Confirmed, Paid
- **Vehicle:** XYZ5678 (Tesla Model 3)

### 5. Completed Booking
- **Renter:** John Doe
- **Space:** Times Square Premium Parking
- **Time:** 5 days ago, 6 hours
- **Amount:** $72.00
- **Status:** Completed, Paid
- **Vehicle:** ABC1234 (Sedan)
- **Notes:** Theater visit

### 6. Cancelled Booking
- **Renter:** Jane Smith
- **Space:** Downtown Covered Parking
- **Time:** 10 days ago, 4 hours
- **Amount:** $20.00
- **Status:** Cancelled, Refunded
- **Vehicle:** XYZ5678 (SUV)
- **Reason:** Plans changed

## Features to Test

With this sample data, you can test:

### As a Regular User (john.doe@example.com)
- Browse available parking spaces
- Search for spaces by location
- Filter by price range and space type
- View space details
- Create new bookings
- View and manage your bookings
- Cancel bookings
- Upgrade account to Space Owner

### As a Space Owner (mike.johnson@example.com)
- View all your listed spaces
- Create new parking spaces
- Edit existing spaces
- Manage space status (Available/Maintenance/Inactive)
- View bookings for your spaces
- Confirm, complete, or cancel bookings
- View dashboard with statistics

### As an Admin (admin@parkspace.com)
- View all users, spaces, and bookings
- Approve or reject pending parking spaces
- Manage user accounts
- View system-wide statistics
- Handle approval workflows

## Resetting the Data

The `DataLoader` only runs when the database is empty. To reload the sample data:

1. Stop the backend application
2. Delete the database file (H2 database in development)
3. Restart the backend application

The data loader will detect the empty database and automatically populate it with sample data again.

## Frontend Display

The sample data is displayed in the frontend:

- **Home Page:** Features a "Featured Spaces" section showing 6 available parking spaces
- **Login Page:** Shows a helper box with test account credentials
- **Spaces List:** All approved spaces are visible and searchable
- **User Dashboards:** Show relevant bookings and spaces for each user type
- **Admin Panel:** Shows pending approval for "Queens Budget Parking"

## Notes

- All passwords use bcrypt encryption
- Timestamps are relative to the current date/time
- Geographic coordinates are real NYC locations
- Image URLs point to placeholder images from Unsplash
- The data represents realistic parking scenarios in New York City
