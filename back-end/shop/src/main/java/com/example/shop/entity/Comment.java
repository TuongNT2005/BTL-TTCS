package com.example.shop.entity;

import java.time.LocalDate;

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
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "comment")
public class Comment {

    public Comment(Integer id, User user, Product product, String content, Integer star, LocalDate createdAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.content = content;
        this.star = star;
        this.createdAt = createdAt;
    }

    public Comment() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userid")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid")
    private Product product;

    @Column(name = "content")
    private String content;

    @Column(name = "star")
    private Integer star;

    @Column(name = "createdat")
    private LocalDate createdAt;

    @Override
    public String toString() {
        return "Comment [id=" + id + ", content=" + content + ", star="
                + star + ", createdAt=" + createdAt + "]";
    }

    
}
