export {
  getAccountPublicKey,
}



// get Public Key
async function getAccountPublicKey(address) {
  // fetch any address tx hash from etherscan api
  const url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHERSCAN_API}`;
  const response = await fetch(url);
  const txHash = (await response.json())?.result[0]?.hash;
  const recoveredPubKey = txHash ? await getPubKey(txHash) : undefined;
  console.log(recoveredPubKey);
}

async function getPubKey(txHash) {
  const infuraProvider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
  );
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
  return recoveredPubKey;
}