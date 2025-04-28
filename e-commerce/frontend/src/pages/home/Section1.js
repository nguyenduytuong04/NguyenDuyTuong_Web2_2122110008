import React, { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import starsActive from "../../assets/images/icons/stars-active.svg";
import starsDisable from "../../assets/images/icons/starts-disable.svg";
import { Link } from "react-router-dom";

const cardTextStyle = {
  maxWidth: "80%",
};

const Section1 = ({ categoryName, categoryId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 5,
      sortBy: "productId",
      sortOrder: "asc",
    };

    GET_ALL(`public/categories/${categoryId}/products`, params)
      .then((response) => {
        console.log("Products response:", response);
        if (response && response.content) {
          setProducts(response.content);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
  }, [categoryId]);

  return (
    <section className="padding-bottom">
      <header className="section-heading mb-4">
        <h3 className="title-section">{categoryName}</h3>
      </header>
      <div className="row">
        {products.length > 0 &&
          products.map((row) => (
            <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={row.productId}>
              <div className="card card-product-grid">
                <Link to={`/Detail?productId=${row.productId}`} className="img-wrap">
                  <img
                    src={`http://localhost:8080/api/public/products/image/${row.image}`}
                    alt={row.productName}
                  />
                </Link>
                <figcaption className="info-wrap">
                  <div className="rating-wrap">
                    <ul className="rating-stars mb-1">
                      <li style={{ cardTextStyle }} className="stars-active">
                        <img src={starsActive} alt="" />
                      </li>
                      <li>
                        <img src={starsDisable} alt="" />
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Link to={`/Detail?productId=${row.productId}`} className="title">
                      {row.productName}
                    </Link>
                  </div>
                  <div className="price h5 mt-2">${row.price}</div>
                </figcaption>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Section1;
