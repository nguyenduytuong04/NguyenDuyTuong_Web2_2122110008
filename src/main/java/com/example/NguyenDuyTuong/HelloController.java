package com.example.NguyenDuyTuong;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/")
public class HelloController {

    @GetMapping
    public String index() {
        return "Hello world";
    }

    @PostMapping
    public String postMethod(@RequestBody String data) {
        return "POST: " + data;
    }

    @PutMapping("path/{id}")
    public String putMethod(@PathVariable String id, @RequestBody String entity) {
        return "PUT: " + entity + " with ID: " + id;
    }

    @DeleteMapping("delete/{id}")
    public String deleteMethod(@PathVariable String id) {
        return "Deleted item with ID: " + id;
    }
}