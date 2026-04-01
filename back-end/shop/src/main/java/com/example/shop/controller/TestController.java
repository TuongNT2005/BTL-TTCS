package com.example.shop.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.shop.dto.model.VnPayParameters;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Color;
import com.example.shop.entity.Comment;
import com.example.shop.entity.Event;
import com.example.shop.entity.ImportHistory;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.RefundRequest;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.ColorRepository;
import com.example.shop.repository.CommentRepository;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.ImportHistoryRepository;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.RefundRequestRepository;
import com.example.shop.service.VnpayPaymentService;
import com.example.shop.util.FileUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private ColorRepository colorRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private ImportHistoryRepository importHistoryRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private RefundRequestRepository refundRequestRepository;
    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/colors")
    public List<Color> getColors() {
        return colorRepository.findAll();
    }

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/product-variants")
    public List<ProductVariant> getProductVariants() {
        return productVariantRepository.findAll();
    }

    @GetMapping("/histories")
    public List<ImportHistory> getHistories() {
        return importHistoryRepository.findAll();
    }

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/order-items")
    public List<OrderItem> getOrderItems() {
        return orderItemRepository.findAll();
    }

    @GetMapping("/cart-items")
    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }

    @GetMapping("/comments")
    public List<Comment> getComments() {
        return commentRepository.findAll();
    }

    @GetMapping("/refund-requests")
    public List<RefundRequest> getRefundRequests() {
        return refundRequestRepository.findAll();
    }

    @GetMapping("/events")
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {

        try {

            FileUtil.saveFileToDir(file, "avatars", "testFile");

            return ResponseEntity.ok("Upload thành công");

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload thất bại");

        }

    }

    // @GetMapping("/url")
    // public String getMethodName(HttpServletRequest req) {
    //     VnPayParameters parameters = VnPayParameters.builder()
    //             .vnp_Amount("100000")
    //             .vnp_TxnRef("4")
    //             .build();
    //     try {
    //         return VnpayPaymentService.genPaymentUrl(req, parameters);
    //     } catch (UnsupportedEncodingException e) {
    //         // TODO Auto-generated catch block
    //         e.printStackTrace();
    //     }
    //     return new String();
    // }

    @GetMapping("/returnUrl")
    public Map<String, String> ge(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> fields = new HashMap<String, String>();
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = (String) params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
                System.out.println(String.format("%s : %s", fieldName, fieldValue));
            }
        }

        

        return fields;
    }

}
