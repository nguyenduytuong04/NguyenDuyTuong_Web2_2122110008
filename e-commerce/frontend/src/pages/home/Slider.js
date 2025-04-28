import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GET_ALL } from "../../api/apiService";

import slide1 from "../../assets/images/banners/slide1.jpg";
import slide2 from "../../assets/images/banners/slide2.jpg";
import slide3 from "../../assets/images/banners/slide3.jpg";

import item1 from "../../assets/images/items/iphone1.jpg";
import item2 from "../../assets/images/items/iphone2.jpg";
import item3 from "../../assets/images/items/iphone.png";

const Slider = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const defaultProducts = [
    { img: item1, categoryName: "Men clothing", categoryId: 1 },
    { img: item2, categoryName: "Winter clothing", categoryId: 2 },
    { img: item3, categoryName: "Home inventory", categoryId: 3 },
  ];

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 3,
      sortBy: "categoryId",
      sortOrder: "asc",
    };

    GET_ALL("public/categories", params)
      .then((res) => {
        setCategories(res.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy category:", err);
        setCategories(defaultProducts);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section-main padding-y bg-light">
      <main className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-lg-8">
              <div
                id="carouselBanner"
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner rounded-3 overflow-hidden">
                  {[slide1, slide2, slide3].map((slide, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <img
                        src={slide}
                        className="d-block w-100"
                        alt={`Slide ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselBanner"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselBanner"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon"></span>
                </button></div>
            </div>

            <div className="col-lg-4 d-none d-lg-block">
              <aside className="bg-white p-3 rounded shadow-sm">
                <h6 className="bg-primary text-white text-center py-2 rounded">
                  Popular Category
                </h6>
                {loading ? (
                  <p className="text-center mt-3">Loading...</p>
                ) : (
                  categories.map((cat, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center border-bottom py-2 hover-shadow"
                    >
                      <img
                        src={
                          defaultProducts[index % defaultProducts.length].img
                        }
                        alt={cat.categoryName}
                        className="me-3 rounded"
                        style={{ height: 60, width: 60, objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="mb-1">{cat.categoryName}</h6>
                        <a
                          href={`ListingGrid?categoryId=${cat.categoryId}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Source now
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </aside>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Slider;