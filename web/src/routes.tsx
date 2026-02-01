import { Dashboard } from "@/pages/dashboard";
import { Transactions } from "@/pages/transactions";
import { Categories } from "@/pages/categories";
import { Profile } from "@/pages/profile";
import { Login } from "@/pages/auth/login";
import { SignUp } from "@/pages/auth/signup";

export const routes = {
  public: [
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
  ],
  private: [
    { path: "/", element: <Dashboard /> },
    { path: "/transactions", element: <Transactions /> },
    { path: "/categories", element: <Categories /> },
    { path: "/profile", element: <Profile /> },
  ],
};
