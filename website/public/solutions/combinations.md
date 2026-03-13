# Combinations

## Problem Description

Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].
You may return the answer in any order.

---

## Examples

**Example 1:**

**Input:**
```
n = 4, k = 2
```

**Output:**
```
[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
```

**Explanation:** There are 4 choose 2 = 6 total combinations.
Note that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination.

---

**Example 2:**

**Input:**
```
n = 1, k = 1
```

**Output:**
```
[[1]]
```

**Explanation:** There is 1 choose 1 = 1 total combination.

---

## Constraints

- `1 <= n <= 20`
- `1 <= k <= n`

---

## Intuition

The key insight is that we need to generate all combinations of k elements from [1, n]. This is a classic backtracking problem where we:

1. Make a choice (include a number)
2. Recurse with reduced requirements
3. Undo the choice (backtrack)

To avoid duplicates, we only consider numbers greater than the last chosen number. This ensures we generate each combination exactly once.

---

## Pattern: Backtracking - Combination Generation

### Core Concept

The Combinations problem demonstrates the **Backtracking** pattern for generating combinations. This pattern systematically explores all possible solutions by building candidates and abandoning them when they can't lead to a valid solution:

1. **Incremental Build**: Construct solution one element at a time
2. **Pruning**: Skip branches that can't lead to valid solutions
3. **Backtrack**: Undo choices to explore other branches

### When to Use This Pattern

This pattern applies when:
- Need to generate all combinations or permutations
- Problems involving selection/subset generation
- Constraint satisfaction problems
- Problems where order doesn't matter (combinations vs permutations)

### Alternative Patterns

| Alternative Pattern | Use Case |
|---------------------|----------|
| **Iterative Generation** | When recursion is not allowed |
| **Bit Manipulation** | For small n, generate subsets via bitmasks |
| **Heap's Algorithm** | For generating permutations |

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Backtracking (Optimal)** - O(C(n,k) * k) time
2. **Iterative Combination Generation** - O(C(n,k) * k) time
3. **Lexicographic Generation** - O(C(n,k) * k) time

---

## Approach 1: Backtracking (Optimal)

This is the most intuitive and commonly used approach.

### Why It Works

We build combinations incrementally. At each step, we can either:
- Add the current number and recurse (if we haven't filled k spots)
- Skip the current number

The key constraint is that we only consider numbers in increasing order to avoid duplicates.

### Algorithm Steps

1. Start with an empty combination
2. At each step, try adding numbers from the current position to n
3. If the combination reaches size k, add it to results
4. Backtrack by removing the last added number

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        """
        Generate all combinations of k numbers from 1 to n.
        
        Args:
            n: Upper limit of numbers
            k: Size of each combination
            
        Returns:
            List of all valid combinations
        """
        result = []
        
        def backtrack(start: int, path: List[int]):
            # If we've selected k numbers, add to result
            if len(path) == k:
                result.append(path[:])
                return
            
            # Try adding each number from start to n
            for i in range(start, n + 1):
                path.append(i)
                backtrack(i + 1, path)
                path.pop()
        
        backtrack(1, [])
        return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> combine(int n, int k) {
        vector<vector<int>> result;
        vector<int> path;
        
        function<void(int)> backtrack = [&](int start) {
            if (path.size() == k) {
                result.push_back(path);
                return;
            }
            
            for (int i = start; i <= n; i++) {
                path.push_back(i);
                backtrack(i + 1);
                path.pop_back();
            }
        };
        
        backtrack(1);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        List<Integer> path = new ArrayList<>();
        
        backtrack(n, k, 1, path, result);
        return result;
    }
    
    private void backtrack(int n, int k, int start, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = start; i <= n; i++) {
            path.add(i);
            backtrack(n, k, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function(n, k) {
    const result = [];
    
    const backtrack = (start, path) => {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i <= n; i++) {
            path.push(i);
            backtrack(i + 1, path);
            path.pop();
        }
    };
    
    backtrack(1, []);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(C(n,k) * k) - Generate C(n,k) combinations, each of size k |
| **Space** | O(k) - For recursion stack plus output |

---

## Approach 2: Iterative Combination Generation

This approach generates combinations iteratively without recursion.

### Why It Works

We can simulate the backtracking process iteratively using a state array that tracks which indices are currently selected.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def combine_iterative(self, n: int, k: int) -> List[List[int]]:
        """
        Generate combinations iteratively.
        
        Args:
            n: Upper limit of numbers
            k: Size of each combination
            
        Returns:
            List of all valid combinations
        """
        result = []
        # Initialize first combination: [1, 2, ..., k]
        combo = list(range(1, k + 1))
        
        while True:
            result.append(combo[:])
            
            # Find the rightmost element that can be incremented
            i = k - 1
            while i >= 0 and combo[i] == n - k + i + 1:
                i -= 1
            
            if i < 0:
                break
            
            # Increment this element and adjust the rest
            combo[i] += 1
            for j in range(i + 1, k):
                combo[j] = combo[j - 1] + 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> combine(int n, int k) {
        vector<vector<int>> result;
        vector<int> combo(k);
        
        for (int i = 0; i < k; i++) {
            combo[i] = i + 1;
        }
        
        while (true) {
            result.push_back(combo);
            
            int i = k - 1;
            while (i >= 0 && combo[i] == n - k + i + 1) {
                i--;
            }
            
            if (i < 0) break;
            
            combo[i]++;
            for (int j = i + 1; j < k; j++) {
                combo[j] = combo[j - 1] + 1;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        int[] combo = new int[k];
        
        for (int i = 0; i < k; i++) {
            combo[i] = i + 1;
        }
        
        while (true) {
            List<Integer> curr = new ArrayList<>();
            for (int num : combo) {
                curr.add(num);
            }
            result.add(curr);
            
            int i = k - 1;
            while (i >= 0 && combo[i] == n - k + i + 1) {
                i--;
            }
            
            if (i < 0) break;
            
            combo[i]++;
            for (int j = i + 1; j < k; j++) {
                combo[j] = combo[j - 1] + 1;
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var combine = function(n, k) {
    const result = [];
    const combo = Array.from({ length: k }, (_, i) => i + 1);
    
    while (true) {
        result.push([...combo]);
        
        let i = k - 1;
        while (i >= 0 && combo[i] === n - k + i + 1) {
            i--;
        }
        
        if (i < 0) break;
        
        combo[i]++;
        for (let j = i + 1; j < k; j++) {
            combo[j] = combo[j - 1] + 1;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(C(n,k) * k) |
| **Space** | O(k) - For the current combination |

---

## Comparison of Approaches

| Aspect | Backtracking | Iterative |
|--------|-------------|-----------|
| **Time Complexity** | O(C(n,k) * k) | O(C(n,k) * k) |
| **Space Complexity** | O(k) | O(k) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Best For** | Interview favorite | Avoiding recursion |

Both approaches are efficient. The backtracking approach is more commonly used due to its simplicity.

---

## Related Problems

Based on similar themes (combinations, backtracking):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Permutations | [Link](https://leetcode.com/problems/permutations/) | Generate all permutations |
| Subsets | [Link](https://leetcode.com/problems/subsets/) | Generate all subsets |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Combination Sum | [Link](https://leetcode.com/problems/combination-sum/) | Combinations with sum target |
| Combination Sum II | [Link](https://leetcode.com/problems/combination-sum-ii/) | Combinations with duplicates |

---

## Video Tutorial Links

### Backtracking

- [NeetCode - Combinations](https://www.youtube.com/watch?v=q0mJ7M7M1kY) - Clear explanation
- [Combination Generation](https://www.youtube.com/watch?v=7C9xY2M7M5M) - Step-by-step

### Combinations vs Permutations

- [Combinations vs Permutations](https://www.youtube.com/watch?v=7C9xY2M7M5M) - Understanding the difference

---

## Follow-up Questions

### Q1: What is the total number of combinations?

**Answer:** C(n, k) = n! / (k! * (n-k)!), also written as "n choose k".

---

### Q2: How would you modify to handle duplicates?

**Answer:** Sort the input first, then skip duplicates during backtracking by checking if the current number equals the previous and that we haven't already used the previous.

---

### Q3: What if you need combinations of variable size?

**Answer:** Loop through all possible k values from 1 to n and collect all combinations.

---

### Q4: How would you generate combinations in parallel?

**Answer:** Use a divide-and-conquer approach to generate different ranges of combinations in parallel threads or processes.

---

### Q5: What edge cases should be tested?

**Answer:**
- n = k (only one combination)
- k = 1 (n combinations)
- n = 20, k = 10 (maximum, many combinations)
- Invalid inputs

---

## Summary

The **Combinations** problem demonstrates the power of backtracking:

- **Backtracking**: Optimal O(C(n,k) * k) time with O(k) space
- **Iterative**: Same complexity, avoids recursion

The key insight is to only consider numbers in increasing order to avoid duplicates. This ensures each combination is generated exactly once.

---

## Common Pitfalls

### 1. Not Using Deep Copy
**Issue:** Adding the path list directly to results without copying.

**Solution:** Use `path[:]` or `new ArrayList<>(path)` to create a copy.

### 2. Wrong Start Index
**Issue:** Starting from wrong index causing duplicates or missing combinations.

**Solution:** Pass `i + 1` as next start to ensure strictly increasing numbers.

### 3. Forgetting to Backtrack
**Issue:** Not removing the last element after recursion, causing incorrect combinations.

**Solution:** Always call `path.pop()` after recursive call.

### 4. Integer Overflow for Large n
**Issue:** C(20, 10) = 184,756 combinations can cause memory issues.

**Solution:** Problem constraints (n ≤ 20) are manageable, but be mindful of output size.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/combinations/)
- [Combination Formula](https://en.wikipedia.org/wiki/Combination)
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/)
