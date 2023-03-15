import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import {
  PROGRAM_ID,
  RegisterCreatorInstructionArgs,
  createRegisterCreatorInstruction,
} from "../generated";
import {
  convertAndPadStr,
  findCollectionPDA,
  findCreatorPDA,
  findMasterEdition,
  findMetadataAccount,
  findTreasuryPDA,
  TOKEN_METADATA_PROGRAM_ID,
} from "../utils";


/**
 * Structure used to register a new creator to a given establishment
 */
export interface RegisterCreatorParams {
  // Creator name 
  name: string;
  // Creator symbol
  symbol: string;
}

/**
 * Register a new creator to an existing establishment
 * 
 * @param params name and symbol to use for the creator
 * @param signer public key of the caller
 * @param establishment establishment publicKey
 * @param establishmentAuthority public key of the establishment authority, only used if you updated your establishment authority through the `updateAuthority` instruction 
 * @param feePayer default to `signer`
 * @param programId default to seaway program ID
 * @returns 
 */
export async function registerCreatorInstruction(
  params: RegisterCreatorParams,
  signer: PublicKey,
  establishment: PublicKey,
  establishmentAuthority?: PublicKey,
  feePayer?: PublicKey,
  programId = PROGRAM_ID
): Promise<TransactionInstruction> {
  const creatorPDA = findCreatorPDA(signer, programId)[0];
  const creatorTreasury = findTreasuryPDA(creatorPDA, programId)[0];

  const collection = findCollectionPDA(creatorPDA, programId)[0];
  const metadata = findMetadataAccount(collection)[0];
  const masterEdition = findMasterEdition(collection)[0];

  const ixParams: RegisterCreatorInstructionArgs = {
    name: convertAndPadStr(params.name, 32),
    symbol: convertAndPadStr(params.symbol, 10),
  };

  return createRegisterCreatorInstruction(
    {
      authority: signer,
      feePayer: feePayer || signer,
      creator: creatorPDA,
      creatorTreasury,
      establishment,
      establishmentAuthority: establishmentAuthority || signer,
      collection,
      creatorAta: getAssociatedTokenAddressSync(collection, signer),
      metadata,
      masterEdition,
      metadataProgram: TOKEN_METADATA_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
    ixParams,
    programId
  );
}
