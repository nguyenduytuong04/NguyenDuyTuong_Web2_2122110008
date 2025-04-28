import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      buildingName: '',
      city: '',
      state: '',
      country: 'Vietnam',
      pincode: ''
    }
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        roles: [{ 
          roleId: 102,
          roleName: 'USER'
        }],
        cart: {
          totalPrice: 0,
          products: []
        }
      };
      delete userData.confirmPassword;

      const response = await axios.post('http://localhost:8080/api/register', userData);
      
      if (response.data) {
        // Chuyển hướng đến trang đăng nhập với thông báo thành công
        navigate('/Login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập.' 
          } 
        });
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      if (err.response?.data?.mesage?.includes('User already exists')) {
        setError('Email đã được sử dụng. Vui lòng sử dụng email khác.');
      } else {
        setError(err.response?.data?.mesage || err.response?.data?.error || 'Đã xảy ra lỗi khi đăng ký');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-content padding-y">
      <div className="card mx-auto" style={{ maxWidth: '520px', marginTop: '40px' }}>
        <article className="card-body">
          <header className="mb-4"><h4 className="card-title">Đăng ký tài khoản</h4></header>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col form-group">
                <label>Họ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Số điện thoại</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input 
                type="text" 
                className="form-control" 
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="Số nhà, tên đường"
                required
              />
            </div>

            <div className="form-group">
              <label>Tên tòa nhà/Chung cư</label>
              <input 
                type="text" 
                className="form-control" 
                name="address.buildingName"
                value={formData.address.buildingName}
                onChange={handleChange}
                placeholder="Tên tòa nhà hoặc chung cư (nếu có)"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Thành phố</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Tỉnh/Thành phố</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Mã bưu điện</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Quốc gia</label>
                <select 
                  className="form-control"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  required
                >
                  <option value="Vietnam">Việt Nam</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Xác nhận mật khẩu</label>
                <input 
                  type="password" 
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </div>

            <div className="form-group">
              <label className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" required />
                <div className="custom-control-label">
                  Tôi đồng ý với <a href="#">điều khoản và điều kiện</a>
                </div>
              </label>
            </div>
          </form>
        </article>
      </div>
      <p className="text-center mt-4">
        Đã có tài khoản? <Link to="/Login">Đăng nhập</Link>
      </p>
      <br /><br />
    </section>
  );
};

export default UserRegister;