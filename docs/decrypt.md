# Action Handler: Decrypt file

Decrypt single file that was previously encrypted.

**ID:** `com.fireblink.fbl.plugin.crypto.decrypt`

**Aliases:**

* `fbl.plugin.crypto.decrypt`
* `plugin.crypto.decrypt`
* `crypto.decrypt`
* `decrypt`

**Example 1: Override file**

```yaml
decrypt:
  # [required] password used to decrypt files
  # Warning: don't reference it directly, better place in "secrets", as in report it will be masked.    
  password: <%- secrets.password %>

  # [required] file path to decrypt
  file: /tmp/encrypted
```

**Example 2: Store decrypted file in different location**

```yaml
decrypt:
  # [required] password used to decrypt files
  # Warning: don't reference it directly, better place in "secrets", as in report it will be masked.    
  password: <%- secrets.password %>

  # [required] file path to decrypt
  file: /tmp/encrypted

  # [optional] Alternative location to store decrypted file
  destination: /tmp/decrypted
```