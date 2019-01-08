# FBL Plugins: Crypto

Encrypt/decrypt files with ease in your [fbl](https://fbl.fireblink.com) flows.

[![CircleCI](https://circleci.com/gh/FireBlinkLTD/fbl-plugins-crypto.svg?style=svg)](https://circleci.com/gh/FireBlinkLTD/fbl-plugins-crypto) [![Greenkeeper badge](https://badges.greenkeeper.io/FireBlinkLTD/fbl-plugins-crypto.svg)](https://greenkeeper.io/)

## Integration

There are multiple ways how plugin can be integrated into your flow.

### package.json

This is the most recommended way. Create `package.json` next to your flow file with following content:

```json
{
  "name": "flow-name",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "fbl": "fbl"    
  },
  "license": "UNLICENSED",
  "dependencies": {
    "@fbl-plguins/crypto": "0.1.0",
    "fbl": "1.3.0"
  }
}
```

Then you can install dependencies as any other node module `yarn install` depending on the package manager of your choice.

After that you can use `yarn fbl <args>` to execute your flow or even register a custom script inside "scripts".

### Global installation

`npm i -g @fbl-plguins/crypto`

### Register plugin to be accessible by fbl

- via cli: `fbl -p @fbl-plguins/crypto <args>`
- via flow:

```yaml
requires:
  plugins:
    '@fbl-plguins/crypto': '>=0.1.0'
    
pipeline:
  # your flow goes here
```

## Action Handlers

- [encrypt](docs/encrypt.md)
- [decrypt](docs/decrypt.md)