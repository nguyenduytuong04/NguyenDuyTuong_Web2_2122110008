package com.example.NguyenDuyTuong;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productshippinginfos")
public class ProductShippingInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "productShippingInfo_id", nullable = false)
    private UUID productShippingInfo_id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product_id;

    @Column(name = "weight_unit", length = 10, columnDefinition = "VARCHAR(10) CHECK (weight_unit IN ('g', 'kg'))")
    private String weight_unit;

    @Column(name = "volume_unit", length = 10, columnDefinition = "VARCHAR(10) CHECK (volume_unit IN ('l', 'ml'))")
    private String volume_unit;

    @Column(name = "weight", nullable = false, columnDefinition = "NUMERIC DEFAULT 0")
    private Number weight;

    @Column(name = "volume", nullable = false, columnDefinition = "NUMERIC DEFAULT 0")
    private Number volume;
    @Column(name = "dimension_width", nullable = false, columnDefinition = "NUMERIC DEFAULT 0")
    private Number dimension_width;
    @Column(name = "dimension_height", nullable = false, columnDefinition = "NUMERIC DEFAULT 0")
    private Number dimension_height;
    @Column(name = "dimension_depth", nullable = false, columnDefinition = "NUMERIC DEFAULT 0")
    private Number dimension_depth;
    @Column(name = "dimension_unit", length = 10, columnDefinition = "VARCHAR(10) CHECK (dimension_unit IN ('l', 'ml'))")
    private String dimension_unit;

}
