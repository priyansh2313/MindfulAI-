# Authentication System

## Overview
This application now has a comprehensive authentication system that prevents unauthorized access to protected routes and automatically redirects unauthenticated users to the login page.

## Key Features

### 1. Route Protection
- **Protected Routes**: All main application routes require authentication
- **Public Routes**: Login, signup, and some informational pages are publicly accessible
- **Automatic Redirects**: Unauthenticated users are automatically redirected to `/login`

### 2. Authentication Components

#### ProtectedRoute Component
- Located in `src/components/ProtectedRoute.tsx`
- Wraps all protected routes
- Checks both Redux state and localStorage for authentication
- Shows loading state while checking authentication
- Redirects to login if not authenticated

#### AuthContext
- Located in `src/contexts/AuthContext.tsx`
- Provides authentication state throughout the app
- Handles user session management
- Provides logout functionality

### 3. Authentication Flow

#### Login Process
1. User enters credentials on `/login`
2. Server validates credentials
3. JWT token and user data stored in localStorage
4. User data stored in Redux state
5. Redirect based on user age:
   - Age >= 55: `/elder-dashboard`
   - Age < 55: `/dashboard`

#### Route Access
1. User tries to access protected route
2. ProtectedRoute component checks authentication
3. If authenticated: Route renders normally
4. If not authenticated: Redirect to `/login`

#### Logout Process
1. User clicks logout
2. localStorage cleared (token, user data)
3. Redux state cleared
4. Redirect to `/login`

### 4. Route Structure

#### Public Routes (No Authentication Required)
- `/login` - Login page
- `/signup` - Registration page
- `/Questionnaire` - Initial questionnaire
- `/how-it-works` - Information page
- `/invitation/:invitationId` - Invitation acceptance
- `/care-connect-test` - Test page

#### Protected Routes (Authentication Required)
- `/` - Introduction page
- `/dashboard` - Main dashboard
- `/evaluation` - Mental health evaluation
- `/journal` - Journal entries
- `/community` - Community features
- `/music` - Music therapy
- `/image-analyzer` - Image analysis
- `/assistant` - AI assistant
- `/encyclopedia` - Mental health encyclopedia
- `/daily-activities` - Daily activities
- `/case-history` - User case history
- `/profile` - User profile
- `/elder-dashboard` - Elder-specific dashboard
- `/care-connect` - Care connection features
- `/games` - Mental health games
- `/storytelling` - Story features
- `/sleep-tracker` - Sleep tracking
- `/sleep-insights` - Sleep insights

#### Role-Based Routes
- `/family-dashboard` - Only accessible to users with 'family' role

### 5. Security Features

#### Token Management
- JWT tokens stored in localStorage
- Tokens included in API requests via axios interceptors
- Automatic token validation on route access

#### Session Persistence
- User data persists across browser sessions
- Automatic re-authentication on app load
- Graceful handling of expired sessions

#### Data Protection
- Sensitive data cleared on logout
- Local storage cleaned on session end
- Server-side session validation

### 6. Usage Examples

#### Using ProtectedRoute
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>
```

#### Using AuthContext
```tsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.name}!</div>;
};
```

### 7. Testing Authentication

#### Manual Testing
1. Open browser in incognito mode
2. Try to access `/dashboard` directly
3. Should redirect to `/login`
4. Login with valid credentials
5. Should redirect to appropriate dashboard
6. Try accessing protected routes - should work
7. Logout and try accessing protected routes - should redirect to login

#### Development Testing
- Clear localStorage to simulate logout
- Modify user data to test different scenarios
- Test with different user roles and ages

## Troubleshooting

### Common Issues
1. **Infinite redirect loops**: Check Redux state initialization
2. **Authentication not persisting**: Check localStorage storage/retrieval
3. **Routes not protecting**: Verify ProtectedRoute component usage
4. **Login not working**: Check API endpoints and token storage

### Debug Steps
1. Check browser localStorage for token and user data
2. Verify Redux state in React DevTools
3. Check network requests for authentication headers
4. Review console for authentication-related errors 