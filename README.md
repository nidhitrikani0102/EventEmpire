# Triple Cassini – Event Management Platform

## Overview
A full‑stack web application for managing events, vendors, budgets, and user interactions. Built with **React + Bootstrap** on the frontend and **Node/Express + MongoDB** on the backend.

## Key Features
- **Dashboard Statistics** – Total Events, Upcoming, Completed, and Vendors displayed in creative gradient cards.
- **Landing Page** – Hero section with animated "Get Started" / "Login" buttons, real‑time global stats, floating shapes, and a testimonials carousel.
- **Event Management** – Create, edit, and delete events; budget tracking with alerts for overspending.
- **Vendor Directory** – Search and view vendor profiles.
- **User Authentication** – JWT‑based login, registration, password reset, and optional 2FA.
- **Admin Role** – Manage users, reset passwords, and view all data.

## Getting Started
### Prerequisites
- Node.js (v18+)
- npm (or yarn)
- MongoDB instance (local or Atlas)

### Installation
```bash
# Clone the repo
git clone https://github.com/your-username/triple-cassini.git
cd triple-cassini

# Create .env (see .env.example for keys)
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Install dependencies (root installs both server & client)
npm install
```

### Running Locally
```bash
# Start backend (nodemon) – listens on PORT (default 5000)
npm run dev

# In another terminal, start the React frontend
cd client
npm start
```
Open `http://localhost:3000` in a browser.

### Building for Production
```bash
cd client
npm run build   # creates client/build
# Serve static files with Express (add middleware in server.js if needed)
```

## Project Structure
```
triple-cassini/
├─ client/                # React app
│   ├─ src/               # Components, pages, context
│   └─ public/            # Static assets
├─ server/                # Express API
│   ├─ models/            # Mongoose schemas (User, Event, Vendor, …)
│   ├─ routes/            # API endpoints (auth, events, vendors, stats, …)
│   ├─ services/          # Business logic
│   └─ config/db.js       # MongoDB connection
├─ .gitignore
├─ package.json           # Root scripts (dev, start)
└─ README.md              # **You are here**
```

## API Endpoints (selected)
- `GET /api/stats` – Returns `{ users, vendors, events }` for the landing page.
- `GET /api/events` – List events for the logged‑in user.
- `POST /api/events` – Create a new event.
- `GET /api/vendors/search` – Retrieve all vendors (used for vendor count).
- `POST /api/budget/:id/expense` – Add an expense and get budget alerts.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes and push.
4. Open a Pull Request.

## License
MIT – feel free to use and adapt.

---
*Generated documentation for quick reference.*
