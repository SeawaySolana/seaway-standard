use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use crate::utils::*;
use anchor_lang::prelude::*;

use anchor_spl::metadata::create_master_edition_v3;
use anchor_spl::metadata::create_metadata_accounts_v3;
use anchor_spl::metadata::set_and_verify_collection;
use anchor_spl::metadata::sign_metadata;
use anchor_spl::metadata::CreateMasterEditionV3;
use anchor_spl::metadata::CreateMetadataAccountsV3;
use anchor_spl::metadata::Metadata;
use anchor_spl::metadata::SetAndVerifyCollection;
use anchor_spl::metadata::SignMetadata;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount, Transfer},
};

use mpl_token_metadata::state::Collection;
use mpl_token_metadata::state::DataV2;

/// accounts for the[`subscribe` handler](fanclub/fn.subscribe.html).
#[derive(Accounts)]
#[instruction(price: u64, duration_in_months: Option<u16>)]
pub struct Subscribe<'info> {
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
        init,
        seeds = [PREFIX_SUBSCRIPTION.as_bytes(), mint_nft.key().as_ref()],
        bump,
        payer = fee_payer,
        space = SUBSCRIPTION_SIZE,
    )]
    pub subscription: Box<Account<'info, Subscription>>,
    #[account(
        init,
        payer = fee_payer,
        mint::decimals = 0,
        mint::authority = creator,
        mint::freeze_authority = creator,
    )]
    pub mint_nft: Box<Account<'info, Mint>>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint_nft,
        associated_token::authority = signer,
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

    /// CHECK: account checked in CPI
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,
    /// CHECK: checked in CPI
    #[account(mut)]
    pub metadata_collection: UncheckedAccount<'info>,
    /// CHECK: checked in CPI
    #[account(mut)]
    pub master_edition_collection: UncheckedAccount<'info>,

    pub metadata_program: Program<'info, Metadata>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> Subscribe<'info> {
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

    fn mint_membership_nft(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.mint_nft.to_account_info(),
                to: self.subscriber_ata.to_account_info(),
                authority: self.creator.to_account_info(),
            },
        )
    }

    fn create_metadata_account(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, CreateMetadataAccountsV3<'info>> {
        CpiContext::new(
            self.metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: self.metadata.to_account_info(),
                mint: self.mint_nft.to_account_info(),
                mint_authority: self.creator.to_account_info(),
                payer: self.fee_payer.to_account_info(),
                update_authority: self.creator.to_account_info(),
                system_program: self.system_program.to_account_info(),
                rent: self.rent.to_account_info(),
            },
        )
    }

    fn sign_metadata(&self) -> CpiContext<'_, '_, '_, 'info, SignMetadata<'info>> {
        CpiContext::new(
            self.metadata_program.to_account_info(),
            SignMetadata {
                creator: self.creator.to_account_info(),
                metadata: self.metadata.to_account_info(),
            },
        )
    }

    fn create_master_edition(&self) -> CpiContext<'_, '_, '_, 'info, CreateMasterEditionV3<'info>> {
        CpiContext::new(
            self.metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: self.master_edition.to_account_info(),
                mint: self.mint_nft.to_account_info(),
                update_authority: self.creator.to_account_info(),
                mint_authority: self.creator.to_account_info(),
                payer: self.fee_payer.to_account_info(),
                metadata: self.metadata.to_account_info(),
                token_program: self.token_program.to_account_info(),
                system_program: self.system_program.to_account_info(),
                rent: self.rent.to_account_info(),
            },
        )
    }

    fn verify_collection(&self) -> CpiContext<'_, '_, '_, 'info, SetAndVerifyCollection<'info>> {
        CpiContext::new(
            self.metadata_program.to_account_info(),
            SetAndVerifyCollection {
                metadata: self.metadata.to_account_info(),
                collection_authority: self.creator.to_account_info(),
                payer: self.fee_payer.to_account_info(),
                update_authority: self.creator.to_account_info(),
                collection_mint: self.collection.to_account_info(),
                collection_metadata: self.metadata_collection.to_account_info(),
                collection_master_edition: self.master_edition_collection.to_account_info(),
            },
        )
    }
}

pub fn subscribe(
    ctx: Context<Subscribe>,
    price: u64,
    duration_in_months: Option<u16>,
) -> Result<()> {
    let membership = &ctx.accounts.membership;
    let creator = &ctx.accounts.creator;
    let establishment = &ctx.accounts.establishment;

    require!(creator.is_active, SeawayError::CreatorIsDisabled);
    require!(membership.is_active, SeawayError::MembershipIsDisabled);
    require_eq!(membership.price, price, SeawayError::InvalidPrice);
    if membership.supply != 0 {
        require_gte!(
            membership.supply,
            membership.minted,
            SeawayError::MembershipOutOfStock
        );
    }

    let duration = duration_in_months.unwrap_or(1);
    let total_price = membership.price * duration as u64;

    let establishment_fee =
        total_price * creator.establishment_fees.sale_basis_points as u64 / 10000;
    let net_revenue = total_price - establishment_fee;

    // program signer
    let creator_seeds = [b"creator", creator.owner.as_ref(), &[creator.bump]];

    if membership.price > 0 {
        token::transfer(ctx.accounts.pay_creator(), net_revenue)?;
        if establishment_fee > 0 {
            token::transfer(ctx.accounts.pay_establishment(), establishment_fee)?;
        }
    }
    
    token::mint_to(
        ctx.accounts
            .mint_membership_nft()
            .with_signer(&[&creator_seeds[..]]),
        1,
    )?;

    if creator.establishment_fees.royalties_share > 0 {}

    // create metadata account
    let metadata_creators = vec![
        mpl_token_metadata::state::Creator {
            address: creator.key(),
            verified: false,
            share: 0,
        },
        mpl_token_metadata::state::Creator {
            address: creator.treasury,
            verified: false,
            share: 100 - creator.establishment_fees.royalties_share,
        },
        mpl_token_metadata::state::Creator {
            address: establishment.treasury,
            verified: false,
            share: creator.establishment_fees.royalties_share,
        },
    ];

    let base_uri = String::from_utf8(establishment.base_uri.to_vec()).unwrap();
    let name = String::from_utf8(membership.name.to_vec()).unwrap();

    let uri = get_membership_metadata_uri(
        base_uri.trim_end_matches('\0'),
        &creator.key(),
        &membership.key(),
        membership.minted + 1,
    );

    create_metadata_accounts_v3(
        ctx.accounts
            .create_metadata_account()
            .with_signer(&[&creator_seeds[..]]),
        DataV2 {
            name: format!("{} #{}", name.trim_end_matches('\0'), membership.minted + 1),
            symbol: String::from_utf8(membership.symbol.to_vec()).unwrap(),
            uri,
            seller_fee_basis_points: membership.royalties,
            creators: Some(metadata_creators),
            collection: Some(Collection {
                verified: false,
                key: ctx.accounts.collection.key(),
            }),
            uses: None,
        },
        true,
        true,
        None,
    )?;

    sign_metadata(
        ctx.accounts
            .sign_metadata()
            .with_signer(&[&creator_seeds[..]]),
    )?;

    create_master_edition_v3(
        ctx.accounts
            .create_master_edition()
            .with_signer(&[&creator_seeds[..]]),
        Some(0),
    )?;

    set_and_verify_collection(
        ctx.accounts
            .verify_collection()
            .with_signer(&[&creator_seeds[..]]),
        None,
    )?;

    let clock: Clock = Clock::get()?;
    let expiration_timestamp = get_plus_months_expiration_timestamp(clock.unix_timestamp, duration);

    let subscription = Subscription {
        version: VERSION,
        bump: *ctx.bumps.get("subscription").unwrap(),
        creator: creator.key(),
        membership: membership.key(),
        mint: ctx.accounts.mint_nft.key(),
        created_at: clock.unix_timestamp,
        updated_at: 0,
        expired_at: expiration_timestamp,
        padding: [0; 12],
    };

    let membership = &mut ctx.accounts.membership;
    let creator = &mut ctx.accounts.creator;

    creator.total_subscription += 1;
    creator.total_revenue += net_revenue;

    membership.minted += 1;
    membership.total_revenue += net_revenue;

    emit!(NewSubscriptionEvent {
        version: VERSION,
        signer: ctx.accounts.signer.key(),
        subscription_key: ctx.accounts.subscription.key(),
        membership_key: membership.key(),
        creator_key: creator.key(),

        subscription: SubscriptionEvent::from(subscription.clone()),
        membership: MembershipEvent::from((***membership).clone()),
        creator: CreatorEvent::from((***creator).clone()),
        price,
        duration,
        number: membership.minted,
        net_revenue,
    });

    **ctx.accounts.subscription = subscription;

    Ok(())
}

#[event]
pub struct NewSubscriptionEvent {
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
