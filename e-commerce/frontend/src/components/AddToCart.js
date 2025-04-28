import React, { useState } from 'react';
import { GET_ID_NEW, POST_NEW } from '../api/apiService';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AddToCart = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;
      
      // Lấy thông tin user để có cartId
      const userResponse = await GET_ID_NEW(`public/users/email/${encodeURIComponent(email)}`);
      if (!userResponse.cart) {
        throw new Error('Không tìm thấy giỏ hàng');
      }

      // Gọi API thêm sản phẩm vào giỏ hàng
      await POST_NEW(`public/carts/${userResponse.cart.cartId}/products/${productId}/quantity/${quantity}`);
      
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-row mt-4">
      <div className="form-group col-md flex-grow-0">
        <div className="input-group mb-3 input-spinner">
          <div className="input-group-prepend">
            <button 
              className="btn btn-light" 
              type="button" 
              onClick={() => handleQuantityChange('decrease')}
              disabled={quantity <= 1}
            >
              −
            </button>
          </div>
          <input 
            type="text" 
            className="form-control text-center" 
            value={quantity}
            readOnly
          />
          <div className="input-group-append">
            <button 
              className="btn btn-light" 
              type="button" 
              onClick={() => handleQuantityChange('increase')}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="form-group col-md">
        <button 
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={loading}
        >
          <i className="fas fa-shopping-cart"></i>
          <span className="text">
            {loading ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
