import './App.css'
import './index.scss'
import Login from './app/pages/auth/Login'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './app/components/Layout';
import Dashboard from './app/pages/host/Dashboard';
import Users from './app/pages/host/users/Users';
import { SnackbarProvider } from "notistack";
import { Path } from './data/path.enum';
import Parking from './app/pages/host/parking/Parking';
import Booking from './app/pages/host/booking/Booking';
import PropertyInterest from './app/pages/host/property-interest/PropertyInterest';
import UserDetails from './app/pages/host/users/UserDetails';
import ParkingDetails from './app/pages/host/parking/ParkingDetails';
import PropertyInterestDetails from './app/pages/host/property-interest/PropertyInterestDetails';
import BookingDetails from './app/pages/host/booking/BookingDetails';
import CustomerSupport from './app/pages/host/CustomerSupport';
import PrivacyPolicy from './app/pages/host/about/PrivacyPolicy';
import TermsAndConditions from './app/pages/host/about/TermsAndConditions';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from "primereact/passthrough/tailwind";

const AppRoutes = () => {
  // const navigate = useNavigate();
  // const token = getCookie('token');

  // const fetchUserProfile = async () => {
  //   try {
  //     const apiRes: any = await getUserProfile();
  //     if (apiRes?.success) {
  //       setCookie("userInfo", apiRes?.data)
  //     }
  //   } catch (error) {

  //   }
  // }

  // React.useEffect(() => {
  //   token && fetchUserProfile()
  // }, [])

  // React.useEffect(() => {
  //   if (!token) {
  //     navigate(Path.LOGIN);
  //   }
  // }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path={Path.CUSTOMER_SUPPORT} element={<CustomerSupport />} />
      <Route path={Path.PRIVACY_POLICY} element={<PrivacyPolicy />} />
      <Route path={Path.TERMS_AND_CONDITIONS} element={<TermsAndConditions />} />
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
    <PrimeReactProvider value={{ pt: Tailwind }}>
      <Router>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </Router>
    </PrimeReactProvider>
  )
}

export default App
