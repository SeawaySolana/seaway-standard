use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct WithdrawCreatorTreasury<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account()]
    pub creator: Box<Account<'info, Creator>>,
    #[account(
        seeds = [PREFIX_TREASURY.as_bytes(), creator.key().as_ref()],
        bump = creator.treasury_bump,
    )]
    pub creator_treasury: SystemAccount<'info>,
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = creator_treasury
    )]
    pub creator_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = authority
    )]
    pub authority_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

impl<'info> WithdrawCreatorTreasury<'info> {
    fn withdraw(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.creator_ata.to_account_info(),
                to: self.authority_ata.to_account_info(),
                authority: self.creator_treasury.to_account_info(),
            },
        )
    }
}

pub fn withdraw_creator_treasury(ctx: Context<WithdrawCreatorTreasury>, amount: u64) -> Result<()> {
    let creator = &mut ctx.accounts.creator;

    require_keys_eq!(
        creator.authority,
        ctx.accounts.authority.key(),
        SeawayError::InvalidAuthority
    );

    emit!(WithdrawCreatorTreasuryEvent {
        version: VERSION,
        creator: CreatorEvent::from((***creator).clone()),
        amount
    });

    let creator_key = creator.key();
    // program signer
    let creator_seeds = [
        PREFIX_TREASURY.as_bytes(),
        creator_key.as_ref(),
        &[creator.treasury_bump],
    ];

    token::transfer(
        ctx.accounts.withdraw().with_signer(&[&creator_seeds[..]]),
        amount,
    )?;

    Ok(())
}

#[event]
pub struct WithdrawCreatorTreasuryEvent {
    pub version: u8,
    pub creator: CreatorEvent,
    pub amount: u64,
}
