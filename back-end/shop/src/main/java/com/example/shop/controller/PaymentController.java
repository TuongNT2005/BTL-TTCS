package com.example.shop.controller;

import java.io.IOException;
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
import jakarta.servlet.http.HttpServletResponse;

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
    public void handleResult(HttpServletRequest req, HttpServletResponse resp)
            throws UnsupportedEncodingException {
        Map<String, String> paymentResult = vnpayPaymentService.getResult(req);
        orderService.comfirmPurchasedOrder(paymentResult);

        String vnp_ResponseCode = paymentResult.get("vnp_ResponseCode");
        String vnp_TransactionStatus = paymentResult.get("vnp_TransactionStatus");
        String vnp_TxnRef = paymentResult.get("vnp_TxnRef");

        try {
            resp.sendRedirect(
                    "http://localhost:5173/payment"
                            + "?vnp_ResponseCode=" + vnp_ResponseCode
                            + "&vnp_TransactionStatus=" + vnp_TransactionStatus
                            + "&vnp_TxnRef=" + vnp_TxnRef);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    @GetMapping("/test-ipnUrl")
    public String getMethodName(@RequestParam String param) {
        System.out.println("hello");
        return new String();
    }

}
