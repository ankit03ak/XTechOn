# Flight Booking System

A full-stack flight booking application with dynamic pricing, wallet system, and comprehensive booking management.

## 🚀 Features

### Core Features
1. **Flight Search Module** - Database-driven flight search with 10 flights per search
2. **Dynamic Pricing Engine** - Surge pricing (10% increase) after 3 bookings within 5 minutes, resets after 10 minutes
3. **Wallet System** - In-app wallet with ₹50,000 default balance for ticket purchases
4. **Ticket PDF Generation** - Downloadable PDF tickets with booking details
5. **Booking History** - Complete booking history with download options

### Additional Features
- **Authentication** - JWT-based login/register system
- **Sorting & Filtering** - Search by departure/arrival cities, sort by price/airline/time
- **Surge Pricing Indicators** - Visual indicators and countdown timers for surge pricing
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Transaction History** - Complete wallet transaction tracking

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: react-hook-form + Zod validation
- **PDF Generation**: @react-pdf/renderer
- **HTTP Client**: Axios
- **Notifications**: Sonner (toast)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## 📁 Project Structure

```
xtechon/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── (dashboard)/     # Protected routes
│   │   │   ├── flights/     # Flight search
│   │   │   ├── booking/     # Booking flow
│   │   │   ├── wallet/      # Wallet management
│   │   │   ├── history/     # Booking history
│   │   │   └── layout.tsx   # Dashboard layout
│   │   ├── login/           # Login page
│   │   ├── register/        # Register page
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   └── ui/              # shadcn components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utilities & API client
│   └── types/               # TypeScript types
│
└── backend/                  # Express API
    ├── src/
    │   ├── config/          # Database config
    │   ├── models/          # Mongoose models
    │   ├── routes/          # API routes
    │   ├── controllers/     # Route controllers
    │   ├── middleware/      # Auth & error middleware
    │   ├── services/        # Business logic
    │   ├── seed/            # Database seeding
    │   └── server.ts        # Entry point
    └── package.json

```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file and add your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=8080
   NODE_ENV=development
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```
   This will populate your database with 20 sample flights.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env.local
   ```

4. **Configure environment variables**
   Edit `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Flight Endpoints

#### Search Flights
```http
GET /api/flights/search?departure_city=Mumbai&arrival_city=Delhi&sort_by=base_price&sort_order=asc
Authorization: Bearer <token>
```

#### Get Flight by ID
```http
GET /api/flights/:id
Authorization: Bearer <token>
```

#### Get Cities
```http
GET /api/flights/cities
Authorization: Bearer <token>
```

### Wallet Endpoints

#### Get Wallet Balance
```http
GET /api/wallet
Authorization: Bearer <token>
```

#### Add Funds
```http
POST /api/wallet/add-funds
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "flightId": "flight_object_id",
  "passenger_name": "John Doe"
}
```

#### Get Booking History
```http
GET /api/bookings/history
Authorization: Bearer <token>
```

#### Get Booking by ID
```http
GET /api/bookings/:id
Authorization: Bearer <token>
```

## 🎯 Usage Guide

1. **Register/Login** - Create an account or login with existing credentials
2. **Search Flights** - Use filters to find flights by departure/arrival cities
3. **View Pricing** - See real-time surge pricing with countdown timers
4. **Book Flight** - Enter passenger details and confirm booking
5. **Manage Wallet** - Add funds or view transaction history
6. **View Bookings** - Check all your bookings and download tickets

## 🔐 Default Wallet Balance

Every new user receives **₹50,000** in their wallet upon registration.

## 💡 Dynamic Pricing Logic

- **Trigger**: 3 bookings within 5 minutes
- **Increase**: 10% surge on base price
- **Reset**: After 10 minutes from the first booking
- **Visual Indicator**: Red badge with countdown timer

## 🐳 Docker Deployment (Future)

Docker configuration will be added for easy deployment.

## 📝 Sample Flight Data

The seed script includes 20 flights with:
- **Airlines**: Air India, SpiceJet, IndiGo
- **Cities**: Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad
- **Price Range**: ₹2,000 - ₹3,000

## 🤝 Contributing

This is an assignment project. For any issues or suggestions, please contact the developer.

## 📄 License

ISC

## 👨‍💻 Developer

Created as part of XTechon Full-Stack Developer Technical Assignment

---

**Note**: Make sure to add your MongoDB connection string before running the application!
