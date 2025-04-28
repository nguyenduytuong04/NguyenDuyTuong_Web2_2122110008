import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Spinner } from 'react-bootstrap';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  // Lấy email người dùng từ token JWT khi component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }
  }, []);

  // Khi email người dùng có sẵn, fetch tin nhắn từ localStorage hoặc API
  useEffect(() => {
    if (userEmail) {
      const savedMessages = localStorage.getItem('messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      setLoading(false);  // Đảm bảo loading là false sau khi tải tin nhắn
    }
  }, [userEmail]);

  // Gửi tin nhắn mới
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          sender: userEmail,
          content: message,
          timestamp: new Date().toISOString(),
        };

        // Cập nhật tin nhắn ngay lập tức vào state và localStorage
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, newMessage];
          localStorage.setItem('messages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });

        // Reset ô nhập tin nhắn sau khi gửi
        setMessage('');

        // Gửi tin nhắn tự động từ Shop
        setTimeout(() => {
          const autoReplyMessage1 = {
            sender: 'Shop',
            content: 'Shop xin chào! Có thể tôi giúp gì cho bạn?',
            timestamp: new Date().toISOString(),
          };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, autoReplyMessage1];
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
            return updatedMessages;
          });

          // Xóa tin nhắn của Shop sau 10 giây
          setTimeout(() => {
            setMessages((prevMessages) => {
              const updatedMessages = prevMessages.filter((msg) => msg.timestamp !== autoReplyMessage1.timestamp);
              localStorage.setItem('messages', JSON.stringify(updatedMessages));
              return updatedMessages;
            });
          }, 10000); // Xóa tin nhắn sau 10 giây

          // Tiếp tục gửi tin nhắn tự động sau 2 giây
          setTimeout(() => {
            const autoReplyMessage2 = {
              sender: 'Shop',
              content: 'Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại hỏi tôi!',
              timestamp: new Date().toISOString(),
            };

            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, autoReplyMessage2];
              localStorage.setItem('messages', JSON.stringify(updatedMessages));
              return updatedMessages;
            });

            // Xóa tin nhắn thứ 2 của Shop sau 10 giây
            setTimeout(() => {
              setMessages((prevMessages) => {
                const updatedMessages = prevMessages.filter((msg) => msg.timestamp !== autoReplyMessage2.timestamp);
                localStorage.setItem('messages', JSON.stringify(updatedMessages));
                return updatedMessages;
              });
            }, 10000); // Xóa tin nhắn sau 10 giây
          }, 2000);
        }, 1000);
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
      }
    }
  };

  // Xóa tin nhắn
  const handleDeleteMessage = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  // Hiển thị loading spinner khi đang tải tin nhắn
  if (loading) {
    return (
      <div className="loading" style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spinner animation="border" variant="primary" />
        <p>Đang tải tin nhắn...</p>
      </div>
    );
  }

  return (
    <div className="messages-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <div className="message-list" style={{ marginBottom: '20px', maxHeight: '400px', overflowY: 'scroll', borderBottom: '1px solid #ccc' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === userEmail ? 'sent' : 'received'}`} style={{ marginBottom: '10px', display: 'flex', justifyContent: msg.sender === userEmail ? 'flex-end' : 'flex-start' }}>
              <div className="message-content" style={{ backgroundColor: msg.sender === userEmail ? '#007bff' : '#f1f1f1', color: msg.sender === userEmail ? '#fff' : '#000', padding: '10px', borderRadius: '20px', maxWidth: '80%', margin: '5px 0' }}>
                <p>{msg.content}</p>
                <small style={{ fontSize: '0.75rem', color: '#888' }}>{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
              {msg.sender === userEmail && (
                <button
                  onClick={() => handleDeleteMessage(index)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    marginTop: '5px',
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Chưa có tin nhắn nào.</p>
        )}
      </div>

      <div className="message-input" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: '1', padding: '12px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px', fontSize: '16px' }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '20px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Messages;
