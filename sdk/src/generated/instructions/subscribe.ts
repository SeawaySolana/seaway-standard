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
 * @category Subscribe
 * @category generated
 */
export type SubscribeInstructionArgs = {
  price: beet.bignum;
  durationInMonths: beet.COption<number>;
};
/**
 * @category Instructions
 * @category Subscribe
 * @category generated
 */
export const subscribeStruct = new beet.FixableBeetArgsStruct<
  SubscribeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["instructionDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["price", beet.u64],
    ["durationInMonths", beet.coption(beet.u16)],
  ],
  "SubscribeInstructionArgs"
);
/**
 * Accounts required by the _subscribe_ instruction
 *
 * @property [_writable_, **signer**] signer
 * @property [_writable_, **signer**] feePayer
 * @property [_writable_] signerTa
 * @property [] establishment
 * @property [_writable_] creator
 * @property [] collection
 * @property [_writable_] membership
 * @property [] mint
 * @property [_writable_] subscription
 * @property [_writable_, **signer**] mintNft
 * @property [_writable_] subscriberAta
 * @property [_writable_] creatorAta
 * @property [_writable_] establishmentAta
 * @property [_writable_] metadata
 * @property [_writable_] masterEdition
 * @property [_writable_] metadataCollection
 * @property [_writable_] masterEditionCollection
 * @property [] metadataProgram
 * @property [] associatedTokenProgram
 * @category Instructions
 * @category Subscribe
 * @category generated
 */
export type SubscribeInstructionAccounts = {
  signer: web3.PublicKey;
  feePayer: web3.PublicKey;
  signerTa: web3.PublicKey;
  establishment: web3.PublicKey;
  creator: web3.PublicKey;
  collection: web3.PublicKey;
  membership: web3.PublicKey;
  mint: web3.PublicKey;
  subscription: web3.PublicKey;
  mintNft: web3.PublicKey;
  subscriberAta: web3.PublicKey;
  creatorAta: web3.PublicKey;
  establishmentAta: web3.PublicKey;
  metadata: web3.PublicKey;
  masterEdition: web3.PublicKey;
  metadataCollection: web3.PublicKey;
  masterEditionCollection: web3.PublicKey;
  metadataProgram: web3.PublicKey;
  tokenProgram?: web3.PublicKey;
  associatedTokenProgram: web3.PublicKey;
  systemProgram?: web3.PublicKey;
  rent?: web3.PublicKey;
  anchorRemainingAccounts?: web3.AccountMeta[];
};

export const subscribeInstructionDiscriminator = [
  254, 28, 191, 138, 156, 179, 183, 53,
];

/**
 * Creates a _Subscribe_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category Subscribe
 * @category generated
 */
export function createSubscribeInstruction(
  accounts: SubscribeInstructionAccounts,
  args: SubscribeInstructionArgs,
  programId = new web3.PublicKey("seaWAy2d8LDYjj9QaettiB653hXjKz4YWrgYb8PUWfz")
) {
  const [data] = subscribeStruct.serialize({
    instructionDiscriminator: subscribeInstructionDiscriminator,
    ...args,
  });
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.signer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.feePayer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.signerTa,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.establishment,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.creator,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.collection,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.membership,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.mint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.subscription,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.mintNft,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.subscriberAta,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.creatorAta,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.establishmentAta,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.metadata,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.masterEdition,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.metadataCollection,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.masterEditionCollection,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.metadataProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.associatedTokenProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
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
