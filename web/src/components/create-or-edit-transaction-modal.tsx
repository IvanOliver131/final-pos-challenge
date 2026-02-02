import { useState, useEffect } from "react";
import { CircleArrowDown, CircleArrowUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Category, Transaction } from "@/types";
import { Label } from "./ui/label";

export interface TransactionFormData {
  title: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  registerDate: string;
}

export interface TransactionFormDataErrors {
  title: string;
  description: string;
  amount: string;
  categoryId: string;
  registerDate: string;
}

interface CreateOrEditTransactionModalProps {
  isOpen: boolean;
  categories: Category[] | undefined;
  onClose: () => void;
  onSave: (data: TransactionFormData) => void;
  isLoading?: boolean;
  editingTransaction?: Transaction | null;
}

const INITIAL_STATE: TransactionFormData = {
  title: "",
  description: "",
  amount: 0,
  type: "EXPENSE",
  categoryId: "",
  registerDate: new Date().toISOString().split("T")[0],
};

export function CreateOrEditTransactionModal({
  isOpen,
  categories,
  onClose,
  onSave,
  editingTransaction = null,
  isLoading = false,
}: CreateOrEditTransactionModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>(INITIAL_STATE);

  const [errors, setErrors] = useState<Partial<TransactionFormDataErrors>>({});

  useEffect(() => {
    if (editingTransaction && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: editingTransaction.title,
        description: editingTransaction.description ?? "",
        amount: editingTransaction.amount,
        categoryId: editingTransaction.categoryId,
        type: editingTransaction.type,
        registerDate: editingTransaction.registerDate
          ? editingTransaction.registerDate.split("T")[0]
          : "",
      });
    } else if (isOpen) {
      setFormData(INITIAL_STATE);
    }
    setErrors({});
  }, [isOpen, editingTransaction]);

  const validateForm = () => {
    const newErrors: Partial<TransactionFormDataErrors> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Valor é obrigatório";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Categoria é obrigatória";
    }
    if (!formData.registerDate) {
      newErrors.registerDate = "Data é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      setFormData({
        title: "",
        description: "",
        amount: 0,
        type: "EXPENSE",
        categoryId: "",
        registerDate: new Date().toISOString().split("T")[0],
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {editingTransaction ? "Editar transação" : "Nova transação"}
            </h2>
            <p className="text-sm text-gray-500">
              {editingTransaction
                ? "Atualize os dados da transação"
                : "Registre sua despesa ou receita"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 border p-2 rounded-md">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                className={`flex items-center justify-center gap-2 p-2 rounded-md ${formData.type === "EXPENSE" ? "border border-red" : ""}`}
              >
                <CircleArrowDown
                  className={`${formData.type === "EXPENSE" ? "text-red" : "text-gray-400"}`}
                />
                <Label className="hover:cursor-pointer">Despesa</Label>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "INCOME" })}
                className={`flex items-center justify-center gap-2 p-2 rounded-md ${formData.type === "INCOME" ? "border border-green" : ""}`}
              >
                <CircleArrowUp
                  className={`${formData.type === "INCOME" ? "text-green" : "text-gray-400"}`}
                />
                <Label className="hover:cursor-pointer">Receita</Label>
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Descrição
              </label>
              <Input
                placeholder="Ex. Almoço no restaurante"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Data
                </label>
                <Input
                  type="date"
                  value={formData.registerDate}
                  onChange={(e) =>
                    setFormData({ ...formData, registerDate: e.target.value })
                  }
                  className={errors.registerDate ? "border-red" : ""}
                />
                {errors.registerDate && (
                  <p className="text-xs text-red mt-1">{errors.registerDate}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Valor
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.amount ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value) ?? 0,
                      })
                    }
                    className={errors.amount ? "border-red" : ""}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Categoria
              </label>
              <Select
                defaultValue={editingTransaction?.categoryId ?? ""}
                onValueChange={(value) => {
                  setFormData({ ...formData, categoryId: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Título
              </label>
              <Input
                placeholder="Ex. Compra de supermercado"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={errors.title ? "border-red" : ""}
              />
              {errors.title && (
                <p className="text-xs text-red mt-1">{errors.title}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? editingTransaction
                  ? "Atualizando..."
                  : "Salvando..."
                : editingTransaction
                  ? "Atualizar"
                  : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
