# Financially Fit World Frontend

A modern, responsive Learning Management System frontend built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui components.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Components](#components)
- [Styling](#styling)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The frontend provides a comprehensive user interface for:
- **Students**: Course access, progress tracking, certificates, reviews
- **Admins**: Content management, analytics, user management
- **Public**: Landing page, certificate verification

Built with modern web technologies for optimal performance and user experience.

## ✨ Features

### Student Portal
- 📚 **Course Access**: Browse and access enrolled courses
- 📊 **Progress Dashboard**: Real-time progress tracking
- 🎥 **Content Viewer**: Video player, PDF viewer, rich text content
- ✍️ **Digital Signature**: Canvas-based signature capture
- 💳 **Payment Integration**: Secure payment via iPay Africa
- 🎓 **Certificates**: View and download certificates
- ⭐ **Reviews**: Rate and review courses
- 📢 **Announcements**: View course announcements
- 👤 **Profile Management**: Update profile and password

### Admin Dashboard
- 📈 **Analytics**: Comprehensive dashboard with charts
- 👥 **User Management**: View, edit, and manage users
- 📖 **Content Management**: Create and organize course content
- 💰 **Payment Tracking**: Monitor payments and revenue
- ⭐ **Review Moderation**: Approve or reject reviews
- 📢 **Announcements**: Create and manage announcements
- 📊 **Reports**: Export data as CSV
- 🔍 **Search & Filter**: Advanced filtering options

### Technical Features
- ⚡ **Fast Performance**: Optimized loading and rendering
- 📱 **Responsive Design**: Mobile-first approach
- 🎨 **Modern UI**: Clean, intuitive interface
- 🔐 **Secure**: JWT authentication, protected routes
- ♿ **Accessible**: WCAG compliant components
- 🌙 **Theme Support**: Light/dark mode ready
- 🔄 **Real-time Updates**: Automatic data refresh
- 📦 **Code Splitting**: Optimized bundle size

## 🛠 Tech Stack

### Core
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **React**: 19.2.0

### Styling
- **CSS Framework**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React, Tabler Icons
- **Animations**: Tailwind Animate

### State & Data
- **State Management**: Zustand 5+
- **Data Fetching**: TanStack Query (React Query) 5+
- **HTTP Client**: Axios 1.13+
- **Form Handling**: React Hook Form 7+ with Zod validation

### Rich Content
- **Rich Text Editor**: TipTap 3+
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts 2+
- **Date Handling**: date-fns 4+

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Backend API running (see [Backend README](../backend/README.md))

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Frontend: http://localhost:3000
   - Ensure backend is running on http://localhost:8000

### Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Authentication routes
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Registration page
│   │   │   ├── verify-email/        # Email verification
│   │   │   ├── forgot-password/     # Password reset request
│   │   │   └── reset-password/      # Password reset
│   │   │
│   │   ├── (student)/               # Student portal
│   │   │   └── students/
│   │   │       ├── dashboard/       # Student dashboard
│   │   │       ├── course/          # Course viewer
│   │   │       ├── certificate/     # Certificate page
│   │   │       ├── profile/         # Profile settings
│   │   │       └── signature/       # Digital signature
│   │   │
│   │   ├── (admin)/                 # Admin dashboard
│   │   │   └── admin/
│   │   │       ├── dashboard/       # Admin overview
│   │   │       ├── analytics/       # Analytics page
│   │   │       ├── users/           # User management
│   │   │       ├── content/         # Content management
│   │   │       ├── reviews/         # Review moderation
│   │   │       ├── announcements/   # Announcements
│   │   │       └── settings/        # Settings
│   │   │
│   │   ├── (public)/                # Public routes
│   │   │   ├── page.tsx            # Landing page
│   │   │   └── verify-certificate/ # Certificate verification
│   │   │
│   │   ├── enrollment/              # Enrollment flow
│   │   ├── favicon.ico              # Favicon
│   │   ├── globals.css              # Global styles
│   │   └── layout.tsx               # Root layout
│   │
│   ├── components/                   # React components
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── admin/                   # Admin components
│   │   │   ├── content-editor.tsx
│   │   │   ├── user-table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── course/                  # Course components
│   │   │   ├── video-player.tsx
│   │   │   ├── pdf-viewer.tsx
│   │   │   ├── rich-text-viewer.tsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/                    # Auth components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── password-input.tsx
│   │   │
│   │   ├── payment/                 # Payment components
│   │   │   └── payment-button.tsx
│   │   │
│   │   ├── certificate/             # Certificate components
│   │   ├── signature/               # Signature components
│   │   ├── analytics/               # Analytics components
│   │   ├── loading-skeletons/       # Loading states
│   │   ├── navigation/              # Navigation components
│   │   ├── error-boundary.tsx       # Error boundary
│   │   ├── error-display.tsx        # Error display
│   │   └── ...
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-auth.ts              # Authentication hook
│   │   ├── use-progress.ts          # Progress tracking hook
│   │   ├── use-async.ts             # Async operations hook
│   │   ├── use-mobile.ts            # Mobile detection hook
│   │   └── use-token-refresh.ts     # Token refresh hook
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── api.ts                   # Axios API client
│   │   ├── analytics-api.ts         # Analytics API
│   │   ├── content-api.ts           # Content API
│   │   ├── users-api.ts             # Users API
│   │   ├── query-client.ts          # React Query config
│   │   ├── utils.ts                 # Utility functions
│   │   ├── error-utils.ts           # Error handling
│   │   ├── csv-export.ts            # CSV export
│   │   └── vimeo.ts                 # Vimeo integration
│   │
│   ├── store/                        # Zustand stores
│   │   └── auth-store.ts            # Auth state store
│   │
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                 # Main types
│   │   ├── user.ts                  # User types
│   │   ├── content.ts               # Content types
│   │   ├── analytics.ts             # Analytics types
│   │   └── home.ts                  # Home types
│   │
│   └── providers/                    # React providers
│
├── public/                           # Static assets
│   ├── images/
│   └── ...
│
├── .env.example                      # Environment template
├── .env.local                        # Local environment (not in git)
├── .gitignore                        # Git ignore rules
├── components.json                   # shadcn/ui config
├── next.config.ts                    # Next.js config
├── package.json                      # Dependencies
├── postcss.config.mjs               # PostCSS config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                     # TypeScript config
├── vercel.json                       # Vercel deployment
└── README.md                         # This file
```

## 🗺️ Routing

### Route Groups

Next.js App Router uses route groups for organization:

#### (auth) - Authentication Routes
```
/login              - User login
/register           - User registration
/verify-email       - Email verification
/forgot-password    - Password reset request
/reset-password     - Password reset
```

#### (student) - Student Portal
```
/students/dashboard           - Student dashboard
/students/course              - Course overview
/students/course/[moduleId]   - Module content viewer
/students/certificate         - Certificate page
/students/profile             - Profile settings
/students/signature           - Digital signature
```

#### (admin) - Admin Dashboard
```
/admin/dashboard        - Admin overview
/admin/analytics        - Analytics dashboard
/admin/users            - User management
/admin/content          - Content management
/admin/reviews          - Review moderation
/admin/announcements    - Announcements
/admin/settings         - Settings
```

#### (public) - Public Routes
```
/                              - Landing page
/verify-certificate/[certId]   - Certificate verification
```

#### Other Routes
```
/enrollment/payment-success    - Payment success
/enrollment/payment-failed     - Payment failed
```

### Protected Routes

Routes are protected using middleware and authentication checks:

- **Student routes**: Require authentication and enrollment
- **Admin routes**: Require authentication and admin role
- **Public routes**: No authentication required

## 🔄 State Management

### Zustand Store

Global state managed with Zustand:

```typescript
// src/store/auth-store.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}
```

### React Query

Server state managed with TanStack Query:

```typescript
// Example usage
const { data, isLoading, error } = useQuery({
  queryKey: ['course'],
  queryFn: async () => {
    const response = await api.get('/course');
    return response.data;
  },
});
```

### Custom Hooks

#### useAuth Hook
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

#### useProgress Hook
```typescript
const { 
  overallProgress, 
  updateProgress, 
  isLoadingOverall 
} = useProgress();
```

## 🔌 API Integration

### API Client

Axios-based API client with interceptors:

```typescript
// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (adds auth token)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles errors, token refresh)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401, refresh token, retry request
    // ...
  }
);
```

### API Usage Examples

```typescript
// GET request
const response = await api.get('/course');

// POST request
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// PUT request
const response = await api.put('/auth/profile', formData);

// DELETE request
const response = await api.delete(`/admin/users/${userId}`);
```

## 🧩 Components

### UI Components (shadcn/ui)

Pre-built, accessible components:

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

### Custom Components

#### Video Player
```typescript
<VideoPlayer
  videoId="vimeo-video-id"
  onProgress={(time) => updateProgress(time)}
  onComplete={() => markComplete()}
/>
```

#### PDF Viewer
```typescript
<PDFViewer
  pdfUrl="https://example.com/document.pdf"
  onComplete={() => markComplete()}
/>
```

#### Rich Text Viewer
```typescript
<RichTextViewer
  content={htmlContent}
  onComplete={() => markComplete()}
/>
```

## 🎨 Styling

### Tailwind CSS

Utility-first CSS framework:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <Button className="bg-blue-500 hover:bg-blue-600">Click</Button>
</div>
```

### Custom Styles

Global styles in `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... */
  }
}
```

### Theme Configuration

Tailwind config in `tailwind.config.ts`:

```typescript
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#049ad1',
        // ...
      },
    },
  },
  plugins: [],
};
```

## 🔧 Development

### Development Server

```bash
npm run dev
```

Access at http://localhost:3000

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-key
```

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Format code (if configured)
npm run format
```

### Adding New Pages

1. Create page in appropriate route group
2. Add components in `src/components/`
3. Add types in `src/types/`
4. Add API calls in `src/lib/`
5. Test functionality

### Adding New Components

```bash
# Add shadcn/ui component
npx shadcn-ui@latest add button

# Create custom component
# src/components/my-component.tsx
```

## 🏗️ Building

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Build Output

```
.next/
├── static/          # Static assets
├── server/          # Server-side code
└── ...
```

### Build Optimization

- Automatic code splitting
- Image optimization
- Font optimization
- CSS minification
- JavaScript minification

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   Set in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

### Production Checklist

- [ ] Set production API URL
- [ ] Configure environment variables
- [ ] Test all critical flows
- [ ] Verify API connectivity
- [ ] Check mobile responsiveness
- [ ] Test payment integration
- [ ] Verify certificate generation
- [ ] Test admin dashboard
- [ ] Check analytics
- [ ] Enable error tracking

## 🐛 Troubleshooting

### Common Issues

**Issue**: API connection error
```bash
# Solution: Check NEXT_PUBLIC_API_BASE_URL in .env.local
# Ensure backend is running
```

**Issue**: Build errors
```bash
# Solution: Clear cache and rebuild
rm -rf .next
npm run build
```

**Issue**: Type errors
```bash
# Solution: Check TypeScript configuration
npx tsc --noEmit
```

**Issue**: Styling not working
```bash
# Solution: Restart dev server
# Check Tailwind config
```

**Issue**: Authentication not working
```bash
# Solution: Check auth store
# Verify JWT tokens
# Check API responses
```

### Debug Mode

Enable debug logging:

```typescript
// Add to component
console.log('Debug:', data);

// Check network requests in DevTools
// Check React Query DevTools
```

### Performance Issues

If experiencing slow performance:

1. Check bundle size
2. Optimize images
3. Lazy load components
4. Use React.memo for expensive components
5. Check API response times

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review component documentation
- Check browser console for errors
- Contact the development team

---

**Version**: 1.0.0  
**Last Updated**: December 2024
