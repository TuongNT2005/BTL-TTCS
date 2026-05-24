package com.example.shop.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.ImportProductVariantRequest;
import com.example.shop.entity.ImportHistory;
import com.example.shop.entity.ProductVariant;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;
import com.example.shop.exception.ActionUnavalibleException;
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

        if( request.getColor() == null ||
            request.getProductId() == null ||
            request.getQuantity() == null || request.getQuantity() <= 0 ||
            request.getImportCost() == null || request.getImportCost() <= 0 ||
            request.getSize() == null) {
                throw new ActionUnavalibleException("Hãy nhập đầy đủ và kiểm tra lại thông tin! Các trường giá cả phải > 0!");
            }

        Integer colorId = colorService.findColorId(request.getColor());
        if(colorId == null) {
            colorId = colorService.createNewColor(request.getColor()).getId();
        }
        try {
            Optional<ProductVariant> container = productVariantRepository.findByProductIdAndColorIdAndSize(
                    request.getProductId(), colorId, Size.valueOf(request.getSize()));

            ProductVariant productVariant;
            if (container.isEmpty()) {
                productVariant = ProductVariant.builder()
                        .productId(request.getProductId())
                        .colorId(colorId)
                        .image("")
                        .importCost(request.getImportCost())
                        .purchasePrice((long) Math.floor((request.getImportCost() * 1.15) / 1000) * 1000l)
                        .quantity(request.getQuantity())
                        .size(Size.valueOf(request.getSize()))   
                        .status(ProductVariantStatus.AVALIBLE)
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

            ImportHistory importHistory = ImportHistory.builder()
                                            .productVariantId(productVariant.getId())
                                            .importAt(LocalDateTime.now())
                                            .price(request.getImportCost())
                                            .quantity(request.getQuantity())
                                            .build();
            
            productVariantRepository.save(productVariant);
            importHistoryRepository.save(importHistory);

            return productVariant;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }
}
