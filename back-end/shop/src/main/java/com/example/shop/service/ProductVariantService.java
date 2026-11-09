package com.example.shop.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.dto.projection_interface.ProductVariantProjection;
import com.example.shop.dto.request.ImportVariantRequest;
import com.example.shop.dto.request.UpdateVariantRequest;
import com.example.shop.entity.Color;
import com.example.shop.entity.ImportHistory;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.ColorRepository;
import com.example.shop.repository.ImportHistoryRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.specification.ProductVariantSpecification;

@Service
public class ProductVariantService {

    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ImportHistoryRepository importHistoryRepository;

    public ProductVariantService(ProductRepository productRepository,
                                 ColorRepository colorRepository,
                                 ProductVariantRepository productVariantRepository,
                                 ImportHistoryRepository importHistoryRepository) {
        this.productRepository = productRepository;
        this.colorRepository = colorRepository;
        this.productVariantRepository = productVariantRepository;
        this.importHistoryRepository = importHistoryRepository;
    }

    @Transactional
    public void insertOrUpdateVariant(ImportVariantRequest request, Integer productId) {
        // Ktra xem biến thế này đã tồn tại chưa
        Optional<ProductVariant> variantContainer = productVariantRepository.findByProductIdAndColoAndSize(
            productId, request.getColorName(), Size.valueOf(request.getSize())  
        );

        ProductVariant productVariant = null;
        if(variantContainer.isEmpty()) {
            // Nếu chưa tồn tại thì tạo mới
            Product product = productRepository.findProductById(productId);
            productVariant = createNewVariant(request, product);

            // Lưu kết quả
            productVariantRepository.save(productVariant);
        }
        else {
            // Nếu đã tồn tại thì cập nhập số lượng
            productVariant = variantContainer.get();
            productVariantRepository.increaseStock(productVariant.getId(), request.getQuantity());
        }

        // Lưu lịch sử
        createImportVariantHistory(productVariant, request);
    }

    private ProductVariant createNewVariant(ImportVariantRequest request, Product product) {

        Optional<Color> colorContainer = colorRepository.findByName(request.getColorName());
        Color color = colorContainer.isEmpty() ? Color.builder().name(request.getColorName()).build() : colorContainer.get();

        return ProductVariant.builder()
                            .image("")
                            .importCost(request.getImportCost())
                            .purchasePrice(request.getImportCost())
                            .quantity(request.getQuantity())
                            .size(Size.valueOf(request.getSize()))
                            .status(ProductVariantStatus.AVALIBLE)
                            .color(color)
                            .product(product)
                            .build();
    }     
    
    private void createImportVariantHistory(ProductVariant pv, ImportVariantRequest request) {
        ImportHistory history = ImportHistory.builder()
                                            .productVariant(pv)
                                            .importPrice(request.getImportCost())
                                            .quantity(request.getQuantity())
                                            .build();
        
        importHistoryRepository.save(history);
    }

    @Transactional
    public void updateExistingVariant(UpdateVariantRequest request, Integer variantId) {
        ProductVariant productVariant = productVariantRepository.findVariantByIdWithPresLock(variantId).orElseThrow(
            () -> new NotFoundException("Biến thể không tồn tại!")
        );

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            productVariant.setStatus(ProductVariantStatus.valueOf(request.getStatus().toUpperCase()));
        }
        if (request.getPurchasedPrice() != null) {
            productVariant.setPurchasePrice(request.getPurchasedPrice());
        }
        if (request.getQuantity() != null) {
            productVariant.setQuantity(request.getQuantity());
        }

        productVariantRepository.save(productVariant);
    }

    public Page<ProductVariantProjection> findVariants(Pageable pageable, String productName, String color, String size, String status, Integer productId) {
        Specification<ProductVariant> spec = Specification.where(ProductVariantSpecification.hasProductName(productName))
                                                .and(ProductVariantSpecification.hasColor(color))
                                                .and(ProductVariantSpecification.hasSize(size))
                                                .and(ProductVariantSpecification.hasStatus(status))
                                                .and(ProductVariantSpecification.hasProductId(productId));
        return productVariantRepository.findBy(spec, p -> p.as(ProductVariantProjection.class).page(pageable));
    }

    public ProductVariantProjection findVariantById(Integer id) {
        return productVariantRepository.findVariantProjectedById(id).orElseThrow(
            () -> new NotFoundException("Biến thể với id: " + id + " không tồn tại!")
        );
    }
}

