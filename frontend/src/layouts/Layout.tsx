import { Outlet, useLocation } from "react-router-dom";
import CategoryShowcase from "../components/CategoryShowcase";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const Layout = () => {
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {isHomePage && <Hero className="w-full h-screen" />}
      {isHomePage && <CategoryShowcase viewMode="grid" />}

      <div className="container mx-auto py-10 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
