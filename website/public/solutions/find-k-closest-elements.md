# Find K Closest Elements

## Problem Description

## Pattern: Binary Search - Closest Elements

This problem demonstrates using **Binary Search** to find k closest elements in a sorted array.

Given a sorted integer array arr, two integers k and x, return the k closest integers to x in the array. The result should also be sorted in ascending order.
An integer a is closer to x than an integer b if:

- |a - x| < |b - x|, or
- |a - x| == |b - x| and a < b

---

## Constraints

- 1 <= k <= arr.length
- 1 <= arr.length <= 104
- arr is sorted in ascending order.
- -104 <= arr[i], x <= 104

---

## Examples

**Input:**
```python
arr = [1,2,3,4,5], k = 4, x = 3
```

**Output:**
```python
[1,2,3,4]
```

---

## Examples

**Input:**
```python
arr = [1,1,2,3,4,5], k = 4, x = -1
```

**Output:**
```python
[1,1,2,3]
```

---

## Intuition

The key insight is that since the array is sorted, the k closest elements will form a contiguous subarray. We need to find the optimal starting position of this window.

### Why Binary Search Works

The answer space is limited to indices [0, len(arr) - k]. We can use binary search because:
- If the window starting at `mid` is not optimal, we know which direction to move
- The comparison `x - arr[mid] > arr[mid + k] - x` tells us whether shifting left or right gives better results
- This creates a monotonic decision space perfect for binary search

---

## Multiple Approaches with Code

We'll cover three approaches:
1. **Binary Search (Optimal)** - O(log(n-k) + k) time
2. **Two Pointers** - O(n) time, more intuitive
3. **Heap-Based** - O(n log k) time, different perspective

---

## Approach 1: Binary Search (Optimal)

This is the most efficient approach. We binary search on the possible starting positions and compare distances.

### Algorithm Steps

1. Set search range from 0 to len(arr) - k
2. For each mid point, compare distances: `x - arr[mid]` vs `arr[mid + k] - x`
3. If x is closer to arr[mid + k], move left pointer
4. Otherwise, move right pointer
5. Return the window starting at the final left position

### Why It Works

The comparison tells us which side has elements closer to x. By moving the window, we always keep the better side. Since the array is sorted, once we know which side is better, we can eliminate the other side.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        """
        Find k closest elements to x in a sorted array using binary search.
        
        Args:
            arr: Sorted integer array
            k: Number of closest elements to find
            x: Target value
            
        Returns:
            List of k closest elements sorted in ascending order
        """
        left, right = 0, len(arr) - k
        
        while left < right:
            mid = (left + right) // 2
            # Compare distance from x to left edge vs right edge of window
            if x - arr[mid] > arr[mid + k] - x:
                left = mid + 1
            else:
                right = mid
        
        return arr[left:left + k]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    /**
     * Find k closest elements to x in a sorted array using binary search.
     */
    vector<int> findClosestElements(vector<int>& arr, int k, int x) {
        int left = 0, right = arr.size() - k;
        
        while (left < right) {
            int mid = (left + right) / 2;
            // Compare distance from x to left edge vs right edge of window
            if (x - arr[mid] > arr[mid + k] - x) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        return vector<int>(arr.begin() + left, arr.begin() + left + k);
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    /**
     * Find k closest elements to x in a sorted array using binary search.
     */
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int left = 0, right = arr.length - k;
        
        while (left < right) {
            int mid = (left + right) / 2;
            // Compare distance from x to left edge vs right edge of window
            if (x - arr[mid] > arr[mid + k] - x) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        
        List<Integer> result = new ArrayList<>();
        for (int i = left; i < left + k; i++) {
            result.add(arr[i]);
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find k closest elements to x in a sorted array using binary search.
 * 
 * @param {number[]} arr - Sorted integer array
 * @param {number} k - Number of closest elements to find
 * @param {number} x - Target value
 * @return {number[]} - List of k closest elements sorted in ascending order
 */
var findClosestElements = function(arr, k, x) {
    let left = 0, right = arr.length - k;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        // Compare distance from x to left edge vs right edge of window
        if (x - arr[mid] > arr[mid + k] - x) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return arr.slice(left, left + k);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log(n-k) + k) - Binary search + slicing |
| **Space** | O(k) - For the result list |

---

## Approach 2: Two Pointers

A more intuitive approach using two pointers that expand inward from both sides.

### Algorithm Steps

1. Initialize two pointers at the edges: left at start, right at end of array
2. While the window size > k:
   - Compare distances: |arr[left] - x| vs |arr[right] - x|
   - Remove the element farther from x (move the corresponding pointer)
3. Return the window between left and right

### Why It Works

At each step, we compare the two farthest elements from x and remove the farther one. This greedy approach ensures we always keep the closest elements.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findClosestElements_two_pointers(self, arr: List[int], k: int, x: int) -> List[int]:
        """
        Find k closest elements using two pointers approach.
        
        Args:
            arr: Sorted integer array
            k: Number of closest elements to find
            x: Target value
            
        Returns:
            List of k closest elements sorted in ascending order
        """
        left, right = 0, len(arr) - 1
        
        # Reduce window from k + 1 to k elements
        while right - left + 1 > k:
            dist_left = abs(arr[left] - x)
            dist_right = abs(arr[right] - x)
            
            if dist_left > dist_right:
                left += 1  # Remove left element
            else:
                right -= 1  # Remove right element
        
        return arr[left:left + k]
```

<!-- slide -->
```cpp
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    vector<int> findClosestElements(vector<int>& arr, int k, int x) {
        int left = 0, right = arr.size() - 1;
        
        // Reduce window from k + 1 to k elements
        while (right - left + 1 > k) {
            int dist_left = abs(arr[left] - x);
            int dist_right = abs(arr[right] - x);
            
            if (dist_left > dist_right) {
                left++;
            } else {
                right--;
            }
        }
        
        return vector<int>(arr.begin() + left, arr.begin() + left + k);
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        int left = 0, right = arr.length - 1;
        
        // Reduce window from k + 1 to k elements
        while (right - left + 1 > k) {
            int dist_left = Math.abs(arr[left] - x);
            int dist_right = Math.abs(arr[right] - x);
            
            if (dist_left > dist_right) {
                left++;
            } else {
                right--;
            }
        }
        
        List<Integer> result = new ArrayList<>();
        for (int i = left; i < left + k; i++) {
            result.add(arr[i]);
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
var findClosestElements = function(arr, k, x) {
    let left = 0, right = arr.length - 1;
    
    // Reduce window from k + 1 to k elements
    while (right - left + 1 > k) {
        const dist_left = Math.abs(arr[left] - x);
        const dist_right = Math.abs(arr[right] - x);
        
        if (dist_left > dist_right) {
            left++;
        } else {
            right--;
        }
    }
    
    return arr.slice(left, left + k);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n - k) - Each iteration reduces window by 1 |
| **Space** | O(k) - For the result list |

---

## Approach 3: Heap-Based Approach

Using a max-heap to keep track of k closest elements.

### Algorithm Steps

1. Create a max-heap with pairs of (distance, element)
2. Iterate through each element in the array
3. Push (distance, element) into heap
4. If heap size exceeds k, pop the element with largest distance
5. Extract all elements from heap and sort them

### Why It Works

The max-heap always maintains the k elements with smallest distances. When we encounter a new element closer than the farthest in our heap, we replace the farthest with the new one.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def findClosestElements_heap(self, arr: List[int], k: int, x: int) -> List[int]:
        """
        Find k closest elements using heap-based approach.
        
        Args:
            arr: Sorted integer array
            k: Number of closest elements to find
            x: Target value
            
        Returns:
            List of k closest elements sorted in ascending order
        """
        # Use max-heap (negate distance) to get largest distance element
        heap = []
        
        for num in arr:
            dist = abs(num - x)
            heapq.heappush(heap, (-dist, num))
            
            if len(heap) > k:
                heapq.heappop(heap)
        
        # Extract elements and sort
        result = [num for _, num in heap]
        result.sort()
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <cmath>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> findClosestElements(vector<int>& arr, int k, int x) {
        // Use max-heap (negate distance) to get largest distance element
        priority_queue<pair<int, int>> heap;
        
        for (int num : arr) {
            int dist = abs(num - x);
            heap.push({-dist, num});
            
            if (heap.size() > k) {
                heap.pop();
            }
        }
        
        // Extract elements and sort
        vector<int> result;
        while (!heap.empty()) {
            result.push_back(heap.top().second);
            heap.pop();
        }
        sort(result.begin(), result.end());
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        // Use max-heap (negate distance) to get largest distance element
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {
            return b[0] - a[0]; // Max heap by distance
        });
        
        for (int num : arr) {
            int dist = Math.abs(num - x);
            heap.offer(new int[]{dist, num});
            
            if (heap.size() > k) {
                heap.poll();
            }
        }
        
        // Extract elements and sort
        List<Integer> result = new ArrayList<>();
        while (!heap.isEmpty()) {
            result.add(heap.poll()[1]);
        }
        Collections.sort(result);
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var findClosestElements = function(arr, k, x) {
    // Use max-heap (negate distance) to get largest distance element
    const heap = [];
    
    for (const num of arr) {
        const dist = Math.abs(num - x);
        heap.push({dist, num});
        heap.sort((a, b) => b.dist - a.dist); // Max heap by distance
        
        if (heap.length > k) {
            heap.pop();
        }
    }
    
    // Extract elements and sort
    const result = heap.map(item => item.num).sort((a, b) => a - b);
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - Push/pop operations on heap |
| **Space** | O(k) - Heap storage |

---

## Comparison of Approaches

| Aspect | Binary Search | Two Pointers | Heap-Based |
|--------|---------------|--------------|------------|
| **Time Complexity** | O(log(n-k) + k) | O(n) | O(n log k) |
| **Space Complexity** | O(k) | O(k) | O(k) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Large inputs | Small inputs | Different perspective |

**Best Approach:** Binary search is optimal with O(log(n-k) + k) time complexity.

---

## Why Binary Search is Optimal for This Problem

The binary search approach is the most efficient because:

1. **Logarithmic Search**: Reduces search space exponentially
2. **Sorted Array Exploitation**: Uses the inherent sorted property effectively
3. **Optimal Decision**: Each comparison eliminates half of the remaining options
4. **Industry Standard**: Widely accepted solution for this problem

---

## Related Problems

Based on similar themes (binary search, sliding window, two pointers):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find Smallest Letter Greater Than Target | [Link](https://leetcode.com/problems/find-smallest-letter-greater-than-target/) | Binary search in sorted array |
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Classic binary search |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find Peak Element | [Link](https://leetcode.com/problems/find-peak-element/) | Binary search on unsorted array |
| Search in Rotated Sorted Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Binary search with rotation |
| Find Minimum in Rotated Sorted Array | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Binary search variation |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find K Closest Elements | [Link](https://leetcode.com/problems/find-k-closest-elements/) | This problem |
| Kth Smallest Element in a Sorted Matrix | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Similar binary search on value range |

---

## Video Tutorial Links

### Binary Search Technique

- [NeetCode - Find K Closest Elements](https://www.youtube.com/watch?v=AmjG-120C3w) - Clear explanation with visual examples
- [Find K Closest Elements - Back to Back SWE](https://www.youtube.com/watch?v=eyBhmDy72MQ) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=g0WPYeuCK34) - Official problem solution

### Alternative Approaches

- [Two Pointers Approach](https://www.youtube.com/watch?v=oXcG1gD6Q7M) - Understanding the two pointers technique
- [Heap Approach Explained](https://www.youtube.com/watch?v=K_lXb5E3GO4) - Heap-based solution

---

## Follow-up Questions

### Q1: Can you solve it in O(n) time without extra space?

**Answer:** Yes! The two-pointer approach achieves O(n) time and O(k) space. By starting with a window of size k and comparing distances, we can shrink the window by moving pointers inward. Each iteration compares one pair and reduces the window by 1.

---

### Q2: How would you handle duplicates in the array?

**Answer:** The solution naturally handles duplicates because we're comparing values, not indices. The binary search compares the actual distances, so duplicate values with the same distance are treated equally. The resulting window will be correct regardless of duplicates.

---

### Q3: What if x is outside the range of array elements?

**Answer:** The solution still works perfectly. If x is smaller than all elements, the binary search will naturally converge to the leftmost window. If x is larger than all elements, it converges to the rightmost window. This is because the comparison logic handles edge cases correctly.

---

### Q4: How would you modify to find elements within a specific range?

**Answer:** Instead of binary searching on position, you'd binary search on value range. Find the lower and upper bounds using separate binary searches, then extract elements within that range. This changes the problem significantly but uses similar principles.

---

### Q5: What edge cases should be tested?

**Answer:**
- k equals array length (return entire array)
- k equals 1 (return single closest element)
- x equals an element in the array
- x is outside array bounds (all elements on one side)
- Array has duplicates
- Array has only one element

---

### Q6: How would you return the indices instead of values?

**Answer:** After finding the starting index using binary search, return [left, left + k) as indices. The index is simply the starting position found by the algorithm. You can easily convert between indices and values using arr[index].

---

### Q7: Can you use binary search on value instead of position?

**Answer:** Yes, you could binary search on the value range (min to max element) and count how many elements fall within [mid, mid + k] in the sorted array. However, this is less efficient and more complex than the position-based approach.

---

## Common Pitfalls

### 1. Search Range
**Issue**: Forgetting that the starting position can only go up to len(arr) - k.

**Solution**: Initialize right = len(arr) - k to ensure the window doesn't overflow.

### 2. Comparison Logic
**Issue**: Using wrong comparison direction.

**Solution**: Remember: if x - arr[mid] > arr[mid + k] - x, then arr[mid + k] is closer, so we move left boundary right (left = mid + 1).

### 3. Integer Overflow
**Issue**: Potential overflow with large values in some languages.

**Solution:** Use long type or careful arithmetic. In Python, this is not an issue.

### 4. Window Size
**Issue**: Forgetting that we're searching for window START position, not directly for elements.

**Solution:** The final answer is arr[left:left + k], not just arr[left].

---

## Summary

The **Find K Closest Elements** problem demonstrates the power of binary search on a sorted array:

- **Binary Search**: Optimal with O(log(n-k) + k) time
- **Two Pointers**: Simple O(n) alternative
- **Heap-Based**: Different perspective with O(n log k)

The key insight is that the k closest elements form a contiguous subarray in a sorted array. By binary searching on the possible starting positions, we achieve optimal performance.

This problem is an excellent example of how understanding data properties (sorted array, contiguous window) leads to efficient algorithmic solutions.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-k-closest-elements/discuss/) - Community solutions and explanations
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Sliding Window Pattern](/patterns/sliding-window) - Related pattern guide
