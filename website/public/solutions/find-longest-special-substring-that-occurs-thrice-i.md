# Find Longest Special Substring That Occurs Thrice I

## Problem Description

You are given a string s that consists of lowercase English letters.
A string is called special if it is made up of only a single character. For example, the string "abc" is not special, whereas the strings "ddd", "zz", and "f" are special.
Return the length of the longest special substring of s which occurs at least thrice, or -1 if no special substring occurs at least thrice.
A substring is a contiguous non-empty sequence of characters within a string.

---

## Pattern: Sliding Window / Prefix Sum

This problem demonstrates algorithmic problem-solving patterns.

## Constraints

- 3 <= s.length <= 50
- s consists of only lowercase English letters.

---

## Examples

### Example 1

**Output:**
```python
2
```

**Explanation:**
The longest special substring which occurs thrice is "aa": substrings "aaaa", "aaaa", and "aaaa".
It can be shown that the maximum length achievable is 2.

---

## Example 2

**Input:**
```python
s = "abcdef"
```

**Output:**
```python
-1
```

**Explanation:**
There exists no special substring which occurs at least thrice. Hence return -1.

---

## Example 3

**Input:**
```python
s = "abcaba"
```

**Output:**
```python
1
```

**Explanation:**
The longest special substring which occurs thrice is "a": substrings "abcaba", "abcaba", and "abcaba".
It can be shown that the maximum length achievable is 1.

---

## Intuition

The key insight is that we only care about **special substrings** - sequences of the same character. This means we need to analyze **runs** (consecutive identical characters) in the string.

### Understanding the Problem:

1. **Special substring**: A string of all identical characters (e.g., "aaa", "bb", "c")
2. **Occurrence**: We need to find how many times a special substring appears as a substring (not just as a run)
3. **Counting occurrences**: For "aaaa", substring "aa" appears at positions: [0-1], [1-2], [2-3] = 3 times!

### Key Observation:

For a given character, we need at least **3 runs** of that character to potentially form a special substring that appears 3 times. The length depends on the 3rd longest run (since overlapping substrings can come from adjacent runs).

---

## Solution Approaches

## Approach 1: Run Length Encoding (Optimal)

This is the most efficient approach that groups the string into runs and finds the third longest run for each character.

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def maximumLength(self, s: str) -> int:
        runs = defaultdict(list)
        i = 0
        while i < len(s):
            j = i
            while j < len(s) and s[j] == s[i]:
                j += 1
            runs[s[i]].append(j - i)
            i = j
        
        ans = -1
        for char, lengths in runs.items():
            if len(lengths) >= 3:
                lengths.sort(reverse=True)
                ans = max(ans, lengths[2])
        return ans
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int maximumLength(string s) {
        unordered_map<char, vector<int>> runs;
        
        for (int i = 0; i < s.length(); ) {
            int j = i;
            while (j < s.length() && s[j] == s[i]) {
                j++;
            }
            runs[s[i]].push_back(j - i);
            i = j;
        }
        
        int ans = -1;
        for (auto& [char, lengths] : runs) {
            if (lengths.size() >= 3) {
                sort(lengths.begin(), lengths.end(), greater<int>());
                ans = max(ans, lengths[2]);
            }
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int maximumLength(String s) {
        Map<Character, List<Integer>> runs = new HashMap<>();
        
        for (int i = 0; i < s.length(); ) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) {
                j++;
            }
            char c = s.charAt(i);
            runs.putIfAbsent(c, new ArrayList<>());
            runs.get(c).add(j - i);
            i = j;
        }
        
        int ans = -1;
        for (List<Integer> lengths : runs.values()) {
            if (lengths.size() >= 3) {
                Collections.sort(lengths, Collections.reverseOrder());
                ans = Math.max(ans, lengths.get(2));
            }
        }
        
        return ans;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var maximumLength = function(s) {
    const runs = {};
    
    for (let i = 0; i < s.length(); ) {
        const char = s[i];
        let j = i;
        while (j < s.length() && s[j] === char) {
            j++;
        }
        const length = j - i;
        
        if (!runs[char]) runs[char] = [];
        runs[char].push(length);
        
        i = j;
    }
    
    let ans = -1;
    for (const char in runs) {
        const lengths = runs[char];
        if (lengths.length >= 3) {
            lengths.sort((a, b) => b - a);
            ans = Math.max(ans, lengths[2]);
        }
    }
    
    return ans;
};
```
````

## Approach 2: Brute Force with All Substrings

A straightforward approach that generates all possible special substrings and checks their occurrences.

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def maximumLength(self, s: str) -> int:
        n = len(s)
        special_count = defaultdict(int)
        
        # Generate all possible special substrings
        for i in range(n):
            for j in range(i + 1, n + 1):
                substring = s[i:j]
                # Check if special (all same character)
                if len(set(substring)) == 1:
                    special_count[substring] += 1
        
        # Find maximum length with count >= 3
        ans = -1
        for substr, count in special_count.items():
            if count >= 3:
                ans = max(ans, len(substr))
        
        return ans
```
<!-- slide -->
```cpp
#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int maximumLength(string s) {
        int n = s.length();
        unordered_map<string, int> specialCount;
        
        // Generate all possible special substrings
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j <= n; j++) {
                string substr = s.substr(i, j - i);
                // Check if special (all same character)
                bool isSpecial = true;
                for (char c : substr) {
                    if (c != substr[0]) {
                        isSpecial = false;
                        break;
                    }
                }
                if (isSpecial) {
                    specialCount[substr]++;
                }
            }
        }
        
        // Find maximum length with count >= 3
        int ans = -1;
        for (auto& [substr, count] : specialCount) {
            if (count >= 3) {
                ans = max(ans, (int)substr.length());
            }
        }
        
        return ans;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int maximumLength(String s) {
        int n = s.length();
        Map<String, Integer> specialCount = new HashMap<>();
        
        // Generate all possible special substrings
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j <= n; j++) {
                String substr = s.substring(i, j);
                // Check if special (all same character)
                if (isSpecial(substr)) {
                    specialCount.put(substr, specialCount.getOrDefault(substr, 0) + 1);
                }
            }
        }
        
        // Find maximum length with count >= 3
        int ans = -1;
        for (Map.Entry<String, Integer> entry : specialCount.entrySet()) {
            if (entry.getValue() >= 3) {
                ans = Math.max(ans, entry.getKey().length());
            }
        }
        
        return ans;
    }
    
    private boolean isSpecial(String s) {
        char first = s.charAt(0);
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) != first) return false;
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
var maximumLength = function(s) {
    const n = s.length();
    const specialCount = {};
    
    // Generate all possible special substrings
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j <= n; j++) {
            const substr = s.substring(i, j);
            // Check if special (all same character)
            const isSpecial = substr.split('').every(c => c === substr[0]);
            if (isSpecial) {
                specialCount[substr] = (specialCount[substr] || 0) + 1;
            }
        }
    }
    
    // Find maximum length with count >= 3
    let ans = -1;
    for (const substr in specialCount) {
        if (specialCount[substr] >= 3) {
            ans = Math.max(ans, substr.length);
        }
    }
    
    return ans;
};
```
````

## Approach 3: Optimized Run-Based with Sliding Window

A more intuitive approach that directly considers overlapping runs.

````carousel
```python
from typing import List

class Solution:
    def maximumLength(self, s: str) -> int:
        n = len(s)
        max_len = -1
        
        # For each character, track run positions
        char_runs = {}
        
        i = 0
        while i < n:
            j = i
            while j < n and s[j] == s[i]:
                j += 1
            char = s[i]
            run_length = j - i
            
            if char not in char_runs:
                char_runs[char] = []
            char_runs[char].append((i, run_length))  # (start position, length)
            i = j
        
        # For each character, find valid special substrings
        for char, runs in char_runs.items():
            if len(runs) < 3:
                continue
            
            # For each possible length, check if it appears 3 times
            max_run_len = max(length for _, length in runs)
            
            for length in range(1, max_run_len + 1):
                count = 0
                for start, run_len in runs:
                    # A run of length L can contribute substrings of length length
                    # at positions start to start + run_len - length
                    if run_len >= length:
                        count += run_len - length + 1
                
                if count >= 3:
                    max_len = max(max_len, length)
        
        return max_len
```
<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int maximumLength(string s) {
        int n = s.length();
        int maxLen = -1;
        
        // Track runs for each character
        unordered_map<char, vector<pair<int, int>>> charRuns;
        
        for (int i = 0; i < n; ) {
            int j = i;
            while (j < n && s[j] == s[i]) {
                j++;
            }
            charRuns[s[i]].push_back({i, j - i});
            i = j;
        }
        
        // For each character, check possible lengths
        for (auto& [char, runs] : charRuns) {
            if (runs.size() < 3) continue;
            
            int maxRunLen = 0;
            for (auto& [start, len] : runs) {
                maxRunLen = max(maxRunLen, len);
            }
            
            for (int length = 1; length <= maxRunLen; length++) {
                int count = 0;
                for (auto& [start, runLen] : runs) {
                    if (runLen >= length) {
                        count += runLen - length + 1;
                    }
                }
                
                if (count >= 3) {
                    maxLen = max(maxLen, length);
                }
            }
        }
        
        return maxLen;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maximumLength(String s) {
        int n = s.length();
        int maxLen = -1;
        
        // Track runs for each character
        Map<Character, List<int[]>> charRuns = new HashMap<>();
        
        for (int i = 0; i < n; ) {
            int j = i;
            while (j < n && s.charAt(j) == s.charAt(i)) {
                j++;
            }
            char c = s.charAt(i);
            charRuns.putIfAbsent(c, new ArrayList<>());
            charRuns.get(c).add(new int[]{i, j - i});
            i = j;
        }
        
        // For each character, check possible lengths
        for (List<int[]> runs : charRuns.values()) {
            if (runs.size() < 3) continue;
            
            int maxRunLen = 0;
            for (int[] run : runs) {
                maxRunLen = Math.max(maxRunLen, run[1]);
            }
            
            for (int length = 1; length <= maxRunLen; length++) {
                int count = 0;
                for (int[] run : runs) {
                    if (run[1] >= length) {
                        count += run[1] - length + 1;
                    }
                }
                
                if (count >= 3) {
                    maxLen = Math.max(maxLen, length);
                }
            }
        }
        
        return maxLen;
    }
}
```
<!-- slide -->
```javascript
var maximumLength = function(s) {
    const n = s.length();
    let maxLen = -1;
    
    // Track runs for each character
    const charRuns = {};
    
    for (let i = 0; i < n; ) {
        const char = s[i];
        let j = i;
        while (j < n && s[j] === char) {
            j++;
        }
        const length = j - i;
        
        if (!charRuns[char]) charRuns[char] = [];
        charRuns[char].push([i, length]);
        i = j;
    }
    
    // For each character, check possible lengths
    for (const char in charRuns) {
        const runs = charRuns[char];
        if (runs.length < 3) continue;
        
        const maxRunLen = Math.max(...runs.map(r => r[1]));
        
        for (let length = 1; length <= maxRunLen; length++) {
            let count = 0;
            for (const [start, runLen] of runs) {
                if (runLen >= length) {
                    count += runLen - length + 1;
                }
            }
            
            if (count >= 3) {
                maxLen = Math.max(maxLen, length);
            }
        }
    }
    
    return maxLen;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| **Run Length Encoding** | O(n log n) | O(n) | Optimal for this problem |
| **Brute Force** | O(n³) | O(n²) | Simple but inefficient |
| **Sliding Window** | O(n × max_run) | O(n) | More intuitive but similar |

### Why Run Length Encoding is Optimal:

1. **Direct run analysis**: We only care about runs of identical characters
2. **Efficient sorting**: For each character, sorting at most 50 elements is trivial
3. **Simple logic**: Third longest run directly gives the answer
4. **No redundant computation**: We never re-count substring occurrences

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **String of all same characters**: `s = "aaaaa"` → Answer should be 3
2. **No repeating characters**: `s = "abcdef"` → Answer: -1
3. **Exactly 3 runs**: Works correctly with third longest
4. **Very short string**: `s.length() >= 3` guaranteed

### Common Mistakes

1. **Confusing runs with substrings**: A run of length L has L - k + 1 substrings of length k
2. **Not considering overlapping**: Adjacent runs can create overlapping substrings
3. **Wrong sorting order**: Need descending order to get third longest

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google
- **Difficulty**: Medium
- **Concepts tested**: String manipulation, run-length encoding, counting

### Learning Outcomes

1. **Run-based thinking**: Breaking strings into meaningful segments
2. **Overlap handling**: Understanding how substrings can overlap
3. **Efficient counting**: Avoiding redundant substring generation

---

## Related Problems

### Same Pattern (Run-Length Based)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Maximum Length of Repeated Substring](https://leetcode.com/problems/maximum-length-of-repeated-substring/) | 718 | Medium | Similar run analysis |
| [Longest Repeating Character Substring](https://leetcode.com/problems/longest-repeating-character-substring/) | 1156 | Easy | Find longest repeated char |
| [Find Longest Special Substring II](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii/) | 1793 | Hard | Part II of this problem |

### Similar String Problems

| Problem | LeetCode # | Difficulty | Related Technique |
|---------|------------|------------|-------------------|
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | 3 | Medium | Sliding window |
| [Longest Repeating Substring](https://leetcode.com/problems/longest-repeating-substring/) | 1044 | Hard | Suffix automaton |
| [Count Unique Characters of All Substrings](https://leetcode.com/problems/count-unique-characters-of-all-substrings/) | 828 | Hard | Combinatorial counting |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Find Longest Special Substring - NeetCode](https://www.youtube.com/watch?v=QfR5bEplGjA)**
   - Explanation of the run-based approach
   - Visual examples

2. **[Run Length Encoding - Back to Back SWE](https://www.youtube.com/watch?v=3Tk1t_s1hcM)**
   - Understanding run-length encoding
   - Practical applications

3. **[LeetCode 1793 - Maximum Score of a Good Substring](https://www.youtube.com/watch?v=6_bxR4GMKGY)**
   - Related problem (Part II)
   - Similar techniques

4. **[String Problems - Technique](https://www.youtube.com/watch?v=8h2G2cKVx1s)**
   - Common string patterns
   - Interview tips

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity?**
   - Time: O(n log n) due to sorting; Space: O(n) for storing runs

2. **Why do we need at least 3 runs?**
   - Each substring of length L in a run of length R contributes R-L+1 occurrences
   - To get 3+ total occurrences, we typically need at least 3 runs

3. **What happens with overlapping runs?**
   - They still contribute correctly: run "aaa" gives substrings at positions 0,1

### Intermediate Level

4. **How would you modify to handle Part II with length constraints?**
   - Part II adds a parameter k and needs prefix/suffix considerations

5. **Can you solve this without sorting?**
   - Yes, could use counting sort since max run length ≤ 50

### Advanced Level

6. **How does this relate to suffix arrays?**
   - Run analysis is similar to building suffix arrays for substring problems

7. **What if we needed the substring itself (not just length)?**
   - Track the character with the maximum valid length

---

## Common Pitfalls

### 1. Confusing Runs with Substrings
**Issue**: A run of length L has L - k + 1 substrings of length k, not just 1.

**Solution**: Remember that overlapping substrings within the same run count separately.

### 2. Not Considering Overlapping Runs
**Issue**: Adjacent runs can create overlapping substrings.

**Solution**: The third longest run approach handles this naturally.

### 3. Wrong Sorting Order
**Issue**: Sorting in ascending order instead of descending.

**Solution**: Sort runs in descending order to get the third longest as lengths[2].

### 4. Not Checking Minimum Run Count
**Issue**: Need at least 3 runs for a special substring to appear 3 times.

**Solution**: Check `len(lengths) >= 3` before accessing lengths[2].

### 5. Using Actual Distance Instead of Squared
**Issue**: Using sqrt when comparing distances is unnecessary.

**Solution**: Compare squared distances to avoid expensive sqrt calculations.

---

## Summary

The **Find Longest Special Substring That Occurs Thrice** problem demonstrates the power of **run-length encoding**. Key insights:

1. **Special substrings = runs**: Only runs of identical characters matter
2. **Third longest rule**: The third longest run determines max valid length
3. **Overlap handling**: Substrings can overlap within runs
4. **Efficient solution**: O(n log n) is simple and sufficient for n ≤ 50

This pattern is valuable for:
- String problems involving repeated characters
- Run-length encoding applications
- Counting substring occurrences

Understanding this approach provides a foundation for solving Part II and similar string problems.

---

## LeetCode Problems for Practice

- [Find Longest Special Substring That Occurs Thrice I](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-i/)
- [Find Longest Special Substring That Occurs Thrice II](https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-ii/)
- [Maximum Length of Repeated Substring](https://leetcode.com/problems/maximum-length-of-repeated-substring/)
- [Longest Repeating Character Substring](https://leetcode.com/problems/longest-repeating-character-substring/)
- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
