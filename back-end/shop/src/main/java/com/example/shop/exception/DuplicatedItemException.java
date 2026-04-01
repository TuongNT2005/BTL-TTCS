package com.example.shop.exception;

public class DuplicatedItemException extends RuntimeException {

    public DuplicatedItemException(String message) {
        super(message);
    }
    
}
