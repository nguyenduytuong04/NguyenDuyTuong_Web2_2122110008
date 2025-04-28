import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GET_ID, PUT_EDIT } from '../api/apiService';
import { jwtDecode } from 'jwt-decode';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;
        
        const response = await GET_ID(`public/users/email/${email}`);
        if (response) {
          setCurrentUser(response);
        } else {
          setError('Không thể lấy thông tin người dùng!');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setError('Có lỗi xảy ra khi lấy thông tin người dùng!');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Không thể lấy thông tin người dùng!');
      return;
    }

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không khớp!');
      return;
    }

    if (formData.newPassword.length < 5) {
      setError('Mật khẩu mới phải có ít nhất 5 ký tự!');
      return;
    }

    try {
      // Gửi cả mật khẩu cũ và mới lên server
      const updateData = {
        ...currentUser,
        oldPassword: formData.currentPassword,  // Mật khẩu cũ
        password: formData.newPassword         // Mật khẩu mới
      };

      const response = await PUT_EDIT(`public/users/${currentUser.userId}`, updateData);
      
      if (response) {
        if (response.error === "Mật khẩu hiện tại không đúng!") {
          setError('Mật khẩu hiện tại không đúng!');
        } else {
          setSuccess('Đổi mật khẩu thành công!');
          // Reset form
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          
          // Chuyển về trang cài đặt sau 2 giây
          setTimeout(() => {
            navigate('/profile/settings');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      if (error.message === "Mật khẩu hiện tại không đúng!") {
        setError('Mật khẩu hiện tại không đúng!');
      } else {
        setError('Mật khẩu hiện tại không đúng!');
      }
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '380px', marginTop: '100px' }}>
      <div className="card-body">
        <h4 className="card-title mb-4">Đổi mật khẩu</h4>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nhập mật khẩu hiện tại" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nhập mật khẩu mới" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <small className="form-text text-muted">
              Mật khẩu phải có ít nhất 5 ký tự
            </small>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nhập lại mật khẩu mới" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block" disabled={!currentUser}>
              Đổi mật khẩu
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          <Link to="/profile/settings" className="btn btn-light">
            <i className="fa fa-arrow-left"></i> Quay lại cài đặt
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
