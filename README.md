# FBL Plugins: Crypto

Encrypt/decrypt files with ease in your [fbl](https://fbl.fireblink.com) flows.

[![CircleCI](https://circleci.com/gh/FireBlinkLTD/fbl-plugins-crypto.svg?style=svg)](https://circleci.com/gh/FireBlinkLTD/fbl-plugins-crypto) [![Greenkeeper badge](https://badges.greenkeeper.io/FireBlinkLTD/fbl-plugins-crypto.svg)](https://greenkeeper.io/)
[![codecov](https://codecov.io/gh/FireBlinkLTD/fbl-plugins-crypto/branch/master/graph/badge.svg)](https://codecov.io/gh/FireBlinkLTD/fbl-plugins-crypto)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/FireBlinkLTD/fbl-plugins-crypto.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/FireBlinkLTD/fbl-plugins-crypto/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/FireBlinkLTD/fbl-plugins-crypto.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/FireBlinkLTD/fbl-plugins-crypto/context:javascript)

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
    "@fbl-plguins/crypto": "1.1.0",
    "fbl": "1.7.0"
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
  fbl: '>=1.7.0'
  plugins:
    '@fbl-plguins/crypto': '>=1.1.0'

pipeline:
  # your flow goes here
```

## Action Handlers

- [encrypt](docs/encrypt.md)
- [decrypt](docs/decrypt.md)
