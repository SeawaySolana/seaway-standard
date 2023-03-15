use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod state;
pub mod utils;

pub mod creator;
pub mod establishment;
pub mod membership;
pub mod subscription;

use crate::creator::*;
use crate::establishment::*;
use crate::membership::*;
use crate::subscription::*;

declare_id!("seaWAy2d8LDYjj9QaettiB653hXjKz4YWrgYb8PUWfz");

#[program]
pub mod seaway {
    use super::*;

    /// Instruction used to create an establishment.
    pub fn register_establishment<'info>(
        ctx: Context<RegisterEstablishment<'info>>,
        requires_sign_off: bool,
        sale_basis_points: u16,
        royalties_share: u8,
        uri: [u8; 94],
    ) -> Result<()> {
        establishment::register_establishment(
            ctx,
            requires_sign_off,
            sale_basis_points,
            royalties_share,
            uri,
        )
    }

    /// Instruction used to update an existing establishment
    pub fn update_establishment<'info>(
        ctx: Context<UpdateEstablishment<'info>>,
        uri: Option<[u8; 94]>,
        requires_sign_off: Option<bool>,
        sale_basis_points: Option<u16>,
        royalties_share: Option<u8>,
        is_active: Option<bool>,
    ) -> Result<()> {
        establishment::update_establishment(
            ctx,
            uri,
            requires_sign_off,
            sale_basis_points,
            royalties_share,
            is_active,
        )
    }

    /// Instruction used to change the authority of an establishment
    pub fn update_establishment_authority<'info>(
        ctx: Context<UpdateEstablishmentAuthority<'info>>,
    ) -> Result<()> {
        establishment::update_establishment_authority(ctx)
    }

    /// Instruction used to withdraw from a establishment treasury
    pub fn withdraw_establishment_treasury<'info>(
        ctx: Context<WithdrawEstablishmentTreasury<'info>>,
        amount: u64,
    ) -> Result<()> {
        establishment::withdraw_establishment_treasury(ctx, amount)
    }

    /// Instruction used to create a creator.
    pub fn register_creator<'info>(
        ctx: Context<RegisterCreator<'info>>,
        name: [u8; 32],
        symbol: [u8; 10],
    ) -> Result<()> {
        creator::register_creator(ctx, name, symbol)
    }

    /// Instruction used to withdraw from a creator treasury
    pub fn withdraw_creator_treasury<'info>(
        ctx: Context<WithdrawCreatorTreasury<'info>>,
        amount: u64,
    ) -> Result<()> {
        creator::withdraw_creator_treasury(ctx, amount)
    }

    /// Instruction used to change the authority of a creator
    pub fn update_creator_authority<'info>(
        ctx: Context<UpdateCreatorAuthority<'info>>,
    ) -> Result<()> {
        creator::update_creator_authority(ctx)
    }

    /// Instruction used to create a membership
    pub fn register_membership<'info>(
        ctx: Context<RegisterMembership<'info>>,
        price: u64,
        royalties: u16,
        supply: u64,

        name: [u8; 27],
        symbol: [u8; 10],
    ) -> Result<()> {
        membership::register_membership(ctx, price, royalties, supply, name, symbol)
    }

    /// Instruction used to disable
    pub fn disable_membership<'info>(ctx: Context<DisableMembership<'info>>) -> Result<()> {
        membership::disable_membership(ctx)
    }

    /// Instruction to subscribe to a membership
    pub fn subscribe<'info>(
        ctx: Context<Subscribe<'info>>,
        price: u64,
        duration_in_months: Option<u16>,
    ) -> Result<()> {
        subscription::subscribe(ctx, price, duration_in_months)
    }

    // Instruction to renew an existing subscription for one or more months duration
    pub fn renew<'info>(
        ctx: Context<Renew>,
        price: u64,
        duration_in_months: Option<u16>,
    ) -> Result<()> {
        subscription::renew(ctx, price, duration_in_months)
    }
}
