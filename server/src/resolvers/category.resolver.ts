import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";
import {
  CategoriesListOutput,
  CategoryOutput,
} from "../dtos/output/category.output";
import { CategoryService } from "../services/category.service";
import { IsAuth } from "../middlewares/auth.middleware";
import { GraphqlContext } from "../graphql/context";
import { TransactionModel } from "../models/transaction.model";
import { CategoryModel } from "../models/category.model";
import { TransactionService } from "../services/transaction.service";

@Resolver(() => CategoryModel)
export class CategoryResolver {
  private categoryService = new CategoryService();
  private transactionService = new TransactionService();

  @Mutation(() => CategoryOutput)
  @UseMiddleware(IsAuth)
  async createCategory(
    @Arg("data", () => CreateCategoryInput) data: CreateCategoryInput,
    @Ctx() ctx: GraphqlContext,
  ): Promise<CategoryOutput> {
    const category = await this.categoryService.createCategory(ctx.user!, data);
    return {
      category,
      message: "Categoria criada com sucesso!",
    };
  }

  @Mutation(() => CategoryOutput)
  @UseMiddleware(IsAuth)
  async updateCategory(
    @Arg("id", () => String) id: string,
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @Ctx() ctx: GraphqlContext,
  ): Promise<CategoryOutput> {
    const category = await this.categoryService.updateCategory(
      ctx.user!,
      id,
      data,
    );
    return {
      category,
      message: "Categoria atualizada com sucesso!",
    };
  }

  @Mutation(() => String)
  @UseMiddleware(IsAuth)
  async deleteCategory(
    @Arg("id", () => String) id: string,
    @Ctx() ctx: GraphqlContext,
  ): Promise<string> {
    return this.categoryService.deleteCategory(ctx.user!, id);
  }

  @Query(() => CategoriesListOutput)
  @UseMiddleware(IsAuth)
  async listCategories(
    @Ctx() ctx: GraphqlContext,
  ): Promise<CategoriesListOutput> {
    const categories = await this.categoryService.listCategories(ctx.user!);
    return {
      categories,
      message: "Categorias listadas com sucesso!",
    };
  }

  @FieldResolver(() => TransactionModel)
  async amount(@Root() category: CategoryModel): Promise<number> {
    return this.transactionService.getAmountTransactionsById(
      category.userId,
      category.id,
    );
  }

  @FieldResolver(() => TransactionModel)
  async count(@Root() category: CategoryModel): Promise<number> {
    return this.transactionService.getCountTransactionsById(
      category.userId,
      category.id,
    );
  }
}
