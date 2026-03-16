## Decode Ways

**Question:** Ways to decode string of digits to letters?

<!-- front -->

---

## Answer: Dynamic Programming

### Solution
```python
def numDecodings(s):
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty string
    dp[1] = 1  # First character
    
    for i in range(2, n + 1):
        # Single digit (not '0')
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        
        # Two digits (10-26)
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]
    
    return dp[n]
```

### Visual: DP Table
```
s = "226"

i=0: dp[0]=1
i=1: s[0]='2'≠'0', dp[1]=1

i=2: s[1]='2'≠'0' → dp[2]+=dp[1]=1
     s[0:2]="22"=22, 10≤22≤26 → dp[2]+=dp[0]=2
     dp[2]=2

i=3: s[2]='6'≠'0' → dp[3]+=dp[2]=2
     s[1:3]="26"=26, 10≤26≤26 → dp[3]+=dp[1]=3
     dp[3]=3

Result: 3 (BZ, VF, BBF)
```

### ⚠️ Tricky Parts

#### 1. Handling '0'
```python
# '0' cannot be decoded alone
# Only valid as part of "10" or "20"
# Invalid: "01", "30", "100"

if s[i-1] != '0':
    dp[i] += dp[i-1]
```

#### 2. Why dp[0] = 1?
```python
# Base case for two-digit decode
# "10" → 1 way (J)
# dp[2] = dp[1] + dp[0] = 1 + 1 = 2? No!
# Actually: s[1]='0', skip single
#          s[0:2]="10" valid → dp[2] = dp[0] = 1

# Need careful handling of '0'
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DP | O(n) | O(n) |
| Optimized | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not handling '0' | Check both positions |
| Wrong dp[0] | dp[0]=1 for two-digit base |
| Leading zeros | Return 0 if s[0]=='0' |

<!-- back -->
