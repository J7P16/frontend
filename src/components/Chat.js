import React, { useState } from 'react';
import axios from 'axios';

//const Chat = () => {
    //const [message, setMessage] = useState('');
    //const [chat, setChat] = useState([]);

    //const sendMessage = async () => {
        //if (message.trim()) {
            //const userMessage = { user: 'You', text: message };
            //setMessage(''); // Clear input field immediately

            //try {
                //const response = await axios.post('http://localhost:5000/api/chat', { message });
                //const aiMessage = { user: 'AI', text: response.data.reply };

                // Append both messages at once
                //setChat(prevChat => [...prevChat, userMessage, aiMessage]);
            //} catch (error) {
                //console.error('Error sending message:', error);
            //}
        //}
    //};


    //return (
        //<div>
            //<div>
                //</div></div>{chat.map((msg, index) => (
                    //<p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
                //))}
            //</div>
            //</div><input
              //type="text"
              //value={message}
              //onChange={(e) => setMessage(e.target.value)}
              //placeholder="Type a message"
            ///>
            //<button onClick={sendMessage}>Send</button>
        //</div>
    //);
//};



const Chat = () => {
    const [message, setMessage] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const sendMessage = async () => {
        if (message.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/api/chat', { message });
                const parsed = JSON.parse(response.data.reply); // Parse JSON string
                setAnalysis(parsed);
                setMessage('');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your startup idea"
            />
            <button onClick={sendMessage}>Analyze</button>

            {analysis && (
                <div>
                    <h2>Market Demand</h2>
                    <p><strong>Score:</strong> {analysis.marketDemand.score}</p>
                    <p><strong>Summary:</strong> {analysis.marketDemand.summary}</p>
                    <p><strong>Details:</strong> {analysis.marketDemand.details}</p>

                    <h2>Competitors</h2>
                    {analysis.competitors.map((comp, idx) => (
                        <div key={idx}>
                            <p><strong>Name:</strong> {comp.name}</p>
                            <p><strong>Description:</strong> {comp.description}</p>
                            <p><strong>Popularity:</strong> {comp.popularity}</p>
                            <p><strong>Locations:</strong> {comp.locations}</p>
                            <p><strong>Pricing:</strong> {comp.pricing}</p>
                        </div>
                    ))}

                    <h2>Target Audience</h2>
                    <ul>
                        {analysis.targetAudience.map((aud, idx) => (
                            <li key={idx}>{aud}</li>
                        ))}
                    </ul>

                    <h2>Revenue Models</h2>
                    <ul>
                        {analysis.revenueModels.map((model, idx) => (
                            <li key={idx}>{model}</li>
                        ))}
                    </ul>

                    <h2>MVP Features</h2>
                    {analysis.mvpFeatures.map((feat, idx) => (
                        <div key={idx}>
                            <p><strong>Feature:</strong> {feat.feature}</p>
                            <p><strong>Priority:</strong> {feat.priority}</p>
                            <p><strong>Effort:</strong> {feat.effort}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Chat;