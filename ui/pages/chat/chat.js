import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Waku, WakuMessage } from 'js-waku';
import protobuf from 'protobufjs';
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
import Button from '../../components/ui/button';
import EnsInput from './add-recipient/ens-input';

const contentTopic = `/relay-reactjs-chat/1/chat/proto`;

const SimpleChatMessage = new protobuf.Type('SimpleChatMessage')
  .add(new protobuf.Field('timestamp', 1, 'uint64'))
  .add(new protobuf.Field('text', 2, 'string'));

export default function ChatScreen() {
  const userInput = useSelector(getRecipientUserInput);
  const recipient = useSelector(getRecipient);
  const isUsingMyAccountsForRecipientSearch = useSelector(
    getIsUsingMyAccountForRecipientSearch,
  );
  const dispatch = useDispatch();

  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState('None');
  const [sendCounter, setSendCounter] = React.useState(0);
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    if (waku) {
      return;
    }
    if (wakuStatus !== 'None') {
      return;
    }

    setWakuStatus('Starting');

    Waku.create({ bootstrap: { default: true } }).then((wakuInstance) => {
      console.log('WAKU INSTANCE CREATED');
      setWaku(wakuInstance);
      setWakuStatus('Connecting');
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (!waku) {
      return;
    }

    if (wakuStatus === 'Ready') {
      return;
    }

    waku.waitForRemotePeer().then(() => {
      setWakuStatus('Ready');
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (wakuStatus !== 'Ready') {
      return;
    }

    const processMessages = (retrievedMessages) => {
      const filteredRetrievedMessages = retrievedMessages
        .map(decodeMessage)
        .filter(Boolean);

      setMessages((currentMessages) => {
        return currentMessages.concat(filteredRetrievedMessages.reverse());
      });
    };

    const startTime = new Date();
    // 7 days/week, 24 hours/day, 60min/hour, 60secs/min, 100ms/sec
    startTime.setTime(startTime.getTime() - 7 * 24 * 60 * 60 * 1000);

    waku.store
      .queryHistory([contentTopic], {
        callback: processMessages,
        timeFilter: { startTime, endTime: new Date() },
      })
      .catch((e) => {
        console.log('Failed to retrieve messages', e);
      });
  }, [waku, wakuStatus]);

  const sendMessageOnClick = () => {
    // Check Waku is started and connected first.
    if (wakuStatus !== 'Ready') {
      return;
    }

    sendMessage(`Here is message #${sendCounter}`, waku, new Date()).then(() =>
      console.log('Message sent'),
    );

    // For demonstration purposes.
    setSendCounter(sendCounter + 1);
  };

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
      <Button
        onClick={() => {
          console.log('clicked');
        }}
      >
        Contact1
      </Button>
      <Box backgroundColor="background-alternative">Placeholder Text...</Box>

      <header className="App-header">
        <p>{wakuStatus}</p>
        <button onClick={sendMessageOnClick} disabled={wakuStatus !== 'Ready'}>
          Send Message
        </button>
        <ul>
          {messages.map((msg) => {
            return (
              <li key={msg}>
                <p>
                  {msg.timestamp.toString()}: {msg.text}
                </p>
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}

function sendMessage(message, waku, timestamp) {
  const time = timestamp.getTime();

  // Encode to protobuf
  const protoMsg = SimpleChatMessage.create({
    timestamp: time,
    text: message,
  });
  const payload = SimpleChatMessage.encode(protoMsg).finish();

  // Wrap in a Waku Message
  return WakuMessage.fromBytes(payload, contentTopic).then((wakuMessage) =>
    // Send over Waku Relay
    waku.relay.send(wakuMessage),
  );
}

function decodeMessage(wakuMessage) {
  if (!wakuMessage.payload) {
    return;
  }

  const { timestamp, nick, text } = SimpleChatMessage.decode(
    wakuMessage.payload,
  );

  if (!timestamp || !text || !nick) {
    return;
  }

  const time = new Date();
  time.setTime(timestamp);

  const utf8Text = Buffer.from(text).toString('utf-8');

  // eslint-disable-next-line consistent-return
  return { text: utf8Text, timestamp: time, nick };
}
