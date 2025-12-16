import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "../@/components/ui/sonner";
import Home from "./screens/Home";
import Predictions from "./screens/Predictions";
import AdminScreen from "./screens/AdminScreen";
import Teams from "./components/Teams";
import Fixtures from "./components/Fixtures";
import Players from "./components/Players";
import Tables from "./components/Tables";
import Events from "./components/Events";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import NormalRoute from "./components/NormalRoute";
import { useGetMeQuery } from "./slices/userApiSlice";
import { useSelector } from "react-redux";

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: !userInfo,
  });

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="" element={<NormalRoute />}>
          <Route path="/predictions" element={<Predictions />} />
        </Route>
        <Route path="" element={<AdminRoute />}>
          <Route path="admin" element={<AdminScreen />}>
            <Route path="teams" element={<Teams />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="players" element={<Players />} />
            <Route path="tables" element={<Tables />} />
            <Route path="events" element={<Events />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
