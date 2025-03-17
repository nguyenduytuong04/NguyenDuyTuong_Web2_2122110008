package com.example.NguyenDuyTuong;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

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
@Table(name = "orders")
public class Order {
    @Id
    @Column(name = "id", nullable = false, length = 50)
    private String id;

    @ManyToOne
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "order_status_id")
    private OrderStatus orderStatus;

    @Column(name = "order_approved_at")
    private Date orderApprovedAt;

    @Column(name = "order_delivered_carrier_date")
    private Date orderDeliveredCarrierDate;

    @Column(name = "order_delivered_customer_date")
    private Date orderDeliveredCustomerDate;

    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @JsonIgnore
    @OneToMany(mappedBy = "orderId", cascade = CascadeType.REMOVE)
    private List<OrderItem> orderiItems;
}
