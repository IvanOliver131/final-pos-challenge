import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LogOut, Mail, User } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [name] = useState(user?.name || "");

  const handleSave = () => {
    console.log("Salvando alterações:", { name });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Card className="w-full max-w-md p-6 m-auto mt-4">
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarFallback className="bg-gray-400 text-white text-2xl font-semibold">
            {user?.name
              ?.split(" ")
              .map((n) => n.charAt(0))
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold text-foreground">{user?.name}</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <CardContent>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
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
                placeholder="mail@example.com"
                value={name}
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
                placeholder={user?.email}
                disabled
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
            </InputGroup>
            <Label className="font-normal text-xs text-muted-foreground mt-1">
              O e-mail não pode ser alterado
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled
            title="Funcionalidade não desenvolvida!"
          >
            Salvar alterações
          </Button>

          <Button
            type="button"
            onClick={handleLogout}
            className="w-full"
            variant={"outline"}
          >
            <LogOut />
            Sair da conta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
