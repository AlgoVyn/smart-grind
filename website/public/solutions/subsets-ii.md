# Subsets II

## Problem Description

Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set).
The solution set must not contain duplicate subsets. Return the solution in any order.

**LeetCode Link:** [Subsets II - LeetCode 90](https://leetcode.com/problems/subsets-ii/)

---

## Examples

### Example 1

**Input:**
```python
nums = [1,2,2]
```

**Output:**
```python
[[],[1],[1,2],[1,2,2],[2],[2,2]]
```

**Explanation:** Note that [2,2] and [2] are both valid subsets.

### Example 2

**Input:**
```python
nums = [0]
```

**Output:**
```python
[[],[0]]
```

---

## Constraints

- `1 <= nums.length <= 10`
- `-10 <= nums[i] <= 10`

---

## Pattern: Backtracking with Duplicate Handling

This problem uses **backtracking** to generate all unique subsets, with sorting to handle duplicates. The key insight is that after sorting, duplicates are adjacent, and we skip recursive calls for duplicate elements at the same level to avoid generating duplicate subsets.

---

## Intuition

The key insight for this problem is understanding how to handle duplicates in backtracking.

### Key Observations

1. **Sorting First**: Sort the array to group duplicates together. After sorting, all equal elements are adjacent.

2. **Skip Duplicates at Same Level**: When we have duplicates, we need to skip recursive calls that would generate the same subset. The key is: at each recursion level, if we've seen the same number before at this level, skip it.

3. **The Skip Condition**: Use `if i > start and nums[i] == nums[i-1]` to skip duplicates. The `i > start` condition ensures we only skip duplicates within the same recursion level, not across different levels.

4. **Why It Works**: 
   - After sorting, duplicates are adjacent
   - At each level (for a given `start`), we try each element
   - If we've already tried `nums[i-1]` at this level, trying `nums[i]` would generate the same subsets as before
   - So we skip `nums[i]` when `nums[i] == nums[i-1]` and `i > start`

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Backtracking (Optimal)** - Standard approach
2. **Iterative** - Build subsets iteratively

---

## Approach 1: Backtracking (Optimal)

### Algorithm Steps

1. **Sort the input**: Group duplicates together
2. **Initialize**: Empty result, empty path
3. **Backtrack**: For each position, add current path to result, then try adding each element
4. **Skip duplicates**: At each level, skip elements that are same as previous at that level
5. **Return result**

### Why It Works

Backtracking systematically explores all possible subsets. By sorting and skipping duplicates, we avoid generating duplicate subsets while still exploring all unique combinations.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all unique subsets using backtracking.
        
        Args:
            nums: List of integers (may contain duplicates)
            
        Returns:
            List of all unique subsets
        """
        # Step 1: Sort to group duplicates
        nums.sort()
        result = []
        
        def backtrack(start: int, path: List[int]):
            # Add current subset
            result.append(path[:])
            
            # Try adding each element from start
            for i in range(start, len(nums)):
                # Skip duplicates at the same level
                if i > start and nums[i] == nums[i - 1]:
                    continue
                
                # Include nums[i] in current subset
                path.append(nums[i])
                
                # Recurse with next start
                backtrack(i + 1, path)
                
                # Backtrack
                path.pop()
        
        backtrack(0, [])
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        // Step 1: Sort to group duplicates
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        vector<int> path;
        
        function<void(int)> backtrack = [&](int start) {
            result.push_back(path);
            
            for (int i = start; i < nums.size(); i++) {
                // Skip duplicates at the same level
                if (i > start && nums[i] == nums[i - 1]) {
                    continue;
                }
                
                path.push_back(nums[i]);
                backtrack(i + 1);
                path.pop_back();
            }
        };
        
        backtrack(0);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        // Step 1: Sort to group duplicates
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        
        backtrack(nums, 0, path, result);
        return result;
    }
    
    private void backtrack(int[] nums, int start, List<Integer> path, 
                          List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        
        for (int i = start; i < nums.length; i++) {
            // Skip duplicates at the same level
            if (i > start && nums[i] == nums[i - 1]) {
                continue;
            }
            
            path.add(nums[i]);
            backtrack(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function(nums) {
    // Step 1: Sort to group duplicates
    nums.sort((a, b) => a - b);
    const result = [];
    const path = [];
    
    function backtrack(start) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            // Skip duplicates at the same level
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            
            path.push(nums[i]);
            backtrack(i + 1);
            path.pop();
        }
    }
    
    backtrack(0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n * n) - generate 2^n subsets, each takes O(n) to copy |
| **Space** | O(2^n * n) for result, O(n) for recursion stack |

---

## Approach 2: Iterative

### Algorithm Steps

1. Sort the input
2. Start with result containing empty subset
3. For each number:
   - If it's a new number (different from previous), add it to all existing subsets
   - If it's a duplicate, only add it to subsets created in the last iteration

### Why It Works

This builds up subsets iteratively. For duplicates, we need to be careful to only add them to subsets that were created in the previous step to avoid duplicates.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        result = [[]]
        
        for i in range(len(nums)):
            # Check if current number is same as previous
            if i == 0 or nums[i] != nums[i - 1]:
                # New number: add to all existing subsets
                current_subsets = [subset + [nums[i]] for subset in result]
            else:
                # Duplicate: only add to subsets created in last iteration
                current_subsets = [subset + [nums[i]] for subset in current_subsets]
            
            result.extend(current_subsets)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result = {{}};
        
        for (int i = 0; i < nums.size(); i++) {
            vector<vector<int>> current;
            
            if (i == 0 || nums[i] != nums[i - 1]) {
                // New number: add to all existing subsets
                for (auto& subset : result) {
                    subset.push_back(nums[i]);
                    current.push_back(subset);
                    subset.pop_back();
                }
            } else {
                // Duplicate: only add to subsets from last iteration
                for (auto& subset : current) {
                    subset.push_back(nums[i]);
                    current.push_back(subset);
                    subset.pop_back();
                }
            }
            
            result.insert(result.end(), current.begin(), current.end());
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        
        for (int i = 0; i < nums.length; i++) {
            List<List<Integer>> current = new ArrayList<>();
            
            if (i == 0 || nums[i] != nums[i - 1]) {
                // New number: add to all existing subsets
                for (List<Integer> subset : result) {
                    List<Integer> newSubset = new ArrayList<>(subset);
                    newSubset.add(nums[i]);
                    current.add(newSubset);
                }
            } else {
                // Duplicate: only add to subsets from last iteration
                for (List<Integer> subset : current) {
                    List<Integer> newSubset = new ArrayList<>(subset);
                    newSubset.add(nums[i]);
                    current.add(newSubset);
                }
            }
            
            result.addAll(current);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function(nums) {
    nums.sort((a, b) => a - b);
    const result = [[]];
    
    for (let i = 0; i < nums.length; i++) {
        let current = [];
        
        if (i === 0 || nums[i] !== nums[i - 1]) {
            // New number: add to all existing subsets
            for (const subset of result) {
                current.push([...subset, nums[i]]);
            }
        } else {
            // Duplicate: only add to subsets from last iteration
            for (const subset of current) {
                current.push([...subset, nums[i]]);
            }
        }
        
        result.push(...current);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n * n) |
| **Space** | O(2^n * n) |

---

## Comparison of Approaches

| Aspect | Backtracking | Iterative |
|--------|--------------|-----------|
| **Time Complexity** | O(2^n * n) | O(2^n * n) |
| **Space Complexity** | O(2^n * n) | O(2^n * n) |
| **Implementation** | More intuitive | Trickier with duplicates |
| **Recommended** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (Backtracking) for cleaner implementation.

---

## Common Pitfalls

### 1. Not Sorting
**Issue**: Forgetting to sort the input array.

**Solution**: Always sort first to group duplicates.

### 2. Wrong Skip Condition
**Issue**: Using `if nums[i] == nums[i-1]` without checking `i > start`.

**Solution**: Must check `i > start` to only skip duplicates at the same recursion level.

### 3. Reference vs Copy
**Issue**: Appending path directly instead of a copy.

**Solution**: Use `path[:]` or `path.copy()` to create a deep copy.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Backtracking, recursion, duplicate handling

### Learning Outcomes

1. **Backtracking**: Master the backtracking pattern for generating combinations
2. **Duplicate Handling**: Learn to efficiently skip duplicates
3. **Subset Generation**: Understand power set generation

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subsets | [Link](https://leetcode.com/problems/subsets/) | Basic subset generation (no duplicates) |
| Subsets II | [Link](https://leetcode.com/problems/subsets-ii/) | This problem |
| Permutations II | [Link](https://leetcode.com/problems/permutations-ii/) | Duplicate handling in permutations |

---

## Video Tutorial Links

1. **[NeetCode - Subsets II](https://www.youtube.com/watch?v=1VvkIB3zjQY)** - Clear explanation
2. **[Backtracking Pattern](https://www.youtube.com/watch?v=LlC2bDu11yA)** - Understanding backtracking

---

## Follow-up Questions

### Q1: How would you modify to return only subsets of a specific size?

**Answer:** Add a check for path.length == target_size before adding to result, or add a size parameter to track current subset size.

### Q2: What if you needed to handle much larger arrays?

**Answer:** For arrays larger than 10, the number of subsets would be too large (2^n). Consider using iterative bit manipulation or limiting the problem scope.

### Q3: How does this compare to generating permutations with duplicates?

**Answer:** The logic is similar - sort first, then skip duplicates at the same level. The key difference is that for subsets, order doesn't matter, so we use `i + 1` as the next start.

---

## Summary

The **Subsets II** problem demonstrates how to handle duplicates in backtracking problems.

Key takeaways:
1. Sort the input first to group duplicates together
2. Skip duplicates at the same recursion level using `i > start and nums[i] == nums[i-1]`
3. Use backtracking to generate all subsets
4. Make deep copies when adding to result
5. Time complexity is O(2^n * n) where n is the input size

This problem is essential for understanding how to efficiently handle duplicate elements in combinatorial generation problems.
