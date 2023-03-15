import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import { convertAndPadStr } from "../utils";
import {
  PROGRAM_ID,
  createUpdateEstablishmentInstruction,
  UpdateEstablishmentInstructionArgs,
} from "../generated";

/**
 * Structure used to update an establishment
 * 
 * @property baseUri baseURi of the Establishment metadata
 * @property requiresSignOff true if creator need to be approved into the establishment
 * @property saleBasisPoints fees apply when a user apply to a creator
 * @property royaltiesShare fees to apply when the subscription is sold or exchanged
 * @property isActive true if the establishment is currently active
 */
interface UpdateEstablishmentParams {
  baseUri: string;
  requiresSignOff: boolean | null;
  saleBasisPoints: number | null;
  royaltiesShare: number | null;
  isActive: boolean | null;
}

/**
 * 
 * Update a given establishment
 * 
 * @param params New values
 * @param signer transaction signer, must have authority on the establishment
 * @param establishment publicKey of the establishment account
 * @param programId Default to seaway program ID
 * @returns 
 */
export async function updateEstablishmentInstruction(
  params: UpdateEstablishmentParams,
  signer: PublicKey,
  establishment: PublicKey,
  programId = PROGRAM_ID
): Promise<TransactionInstruction> {
  if (
    params.royaltiesShare &&
    params.royaltiesShare > 100 &&
    params.royaltiesShare < 0
  ) {
    throw new Error("Royalties share should be between 0 and 100");
  }

  if (
    params.saleBasisPoints &&
    params.saleBasisPoints > 10000 &&
    params.saleBasisPoints < 0
  ) {
    throw new Error("Sale basis points should be between 0 and 10000");
  }

  const ixParams: UpdateEstablishmentInstructionArgs = {
    ...params,
    uri: convertAndPadStr(params.baseUri, 94),
  };

  return createUpdateEstablishmentInstruction(
    {
      authority: signer,
      establishment,
    },
    ixParams,
    programId
  );
}
