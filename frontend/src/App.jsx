import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import GuruDashboardPage from "./pages/Guru/GuruDashboardPage";

const router = createBrowserRouter([
  // section murid
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/app",
    element: <DashboardPage />,
  },

  // section guru
  {
    path: "/guru/login",
    element: <LoginPage />,
  },
  {
    path: "/guru/app",
    element: <GuruDashboardPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
