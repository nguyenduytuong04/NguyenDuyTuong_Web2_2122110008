import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GET_ID_NEW } from '../api/apiService';

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log('Current orders state:', orders);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;

      const response = await GET_ID_NEW(`public/users/${encodeURIComponent(email)}/orders`);
      console.log('Response from API:', response);
      
      if (response) {
        // Kiểm tra nếu response là array-like object
        if (response.length && typeof response === 'object') {
          console.log('Setting orders from array:', response);
          setOrders(Array.from(response));
        } else if (typeof response === 'object' && response.orderId) {
          console.log('Setting single order:', [response]);
          setOrders([response]);
        } else {
          console.log('No valid orders found, setting empty array');
          setOrders([]);
        }
      } else {
        console.log('Response is null or undefined, setting empty array');
        setOrders([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Đơn hàng của tôi</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-3">
              <nav className="list-group">
                <Link className="list-group-item" to="/profile">Tổng quan tài khoản</Link>
                <Link className="list-group-item" to="/profile/address">Địa chỉ của tôi</Link>
                <Link className="list-group-item active" to="/profile/orders">Đơn hàng của tôi</Link>
                <Link className="list-group-item" to="/profile/wishlist">Danh sách yêu thích</Link>
                <Link className="list-group-item" to="/profile/selling">Sản phẩm đang bán</Link>
                <Link className="list-group-item" to="/profile/settings">Cài đặt</Link>
                <Link className="list-group-item" to="/logout" onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    window.location.href = '/logout';
                  }
                }}>Đăng xuất</Link>
              </nav>
            </aside>

            <main className="col-md-9">
              {orders.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center">
                    <p>Bạn chưa có đơn hàng nào.</p>
                    <Link to="/" className="btn btn-primary">Mua sắm ngay</Link>
                  </div>
                </div>
              ) : (
                orders.map((order) => (
                  <article key={order.orderId} className="card mb-4">
                    <header className="card-header">
                      <strong className="d-inline-block mr-3">Mã đơn hàng: {order.orderId}</strong>
                      <span>Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                      <span className="badge badge-pill badge-info float-right">
                        {order.orderStatus === 'PENDING' ? 'Đang xử lý' : 
                         order.orderStatus === 'CONFIRMED' ? 'Đã xác nhận' :
                         order.orderStatus === 'SHIPPING' ? 'Đang giao hàng' :
                         order.orderStatus === 'DELIVERED' ? 'Đã giao hàng' :
                         order.orderStatus === 'CANCELLED' ? 'Đã hủy' : order.orderStatus}
                      </span>
                    </header>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h6 className="text-muted">Thông tin thanh toán</h6>
                          <p>
                            Phương thức: {order.payment.paymentMethod === 'CASH_ON_DELIVERY' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                          </p>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-muted">Tổng tiền</h6>
                          <p className="h3 text-right text-primary">
                            {order.totalAmount?.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>

                      <hr />

                      <div className="table-responsive">
                        <table className="table table-hover">
                          <tbody>
                            {order.orderItems.map((item) => (
                              <tr key={item.orderItemId}>
                                <td width="65">
                                  <img 
                                    src={`http://localhost:8080/api/public/products/image/${item.product.image}`} 
                                    className="img-xs border" 
                                    alt={item.product.productName} 
                                  />
                                </td>
                                <td>
                                  <p className="title mb-0">{item.product.productName}</p>
                                  <var className="price text-muted">
                                    {item.orderedProductPrice?.toLocaleString('vi-VN')}đ x {item.quantity}
                                  </var>
                                </td>
                                <td className="text-right">
                                  <strong>
                                    {(item.orderedProductPrice * item.quantity)?.toLocaleString('vi-VN')}đ
                                  </strong>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileOrders;
