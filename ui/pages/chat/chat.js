import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { PageContainerHeader } from '../../components/ui/page-container';
import {
  getIsUsingMyAccountForRecipientSearch,
  getRecipient,
  getRecipientUserInput,
  resetRecipientInput,
  updateRecipient,
  updateRecipientUserInput,
} from '../../ducks/send';
import { showQrScanner } from '../../store/actions';
import Box from '../../components/ui/box';
import ButtonGroup from '../../components/ui/button-group';
import Button from '../../components/ui/button';
import EnsInput from './add-recipient/ens-input';

export default function ChatScreen() {
  const userInput = useSelector(getRecipientUserInput);
  const recipient = useSelector(getRecipient);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );
  const dispatch = useDispatch();

  return (
    <div className="page-container">
      <PageContainerHeader
        className="chat__header"
        onClose={() => {
          console.log('closed');
        }}
        title="Chats"
        hideClose
      />

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
      <ButtonGroup
        defaultActiveButtonIndex={1}
        variant="radiogroup"
        newActiveButtonIndex={1}
        className={classnames('button-group')}
      >
        <Button
          onClick={() => {
            console.log('clicked');
          }}
        >
          Contact1
        </Button>
      </ButtonGroup>
      <Box>TEXT</Box>
    </div>
  );
}
