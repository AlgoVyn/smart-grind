# Sliding Window Maximum

## Category
Heap / Priority Queue

## Description

The Sliding Window Maximum problem asks for the maximum value in each sliding window of size `k` as it moves across an array. This is a fundamental problem that appears frequently in data stream processing, traffic monitoring, and various algorithmic challenges.

The optimal solution uses a **monotonic deque** (double-ended queue) to achieve O(n) time complexity, making it one of the most efficient sliding window techniques. Each element is processed at most twice—once when entering the window and once when leaving—resulting in linear time performance.

---

## When to Use

Use the Sliding Window Maximum algorithm when you need to solve problems involving:

- **Finding maximum/minimum in every window**: When you need to track the maximum (or minimum) element as a window slides across an array
- **Stream processing**: When processing data streams where you need the running maximum
- **Real-time systems**: When you need O(1) access to the current window's maximum
- **Optimization problems**: When the maximum of sliding windows is part of a larger problem solution

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| **Monotonic Deque** | O(n) | O(k) | Optimal for single pass, best overall |
| **Brute Force** | O(n × k) | O(1) | Small k, simple implementation |
| **Max Heap** | O(n log k) | O(k) | When you need k-largest, not just maximum |
| **Sorted Container** | O(n log k) | O(k) | When you need order statistics |
| **Sparse Table** | O(n log n) preprocess, O(1) query | O(n log n) | Static array, many queries |

### When to Choose Each Approach

- **Choose Monotonic Deque** when:
  - You need the maximum in each window (not k-largest)
  - You want optimal O(n) time complexity
  - You can process elements in a single pass

- **Choose Max Heap** when:
  - You need k-largest elements, not just the maximum
  - Window size is very small relative to array size
  - You need to handle duplicate values specially

- **Choose Brute Force** when:
  - k is very small (k ≤ 3)
  - Simplicity is more important than efficiency
  - Code readability is the priority

- **Choose Sparse Table** when:
  - The array is static (no updates)
  - You need to answer many queries on the same array
  - You want O(1) query time after preprocessing

---

## Algorithm Explanation

### Core Concept

The key insight behind the monotonic deque solution is maintaining a **decreasing deque** where:
- The front always contains the maximum element of the current window
- Elements are stored in decreasing order of their values
- Indices (not values) are stored to track window boundaries

### How It Works

#### The Monotonic Deque Invariant:

```
Deque stores indices, and nums[deque[0]] ≥ nums[deque[1]] ≥ nums[deque[2]] ≥ ...
```

#### Processing Each Element:

1. **Remove outdated indices**: Remove indices from the front that are outside the current window [i - k + 1, i]
2. **Maintain monotonicity**: Remove indices from the back that have smaller values than the current element
3. **Add current index**: Push the current index to the back of the deque
4. **Record the maximum**: Once we've processed at least k elements, the front of the deque is the maximum

### Visual Representation

For array `[1, 3, -1, -3, 5, 3, 6, 7]` with k = 3:

```
Step 1: i=0, nums[0]=1    Deque: [0]           Window: [1]           Max: -
Step 2: i=1, nums[1]=3    Deque: [1]           Window: [1,3]         Max: -
         (removed 0, 3>1)
Step 3: i=2, nums[2]=-1   Deque: [1,2]         Window: [1,3,-1]      Max: 3 ✓
Step 4: i=3, nums[3]=-3   Deque: [1,2,3]       Window: [3,-1,-3]     Max: 3 ✓
Step 5: i=4, nums[4]=5    Deque: [4]           Window: [-1,-3,5]     Max: 5 ✓
         (removed 1,2,3, 5>-1,-3)
Step 6: i=5, nums[5]=3    Deque: [4,5]         Window: [-3,5,3]      Max: 5 ✓
Step 7: i=6, nums[6]=6    Deque: [6]           Window: [5,3,6]       Max: 6 ✓
         (removed 4,5, 6>5,3)
Step 8: i=7, nums[7]=7    Deque: [7]           Window: [3,6,7]       Max: 7 ✓
```

### Why O(n) Time Complexity?

Each element:
- Is pushed to the deque exactly once
- Is popped from the deque at most once

Total operations: 2n = O(n)

### Why O(k) Space Complexity?

The deque can contain at most k elements (the current window size), so space is O(k).

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize**: Create an empty deque to store indices and a result array
2. **Iterate**: Loop through each element with index `i` from 0 to n-1
3. **Window Cleanup**: Remove indices from the front that are outside the current window (index < i - k + 1)
4. **Monotonic Cleanup**: Remove indices from the back where nums[index] < nums[i] (maintain decreasing order)
5. **Add Current**: Push current index `i` to the back of the deque
6. **Record Result**: Once i >= k-1, add nums[deque[0]] to the result (front is maximum)
7. **Return**: Return the result array

### Edge Cases to Handle

- Empty array: Return empty array
- k = 0: Return empty array (no window)
- k = 1: Return a copy of the original array
- k >= n: Return single element (the maximum)
- Negative numbers: Algorithm works correctly
- Duplicate values: Algorithm handles duplicates properly

---

## Implementation

### Template Code (Monotonic Deque - Optimal O(n))

````carousel
```python
from typing import List
from collections import deque

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Find the maximum element in each sliding window.
    Uses a monotonic deque for O(n) time complexity.
    
    Args:
        nums: Input array
        k: Window size
    
    Returns:
        List of maximum values in each window
    
    Time: O(n) - each element pushed/popped at most once
    Space: O(k) - deque holds at most k indices
    """
    if not nums or k == 0:
        return []
    
    if k == 1:
        return nums[:]
    
    result = []
    dq = deque()  # Stores indices, maintains decreasing order
    
    for i in range(len(nums)):
        # Step 1: Remove indices that are outside the current window
        # Keep indices >= i - k + 1 (within window)
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Step 2: Remove indices with smaller values from back
        # Maintain decreasing order (front = maximum)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        # Step 3: Add current index to the deque
        dq.append(i)
        
        # Step 4: Record maximum once window is full
        # Window is full when we've seen at least k elements
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result


def max_sliding_window_heap(nums: List[int], k: int) -> List[int]:
    """
    Alternative implementation using max heap.
    Time: O(n log k)
    Space: O(k)
    
    Useful when you need k-largest elements, not just the maximum.
    """
    import heapq
    
    if not nums or k == 0:
        return []
    
    result = []
    max_heap = []  # Stores (-value, index) tuples
    
    for i in range(len(nums)):
        # Add current element (negate for max heap simulation)
        heapq.heappush(max_heap, (-nums[i], i))
        
        # Remove elements outside the window
        while max_heap and max_heap[0][1] < i - k + 1:
            heapq.heappop(max_heap)
        
        # Record maximum once window is full
        if i >= k - 1:
            result.append(-max_heap[0][0])
    
    return result


def min_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Find the minimum element in each sliding window.
    Similar to max, but maintains increasing order in deque.
    """
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices, maintains increasing order
    
    for i in range(len(nums)):
        # Remove indices outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices with larger values (maintain increasing order)
        while dq and nums[dq[-1]] > nums[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result


# Example usage and demonstration
if __name__ == "__main__":
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    
    print(f"Input array: {nums}")
    print(f"Window size (k): {k}")
    print()
    
    # Test with monotonic deque (O(n))
    result = max_sliding_window(nums, k)
    print(f"Monotonic Deque O(n): {result}")
    
    # Test with heap (O(n log k))
    result_heap = max_sliding_window_heap(nums, k)
    print(f"Max Heap O(n log k): {result_heap}")
    
    # Test minimum sliding window
    result_min = min_sliding_window(nums, k)
    print(f"Min sliding window: {result_min}")
    
    # Verify all windows
    print("\nAll windows:")
    for i in range(len(nums) - k + 1):
        window = nums[i:i+k]
        print(f"  Window {i}-{i+k-1}: {window} -> max = {max(window)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <deque>
using namespace std;

/**
 * Sliding Window Maximum using Monotonic Deque.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(k)
 * 
 * Each element is pushed and popped at most once.
 */
class SlidingWindowMaximum {
public:
    /**
     * Find maximum in each sliding window.
     * @param nums Input array
     * @param k Window size
     * @return Vector of maximum values
     */
    static vector<int> maxSlidingWindow(const vector<int>& nums, int k) {
        if (nums.empty() || k == 0) return {};
        if (k == 1) return nums;
        
        vector<int> result;
        deque<int> dq;  // Stores indices, maintains decreasing order
        
        for (int i = 0; i < nums.size(); i++) {
            // Remove indices outside the current window
            while (!dq.empty() && dq.front() < i - k + 1) {
                dq.pop_front();
            }
            
            // Remove indices with smaller values from back
            while (!dq.empty() && nums[dq.back()] < nums[i]) {
                dq.pop_back();
            }
            
            // Add current index
            dq.push_back(i);
            
            // Record maximum once window is full
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        
        return result;
    }
    
    /**
     * Find minimum in each sliding window.
     * Maintains increasing order in deque.
     */
    static vector<int> minSlidingWindow(const vector<int>& nums, int k) {
        if (nums.empty() || k == 0) return {};
        
        vector<int> result;
        deque<int> dq;  // Stores indices, maintains increasing order
        
        for (int i = 0; i < nums.size(); i++) {
            // Remove indices outside window
            while (!dq.empty() && dq.front() < i - k + 1) {
                dq.pop_front();
            }
            
            // Remove indices with larger values (maintain increasing order)
            while (!dq.empty() && nums[dq.back()] > nums[i]) {
                dq.pop_back();
            }
            
            dq.push_back(i);
            
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        
        return result;
    }
};

int main() {
    vector<int> nums = {1, 3, -1, -3, 5, 3, 6, 7};
    int k = 3;
    
    cout << "Input array: ";
    for (int x : nums) cout << x << " ";
    cout << "\nWindow size (k): " << k << "\n\n";
    
    // Test maximum sliding window
    vector<int> result = SlidingWindowMaximum::maxSlidingWindow(nums, k);
    cout << "Maximums: ";
    for (int x : result) cout << x << " ";
    cout << "\n";
    
    // Test minimum sliding window
    vector<int> minResult = SlidingWindowMaximum::minSlidingWindow(nums, k);
    cout << "Minimums: ";
    for (int x : minResult) cout << x << " ";
    cout << "\n";
    
    // Show all windows
    cout << "\nAll windows:\n";
    for (int i = 0; i <= nums.size() - k; i++) {
        cout << "  Window " << i << "-" << i + k - 1 << ": ";
        for (int j = i; j < i + k; j++) {
            cout << nums[j] << " ";
        }
        cout << "-> max = " << *max_element(nums.begin() + i, nums.begin() + i + k) << "\n";
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;

/**
 * Sliding Window Maximum using Monotonic Deque.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(k)
 */
public class SlidingWindowMaximum {
    
    /**
     * Find maximum in each sliding window.
     * @param nums Input array
     * @param k Window size
     * @return List of maximum values
     */
    public static List<Integer> maxSlidingWindow(int[] nums, int k) {
        List<Integer> result = new ArrayList<>();
        
        if (nums == null || nums.length == 0 || k == 0) {
            return result;
        }
        
        if (k == 1) {
            for (int num : nums) {
                result.add(num);
            }
            return result;
        }
        
        Deque<Integer> dq = new LinkedList<>();  // Stores indices
        
        for (int i = 0; i < nums.length; i++) {
            // Remove indices outside the current window
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {
                dq.pollFirst();
            }
            
            // Remove indices with smaller values from back
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) {
                dq.pollLast();
            }
            
            // Add current index
            dq.addLast(i);
            
            // Record maximum once window is full
            if (i >= k - 1) {
                result.add(nums[dq.peekFirst()]);
            }
        }
        
        return result;
    }
    
    /**
     * Find minimum in each sliding window.
     * Maintains increasing order in deque.
     */
    public static List<Integer> minSlidingWindow(int[] nums, int k) {
        List<Integer> result = new ArrayList<>();
        
        if (nums == null || nums.length == 0 || k == 0) {
            return result;
        }
        
        Deque<Integer> dq = new LinkedList<>();
        
        for (int i = 0; i < nums.length; i++) {
            // Remove indices outside window
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {
                dq.pollFirst();
            }
            
            // Remove indices with larger values
            while (!dq.isEmpty() && nums[dq.peekLast()] > nums[i]) {
                dq.pollLast();
            }
            
            dq.addLast(i);
            
            if (i >= k - 1) {
                result.add(nums[dq.peekFirst()]);
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        
        System.out.println("Input array: [1, 3, -1, -3, 5, 3, 6, 7]");
        System.out.println("Window size (k): 3");
        System.out.println();
        
        // Test maximum sliding window
        List<Integer> result = maxSlidingWindow(nums, k);
        System.out.println("Maximums: " + result);
        
        // Test minimum sliding window
        List<Integer> minResult = minSlidingWindow(nums, k);
        System.out.println("Minimums: " + minResult);
        System.out.println("\nAll windows:");
        for (int i = 0; i <= nums.length - k; i++) {
            System.out.print("  Window " + i + "-" + (i + k - 1) + ": [");
            for (int j = i; j < i + k; j++) {
                System.out.print(nums[j] + (j < i + k - 1 ? ", " : ""));
            }
            System.out.println("] -> max = " + result.get(i));
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Sliding Window Maximum using Monotonic Deque.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(k)
 */

/**
 * Find maximum in each sliding window.
 * @param {number[]} nums - Input array
 * @param {number} k - Window size
 * @returns {number[]} Array of maximum values
 */
function maxSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k === 0) {
        return [];
    }
    
    if (k === 1) {
        return [...nums];
    }
    
    const result = [];
    const dq = [];  // Stores indices, maintains decreasing order
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside the current window
        while (dq.length > 0 && dq[0] < i - k + 1) {
            dq.shift();
        }
        
        // Remove indices with smaller values from back
        while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) {
            dq.pop();
        }
        
        // Add current index
        dq.push(i);
        
        // Record maximum once window is full
        if (i >= k - 1) {
            result.push(nums[dq[0]]);
        }
    }
    
    return result;
}

/**
 * Find minimum in each sliding window.
 * Maintains increasing order in deque.
 */
function minSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k === 0) {
        return [];
    }
    
    const result = [];
    const dq = [];  // Stores indices, maintains increasing order
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (dq.length > 0 && dq[0] < i - k + 1) {
            dq.shift();
        }
        
        // Remove indices with larger values
        while (dq.length > 0 && nums[dq[dq.length - 1]] > nums[i]) {
            dq.pop();
        }
        
        dq.push(i);
        
        if (i >= k - 1) {
            result.push(nums[dq[0]]);
        }
    }
    
    return result;
}

// Example usage and demonstration
const nums = [1, 3, -1, -3, 5, 3, 6, 7];
const k = 3;

console.log(`Input array: [${nums.join(', ')}]`);
console.log(`Window size (k): ${k}`);
console.log();

// Test maximum sliding window
const result = maxSlidingWindow(nums, k);
console.log(`Maximums: [${result.join(', ')}]`);

// Test minimum sliding window
const minResult = minSlidingWindow(nums, k);
console.log(`Minimums: [${minResult.join(', ')}]`);

// Show all windows
console.log('\nAll windows:');
for (let i = 0; i <= nums.length - k; i++) {
    const window = nums.slice(i, i + k);
    console.log(`  Window ${i}-${i + k - 1}: [${window.join(', ')}] -> max = ${result[i]}`);
}
```
````

---

## Example

**Input:**
```
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
```

**Output:**
```
[3, 3, 5, 5, 6, 7]
```

**Explanation:**
| Window | Elements | Maximum |
|--------|----------|---------|
| Window 0 | [1, 3, -1] | 3 |
| Window 1 | [3, -1, -3] | 3 |
| Window 2 | [-1, -3, 5] | 5 |
| Window 3 | [-3, 5, 3] | 5 |
| Window 4 | [5, 3, 6] | 6 |
| Window 5 | [3, 6, 7] | 7 |

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Pass** | O(n) | Each element pushed once, popped at most once |
| **Total Operations** | O(2n) | Each element processed at most 2 times |
| **Space** | O(k) | Deque holds at most k indices |

### Detailed Breakdown

- **Pushing elements**: n elements pushed → O(n)
- **Popping elements**: At most n elements popped → O(n)
- **Window cleanup**: Each element removed at most once when leaving window
- **Monotonic cleanup**: Each element removed at most once when smaller element arrives

**Total: O(n + n) = O(n)**

---

## Space Complexity Analysis

| Data Structure | Space | Reason |
|----------------|-------|--------|
| **Deque** | O(k) | At most k indices stored |
| **Result Array** | O(n - k + 1) | Number of windows |
| **Total** | O(n) | Can be considered O(n) worst case when k ≈ n |

---

## Common Variations

### 1. Minimum in Sliding Window

Simply flip the comparison to maintain increasing order:

````carousel
```python
def min_sliding_window(nums: List[int], k: int) -> List[int]:
    """Find minimum - change < to > in monotonic cleanup."""
    result = []
    dq = deque()
    
    for i in range(len(nums)):
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] > nums[i]:  # Changed!
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result
```

<!-- slide -->
```cpp
vector<int> minSlidingWindow(vector<int>& nums, int k) {
    vector<int> result;
    deque<int> dq;  // Stores indices
    
    for (int i = 0; i < nums.size(); i++) {
        // Remove indices outside window
        while (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        
        // Remove larger elements from back (maintain increasing order)
        while (!dq.empty() && nums[dq.back()] > nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }
    
    return result;
}
```

<!-- slide -->
```java
public List<Integer> minSlidingWindow(int[] nums, int k) {
    List<Integer> result = new ArrayList<>();
    Deque<Integer> dq = new LinkedList<>();
    
    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {
            dq.pollFirst();
        }
        
        // Remove larger elements from back
        while (!dq.isEmpty() && nums[dq.peekLast()] > nums[i]) {
            dq.pollLast();
        }
        
        dq.addLast(i);
        
        if (i >= k - 1) {
            result.add(nums[dq.peekFirst()]);
        }
    }
    
    return result;
}
```

<!-- slide -->
```javascript
function minSlidingWindow(nums, k) {
    const result = [];
    const dq = [];  // Stores indices
    
    for (let i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (dq.length > 0 && dq[0] < i - k + 1) {
            dq.shift();
        }
        
        // Remove larger elements from back
        while (dq.length > 0 && nums[dq[dq.length - 1]] > nums[i]) {
            dq.pop();
        }
        
        dq.push(i);
        
        if (i >= k - 1) {
            result.push(nums[dq[0]]);
        }
    }
    
    return result;
}
```
````

### 2. Sliding Window with Deque of Values

Instead of storing indices, store values (simpler but loses window tracking):

````carousel
```python
def max_sliding_window_values(nums: List[int], k: int) -> List[int]:
    """Store values instead of indices - loses window tracking."""
    from collections import deque
    
    result = []
    dq = deque()
    
    for i, num in enumerate(nums):
        # Remove from front if outside window
        while dq and dq[0][1] < i - k + 1:
            dq.popleft()
        
        # Remove smaller values from back
        while dq and dq[-1][0] < num:
            dq.pop()
        
        dq.append((num, i))
        
        if i >= k - 1:
            result.append(dq[0][0])
    
    return result
```
````

### 3. Sliding Window Maximum with Index Tracking

Track both maximum and its index for more complex problems:

````carousel
```python
def max_sliding_window_with_index(nums: List[int], k: int) -> List[tuple]:
    """Return both value and index of maximum."""
    result = []
    dq = deque()
    
    for i in range(len(nums)):
        while dq and dq[0][1] < i - k + 1:
            dq.popleft()
        while dq and dq[-1][0] < nums[i]:
            dq.pop()
        
        dq.append((nums[i], i))
        
        if i >= k - 1:
            result.append(dq[0])
    
    return result
```
````

### 4. K-Largest Elements in Window

Using max heap to get top k elements per window:

````carousel
```python
import heapq
from typing import List

def k_largest_in_window(nums: List[int], k: int, m: int) -> List[List[int]]:
    """
    Find m largest elements in each sliding window of size k.
    Time: O(n log m)
    """
    if k < m:
        return []
    
    result = []
    max_heap = []  # (-value, index)
    
    for i in range(len(nums)):
        heapq.heappush(max_heap, (-nums[i], i))
        
        # Remove outside window
        while max_heap and max_heap[0][1] < i - k + 1:
            heapq.heappop(max_heap)
        
        if i >= k - 1:
            # Get m largest
            largest = sorted([-x for x, _ in max_heap[:m]], reverse=True)
            result.append(largest)
    
    return result
```
````

---

## Practice Problems

### Problem 1: Sliding Window Maximum

**Problem:** [LeetCode 239 - Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)

**Description:** Given an integer array `nums`, there is a sliding window of size `k` which moves from the very left to the very right. Return the max sliding window.

**How to Apply:**
- Use monotonic decreasing deque
- Maintain indices in decreasing order of values
- Remove outdated indices from front
- Time: O(n), Space: O(k)

---

### Problem 2: Sliding Window Median

**Problem:** [LeetCode 480 - Sliding Window Median](https://leetcode.com/problems/sliding-window-median/)

**Description:** Given an integer array `nums` and integer `k`, return the median of each sliding window of size `k`. The median is the middle value in an ordered integer list.

**How to Apply:**
- Use two heaps: a max heap for the lower half and a min heap for the upper half
- Balance the heaps to maintain the invariant that their sizes differ by at most 1
- Remove elements outside the window using lazy deletion with hash maps
- Time: O(n log k), Space: O(k)

---

### Problem 3: Max of Minimum in Every Window Size

**Problem:** [GeeksforGeeks - Maximum of minimum for every window size](https://www.geeksforgeeks.org/find-the-maximum-of-minimums-for-every-window-size-in-a-given-array/)

**Description:** Given an array of integers, find the maximum of the minimum of every window size in the array. Window sizes vary from 1 to n.

**How to Apply:**
- Precompute the previous smaller and next smaller elements using a monotonic stack
- For each element, determine the maximum window size where it is the minimum
- Use the results to fill in the answer array
- Time: O(n), Space: O(n)

---

### Problem 4: Shortest Subarray with Sum at Least K

**Problem:** [LeetCode 862 - Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)

**Description:** Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray with a sum of at least `k`. If there is no such subarray, return -1.

**How to Apply:**
- Compute prefix sums to transform the problem into finding valid pairs
- Use a monotonic deque to maintain candidate starting points
- For each ending point, remove starting points that give sums ≥ k
- Time: O(n), Space: O(n)

---

### Problem 5: Constrained Subset Sum

**Problem:** [LeetCode 1425 - Constrained Subset Sum](https://leetcode.com/problems/constrained-subset-sum/)

**Description:** Given an integer array `nums` and an integer `k`, return the maximum sum of a non-empty subset such that for every two consecutive elements in the subset, if they are at indices `i` and `j` respectively, then `j - i <= k`.

**How to Apply:**
- Use dynamic programming: `dp[i] = nums[i] + max(dp[j])` for valid previous indices
- Maintain the max of previous dp values using a sliding window maximum (monotonic deque)
- This optimizes the DP from O(nk) to O(n)
- Time: O(n), Space: O(n)

---

## Video Tutorial Links

### Fundamentals

- [Sliding Window Maximum - Introduction (Take U Forward)](https://www.youtube.com/watch?v=DfljaUwZsOk) - Comprehensive introduction
- [Monotonic Queue Explained (WilliamFiset)](https://www.youtube.com/watch?v=2OynB1b3sWQ) - Detailed explanation with visualizations
- [Sliding Window Maximum - NeetCode](https://www.youtube.com/watch?v=2xGeO8j9a4) - Practical implementation guide

### Advanced Topics

- [Sliding Window Minimum/Maximum (Tushar Roy)](https://www.youtube.com/watch?v=0f1D6u1z0r8) - Multiple approaches
- [Dequeue Optimization (Algorithms Live)](https://www.youtube.com/watch?v=0FYkn4KN4Lw) - Why monotonic deque works
- [Sliding Window Variations](https://www.youtube.com/watch?v=MK0m1z7c9bE) - Common variations and extensions

---

## Follow-up Questions

### Q1: Why use a deque instead of a regular queue?

**Answer:** A deque (double-ended queue) allows O(1) insertions and deletions at both ends. In our algorithm, we need to:
- Remove from front: O(1) - elements outside the window
- Remove from back: O(1) - elements with smaller values
- Add to back: O(1) - new element

A regular queue can only remove from the front, making the monotonic cleanup impossible in O(1).

### Q2: Can this algorithm handle duplicate values correctly?

**Answer:** Yes! The algorithm handles duplicates correctly because:
- When nums[dq[-1]] < nums[i], we remove the smaller duplicate
- When values are equal, we keep the earlier index (stays longer in window)
- This maintains correctness because earlier index stays valid longer

### Q3: How would you modify for circular arrays?

**Answer:** For circular sliding windows (window can wrap around):
1. Concatenate the array to itself: nums + nums[:k-1]
2. Apply standard sliding window algorithm
3. Adjust indices to handle wrapping

Or use modulo arithmetic to track indices.

### Q4: What's the difference between this and a segment tree approach?

**Answer:**
- **Monotonic Deque**: O(n) time, O(k) space, single pass, online algorithm
- **Segment Tree**: O(n) build, O(log n) per query, O(n) space, supports updates
- **Sparse Table**: O(n log n) build, O(1) per query, O(n log n) space, static only
- **Choice**: Use deque for streaming/sliding windows; segment tree for dynamic range queries; sparse table for static array with many queries

### Q5: How do you handle very large window sizes (k ≈ n)?

**Answer:** The algorithm still works efficiently:
- Space becomes O(n) when k ≈ n
- Each element still pushed/popped at most once
- The monotonic property still maintained
- Consider edge case where k > n: return single maximum

---

## Summary

The Sliding Window Maximum problem is elegantly solved using a **monotonic deque**, achieving optimal O(n) time complexity. Key takeaways:

- **Monotonic property**: Maintain decreasing order in deque (front = maximum)
- **O(n) time**: Each element pushed once, popped at most once
- **O(k) space**: Deque holds at most k indices
- **Versatile**: Can be adapted for minimum, k-largest, and many variations
- **Practical**: Single pass, no preprocessing needed

When to use:
- ✅ Finding maximum/minimum in sliding windows
- ✅ Stream processing with running statistics
- ✅ When you need O(n) single-pass solution
- ✅ Competitive programming and interviews

This algorithm is fundamental and appears in many real-world applications including:
- Stock price monitoring
- Network traffic analysis
- Weather data processing
- Any sliding window statistical analysis

---

## Related Algorithms

- [Monotonic Stack](./monotonic-stack.md) - Similar technique for next greater/smaller elements
- [Heap/Priority Queue](./heap-kth-largest.md) - Alternative O(n log k) approach
- [Prefix Sum](./prefix-sum.md) - For sliding window sum queries
- [Segment Tree](./segment-tree.md) - For general range queries
- [Sparse Table](./sparse-table.md) - For static range queries with O(1) time
