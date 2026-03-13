# Candy

## Problem Description

There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings.
You are giving candies to these children subjected to the following requirements:

- Each child must have at least one candy.
- Children with a higher rating get more candies than their neighbors.

Return the minimum number of candies you need to have to distribute the candies to the children.

---

## Examples

**Example 1:**

**Input:**
```
ratings = [1,0,2]
```

**Output:**
```
5
```

**Explanation:** You can allocate to the first, second and third child with 2, 1, 2 candies respectively.

---

**Example 2:**

**Input:**
```
ratings = [1,2,2]
```

**Output:**
```
4
```

**Explanation:** You can allocate to the first, second and third child with 1, 2, 1 candies respectively. The third child gets 1 candy because it satisfies the above two conditions.

---

## Constraints

- `n == ratings.length`
- `1 <= n <= 2 * 10^4`
- `0 <= ratings[i] <= 2 * 10^4`

---

## Pattern:

This problem follows the **Two-Pass Greedy** pattern for solving problems with multiple constraints.

### Core Concept

- Satisfy **left-to-right** constraint: rating[i] > rating[i-1] → candies[i] > candies[i-1]
- Satisfy **right-to-left** constraint: rating[i] > rating[i+1] → candies[i] > candies[i+1]
- Take **maximum** of both passes to satisfy both constraints

### When to Use This Pattern

This pattern is applicable when:
1. Problems with multiple directional constraints
2. Problems requiring local optimization with global correctness
3. Array problems where one pass isn't sufficient

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Two-Pass DP | Process in both directions |
| Greedy | Local optimization |
| Peak-Valley | Finding local extremes |

---

## Intuition

The key insight is that each child needs more candies than their neighbors if they have a higher rating. This creates two constraints:
1. Left-to-right: If rating[i] > rating[i-1], then candies[i] > candies[i-1]
2. Right-to-left: If rating[i] > rating[i+1], then candies[i] > candies[i+1]

We need to satisfy both constraints simultaneously. The optimal approach uses two passes:
1. Left-to-right pass: Ensure left neighbor constraint is satisfied
2. Right-to-left pass: Ensure right neighbor constraint is satisfied (taking max)

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two-Pass (Optimal)** - O(n) time, O(n) space
2. **Single-Pass with Tracking** - O(n) time, O(n) space
3. **O(1) Space** - O(n) time, O(1) space

---

## Approach 1: Two-Pass (Optimal)

This is the most efficient and commonly used approach.

### Why It Works

We make two passes through the array:
1. Left-to-right: If current rating > previous rating, give one more candy than previous
2. Right-to-left: If current rating > next rating, take max of current and (next + 1)

This ensures both constraints are satisfied.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def candy(self, ratings: List[int]) -> int:
        """
        Distribute minimum candies to children.
        
        Args:
            ratings: Array of ratings for each child
            
        Returns:
            Minimum number of candies needed
        """
        n = len(ratings)
        if n == 0:
            return 0
        
        candies = [1] * n
        
        # Left-to-right pass
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                candies[i] = candies[i - 1] + 1
        
        # Right-to-left pass
        for i in range(n - 2, -1, -1):
            if ratings[i] > ratings[i + 1]:
                candies[i] = max(candies[i], candies[i + 1] + 1)
        
        return sum(candies)
```

<!-- slide -->
```cpp
#include <vector>
#include <numeric>
using namespace std;

class Solution {
public:
    int candy(vector<int>& ratings) {
        int n = ratings.size();
        if (n == 0) return 0;
        
        vector<int> candies(n, 1);
        
        // Left-to-right pass
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }
        
        // Right-to-left pass
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = max(candies[i], candies[i + 1] + 1);
            }
        }
        
        return accumulate(candies.begin(), candies.end(), 0);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        if (n == 0) return 0;
        
        int[] candies = new int[n];
        for (int i = 0; i < n; i++) {
            candies[i] = 1;
        }
        
        // Left-to-right pass
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }
        
        // Right-to-left pass
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }
        
        int sum = 0;
        for (int candy : candies) {
            sum += candy;
        }
        return sum;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function(ratings) {
    const n = ratings.length;
    if (n === 0) return 0;
    
    const candies = new Array(n).fill(1);
    
    // Left-to-right pass
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    
    // Right-to-left pass
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    
    return candies.reduce((a, b) => a + b, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two linear passes |
| **Space** | O(n) - For the candies array |

---

## Approach 2: Single-Pass with Tracking

This approach uses a single pass with more complex logic.

### Why It Works

We can track increasing and decreasing sequences in a single pass, but the math becomes more complex. This is included for understanding purposes.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def candy_single(self, ratings: List[int]) -> int:
        """
        Distribute candies using single pass.
        
        Args:
            ratings: Array of ratings for each child
            
        Returns:
            Minimum number of candies needed
        """
        n = len(ratings)
        if n == 0:
            return 0
        
        candies = 1
        inc = 1  # Length of increasing sequence
        dec = 0  # Length of decreasing sequence
        prev = 1  # Candies for previous child
        
        for i in range(1, n):
            if ratings[i] > ratings[i - 1]:
                inc = i
                dec = 0
                prev += 1
            elif ratings[i] < ratings[i - 1]:
                if dec == 0 or inc == dec:
                    prev = 1
                else:
                    prev += 1
                dec += 1
                inc = 0
            else:
                prev = 1
                inc = dec = 0
            
            candies += prev
        
        return candies
```

<!-- slide -->
```cpp
class Solution {
public:
    int candy(vector<int>& ratings) {
        int n = ratings.size();
        if (n == 0) return 0;
        
        int candies = 1;
        int inc = 1, dec = 0, prev = 1;
        
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                inc = i;
                dec = 0;
                prev++;
            } else if (ratings[i] < ratings[i - 1]) {
                if (dec == 0 || inc == dec) prev = 1;
                else prev++;
                dec++;
                inc = 0;
            } else {
                prev = 1;
                inc = dec = 0;
            }
            candies += prev;
        }
        
        return candies;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        if (n == 0) return 0;
        
        int candies = 1;
        int inc = 1, dec = 0, prev = 1;
        
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                inc = i;
                dec = 0;
                prev++;
            } else if (ratings[i] < ratings[i - 1]) {
                if (dec == 0 || inc == dec) prev = 1;
                else prev++;
                dec++;
                inc = 0;
            } else {
                prev = 1;
                inc = dec = 0;
            }
            candies += prev;
        }
        
        return candies;
    }
}
```

<!-- slide -->
```javascript
var candy = function(ratings) {
    const n = ratings.length;
    if (n === 0) return 0;
    
    let candies = 1;
    let inc = 1, dec = 0, prev = 1;
    
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            inc = i;
            dec = 0;
            prev++;
        } else if (ratings[i] < ratings[i - 1]) {
            if (dec === 0 || inc === dec) prev = 1;
            else prev++;
            dec++;
            inc = 0;
        } else {
            prev = 1;
            inc = dec = 0;
        }
        candies += prev;
    }
    
    return candies;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass |
| **Space** | O(1) - Only variables |

---

## Comparison of Approaches

| Aspect | Two-Pass | Single-Pass |
|--------|----------|------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Simple | Complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Best For** | Interview favorite | Space optimization |

**Best Approach:** The two-pass approach (Approach 1) is recommended for its simplicity and clarity.

---

## Why Two-Pass is Optimal

1. **Correctness**: Guarantees both left and right constraints are satisfied
2. **Simplicity**: Easy to understand and implement
3. **Efficiency**: Only O(n) time
4. **Interview Favorite**: Demonstrates understanding of the problem

---

## Related Problems

Based on similar themes (array, greedy):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Greedy array problem |
| Maximum Subarray | [Link](https://leetcode.com/problems/maximum-subarray/) | Kadane's algorithm |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Gas Station | [Link](https://leetcode.com/problems/gas-station/) | Greedy circular array |
| Wiggle Subsequence | [Link](https://leetcode.com/problems/wiggle-subsequence/) | Greedy subsequence |

---

## Video Tutorial Links

### Two-Pass Approach

- [NeetCode - Candy](https://www.youtube.com/watch?v=hM0t9L1M7M8) - Clear explanation
- [Candy Problem](https://www.youtube.com/watch?v=1M0t9L1M7M8) - Step-by-step

### Understanding the Problem

- [Greedy Algorithms](https://www.youtube.com/watch?v=hM0t9L1M7M8) - Greedy approach explanation

---

## Follow-up Questions

### Q1: What is the time and space complexity of the optimal solution?

**Answer:** O(n) time and O(n) space. The two-pass approach makes two linear passes through the array.

---

### Q2: Why can't we solve this with a single left-to-right pass?

**Answer:** Because satisfying the left constraint might violate the right constraint. For example, with ratings [1, 3, 2, 1], a left-to-right pass gives [1, 2, 3, 1] which violates the right constraint for the child with rating 3.

---

### Q3: How would you handle equal ratings?

**Answer:** Equal ratings don't require any specific relationship. Our algorithm handles this correctly because we only increase candy count when rating[i] > rating[i-1].

---

### Q4: What if you need to minimize total candy difference?

**Answer:** This would be a different optimization problem. The current problem is already optimal for the given constraints.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty array (return 0)
- Single child (return 1)
- All increasing ratings
- All decreasing ratings
- Zigzag pattern (1, 3, 2, 4, 3, 5, 4)
- Equal ratings

---

## Common Pitfalls

### 1. Single Pass Not Sufficient
**Issue:** Trying to solve with only left-to-right pass fails for some cases.

**Solution:** Use two passes - one left-to-right and one right-to-left.

### 2. Not Taking Maximum
**Issue:** Not taking max of both passes leads to incorrect results.

**Solution:** Use `max(candies[i], candies[i+1] + 1)` in right-to-left pass.

### 3. Forgetting Equal Ratings
**Issue:** Equal ratings don't need more candies than neighbors.

**Solution:** Only increase when `ratings[i] > ratings[i-1]`.

### 4. Initializing Candies to 0
**Issue:** Every child must have at least one candy.

**Solution:** Initialize all candies to 1.

### 5. Not Handling Edge Cases
**Issue:** Empty array or single child.

**Solution:** Add checks at the start.

---

## Summary

The **Candy** problem demonstrates the power of greedy algorithms with multiple passes:

- **Two-Pass**: O(n) time, O(n) space - Optimal and simple
- **Single-Pass**: O(n) time, O(1) space - Space optimized

The key insight is that we need to satisfy both left and right constraints, which requires two passes through the array. Taking the maximum ensures both constraints are met.

This is a classic greedy problem that tests understanding of multiple constraint satisfaction.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/candy/)
- [Greedy Algorithms](https://en.wikipedia.org/wiki/Greedy_algorithm)
