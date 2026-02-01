import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Category } from "@/types";
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from "lucide-react";

const ICON_OPTIONS = [
  { name: "briefcase-business", label: "Trabalho", icon: BriefcaseBusiness },
  { name: "car-front", label: "Carro", icon: CarFront },
  { name: "heart-pulse", label: "Saúde", icon: HeartPulse },
  { name: "piggy-bank", label: "Poupança", icon: PiggyBank },
  { name: "shopping-cart", label: "Compras", icon: ShoppingCart },
  { name: "ticket", label: "Passagem", icon: Ticket },
  { name: "tool-case", label: "Ferramentas", icon: ToolCase },
  { name: "utensils", label: "Comida", icon: Utensils },
  { name: "paw-print", label: "Animais", icon: PawPrint },
  { name: "house", label: "Casa", icon: House },
  { name: "gift", label: "Presente", icon: Gift },
  { name: "dumbbell", label: "Academia", icon: Dumbbell },
  { name: "book-open", label: "Livro", icon: BookOpen },
  { name: "baggage-claim", label: "Viagem", icon: BaggageClaim },
  { name: "mailbox", label: "Correspondência", icon: Mailbox },
  { name: "receipt-text", label: "Recibo", icon: ReceiptText },
];

const COLOR_OPTIONS = [
  { name: "green", hex: "#16A34A" },
  { name: "blue", hex: "#2563EB" },
  { name: "purple", hex: "#9333EA" },
  { name: "pink", hex: "#DB2777" },
  { name: "red", hex: "#DC2626" },
  { name: "orange", hex: "#EA580C" },
  { name: "yellow", hex: "#CA8A04" },
];

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  isLoading?: boolean;
  editingCategory?: Category | null;
}

export interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export function CreateOrEditCategoryModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  editingCategory = null,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    icon: "briefcase-business",
    color: "#16A34A",
  });

  useEffect(() => {
    if (editingCategory && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || "",
        icon: "",
        color: editingCategory.color || "#16A34A",
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        description: "",
        icon: "briefcase-business",
        color: "#16A34A",
      });
    }
  }, [isOpen, editingCategory]);

  const handleSave = () => {
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      icon: "briefcase-business",
      color: "#16A34A",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingCategory ? "Editar categoria" : "Nova categoria"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Organize suas transações com categorias
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-900"
            >
              Título
            </Label>
            <Input
              id="title"
              placeholder="Ex. Alimentação"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-900"
            >
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descrição da categoria"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="h-20 resize-none"
            />
            <span className="text-xs text-gray-500">Opcional</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-900">Ícone</Label>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map((option) => {
                const IconComponent = option.icon;
                const isSelected = formData.icon === option.name;
                return (
                  <button
                    key={option.name}
                    onClick={() =>
                      setFormData({ ...formData, icon: option.name })
                    }
                    className={`p-2 rounded-lg border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    title={option.label}
                  >
                    <IconComponent className="w-5 h-5 text-gray-700" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">Cor</Label>
            <div className="flex justify-between gap-2">
              {COLOR_OPTIONS.map((color) => (
                <div
                  key={color.hex}
                  className={`rounded-lg border transition-all w-16 h-10 flex items-center ${
                    formData.color === color.hex
                      ? "border-primary border-2"
                      : "hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() =>
                      setFormData({ ...formData, color: color.hex })
                    }
                    className="w-10 h-8 rounded-lg m-auto"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSave}
            disabled={isLoading || !formData.name.trim()}
            className="w-full"
          >
            {isLoading
              ? "Salvando..."
              : editingCategory
                ? "Atualizar"
                : "Salvar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
