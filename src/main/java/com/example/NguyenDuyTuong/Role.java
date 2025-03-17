package com.example.NguyenDuyTuong;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id", nullable = false)
    private Integer role_id;

    @Column(name = "role_name", nullable = false)
    private String role_name;

    @Column(name = "privileges", columnDefinition = "TEXT")
    private String privileges;

    @JsonIgnore
    @OneToMany(mappedBy = "role_id", cascade = CascadeType.REMOVE)
    private List<StaffAccount> staffaccounts;

}
