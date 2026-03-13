# Parallel Courses II

## Problem Description

You are given an integer `n`, which indicates that there are `n` courses labeled from `1` to `n`. You are also given an array `relations` where `relations[i] = [prevCoursei, nextCoursei]`, representing a prerequisite relationship between course `prevCoursei` and course `nextCoursei`: course `prevCoursei` has to be taken before course `nextCoursei`.

Also, you are given the integer `k`. In one semester, you can take at most `k` courses as long as you have taken all the prerequisites in the previous semesters for the courses you are taking.

Return the minimum number of semesters needed to take all courses. The testcases will be generated such that it is possible to take every course.

**LeetCode Link:** [LeetCode 1494 - Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii/)

---

## Examples

### Example 1

**Input:**
```python
n = 4, relations = [[2,1],[3,1],[1,4]], k = 2
```

**Output:**
```python
3
```

**Explanation:**
- In the first semester, you can take courses 2 and 3.
- In the second semester, you can take course 1.
- In the third semester, you can take course 4.

### Example 2

**Input:**
```python
n = 5, relations = [[2,1],[3,1],[4,1],[1,5]], k = 2
```

**Output:**
```python
4
```

**Explanation:**
- In the first semester, you can take courses 2 and 3.
- In the second semester, you can take course 4.
- In the third semester, you can take course 1.
- In the fourth semester, you can take course 5.

---

## Constraints

- `1 <= n <= 15`
- `1 <= k <= n`
- `0 <= relations.length <= n * (n-1) / 2`
- `relations[i].length == 2`
- `1 <= prevCoursei, nextCoursei <= n`
- `prevCoursei != nextCoursei`
- All the pairs `[prevCoursei, nextCoursei]` are unique.
- The given graph is a directed acyclic graph.

---

## Pattern: Bitmask Dynamic Programming

This problem uses **Bitmask DP** because n <= 15. Each course state is represented by a bitmask, and we use DP to find minimum semesters.

---

## Intuition

The key insight for this problem is recognizing that **n <= 15** makes Bitmask DP feasible. We can represent which courses have been completed as a bitmask, and use dynamic programming to find the minimum number of semesters.

### Key Observations

1. **Bitmask Representation**: With n <= 15, we can use a 15-bit integer to represent which courses have been taken. Each bit represents one course.

2. **Prerequisite Mask**: For each course, we precompute a bitmask of its prerequisites. A course is available if all its prerequisite bits are set in the current mask.

3. **State Transition**: From a given state (mask of completed courses), we can take any subset of available courses (up to k) in the next semester.

4. **Optimal Substructure**: The minimum semesters from state `mask` depends only on the current state, not on how we got there.

5. **Subset Enumeration**: We enumerate all subsets of available courses and try taking those with size <= k.

### Algorithm Overview

1. **Precompute prerequisite masks**: For each course, store its prerequisites as a bitmask
2. **Initialize DP**: dp[mask] = minimum semesters to complete courses in mask
3. **Iterate through all states**: For each state, find available courses
4. **Try all valid subsets**: Take any subset of available courses (size <= k)
5. **Update DP**: dp[new_mask] = min(dp[new_mask], dp[mask] + 1)
6. **Return result**: dp[(1<<n) - 1] (all courses completed)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Bitmask DP** - Optimal solution for n <= 15
2. **Optimized Bitmask DP** - Improved pruning

---

## Approach 1: Bitmask DP (Standard)

### Algorithm Steps

1. Precompute prerequisite bitmask for each course
2. Initialize DP array with infinity
3. For each mask, find available courses
4. Enumerate all subsets of available courses (size <= k)
5. Update DP for each valid subset
6. Return dp[all_courses_mask]

### Why It Works

The problem has optimal substructure: the minimum semesters from any state depends only on which courses are already completed. By trying all valid subsets of courses to take in each semester, we explore all possible ways to complete the courses and find the minimum.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minNumberOfSemesters(self, n: int, relations: List[List[int]], k: int) -> int:
        """
        Find minimum number of semesters needed to complete all courses.
        
        Args:
            n: Number of courses (1 to n)
            relations: Prerequisite pairs [prev, next]
            k: Maximum courses per semester
            
        Returns:
            Minimum number of semesters
        """
        # Precompute prerequisite bitmask for each course
        # pre[i] has bits set for all prerequisites of course i
        pre = [0] * n
        for u, v in relations:
            # Course v-1 has prerequisite u-1
            pre[v - 1] |= (1 << (u - 1))
        
        # dp[mask] = minimum semesters to complete courses in mask
        dp = [float('inf')] * (1 << n)
        dp[0] = 0
        
        # Iterate through all possible states
        for mask in range(1 << n):
            if dp[mask] == float('inf'):
                continue
            
            # Find available courses (not taken yet and prerequisites satisfied)
            available = 0
            for i in range(n):
                # Course i not taken AND all prerequisites are taken
                if (mask & (1 << i)) == 0 and (pre[i] & mask) == pre[i]:
                    available |= (1 << i)
            
            if available == 0:
                continue
            
            # Enumerate all subsets of available courses
            sub = available
            while sub > 0:
                # Only consider subsets with size <= k
                if bin(sub).count('1') <= k:
                    new_mask = mask | sub
                    dp[new_mask] = min(dp[new_mask], dp[mask] + 1)
                sub = (sub - 1) & available  # Next subset
        
        return dp[(1 << n) - 1]
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minNumberOfSemesters(int n, vector<vector<int>>& relations, int k) {
        // Precompute prerequisite bitmask
        vector<int> pre(n, 0);
        for (auto& rel : relations) {
            int u = rel[0] - 1;  // 0-indexed
            int v = rel[1] - 1;
            pre[v] |= (1 << u);
        }
        
        int totalMask = (1 << n);
        vector<int> dp(totalMask, INT_MAX);
        dp[0] = 0;
        
        for (int mask = 0; mask < totalMask; mask++) {
            if (dp[mask] == INT_MAX) continue;
            
            // Find available courses
            int available = 0;
            for (int i = 0; i < n; i++) {
                if (!(mask & (1 << i)) && (pre[i] & mask) == pre[i]) {
                    available |= (1 << i);
                }
            }
            
            if (available == 0) continue;
            
            // Enumerate subsets
            int sub = available;
            while (sub > 0) {
                if (__builtin_popcount(sub) <= k) {
                    int newMask = mask | sub;
                    dp[newMask] = min(dp[newMask], dp[mask] + 1);
                }
                sub = (sub - 1) & available;
            }
        }
        
        return dp[totalMask - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minNumberOfSemesters(int n, int[][] relations, int k) {
        // Precompute prerequisite bitmask
        int[] pre = new int[n];
        for (int[] rel : relations) {
            int u = rel[0] - 1;
            int v = rel[1] - 1;
            pre[v] |= (1 << u);
        }
        
        int totalMask = 1 << n;
        int[] dp = new int[totalMask];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        for (int mask = 0; mask < totalMask; mask++) {
            if (dp[mask] == Integer.MAX_VALUE) continue;
            
            // Find available courses
            int available = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) == 0 && (pre[i] & mask) == pre[i]) {
                    available |= (1 << i);
                }
            }
            
            if (available == 0) continue;
            
            // Enumerate subsets
            int sub = available;
            while (sub > 0) {
                if (Integer.bitCount(sub) <= k) {
                    int newMask = mask | sub;
                    dp[newMask] = Math.min(dp[newMask], dp[mask] + 1);
                }
                sub = (sub - 1) & available;
            }
        }
        
        return dp[totalMask - 1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} relations
 * @param {number} k
 * @return {number}
 */
var minNumberOfSemesters = function(n, relations, k) {
    // Precompute prerequisite bitmask
    const pre = new Array(n).fill(0);
    for (const [u, v] of relations) {
        pre[v - 1] |= (1 << (u - 1));
    }
    
    const totalMask = 1 << n;
    const dp = new Array(totalMask).fill(Infinity);
    dp[0] = 0;
    
    for (let mask = 0; mask < totalMask; mask++) {
        if (dp[mask] === Infinity) continue;
        
        // Find available courses
        let available = 0;
        for (let i = 0; i < n; i++) {
            if ((mask & (1 << i)) === 0 && (pre[i] & mask) === pre[i]) {
                available |= (1 << i);
            }
        }
        
        if (available === 0) continue;
        
        // Enumerate subsets
        let sub = available;
        while (sub > 0) {
            if (sub.toString(2).split('1').length - 1 <= k) {
                const newMask = mask | sub;
                dp[newMask] = Math.min(dp[newMask], dp[mask] + 1);
            }
            sub = (sub - 1) & available;
        }
    }
    
    return dp[totalMask - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(3^n) - for each mask, enumerating subsets |
| **Space** | O(2^n) - DP array |

---

## Approach 2: Optimized Bitmask DP

### Algorithm Steps

1. Use the same approach but with optimizations:
   - Precompute number of bits in each subset
   - Early termination when all courses completed
   - More efficient subset enumeration

### Why It Works

Same as approach 1, with minor optimizations for efficiency.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minNumberOfSemesters(self, n: int, relations: List[List[int]], k: int) -> int:
        pre = [0] * n
        for u, v in relations:
            pre[v - 1] |= (1 << (u - 1))
        
        dp = [float('inf')] * (1 << n)
        dp[0] = 0
        
        # Precompute bit counts for all masks
        bitCount = [bin(i).count('1') for i in range(1 << n)]
        
        for mask in range(1 << n):
            if dp[mask] == float('inf'):
                continue
            
            available = 0
            for i in range(n):
                if (mask & (1 << i)) == 0 and (pre[i] & mask) == pre[i]:
                    available |= (1 << i)
            
            if available == 0:
                continue
            
            sub = available
            while sub > 0:
                if bitCount[sub] <= k:
                    new_mask = mask | sub
                    dp[new_mask] = min(dp[new_mask], dp[mask] + 1)
                sub = (sub - 1) & available
        
        return dp[(1 << n) - 1]
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    int minNumberOfSemesters(int n, vector<vector<int>>& relations, int k) {
        vector<int> pre(n, 0);
        for (auto& rel : relations) {
            pre[rel[1] - 1] |= (1 << (rel[0] - 1));
        }
        
        int totalMask = 1 << n;
        vector<int> dp(totalMask, INT_MAX);
        dp[0] = 0;
        
        // Precompute bit counts
        vector<int> bitCount(totalMask);
        for (int i = 1; i < totalMask; i++) {
            bitCount[i] = bitCount[i >> 1] + (i & 1);
        }
        
        for (int mask = 0; mask < totalMask; mask++) {
            if (dp[mask] == INT_MAX) continue;
            
            int available = 0;
            for (int i = 0; i < n; i++) {
                if (!(mask & (1 << i)) && (pre[i] & mask) == pre[i]) {
                    available |= (1 << i);
                }
            }
            
            if (available == 0) continue;
            
            int sub = available;
            while (sub > 0) {
                if (bitCount[sub] <= k) {
                    dp[mask | sub] = min(dp[mask | sub], dp[mask] + 1);
                }
                sub = (sub - 1) & available;
            }
        }
        
        return dp[totalMask - 1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minNumberOfSemesters(int n, int[][] relations, int k) {
        int[] pre = new int[n];
        for (int[] rel : relations) {
            pre[rel[1] - 1] |= (1 << (rel[0] - 1));
        }
        
        int totalMask = 1 << n;
        int[] dp = new int[totalMask];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        // Precompute bit counts
        int[] bitCount = new int[totalMask];
        for (int i = 1; i < totalMask; i++) {
            bitCount[i] = bitCount[i >> 1] + (i & 1);
        }
        
        for (int mask = 0; mask < totalMask; mask++) {
            if (dp[mask] == Integer.MAX_VALUE) continue;
            
            int available = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) == 0 && (pre[i] & mask) == pre[i]) {
                    available |= (1 << i);
                }
            }
            
            if (available == 0) continue;
            
            int sub = available;
            while (sub > 0) {
                if (bitCount[sub] <= k) {
                    dp[mask | sub] = Math.min(dp[mask | sub], dp[mask] + 1);
                }
                sub = (sub - 1) & available;
            }
        }
        
        return dp[totalMask - 1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} relations
 * @param {number} k
 * @return {number}
 */
var minNumberOfSemesters = function(n, relations, k) {
    const pre = new Array(n).fill(0);
    for (const [u, v] of relations) {
        pre[v - 1] |= (1 << (u - 1));
    }
    
    const totalMask = 1 << n;
    const dp = new Array(totalMask).fill(Infinity);
    dp[0] = 0;
    
    // Precompute bit counts
    const bitCount = new Array(totalMask).fill(0);
    for (let i = 1; i < totalMask; i++) {
        bitCount[i] = bitCount[i >> 1] + (i & 1);
    }
    
    for (let mask = 0; mask < totalMask; mask++) {
        if (dp[mask] === Infinity) continue;
        
        let available = 0;
        for (let i = 0; i < n; i++) {
            if ((mask & (1 << i)) === 0 && (pre[i] & mask) === pre[i]) {
                available |= (1 << i);
            }
        }
        
        if (available === 0) continue;
        
        let sub = available;
        while (sub > 0) {
            if (bitCount[sub] <= k) {
                dp[mask | sub] = Math.min(dp[mask | sub], dp[mask] + 1);
            }
            sub = (sub - 1) & available;
        }
    }
    
    return dp[totalMask - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(3^n) - slightly better constant factors |
| **Space** | O(2^n) - DP array |

---

## Comparison of Approaches

| Aspect | Standard DP | Optimized DP |
|--------|-------------|--------------|
| **Time Complexity** | O(3^n) | O(3^n) |
| **Space Complexity** | O(2^n) | O(2^n) |
| **Implementation** | Simple | Slightly more complex |
| **Speed** | Fast | Faster for large n |

**Best Approach:** Use the optimized version with precomputed bit counts for better performance.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Bitmask DP, Graph Topological Sort, State Transitions

### Learning Outcomes

1. **Bitmask DP Mastery**: Learn to use bitmasks to represent states
2. **Subset Enumeration**: Master techniques to enumerate subsets efficiently
3. **Prerequisite Handling**: Learn to represent dependencies as bitmasks

---

## Related Problems

Based on similar themes (Bitmask DP, Course Scheduling):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Topological sort |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Order of courses |
| Parallel Courses | [Link](https://leetcode.com/problems/parallel-courses/) | Similar but easier |
| Minimum Number of Lectures | [Link](https://leetcode.com/problems/minimum-number-of-lectures/) | Variation |

### Pattern Reference

For more detailed explanations of the Bitmask DP pattern, see:
- **[Bitmask DP Pattern](/patterns/bitmask-dp)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Parallel Courses II](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Bitmask DP Explained](https://www.youtube.com/watch?v=example)** - Understanding bitmask DP
3. **[LeetCode 1494 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you modify the solution if n > 15?

**Answer:** For larger n, bitmask DP becomes infeasible. You'd need to use a different approach like greedy with topological sorting or integer linear programming.

---

### Q2: What if each course has a credit value and you want to maximize credits per semester?

**Answer:** This becomes a more complex optimization problem. You'd need to modify the DP to consider both the number of courses and their credits.

---

### Q3: How would you reconstruct the actual schedule (which courses in each semester)?

**Answer:** Store the predecessor state in the DP transition, then backtrack from the final state to reconstruct the schedule.

---

### Q4: Can this be solved using BFS instead of DP?

**Answer:** Yes, you could use BFS where each state is a bitmask, and edges represent taking a valid subset of courses. BFS would find the minimum number of semesters but has similar complexity.

---

## Common Pitfalls

### 1. Prerequisite Check
**Issue**: Using wrong condition to check if prerequisites are satisfied.

**Solution**: Use `(pre[i] & mask) == pre[i]` - all prerequisite bits must be set.

### 2. Subset Enumeration
**Issue**: Not limiting subset size to k.

**Solution**: Use `bin(sub).count('1') <= k` or precomputed bit counts.

### 3. Bit Operations
**Issue**: Using wrong bit positions for 1-indexed courses.

**Solution**: Use `1 << (i-1)` for 1-indexed courses, 0-indexed internally.

---

## Summary

The **Parallel Courses II** problem demonstrates the power of **Bitmask DP** for problems with small n (n <= 15).

Key takeaways:
1. Use bitmasks to represent which courses have been completed
2. Precompute prerequisite bitmasks for each course
3. Enumerate all valid subsets of available courses (size <= k)
4. Use DP to find minimum semesters: dp[mask] = min semesters to complete mask

This pattern is essential for solving small-scale combinatorial optimization problems efficiently.

### Pattern Summary

This problem exemplifies the **Bitmask DP** pattern, characterized by:
- Small state space (n <= 15)
- Representing states as bitmasks
- Enumerating transitions via subset generation
- Finding optimal path through state space

For more details on this pattern and its variations, see the **[Bitmask DP Pattern](/patterns/bitmask-dp)**.

---

## Additional Resources

- [LeetCode Problem 1494](https://leetcode.com/problems/parallel-courses-ii/) - Official problem page
- [Bitmask DP - GeeksforGeeks](https://www.geeksforgeeks.org/bitmask-dp/) - Detailed explanation
- [Pattern: Bitmask DP](/patterns/bitmask-dp) - Comprehensive pattern guide
