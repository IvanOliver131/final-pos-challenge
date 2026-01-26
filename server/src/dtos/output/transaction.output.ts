import { Field, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class TransactionOutput {
  @Field(() => TransactionModel)
  transaction!: TransactionModel;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class PaginationInfo {
  @Field(() => Number)
  total!: number;

  @Field(() => Number)
  page!: number;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  totalPages!: number;

  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field(() => Boolean)
  hasPreviousPage!: boolean;
}

@ObjectType()
export class TransactionsListOutput {
  @Field(() => [TransactionModel])
  transactions!: TransactionModel[];

  @Field(() => PaginationInfo)
  pagination!: PaginationInfo;

  @Field(() => String)
  message!: string;
}
