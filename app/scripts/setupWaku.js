import { Waku, WakuMessage } from "js-waku";
const contentTopic = '/metamask';

function start() {
  try {
    Waku.create({ bootstrap: { default: true } }).catch(e => {
        console.log('Issue starting Waku node', e);
      }
    ).then(wakuNode => {
      console.log("node setup correctly")
      wakuNode.relay.addObserver((wakuMessage) => {
        console.log("observer added")
        const text = wakuMessage.payloadAsUtf8;
        console.log(text)
      }, [contentTopic]);

      wakuNode.waitForRemotePeer()
        .catch((e) => {
          console.log('Failed to connect to peers: ' + e.toString());
        })
        .then(() => {
          sendMessage = () => {
            console.log("preparing message")
            const text = "test";
            WakuMessage.fromUtf8String(text, contentTopic).catch(e => console.log('Error encoding message', e)).then(
            wakuMessage => {
              wakuNode.relay.send(wakuMessage).catch((e) => {
                console.log('Error sending message', e);
              }).then(() => {
                console.log('Message sent', text);
              });
            }
            );
          };
        });
    });
} catch (e) {
    console.log(e);
  }
}

start()