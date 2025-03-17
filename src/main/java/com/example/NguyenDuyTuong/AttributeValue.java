package com.example.NguyenDuyTuong;

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
@Table(name = "attributevalues")
public class AttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "attributevalue_id", nullable = false, length = 36)
    private UUID attributevalue_id;

    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false)
    private Attribute attribute_id;

    @Column(name = "attribute_value", nullable = false, length = 255)
    private String attribute_value;

    @Column(name = "color", length = 50)
    private String color;

    @JsonIgnore
    @OneToMany(mappedBy = "attributevalue_id", cascade = CascadeType.REMOVE)
    private List<ProductAttributeValue> productattributevalues;

}
