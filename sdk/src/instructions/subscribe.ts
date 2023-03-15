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
import {
  PROGRAM_ID,
  createSubscribeInstruction,
  Membership,
} from "../generated";
import {
  findCollectionPDA,
  findMasterEdition,
  findMetadataAccount,
  findSubscriptionPDA,
  findTreasuryPDA,
  TOKEN_METADATA_PROGRAM_ID,
} from "../utils";

/**
 * 
 * Subscribe to a given membership
 * 
 * @param durationInMonths duration of the subscription, in months
 * @param signer Transaction signer
 * @param establishment Publickey of the establishment 
 * @param membershipPublicKey PublicKey of the membershp data account holding membership informations
 * @param membership Membership struct representing the membership datas
 * @param nft Mint account of the membership you want to subscribe to
 * @param feePayer Payer for the transaction fees and for rent, default to signer
 * @param programId default to seaway program ID
 * @returns 
 */
export async function subscribeInstruction(
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

  const [metadata] = findMetadataAccount(nft);
  const [masterEdition] = findMasterEdition(nft);
  const [metadataCollection] = findMetadataAccount(collection);
  const [masterEditionCollection] = findMasterEdition(collection);

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
    createSubscribeInstruction(
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
        metadata,
        masterEdition,
        metadataCollection,
        masterEditionCollection,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
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
