# Dutch National Flag

## Category
Arrays & Strings

## Description

The **Dutch National Flag** algorithm (also known as **3-way partition**) is a classic sorting algorithm proposed by Edsger Dijkstra. It efficiently sorts an array containing only **three distinct values** (like 0, 1, 2 or red, white, blue) in a **single pass** with **O(n)** time complexity and **O(1)** space complexity.

This algorithm is most famously used to solve the "Sort Colors" problem (LeetCode 75), but its underlying principle of three-way partitioning is applicable to many other scenarios involving element categorization.

---

## When to Use

Use the Dutch National Flag algorithm when you need to solve problems involving:

- **Three-way partitioning**: Sorting arrays with exactly three distinct values
- **Element categorization**: Grouping elements into three categories in one pass
- **In-place sorting**: When O(1) extra space is required
- **Single-pass solutions**: When you need to process elements only once
- **Pivot-based partitioning**: Similar to quicksort's partition step

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Passes Required | Best For |
|-----------|----------------|------------------|------------------|----------|
| **Dutch National Flag** | O(n) | O(1) | 1 | 3 distinct values |
| **Counting Sort** | O(n + k) | O(k) | 2 | Limited range of values |
| **Quicksort (3-way)** | O(n log n) | O(1) | Multiple | Multiple duplicate values |
| **Built-in Sort** | O(n log n) | O(n) | Multiple | General sorting |
| **Two-pass Counting** | O(n) | O(1) | 2 | Known value ranges |

### When to Choose Dutch National Flag vs Others

- **Choose Dutch National Flag** when:
  - Array contains exactly 3 distinct values (or can be mapped to 3)
  - Need in-place O(1) space solution
  - Single-pass solution is preferred
  - Values can be compared (0, 1, 2 or similar)

- **Choose Counting Sort** when:
  - Value range is small and known
  - Space is not a concern
  - Need stable sorting

- **Choose Quicksort 3-way** when:
  - Array has many duplicate values
  - Need general-purpose sorting
  - Average-case performance matters

---

## Algorithm Explanation

### Core Concept

The key insight behind the Dutch National Flag algorithm is using **three pointers** to partition the array into four distinct sections during a single traversal. This approach ensures each element is processed at most once, achieving O(n) time complexity.

### How It Works

#### Three Pointers Strategy:

- **`low`**: Boundary for elements equal to 0 (all elements before `low` are 0s)
- **`mid`**: Current element being processed (all elements from `low` to `mid-1` are 1s)
- **`high`**: Boundary for elements equal to 2 (all elements after `high` are 2s)

#### Four Partitions:

1. **[0, low - 1]**: All zeros
2. **[low, mid - 1]**: All ones
3. **[mid, high]**: Unprocessed elements (unknown)
4. **[high + 1, n - 1]**: All twos

#### Algorithm Logic:

```
while mid <= high:
    if nums[mid] == 0:
        swap(nums[low], nums[mid])
        low++, mid++
    elif nums[mid] == 1:
        mid++
    else:  # nums[mid] == 2
        swap(nums[mid], nums[high])
        high--
```

#### Why It Works:

- **Each element is processed at most once**: The `mid` pointer only moves forward
- **Elements equal to mid are skipped**: They're already in the correct partition (ones)
- **Elements less than mid go left**: When we see a 0, it goes to the left section
- **Elements greater than mid go right**: When we see a 2, it goes to the right section
- **No element is missed**: The `high` pointer ensures all 2s are placed at the end

### Visual Representation

For array `[2, 0, 2, 1, 1, 0]`:

```
Initial: [2, 0, 2, 1, 1, 0]
         low=0, mid=0, high=5

Step 1: mid=0, nums[mid]=2 → swap with high
        [0, 0, 2, 1, 1, 2]
         low=0, mid=0, high=4

Step 2: mid=0, nums[mid]=0 → swap with low
        [0, 0, 2, 1, 1, 2]
         low=1, mid=1, high=4

Step 3: mid=1, nums[mid]=0 → swap with low
        [0, 0, 2, 1, 1, 2]
         low=2, mid=2, high=4

Step 4: mid=2, nums[mid]=2 → swap with high
        [0, 0, 1, 1, 2, 2]
         low=2, mid=2, high=3

Step 5: mid=2, nums[mid]=1 → mid++
        [0, 0, 1, 1, 2, 2]
         low=2, mid=3, high=3

Step 6: mid=3, nums[mid]=1 → mid++
        [0, 0, 1, 1, 2, 2]
         low=2, mid=4, high=3

mid > high → Done!

Final: [0, 0, 1, 1, 2, 2]
```

### Important Edge Cases

1. **All elements are the same**: `[1, 1, 1]` - Algorithm handles gracefully
2. **Already sorted**: `[0, 0, 1, 1, 2, 2]` - Only moves mid pointer
3. **Reverse sorted**: `[2, 2, 1, 1, 0, 0]` - Maximum swaps
4. **Empty array**: `[]` - Handles correctly
5. **Single element**: `[1]` - No processing needed

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize Pointers**:
   - Set `low = 0`
   - Set `mid = 0`
   - Set `high = n - 1` (last index)

2. **Process Each Element**:
   - While `mid <= high`:
     - If `nums[mid] == 0`: Swap with `low`, increment both `low` and `mid`
     - If `nums[mid] == 1`: Just increment `mid`
     - If `nums[mid] == 2`: Swap with `high`, decrement `high` (don't increment `mid`!)

3. **Continue Until Complete**:
   - Loop until `mid` crosses `high`
   - All elements are now sorted

### Key Implementation Notes

- **Don't increment mid after swapping with high**: The element swapped from `high` hasn't been processed yet
- **Always swap with low when seeing 0**: Ensures zeros are moved to correct position
- **The array is modified in-place**: No extra space needed

---

## Implementation

### Template Code (Sort Colors - Dutch National Flag)

````carousel
```python
def sort_colors(nums: list[int]) -> None:
    """
    Dutch National Flag - 3-way partition algorithm.
    
    Sorts an array containing only 0s, 1s, and 2s in-place in a single pass.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Args:
        nums: List containing only 0, 1, and 2 (modified in-place)
    
    Returns:
        None (modifies nums in place)
    
    Example:
        >>> nums = [2, 0, 2, 1, 1, 0]
        >>> sort_colors(nums)
        >>> print(nums)
        [0, 0, 1, 1, 2, 2]
    """
    if not nums or len(nums) <= 1:
        return
    
    low = 0      # All elements before low are 0s
    mid = 0      # Current element being processed
    high = len(nums) - 1  # All elements after high are 2s
    
    # Process until mid crosses high
    while mid <= high:
        if nums[mid] == 0:
            # Move 0 to the left section
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # 1 is already in correct partition, move forward
            mid += 1
        else:  # nums[mid] == 2
            # Move 2 to the right section
            # Don't increment mid - need to process swapped element
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1


# Alternative: Using indices explicitly
def sort_colors_explicit(nums: list[int]) -> list[int]:
    """Version with explicit index variables for clarity."""
    n = len(nums)
    if n <= 1:
        return nums
    
    low = 0      # Boundary for 0s
    mid = 0      # Current pointer
    high = n - 1  # Boundary for 2s
    
    while mid <= high:
        if nums[mid] == 0:
            # Swap and move both pointers
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # Already in middle section
            mid += 1
        else:  # nums[mid] == 2
            # Swap with high, don't increment mid
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    
    return nums


# Example usage and demonstration
if __name__ == "__main__":
    # Test case 1
    nums1 = [2, 0, 2, 1, 1, 0]
    sort_colors(nums1)
    print(f"Input: [2, 0, 2, 1, 1, 0]")
    print(f"Output: {nums1}")  # [0, 0, 1, 1, 2, 2]
    
    # Test case 2
    nums2 = [2, 1, 2, 1, 0, 2, 1]
    sort_colors(nums2)
    print(f"\nInput: [2, 1, 2, 1, 0, 2, 1]")
    print(f"Output: {nums2}")  # [0, 1, 1, 1, 2, 2, 2]
    
    # Test case 3: Already sorted
    nums3 = [0, 0, 1, 1, 2, 2]
    sort_colors(nums3)
    print(f"\nInput: [0, 0, 1, 1, 2, 2]")
    print(f"Output: {nums3}")  # [0, 0, 1, 1, 2, 2]
    
    # Test case 4: Reverse sorted
    nums4 = [2, 2, 1, 1, 0, 0]
    sort_colors(nums4)
    print(f"\nInput: [2, 2, 1, 1, 0, 0]")
    print(f"Output: {nums4}")  # [0, 0, 1, 1, 2, 2]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Dutch National Flag - 3-way partition algorithm.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Sorts an array containing only 0s, 1s, and 2s in-place.
 */
void sortColors(vector<int>& nums) {
    if (nums.size() <= 1) return;
    
    int low = 0;      // All elements before low are 0s
    int mid = 0;     // Current element being processed
    int high = nums.size() - 1;  // All elements after high are 2s
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            // Move 0 to the left section
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            // 1 is already in correct partition
            mid++;
        } else {  // nums[mid] == 2
            // Move 2 to the right section
            swap(nums[mid], nums[high]);
            high--;
            // Don't increment mid here - need to check swapped element
        }
    }
}

// Overloaded version returning sorted vector
vector<int> sortColorsCopy(vector<int> nums) {
    sortColors(nums);
    return nums;
}


int main() {
    // Test case 1
    vector<int> nums1 = {2, 0, 2, 1, 1, 0};
    sortColors(nums1);
    
    cout << "Test 1:" << endl;
    cout << "Input:  [2, 0, 2, 1, 1, 0]" << endl;
    cout << "Output: [";
    for (int i = 0; i < nums1.size(); i++) {
        cout << nums1[i];
        if (i < nums1.size() - 1) cout << ", ";
    }
    cout << "]" << endl << endl;
    
    // Test case 2
    vector<int> nums2 = {2, 1, 2, 1, 0, 2, 1};
    sortColors(nums2);
    
    cout << "Test 2:" << endl;
    cout << "Input:  [2, 1, 2, 1, 0, 2, 1]" << endl;
    cout << "Output: [";
    for (int i = 0; i < nums2.size(); i++) {
        cout << nums2[i];
        if (i < nums2.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Dutch National Flag - 3-way partition algorithm.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Sorts an array containing only 0s, 1s, and 2s in-place.
 */
public class DutchNationalFlag {
    
    /**
     * Sort array with only 0s, 1s, and 2s in-place.
     * 
     * @param nums Array containing only 0, 1, and 2 (modified in-place)
     */
    public static void sortColors(int[] nums) {
        if (nums == null || nums.length <= 1) {
            return;
        }
        
        int low = 0;           // All elements before low are 0s
        int mid = 0;           // Current element being processed
        int high = nums.length - 1;  // All elements after high are 2s
        
        while (mid <= high) {
            if (nums[mid] == 0) {
                // Move 0 to the left section
                swap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                // 1 is already in correct partition
                mid++;
            } else {  // nums[mid] == 2
                // Move 2 to the right section
                swap(nums, mid, high);
                high--;
                // Don't increment mid - need to process swapped element
            }
        }
    }
    
    /**
     * Helper method to swap two elements in an array.
     */
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    /**
     * Alternative version using three counters (counting sort approach).
     */
    public static void sortColorsCounting(int[] nums) {
        if (nums == null || nums.length <= 1) {
            return;
        }
        
        // Count occurrences
        int count0 = 0, count1 = 0, count2 = 0;
        for (int num : nums) {
            if (num == 0) count0++;
            else if (num == 1) count1++;
            else count2++;
        }
        
        // Rewrite array
        int index = 0;
        for (int i = 0; i < count0; i++) nums[index++] = 0;
        for (int i = 0; i < count1; i++) nums[index++] = 1;
        for (int i = 0; i < count2; i++) nums[index++] = 2;
    }
    
    
    public static void main(String[] args) {
        // Test case 1
        int[] nums1 = {2, 0, 2, 1, 1, 0};
        sortColors(nums1);
        System.out.print("Test 1: ");
        System.out.print("Input:  [2, 0, 2, 1, 1, 0] -> ");
        System.out.print("Output: [");
        for (int i = 0; i < nums1.length; i++) {
            System.out.print(nums1[i]);
            if (i < nums1.length - 1) System.out.print(", ");
        }
        System.out.println("]");
        
        // Test case 2
        int[] nums2 = {2, 1, 2, 1, 0, 2, 1};
        sortColors(nums2);
        System.out.print("Test 2: ");
        System.out.print("Input:  [2, 1, 2, 1, 0, 2, 1] -> ");
        System.out.print("Output: [");
        for (int i = 0; i < nums2.length; i++) {
            System.out.print(nums2[i]);
            if (i < nums2.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }
}
```

<!-- slide -->
```javascript
/**
 * Dutch National Flag - 3-way partition algorithm.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Sorts an array containing only 0s, 1s, and 2s in-place.
 * 
 * @param {number[]} nums - Array containing only 0, 1, and 2
 * @returns {number[]} - The sorted array (modified in place)
 */
function sortColors(nums) {
    if (!nums || nums.length <= 1) {
        return nums;
    }
    
    let low = 0;           // All elements before low are 0s
    let mid = 0;           // Current element being processed
    let high = nums.length - 1;  // All elements after high are 2s
    
    while (mid <= high) {
        if (nums[mid] === 0) {
            // Move 0 to the left section
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++;
            mid++;
        } else if (nums[mid] === 1) {
            // 1 is already in correct partition
            mid++;
        } else {  // nums[mid] === 2
            // Move 2 to the right section
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
            // Don't increment mid - need to process swapped element
        }
    }
    
    return nums;
}

/**
 * Alternative: Functional version returning new array
 */
function sortColorsCopy(nums) {
    const result = [...nums];
    sortColors(result);
    return result;
}


/**
 * Alternative: Using counting sort approach
 */
function sortColorsCounting(nums) {
    if (!nums || nums.length <= 1) {
        return nums;
    }
    
    // Count occurrences
    const count = [0, 0, 0];
    for (const num of nums) {
        count[num]++;
    }
    
    // Rewrite array
    let index = 0;
    for (let i = 0; i < count[0]; i++) nums[index++] = 0;
    for (let i = 0; i < count[1]; i++) nums[index++] = 1;
    for (let i = 0; i < count[2]; i++) nums[index++] = 2;
    
    return nums;
}


// Example usage and demonstration
console.log("Dutch National Flag Algorithm - Test Cases\n");

// Test case 1
const nums1 = [2, 0, 2, 1, 1, 0];
sortColors(nums1);
console.log(`Test 1: Input:  [2, 0, 2, 1, 1, 0]`);
console.log(`        Output: [${nums1.join(', ')}]`);
console.log(`        Expected: [0, 0, 1, 1, 2, 2]`);
console.log();

// Test case 2
const nums2 = [2, 1, 2, 1, 0, 2, 1];
sortColors(nums2);
console.log(`Test 2: Input:  [2, 1, 2, 1, 0, 2, 1]`);
console.log(`        Output: [${nums2.join(', ')}]`);
console.log(`        Expected: [0, 1, 1, 1, 2, 2, 2]`);
console.log();

// Test case 3: Already sorted
const nums3 = [0, 0, 1, 1, 2, 2];
sortColors(nums3);
console.log(`Test 3: Input:  [0, 0, 1, 1, 2, 2]`);
console.log(`        Output: [${nums3.join(', ')}]`);
console.log(`        Expected: [0, 0, 1, 1, 2, 2]`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Pass** | O(n) | Each element is processed at most once |
| **Swapping** | O(1) per swap | Constant time element exchange |
| **Overall** | O(n) | Single traversal through the array |

### Detailed Breakdown

- **Best Case**: O(n) - Even when array is already sorted, we still traverse once
- **Average Case**: O(n) - Same as best case, linear time
- **Worst Case**: O(n) - Even reverse sorted takes single pass
- **Why not O(n²)**: Each element is swapped at most once, never revisited

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **In-place sorting** | O(1) | Only three pointer variables used |
| **No extra array** | O(1) | Array is sorted without allocation |
| **Recursion stack** | O(1) | Iterative implementation |
| **Total** | O(1) | Constant extra space |

### Comparison with Other Approaches

| Algorithm | Extra Space |
|-----------|-------------|
| Dutch National Flag | O(1) ✓ |
| Counting Sort | O(k) where k = range |
| Built-in Sort | O(n) (for Timsort) |
| Merge Sort | O(n) |

---

## Common Variations

### 1. Dutch National Flag for K Colors

Extending the algorithm to handle more than 3 colors using multiple pointers:

````carousel
```python
def sort_k_colors(nums: list[int], k: int) -> None:
    """
    Extended Dutch National Flag for k distinct values.
    
    Time: O(n * k)  # Not optimal, but works
    Space: O(1)
    """
    if k <= 2:
        sort_colors(nums) if k == 2 else None
        return
    
    # For k > 2, use partition based approach
    # This is a simplified version
    counts = [0] * k
    for num in nums:
        counts[num] += 1
    
    idx = 0
    for val in range(k):
        for _ in range(counts[val]):
            nums[idx] = val
            idx += 1
```
````

### 2. Three-Way Quicksort Partition

The same principle used in quicksort to handle duplicate pivot values:

````carousel
```python
def three_way_partition(arr: list[int], pivot: int) -> list[int]:
    """
    Partition array around pivot into three sections:
    - Elements less than pivot
    - Elements equal to pivot  
    - Elements greater than pivot
    
    Used in 3-way quicksort (Dutch National Flag variant)
    """
    low = 0
    mid = 0
    high = len(arr) - 1
    
    while mid <= high:
        if arr[mid] < pivot:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == pivot:
            mid += 1
        else:
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1
    
    return arr
```
````

### 3. Partition by Multiple Criteria

Using the same three-pointer technique for complex partitioning:

````carousel
```python
def partition_negatives_first(arr: list[int]) -> list[int]:
    """
    Partition array so all negative numbers come before non-negatives.
    
    Similar to Dutch National Flag but with 2 categories.
    """
    low = 0
    mid = 0
    high = len(arr) - 1
    
    while mid <= high:
        if arr[mid] < 0:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        else:
            mid += 1
    
    return arr
```
````

---

## Practice Problems

### Problem 1: Sort Colors

**Problem:** [LeetCode 75 - Sort Colors](https://leetcode.com/problems/sort-colors/)

**Description:** Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

**How to Apply Dutch National Flag:**
- Use three pointers: low, mid, high
- Treat 0=red, 1=white, 2=blue
- Process each element exactly once
- Achieve O(n) time and O(1) space

**Solution:**
```python
def sortColors(nums):
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

---

### Problem 2: Partition Array into Two Arrays to Minimize Difference

**Problem:** [LeetCode 2034 - Partition Array into Two Arrays to Minimize Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-difference/)

**Description:** Given an integer array `nums` of size `n`, partition it into two groups (each group having at least one element) such that the difference between the sums of the two groups is minimized.

**How to Apply Dutch National Flag:**
- Sort the array first (DNF or built-in sort)
- Then use prefix sums to find minimum difference
- Works well when array has limited distinct values

---

### Problem 3: Find the Kth Smallest Element

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Given an integer array `nums` and an integer `k`, return the kth largest element in the array.

**How to Apply Dutch National Flag:**
- Use quickselect with 3-way partition
- Handle duplicates efficiently
- Average O(n) time complexity

---

### Problem 4: Wiggle Sort II

**Problem:** [LeetCode 324 - Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/)

**Description:** Given an unsorted array `nums`, reorder it in-place such that `nums[0] < nums[1] > nums[2] < nums[3]...`

**How to Apply Dutch National Flag:**
- First sort the array using Dutch National Flag (if 3 values)
- Then apply wiggle ordering
- Can be done in O(n) for specific value ranges

---

### Problem 5: Three Number Sort

**Problem:** [LeetCode 283 - Move Zeroes](https://leetcode.com/problems/move-zeroes/)

**Description:** Given an integer array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

**How to Apply Dutch National Flag:**
- Treat 0 and non-zeros as two categories
- Similar to Dutch National Flag with 2 values
- Single pass solution

---

## Video Tutorial Links

### Fundamentals

- [Dutch National Flag Algorithm - Code Demo (Take U Forward)](https://www.youtube.com/watch?v=oa0B13VIvjE) - Comprehensive explanation
- [Sort Colors - LeetCode 75 (NeetCode)](https://www.youtube.com/watch?v=4xbWSRZHqac) - Problem walkthrough
- [3-Way Partition (WilliamFiset)](https://www.youtube.com/watch?v=XYFK4x3yGfU) - Visual explanation

### Advanced Topics

- [Quicksort with 3-way Partition](https://www.youtube.com/watch?v=S0ZOKG7KUrA) - Advanced application
- [Dutch National Flag in Different Languages](https://www.youtube.com/watch?v=2E67lG3D4eU) - Implementation variations
- [Interview Problem Discussion](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Common interview questions

---

## Follow-up Questions

### Q1: Why don't we increment mid after swapping with high?

**Answer:** When we swap `nums[mid]` with `nums[high]`, the element from position `high` (which could be 0, 1, or 2) moves to position `mid`. This element hasn't been processed yet, so we need to check it again. If we increment `mid`, we might skip processing this element incorrectly.

### Q2: Can Dutch National Flag handle more than 3 values?

**Answer:** The classic Dutch National Flag algorithm is specifically designed for exactly 3 values. For k values, you can either:
1. Use counting sort (O(n + k) time, O(k) space)
2. Extend the algorithm with multiple partitions (complex)
3. Use quicksort with 3-way partition recursively

### Q3: What's the difference between Dutch National Flag and counting sort?

**Answer:** 
- **Dutch National Flag**: O(n) time, O(1) space, single pass, requires exactly 3 values
- **Counting Sort**: O(n + k) time, O(k) space, two passes, works for any range of values

### Q4: Is the algorithm stable?

**Answer:** The classic Dutch National Flag algorithm is **not stable** by default because it swaps elements. However, if stability is required, you can use a modified approach or use counting sort instead.

### Q5: How does this relate to quicksort?

**Answer:** Dutch National Flag is essentially the partition step of quicksort, but specifically optimized for handling three distinct values. In quicksort's 3-way partition variant, this same technique is used to separate elements less than, equal to, and greater than the pivot, which is particularly effective when there are many duplicate values.

---

## Summary

The **Dutch National Flag** algorithm is an elegant solution for sorting arrays with exactly **three distinct values** in a **single pass**. Key takeaways:

- **Single pass**: O(n) time complexity, each element processed at most once
- **In-place**: O(1) extra space, no additional data structures needed
- **Three pointers**: low, mid, and high partition the array into four sections
- **Versatile**: The same technique applies to quicksort's 3-way partition
- **Elegant**: Simple logic that handles edge cases gracefully

When to use:
- ✅ Sorting arrays with exactly 3 distinct values
- ✅ Problems requiring single-pass partitioning
- ✅ Scenarios needing O(1) extra space
- ❌ More than 3 distinct values (use counting sort or quicksort)
- ❌ When stability is required (use counting sort)

This algorithm is a fundamental technique in competitive programming and technical interviews, frequently appearing in problems like "Sort Colors" (LeetCode 75). Understanding the three-pointer approach opens the door to solving many similar partitioning problems efficiently.

---

## Related Algorithms

- [Two Pointers](./two-pointers.md) - Related technique
- [Quicksort](./quicksort.md) - Uses similar partitioning
- [Counting Sort](./counting-sort.md) - Alternative for limited range
- [Bucket Sort](./bucket-sort.md) - Generalization of counting sort
