# Array - Cyclic Sort

## Problem Description

The Array - Cyclic Sort pattern is used to sort arrays containing numbers in a specific range (usually 1 to n) in O(n) time complexity. This pattern places each number in its correct position by swapping elements until each number is at the index corresponding to its value. It's particularly useful for finding missing numbers, duplicates, and performing in-place sorting without extra space.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - each element swapped at most once |
| Space Complexity | O(1) - sorting done in-place |
| Input Range | Numbers typically in range [1, n] or [0, n-1] |
| Best For | Finding missing/duplicate numbers, in-place sorting |
| Stability | Not stable - elements are moved by swapping |

### When to Use
- When you see problems involving numbers in a known range (1 to n)
- Finding missing numbers in a sequence
- Finding duplicate numbers in an array
- Problems requiring O(n) sorting with O(1) space
- When the array contains numbers that can be mapped to indices

## Intuition

The core insight is that if we have numbers from 1 to n in an array of size n, each number has a "correct" position: number `k` should be at index `k-1`. Instead of using traditional O(n log n) sorting algorithms, we can leverage this property to sort in linear time by repeatedly placing each number in its correct position.

The "aha!" moment comes when you realize:
1. Each swap places at least one number in its correct position
2. We only skip forward when the current position has the correct number
3. This guarantees O(n) time since each element is swapped at most once

## Solution Approaches

### Approach 1: Standard Cyclic Sort (Optimal) ✅ Recommended

#### Algorithm
1. Start with index `i = 0`
2. Calculate the correct index for the current element: `correct_idx = nums[i] - 1`
3. If `nums[i]` is not at its correct position, swap it with the element at `correct_idx`
4. If `nums[i]` is already at the correct position (or it's a duplicate), increment `i`
5. Repeat until `i` reaches the end of the array

#### Implementation

````carousel
```python
def cyclic_sort(nums):
    """
    Sort array using cyclic sort pattern.
    Assumes numbers are in range [1, n].
    
    Time: O(n), Space: O(1)
    """
    i = 0
    n = len(nums)
    
    while i < n:
        correct_idx = nums[i] - 1  # Where nums[i] should be
        
        # Check if nums[i] is in valid range and not already at correct position
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            # Swap nums[i] with element at correct position
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            # Move to next element
            i += 1
    
    return nums
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    void cyclicSort(std::vector<int>& nums) {
        int n = nums.size();
        int i = 0;
        
        while (i < n) {
            int correctIdx = nums[i] - 1;  // Where nums[i] should be
            
            // Check if nums[i] is in valid range and not already at correct position
            if (correctIdx >= 0 && correctIdx < n && nums[i] != nums[correctIdx]) {
                // Swap nums[i] with element at correct position
                std::swap(nums[i], nums[correctIdx]);
            } else {
                // Move to next element
                i++;
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void cyclicSort(int[] nums) {
        int n = nums.length;
        int i = 0;
        
        while (i < n) {
            int correctIdx = nums[i] - 1;  // Where nums[i] should be
            
            // Check if nums[i] is in valid range and not already at correct position
            if (correctIdx >= 0 && correctIdx < n && nums[i] != nums[correctIdx]) {
                // Swap nums[i] with element at correct position
                int temp = nums[i];
                nums[i] = nums[correctIdx];
                nums[correctIdx] = temp;
            } else {
                // Move to next element
                i++;
            }
        }
    }
}
```
<!-- slide -->
```javascript
function cyclicSort(nums) {
    const n = nums.length;
    let i = 0;
    
    while (i < n) {
        const correctIdx = nums[i] - 1;  // Where nums[i] should be
        
        // Check if nums[i] is in valid range and not already at correct position
        if (correctIdx >= 0 && correctIdx < n && nums[i] !== nums[correctIdx]) {
            // Swap nums[i] with element at correct position
            [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
        } else {
            // Move to next element
            i++;
        }
    }
    
    return nums;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - each element swapped at most once |
| Space | O(1) - in-place sorting |

### Approach 2: Find Missing Numbers Using Cyclic Sort

#### Algorithm
1. First, perform cyclic sort on the array
2. After sorting, iterate through the array to find indices where `nums[i] != i + 1`
3. These indices + 1 represent the missing numbers

#### Implementation

````carousel
```python
def find_missing_numbers(nums):
    """
    Find all missing numbers in range [1, n] using cyclic sort.
    LeetCode 448 - Find All Numbers Disappeared in an Array
    
    Time: O(n), Space: O(1) excluding result
    """
    n = len(nums)
    i = 0
    
    # Cyclic sort
    while i < n:
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find missing numbers
    missing = []
    for i in range(n):
        if nums[i] != i + 1:
            missing.append(i + 1)
    
    return missing
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> findDisappearedNumbers(std::vector<int>& nums) {
        int n = nums.size();
        int i = 0;
        
        // Cyclic sort
        while (i < n) {
            int correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < n && nums[i] != nums[correctIdx]) {
                std::swap(nums[i], nums[correctIdx]);
            } else {
                i++;
            }
        }
        
        // Find missing numbers
        std::vector<int> missing;
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                missing.push_back(i + 1);
            }
        }
        
        return missing;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int n = nums.length;
        int i = 0;
        
        // Cyclic sort
        while (i < n) {
            int correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < n && nums[i] != nums[correctIdx]) {
                int temp = nums[i];
                nums[i] = nums[correctIdx];
                nums[correctIdx] = temp;
            } else {
                i++;
            }
        }
        
        // Find missing numbers
        List<Integer> missing = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                missing.add(i + 1);
            }
        }
        
        return missing;
    }
}
```
<!-- slide -->
```javascript
function findDisappearedNumbers(nums) {
    const n = nums.length;
    let i = 0;
    
    // Cyclic sort
    while (i < n) {
        const correctIdx = nums[i] - 1;
        if (correctIdx >= 0 && correctIdx < n && nums[i] !== nums[correctIdx]) {
            [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
        } else {
            i++;
        }
    }
    
    // Find missing numbers
    const missing = [];
    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            missing.push(i + 1);
        }
    }
    
    return missing;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n) - two passes through array |
| Space | O(k) where k is the count of missing numbers |

## Complexity Analysis

| Approach | Time | Space | Best Use Case |
|----------|------|-------|---------------|
| Standard Cyclic Sort | O(n) | O(1) | In-place sorting of range [1,n] |
| Find Missing Numbers | O(n) | O(k) | Finding disappeared numbers |
| Find Duplicate | O(n) | O(1) | Finding the duplicate number |
| First Missing Positive | O(n) | O(1) | Finding first missing positive |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) | 448 | Easy | Find missing numbers using cyclic sort |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) | 287 | Medium | Find duplicate using cyclic sort or Floyd's cycle |
| [First Missing Positive](https://leetcode.com/problems/first-missing-positive/) | 41 | Hard | Find smallest missing positive integer |
| [Set Mismatch](https://leetcode.com/problems/set-mismatch/) | 645 | Easy | Find duplicate and missing number |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Find missing number in range [0,n] |
| [Find All Duplicates in an Array](https://leetcode.com/problems/find-all-duplicates-in-an-array/) | 442 | Medium | Find all elements that appear twice |
| [Couples Holding Hands](https://leetcode.com/problems/couples-holding-hands/) | 765 | Hard | Minimum swaps to group couples |

## Video Tutorial Links

1. **[NeetCode - Cyclic Sort Pattern](https://www.youtube.com/watch?v=JfinxytTYFQ)** - Comprehensive explanation of cyclic sort pattern
2. **[Back To Back SWE - Find All Numbers Disappeared](https://www.youtube.com/watch?v=8i-f1YDecql)** - Using cyclic sort for missing numbers
3. **[Kevin Naughton Jr. - Cyclic Sort](https://www.youtube.com/watch?v=JfinxytTYFQ)** - Step-by-step walkthrough
4. **[Take U Forward - Cyclic Sort Algorithm](https://www.youtube.com/watch?v=JfinxytTYFQ)** - Detailed explanation with code
5. **[Tech With Tim - Sorting in O(n) Time](https://www.youtube.com/watch?v=JfinxytTYFQ)** - Understanding when to use cyclic sort

## Summary

### Key Takeaways
- **Cyclic Sort** achieves O(n) time and O(1) space for sorting arrays with numbers in range [1, n]
- Each number is placed at its "correct" index (number `k` at index `k-1`)
- **When to apply**: Problems involving finding missing/duplicate numbers, or when numbers are in a known range
- **Implementation tip**: Always check bounds before swapping to avoid index errors

### Common Pitfalls
- Forgetting that numbers are 1-based can lead to off-by-one errors (correct_idx = nums[i] - 1)
- Not handling duplicates properly can cause infinite loops
- Incorrect termination conditions (loop should run while i < n, not just once through)
- Overcomplicating with additional space defeats the purpose of cyclic sort

### Follow-up Questions
1. **How would you handle numbers in range [0, n-1] instead of [1, n]?**
   - Use `correct_idx = nums[i]` instead of `nums[i] - 1`

2. **What if the array can contain negative numbers?**
   - Check if `nums[i] > 0` before calculating correct_idx

3. **How would you find the duplicate number without modifying the array?**
   - Use Floyd's Cycle Detection (Tortoise and Hare) instead

## Pattern Source

[Cyclic Sort Pattern](patterns/array-cyclic-sort.md)
