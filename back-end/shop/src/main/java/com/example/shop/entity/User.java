package com.example.shop.entity;


import java.util.Set;

import com.example.shop.enums.UserEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user")
@Builder
public class User{

    public User(Integer id, String password, String username, String email, String phone, String address,
                String avatar, UserEnum status, UserEnum role, Long coin, Set<RefundRequest> refundRequests,
                Set<Order> orders, Set<Comment> comments, Set<CartItem> cartItems) {
        this.id = id;
        this.password = password;
        this.username = username;
        this.email = email;
        this.phone = (phone != null) ? phone : "";
        this.address = (address != null) ? address : "";
        this.avatar = (avatar != null) ? avatar : "";
        this.status = (status != null) ? status : UserEnum.ACTIVE;
        this.role = (role != null) ? role : UserEnum.USER;
        this.coin = (coin != null) ? coin : 0L;
        this.refundRequests = refundRequests;
        this.orders = orders;
        this.comments = comments;
        this.cartItems = cartItems;
    }

    public User() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "password")
    private String password;

    @Column(name = "username")
    private String username;

    @Column(name = "email", 
            columnDefinition = "VARCHAR(255) NOT NULL UNIQUE")
    private String email;

    @Builder.Default
    @Column(name = "phone")
    private String phone = "";

    @Builder.Default
    @Column(name = "address")
    private String address = "";

    @Builder.Default
    @Column(name = "avatar")
    private String avatar = "";

    @Builder.Default
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private UserEnum status = UserEnum.ACTIVE;

    @Builder.Default
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserEnum role = UserEnum.USER;

    @Builder.Default
    @Column(name = "coin")
    private Long coin = 0l;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<RefundRequest> refundRequests;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Order> orders;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<Comment> comments;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<CartItem> cartItems;

    @Override
    public String toString() {
        return "User [id=" + id + ", password=" + password + ", username=" + username + ", email=" + email + ", phone="
                + phone + ", address=" + address + ", avatar=" + avatar + ", status=" + status + ", role=" + role
                + ", coin=" + coin + "]";
    }

    
}
