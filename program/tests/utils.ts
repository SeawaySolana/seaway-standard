import { simulateTransaction } from "@coral-xyz/anchor/dist/cjs/utils/rpc";
import {
  createInitializeMintInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { TextEncoder, TextDecoder } from "util";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const createMintInstruction = async (
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  authority?: PublicKey
): Promise<TransactionInstruction[]> => {
  const auth = authority || mint;

  //const mint = Keypair.generate();
  const lamportsForMint = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );

  return [
    SystemProgram.createAccount({
      programId: TOKEN_PROGRAM_ID,
      space: MintLayout.span,
      fromPubkey: payer,
      newAccountPubkey: mint,
      lamports: lamportsForMint,
    }),
    createInitializeMintInstruction(mint, 0, auth, auth, TOKEN_PROGRAM_ID),
  ];
};

export const findCreatorPDA = (creator: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("creator"), creator.toBuffer()],
    programId
  );
};

export const findTreasuryPDA = (account: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), account.toBuffer()],
    programId
  );
};

export const findSubscriptionPda = (mint: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("subscription"), mint.toBuffer()],
    programId
  );
};

export const findMetadataAccount = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(Buffer.from("metadata")),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
};

export const findMasterEdition = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(Buffer.from("metadata")),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
};

export const findCollectionPDA = (creator: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("collection"), creator.toBuffer()],
    programId
  );
};

export const convertAndPadStr = (str: string, pad: number): number[] => {
  return Array.from(encoder.encode(str.padEnd(pad, "\0")));
};

export const convertToStr = (arr: ArrayBuffer): string => {
  return decoder.decode(arr).replace(/\u0000/g, "");
};

export const debug = async (
  tx: Transaction,
  signers: Signer[],
  connection: Connection
) => {
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  console.log(await simulateTransaction(connection, tx, signers));
};
