[seaway-sdk](README.md) / Exports

# seaway-sdk

## Table of contents

### Interfaces

- [RegisterCreatorParams](interfaces/RegisterCreatorParams.md)
- [RegisterMembershipParams](interfaces/RegisterMembershipParams.md)

### Functions

- [registerCreatorInstruction](modules.md#registercreatorinstruction)
- [registerEstablishmentInstruction](modules.md#registerestablishmentinstruction)
- [registerMembershipInstruction](modules.md#registermembershipinstruction)
- [renewInstruction](modules.md#renewinstruction)
- [subscribeInstruction](modules.md#subscribeinstruction)
- [updateEstablishmentInstruction](modules.md#updateestablishmentinstruction)

## Functions

### registerCreatorInstruction

▸ **registerCreatorInstruction**(`params`, `signer`, `establishment`, `establishmentAuthority?`, `feePayer?`, `programId?`): `Promise`\<`TransactionInstruction`\>

Register a new creator to an existing establishment

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `params` | [`RegisterCreatorParams`](interfaces/RegisterCreatorParams.md) | `undefined` | name and symbol to use for the creator |
| `signer` | `PublicKey` | `undefined` | public key of the caller |
| `establishment` | `PublicKey` | `undefined` | establishment publicKey |
| `establishmentAuthority?` | `PublicKey` | `undefined` | public key of the establishment authority, only used if you updated your establishment authority through the `updateAuthority` instruction |
| `feePayer?` | `PublicKey` | `undefined` | default to `signer` |
| `programId` | `PublicKey` | `PROGRAM_ID` | default to seaway program ID |

#### Returns

`Promise`\<`TransactionInstruction`\>

#### Defined in

registerCreator.ts:43

___

### registerEstablishmentInstruction

▸ **registerEstablishmentInstruction**(`params`, `signer`, `establishment`, `feePayer?`, `programId?`): `Promise`\<`TransactionInstruction`\>

Create a new establishment

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `params` | `RegisterEstablishmentParams` | `undefined` | params of the new establishment (contains the requiresignoff options, fees and base uri) |
| `signer` | `PublicKey` | `undefined` | publicKey signing the transaction |
| `establishment` | `PublicKey` | `undefined` | public Key for the new establishment |
| `feePayer?` | `PublicKey` | `undefined` | default to signer |
| `programId` | `PublicKey` | `PROGRAM_ID` | default to seaway program ID |

#### Returns

`Promise`\<`TransactionInstruction`\>

#### Defined in

registerEstablishment.ts:35

___

### registerMembershipInstruction

▸ **registerMembershipInstruction**(`params`, `authority`, `membership`, `mint`, `creator?`, `feePayer?`, `programId?`): `Promise`\<`TransactionInstruction`\>

Create a new membership for a given creator

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `params` | [`RegisterMembershipParams`](interfaces/RegisterMembershipParams.md) | `undefined` | Parameters for the new membership |
| `authority` | `PublicKey` | `undefined` | Creator's account pubKey |
| `membership` | `PublicKey` | `undefined` | Data account used to store membership datas, |
| `mint` | `PublicKey` | `undefined` | Mint account of the membership |
| `creator?` | `PublicKey` | `undefined` | [Optional] Creator's PDA, by default this value is derived from authority's publickey |
| `feePayer?` | `PublicKey` | `undefined` | [Optional] specific account paying for rent and transaction fees, default equal to authority |
| `programId` | `PublicKey` | `PROGRAM_ID` | [Optional] Default to seaway program ID |

#### Returns

`Promise`\<`TransactionInstruction`\>

#### Defined in

registerMembership.ts:42

___

### renewInstruction

▸ **renewInstruction**(`durationInMonths`, `signer`, `establishment`, `membershipPublicKey`, `membership`, `nft`, `feePayer?`, `programId?`): `Promise`\<`TransactionInstruction`[]\>

Renew a subscription for a given membership

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `durationInMonths` | `number` | `undefined` | Duration of the subscription renewal |
| `signer` | `PublicKey` | `undefined` | Transaction signer, must be the actual owner of the subscription |
| `establishment` | `PublicKey` | `undefined` | Establishment publicKey where the subscription have been associated to |
| `membershipPublicKey` | `PublicKey` | `undefined` | Membership data account |
| `membership` | `Membership` | `undefined` | Membership data structure describing the membership |
| `nft` | `PublicKey` | `undefined` | Mint account publicKey for the renewed subscription |
| `feePayer?` | `PublicKey` | `undefined` | transaction fees and rent payer, default to `signer` |
| `programId` | `PublicKey` | `PROGRAM_ID` | Default to seaway program ID |

#### Returns

`Promise`\<`TransactionInstruction`[]\>

#### Defined in

renew.ts:35

___

### subscribeInstruction

▸ **subscribeInstruction**(`durationInMonths`, `signer`, `establishment`, `membershipPublicKey`, `membership`, `nft`, `feePayer?`, `programId?`): `Promise`\<`TransactionInstruction`[]\>

Subscribe to a given membership

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `durationInMonths` | `number` | `undefined` | duration of the subscription, in months |
| `signer` | `PublicKey` | `undefined` | Transaction signer |
| `establishment` | `PublicKey` | `undefined` | Publickey of the establishment |
| `membershipPublicKey` | `PublicKey` | `undefined` | PublicKey of the membershp data account holding membership informations |
| `membership` | `Membership` | `undefined` | Membership struct representing the membership datas |
| `nft` | `PublicKey` | `undefined` | Mint account of the membership you want to subscribe to |
| `feePayer?` | `PublicKey` | `undefined` | Payer for the transaction fees and for rent, default to signer |
| `programId` | `PublicKey` | `PROGRAM_ID` | default to seaway program ID |

#### Returns

`Promise`\<`TransactionInstruction`[]\>

#### Defined in

subscribe.ts:41

___

### updateEstablishmentInstruction

▸ **updateEstablishmentInstruction**(`params`, `signer`, `establishment`, `programId?`): `Promise`\<`TransactionInstruction`\>

Update a given establishment

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `params` | `UpdateEstablishmentParams` | `undefined` | New values |
| `signer` | `PublicKey` | `undefined` | transaction signer, must have authority on the establishment |
| `establishment` | `PublicKey` | `undefined` | publicKey of the establishment account |
| `programId` | `PublicKey` | `PROGRAM_ID` | Default to seaway program ID |

#### Returns

`Promise`\<`TransactionInstruction`\>

#### Defined in

updateEstablishment.ts:36
