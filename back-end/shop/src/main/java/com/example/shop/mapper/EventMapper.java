package com.example.shop.mapper;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.example.shop.dto.response.EventDTO;
import com.example.shop.dto.response.EventWithProductsDTO;
import com.example.shop.dto.response.ProductSimpleDTO;
import com.example.shop.entity.Event;
import com.example.shop.entity.Product;
import com.example.shop.util.Converter;

@Component
public class EventMapper {

    @Autowired
    @Lazy
    private ProductMapper productMapper;

    public EventDTO toEventDTO(Event event) {
        return EventDTO.builder()
            .id(event.getId())
            .title(event.getTitle())
            .discount(event.getDiscount())
            .startAt(Converter.formatDate(event.getStartAt()))
            .endAt(Converter.formatDate(event.getEndAt()))
            .description(event.getDescription())
            .image(event.getImage())
            .build();
    }

    public EventWithProductsDTO toEventWithProductsDTO(Event event, List<Product> products) {

        List<ProductSimpleDTO> simpleProducts = products.stream().map(product -> productMapper.toProductSimpleDTO(product)).toList();

        return EventWithProductsDTO.builder()
            .id(event.getId())
            .title(event.getTitle())
            .discount(event.getDiscount())
            .startAt(Converter.formatDate(event.getStartAt()))
            .endAt(Converter.formatDate(event.getEndAt()))
            .description(event.getDescription())
            .image(event.getImage())
            .productList(simpleProducts)
            .build();
    }
}
