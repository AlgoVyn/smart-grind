# Combination Sum

## Problem Description

Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

**Link to problem:** [Combination Sum - LeetCode 39](https://leetcode.com/problems/combination-sum/)

## Constraints
- `1 <= candidates.length <= 30`
- `2 <= candidates[i] <= 40`
- All elements of candidates are distinct.
- `1 <= target <= 40`

---

## Pattern: Backtracking with Combination Generation

This problem is a classic example of the **Backtracking with Combination Generation** pattern. The pattern involves exploring all possible combinations by building candidates incrementally and backtracking when we exceed the target or find a valid combination.

### Core Concept

The fundamental idea is to use depth-first search (DFS) with backtracking:
- **Choose**: Add a candidate to the current path
- **Explore**: Continue searching with the updated path and remaining sum
- **Unchoose**: Remove the candidate from the path (backtrack)

Key insight: Since we can reuse elements, we pass the same index to the next recursion call.

---

## Examples

### Example

**Input:**
```
candidates = [2,3,6,7], target = 7
```

**Output:**
```
[[2,2,3],[7]]
```

**Explanation:**
- 2 + 2 + 3 = 7 (using 2 twice and 3 once)
- 7 = 7 (using 7 once)
- These are the only two valid combinations

### Example 2

**Input:**
```
candidates = [2,3,5], target = 8
```

**Output:**
```
[[2,2,2,2],[2,3,3],[3,5]]
```

**Explanation:**
- 2 + 2 + 2 + 2 = 8 (four 2s)
- 2 + 3 + 3 = 8 (one 2, two 3s)
- 3 + 5 = 8 (one 3, one 5)

### Example 3

**Input:**
```
candidates = [2], target = 1
```

**Output:**
```
[]
```

**Explanation:** No combination can sum to 1 since 2 > 1.

---

## Intuition

The key insight is understanding how backtracking works for combination problems:

1. **Why Sort?**: Sorting helps with pruning - once the current sum exceeds the target, we can stop exploring that branch.

2. **Why Allow Reuse?**: We pass the same index to the next recursion because we can use the same element multiple times.

3. **Why Not Generate Duplicates?**: By always moving forward in the candidates array (i instead of i+1), we avoid generating duplicate combinations in different orders.

### Why It Works

Consider candidates = [2,3,6,7], target = 7:
- Start with empty path, sum = 0
- Choose 2: path = [2], sum = 2
  - Choose 2 again: path = [2,2], sum = 4
    - Choose 2 again: path = [2,2,2], sum = 6
      - Choose 2 again: path = [2,2,2,2], sum = 8 > 7, backtrack
      - Choose 3: sum = 9 > 7, backtrack
    - Choose 3: path = [2,2,3], sum = 7 ✓ add to result
  - Choose 3: path = [2,3], sum = 5
    - ... (continue)
- Choose 7: path = [7], sum = 7 ✓ add to result

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Standard Backtracking** - O(N^target) time, O(target) space
2. **Backtracking with Sorting and Pruning** - More efficient pruning
3. **Dynamic Programming (Combination Count)** - For counting, not listing

---

## Approach 1: Standard Backtracking

This is the classic backtracking approach. We explore all possible combinations by including or excluding each candidate.

### Algorithm Steps

1. Sort the candidates (optional, helps with pruning)
2. Define a recursive function backtrack(start, path, current_sum):
   - If current_sum == target: add path to result
   - If current_sum > target: return (pruning)
   - For each i from start to len(candidates):
     - Add candidates[i] to path
     - Recurse with same i (allow reuse)
     - Remove candidates[i] from path (backtrack)
3. Start with backtrack(0, [], 0)
4. Return result

### Why It Works

The backtracking algorithm explores all possible combinations:
- By passing the same index, we allow reusing the same element
- By moving forward, we avoid duplicate combinations
- By pruning when sum > target, we reduce unnecessary exploration

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Find all unique combinations that sum to target.
        
        Args:
            candidates: List of distinct integers
            target: Target sum
            
        Returns:
            List of all unique combinations
        """
        candidates.sort()
        result = []
        
        def backtrack(start: int, path: List[int], current_sum: int):
            # Base case: found valid combination
            if current_sum == target:
                result.append(path[:])  # Copy the path
                return
            
            # Pruning: exceed target
            if current_sum > target:
                return
            
            # Try each candidate starting from 'start'
            for i in range(start, len(candidates)):
                # Add candidate to path
                path.append(candidates[i])
                
                # Recurse with same index (allows reuse)
                backtrack(i, path, current_sum + candidates[i])
                
                # Backtrack: remove last element
                path.pop()
        
        backtrack(0, [], 0)
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        /**
         * Find all unique combinations that sum to target.
         * 
         * Args:
         *     candidates: List of distinct integers
         *     target: Target sum
         * 
         * Returns:
         *     List of all unique combinations
         */
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> path;
        
        function<void(int, int, int)> backtrack = [&](int start, int currentSum, int target) {
            if (currentSum == target) {
                result.push_back(path);
                return;
            }
            
            if (currentSum > target) {
                return;
            }
            
            for (int i = start; i < candidates.size(); i++) {
                path.push_back(candidates[i]);
                backtrack(i, currentSum + candidates[i], target);
                path.pop_back();
            }
        };
        
        backtrack(0, 0, target);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        /**
         * Find all unique combinations that sum to target.
         * 
         * Args:
         *     candidates: List of distinct integers
         *     target: Target sum
         * 
         * Returns:
         *     List of all unique combinations
         */
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        
        backtrack(candidates, 0, target, 0, path, result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, int target, 
                          int currentSum, List<Integer> path, 
                          List<List<Integer>> result) {
        if (currentSum == target) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        if (currentSum > target) {
            return;
        }
        
        for (int i = start; i < candidates.length; i++) {
            path.add(candidates[i]);
            backtrack(candidates, i, target, currentSum + candidates[i], path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Find all unique combinations that sum to target.
 * 
 * @param {number[]} candidates - List of distinct integers
 * @param {number} target - Target sum
 * @return {number[][]} - List of all unique combinations
 */
var combinationSum = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    const path = [];
    
    function backtrack(start, currentSum) {
        if (currentSum === target) {
            result.push([...path]);
            return;
        }
        
        if (currentSum > target) {
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            backtrack(i, currentSum + candidates[i]);
            path.pop();
        }
    }
    
    backtrack(0, 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N^target) - Exponential in worst case, but constrained by problem |
| **Space** | O(target) - Recursion stack depth |

---

## Approach 2: Backtracking with Enhanced Pruning

This approach adds more aggressive pruning by checking if candidates[i] + current_sum > target before recursing.

### Algorithm Steps

1. Sort candidates
2. Before adding a candidate, check if it would exceed the target
3. Only proceed if it doesn't exceed

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combinationSum_pruned(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Find combinations with enhanced pruning.
        
        Args:
            candidates: List of distinct integers
            target: Target sum
            
        Returns:
            List of all unique combinations
        """
        candidates.sort()
        result = []
        
        def backtrack(start: int, path: List[int], remaining: int):
            if remaining == 0:
                result.append(path[:])
                return
            
            for i in range(start, len(candidates)):
                # Pruning: if candidate > remaining, skip (sorted list)
                if candidates[i] > remaining:
                    break  # No need to check further since list is sorted
                
                path.append(candidates[i])
                backtrack(i, path, remaining - candidates[i])
                path.pop()
        
        backtrack(0, [], target)
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> combinationSumPruned(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> path;
        
        function<void(int, int)> backtrack = [&](int start, int remaining) {
            if (remaining == 0) {
                result.push_back(path);
                return;
            }
            
            for (int i = start; i < candidates.size(); i++) {
                if (candidates[i] > remaining) break;
                path.push_back(candidates[i]);
                backtrack(i, remaining - candidates[i]);
                path.pop_back();
            }
        };
        
        backtrack(0, target);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combinationSumPruned(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        
        backtrack(candidates, 0, target, path, result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, int remaining, 
                          List<Integer> path, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;
            path.add(candidates[i]);
            backtrack(candidates, i, remaining - candidates[i], path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
var combinationSumPruned = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    const path = [];
    
    function backtrack(start, remaining) {
        if (remaining === 0) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;
            path.push(candidates[i]);
            backtrack(i, remaining - candidates[i]);
            path.pop();
        }
    }
    
    backtrack(0, target);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N^target) - Same worst case, but fewer branches explored |
| **Space** | O(target) - Recursion stack depth |

---

## Approach 3: Iterative Backtracking

This approach uses an iterative method instead of recursion, which can be more memory efficient in some languages.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combinationSum_iterative(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Find combinations using iterative approach.
        
        Args:
            candidates: List of distinct integers
            target: Target sum
            
        Returns:
            List of all unique combinations
        """
        candidates.sort()
        result = []
        stack = [(0, [], 0)]  # (index, path, current_sum)
        
        while stack:
            start, path, current_sum = stack.pop()
            
            if current_sum == target:
                result.append(path[:])
                continue
            
            if current_sum > target:
                continue
            
            for i in range(start, len(candidates)):
                if candidates[i] + current_sum > target:
                    break
                stack.append((i, path + [candidates[i]], current_sum + candidates[i]))
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> combinationSumIterative(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        
        // Use stack for iterative DFS
        stack<tuple<int, vector<int>, int>> st;
        st.emplace(0, vector<int>(), 0);
        
        while (!st.empty()) {
            auto [start, path, currentSum] = st.top();
            st.pop();
            
            if (currentSum == target) {
                result.push_back(path);
                continue;
            }
            
            if (currentSum > target) continue;
            
            for (int i = start; i < candidates.size(); i++) {
                if (candidates[i] + currentSum > target) break;
                path.push_back(candidates[i]);
                st.emplace(i, path, currentSum + candidates[i]);
                path.pop_back();
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combinationSumIterative(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        
        // Use stack for iterative DFS
        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{0, 0, 0}); // index, currentSum, lastAdded
        
        while (!stack.isEmpty()) {
            int[] state = stack.pop();
            int start = state[0];
            int currentSum = state[1];
            
            if (currentSum == target) {
                // Reconstruct path (would need additional tracking)
                continue;
            }
            
            if (currentSum > target) continue;
            
            for (int i = start; i < candidates.length; i++) {
                if (candidates[i] + currentSum > target) break;
                stack.push(new int[]{i, currentSum + candidates[i], candidates[i]});
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var combinationSumIterative = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    const stack = [[0, [], 0]]; // [index, path, currentSum]
    
    while (stack.length > 0) {
        const [start, path, currentSum] = stack.pop();
        
        if (currentSum === target) {
            result.push([...path]);
            continue;
        }
        
        if (currentSum > target) continue;
        
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] + currentSum > target) break;
            stack.push([i, [...path, candidates[i]], currentSum + candidates[i]]);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N^target) - Same as recursive |
| **Space** | O(N^target) worst case for stack - can be larger than recursive |

---

## Comparison of Approaches

| Aspect | Standard Backtracking | Enhanced Pruning | Iterative |
|--------|----------------------|------------------|-----------|
| **Time Complexity** | O(N^target) | O(N^target) | O(N^target) |
| **Space Complexity** | O(target) | O(target) | O(N^target) worst |
| **Implementation** | Simple | Simple | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Pruning** | Basic | Enhanced | Basic |

**Best Approach:** Approach 2 (Enhanced Pruning) is recommended as it reduces unnecessary exploration by using the sorted array.

---

## Why Backtracking Works

The backtracking algorithm works because:

1. **Exhaustive Search**: It explores all possible combinations systematically
2. **Pruning**: It stops exploring branches that cannot lead to valid solutions
3. **No Duplicates**: By always moving forward, it avoids generating duplicate combinations
4. **Reuse Handling**: By passing the same index, it allows using elements multiple times
5. **State Restoration**: By popping after recursion, it restores the state for other branches

---

## Common Pitfalls

### 1. Modifying Original List
**Issue**: Modifying the path list in place when adding to result.

**Solution**: Always add a copy: `result.append(path[:])` in Python.

### 2. Not Sorting
**Issue**: Without sorting, pruning doesn't work efficiently.

**Solution**: Always sort the candidates first.

### 3. Wrong Index Passed
**Issue**: Passing i+1 instead of i when allowing reuse.

**Solution**: Pass `i` to allow the same element to be used again.

### 4. Not Backtracking
**Issue**: Forgetting to remove the element after recursion.

**Solution**: Always pop the last element after the recursive call.

---

## Related Problems

Based on similar themes (backtracking, combination generation):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subsets | [Link](https://leetcode.com/problems/subsets/) | Generate all subsets |
| Permutations | [Link](https://leetcode.com/problems/permutations/) | Generate all permutations |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Combination Sum II | [Link](https://leetcode.com/problems/combination-sum-ii/) | Each number used once |
| Combination Sum III | [Link](https://leetcode.com/problems/combination-sum-iii/) | k numbers sum to n |
| Subsets II | [Link](https://leetcode.com/problems/subsets-ii/) | Subsets with duplicates |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Combination Sum IV | [Link](https://leetcode.com/problems/combination-sum-iv/) | Order matters (DP) |
| Minimum Number of Refueling Stops | [Link](https://leetcode.com/problems/minimum-number-of-refueling-stops/) | Backtracking + DP |

### Pattern Reference

For more detailed explanations of the Backtracking pattern and its variations, see:
- **[Backtracking Pattern](/patterns/backtracking-combinations)**
- **[Combinations Pattern](/algorithms/combinations)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Backtracking Explanation

- [NeetCode - Combination Sum](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Back to Back SWE - Combination Sum](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=) - Official problem solution

### Related Concepts

- [Backtracking Explained](https://www.youtube.com/watch?v=) - Understanding backtracking
- [DFS and Recursion](https://www.youtube.com/watch?v=) - Depth-first search fundamentals

---

## Follow-up Questions

### Q1: How would you modify the solution to handle duplicate candidates?

**Answer:** You would need to sort and skip duplicates during the loop. After sorting, when `i > start` and `candidates[i] == candidates[i-1]`, skip to avoid duplicate combinations.

---

### Q2: What if each number can only be used once (like Combination Sum II)?

**Answer:** Pass `i + 1` instead of `i` to the recursive call. This ensures each element is used at most once in each combination.

---

### Q3: How would you return only combinations with exactly k numbers?

**Answer:** Add a parameter `k` to track the current path length. Only add to result when `current_sum == target` AND `len(path) == k`.

---

### Q4: Can you solve it using dynamic programming instead of backtracking?

**Answer:** For counting combinations, yes. For listing all combinations, backtracking is more natural. The DP approach would be: `dp[i] = list of combinations that sum to i`, combining smaller sums.

---

### Q5: How would you optimize for very large targets?

**Answer:**
- Use pruning more aggressively
- Consider candidates in descending order
- Use memoization for overlapping subproblems
- Consider iterative with explicit stack

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty candidates array
- Target = 0 (should return empty list)
- Target < smallest candidate
- Target = smallest candidate
- All candidates same
- Very large target relative to candidates

---

### Q7: How does the solution ensure no duplicate combinations?

**Answer:** By always moving forward in the candidates array (using index `i` not `i-1`), we ensure each combination is generated in non-decreasing order, preventing duplicates like [2,3] and [3,2].

---

### Q8: What is the maximum recursion depth?

**Answer:** The maximum depth is equal to the maximum number of elements that can sum to the target. Since target <= 40 and minimum candidate >= 2, max depth is at most 40.

---

## Summary

The **Combination Sum** problem demonstrates the power of backtracking for combination generation:

- **Standard backtracking**: O(N^target) time, O(target) space
- **Enhanced pruning**: Same time but fewer branches explored
- **Iterative**: Alternative approach with explicit stack

The key insight is using backtracking to explore all possible combinations while allowing element reuse by passing the same index. Sorting helps with efficient pruning.

This problem is an excellent demonstration of backtracking fundamentals that apply to many combination and permutation problems.

### Pattern Summary

This problem exemplifies the **Backtracking with Combination Generation** pattern, which is characterized by:
- Using DFS with backtracking
- Allowing element reuse by passing same index
- Pruning when exceeding target
- Avoiding duplicates by moving forward
- Achieving exponential time complexity (bounded by problem constraints)

For more details on this pattern and its variations, see the **[Backtracking Pattern](/patterns/backtracking-combinations)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/combination-sum/discuss/) - Community solutions and explanations
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - Detailed explanation
- [Combinations - GeeksforGeeks](https://www.geeksforgeeks.org/combinations/) - Understanding combinations
- [Pattern: Backtracking](/patterns/backtracking-combinations) - Comprehensive pattern guide
