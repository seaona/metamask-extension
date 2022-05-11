import fetch from "node-fetch";

export {
  wakuHealthCheck,
  wakuSubscribeToSubtopic,
  wakuSendMessage,
  wakuReadMessages,
};

const WAKU_NODE = 'http://127.0.0.1:8545'

// Waku Check if node is available
function wakuHealthCheck(subtopic='metamask') {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "id",
    "method": "get_waku_v2_debug_v1_info",
    "params": []
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(WAKU_NODE, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Waku Subscribe to a Subtopic
function wakuSubscribeToSubtopic(subtopic='metamask') {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "id",
    "method": "post_waku_v2_relay_v1_subscriptions",
    "params": [
      [
        subtopic,
      ]
    ]
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(WAKU_NODE, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Waku Broadcast a Message with a Subtopic
function wakuSendMessage(message='0x', subtopic='metamask') {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "id",
    "method": "post_waku_v2_relay_v1_message",
    "params": [
      subtopic,
      {
        "contentTopic": subtopic,
        "payload": message,
        "timestamp": 1626813243
      }
    ]
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(WAKU_NODE, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// Waku Read Messages from a Subtopic
// It returns a list of messages that were received on a subscribed Subtopic after the last time this method was called
function wakuReadMessages(subtopic='metamask') {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "jsonrpc": "2.0",
    "id": "id",
    "method": "get_waku_v2_relay_v1_messages",
    "params": [
      subtopic,
    ]
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(WAKU_NODE, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}