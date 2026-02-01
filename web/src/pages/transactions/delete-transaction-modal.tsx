import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  transactionTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteTransactionModal({
  isOpen,
  transactionTitle = "esta transação",
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <div className="flex items-start justify-between p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Deletar transação
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            Tem certeza que deseja deletar a transação{" "}
            <span className="font-semibold text-gray-900">
              "{transactionTitle}"
            </span>
            ? Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 justify-end p-6">
          <Button onClick={onCancel} disabled={isLoading} variant="outline">
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="bg-red">
            {isLoading ? "Deletando..." : "Deletar"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
