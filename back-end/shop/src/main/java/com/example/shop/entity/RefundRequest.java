package com.example.shop.entity;


import java.time.LocalDateTime;

import com.example.shop.enums.RefundStatus;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "refundrequest")
public class RefundRequest {

    public RefundRequest(Integer id, User user, OrderItem orderItem, String reason, String image,
                         LocalDateTime createdAt, RefundStatus status, Integer quantity) {
        this.id = id;
        this.user = user;
        this.orderItem = orderItem;
        this.reason = reason;
        this.image = image;
        this.createdAt = createdAt;
        this.status = status;
        this.quantity = quantity;
    }

    public RefundRequest() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderitemid")
    private OrderItem orderItem;

    @Column(name = "reason")
    private String reason;

    @Column(name = "image")
    private String image;

    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    @Column(name = "quantity")
    private Integer quantity;

    @Override
    public String toString() {
        return "RefundRequest [id=" + id + ", reason=" + reason
                + ", image=" + image + ", createdAt=" + createdAt + ", status=" + status + ", quantity=" + quantity
                + "]";
    }

    
}
