package com.example.shop.entity;

import java.util.Set;

import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "productvariant")
public class ProductVariant {

    public ProductVariant(Integer id, Product product, Color color, Set<ImportHistory> importHistories,
                          Set<CartItem> cartItems, Size size, Long importCost, Long purchasePrice,
                          ProductVariantStatus status, Integer quantity, String image) {
        this.id = id;
        this.product = product;
        this.color = color;
        this.importHistories = importHistories;
        this.cartItems = cartItems;
        this.size = size;
        this.importCost = importCost;
        this.purchasePrice = purchasePrice;
        this.status = status;
        this.quantity = quantity;
        this.image = image;
    }

    public ProductVariant() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "productid")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "colorid")
    private Color color;

    @OneToMany(mappedBy = "productVariant", fetch = FetchType.LAZY)
    private Set<ImportHistory> importHistories;

    @OneToMany(mappedBy = "productVariant", fetch = FetchType.LAZY)
    private Set<CartItem> cartItems;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "size")
    private Size size;

    @Column(name = "importcost")
    private Long importCost;

    @Column(name = "purchaseprice")
    private Long purchasePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProductVariantStatus status;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "image")
    private String image;

    @Override
    public String toString() {
        return "ProductVariant [id=" + id + ", color=" + color + ", importCost=" + importCost
                + ", purchasePrice=" + purchasePrice + ", status=" + status + ", quantity=" + quantity + ", image="
                + image + "]";
    }

    
}

