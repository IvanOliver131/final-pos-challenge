import { useState, useEffect, FormEvent } from "react";
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
import { COLOR_OPTIONS, ICON_OPTIONS } from "./constants";

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

const INITAL_STATE: CategoryFormData = {
  name: "",
  description: "",
  icon: "briefcase-business",
  color: "#16A34A",
};

export function CreateOrEditCategoryModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  editingCategory = null,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>(INITAL_STATE);

  useEffect(() => {
    if (editingCategory && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description ?? "",
        icon: editingCategory.icon ?? "briefcase-business",
        color: editingCategory.color ?? "#16A34A",
      });
    } else if (isOpen) {
      setFormData(INITAL_STATE);
    }
  }, [isOpen, editingCategory]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.name.trim()) return;

    onSave(formData);
  };

  const handleClose = () => {
    setFormData(INITAL_STATE);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
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
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex. Alimentação"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descrição da categoria"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="resize-none"
              />
              <span className="text-xs text-gray-500">Opcional</span>
            </div>

            <div className="space-y-3">
              <Label>Ícone</Label>
              <div
                className=" 
                  grid
                  grid-cols-2
                  sm:grid-cols-4
                  md:grid-cols-6
                  lg:grid-cols-8
                  gap-2
                "
              >
                {ICON_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = formData.icon === option.name;

                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon: option.name })
                      }
                      className={`p-2 rounded-lg border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 text-gray-700" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Cor</Label>
              <div className="flex justify-between gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, color: color.hex })
                    }
                    className={`w-10 h-8 rounded-lg border ${
                      formData.color === color.hex
                        ? "border-primary border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading ?? !formData.name.trim()}
              className="w-full"
            >
              {isLoading
                ? "Salvando..."
                : editingCategory
                  ? "Atualizar"
                  : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
