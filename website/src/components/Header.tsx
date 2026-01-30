import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, User, Globe } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("search") || "";

  const [search, setSearch] = useState(initialSearch);

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/properties?search=${encodeURIComponent(search)}`);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="currentColor"
            >
              <path d="M16 1c-6.627 0-12 5.373-12 12 0 4.97 3.024 9.23 7.336 11.037L16 31l4.664-6.963C24.976 22.23 28 17.97 28 13c0-6.627-5.373-12-12-12zm0 16.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
            </svg>
            <span className="text-xl font-bold text-primary hidden sm:block">
              Rent Away
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center border border-border rounded-full shadow-elevated px-2 py-2 hover:shadow-card transition-shadow">
            <input
              type="text"
              placeholder="Search destinations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="px-4 py-2 text-sm w-48 bg-transparent focus:outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground p-2 rounded-full ml-2"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Link
              to="#"
              className="hidden md:block nav-link px-4 py-2 rounded-full hover:bg-secondary transition-colors"
            >
              Become a Host
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 border border-border rounded-full py-2 px-3 hover:shadow-elevated transition-shadow"
              >
                <Menu className="h-4 w-4" />
                <div className="bg-muted-foreground text-background rounded-full p-1">
                  <User className="h-4 w-4" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-card-hover border border-border animate-scale-in overflow-hidden">
                  <div className="py-2">
                    <Link
                      to="/login"
                      className="block px-4 py-3 hover:bg-secondary font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 hover:bg-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                    <div className="border-t border-border my-2" />
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <button className="w-full flex items-center gap-4 border border-border rounded-full px-4 py-3 shadow-elevated">
          <Search className="h-5 w-5" />
          <div className="text-left">
            <p className="font-medium text-sm">Anywhere</p>
            <p className="text-xs text-muted-foreground">
              Any week · Add guests
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
