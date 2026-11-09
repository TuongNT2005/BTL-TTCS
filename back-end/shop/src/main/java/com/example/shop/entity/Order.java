package com.example.shop.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.springframework.cglib.core.Local;

import com.example.shop.enums.OrderStatus;

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
@Table(name = "orders")
public class Order {

    public Order(Integer id, User user, Set<OrderItem> orderItems, String name, String address, String phone,
                 LocalDateTime createdAt, LocalDateTime expriredat, LocalDateTime paidAt, OrderStatus status, Long coinUsed) {
        this.id = id;
        this.user = user;
        this.orderItems = (orderItems != null) ? orderItems : new HashSet<>();
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.createdAt = (createdAt != null) ? createdAt : LocalDateTime.now();
        this.expriredat = (expriredat != null) ? expriredat : LocalDateTime.now().plusDays(1);
        this.paidAt = paidAt;
        this.status = (status != null) ? status : OrderStatus.PENDING;
        this.coinUsed = (coinUsed != null) ? coinUsed : 0L;
    }

    public Order() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    private User user;

    @Builder.Default
    @OneToMany( mappedBy = "order", fetch = FetchType.LAZY,
                cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
                }
    )
    private Set<OrderItem> orderItems = new HashSet<>();

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Builder.Default
    @Column(name = "createdat")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "expriedat")
    private LocalDateTime expriredat = LocalDateTime.now().plusDays(1);

    @Column(name = "paidat")
    private LocalDateTime paidAt;

    @Builder.Default
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    @Column(name = "coinused")
    private Long coinUsed = 0L;

    @Override
    public String toString() {
        return "Order [id=" + id + ", address=" + address + ", phone="
                + phone + ", createdAt=" + createdAt + ", expriredat=" + expriredat + ", paidAt=" + paidAt + ", status="
                + status + ", coinUsed=" + coinUsed + "]";
    }

    public void addOrderItem(OrderItem orderItem) {
        orderItem.setOrder(this);
        this.orderItems.add(orderItem);
    }

    public LocalDateTime getExpriedAt() {
        return expriredat;
    }

    public void setExpriedAt(LocalDateTime expriedAt) {
        this.expriredat = expriedAt;
    }
}


