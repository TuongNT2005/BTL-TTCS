package com.example.shop.controller;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.RefundRequestProjection;
import com.example.shop.dto.request.CreateRefundRequest;
import com.example.shop.dto.request.UpdateRefundRequest;
import com.example.shop.entity.RefundRequest;
import com.example.shop.service.AuthService;
import com.example.shop.service.RefundRequestService;

import jakarta.validation.Valid;
@RestController
@RequestMapping({"/refund-requests", "/refund"})
public class RefundRequestController {

    private final RefundRequestService refundRequestService;
    private final AuthService authService;

    public RefundRequestController(RefundRequestService refundRequestService, AuthService authService) {
        this.refundRequestService = refundRequestService;
        this.authService = authService;
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createRefundRequest(@Valid @RequestBody CreateRefundRequest request) {
        Integer userId = authService.getAuthenticatedUserId();
        RefundRequest refund = refundRequestService.createRefundRequest(request, userId);

        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(201)
                .message("Tạo yêu cầu hoàn hàng thành công!")
                .data(refund.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(URI.create("/refund-requests/" + refund.getId()))
                .body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public ResponseEntity<?> searchRefundRequests(
            @RequestParam(required = false, name = "status", defaultValue = "") String status,
            @RequestParam(required = false, name = "keyword", defaultValue = "") String keyword,
            @RequestParam(required = false, name = "userId") Integer userId,
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size") Integer size,
            @RequestParam(required = false, name = "pageSize") Integer pageSize) {

        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);

        Page<RefundRequestProjection> data = refundRequestService.searchRefundRequests(
                PageRequest.of(safePage, limit, Sort.by(Sort.Direction.DESC, "createdAt")),
                status, keyword, userId);

        ApiResponse<Page<RefundRequestProjection>> response = ApiResponse.<Page<RefundRequestProjection>>builder()
                .code(200)
                .message("Lấy danh sách yêu cầu hoàn hàng thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping({"/my-refunds", "/my-requests", "/my"})
    public ResponseEntity<?> getMyRefundRequests(
            @RequestParam(required = false, name = "status", defaultValue = "") String status,
            @RequestParam(required = false, name = "keyword", defaultValue = "") String keyword,
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size") Integer size,
            @RequestParam(required = false, name = "pageSize") Integer pageSize) {

        Integer userId = authService.getAuthenticatedUserId();
        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);

        Page<RefundRequestProjection> data = refundRequestService.searchRefundRequests(
                PageRequest.of(safePage, limit, Sort.by(Sort.Direction.DESC, "createdAt")),
                status, keyword, userId);

        ApiResponse<Page<RefundRequestProjection>> response = ApiResponse.<Page<RefundRequestProjection>>builder()
                .code(200)
                .message("Lấy danh sách yêu cầu hoàn hàng của tôi thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getRefundRequestById(@PathVariable(name = "id") Integer id) {
        RefundRequestProjection data = refundRequestService.findRefundRequestById(id);

        ApiResponse<RefundRequestProjection> response = ApiResponse.<RefundRequestProjection>builder()
                .code(200)
                .message("Lấy chi tiết yêu cầu hoàn hàng thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRefundStatus(@PathVariable(name = "id") Integer id,
                                               @Valid @RequestBody UpdateRefundRequest request) {
        refundRequestService.updateRefundStatus(id, request);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Cập nhật trạng thái hoàn hàng thành công!")
                .data("")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}

