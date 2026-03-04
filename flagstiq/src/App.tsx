import { RouterProvider } from 'react-router';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { router, adminRouter } from './router';

function AuthGate() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Allow /reset-password route without authentication
  if (window.location.pathname === '/reset-password') {
    return <ResetPasswordPage />;
  }

  if (isLoading) return null;

  if (!isAuthenticated) return <LoginPage />;

  // Admin users get the admin-only router
  if (user?.role === 'admin') {
    return <RouterProvider router={adminRouter} />;
  }

  // Player users get the full app
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
