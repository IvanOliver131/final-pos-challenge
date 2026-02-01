import { TransactionType } from "../../models/transaction.model";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  title!: string;

  @Field(() => Number)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  registerDate!: Date;

  @Field(() => String)
  categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Number, { nullable: true })
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  registerDate?: Date;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}

@InputType()
export class ListTransactionsFiltersInput {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Field(() => Number, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Number, { nullable: true, defaultValue: 10 })
  limit?: number;
}
