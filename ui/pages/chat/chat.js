import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PageContainerHeader } from '../../components/ui/page-container';
import { getSelectedAddress } from '../../selectors';
import { getChatHistory, wakuHealthCheck, wakuSubscribeToSubtopic } from './chat.utils';
import ChatConversation from './chat-conversation';
import ChatHistory from './chat-history';

export default function ChatScreen() {
  // TODO grab address from state: selectedIdentity = this.props
  const selectedAddress = useSelector(getSelectedAddress);
  const senderAddress = '0x00000111121321u3194u91431413413411';
  const senderEns = 'contact.eth';
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
        <ChatHistory history={getChatHistory() ?? []} />
        <ChatConversation senderAddress={senderAddress} senderEns={senderEns} />
      </div>
    </div>
  );
}
