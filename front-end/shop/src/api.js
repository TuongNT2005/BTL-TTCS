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
            updateProductVariant: "http://localhost:8080/products/product-variant",
            searchProductVariant: "http://localhost:8080/products/product-variants",
            importProductVariant: "http://localhost:8080/warehouse/import"
        },
        userTab: {
            searchUser: "http://localhost:8080/users/search",
            getUserById: "http://localhost:8080/users/user",
        },
        eventTab: {
            searchEvent: "http://localhost:8080/event/search",
            updateEvent: "http://localhost:8080/event/update",
            getEventById: "http://localhost:8080/event",
            createEvent: "http://localhost:8080/event/create"
        },
        refundTab: {
            searchRefundRequest: "http://localhost:8080/refund/search",
            getRefundRequestById: "http://localhost:8080/refund",
            handleRefundRequest: "http://localhost:8080/refund/handle",
            refundCoin: "http://localhost:8080/refund/return-coin"
        },
        orderTab: {
            searchOrder: "http://localhost:8080/order/search",
            getOrderDetailById: "http://localhost:8080/order/detail",
            comfirmSendingOrder: "http://localhost:8080/order/sending"
        }
    },
    home: {
        general: {
            getProductById: "http://localhost:8080/products",
            getCommentByProductId: "http://localhost:8080/comment"
        },
        eventSection: {
            getEvents: "http://localhost:8080/event/all",
            getEventById: "http://localhost:8080/event"
        },
        hotProductSection: {
            getProducts: "http://localhost:8080/products/search?keyword=&page=1",
            
        }
    }
};