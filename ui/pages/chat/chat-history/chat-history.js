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
import { showQrScanner } from '../../../store/actions';

const ChatHistory = ({ conversations }) => {
  const dispatch = useDispatch();
  const userInput = useSelector(getRecipientUserInput);
  const recipient = useSelector(getRecipient);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );

  return (
    <div className="chat__history">
      <EnsInput
        userInput={userInput}
        className="send__to-row"
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

      <div>Metamask chats</div>

      {conversations && conversations.length > 0 && (
        <Box backgroundColor="background-alternative">
          <ul>
            {conversations.map((conversation) => {
              return (
                <li key={JSON.stringify(conversation)}>
                  <p>{JSON.stringify(conversation)}</p>
                </li>
              );
            })}
          </ul>
        </Box>
      )}
    </div>
  );
};

ChatHistory.propTypes = {
  conversations: PropTypes.array,
};

export default ChatHistory;
