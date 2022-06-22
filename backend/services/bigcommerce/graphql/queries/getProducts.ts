type ImageField = {
  url1280wide: string;
  altText: string;
};

type MoneyField = {
  value: number;
  currencyCode: string;
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

type PriceRange = {
  min: MoneyField;
  max: MoneyField;
};

type Prices = {
  price: MoneyField;
  priceRange: PriceRange;
  salePrice: MoneyField;
  retailPrice: MoneyField;
  saved: MoneyField;
};

type Availability = {
  status: string;
  description: string;
};

type Brand = {
  name: string;
};

type ReviewSummary = {
  summationOfRatings: number;
  numberOfReviews: number;
};

type SlimProduct = {
  id: string;
  entityId: number;
  name: string;
  plainTextDescription: string;
  availabilityV2: Availability;
  defaultImage: ImageField;
  brand: Brand;
  reviewSummary: ReviewSummary;
  prices: Prices;
};

type Edges = {
  node: SlimProduct;
};

export type GetProductsResponse = {
  pageInfo: PageInfo;
  edges: Edges[];
};

export const getProductsQuery = `
fragment ImageFields on Image {
  url1280wide: url(width: 1280)
  altText
}
fragment MoneyFields on Money {
  value
  currencyCode
}
fragment PageInfoFields on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
}
query getProducts(
    $pageSize: Int = 20
    $cursor: String
) {
  site {
    products(first: $pageSize, after: $cursor) {
      pageInfo {
        ...PageInfoFields
      }
      edges {
        node {
          id
          entityId
          name
          plainTextDescription
          availabilityV2 {
            status
            description
          }
          defaultImage {
            ...ImageFields
          }
          brand {
            name
          }
          reviewSummary {
            summationOfRatings
            numberOfReviews
          }
          prices {
            price {
              ...MoneyFields
            }
            priceRange {
              min {
                ...MoneyFields
              }
              max {
                ...MoneyFields
              }
            }
            salePrice {
              ...MoneyFields
            }
            retailPrice {
              ...MoneyFields
            }
            saved {
              ...MoneyFields
            }
          }
        }
      }
    }
  }
}
`;
