use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use anchor_lang::prelude::*;
#[derive(Accounts)]
pub struct UpdateEstablishmentAuthority<'info> {
    #[account()]
    pub new_authority: Signer<'info>,
    #[account()]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub establishment: Box<Account<'info, Establishment>>,
}

pub fn update_establishment_authority(ctx: Context<UpdateEstablishmentAuthority>) -> Result<()> {
    let establishment = &mut ctx.accounts.establishment;
    require_keys_eq!(
        establishment.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );
    require_keys_neq!(
        ctx.accounts.authority.key(),
        ctx.accounts.new_authority.key(),
        SeawayError::InvalidAuthority
    );

    establishment.authority = ctx.accounts.new_authority.key();

    emit!(UpdateEstablishmentAuthorityEvent {
        version: VERSION,

        signer: ctx.accounts.authority.key(),
        establishment_key: establishment.key(),
        establishment: EstablishmentEvent::from((***establishment).clone()),
    });

    Ok(())
}

#[event]
pub struct UpdateEstablishmentAuthorityEvent {
    pub version: u8,
    pub signer: Pubkey,
    pub establishment_key: Pubkey,
    pub establishment: EstablishmentEvent,
}
