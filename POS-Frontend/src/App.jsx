import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard, Categories } from "./pages";
import Headers from "./components/shared/Headers";
import { useSelector } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import FullScreenLoader from "./components/shared/FullScreenLoader";

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderRoutes = ["/auth"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <Headers />}
      {children}
    </>
  );
}

function PrivateRoute({ children }) {
  const { isAuth } = useSelector(state => state.user);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }) {
  const { isAuth } = useSelector(state => state.user);
  const location = useLocation();

  if (isAuth) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  const isLoading = useLoadData();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <PrivateRoute>
            <Tables />
          </PrivateRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <PrivateRoute>
            <Menu />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
