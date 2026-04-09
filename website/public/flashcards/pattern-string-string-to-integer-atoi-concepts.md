## String - String to Integer (atoi): Core Concepts

What are the fundamental principles for implementing string to integer conversion?

<!-- front -->

---

### Core Concept

**Sequential state machine**: Process string in strict order - whitespace → sign → digits. The "aha!" moment is checking for overflow **BEFORE** the operation that would cause it.

---

### Key Insights

| Insight | Why It Matters | Implementation |
|---------|----------------|----------------|
| **Whitespace skipping** | Leading spaces are irrelevant | `while s[i] == ' ': i++` |
| **Sign handling** | Only one sign is valid | Check once, store multiplier |
| **Overflow prevention** | 32-bit bounds must be enforced | Check BEFORE `result * 10 + digit` |
| **Early termination** | Stop at first non-digit | `while s[i].isdigit()` |
| **Empty/invalid handling** | Return 0 for no valid number | Return 0 if no digits found |

---

### The Critical Overflow Check

**Why check BEFORE?**

```python
# WRONG: Check after - may already overflow
result = result * 10 + digit
if result > INT_MAX:  # Too late!
    return INT_MAX

# CORRECT: Check before
if result > (INT_MAX - digit) // 10:
    return INT_MAX  # Would overflow
result = result * 10 + digit
```

**The formula explained:**

```
We want to check: result * 10 + digit > INT_MAX

Rearranging: result * 10 > INT_MAX - digit
             result > (INT_MAX - digit) / 10

This rearrangement prevents overflow during the check itself.
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Input validation** | Convert user input to numbers | Form inputs, CLI args |
| **Data parsing** | Extract numbers from text | Log processing, CSV |
| **String processing** | Custom numeric parsers | Version numbers, IDs |
| **Error handling** | Graceful invalid input | Sanitization |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass through string |
| Space | O(1) | Fixed number of variables |
| Overflow | O(1) | Constant-time check |

---

### State Machine Diagram

```
┌──────────┐
│  START   │
└────┬─────┘
     │ skip whitespace
     ▼
┌──────────┐     +       ┌──────────┐
│  SIGN?   │────────────▶│ SIGN = 1 │
│  (+/-)   │     -       └────┬─────┘
└────┬─────┘────────────▶│ SIGN = -1│
     │ no sign          └────┬─────┘
     │                      │
     └──────────────────────┘
              │
              ▼
┌─────────────────────┐
│  PARSE DIGITS       │
│  overflow check     │
│  result = r*10 + d  │
└──────────┬──────────┘
           │
     non-digit
           ▼
┌─────────────────────┐
│  RETURN sign*result │
└─────────────────────┘
```

<!-- back -->
