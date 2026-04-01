## Dutch National Flag: Core Concepts

What is the Dutch National Flag problem and how does it achieve O(n) sorting with O(1) space?

<!-- front -->

---

### Problem Definition

Given an array with n objects colored red, white, or blue (represented as 0, 1, 2), sort them in-place so that objects of the same color are adjacent, with colors in the order red, white, and blue.

**Key constraint:** Do this in one pass and O(1) space.

---

### Three-Way Partitioning

| Pointer | Purpose | Region |
|---------|---------|--------|
| **low** | Boundary of 0s | [0, low) = all 0s |
| **mid** | Current element | [low, mid) = all 1s |
| **high** | Boundary of 2s | (high, n-1] = all 2s |

**Invariant:** `[0..low-1] = 0, [low..mid-1] = 1, [high+1..n-1] = 2`

---

### Why It Works

```
We maintain three regions:
  [0s] [1s] [Unknown] [2s]
   ↑low  ↑mid    ↑high

Process each element:
  - If 0: swap with low, low++ and mid++
  - If 1: just mid++
  - If 2: swap with high, high--
```

**Single pass:** Each element examined once, swaps only when needed.

---

### Dijkstra's Original Algorithm

Named after Edsger Dijkstra who posed this problem. The three-way partitioning is also the basis for:
- **Quicksort optimization:** 3-way partition for duplicates
- **Quickselect:** Finding kth smallest efficiently

---

### Complexity

| Aspect | Value |
|--------|-------|
| **Time** | O(n) - single pass |
| **Space** | O(1) - only 3 pointers |
| **Swaps** | ≤ n - each swap places at least one element correctly |
| **Comparisons** | n - each element checked once |

<!-- back -->
