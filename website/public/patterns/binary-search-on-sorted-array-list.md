# Binary Search - On Sorted Array/List

## Problem Description

Binary search is one of the most fundamental and efficient algorithms for finding an element in a **sorted** array or list. The algorithm works by repeatedly dividing the search interval in half, eliminating half of the remaining elements from consideration in each step.

This pattern is the foundation for many advanced algorithms and is essential for solving problems involving:
- Finding a specific element
- Finding the first/last occurrence of an element
- Finding the insertion point
- Finding the minimum/maximum in a sorted context
- Searching in rotated sorted arrays
- Finding k-th elements across sorted arrays

---

## Core Concepts

### Why Binary Search Works

Binary search leverages the **sorted property** of the array to eliminate large portions of the search space in each iteration. If the middle element is greater than the target, we know the target (if it exists) must be in the left half. Similarly, if the middle element is less than the target, the target must be in the right half.

### Key Invariants

1. **Search Space**: The search always maintains a contiguous subarray `[low, high]` where the target could exist
2. **Termination Condition**: The loop continues while `low <= high`
3. **Mid Calculation**: `mid = low + (high - low) // 2` to avoid integer overflow

---

## Constraints

- `0 <= nums.length <= 10^5` (typically)
- `nums` is sorted in non-decreasing (ascending) order
- `-10^9 <= nums[i] <= 10^9` (typically)
- Time complexity requirement: **O(log n)**

---

## Approach 1: Standard Binary Search ⭐

### Algorithm

1. Initialize `low = 0` and `high = len(nums) - 1`
2. While `low <= high`:
   - Calculate `mid = low + (high - low) // 2`
   - If `nums[mid] == target`: return `mid` (found!)
   - If `nums[mid] < target`: search right half (`low = mid + 1`)
   - If `nums[mid] > target`: search left half (`high = mid - 1`)
3. Return `-1` if target not found

### Code Templates

````carousel
<!-- slide -->
```python
from typing import List

class Solution:
    def binarySearch(self, nums: List[int], target: int) -> int:
        """
        Standard binary search for finding an element in a sorted array.
        
        Args:
            nums: Sorted list of integers
            target: Target value to find
            
        Returns:
            Index of target if found, -1 otherwise
        """
        low, high = 0, len(nums) - 1
        
        while low <= high:
            mid = low + (high - low) // 2  # Prevent integer overflow
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        
        return -1
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int binarySearch(vector<int>& nums, int target) {
        int low = 0;
        int high = nums.size() - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;  // Prevent overflow
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
import java.util.List;

class Solution {
    public int binarySearch(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;  // Prevent overflow
            
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Standard binary search for finding an element in a sorted array.
 * @param {number[]} nums - Sorted array of numbers
 * @param {number} target - Target value to find
 * @returns {number} Index of target if found, -1 otherwise
 */
function binarySearch(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    
    return -1;
}
```
````

### Time Complexity

**O(log n)** - Each iteration halves the search space

### Space Complexity

**O(1)** - Constant extra space

---

## Approach 2: Recursive Binary Search

### Algorithm

The same logic as iterative binary search, but implemented recursively. This is often more elegant but uses O(log n) stack space.

### Code Templates

````carousel
<!-- slide -->
```python
from typing import List

class Solution:
    def binarySearchRecursive(self, nums: List[int], target: int) -> int:
        """
        Recursive binary search implementation.
        
        Args:
            nums: Sorted list of integers
            target: Target value to find
            
        Returns:
            Index of target if found, -1 otherwise
        """
        def helper(low: int, high: int) -> int:
            if low > high:
                return -1  # Base case: not found
            
            mid = low + (high - low) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                return helper(mid + 1, high)
            else:
                return helper(low, mid - 1)
        
        return helper(0, len(nums) - 1)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int binarySearchRecursive(vector<int>& nums, int target) {
        return helper(nums, target, 0, nums.size() - 1);
    }
    
private:
    int helper(vector<int>& nums, int target, int low, int high) {
        if (low > high) {
            return -1;  // Base case: not found
        }
        
        int mid = low + (high - low) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            return helper(nums, target, mid + 1, high);
        } else {
            return helper(nums, target, low, mid - 1);
        }
    }
};
```

<!-- slide -->
```java
class Solution {
    public int binarySearchRecursive(int[] nums, int target) {
        return helper(nums, target, 0, nums.length - 1);
    }
    
    private int helper(int[] nums, int target, int low, int high) {
        if (low > high) {
            return -1;  // Base case: not found
        }
        
        int mid = low + (high - low) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            return helper(nums, target, mid + 1, high);
        } else {
            return helper(nums, target, low, mid - 1);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Recursive binary search implementation.
 * @param {number[]} nums - Sorted array of numbers
 * @param {number} target - Target value to find
 * @returns {number} Index of target if found, -1 otherwise
 */
function binarySearchRecursive(nums, target) {
    return helper(nums, target, 0, nums.length - 1);
}

function helper(nums, target, low, high) {
    if (low > high) {
        return -1;  // Base case: not found
    }
    
    const mid = low + Math.floor((high - low) / 2);
    
    if (nums[mid] === target) {
        return mid;
    } else if (nums[mid] < target) {
        return helper(nums, target, mid + 1, high);
    } else {
        return helper(nums, target, low, mid - 1);
    }
}
```
````

### Time Complexity

**O(log n)** - Each recursive call halves the search space

### Space Complexity

**O(log n)** - Stack space due to recursion

---

## Approach 3: Lower Bound (First >= Target)

### Algorithm

Finds the first index where `nums[i] >= target`. This is useful for:
- Finding the insertion point
- Finding the first occurrence of a value >= target

### Code Templates

````carousel
<!-- slide -->
```python
from typing import List

class Solution:
    def lowerBound(self, nums: List[int], target: int) -> int:
        """
        Find the first index where nums[i] >= target.
        
        This is the lower bound of target in the sorted array.
        
        Args:
            nums: Sorted list of integers
            target: Target value
            
        Returns:
            First index i where nums[i] >= target, or len(nums) if not found
        """
        low, high = 0, len(nums) - 1
        answer = len(nums)  # Default: insertion position at end
        
        while low <= high:
            mid = low + (high - low) // 2
            
            if nums[mid] >= target:
                answer = mid  # Possible answer, continue searching left
                high = mid - 1
            else:
                low = mid + 1
        
        return answer
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int lowerBound(vector<int>& nums, int target) {
        int low = 0;
        int high = nums.size() - 1;
        int answer = nums.size();  // Default: insertion position at end
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            if (nums[mid] >= target) {
                answer = mid;  // Possible answer, continue searching left
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lowerBound(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        int answer = nums.length;  // Default: insertion position at end
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            if (nums[mid] >= target) {
                answer = mid;  // Possible answer, continue searching left
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        return answer;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the first index where nums[i] >= target.
 * This is the lower bound of target in the sorted array.
 * @param {number[]} nums - Sorted array of numbers
 * @param {number} target - Target value
 * @returns {number} First index i where nums[i] >= target, or nums.length if not found
 */
function lowerBound(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    let answer = nums.length;  // Default: insertion position at end
    
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        
        if (nums[mid] >= target) {
            answer = mid;  // Possible answer, continue searching left
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    
    return answer;
}
```
````

### Time Complexity

**O(log n)**

### Space Complexity

**O(1)**

---

## Approach 4: Upper Bound (First > Target)

### Algorithm

Finds the first index where `nums[i] > target`. This is useful for:
- Finding the insertion point for values > target
- Finding the position after the last occurrence of target

### Code Templates

````carousel
<!-- slide -->
```python
from typing import List

class Solution:
    def upperBound(self, nums: List[int], target: int) -> int:
        """
        Find the first index where nums[i] > target.
        
        This is the upper bound of target in the sorted array.
        
        Args:
            nums: Sorted list of integers
            target: Target value
            
        Returns:
            First index i where nums[i] > target, or len(nums) if not found
        """
        low, high = 0, len(nums) - 1
        answer = len(nums)  # Default: insertion position at end
        
        while low <= high:
            mid = low + (high - low) // 2
            
            if nums[mid] > target:
                answer = mid  # Possible answer, continue searching left
                high = mid - 1
            else:
                low = mid + 1
        
        return answer
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int upperBound(vector<int>& nums, int target) {
        int low = 0;
        int high = nums.size() - 1;
        int answer = nums.size();  // Default: insertion position at end
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            if (nums[mid] > target) {
                answer = mid;  // Possible answer, continue searching left
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int upperBound(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        int answer = nums.length;  // Default: insertion position at end
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            if (nums[mid] > target) {
                answer = mid;  // Possible answer, continue searching left
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        
        return answer;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the first index where nums[i] > target.
 * This is the upper bound of target in the sorted array.
 * @param {number[]} nums - Sorted array of numbers
 * @param {number} target - Target value
 * @returns {number} First index i where nums[i] > target, or nums.length if not found
 */
function upperBound(nums, target) {
    let low = 0;
    let high = nums.length - 1;
    let answer = nums.length;  // Default: insertion position at end
    
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        
        if (nums[mid] > target) {
            answer = mid;  // Possible answer, continue searching left
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    
    return answer;
}
```
````

### Time Complexity

**O(log n)**

### Space Complexity

**O(1)**

---

## Step-by-Step Example

Let's trace through `nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23`:

```
Initial: low=0, high=9
Step 1: mid=4, nums[4]=16 < 23 → low=5
        Range: [5, 9]

Step 2: mid=7, nums[7]=56 > 23 → high=6
        Range: [5, 6]

Step 3: mid=5, nums[5]=23 == 23 → Found at index 5!
```

---

## Common Patterns and Variations

### Pattern 1: Finding First Occurrence
```python
# Modified binary search to find first occurrence of target
while low < high:
    mid = low + (high - low) // 2
    if nums[mid] < target:
        low = mid + 1
    else:
        high = mid
return low
```

### Pattern 2: Finding Last Occurrence
```python
# Modified binary search to find last occurrence of target
while low < high:
    mid = low + (high - low + 1) // 2  # Upper mid
    if nums[mid] > target:
        high = mid - 1
    else:
        low = mid
return low
```

### Pattern 3: Search Insert Position
```python
def searchInsert(nums, target):
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return low  # Insert position
```

---

## Time Complexity Comparison

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Standard Binary Search | O(log n) | O(1) | Finding any occurrence |
| Recursive Binary Search | O(log n) | O(log n) | Elegant solution, small inputs |
| Lower Bound | O(log n) | O(1) | First >= target |
| Upper Bound | O(log n) | O(1) | First > target |
| Search Insert Position | O(log n) | O(1) | Insertion point |

---

## Related Problems

1. **First and Last Position of Element** - Find exact range of occurrences ([LeetCode 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/))
2. **Search in Rotated Sorted Array** - Handle rotation ([LeetCode 33](https://leetcode.com/problems/search-in-rotated-sorted-array/))
3. **Find Median of Two Sorted Arrays** - Advanced binary search ([LeetCode 4](https://leetcode.com/problems/median-of-two-sorted-arrays/))
4. **Search Insert Position** - Find where to insert target ([LeetCode 35](https://leetcode.com/problems/search-insert-position/))
5. **Find Smallest Letter Greater Than Target** - Find next greater element ([LeetCode 744](https://leetcode.com/problems/find-smallest-letter-greater-than-target/))
6. **Find K Closest Elements** - Find k closest elements ([LeetCode 658](https://leetcode.com/problems/find-k-closest-elements/))
7. **Find Peak Element** - Find a peak element ([LeetCode 162](https://leetcode.com/problems/find-peak-element/))
8. **Guess Number Higher or Lower** - Number guessing game ([LeetCode 374](https://leetcode.com/problems/guess-number-higher-or-lower/))

---

## Video Tutorials

- [Binary Search - CS50](https://www.youtube.com/watch?v=4Uv-K1_JtcI)
- [Binary Search - Abdul Bari](https://www.youtube.com/watch?v=JQhgu_TqVdQ)
- [Binary Search - NeetCode](https://www.youtube.com/watch?v=6ysjqQCvN2k)
- [Binary Search Variations - Back to Back SWE](https://www.youtube.com/watch?v=JQHujdMWT7U)
- [Lower and Upper Bound - Errichto](https://www.youtube.com/watch?v=3XRX-YgCqH8)

---

## Common Mistakes to Avoid

1. **Integer Overflow**: Always use `mid = low + (high - low) // 2` instead of `(low + high) // 2`
2. **Infinite Loops**: Ensure pointers are updated correctly (`low = mid + 1` or `high = mid - 1`)
3. **Off-by-One Errors**: Be careful with `<=` vs `<` in the while condition
4. **Wrong Search Direction**: Remember: `nums[mid] < target` means search right
5. **Not Handling Empty Arrays**: Always check for empty input
6. **Confusing Lower and Upper Bound**: Lower bound finds `>=`, upper bound finds `>`
7. **Returning Wrong Index**: Ensure you return `-1` when not found, not `low` or `high`

---

## Follow-up Questions

1. **How would you count the number of occurrences of target?**
   - Answer: `count = upper_bound(nums, target) - lower_bound(nums, target)`

2. **What if the array is rotated?**
   - Answer: Modify binary search to check which half is sorted

3. **How do you find the minimum in a rotated sorted array?**
   - Answer: Compare mid with high to determine the rotation point

4. **What if you need to search for a range of values?**
   - Answer: Use lower bound for start, upper bound for end

5. **How would you handle duplicates in a rotated array?**
   - Answer: Skip duplicates carefully when determining which half to search

6. **What if the array contains floating-point numbers?**
   - Answer: Same algorithm works, just be careful with comparisons

7. **How would you search for a string in a sorted array of strings?**
   - Answer: Use string comparison operators instead of numeric comparisons

---

## References

- [LeetCode 704 - Binary Search](https://leetcode.com/problems/binary-search/)
- [LeetCode 35 - Search Insert Position](https://leetcode.com/problems/search-insert-position/)
- Cormen, Leiserson, Rivest, Stein - Introduction to Algorithms (CLRS)
- Knuth, Donald - The Art of Computer Programming, Volume 3: Sorting and Searching
