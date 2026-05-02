# Bin Packing (Approximation Algorithms)

## Category
Greedy Algorithms & Approximation

## Description

Bin Packing is the problem of packing items of different sizes into a finite number of bins of fixed capacity, minimizing the number of bins used. As an NP-hard problem, no polynomial-time exact solution exists (unless P=NP), so we use approximation algorithms that provide near-optimal solutions efficiently.

The problem has wide applications in resource allocation, memory management, cutting stock optimization, cloud computing resource distribution, and load balancing. Each variant of the bin packing algorithm offers different trade-offs between simplicity, speed, and approximation quality.

---

## Concepts

The bin packing algorithms rely on several fundamental concepts that ensure practical solutions.

### 1. Approximation Ratios

Different algorithms provide different guarantees:

| Algorithm | Approximation Ratio | Performance |
|-----------|---------------------|-------------|
| **First-Fit (FF)** | ≤ 1.7 × OPT | Good |
| **First-Fit Decreasing (FFD)** | ≤ 11/9 × OPT ≈ 1.22 × OPT | Better |
| **Best-Fit (BF)** | Same as FF | Similar |
| **Next-Fit (NF)** | ≤ 2 × OPT | Acceptable |

### 2. Online vs Offline Algorithms

| Type | When Items Known | Strategy |
|------|------------------|----------|
| **Online** | Dynamically as they arrive | Use FF, BF, NF |
| **Offline** | All known in advance | Sort descending, then FFD |

### 3. First-Fit Strategy

Place each item in the first bin that has enough room:

```
For each item:
  Scan bins from first to last
  If bin has space, place item
  If no bin found, create new bin
```

### 4. First-Fit Decreasing Strategy

Sort items in descending order, then apply First-Fit:

```
Sort items: largest to smallest
Apply First-Fit
```

This typically gives the best practical approximation.

### 5. Best-Fit Strategy

Place item in the bin with the tightest fit:

```
For each item:
  Find bin with minimum remaining space that fits item
  Place item there
  If no bin found, create new bin
```

---

## Frameworks

Structured approaches for solving bin packing problems.

### Framework 1: First-Fit Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  FIRST-FIT BIN PACKING                                       │
├─────────────────────────────────────────────────────────────┤
│  Input: items (list of sizes), bin_capacity                  │
│  Output: number of bins used                                   │
│                                                              │
│  1. Initialize bins = [] (empty list)                         │
│                                                              │
│  2. For each item in items:                                  │
│     a) placed = False                                         │
│     b) For i, remaining in enumerate(bins):                  │
│          - If remaining >= item:                            │
│              bins[i] -= item                                  │
│              placed = True                                    │
│              break                                            │
│     c) If not placed:                                       │
│          bins.append(bin_capacity - item)                     │
│                                                              │
│  3. Return len(bins)                                         │
└─────────────────────────────────────────────────────────────┘
```

### Framework 2: First-Fit Decreasing Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  FIRST-FIT DECREASING (FFD)                                  │
├─────────────────────────────────────────────────────────────┤
│  Input: items, bin_capacity                                  │
│  Output: number of bins used                                   │
│                                                              │
│  1. Sort items in descending order                           │
│     sorted_items = sorted(items, reverse=True)              │
│                                                              │
│  2. Apply First-Fit to sorted_items                          │
│                                                              │
│  3. Return number of bins                                     │
└─────────────────────────────────────────────────────────────┘
```

### Framework 3: Best-Fit Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  BEST-FIT BIN PACKING                                        │
├─────────────────────────────────────────────────────────────┤
│  Input: items, bin_capacity                                  │
│  Output: number of bins used                                   │
│                                                              │
│  1. Initialize bins = []                                      │
│                                                              │
│  2. For each item in items:                                  │
│     a) best_idx = -1                                          │
│        min_remaining = infinity                               │
│     b) For i, remaining in enumerate(bins):                 │
│          - If remaining >= item AND                           │
│            remaining - item < min_remaining:                 │
│              best_idx = i                                     │
│              min_remaining = remaining - item               │
│     c) If best_idx >= 0:                                    │
│          bins[best_idx] -= item                               │
│        Else:                                                  │
│          bins.append(bin_capacity - item)                   │
│                                                              │
│  3. Return len(bins)                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of bin packing algorithms.

### Form 1: First-Fit (Online)

Place item in first bin that fits.

| Aspect | Details |
|--------|---------|
| **Time** | O(n²) naive, O(n log n) with balanced BST |
| **Approximation** | ≤ 1.7 × OPT |
| **Use Case** | Streaming items, online processing |

### Form 2: First-Fit Decreasing (Offline)

Sort descending first, then First-Fit.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) for sorting |
| **Approximation** | ≤ 11/9 × OPT ≈ 1.22 × OPT |
| **Use Case** | Best practical approximation |

### Form 3: Best-Fit

Place in bin with minimum remaining space.

| Aspect | Details |
|--------|---------|
| **Time** | O(n²) |
| **Approximation** | Same as First-Fit |
| **Use Case** | Tighter packing needed |

### Form 4: Next-Fit

Only look at current bin.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) |
| **Approximation** | ≤ 2 × OPT |
| **Use Case** | Very simple, memory constrained |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: First-Fit Implementation

```python
def first_fit(items, bin_capacity):
    """
    First-fit bin packing.
    Time: O(n^2), can be O(n log n) with binary search tree.
    """
    bins = []
    
    for item in items:
        placed = False
        for i, remaining in enumerate(bins):
            if remaining >= item:
                bins[i] -= item
                placed = True
                break
        
        if not placed:
            bins.append(bin_capacity - item)
    
    return len(bins), bins
```

### Tactic 2: First-Fit Decreasing

```python
def first_fit_decreasing(items, bin_capacity):
    """
    Sort items decreasing, then apply first-fit.
    Better approximation ratio (~11/9 × OPT).
    """
    sorted_items = sorted(items, reverse=True)
    return first_fit(sorted_items, bin_capacity)
```

### Tactic 3: Best-Fit Implementation

```python
def best_fit(items, bin_capacity):
    """
    Best-fit bin packing.
    Place in bin with smallest remaining capacity that fits.
    """
    bins = []
    
    for item in items:
        best_idx = -1
        min_remaining = float('inf')
        
        for i, remaining in enumerate(bins):
            if remaining >= item and remaining - item < min_remaining:
                best_idx = i
                min_remaining = remaining - item
        
        if best_idx >= 0:
            bins[best_idx] -= item
        else:
            bins.append(bin_capacity - item)
    
    return len(bins)
```

### Tactic 4: Next-Fit Implementation

```python
def next_fit(items, bin_capacity):
    """
    Next-fit: If item fits in current bin, put it there.
    Otherwise, close current bin and open new one.
    """
    bins = 1
    current_remaining = bin_capacity
    
    for item in items:
        if item <= current_remaining:
            current_remaining -= item
        else:
            bins += 1
            current_remaining = bin_capacity - item
    
    return bins
```

---

## Python Templates

### Template 1: First-Fit

```python
def first_fit(items, bin_capacity):
    """
    First-fit bin packing algorithm.
    
    Time: O(n^2) worst case
    Space: O(n) for bins
    """
    bins = []
    
    for item in items:
        placed = False
        for i, remaining in enumerate(bins):
            if remaining >= item:
                bins[i] -= item
                placed = True
                break
        
        if not placed:
            bins.append(bin_capacity - item)
    
    return len(bins)
```

### Template 2: First-Fit Decreasing

```python
def first_fit_decreasing(items, bin_capacity):
    """
    First-fit decreasing - better approximation.
    
    Time: O(n log n) for sorting
    Approximation: ≤ 11/9 × OPT
    """
    sorted_items = sorted(items, reverse=True)
    return first_fit(sorted_items, bin_capacity)
```

### Template 3: Best-Fit

```python
def best_fit(items, bin_capacity):
    """
    Best-fit bin packing.
    
    Places item in bin with minimum remaining space.
    """
    bins = []
    
    for item in items:
        best_idx = -1
        min_remaining = float('inf')
        
        for i, remaining in enumerate(bins):
            if remaining >= item and remaining - item < min_remaining:
                best_idx = i
                min_remaining = remaining - item
        
        if best_idx >= 0:
            bins[best_idx] -= item
        else:
            bins.append(bin_capacity - item)
    
    return len(bins)
```

### Template 4: LeetCode 1986 Style

```python
def min_work_sessions(tasks, session_time):
    """
    Minimum work sessions - bin packing variant.
    Similar to bin packing - tasks to sessions.
    """
    tasks.sort(reverse=True)
    sessions = []
    
    for task in tasks:
        placed = False
        for i, remaining in enumerate(sessions):
            if remaining >= task:
                sessions[i] -= task
                placed = True
                break
        
        if not placed:
            sessions.append(session_time - task)
    
    return len(sessions)
```

---

## When to Use

Use Bin Packing algorithms when:
- Resource allocation problems
- Memory management
- Cutting stock optimization
- Load balancing

| Algorithm | Use When |
|-----------|----------|
| First-Fit | Online, simple implementation |
| Best-Fit | Tighter packing needed |
| First-Fit Decreasing | Offline, items known |
| Next-Fit | Very simple, memory constrained |

---

## Algorithm Explanation

### Core Concept

Bin packing is NP-hard. We use greedy approximation algorithms that pack items efficiently without guaranteeing optimal solutions.

### First-Fit Decreasing Analysis

1. Sort items in descending order
2. Place each item in the first bin with space
3. Create new bin if no space found

### Why FFD Works Well

Placing large items first ensures they fit optimally, while smaller items fill gaps efficiently. This leads to the strong 11/9 approximation ratio.

---

## Practice Problems

### Problem 1: Minimum Number of Work Sessions
**Problem:** [LeetCode 1986](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/)

---

## Summary

Bin Packing is NP-hard with practical approximation algorithms:
- FFD provides best practical approximation (~1.22 × OPT)
- Online algorithms for streaming scenarios
- Critical for resource allocation problems
