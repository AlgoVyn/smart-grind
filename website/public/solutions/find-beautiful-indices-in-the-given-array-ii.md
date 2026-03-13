# Find Beautiful Indices In The Given Array Ii

## Problem Description

You are given a 0-indexed string s, a string a, a string b, and an integer k.

An index i is beautiful if:
- 0 <= i <= s.length - a.length
- s[i..(i + a.length - 1)] == a
- There exists an index j such that:
  - 0 <= j <= s.length - b.length
  - s[j..(j + b.length - 1)] == b
  - |j - i| <= k

Return the array that contains beautiful indices in sorted order from smallest to largest.

**Link to problem:** [Find Beautiful Indices in the Given Array II - LeetCode 2815](https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-ii/)

---

## Examples

### Example

**Input:**
```
s = "isawsquirrelnearmysquirrelhouseohmy", a = "my", b = "squirrel", k = 15
```

**Output:**
```
[16,33]
```

**Explanation:**
There are 2 beautiful indices: [16,33].
- The index 16 is beautiful as s[16..17] == "my" and there exists an index 4 with s[4..11] == "squirrel" and |16 - 4| <= 15.
- The index 33 is beautiful as s[33..34] == "my" and there exists an index 18 with s[18..25] == "squirrel" and |33 - 18| <= 15.
Thus we return [16,33] as the result.

---

### Example 2

**Input:**
```
s = "abcd", a = "a", b = "a", k = 4
```

**Output:**
```
[0]
```

**Explanation:**
There is 1 beautiful index: [0].
- The index 0 is beautiful as s[0..0] == "a" and there exists an index 0 with s[0..0] == "a" and |0 - 0| <= 4.
Thus we return [0] as the result.

---

## Constraints

- 1 <= k <= s.length <= 5 * 10^5
- 1 <= a.length, b.length <= 5 * 10^5
- s, a, and b contain only lowercase English letters.

---

## Pattern: Two-Pointers with Binary Search

This problem is a classic application of **Two-Pointers with Binary Search** pattern. The key insight is to find all occurrences of patterns a and b in string s, then efficiently check if any occurrence of b is within distance k of each occurrence of a.

### Core Concept

1. **Find all occurrences**: Use string matching to find all starting indices where pattern a and pattern b occur in s
2. **Sort b indices**: Sort the list of b indices for efficient binary search
3. **Binary search**: For each index in a, use binary search to check if there's a b-index within distance k

---

## Intuition

The fundamental insight is:

1. **Naive approach is too slow**: For each occurrence of a, checking all occurrences of b would be O(n × m) in worst case
2. **Preprocessing helps**: By finding all occurrences upfront and sorting b's indices, we can use binary search
3. **Efficient checking**: Binary search gives O(log n) per check instead of O(n)

### Visual Example

For s = "isawsquirrelnearmysquirrelhouseohmy", a = "my", b = "squirrel", k = 15:

```
a_indices (where "my" appears): [16, 33]
b_indices (where "squirrel" appears): [4, 18]

For i = 16:
  - Search range: [16-15, 16+15] = [1, 31]
  - Binary search in b_indices: 4 is in range ✓
  - 16 is beautiful

For i = 33:
  - Search range: [33-15, 33+15] = [18, 48]
  - Binary search in b_indices: 18 is in range ✓
  - 33 is beautiful

Result: [16, 33]
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **String Find + Binary Search (Optimal)** - O(n + m + a_count × log b_count) time
2. **KMP + Binary Search** - O(n + m) preprocessing, O(a_count × log b_count) query
3. **Two-Pointer Sliding Window** - O(n) time, O(n) space

---

## Approach 1: String Find + Binary Search (Optimal)

This is the most straightforward and efficient solution for most cases.

### Algorithm Steps

1. Find all starting indices where pattern a appears in s
2. Find all starting indices where pattern b appears in s
3. Sort the b indices list
4. For each index i in a's indices:
   - Use binary search to find if any b index is in range [i - k, i + k]
   - If found, add i to result
5. Return the result

### Why It Works

The algorithm works because:
- Finding all occurrences is necessary since we need to check each potential beautiful index
- Sorting b indices enables efficient range queries using binary search
- Binary search finds the smallest b index >= (i - k), then we check if it's <= (i + k)
- This gives O(log b_count) per check instead of O(b_count)

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def beautifulIndices(self, s: str, a: str, b: str, k: int) -> List[int]:
        """
        Find all beautiful indices using string find and binary search.
        
        Args:
            s: Main string to search in
            a: First pattern to find
            b: Second pattern to find
            k: Maximum distance allowed between indices
            
        Returns:
            List of beautiful indices in sorted order
        """
        def find_all_indices(text: str, pattern: str) -> List[int]:
            """Find all starting indices where pattern appears in text."""
            indices = []
            start = 0
            while True:
                pos = text.find(pattern, start)
                if pos == -1:
                    break
                indices.append(pos)
                start = pos + 1  # Allow overlapping matches
            return indices
        
        # Find all occurrences of a and b
        a_indices = find_all_indices(s, a)
        b_indices = find_all_indices(s, b)
        b_indices.sort()  # Sort for binary search
        
        result = []
        for i in a_indices:
            # Binary search for b index in range [i-k, i+k]
            left = bisect.bisect_left(b_indices, i - k)
            right = bisect.bisect_right(b_indices, i + k)
            if left < right:  # Found at least one b in range
                result.append(i)
        
        return result
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> beautifulIndices(string s, string a, string b, int k) {
        // Find all occurrences of a
        vector<int> a_indices;
        size_t pos = s.find(a, 0);
        while (pos != string::npos) {
            a_indices.push_back(pos);
            pos = s.find(a, pos + 1);
        }
        
        // Find all occurrences of b
        vector<int> b_indices;
        pos = s.find(b, 0);
        while (pos != string::npos) {
            b_indices.push_back(pos);
            pos = s.find(b, pos + 1);
        }
        
        sort(b_indices.begin(), b_indices.end());
        
        vector<int> result;
        for (int i : a_indices) {
            // Binary search for b index in range [i-k, i+k]
            auto left = lower_bound(b_indices.begin(), b_indices.end(), i - k);
            auto right = upper_bound(b_indices.begin(), b_indices.end(), i + k);
            if (left != right) {
                result.push_back(i);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> beautifulIndices(String s, String a, String b, int k) {
        // Find all occurrences of a
        List<Integer> aIndices = new ArrayList<>();
        int pos = s.indexOf(a, 0);
        while (pos != -1) {
            aIndices.add(pos);
            pos = s.indexOf(a, pos + 1);
        }
        
        // Find all occurrences of b
        List<Integer> bIndices = new ArrayList<>();
        pos = s.indexOf(b, 0);
        while (pos != -1) {
            bIndices.add(pos);
            pos = s.indexOf(b, pos + 1);
        }
        
        Collections.sort(bIndices);
        
        List<Integer> result = new ArrayList<>();
        for (int i : aIndices) {
            // Binary search for b index in range [i-k, i+k]
            int leftIdx = Collections.binarySearch(bIndices, i - k);
            int rightIdx = Collections.binarySearch(bIndices, i + k);
            
            // Adjust for not-found results
            if (leftIdx < 0) leftIdx = -(leftIdx + 1);
            if (rightIdx < 0) rightIdx = -(rightIdx + 1) - 1;
            
            if (leftIdx <= rightIdx) {
                result.add(i);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} a
 * @param {string} b
 * @param {number} k
 * @return {number[]}
 */
var beautifulIndices = function(s, a, b, k) {
    // Find all occurrences of a
    const findAllIndices = (text, pattern) => {
        const indices = [];
        let pos = text.indexOf(pattern, 0);
        while (pos !== -1) {
            indices.push(pos);
            pos = text.indexOf(pattern, pos + 1);
        }
        return indices;
    };
    
    const aIndices = findAllIndices(s, a);
    let bIndices = findAllIndices(s, b);
    bIndices.sort((x, y) => x - y);
    
    const result = [];
    for (const i of aIndices) {
        // Binary search for b index in range [i-k, i+k]
        let left = 0, right = bIndices.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (bIndices[mid] < i - k) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        // Check if any b index is within range
        if (left < bIndices.length && bIndices[left] <= i + k) {
            result.push(i);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m + a_count × log b_count) - Finding all + binary searches |
| **Space** | O(a_count + b_count) - Storing indices lists |

---

## Approach 2: KMP + Binary Search

This approach uses KMP for more efficient string matching, especially for large inputs.

### Algorithm Steps

1. Use KMP or Z-algorithm to find all occurrences of a and b in O(n + m)
2. Sort b indices for binary search
3. For each a index, use binary search to check for nearby b indices

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def beautifulIndices_kmp(self, s: str, a: str, b: str, k: int) -> List[int]:
        """
        Using KMP for string matching.
        """
        def kmp_search(text: str, pattern: str) -> List[int]:
            """KMP algorithm to find all occurrences."""
            if len(pattern) > len(text):
                return []
            
            # Build LPS (Longest Prefix Suffix) array
            lps = [0] * len(pattern)
            length = 0
            i = 1
            while i < len(pattern):
                if pattern[i] == pattern[length]:
                    length += 1
                    lps[i] = length
                    i += 1
                else:
                    if length != 0:
                        length = lps[length - 1]
                    else:
                        lps[i] = 0
                        i += 1
            
            # Search for pattern in text
            indices = []
            i = j = 0
            while i < len(text):
                if text[i] == pattern[j]:
                    i += 1
                    j += 1
                if j == len(pattern):
                    indices.append(i - j)
                    j = lps[j - 1]
                elif i < len(text) and text[i] != pattern[j]:
                    if j != 0:
                        j = lps[j - 1]
                    else:
                        i += 1
            
            return indices
        
        a_indices = kmp_search(s, a)
        b_indices = kmp_search(s, b)
        b_indices.sort()
        
        result = []
        for i in a_indices:
            left = bisect.bisect_left(b_indices, i - k)
            right = bisect.bisect_right(b_indices, i + k)
            if left < right:
                result.append(i)
        
        return result
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> beautifulIndices(string s, string a, string b, int k) {
        // KMP search for pattern
        auto kmpSearch = [&](const string& text, const string& pattern) -> vector<int> {
            if (pattern.length() > text.length()) return {};
            
            // Build LPS array
            vector<int> lps(pattern.length(), 0);
            int len = 0;
            for (int i = 1; i < pattern.length();) {
                if (pattern[i] == pattern[len]) {
                    len++;
                    lps[i] = len;
                    i++;
                } else if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
            
            // Search
            vector<int> indices;
            int i = 0, j = 0;
            while (i < text.length()) {
                if (text[i] == pattern[j]) {
                    i++; j++;
                }
                if (j == pattern.length()) {
                    indices.push_back(i - j);
                    j = lps[j - 1];
                } else if (i < text.length() && text[i] != pattern[j]) {
                    if (j != 0) j = lps[j - 1];
                    else i++;
                }
            }
            return indices;
        };
        
        vector<int> aIndices = kmpSearch(s, a);
        vector<int> bIndices = kmpSearch(s, b);
        sort(bIndices.begin(), bIndices.end());
        
        vector<int> result;
        for (int i : aIndices) {
            auto left = lower_bound(bIndices.begin(), bIndices.end(), i - k);
            auto right = upper_bound(bIndices.begin(), bIndices.end(), i + k);
            if (left != right) result.push_back(i);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> beautifulIndices(String s, String a, String b, int k) {
        // KMP search
        List<Integer> kmpSearch = (text, pattern) -> {
            List<Integer> indices = new ArrayList<>();
            if (pattern.length() > text.length()) return indices;
            
            // Build LPS
            int[] lps = new int[pattern.length()];
            int len = 0;
            for (int i = 1; i < pattern.length();) {
                if (pattern.charAt(i) == pattern.charAt(len)) {
                    len++;
                    lps[i] = len;
                    i++;
                } else if (len != 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
            
            // Search
            int i = 0, j = 0;
            while (i < text.length()) {
                if (text.charAt(i) == pattern.charAt(j)) {
                    i++; j++;
                }
                if (j == pattern.length()) {
                    indices.add(i - j);
                    j = lps[j - 1];
                } else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
                    if (j != 0) j = lps[j - 1];
                    else i++;
                }
            }
            return indices;
        };
        
        // Would need functional interface - simplified version:
        // Use the string.find approach instead for Java
        List<Integer> aIndices = new ArrayList<>();
        int idx = s.indexOf(a);
        while (idx >= 0) {
            aIndices.add(idx);
            idx = s.indexOf(a, idx + 1);
        }
        
        List<Integer> bIndices = new ArrayList<>();
        idx = s.indexOf(b);
        while (idx >= 0) {
            bIndices.add(idx);
            idx = s.indexOf(b, idx + 1);
        }
        
        Collections.sort(bIndices);
        
        List<Integer> result = new ArrayList<>();
        for (int i : aIndices) {
            int left = Collections.binarySearch(bIndices, i - k);
            int right = Collections.binarySearch(bIndices, i + k);
            if (left < 0) left = -(left + 1);
            if (right < 0) right = -(right + 1) - 1;
            if (left <= right) result.add(i);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * KMP Search implementation
 */
function kmpSearch(text, pattern) {
    if (pattern.length > text.length) return [];
    
    // Build LPS array
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    for (let i = 1; i < pattern.length; ) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else if (len !== 0) {
            len = lps[len - 1];
        } else {
            lps[i] = 0;
            i++;
        }
    }
    
    // Search
    const indices = [];
    let i = 0, j = 0;
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++; j++;
        }
        if (j === pattern.length) {
            indices.push(i - j);
            j = lps[j - 1];
        } else if (i < text.length && text[i] !== pattern[j]) {
            if (j !== 0) j = lps[j - 1];
            else i++;
        }
    }
    
    return indices;
}

/**
 * @param {string} s
 * @param {string} a
 * @param {string} b
 * @param {number} k
 * @return {number[]}
 */
var beautifulIndices = function(s, a, b, k) {
    const aIndices = kmpSearch(s, a);
    let bIndices = kmpSearch(s, b);
    bIndices.sort((x, y) => x - y);
    
    const result = [];
    for (const i of aIndices) {
        let left = 0, right = bIndices.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (bIndices[mid] < i - k) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        if (left < bIndices.length && bIndices[left] <= i + k) {
            result.push(i);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m + a_count × log b_count) - KMP + binary search |
| **Space** | O(n + m) - LPS array and indices |

---

## Approach 3: Two-Pointer Sliding Window

This approach uses two pointers to check neighbors more efficiently when patterns are numerous.

### Algorithm Steps

1. Find all occurrences of a and b
2. Use two pointers to traverse both sorted lists simultaneously
3. For each a index, find the closest b index and check if within k

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def beautifulIndices_two_pointer(self, s: str, a: str, b: str, k: int) -> List[int]:
        """
        Using two-pointer approach.
        """
        def find_all_indices(text: str, pattern: str) -> List[int]:
            indices = []
            start = 0
            while True:
                pos = text.find(pattern, start)
                if pos == -1:
                    break
                indices.append(pos)
                start = pos + 1
            return indices
        
        a_indices = find_all_indices(s, a)
        b_indices = find_all_indices(s, b)
        b_indices.sort()
        
        result = []
        b_ptr = 0
        
        for i in a_indices:
            # Move b_ptr to find first b >= i - k
            while b_ptr < len(b_indices) and b_indices[b_ptr] < i - k:
                b_ptr += 1
            
            # Check if b_ptr is within range
            if b_ptr < len(b_indices) and b_indices[b_ptr] <= i + k:
                result.append(i)
        
        return result
```

<!-- slide -->
```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> beautifulIndices(string s, string a, string b, int k) {
        auto findAllIndices = [&](const string& text, const string& pattern) {
            vector<int> indices;
            size_t pos = text.find(pattern, 0);
            while (pos != string::npos) {
                indices.push_back(pos);
                pos = text.find(pattern, pos + 1);
            }
            return indices;
        };
        
        vector<int> aIndices = findAllIndices(s, a);
        vector<int> bIndices = findAllIndices(s, b);
        sort(bIndices.begin(), bIndices.end());
        
        vector<int> result;
        int bPtr = 0;
        
        for (int i : aIndices) {
            while (bPtr < bIndices.size() && bIndices[bPtr] < i - k) {
                bPtr++;
            }
            
            if (bPtr < bIndices.size() && bIndices[bPtr] <= i + k) {
                result.push_back(i);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> beautifulIndices(String s, String a, String b, int k) {
        List<Integer> findAllIndices = (text, pattern) -> {
            List<Integer> indices = new ArrayList<>();
            int pos = text.indexOf(pattern);
            while (pos >= 0) {
                indices.add(pos);
                pos = text.indexOf(pattern, pos + 1);
            }
            return indices;
        };
        
        List<Integer> aIndices = findAllIndices.apply(s, a);
        List<Integer> bIndices = findAllIndices.apply(s, b);
        Collections.sort(bIndices);
        
        List<Integer> result = new ArrayList<>();
        int bPtr = 0;
        
        for (int i : aIndices) {
            while (bPtr < bIndices.size() && bIndices.get(bPtr) < i - k) {
                bPtr++;
            }
            
            if (bPtr < bIndices.size() && bIndices.get(bPtr) <= i + k) {
                result.add(i);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @param {string} a
 * @param {string} b
 * @param {number} k
 * @return {number[]}
 */
var beautifulIndices = function(s, a, b, k) {
    const findAllIndices = (text, pattern) => {
        const indices = [];
        let pos = text.indexOf(pattern);
        while (pos !== -1) {
            indices.push(pos);
            pos = text.indexOf(pattern, pos + 1);
        }
        return indices;
    };
    
    const aIndices = findAllIndices(s, a);
    let bIndices = findAllIndices(s, b);
    bIndices.sort((x, y) => x - y);
    
    const result = [];
    let bPtr = 0;
    
    for (const i of aIndices) {
        while (bPtr < bIndices.length && bIndices[bPtr] < i - k) {
            bPtr++;
        }
        
        if (bPtr < bIndices.length && bIndices[bPtr] <= i + k) {
            result.push(i);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m + a_count + b_count) - Linear scan with two pointers |
| **Space** | O(a_count + b_count) - Storing indices |

---

## Comparison of Approaches

| Aspect | String Find + Binary Search | KMP + Binary Search | Two-Pointer |
|--------|----------------------------|---------------------|-------------|
| **Time Complexity** | O(n + m + a*log b) | O(n + m + a*log b) | O(n + m + a + b) |
| **Space Complexity** | O(a + b) | O(n + m + a + b) | O(a + b) |
| **Implementation** | Simple | Moderate | Simple |
| **Best For** | Most cases | Large inputs | Many occurrences |

**Best Approach:** String Find + Binary Search is optimal for most cases. Two-pointer is best when both a and b appear many times.

---

## Why Binary Search Works

The algorithm works because:

1. **Sorted b indices**: After sorting, b indices are in ascending order
2. **Range query**: For each a index i, we need to check if any b index is in [i - k, i + k]
3. **Binary search**: `bisect_left(b, i - k)` finds the first b >= (i - k)
4. **Verification**: We then check if this first candidate is <= (i + k)

This gives O(log b_count) per query instead of O(b_count) for linear scan.

---

## Related Problems

Based on similar themes (string matching, binary search, two pointers):

### Same Pattern (String Matching + Binary Search)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find the Index of the First Occurrence | [Link](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | KMP pattern matching |
| Longest Happy Prefix | [Link](https://leetcode.com/problems/longest-happy-prefix/) | KMP prefix computation |
| Shortest Distance to a Character | [Link](https://leetcode.com/problems/shortest-distance-to-a-character/) | Binary search on positions |

### Similar Concepts

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Minimum Window Substring | [Link](https://leetcode.com/problems/minimum-window-substring/) | Sliding window |
| Find All Anagrams | [Link](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Sliding window |
| Substring with Concatenation | [Link](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | Multiple pattern matching |

### Pattern Reference

For more detailed explanations of string matching patterns, see:
- **[String Matching Pattern](/patterns/string-matching)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### String Matching and Binary Search

- [NeetCode - Beautiful Indices](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with examples
- [KMP Algorithm Explained](https://www.youtube.com/watch?v=5i7oRMdN6Ds) - KMP pattern matching
- [Binary Search in Sorted Arrays](https://www.youtube.com/watch?v=Moq9Sx7Xc8w) - Binary search fundamentals

### Additional Resources

- [Two-Pointer Technique](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - Two-pointer patterns
- [String Find Methods](https://www.youtube.com/watch?v=6h7Glr1D9fI) - String searching algorithms

---

## Follow-up Questions

### Q1: What is the time and space complexity of the optimal solution?

**Answer:** Time complexity is O(n + m + a_count × log b_count), where n = len(s), m = len(a) + len(b). Space complexity is O(a_count + b_count) for storing indices.

---

### Q2: How would you handle overlapping matches?

**Answer:** The current solution handles overlapping matches by starting the next search from `pos + 1` (or `pos` for non-overlapping use `pos + pattern.length`).

---

### Q3: What if a or b doesn't appear in s at all?

**Answer:** If a has no occurrences, the result is empty (no beautiful indices). If b has no occurrences, no index can be beautiful since the condition requires a b match within distance k.

---

### Q4: How would you modify for multiple patterns instead of just a and b?

**Answer:** Extend the approach to store indices for each pattern in a list of lists, then for each a index, check all pattern lists. Use a combined sorted list if you want to use a single binary search.

---

### Q5: Can you solve it without storing all b indices?

**Answer:** For very large inputs where memory is a concern, you could use a streaming approach with a balanced BST or use the two-pointer method which only needs to store both lists anyway for random access.

---

### Q6: How would you handle very large k values (k > s.length)?

**Answer:** The algorithm handles this naturally - if k >= s.length, then any a index can match any b index. The binary search would always succeed, and the result would include all a indices.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty result: a appears but no b within range
- All beautiful: b appears close to every a
- Single occurrence: only one a or b
- Overlapping patterns: a = "aa", s = "aaa"
- Maximum constraints: s = 500000 chars, both patterns present many times

---

### Q8: How does this relate to the "Find Beautiful Indices I" version?

**Answer:** Version I typically has smaller constraints and might allow simpler O(n²) solutions. Version II requires the efficient O(n log n) approach due to constraints up to 5×10⁵.

---

## Common Pitfalls

### 1. Not Handling Overlapping Matches
**Issue:** Using `pos + pattern.length()` instead of `pos + 1` for overlapping matches.

**Solution:** Use `pos + 1` if you want to find overlapping matches, as required by this problem.

### 2. Forgetting to Sort b Indices
**Issue:** Trying to use binary search on unsorted b indices.

**Solution:** Always sort b_indices before performing binary search operations.

### 3. Incorrect Binary Search Boundaries
**Issue:** Using wrong lower and upper bounds for range queries.

**Solution:** Use `bisect_left(b_indices, i - k)` for lower bound and `bisect_right(b_indices, i + k)` for upper bound.

### 4. Not Checking for Empty Lists
**Issue:** Not handling the case where a or b has no occurrences.

**Solution:** Check if a_indices is empty (return empty result) or b_indices is empty (no beautiful indices possible).

### 5. Using Wrong Index for Distance Calculation
**Issue:** Confusing string indices with pattern lengths.

**Solution:** Remember distance is calculated between starting indices, not considering pattern lengths.

### 6. Off-by-One Errors
**Issue:** Using wrong range boundaries like [i-k, i+k) instead of [i-k, i+k].

**Solution:** The condition is |j - i| <= k, which means inclusive range [i-k, i+k].

---

## Summary

The **Find Beautiful Indices in the Given Array II** problem demonstrates the powerful combination of **string matching** and **binary search**:

- **String Find + Binary Search**: Optimal solution for most cases
- **KMP + Binary Search**: Best for very large inputs
- **Two-Pointer**: Best when both patterns appear many times

The key insight is preprocessing all occurrences of both patterns, then using efficient range queries to find beautiful indices. This is a common pattern in string processing problems where you need to find relationships between multiple pattern matches.

For more details on string matching and binary search patterns, see:
- **[String Matching Pattern](/patterns/string-matching)**
- **[Binary Search Pattern](/patterns/binary-search)**
