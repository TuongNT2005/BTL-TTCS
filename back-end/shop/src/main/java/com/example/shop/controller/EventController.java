package com.example.shop.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.model.ApiResponse;
import com.example.shop.dto.request.CreateEventRequest;
import com.example.shop.dto.request.UpdateEventRequest;
import com.example.shop.dto.response.CreateEventResponse;
import com.example.shop.dto.response.EventDTO;
import com.example.shop.entity.Event;
import com.example.shop.entity.Product;
import com.example.shop.service.EventService;
import com.example.shop.service.ProductService;
import com.example.shop.util.Converter;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/event")
public class EventController {

    @Autowired
    private EventService eventServive;

    @Autowired
    private ProductService productService;

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

    @GetMapping("/search")
    public ResponseEntity<?> get(@RequestParam(name = "keyword") String keyword,
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "startAt") String startAt,
            @RequestParam(name = "endAt") String endAt) {

        Page<Event> res = eventServive.findAllEvents(page - 1, keyword, startAt, endAt);
        Page<EventDTO> events = res.map(event -> Converter.convertEventToEventDTO(event));

        Map<String, Integer> productList = new TreeMap<>();
        List<Product> products = productService.getAllProducts();
        for (Product product : products) {
            productList.put(product.getName(), product.getId());
        }

        Map<String, Object> data = new TreeMap<>();
        data.put("events", events);
        data.put("productList", productList);

        ApiResponse<Map<String,Object>> response = ApiResponse.<Map<String,Object>>builder()
                .code(200)
                .message("Lấy thông tin các sự kiện thành công!")
                .data(data)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable(value = "id") Integer eventId) {
        Event event = eventServive.findEventById(eventId);
        List<Product> productList = productService.findAllProductByEventId(eventId);
        Map<String, Object> productReturnList = new TreeMap<>();
        for(Product product : productList) {
            productReturnList.put(product.getName(), product.getId());
        }
        Map<String, Object> data = new TreeMap<>();
        data.put("event", event);
        data.put("productList", productReturnList);
        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
            .code(200)
            .message("Lấy dữ liệu sự kiện thành công!")
            .data(data)
            .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getEvents() {
        List<Event> events = eventServive.findAllEvent();
        List<EventDTO> eventDTOs = new ArrayList<>();
        for(Event event : events) {
            eventDTOs.add(Converter.convertEventToEventDTO(event));
        }
        
        ApiResponse<List<EventDTO>> response = ApiResponse.<List<EventDTO>>builder()
            .code(200)
            .message("Lấy thông tin sự kiện thành công!")
            .data(eventDTOs)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    
}
