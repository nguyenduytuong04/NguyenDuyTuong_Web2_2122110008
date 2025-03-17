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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productattributevalues")
public class ProductAttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "productattributevalue_id", nullable = false, length = 36)
    private UUID productattributevalue_id;

    @ManyToOne
    @JoinColumn(name = "productattribute_id", nullable = false)
    private ProductAttribute productattribute_id;

    @ManyToOne
    @JoinColumn(name = "attributevalue_id", nullable = false)
    private AttributeValue attributevalue_id;

}
