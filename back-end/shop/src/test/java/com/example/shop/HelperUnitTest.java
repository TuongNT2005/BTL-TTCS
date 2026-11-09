package com.example.shop;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Sort;

import com.example.shop.helper.Converter;
import com.example.shop.helper.SortParamExtracter;
import com.example.shop.repository.specification.OrderSpecification;
import com.example.shop.repository.specification.ProductVariantSpecification;
import com.example.shop.repository.specification.RefundRequestSpecification;

class HelperUnitTest {

    @Test
    void testSortParamExtracterSafeNullDirections() {
        List<String> criterias = List.of("id", "name");
        List<String> directions = null;

        Sort sort = SortParamExtracter.extractFromParams(criterias, directions);
        assertNotNull(sort);
        assertTrue(sort.isSorted());
        assertEquals(Sort.Direction.ASC, sort.getOrderFor("id").getDirection());
        assertEquals(Sort.Direction.ASC, sort.getOrderFor("name").getDirection());
    }

    @Test
    void testSortParamExtracterDesc() {
        List<String> criterias = List.of("createdAt");
        List<String> directions = List.of("desc");

        Sort sort = SortParamExtracter.extractFromParams(criterias, directions);
        assertNotNull(sort);
        assertEquals(Sort.Direction.DESC, sort.getOrderFor("createdAt").getDirection());
    }

    @Test
    void testConverterNullAndNonNull() {
        assertEquals(0L, Converter.convertPriceFromDoubleToLong(null));
        assertEquals(100000L, Converter.convertPriceFromDoubleToLong(100500.0));
    }

    @Test
    void testSpecificationsNotNull() {
        assertNotNull(OrderSpecification.hasUserId(1));
        assertNotNull(ProductVariantSpecification.hasProductName("shirt"));
        assertNotNull(ProductVariantSpecification.hasColor("Red"));
        assertNotNull(ProductVariantSpecification.hasSize("M"));
        assertNotNull(RefundRequestSpecification.hasStatus("PENDING"));
        assertNotNull(RefundRequestSpecification.hasUserId(2));
    }
}

