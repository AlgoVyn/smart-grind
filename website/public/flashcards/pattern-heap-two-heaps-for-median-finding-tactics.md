# Flashcard: Two Heaps for Median Finding - Tactics

## Card 1

--- front ---
What is the "push-through" tactic for heap insertion?

--- back ---
Route new elements through both heaps to maintain ordering.

**Size-based approach:**
```python
if len(small) == len(large):
    # Push to small via large (ensures larger half goes to small)
    heapq.heappush(large, num)
    heapq.heappush(small, -heapq.heappop(large))
else:
    # Push to large via small (ensures smaller half goes to large)
    heapq.heappush(small, -num)
    heapq.heappush(large, -heapq.heappop(small))
```

This guarantees correct ordering without explicit comparisons.

--- end ---

## Card 2

--- front ---
How do you handle lazy deletion in sliding window median?

--- back ---
Use a hash map to track "delayed" deletions.

```python
delayed = defaultdict(int)

def prune(heap, delayed):
    """Remove invalid elements from heap top."""
    while heap:
        num = -heap[0] if heap is small else heap[0]
        if delayed[num]:
            heapq.heappop(heap)
            delayed[num] -= 1
        else:
            break
```

Mark elements for deletion, actually remove when they reach the top.

--- end ---

## Card 3

--- front ---
What is the Python trick for max-heap implementation?

--- back ---
Negate values to use min-heap as max-heap:

```python
import heapq

# Max-heap (negated values)
max_heap = []
heapq.heappush(max_heap, -5)  # Stores -5
heapq.heappush(max_heap, -1)  # Stores -1
heapq.heappush(max_heap, -10) # Stores -10

# Max is at index 0 (but negated)
largest = -max_heap[0]  # Returns 10

# Pop max
largest = -heapq.heappop(max_heap)  # Returns 10
```

Remember: push with `-`, pop with `-`, peek with `-`.

--- end ---

## Card 4

--- front ---
How do you ensure floating-point precision for even-length medians?

--- back ---
Use `2.0` or `float()` for proper division:

```python
# Python 3 - automatic float, but be explicit
return (-lower[0] + upper[0]) / 2.0

# Or use float()
return float(-lower[0] + upper[0]) / 2
```

**Common pitfall:** Using integer division `//` or Python 2 style `/`.

For exact problems, check if they want `float` or `double` return type.

--- end ---

## Card 5

--- front ---
What is the size check pattern for heap balance?

--- back ---
Ensure lower half has equal or one more element than upper half:

```python
# After insertion and initial balance
if len(lower) < len(upper):
    heapq.heappush(lower, -heapq.heappop(upper))

# Or for sliding window with lazy deletion
if len(small) > len(large) + 1:
    delayed[-small[0]] += 1
    heapq.heappush(large, -heapq.heappop(small))
    prune(small, delayed)
elif len(small) < len(large):
    delayed[large[0]] += 1
    heapq.heappush(small, -heapq.heappop(large))
    prune(large, delayed)
```

Always check: `len(lower) >= len(upper)` and `diff <= 1`.

--- end ---
