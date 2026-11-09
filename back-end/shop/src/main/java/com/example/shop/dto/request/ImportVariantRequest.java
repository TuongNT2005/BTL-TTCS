package com.example.shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportVariantRequest {

    public ImportVariantRequest() {
    }

    public ImportVariantRequest(String colorName, String size, Integer quantity, Long importCost) {
        this.colorName = colorName;
        this.size = size;
        this.quantity = quantity;
        this.importCost = importCost;
    }
    @NotBlank(message = "Tên màu không được để trống!")
    private String colorName;

    @NotBlank(message = "Kích cỡ không được để trống!")
    private String size;

    @NotNull(message = "Số lượng nhập không được để trống!")
    @Min(value = 1, message = "Số lượng nhập phải lớn hơn hoặc bằng 1")
    private Integer quantity;

    @NotNull(message = "Giá nhập không được để trống!")
    @Min(value = 0, message = "Giá nhập không được âm")
    private Long importCost;
}

