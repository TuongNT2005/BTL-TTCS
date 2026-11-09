package com.example.shop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderInfoRequest {

    public UpdateOrderInfoRequest() {
    }

    public UpdateOrderInfoRequest(String receiverName, String receiverPhone, String receiverAddress, Long coinBeingUsed) {
        this.receiverName = receiverName;
        this.receiverPhone = receiverPhone;
        this.receiverAddress = receiverAddress;
        this.coinBeingUsed = (coinBeingUsed != null) ? coinBeingUsed : 0L;
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

    @Min(value = 0, message = "Số coin muốn sử dụng không < 0!")
    private Long coinBeingUsed = 0l;

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
}
