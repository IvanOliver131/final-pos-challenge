import { useQuery } from "@apollo/client/react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/list-transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/list-categories";
import type { Transaction, Category } from "@/types";
import { Link } from "react-router-dom";

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
  const { data: transactionsData, loading: transactionsLoading } =
    useQuery<ListTransactionsData>(LIST_TRANSACTIONS, {
      variables: {
        filters: {
          limit: 5,
        },
      },
    });

  const { data: categoriesData, loading: categoriesLoading } =
    useQuery<ListCategoriesData>(LIST_CATEGORIES);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#666";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Sem categoria";
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SALDO TOTAL</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          </CardContent>
        </Card>

        {/* Income */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              RECEITAS DO MÊS
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(income)}
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              DESPESAS DO MÊS
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(expenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>TRANSAÇÕES RECENTES</CardTitle>
              <Link to="/transactions">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionsLoading ? (
                  <p className="text-gray-500">Carregando transações...</p>
                ) : transactions.length === 0 ? (
                  <p className="text-gray-500">Nenhuma transação encontrada</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                          style={{
                            backgroundColor: getCategoryColor(
                              transaction.categoryId,
                            ),
                          }}
                        >
                          {getCategoryName(transaction.categoryId).charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.registerDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            transaction.type === "INCOME"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {getCategoryName(transaction.categoryId)}
                        </span>
                        <p
                          className={`text-sm font-semibold ${
                            transaction.type === "INCOME"
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {transaction.type === "INCOME" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>CATEGORIAS</CardTitle>
              <Link to="/categories">
                <Button variant="ghost" size="sm">
                  Gerenciar
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
                    <div
                      key={category.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color || "#666" }}
                        />
                        <p className="text-sm font-medium text-gray-700">
                          {category.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(Math.abs(category.amount))}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.count}{" "}
                          {category.count === 1 ? "item" : "itens"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
