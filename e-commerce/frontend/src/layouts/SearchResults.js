import React, { useEffect, useState } from "react";
import { useLocation,Link } from "react-router-dom";
import { GET_ALL } from "../api/apiService";

function SearchResults() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
const [viewMode, setViewMode] = useState("grid"); 

  useEffect(() => {
    if (searchQuery) {
      const fetchData = async () => {
        try {
          const params = {
            pageNumber: 0,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "asc",
          };
          const response = await GET_ALL(
            `public/products/keyword/${searchQuery}`,
            params
          );
          setProducts(response.content || []);
        } catch (error) {
          console.error("Lỗi tìm kiếm:", error);
        }
      };
      fetchData();
    }
  }, [searchQuery]);
  const handleGridView = () => {
    setViewMode("grid");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const handleListView = () => {
    setViewMode("list");
  };
  return (
    <div className="container mt-4">
      <h3>Kết quả tìm kiếm cho: "{searchQuery}"</h3>
      <header className="mb-3">
          <div className="form-inline">
            <div className="btn-group">
              <button
                className={`btn btn-light ${
                  viewMode === "grid" ? "active" : ""
                }`}
                onClick={handleGridView}
              >
                <i className="fa fa-th"></i>
              </button>
              <button
                className={`btn btn-light ${
                  viewMode === "list" ? "active" : ""
                }`}
                onClick={handleListView}
              >
                <i className="fa fa-bars"></i>
              </button>
            </div>
          </div>
        </header>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div
            className={`col-md-${viewMode === "grid" ? "3" : "12"}`} // Thay đổi kích thước cột
            key={product.productId}
          >
            <figure className={`card card-product-${viewMode}`}>
              {" "}
              {/* Thêm class cho chế độ list */}
              <div className="img-wrap">
                <span className="badge badge-danger"> MỚI </span>
                <img
                  src={`http://localhost:8080/api/public/products/image/${product.image}`}
                  alt={product.productName}
                />
              </div>
              <figcaption className="info-wrap">
                <Link
                  to={`/Detail?productId=${product.productId}`}
                  className="title mb-2"
                >
                  {product.productName}
                </Link>
                <div className="price-wrap">
                  <span className="price">
                    {formatPrice(product.specialPrice)}
                  </span>
                  <small className="text-muted">/mỗi sản phẩm</small>
                </div>
                {viewMode === "list" && ( // Hiển thị thêm thông tin trong chế độ list
                  <>
                    <p className="mb-2">
                      {product.quantity} Cái{" "}
                      <small className="text-muted">
                        (Số lượng tối thiểu)
                      </small>
                    </p>
                    <p className="text-muted">
                      {product.category.categoryName}
                    </p>
                    <hr />
                    <p className="mb-3">
                      <span className="tag">
                        <i className="fa fa-check"></i> Đã xác minh
                      </span>
                    </p>
                    <label className="custom-control mb-3 custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                      />
                      <div className="custom-control-label">
                        Thêm vào so sánh
                      </div>
                    </label>
                  </>
                )}
                <Link
                  to={`/ListingGrid/contact-supplier/${product.productId}`}
                  className="btn btn-outline-primary"
                >
                  <i className="fa fa-envelope"></i> Liên hệ nhà cung cấp
                </Link>
              </figcaption>
            </figure>
          </div>
          ))
        ) : (
          <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
