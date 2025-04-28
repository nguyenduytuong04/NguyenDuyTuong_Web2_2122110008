package com.nguyenduytuong.example05.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.nguyenduytuong.example05.config.AppConstants;
import com.nguyenduytuong.example05.entity.Brand;
import com.nguyenduytuong.example05.payloads.BrandDTO;
import com.nguyenduytuong.example05.payloads.BrandResponse;
import com.nguyenduytuong.example05.service.BrandService;


@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class BrandController {

     @Autowired
     private BrandService brandService;

     @PostMapping("/admin/brands")
     public ResponseEntity<BrandDTO> createBrand(@Valid @RequestBody Brand brand) {
          BrandDTO savedBrandDTO = brandService.createBrand(brand);
          return new ResponseEntity<BrandDTO>(savedBrandDTO, HttpStatus.CREATED);
     }

     @GetMapping("/public/brands")
     public ResponseEntity<BrandResponse> getBRANDS(
               @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
               @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
               @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_BRANDS_BY, required = false) String sortBy,
               @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

          BrandResponse brandResponse = brandService.getBrands(pageNumber == 0 ? pageNumber : pageNumber -1 , pageSize, "id".equals(sortBy) ? "brandId" :sortBy , sortOrder
          );

          return new ResponseEntity<BrandResponse>(brandResponse, HttpStatus.OK);
     }

     @GetMapping("/public/brands/{brandId}")
     public ResponseEntity<BrandDTO> getOneBrand(@PathVariable Long brandId) {
          BrandDTO brandDTO = brandService.getBrandById(brandId);
         return new ResponseEntity<>(brandDTO, HttpStatus.OK);
     }
     
     @PutMapping("/admin/brands/{brandId}")
     public ResponseEntity<BrandDTO> updateBrand(@RequestBody Brand brand,
               @PathVariable Long brandId) {

          BrandDTO brandDTO = brandService.updateBrand(brand, brandId);
          return new ResponseEntity<BrandDTO>(brandDTO, HttpStatus.OK);
     }

     @DeleteMapping("/admin/brands/{brandId}")
     public ResponseEntity<String> deleteBrand(@PathVariable Long brandId) {
          String status = brandService.deleteBrand(brandId);
          return new ResponseEntity<String>(status, HttpStatus.OK);
     }
}
