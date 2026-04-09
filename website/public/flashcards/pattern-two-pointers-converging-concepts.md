## Two Pointers - Converging: Core Concepts

What are the fundamental principles of the Converging Two Pointers pattern for sorted arrays?

<!-- front -->

---

### Core Concept

Use **two pointers starting at opposite ends** of a sorted array and move them toward each other based on sum comparison with target.

**Key insight**: In a sorted array, moving left pointer right increases sum; moving right pointer left decreases sum.

---

### The Algorithm

```
Array: [2, 7, 11, 15], Target: 9

left              right
 ↓                 ↓
[2, 7, 11, 15]   sum=2+15=17 > 9 → move right

left           right
 ↓              ↓
[2, 7, 11, 15]  sum=2+11=13 > 9 → move right

left        right
 ↓           ↓
[2, 7, 11, 15] sum=2+7=9 == 9 → FOUND!
```

---

### Why It Works (The Math)

| Array State | Action | Effect on Sum |
|-------------|--------|---------------|
| Sum < Target | left++ | Increases sum (get larger value) |
| Sum > Target | right-- | Decreases sum (get smaller value) |
| Sum == Target | Return | Solution found |

**Guarantee**: Sorted order ensures systematic convergence toward target.

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Two Sum | Find pair summing to target | Two Sum II |
| Three Sum | Find triplets summing to zero | 3Sum |
| Closest Pair | Find pair closest to target | 3Sum Closest |
| Container | Max area between lines | Container With Most Water |
| Palindrome | Check valid palindrome | Valid Palindrome |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass from both ends |
| Space | O(1) | Only two pointers |
| Requires Sort | O(n log n) | If input unsorted |

<!-- back -->
