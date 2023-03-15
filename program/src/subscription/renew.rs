use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use crate::utils::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
#[instruction(price: u64, duration_in_months: Option<u16>)]
pub struct Renew<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = signer,
        constraint = signer_ta.amount >= (price * duration_in_months.unwrap_or(1) as u64) @ SeawayError::NotEnoughTokens,
    )]
    pub signer_ta: Box<Account<'info, TokenAccount>>,
    pub establishment: Box<Account<'info, Establishment>>,

    #[account(mut, has_one = collection, has_one = establishment)]
    pub creator: Box<Account<'info, Creator>>,
    pub collection: Box<Account<'info, Mint>>,

    #[account(
        mut,
        has_one = mint @SeawayError::InvalidMembershipMint,
        has_one = creator @SeawayError::InvalidMembershipCreator,
        constraint = membership.price == price @SeawayError::InvalidMembershipPrice,
        constraint = membership.is_active @SeawayError::MembershipDisabled,
    )]
    pub membership: Box<Account<'info, Membership>>,
    pub mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        seeds = [PREFIX_SUBSCRIPTION.as_bytes(), mint_nft.key().as_ref()],
        bump = subscription.bump,
    )]
    pub subscription: Box<Account<'info, Subscription>>,
    #[account()]
    pub mint_nft: Box<Account<'info, Mint>>,
    #[account(
        associated_token::mint = mint_nft,
        associated_token::authority = signer,
        constraint = subscriber_ata.amount == 1
    )]
    pub subscriber_ata: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = creator.treasury
    )]
    pub creator_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = establishment.treasury,
    )]
    pub establishment_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> Renew<'info> {
    fn pay_creator(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.signer_ta.to_account_info(),
                to: self.creator_ata.to_account_info(),
                authority: self.signer.to_account_info(),
            },
        )
    }

    fn pay_establishment(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            Transfer {
                from: self.signer_ta.to_account_info(),
                to: self.establishment_ata.to_account_info(),
                authority: self.signer.to_account_info(),
            },
        )
    }
}

pub fn renew(ctx: Context<Renew>, price: u64, duration_in_months: Option<u16>) -> Result<()> {
    let membership = &ctx.accounts.membership;
    let creator = &ctx.accounts.creator;

    require!(creator.is_active, SeawayError::CreatorIsDisabled);
    require!(membership.is_active, SeawayError::MembershipIsDisabled);
    require_eq!(membership.price, price, SeawayError::InvalidPrice);

    let duration = duration_in_months.unwrap_or(1);
    let total_price = membership.price * duration as u64;

    let establishment_fee =
        total_price * creator.establishment_fees.sale_basis_points as u64 / 10000;
    let net_revenue = total_price - establishment_fee;

    if membership.price > 0 {
        token::transfer(ctx.accounts.pay_creator(), net_revenue)?;
        if establishment_fee > 0 {
            token::transfer(ctx.accounts.pay_establishment(), establishment_fee)?;
        }
    }

    let clock: Clock = Clock::get()?;
    let membership = &mut ctx.accounts.membership;
    let creator = &mut ctx.accounts.creator;
    let subscription = &mut ctx.accounts.subscription;

    let starting_timestamp = if clock.unix_timestamp > subscription.expired_at {
        clock.unix_timestamp
    } else {
        subscription.expired_at
    };
    let expiration_timestamp = get_plus_months_expiration_timestamp(starting_timestamp, duration);

    subscription.updated_at = clock.unix_timestamp;
    subscription.expired_at = expiration_timestamp;

    membership.total_revenue += net_revenue;
    creator.total_revenue += net_revenue;

    emit!(RenewSubscriptionEvent {
        version: VERSION,
        signer: ctx.accounts.signer.key(),
        subscription_key: subscription.key(),
        membership_key: membership.key(),
        creator_key: creator.key(),
        subscription: SubscriptionEvent::from((***subscription).clone()),
        membership: MembershipEvent::from((***membership).clone()),
        creator: CreatorEvent::from((***creator).clone()),
        price,
        duration,
        number: membership.minted,
        net_revenue,
    });

    Ok(())
}

#[event]
pub struct RenewSubscriptionEvent {
    pub version: u8,
    pub signer: Pubkey,

    pub subscription_key: Pubkey,
    pub membership_key: Pubkey,
    pub creator_key: Pubkey,

    pub subscription: SubscriptionEvent,
    pub membership: MembershipEvent,
    pub creator: CreatorEvent,

    pub price: u64,
    pub number: u64,
    pub duration: u16,
    pub net_revenue: u64,
}
