    package com.example.shop.entity;


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
import jakarta.persistence.Table;
import com.example.shop.enums.Returned;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "orderitem")
public class OrderItem {

    public OrderItem(Integer id, Order order, ProductVariant productVariant, Integer quantity, Long price, Integer discount, Returned returned) {
        this.id = id;
        this.order = order;
        this.productVariant = productVariant;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        this.returned = (returned != null) ? returned : Returned.FALSE;
    }

    public OrderItem() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderid")
    private Order order;

    @ManyToOne( fetch = FetchType.LAZY, 
                cascade = {
                    CascadeType.PERSIST, 
                    CascadeType.MERGE
                }
    )
    @JoinColumn(name = "productvariantid")
    private ProductVariant productVariant;

    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "price")
    private Long price;

    @Column(name = "discount")
    private Integer discount;

    @Builder.Default
    @Column(name = "returned")
    @Enumerated(EnumType.STRING)
    private Returned returned = Returned.FALSE;

    @Override
    public String toString() {
        return "OrderItem [id=" + id + ", quantity="
                + quantity + ", price=" + price + ", discount=" + discount + "]";
    }

    
}
