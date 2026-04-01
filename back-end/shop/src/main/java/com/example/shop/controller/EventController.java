package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateEventRequest;
import com.example.shop.dto.request.UpdateEventRequest;
import com.example.shop.dto.response.CreateEventResponse;
import com.example.shop.entity.Event;
import com.example.shop.service.EventService;
import org.springframework.web.bind.annotation.PutMapping;



@Controller
@RequestMapping("/event")
public class EventController {

    @Autowired private EventService eventServive;

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(CreateEventRequest request) {
        Event event = eventServive.createEvent(request);
        
        ApiResponse<CreateEventResponse> response = ApiResponse.<CreateEventResponse>builder()
            .code(200)
            .message("Tạo sự kiện mới thành công!")
            .data(new CreateEventResponse(event))
            .build(); 

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateEvent(UpdateEventRequest request) {
        Event event = eventServive.updateEvent(request);

        ApiResponse<Event> response = ApiResponse.<Event>builder()
            .code(200)
            .message("Cập nhập thông tin sự kiện thành công!")
            .data(event)
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
