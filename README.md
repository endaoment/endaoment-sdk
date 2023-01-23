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
const api = new EndaomentSdkApi({ network: "goerli" })
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

Since this functionality is paginated, it accepts the arguments of `count` and `offset`

### Search for an Org (paginated)

```
api.searchDeployedOrgs({
  name: 'foo',
  nteeMajorCodes: 'A' // Optional, go from A to Z single letter only
})
```

You can find the full list of NTEE Codes over [here](https://nccs.urban.org/publication/irs-activity-codes).

Since this functionality is paginated, it accepts the arguments of `count` and `offset`

### Assemble transaction data to Deploy an Org Contract

```
api.getOrgDeployTransaction({
  ein: '123456789' // Deploying Org with this EIN
})
```

Executing this will return you the Contract Address you must interact with in the `to` field and the calldata you must provide it in the `data` field. The client's provider is responsible for executing this transaction with the data provided.

### Assemble transaction data to Donate to an Org Contract

```
api.getDonationSwapTransaction({
    ein: '123456789', // Donating to Org with this EIN
    amountIn: '100000000', // Donating 100 USDC
})
```

Executing this will return you a full quote to swap any ERC-20 to USDC and donate it to the supplied Org. In order to execute the donation, you must have the client's provider execute a Contract Interaction with the given `to` address and provide it with the `data` field as calldata.

## Building

Please take note that most of the content in this library is automatically generated using an OpenAPI generator. In order to update descriptions or add new functionality, please refer back to the SDK module on Endaoment's backend.

To build and compile the typescript sources to javascript use:

```
yarn
yarn build
```

## Publishing

First build the package then run `yarn publish`
