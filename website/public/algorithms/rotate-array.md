# Rotate Array In-Place

## Category
Arrays & Strings

## Description

The Rotate Array problem requires rotating an array to the right by `k` positions **in-place** (without using extra space). This is a fundamental array manipulation technique commonly used in technical interviews and competitive programming. The most efficient solution uses the **reversal algorithm** to achieve O(n) time complexity with O(1) extra space.

---

## When to Use

Use the Rotate Array algorithm when you need to solve problems involving:

- **Array rotation**: Shifting elements left or right by a specified number of positions
- **In-place manipulation**: When space constraints prohibit creating a copy of the array
- **Cyclic permutations**: Problems requiring circular shifting of elements
- **String rotation**: Similar logic applies to rotating characters in strings

### Comparison of Approaches

| Approach | Time Complexity | Space Complexity | When to Use |
|----------|----------------|------------------|-------------|
| **Reversal Method** | O(n) | O(1) | ✅ Best for in-place rotation |
| **Extra Array** | O(n) | O(n) | When you can use extra space |
| **Cyclic Replacements** | O(n) | O(1) | Alternative in-place method |
| **Juggling Algorithm** | O(n) | O(1) | For left rotation by GCD approach |

### When to Choose Each Approach

- **Choose Reversal Method** when:
  - You need O(1) extra space
  - Code simplicity is preferred
  - Rotating to the right

- **Choose Extra Array** when:
  - Space is not a constraint
  - You need the simplest implementation
  - Working with immutable data structures

- **Choose Cyclic Replacements** when:
  - You want an alternative to reversal
  - Understanding element movement is important

---

## Algorithm Explanation

### Core Concept

The key insight behind the reversal algorithm is that rotating an array can be decomposed into three reversal operations:

1. **Reverse the entire array** - This brings the last k elements to the front (in reverse order)
2. **Reverse the first k elements** - This restores the correct order for the rotated portion
3. **Reverse the remaining n-k elements** - This restores the correct order for the rest

### How It Works

#### Mathematical Foundation:

For an array of n elements rotated by k positions:
- After full reversal: Elements are in reverse order
- After reversing first k: The k elements that should be at the beginning are now correctly ordered
- After reversing the rest: The remaining n-k elements are also correctly ordered

#### Visual Representation:

For array `[1, 2, 3, 4, 5, 6, 7]` with k = 3:

```
Original:     [1, 2, 3, 4, 5, 6, 7]
                 ↑     ↑
               front   back

Step 1 - Reverse all:
              [7, 6, 5, 4, 3, 2, 1]
               ↑↑↑         ↑↑↑↑
              (back)      (front)

Step 2 - Reverse first k (3):
              [5, 6, 7, 4, 3, 2, 1]
               ↑↑↑
            (now correct)

Step 3 - Reverse remaining n-k (4):
              [5, 6, 7, 1, 2, 3, 4] ✓
                     ↑↑↑↑
                  (now correct)
```

### Why This Works

The three reversals effectively "cycle" elements to their correct positions:
- Full reversal puts the last k elements at the front (but reversed)
- First k reversal fixes the order of those elements
- Remaining reversal fixes the order of the other elements

### Edge Cases

- **k = 0**: No rotation needed, array stays the same
- **k >= n**: Use `k = k % n` to handle rotations larger than array size
- **k % n = 0**: Full rotation returns original array
- **Empty array or single element**: Nothing to rotate

---

## Algorithm Steps

### Reversal Method (Recommended)

1. **Handle edge case**: If k is 0 or array is empty, return immediately
2. **Normalize k**: Calculate `k = k % n` to handle k >= n
3. **Reverse entire array**: Reverse elements from index 0 to n-1
4. **Reverse first k elements**: Reverse elements from index 0 to k-1
5. **Reverse remaining elements**: Reverse elements from index k to n-1

### Cyclic Replacements Method (Alternative)

1. **Normalize k**: Calculate `k = k % n`
2. **Initialize**: Set count = 0 (tracks elements placed), start = 0
3. **Outer loop**: While count < n, process cycles starting from `start`
4. **Inner loop**: Move elements in cycles of k positions until returning to start
5. **Increment start**: Move to next starting position for next cycle

---

## Implementation

### Reversal Algorithm (Recommended)

````carousel
```python
def rotate(nums, k):
    """
    Rotate array to the right by k positions using reversal algorithm.
    
    Args:
        nums: List of integers to rotate (modified in-place)
        k: Number of positions to rotate right
    
    Time Complexity: O(n) - each element is moved twice (constant work)
    Space Complexity: O(1) - only uses a few variables
    """
    n = len(nums)
    if n <= 1:
        return
    
    # Normalize k to handle k >= n
    k = k % n
    if k == 0:
        return
    
    def reverse(start, end):
        """Reverse elements in nums from start to end (inclusive)."""
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    # Step 1: Reverse the entire array
    # This brings the last k elements to the front (in reverse order)
    reverse(0, n - 1)
    
    # Step 2: Reverse first k elements
    # This restores the correct order for the rotated portion
    reverse(0, k - 1)
    
    # Step 3: Reverse remaining n-k elements
    # This restores the correct order for the rest
    reverse(k, n - 1)


# Example usage and demonstration
if __name__ == "__main__":
    # Example 1
    arr1 = [1, 2, 3, 4, 5, 6, 7]
    k1 = 3
    print(f"Original: {arr1}")
    print(f"Rotate by k={k1}")
    rotate(arr1, k1)
    print(f"Result:   {arr1}")
    print()
    
    # Example 2 - k > n
    arr2 = [1, 2]
    k2 = 3
    print(f"Original: {arr2}")
    print(f"Rotate by k={k2} (k > n, so k % n = {k2 % len(arr2)})")
    rotate(arr2, k2)
    print(f"Result:   {arr2}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Rotate array to the right by k positions using reversal algorithm.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        if (n <= 1) return;
        
        // Normalize k to handle k >= n
        k = k % n;
        if (k == 0) return;
        
        // Step 1: Reverse entire array
        reverse(nums, 0, n - 1);
        
        // Step 2: Reverse first k elements
        reverse(nums, 0, k - 1);
        
        // Step 3: Reverse remaining n-k elements
        reverse(nums, k, n - 1);
    }
    
private:
    void reverse(vector<int>& nums, int start, int end) {
        while (start < end) {
            swap(nums[start], nums[end]);
            start++;
            end--;
        }
    }
};

// Example usage
int main() {
    Solution sol;
    
    // Example 1
    vector<int> arr1 = {1, 2, 3, 4, 5, 6, 7};
    int k1 = 3;
    
    cout << "Original: ";
    for (int x : arr1) cout << x << " ";
    cout << "\nRotate by k=" << k1 << endl;
    
    sol.rotate(arr1, k1);
    
    cout << "Result:   ";
    for (int x : arr1) cout << x << " ";
    cout << endl << endl;
    
    // Example 2
    vector<int> arr2 = {-1, -100, 3, 99};
    int k2 = 2;
    
    cout << "Original: ";
    for (int x : arr2) cout << x << " ";
    cout << "\nRotate by k=" << k2 << endl;
    
    sol.rotate(arr2, k2);
    
    cout << "Result:   ";
    for (int x : arr2) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Rotate array to the right by k positions using reversal algorithm.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
public class RotateArray {
    
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        if (n <= 1) return;
        
        // Normalize k to handle k >= n
        k = k % n;
        if (k == 0) return;
        
        // Step 1: Reverse entire array
        reverse(nums, 0, n - 1);
        
        // Step 2: Reverse first k elements
        reverse(nums, 0, k - 1);
        
        // Step 3: Reverse remaining n-k elements
        reverse(nums, k, n - 1);
    }
    
    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
    
    // Alternative: Using extra array (for reference)
    public void rotateWithExtraArray(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n];
        
        for (int i = 0; i < n; i++) {
            result[(i + k) % n] = nums[i];
        }
        
        // Copy back to original array
        System.arraycopy(result, 0, nums, 0, n);
    }
    
    public static void main(String[] args) {
        RotateArray solution = new RotateArray();
        
        // Example 1
        int[] arr1 = {1, 2, 3, 4, 5, 6, 7};
        int k1 = 3;
        
        System.out.println("Original: " + Arrays.toString(arr1));
        System.out.println("Rotate by k=" + k1);
        solution.rotate(arr1, k1);
        System.out.println("Result:   " + Arrays.toString(arr1));
        System.out.println();
        
        // Example 2
        int[] arr2 = {-1, -100, 3, 99};
        int k2 = 2;
        
        System.out.println("Original: " + Arrays.toString(arr2));
        System.out.println("Rotate by k=" + k2);
        solution.rotate(arr2, k2);
        System.out.println("Result:   " + Arrays.toString(arr2));
    }
}
```

<!-- slide -->
```javascript
/**
 * Rotate array to the right by k positions using reversal algorithm.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param {number[]} nums - Array to rotate (modified in-place)
 * @param {number} k - Number of positions to rotate right
 */
function rotate(nums, k) {
    const n = nums.length;
    if (n <= 1) return;
    
    // Normalize k to handle k >= n
    k = k % n;
    if (k === 0) return;
    
    // Helper function to reverse array slice
    function reverse(start, end) {
        while (start < end) {
            [nums[start], nums[end]] = [nums[end], nums[start]];
            start++;
            end--;
        }
    }
    
    // Step 1: Reverse entire array
    reverse(0, n - 1);
    
    // Step 2: Reverse first k elements
    reverse(0, k - 1);
    
    // Step 3: Reverse remaining n-k elements
    reverse(k, n - 1);
}

// Alternative: Using extra array
function rotateWithExtraArray(nums, k) {
    const n = nums.length;
    const result = new Array(n);
    
    for (let i = 0; i < n; i++) {
        result[(i + k) % n] = nums[i];
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
        nums[i] = result[i];
    }
}

// Example usage
console.log("=== Rotate Array Examples ===\n");

// Example 1
let arr1 = [1, 2, 3, 4, 5, 6, 7];
let k1 = 3;
console.log("Example 1:");
console.log("Original:", arr1);
console.log("Rotate by k =", k1);
rotate(arr1, k1);
console.log("Result:  ", arr1);
console.log();

// Example 2
let arr2 = [-1, -100, 3, 99];
let k2 = 2;
console.log("Example 2:");
console.log("Original:", arr2);
console.log("Rotate by k =", k2);
rotate(arr2, k2);
console.log("Result:  ", arr2);
console.log();

// Example 3 - k > n
let arr3 = [1, 2];
let k3 = 3;
console.log("Example 3 (k > n):");
console.log("Original:", arr3);
console.log("Rotate by k =", k3, "(k % n =", k3 % arr3.length + ")");
rotate(arr3, k3);
console.log("Result:  ", arr3);
```
````

---

## Example

**Input:**
```
nums = [1, 2, 3, 4, 5, 6, 7]
k = 3
```

**Step-by-Step Execution:**
```
Original:           [1, 2, 3, 4, 5, 6, 7]
Reverse all:        [7, 6, 5, 4, 3, 2, 1]
Reverse first 3:    [5, 6, 7, 4, 3, 2, 1]
Reverse last 4:     [5, 6, 7, 1, 2, 3, 4] ✓
```

**Output:**
```
nums = [5, 6, 7, 1, 2, 3, 4]
```

---

**Input:**
```
nums = [-1, -100, 3, 99]
k = 2
```

**Step-by-Step Execution:**
```
Original:           [-1, -100, 3, 99]
Reverse all:        [99, 3, -100, -1]
Reverse first 2:    [3, 99, -100, -1]
Reverse last 2:     [3, 99, -1, -100] ✓
```

**Output:**
```
nums = [3, 99, -1, -100]
```

---

**Input:**
```
nums = [1, 2]
k = 3
```

**Step-by-Step Execution:**
```
k = 3 % 2 = 1 (normalize)
Original:           [1, 2]
Reverse all:        [2, 1]
Reverse first 1:    [2, 1] (no change)
Reverse last 1:     [2, 1] (no change)
Final:              [2, 1] ✓
```

**Output:**
```
nums = [2, 1]
```

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Full Reversal** | O(n) | Visit each element once |
| **First k Reversal** | O(k) | Visit first k elements |
| **Remaining Reversal** | O(n-k) | Visit remaining n-k elements |
| **Total** | **O(n)** | Sum is O(n) + O(k) + O(n-k) = O(2n) = O(n) |

### Detailed Breakdown

The reversal algorithm makes three passes over the array:

1. **First pass (reverse all)**: n/2 swaps for n elements
2. **Second pass (reverse first k)**: k/2 swaps
3. **Third pass (reverse remaining)**: (n-k)/2 swaps

**Total operations**: n/2 + k/2 + (n-k)/2 = n swaps

Each swap is O(1), so total time is O(n).

### Comparison with Other Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Reversal | O(n) | O(1) | ✅ Optimal for in-place |
| Extra Array | O(n) | O(n) | Simple but uses more space |
| Cyclic Replacements | O(n) | O(1) | Same complexity, different approach |

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Input Array** | O(1)* | Modified in-place (not counted as extra) |
| **Temporary Variables** | O(1) | Only uses indices and swap temp |
| **Total Extra Space** | **O(1)** | Constant extra space |

*Note: The input array is modified in-place, so we don't count it as extra space used by the algorithm.*

### Space Breakdown

The reversal algorithm uses only:
- Two index variables (`start`, `end`) - O(1)
- One temporary variable for swapping - O(1)

This makes it ideal for memory-constrained environments.

---

## Common Variations

### 1. Left Rotation

To rotate left by k positions, simply adjust the order of reversals:

````carousel
```python
def rotate_left(nums, k):
    """Rotate array to the left by k positions."""
    n = len(nums)
    if n <= 1:
        return
    
    k = k % n
    if k == 0:
        return
    
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    # For left rotation: reverse(n-k), reverse(0, n-k-1), reverse(n-k, n-1)
    # Or equivalently: reverse(k, n-1), reverse(0, k-1), reverse(0, n-1)
    reverse(0, k - 1)        # Reverse first k
    reverse(k, n - 1)        # Reverse remaining
    reverse(0, n - 1)        # Reverse all

# Example
arr = [1, 2, 3, 4, 5, 6, 7]
rotate_left(arr, 3)
print(arr)  # [4, 5, 6, 7, 1, 2, 3]
```
````

### 2. Cyclic Replacements

Alternative O(1) space approach using cyclic element movement:

````carousel
```python
def rotate_cyclic(nums, k):
    """
    Rotate using cyclic replacements.
    Each element is placed directly in its final position.
    """
    n = len(nums)
    if n <= 1:
        return
    
    k = k % n
    if k == 0:
        return
    
    count = 0  # Number of elements placed correctly
    start = 0  # Starting position for current cycle
    
    while count < n:
        current = start
        prev = nums[start]
        
        # Follow the cycle
        while True:
            next_idx = (current + k) % n
            temp = nums[next_idx]
            nums[next_idx] = prev
            prev = temp
            current = next_idx
            count += 1
            
            if current == start:
                break
        
        start += 1

# Example
arr = [1, 2, 3, 4, 5, 6, 7]
rotate_cyclic(arr, 3)
print(arr)  # [5, 6, 7, 1, 2, 3, 4]
```
````

### 3. String Rotation

The same algorithm applies to strings (convert to list first):

````carousel
```python
def rotate_string(s, k):
    """Rotate string to the right by k positions."""
    chars = list(s)
    n = len(chars)
    
    if n <= 1:
        return s
    
    k = k % n
    if k == 0:
        return s
    
    def reverse(start, end):
        while start < end:
            chars[start], chars[end] = chars[end], chars[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
    
    return ''.join(chars)

# Example
s = "hello"
result = rotate_string(s, 2)
print(result)  # "lohel"
```
````

### 4. Block Swap Algorithm (Juggling)

Another O(1) space approach for left rotation:

````carousel
```python
import math

def rotate_left_juggling(arr, k):
    """Rotate left using juggling algorithm."""
    n = len(arr)
    if n == 0:
        return
    
    k = k % n
    if k == 0:
        return
    
    gcd_val = math.gcd(k, n)
    
    for i in range(gcd_val):
        temp = arr[i]
        j = i
        
        while True:
            next_idx = (j + k) % n
            if next_idx == i:
                break
            arr[j] = arr[next_idx]
            j = next_idx
        
        arr[j] = temp

# Example
arr = [1, 2, 3, 4, 5, 6, 7]
rotate_left_juggling(arr, 2)
print(arr)  # [3, 4, 5, 6, 7, 1, 2]
```
````

---

## Practice Problems

### Problem 1: Rotate Array

**Problem:** [LeetCode 189 - Rotate Array](https://leetcode.com/problems/rotate-array/)

**Description:** Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.

**How to Apply:** Use the reversal algorithm for O(n) time and O(1) space solution.

---

### Problem 2: Rotate String

**Problem:** [LeetCode 796 - Rotate String](https://leetcode.com/problems/rotate-string/)

**Description:** Given two strings `s` and `goal`, return `true` if and only if `s` can become `goal` after some number of shifts on `s`.

**How to Apply:** Check if `goal` is a substring of `s + s` and has the same length.

---

### Problem 3: Reverse Words in a String II

**Problem:** [LeetCode 186 - Reverse Words in a String II](https://leetcode.com/problems/reverse-words-in-a-string-ii/)

**Description:** Given a character array `s`, reverse the order of the words. A word is defined as a sequence of non-space characters.

**How to Apply:** Similar to rotation - reverse entire string, then reverse each word individually.

---

### Problem 4: Rotate List

**Problem:** [LeetCode 61 - Rotate List](https://leetcode.com/problems/rotate-list/)

**Description:** Given the head of a linked list, rotate the list to the right by `k` places.

**How to Apply:** Connect tail to head to form a cycle, then find new tail position and break the cycle.

---

### Problem 5: Circular Array Loop

**Problem:** [LeetCode 457 - Circular Array Loop](https://leetcode.com/problems/circular-array-loop/)

**Description:** You are playing a game involving a circular array of non-zero integers. Determine if there is a cycle in the array.

**How to Apply:** Use slow/fast pointer technique with modular arithmetic (similar concepts to rotation).

---

## Video Tutorial Links

### Fundamentals

- [Rotate Array - LeetCode 189 (NeetCode)](https://www.youtube.com/watch?v=BQgdHw5xXns) - Step-by-step explanation of reversal algorithm
- [Array Rotation Methods (Take U Forward)](https://www.youtube.com/watch?v=8RErc0VXAo8) - All approaches explained with code
- [Rotate Array In-Place (Nick White)](https://www.youtube.com/watch?v=ZaiusRln1Vw) - Visual explanation with examples

### Advanced Topics

- [Cyclic Sort Pattern (NeetCode)](https://www.youtube.com/watch?v=JfinxytTYFQ) - Related pattern for array manipulation
- [Array Manipulation Techniques (Back To Back SWE)](https://www.youtube.com/watch?v=2QCn9MUy9wA) - Comprehensive array techniques
- [In-Place Array Algorithms (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=SU38yzA-LkI) - Space optimization strategies

---

## Follow-up Questions

### Q1: Why does the reversal algorithm work? Can you prove it mathematically?

**Answer:** 

Let's prove that three reversals produce a right rotation by k:

For an array `A` of n elements, we want: `A[k], A[k+1], ..., A[n-1], A[0], A[1], ..., A[k-1]`

1. **After reverse all**: `A[n-1], A[n-2], ..., A[0]`
2. **After reverse first k**: `A[k], A[k+1], ..., A[n-1], A[0], A[1], ..., A[k-1]` ✓

The last n-k elements were at the front (reversed), then we reversed them back to correct order.
The first k elements were at the back (reversed), then we reversed them back to correct order.

### Q2: What if the array contains duplicate elements? Does the algorithm still work?

**Answer:** 

Yes! The reversal algorithm works regardless of element values. It only manipulates positions, not values. Duplicates, negatives, zeros - all are handled correctly because we're just swapping elements based on indices.

### Q3: Can we use this algorithm for 2D array rotation?

**Answer:** 

For 2D arrays, rotation is more complex:
- **Layer-by-layer rotation**: Rotate elements in concentric layers
- **Transpose + Reverse**: Transpose matrix, then reverse rows (for 90° rotation)

The simple reversal trick doesn't directly apply, but similar concepts of position manipulation are used.

### Q4: What is the maximum value of k that the algorithm can handle?

**Answer:** 

The algorithm can handle any non-negative integer k because we normalize with `k = k % n`. 

- k = 0 to n-1: Direct rotation
- k >= n: Reduced to equivalent k % n
- Very large k (e.g., 10^18): Still O(1) to normalize, then O(n) to rotate

### Q5: How does cyclic replacements compare to reversal in practice?

**Answer:** 

| Aspect | Reversal | Cyclic Replacements |
|--------|----------|---------------------|
| **Code simplicity** | Simpler | More complex |
| **Cache efficiency** | Better (sequential access) | Worse (jumping around) |
| **Number of writes** | n (each element moved twice) | n (each element moved once) |
| **Practical speed** | Faster on modern CPUs | Slightly slower |

Both are O(n) time and O(1) space, but reversal is generally preferred for its simplicity and cache-friendly access pattern.

---

## Summary

The Rotate Array problem demonstrates elegant use of reversals to achieve in-place array rotation. Key takeaways:

- **Three reversals**: Full → First k → Remaining produces the rotated array
- **O(n) time, O(1) space**: Optimal for in-place modification
- **Normalize k**: Always use `k = k % n` to handle k >= n
- **Versatile pattern**: Applies to strings, lists, and other sequential data structures

When to use:
- ✅ In-place rotation required
- ✅ Space complexity must be O(1)
- ✅ Simple, efficient implementation needed
- ❌ When you need to preserve the original array (use extra array approach)

This algorithm is essential for technical interviews and competitive programming, appearing frequently in array manipulation problems.

---

## Related Algorithms

- [Cyclic Sort](./cyclic-sort.md) - Similar array manipulation pattern
- [Two Pointers](./two-pointers.md) - Related technique for array operations
- [Sliding Window](./sliding-window.md) - Array traversal pattern
- [Reverse Linked List](./reverse-linked-list.md) - Similar reversal concept for linked structures
