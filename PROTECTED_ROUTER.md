# Protected Router Implementation

This implementation provides a comprehensive protected router system for your React application using TanStack Router.

## Components Added

### 1. `ProtectedRoute` Component
- Located: `/src/components/auth/protected-route.tsx`
- Purpose: Wraps components that require authentication
- Features:
  - Shows loading state during authentication check
  - Redirects to login if user is not authenticated
  - Renders children only if user is authenticated

### 2. Auth Guards
- Located: `/src/lib/auth-guard.ts`
- Purpose: Route-level protection using TanStack Router's `beforeLoad` hook
- Functions:
  - `requireAuth()`: Ensures user is authenticated before accessing route
  - `requireGuest()`: Ensures user is not authenticated (for login/signup pages)

### 3. Auth Hooks
- Located: `/src/hooks/auth.hooks.ts`
- Purpose: Convenient hooks for authentication state management
- Functions:
  - `useRequireAuth()`: Hook for components that require authentication
  - `useRequireGuest()`: Hook for components that require guest access

## Usage Examples

### Route-level Protection (Recommended)
```tsx
import { requireAuth } from "@/lib/auth-guard";

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/protected",
  component: ProtectedComponent,
  beforeLoad: requireAuth, // This will redirect to login if not authenticated
});
```

### Component-level Protection
```tsx
import { ProtectedRoute } from "@/components/auth/protected-route";

function MyComponent() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Using Auth Hooks
```tsx
import { useRequireAuth } from "@/hooks/auth.hooks";

function MyProtectedComponent() {
  const { isAuthenticated, user, isLoading } = useRequireAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // Will redirect to login

  return <div>Welcome, {user.name}!</div>;
}
```

## Routes Protected

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/settings` - User settings
- `/upload` - File upload
- `/scoring` - Scoring interface
- `/history` - User history
- `/information` - User information
- `/report` - Reports
- All routes under `/main-app/*`

### Public Routes (No Authentication Required)
- `/about` - About page
- `/contact` - Contact page
- `/test` - Test page
- `/` - Redirects based on auth status

### Guest-only Routes (Redirect if Authenticated)
- `/login` - Login page
- `/signup` - Signup page

## Features

### 1. Automatic Redirects
- Unauthenticated users accessing protected routes → redirected to `/login`
- Authenticated users accessing guest-only routes → redirected to `/dashboard`
- Root path (`/`) → redirects to `/dashboard` if authenticated, `/login` if not

### 2. Redirect After Login
- Users redirected to login will be sent back to their original destination after successful authentication
- Redirect URL is preserved in the URL search params

### 3. Loading States
- Proper loading states while checking authentication
- Prevents flash of unauthenticated content

### 4. Error Handling
- Graceful handling of authentication errors
- Automatic token cleanup on invalid tokens

## Implementation Details

### Router Configuration
The router is configured with:
- Root-level redirect logic for the home page
- Route-level guards using `beforeLoad` hooks
- Search parameter validation for redirect URLs

### Authentication Flow
1. User tries to access protected route
2. `requireAuth()` checks for valid token in localStorage
3. If no token → redirect to login with current URL as redirect parameter
4. User logs in successfully
5. Redirect to original destination or dashboard

### Token Management
- Tokens are stored in localStorage using `LOCAL_STORAGE_KEY.ACCESS_TOKEN`
- Invalid tokens are automatically cleared
- Token presence is checked before route access

## Best Practices

1. **Use Route-level Protection**: Prefer `beforeLoad` guards over component-level protection for better performance
2. **Handle Loading States**: Always show loading indicators during authentication checks
3. **Graceful Degradation**: Ensure the app works even if authentication fails
4. **Clear Error Messages**: Provide clear feedback when authentication fails
5. **Secure Token Storage**: Consider using more secure storage methods for production

## Future Enhancements

1. **Role-based Access Control**: Add role checking to auth guards
2. **Session Management**: Implement automatic token refresh
3. **SSR Support**: Add server-side authentication checks
4. **Remember Me**: Add persistent authentication option
5. **Multi-factor Authentication**: Add support for MFA flows
