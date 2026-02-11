# Two Sum

## Problem Statement

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Link to problem:** [Two Sum](https://leetcode.com/problems/two-sum/)

**Constraints:**
- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Only one valid answer exists

**Note:**
- Each input has exactly one solution
- You cannot use the same element twice
- The answer can be returned in any order
- Indices must be returned, not the values

---

## Examples

### Example 1

**Input:**
```
nums = [2, 7, 11, 15], target = 9
```

**Output:**
```
[0, 1]
```

**Explanation:** `nums[0] + nums[1] = 2 + 7 = 9`, so we return `[0, 1]`.

---

### Example 2

**Input:**
```
nums = [3, 2, 4], target = 6
```

**Output:**
```
[1, 2]
```

**Explanation:** `nums[1] + nums[2] = 2 + 4 = 6`, so we return `[1, 2]`.

---

### Example 3

**Input:**
```
nums = [3, 3], target = 6
```

**Output:**
```
[0, 1]
```

**Explanation:** `nums[0] + nums[1] = 3 + 3 = 6`, so we return `[0, 1]`.

---

### Example 4

**Input:**
```
nums = [0, 4, 3, 0], target = 0
```

**Output:**
```
[0, 3]
```

**Explanation:** `nums[0] + nums[3] = 0 + 0 = 0`, so we return `[0, 3]`.

---

### Example 5

**Input:**
```
nums = [-1, -2, -3, -4, -5], target = -8
```

**Output:**
```
[2, 4]
```

**Explanation:** `nums[2] + nums[4] = -3 + (-5) = -8`, so we return `[2, 4]`.

---

## Intuition

The Two Sum problem asks us to find two distinct elements in an array that add up to a given target value. This is a fundamental problem that introduces the concept of using hash maps for efficient lookups.

### Core Insight

For each element `nums[i]` in the array, we need to find if there's another element `nums[j]` such that `nums[i] + nums[j] = target`. This can be rearranged to `nums[j] = target - nums[i]`.

The key challenge is finding the complement (`target - nums[i]`) efficiently. If we could instantly check whether the complement exists in the array and get its index, we could solve the problem in a single pass.

### Key Observations

1. **Complement Calculation**: For each number, calculate what value would need to be added to it to reach the target.

2. **Efficient Lookup**: We need a data structure that allows O(1) average time complexity for checking if an element exists and retrieving its index.

3. **One-pass Solution**: By storing elements we've seen so far in a hash map, we can check if the complement exists before adding the current element to the map.

---

## Multiple Approaches with Code

We'll cover two main approaches:

1. **Brute Force** - Simple double loop approach
2. **Hash Map (Optimal)** - Single pass with hash table

---

## Approach 1: Brute Force

This is the most straightforward approach. We check every possible pair of indices to see if their corresponding values sum to the target.

#### Algorithm Steps

1. Iterate through the array with outer loop `i` from `0` to `n-1`
2. For each `i`, iterate with inner loop `j` from `i+1` to `n-1`
3. Check if `nums[i] + nums[j] == target`
4. If found, return `[i, j]`
5. If no pair is found after checking all combinations, return an empty array (though the problem guarantees a solution exists)

#### Code Implementation

````carousel
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        Find indices of two numbers that add up to target.
        
        Args:
            nums: List of integers
            target: Target sum
            
        Returns:
            List of two indices that add up to target
        """
        n = len(nums)
        
        # Check all possible pairs
        for i in range(n):
            for j in range(i + 1, n):
                if nums[i] + nums[j] == target:
                    return [i, j]
        
        # Problem guarantees a solution exists
        return []
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        /**
         * Find indices of two numbers that add up to target.
         * 
         * Args:
         *     nums: List of integers
         *     target: Target sum
         * 
         * Returns:
         *     Vector of two indices that add up to target
         */
        int n = nums.size();
        
        // Check all possible pairs
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        
        // Problem guarantees a solution exists
        return {};
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        /**
         * Find indices of two numbers that add up to target.
         * 
         * Args:
         *     nums: Array of integers
         *     target: Target sum
         * 
         * Returns:
         *     Array of two indices that add up to target
         */
        int n = nums.length;
        
        // Check all possible pairs
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[] {i, j};
                }
            }
        }
        
        // Problem guarantees a solution exists
        return new int[] {};
    }
}
```

<!-- slide -->
```javascript
/**
 * Find indices of two numbers that add up to target.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Array of two indices that add up to target
 */
var twoSum = function(nums, target) {
    const n = nums.length;
    
    // Check all possible pairs
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    
    // Problem guarantees a solution exists
    return [];
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Nested loop checking all pairs |
| **Space** | O(1) - Only using constant extra space |

---

## Approach 2: Hash Map (Optimal)

This approach uses a hash map (dictionary in Python, unordered_map in C++, HashMap in Java, Map in JavaScript) to store elements we've seen so far along with their indices. For each element, we check if its complement exists in the map.

#### Algorithm Steps

1. Create an empty hash map to store elements and their indices
2. Iterate through the array with index `i`
3. Calculate the complement: `complement = target - nums[i]`
4. Check if the complement exists in the hash map
   - If yes, return `[complement_index, i]`
5. If no, add the current element and its index to the hash map
6. Repeat until the solution is found

#### Code Implementation

````carousel
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        Find indices of two numbers that add up to target using a hash map.
        
        Args:
            nums: List of integers
            target: Target sum
            
        Returns:
            List of two indices that add up to target
        """
        # Hash map to store number -> index mapping
        num_map = {}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            # Check if complement exists in the map
            if complement in num_map:
                return [num_map[complement], i]
            
            # Add current number to the map
            num_map[num] = i
        
        # Problem guarantees a solution exists
        return []
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        /**
         * Find indices of two numbers that add up to target using a hash map.
         * 
         * Args:
         *     nums: List of integers
         *     target: Target sum
         * 
         * Returns:
         *     Vector of two indices that add up to target
         */
        unordered_map<int, int> num_map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            // Check if complement exists in the map
            if (num_map.find(complement) != num_map.end()) {
                return {num_map[complement], i};
            }
            
            // Add current number to the map
            num_map[nums[i]] = i;
        }
        
        // Problem guarantees a solution exists
        return {};
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        /**
         * Find indices of two numbers that add up to target using a hash map.
         * 
         * Args:
         *     nums: Array of integers
         *     target: Target sum
         * 
         * Returns:
         *     Array of two indices that add up to target
         */
        HashMap<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            // Check if complement exists in the map
            if (numMap.containsKey(complement)) {
                return new int[] {numMap.get(complement), i};
            }
            
            // Add current number to the map
            numMap.put(nums[i], i);
        }
        
        // Problem guarantees a solution exists
        return new int[] {};
    }
}
```

<!-- slide -->
```javascript
/**
 * Find indices of two numbers that add up to target using a hash map.
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Array of two indices that add up to target
 */
var twoSum = function(nums, target) {
    const numMap = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        // Check if complement exists in the map
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        
        // Add current number to the map
        numMap.set(nums[i], i);
    }
    
    // Problem guarantees a solution exists
    return [];
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(n) - Hash map stores up to n elements |

---

## Comparison of Approaches

| Aspect | Brute Force | Hash Map |
|--------|-------------|----------|
| **Time Complexity** | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Very Simple | Simple |
| **Code Readability** | High | High |
| **Scalability** | Poor for large arrays | Excellent |
| **Best For** | Learning/interviews, small n | Production code, large n |

---

## Why Hash Map Approach is Preferred

The hash map approach is the optimal solution because:

1. **Linear Time**: Achieves O(n) time complexity, making it suitable for large inputs
2. **Single Pass**: Processes each element exactly once
3. **Simple Logic**: The complement calculation and lookup is intuitive
4. **Scalable**: Performance remains consistent regardless of array size
5. **Interview Favorite**: Demonstrates understanding of hash tables and space-time trade-offs

---

## Related Problems

Based on similar themes (array manipulation, hash table usage):

- **[3Sum](https://leetcode.com/problems/3sum/)** - Find all triplets that sum to zero
- **[4Sum](https://leetcode.com/problems/4sum/)** - Find all quadruplets that sum to a target
- **[Two Sum II - Input Array is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)** - Two pointers approach on sorted array
- **[Two Sum III - Data structure design](https://leetcode.com/problems/two-sum-iii-data-structure-design/)** - Design a data structure that supports add and find
- **[Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)** - Find subarrays that sum to k
- **[Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)** - Find combinations that sum to target
- **[Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)** - Find two elements in a BST that sum to target

---

## Pattern Documentation

For a comprehensive guide on the **Hash Table Lookup** pattern, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Hash Table Lookup Pattern](../patterns/hash-table-lookup.md)** - Complete pattern documentation

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Two Sum - LeetCode 1 - Complete Explanation](https://www.youtube.com/watch?v=8I-byGzj15M) - Comprehensive explanation by NeetCode
- [Two Sum Solution - Hash Map Approach](https://www.youtube.com/watch?v=0pF5PupLrmw) - Step-by-step hash map implementation
- [LeetCode Two Sum - Multiple Approaches](https://www.youtube.com/watch?v=XzQCHb4_K6k) - Brute force and optimized solutions
- [Understanding Hash Tables](https://www.youtube.com/watch?v=shs0sG60v7U) - Hash table fundamentals

---

## Followup Questions

### Q1: How would you handle duplicate values in the array?

**Answer:** The hash map approach naturally handles duplicates because we store the most recent index of each value. When we encounter a duplicate, we check if its complement exists. If the same number appears twice and target is 2*number, we'll find it on the second occurrence.

---

### Q2: What if you need to return the actual values instead of indices?

**Answer:** Modify the solution to return `[nums[complement_index], nums[current_index]]` instead of the indices. The logic remains the same, just change the return statement.

---

### Q3: How would you modify the solution to find all pairs that sum to the target?

**Answer:** Instead of returning immediately when a pair is found, add it to a results list and continue searching. However, this changes the complexity and may require handling duplicate pairs carefully.

---

### Q4: Can you solve this without using extra space?

**Answer:** For unsorted arrays, it's challenging to achieve O(1) space. However, if the array is sorted, you can use the two-pointer technique (one pointer at start, one at end) to find the pair with O(1) extra space.

---

### Q5: How does the solution handle negative numbers?

**Answer:** The solution works identically for negative numbers. The complement calculation `target - nums[i]` handles negative values correctly, and hash tables work with negative keys without any modification.

---

### Q6: What if there are multiple valid answers?

**Answer:** The problem statement guarantees exactly one solution. If multiple solutions existed, the hash map approach would return the first one found (which depends on iteration order).

---

### Q7: How would you test this solution?

**Answer:** Test with various cases:
1. Normal case: `[2, 7, 11, 15], 9` → `[0, 1]`
2. Numbers in different order: `[3, 2, 4], 6` → `[1, 2]`
3. Duplicate numbers: `[3, 3], 6` → `[0, 1]`
4. Zeros: `[0, 4, 3, 0], 0` → `[0, 3]`
5. Negative numbers: `[-1, -2, -3, -4, -5], -8` → `[2, 4]`
6. Smallest array: `[1, 2], 3` → `[0, 1]`

---

### Q8: What's the difference between using a Python dict vs. a list for lookup?

**Answer:** A dict (hash map) provides O(1) average time complexity for lookups and handles any integer values including negatives. A list would require O(n) time for lookups and only works efficiently for small positive integer ranges.

---

### Q9: How would you handle integer overflow concerns?

**Answer:** In most modern languages, integers have sufficient range for this problem (Python has arbitrary precision). In languages with fixed-size integers, ensure the sum doesn't overflow by using larger integer types or checking bounds before addition.

---

### Q10: Can this be solved using sorting and two pointers?

**Answer:** Yes, but you lose the original indices. Sort the array while keeping track of original indices, then use two pointers to find the pair. Finally, return the original indices. This approach has O(n log n) time due to sorting.

---

## Summary

The Two Sum problem is the classic introduction to hash table usage for efficient lookups. Several approaches exist, each with different trade-offs:

**Key Takeaways:**
- Hash map provides optimal O(n) time complexity
- Brute force is simple but O(n²), suitable only for small inputs
- The complement calculation `target - nums[i]` is the key insight
- Understanding the hash map approach demonstrates algorithmic thinking
- Edge cases (duplicates, negatives, zeros) are handled naturally
- Variations exist for sorted arrays, BSTs, and finding all pairs

This problem builds a strong foundation for more complex array and hash table challenges and is frequently asked in technical interviews.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/two-sum/discuss/) - Community solutions and explanations
- [Hash Table Fundamentals](https://www.geeksforgeeks.org/hash-table-data-structure/) - Hash table concepts
- [Python Dictionary](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict) - Python dict documentation
- [C++ unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map) - C++ unordered_map reference
- [Java HashMap](https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html) - Java HashMap API
- [JavaScript Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) - JS Map reference
