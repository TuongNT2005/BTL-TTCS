package com.example.shop.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateEventRequest;
import com.example.shop.dto.request.UpdateEventRequest;
import com.example.shop.entity.Event;
import com.example.shop.exception.DuplicatedItemException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.util.Converter;
import com.example.shop.util.FileUtil;

@Service
public class EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private ProductRepository productRepository;

    public Integer findDiscounts(Integer productId) {
        List<Event> events = eventRepository.findAllByProductId(productId);
        Integer discount = 0;
        for(Event event : events) {
            discount += event.getDiscount();
            if(discount>30) {
                discount = 30;
                break;
            }
        }
        return discount;
    }

    public void checkDuplicatedEvent(String title) {
        Optional<Event> event = eventRepository.findByTitleIgnoringCase(title);
        if(event.isPresent()) {
            throw new DuplicatedItemException(String.format("Sự kiện: %s đã tồn tại trong hệ thống", title));
        }
    }

    public Event createEvent(CreateEventRequest request) {
        checkDuplicatedEvent(request.getTitle());
        try {

            String fileName = FileUtil.saveFileToDir(request.getBackground(), "event", FileUtil.genFileName("event_"));

            Event event = Event.builder()
                .description(request.getDescription())
                .title(request.getTitle())
                .discount(request.getDiscount())
                .startAt(Converter.StringToLocalDate(request.getStartAt()))
                .endAt(Converter.StringToLocalDate(request.getEndAt()))
                .image(fileName)
                .build();

            eventRepository.save(event);
            return event;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Event findEventById(Integer eventId) {
        return eventRepository.findById(eventId)
            .orElseThrow(() -> new NotFoundException(String.format("Sự kiện với id=%d không tồn tại trong hệ thống!", eventId)));
    }

    public Event updateEvent(UpdateEventRequest request) {
        Event event = findEventById(request.getId());
        try {
            if(FileUtil.isFilePresent(request.getBackground())) {
                FileUtil.deleteFile(event.getImage());
                String fileName = FileUtil.saveFileToDir(request.getBackground(), "event", FileUtil.genFileName("event_"));
                event.setImage(fileName);
            }

            event.setDescription(request.getDescription());
            event.setDiscount(request.getDiscount());
            event.setStartAt(Converter.StringToLocalDate(request.getStartAt()));
            event.setEndAt(Converter.StringToLocalDate(request.getEndAt()));
            event.setTitle(request.getTitle());

            List<Integer> curDiscountedProductIds = productRepository.findAllProductIdByEventId(request.getId());
            List<Integer> newDiscountedProductIds = request.getDiscountedProductIds();
            
            for(Integer id : newDiscountedProductIds) {
                if(!curDiscountedProductIds.contains(id)) {
                   eventRepository.addProductIntoEvent(id, request.getId());
                }
            }

            for(Integer id : curDiscountedProductIds) {
                if(!newDiscountedProductIds.contains(id)) {
                   eventRepository.deleteProductFromEvent(id, request.getId());
                }
            }

            eventRepository.save(event);
            return event;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
