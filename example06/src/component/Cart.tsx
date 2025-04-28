import { List, Datagrid, TextField, useRecordContext, Show, SimpleShowLayout, NumberField, ArrayField, ImageField, ReferenceField, useRedirect } from 'react-admin';
import PDFButton from '../PDFButton';

export const CartList = () => {
  const token = localStorage.getItem("jwt-token");
  const redirect = useRedirect(); // Hàm điều hướng của react-admin

  const fetchCartDataAndRedirect = async (cartId) => {
      try {
          const response = await fetch(`http://localhost:8080/api/public/users/${cartId}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
          });
          const data = await response.json();
          console.log("Cart Data:", data.cart);
          localStorage.setItem("emailId", data.email);
          localStorage.setItem("cartId", data.cart.cartId);
          // Điều hướng ngay sau khi gọi API thành công
          redirect(`/carts/${cartId}/show`);
      } catch (error) {
          console.error("Error fetching cart data:", error);
      }
  };

  return (
      <List>
          <Datagrid
              rowClick={(id, resource, record) => {
                  fetchCartDataAndRedirect(record.id); // Gọi API và chuyển hướng luôn
                  return false; // Ngăn react-admin xử lý mặc định (tránh phải ấn 2 lần)
              }}
          >
              <TextField source="id" label="Cart ID" />
              <TextField source="totalPrice" label="Total Price" />
          </Datagrid>
      </List>
  );
};

const CustomPDFButton = () => {
    const record = useRecordContext();
    console.log("Record:", record);
    if (!record) return <span>Loading...</span>;
    if (!record.id) return <span>No cart ID</span>;

    const cartId = record.id;
    const token = localStorage.getItem("jwt-token");

    const fetchCartData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/public/users/${cartId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("Cart Data:", data);
            localStorage.setItem("emailId", data.email);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    return <PDFButton />

};

export const CartShow = () => (
    <Show>
        <SimpleShowLayout>
            <CustomPDFButton />
            <TextField source="id" label="Cart ID" />
            <NumberField source="totalPrice" label="Total Price" />
            <ArrayField source="products" label="Products">
                <Datagrid >
                    <TextField source="id" label="Product ID" />
                    <TextField source="productName" label="Product Name" />
                    <ImageField source="image" label="Image" />
                    <TextField source="description" label="Description" />
                    <NumberField source="quantity" label="Quantity" />
                    <NumberField source="price" label="Price" />
                    <NumberField source="discount" label="Discount" />
                    <NumberField source="specialPrice" label="Special Price" />
                    <TextField source="category.name" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);
