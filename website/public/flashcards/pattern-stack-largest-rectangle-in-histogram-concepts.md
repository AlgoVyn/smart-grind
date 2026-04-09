## Stack - Largest Rectangle in Histogram: Core Concepts

What are the fundamental concepts behind the Largest Rectangle in Histogram pattern?

<!-- front -->

---

### The Core Insight

**The limiting height for any rectangle is the minimum bar within its width.**

For each bar, we want to find the widest rectangle where that bar is the SHORTEST (limiting) bar. This means we need to find how far left and right we can extend until we hit a shorter bar.

```
Histogram: [2, 1, 5, 6, 2, 3]

Index 2 (height 5):           Index 4 (height 2):
    [5]  <- limiting height      [2][2][2][2] <- extends far!
    |                              |  |  |  |
  [5][5]                       [1][2][2][2][2][3]
  |  |                          ^           ^
[2][5][5]                      left=1      right=5
  |  |  |                      width = 5 - 1 - 1 = 4
[2][5][5][6]                   area = 2 × 4 = 8
          |  
        [6][6]

Area at index 2 = 5 × 2 = 10    Area at index 4 = 2 × 4 = 8
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Monotonic stack** | Maintain increasing heights | When a shorter bar arrives, taller bars "end" |
| **Calculate on pop** | When we pop, we know current bar is the limit | Right boundary is current index, left is stack top |
| **Width formula** | `i - stack[-1] - 1` | Gives distance between previous smaller and current |
| **Sentinel value** | Add 0 at the end | Forces all remaining bars to be processed |
| **Single pass** | O(n) time | Each bar pushed and popped at most once |

---

### Understanding the Width Calculation

```
Width calculation for popped bar at index 3:

Heights:    [2, 1, 5, 6, 2, 3]
              0  1  2  3  4  5

Stack before pop at i=4 (height 2):
[1, 2, 3]  <- indices with heights [1, 5, 6]

Pop 3 (height 6):
- New stack: [1, 2]
- Left boundary: index 2 (height 5, still in stack)
- Right boundary: index 4 (current index)
- Width = 4 - 2 - 1 = 1 (just the bar itself)
- Area = 6 × 1 = 6

Pop 2 (height 5):
- New stack: [1]
- Left boundary: index 1 (height 1)
- Right boundary: index 4
- Width = 4 - 1 - 1 = 2 (indices 2 and 3)
- Area = 5 × 2 = 10

Continue...
```

---

### Monotonic Stack Behavior

```
Step-by-step trace for heights = [2, 1, 5, 6, 2, 3]

i=0, h=2:  stack=[0], max_area=0
i=1, h=1:  pop 0, height=2, width=1, area=2, max_area=2
           stack=[1]
i=2, h=5:  stack=[1, 2]
i=3, h=6:  stack=[1, 2, 3]
i=4, h=2:  pop 3, height=6, width=1, area=6, max_area=6
           pop 2, height=5, width=2, area=10, max_area=10
           stack=[1, 4]
i=5, h=3:  stack=[1, 4, 5]
i=6, h=0:  pop 5, height=3, width=1, area=3
           pop 4, height=2, width=4, area=8
           pop 1, height=1, width=6, area=6

Final max_area = 10
```

---

### Why the Stack is Monotonic Increasing

**Property:** We only push when height >= stack top height.

**Why this works:**
1. When we encounter a taller bar, it can extend rectangles of previous bars
2. When we encounter a shorter bar, it "breaks" the extension for taller bars
3. At that breaking point, we calculate final areas for all taller bars

```
Increasing stack: [1, 2, 3] with heights [1, 5, 6]
                  ^
                  
When h=2 arrives at i=4:
  - 6 > 2, so 6 cannot extend → pop and calculate
  - 5 > 2, so 5 cannot extend → pop and calculate  
  - 1 < 2, so 2 can extend from 1
  
Final stack: [1, 4] with heights [1, 2]
```

---

### Time/Space Complexity Breakdown

| Aspect | Complexity | Why |
|--------|------------|-----|
| **Time** | O(n) | Each index pushed once, popped once |
| **Space** | O(n) | Stack can hold up to n indices |
| **Worst case** | Stack = n | Strictly increasing heights |
| **Best case** | Stack = 1 | Strictly decreasing heights |

<!-- back -->
