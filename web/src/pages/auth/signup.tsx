import { User, Mail, Lock, LogIn } from "lucide-react";

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
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import { useState } from "react";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = useAuthStore((state) => state.signup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const signupMutate = await signup({
        name,
        email,
        password,
      });
      if (signupMutate) {
        toast.success("Cadastro realizado com sucesso!");
      }
    } catch {
      toast.error("Erro ao realizar o cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-6">
      <img src={logo} alt="Logo" className="w-32 h-8" />
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-xl">Criar conta</CardTitle>
          <CardDescription className="text-base">
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="gap-2">
              <Label
                htmlFor="name"
                className="text-card-foreground text-sm font-normal"
              >
                Nome completo
              </Label>
              <InputGroup>
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
              </InputGroup>
            </div>
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
              <Label className="font-normal text-xs text-muted-foreground mt-1">
                A senha deve ter no mínimo 8 caracteres.
              </Label>
            </div>

            <Button type="submit" disabled={loading}>
              Cadastrar
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
                Já tem uma conta?
              </Label>
            </div>
            <Link to="/login">
              <Button
                type="button"
                variant={"outline"}
                className="w-full"
                disabled={loading}
              >
                <LogIn />
                Fazer Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
