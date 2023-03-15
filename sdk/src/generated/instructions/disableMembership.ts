/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";

/**
 * @category Instructions
 * @category DisableMembership
 * @category generated
 */
export const disableMembershipStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */;
}>(
  [["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)]],
  "DisableMembershipInstructionArgs"
);
/**
 * Accounts required by the _disableMembership_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] membership
 * @property [] creator
 * @category Instructions
 * @category DisableMembership
 * @category generated
 */
export type DisableMembershipInstructionAccounts = {
  authority: web3.PublicKey;
  membership: web3.PublicKey;
  creator: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const disableMembershipInstructionDiscriminator = [
  5, 65, 185, 169, 104, 236, 184, 132,
];

/**
 * Creates a _DisableMembership_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category DisableMembership
 * @category generated
 */
export function createDisableMembershipInstruction(
  accounts: DisableMembershipInstructionAccounts,
  programId = new web3.PublicKey("seaWAy2d8LDYjj9QaettiB653hXjKz4YWrgYb8PUWfz")
) {
  const [data] = disableMembershipStruct.serialize({
    instructionDiscriminator: disableMembershipInstructionDiscriminator,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.membership,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.creator,
      isWritable: false,
      isSigner: false,
    },
  ];

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc);
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  });
  return ix;
}
