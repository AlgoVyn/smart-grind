## String - Repeated Substring Pattern Detection: Forms

What are the different implementations and forms of repeated substring pattern detection?

<!-- front -->

---

### Form 1: Concatenation Trick (All Languages)

```python
# Python - Most Pythonic
def repeated_substring_pattern(s: str) -> bool:
    return len(s) > 1 and s in (s + s)[1:-1]
```

```java
// Java - Explicit but clear
public boolean repeatedSubstringPattern(String s) {
    if (s.length() <= 1) return false;
    String ss = s + s;
    return ss.substring(1, ss.length() - 1).contains(s);
}
```

```cpp
// C++ - Using find()
bool repeatedSubstringPattern(string s) {
    if (s.length() <= 1) return false;
    string ss = s + s;
    return ss.substr(1, ss.length() - 2).find(s) != string::npos;
}
```

```javascript
// JavaScript - Clean one-liner
function repeatedSubstringPattern(s) {
    return s.length > 1 && (s + s).slice(1, -1).includes(s);
}
```

---

### Form 2: KMP Failure Function (All Languages)

```python
# Python - Clear and educational
def repeated_substring_pattern_kmp(s: str) -> bool:
    n = len(s)
    if n <= 1:
        return False
    
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    lps = prefix[-1]
    return lps > 0 and n % (n - lps) == 0
```

```java
// Java - Type-safe implementation
public boolean repeatedSubstringPatternKMP(String s) {
    int n = s.length();
    if (n <= 1) return false;
    
    int[] prefix = new int[n];
    for (int i = 1; i < n; i++) {
        int j = prefix[i - 1];
        while (j > 0 && s.charAt(i) != s.charAt(j)) {
            j = prefix[j - 1];
        }
        if (s.charAt(i) == s.charAt(j)) {
            j++;
        }
        prefix[i] = j;
    }
    
    int lps = prefix[n - 1];
    return lps > 0 && n % (n - lps) == 0;
}
```

```cpp
// C++ - Vector-based
bool repeatedSubstringPatternKMP(string s) {
    int n = s.length();
    if (n <= 1) return false;
    
    vector<int> prefix(n, 0);
    for (int i = 1; i < n; i++) {
        int j = prefix[i - 1];
        while (j > 0 && s[i] != s[j]) {
            j = prefix[j - 1];
        }
        if (s[i] == s[j]) {
            j++;
        }
        prefix[i] = j;
    }
    
    int lps = prefix[n - 1];
    return lps > 0 && n % (n - lps) == 0;
}
```

```javascript
// JavaScript - Array implementation
function repeatedSubstringPatternKMP(s) {
    const n = s.length;
    if (n <= 1) return false;
    
    const prefix = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
        let j = prefix[i - 1];
        while (j > 0 && s[i] !== s[j]) {
            j = prefix[j - 1];
        }
        if (s[i] === s[j]) {
            j++;
        }
        prefix[i] = j;
    }
    
    const lps = prefix[n - 1];
    return lps > 0 && n % (n - lps) === 0;
}
```

---

### Form 3: Brute Force (All Languages)

```python
# Python - Simple and intuitive
def repeated_substring_pattern_brute(s: str) -> bool:
    n = len(s)
    for i in range(1, n // 2 + 1):
        if n % i == 0:
            if s[:i] * (n // i) == s:
                return True
    return False
```

```java
// Java - StringBuilder for repetition
public boolean repeatedSubstringPatternBrute(String s) {
    int n = s.length();
    for (int i = 1; i <= n / 2; i++) {
        if (n % i == 0) {
            String substring = s.substring(0, i);
            StringBuilder repeated = new StringBuilder();
            for (int j = 0; j < n / i; j++) {
                repeated.append(substring);
            }
            if (repeated.toString().equals(s)) {
                return true;
            }
        }
    }
    return false;
}
```

```cpp
// C++ - String concatenation
bool repeatedSubstringPatternBrute(string s) {
    int n = s.length();
    for (int i = 1; i <= n / 2; i++) {
        if (n % i == 0) {
            string substring = s.substr(0, i);
            string repeated = "";
            for (int j = 0; j < n / i; j++) {
                repeated += substring;
            }
            if (repeated == s) {
                return true;
            }
        }
    }
    return false;
}
```

```javascript
// JavaScript - String repeat()
function repeatedSubstringPatternBrute(s) {
    const n = s.length;
    for (let i = 1; i <= n / 2; i++) {
        if (n % i === 0) {
            const substring = s.slice(0, i);
            if (substring.repeat(n / i) === s) {
                return true;
            }
        }
    }
    return false;
}
```

---

### Form 4: Extended KMP (Returns Pattern Info)

```python
# Python - Returns detailed information
from dataclasses import dataclass

@dataclass
class PatternInfo:
    has_pattern: bool
    smallest_unit: str
    repeat_count: int
    pattern_length: int

def analyze_pattern(s: str) -> PatternInfo:
    """Analyze string and return detailed pattern information."""
    n = len(s)
    
    if n <= 1:
        return PatternInfo(False, s, 1, n)
    
    # Compute prefix function
    prefix = [0] * n
    for i in range(1, n):
        j = prefix[i - 1]
        while j > 0 and s[i] != s[j]:
            j = prefix[j - 1]
        if s[i] == s[j]:
            j += 1
        prefix[i] = j
    
    lps = prefix[-1]
    pattern_len = n - lps
    
    if lps > 0 and n % pattern_len == 0:
        return PatternInfo(
            has_pattern=True,
            smallest_unit=s[:pattern_len],
            repeat_count=n // pattern_len,
            pattern_length=pattern_len
        )
    
    return PatternInfo(False, s, 1, n)

# Example usage:
# info = analyze_pattern("abcabcabc")
# info.has_pattern → True
# info.smallest_unit → "abc"
# info.repeat_count → 3
# info.pattern_length → 3
```

---

### Form 5: O(1) Space Variation (Character-by-Character)

```python
# Python - No extra string allocation
def repeated_substring_pattern_o1(s: str) -> bool:
    """Check pattern using O(1) space."""
    n = len(s)
    
    for pattern_len in range(1, n // 2 + 1):
        if n % pattern_len != 0:
            continue
        
        # Check if pattern repeats by comparing characters
        is_pattern = True
        for i in range(pattern_len, n):
            if s[i] != s[i % pattern_len]:
                is_pattern = False
                break
        
        if is_pattern:
            return True
    
    return False
```

```java
// Java - O(1) space implementation
public boolean repeatedSubstringPatternO1(String s) {
    int n = s.length();
    
    for (int patternLen = 1; patternLen <= n / 2; patternLen++) {
        if (n % patternLen != 0) continue;
        
        boolean isPattern = true;
        for (int i = patternLen; i < n; i++) {
            if (s.charAt(i) != s.charAt(i % patternLen)) {
                isPattern = false;
                break;
            }
        }
        
        if (isPattern) return true;
    }
    
    return false;
}
```

---

### Form Comparison Summary

| Form | Space | Time | Preserves Info | Best For |
|------|-------|------|----------------|----------|
| Concatenation | O(n) | O(n) | No | Quick check, interviews |
| KMP Standard | O(n) | O(n) | Partial | Pattern detection |
| KMP Extended | O(n) | O(n) | Yes | Detailed analysis |
| Brute Force | O(n) | O(n²) | No | Learning, small strings |
| O(1) Space | O(1) | O(n²) | No | Memory constrained |

---

### Form Selection Guide

```
Input Constraints → Form Selection

Memory is tight?
  ├─ Yes → O(1) space version
  └─ No → Standard approaches OK

Need pattern details?
  ├─ Yes → Extended KMP (Form 4)
  └─ No → Simple boolean sufficient?
      ├─ Interview → Concatenation trick
      └─ Understanding → KMP standard

Multiple languages required?
  ├─ Yes → All forms provided above work
  └─ No → Choose based on your language's strengths

String size?
  ├─ Small (< 1000) → Any form works
  └─ Large (> 100000) → Avoid O(n²) brute force
```

<!-- back -->
