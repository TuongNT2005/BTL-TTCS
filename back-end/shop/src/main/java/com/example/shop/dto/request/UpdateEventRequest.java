package com.example.shop.dto.request;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEventRequest {

    public UpdateEventRequest() {
    }

    public UpdateEventRequest(String title, String description, LocalDate startAt, LocalDate endAt, Integer discount, List<Integer> productIds) {
        this.title = title;
        this.description = description;
        this.startAt = startAt;
        this.endAt = endAt;
        this.discount = discount;
        this.productIds = productIds;
    }

    @NotBlank(message = "Tiêu đề sự kiện không được null")
    @NotEmpty(message = "Tiêu đề sự kiện không được bỏ trống!")
    private String title;
    
    @NotBlank(message = "Mô tả sự kiện không được null!")
    @NotEmpty(message = "Mô tả sự kiện không được bỏ trống!")
    private String description;

    @NotNull(message = "Ngày bắt đầu không được null!")
    private LocalDate startAt;

    @NotNull(message = "Ngày kết thúc không được null!")
    private LocalDate endAt;

    @Min(value = 1, message = "Mức giảm không được <= 0%")
    @Max(value = 30, message = "Mức giảm giá không được > 30%")
    private Integer discount;

    private List<Integer> productIds;

    @AssertTrue(message = "Ngày bắt đầu phải trước ngày kết thúc")
    public boolean isStartBeforeEnd() {
        if (startAt == null || endAt == null) {
            return true;
        }

        return startAt.isBefore(endAt);
    }
}
