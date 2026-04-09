## Binary Search - Median/Kth Across Two Sorted Arrays: Core Concepts

What are the fundamental principles for finding median/kth element across two sorted arrays without merging?

<!-- front -->

---

### Core Concept

Use a **virtual partition** that divides both arrays such that:
- Left partition has exactly `half = (m+n+1)//2` elements
- All elements in left ≤ all elements in right
- Median derived from partition boundaries

**Key insight**: We don't need to merge or even know the exact elements - just need the correct partition point.

---

### The "Aha!" Moments

```
nums1 = [1, 3, 8, 9, 15]      nums2 = [7, 11, 18, 19, 21, 25]
        i=2                           j=3
              ↓                             ↓
Left:  [1, 3 | 8, 9, 15]     [7, 11, 18 | 19, 21, 25]
              ↑                             ↑
        left1=3, right1=8          left2=18, right2=19

WRONG PARTITION (3 ≤ 18 ✓, but 11 ≤ 8? ✗)

After binary search adjustment:

nums1 = [1, 3, 8 | 9, 15]    nums2 = [7, 11 | 18, 19, 21, 25]
              i=3                          j=2
        left1=8, right1=9          left2=11, right2=18

VALID PARTITION: max(left) = max(8, 11) = 11
                min(right) = min(9, 18) = 9... wait!

Need: left1 ≤ right2 (8 ≤ 18 ✓) AND left2 ≤ right1 (11 ≤ 9? ✗)

Final adjustment:

nums1 = [1, 3 | 8, 9, 15]    nums2 = [7, 11, 18 | 19, 21, 25]
              i=2                          j=3
        left1=3, right1=8          left2=18, right2=19

VALID! max(left) = 18, min(right) = 8... 

Wait - need left2 ≤ right1: 11 ≤ 8? No.

Correct:
nums1 = [1, 3, 8 | 9, 15]    nums2 = [7 | 11, 18, 19, 21, 25]
              i=2                          j=3

Hmm, let me recalculate: half = (5+6+1)//2 = 6
If i=2, then j=6-2=4

nums1 = [1, 3 | 8...] left1=3, right1=8
nums2 = [7, 11, 18, 19 | 21, 25] left2=19, right2=21

3 ≤ 21 ✓, 19 ≤ 8? ✗

i=3, j=3: left1=8, right1=9, left2=11, right2=18
8 ≤ 18 ✓, 11 ≤ 9? ✗

i=4, j=2: left1=9, right1=15, left2=7, right2=11
9 ≤ 11 ✓, 7 ≤ 15 ✓  ✓✓✓ CORRECT!

Median (odd=11 elements): max(9, 7) = 9
```

---

### Partition Balance Logic

| Total Elements | Left Partition Size | Median Calculation |
|----------------|---------------------|-------------------|
| Odd (m+n = 2k+1) | k+1 elements | `max(left1, left2)` |
| Even (m+n = 2k) | k elements | `(max(left) + min(right)) / 2` |

**Why `half = (m+n+1)//2`?**
- For odd: `(2k+1+1)//2 = k+1` (left has one more)
- For even: `(2k+1)//2 = k` (equal split)

---

### Boundary Handling

```
Edge Case: i = 0 (all elements from nums2 in left)
  left1 = -∞, right1 = nums1[0]
  
Edge Case: i = m (all elements from nums1 in left)  
  left1 = nums1[m-1], right1 = +∞
  
Edge Case: j = 0 (all elements from nums1 in left)
  left2 = -∞, right2 = nums2[0]
  
Edge Case: j = n (all elements from nums2 in left)
  left2 = nums2[n-1], right2 = +∞
```

**Infinity ensures comparisons always work:**
- `-∞ ≤ anything` is always true
- `anything ≤ +∞` is always true

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log min(m,n)) | Binary search on smaller array |
| Space | O(1) | Only pointers and variables |
| Merge approach | O(m+n) | Linear time, not optimal |
| Two-pointer | O(m+n) | Also linear |

<!-- back -->
