package com.example.shop.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.ImportProductVariantRequest;
import com.example.shop.entity.ImportHistory;
import com.example.shop.entity.ProductVariant;
import com.example.shop.repository.ImportHistoryRepository;
import com.example.shop.repository.ProductVariantRepository;

@Service
public class WareHouseService {

    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private ColorService colorService;
    @Autowired
    private ImportHistoryRepository importHistoryRepository;

    public ProductVariant importProductVariant(ImportProductVariantRequest request) {
        Integer colorId = colorService.findColorId(request.getColor());
        try {
            Optional<ProductVariant> container = productVariantRepository.findByProductIdAndColorIdAndSize(
                    request.getProductId(), colorId, ProductVariant.Size.valueOf(request.getSize()));

            ProductVariant productVariant;
            if (container.isEmpty()) {
                productVariant = ProductVariant.builder()
                        .productId(request.getProductId())
                        .colorId(colorId)
                        .image("")
                        .importCost(request.getImportCost())
                        .purchasePrice((long) Math.floor((request.getImportCost() * 1.15) / 1000) * 1000l)
                        .quantity(request.getQuantity())
                        .size(ProductVariant.Size.valueOf(request.getSize()))   
                        .status(ProductVariant.Status.AVALIBLE)
                        .build();
            }

            else {
                productVariant = container.get();
                Long avgImportPrice = (long) Math.floor((productVariant.getImportCost() * productVariant.getQuantity()
                        + request.getImportCost() * request.getQuantity())
                        / (productVariant.getQuantity() + request.getQuantity()) / 1000) * 1000l;
                productVariant.setQuantity(productVariant.getQuantity() + request.getQuantity());
                productVariant.setImportCost(avgImportPrice);
            }

            productVariantRepository.save(productVariant);

            Integer productVariantId = productVariantRepository.findByProductIdAndColorIdAndSize(
                    request.getProductId(), colorId, ProductVariant.Size.valueOf(request.getSize()))
                    .get().getId();
            ImportHistory importHistory = ImportHistory.builder()
                    .importAt(LocalDateTime.now())
                    .price(request.getImportCost())
                    .quantity(request.getQuantity())
                    .productVariantId(productVariantId)
                    .build();
            importHistoryRepository.save(importHistory);

            return productVariant;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }
}
