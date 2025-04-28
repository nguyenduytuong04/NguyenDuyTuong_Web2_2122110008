import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';

// Import item images for fallback
import item7 from '../../assets/images/items/7.jpg';
import item8 from '../../assets/images/items/8.jpg';
import item9 from '../../assets/images/items/9.jpg';
import item10 from '../../assets/images/items/10.jpg';
import item11 from '../../assets/images/items/11.jpg';
import item12 from '../../assets/images/items/12.jpg';
import item1 from '../../assets/images/items/1.jpg';
import item2 from '../../assets/images/items/2.jpg';
import item14 from '../../assets/images/items/14.png';

const Electronics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy sản phẩm thuộc danh mục điện tử
    const params = {
      pageNumber: 0,
      pageSize: 8,
      sortBy: "productId",
      sortOrder: "desc"
    };

    // Giả sử categoryId cho Electronics là 2
    GET_ALL('public/categories/2/products', params)
      .then((response) => {
        setProducts(response.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm điện tử:", error);
        // Nếu API lỗi, dùng dữ liệu mẫu
        setProducts(defaultProducts);
        setLoading(false);
      });
  }, []);

  const defaultProducts = [
    {
      title: 'Well made electronic stuff collection',
      img: item7,
      location: 'Tokyo, Japan'
      ,id:1
    },
    {
      title: 'Another demo text for item stuff goes here',
      img: item8,
      location: 'Hong Kong, China'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item9,
      location: 'Tashkent, Uzb'
      ,id:1
    },
    {
      title: 'Group of electronic stuff collection',
      img: item10,
      location: 'Guanjou, China'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item11,
      location: 'Guanjou, China'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item12,
      location: 'Guanjou, China'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item1,
      location: 'Guanjou, China'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item2,
      location: 'Guanjou, China'
      ,id:1
    }
  ];

  const displayProducts = products.length > 0 ? products.map(p => ({
    title: p.productName,
    img: p.image ? `http://localhost:8080/api/public/products/image/${p.image}` : item1,
    location: p.origin || 'Việt Nam',
    id:p.productId
  })) : defaultProducts;

  return (
    <section className="padding-bottom">
      <header className="section-heading heading-line">
        <h4 className="title-section text-uppercase">Electronics</h4>
      </header>

      <div className="card card-home-category">
        <div className="row no-gutters">
          <div className="col-md-3">
            <div className="home-category-banner bg-light-orange">
              <h5 className="title">Machinery items for manufacturers</h5>
              <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <a href="ListingGrid?categoryId=2" className="btn btn-outline-primary rounded-pill">Source now</a>
              <img src={item14} className="img-bg" alt="Machinery" />
            </div>
          </div>
          <div className="col-md-9">
            <ul className="row no-gutters bordered-cols">
              {displayProducts.map((product, index) => (
                <li key={index} className="col-6 col-lg-3 col-md-4">
                  <a href={`/Detail?productId=${product.id}`} className="item">
                    <div className="card-body">
                      <h6 className="title">{product.title}</h6>
                      <img className="img-sm float-right" src={product.img} alt={product.title} />
                      <p className="text-muted">
                        <i className="fa fa-map-marker-alt"></i> {product.location}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Electronics;
