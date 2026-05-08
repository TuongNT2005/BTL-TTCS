package com.example.shop.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateEventRequest;
import com.example.shop.dto.request.UpdateEventRequest;
import com.example.shop.entity.Event;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.util.ConstantVal;
import com.example.shop.util.Converter;
import com.example.shop.util.FileUtil;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private ProductRepository productRepository;
    

    public Integer findDiscounts(Integer productId) {
        List<Event> events = eventRepository.findAllByProductId(productId);
        Integer discount = 0;
        for (Event event : events) {
            discount += event.getDiscount();
            if (discount > 30) {
                discount = 30;
                break;
            }
        }
        return discount;
    }

    public void checkDuplicatedEvent(String title) {
        Optional<Event> event = eventRepository.findByTitleIgnoringCase(title);
        if (event.isPresent()) {
            throw new ActionUnavalibleException(String.format("Sự kiện: %s đã tồn tại trong hệ thống", title));
        }
    }

    public void checkTime(LocalDate startAt, LocalDate endAt) {
        if(startAt == null || endAt == null) {
            throw new ActionUnavalibleException("Thời gian bắt đầu hoặc thời gian kết thúc là null!");
        }
        if (startAt.isAfter(endAt) || startAt.equals(endAt)) {
            throw new ActionUnavalibleException("Thời gian bắt đầu không được trễ hơn hoặc trùng với thời gian kết thúc!");
        }
    }

    public Event createEvent(CreateEventRequest request) {
        LocalDate startAt = Converter.StringToLocalDate(request.getStartAt());
        LocalDate endAt = Converter.StringToLocalDate(request.getEndAt());
        checkTime(startAt, endAt);
        checkDuplicatedEvent(request.getTitle());
        try {

            String fileName = FileUtil.saveFileToDir(request.getBackground(), "event", FileUtil.genFileName("event_"));

            Event event = Event.builder()
                    .description(request.getDescription())
                    .title(request.getTitle())
                    .discount(request.getDiscount())
                    .startAt(startAt)
                    .endAt(endAt)
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
                .orElseThrow(() -> new NotFoundException(
                        String.format("Sự kiện với id=%d không tồn tại trong hệ thống!", eventId)));
    }

    public Event updateEvent(UpdateEventRequest request) {
        Event event = findEventById(request.getId());
        LocalDate startAt = Converter.StringToLocalDate(request.getStartAt());
        LocalDate endAt = Converter.StringToLocalDate(request.getEndAt());
        checkTime(startAt, endAt);
        try {
            if (FileUtil.isFilePresent(request.getBackground())) {
                FileUtil.deleteFile(event.getImage());
                String fileName = FileUtil.saveFileToDir(request.getBackground(), "event",
                        FileUtil.genFileName("event_"));
                event.setImage(fileName);
            }

            event.setDescription(request.getDescription());
            event.setDiscount(request.getDiscount());
            event.setStartAt(Converter.StringToLocalDate(request.getStartAt()));
            event.setEndAt(Converter.StringToLocalDate(request.getEndAt()));
            event.setTitle(request.getTitle());

            List<Integer> curDiscountedProductIds = productRepository.findAllProductIdByEventId(request.getId());
            List<Integer> newDiscountedProductIds = request.getDiscountedProductIds() != null ? request.getDiscountedProductIds() : new ArrayList<>();

            for (Integer id : newDiscountedProductIds) {
                if (!curDiscountedProductIds.contains(id)) {
                    eventRepository.addProductIntoEvent(id, request.getId());
                }
            }

            for (Integer id : curDiscountedProductIds) {
                if (!newDiscountedProductIds.contains(id)) {
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

    public Page<Event> findAllEvents(Integer pageNumber, String keyword, String startAt, String endAt) {
        LocalDate startAt_ = Converter.StringToLocalDate(startAt);
        LocalDate endAt_ = Converter.StringToLocalDate(endAt);
        if(startAt_ != null && endAt_ != null) {
            checkTime(startAt_, endAt_);
        }
        return eventRepository.findAllEvents(PageRequest.of(pageNumber, ConstantVal.itemPerPage), keyword, startAt_,
                endAt_);
    }


    public List<Event> findAllEvent() {
        try {
            return eventRepository.findAll();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
