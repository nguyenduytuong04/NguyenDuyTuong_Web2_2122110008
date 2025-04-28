import { Create, Datagrid, DeleteButton, Edit, EditButton, List, NumberField, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextField, TextInput, useRecordContext } from "react-admin";
import {Link as RouterLink} from "react-router-dom";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material'; // Import Button from Material UI
const CustomEditButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the default EditButton behavior
        console.log('Edit button clicked for product:', record.productId);
        navigate(`/products/${record.productId}/edit`);
    };

    return (
        <Button onClick={handleEdit} variant="contained" color="primary">
            Edit
        </Button>
    );
};

const CustomImageField = ({ source }: { source: string }) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return <span>No Image</span>;
    }

    return (
        <RouterLink 
            to={`/products/${record.productId}/update-image`}
            onClick={(event) => event.stopPropagation()} // Ngăn rowClick kích hoạt khi click ảnh
        >
            <img 
                src={record[source]} 
                alt="Product" 
                style={{ width: "100px", height: "auto", cursor: "pointer" }} 
            />
        </RouterLink>
    );
};

const postFilters = [
    <TextInput key="search" source="search" label="Search" alwaysOn />,
    <ReferenceInput key="categoryId" source="categoryId" reference="categories" label="Category">
        <SelectInput optionText="name" />
    </ReferenceInput>
];
export const ProductList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick="edit"> {/* Allow row click to edit */}
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <TextField source="category.categoryName" label="Category Name" />
            <CustomImageField source="image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount" />
            <NumberField source="specialPrice" label="Special Price" />
            <CustomEditButton />
            <DeleteButton />
             </Datagrid>
    </List>
);
export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="productName" label="Product Name (Product name must contain at least 3 characters)" />
            <TextInput source="description" label="Description (Product Description must contain at least 6 characters)" />
            <NumberInput source="quantity" label="Quantity" />
            <NumberInput source="price" label="Price" />
            <NumberInput source="discount" label="Discount" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ReferenceInput source="categoryId" reference="categories">
        <SelectInput optionText="name" />
    </ReferenceInput>
        </SimpleForm>
    </Create>
);
export const ProductEdit = () => {
    console.log("ProductEdit component rendered");
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="productId" disabled />
                <ReferenceInput source="categoryId" reference="categories" label="Category">
                    <SelectInput optionText="categoryName" />
                </ReferenceInput>
                <TextInput source="productName" />
                <TextInput source="image" disabled />
                <TextInput source="description" />
                <NumberInput source="quantity" />
                <NumberInput source="price" />
                <NumberInput source="discount" />
                <NumberInput source="specialPrice" />
            </SimpleForm>
        </Edit>
    );
};
