use crate::{constants::*, errors::SeawayError, state::*};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
#[instruction(price: u64)]
pub struct RegisterMembership<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    /// membership state account
    #[account(
        init,
        payer = fee_payer,
        space = MEMBERSHIP_SIZE,
    )]
    pub membership: Box<Account<'info, Membership>>,
    pub creator: Box<Account<'info, Creator>>,
    pub mint: Box<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn register_membership(
    ctx: Context<RegisterMembership>,
    price: u64,
    royalties: u16,
    supply: u64,
    name: [u8; 27],
    symbol: [u8; 10],
) -> Result<()> {
    let creator = &mut ctx.accounts.creator;
    require_keys_eq!(
        creator.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );

    let membership = Membership {
        version: VERSION,

        creator: ctx.accounts.creator.key(),
        price,
        royalties,
        supply,
        minted: 0,
        mint: ctx.accounts.mint.key(),
        is_active: true,

        name,
        symbol,

        total_revenue: 0,
        padding: [0; 12],
    };

    emit!(RegisterMembershipEvent {
        version: VERSION,
        creator: ctx.accounts.creator.key(),
        membership_key: ctx.accounts.membership.key(),
        membership: MembershipEvent::from(membership.clone()),
    });

    **ctx.accounts.membership = membership;

    Ok(())
}

#[event]
pub struct RegisterMembershipEvent {
    pub version: u8,

    pub creator: Pubkey,

    pub membership_key: Pubkey,
    pub membership: MembershipEvent,
}
