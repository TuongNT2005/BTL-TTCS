package com.example.shop.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.shop.dto.ApiResponse;
import com.example.shop.dto.projection_interface.EventProjection;
import com.example.shop.dto.projection_interface.EventWithAppliedProducts;
import com.example.shop.dto.request.CreateNewEventRequest;
import com.example.shop.dto.request.UpdateEventRequest;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.service.EventService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping({"/events", "/event"})
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createEvent(@Valid @RequestBody CreateNewEventRequest request) {
        com.example.shop.entity.Event event = eventService.createNewEvent(request);

        ApiResponse<Integer> response = ApiResponse.<Integer>builder()
                .code(201)
                .message("Thao tác thành công!")
                .data(event.getId())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .location(java.net.URI.create("/events/" + event.getId()))
                .body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{eventId}")
    public ResponseEntity<?> updateEvent(@Valid @RequestBody UpdateEventRequest request, @PathVariable(name = "eventId") Integer eventId) {

        eventService.updateEvent(request, eventId);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message("Thao tác thành công!")
                .data("")
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /*
        For querry

        - keyword
        - page
        - size
        - startAt
        - endAt
        - status: ENDED, AVAILABLE, COMING

        For sorting

        - startAt
        - discount
    */
    @GetMapping("")
    public ResponseEntity<?> getEvents(@RequestParam(required = false, name = "keyword", defaultValue = "") String keyword,
                            @RequestParam(required = false, name = "status", defaultValue = "available") String status,
                            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                            @RequestParam(required = false, name = "size") Integer size,
                            @RequestParam(required = false, name = "pageSize") Integer pageSize,
                            @RequestParam(required = false, name = "startAt", defaultValue = "2025-01-31") LocalDate startAt,
                            @RequestParam(required = false, name = "endAt", defaultValue = "2100-01-01") LocalDate endAt,
                            @RequestParam(required = false, name = "sortBy") List<String> sortCriterias,
                            @RequestParam(required = false, name = "sortDir") List<String> sortDirections) {
        
        int limit = size != null ? size : (pageSize != null ? pageSize : 10);
        int safePage = Math.max(0, (page != null ? page : 1) - 1);
        Sort sort = SortParamExtracter.extractFromParams(sortCriterias, sortDirections);

        Page<EventProjection> data = eventService.searchEvents(
            PageRequest.of(safePage, limit, sort), 
            keyword, status, startAt, endAt);

        ApiResponse<Page<EventProjection>> response = ApiResponse.<Page<EventProjection>>builder()
            .code(200)
            .message("Thao tác thành công!")
            .data(data)
            .build();
        
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping({"/{eventId}", "/detail/{eventId}"})
    public ResponseEntity<?> getEventDetailById(@PathVariable(name = "eventId") Integer eventId) {

        EventWithAppliedProducts eventWithAppliedProducts = eventService.findEventWithAppliedProductsById(eventId);
        ApiResponse<EventWithAppliedProducts> response = ApiResponse.<EventWithAppliedProducts>builder()
            .code(200)
            .message("Thao tác thành công!")
            .data(eventWithAppliedProducts)
            .build();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    
}
