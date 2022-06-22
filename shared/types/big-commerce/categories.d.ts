interface CategoriesResponse {
    data: {
        site: {
            categoryTree: {
                entityId: number
                name: string
                path: string
            }[]
        }
    }
}