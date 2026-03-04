# Binary Search

## Category
Arrays & Strings

## Description

Binary Search is a **divide-and-conquer algorithm** that efficiently finds a target value within a **sorted array** by repeatedly dividing the search interval in half. With O(log n) time complexity, it's the gold standard for searching in sorted data structures.

---

## When to Use

Use the Binary Search algorithm when you need to solve problems involving:

- **Searching in sorted arrays**: Finding an element in a sorted collection
- **Finding insertion points**: Determining where an element should go
- **Optimization problems**: Finding the minimum/maximum that satisfies a condition (binary search on answer)
- **Bounds finding**: Finding lower bound, upper bound, or exact boundaries

### Comparison with Alternatives

| Algorithm | Time Complexity | Space | Requirements |
|-----------|----------------|-------|--------------|
| **Binary Search** | O(log n) | O(1) | Sorted array |
| Linear Search | O(n) | O(1) | None |
| Hash Table Lookup | O(1) avg | O(n) | Hash function |
| Binary Search Tree | O(log n) avg | O(n) | Balanced BST |

### When to Choose Binary Search

- **Choose Binary Search** when:
  - The array is sorted (or can be sorted)
  - You need O(log n) search time
  - You need to find exact match or closest element

- **Choose Linear Search** when:
  - Array is unsorted and cannot be sorted
  - Array is very small (under ~50 elements)
  - You only search once

- **Choose Hash Table** when:
  - You need O(1) average lookup time
  - You have many searches
  - Space is not a concern

---

## Algorithm Explanation

### Core Concept

Binary Search works on the principle of **elimination**. At each step, we compare the middle element of the current search range with the target value:

- If they're **equal**, we've found the target
- If the target is **smaller**, the target must be in the left half
- If the target is **larger**, the target must be the right half

By eliminating half of the remaining elements with each comparison, we achieve O(log n) time complexity.

### Why It Works

Because the array is sorted, we can definitively determine which half contains (or doesn't contain) our target:
- All elements to the left of a value are ≤ that value
- All elements to the right of a value are ≥ that value

This guarantee allows us to eliminate entire halves without missing potential matches.

### Visual Representation

For array `[1, 3, 5, 7, 9, 11, 13, 15]` searching for target `7`:

```
Step 1: [1, 3, 5, 7, 9, 11, 13, 15]
         L           M               R
         mid = 3, arr[3] = 7 == target ✓ (Found at index 3)

Search space reduced from 8 to 1 element in just 1 step!
```

### The Mid Calculation

**Important:** Always calculate mid as `left + (right - left) // 2` instead of `(left + right) // 2`

- **Problem with `(left + right) // 2`**: Can cause integer overflow in languages with fixed-size integers when dealing with large arrays (e.g., `left = 2^30, right = 2^30` would overflow)
- **Solution**: `left + (right - left) // 2` ensures the subtraction happens first, preventing overflow

---

## Algorithm Steps

### Iterative Approach

1. **Initialize pointers**: Set `left = 0` and `right = len(arr) - 1`
2. **Enter loop**: While `left <= right`:
   - Calculate `mid = left + (right - left) // 2` (prevents overflow)
   - If `arr[mid] == target`, return `mid` (found!)
   - If `arr[mid] < target`, set `left = mid + 1` (search right half)
   - If `arr[mid] > target`, set `right = mid - 1` (search left half)
3. **Exit loop**: Return -1 if target not found

### Recursive Approach

1. **Base case**: If `left > right`, return -1 (not found)
2. **Calculate mid**: `mid = left + (right - left) // 2`
3. **Compare and recurse**:
   - If `arr[mid] == target`, return `mid`
   - If `arr[mid] < target`, recurse on `[mid + 1, right]`
   - If `arr[mid] > target`, recurse on `[left, mid - 1]`

### Decision Tree

```
                    Start: [left, right]
                          |
                    Calculate mid
                          |
            ┌─────────────┼─────────────┐
            |             |             |
      arr[mid] ==   arr[mid] <    arr[mid] >
       target         target         target
            |             |             |
        Return mid   left = mid+1   right = mid-1
                          |             |
                          └──────┬──────┘
                                 |
                           Continue loop
```

---

## Implementation

### Template Code (Standard Binary Search)

````carousel
```python
def binary_search_iterative(arr, target):
    """
    Binary Search - Iterative implementation
    Time: O(log n)
    Space: O(1)
    
    Args:
        arr: Sorted list of elements
        target: Element to search for
        
    Returns:
        Index of target if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Prevents integer overflow
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Target not found


def binary_search_recursive(arr, target, left=None, right=None):
    """
    Binary Search - Recursive implementation
    Time: O(log n)
    Space: O(log n) for recursion stack
    
    Args:
        arr: Sorted list of elements
        target: Element to search for
        left: Left boundary (inclusive)
        right: Right boundary (inclusive)
        
    Returns:
        Index of target if found, -1 otherwise
    """
    if left is None:
        left = 0
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1  # Base case: target not found
    
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)


# Example usage and demonstration
if __name__ == "__main__":
    arr = [1, 3, 5, 7, 9, 11, 13, 15]
    target = 7
    
    result = binary_search_iterative(arr, target)
    print(f"Iterative: Index of {target} is {result}")  # Output: 3
    
    result = binary_search_recursive(arr, target)
    print(f"Recursive: Index of {target} is {result}")  # Output: 3
    
    # Test with target not in array
    result = binary_search_iterative(arr, 6)
    print(f"Not found: {result}")  # Output: -1
    
    # Test edge cases
    print("\n--- Edge Cases ---")
    
    # Empty array
    print(f"Empty array: {binary_search_iterative([], 1)}")  # -1
    
    # Single element
    print(f"Single element (found): {binary_search_iterative([5], 5)}")  # 0
    print(f"Single element (not found): {binary_search_iterative([5], 3)}")  # -1
    
    # First and last element
    print(f"First element: {binary_search_iterative(arr, 1)}")  # 0
    print(f"Last element: {binary_search_iterative(arr, 15)}")  # 7
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

/**
 * Binary Search - Iterative implementation
 * Time: O(log n)
 * Space: O(1)
 * 
 * @param arr Sorted vector of elements
 * @param target Element to search for
 * @return Index of target if found, -1 otherwise
 */
int binarySearchIterative(const vector<int>& arr, int target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    
    while (left <= right) {
        // Prevents integer overflow
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;  // Target not found
}

/**
 * Binary Search - Recursive implementation
 * Time: O(log n)
 * Space: O(log n) for recursion stack
 */
int binarySearchRecursive(const vector<int>& arr, int target, int left, int right) {
    if (left > right) {
        return -1;  // Base case: target not found
    }
    
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

// Template version for any comparable type
template<typename T>
int binarySearch(const vector<T>& arr, const T& target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}


int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13, 15};
    int target = 7;
    
    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    
    // Test iterative
    int result = binarySearchIterative(arr, target);
    cout << "Iterative: Index of " << target << " is " << result << endl;  // 3
    
    // Test recursive
    result = binarySearchRecursive(arr, target, 0, arr.size() - 1);
    cout << "Recursive: Index of " << target << " is " << result << endl;  // 3
    
    // Test not found
    result = binarySearchIterative(arr, 6);
    cout << "Not found: " << result << endl;  // -1
    
    // Test edge cases
    cout << "\n--- Edge Cases ---" << endl;
    cout << "Empty array: " << binarySearchIterative({}, 1) << endl;
    cout << "First element: " << binarySearchIterative(arr, 1) << endl;
    cout << "Last element: " << binarySearchIterative(arr, 15) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Binary Search implementation in Java
 * Time: O(log n)
 * Space: O(1) for iterative, O(log n) for recursive
 */
public class BinarySearch {
    
    /**
     * Binary Search - Iterative implementation
     */
    public static int binarySearchIterative(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            // Prevents integer overflow
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;  // Target not found
    }
    
    /**
     * Binary Search - Recursive implementation
     */
    public static int binarySearchRecursive(int[] arr, int target, int left, int right) {
        if (left > right) {
            return -1;  // Base case: target not found
        }
        
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            return binarySearchRecursive(arr, target, mid + 1, right);
        } else {
            return binarySearchRecursive(arr, target, left, mid - 1);
        }
    }
    
    /**
     * Generic version using Comparable
     */
    public static <T extends Comparable<T>> int binarySearch(T[] arr, T target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int cmp = arr[mid].compareTo(target);
            
            if (cmp == 0) {
                return mid;
            } else if (cmp < 0) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};
        int target = 7;
        
        System.out.println("Array: " + java.util.Arrays.toString(arr));
        
        // Test iterative
        int result = binarySearchIterative(arr, target);
        System.out.println("Iterative: Index of " + target + " is " + result);  // 3
        
        // Test recursive
        result = binarySearchRecursive(arr, target, 0, arr.length - 1);
        System.out.println("Recursive: Index of " + target + " is " + result);  // 3
        
        // Test not found
        result = binarySearchIterative(arr, 6);
        System.out.println("Not found: " + result);  // -1
        
        // Test edge cases
        System.out.println("\n--- Edge Cases ---");
        System.out.println("First element: " + binarySearchIterative(arr, 1));
        System.out.println("Last element: " + binarySearchIterative(arr, 15));
    }
}
```

<!-- slide -->
```javascript
/**
 * Binary Search - Iterative implementation
 * Time: O(log n)
 * Space: O(1)
 * 
 * @param {number[]} arr - Sorted array of elements
 * @param {number} target - Element to search for
 * @returns {number} Index of target if found, -1 otherwise
 */
function binarySearchIterative(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        // Prevents integer overflow (in JS this isn't an issue, but good practice)
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;  // Target not found
}

/**
 * Binary Search - Recursive implementation
 * Time: O(log n)
 * Space: O(log n) for recursion stack
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) {
        return -1;  // Base case: target not found
    }
    
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

/**
 * Binary Search using ES6 features
 */
const binarySearch = (arr, target) => {
    let [left, right] = [0, arr.length - 1];
    
    while (left <= right) {
        const mid = left + ((right - left) >> 1);  // Bitwise shift for division by 2
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
};


// Example usage and demonstration
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 7;

console.log(`Array: [${arr.join(', ')}]`);
console.log(`Target: ${target}`);
console.log();

// Test iterative
let result = binarySearchIterative(arr, target);
console.log(`Iterative: Index of ${target} is ${result}`);  // 3

// Test recursive
result = binarySearchRecursive(arr, target);
console.log(`Recursive: Index of ${target} is ${result}`);  // 3

// Test not found
result = binarySearchIterative(arr, 6);
console.log(`Not found: ${result}`);  // -1

// Test edge cases
console.log('\n--- Edge Cases ---');
console.log(`Empty array: ${binarySearchIterative([], 1)}`);  // -1
console.log(`First element: ${binarySearchIterative(arr, 1)}`);  // 0
console.log(`Last element: ${binarySearchIterative(arr, 15)}`);  // 7
console.log(`ES6 arrow function: ${binarySearch(arr, target)}`);  // 3
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Search (single)** | O(log n) | Halves search space each iteration |
| **Search (worst case)** | O(log n) | When element is at ends or not present |
| **Search (best case)** | O(1) | When element is at middle on first check |
| **Space (iterative)** | O(1) | Only uses a few variables |
| **Space (recursive)** | O(log n) | Call stack depth equals number of recursions |

### Detailed Breakdown

- **Number of iterations**: At most `⌊log₂(n)⌋ + 1` comparisons
- **Each iteration**: O(1) time to calculate mid and compare
- **Total**: O(log n)

### Why O(log n)?

Starting with n elements:
- After 1 comparison: n/2 elements remaining
- After 2 comparisons: n/4 elements remaining
- After k comparisons: n/2^k elements remaining

We stop when n/2^k ≤ 1, meaning k ≥ log₂(n)

---

## Space Complexity Analysis

| Implementation | Space Complexity | Reason |
|---------------|-----------------|--------|
| **Iterative** | O(1) | Only uses `left`, `right`, `mid` pointers |
| **Recursive** | O(log n) | Recursion stack depth equals log n |
| **In-place** | O(1) | Modifies array directly if needed |

---

## Common Variations

### 1. Lower Bound (First Position)

Find the first occurrence of target (or insertion point for target).

````carousel
```python
def lower_bound(arr, target):
    """
    Find the first index where arr[index] >= target
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] >= target:
            result = mid  # Potential answer
            right = mid - 1  # Look for earlier occurrence
        else:
            left = mid + 1
    
    return result
```
````

### 2. Upper Bound (Last Position)

Find the last occurrence of target (or insertion point after target).

````carousel
```python
def upper_bound(arr, target):
    """
    Find the first index where arr[index] > target
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] > target:
            result = mid  # Potential answer
            right = mid - 1  # Look for earlier occurrence
        else:
            left = mid + 1
    
    return result
```
````

### 3. Search in Rotated Sorted Array

Find target in a sorted array that was rotated at some pivot.

````carousel
```python
def search_in_rotated_array(arr, target):
    """
    Search in rotated sorted array
    Time: O(log n)
    Space: O(1)
    
    Example: [4, 5, 6, 7, 0, 1, 2] rotated at 7
    """
    if not arr:
        return -1
    
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        # Determine which half is sorted
        if arr[left] <= arr[mid]:  # Left half is sorted
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:  # Right half is sorted
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```
````

### 4. Binary Search on Answer

Used for optimization problems where we binary search on the answer.

````carousel
```python
def binary_search_on_answer(low, high, is_good, find_min=True):
    """
    Binary search for optimal value
    
    Args:
        low: Lower bound of search space
        high: Upper bound of search space
        is_good: Function that checks if value works
        find_min: If True, find minimum good value; else find maximum
    
    Returns:
        Optimal value
    """
    result = -1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if is_good(mid):
            result = mid
            if find_min:
                high = mid - 1  # Try to find smaller
            else:
                low = mid + 1   # Try to find larger
        else:
            if find_min:
                low = mid + 1   # Need larger value
            else:
                high = mid - 1  # Need smaller value
    
    return result


# Example: Find minimum value greater than or equal to threshold
def find_minimum_divisor(arr, threshold):
    """
    Given arr and threshold, find minimum divisor such that
    sum(ceil(arr[i]/divisor)) <= threshold
    """
    def can_divide(divisor):
        return sum((x + divisor - 1) // divisor for x in arr) <= threshold
    
    return binary_search_on_answer(1, max(arr), can_divide, find_min=True)
```
````

### 5. Finding Peak Element

Find any peak element where neighbors are smaller.

````carousel
```python
def find_peak_element(arr):
    """
    Find a peak element in the array
    Time: O(log n)
    Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] < arr[mid + 1]:
            # Peak must be on the right side
            left = mid + 1
        else:
            # Peak is on the left side (including mid)
            right = mid
    
    return left
```
````

---

## Example

### Input:
```
arr = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
```

### Step-by-step:

| Step | left | right | mid | arr[mid] | Action |
|------|------|-------|-----|----------|--------|
| 1 | 0 | 7 | 3 | 7 | Found! Return 3 |

### Output:
```
Iterative: Index of 7 is 3
Recursive: Index of 7 is 3
Not found: -1
```

---

## Practice Problems

### Problem 1: Basic Binary Search

**Problem:** [LeetCode 704 - Binary Search](https://leetcode.com/problems/binary-search/)

**Description:** Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

**How to Apply Binary Search:**
- Apply the standard iterative binary search algorithm
- Time complexity is O(log n) as required

---

### Problem 2: Search Insert Position

**Problem:** [LeetCode 35 - Search Insert Position](https://leetcode.com/problems/search-insert-position/)

**Description:** Given a sorted array and a target value, return the index if found. If not, return the index where it would be inserted.

**How to Apply Binary Search:**
- Use lower bound variation
- When target not found, return left pointer (insertion point)

---

### Problem 3: Search in Rotated Array

**Problem:** [LeetCode 33 - Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

**Description:** Search for a target value in a rotated sorted array. Assume no duplicates exist.

**How to Apply Binary Search:**
- Use the "search in rotated array" variation
- Determine which half is sorted at each step
- Decide which half to search based on target value

---

### Problem 4: Find First and Last Position

**Problem:** [LeetCode 34 - Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

**Description:** Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.

**How to Apply Binary Search:**
- Use both lower_bound and upper_bound variations
- First search for leftmost occurrence
- Then search for rightmost occurrence

---

### Problem 5: Search a 2D Matrix

**Problem:** [LeetCode 74 - Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)

**Description:** Write an efficient algorithm that searches for a value in an m x n matrix where rows are sorted and the first integer of each row is greater than the last integer of the previous row.

**How to Apply Binary Search:**
- Treat the 2D matrix as 1D array with mapping
- Index = row * n + col
- Apply standard binary search with virtual array

---

### Problem 6: Minimum Number of Days to Make m Bouquets

**Problem:** [LeetCode 1482 - Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)

**Description:** Given an integer array `bloomDay`, m bouquets, and k flowers per bouquet. Find the minimum number of days to make m bouquets.

**How to Apply Binary Search:**
- Binary search on answer
- Check if it's possible to make m bouquets on a given day

---

## Video Tutorial Links

### Fundamentals

- [Binary Search Explained (Take U Forward)](https://www.youtube.com/watch?v=Mo5R9qQ-GQc) - Comprehensive introduction
- [Binary Search Implementation (NeetCode)](https://www.youtube.com/watch?v=FXW2mjQaOys) - Practical implementation guide
- [Binary Search Mastery (WilliamFiset)](https://www.youtube.com/watch?v=Moq middlesex) - Detailed visualizations

### Advanced Topics

- [Search in Rotated Array](https://www.youtube.com/watch?v=6bPZS8T8zTY) - Handling rotated arrays
- [Binary Search on Answer](https://www.youtube.com/watch?v=zD2P2m9M7kE) - Optimization problems
- [Lower Bound & Upper Bound](https://www.youtube.com/watch?v=OEu2MXZE5T4) - Variations for finding boundaries
- [Binary Search Variations](https://www.youtube.com/watch?v=En-2NC7N86o) - Complete overview of variations

---

## Follow-up Questions

### Q1: Why use `left + (right - left) // 2` instead of `(left + right) // 2`?

**Answer:** The latter can cause integer overflow in languages with fixed-size integers (like C++ and Java). When `left` and `right` are large (close to `Integer.MAX_VALUE`), their sum can exceed the maximum value, causing unexpected behavior. The subtraction first ensures we never exceed the range.

### Q2: When should you use binary search over linear search?

**Answer:**
- **Use Binary Search** when:
  - Array is sorted
  - You have multiple searches on the same array
  - n is large (log n is significantly better than n)
  
- **Use Linear Search** when:
  - Array is unsorted
  - Array is very small
  - You only need to search once (sorting would take longer)

### Q3: Can binary search work on linked lists?

**Answer:** Not efficiently. Binary search requires O(1) random access to find the middle element, but linked lists have O(n) access time. To find the middle, you'd need to traverse half the list each time, making the total time O(n log n) instead of O(log n).

### Q4: What if the array is almost sorted?

**Answer:** Consider these alternatives:
- **Sort once**: If you'll do multiple searches, sort the array first (O(n log n) + O(log n) per search)
- **Binary search with modifications**: For "nearly sorted" arrays, consider interpolation search or jump search
- **Use a balanced BST**: O(log n) for search with sorted insertion

### Q5: How do you handle duplicates in binary search?

**Answer:**
- **Find first occurrence**: Use lower bound variation (search left when `arr[mid] == target`)
- **Find last occurrence**: Use upper bound variation (search right when `arr[mid] == target`)
- **Find any occurrence**: Standard binary search (any match is fine)

### Q6: What is the difference between binary search and binary search tree?

**Answer:**
- **Binary Search**: Algorithm on sorted arrays, O(log n) guaranteed
- **Binary Search Tree (BST)**: Data structure, O(log n) average but O(n) worst case if unbalanced
- BST supports insertions/deletions; binary search on array requires O(n) for modifications

---

## Summary

Binary Search is one of the most fundamental and powerful algorithms in computer science. Key takeaways:

- **O(log n) time complexity**: Dramatically faster than linear search for large datasets
- **Requires sorted data**: Either sorted array or sortable collection
- **Simple implementation**: Core algorithm is just a few lines
- **Many variations**: Lower bound, upper bound, rotated array, binary search on answer
- **Essential for interviews**: Frequently asked in technical interviews

When to use:
- ✅ Searching in sorted arrays
- ✅ Finding insertion points
- ✅ Optimization problems (binary search on answer)
- ✅ Finding boundaries (first/last occurrence)
- ❌ Unsorted arrays (sort first or use different algorithm)
- ❌ Single search on unsortable data (use linear search)

Mastering binary search and its variations is essential for competitive programming and technical interviews. The pattern of "divide and conquer" applies to many other algorithms and problem-solving techniques.

---

## Related Algorithms

- [Two Pointers](./two-pointers.md) - Related pattern often used with sorted arrays
- [Sliding Window](./sliding-window.md) - Another optimization technique
- [Prefix Sum](./prefix-sum.md) - For range queries
- [Binary Lifting](./binary-lifting.md) - Advanced binary search for ancestor queries
