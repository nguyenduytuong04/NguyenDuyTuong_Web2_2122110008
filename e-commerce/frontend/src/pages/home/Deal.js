import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';

// Import item images for fallback
import item1 from '../../assets/images/items/1.jpg';
import item3 from '../../assets/images/items/3.jpg';
import item4 from '../../assets/images/items/4.jpg';
import item5 from '../../assets/images/items/5.jpg';
import item6 from '../../assets/images/items/6.jpg';
import item7 from '../../assets/images/items/7.jpg';

const Deal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy sản phẩm đang giảm giá
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "productId",
      sortOrder: "desc"
    };

    GET_ALL('public/products', params)
      .then((response) => {
        setProducts(response.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm giảm giá:", error);
        // Nếu API lỗi, dùng dữ liệu mẫu
        setProducts([
          { productId: 1, productName: 'Summer clothes', image: item3, discount: 20 },
          { productId: 2, productName: 'Some category', image: item4, discount: 5 },
          { productId: 3, productName: 'Another category', image: item5, discount: 20 },
          { productId: 4, productName: 'Home apparel', image: item6, discount: 15 },
          { productId: 5, productName: 'Smart watches', image: item7, discount: 10 }
        ]);
        setLoading(false);
      });
  }, []);

  const defaultProducts = [
    { productId: 1, productName: 'Summer clothes', image: item3, discount: 20  },
    { productId: 2, productName: 'Some category', image: item4, discount: 5 },
    { productId: 3, productName: 'Another category', image: item5, discount: 20 },
    { productId: 4, productName: 'Home apparel', image: item6, discount: 15 },
    { productId: 5, productName: 'Smart watches', image: item7, discount: 10 }
  ];

  const displayProducts = products.length > 0 ? products.map(p => ({
    img: p.image ? `http://localhost:8080/api/public/products/image/${p.image}` : item1,
    title: p.productName,
    price: typeof p.price === 'number' ? p.price.toFixed(2) : p.price.toString(),
    discount: p.discount || '20%',
    id:p.productId
  })) : defaultProducts;

  return (
    <section className="padding-bottom">
      <div className="card card-deal">
        <div className="row no-gutters items-wrap">
          <div className="col-md col-6">
            <div className="col-heading content-body">
              <header className="section-heading">
                <h3 className="section-title">Deals and offers</h3>
                <p>Hygiene equipments</p>
              </header>
              <div className="timer">
                <div> <span className="num">04</span> <small>Days</small></div>
                <div> <span className="num">12</span> <small>Hours</small></div>
                <div> <span className="num">58</span> <small>Min</small></div>
                <div> <span className="num">02</span> <small>Sec</small></div>
              </div>
            </div>
          </div>
          {displayProducts.map((product) => (
            <div key={product.id} className="col-md col-6">
              <figure className="card-product-grid card-sm">
                <a href={`/Detail?productId=${product.id}`} className="img-wrap">
                  <img src={product.img} alt={product.title} />
                </a>
                <div className="text-wrap p-3">
                  <a href={`/Detail?productId=${product.id}`} className="title">{product.title}</a>
                  <span className="badge badge-danger"> -{product.discount}% </span>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deal;
