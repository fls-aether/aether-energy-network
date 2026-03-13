"use client";

import { useState, useRef, useCallback } from 'react';

export type ConnectionState = 'idle' | 'offering' | 'connecting' | 'connected' | 'error';

export interface GhostMessage {
  id: string;
  sender: 'me' | 'remote';
  text: string;
  timestamp: string;
}

export function useGhostProtocol() {
  const [status, setStatus] = useState<ConnectionState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // STRICT VOLATILE STATE: Never persist to Zustand or localStorage
  const [messages, setMessages] = useState<GhostMessage[]>([]);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  const initConnection = useCallback(() => {
    // Basic Google stun servers to get public IP for ICE
    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };
    const pc = new RTCPeerConnection(config);

    pc.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setStatus('idle');
        setErrorMsg('Peer tunnel collapsed.');
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Peer Connection State:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setStatus('connected');
        setErrorMsg(null);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setStatus('idle');
        setErrorMsg('Uplink severed.');
      }
    };

    return pc;
  }, []);

  const setupDataChannel = useCallback((channel: RTCDataChannel) => {
    channel.onopen = () => {
      setStatus('connected');
      setErrorMsg(null);
    };
    
    channel.onclose = () => {
      setStatus('idle');
    };

    channel.onerror = (error) => {
      console.error('Data Channel Error:', error);
      setErrorMsg('Data channel anomaly detected.');
    };

    channel.onmessage = (event) => {
      const newMsg: GhostMessage = {
        id: `remote-${Date.now()}-${Math.random()}`,
        sender: 'remote',
        text: event.data,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      setMessages(prev => [...prev, newMsg]);
    };

    dataChannel.current = channel;
  }, []);

  // INIT PHASE 1: Generate the Offer
  const generateOffer = useCallback(async (): Promise<string | null> => {
    try {
      setStatus('offering');
      setErrorMsg(null);
      const pc = initConnection();
      peerConnection.current = pc;

      // Initiator creates the channel
      const channel = pc.createDataChannel('ghost-comms');
      setupDataChannel(channel);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete before generating the Base64 token
      return new Promise<string>((resolve) => {
        if (pc.iceGatheringState === 'complete') {
          resolve(btoa(JSON.stringify(pc.localDescription)));
        } else {
          pc.onicecandidate = (event) => {
            if (event.candidate === null) {
              resolve(btoa(JSON.stringify(pc.localDescription)));
            }
          };
        }
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to initialize local sequence.');
      setStatus('error');
      return null;
    }
  }, [initConnection, setupDataChannel]);

  // RESPONDER PHASE 1: Accept the Offer, Generate the Answer
  const acceptOffer = useCallback(async (base64Offer: string): Promise<string | null> => {
    try {
      setStatus('connecting');
      setErrorMsg(null);

      let offerDesc;
      try {
        offerDesc = JSON.parse(atob(base64Offer));
      } catch (e) {
        throw new Error("Invalid Quantum Handshake string detected.");
      }

      const pc = initConnection();
      peerConnection.current = pc;

      pc.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offerDesc));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Wait for ICE gathering
      return new Promise<string>((resolve) => {
        if (pc.iceGatheringState === 'complete') {
          resolve(btoa(JSON.stringify(pc.localDescription)));
        } else {
          pc.onicecandidate = (event) => {
            if (event.candidate === null) {
              resolve(btoa(JSON.stringify(pc.localDescription)));
            }
          };
        }
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Handshake failed.');
      setStatus('error');
      return null;
    }
  }, [initConnection, setupDataChannel]);

  // INIT PHASE 2: Consume the Answer to complete P2P link
  const finalizeConnection = useCallback(async (base64Answer: string) => {
    try {
      if (!peerConnection.current) throw new Error("No active sequence.");

      let answerDesc;
      try {
        answerDesc = JSON.parse(atob(base64Answer));
      } catch (e) {
        throw new Error("Invalid Quantum Handshake string detected.");
      }

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answerDesc));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to lock final phase.');
      setStatus('error');
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (dataChannel.current && dataChannel.current.readyState === 'open') {
      dataChannel.current.send(text);
      const newMsg: GhostMessage = {
        id: `me-${Date.now()}-${Math.random()}`,
        sender: 'me',
        text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      setMessages(prev => [...prev, newMsg]);
    } else {
      setErrorMsg('Channel not open.');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setMessages([]); // PURGE VOLATILE RAM
    setStatus('idle');
    setErrorMsg(null);
  }, []);

  return {
    status,
    messages,
    errorMsg,
    generateOffer,
    acceptOffer,
    finalizeConnection,
    sendMessage,
    disconnect
  };
}
