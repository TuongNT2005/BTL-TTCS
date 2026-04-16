package com.example.shop.entity;

import java.util.ArrayList;
import java.util.List;


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
@Table(name = "product")
public class Product {

    public static enum Category {
        PANTS, SHIRT, DRESS, SET, SPORTWEAR
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

    public static List<String> getCategories() {
        List<String> categories = new ArrayList<>();
        categories.add("PANTS");
        categories.add("SHIRT");
        categories.add("DRESS");
        categories.add("SET");
        categories.add("SPORTWEAR");
        return categories;
    }
}

