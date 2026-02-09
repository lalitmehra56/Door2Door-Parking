# Script to add sample parking space data via REST API
# Make sure backend is running on port 8080 before running this script

$baseUrl = "http://localhost:8080/api"

Write-Host "🚀 Adding sample data to ParkSpace..." -ForegroundColor Cyan

# Create sample owner accounts
$owners = @(
    @{fullName="John Smith"; email="john@example.com"; phone="1234567890"; password="password123"},
    @{fullName="Sarah Johnson"; email="sarah@example.com"; phone="0987654321"; password="password123"},
    @{fullName="Mike Davis"; email="mike@example.com"; phone="5551234567"; password="password123"}
)

$tokens = @()

foreach ($owner in $owners) {
    try {
        # Register as owner
        $body = @{
            fullName = $owner.fullName
            email = $owner.email
            phone = $owner.phone
            password = $owner.password
        } | ConvertTo-Json

        Invoke-RestMethod -Uri "$baseUrl/auth/register/owner" -Method Post -Body $body -ContentType "application/json" | Out-Null
        
        # Login to get token
        $loginBody = @{
            email = $owner.email
            password = $owner.password
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
        $tokens += $response.token
        
        Write-Host "✅ Created owner: $($owner.fullName)" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Owner $($owner.email) may already exist, trying to login..." -ForegroundColor Yellow
        try {
            $loginBody = @{
                email = $owner.email
                password = $owner.password
            } | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
            $tokens += $response.token
            Write-Host "✅ Logged in as: $($owner.fullName)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Failed to create/login owner: $($owner.fullName)" -ForegroundColor Red
        }
    }
}

# Sample parking spaces (Indian locations and pricing in ₹)
$spaces = @(
    @{
        title = "Connaught Place Covered Parking"
        description = "Secure covered parking space in the heart of CP. Perfect for daily commuters and shoppers."
        address = "23 Rajiv Chowk"
        city = "New Delhi"
        state = "Delhi"
        zipCode = "110001"
        latitude = 28.6315
        longitude = 77.2167
        hourlyRate = 50.0
        dailyRate = 400.0
        monthlyRate = 8000.0
        spaceType = "STANDARD"
        vehicleType = "CAR"
        covered = $true
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 0
    },
    @{
        title = "Airport Long-Term Parking"
        description = "Convenient parking near IGI Airport Terminal 3 with 24/7 access and security cameras."
        address = "Airport Road, Mahipalpur"
        city = "New Delhi"
        state = "Delhi"
        zipCode = "110037"
        latitude = 28.5562
        longitude = 77.1000
        hourlyRate = 40.0
        dailyRate = 300.0
        monthlyRate = 6000.0
        spaceType = "LARGE"
        vehicleType = "ANY"
        covered = $false
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 0
    },
    @{
        title = "EV Charging Station Parking"
        description = "Electric vehicle charging parking spot with fast charger included. Eco-friendly parking."
        address = "12 MG Road"
        city = "Bangalore"
        state = "Karnataka"
        zipCode = "560001"
        latitude = 12.9716
        longitude = 77.5946
        hourlyRate = 80.0
        dailyRate = 600.0
        monthlyRate = 12000.0
        spaceType = "EV_CHARGING"
        vehicleType = "CAR"
        covered = $true
        hasElectricCharging = $true
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 1
    },
    @{
        title = "Compact City Centre Parking"
        description = "Small parking space perfect for compact cars in busy Bandra area."
        address = "45 Linking Road"
        city = "Mumbai"
        state = "Maharashtra"
        zipCode = "400050"
        latitude = 19.0596
        longitude = 72.8295
        hourlyRate = 60.0
        dailyRate = 450.0
        monthlyRate = 9000.0
        spaceType = "COMPACT"
        vehicleType = "CAR"
        covered = $false
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $false
        tokenIndex = 1
    },
    @{
        title = "Two-Wheeler Parking Spot"
        description = "Dedicated motorcycle/scooter parking in a secure gated society."
        address = "78 Sector 18"
        city = "Noida"
        state = "Uttar Pradesh"
        zipCode = "201301"
        latitude = 28.5355
        longitude = 77.3910
        hourlyRate = 20.0
        dailyRate = 100.0
        monthlyRate = 2000.0
        spaceType = "MOTORCYCLE"
        vehicleType = "MOTORCYCLE"
        covered = $false
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 2
    },
    @{
        title = "Handicap Accessible Parking"
        description = "Wheelchair accessible parking space close to building entrance. Ground floor access."
        address = "34 Park Street"
        city = "Kolkata"
        state = "West Bengal"
        zipCode = "700016"
        latitude = 22.5535
        longitude = 88.3506
        hourlyRate = 40.0
        dailyRate = 300.0
        monthlyRate = 6000.0
        spaceType = "HANDICAP"
        vehicleType = "CAR"
        covered = $true
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 2
    },
    @{
        title = "Residential Society Parking"
        description = "Private parking in gated society. Quiet and safe neighborhood with 24/7 security."
        address = "Plot 67, DLF Phase 3"
        city = "Gurugram"
        state = "Haryana"
        zipCode = "122002"
        latitude = 28.4595
        longitude = 77.0266
        hourlyRate = 35.0
        dailyRate = 250.0
        monthlyRate = 5000.0
        spaceType = "STANDARD"
        vehicleType = "CAR"
        covered = $false
        hasElectricCharging = $false
        hasSecurityCamera = $false
        is24Hours = $false
        tokenIndex = 0
    },
    @{
        title = "Commercial Vehicle Parking"
        description = "Extra large parking space suitable for trucks, tempos, and commercial vehicles."
        address = "56 Industrial Area"
        city = "Pune"
        state = "Maharashtra"
        zipCode = "411019"
        latitude = 18.5204
        longitude = 73.8567
        hourlyRate = 70.0
        dailyRate = 500.0
        monthlyRate = 10000.0
        spaceType = "LARGE"
        vehicleType = "TRUCK"
        covered = $false
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 1
    },
    @{
        title = "Overnight Secure Mall Parking"
        description = "24/7 monitored parking at Select City Walk mall with security patrol and CCTV."
        address = "A-3, District Centre, Saket"
        city = "New Delhi"
        state = "Delhi"
        zipCode = "110017"
        latitude = 28.5244
        longitude = 77.2066
        hourlyRate = 45.0
        dailyRate = 350.0
        monthlyRate = 7000.0
        spaceType = "STANDARD"
        vehicleType = "ANY"
        covered = $true
        hasElectricCharging = $false
        hasSecurityCamera = $true
        is24Hours = $true
        tokenIndex = 2
    },
    @{
        title = "Budget Friendly Open Parking"
        description = "Affordable open air parking lot near metro station. Great for long-term parking."
        address = "89 Nehru Place"
        city = "New Delhi"
        state = "Delhi"
        zipCode = "110019"
        latitude = 28.5494
        longitude = 77.2500
        hourlyRate = 25.0
        dailyRate = 180.0
        monthlyRate = 3500.0
        spaceType = "STANDARD"
        vehicleType = "CAR"
        covered = $false
        hasElectricCharging = $false
        hasSecurityCamera = $false
        is24Hours = $true
        tokenIndex = 0
    }
)

# Create parking spaces
$count = 0
foreach ($space in $spaces) {
    if ($space.tokenIndex -lt $tokens.Count) {
        try {
            $token = $tokens[$space.tokenIndex]
            $headers = @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            }

            $spaceData = @{
                title = $space.title
                description = $space.description
                address = $space.address
                city = $space.city
                state = $space.state
                zipCode = $space.zipCode
                latitude = $space.latitude
                longitude = $space.longitude
                hourlyRate = $space.hourlyRate
                dailyRate = $space.dailyRate
                monthlyRate = $space.monthlyRate
                spaceType = $space.spaceType
                vehicleType = $space.vehicleType
                covered = $space.covered
                hasElectricCharging = $space.hasElectricCharging
                hasSecurityCamera = $space.hasSecurityCamera
                is24Hours = $space.is24Hours
            } | ConvertTo-Json

            $response = Invoke-RestMethod -Uri "$baseUrl/spaces" -Method Post -Headers $headers -Body $spaceData
            
            # Approve the space (assuming you have admin privileges or modify approval status directly)
            # For now, spaces will be in PENDING status
            
            $count++
            Write-Host "✅ Created: $($space.title)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Failed to create: $($space.title)" -ForegroundColor Red
            Write-Host $_.Exception.Message -ForegroundColor Red
        }
    }
}

Write-Host "`n✨ Sample data loading complete! Created $count parking spaces." -ForegroundColor Cyan
Write-Host "📝 Note: Spaces may need admin approval before appearing as AVAILABLE" -ForegroundColor Yellow
