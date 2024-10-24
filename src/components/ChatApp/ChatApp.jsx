import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, MicOff, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatApp.css';


const ChatApp = () => {
  const [messages, setMessages] = useState(() => {
    // Initialize messages from localStorage if available
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only send initial greeting if there are no messages
    if (messages.length === 0) {
      handleInitialGreeting();
    }
  }, []);

  // Clean up speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const handleInitialGreeting = async () => {
    try {
      const response = await fetch('http://localhost/chat-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "initial_greeting",
          doc_reference: "physics"
        })
      });

      const data = await response.json();

      const initialMessage = {
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages([initialMessage]);
    } catch (error) {
      console.error('Error fetching initial greeting:', error);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsListening(false);
  };

  // Clear chat history
  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
      handleInitialGreeting(); // Restart with initial greeting
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Stop listening if microphone is active
    if (isListening) {
      stopListening();
    }

    const newUserMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    const currentText = inputText;
    setInputText('');

    try {
      const response = await fetch('http://localhost/chat-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentText,
          doc_reference: "biology"
        })
      });

      const data = await response.json();

      const newBotMessage = {
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reference: data.reference,
        responseTime: data.time
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "Sorry, I couldn't process that request. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Delete to clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
        clearChat();
      }
      // Ctrl/Cmd + M to toggle microphone
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        isListening ? stopListening() : startListening();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening]);

  const renderMessageContent = (message) => {
    if (message.sender === 'bot') {
      return (
        <ReactMarkdown className="markdown-content">
          {message.text}
        </ReactMarkdown>
      );
    }
    return <p>{message.text}</p>;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">Physics Assistant</h1>
        <button onClick={clearChat} className="clear-chat-button">
          <RotateCcw />
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.sender} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-content">
              <img
                src={message.sender === 'user' ? "https://cdn-icons-png.flaticon.com/128/3177/3177440.png" : "https://cdn-icons-png.flaticon.com/128/5292/5292342.png"}
                alt={message.sender}
                className="avatar"
              />
              <div className="message-bubble">
                {renderMessageContent(message)}
                <span className="message-timestamp">
                  {message.timestamp}
                  {message.responseTime && ` • ${message.responseTime.toFixed(3)}s`}
                </span>
                {message.reference && (
                  <span className="message-reference">
                    Reference: {message.reference}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="typing-indicator">
              <span className="dot">●</span>
              <span className="dot">●</span>
              <span className="dot">●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="text-input"
          />
          <button
            onClick={isListening ? stopListening : startListening}
            className={`mic-button ${isListening ? 'listening' : 'not-listening'}`}
            title={`${isListening ? 'Stop listening (Ctrl/Cmd + M)' : 'Start listening (Ctrl/Cmd + M)'}`}
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="send-button"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;