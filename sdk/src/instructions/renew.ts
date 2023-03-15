import { associatedAddress } from "@coral-xyz/anchor/dist/cjs/utils/token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import {
  TransactionInstruction,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { PROGRAM_ID, createRenewInstruction, Membership } from "../generated";
import {
  findCollectionPDA,
  findSubscriptionPDA,
  findTreasuryPDA,
} from "../utils";


/**
 * 
 * Renew a subscription for a given membership
 * 
 * @param durationInMonths Duration of the subscription renewal
 * @param signer Transaction signer, must be the actual owner of the subscription
 * @param establishment Establishment publicKey where the subscription have been associated to 
 * @param membershipPublicKey Membership data account
 * @param membership Membership data structure describing the membership
 * @param nft Mint account publicKey for the renewed subscription
 * @param feePayer transaction fees and rent payer, default to `signer`
 * @param programId Default to seaway program ID
 * @returns 
 */
export async function renewInstruction(
  durationInMonths: number,
  signer: PublicKey,
  establishment: PublicKey,
  membershipPublicKey: PublicKey,
  membership: Membership,
  nft: PublicKey,
  feePayer?: PublicKey,
  programId = PROGRAM_ID
): Promise<TransactionInstruction[]> {
  const creatorTreasury = findTreasuryPDA(membership.creator, programId)[0];
  const establishmentTreasury = findTreasuryPDA(establishment, programId)[0];

  const collection = findCollectionPDA(membership.creator, programId)[0];
  const subscription = findSubscriptionPDA(nft, programId)[0];

  const creatorAta = await associatedAddress({
    mint: membership.mint,
    owner: creatorTreasury,
  });
  const establishmentAta = await associatedAddress({
    mint: membership.mint,
    owner: establishmentTreasury,
  });
  const signerTa = await associatedAddress({
    mint: membership.mint,
    owner: signer,
  });
  const subscriberAta = await associatedAddress({
    mint: nft,
    owner: signer,
  });

  const instructions: TransactionInstruction[] = [];
  if (membership.mint.equals(NATIVE_MINT)) {
    instructions.push(
      ...[
        createAssociatedTokenAccountIdempotentInstruction(
          signer,
          signerTa,
          signer,
          NATIVE_MINT
        ),
        SystemProgram.transfer({
          fromPubkey: signer,
          toPubkey: signerTa,
          lamports: BigInt(membership.price.toString()),
        }),
        createSyncNativeInstruction(signerTa),
      ]
    );
  }

  instructions.push(
    ...[
      createAssociatedTokenAccountIdempotentInstruction(
        signer,
        creatorAta,
        creatorTreasury,
        membership.mint
      ),
      createAssociatedTokenAccountIdempotentInstruction(
        signer,
        establishmentAta,
        establishmentTreasury,
        membership.mint
      ),
    ]
  );

  instructions.push(
    createRenewInstruction(
      {
        signer: signer,
        feePayer: feePayer || signer,
        signerTa: signerTa,
        establishment: establishment,
        creator: membership.creator,
        collection,
        membership: membershipPublicKey,
        mint: membership.mint,
        subscription,
        mintNft: nft,
        subscriberAta,
        creatorAta,
        establishmentAta: establishmentAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
      {
        price: membership.price,
        durationInMonths,
      },
      programId
    )
  );

  return instructions;
}
