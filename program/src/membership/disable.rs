use crate::{constants::*, errors::SeawayError, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct DisableMembership<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        has_one = creator,
    )]
    pub membership: Box<Account<'info, Membership>>,
    pub creator: Account<'info, Creator>,
}

pub fn disable_membership(ctx: Context<DisableMembership>) -> Result<()> {
    let membership: &mut Account<Membership> = &mut ctx.accounts.membership;
    let creator = &mut ctx.accounts.creator;

    require_keys_eq!(
        creator.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );
    membership.is_active = false;

    emit!(DisableMembershipEvent {
        version: VERSION,
        signer: ctx.accounts.authority.key(),
        creator: ctx.accounts.creator.key(),

        membership_key: membership.key(),
        membership: MembershipEvent::from((**membership).clone()),
    });

    Ok(())
}

#[event]
pub struct DisableMembershipEvent {
    pub version: u8,

    pub signer: Pubkey,
    pub creator: Pubkey,

    pub membership_key: Pubkey,
    pub membership: MembershipEvent,
}
