package com.nguyenduytuong.example05.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import com.nguyenduytuong.example05.config.AppConstants;
import com.nguyenduytuong.example05.entity.Product;
import com.nguyenduytuong.example05.payloads.ProductDTO;
import com.nguyenduytuong.example05.payloads.ProductResponse;
import com.nguyenduytuong.example05.service.ProductService;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    /*** Thêm sản phẩm theo category ***/
    @PostMapping("/admin/categories/{categoryId}/products")
    public ResponseEntity<ProductDTO> addProductByCategory(@Valid @RequestBody Product product, @PathVariable Long categoryId) {
        ProductDTO savedProduct = productService.addProductByCategory(categoryId, product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    /*** Thêm sản phẩm theo brand ***/
    @PostMapping("/admin/brands/{brandId}/products")
    public ResponseEntity<ProductDTO> addProductByBrand(@Valid @RequestBody Product product, @PathVariable Long brandId) {
        ProductDTO savedProduct = productService.addProductByBrand(brandId, product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    /*** Lấy thông tin sản phẩm theo ID ***/
    @GetMapping("/public/products/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

    /*** Lấy danh sách sản phẩm theo category ***/
    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        ProductResponse productResponse = productService.searchByCategory(
                categoryId,
                pageNumber == 0 ? 0 : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);

        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    /*** Lấy danh sách sản phẩm theo brand ***/
    @GetMapping("/public/brands/{brandId}/products")
    public ResponseEntity<ProductResponse> getProductsByBrand(
            @PathVariable Long brandId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        ProductResponse productResponse = productService.searchByBrand(
                brandId,
                pageNumber == 0 ? 0 : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);

        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    /*** Xóa sản phẩm theo ID ***/
    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<String> deleteProductById(@PathVariable Long productId) {
        String status = productService.deleteProduct(productId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    /*** Lấy dsanh sách tất cả sản phẩm ***/
    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        ProductResponse productResponse = productService.getAllProducts(
                pageNumber == 0 ? 0 : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);

        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    /*** Tìm kiếm sản phẩm theo từ khóa ***/
    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponse> getProductsByKeyword(
            @PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "categoryId", defaultValue = "0", required = false) Long categoryId,
            @RequestParam(name = "brandId", defaultValue = "0", required = false) Long brandId) {

        ProductResponse productResponse = productService.searchProductByKeyword(
                keyword,
                categoryId,
                brandId,
                pageNumber == 0 ? 0 : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);

        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    /*** Lấy hình ảnh sản phẩm ***/
    @GetMapping("/public/products/image/{fileName}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = productService.getProductImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);
        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    /*** Cập nhật thông tin sản phẩm ***/
    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody Product product, @PathVariable Long productId) {
        ProductDTO updatedProduct = productService.updateProduct(productId, product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    /*** Cập nhật hình ảnh sản phẩm ***/
    @PutMapping("/admin/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId, @RequestParam("image") MultipartFile image) throws IOException {
        ProductDTO updatedProduct = productService.updateProductImage(productId, image);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }
}
