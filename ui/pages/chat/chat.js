import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PageContainerHeader } from '../../components/ui/page-container';
import { getSelectedAddress } from '../../selectors';
import {
  getChatHistory,
  wakuHealthCheck,
  wakuSubscribeToSubtopic,
} from './chat.utils';
import ChatConversation from './chat-conversation';
import ChatHistory from './chat-history';
import { sendAccountPublicKey, handlePublicKeyMessage } from './crypto';

export default function ChatScreen() {
  // TODO grab address from state: selectedIdentity = this.props
  const selectedAddress = useSelector(getSelectedAddress);
  const [senderEns, setSenderEns] = useState('');
  const [senderAddress, setSenderAddress] = useState(
    '0xe1575e413D7A5ba27e40c9B1f8d68083a9805E83',
  );
  const [context, setContext] = useState('Metamask Chats');

  const contentTopic = `metamask/${selectedAddress}`;

  useEffect(() => {
    // Subscribe to the subtopic you want to read messages from
    wakuSubscribeToSubtopic(contentTopic);

    // Broadcast your public key
    setTimeout(function(){
      sendAccountPublicKey(
        selectedAddress,
        `metamask/${senderAddress.toLowerCase()}`,
      );
    }, 10000);

    // Handle recipient public key
    setTimeout(function(){
      handlePublicKeyMessage(contentTopic);
    }, 5000);
    
  }, []);

  return (
    <div className="chat-page-container">
      <PageContainerHeader
        className="chat__header"
        onClose={() => {
          console.log('closed');
        }}
        title="Chats"
        hideClose
      />

      <div className="chat__container">
        <ChatHistory
          history={getChatHistory() ?? []}
          setSenderEns={setSenderEns}
          senderEns={senderEns}
          setSenderAddress={setSenderAddress}
          senderAddress={senderAddress}
          activeContext={context}
          setActiveContext={setContext}
        />
        <div className="chat__divider" />
        {(senderEns || senderAddress) && (
          <ChatConversation
            senderAddress={senderAddress}
            senderEns={senderEns}
          />
        )}
      </div>
    </div>
  );
}
