import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

const Home = () => {
  const [view, setView] = useState({ login: true, register: false });
  const { login, register } = view;
  const loginView = () => {
    setView({ login: true, register: false });
  };
  const registerView = () => {
    setView({ login: false, register: true });
  };
  return (
    <div className="border border-black h-screen px-8 grid grid-cols-1 md:grid-cols-2">
      <div className="grid items-center h-screen">
        {login && <Login registerView={registerView} />}
        {register && <Register loginView={loginView} />}
      </div>
      <div className="hidden md:block">
        <h1>Image goes here....</h1>
      </div>
    </div>
  );
};

export default Home;
