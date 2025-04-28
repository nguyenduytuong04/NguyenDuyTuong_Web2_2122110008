import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
import ListingGrid from "./ListingGrid";
import DetailProduct from "./DetailProduct";
import Profile from "./Profile";
import ProfileAddress from "./ProfileAddress";
import ProfileOrders from "./ProfileOrders";
import ProfileSettings from "./ProfileSettings";
import Logout from "./Logout";
import Cart from "./Cart";
import Checkout from "./Checkout";
import ChangePassword from "./ChangePassword";
import SearchResults from "./SearchResults";
const Main = () => (
  <main className="main">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<UserLogin />} />
      <Route path="/Register" element={<UserRegister />} />
      <Route path="/ListingGrid" element={<ListingGrid />} />
      <Route path="/Detail" element={<DetailProduct />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/address" element={<ProfileAddress />} />
      <Route path="/profile/orders" element={<ProfileOrders />} />
      <Route path="/profile/settings" element={<ProfileSettings />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/Cart" element={<Cart />} />
      <Route path="/Checkout" element={<Checkout />} />
      <Route path="/Change-password" element={<ChangePassword />} />
      <Route path="/SearchResults" element={<SearchResults />} />
    </Routes>
  </main>
);

export default Main;
