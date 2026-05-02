# Reservoir Sampling

## Category
Randomized Algorithms & Sampling

## Description

Reservoir Sampling is a family of randomized algorithms for randomly choosing a sample of k items from a list of n items, where n is either very large or unknown. The algorithm processes data in a single pass, using only O(k) memory regardless of the stream size.

This elegant technique was first described in 1985 by Jeffrey Vitter and has become essential for sampling from data streams, large datasets that don't fit in memory, or when the total population size is unknown in advance. The key insight is maintaining a "reservoir" of k items and cleverly deciding when to replace existing items as new data arrives.

---

## Concepts

Reservoir sampling relies on fundamental probability concepts to ensure uniform random selection.

### 1. Uniform Sampling

| Property | Description |
|----------|-------------|
| **Goal** | Each item has equal probability k/n of being selected |
| **Replacement probability** | For item i: k/i |
| **Memory** | O(k) regardless of stream size |
| **Pass** | Single pass through data |

### 2. Types of Reservoir Sampling

| Variant | Problem | Probability |
|---------|---------|-------------|
| **k=1** | Select one random element | 1/n each |
| **k>1** | Select k random elements | k/n each |
| **Weighted** | Probability ∝ weight | weight/total |
| **Stratified** | Sample from groups | k/n per stratum |

### 3. Probability Preservation

The algorithm maintains uniform probability through careful replacement:

| Step | Probability Item i stays in reservoir |
|------|----------------------------------------|
| **When added** | k/i |
| **At step j > i** | (j-1)/j (not replaced) |
| **Final** | k/n (telescoping product) |

### 4. Mathematical Foundation

For item at position m, probability it's in final sample:
```
P(selected at m) = k/m
P(not replaced at j > m) = (j-1)/j × (j-2)/(j-1) × ... × (n-1)/n = m/n
P(final) = k/m × m/n = k/n ✓
```

---

## Frameworks

Structured approaches for reservoir sampling problems.

### Framework 1: Basic Reservoir Sampling (k=1)

```
┌─────────────────────────────────────────────────────────────┐
│  RESERVOIR SAMPLING (k = 1)                                 │
├─────────────────────────────────────────────────────────────┤
│  Input: stream of unknown size                               │
│  Output: one uniformly random element                       │
│                                                              │
│  1. Initialize: result = None, count = 0                   │
│  2. For each item in stream:                                │
│     a. count += 1                                           │
│     b. With probability 1/count:                          │
│        - result = item                                      │
│  3. Return result                                           │
│                                                              │
│  Each item has probability 1/n of being selected            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Selecting single random element from stream.

### Framework 2: General Reservoir Sampling (k > 1)

```
┌─────────────────────────────────────────────────────────────┐
│  RESERVOIR SAMPLING (k ITEMS)                              │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize: reservoir = [], count = 0                 │
│  2. For each item in stream:                                │
│     a. count += 1                                           │
│     b. If len(reservoir) < k:                             │
│        - reservoir.append(item)                            │
│     c. Else:                                               │
│        - j = random integer in [0, count-1]              │
│        - If j < k:                                         │
│           * reservoir[j] = item                            │
│  3. Return reservoir                                         │
│                                                              │
│  Each item has probability k/n of selection                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Selecting k items uniformly from stream.

### Framework 3: Weighted Reservoir Sampling

```
┌─────────────────────────────────────────────────────────────┐
│  WEIGHTED RESERVOIR SAMPLING                                │
├─────────────────────────────────────────────────────────────┤
│  Input: stream of (item, weight) pairs                     │
│  Output: item with probability ∝ weight                    │
│                                                              │
│  1. Initialize: result = None, total_weight = 0             │
│  2. For each (item, weight) in stream:                    │
│     a. total_weight += weight                              │
│     b. With probability weight/total_weight:               │
│        - result = item                                     │
│  3. Return result                                           │
│                                                              │
│  Probability of item i = weight_i / sum(weights)           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Sampling with non-uniform probabilities.

---

## Forms

Different manifestations of reservoir sampling.

### Form 1: Classic Reservoir Sampling

Standard k-item selection from stream.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) single pass |
| **Space** | O(k) |
| **Best for** | Uniform random sample from stream |
| **Variants** | Can handle weighted, stratified sampling |

### Form 2: Distributed Reservoir Sampling

Sampling across multiple machines.

| Aspect | Details |
|--------|---------|
| **Approach** | Each machine samples k, combine with weighted merge |
| **Coordination** | Minimal communication needed |
| **Best for** | MapReduce, distributed systems |
| **Correctness** | Maintains uniform sampling guarantee |

### Form 3: Sliding Window Sampling

Sample from most recent N items.

| Aspect | Details |
|--------|---------|
| **Problem** | Stream + bounded window |
| **Approach** | Expire old items, maintain reservoir |
| **Best for** | Time-decayed sampling |
| **Complexity** | O(1) amortized per item |

### Form 4: Priority Sampling

Using random priorities for selection.

| Aspect | Details |
|--------|---------|
| **Method** | Assign random priority, keep k highest |
| **Equivalence** | Mathematically equivalent to reservoir |
| **Best for** | Parallel processing, mergeable samples |
| **Insight** | Random priority enables distributed sampling |

---

## Tactics

Specific techniques for reservoir sampling.

### Tactic 1: Single Item Sampling

The simplest case - one random element:

```python
import random

def reservoir_sample_one(stream):
    """
    Sample one item uniformly from stream.
    Probability = 1/n for each item.
    """
    result = None
    count = 0
    
    for item in stream:
        count += 1
        # Replace with probability 1/count
        if random.randint(1, count) == 1:
            result = item
    
    return result
```

**Intuition**: Item i has probability 1/i of being selected when seen, and probability (i-1)/i × (i)/(i+1) × ... × (n-1)/n = i/n of not being replaced. Final probability: 1/i × i/n = 1/n.

### Tactic 2: K Items from Stream

The classic reservoir sampling algorithm:

```python
def reservoir_sample_k(stream, k):
    """
    Sample k items uniformly from stream.
    Each item has probability k/n of being selected.
    """
    reservoir = []
    count = 0
    
    for item in stream:
        count += 1
        
        if len(reservoir) < k:
            reservoir.append(item)
        else:
            # Replace with probability k/count
            j = random.randint(0, count - 1)
            if j < k:
                reservoir[j] = item
    
    return reservoir
```

**Proof sketch**: Item at position m is selected with probability k/m. It survives to position n with probability m/n (telescoping product). Final probability: k/n.

### Tactic 3: Linked List Random Node

LeetCode 382 application:

```python
# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def get_random(head):
    """
    Return random node's value from linked list.
    Reservoir sampling with k=1.
    """
    result = head.val
    current = head.next
    count = 1
    
    while current:
        count += 1
        if random.randint(1, count) == 1:
            result = current.val
        current = current.next
    
    return result
```

**Application**: When linked list size is unknown or too large to traverse twice.

### Tactic 4: Weighted Reservoir Sampling

Sample with probability proportional to weight:

```python
def weighted_reservoir_sample(stream):
    """
    Stream contains (item, weight).
    Sample with probability proportional to weight.
    """
    result = None
    total_weight = 0
    
    for item, weight in stream:
        total_weight += weight
        # Replace with probability weight/total_weight
        if random.random() * total_weight < weight:
            result = item
    
    return result
```

**Key insight**: Probability of selecting item i is weight_i / total_weight.

### Tactic 5: Stratified Sampling

Sample from different groups:

```python
def stratified_reservoir_sample(stream, k_per_stratum):
    """
    Sample k items from each stratum (group).
    """
    reservoirs = {}  # stratum -> list
    counts = {}  # stratum -> count
    
    for item, stratum in stream:
        if stratum not in reservoirs:
            reservoirs[stratum] = []
            counts[stratum] = 0
        
        counts[stratum] += 1
        
        if len(reservoirs[stratum]) < k_per_stratum:
            reservoirs[stratum].append(item)
        else:
            j = random.randint(0, counts[stratum] - 1)
            if j < k_per_stratum:
                reservoirs[stratum][j] = item
    
    return reservoirs
```

**Use case**: Ensuring representation from all demographic groups.

---

## Python Templates

### Template 1: Single Item Reservoir Sampling

```python
import random
from typing import Iterator, TypeVar

T = TypeVar('T')

def reservoir_sample_single(stream: Iterator[T]) -> T:
    """
    Select one random item uniformly from a stream.
    
    Each item in the stream has equal probability 1/n of being selected,
    where n is the total number of items in the stream.
    
    Args:
        stream: An iterable of items
    
    Returns:
        A uniformly random item from the stream
    
    Time: O(n) where n is stream length
    Space: O(1)
    """
    result = None
    count = 0
    
    for item in stream:
        count += 1
        # Replace current result with probability 1/count
        if random.randint(1, count) == 1:
            result = item
    
    return result
```

### Template 2: K Items Reservoir Sampling

```python
def reservoir_sample_k(stream: Iterator[T], k: int) -> List[T]:
    """
    Select k random items uniformly from a stream.
    
    Each item has probability k/n of being in the final sample.
    
    Args:
        stream: An iterable of items
        k: Number of items to sample
    
    Returns:
        List of k uniformly random items
    
    Time: O(n) where n is stream length
    Space: O(k)
    """
    reservoir = []
    count = 0
    
    for item in stream:
        count += 1
        
        if len(reservoir) < k:
            # Fill reservoir initially
            reservoir.append(item)
        else:
            # Replace with probability k/count
            j = random.randint(0, count - 1)
            if j < k:
                reservoir[j] = item
    
    return reservoir
```

### Template 3: Weighted Reservoir Sampling

```python
def weighted_reservoir_sample(stream: Iterator[tuple[T, float]]) -> T:
    """
    Sample one item with probability proportional to its weight.
    
    Args:
        stream: Iterator of (item, weight) tuples
    
    Returns:
        Item selected with probability weight/sum(weights)
    
    Time: O(n)
    Space: O(1)
    """
    result = None
    total_weight = 0.0
    
    for item, weight in stream:
        total_weight += weight
        # Replace with probability weight/total_weight
        if random.random() * total_weight < weight:
            result = item
    
    return result
```

### Template 4: Linked List Random Node

```python
class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val: int = 0, next=None):
        self.val = val
        self.next = next

def get_random_node(head: ListNode) -> int:
    """
    Return a random node's value from a linked list.
    
    Uses reservoir sampling with k=1.
    
    Time: O(n)
    Space: O(1)
    """
    result = head.val
    current = head.next
    count = 1
    
    while current:
        count += 1
        if random.randint(1, count) == 1:
            result = current.val
        current = current.next
    
    return result
```

### Template 5: Random Pick Index

```python
class RandomIndexPicker:
    """
    Pick a random index of target number from array.
    """
    
    def __init__(self, nums: List[int]):
        self.nums = nums
    
    def pick(self, target: int) -> int:
        """
        Return random index where nums[index] == target.
        
        Uses reservoir sampling to handle unknown number of targets.
        """
        result = -1
        count = 0
        
        for i, num in enumerate(self.nums):
            if num == target:
                count += 1
                if random.randint(1, count) == 1:
                    result = i
        
        return result
```

---

## When to Use

Use Reservoir Sampling when you need to solve problems involving:

- **Large/unknown streams**: Data too big to store or count
- **Single pass requirements**: Can only process data once
- **Uniform random sampling**: Each item should have equal probability
- **Memory constraints**: Limited RAM, streaming data
- **Distributed sampling**: Sample across multiple machines

### Comparison with Other Sampling Methods

| Method | Time | Space | Passes | Best For |
|--------|------|-------|--------|----------|
| **Reservoir Sampling** | O(n) | O(k) | 1 | Stream, unknown n |
| **Shuffle & Pick** | O(n) | O(n) | 1 | Small n, all data fits |
| **Fisher-Yates** | O(k) | O(n) | 1 | Known n, need permutation |
| **Binary Search** | O(log n) | O(1) | 1 | Weighted, cumulative known |

### When to Choose Reservoir Sampling

- **Choose Reservoir Sampling** when:
  - Stream size is unknown or very large
  - Only single pass through data is possible
  - Memory is limited (O(k) space needed)
  - Uniform sampling required

- **Consider Alternatives** when:
  - All data fits in memory (shuffle and pick first k)
  - Need exact k items without probability (must use other methods)
  - Stream size is known and small

---

## Algorithm Explanation

### Core Concept

Reservoir sampling maintains a "reservoir" of k items and decides for each new item whether to keep it. The key insight is that item i should have probability k/i of entering the reservoir when first seen, and probability j/(j+1) of staying when item j+1 arrives.

### Mathematical Proof

For item at position m in stream of n items:

**Probability of being selected at position m:**
```
P(selected) = k/m
```

**Probability of surviving from m to n:**
```
P(survive) = m/(m+1) × (m+1)/(m+2) × ... × (n-1)/n = m/n
```

**Final probability:**
```
P(in final sample) = k/m × m/n = k/n ✓
```

The telescoping product ensures uniform probability!

### Visual Walkthrough

**Example**: Sample k=2 from stream [A, B, C, D, E]

```
Step 1: See A
Reservoir: [A, _] (fill first slot)

Step 2: See B  
Reservoir: [A, B] (fill second slot)

Step 3: See C
Random j in [0, 2] (count=3, k=2)
If j < 2: replace reservoir[j] with C
Example: j=1, reservoir becomes [A, C]

Step 4: See D
Random j in [0, 3] (count=4)
If j < 2: replace
Example: j=0, reservoir becomes [D, C]

Step 5: See E
Random j in [0, 4] (count=5)
If j < 2: replace
Example: j=2 (no replace), reservoir stays [D, C]

Final: [D, C] is our uniform random sample
```

### Why Replace with Probability k/count?

As we see more items, the probability of keeping any specific item must decrease to maintain uniform sampling. When we've seen `count` items and want to sample k, each item in reservoir should have probability k/count. New items replace old ones just enough to maintain this balance.

---

## Practice Problems

### Problem 1: Linked List Random Node

**Problem:** [LeetCode 382 - Linked List Random Node](https://leetcode.com/problems/linked-list-random-node/)

**Description:** Given a singly linked list, return a random node's value from the linked list. Each node must have the same probability of being chosen.

**How to Apply Reservoir Sampling:**
- Traverse list once
- Use k=1 reservoir sampling
- Each node has probability 1/n

---

### Problem 2: Random Pick Index

**Problem:** [LeetCode 398 - Random Pick Index](https://leetcode.com/problems/random-pick-index/)

**Description:** Given an integer array `nums` with possible duplicates, randomly output the index of a given target number.

**How to Apply:**
- Scan array for target values
- Use reservoir sampling to pick random index among matches
- Each matching index has equal probability

---

## Video Tutorial Links

### Fundamentals

- [Reservoir Sampling Explained](https://www.youtube.com/watch?v=A1iwzSew5QY) - Algorithm visualization
- [Random Selection from Stream](https://www.youtube.com/watch?v=0OefH95-wqU) - Mathematical proof
- [Weighted Reservoir Sampling](https://www.youtube.com/watch?v=CoDtlTpe6O4) - Extensions

### Applications

- [LeetCode 382 Solution](https://www.youtube.com/watch?v=QmCo9z5wtic) - Linked List Random Node
- [LeetCode 398 Solution](https://www.youtube.com/watch?v=1q8srlq46hE) - Random Pick Index
- [Sampling in Big Data](https://www.youtube.com/watch?v=5w5Qy0SP_RI) - Real-world applications

---

## Follow-up Questions

### Q1: How does the probability math work out to k/n?

**Answer**: For item at position i, it's selected with probability k/i. It survives the remaining n-i steps with probability i/n (telescoping product). Final probability = k/i × i/n = k/n. The i cancels out, giving uniform probability!

### Q2: Can reservoir sampling handle weighted sampling?

**Answer**: Yes! Weighted reservoir sampling uses key = random^(1/weight) and keeps items with highest keys. Alternatively, use the "reservoir with random sort keys" variant where items are selected based on priority.

### Q3: What if we need to sample without replacement in multiple passes?

**Answer**: Reservoir sampling is designed for unknown/streaming data. If you know n and can make multiple passes, Fisher-Yates shuffle or random permutation is more efficient. For distributed sampling, use "priority sampling" with random keys.

### Q4: How do you handle the case where k > n (stream smaller than requested sample)?

**Answer**: The algorithm naturally handles this - it just returns all items if the stream ends before filling the reservoir. You get min(k, n) items, each with probability 1 (all selected).

### Q5: Can reservoir sampling be parallelized?

**Answer**: Yes! Each processor samples k items from its partition. To merge, treat each processor's sample as a stream and sample k from the combined samples, weighting by partition size. This maintains uniform sampling across the full dataset.

---

## Summary

Reservoir Sampling is an elegant algorithmic technique that enables uniform random sampling from streams with unknown or very large sizes. Its single-pass, constant-memory characteristics make it indispensable for big data processing and streaming applications.

**Key Takeaways:**

1. **Single Pass**: Process data exactly once
2. **O(k) Memory**: Space independent of stream size
3. **Uniform Probability**: Each item has k/n probability
4. **Mathematical Elegance**: Telescoping product ensures correctness
5. **Versatile**: Extends to weighted and stratified sampling

**When to Use:**
- Unknown or very large stream sizes
- Memory-constrained environments
- Single-pass requirements
- Uniform random sampling from data streams

Reservoir Sampling demonstrates the power of randomized algorithms to solve seemingly impossible problems (sampling without knowing population size) with elegant, efficient solutions.
