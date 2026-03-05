# Backtracking - Permutations

## Problem Description

The Backtracking - Permutations pattern generates all possible arrangements (permutations) of elements in a given set by systematically swapping elements and exploring different orderings through recursion. This pattern is essential for problems requiring exhaustive exploration of all possible sequences or arrangements, such as generating all possible orders of items or solving puzzles involving rearrangement.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n × n!) - n! permutations, each takes O(n) to copy |
| Space Complexity | O(n) for recursion stack, O(n × n!) for results |
| Input | Array of distinct (or possibly duplicate) elements |
| Output | All possible permutations of the input |
| Approach | DFS with backtracking via swapping |

### When to Use
- Generating all possible orderings of elements
- Problems requiring exhaustive search through arrangements
- Finding valid permutations that satisfy certain constraints
- Anagram generation and string permutation problems
- Scheduling and ordering problems
- Problems where the order of elements matters

## Intuition

The key insight is to build permutations by swapping elements into each position and recursively generating permutations of the remaining elements.

The "aha!" moments:
1. **Swapping mechanism**: Place each element at the current position by swapping
2. **Recursion depth**: Each level of recursion fixes one position
3. **Backtracking**: Swap back to restore original order for next iteration
4. **Base case**: When `start` reaches end of array, we have a complete permutation
5. **Duplicate handling**: Skip swaps that would create identical permutations

## Solution Approaches

### Approach 1: Swap-based Backtracking (Optimal) ✅ Recommended

#### Algorithm
1. Use recursive helper with `start` index parameter
2. Base case: if `start == len(nums)`, add current permutation to results
3. For each index `i` from `start` to end:
   - Swap `nums[start]` with `nums[i]` to place element `i` at position `start`
   - Recurse with `start + 1`
   - Backtrack: swap back to restore original order

#### Implementation

````carousel
```python
def permute(nums):
    """
    Generate all permutations using swap-based backtracking.
    LeetCode 46 - Permutations
    
    Time: O(n * n!), Space: O(n) for recursion
    """
    def backtrack(start):
        # Base case: all positions filled
        if start == len(nums):
            result.append(nums[:])  # Add copy
            return
        
        # Try each element at current position
        for i in range(start, len(nums)):
            # Swap to place nums[i] at position 'start'
            nums[start], nums[i] = nums[i], nums[start]
            
            # Recurse to fill next position
            backtrack(start + 1)
            
            # Backtrack: restore original order
            nums[start], nums[i] = nums[i], nums[start]
    
    result = []
    backtrack(0)
    return result
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> permute(std::vector<int>& nums) {
        std::vector<std::vector<int>> result;
        backtrack(nums, 0, result);
        return result;
    }
    
private:
    void backtrack(std::vector<int>& nums, int start, 
                   std::vector<std::vector<int>>& result) {
        // Base case: all positions filled
        if (start == nums.size()) {
            result.push_back(nums);
            return;
        }
        
        // Try each element at current position
        for (int i = start; i < nums.size(); i++) {
            // Swap to place nums[i] at position 'start'
            std::swap(nums[start], nums[i]);
            
            // Recurse to fill next position
            backtrack(nums, start + 1, result);
            
            // Backtrack: restore original order
            std::swap(nums[start], nums[i]);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, result);
        return result;
    }
    
    private void backtrack(int[] nums, int start, List<List<Integer>> result) {
        // Base case: all positions filled
        if (start == nums.length) {
            // Convert array to list
            List<Integer> current = new ArrayList<>();
            for (int num : nums) current.add(num);
            result.add(current);
            return;
        }
        
        // Try each element at current position
        for (int i = start; i < nums.length; i++) {
            // Swap to place nums[i] at position 'start'
            swap(nums, start, i);
            
            // Recurse to fill next position
            backtrack(nums, start + 1, result);
            
            // Backtrack: restore original order
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
function permute(nums) {
    const result = [];
    
    function backtrack(start) {
        // Base case: all positions filled
        if (start === nums.length) {
            result.push([...nums]);  // Add copy
            return;
        }
        
        // Try each element at current position
        for (let i = start; i < nums.length; i++) {
            // Swap to place nums[i] at position 'start'
            [nums[start], nums[i]] = [nums[i], nums[start]];
            
            // Recurse to fill next position
            backtrack(start + 1);
            
            // Backtrack: restore original order
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    
    backtrack(0);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n × n!) - n! permutations, O(n) to copy each |
| Space | O(n) for recursion stack |

### Approach 2: Used Array (No Swapping)

This approach uses a boolean array to track which elements have been used, building permutations without modifying the original array.

#### Implementation

````carousel
```python
def permute_used_array(nums):
    """
    Generate permutations using used[] array.
    Doesn't modify original array, uses more space.
    """
    def backtrack(current, used):
        # Base case: permutation complete
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        # Try each unused element
        for i in range(len(nums)):
            if used[i]:
                continue
            
            # Include nums[i]
            used[i] = True
            current.append(nums[i])
            
            backtrack(current, used)
            
            # Backtrack
            current.pop()
            used[i] = False
    
    result = []
    backtrack([], [False] * len(nums))
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<int>> permute(std::vector<int>& nums) {
        std::vector<std::vector<int>> result;
        std::vector<int> current;
        std::vector<bool> used(nums.size(), false);
        backtrack(nums, current, used, result);
        return result;
    }
    
private:
    void backtrack(std::vector<int>& nums, std::vector<int>& current,
                   std::vector<bool>& used, std::vector<std::vector<int>>& result) {
        if (current.size() == nums.size()) {
            result.push_back(current);
            return;
        }
        
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            
            used[i] = true;
            current.push_back(nums[i]);
            backtrack(nums, current, used, result);
            current.pop_back();
            used[i] = false;
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        backtrack(nums, current, used, result);
        return result;
    }
    
    private void backtrack(int[] nums, List<Integer> current,
                          boolean[] used, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, current, used, result);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
}
```
<!-- slide -->
```javascript
function permute(nums) {
    const result = [];
    const current = [];
    const used = new Array(nums.length).fill(false);
    
    function backtrack() {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            
            used[i] = true;
            current.push(nums[i]);
            backtrack();
            current.pop();
            used[i] = false;
        }
    }
    
    backtrack();
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n × n!) |
| Space | O(n) for recursion + O(n) for used array |

### Approach 3: Handling Duplicates (Permutations II)

When the input contains duplicates, we need to skip identical elements to avoid duplicate permutations.

#### Implementation

````carousel
```python
def permute_unique(nums):
    """
    Generate unique permutations when input has duplicates.
    LeetCode 47 - Permutations II
    """
    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        
        seen = set()  # Track elements used at this position
        for i in range(start, len(nums)):
            if nums[i] in seen:
                continue  # Skip duplicate
            seen.add(nums[i])
            
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    
    result = []
    backtrack(0)
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    std::vector<std::vector<int>> permuteUnique(std::vector<int>& nums) {
        std::vector<std::vector<int>> result;
        backtrack(nums, 0, result);
        return result;
    }
    
private:
    void backtrack(std::vector<int>& nums, int start,
                   std::vector<std::vector<int>>& result) {
        if (start == nums.size()) {
            result.push_back(nums);
            return;
        }
        
        std::unordered_set<int> seen;
        for (int i = start; i < nums.size(); i++) {
            if (seen.count(nums[i])) continue;
            seen.insert(nums[i]);
            
            std::swap(nums[start], nums[i]);
            backtrack(nums, start + 1, result);
            std::swap(nums[start], nums[i]);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, result);
        return result;
    }
    
    private void backtrack(int[] nums, int start, List<List<Integer>> result) {
        if (start == nums.length) {
            List<Integer> current = new ArrayList<>();
            for (int num : nums) current.add(num);
            result.add(current);
            return;
        }
        
        Set<Integer> seen = new HashSet<>();
        for (int i = start; i < nums.length; i++) {
            if (seen.contains(nums[i])) continue;
            seen.add(nums[i]);
            
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
function permuteUnique(nums) {
    const result = [];
    
    function backtrack(start) {
        if (start === nums.length) {
            result.push([...nums]);
            return;
        }
        
        const seen = new Set();
        for (let i = start; i < nums.length; i++) {
            if (seen.has(nums[i])) continue;
            seen.add(nums[i]);
            
            [nums[start], nums[i]] = [nums[i], nums[start]];
            backtrack(start + 1);
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    
    backtrack(0);
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n × n!) in worst case, but often less with duplicates |
| Space | O(n) for recursion + O(n) for seen set |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Swap-based | O(n × n!) | O(n) | **Recommended** - in-place, efficient |
| Used Array | O(n × n!) | O(n) | When you can't modify input |
| With Duplicates | O(n × n!) | O(n) | When input has duplicates |
| Next Permutation | O(n!) | O(1) | When you need iterative generation |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Permutations](https://leetcode.com/problems/permutations/) | 46 | Medium | All permutations of distinct integers |
| [Permutations II](https://leetcode.com/problems/permutations-ii/) | 47 | Medium | All unique permutations with duplicates |
| [Next Permutation](https://leetcode.com/problems/next-permutation/) | 31 | Medium | Find next lexicographical permutation |
| [Permutation Sequence](https://leetcode.com/problems/permutation-sequence/) | 60 | Hard | Find kth permutation without generating all |
| [Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/) | 784 | Medium | Generate all case permutations |
| [Combinations](https://leetcode.com/problems/combinations/) | 77 | Medium | All k-combinations from n elements |
| [Subsets](https://leetcode.com/problems/subsets/) | 78 | Medium | All subsets of a set |
| [Palindrome Permutation II](https://leetcode.com/problems/palindrome-permutation-ii/) | 267 | Medium | Generate palindrome permutations |

## Video Tutorial Links

1. **[NeetCode - Permutations](https://www.youtube.com/watch?v=FZe0UqITmxQ)** - Swap-based backtracking explanation
2. **[Back To Back SWE - Permutations](https://www.youtube.com/watch?v=FZe0UqITmxQ)** - Decision tree visualization
3. **[Kevin Naughton Jr. - LeetCode 46](https://www.youtube.com/watch?v=FZe0UqITmxQ)** - Clean implementation
4. **[Nick White - Permutations](https://www.youtube.com/watch?v=FZe0UqITmxQ)** - Step-by-step trace
5. **[Techdose - Permutations Backtracking](https://www.youtube.com/watch?v=FZe0UqITmxQ)** - Pattern explanation

## Summary

### Key Takeaways
- **Swap-based approach** is most efficient: O(1) per swap, in-place
- **Base case**: `start == len(nums)` means complete permutation found
- **Backtracking**: Always swap back to restore original order
- **Duplicates**: Use a set to track elements used at each position
- **When to apply**: Any problem requiring all orderings or arrangements

### Common Pitfalls
- Modifying input array without backtracking (swap back after recursion)
- Not copying the array when adding to results (reference issues)
- Forgetting to handle duplicates (results in duplicate permutations)
- Stack overflow for large n (n > 10 can be slow)
- Off-by-one errors in loop bounds

### Follow-up Questions
1. **How would you generate permutations iteratively?**
   - Use the "next permutation" algorithm repeatedly

2. **What if you need the kth permutation directly?**
   - Use factorial number system (LeetCode 60 approach)

3. **How would you solve this for strings with duplicate characters?**
   - Same approach, use set to skip identical characters

4. **Can you solve this with BFS instead of DFS?**
   - Yes, but less intuitive; use queue to track partial permutations

## Pattern Source

[Permutations Pattern](patterns/backtracking-permutations.md)
