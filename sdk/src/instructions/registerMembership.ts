import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  PROGRAM_ID,
  createRegisterMembershipInstruction,
  RegisterMembershipInstructionArgs,
} from "../generated";
import { convertAndPadStr, findCreatorPDA } from "../utils";

/**
 * 
 * new Memberships parameters
 * 
 * @property price price of the membership in lamports
 * @property royalties royalties imputed on the sale of a membership, with 2 decimals: for 10% -> 1000
 * @property supply number of available subscription for the new membership
 * @property name name of the memberbhips
 * @property symbol short name for the membership
 */
export interface RegisterMembershipParams {
  price: BN;
  royalties: number;
  supply: number;
  name: string;
  symbol: string;
}


/**
 * 
 * Create a new membership for a given creator
 * 
 * @param params Parameters for the new membership
 * @param authority Creator's account pubKey
 * @param membership Data account used to store membership datas, 
 * @param mint Mint account of the membership
 * @param creator [Optional] Creator's PDA, by default this value is derived from authority's publickey
 * @param feePayer [Optional] specific account paying for rent and transaction fees, default equal to authority
 * @param programId [Optional] Default to seaway program ID
 * @returns 
 */
export async function registerMembershipInstruction(
  params: RegisterMembershipParams,
  authority: PublicKey,
  membership: PublicKey, 
  mint: PublicKey,
  creator?: PublicKey,
  feePayer?: PublicKey,
  programId = PROGRAM_ID
): Promise<TransactionInstruction> {
  const creatorPDA = creator || findCreatorPDA(authority, programId)[0];

  const ixParams: RegisterMembershipInstructionArgs = {
    ...params,
    name: convertAndPadStr(params.name, 27),
    symbol: convertAndPadStr(params.symbol, 10),
  };

  return createRegisterMembershipInstruction(
    {
      authority: authority,
      feePayer: feePayer || authority,
      membership: membership,
      creator: creatorPDA,
      mint,
    },
    ixParams,
    programId
  );
}
