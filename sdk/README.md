# Seaway SDK

This SDK allow you to easily interact with the seaway program to register establishment, creator, create membership or subscribe to a particular creator

## Install

seaway sdk is a npm package you can install with `npm install seaway-sdk`

## Get started

### Create an establishment

```javascript
const seaway = require("seaway-sdk");
const {
    sendAndConfirmTransaction,
    clusterApiUrl,
    Connection,
    Keypair,
    Transaction,
    PublicKey
} = require("@solana/web3.js");


const connection = new Connection(clusterApiUrl("devnet"));
const payer = Keypair.fromSecretKey(secretPayerKey) //use your key or use wallet adapter
    const establishment = Keypair.generate()
    
    let transaction = new Transaction();
    transaction.add(
            //create a new establishment
            await seaway.registerEstablishmentInstruction(
                {
                    requiresSignOff: false,
                    // Because this parameter is 2 digit precision, 1000 = 10% fees 
                    saleBasisPoints: 1000,  
                    // 10% fees on royalties
                    royaltiesShare: 10,
                    baseUri: "https://example.com"
                },
                payer.publicKey,
                establishment.publicKey
            )
    );   

    let res = await sendAndConfirmTransaction(connection, transaction, [payer, establishment])
    console.log("created establishment: ", res);
```

### Register a new creator

```javascript
transaction = new Transaction();
transaction.add(
    await seaway.registerCreatorInstruction(
        {
            name: "New test creator",
            symbol: "TESTUSR"
        },
        creator.publicKey,
        establishment.publicKey
    )
);
res = await sendAndConfirmTransaction(connection, transaction, [creator, payer])
console.log("created creator: ", res);

```

### Create a new membership

```javascript
transaction = new Transaction();
    transaction.add(
        await seaway.registerMembershipInstruction(
            {
                name: "premium",
                price: 10,
                royalties: 10,
                supply: 1000,
                symbol: "PREMIUM"
            },
            creator.publicKey,
            membership.publicKey,
            new PublicKey("So11111111111111111111111111111111111111112") //to use SOL
        )
    );

    res = await sendAndConfirmTransaction(connection, transaction, [creator, membership])
```

### Subscribe to a creator

```javascript
const nft = Keypair.generate();
const m = await Membership.fromAccountAddress(connection, new PublicKey("B1X3komt5spt1t1zN8XrFKZehswP7cXRcupbuAJ82EC8"));

const transaction = new Transaction();
transaction.add(
    await seaway.subscribeInstruction(
        1,
        payer.publicKey,
        establishment.publicKey,
        new PublicKey("B1X3komt5spt1t1zN8XrFKZehswP7cXRcupbuAJ82EC8"),
        m,
        nft.publicKey
    )
);

res = await sendAndConfirmTransaction(connection, transaction, [payer, nft])
console.log("subscription created: ", res);
```


## API Documentation

Further documentation is available in the [docs](./docs/) folder