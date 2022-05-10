import Libp2p from "libp2p";
import { Peer } from "libp2p/src/peer-store";

/**
 * Returns a pseudo-random peer that supports the given protocol.
 * Useful for protocols such as store and light push
 */
export async function selectRandomPeer(
  peersIter: AsyncIterable<Peer>
): Promise<Peer | undefined> {
  const peers = [];
  for await (const peer of peersIter) {
    peers.push(peer);
  }

  if (peers.length === 0) return;

  const index = Math.round(Math.random() * (peers.length - 1));
  return peers[index];
}

/**
 * Returns the list of peers that supports the given protocol.
 */
export async function* getPeersForProtocol(
  libp2p: Libp2p,
  protocols: string[]
): AsyncIterable<Peer> {
  for await (const peer of libp2p.peerStore.getPeers()) {
    let peerFound = false;
    for (let i = 0; i < protocols.length; i++) {
      if (peer.protocols.includes(protocols[i])) {
        peerFound = true;
        break;
      }
    }
    if (!peerFound) {
      continue;
    }
    yield peer;
  }
}
