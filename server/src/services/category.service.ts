import { prismaClient } from "../../prisma/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../dtos/input/category.input";

export class CategoryService {
  async createCategory(userId: string, data: CreateCategoryInput) {
    const existingCategory = await prismaClient.category.findUnique({
      where: {
        name_userId: {
          name: data.name,
          userId,
        },
      },
    });

    if (existingCategory) {
      throw new Error("Categoria com este nome já existe!");
    }

    const category = await prismaClient.category.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        userId,
      },
    });

    return category;
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    data: UpdateCategoryInput,
  ) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    if (category.userId !== userId) {
      throw new Error("Você não tem permissão para editar esta categoria!");
    }

    if (data.name) {
      const existingCategory = await prismaClient.category.findUnique({
        where: {
          name_userId: {
            name: data.name,
            userId,
          },
        },
      });

      if (existingCategory && existingCategory.id !== categoryId) {
        throw new Error("Categoria com este nome já existe!");
      }
    }

    const updatedCategory = await prismaClient.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
      },
    });

    return updatedCategory;
  }

  async deleteCategory(userId: string, categoryId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    if (category.userId !== userId) {
      throw new Error("Você não tem permissão para deletar esta categoria!");
    }

    await prismaClient.category.delete({
      where: {
        id: categoryId,
      },
    });

    return "Categoria deletada com sucesso!";
  }

  async listCategories(userId: string) {
    const categories = await prismaClient.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  }

  async getCategoryById(userId: string, categoryId: string) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    if (category.userId !== userId) {
      throw new Error("Você não tem permissão para acessar esta categoria!");
    }

    return category;
  }
}
