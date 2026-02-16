# Backtracking - Subsets (Include/Exclude)

## Overview

The Backtracking - Subsets (Include/Exclude) pattern is a fundamental combinatorial problem-solving approach that systematically explores all possible subsets of a given set by making binary decisions for each element. At every position in the input array, the algorithm decides whether to **include** the current element in the current subset or **exclude** it. This creates a decision tree where each path represents a unique subset.

This pattern is essential for solving problems that require exhaustive search through combinations, such as generating all possible subsets, finding subsets that meet specific criteria, or exploring solution spaces where each element can be either selected or not selected.

**Why Use This Pattern?**

- **Exhaustive Exploration**: Guarantees finding all possible subsets
- **Flexibility**: Can be adapted for various constraints and conditions
- **Simplicity**: Straightforward recursive implementation
- **Foundation**: Forms the basis for many complex combinatorial algorithms

---

## Intuition

### Core Concept

The intuition behind the Subsets pattern stems from the mathematical concept of the **power set** - the set of all subsets of a given set. For a set with `n` elements, there are exactly `2^n` possible subsets (including the empty set). Each element contributes a binary choice: either it belongs to a subset or it doesn't.

**Visual Decision Tree for [1, 2, 3]:**

```
                        []           (start - empty subset)
                       /   \
                  Include   Exclude
                    /          \
                 [1]            []
                 /   \          /   \
           Include Exclude  Include Exclude
             /       \          /       \
          [1,2]    [1]       [2]        []
         /   \      |         |          |
    ...    ...    ...       ...        ...

Output: [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]
```

### Why Include/Exclude?

**This approach is optimal when:**

1. **All subsets are required**: When you need every possible combination
2. **No clear pattern exists**: When greedy or dynamic programming approaches don't apply
3. **Constraint-based filtering**: When you need to filter subsets based on conditions
4. **Small to medium input sizes**: When `n` is small enough for exponential exploration

### Key Observations

1. **Binary Decision Tree**: Each element creates two branches (include/exclude)
2. **Recursion naturally models this**: Each function call represents a decision point
3. **Base case completes a subset**: When all elements are processed, a subset is complete
4. **Backtracking cleans up state**: Removing elements ensures clean state for sibling branches
5. **2^n Complexity**: The exponential nature is inherent - every subset must be explored

### When to Use This Pattern

- **Generating all subsets** (Power Set problem)
- **Finding subsets with specific sum** (Subset Sum problem)
- **Partition problems** (Equal subset partition)
- **Combination problems** with element selection constraints
- **Permutation with subset constraints**

---

## Multiple Approaches with Code

We'll cover three main approaches:

1. **Recursive Include/Exclude** - Classic backtracking approach
2. **Iterative Bit Manipulation** - Using bit masks to represent subsets
3. **BFS/Queue-based Building** - Building subsets level by level

---

## Approach 1: Recursive Include/Exclude

This is the most intuitive and commonly used approach. It uses recursion to make binary decisions at each element.

### Algorithm Steps

1. Define a recursive helper function `backtrack(start, current_subset)`:
   - If `start == len(nums)`: Add a copy of current subset to results
   - **Exclude current element**: Call `backtrack(start + 1, current_subset)`
   - **Include current element**: Add element, call `backtrack`, then remove (backtrack)
2. Initialize results list
3. Call backtrack from index 0 with empty subset
4. Return all collected subsets

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all possible subsets of the given list of integers.
        
        Args:
            nums: List of distinct integers
            
        Returns:
            List of all possible subsets
        """
        result = []
        
        def backtrack(start: int, current_subset: List[int]) -> None:
            # Base case: we've processed all elements
            if start == len(nums):
                # Add a copy (not reference) to results
                result.append(current_subset[:])
                return
            
            # Decision 1: Exclude nums[start]
            backtrack(start + 1, current_subset)
            
            # Decision 2: Include nums[start]
            current_subset.append(nums[start])
            backtrack(start + 1, current_subset)
            # Backtrack: remove last element for other paths
            current_subset.pop()
        
        backtrack(0, [])
        return result

# Example usage
# sol = Solution()
# print(sol.subsets([1, 2, 3]))
# Output: [[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        /**
         * Generate all possible subsets of the given vector of integers.
         * 
         * Args:
         *     nums: Vector of distinct integers
         * 
         * Returns:
         *     Vector of all possible subsets
         */
        vector<vector<int>> result;
        vector<int> current_subset;
        
        backtrack(0, nums, current_subset, result);
        return result;
    }
    
private:
    void backtrack(int start, vector<int>& nums, 
                   vector<int>& current_subset, 
                   vector<vector<int>>& result) {
        // Base case: we've processed all elements
        if (start == nums.size()) {
            result.push_back(current_subset);
            return;
        }
        
        // Decision 1: Exclude nums[start]
        backtrack(start + 1, nums, current_subset, result);
        
        // Decision 2: Include nums[start]
        current_subset.push_back(nums[start]);
        backtrack(start + 1, nums, current_subset, result);
        // Backtrack: remove last element for other paths
        current_subset.pop_back();
    }
};

// Example usage
// Solution sol;
// vector<int> nums = {1, 2, 3};
// auto result = sol.subsets(nums);
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        /**
         * Generate all possible subsets of the given array of integers.
         * 
         * Args:
         *     nums: Array of distinct integers
         * 
         * Returns:
         *     List of all possible subsets
         */
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> currentSubset = new ArrayList<>();
        
        backtrack(0, nums, currentSubset, result);
        return result;
    }
    
    private void backtrack(int start, int[] nums,
                           List<Integer> currentSubset,
                           List<List<Integer>> result) {
        // Base case: we've processed all elements
        if (start == nums.length) {
            result.add(new ArrayList<>(currentSubset));
            return;
        }
        
        // Decision 1: Exclude nums[start]
        backtrack(start + 1, nums, currentSubset, result);
        
        // Decision 2: Include nums[start]
        currentSubset.add(nums[start]);
        backtrack(start + 1, nums, currentSubset, result);
        // Backtrack: remove last element for other paths
        currentSubset.remove(currentSubset.size() - 1);
    }
}

// Example usage
// Solution sol = new Solution();
// int[] nums = {1, 2, 3};
// List<List<Integer>> result = sol.subsets(nums);
```

<!-- slide -->
```javascript
/**
 * Generate all possible subsets of the given array of integers.
 * 
 * @param {number[]} nums - Array of distinct integers
 * @return {number[][]} - Array of all possible subsets
 */
var subsets = function(nums) {
    const result = [];
    
    function backtrack(start, currentSubset) {
        // Base case: we've processed all elements
        if (start === nums.length) {
            result.push([...currentSubset]);
            return;
        }
        
        // Decision 1: Exclude nums[start]
        backtrack(start + 1, currentSubset);
        
        // Decision 2: Include nums[start]
        currentSubset.push(nums[start]);
        backtrack(start + 1, currentSubset);
        // Backtrack: remove last element for other paths
        currentSubset.pop();
    }
    
    backtrack(0, []);
    return result;
};

// Example usage
// const nums = [1, 2, 3];
// const result = subsets(nums);
// Output: [[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n × n) - 2^n subsets, each copied in O(n) time |
| **Space** | O(n × 2^n) - Storing all subsets, plus O(n) recursion stack |

---

## Approach 2: Iterative Bit Manipulation

This approach uses bit masks to represent subsets. Each bit in a number from 0 to 2^n - 1 represents whether an element is included or excluded.

### Algorithm Steps

1. Calculate total number of subsets: `total = 1 << n` (2^n)
2. For each number `mask` from 0 to `total - 1`:
   - Create an empty subset
   - For each index `i` from 0 to `n - 1`:
     - If the i-th bit of `mask` is set, include `nums[i]`
   - Add the subset to results
3. Return all collected subsets

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all possible subsets using bit manipulation.
        
        Args:
            nums: List of distinct integers
            
        Returns:
            List of all possible subsets
        """
        n = len(nums)
        total_subsets = 1 << n  # 2^n
        
        result = []
        
        for mask in range(total_subsets):
            current_subset = []
            for i in range(n):
                # Check if i-th bit is set in mask
                if mask & (1 << i):
                    current_subset.append(nums[i])
            result.append(current_subset)
        
        return result

# Example usage
# sol = Solution()
# print(sol.subsets([1, 2, 3]))
# Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        /**
         * Generate all possible subsets using bit manipulation.
         * 
         * Args:
         *     nums: Vector of distinct integers
         * 
         * Returns:
         *     Vector of all possible subsets
         */
        int n = nums.size();
        int total_subsets = 1 << n;  // 2^n
        
        vector<vector<int>> result;
        
        for (int mask = 0; mask < total_subsets; mask++) {
            vector<int> current_subset;
            for (int i = 0; i < n; i++) {
                // Check if i-th bit is set in mask
                if (mask & (1 << i)) {
                    current_subset.push_back(nums[i]);
                }
            }
            result.push_back(current_subset);
        }
        
        return result;
    }
};

// Example usage
// Solution sol;
// vector<int> nums = {1, 2, 3};
// auto result = sol.subsets(nums);
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        /**
         * Generate all possible subsets using bit manipulation.
         * 
         * Args:
         *     nums: Array of distinct integers
         * 
         * Returns:
         *     List of all possible subsets
         */
        int n = nums.length;
        int total_subsets = 1 << n;  // 2^n
        
        List<List<Integer>> result = new ArrayList<>();
        
        for (int mask = 0; mask < total_subsets; mask++) {
            List<Integer> current_subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                // Check if i-th bit is set in mask
                if ((mask & (1 << i)) != 0) {
                    current_subset.add(nums[i]);
                }
            }
            result.add(current_subset);
        }
        
        return result;
    }
}

// Example usage
// Solution sol = new Solution();
// int[] nums = {1, 2, 3};
// List<List<Integer>> result = sol.subsets(nums);
```

<!-- slide -->
```javascript
/**
 * Generate all possible subsets using bit manipulation.
 * 
 * @param {number[]} nums - Array of distinct integers
 * @return {number[][]} - Array of all possible subsets
 */
var subsets = function(nums) {
    const n = nums.length;
    const total_subsets = 1 << n;  // 2^n
    
    const result = [];
    
    for (let mask = 0; mask < total_subsets; mask++) {
        const current_subset = [];
        for (let i = 0; i < n; i++) {
            // Check if i-th bit is set in mask
            if (mask & (1 << i)) {
                current_subset.push(nums[i]);
            }
        }
        result.push(current_subset);
    }
    
    return result;
};

// Example usage
// const nums = [1, 2, 3];
// const result = subsets(nums);
// Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n × n) - Same as recursive approach |
| **Space** | O(2^n × n) - Storing all subsets |
| **Advantages** | No recursion overhead, easy to understand bit operations |

---

## Approach 3: BFS/Queue-Based Building

This approach builds subsets iteratively by adding each element to all existing subsets.

### Algorithm Steps

1. Start with an empty list containing one empty subset: `[[]]`
2. For each number in `nums`:
   - Create a new list of new subsets
   - For each existing subset in current results:
     - Create a copy and add the current number
     - Add this new subset to the new list
   - Add all new subsets to the results
3. Return all results

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all possible subsets using iterative building.
        
        Args:
            nums: List of distinct integers
            
        Returns:
            List of all possible subsets
        """
        result = [[]]  # Start with empty subset
        
        for num in nums:
            # Create new subsets by adding current num to existing subsets
            new_subsets = []
            for subset in result:
                new_subset = subset + [num]
                new_subsets.append(new_subset)
            # Add all new subsets to results
            result.extend(new_subsets)
        
        return result

# Example usage
# sol = Solution()
# print(sol.subsets([1, 2, 3]))
# Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        /**
         * Generate all possible subsets using iterative building.
         * 
         * Args:
         *     nums: Vector of distinct integers
         * 
         * Returns:
         *     Vector of all possible subsets
         */
        vector<vector<int>> result = {{}};  // Start with empty subset
        
        for (int num : nums) {
            // Create new subsets by adding current num to existing subsets
            vector<vector<int>> new_subsets;
            for (const auto& subset : result) {
                vector<int> new_subset = subset;
                new_subset.push_back(num);
                new_subsets.push_back(new_subset);
            }
            // Add all new subsets to results
            for (const auto& subset : new_subsets) {
                result.push_back(subset);
            }
        }
        
        return result;
    }
};

// Example usage
// Solution sol;
// vector<int> nums = {1, 2, 3};
// auto result = sol.subsets(nums);
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        /**
         * Generate all possible subsets using iterative building.
         * 
         * Args:
         *     nums: Array of distinct integers
         * 
         * Returns:
         *     List of all possible subsets
         */
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());  // Start with empty subset
        
        for (int num : nums) {
            // Create new subsets by adding current num to existing subsets
            List<List<Integer>> new_subsets = new ArrayList<>();
            for (List<Integer> subset : result) {
                List<Integer> new_subset = new ArrayList<>(subset);
                new_subset.add(num);
                new_subsets.add(new_subset);
            }
            // Add all new subsets to results
            result.addAll(new_subsets);
        }
        
        return result;
    }
}

// Example usage
// Solution sol = new Solution();
// int[] nums = {1, 2, 3};
// List<List<Integer>> result = sol.subsets(nums);
```

<!-- slide -->
```javascript
/**
 * Generate all possible subsets using iterative building.
 * 
 * @param {number[]} nums - Array of distinct integers
 * @return {number[][]} - Array of all possible subsets
 */
var subsets = function(nums) {
    const result = [[]];  // Start with empty subset
    
    for (const num of nums) {
        // Create new subsets by adding current num to existing subsets
        const new_subsets = [];
        for (const subset of result) {
            new_subsets.push([...subset, num]);
        }
        // Add all new subsets to results
        result.push(...new_subsets);
    }
    
    return result;
};

// Example usage
// const nums = [1, 2, 3];
// const result = subsets(nums);
// Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(2^n × n) - Same as other approaches |
| **Space** | O(2^n × n) - Storing all subsets |
| **Advantages** | No recursion, intuitive iterative process |

---

## Comparison of Approaches

| Aspect | Recursive (Include/Exclude) | Bit Manipulation | BFS Building |
|--------|----------------------------|------------------|--------------|
| **Time Complexity** | O(2^n × n) | O(2^n × n) | O(2^n × n) |
| **Space Complexity** | O(n × 2^n) | O(2^n × n) | O(2^n × n) |
| **Recursion Stack** | O(n) | O(1) | O(1) |
| **Implementation** | Moderate | Simple | Simple |
| **Readability** | High | Medium | High |
| **Flexibility** | High (easy to add constraints) | Low | Medium |
| **Best For** | Constraint-based subsets | Simple power set | Understanding subsets |

**Where:**
- n = number of elements
- 2^n = number of subsets (power set size)

---

## Why These Approaches Work

### Recursive Include/Exclude

The recursive approach naturally models the binary decision tree inherent in subset generation. Each function call represents a position in the array, and the two recursive calls represent the two choices (include or exclude). The recursion stack implicitly tracks the path taken, and backtracking ensures that state is properly managed when exploring alternative paths.

### Bit Manipulation

Every subset can be uniquely represented by a bit mask of length n, where each bit indicates whether the corresponding element is included (1) or excluded (0). By iterating through all possible masks from 0 to 2^n - 1, we generate all possible subsets. This approach is elegant because it directly maps mathematical subset representation to implementation.

### BFS Building

This approach builds subsets incrementally by recognizing a key insight: each new element can either be excluded (keeping all existing subsets) or included (creating new subsets by adding the element to each existing subset). This mirrors how subsets naturally grow and is often the most intuitive for understanding.

All three approaches fundamentally explore the same solution space but differ in how they traverse it:
- **Recursive**: Implicit tree traversal with call stack
- **Bit Manipulation**: Direct mathematical mapping
- **BFS**: Explicit level-by-level construction

---

## Handling Duplicates (Subsets II)

When the input contains duplicates, the basic approach generates duplicate subsets. To handle this, we need to skip duplicate elements during recursion.

### Algorithm with Duplicate Handling

1. **Sort the array first** - This groups duplicates together
2. **Skip duplicates** - When `i > start` and `nums[i] == nums[i-1]`, skip

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        """
        Generate all possible subsets handling duplicates.
        
        Args:
            nums: List of integers (may contain duplicates)
            
        Returns:
            List of all unique subsets
        """
        nums.sort()  # Sort to group duplicates
        result = []
        
        def backtrack(start: int, current_subset: List[int]) -> None:
            # Base case
            if start == len(nums):
                result.append(current_subset[:])
                return
            
            # Try including current element
            current_subset.append(nums[start])
            backtrack(start + 1, current_subset)
            current_subset.pop()
            
            # Skip duplicates
            while start + 1 < len(nums) and nums[start] == nums[start + 1]:
                start += 1
            
            # Try excluding current element (and all duplicates)
            backtrack(start + 1, current_subset)
        
        backtrack(0, [])
        return result

# Example usage
# sol = Solution()
# print(sol.subsetsWithDup([1, 2, 2]))
# Output: [[], [2], [2], [1], [1, 2], [1, 2], [1, 2, 2]] (unique: [[], [1], [2], [1, 2], [1, 2, 2]])
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        /**
         * Generate all possible subsets handling duplicates.
         * 
         * Args:
         *     nums: Vector of integers (may contain duplicates)
         * 
         * Returns:
         *     Vector of all unique subsets
         */
        sort(nums.begin(), nums.end());  // Sort to group duplicates
        vector<vector<int>> result;
        vector<int> current_subset;
        
        backtrack(0, nums, current_subset, result);
        return result;
    }
    
private:
    void backtrack(int start, vector<int>& nums,
                   vector<int>& current_subset,
                   vector<vector<int>>& result) {
        // Base case
        if (start == nums.size()) {
            result.push_back(current_subset);
            return;
        }
        
        // Try including current element
        current_subset.push_back(nums[start]);
        backtrack(start + 1, nums, current_subset, result);
        current_subset.pop_back();
        
        // Skip duplicates
        while (start + 1 < nums.size() && nums[start] == nums[start + 1]) {
            start++;
        }
        
        // Try excluding current element (and all duplicates)
        backtrack(start + 1, nums, current_subset, result);
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        /**
         * Generate all possible subsets handling duplicates.
         * 
         * Args:
         *     nums: Array of integers (may contain duplicates)
         * 
         * Returns:
         *     List of all unique subsets
         */
        Arrays.sort(nums);  // Sort to group duplicates
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> currentSubset = new ArrayList<>();
        
        backtrack(0, nums, currentSubset, result);
        return result;
    }
    
    private void backtrack(int start, int[] nums,
                           List<Integer> currentSubset,
                           List<List<Integer>> result) {
        // Base case
        if (start == nums.length) {
            result.add(new ArrayList<>(currentSubset));
            return;
        }
        
        // Try including current element
        currentSubset.add(nums[start]);
        backtrack(start + 1, nums, currentSubset, result);
        currentSubset.remove(currentSubset.size() - 1);
        
        // Skip duplicates
        while (start + 1 < nums.length && nums[start] == nums[start + 1]) {
            start++;
        }
        
        // Try excluding current element (and all duplicates)
        backtrack(start + 1, nums, currentSubset, result);
    }
}
```

<!-- slide -->
```javascript
/**
 * Generate all possible subsets handling duplicates.
 * 
 * @param {number[]} nums - Array of integers (may contain duplicates)
 * @return {number[][]} - Array of all unique subsets
 */
var subsetsWithDup = function(nums) {
    nums.sort((a, b) => a - b);  // Sort to group duplicates
    const result = [];
    
    function backtrack(start, currentSubset) {
        // Base case
        if (start === nums.length) {
            result.push([...currentSubset]);
            return;
        }
        
        // Try including current element
        currentSubset.push(nums[start]);
        backtrack(start + 1, currentSubset);
        currentSubset.pop();
        
        // Skip duplicates
        while (start + 1 < nums.length && nums[start] === nums[start + 1]) {
            start++;
        }
        
        // Try excluding current element (and all duplicates)
        backtrack(start + 1, currentSubset);
    }
    
    backtrack(0, []);
    return result;
};

// Example usage
// const nums = [1, 2, 2];
// const result = subsetsWithDup(nums);
// Output: [[], [1], [2], [1, 2], [2, 2], [1, 2, 2]]
```
````

---

## Template Summary

### Python Template (Recursive)

```python
from typing import List

def subsets_template(nums: List[int]) -> List[List[int]]:
    result = []
    
    def backtrack(start: int, current: List[int]) -> None:
        if start == len(nums):
            result.append(current[:])
            return
        
        # Exclude
        backtrack(start + 1, current)
        
        # Include
        current.append(nums[start])
        backtrack(start + 1, current)
        current.pop()
    
    backtrack(0, [])
    return result
```

### C++ Template (Recursive)

```cpp
#include <vector>
using namespace std;

void backtrack(int start, vector<int>& nums,
               vector<int>& current, vector<vector<int>>& result) {
    if (start == nums.size()) {
        result.push_back(current);
        return;
    }
    
    // Exclude
    backtrack(start + 1, nums, current, result);
    
    // Include
    current.push_back(nums[start]);
    backtrack(start + 1, nums, current, result);
    current.pop_back();
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> current;
    backtrack(0, nums, current, result);
    return result;
}
```

### Java Template (Recursive)

```java
import java.util.*;

void backtrack(int start, int[] nums, List<Integer> current, 
               List<List<Integer>> result) {
    if (start == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }
    
    // Exclude
    backtrack(start + 1, nums, current, result);
    
    // Include
    current.add(nums[start]);
    backtrack(start + 1, nums, current, result);
    current.remove(current.size() - 1);
}

List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    List<Integer> current = new ArrayList<>();
    backtrack(0, nums, current, result);
    return result;
}
```

### JavaScript Template (Recursive)

```javascript
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        if (start === nums.length) {
            result.push([...current]);
            return;
        }
        
        // Exclude
        backtrack(start + 1, current);
        
        // Include
        current.push(nums[start]);
        backtrack(start + 1, current);
        current.pop();
    }
    
    backtrack(0, []);
    return result;
}
```

---

## Related Problems

### Subset Generation Problems

- **[Subsets (LeetCode 78)](https://leetcode.com/problems/subsets/)** - Generate all possible subsets
- **[Subsets II (LeetCode 90)](https://leetcode.com/problems/subsets-ii/)** - Generate all unique subsets with duplicates
- **[Letter Case Permutation (LeetCode 784)](https://leetcode.com/problems/letter-case-permutation/)** - Generate all combinations with letter case changes

### Subset Sum Problems

- **[Subset Sum (GeeksforGeeks)](https://www.geeksforgeeks.org/subset-sum-problem-dp-25/)** - Check if subset equals target sum
- **[Partition Equal Subset Sum (LeetCode 416)](https://leetcode.com/problems/partition-equal-subset-sum/)** - Check if array can be partitioned
- **[Target Sum (LeetCode 494)](https://leetcode.com/problems/target-sum/)** - Find number of ways to reach target sum

### Combination Problems

- **[Combination Sum (LeetCode 39)](https://leetcode.com/problems/combination-sum/)** - Find combinations that sum to target
- **[Combination Sum II (LeetCode 40)](https://leetcode.com/problems/combination-sum-ii/)** - Combination sum with unique combinations
- **[Combination Sum III (LeetCode 216)](https://leetcode.com/problems/combination-sum-iii/)** - k numbers that sum to n

### Advanced Subset Problems

- **[Partition to K Equal Sum Subsets (LeetCode 698)](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)** - Divide array into k subsets
- **[Decode Ways II (LeetCode 639)](https://leetcode.com/problems/decode-ways-ii/)** - Count decodings with wildcards
- **[Number of Squareful Arrays (LeetCode 996)](https://leetcode.com/problems/number-of-squareful-arrays/)** - Count permutations with adjacent constraints

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining subsets and backtracking:

- **[Subsets - Backtracking Algorithm - LeetCode 78](https://www.youtube.com/watch?v=REOHvX1Wc24)** - Comprehensive explanation of subset generation
- **[Subsets II - LeetCode 90 Solution](https://www.youtube.com/watch?v=RvRUtc7mg6I)** - Handling duplicates in subsets
- **[Backtracking Algorithm Explained](https://www.youtube.com/watch?v=DK3A3R8X4Fk)** - General backtracking concept
- **[Subset Sum Problem - Backtracking](https://www.youtube.com/watch?v=sch9_w15M5Q)** - Subset sum with backtracking
- **[Combination Sum - LeetCode 39](https://www.youtube.com/watch?v=irKx7T0K9k4)** - Related combination problem
- **[Bit Manipulation for Subsets](https://www.youtube.com/watch?v=9al18sS55Xc)** - Alternative bit manipulation approach

---

## Follow-up Questions

### Q1: How would you modify the approach to find only subsets that sum to a target?

**Answer:** Add a parameter to track current sum and prune when it exceeds target (for positive numbers).

```python
def subsets_with_target_sum(nums, target):
    result = []
    
    def backtrack(start, current, current_sum):
        if current_sum == target:
            result.append(current[:])
            return
        if current_sum > target:  # Prune for positive numbers
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current, current_sum + nums[i])
            current.pop()
    
    backtrack(0, [], 0)
    return result
```

---

### Q2: How would you count the number of subsets that satisfy a condition without storing them?

**Answer:** Instead of appending subsets to results, increment a counter.

```python
def count_valid_subsets(nums, condition):
    count = 0
    
    def backtrack(start, current):
        nonlocal count
        if condition(current):
            count += 1
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return count
```

---

### Q3: What if you need to generate subsets in a specific order (e.g., by size)?

**Answer:** Collect subsets by size during generation or sort after generation.

```python
def subsets_by_size(nums):
    result = [[] for _ in range(len(nums) + 1)]
    
    def backtrack(start, current):
        result[len(current)].append(current[:])
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

---

### Q4: How would you handle the case where each element has a weight and you need subsets with weight limit?

**Answer:** Add a weight parameter and prune when weight exceeds limit.

```python
def subsets_with_weight_limit(items, limit):
    result = []
    
    def backtrack(start, current, current_weight):
        if current_weight <= limit:
            result.append(current[:])
        
        for i in range(start, len(items)):
            item, weight = items[i]
            if current_weight + weight <= limit:
                current.append(item)
                backtrack(i + 1, current, current_weight + weight)
                current.pop()
    
    backtrack(0, [], 0)
    return result
```

---

### Q5: How would you modify the approach for N-ary tree subset generation?

**Answer:** The approach remains the same - each node can be included or excluded.

```python
def subsets_nary_tree(root):
    result = []
    
    def backtrack(node):
        if not node:
            result.append([])  # Empty subset for null
            return
        
        # Include current node
        with_node = [node.val]
        
        # Process children
        for child in node.children:
            subsets_child = subsets_nary_tree(child)
            for subset in subsets_child:
                with_node.append(subset)
        
        result.append(with_node)
    
    backtrack(root)
    return result
```

---

### Q6: What's the difference between Subsets and Permutations problems?

**Answer:** Subsets don't care about order (each element used at most once), while permutations consider order and use all elements.

```python
# Subsets: Order doesn't matter
# [1, 2] and [2, 1] are the same subset

# Permutations: Order matters
# [1, 2] and [2, 1] are different permutations
```

---

### Q7: How would you optimize the recursive approach with memoization?

**Answer:** For problems with overlapping subproblems (like subset sum), use DP with memoization.

```python
def subset_sum_dp(nums, target):
    memo = {}
    
    def backtrack(index, current_sum):
        if current_sum == target:
            return True
        if current_sum > target:
            return False
        if (index, current_sum) in memo:
            return memo[(index, current_sum)]
        
        for i in range(index, len(nums)):
            if backtrack(i + 1, current_sum + nums[i]):
                return True
        
        memo[(index, current_sum)] = False
        return False
    
    return backtrack(0, 0)
```

---

### Q8: How would you implement this with iterative deepening?

**Answer:** For generating subsets of specific sizes, use depth-limited search.

```python
def subsets_of_size_k(nums, k):
    result = []
    
    def backtrack(start, current, depth):
        if depth == k:
            result.append(current[:])
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current, depth + 1)
            current.pop()
    
    backtrack(0, [], 0)
    return result
```

---

## Summary

The Backtracking - Subsets (Include/Exclude) pattern is a powerful approach for generating and exploring all possible subsets of a collection. Key takeaways:

1. **Binary Decision Tree**: Each element has two choices - include or exclude
2. **Recursion naturally models this**: The call stack tracks the current path
3. **Backtracking is essential**: Ensures clean state for sibling branches
4. **Multiple approaches available**: Recursive, bit manipulation, and iterative
5. **Handle duplicates carefully**: Sort and skip duplicates to avoid redundancy
6. **Complexity is inherent**: O(2^n) is the lower bound for subset generation

This pattern forms the foundation for many combinatorial problems and is frequently asked in technical interviews. Understanding the intuition and mastering all three approaches will help you tackle a wide range of subset-related challenges.

---

## Additional Resources

- [LeetCode Subsets Problem](https://leetcode.com/problems/subsets/) - Official problem and solutions
- [LeetCode Subsets II Problem](https://leetcode.com/problems/subsets-ii/) - Duplicate handling problem
- [Power Set - GeeksforGeeks](https://www.geeksforgeeks.org/power-set/) - Comprehensive power set guide
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - General backtracking algorithms
- [Subset Sum - Brilliant](https://brilliant.org/practice/subset-sum/) - Interactive subset sum practice
