# Park Space Rental

A full-stack parking space rental application built with React (frontend) and Spring Boot (backend).

## Features

### For Users (Renters)
- Browse available parking spaces
- Search by location, city, or zip code
- Filter by price range and space type
- Book parking spaces for specific time periods
- View and manage bookings
- Cancel pending/confirmed bookings

### For Space Owners
- List parking spaces for rent
- Set hourly, daily, and monthly rates
- Manage space availability and status
- View and manage incoming bookings
- Confirm, complete, or cancel bookings
- Dashboard with statistics

### General Features
- User authentication with JWT
- Role-based access control (User, Space Owner, Admin)
- Modern, responsive UI with Tailwind CSS
- RESTful API backend

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2
- Spring Security with JWT
- Spring Data JPA
- H2 Database (development) / MySQL (production)
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React (icons)

## Project Structure

```
park-space-rental/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/parkspace/
│   │   ├── config/            # Security and CORS configuration
│   │   ├── controller/        # REST API controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Data repositories
│   │   ├── security/          # JWT and authentication
│   │   └── service/           # Business logic
│   └── pom.xml
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── context/           # React context (Auth)
    │   ├── pages/             # Page components
    │   ├── services/          # API services
    │   └── types/             # TypeScript types
    └── package.json
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Maven 3.8 or higher

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd park-space-rental/backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd park-space-rental/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/register/owner` - Register as space owner

### Parking Spaces
- `GET /api/spaces/available` - Get available spaces (public)
- `GET /api/spaces/search?location=` - Search spaces (public)
- `GET /api/spaces/{id}` - Get space details
- `POST /api/spaces` - Create space (owners only)
- `PUT /api/spaces/{id}` - Update space (owners only)
- `DELETE /api/spaces/{id}` - Delete space (owners only)
- `GET /api/spaces/my-spaces` - Get owner's spaces

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/space-bookings` - Get bookings for owner's spaces
- `PATCH /api/bookings/{id}/confirm` - Confirm booking (owners)
- `PATCH /api/bookings/{id}/cancel` - Cancel booking
- `PATCH /api/bookings/{id}/complete` - Complete booking (owners)

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `POST /api/users/become-owner` - Upgrade to space owner

## Sample Data

The application automatically loads sample data on first startup, including:
- 6 test user accounts (2 regular users, 3 space owners, 1 admin)
- 8 parking spaces across New York City
- 6 sample bookings with various statuses

### Quick Test Credentials

**Regular Users:**
- Email: `john.doe@example.com` | Password: `password123`
- Email: `jane.smith@example.com` | Password: `password123`

**Space Owners:**
- Email: `mike.johnson@example.com` | Password: `password123`
- Email: `sarah.williams@example.com` | Password: `password123`
- Email: `david.brown@example.com` | Password: `password123`

**Admin:**
- Email: `admin@parkspace.com` | Password: `admin123`

For complete sample data documentation, see [SAMPLE_DATA.md](SAMPLE_DATA.md).

## Configuration

### Backend Configuration (application.properties)
```properties
# Server port
server.port=8080

# JWT Configuration
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

### Frontend Configuration (vite.config.js)
The frontend is configured to proxy API requests to the backend at `http://localhost:8080`.

## License

MIT License
