## Prefix Sum: Core Concepts

What are the fundamental principles of prefix sum arrays?

<!-- front -->

---

### Core Concept

Prefix sum array stores cumulative sums, enabling O(1) range sum queries.

```
Original:  [3, 1, 4, 1, 5, 9, 2, 6]
Prefix:  [0, 3, 4, 8, 9, 14, 23, 25, 31]
                ↑ sum of first 2 elements
                    ↑ sum of first 3 elements
```

---

### Range Sum Formula

```
sum(i, j) = prefix[j+1] - prefix[i]

Example: sum of elements from index 2 to 5
prefix[6] - prefix[2] = 23 - 4 = 19
Check: 4 + 1 + 5 + 9 = 19 ✓
```

---

### Visual: 1D Prefix Sum

```
Index:     0   1   2   3   4   5
Array:     5   2   8   3   1   7

Prefix:  0   5   7  15  18  19  26
          ↑   ↑   ↑   ↑   ↑   ↑   ↑
         ps0 ps1 ps2 ps3 ps4 ps5 ps6

Query sum[2:4] = prefix[5] - prefix[2] = 19 - 7 = 12
Verify: 8 + 3 + 1 = 12 ✓
```

---

### Applications

| Application | Formula | Use Case |
|-------------|---------|----------|
| Range sum | prefix[r+1] - prefix[l] | Subarray sums |
| Running average | prefix[i]/i | Moving averages |
| Equilibrium index | prefix[i] = total - prefix[i+1] | Balance points |
| Subarray sum = k | HashMap of prefix sums | Count subarrays |

---

### 2D Extension

```
Original matrix:        2D Prefix sum:
1  2  3              0  0   0   0
4  5  6        →     0  1   3   6
7  8  9              0  5  12  21
                     0  12 27  45

Sum of rectangle (1,1) to (2,2):
prefix[3][3] - prefix[1][3] - prefix[3][1] + prefix[1][1]
= 45 - 6 - 12 + 1 = 28
Verify: 5 + 6 + 8 + 9 = 28 ✓
```

<!-- back -->
