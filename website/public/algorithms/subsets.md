# Subsets

## Category
Backtracking

## Description

Generating all subsets (also known as the **Power Set**) is a classic problem in computer science where we need to enumerate all possible combinations of elements from a given set. For a set of size `n`, there are exactly `2^n` subsets (including the empty set), because each element can either be **included** or **excluded** from any subset.

This problem serves as a fundamental building block for many combinatorial algorithms and appears frequently in technical interviews and competitive programming. The key insight is that subsets represent binary choices at each position—whether to include or exclude each element.

---

## When to Use

Use the Subsets algorithm when you need to solve problems involving:

- **Combinatorial Generation**: When you need to explore all possible combinations of elements
- **Power Set Problems**: When the problem asks for "all subsets" or "all combinations"
- **Decision Tree Problems**: When each element presents a binary choice (include/exclude)
- **Subset Sum Variations**: When you're building up solutions by considering each element
- **Backtracking Patterns**: When you need to explore all possibilities systematically

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| **Backtracking (DFS)** | O(n × 2^n) | O(n) for recursion | General subset generation, combinations |
| **Bit Manipulation** | O(n × 2^n) | O(n × 2^n) | When you need exact subset ordering, memory allows |
| **Iterative** | O(n × 2^n) | O(n × 2^n) | Simple implementation, smaller inputs |
| **Lexicographical** | O(n × 2^n) | O(n) | When subsets must be in sorted order |

### When to Choose Each Approach

- **Choose Backtracking (DFS)** when:
  - You need an intuitive, recursive solution
  - Memory is a concern (O(n) space vs O(n × 2^n))
  - You're generating subsets of specific lengths (combinations)

- **Choose Bit Manipulation** when:
  - You need exact control over subset ordering
  - The input size is moderate (n ≤ 20-25)
  - You want to leverage CPU bit operations for speed

- **Choose Iterative** when:
  - You prefer a simple, easy-to-understand solution
  - Input size is small
  - Code clarity is prioritized over optimization

---

## Algorithm Explanation

### Core Concept

The fundamental concept behind generating subsets is viewing each element as having **two states**: either included in the current subset or excluded. This creates a binary decision tree where:

- At each level, you choose whether to include the current element
- The depth of recursion equals the number of elements
- Each root-to-leaf path represents one unique subset

### Visual Representation

For input `[1, 2, 3]`, the decision tree looks like this:

```
                        []
                   /    |    \
                 [1]   [2]   [3]
                /  \    \    /
           [1,2] [1,3] [2,3] [1,2,3]
```

### How Each Approach Works

#### 1. Backtracking (DFS) Approach

The backtracking approach treats subset generation as tree traversal:

1. Start with an empty subset at the root
2. For each element from the current position onward:
   - **Include** the element: add it to current subset, recurse
   - **Exclude** the element: don't add, move to next (via backtrack)
3. When all elements are processed, add the current subset to results

The key insight is that we add a subset to results at **every node** (including empty), not just at leaves.

#### 2. Bit Manipulation Approach

Each subset can be represented by an n-bit binary number:

- If the i-th bit is **1**, include `nums[i]` in the subset
- If the i-th bit is **0**, exclude `nums[i]`

For `n = 3`:
| Mask | Binary | Subset   |
|------|--------|----------|
| 0    | 000    | []       |
| 1    | 001    | [1]      |
| 2    | 010    | [2]      |
| 3    | 011    | [1, 2]   |
| 4    | 100    | [3]      |
| 5    | 101    | [1, 3]   |
| 6    | 110    | [2, 3]   |
| 7    | 111    | [1, 2, 3]|

#### 3. Iterative Approach

The iterative approach builds subsets incrementally:

1. Start with `[[]]` (one subset: empty set)
2. For each element in the input:
   - Create new subsets by adding the element to all existing subsets
   - Append these new subsets to the result
3. Continue until all elements are processed

This elegantly produces all subsets without explicit recursion.

### Key Insights

- **Number of subsets is always 2^n**: This is unavoidable since each element has 2 choices
- **Output size is exponential**: Cannot be optimized in terms of output size
- **Order matters for output**: Depending on requirements, can generate in sorted or unsorted order
- **Memory vs Speed tradeoff**: Iterative uses more memory but may be faster in practice

---

## Algorithm Steps

### Backtracking Approach

1. **Initialize**: Create empty `result` array and empty `current` subset
2. **Start recursion**: Call `backtrack(0, current)`
3. **At each recursion level**:
   - Add a copy of `current` to `result` (every path is a valid subset)
   - For each index `i` from `start` to `len(nums) - 1`:
     - Include `nums[i]`: append to `current`
     - Recurse with `backtrack(i + 1, current)`
     - Backtrack: remove `nums[i]` from `current`
4. **Base case**: Implicit—when `start` reaches `len(nums)`, the loop doesn't execute

### Bit Manipulation Approach

1. **Calculate total subsets**: `total = 1 << n` (equivalent to 2^n)
2. **Iterate through all masks**: For `mask` from `0` to `total - 1`
3. **For each mask**:
   - Create empty subset
   - For each bit position `i` from `0` to `n - 1`:
     - Check if bit `i` is set: `if mask & (1 << i)`
     - If set, add `nums[i]` to current subset
   - Add subset to result

### Iterative Approach

1. **Initialize**: `result = [[]]` (start with empty set)
2. **For each number** in the input array:
   - Let `current_size = len(result)`
   - For each index `j` from `0` to `current_size - 1`:
     - Create new subset: `result[j] + [num]`
     - Add to result
3. **Return**: Complete result array

---

## Implementation

````carousel
```python
def subsets(nums: list) -> list:
    """
    Generate all possible subsets (power set) using backtracking.
    
    Args:
        nums: Input array of distinct integers
        
    Returns:
        List of all possible subsets
        
    Time: O(n * 2^n)
    Space: O(n) for recursion stack
    """
    result = []
    
    def backtrack(start: int, current: list):
        # Add a copy of current subset (not reference)
        result.append(current[:])
        
        # Try adding each remaining element
        for i in range(start, len(nums)):
            # Include nums[i]
            current.append(nums[i])
            
            # Recursively generate subsets with nums[i]
            backtrack(i + 1, current)
            
            # Backtrack: remove nums[i]
            current.pop()
    
    backtrack(0, [])
    return result


def subsets_iterative(nums: list) -> list:
    """
    Generate all subsets using iterative approach.
    Start with [[]] and for each number, add it to existing subsets.
    
    Time: O(n * 2^n)
    Space: O(n * 2^n) for result
    """
    result = [[]]  # Start with empty set
    
    for num in nums:
        # For each existing subset, create new subset with current num
        new_subsets = [subset + [num] for subset in result]
        result.extend(new_subsets)
    
    return result


def subsets_bit_manipulation(nums: list) -> list:
    """
    Generate all subsets using bit manipulation.
    Each subset is represented by bits - if bit i is set, nums[i] is in subset.
    
    Args:
        nums: Input array
        
    Returns:
        List of all subsets
        
    Time: O(n * 2^n)
    Space: O(n * 2^n)
    """
    n = len(nums)
    result = []
    
    # Total subsets = 2^n
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            # Check if bit i is set in mask
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result


def subsets_of_length(nums: list, k: int) -> list:
    """
    Generate all subsets of exactly length k.
    
    Time: O(C(n,k) * k)
    Space: O(k) for recursion stack
    """
    result = []
    
    def backtrack(start: int, current: list):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result


# Example usage
if __name__ == "__main__":
    nums = [1, 2, 3]
    
    print(f"Input: {nums}")
    print(f"\nSubsets (Backtracking):")
    for subset in subsets(nums):
        print(subset)
    
    print(f"\nSubsets (Iterative):")
    for subset in subsets_iterative(nums):
        print(subset)
    
    print(f"\nSubsets (Bit Manipulation):")
    for subset in subsets_bit_manipulation(nums):
        print(subset)
    
    print(f"\nSubsets of length 2:")
    for subset in subsets_of_length(nums, 2):
        print(subset)
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Generate all subsets using backtracking (DFS).
 * 
 * Time: O(n * 2^n)
 * Space: O(n) for recursion stack
 */
class Subsets {
public:
    static vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(nums, 0, current, result);
        return result;
    }
    
    /**
     * Generate subsets of exactly length k.
     */
    static vector<vector<int>> subsetsOfLength(vector<int>& nums, int k) {
        vector<vector<int>> result;
        vector<int> current;
        backtrackK(nums, 0, k, current, result);
        return result;
    }
    
private:
    static void backtrack(const vector<int>& nums, int start,
                          vector<int>& current, vector<vector<int>>& result) {
        // Add current subset to result
        result.push_back(current);
        
        // Try adding each remaining element
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.pop_back();  // Backtrack
        }
    }
    
    static void backtrackK(const vector<int>& nums, int start, int k,
                          vector<int>& current, vector<vector<int>>& result) {
        if (current.size() == k) {
            result.push_back(current);
            return;
        }
        
        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);
            backtrackK(nums, i + 1, k, current, result);
            current.pop_back();
        }
    }
};

/**
 * Generate all subsets using bit manipulation.
 * 
 * Time: O(n * 2^n)
 * Space: O(n * 2^n)
 */
vector<vector<int>> subsetsBitManipulation(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> result;
    
    // Total subsets = 2^n
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push_back(nums[i]);
            }
        }
        result.push_back(subset);
    }
    
    return result;
}

/**
 * Generate all subsets using iterative approach.
 */
vector<vector<int>> subsetsIterative(vector<int>& nums) {
    vector<vector<int>> result = {{}};  // Start with empty set
    
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

int main() {
    vector<int> nums = {1, 2, 3};
    
    cout << "Input: [1, 2, 3]" << endl << endl;
    
    cout << "Subsets (Backtracking):" << endl;
    auto result1 = Subsets::subsets(nums);
    for (const auto& subset : result1) {
        cout << "[";
        for (int i = 0; i < subset.size(); i++) {
            cout << subset[i];
            if (i < subset.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
    }
    
    cout << "\nSubsets of length 2:" << endl;
    auto result2 = Subsets::subsetsOfLength(nums, 2);
    for (const auto& subset : result2) {
        cout << "[";
        for (int i = 0; i < subset.size(); i++) {
            cout << subset[i];
            if (i < subset.size() - 1) cout << ", ";
        }
        cout << "]" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

/**
 * Generate all subsets (power set) using backtracking.
 * 
 * Time: O(n * 2^n)
 * Space: O(n) for recursion stack
 */
public class Subsets {
    
    /**
     * Generate all subsets of the input array.
     */
    public static List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrack(nums, 0, current, result);
        return result;
    }
    
    /**
     * Generate subsets of exactly length k.
     */
    public static List<List<Integer>> subsetsOfLength(int[] nums, int k) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> current = new ArrayList<>();
        backtrackK(nums, 0, k, current, result);
        return result;
    }
    
    private static void backtrack(int[] nums, int start, 
                                   List<Integer> current,
                                   List<List<Integer>> result) {
        // Add copy of current subset
        result.add(new ArrayList<>(current));
        
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.remove(current.size() - 1);  // Backtrack
        }
    }
    
    private static void backtrackK(int[] nums, int start, int k,
                                   List<Integer> current,
                                   List<List<Integer>> result) {
        if (current.size() == k) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrackK(nums, i + 1, k, current, result);
            current.remove(current.size() - 1);
        }
    }
    
    /**
     * Generate all subsets using bit manipulation.
     */
    public static List<List<Integer>> subsetsBitManipulation(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();
        
        // Total subsets = 2^n
        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) {
                    subset.add(nums[i]);
                }
            }
            result.add(subset);
        }
        
        return result;
    }
    
    /**
     * Generate all subsets using iterative approach.
     */
    public static List<List<Integer>> subsetsIterative(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        result.add(new ArrayList<>());  // Start with empty set
        
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
    
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        
        System.out.println("Input: [1, 2, 3]");
        System.out.println("\nSubsets (Backtracking):");
        for (List<Integer> subset : subsets(nums)) {
            System.out.println(subset);
        }
        
        System.out.println("\nSubsets of length 2:");
        for (List<Integer> subset : subsetsOfLength(nums, 2)) {
            System.out.println(subset);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Generate all subsets (power set) using backtracking.
 * 
 * Time: O(n * 2^n)
 * Space: O(n) for recursion stack
 * 
 * @param {number[]} nums - Input array
 * @returns {number[][]} All subsets
 */
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        // Add copy of current subset
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            // Include nums[i]
            current.push(nums[i]);
            
            // Recurse
            backtrack(i + 1, current);
            
            // Backtrack
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

/**
 * Generate subsets of exactly length k.
 * 
 * @param {number[]} nums - Input array
 * @param {number} k - Target subset length
 * @returns {number[][]} Subsets of length k
 */
function subsetsOfLength(nums, k) {
    const result = [];
    
    function backtrack(start, current) {
        if (current.length === k) {
            result.push([...current]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

/**
 * Generate all subsets using bit manipulation.
 * 
 * Time: O(n * 2^n)
 * Space: O(n * 2^n)
 */
function subsetsBitManipulation(nums) {
    const n = nums.length;
    const result = [];
    
    // Total subsets = 2^n
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset = [];
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
            }
        }
        result.push(subset);
    }
    
    return result;
}

/**
 * Generate all subsets using iterative approach.
 */
function subsetsIterative(nums) {
    const result = [[]];  // Start with empty set
    
    for (const num of nums) {
        const currentSize = result.length;
        for (let i = 0; i < currentSize; i++) {
            result.push([...result[i], num]);
        }
    }
    
    return result;
}

// Example usage
const nums = [1, 2, 3];

console.log("Input:", nums);
console.log("\nSubsets (Backtracking):");
console.log(subsets(nums));

console.log("\nSubsets of length 2:");
console.log(subsetsOfLength(nums, 2));
```
````

---

## Example

**Input:**
```python
nums = [1, 2, 3]
```

**Output:**
```
Input: [1, 2, 3]

Subsets (Backtracking):
[]
[1]
[1, 2]
[1, 2, 3]
[1, 3]
[2]
[2, 3]
[3]
```

**Explanation:**
For set [1, 2, 3], there are 2^3 = 8 subsets:
- [] (empty set)
- [1]
- [2]
- [3]
- [1, 2]
- [1, 3]
- [2, 3]
- [1, 2, 3]

**Decision Tree:**
```
                    []
                 /   |   \
               [1]  [2]  [3]
              /  \    \
         [1,2] [1,3]  [2,3]
             \
         [1,2,3]
```

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Backtracking (DFS)** | O(n × 2^n) | Each subset takes O(n) to copy, 2^n subsets |
| **Bit Manipulation** | O(n × 2^n) | For each of 2^n masks, check n bits |
| **Iterative** | O(n × 2^n) | For each element, add to 2^(i-1) existing subsets |
| **Subset of length k** | O(C(n,k) × k) | Combination count times copy cost |

### Detailed Breakdown

- **Total subsets**: 2^n (including empty set)
- **Copying each subset**: O(n) time
- **Total**: O(n × 2^n)

Note: This is **optimal** because the output itself contains O(n × 2^n) elements.

---

## Space Complexity Analysis

| Approach | Space Complexity | Notes |
|----------|-----------------|-------|
| **Backtracking** | O(n) | Recursion stack depth equals n |
| **Bit Manipulation** | O(n × 2^n) | Stores all subsets in memory |
| **Iterative** | O(n × 2^n) | Stores all subsets in memory |
| **Result storage** | O(n × 2^n) | Required to store all subsets |

### Space Optimization Notes

- Backtracking uses **O(n)** auxiliary space (excluding output)
- The output space is unavoidable: must store 2^n subsets
- For large n, consider generating subsets on-the-fly (lazy evaluation)

---

## Common Variations

### 1. Subsets with Duplicates (Subsets II)

When the input contains duplicate elements, you need to handle duplicates properly:

````carousel
```python
def subsets_with_duplicates(nums: list) -> list:
    """
    Generate all subsets handling duplicates.
    
    Key insight: Sort first, then skip duplicates at each level.
    """
    nums.sort()  # Important: sort to handle duplicates
    result = []
    
    def backtrack(start: int, current: list):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            # Skip duplicates: if same as previous, don't include
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```

<!-- slide -->
```javascript
function subsetsWithDuplicates(nums) {
    nums.sort((a, b) => a - b);  // Sort to handle duplicates
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

### 2. Subsets of Specific Length (Combinations)

Generate all k-element subsets (combinations):

````carousel
```python
def combinations(nums: list, k: int) -> list:
    """Generate all k-combinations."""
    result = []
    
    def backtrack(start: int, current: list):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result
```
````

### 3. Subsets with Sum Target (Subset Sum)

Find all subsets that sum to a target value:

````carousel
```python
def subset_sum(nums: list, target: int) -> list:
    """Find all subsets that sum to target."""
    result = []
    
    def backtrack(start: int, current: list, total: int):
        if total == target:
            result.append(current[:])
            return
        
        for i in range(start, len(nums)):
            if total + nums[i] <= target:
                current.append(nums[i])
                backtrack(i + 1, current, total + nums[i])
                current.pop()
    
    backtrack(0, [], 0)
    return result
```
````

### 4. Lazy Subset Generation

For very large n, generate subsets lazily using iterators:

````carousel
```python
def lazy_subsets(nums: list):
    """Generate subsets lazily without storing all in memory."""
    n = len(nums)
    total = 1 << n
    
    for mask in range(total):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        yield subset
```
````

---

## Practice Problems

### Problem 1: Subsets

**Problem:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

**Description:** Given an integer array `nums` of **unique** elements, return all possible subsets (the power set). The solution set **must not** contain duplicate subsets.

**How to Apply Subset Pattern:**
- This is the classic subset generation problem
- Use backtracking or bit manipulation
- Each element has two choices: include or exclude
- Time complexity will be O(n × 2^n) which is optimal

---

### Problem 2: Subsets II

**Problem:** [LeetCode 90 - Subsets II](https://leetcode.com/problems/subsets-ii/)

**Description:** Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set). The solution set **must not** contain duplicate subsets.

**How to Apply Subset Pattern:**
- Sort the array first to group duplicates
- At each recursion level, skip duplicate elements
- Use the "skip duplicates" pattern: `if i > start and nums[i] == nums[i-1]: continue`

---

### Problem 3: Combinations

**Problem:** [LeetCode 77 - Combinations](https://leetcode.com/problems/combinations/)

**Description:** Given two integers `n` and `k`, return all possible combinations of `k` numbers chosen from the range `[1, n]`.

**How to Apply Subset Pattern:**
- This is equivalent to generating subsets of length k
- Use backtracking with early termination when subset size reaches k
- Start index ensures combinations are unique (no repeats)

---

### Problem 4: Letter Case Permutation

**Problem:** [LeetCode 784 - Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/)

**Description:** Given a string `s`, you can swap the case of any letter. Return a list of all possible permutations of `s` after swapping the cases of letters.

**How to Apply Subset Pattern:**
- Treat alphabetic characters as having 2 choices (uppercase/lowercase)
- Treat digits as having 1 choice (keep as is)
- The number of "choices" at each position determines the branching factor

---

### Problem 5: Minimum Number of Subsets

**Problem:** [LeetCode 1986 - Minimum Number of Work Sessions to Finish Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-tasks/)

**Description:** Given an array of task difficulties and a session time limit, find the minimum number of work sessions needed to finish all tasks.

**How to Apply Subset Pattern:**
- Generate all possible subsets of tasks
- Use bit manipulation to represent task combinations
- Use DP over subsets to find optimal grouping

---

## Video Tutorial Links

### Fundamentals

- [Subsets - Backtracking (Take U Forward)](https://www.youtube.com/watch?v=2kRjMKDkJoc) - Comprehensive introduction to subset generation
- [Generate All Subsets (WilliamFiset)](https://www.youtube.com/watch?v=1Z6nKfqwJq0) - Detailed explanation with visualizations
- [LeetCode 78 - Subsets (NeetCode)](https://www.youtube.com/watch?v=OD0zN8F1zBw) - Practical implementation guide

### Advanced Topics

- [Subsets II - Handling Duplicates](https://www.youtube.com/watch?v=rcR7yJ-aq-M) - Managing duplicate elements
- [Bit Manipulation for Subsets](https://www.youtube.com/watch?v=0G3Zt9v-7U4) - Alternative approach using bits
- [Combination Sum Problems](https://www.youtube.com/watch?v=GBD9S6F4S9w) - Related subset sum variations

---

## Follow-up Questions

### Q1: How do you handle duplicates in the subset generation?

**Answer:** To handle duplicates:

1. **Sort the input array first**: This groups duplicate elements together
2. **Skip duplicates at each recursion level**: Use the condition `if i > start and nums[i] == nums[i-1]: continue`
3. **Why it works**: When we're at position `i`, we've already explored all subsets starting with `nums[i-1]`, so including `nums[i]` would create duplicates

### Q2: Can you generate subsets in lexicographical order?

**Answer:** Yes, with modifications:

1. **Sort the input**: Start with sorted nums
2. **Use specific ordering in recursion**: Modify the backtracking to explore in sorted order
3. **Bit manipulation approach**: Iterate masks from 0 to 2^n - 1 in order (already sorted for sorted input)

### Q3: What is the maximum n you can handle?

**Answer:** Practical limits:

- **n ≤ 20**: Can generate all 2^n subsets in memory (~1 million for n=20)
- **n ≤ 25**: May run into memory issues but doable with streaming
- **n > 25**: Need different approaches (pruning, meet-in-the-middle, etc.)

### Q4: How does meet-in-the-middle help with subsets?

**Answer:** For n > 25:

1. **Split the array**: Divide into two halves of size n/2
2. **Generate subsets for each half**: 2^(n/2) subsets each
3. **Combine**: For each subset in first half, find complementary subsets in second half that meet criteria
4. **Reduces from O(2^n) to O(2^(n/2))** for certain problems

### Q5: How do you generate subsets of specific length efficiently?

**Answer:** Two approaches:

1. **Backtracking with pruning**: Stop recursion when subset size reaches k (already shown)
2. **Filter all subsets**: Generate all 2^n subsets, filter by length (less efficient)

The first approach is optimal with time complexity O(C(n,k) × k).

---

## Summary

Generating subsets (power set) is a fundamental combinatorial problem that appears in many algorithmic challenges. Key takeaways:

- **Inherent complexity**: O(n × 2^n) is optimal since output itself has that size
- **Three main approaches**: Backtracking, Bit Manipulation, Iterative
- **Backtracking preferred**: O(n) auxiliary space, intuitive implementation
- **Handle duplicates**: Sort and skip duplicates at each level
- **Common variations**: Subsets of length k, subsets with sum target, lazy generation

When to use:
- ✅ When problem asks for "all subsets" or "all combinations"
- ✅ When each element has binary choices (include/exclude)
- ✅ When you need to enumerate all possibilities
- ✅ When constraints allow exponential output

This pattern is essential for technical interviews and competitive programming, serving as the foundation for many combinatorial algorithms.

---

## Related Algorithms

- [Combinations](./combinations.md) - Subsets of specific length
- [Combination Sum](./combination_sum.md) - Subsets that sum to target
- [Permutations](./permutations.md) - Different ordering of elements
- [Bit Manipulation](./subset-generation-bits.md) - Bit-based subset generation
