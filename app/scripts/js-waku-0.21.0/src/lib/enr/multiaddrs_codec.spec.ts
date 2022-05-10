import { expect } from "chai";
import { Multiaddr } from "multiaddr";

import { decodeMultiaddrs, encodeMultiaddrs } from "./multiaddrs_codec";

describe("ENR multiaddrs codec", function () {
  it("Sample", async () => {
    const multiaddrs = [
      new Multiaddr(
        "/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/443/wss"
      ),
      new Multiaddr(
        "/dns6/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/443/wss"
      ),
      new Multiaddr(
        "/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd:1234/wss"
      ),
    ];

    const bytes = encodeMultiaddrs(multiaddrs);
    const result = decodeMultiaddrs(bytes);

    const multiaddrsAsStr = result.map((ma) => ma.toString());
    expect(multiaddrsAsStr).to.include(
      "/dns4/node-01.do-ams3.wakuv2.test.statusim.net/tcp/443/wss"
    );
    expect(multiaddrsAsStr).to.include(
      "/dns6/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/443/wss"
    );
    expect(multiaddrsAsStr).to.include(
      "/onion3/vww6ybal4bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd:1234/wss"
    );
  });
});
