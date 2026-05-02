# Mode

## Category
Mathematics

## Description

The mode is the value that appears most frequently in a dataset. Unlike the mean and median, the mode can be applied to both numerical and categorical data. Finding the mode involves counting frequencies and identifying the maximum. In multimodal distributions, there may be multiple modes.

The mode has important applications in data analysis, particularly for categorical data where mean and median cannot be computed. In competitive programming, finding the mode in a Binary Search Tree (BST) efficiently or tracking the mode in a streaming data context are common problems. Understanding different algorithms for mode finding—from simple hash map counting to BST-optimized inorder traversal—is valuable for various scenarios.

---

## Concepts

Finding the mode relies on several fundamental concepts from statistics and data structures.

### 1. Frequency Counting

The basic approach to finding the mode:

| Method | Time | Space | Use Case |
|--------|------|-------|----------|
| **Hash Map** | O(n) | O(n) | General arrays |
| **Sorting** | O(n log n) | O(1) or O(n) | In-place preference |
| **BST Inorder** | O(n) | O(1) extra | BST structure available |
| **Boyer-Moore** | O(n) | O(1) | Majority element only |

### 2. Types of Modes

Different mode scenarios:

| Type | Description | Example |
|------|-------------|---------|
| **Unimodal** | Single mode | [1, 1, 2, 3] → mode = 1 |
| **Bimodal** | Two modes | [1, 1, 2, 2] → modes = 1, 2 |
| **Multimodal** | Multiple modes | [1, 1, 2, 2, 3, 3] |
| **No Mode** | All unique | [1, 2, 3, 4] |

### 3. Majority Element

Special case where mode > n/2:

| Algorithm | Time | Space | Condition |
|-----------|------|-------|-----------|
| **Boyer-Moore** | O(n) | O(1) | Element appears > n/2 |
| **Hash Map** | O(n) | O(n) | General frequency |
| **Sorting** | O(n log n) | O(1) | Middle element if majority |

### 4. Comparison with Central Tendency

| Measure | Best For | Data Type | Robust to Outliers |
|---------|----------|-----------|-------------------|
| **Mean** | Average, balance | Numerical | No |
| **Median** | Center, L1 optimal | Numerical | Yes |
| **Mode** | Most common, categorical | Any | Yes |

---

## Frameworks

Structured approaches for finding the mode.

### Framework 1: Hash Map Frequency Count

```
┌─────────────────────────────────────────────────────────────┐
│  HASH MAP FREQUENCY FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  Input: Array of elements                                      │
│  Output: Mode(s) - most frequent element(s)                 │
│                                                                │
│  1. Initialize empty frequency map                             │
│                                                                │
│  2. For each element in array:                                │
│     frequency[element] += 1                                   │
│                                                                │
│  3. Find maximum frequency:                                    │
│     max_count = max(frequency.values())                       │
│                                                                │
│  4. Return all elements with frequency == max_count           │
│                                                                │
│  Time: O(n), Space: O(n)                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: General mode finding with unlimited memory.

### Framework 2: BST Mode (Space Optimized)

```
┌─────────────────────────────────────────────────────────────┐
│  BST MODE FRAMEWORK                                           │
├─────────────────────────────────────────────────────────────┤
│  Input: BST root node                                            │
│  Output: Mode(s) - most frequent value(s) in BST            │
│                                                                │
│  1. Initialize:                                                 │
│     current_val = None                                        │
│     current_count = 0                                         │
│     max_count = 0                                              │
│     modes = []                                               │
│                                                                │
│  2. Inorder traversal:                                        │
│     For each node visited:                                    │
│       If node.val == current_val:                            │
│         current_count += 1                                    │
│       Else:                                                   │
│         Check if current_count > max_count:                  │
│           Update max_count, reset modes                      │
│         Else if current_count == max_count:                  │
│           Add current_val to modes                           │
│         Reset current_val and current_count                  │
│       Process node.val                                        │
│                                                                │
│  3. Handle last sequence after traversal                      │
│                                                                │
│  4. Return modes                                               │
│                                                                │
│  Time: O(n), Space: O(1) extra (recursion stack)            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding mode in BST with space optimization.

### Framework 3: Majority Element (Boyer-Moore)

```
┌─────────────────────────────────────────────────────────────┐
│  BOYER-MOORE MAJORITY VOTE FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  Input: Array of elements                                      │
│  Assumption: Majority element exists (appears > n/2)       │
│  Output: Majority element                                      │
│                                                                │
│  1. Initialize: candidate = None, count = 0                   │
│                                                                │
│  2. For each element:                                         │
│     If count == 0:                                            │
│       candidate = element                                       │
│       count = 1                                                │
│     Else if element == candidate:                             │
│       count += 1                                                │
│     Else:                                                      │
│       count -= 1  // Cancel out pair                          │
│                                                                │
│  3. Verify candidate is majority (optional but recommended)  │
│                                                                │
│  Time: O(n), Space: O(1)                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding element appearing more than n/2 times.

---

## Forms

Different manifestations of mode finding.

### Form 1: Hash Map Mode

Standard frequency counting approach.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) |
| **Space** | O(n) |
| **Best For** | General arrays, multiple modes |
| **Limitation** | Memory for large distinct values |

### Form 2: BST Mode

Inorder traversal for sorted order.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) |
| **Space** | O(1) extra (O(h) stack) |
| **Best For** | BST structure, space constraints |
| **Benefit** | No extra memory for frequency map |

### Form 3: Majority Element

Single pass with cancellation.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) |
| **Space** | O(1) |
| **Condition** | Element > n/2 frequency |
| **Best For** | Guaranteed majority scenarios |

### Form 4: Streaming Mode

Online mode tracking.

| Aspect | Details |
|--------|---------|
| **Approach** | Incremental frequency update |
| **Time** | O(1) per element (amortized) |
| **Space** | O(k) for k distinct values |
| **Best For** | Real-time data streams |

### Form 5: Range Mode Queries

Mode in subarrays.

| Aspect | Details |
|--------|---------|
| **Approach** | Segment tree, Mo's algorithm |
| **Time** | Varies (O(√n) per query with Mo's) |
| **Preprocessing** | O(n log n) or more |
| **Best For** | Multiple range queries |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Hash Map Mode

Standard mode finding:

```python
from collections import Counter

def find_mode(nums):
    """
    Find mode(s) using hash map.
    Time: O(n), Space: O(n)
    """
    if not nums:
        return []
    
    freq = Counter(nums)
    max_count = max(freq.values())
    
    # Return all values with max frequency
    modes = [k for k, v in freq.items() if v == max_count]
    return modes

# Single mode (first encountered on tie)
def find_single_mode(nums):
    """Return single mode (arbitrary on tie)."""
    if not nums:
        return None
    
    return Counter(nums).most_common(1)[0][0]
```

### Tactic 2: BST Mode with Inorder Traversal

Space-optimized for BST:

```python
def find_mode_bst(root):
    """
    Find mode in BST using inorder traversal.
    Time: O(n), Space: O(1) extra
    """
    if not root:
        return []
    
    current_val = None
    current_count = 0
    max_count = 0
    modes = []
    
    def inorder(node):
        nonlocal current_val, current_count, max_count, modes
        
        if not node:
            return
        
        inorder(node.left)
        
        # Process current node
        if node.val == current_val:
            current_count += 1
        else:
            # Check previous streak
            if current_count > max_count:
                max_count = current_count
                modes = [current_val]
            elif current_count == max_count and current_val is not None:
                modes.append(current_val)
            
            current_val = node.val
            current_count = 1
        
        inorder(node.right)
    
    inorder(root)
    
    # Check last sequence
    if current_count > max_count:
        modes = [current_val]
    elif current_count == max_count:
        modes.append(current_val)
    
    return modes
```

### Tactic 3: Online Mode (Streaming)

Track mode incrementally:

```python
class OnlineMode:
    def __init__(self):
        self.freq = Counter()
        self.max_count = 0
        self.modes = set()
    
    def add(self, num):
        self.freq[num] += 1
        count = self.freq[num]
        
        if count > self.max_count:
            self.max_count = count
            self.modes = {num}
        elif count == self.max_count:
            self.modes.add(num)
    
    def get_mode(self):
        return list(self.modes)
```

### Tactic 4: Boyer-Moore Majority Element

O(1) space for majority:

```python
def majority_element(nums):
    """
    Element appearing more than n/2 times.
    Boyer-Moore Voting Algorithm.
    Time: O(n), Space: O(1)
    """
    candidate = None
    count = 0
    
    for num in nums:
        if count == 0:
            candidate = num
        count += (1 if num == candidate else -1)
    
    # Verify
    if nums.count(candidate) > len(nums) // 2:
        return candidate
    return None
```

### Tactic 5: Generalized Majority (n/k)

Extended Boyer-Moore:

```python
def majority_element_general(nums, k):
    """
    Find all elements appearing more than n/k times.
    """
    candidates = {}
    
    for num in nums:
        if num in candidates:
            candidates[num] += 1
        elif len(candidates) < k - 1:
            candidates[num] = 1
        else:
            # Decrement all, remove zeros
            to_remove = []
            for c in candidates:
                candidates[c] -= 1
                if candidates[c] == 0:
                    to_remove.append(c)
            for c in to_remove:
                del candidates[c]
    
    # Verify candidates
    result = []
    freq = Counter(nums)
    for c in candidates:
        if freq[c] > len(nums) // k:
            result.append(c)
    
    return result
```

---

## Python Templates

### Template 1: Find Mode (Hash Map)

```python
from collections import Counter
from typing import List

def find_mode(nums: List[int]) -> List[int]:
    """
    Find all modes in the array.
    
    Args:
        nums: List of integers
    
    Returns:
        List of mode values
        
    Time: O(n)
    Space: O(n)
    """
    if not nums:
        return []
    
    freq = Counter(nums)
    max_count = max(freq.values())
    
    return [k for k, v in freq.items() if v == max_count]
```

### Template 2: Single Mode

```python
def find_single_mode(nums: List[int]) -> int:
    """
    Return single mode (arbitrary choice if multiple).
    
    Args:
        nums: List of integers
    
    Returns:
        Mode value, or None if empty
    """
    if not nums:
        return None
    
    return Counter(nums).most_common(1)[0][0]
```

### Template 3: BST Mode

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def find_mode_bst(root: TreeNode) -> List[int]:
    """
    Find mode in BST with O(1) extra space.
    
    Args:
        root: Root of BST (may have duplicates)
    
    Returns:
        List of mode values
        
    Time: O(n)
    Space: O(1) extra (recursion stack O(h))
    """
    if not root:
        return []
    
    current_val = None
    current_count = 0
    max_count = 0
    modes = []
    
    def inorder(node):
        nonlocal current_val, current_count, max_count, modes
        
        if not node:
            return
        
        inorder(node.left)
        
        if node.val == current_val:
            current_count += 1
        else:
            # Check previous streak
            if current_count > max_count:
                max_count = current_count
                modes = [current_val]
            elif current_count == max_count and current_val is not None:
                modes.append(current_val)
            
            current_val = node.val
            current_count = 1
        
        inorder(node.right)
    
    inorder(root)
    
    # Check last sequence
    if current_count > max_count:
        modes = [current_val]
    elif current_count == max_count:
        modes.append(current_val)
    
    return [m for m in modes if m is not None]
```

### Template 4: Boyer-Moore Majority

```python
def majority_element(nums: List[int]) -> int:
    """
    Find element appearing more than n/2 times.
    
    Args:
        nums: List of integers
    
    Returns:
        Majority element, or None if none
        
    Time: O(n)
    Space: O(1)
    """
    candidate = None
    count = 0
    
    for num in nums:
        if count == 0:
            candidate = num
        count += (1 if num == candidate else -1)
    
    # Verify
    if nums.count(candidate) > len(nums) // 2:
        return candidate
    return None
```

### Template 5: Online Mode Tracker

```python
from collections import Counter
from typing import List

class OnlineMode:
    """Track mode in streaming data."""
    
    def __init__(self):
        self.freq = Counter()
        self.max_count = 0
        self.modes = set()
    
    def add(self, num: int):
        """Add number to dataset."""
        self.freq[num] += 1
        count = self.freq[num]
        
        if count > self.max_count:
            self.max_count = count
            self.modes = {num}
        elif count == self.max_count:
            self.modes.add(num)
    
    def get_mode(self) -> List[int]:
        """Return current mode(s)."""
        return list(self.modes)
    
    def remove(self, num: int):
        """Remove number from dataset (if tracked)."""
        if num in self.freq:
            self.freq[num] -= 1
            if self.freq[num] == 0:
                del self.freq[num]
            # Note: modes may need recalculation after removal
```

### Template 6: K-Majority Elements

```python
def majority_element_general(nums: List[int], k: int) -> List[int]:
    """
    Find all elements appearing more than n/k times.
    
    Args:
        nums: List of integers
        k: Threshold divisor
    
    Returns:
        List of majority elements
        
    Time: O(nk)
    Space: O(k)
    """
    candidates = {}
    
    for num in nums:
        if num in candidates:
            candidates[num] += 1
        elif len(candidates) < k - 1:
            candidates[num] = 1
        else:
            to_remove = []
            for c in candidates:
                candidates[c] -= 1
                if candidates[c] == 0:
                    to_remove.append(c)
            for c in to_remove:
                del candidates[c]
    
    # Verify
    result = []
    freq = Counter(nums)
    for c in candidates:
        if freq[c] > len(nums) // k:
            result.append(c)
    
    return result
```

---

## When to Use

Use Mode finding when you need to solve problems involving:

- **Most Frequent Element**: Finding most common value
- **Categorical Data**: Non-numerical data analysis
- **BST Operations**: Mode in BST with space constraints
- **Streaming Data**: Real-time mode tracking
- **Majority Decision**: Finding element with > n/2 frequency

### Comparison: Mean vs Median vs Mode

| Measure | Formula | Best For | Outlier Sensitivity |
|---------|---------|----------|-------------------|
| **Mean** | Σx / n | Average, balance | High |
| **Median** | Middle value | Center, robust | Low |
| **Mode** | Most frequent | Common value, categorical | None |

### When to Choose Each Approach

- **Choose Hash Map** when:
  - General mode finding needed
  - Memory not constrained
  - Multiple modes possible

- **Choose BST Inorder** when:
  - BST structure available
  - Space optimization needed
  - O(1) extra space preferred

- **Choose Boyer-Moore** when:
  - Majority element (> n/2) guaranteed
  - O(1) space required
  - Single pass preferred

---

## Algorithm Explanation

### Core Concept

The mode is the value with highest frequency. Finding it requires counting occurrences and identifying the maximum. Different approaches optimize for time, space, or specific data structures.

### How It Works

#### Hash Map Approach

1. **Count**: Build frequency dictionary
2. **Find Max**: Identify maximum frequency
3. **Collect**: Return all values with that frequency

#### BST Inorder Approach

1. **Traverse**: Inorder gives sorted sequence
2. **Track**: Count consecutive equal values
3. **Compare**: Update modes when streak ends

### Why It Works

- **Hash Map**: Direct frequency access
- **BST**: Sorted order groups equal values
- **Boyer-Moore**: Pairs cancel, majority remains

### Limitations

- **Hash Map**: Memory for distinct values
- **BST**: Requires BST structure
- **Boyer-Moore**: Only works for majority, needs verification

---

## Practice Problems

### Problem 1: Find Mode in BST

**Problem:** [LeetCode 501 - Find Mode in Binary Search Tree](https://leetcode.com/problems/find-mode-in-binary-search-tree/)

**Description:** Find mode(s) in BST with duplicates.

**How to Apply:**
- Inorder traversal
- Track current streak
- O(1) extra space

---

### Problem 2: Majority Element

**Problem:** [LeetCode 169 - Majority Element](https://leetcode.com/problems/majority-element/)

**Description:** Element appearing more than n/2 times.

**How to Apply:**
- Boyer-Moore voting
- O(n) time, O(1) space

---

### Problem 3: Majority Element II

**Problem:** [LeetCode 229 - Majority Element II](https://leetcode.com/problems/majority-element-ii/)

**Description:** Elements appearing more than n/3 times.

**How to Apply:**
- Extended Boyer-Moore
- At most 2 such elements

---

### Problem 4: Online Majority Element

**Problem:** [LeetCode 1157 - Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray/)

**Description:** Range majority queries.

**How to Apply:**
- Segment tree or Mo's algorithm
- Boyer-Moore with verification

---

## Video Tutorial Links

### Fundamentals

- [Mode vs Mean vs Median - Statistics](https://www.youtube.com/watch?v=5C9LrM3eEwo) - Comparison
- [Boyer-Moore Voting - Algorithms](https://www.youtube.com/watch?v=7KaGn6nB5mM) - Majority
- [BST Mode - LeetCode](https://www.youtube.com/watch?v=1FJDyBGJ1lE) - Implementation

---

## Follow-up Questions

### Q1: Can a dataset have multiple modes?

**Answer:** Yes, this is called bimodal (2 modes), trimodal (3 modes), or multimodal (many modes). The hash map approach naturally handles this by returning all values with maximum frequency.

---

### Q2: What if all elements are unique?

**Answer:** Then there is no mode, or every element is a mode (all have frequency 1). The definition depends on context—typically we say "no mode" or return all elements.

---

### Q3: How does Boyer-Moore work?

**Answer:** It cancels pairs of different elements. If there's a majority element (> n/2), it will survive all cancellations because it appears more times than all other elements combined.

---

### Q4: Can we find mode without extra space for general arrays?

**Answer:** Only by sorting (O(1) space, O(n log n) time). For BSTs, inorder traversal gives O(1) extra space. For general arrays without modifying them, O(n) space is required.

---

### Q5: What's the difference between mode and majority element?

**Answer:** Mode is most frequent element regardless of frequency. Majority element appears more than n/2 times. A majority element is always the unique mode, but a mode need not be a majority.

---

## Summary

The mode is the most frequent value in a dataset. Key takeaways:

1. **Hash Map**: O(n) time, O(n) space—general solution
2. **BST Inorder**: O(n) time, O(1) space—tree optimization
3. **Boyer-Moore**: O(n) time, O(1) space—majority only
4. **Streaming**: Incremental updates for real-time
5. **Multiple Modes**: All values with max frequency

**When to Use:**
- Most frequent element needed
- Categorical data analysis
- Space-constrained BST scenarios
- Majority voting decisions

This measure complements mean and median as a measure of central tendency, particularly valuable for categorical and discrete data.
