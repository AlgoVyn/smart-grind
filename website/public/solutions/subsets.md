# Subsets

## Problem Description

Given an integer array `nums` of unique elements, return all possible subsets (the power set).
The solution set must not contain duplicate subsets. Return the solution in any order.

**LeetCode Link:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 2, 3]
```

**Output:**
```python
[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

**Explanation:**
The set of all subsets is the power set. For an array of length n, there are 2^n possible subsets. For [1,2,3], we generate all combinations by including or excluding each element.

### Example 2

**Input:**
```python
nums = [0]
```

**Output:**
```python
[[], [0]]
```

**Explanation:**
With only one element, we can either include it or not, giving us 2 subsets.

---

## Constraints

- `1 <= nums.length <= 10`
- `-10 <= nums[i] <= 10`
- All the numbers of `nums` are unique.

---

## Pattern: Backtracking - Power Set

This problem follows the **Backtracking - Power Set** pattern.

### Core Concept

- **Generate All**: Generate all subsets via recursion
- **Include/Exclude**: Each element either in or out
- **Binary Representation**: Subsets correspond to bit patterns

### When to Use This Pattern

This pattern is applicable when:
1. Generating power set
2. Subset enumeration
3. Combination problems

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Backtracking | General backtracking |
| Combinations | Select k items |

---

## Intuition

The key insight for the Subsets problem is understanding that **every element in the array has two choices**: either it's included in a subset or it's not. This creates a binary tree of decisions where at each level we decide whether to include the current element.

### Key Observations

1. **Binary Tree Structure**: Think of the decision tree where each level represents an element - going "left" means include, "right" means exclude.

2. **No Base Case Needed**: Unlike typical recursion, we don't need a specific condition to stop. We simply generate all possibilities by exploring both branches for each element.

3. **Building Up Solution**: We build subsets incrementally. At each step, we have a partial subset, and we can either:
   - Add the current element and continue
   - Skip the current element and continue

4. **2^n Subsets**: With n elements, there are exactly 2^n possible subsets (each element has 2 choices).

### Algorithm Overview

1. **Start with empty subset**: Begin with an empty list `[]`
2. **Iterate through elements**: For each element, create new subsets by adding it to all existing subsets
3. **Collect all subsets**: After processing all elements, we have all possible subsets

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Backtracking** - Classic recursive approach
2. **Bit Manipulation** - Use binary representation
3. **Iterative** - Build subsets iteratively

---

## Approach 1: Backtracking (Classic)

### Algorithm Steps

1. Initialize an empty result list
2. Use recursion to explore including/excluding each element
3. At each step, add current subset to result
4. Backtrack to try other combinations

### Why It Works

Backtracking systematically explores all possible combinations by trying each decision (include/exclude) and backtracking when needed. This ensures we generate all 2^n subsets.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        result = []

        def backtrack(start: int, path: List[int]) -> None:
            # Add current subset to result
            result.append(path[:])
            
            # Try adding each remaining element
            for i in range(start, len(nums)):
                path.append(nums[i])       # Include nums[i]
                backtrack(i + 1, path)     # Recurse with next index
                path.pop()                 # Backtrack

        backtrack(0, [])
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> path;
        
        function<void(int)> backtrack = [&](int start) {
            result.push_back(path);
            
            for (int i = start; i < nums.size(); i++) {
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
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        
        backtrack(0, nums, path, result);
        return result;
    }
    
    private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path));
        
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(i + 1, nums, path, result);
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
var subsets = function(nums) {
    const result = [];
    
    function backtrack(start, path) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n × n) - We generate 2^n subsets, each taking O(n) to copy |
| **Space** | O(n) for recursion stack, O(2^n × n) for storing all subsets |

---

## Approach 2: Bit Manipulation

### Algorithm Steps

1. Calculate total number of subsets (2^n)
2. For each number from 0 to 2^n - 1:
   - Convert number to binary
   - Use each bit to determine if corresponding element is included
3. Build subset based on bit representation

### Why It Works

Every subset corresponds to a unique binary number of n bits. The i-th bit tells us whether the i-th element is included in the subset.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        result = []
        
        # 2^n possible subsets
        for i in range(1 << n):
            subset = []
            for j in range(n):
                # Check if j-th bit is set
                if i & (1 << j):
                    subset.append(nums[j])
            result.append(subset)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        int n = nums.size();
        vector<vector<int>> result;
        
        for (int i = 0; i < (1 << n); i++) {
            vector<int> subset;
            for (int j = 0; j < n; j++) {
                if (i & (1 << j)) {
                    subset.push_back(nums[j]);
                }
            }
            result.push_back(subset);
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        
        for (int i = 0; i < (1 << n); i++) {
            List<Integer> subset = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                if ((i & (1 << j)) != 0) {
                    subset.add(nums[j]);
                }
            }
            result.add(subset);
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
var subsets = function(nums) {
    const n = nums.length;
    const result = [];
    
    for (let i = 0; i < (1 << n); i++) {
        const subset = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) {
                subset.push(nums[j]);
            }
        }
        result.push(subset);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n × n) - Iterate through 2^n subsets, each taking O(n) to build |
| **Space** | O(2^n × n) for storing all subsets |

---

## Approach 3: Iterative (Building Subsets)

### Algorithm Steps

1. Start with a list containing one empty subset: `[[]]`
2. For each element in nums:
   - For each existing subset, create a new copy with the element added
3. Return all accumulated subsets

### Why It Works

We build subsets iteratively. For each new element, we can either:
- Keep all existing subsets as they are (exclude the element)
- Add new subsets that include the current element (by copying each existing subset and adding the element)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        result = [[]]  # Start with empty subset
        
        for num in nums:
            # Create new subsets by adding current num to all existing subsets
            new_subsets = [subset + [num] for subset in result]
            result.extend(new_subsets)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result = {{}};  // Start with empty subset
        
        for (int num : nums) {
            int currentSize = result.size();
            for (int i = 0; i < currentSize; i++) {
                vector<int> newSubset = result[i];
                newSubset.push_back(num);
                result.push_back(newSubset);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());  // Start with empty subset
        
        for (int num : nums) {
            int currentSize = result.size();
            for (int i = 0; i < currentSize; i++) {
                List<Integer> newSubset = new ArrayList<>(result.get(i));
                newSubset.add(num);
                result.add(newSubset);
            }
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
var subsets = function(nums) {
    const result = [[]];  // Start with empty subset
    
    for (const num of nums) {
        const currentSize = result.length;
        for (let i = 0; i < currentSize; i++) {
            result.push([...result[i], num]);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n × n) - Each of n elements creates new subsets |
| **Space** | O(2^n × n) for storing all subsets |

---

## Comparison of Approaches

| Aspect | Backtracking | Bit Manipulation | Iterative |
|--------|--------------|-----------------|-----------|
| **Time Complexity** | O(2^n × n) | O(2^n × n) | O(2^n × n) |
| **Space Complexity** | O(n) recursion | O(1) extra | O(1) extra |
| **Implementation** | Recursive | Iterative | Iterative |
| **Ease of Understanding** | High | Medium | High |
| **Interview Favorite** | ✅ | ✅ | ✅ |

**Best Approach:** All three are valid. Backtracking is most commonly asked in interviews as it demonstrates understanding of recursion. Iterative approach is often the simplest to understand.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very commonly asked in technical interviews
- **Companies**: Google, Meta, Amazon, Microsoft, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Backtracking, Recursion, Bit Manipulation, Dynamic Programming

### Learning Outcomes

1. **Backtracking Mastery**: Learn the classic backtracking template
2. **Recursion Thinking**: Understand how to build solutions incrementally
3. **Binary Representation**: Connect mathematical concepts to programming
4. **Optimization**: Learn when to use which approach

---

## Related Problems

Based on similar themes (Backtracking, Power Set, Subset Generation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subsets II | [Link](https://leetcode.com/problems/subsets-ii/) | Subsets with duplicates |
| Permutations | [Link](https://leetcode.com/problems/permutations/) | All permutations |
| Permutations II | [Link](https://leetcode.com/problems/permutations-ii/) | Permutations with duplicates |
| Combination Sum | [Link](https://leetcode.com/problems/combination-sum/) | Find combinations that sum to target |
| Letter Combinations of a Phone Number | [Link](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Backtracking with mapping |

### Pattern Reference

For more detailed explanations of the Backtracking pattern, see:
- **[Backtracking Pattern](/patterns/backtracking)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Subsets](https://www.youtube.com/watch?v=re2-Il21zOA)** - Clear explanation with visual examples
2. **[Backtracking Explained](https://www.youtube.com/watch?v=A3c5i7eVfLQ)** - Understanding backtracking
3. **[Bit Manipulation for Subsets](https://www.youtube.com/watch?v=bK催促PZDE)** - Binary approach

### Related Concepts

- **[Recursion Basics](https://www.youtube.com/watch?v=5P5x4a52Kcw)** - Understanding recursion
- **[Binary Numbers](https://www.youtube.com/watch?v=ryL6jCq0nGk)** - Bit manipulation fundamentals

---

## Follow-up Questions

### Q1: How would you modify the solution to handle duplicate elements?

**Answer:** First, sort the array to group duplicates together. Then, in the backtracking loop, skip elements that are the same as the previous one (when `i > start` and `nums[i] == nums[i-1]`).

---

### Q2: How would you return only subsets of a specific size k?

**Answer:** Add a size check in the backtracking function. Only add to result when `len(path) == k`, and only recurse if `len(path) < k`.

---

### Q3: What's the maximum number of subsets for any array?

**Answer:** For an array of n unique elements, there are exactly 2^n subsets. This is because each element can either be in or out of a subset (2 choices per element).

---

### Q4: Can you solve this using Dynamic Programming?

**Answer:** Yes, you can use DP where `dp[i]` contains all subsets using the first i elements. The recurrence is: `dp[i] = dp[i-1] ∪ (each subset in dp[i-1] with nums[i-1] added)`.

---

### Q5: How would you optimize space complexity?

**Answer:** Use the iterative approach without creating new lists. However, note that we must always create new subsets to avoid modifying the original subsets while iterating.

---

## Common Pitfalls

### 1. Not Making a Copy
**Issue:** Modifying current subset during iteration.

**Solution:** Add copy: `result.append(path[:])` in Python, `result.push_back(path)` in C++.

### 2. Wrong Recursion
**Issue:** Not exploring both include/exclude.

**Solution:** Recurse with and without current element - this is the core of backtracking.

### 3. Duplicates in Input
**Issue:** Not handling duplicate elements when required.

**Solution:** Sort first and skip duplicates: `if i > start and nums[i] == nums[i-1]: continue`

### 4. Off-by-One Errors
**Issue:** Wrong index when calling backtrack.

**Solution:** Use `i + 1` to move forward and avoid reusing elements.

---

## Summary

The **Subsets** problem is a fundamental backtracking problem that teaches important concepts:

- **Binary Decision Tree**: Every element has 2 choices (include/exclude)
- **Backtracking Pattern**: Explore all possibilities systematically
- **Multiple Solutions**: Backtracking, Bit Manipulation, and Iterative approaches

Key takeaways:
1. Start with empty subset and build incrementally
2. Use recursion to explore include/exclude branches
3. Always copy the current path before adding to result
4. Time complexity is always O(2^n × n) regardless of approach

This problem forms the foundation for many other backtracking problems like permutations, combinations, and subset sum.

### Pattern Summary

This problem exemplifies the **Backtracking - Power Set** pattern, characterized by:
- Generating all possible combinations
- Recursive exploration of decisions
- Building solutions incrementally
- Understanding the 2^n subset space

For more details on this pattern and its variations, see the **[Backtracking Pattern](/patterns/backtracking)**.

---

## Additional Resources

- [LeetCode Problem 78](https://leetcode.com/problems/subsets/) - Official problem page
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - Detailed backtracking explanation
- [Power Set - Wikipedia](https://en.wikipedia.org/wiki/Power_set) - Mathematical fundamentals
- [Pattern: Backtracking](/patterns/backtracking) - Comprehensive pattern guide
