interface PaginatedProductsResponse {
    data: {
        site: {
            products: {
                pageInfo: {
                    startCursor: string
                    endCursor: string
                },
                edges: {
                    cursor: string
                    node: {
                        name: string
                        prices: {
                            price: {
                                currencyCode: string
                                value: number
                            }
                        },
                        images: {
                            edges: {
                                node: {
                                    urlOriginal: string
                                }
                            }[]
                        }
                    }
                }[]
            }
        }
    }
}