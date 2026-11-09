package com.example.shop.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


import com.example.shop.enums.Category;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@Table(name = "product")
public class Product {

    public Product(Integer id, String name, String description, String image, Category category,
                   Set<ProductVariant> productVariants, Set<Event> events, Set<Comment> comments) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.category = category;
        this.productVariants = productVariants;
        this.events = events;
        this.comments = comments;
    }
    public Product() {
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private Category category;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private Set<ProductVariant> productVariants;

    @ManyToMany(mappedBy = "discountedProducts", fetch = FetchType.LAZY)
    private Set<Event> events;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private Set<Comment> comments;

    public static List<String> getCategories() {
        List<String> categories = new ArrayList<>();
        categories.add("PANTS");
        categories.add("SHIRT");
        categories.add("DRESS");
        categories.add("SET");
        categories.add("SPORTSWEAR");
        return categories;
    }

    @Override
    public String toString() {
        return "Product [id=" + id + ", name=" + name + ", description=" + description + ", image=" + image
                + ", category=" + category + "]";
    }

}

