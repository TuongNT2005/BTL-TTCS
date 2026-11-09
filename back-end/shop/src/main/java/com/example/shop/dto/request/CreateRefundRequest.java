package com.example.shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateRefundRequest {

    public CreateRefundRequest() {
    }

    public CreateRefundRequest(Integer orderItemId, String reason, Integer quantity, String image) {
        this.orderItemId = orderItemId;
        this.reason = reason;
        this.quantity = quantity;
        this.image = image;
    }

    @NotNull(message = "Mã chi tiết đơn hàng (orderItemId) không được để trống!")
    private Integer orderItemId;

    @NotBlank(message = "Lý do đổi trả không được để trống!")
    private String reason;

    @NotNull(message = "Số lượng yêu cầu đổi trả không được để trống!")
    @Min(value = 1, message = "Số lượng yêu cầu đổi trả phải >= 1")
    private Integer quantity;

    private String image;
}

