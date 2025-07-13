import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";

import GuestPage from "./pages/GuestPage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import MainPage from "./pages/MainPage";
import AboutUsPage from "./pages/AboutUsPage";
import SearchPage from "./pages/SearchPage";
import GuestSearchPage from "./pages/GuestSearchPage";
import ProfileSetting from "./pages/SettingPage";
import EventPage from "./pages/EventPage";
import CreateEvent from "./pages/CreateEventPage";
import AdminHomePage from "./pages/AdminHomePage";
import AdminReview from "./pages/AdminReview";
import ManageEvent from "./pages/ManageEvent";
import ErrorPage from "./pages/ErrorPage";

import "./assets/App.css";

// PrivateRoute component to protect private routes
const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("UserID");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// AdminRoute component to protect admin routes
const AdminRoute = () => {
  const isAdmin = !!localStorage.getItem("isAdmin");
  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/guestsearch" element={<GuestSearchPage />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/setting" element={<ProfileSetting />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/createvent" element={<CreateEvent />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/event/manage" element={<ManageEvent />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/review" element={<AdminReview />} />
        </Route>

        {/* Fallback route for unknown paths */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
