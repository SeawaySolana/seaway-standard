/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from "@solana/spl-token";
import * as beet from "@metaplex-foundation/beet";
import * as web3 from "@solana/web3.js";

/**
 * @category Instructions
 * @category WithdrawCreatorTreasury
 * @category generated
 */
export type WithdrawCreatorTreasuryInstructionArgs = {
  amount: beet.bignum;
};
/**
 * @category Instructions
 * @category WithdrawCreatorTreasury
 * @category generated
 */
export const withdrawCreatorTreasuryStruct = new beet.BeetArgsStruct<
  WithdrawCreatorTreasuryInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["amount", beet.u64],
  ],
  "WithdrawCreatorTreasuryInstructionArgs"
);
/**
 * Accounts required by the _withdrawCreatorTreasury_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] creator
 * @property [] creatorTreasury
 * @property [] mint
 * @property [_writable_] creatorAta
 * @property [_writable_] authorityAta
 * @category Instructions
 * @category WithdrawCreatorTreasury
 * @category generated
 */
export type WithdrawCreatorTreasuryInstructionAccounts = {
  authority: web3.PublicKey;
  creator: web3.PublicKey;
  creatorTreasury: web3.PublicKey;
  mint: web3.PublicKey;
  creatorAta: web3.PublicKey;
  authorityAta: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const withdrawCreatorTreasuryInstructionDiscriminator = [
  184, 88, 133, 216, 139, 186, 48, 23,
];

/**
 * Creates a _WithdrawCreatorTreasury_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawCreatorTreasury
 * @category generated
 */
export function createWithdrawCreatorTreasuryInstruction(
  accounts: WithdrawCreatorTreasuryInstructionAccounts,
  args: WithdrawCreatorTreasuryInstructionArgs,
  programId = new web3.PublicKey("seaWAy2d8LDYjj9QaettiB653hXjKz4YWrgYb8PUWfz")
) {
  const [data] = withdrawCreatorTreasuryStruct.serialize({
    instructionDiscriminator: withdrawCreatorTreasuryInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.creator,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.creatorTreasury,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.creatorAta,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authorityAta,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
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