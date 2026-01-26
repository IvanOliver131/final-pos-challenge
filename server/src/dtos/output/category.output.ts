import { Field, ObjectType } from "type-graphql";
import { CategoryModel } from "../../models/category.model";

@ObjectType()
export class CategoryOutput {
  @Field(() => CategoryModel)
  category!: CategoryModel;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class CategoriesListOutput {
  @Field(() => [CategoryModel])
  categories!: CategoryModel[];

  @Field(() => String)
  message!: string;
}
