# Financially Fit World Frontend

A modern Learning Management System built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (student)/         # Student dashboard routes
│   ├── (admin)/           # Admin dashboard routes
│   └── (public)/          # Public routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── store/                # Zustand stores
└── types/                # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Features

- 🔐 Authentication (Login, Register, Email Verification)
- 📚 Course Content Delivery (Videos, PDFs, Rich Text)
- 📊 Progress Tracking
- 💳 Payment Integration (iPay Africa)
- 🎓 Certificate Generation
- ⭐ Reviews and Ratings
- 📢 Announcements
- 📈 Admin Analytics Dashboard
- 👥 User Management

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000/api` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Route Groups

### (auth)
- `/login` - User login
- `/register` - User registration
- `/verify-email` - Email verification
- `/reset-password` - Password reset

### (student)
- `/dashboard` - Student dashboard
- `/course` - Course overview
- `/course/[moduleId]` - Module content
- `/certificate` - Certificate page
- `/profile` - User profile

### (admin)
- `/admin/dashboard` - Admin overview
- `/admin/analytics` - Analytics dashboard
- `/admin/users` - User management
- `/admin/content` - Content management
- `/admin/reviews` - Review moderation
- `/admin/announcements` - Announcements
- `/admin/settings` - Admin settings

### (public)
- `/` - Landing page
- `/verify-certificate/[certId]` - Certificate verification

## Contributing

This is a private project. Please follow the established code style and patterns.

## License

Proprietary - All rights reserved
