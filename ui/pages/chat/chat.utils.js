import fetch from 'node-fetch';
 
export {
  wakuHealthCheck,
  wakuSubscribeToSubtopic,
  wakuSendMessage,
  wakuReadMessages,
};

const WAKU_NODE = 'http://127.0.0.1:8546';

// Waku Check if node is available
function wakuHealthCheck(subtopic = 'metamask') {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    jsonrpc: '2.0',
    id: 'id',
    method: 'get_waku_v2_debug_v1_info',
    params: [],
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch(WAKU_NODE, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));
}

// Waku Subscribe to a Subtopic
function wakuSubscribeToSubtopic(subtopic = 'metamask') {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    jsonrpc: '2.0',
    id: 'id',
    method: 'post_waku_v2_relay_v1_subscriptions',
    params: [[subtopic]],
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch(WAKU_NODE, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));
}

// Waku Broadcast a Message with a Subtopic
async function wakuSendMessage(message = '', contentTopic = 'metamask') {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    jsonrpc: '2.0',
    id: 'id',
    method: 'post_waku_v2_relay_v1_message',
    params: [
      contentTopic,
      {
        contentTopic,
        payload: toHex(message),
        timestamp: Date.now(),
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return fetch(WAKU_NODE, requestOptions)
    .then((response) => {
      const result = response.json();
      console.log(result);
      return result;
    })
    .catch((error) => console.log('error', error));
}

// Waku Read Messages from a Subtopic
// It returns a list of messages that were received on a subscribed Subtopic after the last time this method was called
async function wakuReadMessages(subtopic = 'metamask') {
  let response;
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    jsonrpc: '2.0',
    id: 'id',
    method: 'get_waku_v2_relay_v1_messages',
    params: [subtopic],
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return fetch(WAKU_NODE, requestOptions)
    .then((r) => {
      return r.json();
    })
    .catch((error) => {
      console.log('error', error);
    });
}

function toHex(s) {
  let hex, i;

  let result = '';
  for (i = 0; i < s.length; i++) {
    hex = s.charCodeAt(i).toString(16);
    result += `000${hex}`.slice(-4);
  }

  return result;
}
