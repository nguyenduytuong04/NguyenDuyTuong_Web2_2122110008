import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GET_ID_NEW, POST_NEW } from '../api/apiService';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState({
    email: '',
    orderItems: [],
    orderDate: new Date().toISOString().split('T')[0],
    payment: {
      paymentMethod: 'CASH_ON_DELIVERY'  // Mặc định là thanh toán khi nhận hàng
    },
    totalAmount: 0,
    orderStatus: 'PENDING'
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    paymentMethod: 'CASH_ON_DELIVERY'  // Mặc định là thanh toán khi nhận hàng
  });

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;

      // Lấy thông tin user để có cartId
      const userResponse = await GET_ID_NEW(`public/users/email/${encodeURIComponent(email)}`);
      if (userResponse && userResponse.cart && userResponse.cart.cartId) {
        const cartId = userResponse.cart.cartId;
        setCartId(cartId);

        // Lấy thông tin chi tiết giỏ hàng
        const cartResponse = await GET_ID_NEW(`public/user/${encodeURIComponent(email)}/carts/${cartId}`);
        if (cartResponse) {
          setCartData(cartResponse);
          
          // Cập nhật orderData
          const orderItems = cartResponse.products.map(product => ({
            product: {
              productId: product.productId,
              productName: product.productName,
              category: product.category,
              image: product.image,
              description: product.description,
              quantity: product.quantity,
              price: product.price,
              discount: product.discount,
              specialPrice: product.specialPrice
            },
            quantity: product.cartQuantity,
            discount: product.discount,
            orderedProductPrice: product.price
          }));

          setOrderData(prev => ({
            ...prev,
            email: email,
            orderItems: orderItems,
            totalAmount: cartResponse.totalPrice
          }));

          // Điền sẵn thông tin user
          setFormData(prev => ({
            ...prev,
            firstName: userResponse.firstName || '',
            lastName: userResponse.lastName || '',
            email: userResponse.email || '',
            phone: userResponse.mobileNumber || ''
          }));
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin giỏ hàng:', error);
      alert('Có lỗi xảy ra khi tải thông tin giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!cartId) {
        alert('Không tìm thấy giỏ hàng');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;

      // Cập nhật thông tin đơn hàng cuối cùng
      const finalOrderData = {
        ...orderData,
        payment: {
          paymentMethod: formData.paymentMethod
        },
        shippingAddress: {
          city: formData.city,
          district: formData.district,
          address: formData.address
        }
      };

      // Gọi API đặt hàng
      await POST_NEW(`public/users/${encodeURIComponent(email)}/carts/${cartId}/payments/${formData.paymentMethod}/order`, finalOrderData);

      // Chuyển hướng đến trang thành công
      alert('Đặt hàng thành công!');
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert('Có lỗi xảy ra khi đặt hàng');
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
    <section className="section-content padding-y">
      <div className="container" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleSubmit}>
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Thông tin giao hàng</h4>

              <div className="form-row">
                <div className="col form-group">
                  <label>Họ</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col form-group">
                  <label>Tên</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="col form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </div>
                <div className="col form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Tỉnh/Thành phố</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Quận/Huyện</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ chi tiết</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Phương thức thanh toán</h4>
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="cod">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className="custom-control custom-radio mt-2">
                  <input
                    type="radio"
                    id="banking"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="banking">
                    Chuyển khoản ngân hàng
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Tổng quan đơn hàng</h4>
              <table className="table">
                <tbody>
                  {orderData.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.product.productName} x {item.quantity}
                      </td>
                      <td className="text-right">
                        {(item.orderedProductPrice * item.quantity).toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Tổng thanh toán:</strong></td>
                    <td className="text-right">
                      <strong>
                        {orderData.totalAmount?.toLocaleString('vi-VN')}đ
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Xác nhận đặt hàng
          </button>
        </form>

        <br /><br />
      </div>
    </section>
  );
};

export default Checkout;
