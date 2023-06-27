// ChatContainer.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://deshan-mobile-pc-chat-server.onrender.com'); // Replace with your server's URL

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // Event listener for receiving messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        return updatedMessages.sort(
          (a, b) => new Date(a.time) - new Date(b.time)
        );
      });
    });

    return () => {
      // Clean up the event listener on unmount
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      // Send the message to the server
      const newMessage = {
        messages: messageInput,
        time: new Date(),
        user: "PC"
      };
      socket.emit('message', newMessage);
      setMyMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear the input field
      setMessageInput('');
    }
  };

  const renderMessages = () => {
    const allMessages = [...messages, ...myMessages];
    const sortedMessages = allMessages.sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    );

    return sortedMessages.map((message, index) => (
      <div key={index} style={classHandle(message)}>
        <h2>{message.messages}</h2>
      </div>
    ));
  };

  const classHandle = (message) => {
    if (message.user === "PC") {
      return { textAlign: 'end' };
    } else {
      return { textAlign: 'start' };
    }
  };

  return (
    <div className='container m-5'>
      <div className="messages-container">{renderMessages()}</div>
      <div className="input-container">
        <input
          type="text"
          className='form-control'
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className='btn btn-success' onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatContainer;
