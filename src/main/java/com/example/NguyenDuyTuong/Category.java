package com.example.NguyenDuyTuong;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent_id;

    @Column(name = "category_name", nullable = false, unique = true, length = 255)
    private String category_name;

    @Column(name = "category_description", columnDefinition = "TEXT")
    private String category_description;

    @Column(name = "icon", columnDefinition = "TEXT")
    private String icon;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;

    @Column(name = "placeholder", columnDefinition = "TEXT")
    private String placeholder;

    @Column(name = "active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active;

    @Column(name = "created_at", nullable = false)
    private Date created_at;

    @Column(name = "updated_at", nullable = false)
    private Date updated_at;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private StaffAccount created_by;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private StaffAccount updated_by;

    @JsonIgnore
    @OneToMany(mappedBy = "category_id", cascade = CascadeType.REMOVE)
    private List<ProductCategory> productcategories;
}
