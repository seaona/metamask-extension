import fetch from 'node-fetch';

export {
  wakuHealthCheck,
  wakuSubscribeToSubtopic,
  wakuSendMessage,
  wakuReadMessages,
  getChatHistory,
  formatTimestamp,
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

function getChatHistory() {
  return [
    {
      context: {
        name: 'Metamask Chats',
        iconUrl: '',
      },
      conversations: [
        {
          sender: {
            ens: 'zenecca.eth',
            address: '0x4803284023840280355325325253252',
          },
          messages: [
            {
              message: 'Ok',
              payload: { a: 1 },
              timestamp: Date.now(),
              readTimestamp: Date.now(),
            },
          ],
        },
        {
          sender: {
            ens: '1010M.eth',
            address: '0x8974709840234143215135261261234614252',
          },
          messages: [
            {
              message: 'I was looking at alchemix loading as well',
              payload: { a: 1 },
              timestamp: Date.now() - 365000,
              readTimestamp: Date.now(),
            },
          ],
        },
      ],
    },
    {
      context: {
        name: 'Mintable',
        iconUrl: '',
      },
      conversations: [
        {
          sender: {
            ens: 'nftradooor.eth',
            address: '0x8094810234812111112314214125141',
          },
          messages: [
            {
              message: 'Want to trade a cool cat for a doodle?',
              payload: { a: 1 },
              timestamp: Date.now() - 3365000,
              readTimestamp: Date.now(),
            },
          ],
        },
      ],
    },
    {
      context: {
        name: 'Decentraland',
        iconUrl: '',
      },
      conversations: [
        {
          sender: {
            ens: '4156.eth',
            address: '0x4124714701824901849021804820193412',
          },
          messages: [
            {
              message: 'Hey, did you find that poker chip NFT?',
              payload: { a: 1 },
              timestamp: Date.now() - 1365000,
            },
          ],
        },
        {
          sender: {
            ens: 'arnies.eth',
            address: '0x1210750918590318095819384109732891749217',
          },
          messages: [
            {
              message: 'Wanna hang out in golf craft?',
              payload: { a: 1 },
              timestamp: Date.now() - 32365000,
              readTimestamp: Date.now(),
            },
          ],
        },
      ],
    },
    {
      context: {
        name: 'Sound.xyz',
        iconUrl: '',
      },
      conversations: [
        {
          sender: {
            ens: 'postmanalone.eth',
            address: '0x49081947142981738918704928108401431434214',
          },
          messages: [
            {
              message: 'How do royalties work with Sound.xyz?',
              payload: { a: 1 },
              timestamp: Date.now() - 1232365000,
              readTimestamp: Date.now(),
            },
          ],
        },
      ],
    },
  ];
}

function formatTimestamp(timestamp) {
  const rawTimestamp = new Date(timestamp);

  let h = rawTimestamp.getHours();
  let ampm = 'am';

  if (h > 12) {
    h %= 12;
    ampm = 'pm';
  }
  h = h < 10 ? `0${h}` : h;

  let m = rawTimestamp.getMinutes();
  m = m < 10 ? `0${m}` : m;

  let datePrefix = '';
  if (Date.now() - rawTimestamp > 24 * 60 * 60 * 1000) {
    datePrefix = rawTimestamp.toUTCString().split(' ').slice(1, 3).join(' ');
    datePrefix += ', ';
  }

  return `${datePrefix}${h}:${m}${ampm}`;
}
