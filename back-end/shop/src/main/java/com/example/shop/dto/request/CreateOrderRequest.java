package com.example.shop.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequest {

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String receiverName, String receiverPhone, String receiverAddress, List<CartItemRequest> orderItems) {
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.receiverAddress = receiverAddress;
        this.orderItems = orderItems;
    }

    @NotBlank(message = "Tên người nhận không được bỏ trống!")
    @NotNull(message = "Tên người nhận không được bỏ trống!")
    private String receiverName;

    @NotBlank(message = "Số điện thoại người nhận không được bỏ trống!")
    @NotNull(message = "Số điện thoại người nhận không được bỏ trống!")
    private String receiverPhone;

    @NotBlank(message = "Địa chỉ người nhận không được bỏ trống!")
    @NotNull(message = "Địa chỉ người nhận không được bỏ trống!")
    private String receiverAddress;

    public String getReciverName() {
        return receiverName;
    }

    public void setReciverName(String reciverName) {
        this.receiverName = reciverName;
    }

    public String getReciverPhone() {
        return receiverPhone;
    }

    public void setReciverPhone(String reciverPhone) {
        this.receiverPhone = reciverPhone;
    }

    public String getReciverAddress() {
        return receiverAddress;
    }

    public void setReciverAddress(String reciverAddress) {
        this.receiverAddress = reciverAddress;
    }


    @Valid
    private List<@Valid CartItemRequest> orderItems;


    @AssertTrue(message = "Danh sách item để thêm vào đơn hàng trống!")
    public boolean isItemsBankOrNull() {
        if (orderItems == null || orderItems.size() == 0) {
            return false;
        }

        return true;
    }
}
