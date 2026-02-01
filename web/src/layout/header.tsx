import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Transações", path: "/transactions" },
    { label: "Categorias", path: "/categories" },
  ];

  function handleNavigate(path: string) {
    navigate(path);
    setOpen(false);
  }

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="h-16 px-6 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-6" />

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Label
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer transition-colors ${
                location.pathname === item.path
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Label>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Avatar
            onClick={() => navigate("/profile")}
            className="cursor-pointer"
          >
            <AvatarFallback className="bg-gray-400 text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden px-6 pb-4 flex flex-col gap-3">
          {navItems.map((item) => (
            <Label
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`cursor-pointer transition-colors ${
                location.pathname === item.path
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Label>
          ))}
        </nav>
      )}
    </header>
  );
}
