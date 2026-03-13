# Minimum Penalty For A Shop

## Problem Description

You are given the customer visit log of a shop represented by a 0-indexed string `customers` consisting only of characters `'N'` and `'Y'`:

- If the `i-th` character is `'Y'`, it means that customers come at the `i-th` hour
- `'N'` indicates that no customers come at the `i-th` hour

If the shop closes at the `j-th` hour (0 <= j <= n), the penalty is calculated as follows:

- For every hour when the shop is open and no customers come, the penalty increases by 1
- For every hour when the shop is closed and customers come, the penalty increases by 1

Return the earliest hour at which the shop must be closed to incur a minimum penalty.

**Note:** If a shop closes at the `j-th` hour, it means the shop is closed at the hour `j`.

**Link to problem:** [Minimum Penalty For A Shop - LeetCode 2373](https://leetcode.com/problems/minimum-penalty-for-a-shop/)

## Constraints
- `1 <= customers.length <= 10^5`
- `customers` consists only of characters `'Y'` and `'N'`

---

## Pattern: Prefix Sum Optimization

This problem is a classic example of the **Prefix Sum** pattern. The key insight is that we can efficiently calculate the penalty for each closing hour by maintaining running counts.

### Core Concept

The fundamental idea is tracking two counts as we iterate:
- **N's in open hours**: Hours before closing with no customers
- **Y's in closed hours**: Hours after closing with customers

By pre-calculating total Y's and updating counts in a single pass, we can find the optimal closing hour efficiently.

---

## Examples

### Example

**Input:**
```
customers = "YYNY"
```

**Output:**
```
2
```

**Explanation:**
- Closing at 0th hour: penalty = 1 + 1 + 0 + 1 = 3
- Closing at 1st hour: penalty = 0 + 1 + 0 + 1 = 2
- Closing at 2nd hour: penalty = 0 + 0 + 0 + 1 = 1
- Closing at 3rd hour: penalty = 0 + 0 + 1 + 1 = 2
- Closing at 4th hour: penalty = 0 + 0 + 1 + 0 = 1

Closing at 2nd or 4th hour gives minimum penalty. Since 2 is earlier, the answer is 2.

### Example 2

**Input:**
```
customers = "NNNNN"
```

**Output:**
```
0
```

**Explanation:**
It is best to close the shop at the 0th hour as no customers arrive at any time.

### Example 3

**Input:**
```
customers = "YYYY"
```

**Output:**
```
4
```

**Explanation:**
It is best to close the shop at the 4th hour (end) as customers arrive at each hour.

---

## Intuition

The key insight is understanding the penalty calculation:

1. **For closing at hour j**:
   - Open hours: `0` to `j-1` (penalty = count of 'N' in this range)
   - Closed hours: `j` to `n-1` (penalty = count of 'Y' in this range)

2. **Efficient Calculation**:
   - Count total Y's initially (all are "in closed hours" if we close at 0)
   - As we move the closing hour right:
     - If current char is 'N': it moves from "closed" to "open" (penalty decreases by 1)
     - If current char is 'Y': it moves from "closed" to "open" (penalty decreases by 1)
   - Wait, actually: both decrease penalty by 1 when the hour becomes "open"

3. **Single Pass**: Instead of recalculating for each j, update incrementally.

### Why This Works

The incremental approach works because:
- When we move from hour j to j+1, the character at position j changes from "closed" to "open"
- If it's 'N': closed penalty was 1 (Y comes but shop closed), now open penalty is 1 (N but shop open) - wait, let me recalculate
- Actually: penalty = N's in open + Y's in closed
- Moving j right: 
  - 'N' at position j was in closed (penalty 1), now in open (penalty 1) - same
  - 'Y' at position j was in closed (penalty 1), now in open (penalty 0) - decreases by 1

Wait, let me think again more carefully:
- At position j, the character is being removed from the "closed" set and added to the "open" set
- If char is 'N': was contributing 1 to closed penalty, now contributes 1 to open penalty - total unchanged
- If char is 'Y': was contributing 1 to closed penalty, now contributes 0 to open penalty - total decreases by 1

So: penalty at j+1 = penalty at j - (1 if customers[j] == 'Y' else 0) + (1 if customers[j] == 'N' else 0)

Actually simpler: starting penalty = total Y's (all in closed). Each step:
- If 'N': penalty stays same (1 closed → 1 open)
- If 'Y': penalty decreases by 1 (1 closed → 0 open)

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Single Pass Prefix Sum** - Optimal O(n) time, O(1) space
2. **Brute Force** - O(n²) time, O(1) space
3. **Accumulator Array** - O(n) time, O(n) space

---

## Approach 1: Single Pass (Optimal)

This is the most efficient approach with O(1) extra space. We use the incremental calculation described above.

### Algorithm Steps

1. Count total Y's - this is the penalty if we close at hour 0
2. Iterate through each possible closing hour (0 to n):
   - Current penalty = N's seen so far + Y's remaining
   - Track minimum penalty and earliest hour
   - Update counts based on current character
3. Return the earliest hour with minimum penalty

### Why It Works

The algorithm works by recognizing that:
- The penalty can be calculated incrementally
- When moving from hour j to j+1, we know exactly how the penalty changes
- We only need to track two counts: N's before current position, Y's at/after current position

### Code Implementation

````carousel
```python
class Solution:
    def bestClosingTime(self, customers: str) -> int:
        """
        Find the earliest hour to close shop with minimum penalty.
        
        Penalty = N's in open hours + Y's in closed hours
        
        Args:
            customers: String of 'Y' (customer) and 'N' (no customer)
            
        Returns:
            Earliest hour to close with minimum penalty
        """
        n = len(customers)
        total_y = customers.count('Y')  # All Y's are "in closed" at hour 0
        
        min_penalty = float('inf')
        best_hour = 0
        
        current_n = 0   # N's in open hours (before current position)
        current_y_after = total_y  # Y's in closed hours (at/after current position)
        
        for j in range(n + 1):
            penalty = current_n + current_y_after
            if penalty < min_penalty:
                min_penalty = penalty
                best_hour = j
            
            # Move to next position
            if j < n:
                if customers[j] == 'N':
                    current_n += 1  # This N moves from closed to open
                else:  # 'Y'
                    current_y_after -= 1  # This Y moves from closed to open
        
        return best_hour
```

<!-- slide -->
```cpp
class Solution {
public:
    int bestClosingTime(string customers) {
        /**
         * Find the earliest hour to close shop with minimum penalty.
         * 
         * @param customers - String of 'Y' (customer) and 'N' (no customer)
         * @return Earliest hour to close with minimum penalty
         */
        int n = customers.length();
        int totalY = 0;
        for (char c : customers) {
            if (c == 'Y') totalY++;
        }
        
        int minPenalty = INT_MAX;
        int bestHour = 0;
        
        int currentN = 0;
        int currentYAfter = totalY;
        
        for (int j = 0; j <= n; j++) {
            int penalty = currentN + currentYAfter;
            if (penalty < minPenalty) {
                minPenalty = penalty;
                bestHour = j;
            }
            
            if (j < n) {
                if (customers[j] == 'N') {
                    currentN++;
                } else {
                    currentYAfter--;
                }
            }
        }
        
        return bestHour;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int bestClosingTime(String customers) {
        /**
         * Find the earliest hour to close shop with minimum penalty.
         * 
         * @param customers - String of 'Y' (customer) and 'N' (no customer)
         * @return Earliest hour to close with minimum penalty
         */
        int n = customers.length();
        int totalY = 0;
        for (char c : customers.toCharArray()) {
            if (c == 'Y') totalY++;
        }
        
        int minPenalty = Integer.MAX_VALUE;
        int bestHour = 0;
        
        int currentN = 0;
        int currentYAfter = totalY;
        
        for (int j = 0; j <= n; j++) {
            int penalty = currentN + currentYAfter;
            if (penalty < minPenalty) {
                minPenalty = penalty;
                bestHour = j;
            }
            
            if (j < n) {
                if (customers.charAt(j) == 'N') {
                    currentN++;
                } else {
                    currentYAfter--;
                }
            }
        }
        
        return bestHour;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the earliest hour to close shop with minimum penalty.
 * 
 * @param {string} customers - String of 'Y' (customer) and 'N' (no customer)
 * @return {number} - Earliest hour to close with minimum penalty
 */
var bestClosingTime = function(customers) {
    const n = customers.length;
    let totalY = 0;
    for (const c of customers) {
        if (c === 'Y') totalY++;
    }
    
    let minPenalty = Infinity;
    let bestHour = 0;
    
    let currentN = 0;
    let currentYAfter = totalY;
    
    for (let j = 0; j <= n; j++) {
        const penalty = currentN + currentYAfter;
        if (penalty < minPenalty) {
            minPenalty = penalty;
            bestHour = j;
        }
        
        if (j < n) {
            if (customers[j] === 'N') {
                currentN++;
            } else {
                currentYAfter--;
            }
        }
    }
    
    return bestHour;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the string |
| **Space** | O(1) - Only a few integer variables |

---

## Approach 2: Brute Force

This approach calculates the penalty for each possible closing hour independently.

### Algorithm Steps

1. For each hour j from 0 to n:
   - Count 'N' in customers[0:j] (open hours)
   - Count 'Y' in customers[j:n] (closed hours)
   - Calculate total penalty
2. Track minimum penalty and earliest hour
3. Return earliest hour with minimum penalty

### Code Implementation

````carousel
```python
class Solution:
    def bestClosingTime_bruteforce(self, customers: str) -> int:
        """
        Find optimal closing time using brute force.
        
        Args:
            customers: String of 'Y' and 'N'
            
        Returns:
            Earliest hour with minimum penalty
        """
        n = len(customers)
        min_penalty = float('inf')
        best_hour = 0
        
        for j in range(n + 1):
            # N's in open hours (0 to j-1)
            open_penalty = customers[:j].count('N')
            # Y's in closed hours (j to n-1)
            closed_penalty = customers[j:].count('Y')
            penalty = open_penalty + closed_penalty
            
            if penalty < min_penalty:
                min_penalty = penalty
                best_hour = j
        
        return best_hour
```

<!-- slide -->
```cpp
class Solution {
public:
    int bestClosingTime(string customers) {
        int n = customers.length();
        int minPenalty = INT_MAX;
        int bestHour = 0;
        
        for (int j = 0; j <= n; j++) {
            int openPenalty = 0, closedPenalty = 0;
            
            for (int i = 0; i < j; i++) {
                if (customers[i] == 'N') openPenalty++;
            }
            
            for (int i = j; i < n; i++) {
                if (customers[i] == 'Y') closedPenalty++;
            }
            
            int penalty = openPenalty + closedPenalty;
            if (penalty < minPenalty) {
                minPenalty = penalty;
                bestHour = j;
            }
        }
        
        return bestHour;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int bestClosingTime(String customers) {
        int n = customers.length();
        int minPenalty = Integer.MAX_VALUE;
        int bestHour = 0;
        
        for (int j = 0; j <= n; j++) {
            int openPenalty = 0, closedPenalty = 0;
            
            for (int i = 0; i < j; i++) {
                if (customers.charAt(i) == 'N') openPenalty++;
            }
            
            for (int i = j; i < n; i++) {
                if (customers.charAt(i) == 'Y') closedPenalty++;
            }
            
            int penalty = openPenalty + closedPenalty;
            if (penalty < minPenalty) {
                minPenalty = penalty;
                bestHour = j;
            }
        }
        
        return bestHour;
    }
}
```

<!-- slide -->
```javascript
var bestClosingTime = function(customers) {
    const n = customers.length;
    let minPenalty = Infinity;
    let bestHour = 0;
    
    for (let j = 0; j <= n; j++) {
        const openPenalty = customers.slice(0, j).split('').filter(c => c === 'N').length;
        const closedPenalty = customers.slice(j).split('').filter(c => c === 'Y').length;
        const penalty = openPenalty + closedPenalty;
        
        if (penalty < minPenalty) {
            minPenalty = penalty;
            bestHour = j;
        }
    }
    
    return bestHour;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - For each of n+1 positions, count in two ranges |
| **Space** | O(1) - No extra space needed |

---

## Approach 3: Prefix Sum Array

Precompute prefix sums for efficient range queries.

### Code Implementation

````carousel
```python
class Solution:
    def bestClosingTime_prefix(self, customers: str) -> int:
        """
        Using prefix sums for O(1) range queries.
        """
        n = len(customers)
        
        # Prefix sum of Y's: prefixY[i] = Y's in customers[0:i]
        prefix_y = [0] * (n + 1)
        for i in range(n):
            prefix_y[i + 1] = prefix_y[i] + (1 if customers[i] == 'Y' else 0)
        
        # Total Y's
        total_y = prefix_y[n]
        
        min_penalty = float('inf')
        best_hour = 0
        
        for j in range(n + 1):
            # N's in [0, j) = (j - Y's in [0, j)) = j - prefix_y[j]
            open_penalty = j - prefix_y[j]
            # Y's in [j, n) = total_y - prefix_y[j]
            closed_penalty = total_y - prefix_y[j]
            penalty = open_penalty + closed_penalty
            
            if penalty < min_penalty:
                min_penalty = penalty
                best_hour = j
        
        return best_hour
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Build prefix array + single pass |
| **Space** | O(n) - Prefix array |

---

## Comparison of Approaches

| Aspect | Single Pass | Brute Force | Prefix Sum |
|--------|-------------|-------------|------------|
| **Time Complexity** | O(n) | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Implementation** | Moderate | Simple | Moderate |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |

**Best Approach:** The single pass approach is optimal with O(n) time and O(1) space complexity.

---

## Why Single Pass is Optimal for This Problem

The single pass approach is optimal because:

1. **Linear Time**: Each character is visited exactly once
2. **Constant Space**: Only a few integer variables used
3. **Incremental Calculation**: Leverages the relationship between consecutive hours
4. **No Redundant Work**: Doesn't recalculate already known information
5. **Elegant**: Beautiful use of incremental reasoning

The key insight is recognizing that penalty changes predictably when moving the closing hour.

---

## Related Problems

Based on similar themes (prefix sums, sliding window optimization):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find Pivot Index | [Link](https://leetcode.com/problems/find-pivot-index/) | Similar left-right sum comparison |
| Minimum Number of Swaps to Make the String Balanced | [Link](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/) | Another optimization problem |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Ways to Arrive at Destination | [Link](https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/) | Path counting with constraints |
| Best Time to Buy and Sell Stock II | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Greedy optimization |

### Pattern Reference

For more detailed explanations of the Prefix Sum pattern, see:
- **[Prefix Sum Pattern](/algorithms/prefix-sum)** - Comprehensive guide

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Problem Explanation

- [NeetCode - Minimum Penalty for a Shop](https://www.youtube.com/watch?v=hubGhGKkXGk) - Clear explanation
- [Problem Walkthrough](https://www.youtube.com/watch?v=qH0bgiMuj9U) - Step-by-step solution
- [LeetCode Official](https://www.youtube.com/watch?v=3Q_o3J3qGiY) - Official solution

### Related Concepts

- [Prefix Sum Technique](https://www.youtube.com/watch?v=9D3bJtz9jXw) - Understanding prefix sums
- [Sliding Window Optimization](https://www.youtube.com/watch?v=9D3bJtz9jXw) - Similar optimization patterns

---

## Follow-up Questions

### Q1: What if there are multiple hours with the same minimum penalty?

**Answer:** Return the earliest hour. Our algorithm naturally finds this by only updating when we find a strictly smaller penalty.

---

### Q2: How would you modify the solution to return all optimal hours?

**Answer:** Track all hours where penalty equals the minimum, instead of just the earliest. Use a list to collect all optimal hours.

---

### Q3: What if the penalty weights for 'N' and 'Y' were different?

**Answer:** Modify the penalty calculation: penalty = weightN * N_count + weightY * Y_count. The incremental update logic changes accordingly.

---

### Q4: How would you handle this if customers came in waves (multiple per hour)?

**Answer:** Replace the string with an array of integers representing customer count per hour. The penalty becomes: sum of 0s in open + sum of counts in closed.

---

### Q5: What if the shop could close and reopen multiple times?

**Answer:** This becomes a more complex optimization problem, potentially requiring dynamic programming to find the best schedule.

---

### Q6: What edge cases should be tested?

**Answer:**
- All 'N': answer should be 0
- All 'Y': answer should be n (close at end)
- Empty string: not allowed by constraints (min length 1)
- Single character: either 0 or 1 depending on 'N' or 'Y'
- Alternating 'NYNY...': multiple optimal points

---

## Common Pitfalls

### 1. Off-by-One Error
**Issue**: Confusing open/closed hour ranges.

**Solution**: Remember that closing at hour j means:
- Open: indices [0, j-1]
- Closed: indices [j, n-1]

### 2. Initial Penalty Calculation
**Issue**: Starting with wrong initial penalty value.

**Solution**: At hour 0, all hours are closed, so initial penalty = count of 'Y' (total Y's).

### 3. Loop Range
**Issue**: Not iterating to n (inclusive).

**Solution**: The closing hour can be n (after all hours), so loop from 0 to n inclusive (n+1 iterations).

### 4. Update Order
**Issue**: Updating counts before checking penalty.

**Solution**: Always check penalty for current j first, then update counts for next position.

### 5. Integer Overflow
**Issue**: Not using appropriate integer types.

**Solution**: Python handles big integers, but in other languages use long/int64 for large inputs.

---

## Summary

The **Minimum Penalty For A Shop** problem demonstrates the power of incremental calculation:

- **Single Pass**: Optimal with O(n) time and O(1) space
- **Brute Force**: Simple but O(n²) time
- **Prefix Sum**: Efficient but O(n) space

The key insight is recognizing that the penalty can be updated incrementally when moving the closing hour, making a single pass solution possible.

This problem is an excellent example of how understanding the problem structure can lead to elegant O(n) solutions from seemingly O(n²) problems.

### Pattern Summary

This problem exemplifies the **Prefix Sum** pattern, which is characterized by:
- Incremental calculation of running totals
- Efficient range sum queries
- Single-pass optimization
- O(1) space solutions for certain problems

For more details on this pattern and its variations, see the **[Prefix Sum Pattern](/algorithms/prefix-sum)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-penalty-for-a-shop/discuss/) - Community solutions
- [Prefix Sum - GeeksforGeeks](https://www.geeksforgeeks.org/prefix-sum-technique/) - Detailed explanation
- [Pattern: Prefix Sum](/algorithms/prefix-sum) - Comprehensive guide
