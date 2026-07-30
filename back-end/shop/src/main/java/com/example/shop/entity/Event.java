package com.example.shop.entity;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.security.core.parameters.P;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "startat")
    private LocalDate startAt;

    @Column(name = "endat")
    private LocalDate endAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_event",
        joinColumns = {
            @JoinColumn(name = "eventid")
        }, inverseJoinColumns = {
            @JoinColumn(name = "productid")
        }
    )
    private Set<Product> discountedProducts;

    @Override
    public String toString() {
        return "Event [id=" + id + ", title=" + title + ", description=" + description + ", image=" + image
                + ", discount=" + discount + ", startAt=" + startAt + ", endAt=" + endAt + "]";
    }

    
}
