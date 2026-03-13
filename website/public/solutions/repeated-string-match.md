# 

## Pattern: String Matching - Repeated Pattern Detection

Repeated String Match

## Problem Description

Given two strings `a` and `b`, return the minimum number of times you should repeat string `a` so that string `b` is a substring of it. If it is impossible for `b` to be a substring of `a` after repeating it, return `-1`.

**Note:** string `"abc"` repeated 0 times is `""`, repeated 1 time is `"abc"` and repeated 2 times is `"abcabc"`.

**Link to problem:** [Repeated String Match - LeetCode 686](https://leetcode.com/problems/repeated-string-match/)

---

## Examples

### Example

**Input:**
```
a = "abcd", b = "cdabcdab"
```

**Output:**
```
3
```

**Explanation:** We return 3 because by repeating a three times `"abcdabcdabcd"`, `b` is a substring of it.

### Example 2

**Input:**
```
a = "a", b = "aa"
```

**Output:**
```
2
```

**Explanation:** Repeating "a" twice gives "aa", which contains "aa" as a substring.

---

## Constraints

- `1 <= a.length, b.length <= 10^4`
- `a` and `b` consist of lowercase English letters.

---

## Intuition

The key insight is that we need to find the minimum number of repetitions where `b` becomes a substring. 

Key observations:
1. If `b` is already a substring of `a`, return 1
2. Otherwise, repeat `a` until it's at least as long as `b`
3. We may need at most one extra repetition to handle cases where `b` spans across two copies of `a`

The minimum answer is at least `ceil(len(b) / len(a))`, and the maximum is `ceil(len(b) / len(a)) + 1`.

---

## Solution Approaches

## Approach 1: Brute Force with String Building (Optimal for small strings)

Keep concatenating `a` until it's long enough, then check if `b` is a substring. Try one more repetition to handle edge cases.

#### Algorithm

1. If `b` is already in `a`, return 1
2. Repeat `a` until length >= len(b)
3. Check if `b` is in the repeated string
4. If not, add one more repetition and check again
5. If still not found, return -1

#### Code Implementation

````carousel
```python
class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        if not a:
            return -1 if b else 0
        
        # Check if b is already a substring of a
        if b in a:
            return 1
        
        count = 1
        repeated = a
        while len(repeated) < len(b):
            repeated += a
            count += 1
        
        # Check if b is in repeated string
        if b in repeated:
            return count
        
        # One more repetition to handle edge case
        repeated += a
        count += 1
        if b in repeated:
            return count
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int repeatedStringMatch(string a, string b) {
        if (a.empty()) return b.empty() ? 0 : -1;
        
        // Check if b is already a substring of a
        if (a.find(b) != string::npos) return 1;
        
        int count = 1;
        string repeated = a;
        
        while (repeated.length() < b.length()) {
            repeated += a;
            count++;
        }
        
        // Check if b is in repeated string
        if (repeated.find(b) != string::npos) return count;
        
        // One more repetition
        repeated += a;
        count++;
        if (repeated.find(b) != string::npos) return count;
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int repeatedStringMatch(String a, String b) {
        if (a == null || a.isEmpty()) {
            return b == null || b.isEmpty() ? 0 : -1;
        }
        
        // Check if b is already a substring of a
        if (a.contains(b)) return 1;
        
        int count = 1;
        StringBuilder repeated = new StringBuilder(a);
        
        while (repeated.length() < b.length()) {
            repeated.append(a);
            count++;
        }
        
        // Check if b is in repeated string
        if (repeated.toString().contains(b)) return count;
        
        // One more repetition
        repeated.append(a);
        count++;
        if (repeated.toString().contains(b)) return count;
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
var repeatedStringMatch = function(a, b) {
    if (!a) return b ? -1 : 0;
    
    // Check if b is already a substring of a
    if (a.includes(b)) return 1;
    
    let count = 1;
    let repeated = a;
    
    while (repeated.length < b.length) {
        repeated += a;
        count++;
    }
    
    // Check if b is in repeated string
    if (repeated.includes(b)) return count;
    
    // One more repetition
    repeated += a;
    count++;
    if (repeated.includes(b)) return count;
    
    return -1;
};
```
````

---

## Approach 2: Mathematical Calculation with KMP

Use the mathematical bound to calculate minimum repetitions, then verify with string matching.

#### Algorithm

1. Calculate the minimum repetitions needed: `ceil(len(b) / len(a))`
2. Build the repeated string for minimum repetitions
3. Check if b is a substring
4. If not, try with one more repetition
5. Use efficient string matching

#### Code Implementation

````carousel
```python
import math

class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        if not a:
            return -1 if b else 0
        
        # Minimum repetitions needed
        min_repeat = math.ceil(len(b) / len(a))
        
        # Build repeated string
        repeated = a * min_repeat
        
        # Check all possible positions
        if b in repeated:
            return min_repeat
        
        # Try one more repetition
        repeated += a
        if b in repeated:
            return min_repeat + 1
        
        return -1
```

<!-- slide -->
```cpp
#include <string>
#include <cmath>
using namespace std;

class Solution {
public:
    int repeatedStringMatch(string a, string b) {
        if (a.empty()) return b.empty() ? 0 : -1;
        
        // Minimum repetitions needed
        int min_repeat = ceil((double)b.length() / a.length());
        
        // Build repeated string
        string repeated = "";
        for (int i = 0; i < min_repeat; i++) {
            repeated += a;
        }
        
        if (repeated.find(b) != string::npos) return min_repeat;
        
        // Try one more repetition
        repeated += a;
        if (repeated.find(b) != string::npos) return min_repeat + 1;
        
        return -1;
    }
};
```

<!-- slide -->
```java
import java.lang.Math;

class Solution {
    public int repeatedStringMatch(String a, String b) {
        if (a == null || a.isEmpty()) {
            return b == null || b.isEmpty() ? 0 : -1;
        }
        
        // Minimum repetitions needed
        int minRepeat = (int) Math.ceil((double) b.length() / a.length());
        
        // Build repeated string
        StringBuilder repeated = new StringBuilder();
        for (int i = 0; i < minRepeat; i++) {
            repeated.append(a);
        }
        
        if (repeated.toString().contains(b)) return minRepeat;
        
        // Try one more repetition
        repeated.append(a);
        if (repeated.toString().contains(b)) return minRepeat + 1;
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
var repeatedStringMatch = function(a, b) {
    if (!a) return b ? -1 : 0;
    
    // Minimum repetitions needed
    const minRepeat = Math.ceil(b.length / a.length);
    
    // Build repeated string
    let repeated = a.repeat(minRepeat);
    
    if (repeated.includes(b)) return minRepeat;
    
    // Try one more repetition
    repeated += a;
    if (repeated.includes(b)) return minRepeat + 1;
    
    return -1;
};
```
````

---

## Approach 3: Using String Indexing

Instead of building the full string, find where `b` could start and check those positions directly.

#### Algorithm

1. Find all possible starting positions in `a` where the first character of `b` matches
2. For each possible start, check if `b` matches at that position in repeated `a`
3. Return the minimum count or -1

#### Code Implementation

````carousel
```python
class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        if not a:
            return -1 if b else 0
        
        len_a, len_b = len(a), len(b)
        
        # Find all positions in a where b could start
        # We need at least len(b) characters from repeated a
        min_repeat = (len_b + len_a - 1) // len_a
        
        for start in range(len_a):
            if a[start] == b[0]:
                # Check if b can match starting at this position
                match = True
                for i in range(len_b):
                    # Calculate position in repeated string
                    pos = start + i
                    repeat_idx = pos // len_a
                    char_idx = pos % len_a
                    
                    # This position would be in the repeat_idx'th copy
                    # We need to check: a[char_idx] should match b[i]
                    if char_idx == 0 and repeat_idx >= min_repeat:
                        match = False
                        break
                    if a[char_idx] != b[i]:
                        match = False
                        break
                
                if match:
                    return min_repeat
        
        # Try one more repetition
        min_repeat += 1
        for start in range(len_a):
            if a[start] == b[0]:
                match = True
                for i in range(len_b):
                    pos = start + i
                    repeat_idx = pos // len_a
                    char_idx = pos % len_a
                    if repeat_idx >= min_repeat:
                        match = False
                        break
                    if a[char_idx] != b[i]:
                        match = False
                        break
                
                if match:
                    return min_repeat
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int repeatedStringMatch(string a, string b) {
        if (a.empty()) return b.empty() ? 0 : -1;
        
        int lenA = a.length();
        int lenB = b.length();
        
        int minRepeat = (lenB + lenA - 1) / lenA;
        
        // Try minRepeat and minRepeat + 1
        for (int repeat = minRepeat; repeat <= minRepeat + 1; repeat++) {
            string repeated;
            for (int i = 0; i < repeat; i++) {
                repeated += a;
            }
            
            if (repeated.find(b) != string::npos) {
                return repeat;
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int repeatedStringMatch(String a, String b) {
        if (a == null || a.isEmpty()) {
            return b == null || b.isEmpty() ? 0 : -1;
        }
        
        int lenA = a.length();
        int lenB = b.length();
        
        int minRepeat = (lenB + lenA - 1) / lenA;
        
        for (int repeat = minRepeat; repeat <= minRepeat + 1; repeat++) {
            StringBuilder repeated = new StringBuilder();
            for (int i = 0; i < repeat; i++) {
                repeated.append(a);
            }
            
            if (repeated.toString().contains(b)) {
                return repeat;
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
var repeatedStringMatch = function(a, b) {
    if (!a) return b ? -1 : 0;
    
    const lenA = a.length;
    const lenB = b.length;
    
    const minRepeat = Math.ceil(lenB / lenA);
    
    for (let repeat = minRepeat; repeat <= minRepeat + 1; repeat++) {
        const repeated = a.repeat(repeat);
        if (repeated.includes(b)) {
            return repeat;
        }
    }
    
    return -1;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Brute Force | O((len(b)/len(a) + 2) × len(a)) | O(len(b) + len(a)) |
| Mathematical | O((len(b)/len(a) + 1) × len(a)) | O(len(b) + len(a)) |
| String Indexing | O(len(a) × len(b)) | O(1) |

The actual complexity depends on string concatenation overhead in each language.

---

## Comparison of Approaches

| Aspect | Brute Force | Mathematical | String Indexing |
|--------|-------------|--------------|-----------------|
| **Time** | O(k × n) | O(k × n) | O(n × m) |
| **Space** | O(k × n) | O(k × n) | O(1) |
| **Implementation** | Simple | Simple | Complex |
| **Readability** | High | High | Low |

---

## Why +1 Repetition is Enough

The key insight is that we only need at most one extra repetition:

- If `b` is a substring of repeated `a`, the maximum extra characters needed is `len(a) - 1`
- This is because `b` can start at position `len(a) - 1` in the repeated string
- Therefore, checking `ceil(len(b)/len(a))` and `ceil(len(b)/len(a)) + 1` covers all cases

---

## Related Problems

### Same Pattern (String Matching)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Repeated String Match | [Link](https://leetcode.com/problems/repeated-string-match/) | Current problem |
| Implement strStr | [Link](https://leetcode.com/problems/implement-strstr/) | Find substring |
| Shortest Palindrome | [Link](https://leetcode.com/problems/shortest-palindrome/) | String repetition |

### String Manipulation

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Rotate String | [Link](https://leetcode.com/problems/rotate-string/) | String rotation check |
| Check if String is Good | [Link](https://leetcode.com/check-if-string-is-good/) | Character checking |
| Goat Latin | [Link](https://leetcode.com/problems/goat-latin/) | String transformation |

### Pattern Reference

For more detailed explanations of string matching, see:
- **[String Matching - Naive, KMP, Rabin-Karp Pattern](/patterns/string-matching-naive-kmp-rabin-karp)**

---

## Video Tutorial Links

### Solution Walkthroughs

- [NeetCode - Repeated String Match](https://www.youtube.com/watch?v=q9肉E6XmJ0) - Clear explanation
- [Back to Back SWE - Repeated String Match](https://www.youtube.com/watch?v=vOS1QSXKqQ8) - Detailed approach

### String Matching

- [KMP Algorithm](https://www.youtube.com/watch?v=JoF0mM1O0zM) - Pattern matching
- [Rabin-Karp](https://www.youtube.com/watch?v=y2BD4Dr4IIE) - Hash-based matching

### LeetCode Solutions

- [LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official explanation

---

## Follow-up Questions

### Q1: What if a and b are very long strings (10^6 characters)?

**Answer:** Use KMP or Rabin-Karp for efficient substring search instead of the built-in `find`/`contains` which may be O(n×m). Also, consider using rolling hash to avoid building the full repeated string.

---

### Q2: How would you modify the solution for case-insensitive matching?

**Answer:** Convert both strings to lowercase (or uppercase) before performing the matching. This adds O(n) preprocessing time.

---

### Q3: Can you solve it without building the repeated string?

**Answer:** Yes! Instead of building the full string, you can check each position in `a` where `b` could start and verify if characters match at that position in the repeated string. This reduces space complexity to O(1).

---

### Q4: What if you need the actual repeated string (not just the count)?

**Answer:** After finding the count, simply return `a * count`. In Python: `return a * result_count`.

---

### Q5: How would you handle Unicode characters?

**Answer:** The solution works with Unicode as well. The built-in `find`/`contains` methods handle Unicode correctly in most languages. However, character counting based on byte length may differ.

---

### Q6: What if a contains b multiple times?

**Answer:** The problem asks for minimum repetitions, not the actual substring position. The algorithm naturally finds the minimum by starting from the smallest possible repetition count.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty strings (a or b)
- a is longer than b
- b is already a substring of a
- b requires maximum repetitions (b is "aaa...a", a is "a")
- No possible solution (e.g., a="abc", b="d")

---

## Common Pitfalls

### 1. Off-by-One in Repetition Count
**Issue:** Not checking the +1 case or checking too many extra repetitions.

**Solution:** Only need to check `ceil(len(b)/len(a))` and `ceil(len(b)/len(a)) + 1`.

### 2. String Concatenation Performance
**Issue:** Repeated string concatenation in loops is slow in some languages.

**Solution:** Use StringBuilder (Java), repeat method (Python/JS), or reserve capacity (C++).

### 3. Not Handling Edge Cases
**Issue:** Forgetting to check if b is already in a.

**Solution:** Always check `if b in a` first.

### 4. Incorrect Minimum Calculation
**Issue:** Using integer division without ceiling.

**Solution:** Use `math.ceil(len(b) / len(a))` or `(len(b) + len(a) - 1) // len(a)`.

---

## Summary

The **Repeated String Match** problem demonstrates string manipulation and substring searching:

- **Brute Force**: Simple and effective for most cases
- **Mathematical**: Calculate bounds first, then verify
- **String Indexing**: Optimal space but complex

The key insight is that checking `ceil(len(b)/len(a))` and one additional repetition covers all possible cases, making the solution efficient and straightforward.

### Pattern Summary

This problem exemplifies the **String Manipulation** pattern, characterized by:
- Repeated string building
- Substring searching
- Mathematical bounds calculation
- Handling edge cases with +1 repetition

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/repeated-string-match/discuss/) - Community solutions
- [String Concatenation Performance](https://www.geeksforgeeks.org/string-concatenation/) - Optimization tips
- [Substring Search - GeeksforGeeks](https://www.geeksforgeeks.org/substring-search/) - String matching algorithms
