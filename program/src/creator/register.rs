use crate::constants::*;
use crate::errors::SeawayError;
use crate::state::*;
use crate::utils::get_creator_metadata_uri;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::Metadata,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
        CreateMetadataAccountsV3,
    },
    token::{self, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::state::DataV2;

#[derive(Accounts)]
pub struct RegisterCreator<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    /// creator state account
    #[account(
        init,
        seeds = [PREFIX_CREATOR.as_bytes(), authority.key().as_ref()],
        bump,
        payer = fee_payer,
        space = CREATOR_SIZE,
    )]
    pub creator: Box<Account<'info, Creator>>,
    #[account(
        seeds = [PREFIX_TREASURY.as_bytes(), creator.key().as_ref()],
        bump,
    )]
    pub creator_treasury: SystemAccount<'info>,

    pub establishment: Box<Account<'info, Establishment>>,
    pub establishment_authority: Option<Signer<'info>>,

    #[account(
        init,
        seeds = [PREFIX_COLLECTION.as_bytes(), creator.key().as_ref()],
        bump,
        payer = fee_payer,
        mint::decimals = 0,
        mint::authority = creator,
        mint::freeze_authority = creator,
    )]
    pub collection: Account<'info, Mint>,
    #[account(
        init,
        payer = fee_payer,
        associated_token::mint = collection,
        associated_token::authority = authority,
    )]
    pub creator_ata: Box<Account<'info, TokenAccount>>,

    /// CHECK: checked in CPI
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    /// CHECK: account checked in CPI
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> RegisterCreator<'info> {
    fn mint_collection_nft(&self) -> CpiContext<'_, '_, '_, 'info, MintTo<'info>> {
        CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.collection.to_account_info(),
                to: self.creator_ata.to_account_info(),
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
                mint: self.collection.to_account_info(),
                mint_authority: self.creator.to_account_info(),
                payer: self.fee_payer.to_account_info(),
                update_authority: self.creator.to_account_info(),
                system_program: self.system_program.to_account_info(),
                rent: self.rent.to_account_info(),
            },
        )
    }

    // fn sign_metadata(&self) -> CpiContext<'_, '_, '_, 'info, SignMetadata<'info>> {
    //     CpiContext::new(
    //         self.metadata_program.to_account_info(),
    //         SignMetadata {
    //             creator: self.creator.to_account_info(),
    //             metadata: self.metadata.to_account_info(),
    //         },
    //     )
    // }

    fn create_master_edition(&self) -> CpiContext<'_, '_, '_, 'info, CreateMasterEditionV3<'info>> {
        CpiContext::new(
            self.metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: self.master_edition.to_account_info(),
                mint: self.collection.to_account_info(),
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
}

pub fn register_creator(
    ctx: Context<RegisterCreator>,
    name: [u8; 32],
    symbol: [u8; 10],
) -> Result<()> {
    let establishment = &mut ctx.accounts.establishment;
    let establishment_authority = &mut ctx.accounts.establishment_authority;

    require!(
        establishment.is_active,
        SeawayError::EstablishmentIsDisabled
    );
    if establishment.requires_sign_off {
        require_keys_eq!(
            establishment_authority
                .as_ref()
                .ok_or(SeawayError::InvalidAuthority)?
                .key(),
            establishment.authority,
            SeawayError::InvalidAuthority,
        );
    }

    let base_uri = String::from_utf8(establishment.base_uri.to_vec()).unwrap();
    let uri =
        get_creator_metadata_uri(base_uri.trim_end_matches('\0'), &ctx.accounts.creator.key());

    let creator = Creator {
        version: VERSION,
        bump: *ctx.bumps.get("creator").unwrap(),
        treasury_bump: *ctx.bumps.get("creator_treasury").unwrap(),
        treasury: ctx.accounts.creator_treasury.key(),

        owner: ctx.accounts.authority.key(),
        authority: ctx.accounts.authority.key(),
        collection: ctx.accounts.collection.key(),

        establishment: establishment.key(),
        establishment_fees: EstablishmentFees {
            sale_basis_points: establishment.sale_basis_points,
            royalties_share: establishment.royalties_share,
        },

        is_active: true,
        total_subscription: 0,
        total_revenue: 0,

        padding: [0; 12],
    };

    // program signer
    let creator_seeds = [
        PREFIX_CREATOR.as_bytes(),
        ctx.accounts.authority.key.as_ref(),
        &[*ctx.bumps.get("creator").unwrap()],
    ];

    token::mint_to(
        ctx.accounts
            .mint_collection_nft()
            .with_signer(&[&creator_seeds[..]]),
        1,
    )?;

    let creators = vec![mpl_token_metadata::state::Creator {
        address: ctx.accounts.authority.key(),
        verified: false,
        share: 100,
    }];

    create_metadata_accounts_v3(
        ctx.accounts
            .create_metadata_account()
            .with_signer(&[&creator_seeds[..]]),
        DataV2 {
            name: String::from_utf8(name.to_vec()).unwrap(),
            symbol: String::from_utf8(symbol.to_vec()).unwrap(),
            uri,
            seller_fee_basis_points: 10000,
            creators: Some(creators),
            collection: None,
            uses: None,
        },
        true,
        true,
        None,
    )?;

    // Should we sign the collection NFT?
    // sign_metadata(
    //     ctx.accounts
    //         .sign_metadata()
    //         .with_signer(&[&creator_seeds[..]]),
    // )?;

    create_master_edition_v3(
        ctx.accounts
            .create_master_edition()
            .with_signer(&[&creator_seeds[..]]),
        Some(0),
    )?;

    emit!(RegisterCreatorEvent {
        version: VERSION,
        creator: CreatorEvent::from(creator.clone()),
        creator_key: ctx.accounts.creator.key(),

        name,
        symbol
    });

    **ctx.accounts.creator = creator;

    Ok(())
}

#[event]
pub struct RegisterCreatorEvent {
    pub version: u8,
    pub creator_key: Pubkey,
    pub creator: CreatorEvent,

    pub name: [u8; 32],
    pub symbol: [u8; 10],
}
