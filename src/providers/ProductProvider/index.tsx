import React, { useState } from "react";
import {
  ProductContext,
  GetProductsAction,
  GetCategoriesAction,
  GetProductDetailsAction,
  GetProductWithOptionsAction,
  ClearProductsAction,
  ClearCategoriesAction,
  ClearProductDetailsAction,
  ClearProductWithOptionsAction,
  ClearErrorsAction
} from "./context";
import { destroyCookie } from "nookies";
import {
  SessionExpiredError,
  getProductDetailsMethod,
  getProductWithOptionsMethod,
  getProductsMethod,
  getCategoriesMethod
} from "./methods";
import { useRouter } from "next/router";
import { isNullOrUndefined } from "@/shared/utils/isNullOrUndefined";

export * from "./context";

export type ActionBuilder<T> = {
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<any>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  execMethod: T;
};

const ProductProvider = (props: { access_token: string; children: React.ReactElement | any }) => {
  const { access_token, children } = props;
  const router = useRouter();
  const [getProductsLoader, setGetProductsLoader] = useState(false);
  const [getCategoriesLoader, setGetCategoriesLoader] = useState(false);
  const [getProductDetailsLoader, setGetProductDetailsLoader] = useState(false);
  const [getProductWithOptionsLoader, setGetProductWithOptionsLoader] = useState(false);

  const [getProductsError, setGetProductsError] = useState(null);
  const [getCategoriesError, setGetCategoriesError] = useState(null);
  const [getProductDetailsError, setGetProductDetailsError] = useState(null);
  const [getProductWithOptionsError, setGetProductWithOptionsError] = useState(null);

  const [products, setProducts] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const [productWithOptions, setProductWithOptions] = useState(null);

  const [productsHasNextPage, setProductsHasNextPage] = useState(false);
  const [productsHasPreviousPage, setProductsHasPreviousPage] = useState(false);
  const [productsStartCursor, setProductsStartCursor] = useState("");
  const [productsEndCursor, setProductsEndCursor] = useState("");

  const actionBuilder = ({ setLoader, setData, setError, execMethod }) =>
    function (...args) {
      args = Array.from(args).concat([{ access_token }]);
      setError(null);
      setLoader(true);
      return execMethod
        .apply(this, args)
        .then(data => {
          if (isNullOrUndefined(data.status)) {
            setData(data);
          } else {
            setError(data);
          }
          setLoader(false);
          return data;
        })
        .catch(e => {
          if (e instanceof SessionExpiredError) {
            destroyCookie(null, "access_token");
            destroyCookie(null, "first_time");
            destroyCookie(null, "employee");
            router.reload();
            return null;
          }
          setError(e);
          setLoader(false);
          throw e;
        });
    };

  const getProducts: GetProductsAction = actionBuilder({
    setLoader: setGetProductsLoader,
    setData: ({ pageInfo: { hasNextPage, hasPreviousPage, startCursor, endCursor }, edges }) => {
      setProductsHasNextPage(hasNextPage);
      setProductsHasPreviousPage(hasPreviousPage);
      setProductsStartCursor(startCursor);
      setProductsEndCursor(endCursor);
      return setProducts(edges.map(({ node }) => node));
    },
    setError: setGetProductsError,
    execMethod: getProductsMethod
  });

  const getCategories: GetCategoriesAction = actionBuilder({
    setLoader: setGetCategoriesLoader,
    setData: setCategories,
    setError: setGetCategoriesError,
    execMethod: getCategoriesMethod
  });

  const getProductDetails: GetProductDetailsAction = actionBuilder({
    setLoader: setGetProductDetailsLoader,
    setData: setProductDetails,
    setError: setGetProductDetailsError,
    execMethod: getProductDetailsMethod
  });

  const getProductWithOptions: GetProductWithOptionsAction = actionBuilder({
    setLoader: setGetProductWithOptionsLoader,
    setData: setProductWithOptions,
    setError: setGetProductWithOptionsError,
    execMethod: getProductWithOptionsMethod
  });

  const updateBreadcrumbs = async categoryId => {
    const breadcrumbPath = [];
    const recursiveSearch = categories => {
      return categories.find(category => {
        if (category.entityId === categoryId) {
          breadcrumbPath.unshift(category);
          return category;
        }
        if (category.children.length) {
          const categoryResult = recursiveSearch(category.children);
          if (categoryResult) {
            breadcrumbPath.unshift(category);
            return true;
          }
        }
        return false;
      });
    };
    recursiveSearch(categories);
    setBreadcrumbs(breadcrumbPath);
    return breadcrumbPath;
  };

  const clearProducts: ClearProductsAction = async () => {
    setProducts([]);
    return null;
  };

  const clearCategories: ClearCategoriesAction = async () => {
    setCategories([]);
    return null;
  };

  const clearProductDetails: ClearProductDetailsAction = async () => {
    setProductDetails(null);
    return null;
  };

  const clearProductWithOptions: ClearProductWithOptionsAction = async () => {
    setProductWithOptions(null);
    return null;
  };

  const clearErrors: ClearErrorsAction = async () => {
    getProductsError && getProductsError(null);
    getCategoriesError && getCategoriesError(null);
    getProductDetailsError && getProductDetailsError(null);
    getProductWithOptionsError && getProductWithOptionsError(null);
    return null;
  };

  const value = {
    state: {
      loaders: {
        getProducts: getProductsLoader,
        getCategories: getCategoriesLoader,
        getProductDetails: getProductDetailsLoader,
        getProductWithOptions: getProductWithOptionsLoader
      },
      errors: {
        getProducts: getProductsError,
        getCategories: getCategoriesError,
        getProductDetails: getProductDetailsError,
        getProductWithOptions: getProductWithOptionsError
      },
      pageInfo: {
        hasNextPage: productsHasNextPage,
        hasPreviousPage: productsHasPreviousPage,
        startCursor: productsStartCursor,
        endCursor: productsEndCursor
      },
      breadcrumbs,
      products,
      categories,
      productDetails,
      productWithOptions
    },
    actions: {
      getProducts,
      getCategories,
      getProductDetails,
      getProductWithOptions,
      updateBreadcrumbs,
      clearProducts,
      clearCategories,
      clearProductDetails,
      clearProductWithOptions,
      clearErrors
    }
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
export default ProductProvider;
