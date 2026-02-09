# Two Sum II - Input Array Is Sorted

## Problem Statement

Given a 1-indexed array `numbers` of length `n` sorted in non-decreasing order, find two numbers such that they add up to a specific target number `target`. Return the indices of the two numbers as 1-indexed values.

**Link to problem:** [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

**Constraints:**
- `2 <= numbers.length <= 3 * 10^4`
- `-1000 <= numbers[i] <= 1000`
- `-1000 <= target <= 1000`
- The array is sorted in non-decreasing order
- There is exactly one valid solution
- You may not use the same element twice

---

## Examples

### Example 1

**Input:**
```
numbers = [2, 7, 11, 15], target = 9
```

**Output:**
```
[1, 2]
```

**Explanation:** Because `numbers[0] + numbers[1] == 9`, we return `[1, 2]`. The array is 1-indexed as per the problem statement.

---

### Example 2

**Input:**
```
numbers = [-1, 0], target = -1
```

**Output:**
```
[1, 2]
```

**Explanation:** Because `numbers[0] + numbers[1] == -1`, we return `[1, 2]`. Note that the array can contain negative numbers.

---

### Example 3

**Input:**
```
numbers = [1, 2, 3, 4, 4, 9, 10, 11], target = 10
```

**Output:**
```
[4, 5]
```

**Explanation:** Because `numbers[3] + numbers[4] == 10` (4 + 6 = 10), we return `[4, 5]`. The array contains duplicate values, but the solution uses different indices.

---

### Example 4

**Input:**
```
numbers = [3, 24, 50, 79, 88, 150, 345], target = 200
```

**Output:**
```
[3, 6]
```

**Explanation:** Because `numbers[2] + numbers[5] == 50 + 150 = 200`, we return `[3, 6]`.

---

### Example 5

**Input:**
```
numbers = [2, 3, 4], target = 6
```

**Output:**
```
[1, 3]
```

**Explanation:** Because `numbers[0] + numbers[2] == 2 + 4 = 6`, we return `[1, 3]`.

---

## Intuition

The key insight that makes this problem solvable efficiently is the **sorted nature** of the input array. When the array is sorted in non-decreasing order, we can use the **two-pointer technique** to find the two numbers that sum to the target:

1. **Smallest + Largest = Target?**
   - If `numbers[left] + numbers[right] == target`, we've found our answer
   - If `numbers[left] + numbers[right] < target`, we need a larger sum, so move `left` to the right
   - If `numbers[left] + numbers[right] > target`, we need a smaller sum, so move `right` to the left

2. **Why this works:**
   - Moving `left` to the right increases the sum (since array is sorted)
   - Moving `right` to the left decreases the sum
   - This guarantees we will find the unique solution in O(n) time

3. **Optimality:**
   - Each element is visited at most once
   - No additional data structures needed beyond two pointers
   - This is the most efficient approach with O(n) time and O(1) space

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointer Technique** - Most optimal O(n) time, O(1) space
2. **Binary Search** - O(n log n) time, O(1) space
3. **Hash Map Approach** - O(n) time, O(n) space (similar to original Two Sum)

---

## Approach 1: Two Pointer Technique

This is the optimal approach for this problem. By placing one pointer at the start and one at the end of the sorted array, we can efficiently narrow down the search space.

#### Algorithm Steps

1. Initialize two pointers: `left` at index 0 and `right` at index `n-1`
2. While `left < right`:
   - Calculate `currentSum = numbers[left] + numbers[right]`
   - If `currentSum == target`, return `[left + 1, right + 1]` (1-indexed)
   - If `currentSum < target`, increment `left` (need a larger sum)
   - If `currentSum > target`, decrement `right` (need a smaller sum)
3. Since there's guaranteed to be a solution, we will always return within the loop

#### Code Implementation

 ````carousel
 ```python
 class Solution:
     def twoSum(self, numbers: List[int], target: int) -> List[int]:
         left, right = 0, len(numbers) - 1
         
         while left < right:
             current_sum = numbers[left] + numbers[right]
             
             if current_sum == target:
                 return [left + 1, right + 1]  # 1-indexed
             elif current_sum < target:
                 left += 1  # Need a larger sum
             else:
                 right -= 1  # Need a smaller sum
         
         # Since there's guaranteed to be a solution, we shouldn't reach here
         return [-1, -1]
 ```

 <!-- slide -->
 ```cpp
 class Solution {
 public:
     vector<int> twoSum(vector<int>& numbers, int target) {
         int left = 0;
         int right = numbers.size() - 1;
         
         while (left < right) {
             int current_sum = numbers[left] + numbers[right];
             
             if (current_sum == target) {
                 return {left + 1, right + 1};  // 1-indexed
             } else if (current_sum < target) {
                 left++;  // Need a larger sum
             } else {
                 right--;  // Need a smaller sum
             }
         }
         
         // Since there's guaranteed to be a solution, we shouldn't reach here
         return {-1, -1};
     }
 };
 ```

 <!-- slide -->
 ```java
 class Solution {
     public int[] twoSum(int[] numbers, int target) {
         int left = 0;
         int right = numbers.length - 1;
         
         while (left < right) {
             int currentSum = numbers[left] + numbers[right];
             
             if (currentSum == target) {
                 return new int[]{left + 1, right + 1};  // 1-indexed
             } else if (currentSum < target) {
                 left++;  // Need a larger sum
             } else {
                 right--;  // Need a smaller sum
             }
         }
         
         // Since there's guaranteed to be a solution, we shouldn't reach here
         return new int[]{-1, -1};
     }
 }
 ```

 <!-- slide -->
 ```javascript
 /**
  * @param {number[]} numbers
  * @param {number} target
  * @return {number[]}
  */
 var twoSum = function(numbers, target) {
     let left = 0;
     let right = numbers.length - 1;
     
     while (left < right) {
         const currentSum = numbers[left] + numbers[right];
         
         if (currentSum === target) {
             return [left + 1, right + 1];  // 1-indexed
         } else if (currentSum < target) {
             left++;  // Need a larger sum
         } else {
             right--;  // Need a smaller sum
         }
     }
     
     // Since there's guaranteed to be a solution, we shouldn't reach here
     return [-1, -1];
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most once |
| **Space** | O(1) - Only two pointers used |

---

## Approach 2: Binary Search

For each element, we can binary search for its complement. This approach is less optimal but demonstrates alternative techniques.

#### Algorithm Steps

1. For each index `i` from 0 to `n-1`:
   - Calculate `complement = target - numbers[i]`
   - Binary search for `complement` in the subarray from `i+1` to `n-1`
   - If found, return `[i + 1, foundIndex + 1]`
2. Since there's guaranteed to be a solution, we will always return

#### Code Implementation

 ````carousel
 ```python
 class Solution:
     def twoSum(self, numbers: List[int], target: int) -> List[int]:
         for i in range(len(numbers)):
             complement = target - numbers[i]
             
             # Binary search for complement in the remaining array
             left, right = i + 1, len(numbers) - 1
             while left <= right:
                 mid = (left + right) // 2
                 if numbers[mid] == complement:
                     return [i + 1, mid + 1]  # 1-indexed
                 elif numbers[mid] < complement:
                     left = mid + 1
                 else:
                     right = mid - 1
         
         # Since there's guaranteed to be a solution, we shouldn't reach here
         return [-1, -1]
 ```

 <!-- slide -->
 ```cpp
 class Solution {
 public:
     vector<int> twoSum(vector<int>& numbers, int target) {
         int n = numbers.size();
         
         for (int i = 0; i < n; i++) {
             int complement = target - numbers[i];
             
             // Binary search for complement in the remaining array
             int left = i + 1, right = n - 1;
             while (left <= right) {
                 int mid = left + (right - left) / 2;
                 if (numbers[mid] == complement) {
                     return {i + 1, mid + 1};  // 1-indexed
                 } else if (numbers[mid] < complement) {
                     left = mid + 1;
                 } else {
                     right = mid - 1;
                 }
             }
         }
         
         // Since there's guaranteed to be a solution, we shouldn't reach here
         return {-1, -1};
     }
 };
 ```

 <!-- slide -->
 ```java
 class Solution {
     public int[] twoSum(int[] numbers, int target) {
         int n = numbers.length;
         
         for (int i = 0; i < n; i++) {
             int complement = target - numbers[i];
             
             // Binary search for complement in the remaining array
             int left = i + 1, right = n - 1;
             while (left <= right) {
                 int mid = left + (right - left) / 2;
                 if (numbers[mid] == complement) {
                     return new int[]{i + 1, mid + 1};  // 1-indexed
                 } else if (numbers[mid] < complement) {
                     left = mid + 1;
                 } else {
                     right = mid - 1;
                 }
             }
         }
         
         // Since there's guaranteed to be a solution, we shouldn't reach here
         return new int[]{-1, -1};
     }
 }
 ```

 <!-- slide -->
 ```javascript
 /**
  * @param {number[]} numbers
  * @param {number} target
  * @return {number[]}
  */
 var twoSum = function(numbers, target) {
     const n = numbers.length;
     
     for (let i = 0; i < n; i++) {
         const complement = target - numbers[i];
         
         // Binary search for complement in the remaining array
         let left = i + 1, right = n - 1;
         while (left <= right) {
             const mid = Math.floor((left + right) / 2);
             if (numbers[mid] === complement) {
                 return [i + 1, mid + 1];  // 1-indexed
             } else if (numbers[mid] < complement) {
                 left = mid + 1;
             } else {
                 right = mid - 1;
             }
         }
     }
     
     // Since there's guaranteed to be a solution, we shouldn't reach here
     return [-1, -1];
 };
 ```
 ````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - n iterations, each with O(log n) binary search |
| **Space** | O(1) - Only constant extra space used |

---

## Approach 3: Hash Map Approach

Similar to the original Two Sum problem, we can use a hash map to store seen values and their indices.

#### Algorithm Steps

1. Create an empty dictionary/hash map
2. Iterate through the array with index `i`:
   - Calculate `complement = target - numbers[i]`
   - If `complement` exists in the map, return `[map[complement] + 1, i + 1]`
   - Otherwise, add `numbers[i]: i` to the map
3. Since there's guaranteed to be a solution, we will always return

#### Code Implementation

 ````carousel
 ```python
 class Solution:
     def twoSum(self, numbers: List[int], target: int) -> List[int]:
         num_map = {}
         
         for i, num in enumerate(numbers):
             complement = target - num
             
             if complement in num_map:
                 return [num_map[complement] + 1, i + 1]  # 1-indexed
             
             num_map[num] = i
         
         # Since there's guaranteed to be a solution, we shouldn't reach here
         return [-1, -1]
 ```

 <!-- slide -->
 ```cpp
 class Solution {
 public:
     vector<int> twoSum(vector<int>& numbers, int target) {
         unordered_map<int, int> numMap;
         
         for (int i = 0; i < numbers.size(); i++) {
             int complement = target - numbers[i];
             
             if (numMap.find(complement) != numMap.end()) {
                 return {numMap[complement] + 1, i + 1};  // 1-indexed
             }
             
             numMap[numbers[i]] = i;
         }
         
         // Since there's guaranteed to be a solution, we shouldn't reach here
         return {-1, -1};
     }
 };
 ```

 <!-- slide -->
 ```java
 class Solution {
     public int[] twoSum(int[] numbers, int target) {
         Map<Integer, Integer> numMap = new HashMap<>();
         
         for (int i = 0; i < numbers.length; i++) {
             int complement = target - numbers[i];
             
             if (numMap.containsKey(complement)) {
                 return new int[]{numMap.get(complement) + 1, i + 1};  // 1-indexed
             }
             
             numMap.put(numbers[i], i);
         }
         
         // Since there's guaranteed to be a solution, we shouldn't reach here
         return new int[]{-1, -1};
     }
 }
 ```

 <!-- slide -->
 ```javascript
 /**
  * @param {number[]} numbers
  * @param {number} target
  * @return {number[]}
  */
 var twoSum = function(numbers, target) {
     const numMap = new Map();
     
     for (let i = 0; i < numbers.length; i++) {
         const complement = target - numbers[i];
         
         if (numMap.has(complement)) {
             return [numMap.get(complement) + 1, i + 1];  // 1-indexed
         }
         
         numMap.set(numbers[i], i);
     }
     
     // Since there's guaranteed to be a solution, we shouldn't reach here
     return [-1, -1];
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

| Aspect | Two Pointer | Binary Search | Hash Map |
|--------|-------------|---------------|----------|
| **Time Complexity** | O(n) | O(n log n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Implementation** | Simple and elegant | Moderate complexity | Simple |
| **Best For** | This problem (sorted) | Learning binary search | Unsorted arrays |
| **Leetcode Optimal** | ✅ Yes | ❌ No | ❌ No |

---

## Why Two Pointer is Optimal for This Problem

The two-pointer approach is specifically optimal for this problem because:

1. **Sorted Property Exploitation**: The sorted nature allows us to make decisions based on the sum comparison
2. **Single Pass**: Each element is visited at most once, making it O(n)
3. **No Extra Space**: Only two integer pointers needed
4. **Early Termination**: As soon as we find the solution, we return
5. **Deterministic Movement**: Each move (left or right) is guaranteed to bring us closer to the solution

---

## Related Problems

Based on similar themes (sorted arrays, two sum, two pointer technique):

- **[Two Sum](https://leetcode.com/problems/two-sum/)** - Original Two Sum problem (unsorted array)
- **[3Sum](https://leetcode.com/problems/3sum/)** - Find all triplets that sum to zero
- **[3Sum Closest](https://leetcode.com/problems/3sum-closest/)** - Find three numbers closest to target
- **[4Sum](https://leetcode.com/problems/4sum/)** - Find all quadruplets that sum to target
- **[Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)** - This problem
- **[Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)** - Two Sum in a Binary Search Tree
- **[Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)** - Find subarrays that sum to k
- **[Container With Most Water](https://leetcode.com/problems/container-with-most-water/)** - Another two pointer problem
- **[Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number/)** - Count triangles using two pointers

---

## Pattern Documentation

For a comprehensive guide on the **Two Pointers - Converging** pattern, including detailed explanations, multiple approaches, and templates in Python, C++, Java, and JavaScript, see:

- **[Two Pointers - Converging (Sorted Array Target Sum)](../patterns/two-pointers-converging-sorted-array-target-sum.md)** - Complete pattern documentation

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- [Two Sum II - Input Array Is Sorted - LeetCode 167](https://www.youtube.com/watch?v=cQyrT-m9Hgo) - Detailed explanation by NeetCode
- [Two Pointers Technique - LeetCode](https://www.youtube.com/watch?v=0CgpzT340lE) - Comprehensive two pointers tutorial
- [Two Sum II Solution](https://www.youtube.com/watch?v=IvyL2NJqTxM) - Clear walkthrough with examples
- [LeetCode 167 - Two Sum II](https://www.youtube.com/watch?v=ZJRd1T7BQqI) - Multiple approaches explained

---

## Followup Questions

### Q1: Can you modify the solution to handle multiple valid solutions?

**Answer:** Since the problem guarantees exactly one solution, we don't need to handle multiple solutions. However, if there were multiple solutions, we could collect all valid pairs by continuing to move both pointers after finding a match. We'd need to move both `left` and `right` after finding a match to find other valid pairs.

---

### Q2: What if the array contained very large numbers that could cause integer overflow?

**Answer:** In Python, integers have arbitrary precision, so overflow isn't an issue. In languages like Java, C++, or JavaScript, we need to be careful. We can use `long` in Java/C++ instead of `int` to prevent overflow, or check for overflow before addition using conditions like `if (numbers[left] > target - numbers[right])`.

---

### Q3: How would you find all pairs that sum to the target in a sorted array?

**Answer:** You can use a modified two-pointer approach:
- Initialize `left` at 0 and `right` at n-1
- While `left < right`:
  - If `numbers[left] + numbers[right] == target`, add `[left, right]` to results, then move both pointers and skip duplicates
  - If `sum < target`, increment `left`
  - If `sum > target`, decrement `right`

---

### Q4: What if the array was sorted in decreasing order instead of increasing?

**Answer:** The two-pointer approach would still work, but with reversed logic:
- If `numbers[left] + numbers[right] == target`, found it
- If `sum < target`, decrement `right` (smaller numbers are to the right)
- If `sum > target`, increment `left` (larger numbers are to the right)

Alternatively, you could reverse the array first or use the opposite comparisons.

---

### Q5: How would you adapt this solution for a 0-indexed output?

**Answer:** Simply return `[left, right]` instead of `[left + 1, right + 1]`. The problem requires 1-indexed output, but if you need 0-indexed, just remove the `+ 1` adjustments.

---

### Q6: What if the problem didn't guarantee exactly one solution?

**Answer:** You could modify the approach to:
1. Find the first pair that sums to target (if you need just one)
2. Collect all pairs (if you need all)
3. Return the pair with minimum/maximum indices (if you need a specific one)

For finding all pairs, continue searching after finding a match by moving both pointers and skipping duplicates.

---

### Q7: Can you solve this problem without using any extra space and in less than O(n) time?

**Answer:** No, it's not possible. In the worst case, you might need to examine all n elements to determine that a solution exists or to find it. The two-pointer approach is already optimal at O(n) time and O(1) space. Any comparison-based algorithm needs at least O(n) time in the worst case.

---

### Q8: How would you handle the case where the array might not have a valid solution?

**Answer:** The problem guarantees exactly one solution. However, if you need to handle cases without a solution, you could:
1. After the while loop, check if `left >= right`
2. Return an empty array or specific indicator like `[-1, -1]`
3. Throw an exception (not recommended in interview settings)

---

## Summary

The "Two Sum II - Input Array Is Sorted" problem demonstrates the power of exploiting input properties to achieve optimal solutions. The two-pointer technique is the most elegant and efficient approach for this problem, achieving O(n) time complexity with O(1) space complexity.

**Key Takeaways:**
- Always look for opportunities to exploit input properties (like sorted arrays)
- Two-pointer technique is ideal for sorted array problems
- The sorted nature allows us to make informed decisions about which pointer to move
- Always remember the output is 1-indexed (common pitfall)

Understanding this problem builds a strong foundation for tackling more complex problems involving sorted arrays and the two-pointer technique.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/discuss/) - Community solutions and explanations
- [Two Pointers Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - GeeksforGeeks comprehensive guide
- [Array Data Structure](https://www.geeksforgeeks.org/array-data-structure/) - Understanding arrays
