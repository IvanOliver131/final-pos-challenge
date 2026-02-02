import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Tag as TagIcon, ArrowUpDown } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/list-categories";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/list-transactions";
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/create-category";
import {
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/graphql/mutations/category";
import type { Category, Transaction } from "@/types";

import { IconRender } from "@/components/icon-render";
import {
  CreateOrEditCategoryModal,
  type CategoryFormData,
} from "@/pages/categories/create-or-edit-category-modal";
import { DeleteCategoryModal } from "@/pages/categories/delete-category-modal";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { CategoryCard } from "./category-card";

interface ListCategoriesData {
  listCategories: {
    categories: Category[];
  };
}

interface ListTransactionsData {
  listTransactions: {
    transactions: Transaction[];
    pagination: {
      total: number;
    };
  };
}

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery<ListCategoriesData>(LIST_CATEGORIES);

  const { data: transactionsData, refetch: refetchTransactions } =
    useQuery<ListTransactionsData>(LIST_TRANSACTIONS, {
      variables: {
        filters: {
          limit: 1000,
        },
      },
    });

  const [createCategory, { loading: createLoading }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: () => {
        refetchCategories();
        toast.success("Categoria criada com sucesso!");
      },
      onError: (error) => {
        toast.error(error.message ?? "Erro ao criar categoria");
      },
    },
  );

  const [updateCategory, { loading: updateLoading }] = useMutation(
    UPDATE_CATEGORY,
    {
      onCompleted: () => {
        refetchCategories();
        toast.success("Categoria atualizada com sucesso!");
        setEditingCategory(null);
      },
      onError: (error) => {
        toast.error(error.message ?? "Erro ao atualizar categoria");
      },
    },
  );

  const [deleteCategory, { loading: deleteLoading }] = useMutation(
    DELETE_CATEGORY,
    {
      onCompleted: () => {
        refetchCategories();
        toast.success("Categoria deletada com sucesso!");
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message ?? "Erro ao deletar categoria");
      },
    },
  );

  const categories = categoriesData?.listCategories?.categories ?? [];
  const transactions = transactionsData?.listTransactions?.transactions ?? [];

  const categoriesWithCount = categories.map((category) => {
    const transactionCount = transactions.filter(
      (t) => t.categoryId === category.id,
    ).length;
    return {
      ...category,
      count: transactionCount,
    };
  });

  const totalTransactions = transactions.length;
  const mostUsedCategory = categoriesWithCount.reduce(
    (prev, current) => (prev.count > current.count ? prev : current),
    categoriesWithCount[0],
  );

  const handleSaveCategory = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory({
          variables: {
            id: editingCategory.id,
            data: {
              name: data.name,
              description: data.description,
              color: data.color,
              icon: data.icon,
            },
          },
        });
      } else {
        await createCategory({
          variables: {
            data: {
              name: data.name,
              description: data.description,
              color: data.color,
              icon: data.icon,
            },
          },
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory({
          variables: {
            id: categoryToDelete.id,
          },
        });
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  useEffect(() => {
    refetchTransactions();
  }, [refetchTransactions]);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categorias</h1>
          <p className="text-sm text-gray-500">
            Organize suas transações por categorias
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={createLoading}>
          <Plus className="w-4 h-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-row items-center p-5  gap-2">
            <TagIcon className="text-blue h-6 w-6" />
            <CardTitle className="flex flex-col">
              <Label className="text-2xl font-bold">{categories.length}</Label>
              <Label className="text-xs text-gray-500">
                TOTAL DE CATEGORIAS
              </Label>
            </CardTitle>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center p-5  gap-2">
            <ArrowUpDown className="text-purple h-6 w-6" />
            <CardTitle className="flex flex-col">
              <Label className="text-2xl font-bold">{totalTransactions}</Label>
              <Label className="text-xs text-gray-500">
                TOTAL DE TRANSAÇÕES
              </Label>
            </CardTitle>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center p-5 gap-2">
            <IconRender
              categoryIconName={mostUsedCategory?.icon}
              categoryColor={mostUsedCategory?.color}
              size={6}
            />
            <CardTitle className="flex flex-col">
              <Label className="text-2xl font-bold">
                {mostUsedCategory?.name}
              </Label>
              <Label className="text-xs text-gray-500">
                CATEGORIA MAIS UTILIZADA
              </Label>
            </CardTitle>
          </div>
        </Card>
      </div>

      <div>
        {categoriesLoading ? (
          <div className="text-gray-500 text-center py-8">
            Carregando categorias...
          </div>
        ) : categoriesWithCount.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Nenhuma categoria encontrada
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesWithCount.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                handleDeleteClick={handleDeleteClick}
                handleEditCategory={handleEditCategory}
                deleteLoading={deleteLoading}
                updateLoading={updateLoading}
              />
            ))}
          </div>
        )}
      </div>

      <CreateOrEditCategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        isLoading={createLoading ?? updateLoading}
        editingCategory={editingCategory}
      />

      <DeleteCategoryModal
        isOpen={deleteConfirmOpen}
        categoryName={categoryToDelete?.name ?? ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setCategoryToDelete(null);
        }}
        isLoading={deleteLoading}
      />
    </div>
  );
}
