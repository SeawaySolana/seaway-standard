import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Seaway } from "../../../target/types/seaway";
import { assert, expect } from "chai";
import {
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  getAssociatedTokenAddress,
  NATIVE_MINT,
} from "@solana/spl-token";
import {
  convertAndPadStr,
  convertToStr,
  findCreatorPDA,
  findCollectionPDA,
  TOKEN_METADATA_PROGRAM_ID,
  findMetadataAccount,
  findMasterEdition,
  findTreasuryPDA,
  findSubscriptionPda,
} from "./utils";
import {
  MasterEditionV2,
  Metadata,
} from "@metaplex-foundation/mpl-token-metadata";

describe("Seaway", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Seaway as Program<Seaway>;
  const user = Keypair.generate();

  const establishment1 = Keypair.generate();
  const establishment1Authority = Keypair.generate();

  const establishment2 = Keypair.generate();
  const establishment2Authority = Keypair.generate();

  const creator1 = Keypair.generate();

  const creator2 = Keypair.generate();
  const creator2Authority = Keypair.generate();

  const membership = Keypair.generate();
  const membershipNft = Keypair.generate();

  const base_uri = "https://metadata.seaway.app";

  before(async () => {
    const fundTx = new Transaction();
    fundTx.add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: user.publicKey,
        lamports: 200 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: establishment1Authority.publicKey,
        lamports: 200 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: establishment2Authority.publicKey,
        lamports: 200 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: creator1.publicKey,
        lamports: 200 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: creator2.publicKey,
        lamports: 200 * LAMPORTS_PER_SOL,
      })
    );
    await provider.sendAndConfirm(fundTx);
  });

  describe("establishment", () => {
    it("Should create establishment 1", async () => {
      await program.methods
        .registerEstablishment(false, 1500, 10, convertAndPadStr(base_uri, 94))
        .accounts({
          establishment: establishment1.publicKey,
          authority: establishment1Authority.publicKey,
          feePayer: establishment1Authority.publicKey,
        })
        .signers([establishment1, establishment1Authority])
        .rpc();

      const establishmentState = await program.account.establishment.fetch(
        establishment1.publicKey
      );

      // assert that account state has been populated
      assert.equal(establishmentState.requiresSignOff, false);
      assert.equal(establishmentState.isActive, true);

      assert.equal(
        establishmentState.authority.toBase58(),
        establishment1Authority.publicKey.toBase58()
      );

      assert.equal(
        Buffer.from(establishmentState.baseUri)
          .toString("utf-8")
          .replace(/\0/g, ""),
        base_uri
      );
    });

    it("Should create establishment 2", async () => {
      await program.methods
        .registerEstablishment(true, 1500, 10, convertAndPadStr(base_uri, 94))
        .accounts({
          establishment: establishment2.publicKey,
          authority: user.publicKey,
          feePayer: user.publicKey,
        })
        .signers([establishment2, user])
        .rpc();

      const establishmentState = await program.account.establishment.fetch(
        establishment2.publicKey
      );

      // assert that account state has been populated
      assert.equal(establishmentState.requiresSignOff, true);
      assert.equal(establishmentState.isActive, true);

      assert.equal(
        establishmentState.authority.toBase58(),
        user.publicKey.toBase58()
      );
      assert.equal(
        Buffer.from(establishmentState.baseUri)
          .toString("utf-8")
          .replace(/\0/g, ""),
        base_uri
      );
    });

    it("Should disable establishment 2", async () => {
      await program.methods
        .updateEstablishment(null, null, null, null, false)
        .accounts({
          authority: user.publicKey,
          establishment: establishment2.publicKey,
        })
        .signers([user, user])
        .rpc();

      const establishmentState = await program.account.establishment.fetch(
        establishment2.publicKey
      );

      assert.equal(establishmentState.isActive, false);
    });

    it("Should update establishment 2 authority and reactivate", async () => {
      await program.methods
        .updateEstablishmentAuthority()
        .accounts({
          authority: user.publicKey,
          newAuthority: establishment2Authority.publicKey,

          establishment: establishment2.publicKey,
        })
        .postInstructions([
          await program.methods
            .updateEstablishment(null, null, null, null, true)
            .accounts({
              authority: establishment2Authority.publicKey,
              establishment: establishment2.publicKey,
            })
            .instruction(),
        ])
        .signers([user, establishment2Authority])
        .rpc();

      const establishmentState = await program.account.establishment.fetch(
        establishment2.publicKey
      );

      assert.equal(establishmentState.isActive, true);
      assert.equal(
        establishmentState.authority.toBase58(),
        establishment2Authority.publicKey.toBase58()
      );
    });
  });

  describe("creator", () => {
    it("Should fail to register a creator (req sign off)", async () => {
      const [creatorPda] = findCreatorPDA(
        creator1.publicKey,
        program.programId
      );

      const [collection] = findCollectionPDA(creatorPda, program.programId);

      const creatorAta = await getAssociatedTokenAddress(
        collection,
        creator1.publicKey
      );

      const [metadata] = findMetadataAccount(collection);
      const [masterEdition] = findMasterEdition(collection);

      try {
        await program.methods
          .registerCreator(
            convertAndPadStr("name", 32),
            convertAndPadStr("symbol", 10)
          )
          .accounts({
            authority: creator1.publicKey,
            feePayer: creator1.publicKey,

            establishment: establishment2.publicKey,
            establishmentAuthority: null,

            collection: collection,
            creatorAta: creatorAta,
            metadata: metadata,
            masterEdition: masterEdition,

            metadataProgram: TOKEN_METADATA_PROGRAM_ID,
          })
          .signers([creator1])
          .rpc();
      } catch (e) {
        assert.equal(e.error.errorCode.code, "InvalidAuthority");
        return;
      }

      expect.fail("Should fail");
    });

    it("Should register a creator", async () => {
      const [creatorPda] = findCreatorPDA(
        creator1.publicKey,
        program.programId
      );

      const [collection] = findCollectionPDA(creatorPda, program.programId);

      const creatorAta = await getAssociatedTokenAddress(
        collection,
        creator1.publicKey
      );

      const [metadata] = findMetadataAccount(collection);
      const [masterEdition] = findMasterEdition(collection);

      await program.methods
        .registerCreator(
          convertAndPadStr("name", 32),
          convertAndPadStr("symbol", 10)
        )
        .accounts({
          authority: creator1.publicKey,
          feePayer: creator1.publicKey,

          establishment: establishment1.publicKey,

          collection: collection,
          creatorAta: creatorAta,
          metadata: metadata,
          masterEdition: masterEdition,

          metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([creator1])
        .rpc();

      const creatorState = await program.account.creator.fetch(creatorPda);

      assert.equal(
        creatorState.owner.toBase58(),
        creator1.publicKey.toBase58()
      );
      assert.equal(creatorState.collection.toBase58(), collection.toBase58());
      assert.equal(creatorState.isActive, true);

      assert.equal(
        creatorState.authority.toBase58(),
        creator1.publicKey.toBase58()
      );
      assert.equal(
        creatorState.establishment.toBase58(),
        establishment1.publicKey.toBase58()
      );
      assert.equal(creatorState.totalSubscription.toNumber(), 0);
      assert.equal(creatorState.totalRevenue.toNumber(), 0);

      // assert that collection mint has been created and populated
      const mintCollectionAccount = await spl.getMint(
        provider.connection,
        collection
      );
      assert.equal(
        mintCollectionAccount.mintAuthority.toBase58(),
        masterEdition.toBase58()
      );
      assert.equal(mintCollectionAccount.supply.toString(), "1");
      assert.equal(mintCollectionAccount.decimals, 0);

      // assert that collection metadata has been created, signed and populated
      const collectionMetadataAccounts =
        await provider.connection.getProgramAccounts(
          TOKEN_METADATA_PROGRAM_ID,
          {
            filters: [{ memcmp: { offset: 33, bytes: collection.toBase58() } }],
          }
        );
      const collectionMetadataAccount = collectionMetadataAccounts[0].account;
      const collectionMetadataInfo = Metadata.fromAccountInfo(
        collectionMetadataAccount
      );

      assert.equal(
        collectionMetadataInfo[0].mint.toBase58(),
        collection.toBase58()
      );
      assert.equal(
        collectionMetadataInfo[0].updateAuthority.toBase58(),
        creatorPda.toBase58()
      );

      assert.equal(collectionMetadataInfo[0].isMutable, true);
      assert.equal(collectionMetadataInfo[0].primarySaleHappened, false);
      assert.equal(collectionMetadataInfo[0].uses, null);
      assert.equal(collectionMetadataInfo[0].data.symbol.slice(0, 6), "symbol");
      assert.equal(collectionMetadataInfo[0].data.name.slice(0, 4), "name");
      assert.equal(collectionMetadataInfo[0].data.sellerFeeBasisPoints, 10000);
      assert.equal(
        collectionMetadataInfo[0].data.uri.replace(/\0/g, ""),
        `${base_uri}/${creatorPda}/creator.json`
      );
      assert.equal(
        collectionMetadataInfo[0].data.creators[0].address.toBase58(),
        creator1.publicKey.toBase58()
      );
    });

    it("Should register a creator (with sign off)", async () => {
      const [creatorPda] = findCreatorPDA(
        creator2.publicKey,
        program.programId
      );

      const [collection] = findCollectionPDA(creatorPda, program.programId);

      const creatorAta = await getAssociatedTokenAddress(
        collection,
        creator2.publicKey
      );

      const [metadata] = findMetadataAccount(collection);
      const [masterEdition] = findMasterEdition(collection);

      await program.methods
        .registerCreator(
          convertAndPadStr("name", 32),
          convertAndPadStr("symbol", 10)
        )
        .accounts({
          authority: creator2.publicKey,
          feePayer: creator2.publicKey,

          establishment: establishment2.publicKey,
          establishmentAuthority: establishment2Authority.publicKey,

          collection: collection,
          creatorAta: creatorAta,
          metadata: metadata,
          masterEdition: masterEdition,

          metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([creator2, establishment2Authority])
        .rpc();
    });

    it("Should update creator authority", async () => {
      const [creatorPda] = findCreatorPDA(
        creator2.publicKey,
        program.programId
      );

      await program.methods
        .updateCreatorAuthority()
        .accounts({
          authority: creator2.publicKey,
          newAuthority: creator2Authority.publicKey,

          creator: creatorPda,
        })
        .signers([creator2, creator2Authority])
        .rpc();

      const creatorState = await program.account.creator.fetch(creatorPda);

      assert.equal(
        creatorState.authority.toBase58(),
        creator2Authority.publicKey.toBase58()
      );
    });
  });

  describe("membership", () => {
    it("Should register a membership", async () => {
      const price = new BN(6 * LAMPORTS_PER_SOL);
      const royalties = 800;
      const supply = new BN(10000);

      const [creatorPda] = findCreatorPDA(
        creator1.publicKey,
        program.programId
      );

      await program.methods
        .registerMembership(
          price,
          royalties,
          supply,
          convertAndPadStr("name", 32),
          convertAndPadStr("symbol", 10)
        )
        .accounts({
          authority: creator1.publicKey,
          creator: creatorPda,
          membership: membership.publicKey,
          mint: NATIVE_MINT,
        })
        .signers([creator1, membership])
        .rpc();

      // assert membership account has been created and populated
      const [creator] = findCreatorPDA(creator1.publicKey, program.programId);

      const membershipState = await program.account.membership.fetch(
        membership.publicKey
      );

      assert.equal(membershipState.creator.toBase58(), creator.toBase58());
      assert.equal(membershipState.price.toNumber(), 6 * LAMPORTS_PER_SOL);
      assert.equal(membershipState.royalties, royalties);
      assert.equal(membershipState.supply.toNumber(), supply.toNumber());
      assert.equal(membershipState.mint.toBase58(), NATIVE_MINT.toBase58());
      assert.equal(
        convertToStr(new Uint8Array(membershipState.symbol)),
        "symbol"
      );
      assert.equal(membershipState.isActive, true);
      assert.equal(membershipState.totalRevenue.toNumber(), 0);
    });

    it("Should fail to register a membership (wrong creator)", async () => {
      const [creator] = findCreatorPDA(creator1.publicKey, program.programId);
      const membershipWao = Keypair.generate();

      const price = new BN(6 * LAMPORTS_PER_SOL);
      const royalties = 800;
      const supply = new BN(10000);

      try {
        await program.methods
          .registerMembership(
            price,
            royalties,
            supply,
            convertAndPadStr("name", 27),
            convertAndPadStr("symbol", 10)
          )
          .accounts({
            authority: user.publicKey,
            membership: membershipWao.publicKey,
            creator: creator,
            mint: NATIVE_MINT,
          })
          .signers([user, membershipWao])
          .rpc();
      } catch (e) {
        assert.equal(e.error.errorCode.code, "InvalidAuthority");
        return;
      }

      assert.fail("Should fail");
    });

    it("Should disable a membership", async () => {
      const membership2 = anchor.web3.Keypair.generate();

      const [creatorPda] = findCreatorPDA(
        creator2.publicKey,
        program.programId
      );

      await program.methods
        .registerMembership(
          new BN(1),
          10,
          new BN(1),
          convertAndPadStr("name", 27),
          convertAndPadStr("symbol", 10)
        )
        .accounts({
          authority: creator2Authority.publicKey,
          creator: creatorPda,

          membership: membership2.publicKey,

          mint: NATIVE_MINT,
        })
        .signers([creator2Authority, membership2])
        .rpc();

      await program.methods
        .disableMembership()
        .accounts({
          authority: creator2Authority.publicKey,
          creator: creatorPda,
          membership: membership2.publicKey,
        })
        .signers([creator2Authority])
        .rpc();

      const membershipState = await program.account.membership.fetch(
        membership2.publicKey
      );
      assert.equal(membershipState.isActive, false);
    });
  });

  describe("subscribe", () => {
    it("Should perform a subscription", async () => {
      const [creatorPda] = findCreatorPDA(
        creator1.publicKey,
        program.programId
      );

      const [mintCollectionPDA] = findCollectionPDA(
        creatorPda,
        program.programId
      );

      const creatorState = await program.account.creator.fetch(creatorPda);
      const membershipState = await program.account.membership.fetch(
        membership.publicKey
      );

      const [metadataPDA] = findMetadataAccount(membershipNft.publicKey);
      const [masterEditionPDA] = findMasterEdition(membershipNft.publicKey);
      const [metadataCollectionPda] = findMetadataAccount(mintCollectionPDA);
      const [masterEditionCollectionPDA] = findMasterEdition(mintCollectionPDA);

      const [establishmentTreasury] = findTreasuryPDA(
        establishment1.publicKey,
        program.programId
      );
      const [creatorTreasury] = findTreasuryPDA(creatorPda, program.programId);

      const subscriberAta = await getAssociatedTokenAddress(
        membershipNft.publicKey,
        user.publicKey
      );
      const establishmentAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        establishmentTreasury,
        true
      );
      const creatorAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        creatorTreasury,
        true
      );
      const signerTa = await getAssociatedTokenAddress(
        NATIVE_MINT,
        user.publicKey
      );

      const wrapInstructions = [
        createAssociatedTokenAccountInstruction(
          user.publicKey,
          signerTa,
          user.publicKey,
          NATIVE_MINT
        ),
        SystemProgram.transfer({
          fromPubkey: user.publicKey,
          toPubkey: signerTa,
          lamports: membershipState.price.toNumber(),
        }),
        createSyncNativeInstruction(signerTa),
      ];

      await program.methods
        .subscribe(membershipState.price, 1)
        .accounts({
          signer: user.publicKey,
          feePayer: user.publicKey,
          signerTa,

          establishment: establishment1.publicKey,

          creator: creatorPda,
          collection: creatorState.collection,

          membership: membership.publicKey,
          mint: NATIVE_MINT,

          mintNft: membershipNft.publicKey,
          subscriberAta,

          creatorAta,
          establishmentAta,

          metadata: metadataPDA,
          masterEdition: masterEditionPDA,
          metadataCollection: metadataCollectionPda,
          masterEditionCollection: masterEditionCollectionPDA,

          metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .preInstructions([
          ...wrapInstructions,
          createAssociatedTokenAccountInstruction(
            user.publicKey,
            establishmentAta,
            establishmentTreasury,
            NATIVE_MINT
          ),
          createAssociatedTokenAccountInstruction(
            user.publicKey,
            creatorAta,
            creatorTreasury,
            NATIVE_MINT
          ),
        ])
        .signers([user, membershipNft])
        .rpc();

      const totalPrice = membershipState.price.toNumber();
      const establishmentFee =
        (totalPrice * creatorState.establishmentFees.saleBasisPoints) / 10000;

      const netPrice = totalPrice - establishmentFee;

      const creatorAtaState = await spl.getAccount(
        provider.connection,
        creatorAta
      );
      const establishmentAtaState = await spl.getAccount(
        provider.connection,
        establishmentAta
      );

      assert.equal(creatorAtaState.amount.toString(), netPrice.toString());
      assert.equal(
        establishmentAtaState.amount.toString(),
        establishmentFee.toString()
      );

      const membershipNftAccount = await spl.getMint(
        provider.connection,
        membershipNft.publicKey
      );

      assert.equal(
        membershipNftAccount.mintAuthority.toBase58(),
        masterEditionPDA.toBase58()
      );
      assert.equal(membershipNftAccount.supply.toString(), "1");
      assert.equal(membershipNftAccount.decimals, 0);

      // assert that membership nft master edition has been created and populated
      const nftMasterEditionAccount = await provider.connection.getAccountInfo(
        masterEditionPDA
      );
      const nftMasterEditionInfo = MasterEditionV2.fromAccountInfo(
        nftMasterEditionAccount
      );

      assert.equal(nftMasterEditionInfo[0].supply, 0);
      assert.equal(nftMasterEditionInfo[0].maxSupply, 0);

      // assert that membership nft metadata has been created, signed and populated
      const nftMetadataAccount = await provider.connection.getAccountInfo(
        metadataPDA
      );
      const nftMetadataInfo = Metadata.fromAccountInfo(nftMetadataAccount);

      assert.equal(
        nftMetadataInfo[0].mint.toBase58(),
        membershipNft.publicKey.toBase58()
      );
      assert.equal(
        nftMetadataInfo[0].updateAuthority.toBase58(),
        creatorPda.toBase58()
      );
      assert.equal(nftMetadataInfo[0].isMutable, true);
      assert.equal(nftMetadataInfo[0].primarySaleHappened, false);
      assert.equal(nftMetadataInfo[0].uses, null);
      assert.equal(nftMetadataInfo[0].data.symbol.slice(0, 6), "symbol");
      assert.equal(nftMetadataInfo[0].data.name.slice(0, 4), "name");
      assert.equal(
        nftMetadataInfo[0].data.sellerFeeBasisPoints,
        membershipState.royalties
      );
      assert.equal(
        nftMetadataInfo[0].data.uri.replace(/\0/g, ""),
        `${base_uri}/${creatorPda}/${membership.publicKey.toBase58()}/1.json`
      );

      assert.equal(nftMetadataInfo[0].data.creators[0].verified, true);
      assert.equal(nftMetadataInfo[0].data.creators[0].share, 0);
      assert.equal(
        nftMetadataInfo[0].data.creators[1].address.toBase58(),
        creatorTreasury.toBase58()
      );

      assert.equal(
        nftMetadataInfo[0].data.creators[1].share,
        100 - creatorState.establishmentFees.royaltiesShare
      );
      assert.equal(
        nftMetadataInfo[0].data.creators[2].address.toBase58(),
        establishmentTreasury.toBase58()
      );
      assert.equal(
        nftMetadataInfo[0].data.creators[2].share,
        creatorState.establishmentFees.royaltiesShare
      );
      assert.equal(nftMetadataInfo[0].tokenStandard, 0);
      assert.equal(nftMetadataInfo[0].collectionDetails, null);

      // assert that collection has been set and verified
      assert.equal(nftMetadataInfo[0].collection.verified, true);
      assert.equal(
        nftMetadataInfo[0].collection.key.toBase58(),
        mintCollectionPDA.toBase58()
      );

      // assert that creator PDA state has been updated
      const creatorStateNew = await program.account.creator.fetch(creatorPda);

      assert.equal(creatorStateNew.totalSubscription.toNumber(), 1);
      assert.equal(creatorStateNew.totalRevenue.toNumber(), netPrice);

      // assert that membership PDA state has been updated
      const membershipStateNew = await program.account.membership.fetch(
        membership.publicKey
      );

      assert.equal(membershipStateNew.minted.toNumber(), 1);
      assert.equal(membershipStateNew.totalRevenue.toNumber(), netPrice);

      // assert that subscription PDA account has been created and populated
      const [subscription] = findSubscriptionPda(
        membershipNft.publicKey,
        program.programId
      );

      const subscriptionState = await program.account.subscription.fetch(
        subscription
      );

      assert.equal(subscriptionState.creator.toBase58(), creatorPda.toBase58());
      assert.equal(
        subscriptionState.membership.toBase58(),
        membership.publicKey.toBase58()
      );
      assert.equal(
        subscriptionState.mint.toBase58(),
        membershipNft.publicKey.toBase58()
      );
      assert.equal(subscriptionState.updatedAt.toNumber(), 0);
    });

    it("Should renew a subscription", async () => {
      const [creatorPda] = findCreatorPDA(
        creator1.publicKey,
        program.programId
      );

      const creatorState = await program.account.creator.fetch(creatorPda);
      const membershipState = await program.account.membership.fetch(
        membership.publicKey
      );

      const [establishmentTreasury] = findTreasuryPDA(
        establishment1.publicKey,
        program.programId
      );
      const [creatorTreasury] = findTreasuryPDA(creatorPda, program.programId);

      const subscriberAta = await getAssociatedTokenAddress(
        membershipNft.publicKey,
        user.publicKey
      );

      const establishmentAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        establishmentTreasury,
        true
      );
      const creatorAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        creatorTreasury,
        true
      );
      const signerTa = await getAssociatedTokenAddress(
        NATIVE_MINT,
        user.publicKey
      );

      const duration = 2;
      const wrapInstructions = [
        SystemProgram.transfer({
          fromPubkey: user.publicKey,
          toPubkey: signerTa,
          lamports: membershipState.price.toNumber() * duration,
        }),
        createSyncNativeInstruction(signerTa),
      ];

      await program.methods
        .renew(membershipState.price, duration)
        .accounts({
          signer: user.publicKey,
          feePayer: user.publicKey,
          signerTa,

          establishment: establishment1.publicKey,

          creator: creatorPda,
          collection: creatorState.collection,

          membership: membership.publicKey,
          mint: NATIVE_MINT,

          mintNft: membershipNft.publicKey,
          subscriberAta,

          creatorAta,
          establishmentAta,
        })
        .preInstructions([...wrapInstructions])
        .signers([user])
        .rpc();

      const unitPrice = membershipState.price.toNumber();
      const establishmentFee =
        (unitPrice * creatorState.establishmentFees.saleBasisPoints) / 10000;

      const netPrice = unitPrice - establishmentFee;

      const creatorAtaState = await spl.getAccount(
        provider.connection,
        creatorAta
      );
      const establishmentAtaState = await spl.getAccount(
        provider.connection,
        establishmentAta
      );

      assert.equal(
        creatorAtaState.amount.toString(),
        (netPrice * 3).toString()
      );
      assert.equal(
        establishmentAtaState.amount.toString(),
        (establishmentFee * 3).toString()
      );

      // assert that creator PDA state has been updated
      const creatorStateNew = await program.account.creator.fetch(creatorPda);

      assert.equal(creatorStateNew.totalRevenue.toNumber(), netPrice * 3);

      // assert that membership PDA state has been updated
      const membershipStateNew = await program.account.membership.fetch(
        membership.publicKey
      );

      assert.equal(membershipStateNew.totalRevenue.toNumber(), netPrice * 3);
    });
  });

  describe("withdraw", () => {
    it("Should withdraw establishment treasury", async () => {
      const [establishmentTreasury] = findTreasuryPDA(
        establishment1.publicKey,
        program.programId
      );
      const establishmentAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        establishmentTreasury,
        true
      );
      const establishmentAtaState = await spl.getAccount(
        provider.connection,
        establishmentAta
      );

      const authorityAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        establishment1Authority.publicKey,
        true
      );

      await program.methods
        .withdrawEstablishmentTreasury(
          new BN(establishmentAtaState.amount.toString())
        )
        .accounts({
          authority: establishment1Authority.publicKey,

          establishment: establishment1.publicKey,
          establishmentTreasury,
          mint: NATIVE_MINT,
          establishmentAta,
          authorityAta,
        })
        .preInstructions([
          createAssociatedTokenAccountInstruction(
            establishment1Authority.publicKey,
            authorityAta,
            establishment1Authority.publicKey,
            NATIVE_MINT
          ),
        ])
        .signers([establishment1Authority])
        .rpc();

      const establishmentAtaStateNew = await spl.getAccount(
        provider.connection,
        establishmentAta
      );

      assert.equal(establishmentAtaStateNew.amount.toString(), "0");
    });

    it("Should withdraw creator treasury", async () => {
      const [creatorPda] = findCreatorPDA(
        creator1.publicKey,
        program.programId
      );

      const [creatorTreasury] = findTreasuryPDA(creatorPda, program.programId);
      const creatorAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        creatorTreasury,
        true
      );
      const creatorAtaState = await spl.getAccount(
        provider.connection,
        creatorAta
      );

      const authorityAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        creator1.publicKey,
        true
      );

      await program.methods
        .withdrawCreatorTreasury(new BN(creatorAtaState.amount.toString()))
        .accounts({
          authority: creator1.publicKey,

          creator: creatorPda,
          creatorTreasury: creatorTreasury,
          mint: NATIVE_MINT,
          creatorAta,
          authorityAta,
        })
        .preInstructions([
          createAssociatedTokenAccountInstruction(
            creator1.publicKey,
            authorityAta,
            creator1.publicKey,
            NATIVE_MINT
          ),
        ])
        .signers([creator1])
        .rpc();

      const creatorAtaStateNew = await spl.getAccount(
        provider.connection,
        creatorAta
      );

      assert.equal(creatorAtaStateNew.amount.toString(), "0");
    });
  });
});
