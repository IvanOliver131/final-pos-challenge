import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsFiltersInput,
} from "../dtos/input/transaction.input";
import { TransactionModel } from "../models/transaction.model";

interface ListTransactionsResult {
  transactions: TransactionModel[];
  total: number;
  page: number;
  limit: number;
  monthIncome: number;
  monthExpense: number;
  totalBalance: number;
}

export class TransactionService {
  async createTransaction(
    userId: string,
    data: CreateTransactionInput,
  ): Promise<TransactionModel> {
    const transaction = await prismaClient.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        description: data.description,
        registerDate: data.registerDate,
        categoryId: data.categoryId,
        userId: userId,
      },
    });

    return transaction as TransactionModel;
  }

  async listTransactions(
    userId: string,
    filters: ListTransactionsFiltersInput,
  ): Promise<ListTransactionsResult> {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.max(filters.limit ?? 10, 1);
    const skip = (page - 1) * limit;

    const whereClause: any = {
      userId,
    };

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      whereClause.registerDate = {};
      if (filters.startDate) {
        whereClause.registerDate.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        whereClause.registerDate.lte = endDate;
      }
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      whereClause.OR = [
        { title: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ];
    }

    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0),
    );

    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0),
    );

    const [
      transactions,
      total,
      monthIncomeAgg,
      monthExpenseAgg,
      totalIncomeAgg,
      totalExpenseAgg,
    ] = await Promise.all([
      prismaClient.transaction.findMany({
        where: whereClause,
        orderBy: { registerDate: "desc" },
        skip,
        take: limit,
      }),

      prismaClient.transaction.count({
        where: whereClause,
      }),

      prismaClient.transaction.aggregate({
        where: {
          userId,
          type: "INCOME",
          registerDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prismaClient.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          registerDate: {
            gte: startOfMonth,
            lt: startOfNextMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      prismaClient.transaction.aggregate({
        where: {
          userId,
          type: "INCOME",
        },
        _sum: {
          amount: true,
        },
      }),

      prismaClient.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const monthIncome = monthIncomeAgg._sum.amount ?? 0;
    const monthExpense = monthExpenseAgg._sum.amount ?? 0;

    const totalIncome = totalIncomeAgg._sum.amount ?? 0;
    const totalExpense = totalExpenseAgg._sum.amount ?? 0;

    const totalBalance = totalIncome - totalExpense;

    return {
      transactions: transactions as TransactionModel[],
      total,
      page,
      limit,
      monthIncome,
      monthExpense,
      totalBalance,
    };
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionInput,
  ): Promise<TransactionModel> {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new Error("Transação não encontrada!");
    }

    if (transaction.userId !== userId) {
      throw new Error("Você não tem permissão para editar esta transação!");
    }

    const updatedTransaction = await prismaClient.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        title: data.title ?? transaction.title,
        amount: data.amount ?? transaction.amount,
        type: data.type ?? transaction.type,
        description: data.description ?? transaction.description,
        registerDate: data.registerDate ?? transaction.registerDate,
        categoryId: data.categoryId ?? transaction.categoryId,
      },
    });

    return updatedTransaction as TransactionModel;
  }

  async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<boolean> {
    const transaction = await prismaClient.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new Error("Transação não encontrada!");
    }

    if (transaction.userId !== userId) {
      throw new Error("Você não tem permissão para deletar esta transação!");
    }

    await prismaClient.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return true;
  }

  async getAmountTransactionsById(
    userId: string,
    categoryId: string,
  ): Promise<number> {
    const result = await prismaClient.transaction.aggregate({
      where: {
        userId,
        categoryId,
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ?? 0;
  }

  async getCountTransactionsById(
    userId: string,
    categoryId: string,
  ): Promise<number> {
    const result = await prismaClient.transaction.aggregate({
      where: {
        userId,
        categoryId,
      },
      _count: {
        id: true,
      },
    });

    return result._count.id ?? 0;
  }
}
