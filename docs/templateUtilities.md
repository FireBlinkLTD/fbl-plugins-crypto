# Template Utilities

Refer to fbl [documentation](https://fbl.fireblink.com/flows/utilities) for information how to use template utilities.

## Memorable Password Generator

Generate a memorable password, like the following `world-dog-hello-brown`.

```js
// Generate random memorable 4 words password with `-` delimiter between words.
$.password.generate();

// Generate random memorable 2 words password with `-` delimiter between words.
$.password.generate(2);

// Generate random memorable 3 words password with custom `_` delimiter between words.
$.password.generate(3, '_');
```
