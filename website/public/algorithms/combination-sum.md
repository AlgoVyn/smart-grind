# Combination Sum

## Category
Backtracking

## Description

The Combination Sum algorithm finds all unique combinations of elements from a given set that sum up to a target value. This classic backtracking problem allows each element to be used **unlimited times** (unbounded knapsack variant), making it distinct from standard combination problems where each element can only be used once.

The algorithm is essential for solving subset generation problems, knapsack variations, and recursive pattern matching in competitive programming and technical interviews.

---

## When to Use

Use the Combination Sum algorithm when you need to solve problems involving:

- **Subset Generation**: Finding all possible subsets that satisfy a sum constraint
- **Unbounded Knapsack**: Items can be selected multiple times to reach a target
- **Recursive Pattern Matching**: Building combinations incrementally with backtracking
- **Target Sum Problems**: When you need to enumerate all ways to reach a specific value

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Backtracking** | O(2^n) | O(target) | Finding all combinations |
| **Dynamic Programming (Count)** | O(n × target) | O(target) | Count ways (not enumerate) |
| **BFS/Iterative** | O(2^n) | O(2^n) | Level-order exploration |
| **Memoization** | O(n × target) | O(n × target) | Overlapping subproblems |

### When to Choose Backtracking vs Dynamic Programming

- **Choose Backtracking** when:
  - You need to enumerate all valid combinations (not just count)
  - The solution requires returning actual subsets
  - Input size is manageable (typically n ≤ 30)

- **Choose Dynamic Programming** when:
  - You only need the count of ways (not the actual combinations)
  - The target value is small (typically ≤ 1000)
  - Space optimization is critical

---

## Algorithm Explanation

### Core Concept

The Combination Sum problem uses **backtracking** to systematically explore all possible combinations. The key insight is that we can build solutions incrementally by:

1. **Choosing** an element to include
2. **Exploring** all combinations with that choice
3. **Unchoosing** (backtracking) to try alternatives

Since elements can be reused unlimited times, after choosing an element at index `i`, we recursively explore starting from the **same index** (not `i+1`), allowing unlimited selections.

### How It Works

#### Recursive Backtracking Strategy:

```
backtrack(start_index, current_combination, remaining_target):
    if remaining_target == 0:
        found a valid combination!
        return
    
    for i from start_index to end:
        if candidates[i] > remaining_target:
            break  // prune: no need to try larger values
        
        add candidates[i] to current_combination
        backtrack(i, current_combination, remaining - candidates[i])  // same i allows reuse
        remove candidates[i] from current_combination  // backtrack
```

#### Why Sort First?

Sorting the candidates array enables **pruning**:
- If `candidates[i] > remaining`, all subsequent candidates (being larger) will also exceed the target
- This early termination significantly reduces the search space

### Visual Representation

For `candidates = [2, 3, 6, 7]`, `target = 7`:

```
Start (target=7)
├── 2 (target=5)
│   ├── 2 (target=3)
│   │   ├── 2 (target=1) → 2 > 1, prune
│   │   └── 3 (target=0) → [2,2,3] ✓
│   └── 3 (target=2) → 3 > 2, prune
├── 3 (target=4)
│   ├── 3 (target=1) → 3 > 1, prune
│   └── 6 (target=-2) → skip
├── 6 (target=1) → 6 > 1, prune
└── 7 (target=0) → [7] ✓
```

### Key Insights

1. **Same index recursion**: `backtrack(i, ...)` allows unlimited usage of element at index `i`
2. **No duplicates**: By only moving forward (`start` index), we avoid generating duplicate combinations like [2,3] and [3,2]
3. **Pruning power**: Early termination when `candidate > remaining` saves significant computation

### Limitations

- **Exponential time**: O(2^n) in worst case - not suitable for very large inputs
- **Stack depth**: Recursion depth limited by target value
- **Memory**: All combinations stored in memory simultaneously

---

## Algorithm Steps

### Step-by-Step Execution

1. **Sort candidates** (optional but recommended for pruning)
   - Enables early termination when candidates exceed remaining target

2. **Initialize result list** to store valid combinations

3. **Define recursive backtrack function** with parameters:
   - `start`: current starting index in candidates
   - `current`: list representing current combination being built
   - `remaining`: remaining target sum to achieve

4. **Base case**: If `remaining == 0`:
   - Add a copy of `current` to result
   - Return

5. **Iterate through candidates** from `start` to end:
   - If `candidates[i] > remaining`: break (pruning)
   - Add `candidates[i]` to `current`
   - Recurse with same index `i` (allow reuse)
   - Remove last element from `current` (backtrack)

6. **Initial call**: `backtrack(0, [], target)`

7. **Return result**

---

## Implementation

### Template Code

````carousel
```python
def combination_sum(candidates, target):
    """
    Find all unique combinations of candidates that sum to target.
    Each candidate may be used unlimited times.
    
    Args:
        candidates: List of distinct positive integers
        target: Target sum (positive integer)
        
    Returns:
        List of all unique combinations that sum to target
        
    Time: O(2^n) where n is number of candidates
    Space: O(target) for recursion stack
    """
    # Sort to enable pruning (optional but recommended)
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        """
        Recursively build combinations.
        
        Args:
            start: Index to start from (allows reuse of same element)
            current: Current combination being built
            remaining: Remaining sum needed
        """
        # Base case: found valid combination
        if remaining == 0:
            result.append(list(current))
            return
        
        # Try each candidate from start index
        for i in range(start, len(candidates)):
            candidate = candidates[i]
            
            # Pruning: if candidate > remaining, no need to try larger ones
            if candidate > remaining:
                break
            
            # Choose: add candidate to current combination
            current.append(candidate)
            
            # Explore: recurse with same index (unlimited use allowed)
            backtrack(i, current, remaining - candidate)
            
            # Unchoose: backtrack by removing the candidate
            current.pop()
    
    backtrack(0, [], target)
    return result


# Example usage and demonstration
if __name__ == "__main__":
    # Example 1
    candidates1 = [2, 3, 6, 7]
    target1 = 7
    result1 = combination_sum(candidates1, target1)
    print(f"candidates = {candidates1}, target = {target1}")
    print(f"Output: {result1}")
    # Output: [[2, 2, 3], [7]]
    
    print()
    
    # Example 2
    candidates2 = [2, 3, 5]
    target2 = 8
    result2 = combination_sum(candidates2, target2)
    print(f"candidates = {candidates2}, target = {target2}")
    print(f"Output: {result2}")
    # Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Find all unique combinations of candidates that sum to target.
 * Each candidate may be used unlimited times.
 * 
 * Time: O(2^n) where n is number of candidates
 * Space: O(target) for recursion stack
 */
class CombinationSum {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        // Sort to enable pruning
        sort(candidates.begin(), candidates.end());
        
        vector<vector<int>> result;
        vector<int> current;
        
        backtrack(candidates, 0, current, target, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& candidates, int start, 
                   vector<int>& current, int remaining, 
                   vector<vector<int>>& result) {
        // Base case: found valid combination
        if (remaining == 0) {
            result.push_back(current);
            return;
        }
        
        // Try each candidate from start index
        for (int i = start; i < candidates.size(); i++) {
            int candidate = candidates[i];
            
            // Pruning: if candidate > remaining, break
            if (candidate > remaining) {
                break;
            }
            
            // Choose: add candidate
            current.push_back(candidate);
            
            // Explore: recurse with same index (unlimited use)
            backtrack(candidates, i, current, remaining - candidate, result);
            
            // Unchoose: backtrack
            current.pop_back();
        }
    }
};

// Example usage
int main() {
    CombinationSum solver;
    
    // Example 1
    vector<int> candidates1 = {2, 3, 6, 7};
    int target1 = 7;
    vector<vector<int>> result1 = solver.combinationSum(candidates1, target1);
    
    cout << "candidates = [2, 3, 6, 7], target = 7" << endl;
    cout << "Output: [";
    for (int i = 0; i < result1.size(); i++) {
        cout << "[";
        for (int j = 0; j < result1[i].size(); j++) {
            cout << result1[i][j];
            if (j < result1[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < result1.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    // Output: [[2,2,3], [7]]
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Find all unique combinations of candidates that sum to target.
 * Each candidate may be used unlimited times.
 * 
 * Time: O(2^n) where n is number of candidates
 * Space: O(target) for recursion stack
 */
public class CombinationSum {
    
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        
        // Sort to enable pruning
        Arrays.sort(candidates);
        
        backtrack(candidates, 0, new ArrayList<>(), target, result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, 
                          List<Integer> current, int remaining, 
                          List<List<Integer>> result) {
        // Base case: found valid combination
        if (remaining == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        
        // Try each candidate from start index
        for (int i = start; i < candidates.length; i++) {
            int candidate = candidates[i];
            
            // Pruning: if candidate > remaining, break
            if (candidate > remaining) {
                break;
            }
            
            // Choose: add candidate
            current.add(candidate);
            
            // Explore: recurse with same index (unlimited use)
            backtrack(candidates, i, current, remaining - candidate, result);
            
            // Unchoose: backtrack
            current.remove(current.size() - 1);
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        CombinationSum solver = new CombinationSum();
        
        // Example 1
        int[] candidates1 = {2, 3, 6, 7};
        int target1 = 7;
        List<List<Integer>> result1 = solver.combinationSum(candidates1, target1);
        
        System.out.println("candidates = [2, 3, 6, 7], target = 7");
        System.out.println("Output: " + result1);
        // Output: [[2, 2, 3], [7]]
        
        System.out.println();
        
        // Example 2
        int[] candidates2 = {2, 3, 5};
        int target2 = 8;
        List<List<Integer>> result2 = solver.combinationSum(candidates2, target2);
        
        System.out.println("candidates = [2, 3, 5], target = 8");
        System.out.println("Output: " + result2);
        // Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
    }
}
```

<!-- slide -->
```javascript
/**
 * Find all unique combinations of candidates that sum to target.
 * Each candidate may be used unlimited times.
 * 
 * Time: O(2^n) where n is number of candidates
 * Space: O(target) for recursion stack
 */
function combinationSum(candidates, target) {
    // Sort to enable pruning
    candidates.sort((a, b) => a - b);
    
    const result = [];
    
    /**
     * Recursively build combinations
     * @param {number} start - Starting index in candidates
     * @param {number[]} current - Current combination being built
     * @param {number} remaining - Remaining sum needed
     */
    function backtrack(start, current, remaining) {
        // Base case: found valid combination
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        
        // Try each candidate from start index
        for (let i = start; i < candidates.length; i++) {
            const candidate = candidates[i];
            
            // Pruning: if candidate > remaining, break
            if (candidate > remaining) {
                break;
            }
            
            // Choose: add candidate
            current.push(candidate);
            
            // Explore: recurse with same index (unlimited use)
            backtrack(i, current, remaining - candidate);
            
            // Unchoose: backtrack
            current.pop();
        }
    }
    
    backtrack(0, [], target);
    return result;
}

// Example usage
console.log("=== Combination Sum Examples ===\n");

// Example 1
const candidates1 = [2, 3, 6, 7];
const target1 = 7;
const result1 = combinationSum(candidates1, target1);
console.log(`candidates = [${candidates1}], target = ${target1}`);
console.log(`Output: ${JSON.stringify(result1)}`);
// Output: [[2,2,3],[7]]

console.log();

// Example 2
const candidates2 = [2, 3, 5];
const target2 = 8;
const result2 = combinationSum(candidates2, target2);
console.log(`candidates = [${candidates2}], target = ${target2}`);
console.log(`Output: ${JSON.stringify(result2)}`);
// Output: [[2,2,2,2],[2,3,3],[3,5]]

console.log();

// Example 3: No solution
const candidates3 = [2];
const target3 = 1;
const result3 = combinationSum(candidates3, target3);
console.log(`candidates = [${candidates3}], target = ${target3}`);
console.log(`Output: ${JSON.stringify(result3)}`);
// Output: []
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sorting** | O(n log n) | Optional preprocessing step |
| **Backtracking (Worst Case)** | O(2^n) | Exponential due to exploring all combinations |
| **Backtracking (with Pruning)** | O(2^(target/min)) | Improved with early termination |
| **Copying Result** | O(k × m) | k = number of combinations, m = average length |

### Detailed Breakdown

- **Recursion Tree**: Each level represents choosing an element
  - Branching factor decreases as we move deeper (fewer valid candidates)
  - Depth limited by `target / min(candidates)`

- **Worst Case**: No pruning possible
  - Every subset is valid: O(2^n) combinations
  - Example: `candidates = [1, 1, 1, ...], target = n`

- **Best Case**: Heavy pruning
  - Large candidates relative to target
  - Early termination at each level

- **Average Case**: Depends on input distribution
  - With pruning, typically much better than 2^n
  - Practical for n ≤ 30, target ≤ 500

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|-----------------|-------------|
| **Recursion Stack** | O(target / min) | Maximum depth of recursion |
| **Current Combination** | O(target / min) | Temporary storage during backtracking |
| **Result Storage** | O(k × m) | All valid combinations |
| **Sorting** | O(1) to O(n) | In-place or extra space |
| **Total Auxiliary** | O(target / min) | Excluding result storage |

### Space Breakdown

- **Recursion Depth**: The deepest recursion occurs when we use the smallest candidate repeatedly
  - `max_depth = target / min(candidates)`
  - Example: `target = 7, min = 2` → max depth = 3 (using [2,2,2] exceeds 7, so depth ≤ 4)

- **Result Space**: Depends on number of valid combinations
  - Can be exponential in worst case
  - Not counted in auxiliary space complexity

---

## Common Variations

### 1. Combination Sum II (No Reuse)

Each candidate can only be used **once**. This requires incrementing the start index:

````carousel
```python
def combination_sum2(candidates, target):
    """
    Find all unique combinations where each number may only be used once.
    """
    candidates.sort()
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(list(current))
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            if candidates[i] > remaining:
                break
            
            current.append(candidates[i])
            # Use i + 1 instead of i (no reuse)
            backtrack(i + 1, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result
```
````

### 2. Combination Sum III (Limited Numbers)

Find all valid combinations using exactly `k` numbers that sum to `target`:

````carousel
```python
def combination_sum3(k, target):
    """
    Find all valid combinations of k numbers that sum to target.
    Numbers are 1-9, each used at most once.
    """
    result = []
    
    def backtrack(start, current, remaining, count):
        # Base case: found valid combination
        if remaining == 0 and count == 0:
            result.append(list(current))
            return
        
        # Pruning
        if remaining < 0 or count < 0:
            return
        
        for i in range(start, 10):
            current.append(i)
            backtrack(i + 1, current, remaining - i, count - 1)
            current.pop()
    
    backtrack(1, [], target, k)
    return result
```
````

### 3. Count Ways (DP Approach)

When you only need the count (not the actual combinations), use Dynamic Programming:

````carousel
```python
def combination_sum_count(candidates, target):
    """
    Count number of ways to make target (not enumerate).
    Time: O(n × target), Space: O(target)
    """
    dp = [0] * (target + 1)
    dp[0] = 1  # One way to make sum 0 (use nothing)
    
    for candidate in candidates:
        for i in range(candidate, target + 1):
            dp[i] += dp[i - candidate]
    
    return dp[target]
```
````

### 4. Iterative/BFS Approach

Build combinations level by level using iteration:

````carousel
```python
from collections import deque

def combination_sum_iterative(candidates, target):
    """
    Iterative BFS approach to combination sum.
    """
    candidates.sort()
    result = []
    
    # Queue stores: (current_combination, current_sum, start_index)
    queue = deque([([], 0, 0)])
    
    while queue:
        current, total, start = queue.popleft()
        
        if total == target:
            result.append(current)
            continue
        
        for i in range(start, len(candidates)):
            new_total = total + candidates[i]
            if new_total > target:
                break
            queue.append((current + [candidates[i]], new_total, i))
    
    return result
```
````

---

## Practice Problems

### Problem 1: Combination Sum

**Problem:** [LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

**Description:** Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.

**Key Points:**
- Same number may be chosen unlimited times
- All numbers (including target) are positive integers
- Solution set must not contain duplicate combinations

---

### Problem 2: Combination Sum II

**Problem:** [LeetCode 40 - Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)

**Description:** Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`. Each number in `candidates` may only be used once in the combination.

**Key Differences from Combination Sum I:**
- Each number can only be used once
- Candidates may contain duplicates
- Solution must not contain duplicate combinations

---

### Problem 3: Combination Sum III

**Problem:** [LeetCode 216 - Combination Sum III](https://leetcode.com/problems/combination-sum-iii/)

**Description:** Find all valid combinations of `k` numbers that sum up to `n` such that:
- Only numbers 1 through 9 are used
- Each number is used at most once

**Key Constraints:**
- Return a list of all possible valid combinations
- The list must not contain the same combination twice
- Combinations may be returned in any order

---

### Problem 4: Combination Sum IV

**Problem:** [LeetCode 377 - Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/)

**Description:** Given an array of distinct integers `nums` and a target integer `target`, return the number of possible combinations that add up to `target`. The answer fits in a 32-bit integer.

**Key Difference:**
- Return the **count** of combinations, not the actual combinations
- Different sequences are counted as different combinations
- Best solved with Dynamic Programming

---

### Problem 5: Target Sum

**Problem:** [LeetCode 494 - Target Sum](https://leetcode.com/problems/target-sum/)

**Description:** You are given an integer array `nums` and an integer `target`. You want to build an expression out of `nums` by adding one of the symbols `+` or `-` before each integer in `nums` and then concatenate all the integers.

**Key Insight:**
- Transform into a subset sum problem
- Related to partition equal subset sum
- Can use backtracking or DP

---

## Video Tutorial Links

### Fundamentals

- [Combination Sum - Backtracking Pattern (NeetCode)](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Comprehensive backtracking explanation
- [Combination Sum Explained (Tech With Tim)](https://www.youtube.com/watch?v=FBwQLllxLxA) - Python implementation walkthrough
- [Backtracking Algorithm Introduction (Back To Back SWE)](https://www.youtube.com/watch?v=Zq4upTEaQyM) - General backtracking concepts

### Problem-Specific Tutorials

- [LeetCode 39 - Combination Sum (Nick White)](https://www.youtube.com/watch?v=qsMb8Oj2p9E) - Step-by-step solution
- [Combination Sum II & III (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=J8vRL1LLjC4) - Variations explained
- [Combination Sum IV - DP Solution](https://www.youtube.com/watch?v=dw22KyPzn2Y) - Dynamic programming approach

### Advanced Topics

- [Backtracking vs Dynamic Programming](https://www.youtube.com/watch?v=Hv73s1jwQdd) - When to use each
- [Pruning Techniques in Backtracking](https://www.youtube.com/watch?v=73l5p8b3Nrs) - Optimization strategies
- [Time and Space Complexity Analysis](https://www.youtube.com/watch?v=0TNztf2r6Hk) - Detailed complexity breakdown

---

## Follow-up Questions

### Q1: Why do we use the same index `i` instead of `i+1` in the recursive call?

**Answer:** We use the same index `i` to allow **unlimited reuse** of the same element:
- `backtrack(i, ...)` allows using `candidates[i]` again
- `backtrack(i+1, ...)` would only allow using elements after `i` (no reuse)
- This is the key difference between Combination Sum I (unlimited reuse) and Combination Sum II (single use)

---

### Q2: What happens if we don't sort the candidates array?

**Answer:** The algorithm still works but without optimization:
- **Correctness**: Unchanged - all valid combinations are still found
- **Performance**: Loses pruning optimization - can't break early when `candidate > remaining`
- **Duplicates**: Still avoided by the start index constraint
- **Recommendation**: Always sort for better performance, especially with large targets

---

### Q3: How do we handle negative numbers in candidates?

**Answer:** The standard algorithm requires modification:
- **Problem**: With negative numbers, the recursion may not terminate
- **Solution**: Add additional constraints (e.g., limit combination length)
- **Alternative**: Use Dynamic Programming with memoization
- **Note**: Most Combination Sum problems specify positive integers only

---

### Q4: What is the maximum input size this algorithm can handle?

**Answer:** Practical limits depend on constraints:
- **Candidates (n)**: Up to ~30 for backtracking (exponential complexity)
- **Target**: Up to ~500 (affects recursion depth and pruning effectiveness)
- **Time**: Worst case 2^30 ≈ 1 billion operations (too slow)
- **Space**: Recursion depth limited by target/min_candidate
- **For larger inputs**: Use Dynamic Programming or memoization

---

### Q5: How does this differ from the 0/1 Knapsack problem?

**Answer:** Key differences:
| Aspect | Combination Sum | 0/1 Knapsack |
|--------|-----------------|--------------|
| **Reuse** | Unlimited | Each item once |
| **Goal** | Exact sum match | Maximize value within capacity |
| **Output** | All valid combinations | Maximum value |
| **Approach** | Backtracking | DP (usually) |
| **Complexity** | O(2^n) | O(n × W) |

Combination Sum is essentially the **unbounded knapsack** variant with exact sum constraint.

---

## Summary

The Combination Sum algorithm is a classic **backtracking** problem that demonstrates systematic exploration of all possible solutions. Key takeaways:

- **Backtracking pattern**: Choose → Explore → Unchoose
- **Unlimited reuse**: Use same index `i` in recursive call
- **Avoid duplicates**: Only explore candidates from current index forward
- **Pruning**: Sort candidates to enable early termination
- **Trade-offs**: Backtracking for enumeration, DP for counting only

### When to Use:
- ✅ Finding all valid combinations/subsets
- ✅ Target sum problems with unlimited element reuse
- ✅ Input size is small to moderate (n ≤ 30)

### When NOT to Use:
- ❌ When you only need the count (use DP)
- ❌ Very large input sizes (exponential complexity)
- ❌ Problems requiring optimization (max/min value)

### Key Implementation Points:
1. Sort candidates for pruning (optional but recommended)
2. Recursive function with `start` index parameter
3. Base case when remaining target equals 0
4. Loop from `start` to end of candidates
5. Backtrack by removing last added element

This pattern appears frequently in technical interviews and competitive programming, making it essential to master the backtracking approach and understand when to apply optimizations.

---

## Related Algorithms

- [Backtracking](./backtracking.md) - General backtracking patterns
- [Subset Generation](./subsets.md) - Generating all subsets
- [Permutations](./permutations.md) - Generating all orderings
- [0/1 Knapsack](./knapsack-01.md) - Single-use item variant
- [Unbounded Knapsack](./unbounded-knapsack.md) - Similar unlimited reuse pattern
- [Dynamic Programming](./dynamic-programming.md) - Alternative for counting problems
