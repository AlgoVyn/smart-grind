# Two Pointers

## Category
Arrays & Strings

## Description

The Two Pointers technique is a method of optimizing search space traversal. When faced with O(n²) brute-force solutions involving nested loops over an array, Two Pointers often reduces time complexity to O(n) or O(n log n) (if sorting is required). It achieves this by maintaining two indices (pointers) that traverse the data structure simultaneously, pruning the search space based on mathematical properties like monotonicity.

This technique is fundamental for competitive programming and technical interviews. By using two indices to process data simultaneously, you can often optimize brute-force O(n²) solutions down to O(n) time complexity while maintaining O(1) space complexity. The technique is particularly powerful when working with sorted arrays, strings, and linked lists.

---

## Concepts

The Two Pointers technique is built on several fundamental concepts that make it powerful for solving array and string problems efficiently.

### 1. Pointer Movement Patterns

Different movement patterns for the two pointers based on problem requirements.

| Pattern | Movement | When to Use | Example |
|---------|----------|-------------|---------|
| **Opposite Ends** | left=0, right=n-1, move toward center | Sorted arrays, finding pairs | Two Sum II, Valid Palindrome |
| **Fast and Slow** | slow moves 1 step, fast moves 2 steps | Linked Lists, cycle detection | Detect Cycle, Find Middle |
| **Same Direction** | Both start at 0, reader moves ahead | Array modification, filtering | Remove Duplicates, Move Zeroes |
| **Two Iterables** | p1 on array1, p2 on array2 | Merging sorted arrays | Merge Sorted Arrays |

### 2. Monotonicity Property

Many two-pointer problems leverage sorted data:

```
If array is sorted: arr[i] ≤ arr[i+1] for all i
→ Moving left pointer increases value
→ Moving right pointer decreases value
```

This property allows us to make decisions about which pointer to move based on comparisons.

### 3. Invariants and Conditions

Common conditions that must be maintained:

- **Sum Constraint**: `arr[left] + arr[right] == target`
- **Window Size**: `right - left + 1 <= k`
- **Unique Elements**: `arr[left] != arr[right]` (for some problems)
- **Sorted Order**: Array must be sorted for opposite ends pattern

### 4. State Tracking

Track additional state during traversal:

| State Type | Description | Use Case |
|------------|-------------|----------|
| **Count** | Number of valid elements | Remove duplicates |
| **Sum** | Running total of window | Two Sum, 3Sum |
| **Product** | Running multiplication | Subarray product |
| **Frequency Map** | Character/element counts | Anagram problems |

---

## Frameworks

Structured approaches for solving two-pointer problems.

### Framework 1: Opposite Ends (Meet in the Middle)

```
┌─────────────────────────────────────────────────────┐
│  OPPOSITE ENDS TWO-POINTER FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Sort array (if not already sorted)             │
│  2. Initialize: left = 0, right = n - 1              │
│  3. While left < right:                              │
│     a. Calculate current = arr[left] + arr[right]    │
│     b. If current == target: return result         │
│     c. If current < target: left++ (need larger)     │
│     d. If current > target: right-- (need smaller)   │
│  4. Return result (or not found indicator)           │
└─────────────────────────────────────────────────────┘
```

**When to use**: Sorted arrays, finding pairs that satisfy a condition, palindrome checking.

### Framework 2: Fast and Slow Pointers

```
┌─────────────────────────────────────────────────────┐
│  FAST AND SLOW POINTER FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize: slow = head, fast = head             │
│  2. While fast and fast.next exist:                │
│     a. Move slow one step: slow = slow.next        │
│     b. Move fast two steps: fast = fast.next.next  │
│     c. If slow == fast: cycle detected             │
│  3. Return appropriate result (cycle found,        │
│     middle node, etc.)                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Linked Lists - cycle detection, finding middle, length determination.

### Framework 3: Same Direction (Reader/Writer)

```
┌─────────────────────────────────────────────────────┐
│  SAME DIRECTION TWO-POINTER FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Initialize: writer = 0                           │
│  2. For reader in range(n):                        │
│     a. Check if arr[reader] meets criteria         │
│     b. If yes: arr[writer] = arr[reader]           │
│                 writer += 1                        │
│  3. Return writer (new length) or modified array     │
└─────────────────────────────────────────────────────┘
```

**When to use**: In-place array modification, filtering elements, removing duplicates.

### Framework 4: Sliding Window (Dynamic Same-Direction)

```
┌─────────────────────────────────────────────────────┐
│  SLIDING WINDOW TWO-POINTER FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Initialize: left = 0, window_state = empty       │
│  2. For right in range(n):                          │
│     a. Expand: Add element at right to state       │
│     b. While state violates constraint:              │
│        - Contract: Remove element at left            │
│        - left += 1                                   │
│     c. Update result with valid window               │
│  3. Return optimal result                            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding optimal subarrays/substrings, longest/shortest valid sequences.

### Framework 5: Three Pointers (Fix One, Move Two)

```
┌─────────────────────────────────────────────────────┐
│  THREE POINTER FRAMEWORK (for 3Sum, 4Sum)            │
├─────────────────────────────────────────────────────┤
│  1. Sort array                                       │
│  2. For i in range(n - 2):                          │
│     a. Fix arr[i] as first element of triplet        │
│     b. Use opposite ends on remaining array:       │
│        - left = i + 1, right = n - 1                 │
│     c. Find pairs that sum to target - arr[i]        │
│     d. Handle duplicates appropriately               │
│  3. Return all valid triplets                        │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding triplets, 3Sum, 4Sum problems.

---

## Forms

Different manifestations of the two-pointer pattern.

### Form 1: Sorted Array Two-Sum

Find pairs in sorted array that sum to target.

| Condition | Action | Reason |
|-----------|--------|--------|
| `arr[left] + arr[right] == target` | Return pair | Found solution |
| `arr[left] + arr[right] < target` | left++ | Need larger sum |
| `arr[left] + arr[right] > target` | right-- | Need smaller sum |

### Form 2: Palindrome Validation

Check if string/array is palindrome.

```
left = 0, right = n - 1
while left < right:
    if arr[left] != arr[right]: return False
    left++, right--
return True
```

### Form 3: Partitioning/Dutch National Flag

Partition array into categories using multiple pointers.

```
[0s ... low-1] | [1s ... mid-1] | [unprocessed ... high] | [2s ... end]
                ^                ^                        ^
               low              mid                     high
```

### Form 4: Container with Most Water

Maximize area between two lines.

```
Area = min(height[left], height[right]) * (right - left)
Move pointer with smaller height (might find taller line)
```

### Form 5: Trapping Rain Water

Calculate water trapped between bars.

```
Use two pointers from both ends
Track max_left and max_right
Water at position = max(0, min(max_left, max_right) - height[i])
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Skipping Duplicates

For problems requiring unique solutions, skip duplicate values:

```python
def two_sum_no_duplicates(arr, target):
    """Find unique pairs that sum to target."""
    arr.sort()
    result = []
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            result.append([arr[left], arr[right]])
            # Skip duplicates
            while left < right and arr[left] == arr[left + 1]:
                left += 1
            while left < right and arr[right] == arr[right - 1]:
                right -= 1
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result
```

### Tactic 2: Early Termination

Stop early when further search is impossible:

```python
def two_sum_early_exit(arr, target):
    """Stop when sum becomes too large."""
    arr.sort()
    left, right = 0, len(arr) - 1
    
    while left < right:
        # Early exit: if smallest pair > target, no solution exists
        if arr[left] + arr[left + 1] > target:
            break
        # Early exit: if largest pair < target, move left
        if arr[right] + arr[right - 1] < target:
            left += 1
            continue
            
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]
```

### Tactic 3: Pointer Movement with Conditions

Complex decision logic for pointer movement:

```python
def three_sum(arr):
    """Find all unique triplets that sum to zero."""
    arr.sort()
    result = []
    n = len(arr)
    
    for i in range(n - 2):
        # Skip duplicate first elements
        if i > 0 and arr[i] == arr[i - 1]:
            continue
        
        left, right = i + 1, n - 1
        
        while left < right:
            current_sum = arr[i] + arr[left] + arr[right]
            
            if current_sum == 0:
                result.append([arr[i], arr[left], arr[right]])
                # Skip duplicates
                while left < right and arr[left] == arr[left + 1]:
                    left += 1
                while left < right and arr[right] == arr[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif current_sum < 0:
                left += 1  # Need larger sum
            else:
                right -= 1  # Need smaller sum
    
    return result
```

### Tactic 4: In-Place Array Modification

Modify array without extra space:

```python
def move_zeroes(nums):
    """Move all zeroes to end while maintaining relative order."""
    writer = 0
    
    # First pass: move non-zero elements to front
    for reader in range(len(nums)):
        if nums[reader] != 0:
            nums[writer] = nums[reader]
            writer += 1
    
    # Second pass: fill remaining with zeroes
    while writer < len(nums):
        nums[writer] = 0
        writer += 1
```

### Tactic 5: Two Pointer String Matching

Compare strings with backspace characters:

```python
def backspace_compare(s, t):
    """Compare strings with # as backspace."""
    def process(string):
        result = []
        for char in string:
            if char == '#':
                if result:
                    result.pop()
            else:
                result.append(char)
        return result
    
    # Alternative: O(1) space with two pointers from end
    i, j = len(s) - 1, len(t) - 1
    skip_s = skip_t = 0
    
    while i >= 0 or j >= 0:
        # Process backspaces in s
        while i >= 0:
            if s[i] == '#':
                skip_s += 1
                i -= 1
            elif skip_s > 0:
                skip_s -= 1
                i -= 1
            else:
                break
        
        # Process backspaces in t
        while j >= 0:
            if t[j] == '#':
                skip_t += 1
                j -= 1
            elif skip_t > 0:
                skip_t -= 1
                j -= 1
            else:
                break
        
        # Compare characters
        if i >= 0 and j >= 0 and s[i] != t[j]:
            return False
        if (i >= 0) != (j >= 0):
            return False
        
        i -= 1
        j -= 1
    
    return True
```

### Tactic 6: Linked List Cycle Detection with Floyd's Algorithm

```python
def detect_cycle(head):
    """Detect cycle using Floyd's Tortoise and Hare."""
    if not head or not head.next:
        return None
    
    slow = fast = head
    
    # Phase 1: Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # Cycle start node
```

---

## Python Templates

### Template 1: Two Sum (Sorted Array)

```python
def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Find two numbers in sorted array that sum to target.
    Returns indices of the two numbers.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]
```

### Template 2: Valid Palindrome

```python
def is_palindrome(s: str) -> bool:
    """
    Check if string is palindrome, ignoring non-alphanumeric chars.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1
        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True
```

### Template 3: Remove Duplicates from Sorted Array

```python
def remove_duplicates(nums: list[int]) -> int:
    """
    Remove duplicates in-place, return new length.
    Time: O(n), Space: O(1)
    """
    if not nums:
        return 0
    
    writer = 1
    for reader in range(1, len(nums)):
        if nums[reader] != nums[reader - 1]:
            nums[writer] = nums[reader]
            writer += 1
    
    return writer
```

### Template 4: Container With Most Water

```python
def max_area(height: list[int]) -> int:
    """
    Find two lines that form container with most water.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Calculate area
        width = right - left
        current_height = min(height[left], height[right])
        max_water = max(max_water, width * current_height)
        
        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

### Template 5: 3Sum

```python
def three_sum(nums: list[int]) -> list[list[int]]:
    """
    Find all unique triplets that sum to zero.
    Time: O(n²), Space: O(1) excluding result
    """
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum == 0:
                result.append([nums[i], nums[left], nums[right]])
                # Skip duplicates
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif current_sum < 0:
                left += 1
            else:
                right -= 1
    
    return result
```

### Template 6: Linked List Cycle Detection

```python
def has_cycle(head) -> bool:
    """
    Detect if linked list has cycle using Floyd's algorithm.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return False
    
    slow = head  # Moves 1 step
    fast = head  # Moves 2 steps
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False


def find_middle(head):
    """Find middle node of linked list."""
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

### Template 7: Merge Two Sorted Arrays

```python
def merge_sorted_arrays(arr1: list[int], arr2: list[int]) -> list[int]:
    """
    Merge two sorted arrays into one sorted array.
    Time: O(n + m), Space: O(n + m)
    """
    p1 = p2 = 0
    result = []
    
    while p1 < len(arr1) and p2 < len(arr2):
        if arr1[p1] < arr2[p2]:
            result.append(arr1[p1])
            p1 += 1
        else:
            result.append(arr2[p2])
            p2 += 1
    
    # Append remaining elements
    result.extend(arr1[p1:])
    result.extend(arr2[p2:])
    
    return result
```

### Template 8: Trapping Rain Water

```python
def trap(height: list[int]) -> int:
    """
    Calculate water trapped after raining.
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            # Process left
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            # Process right
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    
    return water
```

### Template 9: Longest Substring Without Repeating Characters (Sliding Window)

```python
def length_of_longest_substring(s: str) -> int:
    """
    Find length of longest substring without repeating characters.
    Time: O(n), Space: O(min(m, n)) where m is charset size
    """
    char_index = {}  # char -> last seen index
    left = 0
    max_len = 0
    
    for right, char in enumerate(s):
        # If char seen and in current window, move left
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

### Template 10: Sort Colors (Dutch National Flag)

```python
def sort_colors(nums: list[int]) -> None:
    """
    Sort array of 0s, 1s, and 2s in-place.
    Time: O(n), Space: O(1)
    """
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

---

## When to Use

Use the Two Pointers technique when you need to solve problems involving:

- **Sorted Array Operations**: Searching, finding pairs, triplets
- **In-Place Array Modification**: Removing elements, partitioning
- **Palindrome Checking**: String validation, anagram detection
- **Linked List Problems**: Cycle detection, finding middle, merging
- **Sliding Window**: Subarray/substring optimization problems

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Two Pointers** | O(n) | O(1) | Sorted arrays, pair finding, in-place modification |
| **Hash Table** | O(n) avg | O(n) | Unsorted data, need O(1) lookups |
| **Brute Force** | O(n²) | O(1) | Small inputs, simple verification |
| **Sliding Window** | O(n) | O(k) | Variable-size subarray problems |

### When to Choose Two Pointers vs Other Approaches

- **Choose Two Pointers** when:
  - Array is sorted or can be sorted
  - You need O(n) time with O(1) space
  - Problem involves pairs or ranges
  - In-place modification is required

- **Choose Hash Table** when:
  - Array is unsorted and cannot be sorted
  - You need to check for existence frequently
  - Space is not a constraint

- **Choose Brute Force** when:
  - Input size is very small (n < 100)
  - Verification or testing only

---

## Algorithm Explanation

### Core Concept

The key insight behind Two Pointers is that by maintaining two indices that traverse the array simultaneously, we can eliminate large portions of the search space at each step. This transforms O(n²) nested loop solutions into O(n) single-pass solutions.

The technique works because:
1. **Monotonicity**: In sorted arrays, moving pointers creates predictable changes
2. **Complementary Search**: Finding two elements that satisfy a condition together
3. **Space Partitioning**: Dividing array into processed/unprocessed regions

### How It Works

#### Opposite Ends Pattern:
1. Place pointers at both ends of the array
2. Move them toward center based on comparison
3. Stop when pointers meet

#### Same Direction Pattern:
1. Both pointers start at the beginning
2. One pointer explores (reader), one builds result (writer)
3. Writer only moves when condition is met

#### Fast and Slow Pattern:
1. Both start at head
2. Fast moves 2 steps, slow moves 1 step
3. If they meet, a cycle exists

### Visual Representation

For array `[1, 2, 3, 4, 6, 8, 11]` finding pair that sums to 10:

```
Step 1: [1,  2,  3,  4,  6,  8, 11]
          ^                    ^
         left                right
         sum = 1 + 11 = 12 > 10, so right--

Step 2: [1,  2,  3,  4,  6,  8, 11]
          ^                 ^
         left             right
         sum = 1 + 8 = 9 < 10, so left++

Step 3: [1,  2,  3,  4,  6,  8, 11]
             ^              ^
            left          right
            sum = 2 + 8 = 10 ✓ Found!
```

### Why It Works

- **Sorted array guarantee**: Eliminating half the search space at each step is valid because of ordering
- **Monotonic relationship**: As left increases, sum increases; as right decreases, sum decreases
- **Coverage**: Every valid pair is considered because pointers traverse all possible combinations

### Limitations

- **Requires sorted array** (for opposite ends): Sorting takes O(n log n) if not already sorted
- **Not applicable to all problems**: Some problems require different approaches
- **Multiple passes**: Some variations need multiple passes over the array

---

## Practice Problems

### Problem 1: Two Sum II

**Problem:** [LeetCode 167 - Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

**Description:** Given a 1-indexed sorted array of integers, find two numbers that add up to a specific target number. Return the indices of the two numbers.

**How to Apply Two Pointers:**
- Use opposite ends pattern
- If sum < target, move left pointer right (need larger number)
- If sum > target, move right pointer left (need smaller number)

---

### Problem 2: 3Sum

**Problem:** [LeetCode 15 - 3Sum](https://leetcode.com/problems/3sum/)

**Description:** Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.

**How to Apply Two Pointers:**
- Fix one element, use two pointers on remaining array
- Sort array first to enable two-pointer technique
- Skip duplicates to ensure unique results

---

### Problem 3: Container With Most Water

**Problem:** [LeetCode 11 - Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

**Description:** You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that can hold the most water.

**How to Apply Two Pointers:**
- Start with widest container (left=0, right=n-1)
- Move pointer with smaller height (might find taller line)
- Calculate area at each step, track maximum

---

### Problem 4: Linked List Cycle

**Problem:** [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Description:** Given head, the head of a linked list, determine if the linked list has a cycle in it using O(1) memory.

**How to Apply Two Pointers:**
- Use fast and slow pointers (Floyd's algorithm)
- If fast catches up to slow, cycle exists
- If fast reaches end, no cycle

---

### Problem 5: Trapping Rain Water

**Problem:** [LeetCode 42 - Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

**Description:** Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

**How to Apply Two Pointers:**
- Use two pointers from both ends
- Track max height from left and right
- Water trapped = min(max_left, max_right) - current_height

---

## Video Tutorial Links

### Fundamentals

- [Two Pointers Technique (Take U Forward)](https://www.youtube.com/watch?v=9trI0mriUyI) - Comprehensive introduction
- [Two Sum & Two Pointers (NeetCode)](https://www.youtube.com/watch?v=Omjr1hLP4Jg) - Practical implementation
- [Two Pointers Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=OnUj3IlPDTA) - Detailed visualizations

### Problem-Specific

- [3Sum Solution](https://www.youtube.com/watch?v=8kCM_p6PQ7s) - Three pointer technique
- [Container With Most Water](https://www.youtube.com/watch?v=UQiZmzKTrXo) - Opposite ends pattern
- [Linked List Cycle Detection](https://www.youtube.com/watch?v=6OrZ4OQ4Bzw) - Floyd's algorithm
- [Trapping Rain Water](https://www.youtube.com/watch?v=StH6vXD4V4k) - Two pointer optimization

### Advanced Topics

- [Sliding Window Technique](https://www.youtube.com/watch?v=Kkmv2e30HWs) - Related pattern
- [Dutch National Flag](https://www.youtube.com/watch?v=oaVa-9wmpns) - Multi-pointer partitioning

---

## Follow-up Questions

### Q1: What is the difference between two pointers and sliding window?

**Answer:** Two Pointers is a general technique with multiple patterns (opposite ends, fast/slow, same direction). Sliding Window is a specific variation of same-direction two pointers where the window expands/contracts to find optimal subarrays. All sliding windows use two pointers, but not all two-pointer problems are sliding windows.

### Q2: When should I use fast and slow pointers?

**Answer:** Use fast and slow pointers when:
- Detecting cycles in linked lists or sequences
- Finding the middle of a linked list
- Determining if a list has odd or even length
- Problems requiring "tortoise and hare" approach

### Q3: Can two pointers work on unsorted arrays?

**Answer:** Yes, depending on the pattern:
- **Opposite ends**: Requires sorted array (or sort it first)
- **Same direction**: Works on unsorted arrays for in-place modification
- **Fast/Slow**: Works on linked structures regardless of values

### Q4: How do you handle duplicates in two-pointer problems?

**Answer:** Common strategies:
- Skip duplicates by comparing with previous element
- Use while loops to skip all occurrences of duplicate
- For 3Sum, skip duplicates for both fixed element and two pointers
- Always check `if i > 0 and arr[i] == arr[i-1]: continue`

### Q5: What's the space complexity advantage of two pointers?

**Answer:** Two pointers typically uses O(1) extra space:
- Only stores two indices (or a few variables)
- No hash map or auxiliary array needed
- Modifies array in-place when applicable
- Ideal for memory-constrained environments

---

## Summary

The Two Pointers technique is a fundamental algorithmic pattern for solving array and string problems efficiently. Key takeaways:

- **Multiple patterns**: Opposite ends, fast/slow, same direction, sliding window
- **O(n) time**: Reduces O(n²) to O(n) for many problems
- **O(1) space**: Minimal extra memory required
- **Versatile**: Works on arrays, strings, and linked lists

When to use:
- ✅ Sorted array operations (searching, pair finding)
- ✅ In-place array modification
- ✅ Palindrome and string matching problems
- ✅ Linked list cycle detection and navigation
- ✅ Sliding window subarray/substring problems
- ❌ Unsorted data where sorting is expensive
- ❌ Problems requiring random access patterns

This technique is essential for competitive programming and technical interviews, appearing frequently in problems from major tech companies.
