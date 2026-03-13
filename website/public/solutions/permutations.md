# Permutations

## Problem Description

Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.

---

## Examples

### Example

**Input:** `nums = [1,2,3]`  
**Output:** `[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`

### Example 2

**Input:** `nums = [0,1]`  
**Output:** `[[0,1],[1,0]]`

### Example 3

**Input:** `nums = [1]`  
**Output:** `[[1]]`

---

## Constraints

- `1 <= nums.length <= 6`
- `-10 <= nums[i] <= 10`
- All the integers of `nums` are unique.

---

## LeetCode Link

[LeetCode Problem 46: Permutations](https://leetcode.com/problems/permutations/)

---

## Pattern: Backtracking (Complete Search)

This problem follows the **Backtracking** pattern for generating all permutations.

### Core Concept

- **Complete Search**: Explore all possible orderings
- **State Tracking**: Track which elements have been used
- **Decision Tree**: Each level represents choosing an element
- **Backtrack**: Undo choice after exploring branch

### When to Use This Pattern

This pattern is applicable when:
1. Generating all combinations/permutations
2. Constraint satisfaction problems
3. Problems requiring exhaustive search

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Heap's Algorithm | Generate permutations iteratively |
| Next Permutation | Use algorithm to get next permutation |

---

## Intuition

The key insight for generating permutations is using **backtracking**:

> At each position, try each unused element, then backtrack (undo the choice) to try other options.

### Key Observations

1. **Complete Search**: We need to explore all possible orderings of the elements

2. **State Tracking**: We need to track which elements have been used in the current permutation

3. **Decision Tree**: Think of the problem as a tree where each level represents choosing an element for the next position

4. **Backtracking**: After exploring one branch, we undo the last choice and try another

### Why Backtracking Works

Backtracking systematically explores all possible permutations:
- At each step, we choose an unused element
- We recurse to build the rest of the permutation
- After returning, we "backtrack" by removing the chosen element
- This ensures we try all possible combinations

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Backtracking with Used Array** - Standard approach
2. **Swap-based Backtracking** - In-place variation

---

## Approach 1: Backtracking with Used Array (Standard)

### Algorithm Steps

1. Initialize result array and path (current permutation)
2. Create a used array to track which elements are in the current path
3. If path length equals nums length, add a copy to result
4. For each index, if not used:
   - Mark as used and add to path
   - Recurse
   - Backtrack: remove from path and unmark
5. Start with empty path and return results

### Why It Works

The used array ensures we don't use the same element twice in a permutation. When we reach the end (path length equals nums length), we've built a complete permutation.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all permutations using backtracking.
        
        Args:
            nums: List of distinct integers
            
        Returns:
            List of all possible permutations
        """
        res = []
        
        def backtrack(path: List[int], used: List[bool]) -> None:
            # Base case: permutation complete
            if len(path) == len(nums):
                res.append(path[:])  # Add a copy
                return
            
            # Try each unused element
            for i in range(len(nums)):
                if not used[i]:
                    used[i] = True
                    path.append(nums[i])
                    backtrack(path, used)
                    path.pop()
                    used[i] = False
        
        backtrack([], [False] * len(nums))
        return res
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> path;
        vector<bool> used(nums.size(), false);
        
        backtrack(nums, path, used, result);
        return result;
    }
    
private:
    void backtrack(const vector<int>& nums, vector<int>& path, 
                   vector<bool>& used, vector<vector<int>>& result) {
        if (path.size() == nums.size()) {
            result.push_back(path);
            return;
        }
        
        for (int i = 0; i < nums.size(); i++) {
            if (!used[i]) {
                used[i] = true;
                path.push_back(nums[i]);
                backtrack(nums, path, used, result);
                path.pop_back();
                used[i] = false;
            }
        }
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        
        backtrack(nums, path, used, result);
        return result;
    }
    
    private void backtrack(int[] nums, List<Integer> path, 
                          boolean[] used, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true;
                path.add(nums[i]);
                backtrack(nums, path, used, result);
                path.remove(path.size() - 1);
                used[i] = false;
            }
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
var permute = function(nums) {
    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        if (path.length === nums.length) {
            result.push([...path]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true;
                path.push(nums[i]);
                backtrack();
                path.pop();
                used[i] = false;
            }
        }
    }
    
    backtrack();
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n! × n) - n! permutations, each taking O(n) to copy |
| **Space** | O(n! × n) - Storing all permutations |

---

## Approach 2: Swap-based Backtracking

### Algorithm Steps

1. Start with the original array
2. For each position i from 0 to n-1:
   - Swap nums[i] with each element from i to end
   - Recurse with the swapped array
   - Swap back to restore
3. When we reach the end, add a copy to results

### Why It Works

Instead of tracking used elements, we swap elements in place. This naturally generates all permutations by considering each element at each position.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all permutations using swap-based backtracking.
        """
        res = []
        
        def backtrack(start: int) -> None:
            if start == len(nums):
                res.append(nums[:])
                return
            
            for i in range(start, len(nums)):
                # Swap
                nums[start], nums[i] = nums[i], nums[start]
                # Recurse
                backtrack(start + 1)
                # Backtrack (swap back)
                nums[start], nums[i] = nums[i], nums[start]
        
        backtrack(0)
        return res
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        backtrack(nums, 0, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& nums, int start, vector<vector<int>>& result) {
        if (start == nums.size()) {
            result.push_back(nums);
            return;
        }
        
        for (int i = start; i < nums.size(); i++) {
            swap(nums[start], nums[i]);
            backtrack(nums, start + 1, result);
            swap(nums[start], nums[i]);
        }
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, result);
        return result;
    }
    
    private void backtrack(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> permutation = new ArrayList<>();
            for (int num : nums) {
                permutation.add(num);
            }
            result.add(permutation);
            return;
        }
        
        for (int i = start; i < nums.length; i++) {
            swap(nums, start, i);
            backtrack(nums, start + 1, result);
            swap(nums, start, i);
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

<!-- slide -->
```javascript
var permute = function(nums) {
    const result = [];
    
    function backtrack(start) {
        if (start === nums.length) {
            result.push([...nums]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            [nums[start], nums[i]] = [nums[i], nums[start]];
            backtrack(start + 1);
            [nums[start], nums[i]] = [nums[i], nums[start]];
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
| **Time** | O(n! × n) - n! permutations |
| **Space** | O(n) - Recursion depth |

---

## Comparison of Approaches

| Aspect | Used Array | Swap-based |
|--------|------------|------------|
| **Time Complexity** | O(n! × n) | O(n! × n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Clear | Compact |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Both approaches are equivalent. Choose based on preference - used array is more explicit, swap-based is more space-efficient conceptually.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Backtracking, DFS, Recursion

### Learning Outcomes

1. **Backtracking Mastery**: Learn the classic backtracking pattern
2. **State Management**: Understand how to track and restore state
3. **Tree Thinking**: Visualize problems as decision trees

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Permutations II | [Link](https://leetcode.com/problems/permutations-ii/) | Handle duplicates |
| Subsets | [Link](https://leetcode.com/problems/subsets/) | Generate all subsets |
| Combinations | [Link](https://leetcode.com/problems/combinations/) | Generate combinations |

### Pattern Reference

For more detailed explanations of the Backtracking pattern, see:
- **[Backtracking Pattern](/patterns/backtracking-subsets-include-exclude)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Permutations](https://www.youtube.com/watch?v=8M20D0DtAEs)** - Clear explanation with visual examples
2. **[Permutations - LeetCode 46](https://www.youtube.com/watch?v=8M20D0DtAEs)** - Detailed walkthrough
3. **[Backtracking Explained](https://www.youtube.com/watch?v=A3wZ7F5D3EE)** - Understanding backtracking

---

## Follow-up Questions

### Q1: How would you modify the solution to handle duplicate elements?

**Answer:** Sort the array first, then in the loop skip duplicates by checking if the current element equals the previous one and if the previous one wasn't used (or use a visited set with duplicate checking).

---

### Q2: What if you needed to find the kth permutation directly without generating all?

**Answer:** Use the factorial number system. Calculate the position of each digit using factorials - O(n) time to find any specific permutation.

---

### Q3: Can you generate permutations iteratively without recursion?

**Answer:** Yes, you can use the "next permutation" algorithm repeatedly. Starting from sorted order, apply next permutation n! - 1 times to get all permutations.

---

### Q4: How would you limit the number of permutations generated?

**Answer:** Add a check at the beginning of the recursion - if result size reaches the limit, return early.

---

## Common Pitfalls

### 1. Not Marking Used
**Issue**: Using same element multiple times.

**Solution**: Use used array or swap-back pattern.

### 2. Wrong Base Case
**Issue**: Not adding complete permutation.

**Solution**: Add copy when len(current) == len(nums).

### 3. Modifying Original Array
**Issue**: Adding reference instead of copy.

**Solution**: Always add a copy of the path to results.

### 4. Not Backtracking
**Issue**: Not removing elements after recursion.

**Solution**: Always backtrack by removing the element and marking as unused.

---

## Summary

The **Permutations** problem demonstrates the **Backtracking** pattern for generating all possible arrangements.

### Key Takeaways

1. **Backtracking**: Try, recurse, undo
2. **State Tracking**: Use used array or swap-back
3. **Base Case**: When path length equals nums length
4. **Copy When Adding**: Always add a copy to results

### Pattern Summary

This problem exemplifies the **Backtracking** pattern, characterized by:
- Exploring all possible solutions
- Making choices and undoing them
- Recursive state management

For more details on this pattern and its variations, see the **[Backtracking Pattern](/patterns/backtracking-subsets-include-exclude)**.

---

## Additional Resources

- [LeetCode Problem 46](https://leetcode.com/problems/permutations/) - Official problem page
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - Detailed backtracking explanation
- [Pattern: Backtracking](/patterns/backtracking-subsets-include-exclude) - Comprehensive pattern guide
