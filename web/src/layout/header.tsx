import { useAuthStore } from "@/stores/auth";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return;

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Transações", path: "/transactions" },
    { label: "Categorias", path: "/categories" },
  ];

  return (
    <header className="w-full h-16 bg-background flex items-center justify-between px-6 border-b border-border">
      <img src={logo} alt="Logo" className="h-6" />

      <nav className="flex items-center space-x-4">
        {navItems.map((item) => (
          <Label
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`cursor-pointer transition-colors ${
              location.pathname === item.path
                ? "text-destructive font-semibold"
                : "text-muted-foreground font-normal hover:text-foreground"
            }`}
          >
            {item.label}
          </Label>
        ))}
      </nav>

      <Avatar onClick={() => navigate("/profile")} className="cursor-pointer">
        <AvatarFallback className="bg-gray-400 text-primary-foreground">
          {user?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
