# Longest Increasing Subsequence

## Category
Dynamic Programming

## Description
The Longest Increasing Subsequence (LIS) problem finds the length of the longest subsequence where all elements are in strictly increasing order. The key insight is using binary search to achieve O(n log n) time complexity.

The algorithm maintains a sorted list (using binary search) of the smallest possible tail values for increasing subsequences of different lengths:
- For each element, find its position in the tails array using binary search
- If it's larger than all elements, append it (we found a longer LIS)
- Otherwise, replace the first element that's >= it (improving the smallest tail for that length)

This works because:
- The tails array always stays sorted
- Each position in tails represents the smallest tail for an increasing subsequence of that length
- Binary search gives O(log n) for each element lookup

---

## When to Use

Use the LIS algorithm when you need to solve problems involving:

- **Finding Longest Increasing Subsequence**: The classic problem of finding the longest strictly increasing subsequence in an array
- **Envelope嵌套问题**: Problems involving nesting or包裹 (Russian Doll Envelopes)
- **Patience Sorting**: Similar to the card game patience sorting
- **Building Towers**: Problems about building structures with height constraints
- **Optimization with Increasing Order**: Any problem requiring the longest sequence with increasing property

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| **Naive DP** | O(n²) | O(n) | Small arrays, when actual sequence needed |
| **Binary Search + Tails** | O(n log n) | O(n) | Large arrays, length only |
| **Segment Tree** | O(n log n) | O(n) | When range queries needed |
| **Fenwick Tree** | O(n log n) | O(n) | Coordinate compression needed |

### When to Choose Which Approach

- **Choose Binary Search (O(n log n))** when:
  - You only need the length of LIS
  - Array size is large (n > 10⁴)
  - Time efficiency is critical

- **Choose Naive DP (O(n²))** when:
  - You need to reconstruct the actual subsequence
  - Array is very small (n < 10³)
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind the efficient LIS algorithm is maintaining a **tails array** where `tails[i]` represents the smallest possible tail value for an increasing subsequence of length `i+1`. This array is always sorted, allowing us to use binary search for efficient lookups.

### How It Works

#### Processing Phase:
1. **Initialize**: Create an empty `tails` array
2. **Iterate**: For each element in the input array:
   - Use binary search (`bisect_left`) to find the position where the current element should go
   - If the position equals the current length of `tails`, append the element (we found a longer LIS)
   - Otherwise, replace the element at that position (we found a better tail for that length)
3. **Result**: The length of `tails` equals the length of LIS

#### Why This Works (Proof Sketch):

The invariant maintained is: `tails[i]` is the smallest possible tail value for any increasing subsequence of length `i+1`.

- **If we append**: The new element is larger than all elements in `tails`, meaning we found a subsequence of length `len(tails) + 1`
- **If we replace**: We're improving the minimum tail for that length, which can only help future elements (smaller tail = more flexibility)

### Visual Representation

For array `[10, 9, 2, 5, 3, 7, 101, 18]`:

```
Processing 10: tails = [10]
Processing 9:  tails = [9]      (replace 10)
Processing 2:  tails = [2]      (replace 9)
Processing 5:  tails = [2, 5]   (append)
Processing 3:  tails = [2, 3]   (replace 5)
Processing 7:  tails = [2, 3, 7] (append)
Processing 101: tails = [2, 3, 7, 101] (append)
Processing 18: tails = [2, 3, 7, 18]  (replace 101)

LIS Length: 4
```

### Important Distinctions

- **Strictly Increasing**: Uses `bisect_left` (finds first element >= value)
- **Non-decreasing**: Use `bisect_right` (finds first element > value)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize empty tails array**: This will store the smallest possible tail for each subsequence length
2. **For each element in the input array**:
   - Find the position using binary search (`bisect_left` for strictly increasing)
   - If position equals tails length, append (found longer subsequence)
   - Otherwise, replace at position (optimize future possibilities)
3. **Return the length of tails array**: This is the LIS length

### Reconstructing the Actual Sequence

To get the actual subsequence (not just the length):
1. Maintain an additional array to track predecessors
2. Track which position each element occupies in tails
3. Backtrack from the end to reconstruct the sequence

---

## Implementation

### Template Code (Binary Search Approach)

````carousel
```python
import bisect
from typing import List, Tuple

def length_of_lis(nums: List[int]) -> int:
    """
    Find the length of the longest increasing subsequence.
    Uses binary search optimization for O(n log n) time.
    
    Args:
        nums: List of integers
        
    Returns:
        Length of the longest increasing subsequence
        
    Time: O(n log n)
    Space: O(n)
    """
    if not nums:
        return 0
    
    # tails[i] = smallest tail for increasing subsequence of length i+1
    tails = []
    
    for num in nums:
        # Find position to insert/replace using binary search
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            # num is larger than all elements, extend the sequence
            tails.append(num)
        else:
            # Replace to maintain smallest possible tail
            tails[pos] = num
    
    return len(tails)


def length_of_lis_non_decreasing(nums: List[int]) -> int:
    """
    Find the length of the longest non-decreasing subsequence.
    Uses bisect_right for non-strictly increasing.
    
    Time: O(n log n)
    Space: O(n)
    """
    if not nums:
        return 0
    
    tails = []
    
    for num in nums:
        pos = bisect.bisect_right(tails, num)  # Note: bisect_right
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)


def lis_with_binary_search(nums: List[int]) -> Tuple[int, List[int]]:
    """
    Find LIS length and one actual LIS sequence.
    
    Args:
        nums: List of integers
        
    Returns:
        Tuple of (length, lis_sequence)
        
    Time: O(n log n)
    Space: O(n)
    """
    if not nums:
        return 0, []
    
    # For tracking the actual sequence
    # tails[i] = smallest tail for LIS of length i+1
    tails = []
    # Track the predecessor index for reconstruction
    prev = [-1] * len(nums)
    # Track which position each element occupies in tails
    indices = []
    
    for i, num in enumerate(nums):
        pos = bisect.bisect_left(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
        
        indices.append(pos)
        
        if pos > 0:
            # Find the previous element
            for j in range(i - 1, -1, -1):
                if indices[j] == pos - 1 and nums[j] < num:
                    prev[i] = j
                    break
    
    # Reconstruct the LIS
    lis_length = len(tails)
    lis = []
    # Find the last element
    for i in range(len(nums) - 1, -1, -1):
        if indices[i] == lis_length - 1:
            curr = i
            break
    
    while curr != -1:
        lis.append(nums[curr])
        curr = prev[curr]
    
    return lis_length, list(reversed(lis))


# Example usage
if __name__ == "__main__":
    # Test case 1
    nums = [10, 9, 2, 5, 3, 7, 101, 18]
    length = length_of_lis(nums)
    print(f"Array: {nums}")
    print(f"LIS Length: {length}")  # Output: 4
    # Possible LIS: [2, 3, 7, 101] or [2, 5, 7, 101] or [2, 3, 7, 18]
    
    # Test case 2
    nums = [0, 1, 0, 3, 2, 3]
    length = length_of_lis(nums)
    print(f"\nArray: {nums}")
    print(f"LIS Length: {length}")  # Output: 4
    # LIS: [0, 1, 2, 3]
    
    # Test case 3
    nums = [7, 7, 7, 7, 7, 7, 7]
    length = length_of_lis(nums)
    print(f"\nArray: {nums}")
    print(f"LIS Length: {length}")  # Output: 1 (strictly increasing)
    
    # Test case 4 - Get actual sequence
    nums = [10, 9, 2, 5, 3, 7, 101, 18]
    length, sequence = lis_with_binary_search(nums)
    print(f"\nArray: {nums}")
    print(f"LIS Length: {length}, LIS: {sequence}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Longest Increasing Subsequence using binary search.
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
class LIS {
public:
    /**
     * Find the length of the longest increasing subsequence.
     */
    static int lengthOfLIS(const vector<int>& nums) {
        if (nums.empty()) return 0;
        
        vector<int> tails;  // tails[i] = smallest tail for LIS of length i+1
        
        for (int num : nums) {
            // Find position using binary search
            auto it = lower_bound(tails.begin(), tails.end(), num);
            
            if (it == tails.end()) {
                // num is larger than all elements, extend the sequence
                tails.push_back(num);
            } else {
                // Replace to maintain smallest possible tail
                *it = num;
            }
        }
        
        return tails.size();
    }
    
    /**
     * Find the length of the longest non-decreasing subsequence.
     * Use upper_bound instead of lower_bound.
     */
    static int lengthOfLNDS(const vector<int>& nums) {
        if (nums.empty()) return 0;
        
        vector<int> tails;
        
        for (int num : nums) {
            auto it = upper_bound(tails.begin(), tails.end(), num);
            
            if (it == tails.end()) {
                tails.push_back(num);
            } else {
                *it = num;
            }
        }
        
        return tails.size();
    }
    
    /**
     * Find both length and one actual LIS sequence.
     */
    static pair<int, vector<int>> lisWithSequence(const vector<int>& nums) {
        if (nums.empty()) return {0, {}};
        
        int n = nums.size();
        vector<int> tails;
        vector<int> prev(n, -1);      // Predecessor index
        vector<int> indices(n, -1);   // Position in tails
        
        for (int i = 0; i < n; i++) {
            int num = nums[i];
            auto it = lower_bound(tails.begin(), tails.end(), num);
            
            int pos = it - tails.begin();
            
            if (it == tails.end()) {
                tails.push_back(num);
            } else {
                *it = num;
            }
            
            indices[i] = pos;
            
            if (pos > 0) {
                // Find predecessor
                for (int j = i - 1; j >= 0; j--) {
                    if (indices[j] == pos - 1 && nums[j] < num) {
                        prev[i] = j;
                        break;
                    }
                }
            }
        }
        
        // Reconstruct LIS
        int lisLength = tails.size();
        vector<int> lis;
        
        // Find the last element
        int curr = -1;
        for (int i = n - 1; i >= 0; i--) {
            if (indices[i] == lisLength - 1) {
                curr = i;
                break;
            }
        }
        
        while (curr != -1) {
            lis.push_back(nums[curr]);
            curr = prev[curr];
        }
        
        reverse(lis.begin(), lis.end());
        return {lisLength, lis};
    }
};

int main() {
    // Test case 1
    vector<int> nums1 = {10, 9, 2, 5, 3, 7, 101, 18};
    cout << "Array: [10, 9, 2, 5, 3, 7, 101, 18]" << endl;
    cout << "LIS Length: " << LIS::lengthOfLIS(nums1) << endl;  // Output: 4
    
    // Test case 2
    vector<int> nums2 = {0, 1, 0, 3, 2, 3};
    cout << "\nArray: [0, 1, 0, 3, 2, 3]" << endl;
    cout << "LIS Length: " << LIS::lengthOfLIS(nums2) << endl;  // Output: 4
    
    // Test case 3 - Get actual sequence
    auto [len, seq] = LIS::lisWithSequence(nums1);
    cout << "\nArray: [10, 9, 2, 5, 3, 7, 101, 18]" << endl;
    cout << "LIS Length: " << len << ", LIS: ";
    for (int x : seq) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Longest Increasing Subsequence using binary search.
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */
public class LIS {
    
    /**
     * Find the length of the longest increasing subsequence.
     */
    public static int lengthOfLIS(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        
        // tails[i] = smallest tail for LIS of length i+1
        int[] tails = new int[nums.length];
        int size = 0;  // Current size of tails
        
        for (int num : nums) {
            // Binary search for position
            int pos = binarySearch(tails, 0, size, num);
            
            if (pos == size) {
                // num is larger than all elements, extend
                tails[size++] = num;
            } else {
                // Replace to maintain smallest tail
                tails[pos] = num;
            }
        }
        
        return size;
    }
    
    /**
     * Binary search for first element >= target in range [0, hi).
     */
    private static int binarySearch(int[] arr, int lo, int hi, int target) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] >= target) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
    
    /**
     * Find the length of the longest non-decreasing subsequence.
     */
    public static int lengthOfLNDS(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        
        int[] tails = new int[nums.length];
        int size = 0;
        
        for (int num : nums) {
            // Use upper bound (first > target)
            int pos = upperBound(tails, 0, size, num);
            
            if (pos == size) {
                tails[size++] = num;
            } else {
                tails[pos] = num;
            }
        }
        
        return size;
    }
    
    private static int upperBound(int[] arr, int lo, int hi, int target) {
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr[mid] > target) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
    
    /**
     * Find both length and one actual LIS sequence.
     */
    public static int[] lisWithSequence(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[0];
        }
        
        int n = nums.length;
        int[] tails = new int[n];
        int[] prev = new int[n];
        int[] indices = new int[n];
        Arrays.fill(prev, -1);
        int size = 0;
        
        for (int i = 0; i < n; i++) {
            int num = nums[i];
            int pos = binarySearch(tails, 0, size, num);
            
            if (pos == size) {
                tails[size++] = num;
            } else {
                tails[pos] = num;
            }
            
            indices[i] = pos;
            
            if (pos > 0) {
                // Find predecessor
                for (int j = i - 1; j >= 0; j--) {
                    if (indices[j] == pos - 1 && nums[j] < num) {
                        prev[i] = j;
                        break;
                    }
                }
            }
        }
        
        // Reconstruct LIS
        int[] lis = new int[size];
        int curr = -1;
        
        // Find last element
        for (int i = n - 1; i >= 0; i--) {
            if (indices[i] == size - 1) {
                curr = i;
                break;
            }
        }
        
        int idx = size - 1;
        while (curr != -1) {
            lis[idx--] = nums[curr];
            curr = prev[curr];
        }
        
        return lis;
    }
    
    public static void main(String[] args) {
        // Test case 1
        int[] nums1 = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println("Array: [10, 9, 2, 5, 3, 7, 101, 18]");
        System.out.println("LIS Length: " + lengthOfLIS(nums1));  // Output: 4
        
        // Test case 2
        int[] nums2 = {0, 1, 0, 3, 2, 3};
        System.out.println("\nArray: [0, 1, 0, 3, 2, 3]");
        System.out.println("LIS Length: " + lengthOfLIS(nums2));  // Output: 4
        
        // Test case 3 - Get actual sequence
        int[] seq = lisWithSequence(nums1);
        System.out.println("\nArray: [10, 9, 2, 5, 3, 7, 101, 18]");
        System.out.print("LIS: ");
        System.out.println(Arrays.toString(seq));
    }
}
```

<!-- slide -->
```javascript
/**
 * Longest Increasing Subsequence using binary search.
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */

/**
 * Find the length of the longest increasing subsequence.
 * @param {number[]} nums - Input array
 * @returns {number} Length of LIS
 */
function lengthOfLIS(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    // tails[i] = smallest tail for LIS of length i+1
    const tails = [];
    
    for (const num of nums) {
        // Binary search for position
        let left = 0;
        let right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] >= num) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        if (left === tails.length) {
            // num is larger than all elements, extend
            tails.push(num);
        } else {
            // Replace to maintain smallest tail
            tails[left] = num;
        }
    }
    
    return tails.length;
}

/**
 * Find the length of the longest non-decreasing subsequence.
 * @param {number[]} nums - Input array
 * @returns {number} Length of LNDS
 */
function lengthOfLNDS(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    const tails = [];
    
    for (const num of nums) {
        // Use upper bound (first > num)
        let left = 0;
        let right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] > num) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        if (left === tails.length) {
            tails.push(num);
        } else {
            tails[left] = num;
        }
    }
    
    return tails.length;
}

/**
 * Find both length and one actual LIS sequence.
 * @param {number[]} nums - Input array
 * @returns {{length: number, sequence: number[]}}
 */
function lisWithSequence(nums) {
    if (!nums || nums.length === 0) {
        return { length: 0, sequence: [] };
    }
    
    const n = nums.length;
    const tails = [];
    const prev = new Array(n).fill(-1);
    const indices = new Array(n).fill(-1);
    
    for (let i = 0; i < n; i++) {
        const num = nums[i];
        
        // Binary search
        let left = 0;
        let right = tails.length;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] >= num) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        if (left === tails.length) {
            tails.push(num);
        } else {
            tails[left] = num;
        }
        
        indices[i] = left;
        
        if (left > 0) {
            // Find predecessor
            for (let j = i - 1; j >= 0; j--) {
                if (indices[j] === left - 1 && nums[j] < num) {
                    prev[i] = j;
                    break;
                }
            }
        }
    }
    
    // Reconstruct LIS
    const lisLength = tails.length;
    const lis = [];
    
    // Find last element
    let curr = -1;
    for (let i = n - 1; i >= 0; i--) {
        if (indices[i] === lisLength - 1) {
            curr = i;
            break;
        }
    }
    
    while (curr !== -1) {
        lis.push(nums[curr]);
        curr = prev[curr];
    }
    
    return { length: lisLength, sequence: lis.reverse() };
}

// Example usage
console.log("Array: [10, 9, 2, 5, 3, 7, 101, 18]");
console.log("LIS Length:", lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));  // Output: 4

console.log("\nArray: [0, 1, 0, 3, 2, 3]");
console.log("LIS Length:", lengthOfLIS([0, 1, 0, 3, 2, 3]));  // Output: 4

const result = lisWithSequence([10, 9, 2, 5, 3, 7, 101, 18]);
console.log("\nArray: [10, 9, 2, 5, 3, 7, 101, 18]");
console.log("LIS Length:", result.length, "LIS:", result.sequence);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Processing** | O(n log n) | Binary search for each of n elements |
| **Space** | O(n) | tails array stores at most n elements |

### Detailed Breakdown

- **Naive DP Approach**: O(n²) time, O(n) space
  - For each element, check all previous elements
  - dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]

- **Binary Search Approach**: O(n log n) time, O(n) space
  - For each element, binary search in tails array: O(log n)
  - Total: n × O(log n) = O(n log n)

### Comparison Table

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Naive DP | O(n²) | O(n) | Can reconstruct sequence | Too slow for n > 10⁴ |
| Binary Search | O(n log n) | O(n) | Fast for large n | Only gives length |
| Segment Tree | O(n log n) | O(n) | Can query any range | More complex |
| patience Sorting | O(n log n) | O(n) | Same as binary search | Just another view |

---

## Space Complexity Analysis

- **tails array**: O(n) - stores at most one element per length
- **Predecessor array** (for reconstruction): O(n)
- **Indices array** (for reconstruction): O(n)
- **Total**: O(n)

---

## Common Variations

### 1. Longest Decreasing Subsequence (LDS)

Reverse the array or negate values, then apply LIS.

````carousel
```python
def length_of_lds(nums: list[int]) -> int:
    """Find length of longest decreasing subsequence."""
    # Method 1: Reverse and find LIS
    return length_of_lis(nums[::-1])

def length_of_lds_negate(nums: list[int]) -> int:
    """Find LDS by negating values."""
    return length_of_lis([-x for x in nums])
```
````

### 2. Longest Non-Decreasing Subsequence (LNDS)

Use `bisect_right` instead of `bisect_left` (upper bound instead of lower bound).

````carousel
```python
import bisect

def length_of_lnds(nums: list[int]) -> int:
    """Find length of longest non-decreasing subsequence."""
    if not nums:
        return 0
    
    tails = []
    for num in nums:
        # Use bisect_right for non-decreasing
        pos = bisect.bisect_right(tails, num)
        
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)
```
````

### 3. Minimum Number of Deletions to Make Array Increasing

The complement of LIS - delete elements to make it strictly increasing.

````carousel
```python
def min_deletions_to_make_increasing(nums: list[int]) -> int:
    """Minimum deletions to make array strictly increasing."""
    return len(nums) - length_of_lis(nums)
```
````

### 4. Longest Bitonic Subsequence

Find LIS from left and LDS from right, then combine.

````carousel
```python
def length_of_lbs(nums: list[int]) -> int:
    """Longest Bitonic Subsequence - increases then decreases."""
    if not nums:
        return 0
    
    n = len(nums)
    
    # LIS from left
    lis_from_left = [0] * n
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                lis_from_left[i] = max(lis_from_left[i], lis_from_left[j] + 1)
        lis_from_left[i] = max(1, lis_from_left[i])
    
    # LIS from right (for LDS)
    lis_from_right = [0] * n
    for i in range(n - 1, -1, -1):
        for j in range(i + 1, n):
            if nums[i] > nums[j]:
                lis_from_right[i] = max(lis_from_right[i], lis_from_right[j] + 1)
        lis_from_right[i] = max(1, lis_from_right[i])
    
    # Combine
    max_length = 0
    for i in range(n):
        max_length = max(max_length, lis_from_left[i] + lis_from_right[i] - 1)
    
    return max_length
```
````

### 5. Building Envelope Problem (Russian Doll Envelopes)

Sort by width, then find LIS on heights (with reversed order for equal widths).

````carousel
```python
def max_envelopes(envelopes: list[list[int]]) -> int:
    """
    Russian Doll Envelopes problem.
    
    Args:
        envelopes: List of [width, height] pairs
        
    Returns:
        Maximum number of envelopes that can be Russian-doll nested
    """
    if not envelopes:
        return 0
    
    # Sort by width ascending, then by height descending
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # Extract heights and find LIS
    heights = [h for _, h in envelopes]
    
    return length_of_lis(heights)
```
````

---

## Example

**Input:**
```
nums = [10, 9, 2, 5, 3, 7, 101, 18]
```

**Output:**
```
LIS Length: 4
One possible LIS: [2, 3, 7, 18]
```

**Input:**
```
nums = [0, 1, 0, 3, 2, 3]
```

**Output:**
```
LIS Length: 4
LIS: [0, 1, 2, 3]
```

---

## Practice Problems

### Problem 1: Longest Increasing Subsequence

**Problem:** [LeetCode 300 - Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/)

**Description:** Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

**How to Apply LIS:**
- Classic application of binary search + tails approach
- Time complexity: O(n log n)
- Can also solve with O(n²) DP for verification

---

### Problem 2: Number of Longest Increasing Subsequence

**Problem:** [LeetCode 673 - Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/)

**Description:** Given an integer array `nums`, return the number of longest increasing subsequences.

**How to Apply LIS:**
- Track both length and count at each position
- When finding a longer subsequence, update count
- When finding equal length, add to count

---

### Problem 3: Russian Doll Envelopes

**Problem:** [LeetCode 354 - Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)

**Description:** Given a 2D array of envelope widths and heights, find the maximum number of envelopes that can be Russian-doll nested.

**How to Apply LIS:**
- Sort by width ascending, height descending
- Find LIS on heights
- The sorting trick ensures width constraint is satisfied

---

### Problem 4: Longest Increasing Subsequence in 2D

**Problem:** [LeetCode 491 - Non-decreasing Subsequences](https://leetcode.com/problems/non-decreasing-subsequences/)

**Description:** Find all non-decreasing subsequences of length at least 2.

**How to Apply LIS:**
- Use set to avoid duplicates
- Track indices to ensure increasing order
- DFS with pruning based on LIS length

---

### Problem 5: Minimum Deletions to Make Sequence Sorted

**Problem:** [LeetCode 1771 - Maximize Palindrome Length from Subsequences](https://leetcode.com/problems/maximize-palindrome-length-from-subsequences/)

**Description:** Given two strings, find the longest palindromic subsequence.

**How to Apply LIS:**
- Can be transformed to LIS problem with clever sorting
- Used in sequence alignment problems

---

## Video Tutorial Links

### Fundamentals

- [Longest Increasing Subsequence - Introduction (Take U Forward)](https://www.youtube.com/watch?v=CE2b_-XfVDk) - Comprehensive introduction
- [LIS Binary Search Explanation (NeetCode)](https://www.youtube.com/watch?v=YSqE-1Os8rk) - Detailed binary search approach
- [LIS with Reconstruction (WilliamFiset)](https://www.youtube.com/watch?v=S0T3nRVC-ug) - How to reconstruct the sequence

### Advanced Topics

- [Russian Doll Envelopes](https://www.youtube.com/watch?v=4en2R7r7f7A) - LIS in 2D
- [LIS vs LDS - Longest Bitonic Subsequence](https://www.youtube.com/watch?v=4s1hL0X2M5k) - Combined approach
- [Segment Tree for LIS](https://www.youtube.com/watch?v=fV0Rq8n6Y2g) - Alternative approach

---

## Follow-up Questions

### Q1: What is the difference between LIS and LNDS?

**Answer:** 
- **LIS (Longest Increasing Subsequence)**: Strictly increasing (each element must be greater than previous)
- **LNDS (Longest Non-Decreasing Subsequence)**: Each element can be equal to or greater than previous

Use `bisect_left` for LIS and `bisect_right` for LNDS.

### Q2: Can LIS be solved in O(n log n) without binary search?

**Answer:** Yes, using a **Segment Tree** or **Fenwick Tree** with coordinate compression:
1. Compress values to indices
2. Query maximum DP value in range [0, value-1]
3. Update DP value at current position
This gives O(n log n) with additional benefits like range queries.

### Q3: How do you reconstruct the actual LIS sequence?

**Answer:** Maintain additional arrays:
- `indices[i]`: Position where nums[i] is placed in tails
- `prev[i]`: Previous index in the subsequence

After processing, backtrack from the largest index to reconstruct the sequence.

### Q4: What is the space complexity if we only need the length?

**Answer:** Still O(n) in the worst case because tails can contain at most n elements. However, we can optimize by:
- Using a single array instead of storing multiple auxiliary structures
- For reconstruction, using a map instead of arrays (trades time for space)

### Q5: How does LIS relate to patience sorting?

**Answer:** The binary search approach is equivalent to **patience sorting**:
- Each pile represents a subsequence
- We place each card on the leftmost pile with top >= card value
- Number of piles = LIS length
- This is used in algorithms like merge sort for counting inversions

---

## Summary

The Longest Increasing Subsequence (LIS) is a fundamental algorithm with many applications in competitive programming and technical interviews. Key takeaways:

- **Binary search optimization**: Reduces O(n²) to O(n log n)
- **Tails array**: The key data structure maintaining smallest tails
- **Proof of correctness**: Invariant that tails[i] is the smallest possible tail for subsequence length i+1
- **Strictly vs Non-decreasing**: Use `bisect_left` vs `bisect_right`

When to use:
- ✅ Finding longest increasing subsequence
- ✅ Problems involving nested structures (envelopes, boxes)
- ✅ Sequence optimization problems
- ❌ When you need O(n²) for reconstruction with actual sequence

The O(n log n) binary search approach is the most commonly used in practice due to its simplicity and efficiency. Always consider whether you need the actual sequence or just the length when choosing your approach.

---

## Related Algorithms

- [Dynamic Programming](./dynamic-programming.md) - General DP concepts
- [Binary Search](./binary-search.md) - Search technique used
- [Segment Tree](./segment-tree.md) - Alternative LIS approach
- [Patience Sorting](./patience-sorting.md) - Related sorting technique
