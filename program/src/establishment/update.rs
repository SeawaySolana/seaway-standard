use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateEstablishment<'info> {
    #[account()]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub establishment: Box<Account<'info, Establishment>>,
}

pub fn update_establishment(
    ctx: Context<UpdateEstablishment>,
    base_uri: Option<[u8; MAX_URI_LENGTH]>,
    requires_sign_off: Option<bool>,
    sale_basis_points: Option<u16>,
    royalties_share: Option<u8>,
    is_active: Option<bool>,
) -> Result<()> {
    let establishment = &mut ctx.accounts.establishment;

    require_keys_eq!(
        establishment.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );

    if let Some(base_uri) = base_uri {
        establishment.base_uri = base_uri;
    }

    if let Some(requires_sign_off) = requires_sign_off {
        establishment.requires_sign_off = requires_sign_off;
    }

    if let Some(sale_basis_points) = sale_basis_points {
        establishment.sale_basis_points = sale_basis_points;
    }

    if let Some(royalties_share) = royalties_share {
        require_gte!(100, royalties_share, SeawayError::RoyaltiesTooHigh);
        establishment.royalties_share = royalties_share;
    }

    if let Some(is_active) = is_active {
        establishment.is_active = is_active;
    }

    emit!(UpdateEstablishmentEvent {
        version: VERSION,

        signer: ctx.accounts.authority.key(),
        establishment_key: establishment.key(),
        establishment: EstablishmentEvent::from((***establishment).clone()),
    });

    Ok(())
}

#[event]
pub struct UpdateEstablishmentEvent {
    pub version: u8,
    pub signer: Pubkey,
    pub establishment_key: Pubkey,
    pub establishment: EstablishmentEvent,
}
