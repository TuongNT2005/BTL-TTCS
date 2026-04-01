package com.example.shop.exception;

public class QuantityNotEnoughException extends RuntimeException {

    public QuantityNotEnoughException(String message) {
        super(message);
    }
    
}
