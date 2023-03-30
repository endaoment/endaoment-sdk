<a href="https://developers.endaoment.org/" target="_blank" rel="noopener">
  <picture>
    <img alt="Endaoment developers" src="https://storage.googleapis.com/endaoment-static/readme-assets/sdk-readme-cover.png" />
  </picture>
</a>

<div align="center">
  <h1>Endaoment SDK</h1>
  <a href="https://docs.endaoment.org/developers">
    <img src="https://img.shields.io/static/v1?label=&message=Documentation&colorA=E4EBF4&colorB=E4EBF4&style=flat&logo=gitbook" alt="Gitbook">
  </a>
  <a href="https://www.npmjs.com/package/@endaoment/sdk">
    <img src="https://img.shields.io/npm/v/@endaoment/sdk?colorA=53ACDE&colorB=161b22&style=flat" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@endaoment/sdk">
    <img src="https://img.shields.io/npm/dm/@endaoment/sdk?colorA=EA6B0E&colorB=161b22&style=flat" alt="Downloads per month">
  </a>
  <br/>
    <a href="https://twitter.com/endaomentdotorg">
    <img src="https://img.shields.io/twitter/url.svg?label=%40endaomentdotorg&style=social&url=https%3A%2F%2Ftwitter.com%2Fendaomentdotorg" alt="@endaomentdotorg">
      <a href="https://discord.gg/endaoment">
        <img alt="Discord" src="https://img.shields.io/discord/734855436276334746?color=7389D8&label&logo=discord&logoColor=ffffff" />
        </a>
        <a href="https://etherscan.io/address/0xbe21e4cf884c8b2517e4e199487f8b505841cb36">
        <img src="https://img.shields.io/static/v1?label=ENS&message=endaoment.eth&colorA=696F8C&colorB=696F8C&style=flat&logo=ethereum" alt="endaoment.eth">
        </a>
  </a>
  <br/><br/>
</div>

This repository contains the SDK for developers to utilize in order to easily assemble blockchain calls to interact with
the Endaoment ecosystem as well as interface with Endaoment APIs in order to fetch information on entities like Funds
and Orgs.

This TypeScript/JavaScript client utilizes [Fetch API](https://fetch.spec.whatwg.org/). The module can be used in the
following environments:

**:earth_americas: Environment**

- Node.js
- Webpack
- Browserify

**:speaking_head: Language level**

- ES5 - you must have a Promises/A+ library installed
- ES6

**:gear: Module system**

- CommonJS
- ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition should be automatically resolved via
`package.json`. ([Reference](http://www.typescriptlang.org/docs/handbook/typings-for-npm-packages.html))

## Getting started

Navigate to the folder of your consuming project and run the following commands.

```bash
yarn install @endaoment/sdk
```

In order to use the functionality available in the library, you must then import `EndaomentSdkApi` from the library and
instantiate it.

```ts
const api = new EndaomentSdkApi()
```

Optionally, you can pass a Configuration object when you create the variable in order to add things like middleware or
to choose which network to use.

```ts
const apiConfig = new Configuration({ network: "goerli" })
const api = new EndaomentSdkApi(apiConfig)
```

Going from there, you will be able to access the available functionalities simply by accessing methods on that object.

```
api.[functionality to execute]()
```

## Examples

### Get a list of deployed Orgs, with pagination

```ts
api.getDeployedOrgs()
```

Example response:

```json
[
  {
    id: "12345678-946e-4f90-ad87-b520d4db179b",
    name: "Sostento Inc",
    ein: "843739888",
    contractAddress: "0x9ee4718e6cae47c9ac0ee1cb459332698c3fd25d",
    logoUrl: "https://example.com/the-orgs-logo.jpg",
    nteeCode: "S02",
    nteeDescription: "Management & Technical Assistance",
    description: "Our mission is to save lives by supporting organizations that serve on the frontline of public health emergencies.",
    endaomentUrl: "https://app.endaoment.org/orgs/843739888",
  },
  {
    name: "Open Source Election Technology Institute",
    ein: "208743186",
    ...
  },
  {
    name: "Rock the Vote",
    ein: "020767157",
    ...
  },
  ...
]
```

Since this functionality is paginated, it accepts the arguments of `count` and `offset`

### Search for an Org (paginated)

```ts
api.searchOrgs({
  searchTerm: 'health',
  nteeMajorCodes: 'S'
})
```

This call will result in something like:

```json
[
  {
    name: "Sostento Inc",
    ein: "843739888",
    contractAddress: "0x9ee4718e6cae47c9ac0ee1cb459332698c3fd25d",
    description: "Our mission is to save lives by supporting organizations that serve on the frontline of public health emergencies.",
    endaomentUrl: "https://app.endaoment.org/orgs/843739888",
    nteeCode: "S02",
    nteeDescription: "Management & Technical Assistance",
  },
  ...
]
```

You can find the full list of NTEE Codes over [here](https://nccs.urban.org/publication/irs-activity-codes).

Since this functionality is paginated, it accepts the arguments of `count` and `offset`

### Assemble transaction data to Deploy an Org Contract

```ts
api.getOrgDeployTransaction({
  ein: '020767157' // Deploying Org with this EIN
})
```

Executing this will return you the Contract Address you must interact with in the `to` field and the calldata you must
provide it in the `data` field. The client's provider is responsible for executing this transaction with the data
provided.

This call will result in something like:

```json
{
  data: "0xa60fe71d3635313031313939390000000000000000000000000000000000000000000000",
  to: "0x10fd9348136dcea154f752fe0b6db45fc298a589",
  value: "0"
}
```

or in the case that the EIN is invalid, it will look like:

```json
{
  error: "Not Found",
  message: "Could not find org with EIN 123456789",
  statusCode: 404
}
```

### Assemble transaction data to Donate to an Org Contract

```ts
api.getDonationSwapTransaction({
    ein: '020767157', // Donating to Org with this EIN
    amountIn: '1000000000000000000', // Donating 1 ETH
})
```

Executing this will return you a full quote to swap any ERC-20 to USDC and donate it to the supplied Org. In order to
execute the donation, you must have the client's provider execute a Contract Interaction with the given `to` address and
provide it with the `data` field as calldata.

This call will result in something like:

```json
{
  "data": "0xa2f48b9f000000000000000000000000df01af7e93453c081408921742043df8c8f8c039000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001a45ae401dc000000000000000000000000000000000000000000000000000000006424571f00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000001f40000000000000000000000007ecc1d4936a973ec3b153c0c713e0f71c59abf530000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000004b2d360700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "quote": {
    "expectedUsdc": "1273866693",
    "minimumTolerableUsdc": "1261254151",
    "priceImpact": 0.286908
  },
  "to": "0x7ecc1d4936a973ec3b153c0c713e0f71c59abf53",
  "value": "1000000000000000000"
}
```

or in the case that the EIN is invalid, it will look like:

```json
{
  error: "Not Found",
  message: "Could not find org with EIN 123456789",
  statusCode: 404
}
```

> Note that USDC donations do not require a swap and will return a direct `donate` contract call, like the below example

```json
{
  "data": "0xf14faf6f00000000000000000000000000000000000000000000000000000000000f4240",
  "quote": {
    "expectedUsdc": "2500000000",
    "minimumTolerableUsdc": "2500000000",
    "priceImpact": 0
  },
  "to": "0x7ecc1d4936a973ec3b153c0c713e0f71c59abf53",
  "value": "0"
}

```

### Get a list of visible Endaoment Funds (paginated)
  
```ts
api.getVisibleFunds()
```

> Due to visibility settings, this query will only return `transparent` and `community` funds. No `private` funds will be returned.

### Search through visible Endaoment Funds (paginated)

```ts
sdk.searchVisibleFunds({ name: 'Fund Name' })
```

> Due to visibility settings, this query will only return `transparent` and `community` funds. No `private` funds will be returned.


## Potential Errors

### "ReferenceError: fetch is not defined"

This error is due to your environment not having fetch functionality available. It is very important to note that fetch
is available in most modern browsers or on Node 18+. In order to use it you will either have to move your project into
one of these environments (if its feasible to do so) or install a polyfill for it.

### "TypeError: Cannot read properties of undefined (reading 'length')"

This is most likely caused by an incorrect configuration object being supplied to the `EndaomentSdkApi` class. Please
make sure to instantiate it by providing a `Configuration` class as a parameter, you can import this from the SDK
module.

### "this.configuration.queryParamsStringify is not a function"

This is most likely caused by an incorrect configuration object being supplied to the `EndaomentSdkApi` class. Please
make sure to instantiate it by providing a `Configuration` class as a parameter, you can import this from the SDK
module.

### "The request failed and the interceptors did not return an alternative response"

While there is many possible causes for this particular problem, it is most likely due to an issue with the connection
between the client sending the requests and the Endaoment API. Please check your internet connection to make sure all is
well. If that does not resolve the issue, there may be a problem occurring with a hosting provider or the API itself.

> In case you find an issue that is not listed here, please open an issue on the Github repo.

## Building

Please take note that most of the content in this library is automatically generated using an OpenAPI generator. In
order to update descriptions or add new functionality, please refer back to the SDK module on Endaoment's backend.

To build and compile the typescript sources to javascript use:

```
yarn
yarn build
```

## Publishing

First build the package then run `yarn publish`
