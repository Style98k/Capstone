# QuickGig Frontend

A modern React + Vite + Tailwind CSS frontend for the QuickGig student freelance platform.

## Features

- ⚡️ Built with Vite for fast development
- ⚛️ React 18 with modern hooks
- 🎨 Tailwind CSS for styling
- 🎭 Framer Motion for animations
- 📊 Recharts for data visualization
- 🛣️ React Router for navigation
- 🌙 Dark mode support
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── Layout/     # Navbar, Sidebar, Footer
│   ├── UI/         # Button, Card, Modal, Input
│   └── Shared/     # GigCard, UserCard, etc.
├── data/           # Mock data
├── hooks/          # Custom hooks
├── pages/          # Page components
│   ├── auth/       # Login, Register
│   ├── student/    # Student pages
│   ├── client/     # Client pages
│   └── admin/      # Admin pages
├── router/         # App routing
└── styles/         # Global styles
```

## Test Accounts

- **Admin**: admin@quickgig.test / admin123
- **Client**: client@quickgig.test / client123
- **Student**: student@quickgig.test / student123

## Features Implemented

### Student Features
- ✅ Dashboard with stats
- ✅ Browse gigs with filters
- ✅ Apply to gigs
- ✅ Track applications
- ✅ View earnings
- ✅ Messages

### Client Features
- ✅ Dashboard
- ✅ Post jobs
- ✅ Manage gigs
- ✅ View applicants
- ✅ Rate students
- ✅ Messages

### Admin Features
- ✅ Dashboard with analytics
- ✅ Manage users
- ✅ Manage gigs
- ✅ Reports & charts
- ✅ System settings

## Tech Stack

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Framer Motion** - Animations
- **Recharts** - Charts
- **Lucide React** - Icons

## License

ISC

