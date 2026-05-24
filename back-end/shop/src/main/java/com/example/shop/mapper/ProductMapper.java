package com.example.shop.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.shop.dto.response.ProductDetailDTO;
import com.example.shop.dto.response.ProductSimpleDTO;
import com.example.shop.dto.response.ProductVariantDTO;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.service.ColorService;
import com.example.shop.service.EventService;
import com.example.shop.service.ProductService;

@Component
public class ProductMapper {
    @Autowired
    private ProductService productService;

    @Autowired
    private EventService eventService;

    @Autowired
    private ColorService colorService;

    public ProductDetailDTO toProductDetailDTO(Product product) {
        return ProductDetailDTO.builder()
                .id(product.getId())
                .category(product.getCategory().toString())
                .name(product.getName())
                .description(product.getDescription())
                .image(product.getImage())
                .build();
    }

    public ProductSimpleDTO toProductSimpleDTO(Product product) {
        return ProductSimpleDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .build();
    }


    public ProductVariantDTO toProductVariantDTO(ProductVariant productVariant) {
        Product product = productService.findProductById(productVariant.getProductId());
        String colorName = colorService.findColorNameById(productVariant.getColorId());
        Integer discount = eventService.findDiscounts(product.getId());
        return new ProductVariantDTO(productVariant, product.getName() + " " + colorName + " " + productVariant.getSize().toString(), colorName, discount);
    }

}
