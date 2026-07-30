package com.example.shop.entity;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.shop.enums.OrderStatus;

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
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    private User user;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)
    private Set<OrderItem> orderItems;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "createdat")
    private LocalDateTime createdAt;

    @Column(name = "expriedat")
    private LocalDateTime expriredat;

    @Column(name = "paidat")
    private LocalDateTime paidAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "coinused")
    private Long coinUsed;

    @Override
    public String toString() {
        return "Order [id=" + id + ", address=" + address + ", phone="
                + phone + ", createdAt=" + createdAt + ", expriredat=" + expriredat + ", paidAt=" + paidAt + ", status="
                + status + ", coinUsed=" + coinUsed + "]";
    }

    
}


