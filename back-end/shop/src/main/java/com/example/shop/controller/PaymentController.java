package com.example.shop.controller;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.model.VnPayParameters;
import com.example.shop.dto.response.PaymentResponse;
import com.example.shop.entity.Order;
import com.example.shop.service.OrderService;
import com.example.shop.service.VnpayPaymentService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private VnpayPaymentService vnpayPaymentService;
    @Autowired
    private OrderService orderService;

    @GetMapping("/gen-url/{orderId}")
    public ResponseEntity<?> genPaymentUrl(@PathVariable(name = "orderId") Integer orderId, HttpServletRequest req)
            throws UnsupportedEncodingException {
            
        VnPayParameters parameters = vnpayPaymentService.getParameters(orderId);
        String paymentUrl = vnpayPaymentService.genPaymentUrl(req, parameters);

        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .code(200)
                .message("Tạo địa chỉ thanh toán đơn hàng thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/handle-result")
    public ResponseEntity<?> handleResult(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> paymentResult = vnpayPaymentService.getResult(request);
        Order order = orderService.comfirmPurchasedOrder(paymentResult);

        PaymentResponse paymentResponse = PaymentResponse.builder()
                .orderId(paymentResult.get("vnp_TxnRef"))
                .totalAmout(paymentResult.get("vnp_Amount"))
                .bankInfor(paymentResult.get("vnp_BankTranNo"))
                .cardType(paymentResult.get("vnp_CardType"))
                .payDate(paymentResult.get("vnp_PayDate"))
                .message(paymentResult.get("vnp_OrderInfo"))
                .transactionNo(paymentResult.get("vnp_TransactionNo"))
                .status(order.getStatus().toString().equals("PAID") ? "Thanh toán thành công!"
                        : "Thanh toán thất bại")
                .build();

        ApiResponse<PaymentResponse> response = ApiResponse.<PaymentResponse>builder()
            .code(200)
            .message(paymentResponse.getMessage())
            .data(paymentResponse)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/test-ipnUrl")
    public String getMethodName(@RequestParam String param) {
        System.out.println("hello");
        return new String();
    }
    
}
