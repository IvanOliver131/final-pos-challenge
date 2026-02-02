import { Mail, UserPlus, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.svg";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAuthStore } from "@/stores/auth";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email: string;
  password: string;
}

const INITIAL_STATE: LoginFormData = {
  email: "",
  password: "",
};

export function Login() {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<LoginFormErrors>>({});
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const validateForm = () => {
    const newErrors: Partial<LoginFormErrors> = {};

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "E-mail inválido";
      }
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const loginMutate = await login(formData);

      if (loginMutate) {
        toast.success("Login realizado com sucesso!");
        setFormData(INITIAL_STATE);
        setErrors({});
      }
    } catch {
      toast.error("Falha ao realizar o login!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-6">
      <img src={logo} alt="Logo" className="w-32 h-8" />

      <Card className="w-full max-w-md rounded-xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-xl">Fazer login</CardTitle>
          <CardDescription className="text-base">
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="gap-2">
              <Label className="text-sm font-normal">E-mail</Label>
              <InputGroup>
                <InputGroupInput
                  type="email"
                  placeholder="mail@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={loading}
                  className={errors.email ? "border-red" : ""}
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {errors.email && (
                <p className="text-xs text-red mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-normal">Senha</Label>
              <InputGroup>
                <InputGroupInput
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                  className={errors.password ? "border-red" : ""}
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <p className="text-xs text-red mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="bg-primary">
              Entrar
            </Button>

            <div className="relative flex items-center w-full">
              <div className="flex-grow border-t border-border" />
              <Label className="mx-3 px-3 py-1 text-xs text-muted-foreground">
                ou
              </Label>
              <div className="flex-grow border-t border-border" />
            </div>

            <div className="m-auto">
              <Label className="text-sm font-normal">
                Ainda não tem uma conta?
              </Label>
            </div>

            <Link to="/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                <UserPlus />
                Criar conta
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
