import { IconRender } from "@/components/icon-render";
import { Tag } from "@/components/tag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Category } from "@/types";
import { Trash2, Edit2 } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  handleDeleteClick: (category: Category) => void;
  handleEditCategory: (category: Category) => void;
  deleteLoading: boolean;
  updateLoading: boolean;
}

export function CategoryCard({
  category,
  handleDeleteClick,
  handleEditCategory,
  deleteLoading,
  updateLoading,
}: CategoryCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${category.color}20`,
            }}
          >
            <IconRender
              categoryIconName={category.icon}
              categoryColor={category.color}
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 text-red"
              onClick={() => handleDeleteClick(category)}
              disabled={deleteLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleEditCategory(category)}
              disabled={updateLoading}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">
          {category.name}
        </h3>
        <p className="text-xs text-gray-600 mb-4">{category.description}</p>
        <div className="flex items-center justify-between">
          <Tag name={category.name} color={category.color ?? "#999"} />
          <span className="text-xs text-gray-600 font-medium">
            {category.count} {category.count === 1 ? "item" : "items"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
