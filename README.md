# Collection Storefront
This repo can be used out the box to run an EVM based NFT drop. It can be easily customised using the config settings detailed in this README. If you require something more custom, feel free to use this repo as your foundation 🚀

## 🎨 Configuration
Configuration files are used to turn this generic storefront into an on-brand experience. All configuration files export a single object.

### Contract Configuration

These values can be found under the `Developer` tab of your contract in the [HyperMint Dashboard](https://app.hypermint.com/)

#### Options
| key                | value    | Required | description                                                                                          | Default Value                |
|--------------------|----------|----------|------------------------------------------------------------------------------------------------------|------------------------------|
| contractId         | string   | ✅        | The unique identifier of the contract                                                                |                              |
| contractAddress    | string   | ✅        | The public address of the contract                                                                   |                              |
| contractType       | string   | ✅        | The Ethereum standard the contract uses (use NFTContractType exported from the HyperMint package)    |                              |
| networkEnvironment | string   | ✅        | The network the contract is deployed to (use NetworkEnvironment exported from the HyperMint package) |                              |
| networkType        | string   | ✅        | The blockchain the contract is deployed to (use NetworkType exported from the HyperMint package)     |                              |
| networkChain       | string   | ✅        | The network chain the contract is deployed to (use NetworkChain exported from the HyperMint package) |                              |
| enableLogging      | boolean  | ❌        | Turn this on to enable logging                                                                       | false                        |
| logger             | function | ❌        | A custom logger function to allow more control over all system logs                                  | function                     |
| hmURL              | string   | ❌        | A custom endpoint for the HyperMint api                                                              | https://api.hypermint.com/v1 |


> It is important to keep the import from the HyperMint script to allow use of the enums

### Theme Configuration

These values allow you to change the general themeing (colours and images) of your storefront.
This WILL NOT alter any layouts and currently does not impact the fonts.

#### Options
| key               | value  | Required | description                                                          |
|-------------------|--------|----------|----------------------------------------------------------------------|
| images.background | string | ✅        | The path to the background image. To use a local asset use `require` |
| images.logo       | string | ✅        | The path to the logo image. To use a local asset use `require`       |
| colors.primary    | string | ✅        | The RGB value for the primary brand colour                           |
| colors.success    | string | ✅        | The RGB value for the success state colour                           |
| colors.error      | string | ✅        | The RGB value for the error state colour                             |


#### Updating Fonts
To update your fonts you should edit the `scss/_variables.scss` file.

### Content Configuration

This will configure the title and description of the collection, as well as the site metadata used by crawlers to display the site on search engines.

#### Options
| key               | value   | Required | description                                                                                                           | Default Value |
|-------------------|---------|----------|-----------------------------------------------------------------------------------------------------------------------|---------------|
| title             | string  | ✅        | The title that shows in the hero of the store                                                                         |               |
| description       | string  | ✅        | The description that shows in the hero of the store                                                                   |               |
| author            | string  | ✅        | The name of the company/person that running the drop                                                                  |               |
| hideSoldOutTokens | boolean | ❌        | When set to true, tokens with no remaining supply will not display. When false tokens will be displayed as 'Sold Out' | false         |

## 👩‍💻 Development
1. Run `npm install`
2. Deploy your contract in the [HyperMint Dashboard](https://app.hypermint.com/)
    > Ths project ONLY works with deployed contracts to prevent people being able to access a drop accidentally
3. Copy your contract configuration from the `Developers` tab of your contract in the [HyperMint Dashboard](https://app.hypermint.com/) and paste it into the exported object inside `config/contract.ts`
4. Run `npm run start`

## 🚀 Deployment
Your build files can be generated by running `npm run build`. As this is just a standard React app built with Create React App it is really simple to deploy. There is a lot of documentation available online on how best to deploy a React site.
