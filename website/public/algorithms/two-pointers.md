# Two-Pointer Algorithm

## Introduction

At its core, the **Two Pointers** technique is a method of optimizing a search space. In competitive programming, when faced with an $O(N^2)$ brute-force solution involving nested loops over an array, the Two Pointers technique often reduces the time complexity to $O(N)$ or $O(N \log N)$ (if sorting is required). It achieves this by maintaining two indices (pointers) that traverse the data structure simultaneously, pruning the search space based on mathematical properties like **monotonicity**.

The two-pointer technique is a foundational algorithmic pattern used to traverse data structures (arrays, strings, linked lists) efficiently. By using two indices to process data simultaneously, you can often optimize brute-force $O(N^2)$ solutions down to $O(N)$ time complexity, while maintaining $O(1)$ space complexity.

This tutorial breaks down the technique into Core Patterns, Core Variations, Advanced Patterns, and Advanced Variations.

---

## Part 1: The Core Patterns

### 1. Opposite Ends (Meet in the Middle)

This is the quintessential two-pointer approach. You place one pointer at the beginning and the other at the end of the data structure, moving them inward until they meet.

* **How it works:** Initialize `left = 0` and `right = length - 1`. Evaluate the elements at both pointers. Based on your logic (e.g., if the sum is too small, increment `left`; if too large, decrement `right`), move the pointers toward the center.
* **When to use it:** When working with sorted arrays or evaluating symmetrical properties.
* **Classic Problem:** Two Sum II, Valid Palindrome.

**Visualization:**
```text
[ 1,  2,  3,  4,  5,  6 ]
  ^                   ^
 left               right  --> sum = 7
```

**Template (Python):**
```python
def opposite_ends(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target:
            return sum([left, right])
        elif current < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
```
> [!NOTE]
> **Complexity:** Time $O(N)$ assuming array is sorted; Space $O(1)$.

### 2. Fast and Slow Pointers (Tortoise and Hare)

Both pointers start at the beginning, but they travel at different speeds. The "slow" pointer usually moves one step at a time, while the "fast" pointer moves two steps.

* **How it works:** Initialize `slow = head` and `fast = head`. In a loop, update `slow = slow.next` and `fast = fast.next.next`. 
* **When to use it:** Almost exclusively for Linked Lists to detect cycles, find the midpoint, or determine length properties without knowing the size in advance.
* **Classic Problem:** Linked List Cycle, Middle of the Linked List.

**Visualization:**
```text
Step 1: S,F -> node1 -> node2 -> node3
Step 2:        node1 -> S     -> F
```

**Template (Python):**
```python
def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True # Cycle detected
    return False
```
> [!NOTE]
> **Complexity:** Time $O(N)$; Space $O(1)$.

### 3. Same Direction (Reader / Writer)

Both pointers start at the beginning and move in the same direction, but they have different roles. One reads the data, and the other writes or modifies it.

* **How it works:** Initialize `writer = 0`. Use a `reader` in a standard loop to scan the array. When the `reader` finds an element that meets your criteria, place it at the `writer` index and increment the `writer`.
* **When to use it:** When you need to partition data, filter elements, or modify an array strictly in-place.
* **Classic Problem:** Remove Duplicates, Move Zeroes.

**Visualization:**
```text
Array: [1, 1, 2, 3]
R=0, W=0 -> keep 1 (W increments to 1)
R=1, obj is duplicate -> skip
R=2, W=1 -> write 2 at W (W increments to 2)
```

**Template (Python):**
```python
def remove_duplicates(nums):
    if not nums: return 0
    writer = 1
    for reader in range(1, len(nums)):
        if nums[reader] != nums[reader - 1]:
            nums[writer] = nums[reader]
            writer += 1
    return writer # Returns new length
```
> [!NOTE]
> **Complexity:** Time $O(N)$; Space $O(1)$ (in-place modification).

### 4. Two Iterables (Merging)

Instead of traversing one dataset, you use two pointers to independently traverse two separate, usually sorted, datasets.

* **How it works:** Initialize `p1 = 0` for the first array and `p2 = 0` for the second. Compare the elements at both pointers. Advance the pointer that contains the smaller (or larger, depending on the goal) value.
* **When to use it:** When merging, comparing, or finding intersections between two separate sorted arrays.
* **Classic Problem:** Merge Sorted Arrays, Array Intersection.

**Visualization:**
```text
Arr1: [1, 3, 5] (p1 at 1)
Arr2: [2, 4, 6] (p2 at 2)
Merged: [1] -> Advance p1. 
Merged: [1, 2] -> Advance p2.
```

**Template (Python):**
```python
def merge_arrays(arr1, arr2):
    p1, p2 = 0, 0
    merged = []
    while p1 < len(arr1) and p2 < len(arr2):
        if arr1[p1] < arr2[p2]:
            merged.append(arr1[p1])
            p1 += 1
        else:
            merged.append(arr2[p2])
            p2 += 1
    # Append any remaining elements
    merged.extend(arr1[p1:])
    merged.extend(arr2[p2:])
    return merged
```
> [!NOTE]
> **Complexity:** Time $O(N + M)$; Space $O(N + M)$ for the new array.

---

## Part 2: Variations of Core Patterns

### 5. The Sliding Window (Dynamic Same-Direction)

A massive variation of the same-direction pattern where the two pointers create a "window" of valid elements between them.

* **How it works:** The `right` pointer expands the window to add new elements. If the window violates a specific constraint, the `left` pointer moves forward to shrink the window until it is valid again.
* **When to use it:** Finding the longest, shortest, or specific contiguous subarray or substring.
* **Classic Problem:** Longest Substring Without Repeating Characters.

**Visualization:**
```text
"abcabc"
[a]     -> window valid, right++
[a b]   -> window valid, right++
[a b c] -> window valid, right++
a [b c a] -> duplicate 'a', left moves to remove first 'a'
```

**Template (Python):**
```python
def sliding_window(s):
    left = 0
    max_len = 0
    seen = set()
    
    for right in range(len(s)):
        # Shrink window until condition is met
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
            
        # Add current element & update result
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)
        
    return max_len
```
> [!NOTE]
> **Complexity:** Time $O(N)$; Space $O(K)$ where K is charset size.

### 6. Fix One, Move Two (3-Pointers)

An extension of the Opposite Ends pattern used to find triplets.

* **How it works:** Sort the array. Iterate through with a standard `for` loop to "fix" one element. For the remainder of the array to the right of your fixed element, use the Opposite Ends pointers (`left` and `right`) to find the remaining two numbers.
* **When to use it:** Solving 3Sum, 3Sum Closest, or 4Sum (which requires fixing two elements).
* **Classic Problem:** 3Sum.

**Visualization:**
```text
Sorted Array: [-4, -1, -1, 0, 1, 2]
Fixed: -4 (i=0) -> Target for remaining = 4
Remaining: [-1, -1, 0, 1, 2]
             ^              ^
            left          right (Search for Sum=4 here)
```

**Template (Python):**
```python
def three_sum(nums):
    nums.sort()
    res = []
    
    for i in range(len(nums) - 2):
        # Skip duplicates for the fixed element
        if i > 0 and nums[i] == nums[i-1]:
            continue
            
        left, right = i + 1, len(nums) - 1
        while left < right:
            current = nums[i] + nums[left] + nums[right]
            if current == 0:
                res.append([nums[i], nums[left], nums[right]])
                left += 1; right -= 1
                # Skip duplicates for internal pointers
                while left < right and nums[left] == nums[left - 1]: left += 1
                while left < right and nums[right] == nums[right + 1]: right -= 1
            elif current < 0:
                left += 1
            else:
                right -= 1
    return res
```
> [!NOTE]
> **Complexity:** Time $O(N^2)$; Space $O(1)$ or $O(N)$ depending on sort implementation.

### 7. Moving Backwards

Both pointers start at the very end of the datasets and move left toward the beginning.

* **How it works:** Initialize pointers at the final indices of your arrays or strings and decrement them.
* **When to use it:** When merging into an array that has empty buffer space at the end, preventing you from overwriting unprocessed data. It is also useful for string problems involving "backspace" characters.
* **Classic Problem:** Merge Sorted Array (In-Place).

**Visualization:**
```text
nums1 = [1, 2, 3, 0, 0, 0], m = 3
nums2 = [2, 5, 6],          n = 3
                ^        ^
               p1       writer(p)
                  ^
                 p2
Largest (6) goes to end, bypassing overwrites.
```

**Template (Python):**
```python
def merge_backwards(nums1, m, nums2, n):
    p1, p2, p = m - 1, n - 1, m + n - 1
    
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
        
    # Fill remaining from nums2
    while p2 >= 0:
        nums1[p] = nums2[p2]
        p -= 1; p2 -= 1
```
> [!NOTE]
> **Complexity:** Time $O(N+M)$; Space $O(1)$.

---

## Part 3: Advanced Patterns

### 8. Center-Out Expansion

The reverse of Opposite Ends. Both pointers start at the same location (the middle) and step outwards in opposite directions.

* **How it works:** Treat every index (and the space between indices) as a potential center. Place `left` and `right` at the center and expand them (`left--`, `right++`) as long as the elements match.
* **When to use it:** Specifically for identifying or counting palindromes within strings.
* **Classic Problem:** Longest Palindromic Substring.

**Visualization:**
```text
"racecar"
   ^
 center (e)
  <->
 left/right expand out symmetrically
```

**Template (Python):**
```python
def longest_palindrome(s):
    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]

    res = ""
    for i in range(len(s)):
        # Odd length palindrome
        odd = expand_around_center(i, i)
        # Even length palindrome
        even = expand_around_center(i, i + 1)
        res = max(res, odd, even, key=len)
    return res
```
> [!NOTE]
> **Complexity:** Time $O(N^2)$; Space $O(1)$.

### 9. Monotonic Deque

An advanced Sliding Window that uses a Double-Ended Queue (Deque) to store indices in a strictly increasing or decreasing order.

* **How it works:** As the `right` pointer moves, remove elements from the back of the deque that break the monotonic rule. When the `left` pointer moves, remove the front of the deque if it falls outside the current window bounds.
* **When to use it:** Finding the maximum or minimum value within a sliding window in strict $O(N)$ time.
* **Classic Problem:** Sliding Window Maximum.

**Visualization:**
```text
[1,  3, -1, -3,  5,  3,  6,  7], k = 3
Push 3 -> [3] is max.
Push -1 -> [-1 < 3], Deque handles: [idx(3), idx(-1)]. Max is still front.
Push 5 -> [5 > -1, 3], pop all smaller. Deque: [idx(5)]. Max is front.
```

**Template (Python):**
```python
from collections import deque

def max_sliding_window(nums, k):
    q = deque() # Stores *indices* strictly monotonically decreasing
    res = []
    
    for i, num in enumerate(nums):
        # Remove elements out of window range
        if q and q[0] < i - k + 1:
            q.popleft()
            
        # Maintain monotonic property
        while q and nums[q[-1]] <= num:
            q.pop()
            
        q.append(i)
        
        # Add to result once window hits size k
        if i >= k - 1:
            res.append(nums[q[0]])
            
    return res
```
> [!NOTE]
> **Complexity:** Time $O(N)$; Space $O(K)$ where K is the window size.

### 10. K-Way Merge (K-Pointers)

Scaling up the Two Iterables pattern to $K$ arrays. Because comparing $K$ pointers manually takes $O(K)$ time, this requires a Min-Heap.

* **How it works:** Place a pointer at the start of $K$ arrays. Push all pointer values into a Min-Heap. Pop the smallest value, add it to the result, and advance the specific pointer that the popped value belonged to.
* **When to use it:** Merging multiple sorted datasets.
* **Classic Problem:** Merge K Sorted Lists.

**Template (Python):**
```python
import heapq

def merge_k_arrays(arrays):
    min_heap = []
    res = []
    
    # Push initial pointer from each array
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(min_heap, (arr[0], i, 0)) # (value, list_idx, element_idx)
            
    while min_heap:
        val, list_idx, element_idx = heapq.heappop(min_heap)
        res.append(val)
        
        # Advance pointer for the array we just pulled from
        if element_idx + 1 < len(arrays[list_idx]):
            next_tuple = (arrays[list_idx][element_idx + 1], list_idx, element_idx + 1)
            heapq.heappush(min_heap, next_tuple)
            
    return res
```
> [!NOTE]
> **Complexity:** Time $O(N \log K)$ where N is total elements; Space $O(K)$ for the heap.

---

## Part 4: Advanced Variations

### 11. Multi-Way Partitioning (Dutch National Flag)

An in-place pattern using three pointers simultaneously to manage three distinct zones within a single array.

* **How it works:** Use a `low` pointer for the boundary of the first group, a `high` pointer for the last group, and a `mid` reader pointer. As `mid` scans, it swaps elements to the `low` or `high` boundaries based on their value.
* **When to use it:** Grouping an array into exactly three categories in a single $O(N)$ pass.
* **Classic Problem:** Sort Colors.

**Visualization:**
```text
[0s ... low-1] | [1s ... mid-1] | [unprocessed ... high] | [2s ... end]
Swapping 0s down via `low`, 2s up via `high`.
```

**Template (Python):**
```python
def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[high], nums[mid] = nums[mid], nums[high]
            high -= 1
```
> [!NOTE]
> **Complexity:** Time $O(N)$; Space $O(1)$.

### 12. 2D Sliding Window & Matrix Pointers
Taking 1D sliding windows and applying them to a 2D matrix.

* **How it works:** Fix the top and bottom boundaries of a matrix using two outer pointers (creating a horizontal band of rows). Then, run a standard 1D sliding window horizontally across that isolated band.
* **When to use it:** Finding target-sum submatrices or largest subgrids.
* **Classic Problem:** Number of Submatrices That Sum to Target, Maximum Sum Rectangular Submatrix.

**Visualization:**
```text
Row 0: [ ^                  ] <- Top Boundary
Row 1: [   band of values   ] 
Row 2: [ v                  ] <- Bottom Boundary
Reduce to 1D Array via column-wise sums. Then apply standard 1D technique.
```

**Template (Python - 2D Kadane logic):**
```python
def max_submatrix(matrix):
    ROWS, COLS = len(matrix), len(matrix[0])
    max_sum = float('-inf')
    
    # Top boundary
    for top in range(ROWS):
        col_sums = [0] * COLS
        # Bottom boundary expands downwards
        for bottom in range(top, ROWS):
            # Form 1D representation by adding rows
            for c in range(COLS):
                col_sums[c] += matrix[bottom][c]
                
            # Now run 1D Sliding Window / Kadane's on col_sums
            curr, local_max = 0, float('-inf')
            for val in col_sums:
                curr = max(val, curr + val)
                local_max = max(local_max, curr)
                
            max_sum = max(max_sum, local_max)
            
    return max_sum
```
> [!NOTE]
> **Complexity:** Time $O(R^2 \times C)$; Space $O(C)$ for column sums.

### 13. Prefix State + Hash Map (The O(N) Prefix Pointer)
Replacing the "left" pointer of a sliding window entirely with a Hash Map to handle arrays with negative numbers.

* **How it works:** Calculate the running prefix sum with your `right` pointer. Use the formula `Current Sum - Target = Needed Prefix`. Check the Hash Map to see if you have encountered that prefix before; if so, a valid subarray exists between that old prefix and your current pointer.
* **When to use it:** Finding subarray sums when the array contains negative numbers (which breaks standard sliding window logic because extending the window doesn't uniformly increase the sum).
* **Classic Problem:** Subarray Sum Equals K.

**Visualization:**
```text
Array: [1, -5, 2,  3], Target = -3
Pre:  [0, 1,-4,-2,  1] -> Need "Current - (-3)" in Prefix map.
```

**Template (Python):**
```python
def subarray_sum(nums, k):
    prefix_counts = {0: 1} # Initialize to catch arrays starting from idx 0
    current_sum = 0
    res = 0
    
    for num in nums:
        current_sum += num
        needed_prefix = current_sum - k
        
        # Has this needed prefix been seen before?
        if needed_prefix in prefix_counts:
            res += prefix_counts[needed_prefix]
            
        # Add current sum to map
        prefix_counts[current_sum] = prefix_counts.get(current_sum, 0) + 1
        
    return res
```
> [!NOTE]
> **Complexity:** Time $O(N)$; Space $O(N)$.

> [!TIP]
> **Mastery Note:** The key to mastering the two-pointer algorithm is not memorizing the code, but recognizing the *triggers* in a problem description. Words like "sorted", "in-place", "contiguous subarray", or "pairs/triplets" are massive hints that a two-pointer approach is expected.

---

## Summary

The **Two Pointers** algorithm is fundamental to competitive programming because it safely prunes massive combinatorial spaces using domain knowledge (sorting/order).
