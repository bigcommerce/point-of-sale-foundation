
export const productImageFieldFragment = `
fragment ImageFields on Image {
  url1280wide: url(width: 1280)
  altText
}`

export const productMoneyFieldsFragment = `
fragment MoneyFields on Money {
  value
  currencyCode
}
`;

export const productPageInfoFieldsFragment = `
fragment PageInfoFields on PageInfo {
  hasNextPage
  hasPreviousPage
  startCursor
  endCursor
}
`;

export const getProductsQuery = `
${productImageFieldFragment}
${productMoneyFieldsFragment}
${productPageInfoFieldsFragment}
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

export const getProductByIdQuery = `
${productImageFieldFragment}
${productMoneyFieldsFragment}
query ExtendedProductById($productId: Int!) {
  site {
    product(entityId: $productId) {
      id
      entityId
      name
      plainTextDescription
      defaultImage {
        ...ImageFields
      }
      images {
        edges {
          node {
            ...ImageFields
          }
        }
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
      brand {
        name
      }
      availabilityV2 {
        status
        description
      }
      productOptions(first: 50) {
        edges {
          node {
            entityId
            displayName
            isRequired
            isVariantOption
            ... on CheckboxOption {
              checkedByDefault
              label
            }
            ... on TextFieldOption {
              textDefaultValue: defaultValue
              minLength
              maxLength
            }
            ... on NumberFieldOption {
              numberDefaultValue: defaultValue
              lowest
              highest
              isIntegerOnly
              limitNumberBy
            }
            ... on DateFieldOption {
              dateDefaultValue: defaultValue
              earliest
              latest
              limitDateBy
            }
            ... on MultiLineTextFieldOption {
              textDefaultValue: defaultValue
              minLength
              maxLength
              maxLines
            }
            ... on FileUploadFieldOption {
              maxFileSize
              fileTypes
            }
            ... on MultipleChoiceOption {
              displayStyle
              values(first: 10) {
                edges {
                  node {
                    entityId
                    label
                    isDefault
                    ... on SwatchOptionValue {
                      hexColors
                      imageUrl(width: 200)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const getProductWithOptionSelectionsQuery = `
${productImageFieldFragment}
${productMoneyFieldsFragment}
query ProductsWithOptionSelections(
  $productId: Int!,
  $optionValueIds: [OptionValueId!]
) {
  site {
    productWithSelectedOptions: product(
      entityId: $productId
      optionValueIds: $optionValueIds
    ) {
      name
      defaultImage {
        ...ImageFields
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
      sku
      availabilityV2 {
        status
        description
      }
    }
  }
}
`;

export const getProductCategoriesQuery = `
fragment CategoryFields on CategoryTreeItem {
  name
  path
  entityId
}
query CategoryTree3LevelsDeep {
  site {
    categoryTree {
      ...CategoryFields
      children {
        ...CategoryFields
        children {
          ...CategoryFields
        }
      }
    }
  }
}
`;

export const getProductsByCategoryIdQuery = `
${productImageFieldFragment}
${productMoneyFieldsFragment}
${productPageInfoFieldsFragment}
query categoryQuery(
  $categoryId: Int!
  $pageSize: Int = 20
  $cursor: String
) {
    site {
      category(entityId: $categoryId) {
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
        breadcrumbs(depth: 6) {
          edges {
            cursor
            node {
              entityId
              name
            }
          }
        }
      }
    }
  }
`;