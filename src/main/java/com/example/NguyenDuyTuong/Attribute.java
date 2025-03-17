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
@Table(name = "attributes")
public class Attribute {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "attribute_id", nullable = false, length = 36)
    private UUID attribute_id;

    @Column(name = "attribute_name", nullable = false)
    private String attribute_name;

    @Column(name = "created_at", nullable = false, length = 0255)
    private Date created_at;

    @Column(name = "updated_at", nullable = false, length = 0255)
    private Date updated_at;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private StaffAccount created_by;

    @ManyToOne
    @JoinColumn(name = "updated_by", nullable = false)
    private StaffAccount updated_by;

    @JsonIgnore
    @OneToMany(mappedBy = "attribute_id", cascade = CascadeType.REMOVE)
    private List<AttributeValue> attributevalues;

    @JsonIgnore
    @OneToMany(mappedBy = "attribute_id", cascade = CascadeType.REMOVE)
    private List<ProductAttribute> productattributes;

}