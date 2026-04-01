export default {
    login: "http://localhost:8080/auth/login",
    registration: "http://localhost:8080/auth/registration",
    upload: "http://localhost:8080/uploads",
    admin: {
        productTab: {
            getData:"http://localhost:8080/products/products",
            getProductById: "http://localhost:8080/products",
            updateProduct: "http://localhost:8080/products/update",
            searchProduct: "http://localhost:8080/products/search",
            createProduct: "http://localhost:8080/products/create"
        },
        warehouseTab: {
            getData:"http://localhost:8080/products/productvariants",
            getProductVariantById: "http://localhost:8080/products/product-variant",
            updateProduct: "http://localhost:8080/products/update",
            searchProductVariant: "http://localhost:8080/products/product-variants",
            createProduct: "http://localhost:8080/products/create"
        }
    }
};