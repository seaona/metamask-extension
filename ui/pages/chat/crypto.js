import { ethers } from 'ethers';
import { wakuReadMessages, wakuSendMessage } from './chat.utils';

export { getAccountPublicKey };

// Get Account Public Key
async function getAccountPublicKey(address) {
  // fetch any address tx hash from etherscan api
  const url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_API}`;
  const response = await fetch(url);
  const txHash = (await response.json())?.result[0]?.hash;
  const recoveredPubKey = await getPubKey(txHash);
  console.log(recoveredPubKey);
}

async function getPubKey(txHash) {
  const infuraId = process.env.INFURA_PROJECT_ID;
  const url = `https://mainnet.infura.io/v3/${infuraId}`;
  const infuraProvider = new ethers.providers.JsonRpcProvider(url);
  const tx = await infuraProvider.getTransaction(txHash);

  const expandedSig = {
    r: tx.r,
    s: tx.s,
    v: tx.v,
  };

  const signature = ethers.utils.joinSignature(expandedSig);

  let txData;
  switch (tx.type) {
    case 0:
      txData = {
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        value: tx.value,
        nonce: tx.nonce,
        data: tx.data,
        chainId: tx.chainId,
        to: tx.to,
      };
      break;
    case 2:
      txData = {
        gasLimit: tx.gasLimit,
        value: tx.value,
        nonce: tx.nonce,
        data: tx.data,
        chainId: tx.chainId,
        to: tx.to,
        type: 2,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      };
      break;
    default:
      return undefined;
  }
  const rsTx = await ethers.utils.resolveProperties(txData);
  const raw = ethers.utils.serializeTransaction(rsTx); // returns RLP encoded tx
  const msgHash = ethers.utils.keccak256(raw); // as specified by ECDSA
  const msgBytes = ethers.utils.arrayify(msgHash); // create binary hash
  const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature);
  console.log('rsTx', rsTx);
  console.log('raw', raw);
  console.log('msgHash', msgHash);
  console.log('msgBytes', msgBytes);
  console.log('recoveredPubKey', recoveredPubKey);

  return recoveredPubKey;
}

// Receiver Sends Account Public Key to the Sender
async function sendAccountPublicKey(account, contentTopicReciever) {
  const pubKey = await getAccountPublicKey(account);
  await wakuSendMessage(pubKey, contentTopicReciever);
}

// Handle Public Key Recieve

// Sender Encrypts Message with Receiver Public Key

// Receiver Decrypts Sender Message with Private Key
