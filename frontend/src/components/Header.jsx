import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";

const navItems = [
  {/*
    name: "Home",
    path: "/predictions",
  */},
  { name: "Predictions", path: "/predictions/selections" },
  {
    name: "Fixtures",
    path: "/predictions/fixtures",
  },
  {
    name: "Tables",
    path: "/predictions/tables",
  },
];

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="">
      {userInfo?.roles?.ADMIN && (
        <div className=" fixed top-0 left-0 right-0 z-50 mb-2 p-2 bg-gray-900 text-muted-foreground flex justify-between items-center">
          <h1 className="text-lg font-bold text-white">Predictions</h1>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/*Desktop view for normal users*/}
      {userInfo?.roles?.NORMAL_USER && (
        <div className=" fixed top-0 left-0 right-0 z-50 hidden md:flex  bg-gray-900 text-white p-4">
          <div className="flex justify-between items-center gap-8 w-full">
            <h1 className="text-lg font-bold">Predictions</h1>
            <nav className="flex gap-6 items-center">
              {navItems.map(({ name, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`hover:text-gray-300 ${
                    location.pathname === path ? "text-blue-400" : "text-white"
                  }`}
                >
                  {name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="rounded bg-blue-800 px-4 py-2 text-sm text-white hover:text-gray-600 hover:bg-blue-100 text-left"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/*Mobile view for normal users*/}
      {userInfo?.roles?.NORMAL_USER && (
        <div className=" fixed top-0 left-0 right-0 z-50 md:hidden bg-white border-t shadow px-4 py-3 flex justify-between items-center">
          <Link to="/">
            {" "}
            <h1 className="text-lg font-bold">Predictions</h1>
          </Link>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-gray-800" />
                <div className="w-6 h-0.5 bg-gray-800" />
                <div className="w-6 h-0.5 bg-gray-800" />
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute top-12 right-0 bg-white border rounded shadow-lg w-48 z-50">
                <nav className="flex flex-col p-2">
                  {navItems.map(({ name, path }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setDropdownOpen(false)}
                      className={`px-4 py-2 text-sm hover:bg-gray-100 ${
                        location.pathname === path
                          ? "text-blue-600 font-medium"
                          : "text-gray-800"
                      }`}
                    >
                      {name}
                    </Link>
                  ))}
                  <hr className="my-1" />
                  {/*<button
                    onClick={() => setMobileCompOpen(!mobileCompOpen)}
                    className="px-4 py-2 text-sm text-left hover:bg-gray-100 w-full"
                  >
                    Competitions
                  </button>*/}
                  {/*mobileCompOpen &&
                    competitions.map((c) => (
                      <button
                        key={c.db}
                        onClick={() => {
                          handleChangeDb(c.db);
                          setMobileCompOpen(false);
                          setDropdownOpen(false);
                        }}
                        className="px-6 py-1 text-sm text-gray-700 hover:bg-gray-100 text-left"
                      >
                        {c.name}
                      </button>
                    ))*/}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 text-left"
                  >
                    Close
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 mb-2 text-sm font mt-20">
        You are logged in as,{" "}
        <span className="font-semibold">
          {userInfo?.firstName}&nbsp;{userInfo?.lastName}
        </span>
      </div>
    </div>
  );
};

export default Header;
