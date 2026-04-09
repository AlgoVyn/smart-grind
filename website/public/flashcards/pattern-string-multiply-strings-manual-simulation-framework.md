## String - Multiply Strings (Manual Simulation): Framework

What is the complete code template for multiplying two string-represented numbers?

<!-- front -->

---

### Framework: Manual String Multiplication

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STRING MULTIPLICATION - TEMPLATE                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Key Insight: num1[i] × num2[j] contributes to positions i+j, i+j+1   │
│                                                                         │
│  1. Edge case: if num1 == "0" or num2 == "0": return "0"                │
│                                                                         │
│  2. Initialize result array:                                            │
│     - size = len(num1) + len(num2)                                      │
│     - result = [0] * size                                               │
│                                                                         │
│  3. Double loop (right to left):                                        │
│     for i from m-1 down to 0:                                           │
│       for j from n-1 down to 0:                                       │
│         digit1 = num1[i] - '0'                                        │
│         digit2 = num2[j] - '0'                                        │
│         product = digit1 * digit2                                       │
│         total = product + result[i+j+1]                                 │
│         result[i+j+1] = total % 10      # ones digit                    │
│         result[i+j] += total // 10      # carry                         │
│                                                                         │
│  4. Convert to string (skip leading zeros):                           │
│     find first non-zero index, join from there                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard Manual Multiplication

```python
def multiply_strings(num1: str, num2: str) -> str:
    """
    Multiply two string-represented numbers using manual simulation.
    Pattern: Grade-school multiplication algorithm.
    """
    # Edge case
    if num1 == "0" or num2 == "0":
        return "0"
    
    m, n = len(num1), len(num2)
    # Result can have at most m + n digits
    result = [0] * (m + n)
    
    # Multiply from right to left
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            # Multiply digits
            product = (ord(num1[i]) - ord('0')) * (ord(num2[j]) - ord('0'))
            # Add to current position
            total = product + result[i + j + 1]
            
            # Store ones digit at current position
            result[i + j + 1] = total % 10
            # Add carry to previous position
            result[i + j] += total // 10
    
    # Convert to string, skipping leading zeros
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1
    
    return ''.join(map(str, result[start:]))
```

---

### Position Mapping Visualization

```
    1 2 3  (num1, indices 0,1,2)
  ×   4 5  (num2, indices 0,1)
  --------
    
    i=2 (digit 3), j=1 (digit 5): 3×5=15
    → result[2+1+1]=result[4] gets 5 (ones)
    → result[2+1]=result[3] gets carry 1
    
    i=2 (digit 3), j=0 (digit 4): 3×4=12
    → result[2+0+1]=result[3] gets 2 + existing 1 = 3
    → result[2+0]=result[2] gets carry 1
    
Result positions: [0][1][2][3][4]
                     5  5  3  5
```

---

### Key Framework Elements

| Element | Purpose | Location |
|---------|---------|----------|
| `result[i+j+1]` | Stores ones digit of product | Current position |
| `result[i+j]` | Accumulates carry | Left position |
| `total % 10` | Extracts ones digit | For result[i+j+1] |
| `total // 10` | Extracts carry | For result[i+j] |
| `m + n` size | Max digits in product | Result array init |

---

### Multi-Language Implementation Skeleton

```cpp
string multiply(string num1, string num2) {
    if (num1 == "0" || num2 == "0") return "0";
    int m = num1.size(), n = num2.size();
    vector<int> result(m + n, 0);
    
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int product = (num1[i] - '0') * (num2[j] - '0');
            int total = product + result[i + j + 1];
            result[i + j + 1] = total % 10;
            result[i + j] += total / 10;
        }
    }
    
    // Skip leading zeros and convert
    int start = 0;
    while (start < result.size() && result[start] == 0) start++;
    string ans;
    for (int i = start; i < result.size(); i++) ans += (result[i] + '0');
    return ans;
}
```

```java
public String multiply(String num1, String num2) {
    if (num1.equals("0") || num2.equals("0")) return "0";
    int m = num1.length(), n = num2.length();
    int[] result = new int[m + n];
    
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int product = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
            int total = product + result[i + j + 1];
            result[i + j + 1] = total % 10;
            result[i + j] += total / 10;
        }
    }
    
    StringBuilder sb = new StringBuilder();
    int start = 0;
    while (start < result.length && result[start] == 0) start++;
    for (int i = start; i < result.length; i++) sb.append(result[i]);
    return sb.toString();
}
```

<!-- back -->
