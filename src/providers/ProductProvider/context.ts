import { createContext, useContext } from "react";

import { UserError } from "./methods";

export type ProductAvailability = {
  status: string;
  description: string;
};

export type ProductImage = {
  url1280wide: string;
  altText: string;
};

export type ProductBrand = {
  name: string;
};

export type ProductReviewSummary = {
  summationOfRatings: number;
  numberOfReviews: number;
};

export type ProductPriceFields = {
  value: number;
  currencyCode: string;
};

export type ProductPrices = {
  price: ProductPriceFields;
  salePrice: ProductPriceFields;
};

export type SlimProduct = {
  id: string;
  entityId: number;
  name: string;
  plainTextDescription: string;
  availabilityV2: ProductAvailability;
  defaultImage: ProductImage;
  brand: ProductBrand;
  reviewSummary: ProductReviewSummary;
  prices: ProductPrices;
  quantity: number;
  productOptions: { id: number; value: string }[];
  taxable: boolean;
  notes: string;
};

export type SlimProductNode = {
  node: SlimProduct;
};

export type ProductsResponse = {
  pageInfo: PageInfo;
  edges: SlimProductNode[];
};

export type OptionValue = {
  optionEntityId: number;
  valueEntityId: number;
};

export type OptionValueNode = {
  entityId: number;
  label: string;
  isDefault: boolean;
  hexColors: string[];
  imageUrl: string;
  textDefaultValue: string | null;
  minLength: number | null;
  maxLength: number | null;
  maxLines: number | null;
  numberDefaultValue: number | null;
  lowest: number | null;
  highest: number | null;
  isIntegerOnly: boolean;
  limitNumberBy: string;
  dateDefaultValue: string | null;
  earliest: string | null;
  latest: string | null;
  limitDateBy: string;
  maxFileSize: number;
  fileType: string[];
};

export type OptionValueEdges = {
  edges: OptionValueNode[];
};

export type OptionNode = {
  entityId: number;
  displayName: string;
  isRequired: boolean;
  isVariantOption: boolean;
  displayStyle: string;
  values: OptionValueEdges;
};

export type OptionEdge = {
  node: OptionNode;
};

export type ProductOptions = {
  edges: OptionEdge[];
};

export type Product = {
  id: string;
  entityId: number;
  name: string;
  plainTextDescription: string;
  defaultImage: ProductImage;
  availabilityV2: ProductAvailability;
  brand: ProductBrand;
  reviewSummary: ProductReviewSummary;
  prices: ProductPrices;
  productOptions: ProductOptions;
};

export type Category = {
  name: string;
  path: string;
  entityId: number;
  children: Category[];
};

export type ProductWithOptions = {
  prices: ProductPrices;
  sku: string;
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

export type ProductLoadingStates = {
  getProducts: boolean;
  getCategories: boolean;
  getProductDetails: boolean;
  getProductWithOptions: boolean;
};

export type ProductErrorStates = {
  getProducts: UserError | Error | null;
  getCategories: UserError | Error | null;
  getProductDetails: UserError | Error | null;
  getProductWithOptions: UserError | Error | null;
};

export interface ProductState {
  loaders: ProductLoadingStates;
  errors: ProductErrorStates;
  pageInfo: PageInfo;
  breadcrumbs: Category[];
  products: SlimProduct[];
  categories: Category[];
  productDetails: Product | null;
  productWithOptions: ProductWithOptions | null;
}

export type GetProductsAction = (
  query: { pageSize: number; categoryId: string | string[] },
  cursor?: string
) => Promise<ProductsResponse>;
export type GetCategoriesAction = () => Promise<Category[]>;
export type GetProductDetailsAction = (id: string) => Promise<Product | null>;
export type GetProductWithOptionsAction = (
  id: string,
  optionValueIds: any
) => Promise<ProductWithOptions | null>;
export type UpdateBreadcrumbsAction = (
  categoryId: number
) => Promise<Category[]>;
export type ClearProductsAction = () => Promise<null>;
export type ClearCategoriesAction = () => Promise<null>;
export type ClearProductDetailsAction = () => Promise<null>;
export type ClearProductWithOptionsAction = () => Promise<null>;
export type ClearErrorsAction = () => Promise<null>;

export interface ProductActions {
  getProducts: GetProductsAction;
  getCategories: GetCategoriesAction;
  getProductDetails: GetProductDetailsAction;
  getProductWithOptions: GetProductWithOptionsAction;
  updateBreadcrumbs: UpdateBreadcrumbsAction;
  clearProducts: ClearProductsAction;
  clearCategories: ClearCategoriesAction;
  clearProductDetails: ClearProductDetailsAction;
  clearProductWithOptions: ClearProductWithOptionsAction;
  clearErrors: ClearErrorsAction;
}

export interface ProductContextProps {
  state: ProductState;
  actions: ProductActions;
}

export const ProductContext = createContext<ProductContextProps>({
  state: {
    loaders: {
      // Keep loaders false on initialization as to not block SSR renders
      getProducts: false,
      getCategories: false,
      getProductDetails: false,
      getProductWithOptions: false
    },
    errors: {
      getProducts: null,
      getCategories: null,
      getProductDetails: null,
      getProductWithOptions: null
    },
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
      endCursor: ""
    },
    breadcrumbs: [],
    products: [],
    categories: [],
    productDetails: null,
    productWithOptions: null
  },
  actions: {
    getProducts: ({}) =>
      Promise.resolve({
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: "",
          endCursor: ""
        },
        edges: []
      }),
    updateBreadcrumbs: categoryId => Promise.resolve([]),
    getCategories: () => Promise.resolve([]),
    getProductDetails: id => Promise.resolve(null),
    getProductWithOptions: (id, optionValueIds) => Promise.resolve(null),
    clearProducts: () => Promise.resolve(null),
    clearCategories: () => Promise.resolve(null),
    clearProductDetails: () => Promise.resolve(null),
    clearProductWithOptions: () => Promise.resolve(null),
    clearErrors: () => Promise.resolve(null)
  }
});

ProductContext.displayName = "ProductContext";

export function useProductContext() {
  const context = useContext(ProductContext);
  return context;
}
