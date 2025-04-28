import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GET_ALL, GET_ID_NEW } from "../api/apiService";
import logo from "../assets/images/logo.png";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  ListGroup,
} from "react-bootstrap";
import "../assets/css/Header.css";

function Header() {
  const [categories, setCategories] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0); // Add this line
  const [orderItemCount, setOrderItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const email = jwtDecode(token).email;
      const userResponse = await GET_ID_NEW(
        `public/users/email/${encodeURIComponent(email)}`
      );
      const cartId = userResponse?.cart?.cartId;

      const response = await GET_ID_NEW(
        `public/users/${encodeURIComponent(email)}/orders`
      );
      setOrderItemCount(response.length || 0);

      if (cartId) {
        const cartResponse = await GET_ID_NEW(
          `public/user/${encodeURIComponent(email)}/carts/${cartId}`
        );
        setCartItemCount(cartResponse?.products?.length || 0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };
  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "categoryId",
      sortOrder: "asc",
    };
    GET_ALL("public/categories", params)
      .then((response) => {
        setCategories(response.content);
        console.log("Categories response:", response.content);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
    fetchCart();
  }, [setCartItemCount]);
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      try {
        const params = {
          pageNumber: 0,
          pageSize: 5,
          sortBy: "productId",
          sortOrder: "asc",
          categoryId: 0,
        };
        const response = await GET_ALL(
          `public/products/keyword/${value}`,
          params
        );
        setSuggestions(response.content || []);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 🔗 Chuyển đến trang chi tiết khi chọn sản phẩm
  const handleSelectSuggestion = (productId) => {
    setSearchTerm(""); // Xóa input
    setSuggestions([]); // Ẩn gợi ý
    navigate(`/Detail?productId=${productId}`);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/SearchResults?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Xóa input
      setSuggestions([]); // Ẩn gợi ý
    }
  };

  const handleProfileClick = (e) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      e.preventDefault();
      window.location.href = "/login";
    }
  };

  return (
    <header className="section-header">
      <section className="header-main border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-3 col-md-12">
              <Link to="/Home" className="brand-wrap">
                <img className="logo" src={logo} alt="Brand Logo" />
              </Link>
            </div>
            <div className="col-xl-6 col-lg-5 col-md-6">
              <Form className="search-header position-relative">
                <div className="input-group w-100">
                  <FormControl
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    autoComplete="off"
                  />
                  <Button variant="primary" onClick={handleSearch}>
                    <i className="fa fa-search"></i> Tìm kiếm
                  </Button>
                </div>
                {suggestions.length > 0 && (
                  <ListGroup className="suggestion-list">
                    {suggestions.map((product) => (
                      <ListGroup.Item
                        key={product.productId}
                        action
                        onClick={() =>
                          handleSelectSuggestion(product.productId)
                        }
                      >
                        <img
                          src={`http://localhost:8080/api/public/products/image/${product.image}`} // Đường dẫn ảnh sản phẩm
                          alt={product.productName}
                          className="suggestion-image"
                        />

                        <span className="ml-2">{product.productName}</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="widgets-wrap float-md-right">
                <div className="widget-header mr-3">
                  <Link
                    to="/Profile"
                    className="widget-view"
                    onClick={handleProfileClick}
                  >
                    <div className="icon-area">
                      <i className="fa fa-user"></i>
                    </div>
                    <small className="text"> Tài khoản </small>
                  </Link>
                </div>
                <div className="widget-header mr-3">
                  <Link to="/Messages" className="widget-view">
                    <div className="icon-area">
                      <i className="fa fa-comment-dots"></i>
                      <span className="notify">1</span>
                    </div>
                    <small className="text"> Tin nhắn </small>
                  </Link>
                </div>
                <div className="widget-header mr-3">
                  <Link to="/profile/orders" className="widget-view">
                    <div className="icon-area">
                      <i className="fa fa-store"></i>
                      {orderItemCount > 0 && (
                        <span className="notify">{orderItemCount}</span>
                      )}
                    </div>
                    <small className="text"> Đơn hàng </small>
                  </Link>
                </div>
                <div className="widget-header">
                  <Link to="/Cart" className="widget-view">
                    <div className="icon-area">
                      <i className="fa fa-shopping-cart"></i>
                      {cartItemCount > 0 && (
                        <span className="notify">{cartItemCount}</span>
                      )}
                    </div>
                    <small className="text"> Giỏ hàng </small>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Navbar expand="lg" className="navbar-main border-bottom">
        <div className="container">
          <Navbar.Toggle aria-controls="main_nav" />
          <Navbar.Collapse id="main_nav">
            <Nav>
              <NavDropdown
                title={
                  <span>
                    <i className="fa fa-bars text-muted mr-2"></i> Danh mục sản
                    phẩm
                  </span>
                }
                id="basic-nav-dropdown"
              >
                {categories.map((category) => (
                  <NavDropdown.Item
                    key={category.categoryId}
                    as={Link}
                    to={`/ListingGrid?categoryId=${category.categoryId}`}
                  >
                    {category.categoryName}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/ListingGrid">
                  Tất cả sản phẩm
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/ReadyToShip">
                Sẵn sàng giao
              </Nav.Link>
              <Nav.Link as={Link} to="/TradeShows">
                Hội chợ
              </Nav.Link>
              <Nav.Link as={Link} to="/Services">
                Dịch vụ
              </Nav.Link>
              <Nav.Link as={Link} to="/SellWithUs">
                Bán hàng cùng chúng tôi
              </Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              <NavDropdown title="Tiếng Việt" alignRight>
                <NavDropdown.Item href="#">English</NavDropdown.Item>
                <NavDropdown.Item href="#">Chinese</NavDropdown.Item>
                <NavDropdown.Item href="#">Spanish</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </header>
  );
}

export default Header;
