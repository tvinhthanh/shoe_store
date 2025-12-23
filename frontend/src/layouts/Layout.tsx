import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CategoryShowcase from "../components/CategoryShowcase";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  const handleCategoryClick = (categoryId: number | null) => {
    if (isHomePage) {
      // Scroll xuống phần ProductList
      setTimeout(() => {
        const productListElement = document.getElementById("product-list-section");
        if (productListElement) {
          productListElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      
      // Set categoryId vào URL để Home component có thể đọc
      if (categoryId) {
        navigate(`/?category=${categoryId}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {isHomePage && <Hero className="w-full h-screen" />}
      {isHomePage && (
        <CategoryShowcase 
          viewMode="grid" 
          onCategoryClick={handleCategoryClick}
        />
      )}

      <div className="container mx-auto py-10 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
