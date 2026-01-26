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
      userId: userId,
    };

    // Filtro de tipo
    if (filters.type) {
      whereClause.type = filters.type;
    }

    // Filtro de período
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

    // Filtro de busca (search em título e descrição)
    if (filters.search) {
      whereClause.OR = [
        {
          title: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [transactions, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where: whereClause,
        orderBy: {
          registerDate: "desc",
        },
        skip: skip,
        take: limit,
      }),
      prismaClient.transaction.count({
        where: whereClause,
      }),
    ]);

    return {
      transactions: transactions as TransactionModel[],
      total,
      page,
      limit,
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
}
