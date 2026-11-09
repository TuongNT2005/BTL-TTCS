package com.example.shop.helper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;

public class SortParamExtracter {
    public static Sort extractFromParams(List<String> sortCriterias, List<String> sortDirections) {
        Sort sort = Sort.unsorted();

        if (sortCriterias != null) {

            List<Sort.Order> orders = new ArrayList<>();

            for (int i = 0; i < sortCriterias.size(); i++) {
                String criteria = sortCriterias.get(i);
                String direction = (sortDirections != null && i < sortDirections.size() && sortDirections.get(i) != null) 
                    ? sortDirections.get(i) 
                    : "asc";

                Sort.Order order = new Sort.Order(
                    direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, 
                    criteria);

                orders.add(order);
            }

            sort = Sort.by(orders);
        }

        return sort;
    }
}
