## Sliding Window - Character Frequency Matching: Core Concepts

What are the fundamental principles of character frequency matching with sliding window?

<!-- front -->

---

### Core Concept 1: Frequency Comparison

For a substring to satisfy the pattern requirement, the frequency of each character must meet specific criteria:

| Problem Type | Frequency Requirement | Example |
|--------------|----------------------|---------|
| **Minimum Window** | Window count >= pattern count | t="ABC", window="BANC" (A≥1, B≥1, C≥1) |
| **Anagram Detection** | Window count == pattern count | t="ab", window="ab" or "ba" |

**Key Insight:**
```
Pattern: t = "ABC"
         A:1, B:1, C:1

Window: "BANC"
        B:1 (≥1 ✓), A:1 (≥1 ✓), N:1 (not in t), C:1 (≥1 ✓)

Valid because: B≥1, A≥1, C≥1 (extra chars allowed for minimum window)
```

---

### Core Concept 2: Sliding Window Efficiency

Instead of checking O(n²) substrings, sliding window achieves O(n):

**Why it works:**
- **Expand:** Right pointer adds new characters
- **Contract:** Left pointer removes when condition met
- **Monotonic:** Both pointers only move forward

```
String: "ADOBECODEBANC"
Pattern: "ABC"

Step 1: Expand [A] → [AD] → [ADO] → [ADOB] → [ADOBE] → [ADOBEC] ✓
        Contains A, B, C

Step 2: Contract [DOBEC] → [OBEC] → [BEC] ✗ (no A)
        Best so far: "ADOBEC" (length 6)

Step 3: Expand again from BEC...
        Eventually finds "BANC" (length 4) ✓ Best!

Total operations: O(n) - each char processed at most twice
```

---

### Core Concept 3: Counter-Based Tracking

Three essential tracking mechanisms:

```
┌────────────────────────────────────────────────────────────┐
│  COUNTER TRACKING COMPONENTS                                 │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PATTERN COUNT (t_count)                                  │
│     └── What we need: frequency of each char in t          │
│                                                              │
│  2. WINDOW COUNT (window_count)                            │
│     └── What we have: frequency in current window            │
│                                                              │
│  3. MATCHED/SATISFIED (formed/match_count)                  │
│     └── How many unique chars meet requirement             │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

**Example:**
```
t = "AABC"
t_count = {A:2, B:1, C:1}
required = 3  # unique characters

Window: "AABC"
window_count = {A:2, B:1, C:1}
formed = 3   # A(2==2✓), B(1==1✓), C(1==1✓)

Window: "AABD"
window_count = {A:2, B:1, D:1}
formed = 2   # A and B match, D not needed, C missing
```

---

### Core Concept 4: Two Problem Categories

| Category | Goal | Window Behavior | Example Problems |
|----------|------|-----------------|------------------|
| **Minimum Window** | Smallest window containing all chars | Variable-length, expand until valid, shrink to minimum | Min Window Substring |
| **Permutation/Anagram** | Check if any window is exact match | Fixed-length, compare counts directly | Permutation in String, Find All Anagrams |

**Decision:**
```
Problem asks for:
├── "smallest/minimum window containing..." → VARIABLE LENGTH
├── "find all anagrams..." → FIXED LENGTH  
├── "permutation of... exists" → FIXED LENGTH
└── "substring with all characters..." → VARIABLE LENGTH
```

---

### Core Concept 5: Complexity Analysis

| Aspect | Fixed-Length | Variable-Length | Optimized |
|--------|--------------|-----------------|-----------|
| **Time** | O(m + n) | O(m + n) | O(m + n) |
| **Space** | O(Σ) or O(k) | O(m + n) | O(Σ) |
| **Comparison** | Full array/hash compare | Hash map operations | Match count |

Where:
- m = len(s), n = len(t)
- Σ = alphabet size (26 lowercase, 128 ASCII, 256 extended)
- k = unique characters in t

**Space Choices:**
- Fixed array (size 26/128/256): Fast access, O(1)
- Hash map: Flexible for unicode, O(k)

<!-- back -->
