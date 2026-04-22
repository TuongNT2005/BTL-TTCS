    package com.example.shop.entity;


import com.example.shop.enums.Returned;

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
@Table(name = "orderitem")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "orderid")
    private Integer orderId;

    @Column(name = "productvariantid")
    private Integer productVariantId;

    @Column(name = "returned")
    @Enumerated(EnumType.STRING)
    private Returned returned;

    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "price")
    private Long price;

    @Column(name = "discount")
    private Integer discount;
}
