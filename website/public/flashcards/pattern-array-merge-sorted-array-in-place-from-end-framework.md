## Array - Merge Sorted Array (In-place from End): Framework

What is the complete code template for merging two sorted arrays in-place from the end?

<!-- front -->

---

### Framework: Three Pointer from End

```
┌─────────────────────────────────────────────────────────────────────┐
│  MERGE SORTED ARRAY IN-PLACE - TEMPLATE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Key Insight: Merge from end to avoid overwriting unmerged elements │
│                                                                      │
│  1. Initialize three pointers:                                      │
│     - i = m - 1 (last valid element in nums1)                       │
│     - j = n - 1 (last element in nums2)                             │
│     - k = m + n - 1 (last position in merged array)                 │
│                                                                      │
│  2. While both arrays have elements:                                │
│     - Compare nums1[i] vs nums2[j]                                  │
│     - Place larger element at nums1[k]                              │
│     - Decrement pointer from array we took from                     │
│     - Decrement k                                                   │
│                                                                      │
│  3. Copy remaining elements from nums2 (if any):                    │
│     - while j >= 0: nums1[k--] = nums2[j--]                          │
│     - Note: nums1 elements already in place, no copy needed           │
│                                                                      │
│  4. Edge cases:                                                     │
│     - Empty nums2 (j starts negative): skip merge, done             │
│     - Empty nums1 valid elements (m=0): copy all nums2              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation Template

```python
def merge(nums1, m, nums2, n):
    """
    Merge nums2 into nums1 in-place.
    Time: O(m+n), Space: O(1)
    """
    # Three pointers starting from the end
    i = m - 1      # Last valid element in nums1
    j = n - 1      # Last element in nums2
    k = m + n - 1  # Last position in merged array
    
    # Merge while both have elements
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k] = nums1[i]
            i -= 1
        else:
            nums1[k] = nums2[j]
            j -= 1
        k -= 1
    
    # Copy remaining from nums2 (nums1 already in place)
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1
```

---

### Key Framework Elements

| Element | Purpose | Initial Value |
|---------|---------|---------------|
| `i` | Pointer for nums1 valid elements | `m - 1` |
| `j` | Pointer for nums2 elements | `n - 1` |
| `k` | Write position in merged array | `m + n - 1` |
| Loop condition | Process while both have elements | `i >= 0 and j >= 0` |
| Comparison | Pick larger element to maintain sort | `nums1[i] > nums2[j]` |
| Remainder handling | Only copy nums2 leftovers | `while j >= 0` |

---

### Python, Java, C++, JavaScript Comparison

```python
# Python - clean and concise
def merge(nums1, m, nums2, n):
    i, j, k = m - 1, n - 1, m + n - 1
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            nums1[k], i = nums1[i], i - 1
        else:
            nums1[k], j = nums2[j], j - 1
        k -= 1
    nums1[:k+1] = nums2[:j+1]  # Pythonic remainder copy
```

```java
// Java - explicit and verbose
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (i >= 0 && j >= 0) {
            nums1[k--] = (nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
        }
        while (j >= 0) {
            nums1[k--] = nums2[j--];
        }
    }
}
```

```cpp
// C++ - similar structure
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (i >= 0 && j >= 0) {
            nums1[k--] = (nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
        }
        while (j >= 0) nums1[k--] = nums2[j--];
    }
};
```

```javascript
// JavaScript - similar logic
function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (i >= 0 && j >= 0) {
        nums1[k--] = nums1[i] > nums2[j] ? nums1[i--] : nums2[j--];
    }
    while (j >= 0) nums1[k--] = nums2[j--];
}
```

<!-- back -->
