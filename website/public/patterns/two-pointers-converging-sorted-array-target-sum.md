# Two Pointers - Converging (Sorted Array Target Sum)

## Overview

The **Two Pointers - Converging** pattern is a powerful algorithmic technique used to solve problems involving **finding pairs in a sorted array that satisfy a target sum condition**. This pattern leverages the fact that the array is sorted to efficiently search for valid pairs by using two pointers that start at opposite ends and move towards each other.

This pattern is fundamental in technical interviews at companies like Google, Amazon, Meta, Apple, and Microsoft. It demonstrates the ability to think efficiently about array traversal and optimization.

## Key Concepts

- **Converging Pointers**: Two pointers starting at opposite ends (left and right) of a sorted array
- **Sum Comparison**: Compare the sum of elements at both pointers with the target sum
- **Directional Movement**: Move pointers based on whether the sum is less than or greater than target
- **Sorted Array Requirement**: The array must be sorted for this pattern to work correctly
- **Linear Time**: Achieves O(n) time complexity with O(1) space complexity

## Problem Variations

### Variation 1: Find One Pair (Classic)
```
Given a sorted array and a target sum, find indices of two numbers that add up to target.
Each input has exactly one solution. You may not use the same element twice.

Example: numbers = [2,7,11,15], target = 9 → [1,2] (0-based: [0,1])
```

### Variation 2: Find All Pairs
```
Find all unique pairs in a sorted array that sum to a target value.

Example: numbers = [1,2,3,4,5,6,7,8], target = 9 → [[1,8], [2,7], [3,6], [4,5]]
```

### Variation 3: Find Pair with Closest Sum
```
Find two numbers in a sorted array whose sum is closest to a given target.

Example: numbers = [1,2,3,4,5], target = 10 → [4,5] (sum = 9) or [5,6] if exists
```

### Variation 4: Three Sum (Extended)
```
Find all unique triplets in an array that sum to zero.

Example: nums = [-1,0,1,2,-1,-4] → [[-1,-1,2], [-1,0,1]]
```

---

## Solution Approaches

### Approach 1: Basic Converging Two Pointers (Optimal) ✅ Recommended

This is the optimal solution for finding one pair that sums to the target. It achieves O(n) time complexity with O(1) space.

#### Algorithm

1. Initialize two pointers: `left` at the start (index 0) and `right` at the end (index n-1)
2. While `left` < `right`:
   - Calculate `current_sum = arr[left] + arr[right]`
   - If `current_sum == target`: Return the pair/indices
   - If `current_sum < target`: Move `left` pointer right (increase sum)
   - If `current_sum > target`: Move `right` pointer left (decrease sum)
3. If no pair found, return an appropriate result

#### Why This Works

The sorted nature of the array guarantees that:
- Moving `left` right increases the sum
- Moving `right` left decreases the sum
- This creates a systematic way to converge on the target

#### Implementation

````carousel
```python
# Two Pointers - Converging (Python)
def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    """
    Find two numbers in a sorted array that add up to target.
    
    Args:
        numbers: Sorted list of integers
        target: Target sum to find
        
    Returns:
        List containing indices [left, right] (1-based as per LeetCode)
        
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            # Return 1-based indices (LeetCode requirement)
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    # No solution found
    return []
```
<!-- slide -->
```cpp
// Two Pointers - Converging (C++)
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;
        
        while (left < right) {
            int current_sum = numbers[left] + numbers[right];
            
            if (current_sum == target) {
                return {left + 1, right + 1};  // 1-based indices
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return {};  // No solution found
    }
};
```
<!-- slide -->
```java
// Two Pointers - Converging (Java)
class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        
        while (left < right) {
            int current_sum = numbers[left] + numbers[right];
            
            if (current_sum == target) {
                return new int[]{left + 1, right + 1};  // 1-based indices
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return new int[]{};  // No solution found
    }
}
```
<!-- slide -->
```javascript
// Two Pointers - Converging (JavaScript)
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    let left = 0, right = numbers.length - 1;
    
    while (left < right) {
        const current_sum = numbers[left] + numbers[right];
        
        if (current_sum === target) {
            return [left + 1, right + 1];  // 1-based indices
        } else if (current_sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];  // No solution found
};
```
````

#### Step-by-Step Example

```
numbers = [2, 7, 11, 15], target = 9

Initial: left=0 (2), right=3 (15), sum=17

Iteration 1:
  sum = 2 + 15 = 17 > 9
  Move right left: right=2
  sum = 2 + 11 = 13 > 9
  Move right left: right=1

Iteration 2:
  sum = 2 + 7 = 9 == target
  Found! Return [1, 2] (1-based indices)

Total iterations: 2 (O(n) instead of O(n²))
```

---

### Approach 2: Find All Unique Pairs

When we need to find all unique pairs that sum to the target, we extend the basic approach by skipping duplicates.

#### Algorithm

1. Initialize `left` and `right` pointers
2. While `left` < `right`:
   - Calculate sum and compare with target
   - If equal: Add pair to result, skip duplicates on both sides
   - If sum < target: Move `left` right, skip duplicates
   - If sum > target: Move `left` left, skip duplicates

#### Implementation

````carousel
```python
# Find All Unique Pairs (Python)
def find_all_pairs(numbers: list[int], target: int) -> list[list[int]]:
    """
    Find all unique pairs in a sorted array that sum to target.
    
    Args:
        numbers: Sorted list of integers
        target: Target sum to find
        
    Returns:
        List of pairs (indices)
        
    Time Complexity: O(n)
    Space Complexity: O(1) excluding output
    """
    left, right = 0, len(numbers) - 1
    result = []
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            result.append([left, right])
            # Skip duplicates
            left_val, right_val = numbers[left], numbers[right]
            while left < right and numbers[left] == left_val:
                left += 1
            while left < right and numbers[right] == right_val:
                right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```
<!-- slide -->
```cpp
// Find All Unique Pairs (C++)
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> findPairs(vector<int>& numbers, int target) {
        int left = 0, right = numbers.size() - 1;
        vector<vector<int>> result;
        
        while (left < right) {
            int current_sum = numbers[left] + numbers[right];
            
            if (current_sum == target) {
                result.push_back({left, right});
                // Skip duplicates
                int left_val = numbers[left], right_val = numbers[right];
                while (left < right && numbers[left] == left_val) left++;
                while (left < right && numbers[right] == right_val) right--;
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
// Find All Unique Pairs (Java)
class Solution {
    public List<List<Integer>> findPairs(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        List<List<Integer>> result = new ArrayList<>();
        
        while (left < right) {
            int current_sum = numbers[left] + numbers[right];
            
            if (current_sum == target) {
                result.add(Arrays.asList(left, right));
                // Skip duplicates
                int left_val = numbers[left], right_val = numbers[right];
                while (left < right && numbers[left] == left_val) left++;
                while (left < right && numbers[right] == right_val) right--;
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
// Find All Unique Pairs (JavaScript)
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[][]}
 */
var findPairs = function(numbers, target) {
    let left = 0, right = numbers.length - 1;
    const result = [];
    
    while (left < right) {
        const current_sum = numbers[left] + numbers[right];
        
        if (current_sum === target) {
            result.push([left, right]);
            // Skip duplicates
            const left_val = numbers[left], right_val = numbers[right];
            while (left < right && numbers[left] === left_val) left++;
            while (left < right && numbers[right] === right_val) right--;
        } else if (current_sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return result;
};
```
````

---

### Approach 3: Find Pair with Closest Sum

When an exact match may not exist, we find the pair whose sum is closest to the target.

#### Algorithm

1. Initialize `left` and `right` pointers
2. Track the minimum difference found
3. While `left` < `right`:
   - Calculate current sum and difference from target
   - Update best pair if current sum is closer
   - Move pointers based on sum comparison

#### Implementation

````carousel
```python
# Find Closest Pair (Python)
def find_closest_pair(numbers: list[int], target: int) -> list[int]:
    """
    Find two numbers in a sorted array whose sum is closest to target.
    
    Args:
        numbers: Sorted list of integers
        target: Target sum
        
    Returns:
        Indices of the pair with closest sum
        
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if len(numbers) < 2:
        return []
    
    left, right = 0, len(numbers) - 1
    closest_left, closest_right = 0, 1
    min_diff = abs(numbers[0] + numbers[1] - target)
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        current_diff = abs(current_sum - target)
        
        if current_diff < min_diff:
            min_diff = current_diff
            closest_left, closest_right = left, right
        
        if current_sum < target:
            left += 1
        elif current_sum > target:
            right -= 1
        else:
            # Exact match found
            return [left, right]
    
    return [closest_left, closest_right]
```
<!-- slide -->
```cpp
// Find Closest Pair (C++)
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    vector<int> closestPair(vector<int>& numbers, int target) {
        if (numbers.size() < 2) return {};
        
        int left = 0, right = numbers.size() - 1;
        int closest_left = 0, closest_right = 1;
        int min_diff = abs(numbers[0] + numbers[1] - target);
        
        while (left < right) {
            int current_sum = numbers[left] + numbers[right];
            int current_diff = abs(current_sum - target);
            
            if (current_diff < min_diff) {
                min_diff = current_diff;
                closest_left = left;
                closest_right = right;
            }
            
            if (current_sum < target) {
                left++;
            } else if (current_sum > target) {
                right--;
            } else {
                return {left, right};  // Exact match
            }
        }
        
        return {closest_left, closest_right};
    }
};
```
<!-- slide -->
```java
// Find Closest Pair (Java)
class Solution {
    public int[] closestPair(int[] numbers, int target) {
        if (numbers.length < 2) return new int[]{};
        
        int left = 0, right = numbers.length - 1;
        int closest_left = 0, closest_right = 1;
        int min_diff = Math.abs(numbers[0] + numbers[1] - target);
        
        while (left < right) {
            int current_sum = numbers[left] + numbers[right];
            int current_diff = Math.abs(current_sum - target);
            
            if (current_diff < min_diff) {
                min_diff = current_diff;
                closest_left = left;
                closest_right = right;
            }
            
            if (current_sum < target) {
                left++;
            } else if (current_sum > target) {
                right--;
            } else {
                return new int[]{left, right};  // Exact match
            }
        }
        
        return new int[]{closest_left, closest_right};
    }
}
```
<!-- slide -->
```javascript
// Find Closest Pair (JavaScript)
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var closestPair = function(numbers, target) {
    if (numbers.length < 2) return [];
    
    let left = 0, right = numbers.length - 1;
    let closest_left = 0, closest_right = 1;
    let min_diff = Math.abs(numbers[0] + numbers[1] - target);
    
    while (left < right) {
        const current_sum = numbers[left] + numbers[right];
        const current_diff = Math.abs(current_sum - target);
        
        if (current_diff < min_diff) {
            min_diff = current_diff;
            closest_left = left;
            closest_right = right;
        }
        
        if (current_sum < target) {
            left++;
        } else if (current_sum > target) {
            right--;
        } else {
            return [left, right];  // Exact match
        }
    }
    
    return [closest_left, closest_right];
};
```
````

---

### Approach 4: Three Sum (Extended Converging Pointers)

The Three Sum problem extends the two pointers concept by fixing one element and using converging pointers for the remaining two.

#### Algorithm

1. Sort the array (if not already sorted)
2. Iterate through the array with index `i`
3. For each `i`, use converging pointers to find pairs that sum to `-nums[i]`
4. Skip duplicate values to avoid redundant triplets

#### Implementation

````carousel
```python
# Three Sum (Python)
def three_sum(nums: list[int]) -> list[list[int]]:
    """
    Find all unique triplets in an array that sum to zero.
    
    Args:
        nums: List of integers
        
    Returns:
        List of unique triplets
        
    Time Complexity: O(n²)
    Space Complexity: O(1) excluding output
    """
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Target for two pointers
        target = -nums[i]
        left, right = i + 1, n - 1
        
        while left < right:
            current_sum = nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result
```
<!-- slide -->
```cpp
// Three Sum (C++)
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        int n = nums.size();
        
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int target = -nums[i];
            int left = i + 1, right = n - 1;
            
            while (left < right) {
                int current_sum = nums[left] + nums[right];
                
                if (current_sum == target) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (current_sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
// Three Sum (Java)
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;
        
        for (int i = 0; i < n - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int target = -nums[i];
            int left = i + 1, right = n - 1;
            
            while (left < right) {
                int current_sum = nums[left] + nums[right];
                
                if (current_sum == target) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (current_sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
// Three Sum (JavaScript)
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const result = [];
    const n = nums.length;
    
    for (let i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        const target = -nums[i];
        let left = i + 1, right = n - 1;
        
        while (left < right) {
            const current_sum = nums[left] + nums[right];
            
            if (current_sum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
};
```
````

---

## Time and Space Complexity

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|------------------|------------------|---------------|
| **Basic Converging** | O(n) | O(1) | Find one pair with exact sum |
| **All Unique Pairs** | O(n) | O(1) | Find all pairs (with duplicates) |
| **Closest Pair** | O(n) | O(1) | Find closest sum (no exact match) |
| **Three Sum** | O(n²) | O(1) | Find triplets summing to target |

---

## Common Pitfalls

1. **Assuming Unsorted Input**
   - Always verify or sort the array before applying this pattern
   - The pattern ONLY works on sorted arrays

2. **Index Confusion**
   - Be careful with 0-based vs 1-based indexing (LeetCode uses 1-based)
   - Double-check return value format requirements

3. **Not Skipping Duplicates**
   - When finding all pairs or triplets, skipping duplicates is crucial
   - Otherwise, you'll get duplicate results

4. **Infinite Loops**
   - Ensure pointers actually move in each iteration
   - When sum equals target in "all pairs", move both pointers

5. **Not Handling Edge Cases**
   - Arrays with less than 2 elements
   - No valid pair exists
   - Multiple valid pairs

6. **Integer Overflow**
   - In languages like C++ and Java, be careful with large numbers
   - Use long types when necessary

---

## Template Summary

### Quick Reference Template

```python
def two_sum_converging(nums: list[int], target: int) -> list[int]:
    """Template for Two Pointers - Converging pattern."""
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left, right]  # or [left + 1, right + 1] for 1-based
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []  # No solution
```

---

## Example Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Two Sum II - Input array is sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | 167 | Easy | Find two numbers that add up to target |
| [Two Sum III - Data structure design](https://leetcode.com/problems/two-sum-iii-data-structure-design/) | 170 | Easy | Design add and find operations |
| [3Sum](https://leetcode.com/problems/3sum/) | 15 | Medium | Find all unique triplets summing to zero |
| [3Sum Closest](https://leetcode.com/problems/3sum-closest/) | 16 | Medium | Find three numbers closest to target |
| [4Sum](https://leetcode.com/problems/4sum/) | 18 | Medium | Find all unique quadruplets summing to target |
| [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/) | 653 | Easy | Find two elements in BST that sum to target |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | 560 | Medium | Find subarrays with sum k (extended) |
| [Smallest Range I](https://leetcode.com/problems/smallest-range-i/) | 908 | Easy | Closest pair concepts |

---

## Related Patterns

- **[Two Pointers - Expanding from Center](/patterns/two-pointers-expanding-from-center-palindromes.md)** - For palindromic substring problems
- **[Two Pointers - In-place Array Modification](/patterns/two-pointers-in-place-array-modification.md)** - For array partitioning problems
- **[Sliding Window](/patterns/sliding-window-subarray-sum-equals-k.md)** - For subarray problems
- **[Hash Map - Two Sum](/patterns/hash-map-two-sum.md)** - For unsorted arrays

---

## Video Tutorial Links

1. **[Two Sum II - NeetCode](https://www.youtube.com/watch?v=cQfE7U65-8s)** - Visual explanation of the converging pattern
2. **[3Sum Solution - NeetCode](https://www.youtube.com/watch?v=Mc97Y2CQXhY)** - Extended two pointers for three sum
3. **[Two Pointers Technique - William Lin](https://www.youtube.com/watch?v=uW-TP42M7KY)** - Comprehensive two pointers guide
4. **[LeetCode Official - Two Sum II](https://www.youtube.com/watch?v=0CamenTmCwA)** - Official solution walkthrough
5. **[3Sum Problem - Back To Back SWE](https://www.youtube.com/watch?v=Jw1h1B5GlGw)** - Detailed three sum explanation

---

## Follow-up Questions

### Basic Level

1. **Why does the array need to be sorted for this pattern?**
   - The sorted order guarantees that moving pointers in specific directions will systematically adjust the sum in the desired direction

2. **What is the time and space complexity?**
   - Time: O(n), Space: O(1) for basic two pointers

3. **How would you modify the solution to return 1-based indices?**
   - Simply add 1 to both indices when returning

### Intermediate Level

4. **How would you find all pairs instead of just one?**
   - Continue searching after finding a pair, but skip duplicates

5. **What if the array is not sorted?**
   - Sort it first (O(n log n)), then apply the two pointers technique

6. **How do you handle duplicate values?**
   - Skip duplicates by moving past them after finding a valid pair

### Advanced Level

7. **How would you extend this to find K-sum (4Sum, 5Sum, etc.)?**
   - Recursively reduce K-sum to (K-1)-sum by fixing elements

8. **How would you optimize for very large arrays with memory constraints?**
   - The O(1) space already meets this requirement; consider streaming for disk-based arrays

9. **What if we need to find pairs that sum to a target in a circular array?**
   - Duplicate the array or use modulo arithmetic to handle circular nature

---

## Summary

The **Two Pointers - Converging** pattern is essential for solving sorted array pair sum problems efficiently. Key takeaways:

1. **Sorted Requirement**: The array must be sorted for this pattern to work
2. **O(n) Efficiency**: Achieves optimal linear time complexity
3. **O(1) Space**: Constant extra space makes it memory-efficient
4. **Versatile**: Extends to pairs, triplets, and K-sum variations
5. **Intuitive Direction**: The converging movement is easy to visualize and implement

This pattern is a must-know for technical interviews and demonstrates strong algorithmic thinking skills.
