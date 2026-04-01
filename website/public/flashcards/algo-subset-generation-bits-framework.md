## Title: Subset Generation (Bits) - Frameworks

What are the structured approaches for bit-based subset generation?

<!-- front -->

---

### Framework 1: Basic Subset Generation

```
┌─────────────────────────────────────────────────────────────┐
│  BASIC SUBSET GENERATION FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  1. Let n = length of input array                            │
│  2. Calculate total = 1 << n (equals 2^n)                    │
│  3. For mask from 0 to total - 1:                           │
│     a. Create empty subset list                            │
│     b. For i from 0 to n-1:                               │
│        - If mask & (1 << i): add nums[i] to subset        │
│     c. Add subset to result list                            │
│  4. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

---

### Framework 2: Optimized Bit Iteration

```
┌─────────────────────────────────────────────────────────────┐
│  OPTIMIZED BIT ITERATION FRAMEWORK                          │
├─────────────────────────────────────────────────────────────┤
│  1. For each mask from 0 to 2^n - 1:                        │
│     a. subset = []                                          │
│     b. bit = mask, idx = 0                                  │
│     c. While bit > 0:                                       │
│        - If bit & 1: add nums[idx] to subset               │
│        - bit >>= 1, idx += 1                                │
│     d. Add subset to result                                 │
│  2. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** When average subset size is much smaller than n.

---

### Framework 3: Subset Size Filtering

```
┌─────────────────────────────────────────────────────────────┐
│  SIZE-FILTERED SUBSET FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  1. Let k = target subset size                             │
│  2. For mask from 0 to 2^n - 1:                             │
│     a. If bit_count(mask) != k: skip                        │
│     b. Build subset from mask (only k elements)           │
│     c. Add subset to result                                │
│  3. Return result                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use:** Need only subsets of specific size (combinations).

<!-- back -->
