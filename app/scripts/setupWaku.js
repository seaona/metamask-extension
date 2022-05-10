import { discovery, Waku, WakuMessage, getPredefinedBootstrapNodes } from "./js-waku-0.21.0/src";
const contentTopic = '/relay-demo/1/message/utf-8';

function start() {
  try {
    Waku.create({ bootstrap: { default: true } }).catch(e => {
        console.log('Issue starting Waku node', e);
      }
    ).then(wakuNode => {

      wakuNode.relay.addObserver((wakuMessage) => {
        console.log("sendmessage")
        const text = wakuMessage.payloadAsUtf8;
        console.log(text)
      }, [contentTopic]);

      wakuNode.waitForRemotePeer()
        .catch((e) => {
          console.log('Failed to connect to peers: ' + e.toString());
        })
        .then(() => {
          sendMessage = () => {
            console.log("sendmessage")
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