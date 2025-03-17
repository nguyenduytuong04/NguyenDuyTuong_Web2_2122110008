package com.example.NguyenDuyTuong;

import java.math.BigDecimal;
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
@Table(name = "variantoptions")
public class VariantOption {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "variantoption_id", nullable = false, length = 36)
    private UUID variantoption_id;

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "image")
    private Gallery image;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product_id;

    @Column(name = "sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal sale_price;

    @Column(name = "compare_price", precision = 10, scale = 2, columnDefinition = "NUMERIC DEFAULT 0 CHECK (compare_price > sale_price OR compare_price = 0)")
    private BigDecimal compare_price;

    @Column(name = "buying_price", precision = 10, scale = 2)
    private BigDecimal buying_price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "sku", length = 255)
    private String sku;

    @Column(name = "active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active;

    @JsonIgnore
    @OneToMany(mappedBy = "variantoption_id", cascade = CascadeType.REMOVE)
    private List<Variant> variants;
}
