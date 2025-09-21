import './App.css'
import './index.scss'
import Login from './app/pages/auth/Login'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './app/components/Layout';
import Dashboard from './app/pages/host/Dashboard';
import Users from './app/pages/host/users/Users';
import { getCookie, setCookie } from './utils/helper.utils';
import React from 'react';
import { SnackbarProvider } from "notistack";
import { Path } from './data/path.enum';
import Parking from './app/pages/host/parking/Parking';
import Booking from './app/pages/host/booking/Booking';
import PropertyInterest from './app/pages/host/property-interest/PropertyInterest';
import UserDetails from './app/pages/host/users/UserDetails';
import ParkingDetails from './app/pages/host/parking/ParkingDetails';
import PropertyInterestDetails from './app/pages/host/property-interest/PropertyInterestDetails';
import BookingDetails from './app/pages/host/booking/BookingDetails';
import { getUserProfile } from './services/user.service';

const AppRoutes = () => {
  const navigate = useNavigate();
    const token = getCookie('token');

  const fetchUserProfile = async() => {
    try {
      const apiRes:any = await getUserProfile();
      if(apiRes?.success){
        setCookie("userInfo" , apiRes?.data)
      }
    } catch (error) {
      
    }
  }

  React.useEffect(() => {
    token && fetchUserProfile()
  },[])
  
  React.useEffect(() => {
    if (!token) {
      navigate('/login');
    } 
    // else {
    //   navigate('/dashboard');
    // }
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={Path.DASHBOARD} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path={Path.USERS} element={<Users />} />
        <Route path={Path.PARKINGS} element={<Parking />} />
        <Route path={Path.BOOKINGS} element={<Booking />} />
        <Route path={Path.PROPERTY_INTEREST} element={<PropertyInterest />} />
        <Route path={Path.USERS_DETAILS} element={<UserDetails />} />
        <Route path={Path.PARKING_DETAILS} element={<ParkingDetails />} />
        <Route path={Path.PROPERTY_INTEREST_DETAILS} element={<PropertyInterestDetails />} />
        <Route path={Path.BOOKING_DETAILS} element={<BookingDetails />} />
      </Route>
    </Routes>
  )
}

const App = () => {
  return (
    <Router>
        <SnackbarProvider>
      <AppRoutes />
        </SnackbarProvider>
    </Router>
  )
}

export default App
