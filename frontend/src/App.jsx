import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import SetupRole from './pages/SetupRole';
import JobListing from './pages/JobListing';
import PostJob from './pages/PostJob';
import Job from './pages/Job';
import WorkTracker from './pages/WorkTracker';
import Chat from './pages/Chat';
import StudentAccountSettings from './pages/StudentAccountSettings'; // Import the new component
import EmployerAccountSettings from './pages/EmployerAccountSettings'; // Import the new component
import WorkSessions from './pages/WorkSessions'; // Import the WorkSessions component

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/setup-role" element={<SetupRole />} />
            <Route path="/student-dashboard" element={
              <PrivateRoute requiredRole="student">
                <StudentDashboard />
              </PrivateRoute>
            } />
            <Route path="/employer-dashboard" element={
              <PrivateRoute requiredRole="employer">
                <EmployerDashboard />
              </PrivateRoute>
            } />
            <Route path="/jobs" element={
              <PrivateRoute requiredRole="student">
                <JobListing />
              </PrivateRoute>
            } />
            <Route path="/post-job" element={
              <PrivateRoute requiredRole="employer">
                <PostJob />
              </PrivateRoute>
            } />
            <Route path="/job/:id" element={<Job />} />
            <Route path="/work-tracker/:gigId" element={
              <PrivateRoute requiredRole="student">
                <WorkTracker />
              </PrivateRoute>
            } />
            <Route path="/chat/:gigId" element={<Chat />} />
            <Route path="/account-settings" element={
              <PrivateRoute requiredRole="student">
                <StudentAccountSettings />
              </PrivateRoute>
            } />
            <Route path="/employer-account-settings" element={
              <PrivateRoute requiredRole="employer">
                <EmployerAccountSettings />
              </PrivateRoute>
            } />
            <Route path="/work-sessions/:gigId" element={
              <PrivateRoute requiredRole="employer">
                <WorkSessions />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}