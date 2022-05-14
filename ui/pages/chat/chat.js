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
  const [senderEns, setSenderEns] = useState('contact.eth');
  const [senderAddress, setSenderAddress] = useState(
    '0x00000111121321u3194u91431413413411',
  );
  const [context, setContext] = useState('Metamask Chats');

  const contentTopic = `metamask/${selectedAddress}`;

  useEffect(() => {
    // for each MM address we will filter by the subtopic: metamask/${checksummedAddress}
    wakuSubscribeToSubtopic(contentTopic);
    sendAccountPublicKey(
      selectedAddress,
      `metamask/${senderAddress}`,
    );
    handlePublicKeyMessage(contentTopic);
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
