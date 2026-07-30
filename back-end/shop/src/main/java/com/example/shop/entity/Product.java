package com.example.shop.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.ManyToAny;

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
    private Set<ProductVariant> preProductVariants;

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
        categories.add("SPORTWEAR");
        return categories;
    }

    @Override
    public String toString() {
        return "Product [id=" + id + ", name=" + name + ", description=" + description + ", image=" + image
                + ", category=" + category + "]";
    }

    
}

