import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from "type-graphql";
import { CategoryModel } from "./category.model";

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Types of transactions",
});

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => Number)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime)
  registerDate!: Date;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  categoryId!: string;

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
