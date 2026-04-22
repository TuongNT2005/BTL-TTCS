package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateRefundRequest;
import com.example.shop.dto.request.HandleRefundRequest;
import com.example.shop.dto.response.CreateRefundResponse;
import com.example.shop.dto.response.RefundRequestDTO;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.service.ColorService;
import com.example.shop.service.ProductService;
import com.example.shop.service.RefundService;
import com.example.shop.service.UserService;
import com.example.shop.util.Converter;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/refund")
public class RefundController {

    @Autowired
    private RefundService refundService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ColorService colorService;

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    public ResponseEntity<?> postMethodName(CreateRefundRequest request) {
        RefundRequest refundRequest = refundService.createNewRefundRequest(request);

        ApiResponse<CreateRefundResponse> response = ApiResponse.<CreateRefundResponse>builder()
                .code(200)
                .message("Tạo yêu cầu hoàn tiền thành công!")
                .data(new CreateRefundResponse(refundRequest))
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/handle")
    public ResponseEntity<?> handleRefundRequest(HandleRefundRequest request) {
        RefundRequest refundRequest = refundService.handleRefundRequest(request);
        ApiResponse<RefundRequest> response = ApiResponse.<RefundRequest>builder()
                .code(200)
                .message("Cập nhập trạng thái thành công!")
                .data(refundRequest)
                .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/return-coin/{id}")
    public ResponseEntity<?> returnCoinToUser(@PathVariable(name = "id") Integer refundRequestId) {
        RefundRequest refundRequest = refundService.refundToUserUsingCoin(refundRequestId);
        ApiResponse<RefundRequest> response = ApiResponse.<RefundRequest>builder()
                .code(200)
                .message("Hoàn coin thành công!")
                .data(refundRequest)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRefundRequestByStatus(@RequestParam(name = "status") String status,
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "keyword") String keyword) {

        Page<RefundRequest> refundRequests = refundService.searchRefundRequest(page - 1, status, keyword);
        Page<RefundRequestDTO> data = refundRequests.map(refundRequest -> {
            User user = userService.findUserById(refundRequest.getUserId());
            Product product = productService.findByOrderItemId(refundRequest.getOrderItemId());
            ProductVariant productVariant = productService
                    .findProductVariantByOrderItemId(refundRequest.getOrderItemId());
            String color = colorService.findColorNameById(productVariant.getColorId());
            return Converter.convertRefundRequestToRefundRequestDTO(refundRequest, user, product, color, productVariant);
        });

        ApiResponse<Page<RefundRequestDTO>> response = ApiResponse.<Page<RefundRequestDTO>>builder()
                .code(200)
                .message("Lấy thông tin yêu cầu hoàn tiền thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRefundRequestById(@PathVariable(name = "id") Integer refundRequestId) {
        RefundRequest refundRequest = refundService.findByRefundRequestId(refundRequestId);
        User user = userService.findUserById(refundRequest.getUserId());
        Product product = productService.findByOrderItemId(refundRequest.getOrderItemId());
        ProductVariant productVariant = productService.findProductVariantByOrderItemId(refundRequest.getOrderItemId());
        String color = colorService.findColorNameById(productVariant.getColorId());

        ApiResponse<RefundRequestDTO> response = ApiResponse.<RefundRequestDTO>builder()
                .code(200)
                .message("Lấy dữ liệu thành công!")
                .data(Converter.convertRefundRequestToRefundRequestDTO(refundRequest, user, product, color,
                        productVariant))
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
