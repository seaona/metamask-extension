import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import {
  wakuReadMessages,
  wakuSendMessage,
  decodeBufferPayload,
  formatTimestamp,
  formatMessages,
} from '../chat.utils';
import BlockieIdenticon from '../../../components/ui/identicon/blockieIdenticon';
import { getSelectedAddress } from '../../../selectors';
import { getAccountPublicKey } from '../crypto';
import Copy from '../../../components/ui/icon/copy-icon.component';

const ChatConversation = ({ senderAddress, senderEns }) => {
  const [message, setMessage] = useState('');
  const textMessage = useRef(null);
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
    const refreshInterval = setInterval(() => {
      receiveMessages(wakuMessages);
    }, 500);

    return () => clearInterval(refreshInterval);
  }, [wakuMessages]);

  const onSubmit = async (inputMessage) => {
    console.log("receiver adress", senderAddress)
    console.log("selected adress", selectedAddress)
    const m = await wakuSendMessage(
      inputMessage,
      `metamask/${senderAddress}`,
    );
    setMessages([
      ...wakuMessages,
      {
        message: inputMessage,
        payload: m,
        timestamp: Date.now(),
        sender: selectedAddress,
      },
    ]);
  };

  return (
    <>
      <div className="chat__conversation-contact">
        <div className="chat__conversation-contact-picture">
          <BlockieIdenticon
            borderRadius="9999px"
            address={
              senderAddress || '0x0894081290381038201801331ensneedstoberesolved'
            }
            diameter={32}
          />
        </div>
        <div className="chat__conversation-contact-alias">
          {senderEns || senderAddress}
        </div>
        <div className="chat__conversation-contact-address">
          {senderAddress} {'     '}
          <a href={`https://etherscan.io/address/${selectedAddress}`}>
            <Copy size={11} color="var(--color-primary-default)" /> View on
            Etherscan
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
                      address={
                        senderAddress ??
                        '0x0894081290381038201801331ensneedstoberesolved'
                      }
                      diameter={24}
                    />
                  </div>
                  <div className="chat__conversation-thread-alias">
                    {msg.sender ?? (senderEns || senderAddress)}
                  </div>
                  <div className="chat__conversation-thread-timestamp">
                    {formatTimestamp(msg.timestamp)}
                  </div>
                  <div className="chat__conversation-thread-read-status">
                    &#10004;
                  </div>
                  <div className="chat__conversation-thread-message">
                    {msg.message ?? formatMessages(msg.payload)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="chat__conversation-input">
        <form>
          <div className="chat__conversation-input-container">
            <textarea
              ref={textMessage}
              style={{
                border: 'none',
                flexGrow: 1,
                marginLeft: '4px',
                marginRight: '4px',
                backgroundColor: 'transparent',
                width: 'auto',
                resize: 'none',
              }}
              placeholder="Type message"
              onKeyDown={(e) => {
                if (e.keyCode === 13 && e.shiftKey === false) {
                  e.preventDefault();
                  onSubmit(textMessage.current.value);
                  textMessage.current.value = '';
                }
              }}
            />
            <button
              className="chat__conversation-input-container-button"
              onClick={() => {
                onSubmit(textMessage.current.value);
                textMessage.current.value = '';
              }}
            >
              SEND
            </button>
          </div>
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
