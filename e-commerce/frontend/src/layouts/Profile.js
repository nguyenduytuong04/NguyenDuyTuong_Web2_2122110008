import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GET_ID, GET_ID_NEW } from '../api/apiService';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          const email = decodedToken.email;
          
          const response = await GET_ID(`public/users/email/${encodeURIComponent(email)}`);
          console.log('Thông tin người dùng:', response);
          setUserInfo(response);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchRecentOrder = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;

        const response = await GET_ID_NEW(`public/users/${encodeURIComponent(email)}/orders`);
        if (response && Array.isArray(response) && response.length > 0) {
          // Sắp xếp theo ngày mới nhất và lấy đơn hàng đầu tiên
          const sortedOrders = response.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          setRecentOrder(sortedOrders[0]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng gần đây:', error);
      }
    };

    fetchRecentOrder();
  }, []);

  // Hàm format địa chỉ
  const formatAddress = (address) => {
    if (!address) return 'Chưa cập nhật địa chỉ';
    return `${address.street || ''}, ${address.buildingName || ''}, ${address.city || ''}, ${address.state || ''}, ${address.country || ''} ${address.pincode || ''}`.replace(/,\s+,/g, ',').replace(/^,\s+/, '').replace(/,\s+$/, '');
  };

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Tài khoản của tôi</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-3">
              <nav className="list-group">
                <Link className="list-group-item active" to="/profile">Tổng quan tài khoản</Link>
                <Link className="list-group-item" to="/profile/address">Địa chỉ của tôi</Link>
                <Link className="list-group-item" to="/profile/orders">Đơn hàng của tôi</Link>
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
              <article className="card mb-3">
                <div className="card-body">
                  {userInfo && (
                    <figure className="icontext">
                      <div className="icon">
                        <img className="rounded-circle img-sm border" src={userInfo.image || "http://localhost:8080/api/public/products/image/2.jpg"} alt="Ảnh đại diện" />
                      </div>
                      <div className="text">
                        <strong>{userInfo.firstName} {userInfo.lastName}</strong>
                        <p className="mb-2">{userInfo.email}</p>
                        <Link to="/profile/settings" className="btn btn-light btn-sm">Chỉnh sửa</Link>
                      </div>
                    </figure>
                  )}
                  <hr />
                  {userInfo && (
                    <p>
                      <i className="fa fa-map-marker text-muted"></i> &nbsp; {formatAddress(userInfo.address)} <br />
                      <i className="fa fa-phone text-muted"></i> &nbsp; {userInfo.mobileNumber || 'Chưa cập nhật số điện thoại'} <br />
                      <i className="fa fa-envelope text-muted"></i> &nbsp; {userInfo.email}<br />
                      <i className="fa fa-calendar text-muted"></i> &nbsp; Tham gia {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  )}
                </div>
              </article>

              <article className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Đơn hàng gần đây</h5>
                  <div className="row">
                    {recentOrder ? (
                      <>
                        <div className="col-md-12">
                          <p>
                            <strong>Mã đơn hàng:</strong> {recentOrder.orderId}<br />
                            <strong>Ngày đặt:</strong> {new Date(recentOrder.orderDate).toLocaleDateString('vi-VN')}<br />
                            <strong>Trạng thái:</strong>{' '}
                            <span className={`badge badge-${
                              recentOrder.orderStatus === 'PENDING' ? 'warning' :
                              recentOrder.orderStatus === 'CONFIRMED' ? 'info' :
                              recentOrder.orderStatus === 'SHIPPING' ? 'primary' :
                              recentOrder.orderStatus === 'DELIVERED' ? 'success' :
                              recentOrder.orderStatus === 'CANCELLED' ? 'danger' : 'secondary'
                            }`}>
                              {recentOrder.orderStatus === 'PENDING' ? 'Đang xử lý' :
                               recentOrder.orderStatus === 'CONFIRMED' ? 'Đã xác nhận' :
                               recentOrder.orderStatus === 'SHIPPING' ? 'Đang giao hàng' :
                               recentOrder.orderStatus === 'DELIVERED' ? 'Đã giao hàng' :
                               recentOrder.orderStatus === 'CANCELLED' ? 'Đã hủy' : recentOrder.orderStatus}
                            </span>
                          </p>
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <tbody>
                                {recentOrder.orderItems.map((item) => (
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
                          <div className="text-right mt-3">
                            <strong>Tổng tiền: {recentOrder.totalAmount?.toLocaleString('vi-VN')}đ</strong>
                            <br />
                            <Link to="/profile/orders" className="btn btn-outline-primary btn-sm mt-2">
                              Xem tất cả đơn hàng
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center w-100">Chưa có đơn hàng nào</p>
                    )}
                  </div>
                </div>
              </article>

              <article className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title mb-4">Phương thức thanh toán</h5>
                  <p className="text-center w-100">Chưa có phương thức thanh toán nào</p>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
