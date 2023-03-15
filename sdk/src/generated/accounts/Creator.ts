/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from "@solana/web3.js";
import * as beet from "@metaplex-foundation/beet";
import * as beetSolana from "@metaplex-foundation/beet-solana";
import {
  EstablishmentFees,
  establishmentFeesBeet,
} from "../types/EstablishmentFees";

/**
 * Arguments used to create {@link Creator}
 * @category Accounts
 * @category generated
 */
export type CreatorArgs = {
  version: number;
  bump: number;
  treasuryBump: number;
  treasury: web3.PublicKey;
  owner: web3.PublicKey;
  authority: web3.PublicKey;
  collection: web3.PublicKey;
  establishment: web3.PublicKey;
  establishmentFees: EstablishmentFees;
  isActive: boolean;
  totalSubscription: beet.bignum;
  totalRevenue: beet.bignum;
  padding: beet.bignum[] /* size: 12 */;
};

export const creatorDiscriminator = [237, 37, 233, 153, 165, 132, 54, 103];
/**
 * Holds the data for the {@link Creator} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Creator implements CreatorArgs {
  private constructor(
    readonly version: number,
    readonly bump: number,
    readonly treasuryBump: number,
    readonly treasury: web3.PublicKey,
    readonly owner: web3.PublicKey,
    readonly authority: web3.PublicKey,
    readonly collection: web3.PublicKey,
    readonly establishment: web3.PublicKey,
    readonly establishmentFees: EstablishmentFees,
    readonly isActive: boolean,
    readonly totalSubscription: beet.bignum,
    readonly totalRevenue: beet.bignum,
    readonly padding: beet.bignum[] /* size: 12 */
  ) {}

  /**
   * Creates a {@link Creator} instance from the provided args.
   */
  static fromArgs(args: CreatorArgs) {
    return new Creator(
      args.version,
      args.bump,
      args.treasuryBump,
      args.treasury,
      args.owner,
      args.authority,
      args.collection,
      args.establishment,
      args.establishmentFees,
      args.isActive,
      args.totalSubscription,
      args.totalRevenue,
      args.padding
    );
  }

  /**
   * Deserializes the {@link Creator} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Creator, number] {
    return Creator.deserialize(accountInfo.data, offset);
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Creator} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<Creator> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    );
    if (accountInfo == null) {
      throw new Error(`Unable to find Creator account at ${address}`);
    }
    return Creator.fromAccountInfo(accountInfo, 0)[0];
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      "seaWAy2d8LDYjj9QaettiB653hXjKz4YWrgYb8PUWfz"
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, creatorBeet);
  }

  /**
   * Deserializes the {@link Creator} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Creator, number] {
    return creatorBeet.deserialize(buf, offset);
  }

  /**
   * Serializes the {@link Creator} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return creatorBeet.serialize({
      accountDiscriminator: creatorDiscriminator,
      ...this,
    });
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Creator}
   */
  static get byteSize() {
    return creatorBeet.byteSize;
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Creator} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Creator.byteSize,
      commitment
    );
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link Creator} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === Creator.byteSize;
  }

  /**
   * Returns a readable version of {@link Creator} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      version: this.version,
      bump: this.bump,
      treasuryBump: this.treasuryBump,
      treasury: this.treasury.toBase58(),
      owner: this.owner.toBase58(),
      authority: this.authority.toBase58(),
      collection: this.collection.toBase58(),
      establishment: this.establishment.toBase58(),
      establishmentFees: this.establishmentFees,
      isActive: this.isActive,
      totalSubscription: (() => {
        const x = <{ toNumber: () => number }>this.totalSubscription;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      totalRevenue: (() => {
        const x = <{ toNumber: () => number }>this.totalRevenue;
        if (typeof x.toNumber === "function") {
          try {
            return x.toNumber();
          } catch (_) {
            return x;
          }
        }
        return x;
      })(),
      padding: this.padding,
    };
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const creatorBeet = new beet.BeetStruct<
  Creator,
  CreatorArgs & {
    accountDiscriminator: number[] /* size: 8 */;
  }
>(
  [
    ["accountDiscriminator", beet.uniformFixedSizeArray(beet.u8, 8)],
    ["version", beet.u8],
    ["bump", beet.u8],
    ["treasuryBump", beet.u8],
    ["treasury", beetSolana.publicKey],
    ["owner", beetSolana.publicKey],
    ["authority", beetSolana.publicKey],
    ["collection", beetSolana.publicKey],
    ["establishment", beetSolana.publicKey],
    ["establishmentFees", establishmentFeesBeet],
    ["isActive", beet.bool],
    ["totalSubscription", beet.u64],
    ["totalRevenue", beet.u64],
    ["padding", beet.uniformFixedSizeArray(beet.u64, 12)],
  ],
  Creator.fromArgs,
  "Creator"
);
