import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '../../../components/ui/box';
import { wakuReadMessages, wakuSendMessage, decodeBufferPayload } from '../chat.utils';
import BlockieIdenticon from '../../../components/ui/identicon/blockieIdenticon';
import { getSelectedAddress } from '../../../selectors';
import TextField from '../../../components/ui/text-field';
import { getAccountPublicKey } from '../crypto';

const ChatConversation = () => {
  const [message, setMessage] = useState('');
  const [wakuMessages, setMessages] = useState([]);
  const selectedAddress = useSelector(getSelectedAddress);
  // TODO use receiver address
  const contactAddress = '0x00000111121321u3194u91431413413411';
  const receiverAddress = '0x00000111121321u3194u91431413413411';
  const contactEns = 'contact.eth';

  const receiveMessages = async (currentWakuMessages) => {
    const messages = (await wakuReadMessages(`metamask/${selectedAddress}`)).result;
    if (messages && messages.length > 0) {
      setMessages([
        ...currentWakuMessages,
        ...messages.map((m) => ({
          ...m,
          sender: contactEns,
        })),
      ]);
    }
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      getAccountPublicKey(selectedAddress)
      receiveMessages(wakuMessages);
    }, 500);

    return () => clearInterval(refreshInterval);
  }, [wakuMessages]);

  const onSubmit = async (inputMessage) => {
    const m = await wakuSendMessage(inputMessage, `metamask/${receiverAddress}`);
    setMessages([
      ...wakuMessages,
      { message: inputMessage, payload: m, timestamp: Date.now() },
    ]);
    setMessage('');
  };

  return (
    <div className="chat__conversation">
      <Box backgroundColor="background-alternative">
        <div className="chat__conversation-contact">
          <div className="chat__conversation-contact-picture">
            <BlockieIdenticon
              borderRadius="9999px"
              address={contactAddress}
              diameter={32}
            />
          </div>
          <div className="chat__conversation-contact-alias">{contactEns}</div>
          <div className="chat__conversation-contact-address">
            {contactAddress} {'   '}
            <a href={`https://etherscan.io/address/${selectedAddress}`}>
              View on Etherscan
            </a>
          </div>
        </div>
        {wakuMessages && wakuMessages.length > 0 && (
          <ul>
            <div className="chat__conversation-thread">
              {wakuMessages.map((msg, index) => (
                <li key={index}>
                  <div className="chat__conversation-thread-message-container">
                    <div className="chat__conversation-thread-picture">
                      <BlockieIdenticon
                        borderRadius="9999px"
                        address={msg.sender ?? selectedAddress}
                        diameter={24}
                      />
                    </div>
                    <div className="chat__conversation-thread-alias">
                      {msg.sender ?? selectedAddress}
                    </div>
                    <div className="chat__conversation-thread-timestamp">
                      {
                        new Date(msg.timestamp)
                          .toLocaleTimeString()
                          .split('(')[0]
                      }
                    </div>
                    <div className="chat__conversation-thread-read-status">
                      &#10004;
                    </div>
                    <div className="chat__conversation-thread-message">
                      {msg.message ?? Buffer.from(msg.payload).toString()}
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        )}
      </Box>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(message);
        }}
      >
        <div className="chat__message-container">
          <TextField
            id="message-input-id"
            data-testid="message-input"
            type="text"
            autoComplete="off"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            fullWidth
            focused
            required
            classes="multiline"
          />
        </div>
      </form>
    </div>
  );
};

ChatConversation.propTypes = {};

export default ChatConversation;
