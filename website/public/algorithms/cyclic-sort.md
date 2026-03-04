# Cyclic Sort

## Category
Arrays & Strings

## Description

Cyclic Sort is an **in-place sorting algorithm** that works optimally for arrays containing numbers in a **specific range** (typically 1 to n or 0 to n-1). It places each element at its correct index by cycling through the array, achieving O(n) time complexity with O(1) space complexity - making it one of the most efficient sorting algorithms for constrained input ranges.

---

## When to Use

Use the Cyclic Sort algorithm when you need to solve problems involving:

- **Arrays with values in range [1, n] or [0, n-1]**: When elements are unique and fall within a known, constrained range
- **Finding missing numbers**: Efficiently identify which numbers are missing from a sequence
- **Finding duplicate numbers**: Identify which numbers appear more than once in a sequence
- **In-place sorting requirements**: When you need O(1) extra space and O(n) time complexity
- **Cycle detection in arrays**: Problems involving cycles or misplaced elements

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|------------------|----------|
| **Cyclic Sort** | O(n) | O(1) | Arrays with values in range [1, n] |
| **Quicksort** | O(n log n) avg | O(log n) | General purpose sorting |
| **Merge Sort** | O(n log n) | O(n) | Stable sorting, linked lists |
| **Counting Sort** | O(n + k) | O(k) | Small range of integers |
| **Bucket Sort** | O(n + k) | O(n + k) | Uniformly distributed data |

### When to Choose Cyclic Sort vs Other Sorting Algorithms

- **Choose Cyclic Sort** when:
  - Array contains unique integers in range [1, n] or [0, n-1]
  - You need O(n) time with O(1) space
  - The problem involves finding missing/duplicate numbers

- **Choose Counting Sort** when:
  - Range of values (k) is small and known
  - Elements are not necessarily unique
  - You can afford O(k) extra space

- **Choose Quicksort/Merge Sort** when:
  - Values are not in a constrained range
  - You need a general-purpose sorting algorithm

---

## Algorithm Explanation

### Core Concept

The key insight behind Cyclic Sort is that **each element's value tells us exactly where it should be placed**. For an array with n elements containing values from 1 to n:

- Element with value `1` belongs at index `0`
- Element with value `2` belongs at index `1`
- Element with value `k` belongs at index `k - 1`

This one-to-one mapping allows us to place each element in its correct position by simply swapping it with the element currently at its target index.

### How It Works

1. **Iterate through the array** starting from index 0
2. **Calculate the correct index** for the current element: `correct_idx = arr[i] - 1`
3. **Check if the element is already at its correct position**:
   - If `arr[i] == arr[correct_idx]`, the element is already correctly placed (or it's a duplicate)
   - Move to the next index
4. **If not at correct position, swap**: Exchange `arr[i]` with `arr[correct_idx]`
5. **Repeat** for the current index (don't increment) until the element at index `i` is in its correct place

### Visual Representation

For array `[3, 1, 5, 4, 2]`:

```
Initial: [3, 1, 5, 4, 2]
           ↑
         i=0, val=3, correct_idx=2

Step 1:  Swap arr[0] and arr[2]
         [5, 1, 3, 4, 2]
          ↑
         i=0, val=5, correct_idx=4

Step 2:  Swap arr[0] and arr[4]
         [2, 1, 3, 4, 5]
          ↑
         i=0, val=2, correct_idx=1

Step 3:  Swap arr[0] and arr[1]
         [1, 2, 3, 4, 5]
          ↑
         i=0, val=1, correct_idx=0 ✓ (correct place)

Step 4:  Move to i=1
         [1, 2, 3, 4, 5]
             ↑
         i=1, val=2, correct_idx=1 ✓ (already correct)

Continue... all elements are now in correct positions!
```

### Why It Achieves O(n) Time

Each element is swapped at most once to reach its correct position. Even though we have nested logic (while loop inside for loop), each swap places at least one element correctly, and we never move an element out of its correct position once placed.

### Limitations

- **Only works for specific ranges**: Values must be in range [1, n] or [0, n-1]
- **Requires unique values** (for the basic version): Duplicates need special handling
- **Modifies the original array**: Sorts in-place
- **Not a stable sort**: Relative order of equal elements is not preserved

---

## Algorithm Steps

### Basic Cyclic Sort

1. **Initialize pointer**: Set `i = 0` to start at the first element
2. **Calculate correct index**: For element at `arr[i]`, compute `correct_idx = arr[i] - 1`
3. **Check placement**:
   - If `arr[i] == arr[correct_idx]`: Element is in correct position (or duplicate), increment `i`
   - Else: Swap `arr[i]` with `arr[correct_idx]` (don't increment `i`)
4. **Repeat** until `i` reaches the end of the array

### For Finding Missing Numbers

1. **Apply cyclic sort** to place all possible elements in their correct positions
2. **Scan the sorted array**: Find indices where `arr[i] != i + 1`
3. **Missing number** at index `i` is `i + 1`

### For Finding Duplicates

1. **Apply cyclic sort**: During sorting, if `arr[i] == arr[correct_idx]` before swapping, it's a duplicate
2. **Collect duplicates**: Store all such values found during the process

---

## Implementation

````carousel
```python
def cyclic_sort(nums):
    """
    Cyclic Sort - sort array with values in range [1, n]
    Time: O(n), Space: O(1)
    
    Args:
        nums: List of integers with values in range [1, len(nums)]
    
    Returns:
        Sorted array (modified in place)
    """
    i = 0
    while i < len(nums):
        # Calculate correct index (value - 1 because 0-indexed)
        correct_idx = nums[i] - 1
        
        # Swap if element is not at correct position
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return nums


def find_missing_number(nums):
    """
    Find the missing number in range [1, n] using cyclic sort.
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < len(nums) and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find the missing number
    for i in range(len(nums)):
        if nums[i] != i + 1:
            return i + 1
    
    return len(nums) + 1


def find_all_missing_numbers(nums):
    """
    Find all missing numbers in range [1, n].
    Time: O(n), Space: O(1) excluding output
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < len(nums) and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    missing = []
    for i in range(len(nums)):
        if nums[i] != i + 1:
            missing.append(i + 1)
    
    return missing


def find_duplicate(nums):
    """
    Find the duplicate number in array containing n+1 integers 
    where each integer is between 1 and n (inclusive).
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        if nums[i] != i + 1:
            correct_idx = nums[i] - 1
            if nums[i] == nums[correct_idx]:
                return nums[i]  # Found duplicate
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    return -1


# Example usage
if __name__ == "__main__":
    # Test cyclic sort
    nums = [3, 1, 5, 4, 2]
    print(f"Original: {nums}")
    print(f"Sorted: {cyclic_sort(nums.copy())}")
    
    # Test find missing
    nums2 = [4, 3, 2, 7, 8, 2, 3, 1]
    print(f"\nAll missing in {nums2}: {find_all_missing_numbers(nums2.copy())}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Cyclic Sort - sort array with values in range [1, n]
 * Time: O(n), Space: O(1)
 */
class CyclicSort {
public:
    static void sort(vector<int>& nums) {
        int i = 0;
        while (i < nums.size()) {
            int correctIdx = nums[i] - 1;
            
            // Swap if element is not at correct position
            if (nums[i] != nums[correctIdx]) {
                swap(nums[i], nums[correctIdx]);
            } else {
                i++;
            }
        }
    }
    
    static int findMissingNumber(vector<int>& nums) {
        int i = 0;
        while (i < nums.size()) {
            int correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < nums.size() && 
                nums[i] != nums[correctIdx]) {
                swap(nums[i], nums[correctIdx]);
            } else {
                i++;
            }
        }
        
        // Find the missing number
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return nums.size() + 1;
    }
    
    static vector<int> findAllMissingNumbers(vector<int>& nums) {
        int i = 0;
        while (i < nums.size()) {
            int correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < nums.size() && 
                nums[i] != nums[correctIdx]) {
                swap(nums[i], nums[correctIdx]);
            } else {
                i++;
            }
        }
        
        vector<int> missing;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != i + 1) {
                missing.push_back(i + 1);
            }
        }
        return missing;
    }
    
    static int findDuplicate(vector<int>& nums) {
        int i = 0;
        while (i < nums.size()) {
            if (nums[i] != i + 1) {
                int correctIdx = nums[i] - 1;
                if (nums[i] == nums[correctIdx]) {
                    return nums[i];  // Found duplicate
                }
                swap(nums[i], nums[correctIdx]);
            } else {
                i++;
            }
        }
        return -1;
    }
};

int main() {
    vector<int> nums = {3, 1, 5, 4, 2};
    
    cout << "Original: ";
    for (int x : nums) cout << x << " ";
    cout << endl;
    
    CyclicSort::sort(nums);
    
    cout << "Sorted: ";
    for (int x : nums) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

/**
 * Cyclic Sort - sort array with values in range [1, n]
 * Time: O(n), Space: O(1)
 */
public class CyclicSort {
    
    public static void sort(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int correctIdx = nums[i] - 1;
            
            // Swap if element is not at correct position
            if (nums[i] != nums[correctIdx]) {
                int temp = nums[i];
                nums[i] = nums[correctIdx];
                nums[correctIdx] = temp;
            } else {
                i++;
            }
        }
    }
    
    public static int findMissingNumber(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < nums.length && 
                nums[i] != nums[correctIdx]) {
                int temp = nums[i];
                nums[i] = nums[correctIdx];
                nums[correctIdx] = temp;
            } else {
                i++;
            }
        }
        
        // Find the missing number
        for (i = 0; i < nums.length; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }
        return nums.length + 1;
    }
    
    public static List<Integer> findAllMissingNumbers(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < nums.length && 
                nums[i] != nums[correctIdx]) {
                int temp = nums[i];
                nums[i] = nums[correctIdx];
                nums[correctIdx] = temp;
            } else {
                i++;
            }
        }
        
        List<Integer> missing = new ArrayList<>();
        for (i = 0; i < nums.length; i++) {
            if (nums[i] != i + 1) {
                missing.add(i + 1);
            }
        }
        return missing;
    }
    
    public static int findDuplicate(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            if (nums[i] != i + 1) {
                int correctIdx = nums[i] - 1;
                if (nums[i] == nums[correctIdx]) {
                    return nums[i];  // Found duplicate
                }
                int temp = nums[i];
                nums[i] = nums[correctIdx];
                nums[correctIdx] = temp;
            } else {
                i++;
            }
        }
        return -1;
    }
    
    public static void main(String[] args) {
        int[] nums = {3, 1, 5, 4, 2};
        
        System.out.print("Original: ");
        for (int x : nums) System.out.print(x + " ");
        System.out.println();
        
        sort(nums);
        
        System.out.print("Sorted: ");
        for (int x : nums) System.out.print(x + " ");
        System.out.println();
    }
}
```

<!-- slide -->
```javascript
/**
 * Cyclic Sort - sort array with values in range [1, n]
 * Time: O(n), Space: O(1)
 */

class CyclicSort {
    static sort(nums) {
        let i = 0;
        while (i < nums.length) {
            const correctIdx = nums[i] - 1;
            
            // Swap if element is not at correct position
            if (nums[i] !== nums[correctIdx]) {
                [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
            } else {
                i++;
            }
        }
        return nums;
    }
    
    static findMissingNumber(nums) {
        let i = 0;
        while (i < nums.length) {
            const correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < nums.length && 
                nums[i] !== nums[correctIdx]) {
                [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
            } else {
                i++;
            }
        }
        
        // Find the missing number
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] !== i + 1) {
                return i + 1;
            }
        }
        return nums.length + 1;
    }
    
    static findAllMissingNumbers(nums) {
        let i = 0;
        while (i < nums.length) {
            const correctIdx = nums[i] - 1;
            if (correctIdx >= 0 && correctIdx < nums.length && 
                nums[i] !== nums[correctIdx]) {
                [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
            } else {
                i++;
            }
        }
        
        const missing = [];
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] !== i + 1) {
                missing.push(i + 1);
            }
        }
        return missing;
    }
    
    static findDuplicate(nums) {
        let i = 0;
        while (i < nums.length) {
            if (nums[i] !== i + 1) {
                const correctIdx = nums[i] - 1;
                if (nums[i] === nums[correctIdx]) {
                    return nums[i];  // Found duplicate
                }
                [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];
            } else {
                i++;
            }
        }
        return -1;
    }
}

// Example usage
const nums = [3, 1, 5, 4, 2];
console.log("Original:", nums);
console.log("Sorted:", CyclicSort.sort([...nums]));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sorting** | O(n) | Each element is swapped at most once to its correct position |
| **Finding Missing Number** | O(n) | O(n) for sorting + O(n) for scanning = O(n) |
| **Finding Duplicate** | O(n) | O(n) for sorting + O(n) for detection = O(n) |
| **Finding All Missing** | O(n) | O(n) for sorting + O(n) for scanning = O(n) |

### Detailed Breakdown

- **Outer while loop**: Runs n times in the worst case
- **Inner swap operations**: Each swap places at least one element correctly
- **Total swaps**: At most n swaps (each element moved to correct place once)
- **Why not O(n²)?**: Unlike bubble sort, we don't revisit correctly placed elements

### Proof of O(n) Complexity

Each iteration either:
1. Places one element in its correct position (swap case), OR
2. Moves the pointer forward (element already in place)

Since we can place at most n elements correctly, and we move the pointer n times, total operations ≤ 2n = O(n).

---

## Space Complexity Analysis

| Aspect | Space Complexity | Description |
|--------|------------------|-------------|
| **Main Algorithm** | O(1) | In-place sorting, only uses a few variables |
| **Output (missing numbers)** | O(k) | Where k is the count of missing numbers |

### Space Breakdown

- **Input array**: Modified in-place
- **Variables**: Only need index variable `i` and temporary swap variable
- **No recursion**: Iterative approach
- **No auxiliary data structures**: Unlike merge sort which needs O(n) extra space

---

## Common Variations

### 1. Cyclic Sort with Duplicates (0 to n-1 range)

When array contains numbers from 0 to n-1 instead of 1 to n:

````carousel
```python
def cyclic_sort_zero_based(nums):
    """
    Cyclic Sort for range [0, n-1]
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i]  # No -1 needed for 0-based
        
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    return nums
```
````

### 2. Find the Duplicate Number (LeetCode 287)

When array has n+1 integers where each integer is between 1 and n:

````carousel
```python
def find_duplicate(nums):
    """
    Find duplicate using cyclic sort principle.
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            if i != correct_idx:  # Duplicate found!
                return nums[i]
            i += 1
    
    return -1
```
````

### 3. First Missing Positive (LeetCode 41)

Find the smallest missing positive integer:

````carousel
```python
def first_missing_positive(nums):
    """
    Find first missing positive integer.
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    i = 0
    
    while i < n:
        correct_idx = nums[i] - 1
        
        # Only place if it's in valid range and not already correct
        if (0 <= correct_idx < n and 
            nums[i] != nums[correctIdx]):
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find first missing positive
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    
    return n + 1
```
````

### 4. Set Mismatch (LeetCode 645)

Find the duplicate and missing number:

````carousel
```python
def find_error_nums(nums):
    """
    Find duplicate and missing number.
    Returns [duplicate, missing]
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Find duplicate and missing
    for i in range(len(nums)):
        if nums[i] != i + 1:
            return [nums[i], i + 1]
    
    return [-1, -1]
```
````

---

## Practice Problems

### Problem 1: Missing Number

**Problem:** [LeetCode 268 - Missing Number](https://leetcode.com/problems/missing-number/)

**Description:** Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

**How to Apply Cyclic Sort:**
- Use cyclic sort to place each number at its correct index
- After sorting, the index where `nums[i] != i` reveals the missing number
- If all are in place, n is missing

---

### Problem 2: Find All Numbers Disappeared in an Array

**Problem:** [LeetCode 448 - Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)

**Description:** Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`.

**How to Apply Cyclic Sort:**
- Apply cyclic sort to place all existing numbers at their correct indices
- Scan through the array to find indices where `nums[i] != i + 1`
- Those indices + 1 are the missing numbers

---

### Problem 3: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive, there is only one repeated number. Return this repeated number.

**How to Apply Cyclic Sort:**
- During cyclic sort, when we try to place a number at its correct index
- If that position already has the correct number, we've found the duplicate
- Return that number immediately

---

### Problem 4: First Missing Positive

**Problem:** [LeetCode 41 - First Missing Positive](https://leetcode.com/problems/first-missing-positive/)

**Description:** Given an unsorted integer array `nums`, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.

**How to Apply Cyclic Sort:**
- Ignore negative numbers and numbers larger than n
- Place valid numbers at their correct indices (index = value - 1)
- Scan to find first position where `nums[i] != i + 1`

---

### Problem 5: Set Mismatch

**Problem:** [LeetCode 645 - Set Mismatch](https://leetcode.com/problems/set-mismatch/)

**Description:** You have a set of integers `s` which originally contains all the numbers from `1` to `n`. Unfortunately, due to some error, one of the numbers in `s` got duplicated to another number in the set, which results in repetition of one number and loss of another number. Find the number that occurs twice and the number that is missing.

**How to Apply Cyclic Sort:**
- Apply cyclic sort to the array
- The index where `nums[i] != i + 1` tells us both:
  - `nums[i]` is the duplicate
  - `i + 1` is the missing number

---

## Video Tutorial Links

### Fundamentals

- [Cyclic Sort - Pattern for Arrays 1 to N (NeetCode)](https://www.youtube.com/watch?v=JfinxytTYFQ) - Introduction to cyclic sort pattern
- [Cyclic Sort Algorithm (JavaScript)](https://www.youtube.com/watch?v=J0kYJN5w8gw) - Step-by-step implementation
- [Sorting Algorithms: Cyclic Sort (Tech With Tim)](https://www.youtube.com/watch?v=JfinxytTYFQ) - Visual explanation with examples

### LeetCode Problem Solutions

- [Missing Number - LeetCode 268 (NeetCode)](https://www.youtube.com/watch?v=YMYvYSKG68g) - Applying cyclic sort to find missing number
- [Find the Duplicate Number - LeetCode 287 (Nick White)](https://www.youtube.com/watch?v=wjYnzkAhcNk) - Multiple approaches including cyclic sort
- [First Missing Positive - LeetCode 41 (Back To Back SWE)](https://www.youtube.com/watch?v=8DqewaFKK4k) - Hard problem using cyclic sort concept

### Pattern Recognition

- [Cyclic Sort Pattern - Blind 75 (Sean Prashad)](https://www.youtube.com/watch?v=9TlHvipP5yA) - How to recognize cyclic sort problems
- [15 Sorting Algorithms Visualized](https://www.youtube.com/watch?v=kPRA0W1kECg) - Cyclic sort among other sorting algorithms

---

## Follow-up Questions

### Q1: Can Cyclic Sort handle arrays with duplicate values?

**Answer:** The basic cyclic sort assumes unique values in range [1, n]. For duplicates:
- **Detection**: Cyclic sort can detect duplicates during the sorting process
- **Sorting with duplicates**: If `nums[i] == nums[correct_idx]` and `i != correct_idx`, it's a duplicate
- **Handling**: You can skip duplicates and continue, or collect them separately

---

### Q2: What happens if the array contains numbers outside the range [1, n]?

**Answer:** Cyclic sort only works for values in range [1, n] (or [0, n-1]). For values outside this range:
- **Invalid input**: The algorithm may access out-of-bounds indices
- **Solution**: Add bounds checking - ignore values outside the valid range
- **Alternative**: For finding first missing positive, we place only valid numbers and ignore others

---

### Q3: Is Cyclic Sort stable? Does it preserve the relative order of equal elements?

**Answer:** **No**, Cyclic Sort is not a stable sort:
- Elements are swapped to their correct positions regardless of original order
- Equal elements (if allowed) may end up in different relative positions
- For applications requiring stability, use Merge Sort or Insertion Sort instead

---

### Q4: How does Cyclic Sort compare to Counting Sort?

**Answer:**

| Aspect | Cyclic Sort | Counting Sort |
|--------|-------------|---------------|
| **Time** | O(n) | O(n + k) where k is range |
| **Space** | O(1) | O(k) |
| **Range** | [1, n] only | Any range [0, k] |
| **Duplicates** | Complex handling | Handles naturally |
| **Stability** | Not stable | Stable |

Choose Cyclic Sort when space is critical and range equals array length. Choose Counting Sort when you need stability or have a small, fixed range.

---

### Q5: Can Cyclic Sort be used for non-integer data?

**Answer:** Cyclic Sort relies on the property that `value - 1` gives the correct index:
- **Integers only**: Works directly with integers
- **Characters**: Can map 'a'-'z' to 0-25 and apply similar logic
- **Custom objects**: Would need a key function that maps to range [0, n-1]
- **General data**: Not suitable; use comparison-based sorts like Quicksort or Mergesort

---

## Summary

The Cyclic Sort algorithm is a powerful technique for sorting arrays with values in a constrained range [1, n] or [0, n-1]. Key takeaways:

- **O(n) time complexity**: Each element is moved to its correct position at most once
- **O(1) space complexity**: Sorts in-place with no extra memory needed
- **Optimal for constrained ranges**: When values match array indices, this is the most efficient approach
- **Pattern for array problems**: Essential for finding missing/duplicate numbers
- **Not a general-purpose sort**: Only works when values are in specific range

When to use:
- ✅ Array values are unique integers in range [1, n]
- ✅ Finding missing numbers in a sequence
- ✅ Finding duplicates in constrained range
- ✅ Need O(n) time with O(1) space

When NOT to use:
- ❌ Values outside range [1, n]
- ❌ Non-integer or complex data types
- ❌ Need stable sorting
- ❌ General-purpose sorting needs

This algorithm is essential for technical interviews and competitive programming, particularly for problems involving finding missing or duplicate elements in arrays.

---

## Related Algorithms

- [Two Pointers](./two-pointers.md) - Alternative approach for some cyclic sort problems
- [Fast & Slow Pointers](./fast-slow-pointers.md) - Floyd's cycle detection for finding duplicates
- [Bit Manipulation](./bit-manipulation.md) - XOR approach for finding missing numbers
- [Hash Table](./hash-table.md) - Alternative for finding duplicates with more space
