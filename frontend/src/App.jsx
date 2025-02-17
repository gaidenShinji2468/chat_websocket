import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "./assets/styles/App.css";

const socket = io("/");

function App() {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", receiveMessage);
    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  // Ejecutar scroll cuando se actualizan los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const receiveMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      from: "Me",
      message,
      date: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <Container className="chat-container">
      <Row className="chat-header">
        <Col>
          <h1>💬 chat app</h1>
        </Col>
      </Row>
      <Row className="messages-container">
        <Col>
          <ul className="messages-list">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`message-item ${
                  msg.from === "Me" ? "sent" : "received"
                }`}
              >
                <div className="message-content">
                  {msg.from !== "Me" && (
                    <span className="sender">{msg.from}</span>
                  )}
                  <p>{msg.message}</p>
                  <span className="timestamp">
                    {new Date(msg.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </li>
            ))}
            {/* ... mapeo de mensajes */}
            <div ref={messagesEndRef} />
          </ul>
        </Col>
      </Row>
      <Row className="message-input-container">
        <Col>
          <Form onSubmit={handleSubmit} className="message-form">
            <div className="input-wrapper">
              <Form.Control
                className="message-input"
                placeholder="Escribe un mensaje..."
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
