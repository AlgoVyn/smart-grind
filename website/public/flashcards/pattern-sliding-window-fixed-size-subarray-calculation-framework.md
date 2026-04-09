## Sliding Window - Fixed Size: Framework

What is the complete code template for fixed-size sliding window solutions?

<!-- front -->

---

### Framework: Basic Fixed-Size Sliding Window

```
┌─────────────────────────────────────────────────────────────────┐
│  FIXED-SIZE SLIDING WINDOW - BASIC TEMPLATE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Core Idea: O(n) calculation on every subarray of size k          │
│                                                                   │
│  1. Handle edge cases (empty array, k > n, k <= 0)              │
│  2. Compute initial window: sum/calc first k elements             │
│  3. Initialize result with initial window value                   │
│  4. Slide window from index k to n-1:                            │
│     a. Subtract element leaving: arr[i - k]                      │
│     b. Add element entering: arr[i]                              │
│     c. Update result (max, min, or store value)                 │
│  5. Return result                                                 │
│                                                                   │
│  Key Formula: window[i+1] = window[i] - outgoing + incoming      │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Maximum Sum Subarray (Size k)

```python
def max_sum_subarray(arr: list[int], k: int) -> int:
    """
    Find maximum sum of any contiguous subarray of size k.
    Time: O(n), Space: O(1)
    """
    if not arr or k <= 0 or k > len(arr):
        return 0
    
    # Initialize first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]  # incoming - outgoing
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

---

### Implementation: Averages of All Subarrays (Size k)

```python
def averages_of_subarrays(arr: list[int], k: int) -> list[float]:
    """
    Calculate average of every subarray of size k.
    Time: O(n), Space: O(n-k+1) for output
    """
    if not arr or k <= 0 or k > len(arr):
        return []
    
    window_sum = sum(arr[:k])
    result = [window_sum / k]
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        result.append(window_sum / k)
    
    return result
```

---

### Implementation: Generic Template (Multi-language)

````carousel
```python
def sliding_window_template(arr, k):
    """Generic fixed-size sliding window template."""
    if not arr or k <= 0 or k > len(arr):
        return None  # Handle edge cases
    
    # Initialize window calculation
    window_val = calculate_initial(arr, k)
    result = initialize_result(window_val)
    
    # Slide the window
    for i in range(k, len(arr)):
        # Remove outgoing element
        window_val = remove_outgoing(window_val, arr[i - k])
        # Add incoming element
        window_val = add_incoming(window_val, arr[i])
        # Update result
        result = update_result(result, window_val, i)
    
    return result

def calculate_initial(arr, k): return sum(arr[:k])
def remove_outgoing(val, elem): return val - elem
def add_incoming(val, elem): return val + elem
def initialize_result(val): return val
def update_result(res, val, idx): return max(res, val)
```
<!-- slide -->
```cpp
long long slidingWindowTemplate(const vector<int>& arr, int k) {
    if (arr.empty() || k <= 0 || k > arr.size()) return 0;
    
    // Initialize first window
    long long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    
    long long result = windowSum;
    
    // Slide the window
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        result = max(result, windowSum);
    }
    
    return result;
}
```
<!-- slide -->
```java
public long slidingWindowTemplate(int[] arr, int k) {
    if (arr == null || arr.length == 0 || k <= 0 || k > arr.length) 
        return 0;
    
    long windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    
    long result = windowSum;
    
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        result = Math.max(result, windowSum);
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function slidingWindowTemplate(arr, k) {
    if (!arr || arr.length === 0 || k <= 0 || k > arr.length) return 0;
    
    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += arr[i];
    
    let result = windowSum;
    
    for (let i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        result = Math.max(result, windowSum);
    }
    
    return result;
}
```
````

---

### Key Framework Elements

| Element | Purpose | Formula |
|---------|---------|---------|
| `window_sum` | Current window calculation | Running sum/metric |
| `result` | Final answer | Max/min/store of windows |
| `arr[i]` | Incoming element | Added when sliding |
| `arr[i-k]` | Outgoing element | Removed when sliding |
| Loop start | Index k (not 0) | First window already computed |

---

### Decision Tree: Which Approach?

```
Problem requires calculation on subarrays of size k?
├── Only need single result (max/min sum)
│   └── Basic sliding window: O(n) time, O(1) space
│
├── Need result for every window (averages, all max values)
│   └── Store results in array: O(n) space for output
│
├── Need max/min element in each window (not sum)
│   └── Monotonic deque: O(n) time, O(k) space
│
└── Multiple arbitrary range queries (different sizes)
    └── Prefix sums: O(n) preprocess, O(1) per query
```

<!-- back -->
