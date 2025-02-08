import React, { useState, useEffect } from "react";
import Badge from "@mui/material/Badge";
import ChatIcon from "@mui/icons-material/Chat";

const NotificationBadge = ({ socket }) => {
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        // Écoutez les événements de nouveaux messages
        socket.on("newMessageForAdmin", () => {
            setUnreadMessages((prev) => prev + 1);
        });

        socket.on("newMessageForClient", () => {
            setUnreadMessages((prev) => prev + 1);
        });

        return () => {
            socket.off("newMessageForAdmin");
            socket.off("newMessageForClient");
        };
    }, [socket]);

    const handleChatOpen = () => {
        // Réinitialisez le compteur lorsque le chat est ouvert
        setUnreadMessages(0);
    };

    return (
        <Badge badgeContent={unreadMessages} color="error">
            <ChatIcon onClick={handleChatOpen} />
        </Badge>
    );
};

export default NotificationBadge;
