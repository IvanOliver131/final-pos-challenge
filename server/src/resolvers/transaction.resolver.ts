import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { TransactionService } from "../services/transaction.service";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsFiltersInput,
} from "../dtos/input/transaction.input";
import {
  TransactionOutput,
  TransactionsListOutput,
} from "../dtos/output/transaction.output";
import { IsAuth } from "../middlewares/auth.middleware";
import { GraphqlContext } from "../graphql/context";

@Resolver()
export class TransactionResolver {
  private transactionService = new TransactionService();

  @Mutation(() => TransactionOutput)
  @UseMiddleware(IsAuth)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @Ctx() context: GraphqlContext,
  ): Promise<TransactionOutput> {
    const transaction = await this.transactionService.createTransaction(
      context.user!,
      data,
    );

    return {
      transaction,
      message: "Transação criada com sucesso!",
    };
  }

  @Query(() => TransactionsListOutput)
  @UseMiddleware(IsAuth)
  async listTransactions(
    @Arg("filters", () => ListTransactionsFiltersInput, { nullable: true })
    filters: ListTransactionsFiltersInput | undefined,
    @Ctx() context: GraphqlContext,
  ): Promise<TransactionsListOutput> {
    const defaultFilters: ListTransactionsFiltersInput = {
      search: filters?.search,
      type: filters?.type,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
    };

    const result = await this.transactionService.listTransactions(
      context.user!,
      defaultFilters,
    );

    const totalPages = Math.ceil(result.total / result.limit);
    const hasNextPage = result.page < totalPages;
    const hasPreviousPage = result.page > 1;

    return {
      transactions: result.transactions,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      message: "Transações listadas com sucesso!",
    };
  }

  @Mutation(() => TransactionOutput)
  @UseMiddleware(IsAuth)
  async updateTransaction(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @Ctx() context: GraphqlContext,
  ): Promise<TransactionOutput> {
    const transaction = await this.transactionService.updateTransaction(
      context.user!,
      id,
      data,
    );

    return {
      transaction,
      message: "Transação atualizada com sucesso!",
    };
  }

  @Mutation(() => String)
  @UseMiddleware(IsAuth)
  async deleteTransaction(
    @Arg("id", () => String) id: string,
    @Ctx() context: GraphqlContext,
  ): Promise<string> {
    await this.transactionService.deleteTransaction(context.user!, id);

    return "Transação deletada com sucesso!";
  }
}
