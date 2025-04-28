import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GET_ALL, GET_ID } from "../../api/apiService";

const SectionContent = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("productId");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState("grid"); // Mặc định là chế độ grid

  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  const categoryId = queryParams.get("categoryId");

  const numItems = 2;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePageChange = (page) => {
    const newUrl = categoryId
      ? `/ListingGrid?page=${page}&categoryId=${categoryId}`
      : `/ListingGrid?page=${page}`;
    navigate(newUrl);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;

    switch (selectedOption) {
      case "Sản phẩm mới nhất":
        setSortBy("productId");
        setSortOrder("desc");
        break;
      case "Sản phẩm cũ":
        setSortBy("productId");
        setSortOrder("asc");
        break;
      case "Giảm sốc nhất":
        setSortBy("discount");
        setSortOrder("desc");
        break;
      case "Rẻ nhất":
        setSortBy("specialPrice");
        setSortOrder("asc");
        break;
      default:
        setSortBy("productId");
        setSortOrder("asc");
    }
  };
  const handleGridView = () => {
    setViewMode("grid");
  };

  const handleListView = () => {
    setViewMode("list");
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <Link
            className="page-link"
            to={
              categoryId
                ? `/ListingGrid?page=${i}&categoryId=${categoryId}`
                : `/ListingGrid?page=${i}`
            }
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Link>
        </li>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage,
      pageSize: numItems,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };
    if (categoryId != null) {
      // Nếu categoryId có giá trị, gọi API theo danh mục
      GET_ALL(`public/categories/${categoryId}/products`, params)
        .then((response) => {
          setProducts(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          setLoading(false);
        });

      GET_ID("public/categories", categoryId)
        .then((item) => setCategories(item))
        .catch((error) => {
          console.error("Failed to fetch category:", error);
        });
    } else {
      // Nếu categoryId không tồn tại, lấy toàn bộ sản phẩm
      GET_ALL("public/products", params)
        .then((response) => {
          setProducts(response.content);
          setTotalPages(response.totalPages);
          setTotalElements(response.totalElements);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          setLoading(false);
        });

      setCategories({ categoryName: "Tất cả sản phẩm" });
    }
  }, [categoryId, currentPage, sortBy, sortOrder]);

  return (
    <section className="section-content padding-y">
      <div className="container">
        <div className="card mb-3">
          <div className="card-body">
            {/* Breadcrumb navigation */}
            <div className="row">
              <div className="col-md-2">Bạn đang ở đây: </div>
              <nav className="col-md-8">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/ListingGrid">Trang chủ</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={`/ListingGrid?categoryId=${categoryId}`}>
                      {categories?.categoryName}
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
            <hr />
            {/* Filters section */}
            <div className="row">
              <div className="col-md-2">Lọc theo</div>
              <div className="col-md-10">{/* Filter options... */}</div>
            </div>
          </div>
        </div>
        <header className="mb-3">
          <div className="form-inline">
            <strong className="mr-md-auto">
              Kết quả tìm kiếm: {totalElements} sản phẩm
            </strong>
            <select className="form-control" onChange={handleSortChange}>
              <option value="Sản phẩm mới nhất">Sản phẩm mới nhất</option>
              <option value="Sản phẩm cũ">Sản phẩm cũ</option>
              <option value="Giảm sốc nhất">Giảm sốc nhất</option>
              <option value="Rẻ nhất">Rẻ nhất</option>
            </select>
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
        {/* Product grid */}
        <div className="row">
          {!loading &&
            products.length > 0 &&
            products.map((row) => (
              <div
                className={`col-md-${viewMode === "grid" ? "3" : "12"}`} // Thay đổi kích thước cột
                key={row.productId}
              >
                <figure className={`card card-product-${viewMode}`}>
                  {" "}
                  {/* Thêm class cho chế độ list */}
                  <div className="img-wrap">
                    <span className="badge badge-danger"> MỚI </span>
                    <img
                      src={`http://localhost:8080/api/public/products/image/${row.image}`}
                      alt={row.productName}
                    />
                  </div>
                  <figcaption className="info-wrap">
                    <Link
                      to={`/Detail?productId=${row.productId}`}
                      className="title mb-2"
                    >
                      {row.productName}
                    </Link>
                    <div className="price-wrap">
                      <span className="price">
                        {formatPrice(row.specialPrice)}
                      </span>
                      <small className="text-muted">/mỗi sản phẩm</small>
                    </div>
                    {viewMode === "list" && ( // Hiển thị thêm thông tin trong chế độ list
                      <>
                        <p className="mb-2">
                          {row.quantity} Cái{" "}
                          <small className="text-muted">
                            (Số lượng tối thiểu)
                          </small>
                        </p>
                        <p className="text-muted">
                          {row.category.categoryName}
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
                      to={`/ListingGrid/contact-supplier/${row.productId}`}
                      className="btn btn-outline-primary"
                    >
                      <i className="fa fa-envelope"></i> Liên hệ nhà cung cấp
                    </Link>
                  </figcaption>
                </figure>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </button>
              </li>
              {renderPageNumbers()}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Trang sau
                </button>
              </li>
            </ul>
          </nav>
        )}

        <div className="box text-center">
          <p>Có thấy điều bạn đang tìm kiếm chứ?</p>
          <Link to="/ListingGrid" className="btn btn-light">
            Có
          </Link>
          <Link
            to="/ListingGrid"
            className="btn btn-light"
            style={{ marginLeft: "10px" }}
          >
            Không
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SectionContent;
