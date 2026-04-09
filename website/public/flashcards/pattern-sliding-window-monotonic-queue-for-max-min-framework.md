## Sliding Window - Monotonic Queue for Max/Min: Framework

What is the complete code template for monotonic queue solutions?

<!-- front -->

---

### Framework: Monotonic Deque Template

```
┌─────────────────────────────────────────────────────────────────┐
│  MONOTONIC QUEUE - SLIDING WINDOW MAX/MIN                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Core Idea: Maintain a deque where elements are in sorted order │
│  (decreasing for max, increasing for min)                         │
│                                                                   │
│  1. Initialize empty deque to store INDICES                        │
│  2. For each element at index i:                                 │
│     a. Remove indices out of window: while dq[0] <= i - k       │
│     b. Remove worse elements: while dq and arr[dq[-1]] < arr[i] │
│     c. Add current index: dq.append(i)                           │
│     d. If window full (i >= k-1): result.append(arr[dq[0]])      │
│  3. Return result array                                           │
│                                                                   │
│  Key: Front always holds the window's extremum (max or min)      │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Maximum (Decreasing Deque)

```python
from collections import deque

def max_in_sliding_window(arr: list[int], k: int) -> list[int]:
    """
    Find maximum in each sliding window of size k.
    LeetCode 239 - Sliding Window Maximum
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    dq = deque()  # Stores indices, values in decreasing order
    
    for i in range(len(arr)):
        # Remove indices outside the window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices of elements smaller than current
        while dq and arr[dq[-1]] < arr[i]:
            dq.pop()
        
        dq.append(i)
        
        # Add to result once we have k elements
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

---

### Implementation: Minimum (Increasing Deque)

```python
def min_in_sliding_window(arr: list[int], k: int) -> list[int]:
    """
    Find minimum in each sliding window of size k.
    Time: O(n), Space: O(k)
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    result = []
    dq = deque()  # Stores indices, values in increasing order
    
    for i in range(len(arr)):
        # Remove indices outside the window
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Remove indices of elements larger than current (note: > for min)
        while dq and arr[dq[-1]] > arr[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(arr[dq[0]])
    
    return result
```

---

### Implementation: C++ Version

```cpp
#include <vector>
#include <deque>

std::vector<int> maxInWindow(const std::vector<int>& arr, int k) {
    if (arr.empty() || k <= 0 || k > arr.size()) return {};
    
    std::vector<int> result;
    std::deque<int> dq;  // Stores indices, decreasing values
    
    for (int i = 0; i < arr.size(); i++) {
        // Remove indices outside window
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        
        // Remove smaller elements
        while (!dq.empty() && arr[dq.back()] < arr[i])
            dq.pop_back();
        
        dq.push_back(i);
        
        if (i >= k - 1)
            result.push_back(arr[dq.front()]);
    }
    
    return result;
}
```

---

### Key Framework Elements

| Element | Purpose | Invariant |
|---------|---------|-----------|
| `dq` (deque) | Stores indices in sorted order | Values decrease from front to back (for max) |
| `dq[0]` | Front = current window max/min | Always the extremum of current window |
| `dq[0] <= i - k` | Window boundary check | Removes elements that left the window |
| `arr[dq[-1]] < arr[i]` | Monotonicity check | Removes elements that can't be future max |
| `i >= k - 1` | Window full check | Start recording results after first k-1 elements |

---

### Decision Tree: Max vs Min

```
Need to find in each window:
├── Maximum element?
│   └── Use DECREASING deque
│       └── Remove while arr[dq[-1]] < arr[i]
│       └── Front is always MAXIMUM
│
└── Minimum element?
    └── Use INCREASING deque
        └── Remove while arr[dq[-1]] > arr[i]
        └── Front is always MINIMUM
```

---

### Handling Duplicates

| Operator | Behavior | Use When |
|----------|----------|----------|
| `<` (strict) | Removes strictly smaller; keeps equal values | Want to keep duplicates in deque |
| `<=` | Removes smaller or equal; keeps only newest | Want only most recent of equal values |

```python
# For max: use < to keep duplicates
while dq and arr[dq[-1]] < arr[i]:  # Keep equal values
    dq.pop()

# For min: use > to keep duplicates  
while dq and arr[dq[-1]] > arr[i]:  # Keep equal values
    dq.pop()
```

<!-- back -->
