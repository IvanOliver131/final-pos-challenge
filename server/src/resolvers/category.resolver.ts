import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
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

@Resolver()
export class CategoryResolver {
  private categoryService = new CategoryService();

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
}
