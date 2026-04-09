## Binary Search - Find Min/Max in Rotated Sorted Array: Core Concepts

What are the fundamental principles for finding min/max in a rotated sorted array?

<!-- front -->

---

### Core Concept

A **rotated sorted array** consists of two sorted subarrays joined at a pivot point. The **minimum element is always at the pivot**, and the **maximum is always right before it**.

**Example**: `[4, 5, 6, 7, 0, 1, 2]`
- Originally: `[0, 1, 2, 4, 5, 6, 7]` rotated at index 4
- Minimum: `0` at pivot index 4
- Maximum: `7` at index 3 (right before minimum)

---

### The "Aha!" Moments

1. **Two Sorted Subarrays**: A rotated array always contains two sorted portions
   ```
   [4, 5, 6, 7] | [0, 1, 2]
   ^sorted asc^   ^sorted asc^
   ```

2. **One Half Always Sorted**: At any point in binary search, one half is guaranteed to be sorted

3. **Compare with Right is Robust**: Checking `nums[mid] > nums[right]` reliably identifies which half contains the minimum

4. **Pivot = Rotation Count**: The minimum's index equals how many positions the array was rotated

---

### Decision Logic

```
nums = [4, 5, 6, 7, 0, 1, 2]
              mid
                |
Compare: nums[mid]=7 vs nums[right]=2

If nums[mid] > nums[right]:
   [4,5,6,7,0,1,2]
        ^   ^
       mid right
   
   The "drop" happens between mid and right
   → Minimum is in RIGHT half (mid+1 to right)
   → left = mid + 1

Else (nums[mid] <= nums[right]):
   The minimum is at mid or to the left
   → Minimum is in LEFT half (left to mid)
   → right = mid
```

---

### Key Properties

| Property | Description |
|----------|-------------|
| **Minimum Location** | Always at the pivot index |
| **Maximum Location** | Always at `(min_idx - 1) % n` |
| **Sorted Half** | One half is always sorted at each step |
| **Rotation Count** | Equals the minimum element's index |
| **Non-rotated Case** | Algorithm works on already-sorted arrays |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log n) | Binary search halves the search space |
| Space | O(1) | Only uses a few variables |
| Naive | O(n) | Linear scan to find min/max |

<!-- back -->
