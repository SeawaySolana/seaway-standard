/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ErrorWithCode = Error & { code: number };
type MaybeErrorWithCode = ErrorWithCode | null | undefined;

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map();
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map();

/**
 * RoyaltiesTooHigh: 'Royalties share too high'
 *
 * @category Errors
 * @category generated
 */
export class RoyaltiesTooHighError extends Error {
  readonly code: number = 0x1770;
  readonly name: string = "RoyaltiesTooHigh";
  constructor() {
    super("Royalties share too high");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, RoyaltiesTooHighError);
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new RoyaltiesTooHighError());
createErrorFromNameLookup.set(
  "RoyaltiesTooHigh",
  () => new RoyaltiesTooHighError()
);

/**
 * InvalidAuthority: 'Invalid authority'
 *
 * @category Errors
 * @category generated
 */
export class InvalidAuthorityError extends Error {
  readonly code: number = 0x1771;
  readonly name: string = "InvalidAuthority";
  constructor() {
    super("Invalid authority");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidAuthorityError);
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new InvalidAuthorityError());
createErrorFromNameLookup.set(
  "InvalidAuthority",
  () => new InvalidAuthorityError()
);

/**
 * EstablishmentIsDisabled: 'Establishment is disabled'
 *
 * @category Errors
 * @category generated
 */
export class EstablishmentIsDisabledError extends Error {
  readonly code: number = 0x1772;
  readonly name: string = "EstablishmentIsDisabled";
  constructor() {
    super("Establishment is disabled");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, EstablishmentIsDisabledError);
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new EstablishmentIsDisabledError());
createErrorFromNameLookup.set(
  "EstablishmentIsDisabled",
  () => new EstablishmentIsDisabledError()
);

/**
 * IndependentMembershipOrCreator: 'Invalid membership or creator'
 *
 * @category Errors
 * @category generated
 */
export class IndependentMembershipOrCreatorError extends Error {
  readonly code: number = 0x1773;
  readonly name: string = "IndependentMembershipOrCreator";
  constructor() {
    super("Invalid membership or creator");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, IndependentMembershipOrCreatorError);
    }
  }
}

createErrorFromCodeLookup.set(
  0x1773,
  () => new IndependentMembershipOrCreatorError()
);
createErrorFromNameLookup.set(
  "IndependentMembershipOrCreator",
  () => new IndependentMembershipOrCreatorError()
);

/**
 * InvalidMembershipMint: 'Invalid membership mint'
 *
 * @category Errors
 * @category generated
 */
export class InvalidMembershipMintError extends Error {
  readonly code: number = 0x1774;
  readonly name: string = "InvalidMembershipMint";
  constructor() {
    super("Invalid membership mint");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidMembershipMintError);
    }
  }
}

createErrorFromCodeLookup.set(0x1774, () => new InvalidMembershipMintError());
createErrorFromNameLookup.set(
  "InvalidMembershipMint",
  () => new InvalidMembershipMintError()
);

/**
 * NotEnoughTokens: 'Not enough tokens'
 *
 * @category Errors
 * @category generated
 */
export class NotEnoughTokensError extends Error {
  readonly code: number = 0x1775;
  readonly name: string = "NotEnoughTokens";
  constructor() {
    super("Not enough tokens");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, NotEnoughTokensError);
    }
  }
}

createErrorFromCodeLookup.set(0x1775, () => new NotEnoughTokensError());
createErrorFromNameLookup.set(
  "NotEnoughTokens",
  () => new NotEnoughTokensError()
);

/**
 * InvalidMembershipPrice: 'Invalid membership price'
 *
 * @category Errors
 * @category generated
 */
export class InvalidMembershipPriceError extends Error {
  readonly code: number = 0x1776;
  readonly name: string = "InvalidMembershipPrice";
  constructor() {
    super("Invalid membership price");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidMembershipPriceError);
    }
  }
}

createErrorFromCodeLookup.set(0x1776, () => new InvalidMembershipPriceError());
createErrorFromNameLookup.set(
  "InvalidMembershipPrice",
  () => new InvalidMembershipPriceError()
);

/**
 * InvalidMembershipCreator: 'Invalid membership creator'
 *
 * @category Errors
 * @category generated
 */
export class InvalidMembershipCreatorError extends Error {
  readonly code: number = 0x1777;
  readonly name: string = "InvalidMembershipCreator";
  constructor() {
    super("Invalid membership creator");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidMembershipCreatorError);
    }
  }
}

createErrorFromCodeLookup.set(
  0x1777,
  () => new InvalidMembershipCreatorError()
);
createErrorFromNameLookup.set(
  "InvalidMembershipCreator",
  () => new InvalidMembershipCreatorError()
);

/**
 * MembershipDisabled: 'Membership disabled'
 *
 * @category Errors
 * @category generated
 */
export class MembershipDisabledError extends Error {
  readonly code: number = 0x1778;
  readonly name: string = "MembershipDisabled";
  constructor() {
    super("Membership disabled");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, MembershipDisabledError);
    }
  }
}

createErrorFromCodeLookup.set(0x1778, () => new MembershipDisabledError());
createErrorFromNameLookup.set(
  "MembershipDisabled",
  () => new MembershipDisabledError()
);

/**
 * InvalidPrice: 'Invalid price'
 *
 * @category Errors
 * @category generated
 */
export class InvalidPriceError extends Error {
  readonly code: number = 0x1779;
  readonly name: string = "InvalidPrice";
  constructor() {
    super("Invalid price");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, InvalidPriceError);
    }
  }
}

createErrorFromCodeLookup.set(0x1779, () => new InvalidPriceError());
createErrorFromNameLookup.set("InvalidPrice", () => new InvalidPriceError());

/**
 * MembershipOutOfStock: 'Membership out of stock'
 *
 * @category Errors
 * @category generated
 */
export class MembershipOutOfStockError extends Error {
  readonly code: number = 0x177a;
  readonly name: string = "MembershipOutOfStock";
  constructor() {
    super("Membership out of stock");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, MembershipOutOfStockError);
    }
  }
}

createErrorFromCodeLookup.set(0x177a, () => new MembershipOutOfStockError());
createErrorFromNameLookup.set(
  "MembershipOutOfStock",
  () => new MembershipOutOfStockError()
);

/**
 * CreatorIsDisabled: 'Creator is disabled'
 *
 * @category Errors
 * @category generated
 */
export class CreatorIsDisabledError extends Error {
  readonly code: number = 0x177b;
  readonly name: string = "CreatorIsDisabled";
  constructor() {
    super("Creator is disabled");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, CreatorIsDisabledError);
    }
  }
}

createErrorFromCodeLookup.set(0x177b, () => new CreatorIsDisabledError());
createErrorFromNameLookup.set(
  "CreatorIsDisabled",
  () => new CreatorIsDisabledError()
);

/**
 * MembershipIsDisabled: 'Membership is disabled'
 *
 * @category Errors
 * @category generated
 */
export class MembershipIsDisabledError extends Error {
  readonly code: number = 0x177c;
  readonly name: string = "MembershipIsDisabled";
  constructor() {
    super("Membership is disabled");
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, MembershipIsDisabledError);
    }
  }
}

createErrorFromCodeLookup.set(0x177c, () => new MembershipIsDisabledError());
createErrorFromNameLookup.set(
  "MembershipIsDisabled",
  () => new MembershipIsDisabledError()
);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code);
  return createError != null ? createError() : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name);
  return createError != null ? createError() : null;
}
