import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div>
      

      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/forgetpassword" element={<ForgetPassword/>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
       
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}
