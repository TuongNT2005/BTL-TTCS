package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateRefundRequest;
import com.example.shop.dto.request.HandleRefundRequest;
import com.example.shop.dto.response.CreateRefundResponse;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.service.RefundService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@Controller
@RequestMapping("/refund")
public class RefundController {

    @Autowired private RefundService refundService;

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

}
