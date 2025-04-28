import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';

// Import item images for fallback
import item1 from '../../assets/images/items/1.jpg';
import item2 from '../../assets/images/items/2.jpg';
import item3 from '../../assets/images/items/3.jpg';
import item4 from '../../assets/images/items/4.jpg';
import item5 from '../../assets/images/items/5.jpg';
import item6 from '../../assets/images/items/6.jpg';
import item7 from '../../assets/images/items/7.jpg';

const Apparel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy sản phẩm thuộc danh mục 
    const params = {
      pageNumber: 0,
      pageSize: 8,
      sortBy: "productId",
      sortOrder: "desc"
    };

    // Giả sử categoryId cho Apparel là 1
    GET_ALL('public/categories/1/products', params)
      .then((response) => {
        setProducts(response.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm :", error);
        // Nếu API lỗi, dùng dữ liệu mẫu
        setProducts(defaultProducts);
        setLoading(false);
      });
  }, []);

  const defaultProducts = [
    {
      title: 'Well made women clothes with trending collection',
      img: item1,
      location: 'Guanjou, China'
      ,id:1
    },
    {
      title: 'Great clothes with trending collection',
      img: item2,
      location: 'Beijing, China'
      ,id:1
    },
    {
      title: 'Demo clothes with sample collection',
      img: item3,
      location: 'Tokyo, Japan'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item4,
      location: 'Tashkent, Uzb'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item5,
      location: 'London, Britain'
      ,id:1
    },
    {
      title: 'Home and kitchen electronic stuff collection',
      img: item6,
      location: 'Guanjou, China'
      ,id:1
    },
    {
      title: 'Well made clothes with trending collection',
      img: item7,
      location: 'Hong Kong, China'
      ,id:1
    },
    {
      title: 'Home and kitchen interior stuff collection',
      img: item6,
      location: 'Guanjou, China'
      ,id:1
    }
  ];

  const displayProducts = products.length > 0 ? products.map(p => ({
    title: p.productName,
    img: p.image ? `http://localhost:8080/api/public/products/image/${p.image}` : item1,
    location: p.origin || 'Việt Nam',
    id:p.productId,
    catid:p.categoryId
  })) : defaultProducts;

  return (
    <section className="padding-bottom">
      <header className="section-heading heading-line">
        <h4 className="title-section text-uppercase">Giày Chính Hãng</h4>
      </header>
      <div className="card card-home-category">
        <div className="row no-gutters">
          <div className="col-md-3">
            <div className="home-category-banner bg-light-orange">
              <h5 className="title">Best trending clothes only for summer</h5>
              <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <a href="ListingGrid?categoryId=1" className="btn btn-outline-primary rounded-pill">Source now</a>
              <img src={item2} className="img-bg" alt="Summer clothes" />
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

export default Apparel;