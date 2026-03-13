# Combination Sum II

## Problem Description

Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target.
Each number in candidates may only be used once in the combination.
Note: The solution set must not contain duplicate combinations.

**Link to problem:** [Combination Sum II - LeetCode 40](https://leetcode.com/problems/combination-sum-ii/)

---

## Pattern: Backtracking - Combination Sum with Duplicates

This problem exemplifies the **Backtracking - Combination Sum with Duplicates** pattern. The key challenge is handling duplicate numbers in the candidates array while avoiding duplicate combinations.

### Core Concept

The key differences from Combination Sum I:
1. **Each number can be used at most once**
2. **Candidates may contain duplicates**
3. **Must avoid duplicate combinations**

The solution uses sorting + backtracking + skip duplicates pattern.

---

## Examples

### Example

**Input:**
```
candidates = [10,1,2,7,6,1,5], target = 8
```

**Output:**
```
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

**Explanation:** 
- Sort: [1,1,2,5,6,7]
- Combinations that sum to 8:
  - 1 + 1 + 6 = 8
  - 1 + 2 + 5 = 8
  - 1 + 7 = 8
  - 2 + 6 = 8

### Example 2

**Input:**
```
candidates = [2,5,2,1,2], target = 5
```

**Output:**
```
[
[1,2,2],
[5]
]
```

**Explanation:**
- Sort: [1,2,2,2,5]
- Combinations that sum to 5:
  - 1 + 2 + 2 = 5
  - 5 = 5

---

## Constraints

- `1 <= candidates.length <= 100`
- `1 <= candidates[i] <= 50`
- `1 <= target <= 30`

---

## Intuition

The key insights are:

1. **Sorting**: Sorting helps with duplicate handling and enables pruning

2. **Skip Duplicates**: When we have duplicates, we need to skip consecutive duplicates at the same recursion level to avoid duplicate combinations

3. **Use Once**: Each element can be used at most once, so after choosing an element, we move to `index + 1`

4. **Pruning**: If current sum exceeds target, we can stop (since array is sorted)

### Visual Example

For `candidates = [1,1,2,5,6,7]` and `target = 8`:

```
Level 0: []
  ├── Choose 1 (index 0): sum=1
  │   ├── Choose 1 (index 1): sum=2 → skip 1 (duplicate at same level)
  │   ├── Choose 2 (index 2): sum=3 → ...
  │   ├── Choose 5 (index 3): sum=6 → ...
  │   └── Choose 6 (index 4): sum=7 → ...
  ├── Skip 1 (index 1) - duplicate!
  ├── Choose 2 (index 2): sum=2 → ...
  └── ...

Key: At each level, skip duplicates to avoid duplicates in result
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Backtracking with Skip Duplicates (Optimal)** - O(2^n) time, O(n) space
2. **Backtracking with Used Array** - O(2^n) time, O(n) space
3. **Iterative Generation** - O(2^n) time, O(n) space

---

## Approach 1: Backtracking with Skip Duplicates (Optimal)

This is the most efficient and standard approach.

### Algorithm Steps

1. Sort the candidates array
2. Define recursive function `backtrack(start, path, current_sum)`
3. If `current_sum == target`: add path to result
4. If `current_sum > target`: return (pruning)
5. For each i from start to len(candidates):
   - Skip duplicates: if `i > start and candidates[i] == candidates[i-1]`, continue
   - Choose candidates[i]: add to path
   - Recurse with `i + 1` (since each can be used once)
   - Backtrack: remove from path

### Why It Works

- Sorting ensures duplicates are consecutive
- Skipping at the same recursion level prevents duplicate combinations
- Each element used at most once because we pass `i + 1`

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Find all unique combinations that sum to target.
        
        Args:
            candidates: List of candidate numbers
            target: Target sum
            
        Returns:
            List of all unique combinations
        """
        candidates.sort()
        result = []
        
        def backtrack(start: int, path: List[int], current_sum: int):
            # Found valid combination
            if current_sum == target:
                result.append(path[:])
                return
            
            # Pruning: exceeded target
            if current_sum > target:
                return
            
            # Try each candidate from start position
            for i in range(start, len(candidates)):
                # Skip duplicates at the same recursion level
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                
                # Pruning: current candidate already exceeds remaining target
                if current_sum + candidates[i] > target:
                    continue
                
                # Choose current candidate
                path.append(candidates[i])
                
                # Recurse with next index (can't reuse same element)
                backtrack(i + 1, path, current_sum + candidates[i])
                
                # Backtrack
                path.pop()
        
        backtrack(0, [], 0)
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    void backtrack(const vector<int>& candidates, int target, 
                   int start, vector<int>& path, vector<vector<int>>& result) {
        // Found valid combination
        if (target == 0) {
            result.push_back(path);
            return;
        }
        
        // Try each candidate
        for (int i = start; i < candidates.size(); i++) {
            // Skip duplicates
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }
            
            // Pruning
            if (candidates[i] > target) {
                break;
            }
            
            // Choose
            path.push_back(candidates[i]);
            
            // Recurse
            backtrack(candidates, target - candidates[i], i + 1, path, result);
            
            // Backtrack
            path.pop_back();
        }
    }
    
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> path;
        backtrack(candidates, target, 0, path, result);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        
        backtrack(candidates, target, 0, path, result);
        return result;
    }
    
    private void backtrack(int[] candidates, int target, int start,
                          List<Integer> path, List<List<Integer>> result) {
        // Found valid combination
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        // Try each candidate
        for (int i = start; i < candidates.length; i++) {
            // Skip duplicates
            if (i > start && candidates[i] == candidates[i - 1]) {
                continue;
            }
            
            // Pruning
            if (candidates[i] > target) {
                break;
            }
            
            // Choose
            path.add(candidates[i]);
            
            // Recurse
            backtrack(candidates, target - candidates[i], i + 1, path, result);
            
            // Backtrack
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    
    function backtrack(start, path, currentSum) {
        // Found valid combination
        if (currentSum === target) {
            result.push([...path]);
            return;
        }
        
        // Try each candidate
        for (let i = start; i < candidates.length; i++) {
            // Skip duplicates
            if (i > start && candidates[i] === candidates[i - 1]) {
                continue;
            }
            
            // Pruning
            if (candidates[i] > target - currentSum) {
                break;
            }
            
            // Choose
            path.push(candidates[i]);
            
            // Recurse
            backtrack(i + 1, path, currentSum + candidates[i]);
            
            // Backtrack
            path.pop();
        }
    }
    
    backtrack(0, [], 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n) - Worst case explores all subsets |
| **Space** | O(n) - Recursion stack depth |

---

## Approach 2: Backtracking with Used Array

This approach uses a boolean array to track which elements have been used.

### Algorithm Steps

1. Sort the candidates
2. Use a `used` boolean array to track visited elements
3. Skip elements that are the same as previous if previous wasn't used in current path

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combinationSum2_used(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Find combinations using used array approach.
        """
        candidates.sort()
        result = []
        
        def backtrack(start: int, path: List[int], current_sum: int, used: List[bool]):
            if current_sum == target:
                result.append(path[:])
                return
            
            for i in range(start, len(candidates)):
                # Skip if used or if duplicate and previous not used
                if used[i] or (i > 0 and candidates[i] == candidates[i-1] and not used[i-1]):
                    continue
                
                if current_sum + candidates[i] > target:
                    continue
                
                used[i] = True
                path.append(candidates[i])
                backtrack(i + 1, path, current_sum + candidates[i], used)
                path.pop()
                used[i] = False
        
        backtrack(0, [], 0, [False] * len(candidates))
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
private:
    void backtrack(const vector<int>& candidates, int target, 
                   int start, vector<int>& path, vector<vector<int>>& result,
                   vector<bool>& used) {
        if (target == 0) {
            result.push_back(path);
            return;
        }
        
        for (int i = start; i < candidates.size(); i++) {
            if (used[i]) continue;
            if (i > 0 && candidates[i] == candidates[i-1] && !used[i-1]) continue;
            if (candidates[i] > target) break;
            
            used[i] = true;
            path.push_back(candidates[i]);
            backtrack(candidates, target - candidates[i], i + 1, path, result, used);
            path.pop_back();
            used[i] = false;
        }
    }
    
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> path;
        vector<bool> used(candidates.size(), false);
        backtrack(candidates, target, 0, path, result, used);
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        boolean[] used = new boolean[candidates.length];
        
        backtrack(candidates, target, 0, path, result, used);
        return result;
    }
    
    private void backtrack(int[] candidates, int target, int start,
                          List<Integer> path, List<List<Integer>> result, boolean[] used) {
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = start; i < candidates.length; i++) {
            if (used[i]) continue;
            if (i > 0 && candidates[i] == candidates[i-1] && !used[i-1]) continue;
            if (candidates[i] > target) break;
            
            used[i] = true;
            path.add(candidates[i]);
            backtrack(candidates, target - candidates[i], i + 1, path, result, used);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

<!-- slide -->
```javascript
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    const used = new Array(candidates.length).fill(false);
    
    function backtrack(start, path, currentSum) {
        if (currentSum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            if (used[i]) continue;
            if (i > 0 && candidates[i] === candidates[i-1] && !used[i-1]) continue;
            if (candidates[i] > target - currentSum) break;
            
            used[i] = true;
            path.push(candidates[i]);
            backtrack(i + 1, path, currentSum + candidates[i]);
            path.pop();
            used[i] = false;
        }
    }
    
    backtrack(0, [], 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n) - Same as approach 1 |
| **Space** | O(n) - Used array + recursion |

---

## Approach 3: Iterative Generation

This approach generates combinations iteratively.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def combinationSum2_iterative(self, candidates: List[int], target: int) -> List[List[int]]:
        """
        Find combinations using iterative approach.
        """
        candidates.sort()
        result = [[]]
        
        for i, num in enumerate(candidates):
            # Skip duplicates at the start
            if i > 0 and num == candidates[i - 1]:
                # Only use this num if it wasn't the last added from previous iteration
                continue
            
            new_results = []
            for combo in result:
                # Skip if this would create duplicate starting point
                new_sum = sum(combo) + num
                if new_sum <= target:
                    new_results.append(combo + [num])
            
            # Actually, let's use a cleaner approach
            # ...
        
        # Using set to remove duplicates
        result_set = set()
        
        for num in candidates:
            new_combos = []
            for combo in result:
                new_combo = tuple(sorted(combo + [num]))
                new_sum = sum(new_combo)
                if new_sum <= target:
                    new_combos.append(list(new_combo))
            
            for nc in new_combos:
                result_set.add(tuple(nc))
        
        return [list(x) for x in result_set]
```

<!-- slide -->
```cpp
#include <vector>
#include <set>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        set<vector<int>> result_set;
        vector<vector<int>> result = {{}};
        
        for (int i = 0; i < candidates.size(); i++) {
            // Skip duplicates at same level
            if (i > 0 && candidates[i] == candidates[i-1]) continue;
            
            vector<vector<int>> new_results;
            for (auto& combo : result) {
                int new_sum = 0;
                for (int x : combo) new_sum += x;
                new_sum += candidates[i];
                
                if (new_sum <= target) {
                    vector<int> new_combo = combo;
                    new_combo.push_back(candidates[i]);
                    new_results.push_back(new_combo);
                }
            }
            
            for (auto& nr : new_results) {
                result.push_back(nr);
            }
        }
        
        // Filter valid combinations
        vector<vector<int>> final_result;
        for (auto& combo : result) {
            int sum = 0;
            for (int x : combo) sum += x;
            if (sum == target) {
                sort(combo.begin(), combo.end());
                result_set.insert(combo);
            }
        }
        
        return vector<vector<int>>(result_set.begin(), result_set.end());
    }
};
```

<!-- slide -->
```java
// Iterative approach is more complex in Java due to set handling
// Using recursive approach is recommended
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        backtrack(candidates, target, 0, path, result);
        return result;
    }
    
    private void backtrack(int[] candidates, int target, int start,
                          List<Integer> path, List<List<Integer>> result) {
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] == candidates[i-1]) continue;
            if (candidates[i] > target) break;
            
            path.add(candidates[i]);
            backtrack(candidates, target - candidates[i], i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
// Iterative approach in JS
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    
    // Use recursive approach (recommended)
    function backtrack(start, path, currentSum) {
        if (currentSum === target) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            if (candidates[i] > target - currentSum) break;
            
            path.push(candidates[i]);
            backtrack(i + 1, path, currentSum + candidates[i]);
            path.pop();
        }
    }
    
    backtrack(0, [], 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n) - Same as recursive |
| **Space** | O(2^n) worst case for storing all combos |

---

## Comparison of Approaches

| Aspect | Skip Duplicates | Used Array | Iterative |
|--------|-----------------|------------|-----------|
| **Time Complexity** | O(2^n) | O(2^n) | O(2^n) |
| **Space Complexity** | O(n) | O(n) | O(2^n) |
| **Implementation** | Simplest | Moderate | Complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Most cases | Understanding | Rare |

**Best Approach:** The skip duplicates approach (Approach 1) is optimal with the simplest implementation.

---

## Why Skip Duplicates Works

The skip duplicates technique works because:

1. **Same level, same value**: If we have `[1, 1, 2]` and we start from index 0 choosing 1, then skip index 1 (duplicate) at the same recursion level
2. **Different levels are fine**: Choosing first 1 at level 0, then second 1 at level 1 is valid
3. **Consecutive duplicates**: After sorting, duplicates are adjacent

---

## Related Problems

### Same Pattern (Combination Sum)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Combination Sum | [Link](https://leetcode.com/problems/combination-sum/) | Medium | Unlimited uses of each number |
| Combination Sum III | [Link](https://leetcode.com/problems/combination-sum-iii/) | Medium | k numbers that sum to n |
| Combination Sum IV | [Link](https://leetcode.com/problems/combination-sum-iv/) | Medium | DP approach |

### Similar Backtracking Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subsets II | [Link](https://leetcode.com/problems/subsets-ii/) | Similar duplicate handling |
| Permutations II | [Link](https://leetcode.com/problems/permutations-ii/) | Duplicate permutations |
| Subsets | [Link](https://leetcode.com/problems/subsets/) | Generate all subsets |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Combination Sum II](https://www.youtube.com/watch?v=8hQPLSSjkMY)** - Clear explanation with visual examples

2. **[Back to Back SWE - Combination Sum II](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)** - Detailed walkthrough

3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k)** - Official problem solution

4. **[Backtracking Pattern Explained](https://www.youtube.com/watch?v=8jP8CCrj8cI)** - Understanding backtracking

---

## Follow-up Questions

### Q1: How does this differ from Combination Sum I?

**Answer:** 
- Combination Sum I: Each number can be used unlimited times
- Combination Sum II: Each number can be used at most once, and there may be duplicates in candidates

---

### Q2: How would you handle very large targets?

**Answer:** Use pruning (skip when sum exceeds target). Since candidates are limited (max 50), the depth is limited. Consider using DP if target is large but candidates are small.

---

### Q3: Can you use DP instead of backtracking?

**Answer:** Yes, but it's more complex due to the "use once" constraint. You would need DP over sorted array with index tracking, similar to knapsack.

---

### Q4: How would you modify to find exactly k numbers?

**Answer:** Add k as a parameter. Track the number of elements in path. Stop when len(path) == k.

---

### Q5: What if candidates contain negative numbers?

**Answer:** Without pruning, the search space becomes infinite. You would need additional constraints or use a different approach entirely.

---

### Q6: How would you track the actual combinations efficiently?

**Answer:** The current approach already stores all valid combinations in the result. If memory is a concern, use a generator/yield pattern to stream results.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty candidates array
- Target = 0 (should return empty)
- All elements > target (return empty)
- All duplicate elements
- Single element that equals target

---

### Q8: How would you parallelize this computation?

**Answer:** 
- Process different starting points in parallel
- Use thread pool for independent branches
- Merge results at the end

---

## Common Pitfalls

### 1. Forgetting to Sort
**Issue**: Duplicate handling fails without sorting.

**Solution**: Always sort first. Duplicates must be adjacent.

### 2. Wrong Duplicate Skip Condition
**Issue**: Using wrong index in condition.

**Solution**: Remember `i > start` not `i > 0`.

### 3. Not Passing i + 1
**Issue**: Using same element twice.

**Solution**: Always pass `i + 1` in recursive call.

### 4. Missing Pruning
**Issue**: Time limit exceeded on large inputs.

**Solution**: Add pruning when current_sum > target or candidates[i] > remaining.

---

## Summary

The **Combination Sum II** problem demonstrates:

- **Backtracking**: Exploring all possibilities with pruning
- **Duplicate handling**: Skip consecutive duplicates at same level
- **Use once constraint**: Pass `i + 1` not `i`

Key takeaways:
- **Sorting**: Essential for duplicate handling
- **Skip duplicates**: At same recursion level only
- **Pruning**: Early termination saves time

This problem is essential for understanding backtracking with constraints.

### Pattern Summary

This problem exemplifies the **Backtracking - Combination Sum with Duplicates** pattern, characterized by:
- Sorting before processing
- Skip duplicates at same level
- Each element used at most once

For more details on backtracking, see the **[Backtracking](/algorithms/backtracking)** section.
