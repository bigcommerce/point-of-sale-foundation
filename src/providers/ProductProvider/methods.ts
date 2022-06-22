import { Product, OptionValue, SlimProduct, Category, ProductsResponse } from "./context";

export interface MethodOptions {
  access_token: string;
}

export interface GetProductDetailsProps {
  id: string;
  options: MethodOptions;
}

export type GetProductsQuery = {
  pageSize: number;
  cursor: string;
  categoryId: number;
};

export type GetProductDetailsFunction = (
  id: string,
  options: MethodOptions
) => Promise<Product | null>;
export type GetProductWithOptionsFunction = (
  id: string,
  optionsWithValueId: OptionValue[],
  options: MethodOptions
) => Promise<SlimProduct | null>;
export type GetProductsFunction = (
  query: GetProductsQuery,
  options: MethodOptions
) => Promise<ProductsResponse>;
export type GetCategoriesFunction = (options: MethodOptions) => Promise<Category[]>;

export class UserError extends Error {
  public responseJson: any;
  constructor(public message: string, public body: any) {
    super(message);
    this.responseJson = body;
    Object.setPrototypeOf(this, UserError.prototype);
  }
  getResponseJson() {
    return this.responseJson;
  }
}

export class SessionExpiredError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, SessionExpiredError.prototype);
  }
}

export class ForbiddenError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

const apiUri = "/api";

export const getProductDetailsMethod: GetProductDetailsFunction = (id, { access_token }) => {
  return fetch(`${apiUri}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Product | null>;
  });
};

export const getProductWithOptionsMethod: GetProductWithOptionsFunction = (
  id,
  optionValueIds,
  { access_token }
) => {
  return fetch(`${apiUri}/products/${id}/options`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ optionValueIds })
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<SlimProduct | null>;
  });
};

export const getProductsMethod: GetProductsFunction = (query, { access_token }) => {
  let queryString = `?pageSize=${query.pageSize}`;
  if (query.cursor) {
    queryString += `&cursor=${query.cursor}`;
  }
  if (query.categoryId) {
    queryString += `&categoryId=${query.categoryId}`;
  }

  const url = `${apiUri}/products${queryString}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<ProductsResponse>;
  });
};

export const getCategoriesMethod: GetCategoriesFunction = ({ access_token }) => {
  const url = `${apiUri}/categories`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  }).then(response => {
    if (!response.ok) {
      if (response.status === 400) {
        return response.json().then(data => {
          throw new UserError(response.statusText, data);
        });
      } else if (response.status === 401) {
        throw new SessionExpiredError("JWT expired");
      } else if (response.status === 403) {
        throw new ForbiddenError("Forbidden");
      }
    }
    return response.json() as Promise<Category[]>;
  });
};
