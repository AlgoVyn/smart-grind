# Permutation Sequence

## Problem Description

The set `[1, 2, 3, ..., n]` contains a total of `n!` unique permutations. By listing and labeling all of the permutations in order, we get the following sequence for `n = 3`:

```
"123"
"132"
"213"
"231"
"312"
"321"
```

Given `n` and `k`, return the `kth` permutation sequence.

**Link to problem:** [Permutation Sequence - LeetCode 60](https://leetcode.com/problems/permutation-sequence/)

## Constraints
- `1 <= n <= 9`
- `1 <= k <= n!`

---

## Pattern: Mathematical Computation using Factorial Number System

This problem uses the **Factorial Number System** (also known as factoradic) to determine the k-th permutation without generating all permutations. The key insight is that for n elements, there are (n-1)! permutations starting with each first element.

### Core Concept

The factorial number system allows us to compute which digits appear at each position:
- At position 0, there are n choices, each with (n-1)! permutations
- At position 1, there are (n-1) choices, each with (n-2)! permutations
- And so on...

By dividing k by the factorial of (n-1-i), we can determine which digit to pick at each position.

---

## Examples

### Example

**Input:**
```
n = 3, k = 3
```

**Output:**
```
"213"
```

**Explanation:** The permutations in order are:
1. "123"
2. "132"
3. "213" ← k=3
4. "231"
5. "312"
6. "321"

### Example 2

**Input:**
```
n = 4, k = 9
```

**Output:**
```
"2314"
```

**Explanation:** 
- Position 0: (4-1)! = 6 permutations per starting digit
- k=9, index = 9//6 = 1, so first digit is "2"
- Remaining k: 9 % 6 = 3
- Position 1: (3-1)! = 2 permutations per digit
- index = 3//2 = 1, so second digit is "3"
- And so on...

### Example 3

**Input:**
```
n = 3, k = 1
```

**Output:**
```
"123"
```

---

## Intuition

The key insight is that we don't need to generate all permutations. Instead:

1. **Factorial Calculation**: For n elements, there are (n-1)! ways to arrange the remaining n-1 elements
2. **Index Calculation**: Use k-1 (0-based) to determine which block of permutations we're in
3. **Digit Selection**: At each position, calculate which digit to pick based on the factorial of remaining positions

This is essentially computing a number in the factoradic number system, where each "digit" represents which element to pick from the remaining available numbers.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Factorial Number System (Optimal)** - O(n²) time, O(n) space
2. **Brute Force Generation** - O(n! × n) time - Not practical for large n

---

## Approach 1: Factorial Number System (Optimal)

This is the standard solution that uses the mathematical property of permutations.

### Algorithm Steps

1. Initialize list of available numbers `[1, 2, ..., n]`
2. Decrement k by 1 to convert to 0-based indexing
3. For each position i from 0 to n-1:
   - Calculate factorial of (n - 1 - i)
   - Determine the index: k // factorial
   - Pick the number at that index from available numbers
   - Remove it from the available list
   - Update k with k % factorial
4. Join and return the result

### Why It Works

The factorial number system allows us to directly compute which digit should be at each position without generating all previous permutations. Each position has a fixed number of permutations (factorial of remaining positions), so we can use division to skip whole blocks.

### Code Implementation

````carousel
```python
import math
from typing import List

class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        """
        Get the kth permutation sequence.
        
        Args:
            n: Number of elements (1 to n)
            k: The kth permutation to find (1-indexed)
            
        Returns:
            The kth permutation as a string
        """
        # Available numbers to choose from
        nums: List[int] = list(range(1, n + 1))
        
        # Convert to 0-based index
        k -= 1
        
        result: List[str] = []
        
        for i in range(n):
            # Calculate factorial of remaining positions
            fact = math.factorial(n - 1 - i)
            
            # Determine which number to pick
            index = k // fact
            result.append(str(nums[index]))
            
            # Remove the picked number
            nums.pop(index)
            
            # Update k for next iteration
            k %= fact
        
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    /**
     * Get the kth permutation sequence.
     * 
     * @param n Number of elements (1 to n)
     * @param k The kth permutation to find (1-indexed)
     * @return The kth permutation as a string
     */
    string getPermutation(int n, int k) {
        vector<int> nums;
        for (int i = 1; i <= n; i++) {
            nums.push_back(i);
        }
        
        // Convert to 0-based index
        k--;
        
        string result = "";
        
        for (int i = 0; i < n; i++) {
            // Calculate factorial of remaining positions
            int fact = 1;
            for (int j = 1; j <= n - 1 - i; j++) {
                fact *= j;
            }
            
            // Determine which number to pick
            int index = k / fact;
            result += to_string(nums[index]);
            
            // Remove the picked number
            nums.erase(nums.begin() + index);
            
            // Update k for next iteration
            k %= fact;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Get the kth permutation sequence.
     * 
     * @param n Number of elements (1 to n)
     * @param k The kth permutation to find (1-indexed)
     * @return The kth permutation as a string
     */
    public String getPermutation(int n, int k) {
        // Available numbers to choose from
        List<Integer> nums = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            nums.add(i);
        }
        
        // Convert to 0-based index
        k--;
        
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < n; i++) {
            // Calculate factorial of remaining positions
            int fact = 1;
            for (int j = 1; j <= n - 1 - i; j++) {
                fact *= j;
            }
            
            // Determine which number to pick
            int index = k / fact;
            result.append(nums.get(index));
            
            // Remove the picked number
            nums.remove(index);
            
            // Update k for next iteration
            k %= fact;
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Get the kth permutation sequence.
 * 
 * @param {number} n - Number of elements (1 to n)
 * @param {number} k - The kth permutation to find (1-indexed)
 * @return {string} - The kth permutation as a string
 */
var getPermutation = function(n, k) {
    // Available numbers to choose from
    const nums = [];
    for (let i = 1; i <= n; i++) {
        nums.push(i);
    }
    
    // Convert to 0-based index
    k--;
    
    let result = '';
    
    for (let i = 0; i < n; i++) {
        // Calculate factorial of remaining positions
        let fact = 1;
        for (let j = 1; j <= n - 1 - i; j++) {
            fact *= j;
        }
        
        // Determine which number to pick
        const index = Math.floor(k / fact);
        result += nums[index];
        
        // Remove the picked number
        nums.splice(index, 1);
        
        // Update k for next iteration
        k %= fact;
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - For each position, we calculate factorial and remove an element from the list |
| **Space** | O(n) - For storing the list of available numbers and result |

---

## Approach 2: Brute Force Generation (Not Optimal)

This approach generates all permutations and returns the k-th one. Not practical for n > 9.

### Algorithm Steps

1. Generate all permutations using recursion
2. Sort them lexicographically
3. Return the k-th permutation

### Code Implementation

````carousel
```python
from itertools import permutations
import math

class Solution:
    def getPermutation_bruteforce(self, n: int, k: int) -> str:
        """
        Brute force approach - not recommended for large n.
        """
        nums = [str(i) for i in range(1, n + 1)]
        all_perms = permutations(nums)
        sorted_perms = sorted(all_perms)
        return ''.join(sorted_perms[k - 1])
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <algorithm>
#include <iostream>

class Solution {
public:
    void helper(int n, int k, int current, vector<int>& nums, vector<bool>& used, string& result, int& count) {
        if (current == n) {
            count++;
            if (count == k) return;
            return;
        }
        
        for (int i = 0; i < n; i++) {
            if (!used[i]) {
                result += to_string(nums[i]);
                used[i] = true;
                helper(n, k, current + 1, nums, used, result, count);
                if (count == k) return;
                used[i] = false;
                result.pop_back();
            }
        }
    }
    
    string getPermutation(int n, int k) {
        vector<int> nums;
        for (int i = 1; i <= n; i++) nums.push_back(i);
        vector<bool> used(n, false);
        string result = "";
        int count = 0;
        helper(n, k, 0, nums, used, result, count);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    private int count = 0;
    private String answer = "";
    
    public String getPermutation(int n, int k) {
        List<Integer> nums = new ArrayList<>();
        boolean[] used = new boolean[n];
        
        for (int i = 1; i <= n; i++) {
            nums.add(i);
        }
        
        helper(n, k, new StringBuilder(), nums, used);
        return answer;
    }
    
    private void helper(int n, int k, StringBuilder sb, List<Integer> nums, boolean[] used) {
        if (sb.length() == n) {
            count++;
            if (count == k) {
                answer = sb.toString();
            }
            return;
        }
        
        for (int i = 0; i < n; i++) {
            if (!used[i]) {
                sb.append(nums.get(i));
                used[i] = true;
                helper(n, k, sb, nums, used);
                if (count == k) return;
                used[i] = false;
                sb.deleteCharAt(sb.length() - 1);
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force approach - not recommended for large n.
 * 
 * @param {number} n - Number of elements
 * @param {number} k - The kth permutation to find
 * @return {string} - The kth permutation
 */
var getPermutation = function(n, k) {
    const nums = [];
    for (let i = 1; i <= n; i++) {
        nums.push(i);
    }
    
    const result = [];
    const used = new Array(n).fill(false);
    
    function helper(current) {
        if (current.length === n) {
            result.push(current.join(''));
            return;
        }
        
        for (let i = 0; i < n; i++) {
            if (!used[i]) {
                used[i] = true;
                helper([...current, nums[i]]);
                used[i] = false;
            }
        }
    }
    
    helper([]);
    return result.sort()[k - 1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n! × n) - Generate all n! permutations |
| **Space** | O(n! × n) - Store all permutations |

---

## Comparison of Approaches

| Aspect | Factorial Number System | Brute Force |
|--------|------------------------|-------------|
| **Time Complexity** | O(n²) | O(n! × n) |
| **Space Complexity** | O(n) | O(n! × n) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | All valid inputs | Not recommended |

**Best Approach:** The factorial number system approach (Approach 1) is optimal and the standard solution.

---

## Related Problems

Based on similar themes (permutations, factorial, mathematical patterns):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Next Permutation | [Link](https://leetcode.com/problems/next-permutation/) | Find next lexicographic permutation |
| Permutations | [Link](https://leetcode.com/problems/permutations/) | Generate all permutations |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Permutations II | [Link](https://leetcode.com/problems/permutations-ii/) | Generate permutations with duplicates |
| Letter Case Permutation | [Link](https://leetcode.com/problems/letter-case-permutation/) | Permutations with letter cases |
| Find the Permutation | [Link](https://leetcode.com/problems/find-the-permutation/) | Permutation from conversion array |

### Pattern Reference

For more detailed explanations of mathematical patterns and factorial-based approaches, see:
- **[DP - Fibonacci Style](/patterns/dp-1d-array-fibonacci)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Factorial Number System

- [NeetCode - Permutation Sequence](https://www.youtube.com/watch?v=wJ7MtQM9jzo) - Clear explanation with visual examples
- [Permutation Sequence - Back to Back SWE](https://www.youtube.com/watch?v=Dz-7rXsPqA0) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=wJ7MtQM9jzo) - Official problem solution

### Related Concepts

- [Factorial Number System Explained](https://www.youtube.com/watch?v=wJ7MtQM9jzo) - Understanding factoradic
- [Permutations and Combinations](https://www.youtube.com/watch?v=wJ7MtQM9jzo) - Mathematical foundations

---

## Follow-up Questions

### Q1: Can you solve it in O(n) time?

**Answer:** Not exactly O(n), but the factorial calculation can be optimized by precomputing factorials in O(n) time and using them for O(1) lookups. The overall complexity remains O(n²) due to list removal operations, but you can use a more efficient data structure like a Fenwick Tree to achieve O(n log n).

---

### Q2: How would you handle duplicate numbers in the input?

**Answer:** This problem assumes unique numbers 1 to n. If duplicates were allowed, you'd need to account for duplicate permutations. You would need to skip duplicate indices at each position to avoid generating duplicate permutations.

---

### Q3: What data structure can optimize the element removal operation?

**Answer:** Instead of using a list (which has O(n) removal), you can use:
- A Fenwick Tree (Binary Indexed Tree) to track available positions in O(log n)
- An Order Statistic Tree for O(log n) selection by rank

---

### Q4: How does this relate to the factoradic number system?

**Answer:** The solution essentially converts k-1 to a factoradic number. Each "digit" in the factoradic representation tells you which element to pick from the remaining available elements.

---

### Q5: What is the maximum n you can handle with this approach?

**Answer:** Since constraints are 1 <= n <= 9, the factorial values fit in standard integer types. For larger n, you'd need arbitrary precision arithmetic or handle overflow carefully.

---

### Q6: How would you implement this with precomputed factorials?

**Answer:** Precompute factorials in an array: fact[0] = 1, fact[i] = fact[i-1] * i. Then use these precomputed values instead of calculating factorial each time.

---

### Q7: What edge cases should be tested?

**Answer:**
- n = 1, k = 1 (single element)
- n = 9, k = 9! (maximum case)
- k = 1 (first permutation)
- k = n! (last permutation)
- k just after a factorial boundary

---

### Q8: How would you reverse this process (given permutation, find k)?

**Answer:** For a given permutation, you can find its rank k by:
1. Start with k = 0
2. For each position i, count how many unused elements are smaller than the current element
3. Add count × (n-1-i)! to k
4. Mark the element as used

---

### Q9: Can you solve it iteratively without recursion?

**Answer:** Yes! The factorial number system approach is inherently iterative. The brute force approach can also be implemented iteratively using a stack or iterative generation.

---

### Q10: How would you extend this to return the k permutations starting from the k-th?

**Answer:** After finding the k-th permutation, you can simply generate the next permutations by applying the "next permutation" algorithm repeatedly until you've generated the desired number.

---

## Common Pitfalls

### 1. 0-based vs 1-based Index
**Issue:** Forgetting to decrement k by 1 for 0-based indexing.

**Solution:** Always subtract 1 from k before using it in calculations.

### 2. Factorial Overflow
**Issue:** For n > 12, factorial exceeds 32-bit integer.

**Solution:** The problem constraints (n <= 9) prevent this, but use long long for larger n.

### 3. List Removal
**Issue:** Removing elements from a list is O(n), making overall complexity O(n²).

**Solution:** Use a more efficient data structure if performance is critical.

### 4. Wrong Index Calculation
**Issue:** Using integer division incorrectly.

**Solution:** Use // for integer division to get the correct index.

### 5. Forgetting to Update k
**Issue:** Not updating k after picking an element.

**Solution:** Always use k = k % factorial to get the remainder for the next iteration.

---

## Summary

The **Permutation Sequence** problem demonstrates the power of mathematical reasoning and the factorial number system:

- **Optimal Solution**: O(n²) time using factoradic representation
- **Key Insight**: Don't generate all permutations; compute directly
- **Data Structures**: List for available numbers, string for result

The key insight is that we can determine which digit should be at each position by dividing k by the factorial of remaining positions. This avoids generating all permutations and is the standard solution for this problem.

### Pattern Summary

This problem exemplifies the **Mathematical Computation using Factorial Number System** pattern, which is characterized by:
- Using factorials to determine positions
- Converting k to factoradic representation
- Direct computation without generation
- O(n²) time complexity

For more details on mathematical patterns, see **[DP - Fibonacci Style](/patterns/dp-1d-array-fibonacci)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/permutation-sequence/discuss/) - Community solutions
- [Factorial Number System - Wikipedia](https://en.wikipedia.org/wiki/Factorial_number_system) - Mathematical background
- [Permutation Algorithms - GeeksforGeeks](https://www.geeksforgeeks.org/permutation-and-combination/) - Understanding permutations
- [Pattern: DP - Fibonacci Style](/patterns/dp-1d-array-fibonacci) - Related pattern guide
