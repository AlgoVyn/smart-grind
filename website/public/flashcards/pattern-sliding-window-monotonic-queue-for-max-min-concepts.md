## Sliding Window - Monotonic Queue for Max/Min: Core Concepts

What are the fundamental principles of the monotonic queue pattern?

<!-- front -->

---

### Core Concept

A **monotonic queue** is a deque that maintains elements in sorted order (either increasing or decreasing). For sliding window maximum/minimum problems, it enables **O(1) access** to the window's extremum while processing each element exactly once.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) - each element pushed and popped at most once |
| **Space** | O(k) - deque holds at most k indices |
| **Key Insight** | Front always contains the current window's max/min |

---

### The "Aha!" Moments

1. **Store indices, not values** - Need to check if element left the window: `dq[0] <= i - k`

2. **Front is always optimal** - The monotonic property guarantees `arr[dq[0]]` is the window max/min

3. **Remove from both ends**:
   - **Front**: Remove elements that slid out of the window
   - **Back**: Remove elements that can never be the max/min

4. **Each element processed once** - Every element is pushed once and popped at most twice (from front when leaving window, from back when dominated)

---

### Visual Example: Finding Maximum

```
Array: [1, 3, -1, -3, 5, 3, 6, 7], k = 3

i=0, val=1:  dq=[0]           (deque stores indices)
i=1, val=3:  dq=[1]           (1<3, so 1 pushes out 0)
i=2, val=-1: dq=[1,2]         (-1<3, so add to back)
             Window full! max = arr[1] = 3

i=3, val=-3: Remove out: dq[0]=1 > 3-3=0, keep
             -3<-1, so add: dq=[1,2,3]
             Window full! max = arr[1] = 3

i=4, val=5:  Remove out: 1 <= 4-3=1, pop front → dq=[2,3]
             5>-1, pop back → dq=[2]
             5>-3, pop back → dq=[]
             Add 4: dq=[4]
             Window full! max = arr[4] = 5

i=5, val=3:  3<5, add to back: dq=[4,5]
             max = 5

i=6, val=6:  6>3, pop → [4]; 6>5, pop → []; add 6: dq=[6]
             max = 6

i=7, val=7:  7>6, pop → []; add 7: dq=[7]
             max = 7

Result: [3, 3, 5, 5, 6, 7]
```

---

### Monotonic Property

For a **decreasing deque** (finding maximum):
```
arr[dq[0]] >= arr[dq[1]] >= arr[dq[2]] >= ... >= arr[dq[-1]]
```

For an **increasing deque** (finding minimum):
```
arr[dq[0]] <= arr[dq[1]] <= arr[dq[2]] <= ... <= arr[dq[-1]]
```

---

### Amortized Analysis

Why is it O(n) when we have while loops?

| Operation | Times Per Element |
|-----------|-------------------|
| Push to back | Exactly 1 |
| Pop from front | At most 1 (when leaving window) |
| Pop from back | At most 1 (when dominated by new element) |

**Total**: 3n operations = O(n)

Each element enters once and exits once - no element is processed more than twice.

---

### When to Use Monotonic Queue

**Perfect for:**
- Fixed-size sliding window max/min
- Finding next greater/smaller element
- Range minimum/maximum queries in arrays
- Stream processing with fixed buffer

**Not for:**
- Variable window sizes (use heap)
- Arbitrary range queries (use segment tree)
- Need to update elements (use balanced BST)

<!-- back -->
