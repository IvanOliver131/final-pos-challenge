import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Plus,
  Trash,
  Edit,
  ChevronLeft,
  ChevronRight,
  CircleArrowUp,
  CircleArrowDown,
} from "lucide-react";

import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/tag";
import { IconRender } from "@/components/icon-render";
import { DeleteTransactionModal } from "@/pages/transactions/delete-transaction-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreateOrEditTransactionModal,
  type TransactionFormData,
} from "@/components/create-or-edit-transaction-modal";

import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/list-transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/list-categories";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/delete-transaction";
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/create-transaction";
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/update-transaction";

import type { Transaction, Category } from "@/types";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface ListTransactionsData {
  listTransactions: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface ListCategoriesData {
  listCategories: {
    categories: Category[];
  };
}

type TypeEnum = "INCOME" | "EXPENSE";

export function Transactions() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeEnum | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>("all");
  const [page, setPage] = useState(1);

  const getDateRange = (selectedPeriod: string) => {
    const today = new Date();
    let startDate: Date | null = null;
    const endDate = today;

    switch (selectedPeriod) {
      case "last_month":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "last_3_months":
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "last_6_months":
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "last_12_months":
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "all":
      default:
        return { startDate: null, endDate: null };
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const dateRange = useMemo(() => getDateRange(period), [period]);

  const { data: transactionsData, refetch } = useQuery<ListTransactionsData>(
    LIST_TRANSACTIONS,
    {
      variables: {
        filters: {
          limit: 10,
          page,
          ...(search && { search }),
          ...(typeFilter && { type: typeFilter }),
          ...(categoryFilter && { categoryId: categoryFilter }),
          ...dateRange,
        },
      },
      fetchPolicy: "network-only",
    },
  );

  const { data: categoriesData } =
    useQuery<ListCategoriesData>(LIST_CATEGORIES);

  const [deleteTransaction, { loading: deleting }] = useMutation(
    DELETE_TRANSACTION,
    {
      onCompleted() {
        setIsDeleteOpen(false);
        setDeleteId(null);
        refetch();
        toast.success("Transação deletada com sucesso!");
      },
      onError() {
        toast.error("Erro ao deletar transação");
      },
    },
  );

  const [createTransaction, { loading: creating }] = useMutation(
    CREATE_TRANSACTION,
    {
      onCompleted() {
        setIsTransactionModalOpen(false);
        refetch();
        toast.success("Transação criada com sucesso!");
      },
      onError(error) {
        toast.error(error.message ?? "Erro ao criar transação");
      },
    },
  );

  const [updateTransaction, { loading: updating }] = useMutation(
    UPDATE_TRANSACTION,
    {
      onCompleted() {
        setEditingTransaction(null);
        refetch();
        toast.success("Transação atualizada com sucesso!");
      },
      onError(error) {
        toast.error(error.message ?? "Erro ao atualizar transação");
      },
    },
  );

  const transactions = transactionsData?.listTransactions?.transactions;
  const categories = categoriesData?.listCategories?.categories;
  const pagination = transactionsData?.listTransactions?.pagination;

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleSaveTransaction = async (data: TransactionFormData) => {
    try {
      if (editingTransaction) {
        await updateTransaction({
          variables: {
            id: editingTransaction.id,
            data: {
              ...data,
              amount: Number(data.amount),
              registerDate: new Date(data.registerDate).toISOString(),
            },
          },
        });
      } else {
        await createTransaction({
          variables: {
            data: {
              ...data,
              amount: Number(data.amount),
              registerDate: new Date(data.registerDate).toISOString(),
            },
          },
        });
      }
      setIsTransactionModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search, typeFilter, categoryFilter, period]);

  return (
    <div className="w-full h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Transações</h1>
          <p className="text-sm text-gray-500">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <div>
          <Button onClick={() => setIsTransactionModalOpen(true)}>
            <Plus className="w-4 h-4" /> Nova transação
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <div>
              <label className="text-xs text-gray-500">Buscar</label>
              <Input
                placeholder="Buscar por descrição"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Tipo</label>
              <Select
                value={typeFilter ?? "ALL"}
                onValueChange={(value) => {
                  setTypeFilter(value === "ALL" ? null : (value as TypeEnum));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="INCOME">Entrada</SelectItem>
                  <SelectItem value="EXPENSE">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Categoria</label>
              <Select
                value={categoryFilter ?? "ALL"}
                onValueChange={(value) => {
                  setCategoryFilter(value === "ALL" ? null : value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Período</label>
              <Select value={period} onValueChange={(v) => setPeriod(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="last_month">Último mês</SelectItem>
                  <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                  <SelectItem value="last_12_months">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mt-2">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>DESCRIÇÃO</TableHead>
              <TableHead>DATA</TableHead>
              <TableHead>CATEGORIA</TableHead>
              <TableHead>TIPO</TableHead>
              <TableHead>VALOR</TableHead>
              <TableHead>AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => {
              const category = categories?.find(
                (category) => category.id === transaction.categoryId,
              );

              return (
                <TableRow
                  key={transaction.id}
                  className="border-b border-gray-50"
                >
                  <TableCell className="py-4 px-4 align-top">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50"
                        style={{
                          backgroundColor: `${category?.color}20`,
                        }}
                      >
                        <IconRender
                          categoryIconName={category?.icon}
                          categoryColor={category?.color}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {transaction.title}
                        </div>
                        {transaction.description && (
                          <div className="text-xs text-gray-500">
                            {transaction.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 align-top text-gray-600">
                    {formatDate(transaction.registerDate)}
                  </TableCell>

                  <TableCell className="py-4 align-top">
                    <Tag
                      name={category?.name ?? "Sem categoria"}
                      color={category?.color ?? "#999"}
                    />
                  </TableCell>

                  <TableCell className="py-4 align-top">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "INCOME" ? (
                        <div className="text-green text-base flex items-center gap-2">
                          <CircleArrowUp className="w-4 h-4" />
                          <Label>Entrada</Label>
                        </div>
                      ) : (
                        <div className="text-red text-base flex items-center gap-2">
                          <CircleArrowDown className="w-4 h-4" />
                          <Label>Saída</Label>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell
                    className={`py-4 align-top font-semibold ${transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}{" "}
                    {formatCurrency(transaction.amount)}
                  </TableCell>

                  <TableCell className="py-4 align-top">
                    <div className="flex items-center gap-2">
                      <Button
                        title="Deletar"
                        onClick={() => {
                          setDeleteId(transaction.id);
                          setDeleteTitle(transaction.title);
                          setIsDeleteOpen(true);
                        }}
                        variant={"outline"}
                        className="text-red"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>

                      <Button
                        title="Editar"
                        onClick={() => handleEditTransaction(transaction)}
                        variant={"outline"}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end p-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination?.hasPreviousPage}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="px-3 py-1 text-sm bg-gray-50 rounded">
              {pagination?.page ?? page}
            </div>

            <Button
              onClick={() =>
                setPage((p) => (pagination?.hasNextPage ? p + 1 : p))
              }
              disabled={!pagination?.hasNextPage}
              variant="outline"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <DeleteTransactionModal
        isOpen={isDeleteOpen}
        transactionTitle={deleteTitle}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
          setDeleteTitle("");
        }}
        onConfirm={() => {
          if (!deleteId) return;
          deleteTransaction({ variables: { id: deleteId } });
        }}
        isLoading={deleting}
      />

      <CreateOrEditTransactionModal
        isOpen={isTransactionModalOpen}
        categories={categories}
        onClose={handleCloseTransactionModal}
        onSave={handleSaveTransaction}
        isLoading={creating ?? updating}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
