import React, { useState } from 'react';
import { LOGIN } from '../api/apiService';
import { useNavigate, Link } from 'react-router-dom';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            const response = await LOGIN({ email, password });
            console.log('Login response:', response);
            
            if (response && response['jwt-token']) {
                // Store the token
                localStorage.setItem('authToken', response['jwt-token']);
                
                // Store email if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Navigate to home page
                navigate('/', { replace: true });
            } else {
                setError('Invalid login response from server');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: '84vh' }}>
            <div className="card mx-auto" style={{ maxWidth: '380px', marginTop: '100px' }}>
                <div className="card-body">
                    <h4 className="card-title mb-4">Sign in</h4>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <button type="button" className="btn btn-facebook btn-block mb-2">
                            <i className="fab fa-facebook-f"></i> &nbsp; Sign in with Facebook
                        </button>
                        <button type="button" className="btn btn-google btn-block mb-4">
                            <i className="fab fa-google"></i> &nbsp; Sign in with Google
                        </button>
                        <div className="form-group">
                            <input 
                                name="email" 
                                className="form-control" 
                                placeholder="Email" 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                name="password" 
                                className="form-control" 
                                placeholder="Password" 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <Link to="/forgot-password" className="float-right">Forgot password?</Link>
                            <label className="float-left custom-control custom-checkbox">
                                <input 
                                    type="checkbox" 
                                    className="custom-control-input"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <div className="custom-control-label"> Remember </div>
                            </label>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block">Login</button>
                        </div>
                    </form>
                </div>
            </div>
            <p className="text-center mt-4">Don't have an account? <Link to="/register">Sign up</Link></p>
        </section>
    );
};

export default UserLogin;