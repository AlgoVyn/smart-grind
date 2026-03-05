# Backtracking - Subsets (Include/Exclude)

## Problem Description

The Backtracking - Subsets (Include/Exclude) pattern is a fundamental combinatorial problem-solving approach that systematically explores all possible subsets of a given set by making binary decisions for each element. At every position in the input array, the algorithm decides whether to include the current element in the current subset or exclude it. This creates a decision tree where each path represents a unique subset, making it essential for problems requiring exhaustive search through combinations.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(2^n × n) - 2^n subsets, each takes O(n) to copy |
| Space Complexity | O(n) for recursion stack, O(n × 2^n) for storing all subsets |
| Input | Array of distinct (or possibly duplicate) elements |
| Output | All possible subsets (power set) of the input |
| Approach | DFS with binary include/exclude decisions |

### When to Use
- Generating all possible subsets (power set problem)
- Finding subsets with specific sum (subset sum problem)
- Partition problems (equal subset partition)
- Combination problems with element selection constraints
- Problems requiring exhaustive search through combinations
- When each element has a binary choice (include/exclude)
- Small to medium input sizes where exponential is acceptable

## Intuition

The key insight is that each element contributes a binary choice: either it belongs to a subset or it doesn't. For n elements, there are exactly 2^n possible subsets.

The "aha!" moments:
1. **Binary decision tree**: Each element creates two branches (include/exclude)
2. **Power set size**: n elements → 2^n subsets (including empty set)
3. **Recursion models decisions**: Each call represents processing one element
4. **Base case completes subset**: When all elements processed, subset is complete
5. **Backtracking cleans state**: Removing elements ensures clean state for siblings

## Solution Approaches

### Approach 1: Recursive Include/Exclude (Optimal) ✅ Recommended

#### Algorithm
1. Define recursive helper with `start` index and `current` subset
2. Base case: if `start == len(nums)`, add copy of current to results and return
3. **Decision 1 - Exclude**: Call `backtrack(start + 1, current)`
4. **Decision 2 - Include**: 
   - Add `nums[start]` to current
   - Call `backtrack(start + 1, current)`
   - Backtrack: remove last element

#### Implementation

````carousel
```python
def subsets(nums):
    """
    Generate all possible subsets using include/exclude backtracking.
    LeetCode 78 - Subsets
    
    Time: O(2^n × n), Space: O(n) for recursion
    """
    def backtrack(start, current):
        # Base case: processed all elements
        if start == len(nums):
            result.append(current[:])  # Add copy
            return
        
        # Decision 1: Exclude nums[start]
        backtrack(start + 1, current)
        
        # Decision 2: Include nums[start]
        current.append(nums[start])
        backtrack(start + 1, current)
        current.pop()  # Backtrack
    
    result = []
    backtrack(0, [])
    return result
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
        std::vector<std::vector<int>> result;
        std::vector<int> current;
        backtrack(0, nums, current, result);
        return result;
    }
    
private:
    void backtrack(int start, std::vector<int>& nums,
                   std::vector<int>& current,
                   std::vector<std::vector<int>>& result) {
        // Base case: processed all elements
        if (start == nums.size()) {
            result.push_back(current);
            return;
        }
        
        // Decision 1: Exclude nums[start]
        backtrack(start + 1, nums, current, result);
        
        // Decision 2: Include nums[start]
        current.push_back(nums[start]);
        backtrack(start + 1, nums, current, result);
        current.pop_back();  // Backtrack
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(0, nums, current, result);
        return result;
    }
    
    private void backtrack(int start, int[] nums,
                          List<Integer> current, List<List<Integer>> result) {
        // Base case: processed all elements
        if (start == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        // Decision 1: Exclude nums[start]
        backtrack(start + 1, nums, current, result);
        
        // Decision 2: Include nums[start]
        current.add(nums[start]);
        backtrack(start + 1, nums, current, result);
        current.remove(current.size() - 1);  // Backtrack
    }
}
```
<!-- slide -->
```javascript
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        // Base case: processed all elements
        if (start === nums.length) {
            result.push([...current]);
            return;
        }
        
        // Decision 1: Exclude nums[start]
        backtrack(start + 1, current);
        
        // Decision 2: Include nums[start]
        current.push(nums[start]);
        backtrack(start + 1, current);
        current.pop();  // Backtrack
    }
    
    backtrack(0, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n × n) - 2^n subsets, O(n) to copy each |
| Space | O(n) for recursion stack |

### Approach 2: Iterative Bit Manipulation

Uses bit masks to represent subsets. Each bit in a number from 0 to 2^n - 1 indicates whether an element is included.

#### Implementation

````carousel
```python
def subsets_bitmask(nums):
    """
    Generate subsets using bit manipulation.
    Each mask represents which elements are included.
    """
    n = len(nums)
    total_subsets = 1 << n  # 2^n
    result = []
    
    for mask in range(total_subsets):
        current = []
        for i in range(n):
            # Check if i-th bit is set
            if mask & (1 << i):
                current.append(nums[i])
        result.append(current)
    
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
        int n = nums.size();
        int total = 1 << n;  // 2^n
        std::vector<std::vector<int>> result;
        
        for (int mask = 0; mask < total; mask++) {
            std::vector<int> current;
            for (int i = 0; i < n; i++) {
                if (mask & (1 << i)) {
                    current.push_back(nums[i]);
                }
            }
            result.push_back(current);
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        int total = 1 << n;  // 2^n
        List<List<Integer>> result = new ArrayList<>();
        
        for (int mask = 0; mask < total; mask++) {
            List<Integer> current = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    current.add(nums[i]);
                }
            }
            result.add(current);
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function subsets(nums) {
    const n = nums.length;
    const total = 1 << n;  // 2^n
    const result = [];
    
    for (let mask = 0; mask < total; mask++) {
        const current = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                current.push(nums[i]);
            }
        }
        result.push(current);
    }
    
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n × n) - same as recursive |
| Space | O(1) auxiliary (no recursion stack) |

### Approach 3: BFS/Iterative Building

Builds subsets iteratively by adding each element to all existing subsets.

#### Implementation

````carousel
```python
def subsets_iterative(nums):
    """
    Generate subsets iteratively by building up.
    """
    result = [[]]  # Start with empty subset
    
    for num in nums:
        # Create new subsets by adding num to existing subsets
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<int>> subsets(std::vector<int>& nums) {
        std::vector<std::vector<int>> result = {{}};
        
        for (int num : nums) {
            int size = result.size();
            for (int i = 0; i < size; i++) {
                std::vector<int> new_subset = result[i];
                new_subset.push_back(num);
                result.push_back(new_subset);
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());
        
        for (int num : nums) {
            int size = result.size();
            for (int i = 0; i < size; i++) {
                List<Integer> new_subset = new ArrayList<>(result.get(i));
                new_subset.add(num);
                result.add(new_subset);
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function subsets(nums) {
    let result = [[]];
    
    for (const num of nums) {
        const new_subsets = result.map(subset => [...subset, num]);
        result = result.concat(new_subsets);
    }
    
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n × n) - same as other approaches |
| Space | O(1) auxiliary (no recursion stack) |

### Approach 4: Handling Duplicates (Subsets II)

When the input contains duplicates, sort first and skip duplicates to avoid duplicate subsets.

#### Implementation

````carousel
```python
def subsets_with_dup(nums):
    """
    Generate all unique subsets when input has duplicates.
    LeetCode 90 - Subsets II
    """
    def backtrack(start, current):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates at the same level
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    nums.sort()
    result = []
    backtrack(0, [])
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<int>> subsetsWithDup(std::vector<int>& nums) {
        std::sort(nums.begin(), nums.end());
        std::vector<std::vector<int>> result;
        std::vector<int> current;
        backtrack(0, nums, current, result);
        return result;
    }
    
private:
    void backtrack(int start, std::vector<int>& nums,
                   std::vector<int>& current,
                   std::vector<std::vector<int>>& result) {
        result.push_back(current);
        
        for (int i = start; i < nums.size(); i++) {
            // Skip duplicates
            if (i > start && nums[i] == nums[i - 1]) continue;
            
            current.push_back(nums[i]);
            backtrack(i + 1, nums, current, result);
            current.pop_back();
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(0, nums, current, result);
        return result;
    }
    
    private void backtrack(int start, int[] nums,
                          List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        
        for (int i = start; i < nums.length; i++) {
            // Skip duplicates
            if (i > start && nums[i] == nums[i - 1]) continue;
            
            current.add(nums[i]);
            backtrack(i + 1, nums, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```
<!-- slide -->
```javascript
function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    function backtrack(start, current) {
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            // Skip duplicates
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(2^n × n) - same as standard subsets |
| Space | O(n) for recursion stack |

## Complexity Analysis

| Approach | Time | Space | Recursion Stack | Best For |
|----------|------|-------|-----------------|----------|
| Include/Exclude | O(2^n × n) | O(n × 2^n) | O(n) | **Recommended** - most intuitive |
| Bit Manipulation | O(2^n × n) | O(n × 2^n) | O(1) | No recursion overhead |
| Iterative BFS | O(2^n × n) | O(n × 2^n) | O(1) | Understanding subset building |
| With Duplicates | O(2^n × n) | O(n × 2^n) | O(n) | When input has duplicates |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Subsets](https://leetcode.com/problems/subsets/) | 78 | Medium | Generate all possible subsets |
| [Subsets II](https://leetcode.com/problems/subsets-ii/) | 90 | Medium | All unique subsets with duplicates |
| [Combination Sum](https://leetcode.com/problems/combination-sum/) | 39 | Medium | Subsets that sum to target |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | 416 | Medium | Can array be partitioned equally |
| [Target Sum](https://leetcode.com/problems/target-sum/) | 494 | Medium | Count ways to reach target |
| [Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/) | 784 | Medium | Generate all case permutations |
| [Count Number of Maximum Bitwise OR Subsets](https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets/) | 2044 | Medium | Count subsets with max OR |

## Video Tutorial Links

1. **[NeetCode - Subsets](https://www.youtube.com/watch?v=REOHvX1Wc24)** - Include/exclude backtracking
2. **[Back To Back SWE - Subsets](https://www.youtube.com/watch?v=REOHvX1Wc24)** - Decision tree visualization
3. **[Kevin Naughton Jr. - LeetCode 78](https://www.youtube.com/watch?v=REOHvX1Wc24)** - Clean implementation
4. **[Nick White - Subsets](https://www.youtube.com/watch?v=REOHvX1Wc24)** - Step-by-step trace
5. **[Techdose - Subsets Backtracking](https://www.youtube.com/watch?v=REOHvX1Wc24)** - Pattern explanation

## Summary

### Key Takeaways
- **Binary decisions**: Each element has two choices - include or exclude
- **2^n subsets**: Mathematical lower bound for power set generation
- **Base case**: When `start == len(nums)`, subset is complete
- **Backtracking essential**: Remove element after recursion for sibling branches
- **Handle duplicates**: Sort array first, then skip `nums[i] == nums[i-1]` when `i > start`
- **Multiple approaches**: Recursive, bit manipulation, and iterative all work

### Common Pitfalls
- Forgetting to copy current subset when adding to results (reference issues)
- Not handling duplicates properly (results in duplicate subsets)
- Confusing include/exclude order (both orders work, be consistent)
- Stack overflow for large n (consider iterative approaches)
- Off-by-one errors in bitmask operations

### Follow-up Questions
1. **How would you find subsets that sum to a target?**
   - Add sum parameter, prune when sum > target (for positive numbers)

2. **What if you need exactly k elements in each subset?**
   - Add size parameter, only add to results when `len(current) == k`

3. **How would you count subsets without storing them?**
   - Use counter instead of result list

4. **Can you optimize with memoization?**
   - Generally not needed for pure generation; useful for constrained variants

## Pattern Source

[Subsets Include/Exclude Pattern](patterns/backtracking-subsets-include-exclude.md)
