import { IconRender } from "@/components/icon-render";
import { Tag } from "@/components/tag";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

import { CircleArrowDown, CircleArrowUp } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <div
      key={transaction.id}
      className="flex items-center justify-between py-5 border-b last:border-b-0"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold"
          style={{
            backgroundColor: `${transaction.category.color}20`,
          }}
        >
          <IconRender
            categoryColor={transaction.category.color}
            categoryIconName={transaction.category.icon}
          />
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.title}</p>
          <p className="text-xs text-gray-500">
            {formatDate(transaction.registerDate)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <Tag
          color={transaction.category.color ?? ""}
          name={transaction.category.name}
        />
        <div className="flex items-center gap-1">
          <p className="text-sm font-semibold">
            {transaction.type === "INCOME" ? "+" : "-"}
            {formatCurrency(transaction.amount)}{" "}
          </p>
          {transaction.type === "INCOME" ? (
            <CircleArrowUp className="w-4 h-4 text-primary" />
          ) : (
            <CircleArrowDown className="w-4 h-4 text-red" />
          )}
        </div>
      </div>
    </div>
  );
}
