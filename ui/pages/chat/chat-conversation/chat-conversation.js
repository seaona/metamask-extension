import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  wakuReadMessages,
  wakuSendMessage,
  decodeBufferPayload,
} from '../chat.utils';
import BlockieIdenticon from '../../../components/ui/identicon/blockieIdenticon';
import { getSelectedAddress } from '../../../selectors';
import TextField from '../../../components/ui/text-field';
import { getAccountPublicKey } from '../crypto';

const ChatConversation = ({ senderAddress, senderEns }) => {
  const [message, setMessage] = useState('');
  const [wakuMessages, setMessages] = useState([]);
  const selectedAddress = useSelector(getSelectedAddress);

  const receiveMessages = async (currentWakuMessages) => {
    const messages = (await wakuReadMessages(`metamask/${selectedAddress}`))
      .result;
    if (messages && messages.length > 0) {
      setMessages([
        ...currentWakuMessages,
        ...messages.map((m) => ({
          ...m,
        })),
      ]);
    }
  };

  useEffect(() => {
    getAccountPublicKey(selectedAddress);
  });

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      receiveMessages(wakuMessages);
    }, 500);

    return () => clearInterval(refreshInterval);
  }, [wakuMessages]);

  const onSubmit = async (inputMessage) => {
    const m = await wakuSendMessage(inputMessage, `metamask/${senderAddress}`);
    setMessages([
      ...wakuMessages,
      {
        message: inputMessage,
        payload: m,
        timestamp: Date.now(),
        sender: selectedAddress,
      },
    ]);
    setMessage('');
  };

  return (
    <>
      <div className="chat__conversation-contact">
        <div className="chat__conversation-contact-picture">
          <BlockieIdenticon
            borderRadius="9999px"
            address={senderAddress}
            diameter={32}
          />
        </div>
        <div className="chat__conversation-contact-alias">{senderEns}</div>
        <div className="chat__conversation-contact-address">
          {senderAddress} {'   '}
          <a href={`https://etherscan.io/address/${selectedAddress}`}>
            View on Etherscan
          </a>
        </div>
      </div>
      <div className="chat__conversation-thread">
        {wakuMessages && wakuMessages.length > 0 && (
          <ul>
            {wakuMessages.map((msg, index) => (
              <li key={index}>
                <div className="chat__conversation-thread-message-container">
                  <div className="chat__conversation-thread-picture">
                    <BlockieIdenticon
                      borderRadius="9999px"
                      address={senderEns ?? senderAddress}
                      diameter={24}
                    />
                  </div>
                  <div className="chat__conversation-thread-alias">
                    {msg.sender ?? senderEns ?? senderAddress}
                  </div>
                  <div className="chat__conversation-thread-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString().split('(')[0]}
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
          </ul>
        )}
      </div>

      <div className="chat__conversation-input">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(message);
          }}
        >
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
            className="multiline"
          />
        </form>
      </div>
    </>
  );
};

ChatConversation.propTypes = {
  senderEns: PropTypes.string,
  senderAddress: PropTypes.string.isRequired,
};

export default ChatConversation;
