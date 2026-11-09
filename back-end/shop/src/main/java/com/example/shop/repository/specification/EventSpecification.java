package com.example.shop.repository.specification;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.example.shop.entity.Event;
import com.example.shop.exception.ActionUnavalibleException;

public class EventSpecification {

    public static Specification<Event> hasTitle(String title) {
        return (root, query, cb) -> {

            if (title == null || title.isBlank()) {
                return null;
            }

            return cb.like( cb.lower(root.get("title")),
                            "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Event> isAvailableBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            if(startDate == null || endDate == null) {
                return null;
            }

            if(startDate.isAfter(endDate)) {
                throw new ActionUnavalibleException("Ngày bắt đầu không thể muộn hơn ngày kết thúc!");
            }
            
            return cb.or(   cb.between(root.get("startAt"), startDate, endDate), 
                            cb.between(root.get("endAt"), startDate, endDate));
        };
    }

    public static Specification<Event> hasStatus(String status) {

        return (root, query, cb) -> {

            return  status.toLowerCase().equals("ended") ? cb.lessThan(root.get("endAt"), LocalDate.now()) :
                    status.toLowerCase().equals("coming") ? cb.greaterThan(root.get("startAt"), LocalDate.now()) :
                    cb.and( cb.greaterThanOrEqualTo(root.get("endAt"), LocalDate.now()), 
                            cb.lessThanOrEqualTo(root.get("startAt"), LocalDate.now()));
        };
    }
}
