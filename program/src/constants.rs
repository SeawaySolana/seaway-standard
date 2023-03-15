pub const VERSION: u8 = 1;

pub const PREFIX_CREATOR: &str = "creator";
pub const PREFIX_COLLECTION: &str = "collection";
pub const PREFIX_SUBSCRIPTION: &str = "subscription";
pub const PREFIX_TREASURY: &str = "treasury";

/// Max uri length for establishment
/// Computatation:
/// 200 = Metaplex max URI length
/// 44 * 2 = max length of 2 pubkeys
/// 10 = len(MAX_SUBSCRIPTION)
/// 8 = len(/{pubkey1}/{pubkey2}/{id}.json)
// pub const MAX_URI_LENGTH: usize = 200 - (44 * 2) - 10 - 8;
pub const MAX_URI_LENGTH: usize = 94;
pub const MAX_SUBSCRIPTION: usize = 9999999999;

pub const MAX_NUM_SCOPES: usize = 10;
pub const PADDING: usize = 12 * 8;

pub const ESTABLISHMENT_SIZE: usize = PADDING +
8 +                                    // Discriminator
1 +                                    // Version
1 +                                    // Treasury bump
32 +                                   // Treasury
32 +                                   // Authority
1 +                                    // Requires sign off
2 +                                    // Sale fees
1 +                                    // Royalties share
1 +                                    // Is active
MAX_NUM_SCOPES +                       // Scopes
MAX_URI_LENGTH;

pub const CREATOR_SIZE: usize = PADDING +
8 +                                    // Discriminator
1 +                                    // Version
1 +                                    // Bump
1 +                                    // Treasury bump
32 +                                   // Treasury
32 +                                   // Owner
32 +                                   // Authority
32 +                                   // Treasury
32 +                                   // Collection
32 +                                   // Establishment
4 +                                    // Establishment fees struct
1 +                                    // Is active
64 +                                   // Total subscriptions
64; // Total revenue

pub const MEMBERSHIP_SIZE: usize = PADDING +
8 +                                    // Discriminator
1 +                                    // Version
32 +                                   // Creator
32 +                                   // Mint
8 +                                    // Price
2 +                                    // Royalties
8 +                                    // Supply
8  +                                   // Minted
1  +                                   // Is active
27 +                                   // Name: [u8; 27],
10 +                                   // Symbol: [u8; 10],
64; // Total revenue

pub const SUBSCRIPTION_SIZE: usize = PADDING +
8 +                                    // Discriminator
1 +                                    // Version
1 +                                    // Bump
32 +                                   // Creator
32 +                                   // Membership
32 +                                   // Mint
8 +                                    // Created at
9 +                                    // Updated at
8; // Expired at
