# Heap - Two Heaps for Median Finding

## Problem Description

The Two Heaps pattern uses a max-heap and a min-heap to efficiently maintain the median of a stream of numbers. The max-heap stores the smaller half of numbers, and the min-heap stores the larger half. This ensures the median can be found in O(1) time after each insertion, making it ideal for real-time applications and streaming data.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(log n) for insertion, O(1) for median query |
| Space Complexity | O(n) to store all elements |
| Input | Stream of numbers |
| Output | Running median |
| Approach | Max-heap (lower half) + Min-heap (upper half) |

### When to Use

- Finding median from a data stream
- Sliding window median problems
- Real-time statistics computation
- Online algorithms requiring median
- Dynamic median maintenance
- When insertions are frequent, median queries are interleaved

## Intuition

The key insight is that by maintaining two balanced heaps, the median is always at the top of one or both heaps.

The "aha!" moments:

1. **Split in half**: Lower half in max-heap, upper half in min-heap
2. **Balanced sizes**: Heaps differ by at most 1 element
3. **Max-heap root**: Largest element in lower half
4. **Min-heap root**: Smallest element in upper half
5. **Median access**: Top of larger heap, or average of both tops

## Solution Approaches

### Approach 1: Two Heaps (Standard) ✅ Recommended

#### Algorithm

1. **Insertion**:
   - Add to max-heap (lower half)
   - Move max of lower half to min-heap (balance)
   - If min-heap larger, move min back to max-heap (size rebalance)
2. **Find Median**:
   - If heaps equal size: average of both tops
   - If max-heap larger: top of max-heap

#### Implementation

````carousel
```python
import heapq

class MedianFinder:
    """
    Find median from data stream using two heaps.
    LeetCode 295 - Find Median from Data Stream
    Time: O(log n) add, O(1) find, Space: O(n)
    """
    
    def __init__(self):
        # Max-heap for lower half (negate values for Python)
        self.lower = []
        # Min-heap for upper half
        self.upper = []
    
    def addNum(self, num: int) -> None:
        # Add to max-heap (lower half)
        heapq.heappush(self.lower, -num)
        
        # Balance: move largest from lower to upper
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        
        # Size rebalance: lower half should be >= upper half
        if len(self.lower) < len(self.upper):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))
    
    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        else:
            return (-self.lower[0] + self.upper[0]) / 2


# Alternative with explicit size handling
class MedianFinderAlt:
    def __init__(self):
        self.small = []  # Max heap (negated)
        self.large = []  # Min heap
    
    def addNum(self, num):
        if len(self.small) == len(self.large):
            # Push to small via large
            heapq.heappush(self.large, num)
            heapq.heappush(self.small, -heapq.heappop(self.large))
        else:
            # Push to large via small
            heapq.heappush(self.small, -num)
            heapq.heappush(self.large, -heapq.heappop(self.small))
    
    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```
<!-- slide -->
```cpp
class MedianFinder {
private:
    priority_queue<int> lower;  // max heap
    priority_queue<int, vector<int>, greater<int>> upper;  // min heap

public:
    MedianFinder() {}
    
    void addNum(int num) {
        // Add to lower (max heap)
        lower.push(num);
        
        // Balance: move largest from lower to upper
        upper.push(lower.top());
        lower.pop();
        
        // Size rebalance
        if (lower.size() < upper.size()) {
            lower.push(upper.top());
            upper.pop();
        }
    }
    
    double findMedian() {
        if (lower.size() > upper.size()) {
            return lower.top();
        }
        return (lower.top() + upper.top()) / 2.0;
    }
};
```
<!-- slide -->
```java
class MedianFinder {
    private PriorityQueue<Integer> lower;  // max heap
    private PriorityQueue<Integer> upper;  // min heap
    
    public MedianFinder() {
        lower = new PriorityQueue<>(Collections.reverseOrder());
        upper = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        // Add to lower
        lower.offer(num);
        
        // Balance: move to upper
        upper.offer(lower.poll());
        
        // Size rebalance
        if (lower.size() < upper.size()) {
            lower.offer(upper.poll());
        }
    }
    
    public double findMedian() {
        if (lower.size() > upper.size()) {
            return lower.peek();
        }
        return (lower.peek() + upper.peek()) / 2.0;
    }
}
```
<!-- slide -->
```javascript
/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
var MedianFinder = function() {
    this.lower = [];  // Max heap (negated)
    this.upper = [];  // Min heap
};

/** 
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
    // Add to lower
    this.lower.push(-num);
    this.lower.sort((a, b) => b - a);  // Maintain max heap
    
    // Balance: move to upper
    this.upper.push(-this.lower.shift());
    this.upper.sort((a, b) => a - b);  // Maintain min heap
    
    // Size rebalance
    if (this.lower.length < this.upper.length) {
        this.lower.push(-this.upper.shift());
        this.lower.sort((a, b) => b - a);
    }
};

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
    if (this.lower.length > this.upper.length) {
        return -this.lower[0];
    }
    return (-this.lower[0] + this.upper[0]) / 2;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) for addNum, O(1) for findMedian |
| Space | O(n) - Store all elements in heaps |

### Approach 2: Sliding Window Median

Using two heaps with lazy deletion for sliding window.

#### Implementation

````carousel
```python
from collections import defaultdict
import heapq

def median_sliding_window(nums: list[int], k: int) -> list[float]:
    """
    LeetCode 480 - Sliding Window Median
    Time: O(n log k), Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    def prune(heap, delayed):
        """Remove invalid elements from heap top."""
        while heap:
            num = -heap[0] if heap is small else heap[0]
            if delayed[num]:
                heapq.heappop(heap)
                delayed[num] -= 1
            else:
                break
    
    def make_balance():
        """Balance the two heaps."""
        if len(small) > len(large) + 1:
            delayed[-small[0]] += 1
            heapq.heappush(large, -heapq.heappop(small))
            prune(small, delayed)
        elif len(small) < len(large):
            delayed[large[0]] += 1
            heapq.heappush(small, -heapq.heappop(large))
            prune(large, delayed)
    
    def get_median():
        """Get current median."""
        if k % 2 == 1:
            return float(-small[0])
        return (-small[0] + large[0]) / 2
    
    small, large = [], []  # max heap, min heap
    delayed = defaultdict(int)
    result = []
    
    # Initialize first window
    for i in range(k):
        heapq.heappush(small, -nums[i])
    for _ in range(k - k // 2):
        heapq.heappush(large, -heapq.heappop(small))
    
    result.append(get_median())
    
    # Slide window
    for i in range(k, len(nums)):
        # Add new element
        if nums[i] <= -small[0]:
            heapq.heappush(small, -nums[i])
        else:
            heapq.heappush(large, nums[i])
        
        # Remove old element
        out_num = nums[i - k]
        if out_num <= -small[0]:
            delayed[out_num] += 1
            if out_num == -small[0]:
                prune(small, delayed)
        else:
            delayed[out_num] += 1
            if large and out_num == large[0]:
                prune(large, delayed)
        
        make_balance()
        result.append(get_median())
    
    return result
```
<!-- slide -->
```cpp
class Solution {
public:
    vector<double> medianSlidingWindow(vector<int>& nums, int k) {
        vector<double> res;
        multiset<int> small, large;
        
        for (int i = 0; i < nums.size(); ++i) {
            // Remove element out of window
            if (i >= k) {
                if (small.count(nums[i - k])) {
                    small.erase(small.find(nums[i - k]));
                } else {
                    large.erase(large.find(nums[i - k]));
                }
            }
            
            // Add new element
            if (small.empty() || nums[i] <= *small.rbegin()) {
                small.insert(nums[i]);
            } else {
                large.insert(nums[i]);
            }
            
            // Balance
            if (small.size() > large.size() + 1) {
                large.insert(*small.rbegin());
                small.erase(prev(small.end()));
            } else if (small.size() < large.size()) {
                small.insert(*large.begin());
                large.erase(large.begin());
            }
            
            // Record median
            if (i >= k - 1) {
                if (k % 2 == 1) {
                    res.push_back(*small.rbegin());
                } else {
                    res.push_back(((double)*small.rbegin() + *large.begin()) / 2.0);
                }
            }
        }
        
        return res;
    }
};
```
<!-- slide -->
```java
class Solution {
    public double[] medianSlidingWindow(int[] nums, int k) {
        double[] res = new double[nums.length - k + 1];
        
        // Use TreeSet with custom comparator for duplicates
        TreeSet<Integer> small = new TreeSet<>((a, b) -> nums[a] != nums[b] ? 
            Integer.compare(nums[b], nums[a]) : Integer.compare(a, b));
        TreeSet<Integer> large = new TreeSet<>((a, b) -> nums[a] != nums[b] ?
            Integer.compare(nums[a], nums[b]) : Integer.compare(a, b));
        
        int idx = 0;
        for (int i = 0; i < nums.length; i++) {
            // Remove out of window
            if (i >= k) {
                if (small.remove(i - k)) {
                    // removed from small
                } else {
                    large.remove(i - k);
                }
            }
            
            // Add new element
            if (small.isEmpty() || nums[i] <= nums[small.first()]) {
                small.add(i);
            } else {
                large.add(i);
            }
            
            // Balance
            if (small.size() > large.size() + 1) {
                large.add(small.pollFirst());
            } else if (small.size() < large.size()) {
                small.add(large.pollFirst());
            }
            
            // Record median
            if (i >= k - 1) {
                if (k % 2 == 1) {
                    res[idx++] = nums[small.first()];
                } else {
                    res[idx++] = ((double)nums[small.first()] + nums[large.first()]) / 2.0;
                }
            }
        }
        
        return res;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function medianSlidingWindow(nums, k) {
    const res = [];
    
    // Using sorted array approach (simpler for JS)
    const window = [];
    
    const getMedian = () => {
        const mid = Math.floor(k / 2);
        if (k % 2 === 1) {
            return window[mid];
        }
        return (window[mid - 1] + window[mid]) / 2;
    };
    
    const insert = (num) => {
        let left = 0, right = window.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (window[mid] < num) left = mid + 1;
            else right = mid;
        }
        window.splice(left, 0, num);
    };
    
    const remove = (num) => {
        const idx = window.indexOf(num);
        window.splice(idx, 1);
    };
    
    for (let i = 0; i < nums.length; i++) {
        insert(nums[i]);
        
        if (window.length > k) {
            remove(nums[i - k]);
        }
        
        if (window.length === k) {
            res.push(getMedian());
        }
    }
    
    return res;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log k) - n elements, window size k |
| Space | O(k) - Two heaps of size k |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Two Heaps | O(log n) add, O(1) query | O(n) | **Recommended** - Standard data stream |
| With Lazy Deletion | O(log k) | O(k) | Sliding window |
| Order Statistic Tree | O(log n) | O(n) | When available (C++ policy-based) |
| Sorted List | O(n) insert | O(n) | Simple cases, small n |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | 295 | Hard | Classic two heaps |
| [Sliding Window Median](https://leetcode.com/problems/sliding-window-median/) | 480 | Hard | With lazy deletion |
| [Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) | 4 | Hard | Binary search approach |
| [Statistics from a Large Sample](https://leetcode.com/problems/statistics-from-a-large-sample/) | 1093 | Medium | Counting sort variant |
| [The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) | 218 | Hard | Heap application |

## Video Tutorial Links

1. **[NeetCode - Find Median from Data Stream](https://www.youtube.com/watch?v=itmhHWaHupI)** - Two heaps approach
2. **[Kevin Naughton Jr. - Sliding Window Median](https://www.youtube.com/watch?v=K1iNw-_SXwA)** - Advanced heap usage
3. **[Back To Back SWE - Median of Stream](https://www.youtube.com/watch?v=1LkOrc-Le-Y)** - Pattern explanation

## Summary

### Key Takeaways

- **Two heaps**: Max-heap for lower half, min-heap for upper half
- **Balance**: Heaps differ by at most 1 element
- **O(log n) insertion**: Heap operations are logarithmic
- **O(1) median**: Direct access to heap tops
- **Python trick**: Negate values for max-heap behavior

### Common Pitfalls

- Forgetting to negate values in Python max-heap
- Incorrect heap balancing (size difference > 1)
- Not handling equal size case for even number of elements
- Floating point precision when averaging
- Not using 2.0 division for Python 2 compatibility
- Lazy deletion complexity in sliding window

### Follow-up Questions

1. **What if we need to delete elements?**
   - Use lazy deletion with hash map

2. **Can we do better than O(log n) insertion?**
   - No for comparison-based, but counting sort works for integers

3. **How to handle duplicates?**
   - Store indices along with values for unique identification

4. **What about other percentiles?**
   - Use order statistic tree or multiple heaps

## Pattern Source

[Heap - Two Heaps for Median Finding](patterns/heap-two-heaps-for-median-finding.md)
