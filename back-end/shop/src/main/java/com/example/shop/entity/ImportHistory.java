package com.example.shop.entity;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "importhistory")
public class ImportHistory {

    public ImportHistory(Integer id, ProductVariant productVariant, Integer quantity, LocalDateTime importAt, Long importPrice) {
        this.id = id;
        this.productVariant = productVariant;
        this.quantity = quantity;
        this.importAt = (importAt != null) ? importAt : LocalDateTime.now();
        this.importPrice = importPrice;
    }
    public ImportHistory() {
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "productvariantid")
    private ProductVariant productVariant;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "importat")
    @Builder.Default
    private LocalDateTime importAt = LocalDateTime.now();

    @Column(name = "price")
    private Long importPrice;

    @Override
    public String toString() {
        return "ImportHistory [id=" + id + ", quantity=" + quantity
                + ", importAt=" + importAt + ", price=" + importPrice + "]";
    }

    
}
