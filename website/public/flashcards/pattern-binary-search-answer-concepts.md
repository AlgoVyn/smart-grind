## Binary Search - On Answer: Core Concepts

What are the fundamental principles of binary search on the answer space?

<!-- front -->

---

### Core Concept

Use **binary search to find the optimal answer** when you can verify if a candidate answer is valid or not.

**Key insight**: If you can check "is X a valid answer?" efficiently, you can binary search over possible answers.

---

### The Pattern

```
Problem: Find minimum capacity to ship packages within D days.

Packages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], D = 5

Can we ship with capacity = 10?
  Day 1: 1+2+3+4 = 10 ✓
  Day 2: 5 ✓
  Day 3: 6 ✓
  Day 4: 7 ✓
  Day 5: 8+9+10 = 27 > 10 ✗
  
  No, capacity 10 is too small.

Can we ship with capacity = 15?
  Day 1: 1+2+3+4+5 = 15 ✓
  Day 2: 6+7+8 = 21 > 15 ✗
  
  No, capacity 15 too small.

Can we ship with capacity = 20?
  Day 1: 1+2+3+4+5 = 15 ✓
  Day 2: 6+7+8 = 21 > 20? No, just 6+7 = 13 ✓
  Day 3: 8+9 = 17 ✓
  Day 4: 10 ✓
  
  Actually need more careful packing...

Binary search finds minimum valid capacity.
```

---

### Common Applications

| Problem Type | Check Function | Answer Space |
|--------------|----------------|--------------|
| Capacity/Days | Can ship with capacity C? | [max, sum] |
| Minimum Speed | Can arrive on time at speed K? | [1, max] |
| Eating Speed | Can eat all in H hours at speed K? | [1, max] |
| Split Array | Can split into m subarrays with max sum <= mid? | [max, sum] |
| Koko Eating | Can eat all bananas in H hours? | [1, max] |
| Aggressive Cows | Can place cows with min distance D? | [1, max] |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log(ans_range) × check_time) | Check is usually O(n) |
| Space | O(1) | Iterative binary search |
| Example | O(n log(sum)) | For split array largest sum |

<!-- back -->
