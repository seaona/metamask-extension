import { Waku, WakuMessage } from "./js-waku-0.21.0/src";


async function start() {
const contentTopic ='/metamask/chat'

const waku = await Waku.create({ bootstrap: { default: true } });
// Wait to be connected to at least one peer
await new Promise((resolve, reject) => {
  // If we are not connected to any peer within 10sec let's just reject
  // As we are not implementing connection management in this example

  setTimeout(reject, 10000);
  waku.libp2p.connectionManager.on("peer:connect", () => {
    console.log("CONNNEEEECTGEEED")
    resolve(null);
  });

});

const processIncomingMessage = (wakuMessage) => {
  console.log("messageeee")
  console.log(`Message Received: ${wakuMessage.payloadAsUtf8}`);
};

waku.relay.addObserver(processIncomingMessage, ['/metamask/chat']);

  const wakuMessage = await WakuMessage.fromUtf8String(
    'Here is a message',
    `/metamask/chat`,
  );

  await waku.relay.send(wakuMessage);

 

}



start()