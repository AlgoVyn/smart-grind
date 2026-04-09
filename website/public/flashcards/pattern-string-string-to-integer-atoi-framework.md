## String - String to Integer (atoi): Framework

What is the complete code template for implementing atoi conversion?

<!-- front -->

---

### Framework: String to Integer (atoi)

```
┌─────────────────────────────────────────────────────────────┐
│  STRING TO INTEGER (atoi) - TEMPLATE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Process sequentially with overflow check    │
│                                                             │
│  1. Define constants:                                       │
│     - INT_MAX = 2³¹ - 1 = 2147483647                        │
│     - INT_MIN = -2³¹ = -2147483648                          │
│                                                             │
│  2. Initialize:                                             │
│     - result = 0, sign = 1, i = 0                           │
│                                                             │
│  3. Processing order:                                     │
│     a. Skip leading whitespace                            │
│     b. Handle optional sign (+/-)                         │
│     c. Parse digits with overflow check                   │
│                                                             │
│  4. Overflow check (BEFORE updating):                     │
│     - if result > (INT_MAX - digit) / 10:                 │
│         return INT_MIN if sign < 0 else INT_MAX           │
│                                                             │
│  5. Update result:                                          │
│     - result = result * 10 + digit                        │
│                                                             │
│  6. Return sign * result                                  │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Python

```python
def myAtoi(s: str) -> int:
    """
    Convert string to 32-bit signed integer.
    LeetCode 8 - String to Integer (atoi)
    
    Time: O(n), Space: O(1)
    """
    INT_MAX = 2**31 - 1  # 2147483647
    INT_MIN = -2**31     # -2147483648
    
    i = 0
    n = len(s)
    result = 0
    sign = 1
    
    # Step 1: Skip leading whitespace
    while i < n and s[i] == ' ':
        i += 1
    
    # Step 2: Handle empty string after whitespace
    if i >= n:
        return 0
    
    # Step 3: Handle sign
    if i < n and (s[i] == '+' or s[i] == '-'):
        sign = -1 if s[i] == '-' else 1
        i += 1
    
    # Step 4: Parse digits with overflow detection
    while i < n and s[i].isdigit():
        digit = int(s[i])
        
        # Check for overflow BEFORE updating result
        if result > (INT_MAX - digit) // 10:
            return INT_MIN if sign == -1 else INT_MAX
        
        result = result * 10 + digit
        i += 1
    
    # Step 5: Apply sign and return
    return sign * result
```

---

### Implementation: Java

```java
class Solution {
    public int myAtoi(String s) {
        final int INT_MAX = Integer.MAX_VALUE;  // 2147483647
        final int INT_MIN = Integer.MIN_VALUE;  // -2147483648
        
        int i = 0;
        int n = s.length();
        int result = 0;
        int sign = 1;
        
        // Skip leading whitespace
        while (i < n && s.charAt(i) == ' ') {
            i++;
        }
        
        // Handle empty string
        if (i >= n) return 0;
        
        // Handle sign
        if (i < n && (s.charAt(i) == '+' || s.charAt(i) == '-')) {
            sign = (s.charAt(i) == '-') ? -1 : 1;
            i++;
        }
        
        // Parse digits with overflow detection
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';
            
            // Check for overflow
            if (result > (INT_MAX - digit) / 10) {
                return (sign == 1) ? INT_MAX : INT_MIN;
            }
            
            result = result * 10 + digit;
            i++;
        }
        
        return sign * result;
    }
}
```

---

### Key Framework Elements

| Element | Purpose | Value |
|---------|---------|-------|
| `INT_MAX` | Upper bound | 2147483647 (2³¹ - 1) |
| `INT_MIN` | Lower bound | -2147483648 (-2³¹) |
| `sign` | Track positive/negative | 1 or -1 |
| `result` | Accumulated value | Build number incrementally |
| Overflow check | Prevent overflow | `result > (INT_MAX - digit) / 10` |

---

### Processing Flow Diagram

```
Input: "   -42abc"

Step 1: Skip whitespace
        "   -42abc" → i=3 (at '-')

Step 2: Handle sign
        s[3] = '-', sign = -1, i=4 (at '4')

Step 3: Parse digits
        '4': digit=4, result=0*10+4=4, i=5
        '2': digit=2, result=4*10+2=42, i=6
        'a': not digit, stop

Step 4: Apply sign
        result = -1 * 42 = -42

Output: -42
```

<!-- back -->
