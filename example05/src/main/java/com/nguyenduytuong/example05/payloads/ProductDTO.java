package com.nguyenduytuong.example05.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long productId;

    private String productName;
    private CategoryDTO category;
    private BrandDTO brand;
    private String image;

    private String description;

    private Integer quantity;

    private Double price;

    private Double discount;

    private Double specialPrice;

    private Integer cartQuantity; // Số lượng trong cart_items

}
