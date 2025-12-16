import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

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
      <div className="mb-2 p-2 bg-blue-100 text-muted-foreground flex justify-between items-center">
        <h1 className="text-lg font-bold">Predictions</h1>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-xs text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
      <div className="px-4 mb-2 text-sm font">
        You are logged in as, <span className="font-semibold">{userInfo?.firstName}&nbsp;{userInfo?.lastName}</span>
      </div>
    </div>
  );
};

export default Header;
