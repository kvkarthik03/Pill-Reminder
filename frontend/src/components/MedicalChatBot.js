import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/MedicalChatBot.css';

const MedicalChatBot = ({ prescriptions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        type: 'bot',
        content: 'Hello! I can help you understand your medications and general health questions. Remember, I\'m not a replacement for professional medical advice.'
    }]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const MEDICAL_CATEGORIES = {
        MEDICATION: ['medicine', 'drug', 'pill', 'prescription', 'dose'],
        SIDE_EFFECTS: ['side effect', 'reaction', 'adverse'],
        SCHEDULE: ['when', 'time', 'schedule', 'take', 'timing'],
        EMERGENCY: ['emergency', 'urgent', 'severe', 'critical']
    };

    const checkEmergencyContent = (message) => {
        const emergencyTerms = MEDICAL_CATEGORIES.EMERGENCY;
        return emergencyTerms.some(term => message.toLowerCase().includes(term));
    };

    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        setIsLoading(true);
        const userMessage = { type: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            const result = await api.chat(inputMessage, prescriptions, messages.length === 1);

            if (result && result.response) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: result.response
                }]);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'I apologize, but I encountered an error. Please try again or contact support.',
                error: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = (message, index) => (
        <div key={index} className={`chat-message ${message.type}`}>
            <div className="message-content">
                {message.content}
                {message.sources && message.sources.length > 0 && (
                    <div className="message-sources">
                        <small>Sources:</small>
                        <ul>
                            {message.sources.map((source, idx) => (
                                <li key={idx}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className={`medical-chatbot ${isOpen ? 'open' : ''}`}>
            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💊 Medical Assistant'}
            </button>
            
            {isOpen && (
                <div className="chat-container">
                    <div className="chat-header">
                        <h3>Medical Assistant</h3>
                        <small>For informational purposes only</small>
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map((msg, idx) => renderMessage(msg, idx))}
                        {isLoading && <div className="loading-indicator">...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about your medications..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} disabled={isLoading}>
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalChatBot;
