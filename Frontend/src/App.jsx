import React from 'react'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Layout from './components/layout/Layout'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Attendance from './pages/Attendance'
import Fees from './pages/Fees'
import AdmissionForm from './pages/AdmissionForm'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Students from './pages/Students'
import StudentDetails from "./pages/StudentDetails";
import UpdateStudent from "./pages/UpdateStudent"
import FeeRecordsView from './pages/FeeRecordsView'
import FeesForm from './pages/FeesForm'
import AttendanceHistoryView from './pages/AttendanceHistoryView'

const App = () => {
  return (
    <div className='h-screen'>
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Login />} />

    {/* Protected Routes */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/admission-form" element={<AdmissionForm />} />
      <Route path="/students" element={<Students />} />
      <Route path="/students/:std_id" element={<StudentDetails />} />
      <Route path="/student/update/:std_id" element={<UpdateStudent />} />
      <Route path="/pay-fees/:std_id" element={<FeesForm />} />
      <Route path="/fee-records/:std_id" element={<FeeRecordsView />} />
      <Route path="/attendance-history" element={<AttendanceHistoryView />} />
    </Route>
  </Routes>
    </div>
  )
}

export default App
