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
@Table(name = "user")
@Builder
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "password")
    private String password;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private UserEnum status;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private UserEnum role;

    @Column(name = "coin")
    private Long coin;

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
