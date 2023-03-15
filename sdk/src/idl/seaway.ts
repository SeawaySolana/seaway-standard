export type Seaway = {
  version: "0.1.0";
  name: "seaway";
  instructions: [
    {
      name: "registerEstablishment";
      docs: ["Instruction used to create an establishment."];
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "feePayer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "establishment";
          isMut: true;
          isSigner: true;
        },
        {
          name: "establishmentTreasury";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "treasury";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Establishment";
                path: "establishment";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "requiresSignOff";
          type: "bool";
        },
        {
          name: "saleBasisPoints";
          type: "u16";
        },
        {
          name: "royaltiesShare";
          type: "u8";
        },
        {
          name: "uri";
          type: {
            array: ["u8", 94];
          };
        }
      ];
    },
    {
      name: "updateEstablishment";
      docs: ["Instruction used to update an existing establishment"];
      accounts: [
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "establishment";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "uri";
          type: {
            option: {
              array: ["u8", 94];
            };
          };
        },
        {
          name: "requiresSignOff";
          type: {
            option: "bool";
          };
        },
        {
          name: "saleBasisPoints";
          type: {
            option: "u16";
          };
        },
        {
          name: "royaltiesShare";
          type: {
            option: "u8";
          };
        },
        {
          name: "isActive";
          type: {
            option: "bool";
          };
        }
      ];
    },
    {
      name: "updateEstablishmentAuthority";
      docs: ["Instruction used to change the authority of an establishment"];
      accounts: [
        {
          name: "newAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "establishment";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "withdrawEstablishmentTreasury";
      docs: ["Instruction used to withdraw from a establishment treasury"];
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "establishment";
          isMut: false;
          isSigner: false;
        },
        {
          name: "establishmentTreasury";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "treasury";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Establishment";
                path: "establishment";
              }
            ];
          };
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "establishmentAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authorityAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "registerCreator";
      docs: ["Instruction used to create a creator."];
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "feePayer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "creator";
          isMut: true;
          isSigner: false;
          docs: ["creator state account"];
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "creator";
              },
              {
                kind: "account";
                type: "publicKey";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "creatorTreasury";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "treasury";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Creator";
                path: "creator";
              }
            ];
          };
        },
        {
          name: "establishment";
          isMut: false;
          isSigner: false;
        },
        {
          name: "establishmentAuthority";
          isMut: false;
          isSigner: true;
          isOptional: true;
        },
        {
          name: "collection";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "collection";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Creator";
                path: "creator";
              }
            ];
          };
        },
        {
          name: "creatorAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "name";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "symbol";
          type: {
            array: ["u8", 10];
          };
        }
      ];
    },
    {
      name: "withdrawCreatorTreasury";
      docs: ["Instruction used to withdraw from a creator treasury"];
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "creator";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creatorTreasury";
          isMut: false;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "treasury";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Creator";
                path: "creator";
              }
            ];
          };
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creatorAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authorityAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "updateCreatorAuthority";
      docs: ["Instruction used to change the authority of a creator"];
      accounts: [
        {
          name: "newAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "authority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "creator";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "registerMembership";
      docs: ["Instruction used to create a membership"];
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "feePayer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "membership";
          isMut: true;
          isSigner: true;
          docs: ["membership state account"];
        },
        {
          name: "creator";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "price";
          type: "u64";
        },
        {
          name: "royalties";
          type: "u16";
        },
        {
          name: "supply";
          type: "u64";
        },
        {
          name: "name";
          type: {
            array: ["u8", 27];
          };
        },
        {
          name: "symbol";
          type: {
            array: ["u8", 10];
          };
        }
      ];
    },
    {
      name: "disableMembership";
      docs: ["Instruction used to disable"];
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "membership";
          isMut: true;
          isSigner: false;
          relations: ["creator"];
        },
        {
          name: "creator";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "subscribe";
      docs: ["Instruction to subscribe to a membership"];
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "feePayer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "signerTa";
          isMut: true;
          isSigner: false;
        },
        {
          name: "establishment";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creator";
          isMut: true;
          isSigner: false;
          relations: ["collection", "establishment"];
        },
        {
          name: "collection";
          isMut: false;
          isSigner: false;
        },
        {
          name: "membership";
          isMut: true;
          isSigner: false;
          relations: ["mint", "creator"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "subscription";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "subscription";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Mint";
                path: "mint_nft";
              }
            ];
          };
        },
        {
          name: "mintNft";
          isMut: true;
          isSigner: true;
        },
        {
          name: "subscriberAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creatorAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "establishmentAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadataCollection";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterEditionCollection";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "price";
          type: "u64";
        },
        {
          name: "durationInMonths";
          type: {
            option: "u16";
          };
        }
      ];
    },
    {
      name: "renew";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "feePayer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "signerTa";
          isMut: true;
          isSigner: false;
        },
        {
          name: "establishment";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creator";
          isMut: true;
          isSigner: false;
          relations: ["collection", "establishment"];
        },
        {
          name: "collection";
          isMut: false;
          isSigner: false;
        },
        {
          name: "membership";
          isMut: true;
          isSigner: false;
          relations: ["mint", "creator"];
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "subscription";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "subscription";
              },
              {
                kind: "account";
                type: "publicKey";
                account: "Mint";
                path: "mint_nft";
              }
            ];
          };
        },
        {
          name: "mintNft";
          isMut: false;
          isSigner: false;
        },
        {
          name: "subscriberAta";
          isMut: false;
          isSigner: false;
        },
        {
          name: "creatorAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "establishmentAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "price";
          type: "u64";
        },
        {
          name: "durationInMonths";
          type: {
            option: "u16";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "establishment";
      docs: [
        "Establishment struct",
        "Establishment are representing web application that will creates the offchain metadata of the membership and subscription.",
        "",
        "Establishment can charge fees on every subscription and/or add royalties to subscriptions NFT.",
        "Creators can create their own establishment if they want to be independent."
      ];
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Version"];
            type: "u8";
          },
          {
            name: "treasuryBump";
            docs: ["Treasury bump"];
            type: "u8";
          },
          {
            name: "treasury";
            docs: ["PDA that will be the authority over every token account."];
            type: "publicKey";
          },
          {
            name: "authority";
            docs: [
              "Establishments can delegate authority to a specific pubkey."
            ];
            type: "publicKey";
          },
          {
            name: "requiresSignOff";
            docs: ["Require signature when attaching a creator."];
            type: "bool";
          },
          {
            name: "saleBasisPoints";
            docs: [
              "Basis points that goes to the establishment on a subscription."
            ];
            type: "u16";
          },
          {
            name: "royaltiesShare";
            docs: [
              "Royalties share that goes to the establishment on every sales of any membership NFT."
            ];
            type: "u8";
          },
          {
            name: "isActive";
            docs: ["Is establishment accepting new creator."];
            type: "bool";
          },
          {
            name: "scopes";
            docs: [
              "Scopes of the establishment.",
              "Useless at the moment. But later establishment should be able to update some fields of their creators."
            ];
            type: {
              array: ["bool", 10];
            };
          },
          {
            name: "baseUri";
            docs: [
              "The base uri used in every membership NFTs related to a creator operating in this establishment.",
              "Should be padded with null bytes."
            ];
            type: {
              array: ["u8", 94];
            };
          },
          {
            name: "padding";
            docs: ["Padding because we never know."];
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    },
    {
      name: "creator";
      docs: [
        "Creator struct",
        "Creators are the principal actors of the program.",
        "They create membership that people can subscribe to."
      ];
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Version"];
            type: "u8";
          },
          {
            name: "bump";
            docs: ["Bump, all creators accounts are PDAs."];
            type: "u8";
          },
          {
            name: "treasuryBump";
            docs: ["Treasury bump"];
            type: "u8";
          },
          {
            name: "treasury";
            docs: ["PDA that will be the authority over every token account."];
            type: "publicKey";
          },
          {
            name: "owner";
            docs: ["Signer that created the creator account."];
            type: "publicKey";
          },
          {
            name: "authority";
            docs: [
              "Establishments can delegate authority to a specific pubkey."
            ];
            type: "publicKey";
          },
          {
            name: "collection";
            docs: [
              "Mint account storing the collection account.",
              "Used to sign membership NFT and attached them to the creator's collection."
            ];
            type: "publicKey";
          },
          {
            name: "establishment";
            docs: ["Establishment associated to the creator."];
            type: "publicKey";
          },
          {
            name: "establishmentFees";
            docs: ["Establishment at the time of the creator joined."];
            type: {
              defined: "EstablishmentFees";
            };
          },
          {
            name: "isActive";
            docs: ["Is the creator accepting new subscriptions."];
            type: "bool";
          },
          {
            name: "totalSubscription";
            docs: ["Total subscription bought for this creator."];
            type: "u64";
          },
          {
            name: "totalRevenue";
            docs: ["Total revenue generated by the creator."];
            type: "u64";
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    },
    {
      name: "membership";
      docs: ["Membership struct"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Version"];
            type: "u8";
          },
          {
            name: "creator";
            docs: ["Creator associated with this membership"];
            type: "publicKey";
          },
          {
            name: "mint";
            docs: [
              "Token that has to be used to subscribe.",
              "SPL token only. Use WSOL for solana."
            ];
            type: "publicKey";
          },
          {
            name: "price";
            docs: ["Price of the membership.", "Decimals depends on the mint"];
            type: "u64";
          },
          {
            name: "royalties";
            docs: ["Royalties of the subscription NFTs."];
            type: "u16";
          },
          {
            name: "supply";
            docs: [
              "Max number of subscription.",
              "0 == infinite (in reality the max is 9999999999)",
              "because of the URL limit."
            ];
            type: "u64";
          },
          {
            name: "minted";
            docs: ["Actual number of subscription"];
            type: "u64";
          },
          {
            name: "isActive";
            docs: [
              "Is the membership accepting renewal and new subscriptions."
            ];
            type: "bool";
          },
          {
            name: "name";
            docs: [
              "Name to use in the metadata file of the subscriptions NFT."
            ];
            type: {
              array: ["u8", 27];
            };
          },
          {
            name: "symbol";
            docs: ["Symbol to use in the metadata file subscriptions NFT."];
            type: {
              array: ["u8", 10];
            };
          },
          {
            name: "totalRevenue";
            docs: ["Revenue generated by the membership."];
            type: "u64";
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    },
    {
      name: "subscription";
      docs: [
        "Subscription struct",
        "Represents a specific subscription.",
        "Is created when calling the subscribe instruction"
      ];
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            docs: ["Version"];
            type: "u8";
          },
          {
            name: "bump";
            docs: ["Version"];
            type: "u8";
          },
          {
            name: "creator";
            docs: ["Creator associated with the subscription."];
            type: "publicKey";
          },
          {
            name: "membership";
            docs: ["Membership associated with the subscription."];
            type: "publicKey";
          },
          {
            name: "mint";
            docs: ["Each subscription is represented by a NFT."];
            type: "publicKey";
          },
          {
            name: "createdAt";
            docs: ["Timestamp of the first subscritpion."];
            type: "i64";
          },
          {
            name: "updatedAt";
            docs: ["Timestamp of the last renew."];
            type: "i64";
          },
          {
            name: "expiredAt";
            docs: ["Expiration date of the subscription"];
            type: "i64";
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "EstablishmentEvent";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            type: "u8";
          },
          {
            name: "treasuryBump";
            type: "u8";
          },
          {
            name: "treasury";
            type: "publicKey";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "requiresSignOff";
            type: "bool";
          },
          {
            name: "saleBasisPoints";
            type: "u16";
          },
          {
            name: "royaltiesShare";
            type: "u8";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "scopes";
            type: {
              array: ["bool", 10];
            };
          },
          {
            name: "baseUri";
            type: {
              array: ["u8", 94];
            };
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    },
    {
      name: "EstablishmentFees";
      docs: [
        "We copy the establishment fees to the creator struct.",
        "This will protect creators in case we allow establishments",
        "to update their state."
      ];
      type: {
        kind: "struct";
        fields: [
          {
            name: "saleBasisPoints";
            docs: [
              "Basis points that goes to the establishment on a subscription."
            ];
            type: "u16";
          },
          {
            name: "royaltiesShare";
            docs: [
              "Royalties that goes to the establishment on every membership NFT."
            ];
            type: "u8";
          }
        ];
      };
    },
    {
      name: "CreatorEvent";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "treasuryBump";
            type: "u8";
          },
          {
            name: "treasury";
            type: "publicKey";
          },
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "collection";
            type: "publicKey";
          },
          {
            name: "establishment";
            type: "publicKey";
          },
          {
            name: "establishmentFees";
            type: {
              defined: "EstablishmentFees";
            };
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "totalSubscription";
            type: "u64";
          },
          {
            name: "totalRevenue";
            type: "u64";
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    },
    {
      name: "MembershipEvent";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            type: "u8";
          },
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "royalties";
            type: "u16";
          },
          {
            name: "supply";
            type: "u64";
          },
          {
            name: "minted";
            type: "u64";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "name";
            type: {
              array: ["u8", 27];
            };
          },
          {
            name: "symbol";
            type: {
              array: ["u8", 10];
            };
          },
          {
            name: "totalRevenue";
            type: "u64";
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    },
    {
      name: "SubscriptionEvent";
      type: {
        kind: "struct";
        fields: [
          {
            name: "version";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "membership";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "updatedAt";
            type: "i64";
          },
          {
            name: "expiredAt";
            type: "i64";
          },
          {
            name: "padding";
            type: {
              array: ["u64", 12];
            };
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "RegisterCreatorEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "creatorKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: {
            defined: "CreatorEvent";
          };
          index: false;
        },
        {
          name: "name";
          type: {
            array: ["u8", 32];
          };
          index: false;
        },
        {
          name: "symbol";
          type: {
            array: ["u8", 10];
          };
          index: false;
        }
      ];
    },
    {
      name: "UpdateCreatorAuthorityEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "signer";
          type: "publicKey";
          index: false;
        },
        {
          name: "creatorKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: {
            defined: "CreatorEvent";
          };
          index: false;
        }
      ];
    },
    {
      name: "WithdrawCreatorTreasuryEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "creator";
          type: {
            defined: "CreatorEvent";
          };
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "RegisterEstablishmentEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "establishmentKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "establishment";
          type: {
            defined: "EstablishmentEvent";
          };
          index: false;
        }
      ];
    },
    {
      name: "UpdateEstablishmentAuthorityEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "signer";
          type: "publicKey";
          index: false;
        },
        {
          name: "establishmentKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "establishment";
          type: {
            defined: "EstablishmentEvent";
          };
          index: false;
        }
      ];
    },
    {
      name: "UpdateEstablishmentEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "signer";
          type: "publicKey";
          index: false;
        },
        {
          name: "establishmentKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "establishment";
          type: {
            defined: "EstablishmentEvent";
          };
          index: false;
        }
      ];
    },
    {
      name: "WithdrawEstablishmentTreasuryEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "establishment";
          type: {
            defined: "EstablishmentEvent";
          };
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "DisableMembershipEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "signer";
          type: "publicKey";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "membershipKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "membership";
          type: {
            defined: "MembershipEvent";
          };
          index: false;
        }
      ];
    },
    {
      name: "RegisterMembershipEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "creator";
          type: "publicKey";
          index: false;
        },
        {
          name: "membershipKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "membership";
          type: {
            defined: "MembershipEvent";
          };
          index: false;
        }
      ];
    },
    {
      name: "RenewSubscriptionEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "signer";
          type: "publicKey";
          index: false;
        },
        {
          name: "subscriptionKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "membershipKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "creatorKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "subscription";
          type: {
            defined: "SubscriptionEvent";
          };
          index: false;
        },
        {
          name: "membership";
          type: {
            defined: "MembershipEvent";
          };
          index: false;
        },
        {
          name: "creator";
          type: {
            defined: "CreatorEvent";
          };
          index: false;
        },
        {
          name: "price";
          type: "u64";
          index: false;
        },
        {
          name: "number";
          type: "u64";
          index: false;
        },
        {
          name: "duration";
          type: "u16";
          index: false;
        },
        {
          name: "netRevenue";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "NewSubscriptionEvent";
      fields: [
        {
          name: "version";
          type: "u8";
          index: false;
        },
        {
          name: "signer";
          type: "publicKey";
          index: false;
        },
        {
          name: "subscriptionKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "membershipKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "creatorKey";
          type: "publicKey";
          index: false;
        },
        {
          name: "subscription";
          type: {
            defined: "SubscriptionEvent";
          };
          index: false;
        },
        {
          name: "membership";
          type: {
            defined: "MembershipEvent";
          };
          index: false;
        },
        {
          name: "creator";
          type: {
            defined: "CreatorEvent";
          };
          index: false;
        },
        {
          name: "price";
          type: "u64";
          index: false;
        },
        {
          name: "number";
          type: "u64";
          index: false;
        },
        {
          name: "duration";
          type: "u16";
          index: false;
        },
        {
          name: "netRevenue";
          type: "u64";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "RoyaltiesTooHigh";
      msg: "Royalties share too high";
    },
    {
      code: 6001;
      name: "InvalidAuthority";
      msg: "Invalid authority";
    },
    {
      code: 6002;
      name: "EstablishmentIsDisabled";
      msg: "Establishment is disabled";
    },
    {
      code: 6003;
      name: "IndependentMembershipOrCreator";
      msg: "Invalid membership or creator";
    },
    {
      code: 6004;
      name: "InvalidMembershipMint";
      msg: "Invalid membership mint";
    },
    {
      code: 6005;
      name: "NotEnoughTokens";
      msg: "Not enough tokens";
    },
    {
      code: 6006;
      name: "InvalidMembershipPrice";
      msg: "Invalid membership price";
    },
    {
      code: 6007;
      name: "InvalidMembershipCreator";
      msg: "Invalid membership creator";
    },
    {
      code: 6008;
      name: "MembershipDisabled";
      msg: "Membership disabled";
    },
    {
      code: 6009;
      name: "InvalidPrice";
      msg: "Invalid price";
    },
    {
      code: 6010;
      name: "MembershipOutOfStock";
      msg: "Membership out of stock";
    },
    {
      code: 6011;
      name: "CreatorIsDisabled";
      msg: "Creator is disabled";
    },
    {
      code: 6012;
      name: "MembershipIsDisabled";
      msg: "Membership is disabled";
    }
  ];
};

export const IDL: Seaway = {
  version: "0.1.0",
  name: "seaway",
  instructions: [
    {
      name: "registerEstablishment",
      docs: ["Instruction used to create an establishment."],
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "feePayer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "establishment",
          isMut: true,
          isSigner: true,
        },
        {
          name: "establishmentTreasury",
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "treasury",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Establishment",
                path: "establishment",
              },
            ],
          },
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "requiresSignOff",
          type: "bool",
        },
        {
          name: "saleBasisPoints",
          type: "u16",
        },
        {
          name: "royaltiesShare",
          type: "u8",
        },
        {
          name: "uri",
          type: {
            array: ["u8", 94],
          },
        },
      ],
    },
    {
      name: "updateEstablishment",
      docs: ["Instruction used to update an existing establishment"],
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "establishment",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "uri",
          type: {
            option: {
              array: ["u8", 94],
            },
          },
        },
        {
          name: "requiresSignOff",
          type: {
            option: "bool",
          },
        },
        {
          name: "saleBasisPoints",
          type: {
            option: "u16",
          },
        },
        {
          name: "royaltiesShare",
          type: {
            option: "u8",
          },
        },
        {
          name: "isActive",
          type: {
            option: "bool",
          },
        },
      ],
    },
    {
      name: "updateEstablishmentAuthority",
      docs: ["Instruction used to change the authority of an establishment"],
      accounts: [
        {
          name: "newAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "establishment",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "withdrawEstablishmentTreasury",
      docs: ["Instruction used to withdraw from a establishment treasury"],
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "establishment",
          isMut: false,
          isSigner: false,
        },
        {
          name: "establishmentTreasury",
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "treasury",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Establishment",
                path: "establishment",
              },
            ],
          },
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "establishmentAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authorityAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "registerCreator",
      docs: ["Instruction used to create a creator."],
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "feePayer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "creator",
          isMut: true,
          isSigner: false,
          docs: ["creator state account"],
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "creator",
              },
              {
                kind: "account",
                type: "publicKey",
                path: "authority",
              },
            ],
          },
        },
        {
          name: "creatorTreasury",
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "treasury",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Creator",
                path: "creator",
              },
            ],
          },
        },
        {
          name: "establishment",
          isMut: false,
          isSigner: false,
        },
        {
          name: "establishmentAuthority",
          isMut: false,
          isSigner: true,
          isOptional: true,
        },
        {
          name: "collection",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "collection",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Creator",
                path: "creator",
              },
            ],
          },
        },
        {
          name: "creatorAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "symbol",
          type: {
            array: ["u8", 10],
          },
        },
      ],
    },
    {
      name: "withdrawCreatorTreasury",
      docs: ["Instruction used to withdraw from a creator treasury"],
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "creator",
          isMut: false,
          isSigner: false,
        },
        {
          name: "creatorTreasury",
          isMut: false,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "treasury",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Creator",
                path: "creator",
              },
            ],
          },
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "creatorAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authorityAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "updateCreatorAuthority",
      docs: ["Instruction used to change the authority of a creator"],
      accounts: [
        {
          name: "newAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "creator",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "registerMembership",
      docs: ["Instruction used to create a membership"],
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "feePayer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "membership",
          isMut: true,
          isSigner: true,
          docs: ["membership state account"],
        },
        {
          name: "creator",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
        {
          name: "royalties",
          type: "u16",
        },
        {
          name: "supply",
          type: "u64",
        },
        {
          name: "name",
          type: {
            array: ["u8", 27],
          },
        },
        {
          name: "symbol",
          type: {
            array: ["u8", 10],
          },
        },
      ],
    },
    {
      name: "disableMembership",
      docs: ["Instruction used to disable"],
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "membership",
          isMut: true,
          isSigner: false,
          relations: ["creator"],
        },
        {
          name: "creator",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "subscribe",
      docs: ["Instruction to subscribe to a membership"],
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "feePayer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "signerTa",
          isMut: true,
          isSigner: false,
        },
        {
          name: "establishment",
          isMut: false,
          isSigner: false,
        },
        {
          name: "creator",
          isMut: true,
          isSigner: false,
          relations: ["collection", "establishment"],
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
        },
        {
          name: "membership",
          isMut: true,
          isSigner: false,
          relations: ["mint", "creator"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "subscription",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "subscription",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Mint",
                path: "mint_nft",
              },
            ],
          },
        },
        {
          name: "mintNft",
          isMut: true,
          isSigner: true,
        },
        {
          name: "subscriberAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creatorAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "establishmentAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadataCollection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterEditionCollection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
        {
          name: "durationInMonths",
          type: {
            option: "u16",
          },
        },
      ],
    },
    {
      name: "renew",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "feePayer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "signerTa",
          isMut: true,
          isSigner: false,
        },
        {
          name: "establishment",
          isMut: false,
          isSigner: false,
        },
        {
          name: "creator",
          isMut: true,
          isSigner: false,
          relations: ["collection", "establishment"],
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
        },
        {
          name: "membership",
          isMut: true,
          isSigner: false,
          relations: ["mint", "creator"],
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "subscription",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "subscription",
              },
              {
                kind: "account",
                type: "publicKey",
                account: "Mint",
                path: "mint_nft",
              },
            ],
          },
        },
        {
          name: "mintNft",
          isMut: false,
          isSigner: false,
        },
        {
          name: "subscriberAta",
          isMut: false,
          isSigner: false,
        },
        {
          name: "creatorAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "establishmentAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "price",
          type: "u64",
        },
        {
          name: "durationInMonths",
          type: {
            option: "u16",
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: "establishment",
      docs: [
        "Establishment struct",
        "Establishment are representing web application that will creates the offchain metadata of the membership and subscription.",
        "",
        "Establishment can charge fees on every subscription and/or add royalties to subscriptions NFT.",
        "Creators can create their own establishment if they want to be independent.",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Version"],
            type: "u8",
          },
          {
            name: "treasuryBump",
            docs: ["Treasury bump"],
            type: "u8",
          },
          {
            name: "treasury",
            docs: ["PDA that will be the authority over every token account."],
            type: "publicKey",
          },
          {
            name: "authority",
            docs: [
              "Establishments can delegate authority to a specific pubkey.",
            ],
            type: "publicKey",
          },
          {
            name: "requiresSignOff",
            docs: ["Require signature when attaching a creator."],
            type: "bool",
          },
          {
            name: "saleBasisPoints",
            docs: [
              "Basis points that goes to the establishment on a subscription.",
            ],
            type: "u16",
          },
          {
            name: "royaltiesShare",
            docs: [
              "Royalties share that goes to the establishment on every sales of any membership NFT.",
            ],
            type: "u8",
          },
          {
            name: "isActive",
            docs: ["Is establishment accepting new creator."],
            type: "bool",
          },
          {
            name: "scopes",
            docs: [
              "Scopes of the establishment.",
              "Useless at the moment. But later establishment should be able to update some fields of their creators.",
            ],
            type: {
              array: ["bool", 10],
            },
          },
          {
            name: "baseUri",
            docs: [
              "The base uri used in every membership NFTs related to a creator operating in this establishment.",
              "Should be padded with null bytes.",
            ],
            type: {
              array: ["u8", 94],
            },
          },
          {
            name: "padding",
            docs: ["Padding because we never know."],
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
    {
      name: "creator",
      docs: [
        "Creator struct",
        "Creators are the principal actors of the program.",
        "They create membership that people can subscribe to.",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Version"],
            type: "u8",
          },
          {
            name: "bump",
            docs: ["Bump, all creators accounts are PDAs."],
            type: "u8",
          },
          {
            name: "treasuryBump",
            docs: ["Treasury bump"],
            type: "u8",
          },
          {
            name: "treasury",
            docs: ["PDA that will be the authority over every token account."],
            type: "publicKey",
          },
          {
            name: "owner",
            docs: ["Signer that created the creator account."],
            type: "publicKey",
          },
          {
            name: "authority",
            docs: [
              "Establishments can delegate authority to a specific pubkey.",
            ],
            type: "publicKey",
          },
          {
            name: "collection",
            docs: [
              "Mint account storing the collection account.",
              "Used to sign membership NFT and attached them to the creator's collection.",
            ],
            type: "publicKey",
          },
          {
            name: "establishment",
            docs: ["Establishment associated to the creator."],
            type: "publicKey",
          },
          {
            name: "establishmentFees",
            docs: ["Establishment at the time of the creator joined."],
            type: {
              defined: "EstablishmentFees",
            },
          },
          {
            name: "isActive",
            docs: ["Is the creator accepting new subscriptions."],
            type: "bool",
          },
          {
            name: "totalSubscription",
            docs: ["Total subscription bought for this creator."],
            type: "u64",
          },
          {
            name: "totalRevenue",
            docs: ["Total revenue generated by the creator."],
            type: "u64",
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
    {
      name: "membership",
      docs: ["Membership struct"],
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Version"],
            type: "u8",
          },
          {
            name: "creator",
            docs: ["Creator associated with this membership"],
            type: "publicKey",
          },
          {
            name: "mint",
            docs: [
              "Token that has to be used to subscribe.",
              "SPL token only. Use WSOL for solana.",
            ],
            type: "publicKey",
          },
          {
            name: "price",
            docs: ["Price of the membership.", "Decimals depends on the mint"],
            type: "u64",
          },
          {
            name: "royalties",
            docs: ["Royalties of the subscription NFTs."],
            type: "u16",
          },
          {
            name: "supply",
            docs: [
              "Max number of subscription.",
              "0 == infinite (in reality the max is 9999999999)",
              "because of the URL limit.",
            ],
            type: "u64",
          },
          {
            name: "minted",
            docs: ["Actual number of subscription"],
            type: "u64",
          },
          {
            name: "isActive",
            docs: [
              "Is the membership accepting renewal and new subscriptions.",
            ],
            type: "bool",
          },
          {
            name: "name",
            docs: [
              "Name to use in the metadata file of the subscriptions NFT.",
            ],
            type: {
              array: ["u8", 27],
            },
          },
          {
            name: "symbol",
            docs: ["Symbol to use in the metadata file subscriptions NFT."],
            type: {
              array: ["u8", 10],
            },
          },
          {
            name: "totalRevenue",
            docs: ["Revenue generated by the membership."],
            type: "u64",
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
    {
      name: "subscription",
      docs: [
        "Subscription struct",
        "Represents a specific subscription.",
        "Is created when calling the subscribe instruction",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            docs: ["Version"],
            type: "u8",
          },
          {
            name: "bump",
            docs: ["Version"],
            type: "u8",
          },
          {
            name: "creator",
            docs: ["Creator associated with the subscription."],
            type: "publicKey",
          },
          {
            name: "membership",
            docs: ["Membership associated with the subscription."],
            type: "publicKey",
          },
          {
            name: "mint",
            docs: ["Each subscription is represented by a NFT."],
            type: "publicKey",
          },
          {
            name: "createdAt",
            docs: ["Timestamp of the first subscritpion."],
            type: "i64",
          },
          {
            name: "updatedAt",
            docs: ["Timestamp of the last renew."],
            type: "i64",
          },
          {
            name: "expiredAt",
            docs: ["Expiration date of the subscription"],
            type: "i64",
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "EstablishmentEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            type: "u8",
          },
          {
            name: "treasuryBump",
            type: "u8",
          },
          {
            name: "treasury",
            type: "publicKey",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "requiresSignOff",
            type: "bool",
          },
          {
            name: "saleBasisPoints",
            type: "u16",
          },
          {
            name: "royaltiesShare",
            type: "u8",
          },
          {
            name: "isActive",
            type: "bool",
          },
          {
            name: "scopes",
            type: {
              array: ["bool", 10],
            },
          },
          {
            name: "baseUri",
            type: {
              array: ["u8", 94],
            },
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
    {
      name: "EstablishmentFees",
      docs: [
        "We copy the establishment fees to the creator struct.",
        "This will protect creators in case we allow establishments",
        "to update their state.",
      ],
      type: {
        kind: "struct",
        fields: [
          {
            name: "saleBasisPoints",
            docs: [
              "Basis points that goes to the establishment on a subscription.",
            ],
            type: "u16",
          },
          {
            name: "royaltiesShare",
            docs: [
              "Royalties that goes to the establishment on every membership NFT.",
            ],
            type: "u8",
          },
        ],
      },
    },
    {
      name: "CreatorEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            type: "u8",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "treasuryBump",
            type: "u8",
          },
          {
            name: "treasury",
            type: "publicKey",
          },
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "collection",
            type: "publicKey",
          },
          {
            name: "establishment",
            type: "publicKey",
          },
          {
            name: "establishmentFees",
            type: {
              defined: "EstablishmentFees",
            },
          },
          {
            name: "isActive",
            type: "bool",
          },
          {
            name: "totalSubscription",
            type: "u64",
          },
          {
            name: "totalRevenue",
            type: "u64",
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
    {
      name: "MembershipEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            type: "u8",
          },
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "royalties",
            type: "u16",
          },
          {
            name: "supply",
            type: "u64",
          },
          {
            name: "minted",
            type: "u64",
          },
          {
            name: "isActive",
            type: "bool",
          },
          {
            name: "name",
            type: {
              array: ["u8", 27],
            },
          },
          {
            name: "symbol",
            type: {
              array: ["u8", 10],
            },
          },
          {
            name: "totalRevenue",
            type: "u64",
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
    {
      name: "SubscriptionEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "version",
            type: "u8",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "membership",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "createdAt",
            type: "i64",
          },
          {
            name: "updatedAt",
            type: "i64",
          },
          {
            name: "expiredAt",
            type: "i64",
          },
          {
            name: "padding",
            type: {
              array: ["u64", 12],
            },
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "RegisterCreatorEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "creatorKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: {
            defined: "CreatorEvent",
          },
          index: false,
        },
        {
          name: "name",
          type: {
            array: ["u8", 32],
          },
          index: false,
        },
        {
          name: "symbol",
          type: {
            array: ["u8", 10],
          },
          index: false,
        },
      ],
    },
    {
      name: "UpdateCreatorAuthorityEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "signer",
          type: "publicKey",
          index: false,
        },
        {
          name: "creatorKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: {
            defined: "CreatorEvent",
          },
          index: false,
        },
      ],
    },
    {
      name: "WithdrawCreatorTreasuryEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "creator",
          type: {
            defined: "CreatorEvent",
          },
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "RegisterEstablishmentEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "establishmentKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "establishment",
          type: {
            defined: "EstablishmentEvent",
          },
          index: false,
        },
      ],
    },
    {
      name: "UpdateEstablishmentAuthorityEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "signer",
          type: "publicKey",
          index: false,
        },
        {
          name: "establishmentKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "establishment",
          type: {
            defined: "EstablishmentEvent",
          },
          index: false,
        },
      ],
    },
    {
      name: "UpdateEstablishmentEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "signer",
          type: "publicKey",
          index: false,
        },
        {
          name: "establishmentKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "establishment",
          type: {
            defined: "EstablishmentEvent",
          },
          index: false,
        },
      ],
    },
    {
      name: "WithdrawEstablishmentTreasuryEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "establishment",
          type: {
            defined: "EstablishmentEvent",
          },
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "DisableMembershipEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "signer",
          type: "publicKey",
          index: false,
        },
        {
          name: "creator",
          type: "publicKey",
          index: false,
        },
        {
          name: "membershipKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "membership",
          type: {
            defined: "MembershipEvent",
          },
          index: false,
        },
      ],
    },
    {
      name: "RegisterMembershipEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "creator",
          type: "publicKey",
          index: false,
        },
        {
          name: "membershipKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "membership",
          type: {
            defined: "MembershipEvent",
          },
          index: false,
        },
      ],
    },
    {
      name: "RenewSubscriptionEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "signer",
          type: "publicKey",
          index: false,
        },
        {
          name: "subscriptionKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "membershipKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "creatorKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "subscription",
          type: {
            defined: "SubscriptionEvent",
          },
          index: false,
        },
        {
          name: "membership",
          type: {
            defined: "MembershipEvent",
          },
          index: false,
        },
        {
          name: "creator",
          type: {
            defined: "CreatorEvent",
          },
          index: false,
        },
        {
          name: "price",
          type: "u64",
          index: false,
        },
        {
          name: "number",
          type: "u64",
          index: false,
        },
        {
          name: "duration",
          type: "u16",
          index: false,
        },
        {
          name: "netRevenue",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "NewSubscriptionEvent",
      fields: [
        {
          name: "version",
          type: "u8",
          index: false,
        },
        {
          name: "signer",
          type: "publicKey",
          index: false,
        },
        {
          name: "subscriptionKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "membershipKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "creatorKey",
          type: "publicKey",
          index: false,
        },
        {
          name: "subscription",
          type: {
            defined: "SubscriptionEvent",
          },
          index: false,
        },
        {
          name: "membership",
          type: {
            defined: "MembershipEvent",
          },
          index: false,
        },
        {
          name: "creator",
          type: {
            defined: "CreatorEvent",
          },
          index: false,
        },
        {
          name: "price",
          type: "u64",
          index: false,
        },
        {
          name: "number",
          type: "u64",
          index: false,
        },
        {
          name: "duration",
          type: "u16",
          index: false,
        },
        {
          name: "netRevenue",
          type: "u64",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "RoyaltiesTooHigh",
      msg: "Royalties share too high",
    },
    {
      code: 6001,
      name: "InvalidAuthority",
      msg: "Invalid authority",
    },
    {
      code: 6002,
      name: "EstablishmentIsDisabled",
      msg: "Establishment is disabled",
    },
    {
      code: 6003,
      name: "IndependentMembershipOrCreator",
      msg: "Invalid membership or creator",
    },
    {
      code: 6004,
      name: "InvalidMembershipMint",
      msg: "Invalid membership mint",
    },
    {
      code: 6005,
      name: "NotEnoughTokens",
      msg: "Not enough tokens",
    },
    {
      code: 6006,
      name: "InvalidMembershipPrice",
      msg: "Invalid membership price",
    },
    {
      code: 6007,
      name: "InvalidMembershipCreator",
      msg: "Invalid membership creator",
    },
    {
      code: 6008,
      name: "MembershipDisabled",
      msg: "Membership disabled",
    },
    {
      code: 6009,
      name: "InvalidPrice",
      msg: "Invalid price",
    },
    {
      code: 6010,
      name: "MembershipOutOfStock",
      msg: "Membership out of stock",
    },
    {
      code: 6011,
      name: "CreatorIsDisabled",
      msg: "Creator is disabled",
    },
    {
      code: 6012,
      name: "MembershipIsDisabled",
      msg: "Membership is disabled",
    },
  ],
};
