import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn, userRole, searchTerm, setSearchTerm } = useAppContext();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Sync searchValue với URL params
  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search).get("search") || "";
    setSearchValue(urlSearch);
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchValue.trim();
    setSearchTerm(term);
    // Navigate với query param
    if (term) {
      navigate(`/?search=${encodeURIComponent(term)}`);
    } else {
      navigate("/");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // Nếu xóa hết thì reset search ngay lập tức
    if (value.trim() === "") {
      setSearchTerm("");
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-8 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-gray-900 flex-shrink-0">
          <Link to="/">Shoe store</Link>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Menu Items */}
        <ul className="flex gap-8 text-sm text-gray-800 font-medium items-center flex-shrink-0">
          {isLoggedIn && userRole === "user" && (
            <>
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/product">Sản phẩm</Link></li>
              <li><Link to="/mydonhang">Đơn hàng</Link></li>
              <li><Link to="/cart">Giỏ hàng</Link></li>
              <li><SignOutButton /></li>
            </>
          )}

          {!isLoggedIn && (
            <>
              <li><Link to="/login">Đăng nhập</Link></li>
              <li><Link to="/register">Đăng ký</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
