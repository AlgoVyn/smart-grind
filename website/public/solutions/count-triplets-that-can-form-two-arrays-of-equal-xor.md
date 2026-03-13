# Count Triplets That Can Form Two Arrays of Equal XOR

## Problem Description

Given an array of integers `arr`.
We want to select three indices `i`, `j` and `k` where `0 <= i < j <= k < arr.length`.
Let's define `a` and `b` as follows:

```
a = arr[i] ^ arr[i + 1] ^ ... ^ arr[j - 1]
b = arr[j] ^ arr[j + 1] ^ ... ^ arr[k]
```

Note that `^` denotes the bitwise-xor operation.
Return the number of triplets `(i, j and k)` where `a == b`.

**Link to problem:** [Count Triplets That Can Form Two Arrays of Equal XOR - LeetCode 1442](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/)

## Constraints
- `1 <= arr.length <= 300`
- `1 <= arr[i] <= 10^8`

---

## Pattern: Prefix XOR with Mathematical Optimization

This problem demonstrates the **Prefix XOR** pattern with mathematical optimization. The key insight is that `a == b` when `a ^ b == 0`, which simplifies to a condition on prefix XORs.

### Core Concept

The fundamental idea is:
- **XOR Properties**: `a ^ b = 0` when `a == b`
- **Prefix XOR**: Use prefix XOR array for O(1) range queries
- **Mathematical Optimization**: When prefix[i] == prefix[k+1], all j between i+1 and k work

---

## Examples

### Example

**Input:**
```
arr = [2,3,1,6,7]
```

**Output:**
```
4
```

**Explanation:** The triplets are (0,1,2), (0,2,2), (2,3,4) and (2,4,4)

### Example 2

**Input:**
```
arr = [1,1,1,1,1]
```

**Output:**
```
10
```

---

## Intuition

The key insight is that when `a == b`, we have:
- `a ^ b = 0`
- `arr[i] ^ ... ^ arr[j-1] ^ arr[j] ^ ... ^ arr[k] = 0`
- This is equivalent to: `prefix[i] ^ prefix[k+1] = 0`
- Therefore: `prefix[i] == prefix[k+1]`

When `prefix[i] == prefix[k+1]`, for every j in [i+1, k], the triplet (i, j, k) satisfies the condition.

### Mathematical Insight

If `prefix[i] == prefix[k+1]`, then there are (k - i) valid values of j, each giving a valid triplet.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Prefix XOR with Optimization** - O(n²) time, O(n) space
2. **Prefix XOR with Hash Map** - O(n) time, O(n) space
3. **Brute Force** - O(n³) time

---

## Approach 1: Prefix XOR with Mathematical Optimization

This is the optimal approach that uses the mathematical insight to reduce complexity.

### Algorithm Steps

1. Compute the prefix XOR array where `prefix[0] = 0`, `prefix[i+1] = prefix[i] ^ arr[i]`
2. For each pair (i, k) where i < k:
   - Check if `prefix[i] == prefix[k+1]`
   - If yes, add (k - i) to the count
3. Return the total count

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countTriplets(self, arr: List[int]) -> int:
        """
        Count triplets using prefix XOR with mathematical optimization.
        
        Args:
            arr: Input array of integers
            
        Returns:
            Number of valid triplets
        """
        n = len(arr)
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] ^ arr[i]
        
        count = 0
        for i in range(n):
            for k in range(i + 1, n):
                if prefix[i] == prefix[k + 1]:
                    count += (k - i)
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    int countTriplets(vector<int>& arr) {
        /**
         * Count triplets using prefix XOR with mathematical optimization.
         * 
         * Args:
         *     arr: Input array of integers
         * 
         * Returns:
         *     Number of valid triplets
         */
        int n = arr.size();
        vector<int> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] ^ arr[i];
        }
        
        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int k = i + 1; k < n; k++) {
                if (prefix[i] == prefix[k + 1]) {
                    count += (k - i);
                }
            }
        }
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countTriplets(int[] arr) {
        /**
         * Count triplets using prefix XOR with mathematical optimization.
         * 
         * Args:
         *     arr: Input array of integers
         * 
         * Returns:
         *     Number of valid triplets
         */
        int n = arr.length;
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] ^ arr[i];
        }
        
        int count = 0;
        for (int i = 0; i < n; i++) {
            for (int k = i + 1; k < n; k++) {
                if (prefix[i] == prefix[k + 1]) {
                    count += (k - i);
                }
            }
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Count triplets using prefix XOR with mathematical optimization.
 * 
 * @param {number[]} arr - Input array of integers
 * @return {number} - Number of valid triplets
 */
var countTriplets = function(arr) {
    const n = arr.length;
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] ^ arr[i];
    }
    
    let count = 0;
    for (let i = 0; i < n; i++) {
        for (let k = i + 1; k < n; k++) {
            if (prefix[i] === prefix[k + 1]) {
                count += (k - i);
            }
        }
    }
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - n <= 300, so this is acceptable |
| **Space** | O(n) - for prefix array |

---

## Approach 2: Prefix XOR with Hash Map

This approach further optimizes using a hash map to group indices with same prefix XOR values.

### Algorithm Steps

1. Compute prefix XOR array
2. Use hash maps to track:
   - Count of each prefix XOR value
   - Sum of indices for each prefix XOR value
3. For each position i, use the formula to compute contributions

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def countTriplets_map(self, arr: List[int]) -> int:
        """
        Count triplets using hash map optimization.
        """
        count = 0
        prefix = 0
        # Maps prefix XOR value to [count, sum of indices]
        memo = {0: [1, -1]}  # prefix[0] = 0 at index -1
        
        for i, num in enumerate(arr):
            prefix ^= num
            if prefix in memo:
                c, s = memo[prefix]
                count += c * i - s - c
            # Update memo for current prefix
            memo[prefix] = memo.get(prefix, [0, 0])
            memo[prefix][0] += 1
            memo[prefix][1] += i
        
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    int countTriplets(vector<int>& arr) {
        unordered_map<int, pair<int, int>> memo;
        memo[0] = {1, -1};  // prefix[0] = 0 at index -1
        
        int prefix = 0;
        int count = 0;
        
        for (int i = 0; i < arr.size(); i++) {
            prefix ^= arr[i];
            if (memo.count(prefix)) {
                auto [c, s] = memo[prefix];
                count += c * i - s - c;
            }
            memo[prefix].first += 1;
            memo[prefix].second += i;
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countTriplets(int[] arr) {
        Map<Integer, int[]> memo = new HashMap<>();
        memo.put(0, new int[]{1, -1});  // prefix[0] = 0 at index -1
        
        int prefix = 0;
        int count = 0;
        
        for (int i = 0; i < arr.length; i++) {
            prefix ^= arr[i];
            if (memo.containsKey(prefix)) {
                int c = memo.get(prefix)[0];
                int s = memo.get(prefix)[1];
                count += c * i - s - c;
            }
            memo.putIfAbsent(prefix, new int[]{0, 0});
            memo.get(prefix)[0] += 1;
            memo.get(prefix)[1] += i;
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Count triplets using hash map optimization.
 * 
 * @param {number[]} arr - Input array of integers
 * @return {number} - Number of valid triplets
 */
var countTriplets = function(arr) {
    const memo = new Map();
    memo.set(0, [1, -1]);  // prefix[0] = 0 at index -1
    
    let prefix = 0;
    let count = 0;
    
    for (let i = 0; i < arr.length; i++) {
        prefix ^= arr[i];
        if (memo.has(prefix)) {
            const [c, s] = memo.get(prefix);
            count += c * i - s - c;
        }
        if (!memo.has(prefix)) {
            memo.set(prefix, [0, 0]);
        }
        const [c, s] = memo.get(prefix);
        memo.set(prefix, [c + 1, s + i]);
    }
    
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass with hash map |
| **Space** | O(n) - For hash map |

---

## Approach 3: Brute Force

A simple O(n³) approach for understanding, not recommended for production.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def countTriplets_brute(self, arr: List[int]) -> int:
        """
        Brute force approach - O(n³).
        """
        n = len(arr)
        count = 0
        for i in range(n):
            a = 0
            for j in range(i + 1, n):
                a ^= arr[j - 1]
                b = 0
                for k in range(j, n):
                    b ^= arr[k]
                    if a == b:
                        count += 1
        return count
```

<!-- slide -->
```cpp
class Solution {
public:
    int countTriplets(vector<int>& arr) {
        int n = arr.size();
        int count = 0;
        for (int i = 0; i < n; i++) {
            int a = 0;
            for (int j = i + 1; j < n; j++) {
                a ^= arr[j - 1];
                int b = 0;
                for (int k = j; k < n; k++) {
                    b ^= arr[k];
                    if (a == b) count++;
                }
            }
        }
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int countTriplets(int[] arr) {
        int n = arr.length;
        int count = 0;
        for (int i = 0; i < n; i++) {
            int a = 0;
            for (int j = i + 1; j < n; j++) {
                a ^= arr[j - 1];
                int b = 0;
                for (int k = j; k < n; k++) {
                    b ^= arr[k];
                    if (a == b) count++;
                }
            }
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Brute force approach - O(n³).
 * 
 * @param {number[]} arr - Input array of integers
 * @return {number} - Number of valid triplets
 */
var countTriplets = function(arr) {
    const n = arr.length;
    let count = 0;
    for (let i = 0; i < n; i++) {
        let a = 0;
        for (let j = i + 1; j < n; j++) {
            a ^= arr[j - 1];
            let b = 0;
            for (let k = j; k < n; k++) {
                b ^= arr[k];
                if (a === b) count++;
            }
        }
    }
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n³) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Prefix XOR O(n²) | Hash Map O(n) | Brute Force |
|--------|-----------------|---------------|-------------|
| **Time Complexity** | O(n²) | O(n) | O(n³) |
| **Space Complexity** | O(n) | O(n) | O(1) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | n <= 300 | Large n | Learning |

**Best Approach:** Hash Map approach is optimal for large n, but prefix XOR O(n²) is acceptable since n <= 300.

---

## Why Prefix XOR Works

The mathematical insight is powerful:
1. `a = arr[i] ^ ... ^ arr[j-1] = prefix[j] ^ prefix[i]`
2. `b = arr[j] ^ ... ^ arr[k] = prefix[k+1] ^ prefix[j]`
3. `a == b` when `prefix[j] ^ prefix[i] == prefix[k+1] ^ prefix[j]`
4. This simplifies to: `prefix[i] == prefix[k+1]`

When `prefix[i] == prefix[k+1]`, any j in (i, k] works, giving (k - i) triplets.

---

## Related Problems

Based on similar themes (XOR, prefix arrays):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subarray XOR Sum | [Link](https://leetcode.com/problems/subarray-xor-sum/) | XOR in subarrays |
| XOR Queries of a Subarray | [Link](https://leetcode.com/problems/xor-queries-of-a-subarray/) | Range XOR queries |
| Single Number II | [Link](https://leetcode.com/problems/single-number-ii/) | XOR properties |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum XOR With an Element From Array | [Link](https://leetcode.com/problems/maximum-xor-with-an-element-from-array/) | Advanced XOR |

### Pattern Reference

For more detailed explanations of the XOR pattern, see:
- **[XOR Pattern - Prefix XOR](/patterns/xor-prefix)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Prefix XOR Concepts

- [NeetCode - Count Triplets](https://www.youtube.com/watch?v=2hRj6p5T4QE) - Clear explanation
- [XOR Properties Explained](https://www.youtube.com/watch?v=8b1R8kPITrI) - XOR fundamentals
- [LeetCode Official Solution](https://www.youtube.com/watch?v=6H7b5Z6F7Jk) - Official solution

---

## Follow-up Questions

### Q1: Can you solve it in O(n) time?

**Answer:** Yes! Using a hash map to track prefix XOR values and their indices, we can achieve O(n) time complexity.

---

### Q2: What if arr contains zeros?

**Answer:** The solution handles zeros correctly. XOR with zero doesn't change the value, and zeros in the array just don't affect the XOR operations.

---

### Q3: How does this relate to the subarray XOR sum problem?

**Answer:** Both use prefix XOR. Here we need two equal halves, which means the XOR of the entire range is 0. That's why prefix[i] == prefix[k+1].

---

### Q4: What edge cases should be tested?

**Answer:**
- Array with all same elements (max triplets)
- Array with all zeros
- Array with alternating XOR patterns
- Single element array
- Two element array (no valid triplets)

---

### Q5: Why is the formula (k - i) when prefix[i] == prefix[k+1]?

**Answer:** When prefix[i] == prefix[k+1], any j from i+1 to k works. That's exactly (k - i) possible values of j.

---

## Common Pitfalls

### 1. Prefix Array Index
**Issue**: Off-by-one errors in prefix array indexing.

**Solution**: Remember prefix[0] = 0, and prefix[i+1] = prefix[i] ^ arr[i].

### 2. Not Counting All Valid j
**Issue**: Only counting one j per (i,k) pair.

**Solution**: When prefix[i] == prefix[k+1], add (k - i) to count, not just 1.

### 3. Hash Map Update Order
**Issue**: Updating memo before using current prefix value.

**Solution**: Check if prefix exists in memo before updating with current index.

---

## Summary

The **Count Triplets** problem demonstrates the power of XOR properties and prefix arrays:

- **Prefix XOR O(n²)**: Acceptable since n <= 300
- **Hash Map O(n)**: Optimal for large n
- **Brute Force**: Too slow for production

The key insight is that when prefix[i] == prefix[k+1], all j in (i, k] give valid triplets.

### Pattern Summary

This problem exemplifies the **Prefix XOR** pattern, which is characterized by:
- Using prefix XOR for O(1) range queries
- Leveraging XOR properties (a ^ a = 0)
- Mathematical optimization to reduce complexity

For more details on this pattern, see the **[XOR Pattern - Prefix XOR](/patterns/xor-prefix)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/discuss/) - Community solutions
- [XOR Properties - GeeksforGeeks](https://www.geeksforgeeks.org/xor-operator/) - XOR fundamentals
- [Prefix Sum Technique](https://en.wikipedia.org/wiki/Prefix_sum) - General prefix concepts
