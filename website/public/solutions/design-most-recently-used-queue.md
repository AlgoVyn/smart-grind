# Design Most Recently Used Queue

## Problem Description
Design a Most Recently Used (MRU) queue that supports fetching the k-th most recently used element.

Implement the MRUQueue class with the following methods:
- `MRUQueue(n: int)`: Initialize the queue with elements [1, 2, ..., n].
- `fetch(k: int) -> int`: Fetch the k-th element (1-indexed), remove it from its current position, and append it to the end of the queue. Return the value of the element.

---

## Examples

**Input:**
```python
n = 4
```

**Output:**
```
# MRUQueue initialized with [1, 2, 3, 4]
```

---

## Constraints

- `1 <= n <= 10^5`

---

## Solution

```python
class MRUQueue:

    def __init__(self, n: int):
        self.queue = list(range(1, n + 1))

    def fetch(self, k: int) -> int:
        val = self.queue[k - 1]
        del self.queue[k - 1]
        self.queue.append(val)
        return val
```

---

## Explanation
The MRUQueue is implemented using a list to store the elements. In the `__init__` method, we initialize the queue with numbers from 1 to n.

The `fetch` method retrieves the k-th element (1-based index), removes it from its current position, and appends it to the end of the list, making it the most recently used.

This approach ensures that the most recently fetched elements are at the end of the list.

Time complexity: O(n) for each fetch operation due to list deletion and append.

Space complexity: O(n) for storing the queue.
