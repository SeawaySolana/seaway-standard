/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from "@solana/web3.js";
import * as beet from "@metaplex-foundation/beet";
import * as beetSolana from "@metaplex-foundation/beet-solana";
export type MembershipEvent = {
  version: number;
  creator: web3.PublicKey;
  mint: web3.PublicKey;
  price: beet.bignum;
  royalties: number;
  supply: beet.bignum;
  minted: beet.bignum;
  isActive: boolean;
  name: number[] /* size: 27 */;
  symbol: number[] /* size: 10 */;
  totalRevenue: beet.bignum;
  padding: beet.bignum[] /* size: 12 */;
};

/**
 * @category userTypes
 * @category generated
 */
export const membershipEventBeet = new beet.BeetArgsStruct<MembershipEvent>(
  [
    ["version", beet.u8],
    ["creator", beetSolana.publicKey],
    ["mint", beetSolana.publicKey],
    ["price", beet.u64],
    ["royalties", beet.u16],
    ["supply", beet.u64],
    ["minted", beet.u64],
    ["isActive", beet.bool],
    ["name", beet.uniformFixedSizeArray(beet.u8, 27)],
    ["symbol", beet.uniformFixedSizeArray(beet.u8, 10)],
    ["totalRevenue", beet.u64],
    ["padding", beet.uniformFixedSizeArray(beet.u64, 12)],
  ],
  "MembershipEvent"
);