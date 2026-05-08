package com.example.shop.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(500)
            .message(ex.getMessage())
            .data(null)
            .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<?> handleNotFoundException(NotFoundException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(404)
            .message(ex.getMessage())
            .data(null)
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ActionUnavalibleException.class)
    public ResponseEntity<?> handleActionUnavalibleException(ActionUnavalibleException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(400)
            .message(ex.getMessage())
            .data(null)
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

}
