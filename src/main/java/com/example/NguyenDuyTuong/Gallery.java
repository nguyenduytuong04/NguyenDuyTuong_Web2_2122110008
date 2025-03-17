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
@Table(name = "galleries")
public class Gallery {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "gallery_id", nullable = false, length = 36)
    private UUID gallery_id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product_id;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "placeholder", nullable = false)
    private String placeholder;

    @Column(name = "is_thumbnail", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean is_thumbnail;

    @Column(name = "created_at", nullable = false, length = 0255)
    private Date created_at;

    @Column(name = "updated_at", nullable = false, length = 0255)
    private Date updated_at;

    @JsonIgnore
    @OneToMany(mappedBy = "image", cascade = CascadeType.REMOVE)
    private List<VariantOption> variantoptions;

}