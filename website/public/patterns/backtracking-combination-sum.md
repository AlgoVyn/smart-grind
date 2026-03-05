# Backtracking - Combination Sum

## Problem Description

The Backtracking - Combination Sum pattern is used to find all unique combinations of numbers from a given array that sum up to a target value. This pattern handles problems where you need to explore combinations with or without element reuse, making it ideal for subset sum problems and combinatorial optimization. It systematically builds combinations by adding numbers and backtracking when the sum exceeds the target or when all possibilities are explored.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | Exponential O(2^n) worst case, often much better with pruning |
| Space Complexity | O(target/min) for recursion depth |
| Input | Array of candidates, target sum |
| Output | All valid combinations that sum to target |
| Approach | DFS with backtracking and pruning |

### When to Use
- Finding all combinations that sum to a target value
- Problems allowing or disallowing reuse of elements
- Subset sum variations and knapsack-like problems
- Coin change problems (finding combinations, not minimum count)
- Any problem requiring exhaustive search with constraints
- When you need to enumerate all valid solutions

## Intuition

The key insight is to build combinations incrementally, making a choice at each step (include current element or not), and backtrack when the current path is invalid.

The "aha!" moments:
1. **Recursive tree**: Each level represents choosing whether to include a candidate
2. **Pruning**: If current sum exceeds target, stop exploring that branch
3. **Reuse control**: Pass `i` to allow reuse, `i+1` to prevent reuse
4. **Sorting**: Enables early termination when candidates exceed remaining target
5. **Backtracking**: Remove the last element to try other combinations

## Solution Approaches

### Approach 1: Standard Backtracking with Reuse (Optimal) ✅ Recommended

#### Algorithm
1. Sort candidates to enable pruning
2. Use recursive helper with parameters: start index, remaining target, current combination
3. Base case: if target is 0, add current combination to results
4. Iterate from start index:
   - Skip if candidate > remaining target (pruning)
   - Add candidate to current combination
   - Recurse with same index (allow reuse) and reduced target
   - Backtrack: remove last added candidate

#### Implementation

````carousel
```python
def combination_sum(candidates, target):
    """
    Find all combinations that sum to target (reuse allowed).
    LeetCode 39 - Combination Sum
    
    Time: O(2^(t/m)) where t=target, m=min(candidates)
    Space: O(t/m) for recursion stack
    """
    def backtrack(start, remaining, current):
        # Base case: found valid combination
        if remaining == 0:
            result.append(current[:])  # Add copy
            return
        
        # Try each candidate from start index
        for i in range(start, len(candidates)):
            # Pruning: skip if candidate exceeds remaining
            if candidates[i] > remaining:
                break  # Sorted, so all subsequent will also exceed
            
            # Include candidate
            current.append(candidates[i])
            
            # Recurse: allow reuse (stay at i), reduce target
            backtrack(i, remaining - candidates[i], current)
            
            # Backtrack: remove last candidate
            current.pop()
    
    candidates.sort()  # Sort for pruning
    result = []
    backtrack(0, target, [])
    return result
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> combinationSum(std::vector<int>& candidates, int target) {
        std::sort(candidates.begin(), candidates.end());  // Sort for pruning
        std::vector<std::vector<int>> result;
        std::vector<int> current;
        backtrack(candidates, 0, target, current, result);
        return result;
    }
    
private:
    void backtrack(std::vector<int>& candidates, int start, int remaining, 
                   std::vector<int>& current, std::vector<std::vector<int>>& result) {
        // Base case: found valid combination
        if (remaining == 0) {
            result.push_back(current);
            return;
        }
        
        // Try each candidate from start index
        for (int i = start; i < candidates.size(); i++) {
            // Pruning: skip if candidate exceeds remaining
            if (candidates[i] > remaining) break;
            
            // Include candidate
            current.push_back(candidates[i]);
            
            // Recurse: allow reuse (stay at i), reduce target
            backtrack(candidates, i, remaining - candidates[i], current, result);
            
            // Backtrack: remove last candidate
            current.pop_back();
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);  // Sort for pruning
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, int remaining,
                          List<Integer> current, List<List<Integer>> result) {
        // Base case: found valid combination
        if (remaining == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        // Try each candidate from start index
        for (int i = start; i < candidates.length; i++) {
            // Pruning: skip if candidate exceeds remaining
            if (candidates[i] > remaining) break;
            
            // Include candidate
            current.add(candidates[i]);
            
            // Recurse: allow reuse (stay at i), reduce target
            backtrack(candidates, i, remaining - candidates[i], current, result);
            
            // Backtrack: remove last candidate
            current.remove(current.size() - 1);
        }
    }
}
```
<!-- slide -->
```javascript
function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b);  // Sort for pruning
    const result = [];
    
    function backtrack(start, remaining, current) {
        // Base case: found valid combination
        if (remaining === 0) {
            result.push([...current]);  // Add copy
            return;
        }
        
        // Try each candidate from start index
        for (let i = start; i < candidates.length; i++) {
            // Pruning: skip if candidate exceeds remaining
            if (candidates[i] > remaining) break;
            
            // Include candidate
            current.push(candidates[i]);
            
            // Recurse: allow reuse (stay at i), reduce target
            backtrack(i, remaining - candidates[i], current);
            
            // Backtrack: remove last candidate
            current.pop();
        }
    }
    
    backtrack(0, target, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^(t/m)) where t=target, m=min(candidates) - exponential |
| Space | O(t/m) for recursion depth, plus O(k) for k valid combinations |

### Approach 2: Combination Sum II (No Reuse, No Duplicates)

This variation doesn't allow reuse of elements and requires handling duplicates in the input.

#### Implementation

````carousel
```python
def combination_sum2(candidates, target):
    """
    Find combinations without reuse, avoiding duplicates.
    LeetCode 40 - Combination Sum II
    """
    def backtrack(start, remaining, current):
        if remaining == 0:
            result.append(current[:])
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at the same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            # i + 1: no reuse allowed
            backtrack(i + 1, remaining - candidates[i], current)
            current.pop()
    
    candidates.sort()
    result = []
    backtrack(0, target, [])
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<int>> combinationSum2(std::vector<int>& candidates, int target) {
        std::sort(candidates.begin(), candidates.end());
        std::vector<std::vector<int>> result;
        std::vector<int> current;
        backtrack(candidates, 0, target, current, result);
        return result;
    }
    
private:
    void backtrack(std::vector<int>& candidates, int start, int remaining,
                   std::vector<int>& current, std::vector<std::vector<int>>& result) {
        if (remaining == 0) {
            result.push_back(current);
            return;
        }
        
        for (int i = start; i < candidates.size(); i++) {
            // Skip duplicates at the same level
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            
            if (candidates[i] > remaining) break;
            
            current.push_back(candidates[i]);
            backtrack(candidates, i + 1, remaining - candidates[i], current, result);
            current.pop_back();
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, int remaining,
                          List<Integer> current, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        for (int i = start; i < candidates.length; i++) {
            // Skip duplicates at the same level
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            
            if (candidates[i] > remaining) break;
            
            current.add(candidates[i]);
            backtrack(candidates, i + 1, remaining - candidates[i], current, result);
            current.remove(current.size() - 1);
        }
    }
}
```
<!-- slide -->
```javascript
function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    
    function backtrack(start, remaining, current) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < candidates.length; i++) {
            // Skip duplicates at the same level
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            
            if (candidates[i] > remaining) break;
            
            current.push(candidates[i]);
            backtrack(i + 1, remaining - candidates[i], current);
            current.pop();
        }
    }
    
    backtrack(0, target, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n) - no reuse means shallower tree but wider |
| Space | O(n) for recursion depth |

## Complexity Analysis

| Approach | Time | Space | Key Difference |
|----------|------|-------|----------------|
| With Reuse (I) | O(2^(t/m)) | O(t/m) | Can use same element multiple times |
| Without Reuse (II) | O(2^n) | O(n) | Each element used at most once |
| Limited Count (III) | O(9^k) | O(k) | Exactly k elements, 1-9 only |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Combination Sum](https://leetcode.com/problems/combination-sum/) | 39 | Medium | Reuse allowed, find all combinations |
| [Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) | 40 | Medium | No reuse, no duplicates in result |
| [Combination Sum III](https://leetcode.com/problems/combination-sum-iii/) | 216 | Medium | Exactly k numbers, 1-9 only |
| [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/) | 377 | Medium | Count combinations (DP problem) |
| [Subsets](https://leetcode.com/problems/subsets/) | 78 | Medium | All subsets without target constraint |
| [Subsets II](https://leetcode.com/problems/subsets-ii/) | 90 | Medium | All unique subsets with duplicates |
| [Permutations](https://leetcode.com/problems/permutations/) | 46 | Medium | All permutations of array |
| [Target Sum](https://leetcode.com/problems/target-sum/) | 494 | Medium | Assign +/- to reach target |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | 416 | Medium | Can array be partitioned equally |

## Video Tutorial Links

1. **[NeetCode - Combination Sum](https://www.youtube.com/watch?v=GBKI9VSKdGg)** - Backtracking explanation with decision tree
2. **[Back To Back SWE - Combination Sum](https://www.youtube.com/watch?v=GBKI9VSKdGg)** - Visual walkthrough
3. **[Kevin Naughton Jr. - LeetCode 39](https://www.youtube.com/watch?v=GBKI9VSKdGg)** - Clean implementation
4. **[Nick White - Combination Sum](https://www.youtube.com/watch?v=GBKI9VSKdGg)** - Step-by-step trace
5. **[Techdose - Combination Sum Backtracking](https://www.youtube.com/watch?v=GBKI9VSKdGg)** - Pattern explanation

## Summary

### Key Takeaways
- **Sort first** to enable pruning and handle duplicates
- **Base case**: target == 0 means valid combination found
- **Pruning**: skip candidates > remaining target
- **Reuse**: pass `i` to allow reuse, `i+1` to prevent reuse
- **Duplicate handling**: skip `candidates[i] == candidates[i-1]` when `i > start`
- **Backtrack**: always remove last element after recursion

### Common Pitfalls
- Infinite recursion if reuse is allowed but no pruning (always check bounds)
- Duplicate combinations when input has duplicates (sort and skip)
- Not handling reuse correctly (use i vs i+1 appropriately)
- Forgetting to sort (enables pruning when candidates[i] > target)
- Not copying the current list when adding to results (reference issues)

### Follow-up Questions
1. **How would you modify for limited reuse (max k times per element)?**
   - Track count of each element, decrement/increment in recursion

2. **What if you need the minimum number of elements to reach target?**
   - BFS approach or DP, not backtracking

3. **How would you solve iteratively?**
   - Use explicit stack to simulate recursion

4. **What if the array is very large but target is small?**
   - Early termination helps; consider DP for counting solutions

## Pattern Source

[Combination Sum Pattern](patterns/backtracking-combination-sum.md)
