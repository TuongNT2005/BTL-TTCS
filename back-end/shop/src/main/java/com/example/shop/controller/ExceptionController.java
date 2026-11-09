package com.example.shop.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.shop.dto.ApiResponse;
import com.example.shop.exception.ActionUnavailableException;
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

    @ExceptionHandler({ActionUnavailableException.class, ActionUnavalibleException.class})
    public ResponseEntity<?> handleActionUnavailableException(ActionUnavailableException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(400)
            .message(ex.getMessage())
            .data(null)
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(400)
            .message(ex.getBindingResult().getAllErrors().get(0).getDefaultMessage())
            .data(null)
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
            .code(403)
            .message("Bạn không có quyền thực hiện hành động này!")
            .data(null)
            .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
}
