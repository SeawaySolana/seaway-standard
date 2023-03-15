import {
  PublicKey,
  Connection,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PROGRAM_ID } from "./generated";

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const findSubscriptionPDA = (
  mint: PublicKey,
  programId = PROGRAM_ID
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("subscription"), mint.toBuffer()],
    programId
  );
};

export const findTreasuryPDA = (account: PublicKey, programId = PROGRAM_ID) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), account.toBuffer()],
    programId
  );
};

export const findCreatorPDA = (creator: PublicKey, programId = PROGRAM_ID) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("creator"), creator.toBuffer()],
    programId
  );
};

export const findCollectionPDA = (
  creator: PublicKey,
  programId = PROGRAM_ID
) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("collection"), creator.toBuffer()],
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

export const createMintIx = async (
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  authority?: PublicKey
): Promise<TransactionInstruction[]> => {
  const auth = authority || mint;

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

export const convertAndPadStr = (str: string, pad: number): number[] => {
  const encoder = new TextEncoder();
  return Array.from(encoder.encode(str.padEnd(pad, "\0")));
};

export const convertToStr = (arr: ArrayBuffer): string => {
  const decoder = new TextDecoder();
  return decoder.decode(arr).replace(/\u0000/g, "");
};

export const formatString = (str: string, length: number) => {
  if (str.length > length) {
    throw Error("ing length exceeds max size");
  }
  return convertAndPadStr(str, length);
};
