import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ShieldCheck,
  Table2,
} from "lucide-react";

const navItems = [
  {
    name: "Home",
    path: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  { name: "Teams", path: "/admin/teams", icon: <Users className="h-5 w-5" /> },
  {
    name: "Fixtures",
    path: "/admin/fixtures",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    name: "Players",
    path: "/admin/players",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    name: "Tables",
    path: "/admin/tables",
    icon: <Table2 className="h-5 w-5" />,
  },
  {
    name: "Events",
    path: "/admin/events",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
];

const AdminScreen = () => {
  const location = useLocation();
  return (
    <>
    <div className="grid grid-rows-[min-content_1fr] h-screen">
      <Header />
      <div className={`flex flex-1 `}>
        <aside className="hidden md:block bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold mb-6">Admin</h1>
          <nav className="space-y-1">
            {navItems.map(({ name, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center flex-start px-3 py-2 rounded hover:bg-gray-700`}
              >
                {icon}
                <span className="pl-4 hidden lg:block">{name}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className={`flex-1 bg-gray-100 pb-2 md:pt-2 px-4`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>

    {/* Mobile Bottom Nav for logged-in users */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ name, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center text-xs ${
                  location.pathname === path ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {icon}
                <span>{name}</span>
              </Link>
            ))}
      </div>
    </nav>
    </>
  );
};

export default AdminScreen;
