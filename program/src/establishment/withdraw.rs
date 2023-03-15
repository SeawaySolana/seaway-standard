use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct WithdrawEstablishmentTreasury<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account()]
    pub establishment: Box<Account<'info, Establishment>>,
    #[account(
        seeds = [PREFIX_TREASURY.as_bytes(), establishment.key().as_ref()],
        bump = establishment.treasury_bump,
    )]
    pub establishment_treasury: SystemAccount<'info>,
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = establishment_treasury
    )]
    pub establishment_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority
    )]
    pub authority_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

impl<'info> WithdrawEstablishmentTreasury<'info> {
    fn withdraw(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.establishment_ata.to_account_info(),
                to: self.authority_ata.to_account_info(),
                authority: self.establishment_treasury.to_account_info(),
            },
        )
    }
}

pub fn withdraw_establishment_treasury(
    ctx: Context<WithdrawEstablishmentTreasury>,
    amount: u64,
) -> Result<()> {
    let establishment = &mut ctx.accounts.establishment;

    require_keys_eq!(
        establishment.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );

    emit!(WithdrawEstablishmentTreasuryEvent {
        version: VERSION,
        establishment: EstablishmentEvent::from((***establishment).clone()),
        amount
    });

    let establishment_key = establishment.key();
    // program signer
    let establishment_seeds = [
        PREFIX_TREASURY.as_bytes(),
        establishment_key.as_ref(),
        &[establishment.treasury_bump],
    ];

    token::transfer(
        ctx.accounts
            .withdraw()
            .with_signer(&[&establishment_seeds[..]]),
        amount,
    )?;

    Ok(())
}

#[event]
pub struct WithdrawEstablishmentTreasuryEvent {
    pub version: u8,
    pub establishment: EstablishmentEvent,
    pub amount: u64,
}
