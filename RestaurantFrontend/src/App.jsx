import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Menu from "./pages/admin/Menu";
import Orders from "./pages/admin/Orders";
import OrderDetails from "./pages/admin/OrderDetails";
import Inventory from "./pages/admin/Inventory";
import Reservations from "./pages/admin/Reservations";
import Tables from "./pages/admin/Tables";
import Customers from "./pages/admin/Customers";

// Customer Pages
import CustomerHome from "./pages/customer/Home";
import CustomerMenu from "./pages/customer/Menu";
import CustomerCart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/MyOrders";
import CustomerOrderDetails from "./pages/customer/OrderDetails";
import CustomerProfile from "./pages/customer/Profile";
import CustomerChangePassword from "./pages/customer/ChangePassword";
import Checkout from "./pages/customer/Checkout";
import ReserveTable from "./pages/customer/ReserveTable";
import MyReservations from "./pages/customer/MyReservations";
import ReservationDetails from "./pages/customer/ReservationDetails";
import EditProfile from "./pages/customer/EditProfile";


// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="Admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute role="Admin">
            <Menu />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute role="Admin">
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute role="Admin">
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute role="Admin">
            <Inventory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reservations"
        element={
          <ProtectedRoute role="Admin">
            <Reservations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tables"
        element={
          <ProtectedRoute role="Admin">
            <Tables />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute role="Admin">
            <Customers />
          </ProtectedRoute>
        }
      />

      {/* ================= CUSTOMER ================= */}

      <Route
        path="/customer/home"
        element={
          <ProtectedRoute role="Customer">
            <CustomerHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/menu"
        element={
          <ProtectedRoute role="Customer">
            <CustomerMenu />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute role="Customer">
            <CustomerCart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/my-orders"
        element={
          <ProtectedRoute role="Customer">
            <CustomerOrders />
          </ProtectedRoute>
        }
      />

      <Route
  path="/customer/my-orders/:id"
  element={
    <ProtectedRoute role="Customer">
      <CustomerOrderDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/customer/change-password"
  element={
    <ProtectedRoute role="Customer">
      <CustomerChangePassword />
    </ProtectedRoute>
  }
/>

<Route
  path="/customer/reserve-table"
  element={
    <ProtectedRoute role="Customer">
      <ReserveTable />
    </ProtectedRoute>
  }
/>

<Route
  path="/customer/my-reservations"
  element={
    <ProtectedRoute role="Customer">
      <MyReservations />
    </ProtectedRoute>
  }
/>

<Route
  path="/customer/my-reservations/:id"
  element={
    <ProtectedRoute role="Customer">
      <ReservationDetails />
    </ProtectedRoute>
  }
/>

      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute role="Customer">
            <CustomerProfile />
          </ProtectedRoute>
        }
      />

      <Route
  path="/customer/checkout"
  element={
    <ProtectedRoute role="Customer">
      <Checkout />
    </ProtectedRoute>
  }
/>

<Route
  path="/customer/edit-profile"
  element={
    <ProtectedRoute role="Customer">
      <EditProfile />
    </ProtectedRoute>
  }
/>

      {/* ================= FALLBACK ================= */}

<Route
  path="*"
  element={<h1 className="text-center mt-10">404 - Page Not Found</h1>}
/>
       </Routes>
    </>
  );
}

export default App;