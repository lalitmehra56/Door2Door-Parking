import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SpaceList from './pages/SpaceList';
import SpaceDetail from './pages/SpaceDetail';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import CreateSpace from './pages/CreateSpace';
import MySpaces from './pages/MySpaces';
import AdminApprovals from './pages/AdminApprovals';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function OwnerRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('OwnerRoute - isLoading:', isLoading);
  console.log('OwnerRoute - isAuthenticated:', isAuthenticated);
  console.log('OwnerRoute - user:', user);
  console.log('OwnerRoute - user role:', user?.role);
  
  if (isLoading) {
    console.log('OwnerRoute - Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log('OwnerRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'SPACE_OWNER' && user?.role !== 'ADMIN') {
    console.log('OwnerRoute - User role is not SPACE_OWNER or ADMIN, role is:', user?.role);
    console.log('OwnerRoute - Redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  console.log('OwnerRoute - Access granted');
  return <>{children}</>;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* Backwards-compatible redirects (old separate login pages) */}
          <Route path="/user-login" element={<Navigate to="/login" replace />} />
          <Route path="/renter-login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/spaces" element={<SpaceList />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <OwnerRoute>
                <Dashboard />
              </OwnerRoute>
            }
          />
          <Route
            path="/my-spaces"
            element={
              <OwnerRoute>
                <MySpaces />
              </OwnerRoute>
            }
          />
          <Route
            path="/create-space"
            element={
              <OwnerRoute>
                <CreateSpace />
              </OwnerRoute>
            }
          />
          <Route
            path="/edit-space/:id"
            element={
              <OwnerRoute>
                <CreateSpace />
              </OwnerRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <AdminRoute>
                <AdminApprovals />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
