# Russian Doll Envelopes

## Problem Description

You are given a 2D array of integers `envelopes` where `envelopes[i] = [wi, hi]` represents the width and the height of an envelope.

One envelope can fit into another if and only if both the width and height of one envelope are greater than the other envelope's width and height.

Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).

**Note:** You cannot rotate an envelope.

**LeetCode Link:** [Russian Doll Envelopes - LeetCode 354](https://leetcode.com/problems/russian-doll-envelopes/)

---

## Examples

### Example 1

**Input:**
```python
envelopes = [[5,4],[6,4],[6,7],[2,3]]
```

**Output:**
```python
3
```

**Explanation:** The maximum number of envelopes you can Russian doll is 3 (`[2,3]` => `[5,4]` => `[6,7]`).

### Example 2

**Input:**
```python
envelopes = [[1,1],[1,1],[1,1]]
```

**Output:**
```python
1
```

---

## Constraints

- `1 <= envelopes.length <= 10^5`
- `envelopes[i].length == 2`
- `1 <= wi, hi <= 10^5`

---

## Pattern: Sorting + LIS (Longest Increasing Subsequence)

This problem uses **Sort + Binary Search LIS**. Sort by width ascending, height descending (for same width), then find LIS on heights.

---

## Intuition

The key insight for this problem is transforming the 2D nesting problem into a 1D Longest Increasing Subsequence (LIS) problem.

### Key Observations

1. **Sorting by Width**: When we sort envelopes by width in ascending order, all envelopes with smaller widths come first.

2. **Handling Same Width**: For envelopes with the same width, we must sort by height in **descending** order. This ensures that when we look for increasing subsequences in heights, we don't count two envelopes with the same width as valid nesting pairs.

3. **Reducing to LIS**: After sorting, the problem becomes finding the Longest Increasing Subsequence (LIS) on the heights. This works because:
   - If envelope A comes before envelope B in our sorted order, then A's width ≤ B's width
   - For valid nesting, we need width_A < width_B AND height_A < height_B
   - By sorting same-width envelopes with descending height, we ensure that two envelopes with same width can never be part of an increasing subsequence
   - So valid nesting pairs correspond exactly to increasing pairs in the heights array

4. **Binary Search Optimization**: Instead of O(n²) DP for LIS, we use patience sorting with binary search to achieve O(n log n).

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search LIS (Optimal)** - O(n log n) time
2. **Segment Tree / BIT** - Alternative approach for variation

---

## Approach 1: Binary Search LIS (Optimal)

### Algorithm Steps

1. **Sort envelopes**: Sort by width ascending, height descending for equal widths
2. **Extract heights**: Get all heights from sorted envelopes
3. **Find LIS**: Use binary search to find longest increasing subsequence on heights
4. **Return length**: Length of LIS = maximum number of nested envelopes

### Why It Works

By sorting widths ascending, we ensure all potential "outer" envelopes come before potential "inner" envelopes. The descending height sort for equal widths prevents same-width envelopes from being counted as valid nesting. Then finding LIS on heights gives us the longest chain where both width and height increase.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def maxEnvelopes(self, envelopes: List[List[int]]) -> int:
        """
        Find maximum number of Russian doll envelopes.
        
        Args:
            envelopes: List of [width, height] pairs
            
        Returns:
            Maximum number of nested envelopes
        """
        if not envelopes:
            return 0
        
        # Step 1: Sort by width ascending, height descending
        envelopes.sort(key=lambda x: (x[0], -x[1]))
        
        # Step 2: Extract heights
        heights = [e[1] for e in envelopes]
        
        # Step 3: Find LIS on heights using binary search
        tails = []
        
        for height in heights:
            # Find insertion point using binary search
            pos = bisect.bisect_left(tails, height)
            
            if pos == len(tails):
                # height is larger than all tails, extend LIS
                tails.append(height)
            else:
                # Replace to maintain smallest tail
                tails[pos] = height
        
        return len(tails)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxEnvelopes(vector<vector<int>>& envelopes) {
        if (envelopes.empty()) return 0;
        
        // Step 1: Sort by width ascending, height descending
        sort(envelopes.begin(), envelopes.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 if (a[0] == b[0]) return a[1] > b[1];
                 return a[0] < b[0];
             });
        
        // Step 2: Extract heights and find LIS
        vector<int> tails;
        
        for (const auto& env : envelopes) {
            int h = env[1];
            
            // Binary search for insertion point
            auto it = lower_bound(tails.begin(), tails.end(), h);
            
            if (it == tails.end()) {
                tails.push_back(h);
            } else {
                *it = h;
            }
        }
        
        return tails.size();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int maxEnvelopes(int[][] envelopes) {
        if (envelopes == null || envelopes.length == 0) {
            return 0;
        }
        
        // Step 1: Sort by width ascending, height descending
        Arrays.sort(envelopes, (a, b) -> {
            if (a[0] == b[0]) {
                return b[1] - a[1]; // Descending height for same width
            }
            return a[0] - b[0]; // Ascending width
        });
        
        // Step 2: Find LIS on heights
        List<Integer> tails = new ArrayList<>();
        
        for (int[] env : envelopes) {
            int h = env[1];
            
            int pos = Collections.binarySearch(tails, h);
            
            if (pos < 0) {
                pos = -(pos + 1);
            }
            
            if (pos == tails.size()) {
                tails.add(h);
            } else {
                tails.set(pos, h);
            }
        }
        
        return tails.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} envelopes
 * @return {number}
 */
var maxEnvelopes = function(envelopes) {
    if (!envelopes || envelopes.length === 0) {
        return 0;
    }
    
    // Step 1: Sort by width ascending, height descending
    envelopes.sort((a, b) => {
        if (a[0] === b[0]) {
            return b[1] - a[1]; // Descending height for same width
        }
        return a[0] - b[0]; // Ascending width
    });
    
    // Step 2: Find LIS on heights
    const tails = [];
    
    for (const env of envelopes) {
        const h = env[1];
        
        // Binary search using built-in method
        let left = 0;
        let right = tails.length - 1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < h) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        if (left === tails.length) {
            tails.push(h);
        } else {
            tails[left] = h;
        }
    }
    
    return tails.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - sorting O(n log n) + LIS O(n log n) |
| **Space** | O(n) for storing heights and tails array |

---

## Approach 2: Binary Indexed Tree (BIT) / Segment Tree

### Algorithm Steps

1. **Coordinate Compression**: Compress heights to indices
2. **Sort envelopes**: Sort by width ascending, height descending
3. **DP with BIT**: For each envelope (in sorted order), find max DP value for all smaller heights
4. **Update BIT**: Update with new DP value
5. **Return maximum**: Maximum value in BIT

### Why It Works

This is a dynamic programming approach where DP[i] represents the maximum number of envelopes ending with envelope i. By using a BIT, we can efficiently query the maximum DP value for heights less than the current height.

### Code Implementation

````carousel
```python
from typing import List

class BIT:
    def __init__(self, n: int):
        self.n = n
        self.tree = [0] * (n + 1)
    
    def update(self, i: int, val: int) -> None:
        while i <= self.n:
            self.tree[i] = max(self.tree[i], val)
            i += i & (-i)
    
    def query(self, i: int) -> int:
        res = 0
        while i > 0:
            res = max(res, self.tree[i])
            i -= i & (-i)
        return res


class Solution:
    def maxEnvelopes(self, envelopes: List[List[int]]) -> int:
        if not envelopes:
            return 0
        
        # Step 1: Coordinate compression for heights
        heights = sorted(set(e[1] for e in envelopes))
        h_to_idx = {h: i + 1 for i, h in enumerate(heights)}
        
        # Step 2: Sort by width ascending, height descending
        envelopes.sort(key=lambda x: (x[0], -x[1]))
        
        # Step 3: DP with BIT
        bit = BIT(len(heights))
        max_dp = 0
        
        for env in envelopes:
            h = env[1]
            idx = h_to_idx[h]
            
            # Query max for heights smaller than current
            dp = bit.query(idx - 1) + 1
            
            # Update BIT
            bit.update(idx, dp)
            max_dp = max(max_dp, dp)
        
        return max_dp
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

class BIT {
private:
    vector<int> tree;
    int n;
    
public:
    BIT(int n) : n(n), tree(n + 1, 0) {}
    
    void update(int i, int val) {
        while (i <= n) {
            tree[i] = max(tree[i], val);
            i += i & (-i);
        }
    }
    
    int query(int i) {
        int res = 0;
        while (i > 0) {
            res = max(res, tree[i]);
            i -= i & (-i);
        }
        return res;
    }
};

class Solution {
public:
    int maxEnvelopes(vector<vector<int>>& envelopes) {
        if (envelopes.empty()) return 0;
        
        // Coordinate compression
        vector<int> allHeights;
        for (auto& e : envelopes) {
            allHeights.push_back(e[1]);
        }
        sort(allHeights.begin(), allHeights.end());
        allHeights.erase(unique(allHeights.begin(), allHeights.end()), allHeights.end());
        
        unordered_map<int, int> hToIdx;
        for (int i = 0; i < allHeights.size(); i++) {
            hToIdx[allHeights[i]] = i + 1;
        }
        
        // Sort envelopes
        sort(envelopes.begin(), envelopes.end(),
            [](const vector<int>& a, const vector<int>& b) {
                if (a[0] == b[0]) return a[1] > b[1];
                return a[0] < b[0];
            });
        
        // DP with BIT
        BIT bit(allHeights.size());
        int maxDp = 0;
        
        for (auto& env : envelopes) {
            int h = env[1];
            int idx = hToIdx[h];
            int dp = bit.query(idx - 1) + 1;
            bit.update(idx, dp);
            maxDp = max(maxDp, dp);
        }
        
        return maxDp;
    }
};
```

<!-- slide -->
```java
class BIT {
    int[] tree;
    int n;
    
    BIT(int n) {
        this.n = n;
        this.tree = new int[n + 1];
    }
    
    void update(int i, int val) {
        while (i <= n) {
            tree[i] = Math.max(tree[i], val);
            i += i & (-i);
        }
    }
    
    int query(int i) {
        int res = 0;
        while (i > 0) {
            res = Math.max(res, tree[i]);
            i -= i & (-i);
        }
        return res;
    }
}

class Solution {
    public int maxEnvelopes(int[][] envelopes) {
        if (envelopes == null || envelopes.length == 0) return 0;
        
        // Coordinate compression
        int[] allHeights = new int[envelopes.length];
        for (int i = 0; i < envelopes.length; i++) {
            allHeights[i] = envelopes[i][1];
        }
        Arrays.sort(allHeights);
        int unique = 1;
        for (int i = 1; i < allHeights.length; i++) {
            if (allHeights[i] != allHeights[i-1]) {
                allHeights[unique++] = allHeights[i];
            }
        }
        
        int[] compressed = new int[unique];
        System.arraycopy(allHeights, 0, compressed, 0, unique);
        
        HashMap<Integer, Integer> hToIdx = new HashMap<>();
        for (int i = 0; i < unique; i++) {
            hToIdx.put(compressed[i], i + 1);
        }
        
        // Sort envelopes
        Arrays.sort(envelopes, (a, b) -> {
            if (a[0] == b[0]) return b[1] - a[1];
            return a[0] - b[0];
        });
        
        // DP with BIT
        BIT bit = new BIT(unique);
        int maxDp = 0;
        
        for (int[] env : envelopes) {
            int h = env[1];
            int idx = hToIdx.get(h);
            int dp = bit.query(idx - 1) + 1;
            bit.update(idx, dp);
            maxDp = Math.max(maxDp, dp);
        }
        
        return maxDp;
    }
}
```

<!-- slide -->
```javascript
class BIT {
    constructor(n) {
        this.n = n;
        this.tree = new Array(n + 1).fill(0);
    }
    
    update(i, val) {
        while (i <= this.n) {
            this.tree[i] = Math.max(this.tree[i], val);
            i += i & (-i);
        }
    }
    
    query(i) {
        let res = 0;
        while (i > 0) {
            res = Math.max(res, this.tree[i]);
            i -= i & (-i);
        }
        return res;
    }
}

/**
 * @param {number[][]} envelopes
 * @return {number}
 */
var maxEnvelopes = function(envelopes) {
    if (!envelopes || envelopes.length === 0) {
        return 0;
    }
    
    // Coordinate compression
    const allHeights = [...new Set(envelopes.map(e => e[1]))].sort((a, b) => a - b);
    const hToIdx = new Map();
    allHeights.forEach((h, i) => hToIdx.set(h, i + 1));
    
    // Sort envelopes
    envelopes.sort((a, b) => {
        if (a[0] === b[0]) return b[1] - a[1];
        return a[0] - b[0];
    });
    
    // DP with BIT
    const bit = new BIT(allHeights.length);
    let maxDp = 0;
    
    for (const env of envelopes) {
        const h = env[1];
        const idx = hToIdx.get(h);
        const dp = bit.query(idx - 1) + 1;
        bit.update(idx, dp);
        maxDp = Math.max(maxDp, dp);
    }
    
    return maxDp;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - sorting + BIT operations |
| **Space** | O(n) for BIT and compression |

---

## Comparison of Approaches

| Aspect | Binary Search LIS | BIT/Segment Tree |
|--------|-------------------|------------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | Moderate |
| **Flexibility** | Less flexible | More flexible for variations |

**Best Approach:** Use Approach 1 (Binary Search LIS) for the simplest and most elegant solution.

---

## Common Pitfalls

### 1. Sorting Height in Wrong Order
**Issue**: Sorting heights in ascending order for same width.

**Solution**: Must sort heights in **descending** order for same width to prevent counting same-width envelopes as valid nesting pairs.

### 2. Using DP Instead of Binary Search
**Issue**: Using O(n²) DP for LIS.

**Solution**: Use patience sorting with binary search for O(n log n) complexity.

### 3. Not Handling Empty Input
**Issue**: Not checking for empty envelope list.

**Solution**: Always handle edge case of empty input.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft, Apple
- **Difficulty**: Hard
- **Concepts Tested**: Sorting, LIS, Binary Search, Dynamic Programming

### Learning Outcomes

1. **Problem Transformation**: Learn to convert 2D problem to 1D LIS
2. **Sorting Tricks**: Master the width ascending, height descending sort
3. **LIS Optimization**: Understand patience sorting algorithm
4. **Alternative Solutions**: Explore BIT/Segment Tree approach

---

## Related Problems

Based on similar themes (Sorting, LIS, Dynamic Programming):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Increasing Subsequence | [Link](https://leetcode.com/problems/longest-increasing-subsequence/) | Classic LIS problem |
| Longest Bitonic Subsequence | [Link](https://leetcode.com/problems/longest-bitonic-subsequence/) | LIS variation |
| Number of Longest Increasing Subsequence | [Link](https://leetcode.com/problems/number-of-longest-increasing-subsequence/) | Count LIS |
| Envelope Partition | [Link](https://leetcode.com/problems/writing-elements-with-concatenated-words/) | Similar nesting |

### Pattern Reference

For more detailed explanations of the LIS pattern, see:
- **[Binary Search on Sorted Array](/patterns/binary-search-on-sorted-array-list)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Russian Doll Envelopes](https://www.youtube.com/watch?v=4eU3m8oIIIM)** - Clear explanation with visual examples
2. **[Russian Doll Envelopes - LeetCode 354](https://www.youtube.com/watch?v=oL1s2uhao9I)** - Detailed walkthrough
3. **[LIS Patience Sorting](https://www.youtube.com/watch?v=3D3Mv6fF6Ck)** - Understanding binary search LIS

### Related Concepts

- **[Longest Increasing Subsequence](https://www.youtube.com/watch?v=CE2b_-t7mO8)** - LIS fundamentals
- **[Binary Indexed Tree](https://www.youtube.com/watch?v=v305T-Ldprg)** - BIT tutorial

---

## Follow-up Questions

### Q1: How would you modify the solution to return the actual envelopes in the chain?

**Answer:** Instead of just tracking the length in the tails array, maintain a separate array to reconstruct the actual LIS. Store the predecessor index for each element and backtrack to get the full chain.

---

### Q2: What if envelopes could be rotated (swapped width and height)?

**Answer:** For each envelope, consider both [w, h] and [h, w] as separate options. Sort and find LIS on both dimensions. This essentially doubles the problem size.

---

### Q3: How does this problem change if we need to find the minimum number of envelopes to discard?

**Answer:** This is equivalent to finding the maximum nesting, so the answer would be `n - maxEnvelopes(envelopes)` where n is total envelopes.

---

### Q4: Can you solve this using a brute force approach?

**Answer:** Yes, you could sort envelopes and use DP where dp[i] = max(dp[j] + 1) for all j < i where envelopes[j] can fit into envelopes[i]. This is O(n²) but works for small n.

---

### Q5: How would you handle the case where widths or heights can be equal for nesting?

**Answer:** The current solution with descending height sort handles this. If strict inequality is not required (i.e., width_A <= width_B AND height_A <= height_B), you would need to adjust the comparison logic.

---

## Summary

The **Russian Doll Envelopes** problem is a classic application of the Longest Increasing Subsequence (LIS) pattern combined with clever sorting.

Key takeaways:
1. Sort envelopes by width ascending, height descending for equal widths
2. Reduce to 1D LIS problem on heights after sorting
3. Use binary search (patience sorting) for O(n log n) solution
4. The descending height sort ensures same-width envelopes can't be both in the LIS

This problem demonstrates the power of problem transformation - converting a 2D nested interval problem into a well-studied 1D LIS problem through careful sorting.

### Pattern Summary

This problem exemplifies the **Sort + LIS** pattern, characterized by:
- Sorting to impose order on one dimension
- Converting to LIS for the other dimension
- Using binary search for efficiency
- Handling edge cases with custom sort keys

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search-on-sorted-array-list)**.

---

## Additional Resources

- [LeetCode Problem 354](https://leetcode.com/problems/russian-doll-envelopes/) - Official problem page
- [LIS - GeeksforGeeks](https://www.geeksforgeeks.org/longest-increasing-subsequence/) - Detailed LIS explanation
- [Patience Sorting](https://en.wikipedia.org/wiki/Patience_sorting) - LIS algorithm background
- [Pattern: Binary Search](/patterns/binary-search-on-sorted-array-list) - Comprehensive pattern guide
