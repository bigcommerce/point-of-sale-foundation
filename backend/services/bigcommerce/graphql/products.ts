import { Injectable } from "@/backend/decorators/Injectable";
import BigBaseGql from "./big-base-gql";
import {
  getProductsQuery,
  getProductByIdQuery,
  getProductWithOptionSelectionsQuery,
  getProductCategoriesQuery,
  getProductsByCategoryIdQuery
} from "./queries/products";

@Injectable()
export default class ProductsGQL extends BigBaseGql {
  public async getAllProducts({ cursor, pageSize, categoryId = null }) {
    if (categoryId) {
      const { data } = await this.runQuery(getProductsByCategoryIdQuery, {
        categoryId,
        pageSize,
        cursor
      });
      return data.site.category.products;
    }
    const { data }: PaginatedProductsResponse = await this.runQuery(getProductsQuery, {
      categoryId,
      pageSize,
      cursor
    });
    return data.site.products;
  }
  public async getProductById({ productId }) {
    const { data } = await this.runQuery(getProductByIdQuery, { productId });
    return data.site.product;
  }
  public async getProductCategories() {
    const { data } = await this.runQuery(getProductCategoriesQuery, {});
    return data.site.categoryTree;
  }
  public async getProductsByCategoryId({ categoryId, pageSize, cursor }) {
    const { data } = await this.runQuery(getProductsByCategoryIdQuery, {
      categoryId,
      pageSize,
      cursor
    });
    return data.site.category.products;
  }
  public async getProductWithOptionSelections({ productId, optionValueIds }) {
    const { data } = await this.runQuery(getProductWithOptionSelectionsQuery, {
      productId,
      optionValueIds
    });
    return data.site.productWithSelectedOptions;
  }
}
