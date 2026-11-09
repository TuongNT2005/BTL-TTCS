package com.example.shop.service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.shop.dto.projection_interface.EventProjection;
import com.example.shop.dto.projection_interface.EventWithAppliedProducts;
import com.example.shop.dto.request.CreateNewEventRequest;
import com.example.shop.dto.request.UpdateEventRequest;
import com.example.shop.entity.Event;
import com.example.shop.entity.Product;
import com.example.shop.exception.ActionUnavailableException;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.EventRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.specification.EventSpecification;



@Service
public class EventService {

    private final ProductRepository productRepository;
    private final EventRepository eventRepository;

    public EventService(ProductRepository productRepository, EventRepository eventRepository) {
        this.productRepository = productRepository;
        this.eventRepository = eventRepository;
    }


    public Event createNewEvent(CreateNewEventRequest request) {
        if(eventRepository.existsByTitleIgnoreCase(request.getTitle())) {
            throw new ActionUnavailableException("Đã tồn tại sự kiện " + request.getTitle());
        }

        Event event = Event.builder()
                            .title(request.getTitle())
                            .description(request.getDescription())
                            .discount(request.getDiscount())
                            .image(request.getImage() != null ? request.getImage() : "")
                            .startAt(request.getStartAt())
                            .endAt(request.getEndAt())
                            .build();
        
        return eventRepository.save(event);
    }

    public void updateEvent(UpdateEventRequest request, Integer eventId) {
        if(!eventRepository.existsById(eventId)) {
            throw new NotFoundException("Không tìm thấy sự kiện!");
        }

        Optional<Event> eventContainer = eventRepository.findByTitleIgnoreCase(request.getTitle());
        if((eventContainer.isPresent() && !eventContainer.get().getId().equals(eventId))) {
            throw new ActionUnavalibleException("Tiêu đề sự kiện bị trùng với 1 sự kiện khác trong hệ thống!");
        }

        Event event = eventRepository.findEventById(eventId);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartAt(request.getStartAt());
        event.setEndAt(request.getEndAt());
        event.setDiscount(request.getDiscount());

        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            Set<Product> products = new HashSet<>(productRepository.findAllById(request.getProductIds()));
            event.setDiscountedProducts(products);
        }

        eventRepository.save(event);
    }



    public Page<EventProjection> searchEvents(Pageable pageable, String keyword, String status, LocalDate startDate, LocalDate endDate) {
        
        Specification<Event> spec = Specification.where(EventSpecification.hasTitle(keyword))
                                                    .and(EventSpecification.hasStatus(status))
                                                    .and(EventSpecification.isAvailableBetween(startDate, endDate));

        return eventRepository.findBy(spec, p -> p.as(EventProjection.class)
                                                    .page(pageable));
    }

    public EventWithAppliedProducts findEventWithAppliedProductsById(Integer eventId) {
        return eventRepository.findEventWithAppliedProductsById(eventId).orElseThrow(
            () -> new NotFoundException("Sự kiện không tôn tại!")
        );
    }

    // @Autowired
    // private EventRepository eventRepository;
    // @Autowired
    // private ProductRepository productRepository;

    // public Integer findDiscounts(Integer productId) {
    //     List<Event> events = eventRepository.findAllByProductId(productId);
    //     Integer discount = 0;
    //     for (Event event : events) {
    //         discount += event.getDiscount();
    //         if (discount > 30) {
    //             discount = 30;
    //             break;
    //         }
    //     }
    //     return discount;
    // }

    // public void checkDuplicatedEvent(String title) {
    //     Optional<Event> event = eventRepository.findByTitleIgnoringCase(title);
    //     if (event.isPresent()) {
    //         throw new ActionUnavalibleException(String.format("Sự kiện: %s đã tồn tại trong hệ thống", title));
    //     }
    // }

    // public void checkDuplicatedEvent(String title, Integer eventId) {
    //     Optional<Event> event = eventRepository.findByTitleIgnoringCase(title);
    //     if (event.isPresent()) {
    //         Event exisitedEvent = event.get(); 
    //         if(exisitedEvent.getId().equals(eventId)) {
    //             return;
    //         }
    //         else {
    //             throw new ActionUnavalibleException(String.format("Sự kiện: %s đã tồn tại trong hệ thống", title));
    //         }
    //     }
    // }

    // public void checkTime(LocalDate startAt, LocalDate endAt) {
    //     if (startAt == null || endAt == null) {
    //         throw new ActionUnavalibleException("Thời gian bắt đầu hoặc thời gian kết thúc là null!");
    //     }
    //     if (startAt.isAfter(endAt) || startAt.equals(endAt)) {
    //         throw new ActionUnavalibleException(
    //                 "Thời gian bắt đầu không được trễ hơn hoặc trùng với thời gian kết thúc!");
    //     }
    // }

    // public Event createEvent(CreateEventRequest request) {

    //      if(request.getDescription() == null ||
    //         request.getTitle() == null ||
    //         request.getDiscount() == null || request.getDiscount() <= 0 || request.getDiscount() > 30 ||
    //         request.getStartAt() == null ||
    //         request.getEndAt() == null ||
    //         !Converter.StringToLocalDate(request.getStartAt()).isBefore(Converter.StringToLocalDate(request.getEndAt()))) {
    //             throw new ActionUnavalibleException("Hãy điền đầy đủ và kiểm tra lai thông tin! Chú ý 0 < mức giảm <= 30 và ngày bắt đầu phải diễn ra rtuowcs ngày kết thúc sự kiện!");
    //         }

    //     LocalDate startAt = Converter.StringToLocalDate(request.getStartAt());
    //     LocalDate endAt = Converter.StringToLocalDate(request.getEndAt());
    //     checkTime(startAt, endAt);
    //     checkDuplicatedEvent(request.getTitle());
    //     try {

    //         String fileName = FileUtil.saveFileToDir(request.getBackground(), "event", FileUtil.genFileName("event_"));

    //         Event event = Event.builder()
    //                 .description(request.getDescription())
    //                 .title(request.getTitle())
    //                 .discount(request.getDiscount())
    //                 .startAt(startAt)
    //                 .endAt(endAt)
    //                 .image(fileName)
    //                 .build();

    //         eventRepository.save(event);
    //         return event;
    //     } catch (Exception e) {
    //         System.out.println(e.getMessage());
    //         throw new RuntimeException(e.getMessage());
    //     }
    // }

    // public Event findEventById(Integer eventId) {
    //     return eventRepository.findById(eventId)
    //             .orElseThrow(() -> new NotFoundException(
    //                     String.format("Sự kiện với id=%d không tồn tại trong hệ thống!", eventId)));
    // }

    // public Event updateEvent(UpdateEventRequest request) {
    //     if( request.getId() == null ||
    //         request.getDescription() == null ||
    //         request.getTitle() == null ||
    //         request.getDiscount() == null || request.getDiscount() <= 0 || request.getDiscount() > 30 ||
    //         request.getStartAt() == null ||
    //         request.getEndAt() == null ||
    //         !Converter.StringToLocalDate(request.getStartAt()).isBefore(Converter.StringToLocalDate(request.getEndAt()))) {
    //             throw new ActionUnavalibleException("Hãy điền đầy đủ và kiểm tra lai thông tin! Chú ý 0 < mức giảm <= 30 và ngày bắt đầu phải diễn ra rtuowcs ngày kết thúc sự kiện!");
    //         }

    //     Event event = findEventById(request.getId());
    //     LocalDate startAt = Converter.StringToLocalDate(request.getStartAt());
    //     LocalDate endAt = Converter.StringToLocalDate(request.getEndAt());
    //     checkTime(startAt, endAt);
    //     checkDuplicatedEvent(request.getTitle(), request.getId());
    //     try {
    //         if (FileUtil.isFilePresent(request.getBackground())) {
    //             FileUtil.deleteFile(event.getImage());
    //             String fileName = FileUtil.saveFileToDir(request.getBackground(), "event",
    //                     FileUtil.genFileName("event_"));
    //             event.setImage(fileName);
    //         }

    //         event.setDescription(request.getDescription());
    //         event.setDiscount(request.getDiscount());
    //         event.setStartAt(Converter.StringToLocalDate(request.getStartAt()));
    //         event.setEndAt(Converter.StringToLocalDate(request.getEndAt()));
    //         event.setTitle(request.getTitle());

    //         List<Integer> curDiscountedProductIds = productRepository.findAllProductIdByEventId(request.getId());
    //         List<Integer> newDiscountedProductIds = request.getDiscountedProductIds() != null
    //                 ? request.getDiscountedProductIds()
    //                 : new ArrayList<>();

    //         for (Integer id : newDiscountedProductIds) {
    //             if (!curDiscountedProductIds.contains(id)) {
    //                 eventRepository.addProductIntoEvent(id, request.getId());
    //             }
    //         }

    //         for (Integer id : curDiscountedProductIds) {
    //             if (!newDiscountedProductIds.contains(id)) {
    //                 eventRepository.deleteProductFromEvent(id, request.getId());
    //             }
    //         }

    //         eventRepository.save(event);
    //         return event;

    //     } catch (Exception e) {
    //         System.out.println(e.getMessage());
    //         throw new RuntimeException(e.getMessage());
    //     }
    // }

    // public Page<Event> findAllEvents(Integer pageNumber, String keyword, String startAt, String endAt) {
    //     LocalDate startAt_ = Converter.StringToLocalDate(startAt);
    //     LocalDate endAt_ = Converter.StringToLocalDate(endAt);
    //     if (startAt_ != null && endAt_ != null) {
    //         checkTime(startAt_, endAt_);
    //     }
    //     return eventRepository.findAllEvents(PageRequest.of(pageNumber, ConstantVal.itemPerPage), keyword, startAt_,
    //             endAt_);
    // }

    // public List<Event> findAllEvent() {
    //     try {
    //         return eventRepository.findAll();
    //     } catch (Exception e) {
    //         System.out.println(e.getMessage());
    //         throw new RuntimeException(e.getMessage());
    //     }
    // }
}
