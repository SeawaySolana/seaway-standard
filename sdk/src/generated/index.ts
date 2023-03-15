import { PublicKey } from "@solana/web3.js";
export * from "./accounts";
export * from "./errors";
export * from "./instructions";
export * from "./types";

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ADDRESS = "seaWAy2d8LDYjj9QaettiB653hXjKz4YWrgYb8PUWfz";

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS);
