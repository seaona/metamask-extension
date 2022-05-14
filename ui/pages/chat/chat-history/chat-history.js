import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import BlockieIdenticon from '../../../components/ui/identicon/blockieIdenticon';
import { shortenAddress } from '../../../helpers/utils/util';
import IconPencil from '../../../components/ui/icon/icon-pencil';
import IconButton from '../../../components/ui/icon-button';
import SearchIcon from '../../../components/ui/search-icon';
import { formatTimestamp } from '../chat.utils';

const ChatHistory = ({
  history,
  setSenderAddress,
  setSenderEns,
  senderAddress,
  senderEns,
  activeContext,
  setActiveContext,
}) => {
  const rInput = useRef(null);
  const [recipient, setRecipient] = useState(undefined);

  const onSubmit = () => {
    if (recipient.toLowerCase().includes('.eth')) {
      setSenderEns(recipient);
      setSenderAddress('');
    } else {
      setSenderAddress(recipient);
      setSenderEns('');
    }
    rInput.current.value = '';
  };

  return (
    <>
      <div className="chat__history-address">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(rInput.current.value);
            console.log(recipient);
            onSubmit();
          }}
        >
          <div className="chat__history-address-input">
            <div className="chat__history-address-input-search">
              <div className="chat__history-address-input-search-icon">
                <SearchIcon size={14} color="#535a61" />
              </div>
              <div className="chat__history-address-input-search-field">
                <input
                  ref={rInput}
                  style={{
                    border: 'none',
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}
                  type="text"
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Search contacts or wallet address"
                />
              </div>
              <div className="chat__history-address-input-search-reset">
                {document.activeElement === rInput.current && (
                  <button
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                    }}
                    onClick={() => {
                      rInput.current.value = '';
                    }}
                  >
                    &#x2715;
                  </button>
                )}
              </div>
            </div>

            <IconButton
              Icon={IconPencil}
              onClick={() => rInput.current.focus()}
              className="chat__history-address-input-button"
            />
          </div>
        </form>
      </div>

      <div className="chat__history-conversation-list">
        <ul>
          {history &&
            history.map(({ context, conversations }) => (
              <div
                key={context.name}
                className="chat__history-conversation-subgroup"
              >
                <li>
                  <div className="chat__history-conversation-subgroup-title">
                    {context.name}{' '}
                    {context.iconUrl ? (
                      <img href={context.iconUrl} alt={context.name} />
                    ) : (
                      <img
                        src="./images/logo/metamask-fox.svg"
                        alt="MetaMask Logo"
                        width="16"
                        height="16"
                      />
                    )}
                  </div>

                  {conversations &&
                    conversations.map(({ sender, messages }) => {
                      return (
                        <div
                          key={sender.address}
                          className={`chat__history-conversation-subgroup-entry${
                            activeContext === context.name &&
                            ((sender.ens.length > 0 &&
                              sender.ens.toLowerCase() ===
                                senderEns.toLowerCase()) ||
                              (sender.address.length > 0 &&
                                sender.address.toLowerCase() ===
                                  senderAddress.toLowerCase()))
                              ? ' active'
                              : ''
                          }`}
                          onClick={() => {
                            setActiveContext(context.name);
                            setSenderEns(sender.ens);
                            setSenderAddress(sender.address);
                          }}
                        >
                          <div className="chat__history-entry-picture">
                            <BlockieIdenticon
                              borderRadius="9999px"
                              address={sender.ens ?? sender.address}
                              diameter={24}
                            />
                          </div>
                          <div className="chat__history-entry-sender">
                            <span className="chat__history-entry-sender-ens">
                              {sender.ens}
                            </span>
                            {'  '}
                            <span className="chat__history-entry-sender-address">
                              {shortenAddress(sender.address)}
                            </span>
                          </div>
                          <div
                            className={`chat__history-entry-message${
                              messages[0]?.readTimestamp ? '' : '-unread'
                            }`}
                          >
                            {messages[0]?.message}
                          </div>
                          <div className="chat__history-entry-timestamp">
                            {formatTimestamp(messages[0]?.timestamp)}
                          </div>
                        </div>
                      );
                    })}
                </li>
              </div>
            ))}
        </ul>
      </div>

      <div className="chat__history-warning">
        <div className="chat__history-warning-container">
          <div className="chat__history-warning-title">Watch out for scams</div>
          <div className="chat__history-warning-content">
            Learn <a href="">how to avoid scams and phishing</a>.
          </div>
        </div>
      </div>
    </>
  );
};

ChatHistory.propTypes = {
  history: PropTypes.array,
  setSenderEns: PropTypes.func.isRequired,
  senderEns: PropTypes.string,
  setSenderAddress: PropTypes.func.isRequired,
  senderAddress: PropTypes.string,
  activeContext: PropTypes.string.isRequired,
  setActiveContext: PropTypes.func.isRequired,
};

export default ChatHistory;
