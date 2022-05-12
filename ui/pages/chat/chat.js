import React, { useEffect } from 'react';
import { PageContainerHeader } from '../../components/ui/page-container';
import { wakuHealthCheck, wakuSubscribeToSubtopic } from './chat.utils';
import ChatConversation from './chat-conversation';
import ChatHistory from './chat-history';

export default function ChatScreen() {
  // TODO grab address from state: selectedIdentity = this.props
  const selectedAddress = '0x...';
  const contentTopic = `metamask/${selectedAddress}`;

  useEffect(() => {
    // for each MM address we will filter by the subtopic: metamask/${checksummedAddress}
    wakuSubscribeToSubtopic(contentTopic);
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
        <ChatHistory />
        <ChatConversation />
      </div>
    </div>
  );
}
