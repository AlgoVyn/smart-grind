# Assign Cookies

## Problem Description

[LeetCode Link: Assign Cookies](https://leetcode.com/problems/assign-cookies/)

Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.
Each child `i` has a greed factor `g[i]`, which is the minimum size of a cookie that the child will be content with; and each cookie `j` has a size `s[j]`. If `s[j] >= g[i]`, we can assign the cookie `j` to the child `i`, and the child `i` will be content. Your goal is to maximize the number of your content children and output the maximum number.

---

## Examples

**Example 1:**

**Input:**
```python
g = [1,2,3], s = [1,1]
```

**Output:**
```python
1
```

**Explanation:** You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3.
And even though you have 2 cookies, since their size is both 1, you could only make the child whose greed factor is 1 content.
You need to output 1.

**Example 2:**

**Input:**
```python
g = [1,2], s = [1,2,3]
```

**Output:**
```python
2
```

**Explanation:** You have 2 children and 3 cookies. The greed factors of 2 children are 1, 2.
You have 3 cookies and their sizes are big enough to gratify all of the children,
You need to output 2.

---

## Constraints

- `1 <= g.length <= 3 * 10^4`
- `0 <= s.length <= 3 * 10^4`
- `1 <= g[i], s[j] <= 2^31 - 1`

---

## Note

**Note:** This question is the same as 2410: Maximum Matching of Players With Trainers.

---

## Pattern: Greedy Two-Pointer Matching

This problem follows the **Greedy Two-Pointer** pattern, commonly used in assignment and matching problems where you want to maximize the number of matches.

### Core Concept

- **Sorting**: Sort both arrays to enable greedy matching
- **Two-pointer greedy**: Match smallest available resource to smallest demand
- **Optimality proof**: Assigning smallest possible resource first maximizes remaining options

### When to Use This Pattern

This pattern is applicable when:
1. Assignment problems with one-to-one matching
2. Resource allocation where you maximize number of satisfied requests
3. Problems requiring greedy optimization

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Hungarian Algorithm | O(n³) for optimal assignment |
| Maximum Flow | For complex matching |
| DP | For weighted matching |

---

## Intuition

The key insight for this problem is to use a **greedy approach** with two pointers:

1. **Sort both arrays**: Sort the greed factors of children and cookie sizes in ascending order

2. **Match smallest first**: Try to satisfy the child with the smallest greed factor using the smallest available cookie that can satisfy them

3. **Why greedy works**: By assigning the smallest possible cookie to the least greedy child, we maximize the number of remaining cookies for greedier children

**Example walkthrough:**
- For `g = [1,2,3], s = [1,1]`:
  - Sort: `g = [1,2,3], s = [1,1]`
  - Child 1 (greed=1): Cookie size 1 satisfies → count=1, move to child 2
  - Child 2 (greed=2): Cookie size 1 doesn't satisfy → move to next cookie
  - No more cookies → done
  - Result: 1 content child

---

## Solution Approaches

## Approach 1: Greedy Two-Pointer (Optimal)

#### Algorithm

1. Sort both `g` (greed factors) and `s` (cookie sizes) arrays in ascending order
2. Initialize two pointers: `i` for children, `j` for cookies
3. While both pointers are within bounds:
   - If `s[j] >= g[i]`: Cookie satisfies child → increment count and move both pointers
   - Otherwise: Move cookie pointer only (try larger cookie)
4. Return the count of satisfied children

#### Code

````carousel
```python
from typing import List

class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        """
        Assign cookies to children to maximize the number of content children.
        
        Args:
            g: List of greed factors for each child
            s: List of cookie sizes
            
        Returns:
            Maximum number of content children
        """
        g.sort()
        s.sort()
        
        i = 0  # Pointer for children
        j = 0  # Pointer for cookies
        count = 0
        
        while i < len(g) and j < len(s):
            if s[j] >= g[i]:
                # Cookie satisfies this child
                count += 1
                i += 1
            j += 1
            
        return count
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());
        
        int i = 0;  // Pointer for children
        int j = 0;  // Pointer for cookies
        int count = 0;
        
        while (i < g.size() && j < s.size()) {
            if (s[j] >= g[i]) {
                count++;
                i++;
            }
            j++;
        }
        
        return count;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        
        int i = 0;  // Pointer for children
        int j = 0;  // Pointer for cookies
        int count = 0;
        
        while (i < g.length && j < s.length) {
            if (s[j] >= g[i]) {
                count++;
                i++;
            }
            j++;
        }
        
        return count;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let i = 0;  // Pointer for children
    let j = 0;  // Pointer for cookies
    let count = 0;
    
    while (i < g.length && j < s.length) {
        if (s[j] >= g[i]) {
            count++;
            i++;
        }
        j++;
    }
    
    return count;
};
```
````

#### Complexity Analysis

| Complexity | Value |
|------------|-------|
| Time | O(n log n + m log m) |
| Space | O(1) or O(n+m) depending on sort implementation |

---

## Explanation

This problem involves assigning cookies to children based on their greed factors and cookie sizes, maximizing the number of content children.

We sort both the greed array and the cookie sizes array. Then, use two pointers: one for children and one for cookies. For each child, we try to find the smallest cookie that can satisfy their greed (size >= greed). If found, increment the count and move to the next child. Always move to the next cookie.

This greedy approach works because assigning the smallest possible cookie to the smallest greed first leaves larger cookies for greedier children.

---

---

## Time Complexity
**O(N log N + M log M)** due to sorting, where N and M are the lengths of g and s.

---

## Space Complexity
**O(1)** if sorting in place, or O(N + M) for the sort space.

---

---

## Approach 2: Binary Search (Alternative)

### Algorithm Steps

1. Sort both arrays
2. For each child, use binary search to find the smallest cookie that satisfies
3. Track matched children count

### Why It Works

Binary search finds the smallest cookie >= child's greed in O(log n) instead of linear search.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def findContentChildren(self, g: List[int], s: List[int]) -> int:
        g.sort()
        s.sort()
        
        count = 0
        for greed in g:
            # Find the smallest cookie that can satisfy this child
            idx = bisect.bisect_left(s, greed)
            if idx < len(s):
                count += 1
                s.pop(idx)  # Remove used cookie
        
        return count
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());
        
        int count = 0;
        for (int greed : g) {
            auto it = lower_bound(s.begin(), s.end(), greed);
            if (it != s.end()) {
                count++;
                s.erase(it);
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        
        List<Integer> cookies = new ArrayList<>();
        for (int size : s) cookies.add(size);
        
        int count = 0;
        for (int greed : g) {
            int idx = Collections.binarySearch(cookies, greed);
            if (idx < 0) idx = -(idx + 1);
            if (idx < cookies.size()) {
                count++;
                cookies.remove(idx);
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let count = 0;
    for (const greed of g) {
        const idx = s.findIndex(cookie => cookie >= greed);
        if (idx !== -1) {
            count++;
            s.splice(idx, 1);
        }
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| Time | O(n log n + m log m) |
| Space | O(m) for cookie list |

---

## Related Problems

1. **[Maximum Matching of Players With Trainers](https://leetcode.com/problems/maximum-matching-of-players-with-trainers/)** - Same problem with different context
2. **[Two Sum Less Than K](https://leetcode.com/problems/two-sum-less-than-k/)** - Similar two-pointer approach
3. **[Boats to Save People](https://leetcode.com/problems/boats-to-save-people/)** - Similar greedy matching problem
4. **[Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number/)** - Three-pointer approach
5. **[Array Partition](https://leetcode.com/problems/array-partition/)** - Pairing minimization

---

## Video Tutorial Links

1. **[Assign Cookies - LeetCode 455](https://www.youtube.com/watch?v?v4xb6yJ7G8U)** by NeetCode
2. **[Greedy Two Pointer Explained](https://www.youtube.com/watch?v=XXXXX)** by Back to Back SWE
3. **[Assign Cookies Solution](https://www.youtube.com/watch?v=XXXXX)** by Nick White

---

## Summary

The **Assign Cookies** problem demonstrates the **greedy two-pointer** pattern:

- **Sorting first**: Sort both greed factors and cookie sizes
- **Two-pointer greedy**: Assign smallest possible cookie to smallest greed
- **Optimality**: This greedy approach is optimal because it maximizes remaining resources
- **Time complexity**: O(n log n + m log m) due to sorting

Key insights:
1. Sort both arrays to enable greedy matching
2. Always try to satisfy the child with smallest greed first
3. Use the smallest cookie that can satisfy the current child
4. This leaves larger cookies for greedier children

This pattern extends to:
- Maximum matching problems
- Resource allocation problems
- Any greedy assignment scenario

---

## Common Pitfalls

### 1. Not Sorting Both Arrays
**Issue:** Trying to match without sorting leads to suboptimal results.

**Solution:** Always sort both greed factors and cookie sizes first.

### 2. Wrong Pointer Movement
**Issue:** Moving both pointers after a successful match instead of just cookie pointer.

**Solution:** After a successful match, move both pointers. After failure, only move cookie pointer.

### 3. Not Handling Empty Arrays
**Issue:** Not handling edge cases when either array is empty.

**Solution:** The while loop naturally handles this with the boundary checks.

### 4. Using Wrong Comparison
**Issue:** Using > instead of >= for matching.

**Solution:** Use `s[j] >= g[i]` to allow equal size matching.

---

## Follow-up Questions

### Q1: How would you maximize total satisfaction (sum of assigned cookie sizes)?

**Answer:** Instead of counting matches, track the sum of assigned cookies. Use the same greedy approach but sum up the cookie sizes when assigned.

### Q2: What if each child can get multiple cookies?

**Answer:** This becomes a more complex knapsack-like problem. You would need DP to find the optimal subset of cookies for each child.

### Q3: How would you handle the case where cookies have different values?

**Answer:** Sort by value rather than size, or create a composite score combining size and value.

### Q4: Can you solve this without sorting?

**Answer:** Yes, but it would require more complex data structures like balanced trees, resulting in O(n log n) anyway.

### Q5: How would you handle the related problem of matching players to trainers?

**Answer:** Same approach - sort both arrays and use two pointers. This is the same greedy algorithm.

This ensures optimal assignment.
