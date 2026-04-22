package com.example.shop.entity;

import com.example.shop.enums.ProductVariantStatus;
import com.example.shop.enums.Size;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "productvariant")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "productid")
    private Integer productId;

    @Column(name = "colorid")
    private Integer colorId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "size")
    private Size     size;

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
}

