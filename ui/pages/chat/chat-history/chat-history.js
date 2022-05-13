import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Box from '../../../components/ui/box';
import EnsInput from '../add-recipient/ens-input';
import {
  getIsUsingMyAccountForRecipientSearch,
  getRecipient,
  getRecipientUserInput,
  resetRecipientInput,
  updateRecipient,
  updateRecipientUserInput,
} from '../../../ducks/send';
import BlockieIdenticon from '../../../components/ui/identicon/blockieIdenticon';
import { showQrScanner } from '../../../store/actions';
import { shortenAddress } from '../../../helpers/utils/util';

const ChatHistory = ({ history }) => {
  const dispatch = useDispatch();
  const userInput = useSelector(getRecipientUserInput);
  const recipient = useSelector(getRecipient);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );

  return (
    <>
      <div className="chat__history-address-search">
        <EnsInput
          userInput={userInput}
          className=""
          onChange={(address) => dispatch(updateRecipientUserInput(address))}
          onValidAddressTyped={(address) => {
            dispatch(updateRecipient({ address, nickname: '' }));
          }}
          internalSearch={isUsingMyAccountsForRecipientSearch}
          selectedAddress={recipient.address}
          selectedName={recipient.nickname}
          onPaste={(text) => {
            return dispatch(updateRecipient({ address: text, nickname: '' }));
          }}
          onReset={() => dispatch(resetRecipientInput())}
          scanQrCode={() => {
            dispatch(showQrScanner());
          }}
        />
      </div>

      <div className="chat__history-conversation-list">
        <ul>
          {history &&
            history.map(({ context: { name, iconUrl }, conversations }) => (
              <div key={name} className="chat__history-conversation-subgroup">
                <li>
                  <div className="chat__history-conversation-subgroup-title">
                    {name}{' '}
                    {iconUrl ? (
                      <img href={iconUrl} alt={name} />
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
                          className="chat__history-conversation-subgroup-entry"
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
                            {
                              new Date(messages[0]?.timestamp)
                                .toLocaleTimeString('en-US')
                                .split('GMT')[0]
                            }
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
        <div className="chat__history-warning-title">Watch out for scams</div>
        <div className="chat__history-warning-content">
          Learn <a href="">how to avoid scams and phishing</a>.
        </div>
      </div>
    </>
  );
};

ChatHistory.propTypes = {
  history: PropTypes.array,
};

export default ChatHistory;
