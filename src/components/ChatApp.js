import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://api.mrrenaudinbarbershop.com";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [users, setUsers] = useState([]); // for client-admin list
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // example role toggle
  const [callInProgress, setCallInProgress] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [callTarget, setCallTarget] = useState(null);

  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket']
    });

    // On connection, set current user and join room/list
    socketRef.current.on('connect', () => {
      setCurrentUser(socketRef.current.id);
      socketRef.current.emit('join', { userId: socketRef.current.id, isAdmin });
    });

    // Handle incoming chat messages
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle update user list (client-admin interaction)
    socketRef.current.on('user-list', (userList) => {
      setUsers(userList);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Send chat message
  const handleSendMessage = () => {
    const trimmed = inputMessage.trim();
    if (trimmed && socketRef.current) {
      const messageData = {
        user: currentUser,
        text: trimmed,
        timestamp: Date.now()
      };
      socketRef.current.emit('message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage('');
    }
  };

  // WebRTC offer/answer and ICE handling
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleOffer = async (data) => {
      if (!peerRef.current) {
        createPeerConnection();
      }
      setCallTarget(data.from);
      try {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        socket.emit('answer', { answer, to: data.from });
        setCallInProgress(true);
      } catch (error) {
        console.error('Error handling offer: ', error);
      }
    };

    const handleAnswer = async (data) => {
      setCallTarget(data.from);
      try {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallInProgress(true);
      } catch (error) {
        console.error('Error handling answer: ', error);
      }
    };

    const handleICECandidateEvent = (data) => {
      if (peerRef.current) {
        const candidate = new RTCIceCandidate(data.candidate);
        peerRef.current.addIceCandidate(candidate).catch((e) =>
          console.error('Error adding received ICE candidate', e)
        );
      }
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleICECandidateEvent);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleICECandidateEvent);
    };
  }, []);

  // Create WebRTC peer connection and setup event handlers
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    peerRef.current = peer;

    // Add local tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
      });
    }

    // When a remote track is received
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(e => console.error('Remote video play error:', e));
      }
    };

    // When an ICE candidate is gathered, send it to the other peer
    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current && callTarget) {
        socketRef.current.emit('ice-candidate', { 
          candidate: event.candidate, 
          to: callTarget 
        });
      }
    };

    peer.onconnectionstatechange = () => {
      if (
        peerRef.current.connectionState === 'disconnected' ||
        peerRef.current.connectionState === 'failed' ||
        peerRef.current.connectionState === 'closed'
      ) {
        endCall();
      }
    };
  };

  // Start a call (caller side)
  const initiateCall = useCallback(async (targetUser) => {
    try {
      // Request audio/video permissions if not yet obtained
      if (!localStream) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
      // Create peer connection if not exists
      if (!peerRef.current) {
        createPeerConnection();
      }
      // Ensure local tracks are added
      if (peerRef.current && localStream) {
        localStream.getTracks().forEach(track => {
          peerRef.current.addTrack(track, localStream);
        });
      }
      // Store call target
      setCallTarget(targetUser);
      // Create and send offer
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      if (socketRef.current) {
        socketRef.current.emit('offer', { offer, to: targetUser });
      }
      setCallInProgress(true);
    } catch (error) {
      console.error('Error initiating call: ', error);
    }
  }, [localStream]);

  // End the call and clean up
  const endCall = useCallback(() => {
    // Stop all local media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
    // Stop remote tracks
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    // Close peer connection
    if (peerRef.current) {
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.onconnectionstatechange = null;
      peerRef.current.close();
      peerRef.current = null;
    }
    setCallInProgress(false);
  }, [localStream]);

  // Clean up on component unmount (stop media and connection)
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return (
    <div className="chat-app">
      <button onClick={() => setIsAdmin(prev => !prev)}>
        {isAdmin ? 'Switch to Client Mode' : 'Switch to Admin Mode'}
      </button>
      <h2>{isAdmin ? 'Admin Panel' : 'Chat App'}</h2>
      <div className="users">
        {isAdmin ? (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name}
                <button onClick={() => initiateCall(user.id)}>Call</button>
              </li>
            ))}
          </ul>
        ) : (
          <button onClick={() => initiateCall('admin')}>Call Admin</button>
        )}
      </div>
      <div className="video-chat">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '200px' }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: '200px' }}
        />
      </div>
      <div className="chat-window">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.user === currentUser ? 'own' : ''}`}>
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
