import axios from "axios";
import {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  Identifier,
  QueryFunctionContext,
  RaRecord,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
  useRefresh,
} from "react-admin";
const apiUrl = "http://localhost:8080/api";
axios.defaults.withCredentials = true;
const httpClient = {
  get: (url: string) => {
    const token = localStorage.getItem("jwt-token");
    console.log("Making request to:", url);
    console.log("With token:", token);

    return axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Response:", response);
        return { json: response.data };
      })
      .catch((error) => {
        console.error("Request failed:", error.response || error);
        if (error.response?.status === 401) {
          console.log("Authentication failed, redirecting to login...");
          localStorage.removeItem("jwt-token");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        throw error;
      });
  },

  post: (url: string, data: any) => {
    const token = localStorage.getItem("jwt-token");
    console.log("POST request to:", url);
    console.log("With data:", data);

    return axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => ({ json: response.data }))
      .catch((error) => {
        console.error("API request failed:", error);
        if (error.response?.status === 401) {
          console.log("Authentication failed, redirecting to login...");
          localStorage.removeItem("jwt-token");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        throw error;
      });
  },

  put: (url: string, data: any) => {
    const token = localStorage.getItem("jwt-token");

    return axios
      .put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => ({ json: response.data }))
      .catch((error) => {
        console.error("API request failed:", error);
        if (error.response?.status === 401) {
          console.log("Authentication failed, redirecting to login...");
          localStorage.removeItem("jwt-token");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        throw error;
      });
  },

  delete: (url: string, p0: { data: { ids: any[] } }) => {
    const token = localStorage.getItem("jwt-token");

    return axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => ({ json: response.data }))
      .catch((error) => {
        console.error("API request failed:", error);
        if (error.response?.status === 401) {
          console.log("Authentication failed, redirecting to login...");
          localStorage.removeItem("jwt-token");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        throw error;
      });
  },
};

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    console.log("getList", resource, params);
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    // Convert field names
    let sortBy = field;
    if (field === "id") {
      sortBy = resource === "users" ? "userId" : "id";
    }

    // Adjust page number since backend uses 0-based indexing
    const pageNumber = page - 1;

    const query = {
      pageNumber: pageNumber.toString(),
      pageSize: perPage.toString(),
      sortBy: sortBy,
      sortOrder: order.toLowerCase(),
    };

    let url: string;

    // Logic cho users
    if (resource === "users") {
      // Kiểm tra nếu là POST thì sử dụng endpoint register
      if (params.filter && params.filter.method === "POST") {
        url = `${apiUrl}/register`; // Endpoint cho việc đăng ký
      } else {
        url = `${apiUrl}/admin/users?${new URLSearchParams(query).toString()}`; // Endpoint cho việc lấy danh sách người dùng
      }

      console.log("Making users request to:", url);
      const result = await httpClient.get(url);
      console.log("Users response:", result.json);
      const data = result.json.content.map((item: any) => ({
        id: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        mobileNumber: item.mobileNumber,
        roles: item.roles,
        address: item.address,
        cart: item.cart,
      }));
      console.log("Mapped user data:", data);
      return {
        data,
        total: result.json.totalElements,
      };
    }
    // Logic cho categories
    else if (resource === "categories") {
      url = `${apiUrl}/public/categories?pageNumber=0&pageSize=100`; // Lấy tất cả danh mục
      const result = await httpClient.get(url);
      return {
        data: result.json.content.map((category: any) => ({
          id: category.categoryId, // ID cho mỗi category
          name: category.categoryName, // Tên category
        })),
        total: result.json.totalElements, // Tổng số category
      };
    }

    // Logic cho tìm kiếm theo từ khóa
    else if (params.filter && params.filter.search) {
      const keyword = params.filter.search;
      delete params.filter.search;
      url = `${apiUrl}/public/${resource}/keyword/${encodeURIComponent(
        keyword
      )}?${new URLSearchParams(query).toString()}`;
    }
    // Logic cho lọc theo categoryId
    else if (params.filter && params.filter.categoryId) {
      const categoryId = params.filter.categoryId;
      delete params.filter.categoryId;
      url = `${apiUrl}/public/categories/${categoryId}/${resource}?${new URLSearchParams(
        query
      ).toString()}`;
    }
    // Logic cho các resource khác
    else {
      if (resource === "carts") {
        url = `${apiUrl}/admin/${resource}`;
      } else if (resource === "orders") {
        url = `${apiUrl}/admin/${resource}?pageNumber=0&pageSize=100&sortBy=orderId`;
        const result = await httpClient.get(url);
        return {
          data: result.json.content.map((order: any) => ({
            id: order.orderId,
            email: order.email,
            orderItems: order.orderItems,
            totalAmount: order.totalAmount,
            orderStatus: order.orderStatus,
            orderDate: order.orderDate,
            paymentMethod: order.payment.paymentMethod,
            products: order.payment.paymentMethod,
          })),
          total: result.json.totalElements, // Số lượng đơn hàng
        };
      } else if (resource === "products") {
        url = `${apiUrl}/public/${resource}?${new URLSearchParams(
          query
        ).toString()}`;
      } else {
        url = `${apiUrl}/admin/${resource}?${new URLSearchParams(
          query
        ).toString()}`;
      }
    }

    // Gọi API và xử lý phản hồi cho các resource khác
    const result = await httpClient.get(url);
    const baseUrl = "http://localhost:8080/api/public/products/image/";
    let data = [];
    let total = 0;

    if (result.json) {
      // Kiểm tra xem response có phải là mảng không
      if (Array.isArray(result.json)) {
        // Xử lý khi response là mảng (ví dụ: /api/admin/carts)
        data = result.json.map((item: any) => ({
          id: item.cartId, // Sử dụng cartId cho resource carts
          totalPrice: item.totalPrice,
          products: item.products,
        }));
        total = data.length;
      } else if (result.json.content) {
        // Xử lý khi response có thuộc tính content
        data = result.json.content.map(
          (item: { [x: string]: any; image: any }) => ({
            id: resource === "users" ? item.userId : item.productId,
            ...item,
            image: item.image ? `${baseUrl}${item.image}` : null,
          })
        );
        total = result.json.totalElements || data.length;
      } else {
        console.error("Unexpected response structure:", result.json);
      }
    }

    return {
      data,
      total,
    };
  },

  delete: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteParams<RecordType>
  ): Promise<DeleteResult<RecordType>> => {
    try {
      console.log("Attempting to delete ID:", params.id); // Log the ID being passed
      const url = `${apiUrl}/admin/${resource}/${params.id}`; // Ensure this is using the correct ID

      await httpClient.delete(url, {
        data: { ids: [params.id] },
      });

      return {
        data: params.previousData as RecordType,
      };
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error("Error deleting record");
    }
  },

  deleteMany: async <RecordType extends RaRecord = any>(
    resource: string,
    params: DeleteManyParams
  ): Promise<DeleteManyResult<RecordType>> => {
    const { ids } = params;
    const refresh = useRefresh();
    try {
      const deletePromises = ids.map((id) => {
        let url = `${apiUrl}/admin/${resource}/${id}`;

        // Nếu resource là 'cart', URL phải có dạng `/cart/{cartId}/product/{productId}`
        if (resource === "carts") {
          const cartId = localStorage.getItem("cartId");

          if (!cartId) {
            console.error("Cart ID not found in localStorage");
            throw new Error("Cart ID not found in localStorage");
          }

          url = `${apiUrl}/public/carts/${cartId}/product/${id}`;
        }
        return httpClient.delete(url, {
          data: { ids: [id] },
        });
      });

      await Promise.all(deletePromises);
      refresh();

      return { data: ids };
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error("Error deleting records");
    }
  },

  getManyReference: function <RecordType extends RaRecord = any>(
    resource: string,
    params: GetManyReferenceParams & QueryFunctionContext
  ): Promise<GetManyReferenceResult<RecordType>> {
    throw new Error("Function not implemented.");
  },

  updateMany: function <RecordType extends RaRecord = any>(
    resource: string,
    params: UpdateManyParams
  ): Promise<UpdateManyResult<RecordType>> {
    throw new Error("Function not implemented.");
  },

  create: async (
    resource: string,
    params: CreateParams
  ): Promise<CreateResult> => {
    try {
      console.log("data", params);
      let url: string;
      if (resource === "users") {
        url = `${apiUrl}/register`; // Endpoint for user registration
      } else if (resource === "products") {
        url = `${apiUrl}/admin/categories/${params.data.categoryId}/products`;
        delete params.data.categoryId; // Remove categoryId from the data being sent
        params.data.image = "default.png"; // Set default image
      } else if (resource === "categories") {
        url = `${apiUrl}/admin/categories`; // Endpoint for creating categories
      } else {
        url = `${apiUrl}/admin/${resource}`; // Generic endpoint for other resources
      }

      const { data } = params;
      const result = await httpClient.post(url, data);
      return { data: { ...data, id: result.json.id } };
    } catch (error) {
      console.error("Error creating resource:", error);
      throw error; // Hoặc xử lý lỗi tùy theo nhu cầu của bạn
    }
  },

  update: async (
    resource: string,
    params: UpdateParams
): Promise<UpdateResult> => {
    let url = `${apiUrl}/admin/${resource}/${params.id}`; // Giá trị mặc định

    if (resource === "users") {
        url = `${apiUrl}/public/${resource}/${params.id}`;
    }

    const { data } = params;
    const result = await httpClient.put(url, data);
    const updatedData = {
        id: params.id, // Đảm bảo 'id' có trong phản hồi
        ...result.json,
    };

    return { data: updatedData };
},

  getOne: async (
    resource: string,
    params: GetOneParams
  ): Promise<GetOneResult> => {
    console.log("Getone called for resouce:", resource, "with params:", params);
    let url: string;
    if (resource === "carts") {
      url = `${apiUrl}/public/user/${localStorage.getItem(
        "emailId"
      )}/${resource}/${params.id}`;
    } else if (resource === "orders") {
      url = `${apiUrl}/public/users/${localStorage.getItem(
        "emailId"
      )}/${resource}/${params.id}`;
    } else {
      url = `${apiUrl}/public/${resource}/${params.id}`;
    }
    const result = await httpClient.get(url);
    console.log("API Response: ", result.json);

    const idFieldMapping: { [key: string]: string } = {
      products: "productId",
      categories: "categoryId",
      carts: "cartId",
      users: "userId",
      // Add more mappings as needed
    };
    const idField = idFieldMapping[resource] || "id";
    const baseUrl = "http://localhost:8080/api/public/products/image/";
    let data;

    if (resource === "carts") {
      data = {
        id: result.json[idField],
        totalPrice: result.json.totalPrice,
        products: result.json.products.map((product: any) => ({
          id: product.productId,
          productName: product.productName,
          image: product.image ? `${baseUrl}${product.image}` : null,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          discount: product.discount,
          specialPrice: product.specialPrice,
          category: product.category
            ? {
                id: product.category.categoryId,
                name: product.category.categoryName,
              }
            : null,
        })),
      };
    } else {
      data = {
        id: result.json[idField],
        ...result.json,
      };
    }
    return { data };
  },

  getMany: async (
    resource: string,
    params: GetManyParams
  ): Promise<GetManyResult> => {
    const idFieldMapping: { [key: string]: string } = {
      products: "productId",
      categories: "categoryId",
      carts: "cartId",
      users: "userId",
      // Add more mappings as needed
    };
    console.log("Request resource:", resource);
    console.log("params:", params);
    const idField = idFieldMapping[resource] || "id";

    const ids = params.ids.join(",");
    let url: string;
    if (resource === "products") {
      url = `${apiUrl}/public/categories/${ids}/${resource}`;
    } else {
      url = `${apiUrl}/public/${resource}`;
    }

    console.log("Request URL getMany:", url);

    const result = await httpClient.get(url);
    console.log("Request result:", result);
    console.log("Request result JSON:", result.json);

    const data = result.json.content.map((item: any) => ({
      id: item[idField],
      ...item,
    }));

    return { data };
  },
};
