## Rabin-Karp: Core Concepts

What are the fundamental principles of the Rabin-Karp string matching algorithm?

<!-- front -->

---

### Core Concept

Use **rolling hash** to compare pattern hash with substring hashes. Only compare characters when hashes match.

**Key insight**: Compute hash of next window in O(1) from previous window's hash.

---

### Rolling Hash Formula

For base b and modulus m:

```
Hash("abcd") = (a×b³ + b×b² + c×b¹ + d×b⁰) mod m

Next window "bcde":
hash = ((old_hash - a×b³) × b + e) mod m
     = ((old_hash - a×b^(len-1)) × b + e) mod m
```

---

### Visual: Rolling Hash

```
Text:  "abcd", Pattern: "bc"
Base: 26, Mod: large prime

Hash("ab") = (0×26 + 1) = 1 (assuming a=0, b=1, ...)

Roll to "bc":
  1. Subtract leftmost × base^(len-1)
     1 - 0×26 = 1
  2. Multiply by base
     1 × 26 = 26
  3. Add new char
     26 + 2 = 28

Hash("bc") = 28
```

---

### Collision Handling

| Approach | Method | Tradeoff |
|----------|--------|----------|
| Single hash | One mod | May have collisions |
| Double hash | Two mods | Very unlikely collision |
| Verify on match | Compare strings | O(L) extra per match |

---

### Complexity

| Case | Time | Notes |
|------|------|-------|
| Average | O(n + m) | Few spurious matches |
| Worst | O(n × m) | All positions match hash |
| Space | O(1) | Rolling computation |

**n** = text length, **m** = pattern length

<!-- back -->
