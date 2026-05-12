

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
            createProduct: "http://localhost:8080/products/create",
        },
        warehouseTab: {
            getData:"http://localhost:8080/products/productvariants",
            getProductVariantById: "http://localhost:8080/products/product-variant",
            updateProductVariant: "http://localhost:8080/products/product-variant",
            searchProductVariant: "http://localhost:8080/products/product-variants",
            importProductVariant: "http://localhost:8080/warehouse/import",
        },
        userTab: {
            searchUser: "http://localhost:8080/users/search",
            getUserById: "http://localhost:8080/users/user",
        },
        eventTab: {
            searchEvent: "http://localhost:8080/event/search",
            updateEvent: "http://localhost:8080/event/update",
            getEventById: "http://localhost:8080/event",
            createEvent: "http://localhost:8080/event/create",
        },
        refundTab: {
            searchRefundRequest: "http://localhost:8080/refund/search",
            getRefundRequestById: "http://localhost:8080/refund",
            handleRefundRequest: "http://localhost:8080/refund/handle",
            refundCoin: "http://localhost:8080/refund/return-coin",
        },
        orderTab: {
            searchOrder: "http://localhost:8080/order/search",
            getOrderDetailById: "http://localhost:8080/order/detail",
            comfirmSendingOrder: "http://localhost:8080/order/set-sending",
        }
    },
    home: {
        general: {
            getProductById: "http://localhost:8080/products",
            getCommentByProductId: "http://localhost:8080/comment",
            searchProduct: "http://localhost:8080/products/search",
            addToCart: "http://localhost:8080/cart/add-to-cart",
            submitComment: "http://localhost:8080/comment/create",
        },
        eventSection: {
            getEvents: "http://localhost:8080/event/all",
            getEventById: "http://localhost:8080/event",
        },
        hotProductSection: {
            getProducts: "http://localhost:8080/products/search?keyword=&page=1&category=",
            
        },
    },
    customer: {
        cartSection: {
            getCartItems: "http://localhost:8080/cart",
            createOrder: "http://localhost:8080/order/create",
            deleteItems: "http://localhost:8080/cart/delete-from-cart",
        },
        orderSection: {
            getOrders: "http://localhost:8080/order/get-all",
            updateOrderInfor: "http://localhost:8080/order/update",
            cancelOrder: "http://localhost:8080/order/cancel",
            getPaymentUrl: "http://localhost:8080/payment/gen-url",
        },
        historySection: {
            getBoughtItems: "http://localhost:8080/order/bought-items",
            createRefundRequest: "http://localhost:8080/refund/create"
        },
        refundRequestSection: {
            getRequests: "http://localhost:8080/refund/search-by-user-id"
        }
    }
};