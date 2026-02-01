import { Tag } from "@/components/tag";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { formatCurrency } from "@/utils/format-currency";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div key={category.id} className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Tag color={category.color ?? ""} name={category.name ?? ""} />
      </div>
      <div className="text-right flex items-center gap-2">
        <Label className="text-sm text-gray-600">
          {category.count} {category.count === 1 ? "item" : "itens"}
        </Label>
        <Label className="text-sm font-semibold">
          {formatCurrency(Math.abs(category.amount))}
        </Label>
      </div>
    </div>
  );
}
