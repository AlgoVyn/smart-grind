## Two Pointers - String Comparison with Backspaces: Core Concepts

What are the fundamental principles for comparing strings with backspace characters?

<!-- front -->

---

### Core Concept

Use **two pointers starting from the end** of each string, simulating the backspace behavior as you compare characters.

**Key insight**: Process strings from right-to-left, counting backspaces to skip characters, just like how backspace actually works.

---

### The Problem

```
Input: s = "ab#c", t = "ad#c"
Processing:
  s: a b ←backspace c → "ac"
  t: a d ←backspace c → "ac"
Result: Equal ✓

Input: s = "ab##", t = "c#d#"
Processing:
  s: a b ←backspace ←backspace → ""
  t: c ←backspace d ←backspace → ""
Result: Equal ✓
```

---

### Why Process from End?

| Direction | Issue | Solution |
|-----------|-------|----------|
| Left-to-right | Don't know how many chars to skip ahead | Would need to scan ahead |
| Right-to-left | Backspace affects chars we've already passed | Natural simulation |

**End-to-start processing** naturally handles backspaces since we already know which characters get deleted.

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Backspace Compare | Compare strings with # as backspace | Backspace String Compare |
| Editor Simulation | Simulate text editor buffer | Various editor problems |
| Undo Operations | Process undo commands | Command history |
| Clean String | Remove chars followed by backspace | String cleaning |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n + m) | Single pass through each string |
| Space | O(1) | Only two pointers, no extra storage |

<!-- back -->
