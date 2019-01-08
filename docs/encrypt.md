# Action Handler: Encrypt file

Encrypt single file with aes-256-cbc algorythm and password converted with pbkdf2 algorithm into sha512 hash.

**ID:** `com.fireblink.fbl.plugin.crypto.encrypt`

**Aliases:**

* `fbl.plugin.crypto.encrypt`
* `plugin.crypto.encrypt`
* `crypto.encrypt`
* `encrypt`

**Example 1: Override file**

```yaml
encrypt:
  # [required] password used to encrypt files
  # Warning: don't reference it directly, better place in "secrets", as in report it will be masked.    
  password: <%- secrets.password %>

  # [required] File to encrypt
  file: /tmp/decrypted
```

**Example 2: Store encrypted file in different location**

```yaml
encrypt:
  # [required] password used to encrypt files
  # Warning: don't reference it directly, better place in "secrets", as in report it will be masked.    
  password: <%- secrets.password %>

  # [required] File to encrypt
  file: /tmp/decrypted

  # [optional] Alternative location to store encrypted file
  destination: /tmp/encrypted
```