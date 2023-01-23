# Endaoment SDK

<div align="center">
  <a href="https://www.npmjs.com/package/@endaoment/sdk">
    <img src="https://img.shields.io/npm/v/@endaoment/sdk?colorA=21262d&colorB=161b22&style=flat" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@endaoment/sdk">
    <img src="https://img.shields.io/npm/dm/@endaoment/sdk?colorA=21262d&colorB=161b22&style=flat" alt="Downloads per month">
  </a>
</div>

This repository contains the SDK for developers to utilize in order to easily assemble blockchain calls to interact with the endaoment ecosystem as well as interface with endaoment APIs in order to fetch information on Organizations.

This TypeScript/JavaScript client utilizes [Fetch API](https://fetch.spec.whatwg.org/). The module can be used in the following environments:

Environment

- Node.js
- Webpack
- Browserify

Language level

- ES5 - you must have a Promises/A+ library installed
- ES6

Module system

- CommonJS
- ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition should be automatically resolved via `package.json`. ([Reference](http://www.typescriptlang.org/docs/handbook/typings-for-npm-packages.html))

## Getting started

Navigate to the folder of your consuming project and run the following commands.

```
yarn install @endaoment/sdk
```

In order to use the functionality available in the library, you must then import `EndaomentSdkApi` from the library and instantiate it.

```
const api = new EndaomentSdkApi()
```

Optionally, you can pass a Configuration object when you create the variable in order to add things like middleware or to choose which network to use.

```
const apiConfig = new Configuration({ network: "goerli" })
const api = new EndaomentSdkApi(apiConfig)
```

Going from there, you will be able to access the available functionalities simply by accessing methods on that object.

```
api.[functionality to execute]()
```

## Examples

### Fetch a list of Orgs (paginated)

```
api.getDeployedOrgs()
```

This call will result in something like:

```
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

```
api.searchDeployedOrgs({
  name: 'sostento',
  nteeMajorCodes: undefined // Optional, go from A to Z single letter only
})
```

This call will result in something like:

```
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

You can find the full list of NTEE Codes over [here](https://nccs.urban.org/publication/irs-activity-codes).

Since this functionality is paginated, it accepts the arguments of `count` and `offset`

### Assemble transaction data to Deploy an Org Contract

```
api.getOrgDeployTransaction({
  ein: '020767157' // Deploying Org with this EIN
})
```

Executing this will return you the Contract Address you must interact with in the `to` field and the calldata you must provide it in the `data` field. The client's provider is responsible for executing this transaction with the data provided.

This call will result in something like:

```
{
  data: "0xa60fe71d3635313031313939390000000000000000000000000000000000000000000000",
  to: "0x10fd9348136dcea154f752fe0b6db45fc298a589",
  value: "0"
}
```

or in the case that the EIN is invalid, it will look like:

```
{
  error: "Not Found",
  message: "Could not find org with EIN 123456789",
  statusCode: 404
}
```

### Assemble transaction data to Donate to an Org Contract

```
api.getDonationSwapTransaction({
    ein: '020767157', // Donating to Org with this EIN
    amountIn: '100000000', // Donating 100 USDC
})
```

Executing this will return you a full quote to swap any ERC-20 to USDC and donate it to the supplied Org. In order to execute the donation, you must have the client's provider execute a Contract Interaction with the given `to` address and provide it with the `data` field as calldata.

This call will result in something like:

```
{
  to: "0xc8457e21c1beafe5473fc9a318bfc7fe95db1f62",
  data: "0x5ae401dc0000000000000000000000000000000000000000000000000000000063cec05d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e404e45aaf000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000003d527234b1db6d66e48e403a9dd98def00de98cf0000000000000000000000000000000000000000000000000000000005f5e1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  value: "100000000",
  quote: {
    priceImpact: 100,
    expectedUsdc: "0",
    minimumTolerableUsdc: "0"
  }
}
```

or in the case that the EIN is invalid, it will look like:

```
{
  error: "Not Found",
  message: "Could not find org with EIN 123456789",
  statusCode: 404
}
```

## Potential Errors

### "ReferenceError: fetch is not defined"

This error is due to your environment not having fetch functionality available. It is very important to note that fetch is available in most modern browsers or on Node 18+. In order to use it you will either have to move your project into one of these environments (if its feasible to do so) or install a polyfill for it.

### "TypeError: Cannot read properties of undefined (reading 'length')"

This is most likely caused by an incorrect configuration object being supplied to the `EndaomentSdkApi` class. Please make sure to instantiate it by providing a `Configuration` class as a parameter, you can import this from the SDK module.

### "this.configuration.queryParamsStringify is not a function"

This is most likely caused by an incorrect configuration object being supplied to the `EndaomentSdkApi` class. Please make sure to instantiate it by providing a `Configuration` class as a parameter, you can import this from the SDK module.

### "The request failed and the interceptors did not return an alternative response"

While there is many possible causes for this particular problem, it is most likely due to an issue with the connection between the client sending the requests and the Endaoment API. Please check your internet connection to make sure all is well. If that does not resolve the issue, there may be a problem occurring with a hosting provider or the API itself.

## Building

Please take note that most of the content in this library is automatically generated using an OpenAPI generator. In order to update descriptions or add new functionality, please refer back to the SDK module on Endaoment's backend.

To build and compile the typescript sources to javascript use:

```
yarn
yarn build
```

## Publishing

First build the package then run `yarn publish`
