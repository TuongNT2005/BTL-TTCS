package com.example.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdateRefundRequest {

    public UpdateRefundRequest() {
    }

    public UpdateRefundRequest(String status, String responseNote) {
        this.status = status;
        this.responseNote = responseNote;
    }

    @NotBlank(message = "Trạng thái đổi trả không được để trống!")
    private String status;

    private String responseNote;
}

