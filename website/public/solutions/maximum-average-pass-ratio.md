# Maximum Average Pass Ratio

## Problem Description

There is a school that has classes of students and each class will be having a final exam. You are given a 2D integer array `classes`, where `classes[i] = [passi, totali]`. You know beforehand that in the ith class, there are `totali` total students, but only `passi` number of students will pass the exam.

You are also given an integer `extraStudents`. There are another `extraStudents` brilliant students that are guaranteed to pass the exam of any class they are assigned to. You want to assign each of the `extraStudents` students to a class in a way that maximizes the average pass ratio across all the classes.

The pass ratio of a class is equal to the number of students of the class that will pass the exam divided by the total number of students of the class. The average pass ratio is the sum of pass ratios of all the classes divided by the number of the classes.

Return the maximum possible average pass ratio after assigning the `extraStudents` students. Answers within `10^-5` of the actual answer will be accepted.

---

## Examples

### Example 1

**Input:**
```python
classes = [[1,2],[3,5],[2,2]], extraStudents = 2
```

**Output:**
```python
0.78333
```

**Explanation:** You can assign the two extra students to the first class. The average pass ratio will be equal to `(3/4 + 3/5 + 2/2) / 3 = 0.78333`.

### Example 2

**Input:**
```python
classes = [[2,4],[3,9],[4,5],[2,10]], extraStudents = 4
```

**Output:**
```python
0.53485
```

---

## Constraints

- `1 <= classes.length <= 10^5`
- `classes[i].length == 2`
- `1 <= passi <= totali <= 10^5`
- `1 <= extraStudents <= 10^5`

---

## Solution

```python
import heapq
from typing import List

class Solution:
    def maxAverageRatio(self, classes: List[List[int]], extraStudents: int) -> float:
        def gain(p, t):
            return (t - p) / (t * (t + 1))
        
        heap = []
        for p, t in classes:
            heapq.heappush(heap, (-gain(p, t), p, t))
        
        for _ in range(extraStudents):
            _, p, t = heapq.heappop(heap)
            p += 1
            t += 1
            heapq.heappush(heap, (-gain(p, t), p, t))
        
        total_ratio = 0
        for _, p, t in heap:
            total_ratio += p / t
        return total_ratio / len(classes)
```

---

## Explanation

We use a max heap to always assign an extra student to the class that gains the most in pass ratio. The gain for adding a student to a class with `p` passes and `t` total is `(t - p) / (t * (t + 1))`.

The algorithm works as follows:
1. Calculate the gain for each class and push it into a max heap (using negative values since Python's heapq is a min-heap).
2. For each extra student, pop the class with the highest gain, assign the student to it, and recalculate the gain.
3. After assigning all extra students, compute the average pass ratio.

**Time Complexity:** O((n + extra) log n), where n is the number of classes.

**Space Complexity:** O(n) for the heap.
