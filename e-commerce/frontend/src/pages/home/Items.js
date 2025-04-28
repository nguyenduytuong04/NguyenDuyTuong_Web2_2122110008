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
import item9 from '../../assets/images/items/9.jpg';

const Items = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy sản phẩm được đề xuất
    const params = {
      pageNumber: 0,
      pageSize: 12,
      sortBy: "productId",
      sortOrder: "desc"
    };

    GET_ALL('public/products', params)
      .then((response) => {
        setProducts(response.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm đề xuất:", error);
        // Nếu API lỗi, dùng dữ liệu mẫu
        setProducts(defaultProducts);
        setLoading(false);
      });
  }, []);

  const defaultProducts = [
    { img: item1, title: 'Just another product name', price: '179.00' ,id:1},
    { img: item2, title: 'Some item name here', price: '280.00' ,id:1 },
    { img: item3, title: 'Great product name here', price: '56.00'  ,id:1},
    { img: item4, title: 'Just another product name', price: '179.00' ,id:1 },
    { img: item5, title: 'Just another product name', price: '179.00' ,id:1 },
    { img: item6, title: 'Some item name here', price: '280.00' ,id:1 },
    { img: item7, title: 'Great product name here', price: '56.00'  ,id:1},
    { img: item9, title: 'Just another product name', price: '179.00' ,id:1 },
    { img: item4, title: 'Just another product name', price: '179.00'  ,id:1},
    { img: item5, title: 'Just another product name', price: '179.00' ,id:1 },
    { img: item6, title: 'Some item name here', price: '280.00' ,id:1 },
    { img: item7, title: 'Great product name here', price: '56.00' ,id:1 }
  ];

  const displayProducts = products.length > 0 ? products.map(p => ({
    img: p.image ? `http://localhost:8080/api/public/products/image/${p.image}` : item1,
    title: p.productName,
    price: typeof p.price === 'number' ? p.price.toFixed(2) : p.price.toString(),
    id:p.productId
  })) : defaultProducts;

  return (
    <section className="padding-bottom-sm">
      <header className="section-heading heading-line">
        <h4 className="title-section text-uppercase">Recommended items</h4>
      </header>

      <div className="row row-sm">
        {displayProducts.map((item, index) => (
          <div key={index} className="col-xl-2 col-lg-3 col-md-4 col-6">
            <div className="card card-sm card-product-grid">
              <a href={`/Detail?productId=${item.id}`} className="img-wrap">
                <img src={item.img} alt={item.title} />
              </a>
              <figcaption className="info-wrap">
                <a href={`/Detail?productId=${item.id}`} className="title">{item.title}</a>
                <div className="price mt-1">${item.price}</div>
              </figcaption>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Items;
