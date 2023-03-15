use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RegisterEstablishment<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    #[account(
        init,
        payer = fee_payer,
        space = ESTABLISHMENT_SIZE,
    )]
    pub establishment: Box<Account<'info, Establishment>>,
    #[account(
        seeds = [PREFIX_TREASURY.as_bytes(), establishment.key().as_ref()],
        bump,
    )]
    pub establishment_treasury: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn register_establishment(
    ctx: Context<RegisterEstablishment>,
    requires_sign_off: bool,
    sale_basis_points: u16,
    royalties_share: u8,
    uri: [u8; MAX_URI_LENGTH],
) -> Result<()> {
    require_gte!(100, royalties_share, SeawayError::RoyaltiesTooHigh);
    let establishment = Establishment {
        version: VERSION,
        treasury_bump: *ctx.bumps.get("establishment_treasury").unwrap(),
        treasury: ctx.accounts.establishment_treasury.key(),

        authority: ctx.accounts.authority.key(),

        requires_sign_off,
        sale_basis_points,
        royalties_share,
        is_active: true,
        scopes: [true; 10],
        base_uri: uri,

        padding: [0; 12],
    };

    emit!(RegisterEstablishmentEvent {
        version: VERSION,
        establishment_key: ctx.accounts.establishment.key(),
        establishment: EstablishmentEvent::from(establishment.clone()),
    });

    **ctx.accounts.establishment = establishment;

    Ok(())
}

#[event]
pub struct RegisterEstablishmentEvent {
    pub version: u8,
    pub establishment_key: Pubkey,
    pub establishment: EstablishmentEvent,
}
