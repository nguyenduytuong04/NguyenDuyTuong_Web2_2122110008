import { useEffect } from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Show,
  SimpleShowLayout,
  ArrayField,
  ReferenceField,
  NumberField,
  DateField,
  useRecordContext,
  ImageField,
} from "react-admin";

const ProductImageField = () => {
  const record = useRecordContext();
console.log("Order Record:", record);
  if (!record || !record.product?.image) return null;

  const imageUrl = `http://localhost:8080/api/public/products/image/${record.product.image}`;

  return <img src={imageUrl} alt="Product" style={{ width: 100, height: 100, objectFit: "cover" }} />;
};
const SaveOrderEmail = () => {
  const record = useRecordContext();

  useEffect(() => {
    if (record?.email) {
      localStorage.setItem("emailId", record.email);
      console.log("Saved email to localStorage:", record.email);
    }
  }, [record]);

  return null; // Không cần hiển thị gì cả
};
export const OrderList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="Order ID" />
        <EmailField source="email" label="Email" />
        <NumberField source="totalAmount" label="Total Amount" />
        <TextField source="orderStatus" label="Order Status" />
        <TextField source="paymentMethod" label="Payment Method" />
        <DateField source="orderDate" label="Order Date" />
        <NumberField source="orderItems.length" label="Total Items" />
      </Datagrid>
    </List>
  );
};

export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      {/* Thông tin đơn hàng */}
      <SaveOrderEmail />
      <TextField source="orderId" label="Order ID" />
      <EmailField source="email" label="Email" />
      <NumberField source="totalAmount" label="Total Amount" />
      <TextField source="orderStatus" label="Order Status" />
      {/* Hiển thị danh sách sản phẩm trong đơn hàng */}
      <ArrayField source="orderItems" label="Products in Order">
        <Datagrid >
          <TextField source="orderItemId" label="Order Item ID" />
          <ProductImageField label="Image" />
          <TextField source="product.productName" label="ProductName"  />
          <NumberField source="product.price" label="Price" />
          <NumberField source="product.discount" label="Discount" />
          <NumberField source="product.quantity" label="Quantity" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
