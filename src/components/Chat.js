import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (message.trim()) {
            const userMessage = { user: 'You', text: message };
            setMessage(''); // Clear input field immediately

            try {
                const response = await axios.post('http://localhost:5000/api/chat', { message });
                const aiMessage = { user: 'AI', text: response.data.reply };

                // Append both messages at once
                setChat(prevChat => [...prevChat, userMessage, aiMessage]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };


    return (
        <div>
            <div>
                {chat.map((msg, index) => (
                    <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
                ))}
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;