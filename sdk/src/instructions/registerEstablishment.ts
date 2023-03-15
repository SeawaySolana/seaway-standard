import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import {
  PROGRAM_ID,
  createRegisterEstablishmentInstruction,
  RegisterEstablishmentInstructionArgs,
} from "../generated";
import { convertAndPadStr, findTreasuryPDA } from "../utils";


/**
 * Establishment creation params
 * 
 * @property requireSignOff Enforce validation from the establishment for a new creator to be registered 
 * @property saleBasisPoint Establishment fees on subscription sale
 * @property royaltiesShare Establishment fees on NFT's royalties with 2 digit precision (10000 = 100%, 1 = 0.01%)
 * @property baseUri Establishment metadata base URI
 */
interface RegisterEstablishmentParams {
  requiresSignOff: boolean;
  saleBasisPoints: number; 
  royaltiesShare: number;
  baseUri: string;
}

/**
 * Create a new establishment
 * 
 * @param params params of the new establishment (contains the requiresignoff options, fees and base uri)
 * @param signer publicKey signing the transaction
 * @param establishment public Key for the new establishment
 * @param feePayer  default to signer
 * @param programId default to seaway program ID
 * @returns 
 */
export async function registerEstablishmentInstruction(
  params: RegisterEstablishmentParams,
  signer: PublicKey,
  establishment: PublicKey,
  feePayer?: PublicKey,
  programId = PROGRAM_ID
): Promise<TransactionInstruction> {
  const establishmentTreasury = findTreasuryPDA(establishment, programId)[0];

  if (params.royaltiesShare > 100 && params.royaltiesShare < 0) {
    throw new Error("Royalties share should be between 0 and 100");
  }

  if (params.saleBasisPoints > 10000 && params.saleBasisPoints < 0) {
    throw new Error("Sale basis points should be between 0 and 10000");
  }

  const ixParams: RegisterEstablishmentInstructionArgs = {
    ...params,
    uri: convertAndPadStr(params.baseUri, 94),
  };

  return createRegisterEstablishmentInstruction(
    {
      authority: signer,
      feePayer: feePayer || signer,
      establishment,
      establishmentTreasury,
    },
    ixParams,
    programId
  );
}
