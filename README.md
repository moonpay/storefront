# Collection Storefront

## 🎨 Configuration
Configuration files are used to turn this generic storefront into an on-brand experience. All configuration files export a single object.

### Contract Configuration

These values can be found under the `Developer` tab of your contract in the [HyperMint Dashboard](https://app.hypermint.com/)


> It is important to keep the import from the HyperMint script to allow use of the enums

### Theme Configuration

These values allow you to change the general themeing (colours and images) of your storefront.
This WILL NOT alter any layouts and currently does not impact the fonts.

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
<!-- TODO: write steps on how to deploy this (maybe reccomend a provider (netlify?)) -->