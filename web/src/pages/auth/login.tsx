import { Mail, UserPlus, Lock } from "lucide-react";

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
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginMutate = await login({
        email,
        password,
      });
      if (loginMutate) {
        toast.success("Login realizado com sucesso!");
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
              <Label
                htmlFor="email"
                className="text-card-foreground text-sm font-normal"
              >
                E-mail
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-normal">
                Senha
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" className="mr-2" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Lembrar-me
                </Label>
              </div>
              <Label className="text-destructive">Recuperar senha</Label>
            </div> */}

            <Button
              type="submit"
              className="w-full"
              variant={"destructive"}
              disabled={loading}
            >
              Entrar
            </Button>

            <div className="relative flex items-center w-full">
              <div className="flex-grow border-t border-border" />
              <Label className="mx-3 px-3 py-1 text-xs text-muted-foreground whitespace-nowrap text-gray-500">
                ou
              </Label>
              <div className="flex-grow border-t border-border" />
            </div>

            <div className="m-auto">
              <Label className="text-foreground text-sm font-normal">
                Ainda não tem uma conta?
              </Label>
            </div>
            <Link to="/signup">
              <Button
                type="button"
                variant={"outline"}
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
