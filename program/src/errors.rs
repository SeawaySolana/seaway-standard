use anchor_lang::prelude::*;

#[error_code]
pub enum SeawayError {
    #[msg("Royalties share too high")]
    RoyaltiesTooHigh,
    #[msg("Invalid authority")]
    InvalidAuthority,
    #[msg("Establishment is disabled")]
    EstablishmentIsDisabled,
    #[msg("Invalid membership or creator")]
    IndependentMembershipOrCreator,
    #[msg("Invalid membership mint")]
    InvalidMembershipMint,
    #[msg("Not enough tokens")]
    NotEnoughTokens,
    #[msg("Invalid membership price")]
    InvalidMembershipPrice,
    #[msg("Invalid membership creator")]
    InvalidMembershipCreator,
    #[msg("Membership disabled")]
    MembershipDisabled,
    #[msg("Invalid price")]
    InvalidPrice,
    #[msg("Membership out of stock")]
    MembershipOutOfStock,
    #[msg("Creator is disabled")]
    CreatorIsDisabled,
    #[msg("Membership is disabled")]
    MembershipIsDisabled,
}
