# Permutations

## Category
Backtracking

## Description

The Permutations problem is a classic backtracking algorithm that generates all possible arrangements (orderings) of elements in a collection. This fundamental technique is essential for solving many combinatorial problems in computer science, including generating all possible combinations, solving constraint satisfaction problems (like N-Queens), and exploring all possible paths in graphs.

The key insight behind generating permutations is the **factorial growth** pattern: for n distinct elements, there are exactly n! (n factorial) possible arrangements. The backtracking approach systematically explores all these arrangements by building permutations incrementally and "backtracking" (undoing choices) to explore alternative paths.

---

## When to Use

Use the Permutations algorithm when you need to solve problems involving:

- **Generating All Orderings**: When you need to explore all possible arrangements of elements
- **Combinatorial Search**: When the solution requires trying all possible combinations
- **Constraint Satisfaction**: When you need to find all valid configurations under given constraints
- **Permutation-based Problems**: When problems explicitly ask for all permutations or arrangements

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| **Backtracking (Swap)** | O(n! × n) | O(n) | In-place generation, memory-efficient |
| **Backtracking (Used Array)** | O(n! × n) | O(n) + O(n!) for results | Explicit tracking, easier to follow |
| **Heap's Algorithm** | O(n!) | O(n) | Minimal swaps, generating in near-optimal order |
| **Iterative** | O(n! × n) | O(n!) | When recursion is not preferred |

### When to Choose Each Approach

- **Choose Swap-based Backtracking** when:
  - Memory is constrained
  - You want in-place generation
  - You need to understand the algorithm's mechanics

- **Choose Used Array Backtracking** when:
  - Elements may have duplicates (with slight modification)
  - Code clarity is prioritized
  - You need to track which elements are currently in the permutation

- **Choose Heap's Algorithm** when:
  - You need minimum number of swaps
  - Generating permutations in a specific order matters

---

## Algorithm Explanation

### Core Concept

The backtracking approach to generating permutations works like exploring a decision tree:

1. **Decision Tree**: Each level represents a position in the permutation
2. **Branching**: At each position, try each available element
3. **Backtracking**: After exploring a path, undo the choice to try other elements
4. **Base Case**: When all positions are filled, we have a complete permutation

### How It Works

#### Approach 1: Swap-based Backtracking (In-Place)

This approach swaps elements in place to generate permutations without additional space for tracking used elements:

1. **Start**: Begin at position 0
2. **Choose**: For each position, try each element from current position to end
3. **Swap**: Move the chosen element to the current position
4. **Recurse**: Generate permutations for the remaining positions
5. **Backtrack**: Swap back to restore original order
6. **Base Case**: When all positions are filled, add the current arrangement to results

#### Approach 2: Used Array Backtracking

This approach explicitly tracks which elements have been used:

1. **Track**: Maintain a `used` boolean array
2. **Choose**: Select any unused element
3. **Mark**: Mark element as used and add to current permutation
4. **Recurse**: Build the rest of the permutation
5. **Backtrack**: Unmark as used and remove from current permutation
6. **Base Case**: When permutation is complete, add to results

### Visual Representation

For input `[1, 2, 3]`, the decision tree:

```
                    [ ]
                   / | \
                  1  2  3
                 /|  |\
                2 3 1 3  ...
               /|  |  ...
              3 2  ...
              
Result: [1,2,3] → [1,3,2] → [2,1,3] → [2,3,1] → [3,2,1] → [3,1,2]
```

### Why Backtracking Works

- **Completeness**: Every possible permutation is explored
- **Correctness**: Each path produces a valid permutation
- **Efficiency**: Avoids generating duplicates by carefully managing choices
- **Memory**: Only O(n) recursion depth needed, not O(n!)

### Handling Duplicates

For arrays with duplicate elements, add a check to skip duplicate elements at the same level:

```python
# Skip duplicates: only use element at position i if it's the first occurrence
# at this level (or if previous same element was not used)
if i > start and nums[i] == nums[i-1]:
    continue  # Skip duplicates
```

---

## Algorithm Steps

### Building Permutations (Swap-based)

1. **Initialize**: Create an empty result array
2. **Define Recursive Function**:
   - Base case: if `start == n`, add current array to results
   - Recursive case: for each `i` from `start` to `n-1`:
     - Swap `nums[start]` and `nums[i]`
     - Recurse with `start + 1`
     - Swap back (backtrack)
3. **Call**: Start recursion with `start = 0`
4. **Return**: Return the result array

### Building Permutations (Used Array)

1. **Initialize**: Create empty result array, `used` array, and `current` permutation
2. **Define Recursive Function**:
   - Base case: if `len(current) == n`, add to results
   - Recursive case: for each index `i` from 0 to `n-1`:
     - If `not used[i]`, then:
       - Mark `used[i] = True`
       - Add `nums[i]` to `current`
       - Recurse
       - Backtrack: remove from `current`, mark `used[i] = False`
3. **Return**: Return the result array

---

## Implementation

### Template Code (Backtracking Approaches)

````carousel
```python
from typing import List
from itertools import permutations as itertools_permutations

def permute(nums: List[int]) -> List[List[int]]:
    """
    Generate all permutations of an array using backtracking (swap method).
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of all possible permutations
    
    Time Complexity: O(n! × n)
    Space Complexity: O(n) for recursion stack
    """
    result = []
    n = len(nums)
    
    def backtrack(start: int):
        # Base case: all positions filled
        if start == n:
            result.append(nums[:])  # Make a copy
            return
        
        # Try each element from start to end
        for i in range(start, n):
            # Swap element into position
            nums[start], nums[i] = nums[i], nums[start]
            # Recurse for remaining positions
            backtrack(start + 1)
            # Backtrack: restore original order
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result


def permute_with_used(nums: List[int]) -> List[List[int]]:
    """
    Alternative implementation using a used array.
    More intuitive and handles duplicates better.
    
    Args:
        nums: List of distinct integers
    
    Returns:
        List of all possible permutations
    
    Time Complexity: O(n! × n)
    Space Complexity: O(n) for recursion stack + O(n) for used array
    """
    result = []
    n = len(nums)
    used = [False] * n
    current = []
    
    def backtrack():
        # Base case: permutation complete
        if len(current) == n:
            result.append(current[:])
            return
        
        # Try each unused element
        for i in range(n):
            if not used[i]:
                used[i] = True
                current.append(nums[i])
                backtrack()
                current.pop()
                used[i] = False
    
    backtrack()
    return result


def permute_with_duplicates(nums: List[int]) -> List[List[int]]:
    """
    Generate permutations for arrays with duplicate elements.
    Uses sorting and skip logic to avoid duplicates.
    
    Args:
        nums: List of integers (may contain duplicates)
    
    Returns:
        List of unique permutations
    
    Time Complexity: O(n! × n) in worst case
    Space Complexity: O(n) for recursion stack
    """
    result = []
    n = len(nums)
    nums.sort()  # Sort to group duplicates together
    
    def backtrack(start: int):
        if start == n:
            result.append(nums[:])
            return
        
        for i in range(start, n):
            # Skip duplicates: only use nums[i] if it's the first at this level
            if i > start and nums[i] == nums[i - 1]:
                continue
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result


# Example usage and demonstration
if __name__ == "__main__":
    # Test case 1: Basic permutation
    nums = [1, 2, 3]
    result = permute(nums)
    print(f"Input: {nums}")
    print(f"Number of permutations: {len(result)}")
    print("Permutations:")
    for p in result:
        print(f"  {p}")
    
    print()
    
    # Test case 2: With duplicates
    nums_dup = [1, 1, 2]
    result_dup = permute_with_duplicates(nums_dup)
    print(f"Input with duplicates: {nums_dup}")
    print(f"Number of unique permutations: {len(result_dup)}")
    print("Unique Permutations:")
    for p in result_dup:
        print(f"  {p}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

/**
 * Generate all permutations using backtracking (swap method).
 * 
 * Time Complexity: O(n! × n)
 * Space Complexity: O(n) for recursion stack
 */
class Permutations {
public:
    static void permute(vector<int>& nums, int start, vector<vector<int>>& result) {
        int n = nums.size();
        
        // Base case: all positions filled
        if (start == n) {
            result.push_back(nums);
            return;
        }
        
        // Try each element from start to end
        for (int i = start; i < n; i++) {
            // Swap element into position
            swap(nums[start], nums[i]);
            // Recurse for remaining positions
            permute(nums, start + 1, result);
            // Backtrack: restore original order
            swap(nums[start], nums[i]);
        }
    }
    
    static vector<vector<int>> generatePermutations(vector<int> nums) {
        vector<vector<int>> result;
        permute(nums, 0, result);
        return result;
    }
};

/**
 * Generate permutations with used array tracking.
 * Better for handling duplicates and more intuitive.
 */
class PermutationsWithUsed {
public:
    static void permute(const vector<int>& nums, int index,
                        vector<bool>& used, vector<int>& current,
                        vector<vector<int>>& result) {
        int n = nums.size();
        
        // Base case: permutation complete
        if (index == n) {
            result.push_back(current);
            return;
        }
        
        // Try each unused element
        for (int i = 0; i < n; i++) {
            if (!used[i]) {
                used[i] = true;
                current.push_back(nums[i]);
                permute(nums, index + 1, used, current, result);
                current.pop_back();
                used[i] = false;
            }
        }
    }
    
    static vector<vector<int>> generatePermutations(vector<int> nums) {
        vector<vector<int>> result;
        vector<bool> used(nums.size(), false);
        vector<int> current;
        permute(nums, 0, used, current, result);
        return result;
    }
};

/**
 * Generate permutations for arrays with duplicates.
 */
class PermutationsWithDuplicates {
public:
    static void permute(vector<int>& nums, int start,
                        vector<vector<int>>& result) {
        int n = nums.size();
        
        if (start == n) {
            result.push_back(nums);
            return;
        }
        
        for (int i = start; i < n; i++) {
            // Skip duplicates
            if (i > start && nums[i] == nums[i - 1]) continue;
            
            swap(nums[start], nums[i]);
            permute(nums, start + 1, result);
            swap(nums[start], nums[i]);
        }
    }
    
    static vector<vector<int>> generatePermutations(vector<int> nums) {
        sort(nums.begin(), nums.end());  // Sort to handle duplicates
        vector<vector<int>> result;
        permute(nums, 0, result);
        return result;
    }
};

int main() {
    // Test case
    vector<int> nums = {1, 2, 3};
    
    cout << "Input: [1, 2, 3]" << endl;
    cout << "Number of permutations: " << 6 << endl;
    cout << "Permutations:" << endl;
    
    vector<vector<int>> result = Permutations::generatePermutations(nums);
    for (const auto& perm : result) {
        cout << "  [";
        for (int i = 0; i < perm.size(); i++) {
            cout << perm[i];
            if (i < perm.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Generate all permutations using backtracking.
 * 
 * Time Complexity: O(n! × n)
 * Space Complexity: O(n) for recursion stack
 */
public class Permutations {
    
    /**
     * Generate permutations using swap method (in-place).
     */
    public static List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        
        // Convert int[] to List<Integer>
        for (int num : nums) {
            current.add(num);
        }
        
        backtrack(current, 0, result);
        return result;
    }
    
    private static void backtrack(List<Integer> nums, int start,
                                   List<List<Integer>> result) {
        int n = nums.size();
        
        // Base case: all positions filled
        if (start == n) {
            result.add(new ArrayList<>(nums));
            return;
        }
        
        // Try each element from start to end
        for (int i = start; i < n; i++) {
            // Swap element into position
            Collections.swap(nums, start, i);
            // Recurse for remaining positions
            backtrack(nums, start + 1, result);
            // Backtrack: restore original order
            Collections.swap(nums, start, i);
        }
    }
    
    /**
     * Generate permutations using used array tracking.
     */
    public static List<List<Integer>> permuteWithUsed(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        boolean[] used = new boolean[nums.length];
        
        backtrackWithUsed(nums, used, current, result);
        return result;
    }
    
    private static void backtrackWithUsed(int[] nums, boolean[] used,
                                           List<Integer> current,
                                           List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        for (int i = 0; i < nums.length; i++) {
            if (!used[i]) {
                used[i] = true;
                current.add(nums[i]);
                backtrackWithUsed(nums, used, current, result);
                current.remove(current.size() - 1);
                used[i] = false;
            }
        }
    }
    
    /**
     * Generate permutations for arrays with duplicates.
     */
    public static List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);  // Sort to handle duplicates
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        
        for (int num : nums) {
            current.add(num);
        }
        
        backtrackUnique(current, 0, result);
        return result;
    }
    
    private static void backtrackUnique(List<Integer> nums, int start,
                                         List<List<Integer>> result) {
        int n = nums.size();
        
        if (start == n) {
            result.add(new ArrayList<>(nums));
            return;
        }
        
        for (int i = start; i < n; i++) {
            // Skip duplicates
            if (i > start && nums.get(i).equals(nums.get(start - 1))) continue;
            
            Collections.swap(nums, start, i);
            backtrackUnique(nums, start + 1, result);
            Collections.swap(nums, start, i);
        }
    }
    
    // Test the implementation
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        
        System.out.println("Input: [1, 2, 3]");
        System.out.println("Number of permutations: 6");
        System.out.println("Permutations:");
        
        List<List<Integer>> result = permute(nums);
        for (List<Integer> perm : result) {
            System.out.println("  " + perm);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Generate all permutations using backtracking (swap method).
 * 
 * Time Complexity: O(n! × n)
 * Space Complexity: O(n) for recursion stack
 */

/**
 * Generate permutations using swap method (in-place).
 * @param {number[]} nums - Input array of distinct integers
 * @returns {number[][]} - Array of all permutations
 */
function permute(nums) {
    const result = [];
    const n = nums.length;
    
    function backtrack(start) {
        // Base case: all positions filled
        if (start === n) {
            result.push([...nums]);
            return;
        }
        
        // Try each element from start to end
        for (let i = start; i < n; i++) {
            // Swap element into position
            [nums[start], nums[i]] = [nums[i], nums[start]];
            // Recurse for remaining positions
            backtrack(start + 1);
            // Backtrack: restore original order
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * Generate permutations using used array tracking.
 * More intuitive and handles duplicates better.
 * @param {number[]} nums - Input array of distinct integers
 * @returns {number[][]} - Array of all permutations
 */
function permuteWithUsed(nums) {
    const result = [];
    const n = nums.length;
    const used = new Array(n).fill(false);
    const current = [];
    
    function backtrack() {
        // Base case: permutation complete
        if (current.length === n) {
            result.push([...current]);
            return;
        }
        
        // Try each unused element
        for (let i = 0; i < n; i++) {
            if (!used[i]) {
                used[i] = true;
                current.push(nums[i]);
                backtrack();
                current.pop();
                used[i] = false;
            }
        }
    }
    
    backtrack(0);
    return result;
}

/**
 * Generate permutations for arrays with duplicate elements.
 * @param {number[]} nums - Input array (may contain duplicates)
 * @returns {number[][]} - Array of unique permutations
 */
function permuteWithDuplicates(nums) {
    const result = [];
    const n = nums.length;
    nums.sort((a, b) => a - b);  // Sort to handle duplicates
    
    function backtrack(start) {
        if (start === n) {
            result.push([...nums]);
            return;
        }
        
        for (let i = start; i < n; i++) {
            // Skip duplicates: only use nums[i] if it's the first at this level
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            [nums[start], nums[i]] = [nums[i], nums[start]];
            backtrack(start + 1);
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    
    backtrack(0);
    return result;
}

// Example usage and demonstration
const nums = [1, 2, 3];

console.log(`Input: [${nums.join(', ')}]`);
console.log(`Number of permutations: ${6}`);
console.log('Permutations:');

const result = permute(nums);
result.forEach(p => console.log(`  [${p.join(', ')}]`));

console.log('\nWith duplicates [1, 1, 2]:');
const resultDup = permuteWithDuplicates([1, 1, 2]);
console.log(`Number of unique permutations: ${resultDup.length}`);
resultDup.forEach(p => console.log(`  [${p.join(', ')}]`));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Generate All Permutations** | O(n! × n) | n! permutations, each takes O(n) to copy |
| **Swap-based Backtracking** | O(n! × n) | Same as above, but no extra space for used array |
| **Used Array Backtracking** | O(n! × n) | Same complexity, slightly more overhead |
| **Heap's Algorithm** | O(n!) | Minimal swaps, near-optimal generation |

### Detailed Breakdown

- **Number of permutations**: n! (factorial)
- **Copying each permutation**: O(n) to create a new array
- **Total**: O(n! × n) = O(n!)
- **For n = 10**: 10! = 3,628,800 permutations
- **For n = 12**: 12! = 479,001,600 permutations (may be too large)

### Practical Limits

- **n ≤ 10**: Full generation is practical
- **n = 11-12**: May be slow but possible
- **n > 12**: Consider alternative approaches (pruning, DP, etc.)

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|-------------------|-------------|
| **Recursion Stack** | O(n) | Maximum depth of recursion |
| **Used Array** | O(n) | Boolean tracking array |
| **Current Permutation** | O(n) | Building current permutation |
| **Results Storage** | O(n! × n) | Storing all permutations |

### Optimization Strategies

1. **In-place swapping**: Avoid used array, saves O(n) space
2. **Generator pattern**: Yield one permutation at a time
3. **Lazy evaluation**: Only generate needed permutations
4. **Pruning**: Skip invalid branches early

---

## Common Variations

### 1. Permutations with Duplicates

Handle arrays containing duplicate elements by sorting and skipping:

````carousel
```python
def permute_unique(nums):
    """Generate unique permutations for array with duplicates."""
    result = []
    nums.sort()  # Sort to group duplicates
    n = len(nums)
    
    def backtrack(start):
        if start == n:
            result.append(nums[:])
            return
        
        for i in range(start, n):
            # Skip duplicates
            if i > start and nums[i] == nums[i - 1]:
                continue
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
    
    backtrack(0)
    return result
```
````

### 2. K-th Permutation

Find the k-th permutation without generating all permutations:

````carousel
```python
def kth_permutation(n, k):
    """Find the k-th permutation of [1, 2, ..., n]."""
    nums = list(range(1, n + 1))
    k -= 1  # Convert to 0-indexed
    result = []
    
    for i in range(n, 0, -1):
        idx, k = divmod(k, math.factorial(i - 1))
        result.append(nums.pop(idx))
    
    return result
```
````

### 3. Next Permutation

Find the next lexicographically greater permutation:

````carousel
```python
def next_permutation(nums):
    """Generate next lexicographic permutation in-place."""
    n = len(nums)
    
    # Find first decreasing element from right
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        # Find smallest element greater than nums[i] from right
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse the suffix
    nums[i + 1:] = reversed(nums[i + 1:])
    return nums
```
````

### 4. Permutation Iterator (Generator)

Memory-efficient generation using generators:

````carousel
```python
def permute_generator(nums):
    """Generate permutations one at a time using generator."""
    n = len(nums)
    indices = list(range(n))
    cycles = list(range(n, 0, -1))
    
    yield nums[:]
    
    while n:
        for i in reversed(range(n)):
            cycles[i] -= 1
            if cycles[i] == 0:
                cycles[i] = n - i
                indices[i], indices[-1] = indices[-1], indices[i]
            else:
                j = cycles[i]
                indices[i], indices[-j] = indices[-j], indices[i]
                yield [nums[idx] for idx in indices]
                break
        else:
            return
```
````

---

## Practice Problems

### Problem 1: Next Permutation

**Problem:** [LeetCode 31 - Next Permutation](https://leetcode.com/problems/next-permutation/)

**Description:** Given an array of integers, transform it to the next lexicographically greater permutation. If the array is the last permutation, wrap around to the first.

**How to Apply Permutations:**
- Understand the algorithm for finding next permutation
- Apply the "find pivot, find replacement, reverse suffix" pattern
- O(n) time, O(1) space solution

---

### Problem 2: Permutations II (Unique Permutations)

**Problem:** [LeetCode 47 - Permutations II](https://leetcode.com/problems/permutations-ii/)

**Description:** Given a collection of numbers that may contain duplicates, return all unique permutations.

**How to Apply Permutations:**
- Sort the array first
- Use a used array to track elements
- Skip duplicate elements at the same recursion level
- This prevents generating duplicate permutations

---

### Problem 3: Permutation in String

**Problem:** [LeetCode 567 - Permutation in String](https://leetcode.com/problems/permutation-in-string/)

**Description:** Given two strings s1 and s2, return true if s2 contains a permutation of s1.

**How to Apply Permutations:**
- Use sliding window with character frequency
- Compare character counts instead of generating permutations
- O(n) solution without explicit permutation generation

---

### Problem 4: Letter Case Permutation

**Problem:** [LeetCode 784 - Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/)

**Description:** Given a string s, you can capitalize exactly zero or more of its lowercase letters. Return all possible combinations.

**How to Apply Permutations:**
- At each character, choose between lowercase and uppercase
- Similar to generating permutations with branching
- 2^n possible combinations for n letters

---

### Problem 5: Find the K-th Permutation

**Problem:** [LeetCode 60 - Permutation Sequence](https://leetcode.com/problems/permutation-sequence/)

**Description:** Given n and k, return the k-th permutation sequence of numbers 1 to n.

**How to Apply Permutations:**
- Don't generate all permutations
- Use mathematical approach with factorials
- Select each digit by calculating remaining permutations
- O(n) solution

---

## Video Tutorial Links

### Fundamentals

- [Permutations - Backtracking (Take U Forward)](https://www.youtube.com/watch?v=YK1PFtS5uQQ) - Comprehensive introduction to permutation generation
- [Generate All Permutations (WilliamFiset)](https://www.youtube.com/watch?v=18YkysX3h2Q) - Detailed explanation with visualizations
- [Permutations - LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=oC88Gt3FZq8) - Practical implementation guide

### Advanced Topics

- [Next Permutation Algorithm](https://www.youtube.com/watch?v=quAS1Iyd8O0) - Efficient next permutation
- [Permutations with Duplicates](https://www.youtube.com/watch?v=z1PlZJ中西) - Handling duplicate elements
- [K-th Permutation](https://www.youtube.com/watch?v=w7a0BfFGf3U) - Mathematical approach without generation
- [Heap's Algorithm](https://www.youtube.com/watch?v=72B80M4WK6M) - Minimal swap generation

---

## Follow-up Questions

### Q1: How do you handle very large n values where generating all permutations is infeasible?

**Answer:** For large n values, consider these approaches:
1. **Pruning**: Skip branches that can't lead to valid solutions
2. **Dynamic Programming**: Use DP to count possibilities without generating
3. **Mathematical Approach**: Calculate the answer directly using combinatorics
4. **Random Sampling**: Generate random permutations for estimation
5. **Lazy Evaluation**: Use generators to produce only needed permutations

### Q2: What is the difference between permutations and combinations?

**Answer:** 
- **Permutations**: Order matters (ABC ≠ ACB)
- **Combinations**: Order doesn't matter (ABC = ACB)
- For combinations, use indices instead of values, and skip duplicates to avoid duplicates

### Q3: How do you generate permutations iteratively without recursion?

**Answer:** There are several iterative approaches:
1. **Heap's Algorithm**: Generate permutations by swapping
2. **Steinhaus-Johnson-Trotter**: Generate using adjacent swaps
3. **Lexicographic Order**: Use next_permutation repeatedly
4. **Factoradic System**: Use factorial number system for direct calculation

### Q4: Can you optimize the algorithm for early termination (finding just one valid permutation)?

**Answer:** Yes, add a flag to stop early:
- Add a global/captured variable like `found = False`
- Check and return immediately when a solution is found
- This can significantly reduce search space when only one solution is needed

### Q5: How do you handle the "permutation equals permutation of another array" problem?

**Answer:** 
- Sort both arrays and compare element by element: O(n log n)
- Use character/frequency count: O(n)
- For permutations of strings, compare character histograms

---

## Summary

The Permutations algorithm is a fundamental backtracking technique for generating all possible arrangements of elements. Key takeaways:

- **Backtracking**: Build permutations incrementally, undoing choices to explore other paths
- **Two Approaches**: Swap-based (in-place) or used array (explicit tracking)
- **O(n! × n)**: Time complexity - factorial growth in number of permutations
- **O(n)**: Space complexity for recursion stack (excluding result storage)
- **Duplicates**: Sort and skip duplicates to avoid generating duplicate permutations
- **Variations**: Next permutation, K-th permutation, permutations with constraints

When to use:
- ✅ When all permutations are needed
- ✅ When exploring all possible arrangements
- ✅ When order matters (vs. combinations)
- ❌ When n is very large (consider DP or mathematical approaches)
- ❌ When only a subset is needed (consider pruning or direct calculation)

This algorithm is essential for competitive programming and technical interviews, particularly in problems involving combinatorial search and constraint satisfaction.

---

## Related Algorithms

- [Combinations](./combinations.md) - Generate combinations (order doesn't matter)
- [Subsets](./subsets.md) - Generate all subsets
- [N-Queens](./n-queens.md) - Constraint satisfaction using permutations
- [Backtracking](./backtracking.md) - General backtracking framework
