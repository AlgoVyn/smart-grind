# Rotate Array

## Category
Arrays & Strings

## Description

The Rotate Array problem requires rotating an array to the right by `k` positions in-place (without using extra space). This is a fundamental array manipulation technique commonly used in technical interviews and competitive programming. The most efficient solution uses the reversal algorithm to achieve O(n) time complexity with O(1) extra space.

This pattern appears frequently in problems involving array manipulation, string rotation, and cyclic permutations. The key insight is that rotating an array can be decomposed into three simple reversal operations, making it elegant to implement and understand.

---

## Concepts

The Rotate Array technique is built on several fundamental concepts that make it powerful for array manipulation problems.

### 1. Reversal Operations

A reversal flips elements in a range:

| Operation | Before | After | Effect |
|-----------|--------|-------|--------|
| **Reverse all** | [1,2,3,4,5] | [5,4,3,2,1] | Complete inversion |
| **Reverse first k** | [5,4,3,2,1] | [3,4,5,2,1] | Fix first k elements |
| **Reverse rest** | [3,4,5,2,1] | [3,4,5,1,2] | Fix remaining elements |

### 2. Modular Arithmetic

Handle rotation counts larger than array size:

```python
def normalize_k(n, k):
    """
    Normalize rotation count to handle k >= n.
    """
    return k % n  # Effective rotation is always within [0, n-1]
```

| k Value | n | Effective k | Result |
|---------|---|-------------|--------|
| 3 | 7 | 3 | Rotate by 3 |
| 10 | 7 | 3 | Rotate by 3 (10 % 7 = 3) |
| 7 | 7 | 0 | No rotation (full cycle) |

### 3. In-Place Manipulation

Modifying array without extra storage:

| Approach | Space | Method |
|----------|-------|--------|
| **Reversal** | O(1) | Element swaps |
| **Cyclic** | O(1) | Direct placement |
| **Extra array** | O(n) | Copy and shift |

### 4. Rotation Direction

| Direction | Operation | Formula |
|-----------|-----------|---------|
| **Right** | Move elements toward higher indices | `new_pos = (old_pos + k) % n` |
| **Left** | Move elements toward lower indices | `new_pos = (old_pos - k + n) % n` |

---

## Frameworks

Structured approaches for solving array rotation problems.

### Framework 1: Reversal Method (Recommended)

```
┌─────────────────────────────────────────────────────┐
│  ARRAY ROTATION - REVERSAL FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases:                               │
│     - Empty array or single element: return         │
│     - k = 0: no rotation needed                     │
│                                                      │
│  2. Normalize k: k = k % n                          │
│     - Handles k >= n                                │
│     - Returns 0 for full rotations                │
│                                                      │
│  3. Reverse entire array (index 0 to n-1)           │
│     - This brings last k elements to front          │
│                                                      │
│  4. Reverse first k elements (index 0 to k-1)       │
│     - Restores correct order for rotated portion    │
│                                                      │
│  5. Reverse remaining elements (index k to n-1)     │
│     - Restores correct order for rest of array      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard array rotation with in-place constraint.

### Framework 2: Cyclic Replacements

```
┌─────────────────────────────────────────────────────┐
│  CYCLIC REPLACEMENT FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Normalize k: k = k % n                          │
│                                                      │
│  2. Initialize:                                      │
│     - count = 0 (elements placed correctly)         │
│     - start = 0 (current cycle starting point)       │
│                                                      │
│  3. While count < n:                                 │
│     a. current = start                              │
│     b. prev = arr[start]                              │
│     c. Do:                                          │
│        - next_idx = (current + k) % n               │
│        - temp = arr[next_idx]                        │
│        - arr[next_idx] = prev                         │
│        - prev = temp                                  │
│        - current = next_idx                           │
│        - count += 1                                   │
│        - Until current == start (cycle complete)     │
│     d. start += 1 (next cycle)                       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Alternative approach, useful when tracking element movement.

### Framework 3: Juggling Algorithm (GCD-based)

```
┌─────────────────────────────────────────────────────┐
│  JUGGLING ALGORITHM FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  For left rotation:                                  │
│                                                      │
│  1. Compute g = GCD(k, n)                           │
│                                                      │
│  2. For i from 0 to g-1:                             │
│     a. temp = arr[i]                                │
│     b. j = i                                         │
│     c. While True:                                   │
│        - next_idx = (j + k) % n                     │
│        - If next_idx == i: break                     │
│        - arr[j] = arr[next_idx]                     │
│        - j = next_idx                                │
│     d. arr[j] = temp                                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Alternative for left rotation, educational purposes.

---

## Forms

Different manifestations of the array rotation pattern.

### Form 1: Right Rotation (Standard)

Rotate elements toward higher indices.

| Input | k | After Reverse All | After First k | After Rest | Result |
|-------|---|-------------------|---------------|------------|--------|
| [1,2,3,4,5,6,7] | 3 | [7,6,5,4,3,2,1] | [5,6,7,4,3,2,1] | [5,6,7,1,2,3,4] | [5,6,7,1,2,3,4] |
| [-1,-100,3,99] | 2 | [99,3,-100,-1] | [3,99,-100,-1] | [3,99,-1,-100] | [3,99,-1,-100] |

### Form 2: Left Rotation

Rotate elements toward lower indices.

```
Left rotation by k = Right rotation by (n - k)

Or using modified reversal:
1. Reverse first k
2. Reverse remaining n-k
3. Reverse all
```

### Form 3: String Rotation

Apply same logic to strings (after converting to list).

| String | k | After Rotation |
|--------|---|----------------|
| "hello" | 2 | "lohel" |
| "abcdef" | 3 | "defabc" |
| "rotate" | 4 | "aterot" |

### Form 4: Linked List Rotation

Rotate linked list by k places (LeetCode 61).

```
Approach:
1. Connect tail to head to form a cycle
2. Find new tail at position (n - k % n - 1)
3. Find new head at next position
4. Break the cycle at new tail
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Left Rotation Using Reversal

```python
def rotate_left(nums, k):
    """
    Rotate array to the left by k positions.
    Modified reversal order from right rotation.
    """
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
    
    # For left rotation: reverse(k, n-1), reverse(0, k-1), reverse(0, n-1)
    # Or equivalently:
    reverse(0, k - 1)        # Reverse first k
    reverse(k, n - 1)        # Reverse remaining
    reverse(0, n - 1)        # Reverse all


# Example
arr = [1, 2, 3, 4, 5, 6, 7]
rotate_left(arr, 3)
print(arr)  # [4, 5, 6, 7, 1, 2, 3]
```

### Tactic 2: Cyclic Replacement Approach

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
```

### Tactic 3: String Rotation Utility

```python
def rotate_string(s, k):
    """
    Rotate string to the right by k positions.
    """
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
```

### Tactic 4: Juggling Algorithm (Left Rotation)

```python
import math

def rotate_left_juggling(arr, k):
    """
    Rotate left using juggling algorithm based on GCD.
    """
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
```

### Tactic 5: Linked List Rotation

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def rotate_right_linked_list(head, k):
    """
    Rotate linked list to the right by k places.
    LeetCode 61 solution.
    """
    if not head or not head.next or k == 0:
        return head
    
    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    
    # Make it circular
    tail.next = head
    
    # Find new tail (at position length - k % length - 1)
    new_tail_pos = length - k % length - 1
    new_tail = head
    for _ in range(new_tail_pos):
        new_tail = new_tail.next
    
    # Find new head and break the cycle
    new_head = new_tail.next
    new_tail.next = None
    
    return new_head
```

---

## Python Templates

### Template 1: Reversal Algorithm (Right Rotation)

```python
def rotate(nums: list[int], k: int) -> None:
    """
    Rotate array to the right by k positions using reversal algorithm.
    Modifies array in-place.
    
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
    
    def reverse(start: int, end: int) -> None:
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
```

### Template 2: Left Rotation

```python
def rotate_left(nums: list[int], k: int) -> None:
    """
    Rotate array to the left by k positions.
    
    Args:
        nums: List of integers to rotate (modified in-place)
        k: Number of positions to rotate left
    
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    if n <= 1:
        return
    
    k = k % n
    if k == 0:
        return
    
    def reverse(start: int, end: int) -> None:
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    # For left rotation: reverse first k, reverse rest, reverse all
    reverse(0, k - 1)        # Reverse first k
    reverse(k, n - 1)        # Reverse remaining
    reverse(0, n - 1)        # Reverse all
```

### Template 3: Cyclic Replacements

```python
def rotate_cyclic(nums: list[int], k: int) -> None:
    """
    Rotate using cyclic replacements.
    Each element is placed directly in its final position.
    
    Args:
        nums: List of integers to rotate (modified in-place)
        k: Number of positions to rotate right
    
    Time: O(n), Space: O(1)
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
```

### Template 4: String Rotation

```python
def rotate_string(s: str, k: int) -> str:
    """
    Rotate string to the right by k positions.
    
    Args:
        s: Input string
        k: Number of positions to rotate right
    
    Returns:
        Rotated string
    
    Time: O(n), Space: O(n) for char array
    """
    chars = list(s)
    n = len(chars)
    
    if n <= 1:
        return s
    
    k = k % n
    if k == 0:
        return s
    
    def reverse(start: int, end: int) -> None:
        while start < end:
            chars[start], chars[end] = chars[end], chars[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)
    
    return ''.join(chars)
```

### Template 5: Linked List Rotation

```python
class ListNode:
    def __init__(self, val: int = 0, next=None):
        self.val = val
        self.next = next


def rotate_right_linked_list(head: ListNode, k: int) -> ListNode:
    """
    Rotate linked list to the right by k places.
    LeetCode 61 solution.
    
    Args:
        head: Head of linked list
        k: Number of positions to rotate right
    
    Returns:
        New head after rotation
    
    Time: O(n), Space: O(1)
    """
    if not head or not head.next or k == 0:
        return head
    
    # Find length and tail
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    
    # Normalize k
    k = k % length
    if k == 0:
        return head
    
    # Make it circular
    tail.next = head
    
    # Find new tail (at position length - k - 1)
    new_tail_pos = length - k - 1
    new_tail = head
    for _ in range(new_tail_pos):
        new_tail = new_tail.next
    
    # Find new head and break the cycle
    new_head = new_tail.next
    new_tail.next = None
    
    return new_head
```

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
| **Reversal Method** | O(n) | O(1) | Best for in-place rotation |
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

---

### Q2: What if the array contains duplicate elements? Does the algorithm still work?

**Answer:** 

Yes! The reversal algorithm works regardless of element values. It only manipulates positions, not values. Duplicates, negatives, zeros - all are handled correctly because we're just swapping elements based on indices.

---

### Q3: Can we use this algorithm for 2D array rotation?

**Answer:** 

For 2D arrays, rotation is more complex:
- **Layer-by-layer rotation**: Rotate elements in concentric layers
- **Transpose + Reverse**: Transpose matrix, then reverse rows (for 90° rotation)

The simple reversal trick doesn't directly apply, but similar concepts of position manipulation are used.

---

### Q4: What is the maximum value of k that the algorithm can handle?

**Answer:** 

The algorithm can handle any non-negative integer k because we normalize with `k = k % n`. 

- k = 0 to n-1: Direct rotation
- k >= n: Reduced to equivalent k % n
- Very large k (e.g., 10^18): Still O(1) to normalize, then O(n) to rotate

---

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
