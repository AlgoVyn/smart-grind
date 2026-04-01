## Title: Sparse Table - Frameworks

What are the structured approaches for implementing and using Sparse Tables?

<!-- front -->

---

### Framework 1: Standard Sparse Table for RMQ

```
┌─────────────────────────────────────────────────────────┐
│  SPARSE TABLE FRAMEWORK - Range Minimum Query            │
├─────────────────────────────────────────────────────────┤
│  1. Precompute log2 values for 1 to n                    │
│  2. Build table:                                         │
│     a. table[0][i] = arr[i] for all i                    │
│     b. For j from 1 to log(n):                           │
│        For i from 0 to n - 2^j:                          │
│          table[j][i] = min(table[j-1][i],                │
│                          table[j-1][i + 2^(j-1)])        │
│  3. Query [L, R]:                                        │
│     a. len = R - L + 1                                   │
│     b. k = log[len]                                      │
│     c. return min(table[k][L], table[k][R - 2^k + 1])      │
└─────────────────────────────────────────────────────────┘
```

---

### Framework 2: Multi-Operation Sparse Table

```
┌─────────────────────────────────────────────────────────┐
│  MULTI-OPERATION SPARSE TABLE                            │
├─────────────────────────────────────────────────────────┤
│  Build separate tables for each operation:               │
│  - min_table for range minimum                           │
│  - max_table for range maximum                           │
│  - gcd_table for range GCD                               │
│                                                           │
│  All tables built simultaneously during preprocessing    │
│  Query uses appropriate table based on operation         │
└─────────────────────────────────────────────────────────┘
```

---

### Framework 3: Precomputation Template

```python
def __init__(self, arr, func=min):
    self.n = len(arr)
    self.func = func
    
    # Precompute logs
    self.log = [0] * (self.n + 1)
    for i in range(2, self.n + 1):
        self.log[i] = self.log[i // 2] + 1
    
    self.log_n = self.log[self.n] + 1
    
    # Build table: table[j][i] = result for [i, i + 2^j - 1]
    self.table = [[0] * self.n for _ in range(self.log_n)]
    
    # Base case: intervals of length 1
    for i in range(self.n):
        self.table[0][i] = arr[i]
    
    # Build for larger intervals
    for j in range(1, self.log_n):
        for i in range(self.n - (1 << j) + 1):
            self.table[j][i] = self.func(
                self.table[j-1][i],
                self.table[j-1][i + (1 << (j-1))]
            )
```

<!-- back -->
