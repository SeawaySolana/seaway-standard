use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use anchor_lang::prelude::*;
#[derive(Accounts)]
pub struct UpdateCreatorAuthority<'info> {
    #[account()]
    pub new_authority: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub creator: Box<Account<'info, Creator>>,
}

pub fn update_creator_authority(ctx: Context<UpdateCreatorAuthority>) -> Result<()> {
    let creator = &mut ctx.accounts.creator;
    require_keys_eq!(
        creator.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );
    require_keys_neq!(
        ctx.accounts.authority.key(),
        ctx.accounts.new_authority.key(),
        SeawayError::InvalidAuthority
    );

    creator.authority = ctx.accounts.new_authority.key();

    emit!(UpdateCreatorAuthorityEvent {
        version: VERSION,

        signer: ctx.accounts.authority.key(),
        creator_key: creator.key(),
        creator: CreatorEvent::from((***creator).clone()),
    });

    Ok(())
}

#[event]
pub struct UpdateCreatorAuthorityEvent {
    pub version: u8,
    pub signer: Pubkey,
    pub creator_key: Pubkey,
    pub creator: CreatorEvent,
}
