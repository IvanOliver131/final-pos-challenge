import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Wallet,
  CircleArrowUp,
  CircleArrowDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/list-transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/list-categories";
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/create-transaction";
import {
  CreateOrEditTransactionModal,
  type TransactionFormData,
} from "@/components/create-or-edit-transaction-modal";
import type { Transaction, Category } from "@/types";
import { Link } from "react-router-dom";
import { TransactionCard } from "./transaction-card";
import { CategoryCard } from "./category-card";
import { formatCurrency } from "@/utils/format-currency";
import { toast } from "sonner";

interface ListTransactionsData {
  listTransactions: {
    transactions: Transaction[];
    pagination: {
      total: number;
    };
  };
}

interface ListCategoriesData {
  listCategories: {
    categories: Category[];
  };
}

export function Dashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    data: transactionsData,
    loading: transactionsLoading,
    refetch,
  } = useQuery<ListTransactionsData>(LIST_TRANSACTIONS, {
    variables: {
      filters: {
        limit: 5,
      },
    },
  });

  const { data: categoriesData, loading: categoriesLoading } =
    useQuery<ListCategoriesData>(LIST_CATEGORIES);

  const [createTransaction, { loading: creating }] = useMutation(
    CREATE_TRANSACTION,
    {
      onCompleted() {
        setIsCreateOpen(false);
        refetch();
        toast.success("Transação criada com sucesso!");
      },
      onError(error) {
        toast.error(error.message || "Erro ao criar transação");
      },
    },
  );

  const transactions = transactionsData?.listTransactions?.transactions || [];
  const categories = categoriesData?.listCategories?.categories || [];

  const balance = transactions.reduce((acc, transaction) => {
    if (transaction.type === "INCOME") {
      return acc + transaction.amount;
    } else {
      return acc - transaction.amount;
    }
  }, 0);

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + t.amount, 0);

  const categoriesWithCount = categories.map((category) => {
    const transactionCount = transactions.filter(
      (t) => t.categoryId === category.id,
    ).length;
    const categoryAmount = transactions
      .filter((t) => t.categoryId === category.id)
      .reduce((acc, t) => {
        if (t.type === "INCOME") {
          return acc + t.amount;
        } else {
          return acc - t.amount;
        }
      }, 0);
    return {
      ...category,
      count: transactionCount,
      amount: categoryAmount,
    };
  });

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2 gap-2">
            <Wallet className="text-purple h-5 w-5" />
            <CardTitle className="font-medium text-gray-500 text-xs">
              SALDO TOTAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2 gap-2">
            <CircleArrowUp className="text-primary h-5 w-5" />
            <CardTitle className="font-medium text-gray-500 text-xs">
              RECEITA DO MÊS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(income)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2 gap-2">
            <CircleArrowDown className="text-primary h-5 w-5" />
            <CardTitle className="font-medium text-gray-500 text-xs">
              DESPESAS DO MÊS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(expenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 py-2 px-6">
              <CardTitle className="text-gray-500 text-xs">
                TRANSAÇÕES RECENTES
              </CardTitle>
              <Link to="/transactions">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary font-semibold flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div>
                {transactionsLoading ? (
                  <p className="text-gray-500">Carregando transações...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-500">Nenhuma transação encontrada</p>
                ) : (
                  transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 p-0">
              <div className="w-full py-2 px-6">
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-primary font-semibold m-auto"
                >
                  <Plus className="w-5 h-5" />
                  Nova Transação
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 py-2 px-6">
            <CardTitle className="text-gray-500 text-xs">CATEGORIAS</CardTitle>
            <Link to="/categories">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-semibold flex items-center gap-1"
              >
                Gerenciar
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoriesLoading ? (
                <p className="text-gray-500 text-sm">
                  Carregando categorias...
                </p>
              ) : categoriesWithCount.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma categoria</p>
              ) : (
                categoriesWithCount.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateOrEditTransactionModal
        isOpen={isCreateOpen}
        categories={categoriesData?.listCategories?.categories}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(data: TransactionFormData) => {
          createTransaction({
            variables: {
              data: {
                ...data,
                amount: Number(data.amount),
                registerDate: new Date(data.registerDate).toISOString(),
              },
            },
          });
        }}
        isLoading={creating}
      />
    </div>
  );
}
