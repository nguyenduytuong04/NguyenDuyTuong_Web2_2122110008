package com.nguyenduytuong.example05.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nguyenduytuong.example05.entity.Brand;
import com.nguyenduytuong.example05.entity.Product;
import com.nguyenduytuong.example05.exceptions.APIException;
import com.nguyenduytuong.example05.exceptions.ResourceNotFoundException;
import com.nguyenduytuong.example05.payloads.BrandDTO;
import com.nguyenduytuong.example05.payloads.BrandResponse;
import com.nguyenduytuong.example05.repository.BrandRepo;
import com.nguyenduytuong.example05.service.BrandService;
import com.nguyenduytuong.example05.service.ProductService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepo brandRepo;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public BrandDTO createBrand(Brand brand) {
        Brand savedBrand = brandRepo.findByBrandName(brand.getBrandName());

        if (savedBrand != null) {
            throw new APIException("Brand with the name ' " + brand.getBrandName() + "'already exist!");
        }

        savedBrand = brandRepo.save(brand);
        return modelMapper.map(savedBrand, BrandDTO.class);
    }

    @Override
    public BrandResponse getBrands(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<Brand> pageBrands = brandRepo.findAll(pageDetails);

        List<Brand> brands = pageBrands.getContent();

        if (brands.size() == 0) {
            throw new APIException("No brand is created till now!");
        }

        List<BrandDTO> brandDTOs = brands.stream()
                .map(brand -> modelMapper.map(brand, BrandDTO.class)).collect(Collectors.toList());

        BrandResponse brandResponse = new BrandResponse();

        brandResponse.setContent((brandDTOs));

        brandResponse.setPageNumber((pageBrands.getNumber()));

        brandResponse.setPageSize((pageBrands.getSize()));

        brandResponse.setTotalElements((pageBrands.getTotalElements()));

        brandResponse.setTotalPages((pageBrands.getTotalPages()));

        brandResponse.setLastPage((pageBrands.isLast()));

        return brandResponse;

    }

    @Override
    public BrandDTO updateBrand(Brand brand, Long brandId) {
        Brand savedBrand = brandRepo.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "brandId", brandId));

        brand.setBrandId(brandId);

        savedBrand = brandRepo.save(brand);

        return modelMapper.map(savedBrand, BrandDTO.class);
    }

    @Override
    public String deleteBrand(Long brandId) {
        Brand brand = brandRepo.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "brandId", brandId));

        List<Product> products = brand.getProducts();
        products.forEach(product -> {
            productService.deleteProduct(product.getProductId());
        });

        brandRepo.delete(brand);

        return "Brand with brandId: " + brandId + " deleted successfully!!";
    }
    @Override
    public BrandDTO getBrandById(Long brandId) {
        Optional<Brand> brandOptional = brandRepo.findById(brandId);

        if (brandOptional.isPresent()) {
            Brand brand = brandOptional.get();
            return modelMapper.map(brand, BrandDTO.class);
        } else {
            throw new ResourceNotFoundException("Brand", "brandId", brandId);
        }
    }
}
