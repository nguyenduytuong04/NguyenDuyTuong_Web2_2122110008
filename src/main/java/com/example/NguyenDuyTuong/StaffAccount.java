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
@Table(name = "staffaccounts")
public class StaffAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "staffaccount_id", nullable = false, length = 36)
    private UUID staffaccount_id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "role_id")
    private Role role_id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String first_name;

    @Column(name = "last_name", nullable = false, length = 100)
    private String last_name;

    @Column(name = "phone_number", length = 100)
    private String phone_number;

    @Column(name = "email", nullable = false, length = 0255, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 0255)
    private String password_hash;

    @Column(name = "image", length = 0255, columnDefinition = "TEXT DEFAULT NULL")
    private String image;

    @Column(name = "placeholder", length = 0255, columnDefinition = "TEXT DEFAULT NULL")
    private String placeholder;

    @Column(name = "active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active;

    @Column(name = "created_at")
    private Date created_at;

    @Column(name = "updated_at")
    private Date updated_at;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private StaffAccount created_by;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private StaffAccount updated_by;

    @JsonIgnore
    @OneToMany(mappedBy = "created_by", cascade = CascadeType.REMOVE)
    private List<Category> categories;
    @JsonIgnore
    @OneToMany(mappedBy = "updated_by", cascade = CascadeType.REMOVE)
    private List<Category> categories1;
    @JsonIgnore
    @OneToMany(mappedBy = "created_by", cascade = CascadeType.REMOVE)
    private List<Attribute> attributes;
    @JsonIgnore
    @OneToMany(mappedBy = "updated_by", cascade = CascadeType.REMOVE)
    private List<Attribute> attributes1;
    @JsonIgnore
    @OneToMany(mappedBy = "created_by", cascade = CascadeType.REMOVE)
    private List<Product> products1;
    @JsonIgnore
    @OneToMany(mappedBy = "updated_by", cascade = CascadeType.REMOVE)
    private List<Product> products;
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private List<ShippingZone> shippingzones;
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REMOVE)
    private List<ShippingZone> shippingzones1;
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private List<OrderStatus> orderstatuses;
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REMOVE)
    private List<OrderStatus> orderstatuses1;
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REMOVE)
    private List<Order> orders;
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private List<SlideShow> slideshows1;
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REMOVE)
    private List<SlideShow> slideshows;
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private List<Tag> tags;
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REMOVE)
    private List<Tag> tags1;
    @JsonIgnore
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.REMOVE)
    private List<Supplier> suppliers;
    @JsonIgnore
    @OneToMany(mappedBy = "updatedBy", cascade = CascadeType.REMOVE)
    private List<Supplier> suppliers1;
    @JsonIgnore
    @OneToMany(mappedBy = "accountId", cascade = CascadeType.REMOVE)
    private List<Notification> notifications;
}