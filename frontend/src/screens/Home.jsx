import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Footer from "../components/Footer";

const Home = () => {
  const [view, setView] = useState({ login: true, register: false });

  return (
    <div className="min-h-screen flex flex-col">
      {/* MAIN CONTENT */}
      <div className="flex flex-1">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {view.login && <Login registerView={() => setView({ login: false, register: true })} />}
          {view.register && <Register loginView={() => setView({ login: true, register: false })} />}
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block w-1/2">
          <img
            src="/backgroundImage.png"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
