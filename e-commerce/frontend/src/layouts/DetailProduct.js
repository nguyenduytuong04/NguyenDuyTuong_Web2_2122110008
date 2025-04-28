import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { GET_ID, GET_ALL } from "../api/apiService";
import AddToCart from "../components/AddToCart"; // Import AddToCart component
import "../assets/css/Header.css";
const DetailProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get("productId");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    GET_ID("public/products", productId)
      .then((response) => {
        setProduct(response);
        fetchRelatedProducts(response.category.categoryId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch product details:", error);
        setLoading(false);
      });
  }, [productId]);

  const fetchRelatedProducts = (categoryId) => {
    GET_ALL(`public/categories/${categoryId}/products`, {
      pageNumber: 0,
      pageSize: 4,
      sortBy: "productId",
      sortOrder: "asc",
    })
      .then((response) => {
        const filteredProducts = response.content.filter(
          (p) => p.productId !== parseInt(productId)
        );
        setRelatedProducts(filteredProducts);
        console.log(response);
      })
      .catch((error) => {
        console.error("Failed to fetch related products:", error);
      });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center py-5">
        <h2>Không tìm thấy sản phẩm</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="py-3 bg-light">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/Home">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/ListingGrid">Sản phẩm</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.productName}
            </li>
          </ol>
        </div>
      </section>

      <section className="section-content bg-white padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-6">
              <div className="card">
                <article className="gallery-wrap">
                  <div className="img-big-wrap">
                    <div>
                      <a href="#">
                        <img
                          src={`http://localhost:8080/api/public/products/image/${product.image}`}
                          alt={product.productName}
                        />
                      </a>
                    </div>
                  </div>
                  <div className="thumbs-wrap">
                    <a href="#" className="item-thumb">
                      <img
                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                        alt={product.productName}
                      />
                    </a>
                    <a href="#" className="item-thumb">
                      <img
                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                        alt={product.productName}
                      />
                    </a>
                    <a href="#" className="item-thumb">
                      <img
                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                        alt={product.productName}
                      />
                    </a>
                    <a href="#" className="item-thumb">
                      <img
                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                        alt={product.productName}
                      />
                    </a>
                  </div>
                </article>
              </div>
            </aside>
            <main className="col-md-6">
              <article className="product-info-aside">
                <h2 className="title mt-3">{product.productName}</h2>

                <div className="rating-wrap my-3">
                  <ul className="rating-stars">
                    <li style={{ width: "80%" }} className="stars-active">
                      <i className="fa fa-star"></i>{" "}
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>{" "}
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                    </li>
                    <li>
                      <i className="fa fa-star"></i>{" "}
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>{" "}
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                    </li>
                  </ul>
                  <small className="label-rating text-muted">
                    132 đánh giá
                  </small>
                  <small className="label-rating text-success">
                    <i className="fa fa-clipboard-check"></i> 154 đơn hàng
                  </small>
                </div>

                <div className="mb-3">
                  <var className="price h4">
                    {formatPrice(product.specialPrice)}
                  </var>
                  <span className="text-muted">
                    {formatPrice(product.price)} incl_VAT
                  </span>
                </div>

                <p>{product.description}</p>

                <dl className="row">
                  <dt className="col-sm-3">Mã sản phẩm</dt>
                  <dd className="col-sm-9">#{product.productId}</dd>

                  <dt className="col-sm-3">Danh mục</dt>
                  <dd className="col-sm-9">{product.category.categoryName}</dd>

                  <dt className="col-sm-3">Số lượng có sẵn</dt>
                  <dd className="col-sm-9">{product.quantity} cái</dd>
                </dl>

                <AddToCart productId={product.productId} />

                <a href="#" className="btn btn-light ml-3">
                  <i className="fas fa-envelope"></i>{" "}
                  <span className="text">Liên hệ với nhà cung cấp</span>
                </a>
              </article>
            </main>
          </div>

          <div className="row">
            <div className="col-md-8">
              <h5 className="title-description">Thông số kỹ thuật</h5>
              <p>{product.description}</p>
              <ul className="list-check">
                <li>Material: Stainless steel</li>
                <li>Weight: 82kg</li>
                <li>built-in drip tray</li>
                <li>Open base for pots and pans</li>
                <li>On request available in propane execution</li>
              </ul>

              <h5 className="title-description">Thông tin chi tiết</h5>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th colSpan="2">Thông tin cơ bản</th>
                  </tr>
                  <tr>
                    <td>Thương hiệu</td>
                    <td>{product.brand || "Chưa có thông tin"}</td>
                  </tr>
                  <tr>
                    <td>Xuất xứ</td>
                    <td>{product.origin || "Chưa có thông tin"}</td>
                  </tr>
                  <tr>
                    <td>Bảo hành</td>
                    <td>{product.warranty || "12 tháng"}</td>
                  </tr>

                  <tr>
                    <th colSpan="2">Kích thước</th>
                  </tr>
                  <tr>
                    <td>Chiều rộng</td>
                    <td>500mm</td>
                  </tr>
                  <tr>
                    <td>Chiều sâu</td>
                    <td>400mm</td>
                  </tr>
                  <tr>
                    <td>Chiều cao</td>
                    <td>700mm</td>
                  </tr>

                  <tr>
                    <th colSpan="2">Vật liệu</th>
                  </tr>
                  <tr>
                    <td>Phần ngoài</td>
                    <td>Stainless steel</td>
                  </tr>
                  <tr>
                    <td>Phần trong</td>
                    <td>Iron</td>
                  </tr>

                  <tr>
                    <th colSpan="2">Kết nối</th>
                  </tr>
                  <tr>
                    <td>Loại năng lượng</td>
                    <td>Gas</td>
                  </tr>
                  <tr>
                    <td>Công suất kết nối</td>
                    <td>15 Kw</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <aside className="col-md-4">
              <div className="box">
                <h5 className="title-description">Tệp tin</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>

                {/* <h5 className="title-description">Video</h5>
                <article className="media mb-3">
                  <a href="#">
                    <img
                      className="img-sm mr-3"
                      src="images/posts/3.jpg"
                      alt=""
                    />
                  </a>
                  <div className="media-body">
                    <h6 className="mt-0">
                      <a href="#">Cách sử dụng sản phẩm</a>
                    </h6>
                    <p className="mb-2">
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel
                      metus scelerisque ante sollicitudin
                    </p>
                  </div>
                </article>

                <article className="media mb-3">
                  <a href="#">
                    <img
                      className="img-sm mr-3"
                      src="images/posts/2.jpg"
                      alt=""
                    />
                  </a>
                  <div className="media-body">
                    <h6 className="mt-0">
                      <a href="#">Mẹo và thủ thuật mới</a>
                    </h6>
                    <p className="mb-2">
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel
                      metus scelerisque ante sollicitudin
                    </p>
                  </div>
                </article>

                <article className="media mb-3">
                  <a href="#">
                    <img
                      className="img-sm mr-3"
                      src="images/posts/1.jpg"
                      alt=""
                    />
                  </a>
                  <div className="media-body">
                    <h6 className="mt-0">
                      <a href="#">Mẹo và thủ thuật mới</a>
                    </h6>
                    <p className="mb-2">
                      Cras sit amet nibh libero, in gravida nulla. Nulla vel
                      metus scelerisque ante sollicitudin
                    </p>
                  </div>
                </article> */}
                <section className="container mt-10">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                    Sản phẩm liên quan
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
                      >
                        <Link to={`/detail?productId=${item.productId}`}>
                          <img
                            src={`http://localhost:8080/api/public/products/image/${item.image}`}
                            className="card-img-top related-products"
                            alt={item.productName}
                          />
                        </Link>
                        <div className="p-4">
                          <h5 className="text-lg font-medium text-gray-900 truncate">
                            {item.productName}
                          </h5>
                          <p className="text-red-500 font-semibold mt-1">
                            {formatPrice(item.specialPrice)}
                          </p>
                          <Link
                            to={`/detail?productId=${item.productId}`}
                            className="block text-center mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="padding-y-lg bg-light border-top">
        <div className="container">
          <p className="pb-2 text-center">
            Cập nhật thông tin sản phẩm mới nhất và tin tức ngành hàng trực tiếp
            đến hộp thư của bạn
          </p>
          <div className="row justify-content-md-center">
            <div className="col-lg-4 col-sm-6">
              <form className="form-row">
                <div className="col-8">
                  <input
                    className="form-control"
                    placeholder="Địa chỉ email của bạn"
                    type="email"
                  />
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-block btn-warning">
                    <i className="fa fa-envelope"></i> Đăng ký
                  </button>
                </div>
              </form>
              <small className="form-text">
                Chúng tôi sẽ không chia sẻ địa chỉ email của bạn với bên thứ ba.
              </small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailProduct;
