import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("https://mobile-barbershop-backend.onrender.com", {
  auth: {
    token: localStorage.getItem("jwt_token"), // Récupérer le token JWT de l'utilisateur
  },
});

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message_from_admin", (data) => {
      // Ajouter le message à la liste des messages reçus
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "admin", message: data.message },
      ]);
    });

    socket.on("receive_message_from_client", (data) => {
      // Ajouter le message du client à la liste des messages reçus
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "client", message: data.message },
      ]);
    });

    return () => {
      socket.off("receive_message_from_admin");
      socket.off("receive_message_from_client");
    };
  }, []);

  return (
    <div>
      <h2>Chat Administrateur</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <strong>{msg.sender}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écrire un message"
      />
      <button>Envoyer</button>
    </div>
  );
}

export default AdminChat;
