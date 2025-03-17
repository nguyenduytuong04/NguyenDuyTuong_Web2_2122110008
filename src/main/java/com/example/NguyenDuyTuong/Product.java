package com.example.NguyenDuyTuong;

import java.math.BigDecimal;
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
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, length = 36)
    private UUID product_id;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "product_name", nullable = false, length = 255)
    private String product_name;

    @Column(name = "sku", length = 255)
    private String sku;

    @Column(name = "sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal sale_price;

    @Column(name = "compare_price", precision = 10, scale = 2, columnDefinition = "NUMERIC DEFAULT 0 CHECK (compare_price > sale_price OR compare_price = 0)")
    private BigDecimal compare_price;

    @Column(name = "buying_price", precision = 10, scale = 2)
    private BigDecimal buying_price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "short_description", nullable = false, length = 165)
    private String short_description;

    @Column(name = "product_description", nullable = false, columnDefinition = "TEXT")
    private String product_description;

    @Column(name = "product_type", length = 64, columnDefinition = "VARCHAR(64) CHECK (product_type IN ('jacket', 'shirt','skirt','casual','watches','party wear','sports','formal','shorts'))")
    private String product_type;

    @Column(name = "published", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean published;

    @Column(name = "disable_out_of_stock", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean disable_out_of_stock;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

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
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<ProductCategory> productcategories;
    @JsonIgnore
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<ProductShippingInfo> productshippinginfo;
    @JsonIgnore
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<Gallery> gallery;
    @JsonIgnore
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<ProductAttribute> productattributes;
    @JsonIgnore
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<VariantOption> variantoptions;
    @JsonIgnore
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<Variant> variants;
    @JsonIgnore
    @OneToMany(mappedBy = "product_id", cascade = CascadeType.REMOVE)
    private List<ProductCoupon> productcoupons;
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<OrderItem> orderitems;
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<Sell> sells;
    @JsonIgnore
    @OneToMany(mappedBy = "productId", cascade = CascadeType.REMOVE)
    private List<CardItem> carditems;
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<ProductTag> producttags;
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE)
    private List<ProductSupplier> productSuppliers;
}
