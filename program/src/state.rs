use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
/// Establishment struct
/// Establishment are representing web application that will creates the offchain metadata of the membership and subscription.
///
/// Establishment can charge fees on every subscription and/or add royalties to subscriptions NFT.
/// Creators can create their own establishment if they want to be independent.
pub struct Establishment {
    /// Version
    pub version: u8,
    /// Treasury bump
    pub treasury_bump: u8,
    /// PDA that will be the authority over every token account.
    pub treasury: Pubkey,
    /// Establishments can delegate authority to a specific pubkey.
    pub authority: Pubkey,
    /// Require signature when attaching a creator.
    pub requires_sign_off: bool,
    /// Basis points that goes to the establishment on a subscription.
    pub sale_basis_points: u16,
    /// Royalties share that goes to the establishment on every sales of any membership NFT.
    pub royalties_share: u8,
    /// Is establishment accepting new creator.
    pub is_active: bool,
    /// Scopes of the establishment.
    /// Useless at the moment. But later establishment should be able to update some fields of their creators.
    pub scopes: [bool; MAX_NUM_SCOPES],
    /// The base uri used in every membership NFTs related to a creator operating in this establishment.
    /// Should be padded with null bytes.
    pub base_uri: [u8; MAX_URI_LENGTH],
    /// Padding because we never know.
    pub padding: [u64; 12],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct EstablishmentEvent {
    pub version: u8,
    pub treasury_bump: u8,
    pub treasury: Pubkey,
    pub authority: Pubkey,
    pub requires_sign_off: bool,
    pub sale_basis_points: u16,
    pub royalties_share: u8,
    pub is_active: bool,
    pub scopes: [bool; MAX_NUM_SCOPES],
    pub base_uri: [u8; MAX_URI_LENGTH],
    pub padding: [u64; 12],
}

impl From<Establishment> for EstablishmentEvent {
    fn from(b: Establishment) -> EstablishmentEvent {
        unsafe { std::mem::transmute(b) }
    }
}
#[account]
/// Creator struct
/// Creators are the principal actors of the program.
/// They create membership that people can subscribe to.
pub struct Creator {
    /// Version
    pub version: u8,
    /// Bump, all creators accounts are PDAs.
    pub bump: u8,
    /// Treasury bump
    pub treasury_bump: u8,
    /// PDA that will be the authority over every token account.
    pub treasury: Pubkey,
    /// Signer that created the creator account.
    pub owner: Pubkey,
    /// Establishments can delegate authority to a specific pubkey.
    pub authority: Pubkey,
    /// Mint account storing the collection account.
    /// Used to sign membership NFT and attached them to the creator's collection.
    pub collection: Pubkey,
    /// Establishment associated to the creator.
    pub establishment: Pubkey,
    /// Establishment at the time of the creator joined.
    pub establishment_fees: EstablishmentFees,
    /// Is the creator accepting new subscriptions.
    pub is_active: bool,
    /// Total subscription bought for this creator.
    pub total_subscription: u64,
    /// Total revenue generated by the creator.
    pub total_revenue: u64,

    pub padding: [u64; 12],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
/// We copy the establishment fees to the creator struct.
/// This will protect creators in case we allow establishments
/// to update their state.
pub struct EstablishmentFees {
    /// Basis points that goes to the establishment on a subscription.
    pub sale_basis_points: u16,
    /// Royalties that goes to the establishment on every membership NFT.
    pub royalties_share: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreatorEvent {
    pub version: u8,
    pub bump: u8,
    pub treasury_bump: u8,
    pub treasury: Pubkey,
    pub owner: Pubkey,
    pub authority: Pubkey,
    pub collection: Pubkey,
    pub establishment: Pubkey,
    pub establishment_fees: EstablishmentFees,
    pub is_active: bool,
    pub total_subscription: u64,
    pub total_revenue: u64,
    pub padding: [u64; 12],
}

impl From<Creator> for CreatorEvent {
    fn from(b: Creator) -> CreatorEvent {
        unsafe { std::mem::transmute(b) }
    }
}

#[account]
/// Membership struct
pub struct Membership {
    /// Version
    pub version: u8,
    /// Creator associated with this membership
    pub creator: Pubkey,
    /// Token that has to be used to subscribe.
    /// SPL token only. Use WSOL for solana.
    pub mint: Pubkey,
    /// Price of the membership.
    /// Decimals depends on the mint
    pub price: u64,
    /// Royalties of the subscription NFTs.
    pub royalties: u16,

    /// Max number of subscription.
    /// 0 == infinite (in reality the max is 9999999999)
    /// because of the URL limit.
    pub supply: u64,
    /// Actual number of subscription
    pub minted: u64,

    /// Is the membership accepting renewal and new subscriptions.
    pub is_active: bool,

    /// Name to use in the metadata file of the subscriptions NFT.
    pub name: [u8; 27],
    /// Symbol to use in the metadata file subscriptions NFT.
    pub symbol: [u8; 10],

    /// Revenue generated by the membership.
    pub total_revenue: u64,

    pub padding: [u64; 12],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MembershipEvent {
    pub version: u8,
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub price: u64,
    pub royalties: u16,
    pub supply: u64,
    pub minted: u64,
    pub is_active: bool,
    pub name: [u8; 27],
    pub symbol: [u8; 10],
    pub total_revenue: u64,
    pub padding: [u64; 12],
}

impl From<Membership> for MembershipEvent {
    fn from(b: Membership) -> MembershipEvent {
        unsafe { std::mem::transmute(b) }
    }
}

#[account]
/// Subscription struct
/// Represents a specific subscription.
/// Is created when calling the subscribe instruction
pub struct Subscription {
    /// Version
    pub version: u8,
    /// Version
    pub bump: u8,
    /// Creator associated with the subscription.
    pub creator: Pubkey,
    /// Membership associated with the subscription.
    pub membership: Pubkey,

    /// Each subscription is represented by a NFT.
    pub mint: Pubkey,

    /// Timestamp of the first subscritpion.
    pub created_at: i64,
    /// Timestamp of the last renew.
    pub updated_at: i64,
    /// Expiration date of the subscription
    pub expired_at: i64,

    pub padding: [u64; 12],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SubscriptionEvent {
    pub version: u8,
    pub bump: u8,
    pub creator: Pubkey,
    pub membership: Pubkey,
    pub mint: Pubkey,

    pub created_at: i64,
    pub updated_at: i64,
    pub expired_at: i64,

    pub padding: [u64; 12],
}

impl From<Subscription> for SubscriptionEvent {
    fn from(b: Subscription) -> SubscriptionEvent {
        unsafe { std::mem::transmute(b) }
    }
}