package com.example.shop.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateProductRequest;

import com.example.shop.dto.request.UpdateProductRequest;
import com.example.shop.dto.request.UpdateProductVariantRequest;
import com.example.shop.dto.response.ProductDTO;
import com.example.shop.dto.response.ProductVariantDTO;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;
import com.example.shop.enums.Category;
import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.util.FileUtil;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private ColorService colorService;
    @Autowired
    private EventService eventService;

    public List<Product> searchProduct(String keyword) {
        return productRepository.findByKeyword(keyword);
    }

    public Page<Product> searchProduct(String keyword,  String category, Pageable pageable) {
        return productRepository.findByKeyword(keyword, category, pageable);
    }

    public Page<ProductVariant> getAllProductVariant(String keyword, Pageable pageable) {
        return productVariantRepository.findByKeyword(keyword, pageable);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public ProductVariant findProductVariantById(Integer productVariantId) {
        return productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new NotFoundException(
                        String.format("ProductVariant với id = %d không tồn tại!", productVariantId)));
    }

    public Product findProductById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(
                        () -> new NotFoundException(String.format("Product với id = %d không tồn tại!", productId)));
    }

    public void checkProductVariantStatus(Integer productVariantId) {
        ProductVariant productVariant = findProductVariantById(productVariantId);
        if (productVariant.getStatus() != ProductVariantStatus.AVALIBLE) {
            throw new ActionUnavalibleException(
                    String.format("Biến thể với id=%d đang không được bán trên cửa hàng!", productVariantId));
        }
    }

    public void checkQuantity(Integer productVariantId, Integer quantity) {
        ProductVariant productVariant = findProductVariantById(productVariantId);
        if (productVariant.getQuantity() < quantity) {
            throw new ActionUnavalibleException(
                    String.format("ProductVariant với id = %d không đủ số lượng!", productVariantId));
        }
    }

    public void checkDuplicateProduct(String name, String category, Integer id) {
        Optional<Product> product = productRepository.findByNameIgnoreCaseAndCategory(name,
                Category.valueOf(category));
        if (product.isPresent() && product.get().getId() != id) {
            throw new ActionUnavalibleException(
                    String.format("Đã tồn tại sản phẩm có tên: %s và thể loại: %s", name, category));
        }
    }

    public void checkDuplicateProduct(String name, String category) {
        Optional<Product> product = productRepository.findByNameIgnoreCaseAndCategory(name,
                Category.valueOf(category));
        if (product.isPresent()) {
            throw new ActionUnavalibleException(
                    String.format("Đã tồn tại sản phẩm có tên: %s và thể loại: %s", name, category));
        }
    }

    public Product createNewProduct(CreateProductRequest request) {

        if( request.getName() == null || 
            request.getDescription() == null ||
            request.getCategory() == null ||
            request.getImg() == null) {
                throw new ActionUnavalibleException("Hãy nhập đầy đủ thông tin!");
            }

        checkDuplicateProduct(request.getName(), request.getCategory());

        try {
            String imgName = FileUtil.saveFileToDir(request.getImg(), "product", FileUtil.genFileName("product_"));
            Product product = Product.builder()
                    .category(Category.valueOf(request.getCategory()))
                    .description(request.getDescription())
                    .image(imgName)
                    .name(request.getName())
                    .build();

            productRepository.save(product);
            return product;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Product updateProduct(UpdateProductRequest request) {

        if( request.getName() == null || 
            request.getDescription() == null ||
            request.getCategory() == null) {
                throw new ActionUnavalibleException("Hãy nhập đầy đủ thông tin!");
            }

        Product product = findProductById(request.getId());
        checkDuplicateProduct(request.getName(), request.getCategory(), request.getId());
        try {
            if (FileUtil.isFilePresent(request.getImg())) {
                FileUtil.deleteFile(product.getImage());
                String fileName = FileUtil.saveFileToDir(request.getImg(), "product", FileUtil.genFileName("product_"));
                product.setImage(fileName);
            }

            product.setCategory(Category.valueOf(request.getCategory()));
            product.setName(request.getName());
            product.setDescription(request.getDescription());

            productRepository.save(product);

            return product;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public ProductVariant updateProductVariant(UpdateProductVariantRequest request) {

        if( request.getId() == null ||
            request.getStatus() == null ||
            request.getPurchasePrice() == null || request.getPurchasePrice() <= 0) {
                throw new ActionUnavalibleException("Hãy nhập đầy đủ thông tin! Gía bán phải > 0!");
            }

        try {
            ProductVariant productVariant = findProductVariantById(request.getId());
            if (FileUtil.isFilePresent(request.getImg())) {
                FileUtil.deleteFile(productVariant.getImage());
                String fileName = FileUtil.saveFileToDir(request.getImg(), "productVariant",
                        FileUtil.genFileName("productVariant_"));
                productVariant.setImage(fileName);
            }
            productVariant.setPurchasePrice(request.getPurchasePrice());
            productVariant.setStatus(ProductVariantStatus.valueOf(request.getStatus()));
            productVariantRepository.save(productVariant);
            return productVariant;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public List<Product> findAllProductByEventId(Integer eventId) {
        try {
            return productRepository.findAllProductByEventId(eventId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Product findByOrderItemId(Integer orderItemId) {
        return productRepository.findByOrderItemId(orderItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm được biens thể!"));
    }

    public ProductVariant findProductVariantByOrderItemId(Integer orderItemId) {
        return productVariantRepository.findByOrderitemId(orderItemId)
                .orElseThrow(() -> new NotFoundException("Không tìm được biens thể!"));
    }

    public List<ProductVariant> findAllProductVariantByProductId(Integer productId) {
        try {
            return productVariantRepository.findAllByProductId(productId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public ProductVariant saveProductVariant(ProductVariant productVariant) {
        try {
            productVariantRepository.save(productVariant);
            return productVariant;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public ProductVariantDTO convertToProductVariantDTO(ProductVariant productVariant) {
        Product product = findProductById(productVariant.getProductId());
        String colorName = colorService.findColorNameById(productVariant.getColorId());
        Integer discount = eventService.findDiscounts(product.getId());
        return new ProductVariantDTO(productVariant, product.getName(), colorName, discount);
    }

    public ProductDTO convertToProductDTO(Product product) {

        List<ProductVariant> productVariants = findAllProductVariantByProductId(product.getId());
        List<ProductVariantDTO> productVariantDTOs = new ArrayList<>();
        
        for(ProductVariant productVariant : productVariants) {
            productVariantDTOs.add(convertToProductVariantDTO(productVariant));
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .image(product.getImage())
                .category(product.getCategory().toString())
                .productVariants(productVariantDTOs)
                .build();
    }

}
