package com.example.shop.dto.projection_interface;

public interface UserWithSpending {
    Integer getId();

    String getEmail();

    String getAvatar();

    Integer getBoughtProducts();

    Long getSpending();

    public default void printInfo() {
        System.out.println("userId: " + getId() + ", " + "email: " + getEmail() + ", " + "avatar: " + getAvatar() + ", "
                + "total products: " + getBoughtProducts() + ", " + "total spending: " + getSpending());
    }
}
