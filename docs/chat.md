## Setting up a Waku local node
- Clone Project `git clone https://github.com/status-im/nwaku.git`

- Cd to the project folder `cd nwaku`

- Build the project (we only need version 2) `make wakunode2`

- See info `./build/wakunode2 --help`

- Run wakunode2 with RPC enabled `./build/wakunode2 --rpc --ports-shift:0`

- (Optional) run another node and connect the two of them - change the node address below (starting with /ip4...) for the one from your first node

`./build/wakunode2 --ports-shift:1 --staticnode:/ip4/0.0.0.0/tcp/60000/p2p/16Uiu2HAmJcBHW3o4PuKHLcn8aR9B9f4CGq4ytf36crhPdo9HLHV7 --rpc`

## RPC Methods
Make post calls to the node using the port exposed  `127.0.0.1:8545`
### Health Check
Request Body
```
{
  "jsonrpc": "2.0",
  "id": "id",
  "method": "get_waku_v2_debug_v1_info",
  "params": []
}
```

### Subscribe to a Subtopic
Request Body
```
{
  "jsonrpc": "2.0",
  "id": "id",
  "method": "post_waku_v2_relay_v1_subscriptions",
  "params": [
    [
      "metamask"
    ]
  ]
}
```

### Read Messages
Request Body
```
{
  "jsonrpc": "2.0",
  "id": "id",
  "method": "get_waku_v2_relay_v1_messages",
  "params": [
    "metamask"
  ]
}
```

### Broadcast a Message
Request Body
```
{
  "jsonrpc": "2.0",
  "id": "id",
  "method": "post_waku_v2_relay_v1_message",
  "params": [
      "metamask",
    {
      "payload": "0x1a2b3c4d5e6f",
      "contentTopic": "metamask",
      "timestamp": 1626813243
    }
  ]
}
```

You can use Postman or curl for making the requests.

### Making requests
Example curl:

```
curl --location --request POST '127.0.0.1:8545' \
--header 'Content-Type: application/json' \
--data-raw '{
  "jsonrpc": "2.0",
  "id": "id",
  "method": "post_waku_v2_relay_v1_subscriptions",
  "params": [
    [
      "metamask"
    ]
  ]
}'
```
Postman Example
![](./chat-postman-requests.gif)

## Setting up Metamask Extension
Leave the node running on port 8545 and continue this steps.

- Clone Metamask repo
`git clone git@github.com:seaona/metamask-extension.git`

- Checkout to Hackathon branch
`git checkout consensys-cypherpunk-2022`

- Cd to the project folder

- Open a terminal there and run

```
nvm use v16.14.0
yarn setup
yarn start
```
- Go to Chrome Extensions

chrome://extensions/

- Activate Developer Mode
- Click Load Unpacked
- Search for the Metamask project folder
  - metamask-extension
    - dist
      - chrome

![](./chat-mm-setup.gif)

For extra info go to the root README.