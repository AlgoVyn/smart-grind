# Flashcard: Two Heaps for Median Finding - Framework

## Card 1

--- front ---
What is the core framework for finding the median from a data stream?

--- back ---
Two heaps: a max-heap for the lower half and a min-heap for the upper half.

- Lower half (max-heap): stores smaller numbers, largest at top
- Upper half (min-heap): stores larger numbers, smallest at top
- Balance: heaps differ by at most 1 element
- Median: top of larger heap, or average of both tops

--- end ---

## Card 2

--- front ---
What are the time and space complexities of the two heaps approach?

--- back ---
- **Insertion:** O(log n) - heap push/pop operations
- **Find Median:** O(1) - direct access to heap tops
- **Space:** O(n) - stores all elements in two heaps

This is optimal for comparison-based median finding in a stream.

--- end ---

## Card 3

--- front ---
What are the three steps for inserting a number into the two heaps structure?

--- back ---
1. **Add to max-heap** (lower half): `heapq.heappush(lower, -num)`

2. **Balance**: Move largest from lower to upper:
   ```python
   heapq.heappush(upper, -heapq.heappop(lower))
   ```

3. **Size rebalance**: Ensure lower half >= upper half:
   ```python
   if len(lower) < len(upper):
       heapq.heappush(lower, -heapq.heappop(upper))
   ```

--- end ---

## Card 4

--- front ---
How do you compute the median from two balanced heaps?

--- back ---
```python
if len(lower) > len(upper):
    # Odd count: larger heap has the median
    return -lower[0]
else:
    # Even count: average of both tops
    return (-lower[0] + upper[0]) / 2
```

- Python: negate max-heap values (store negatives)
- C++: `lower.top()` and `upper.top()` directly
- Java: `lower.peek()` and `upper.peek()`

--- end ---

## Card 5

--- front ---
What is the fundamental invariant maintained in the two heaps structure?

--- back ---
**Size invariant:** |size(lower) - size(upper)| ≤ 1, and lower ≥ upper

**Content invariant:**
- All elements in lower ≤ all elements in upper
- lower is a max-heap (largest of lower half accessible)
- upper is a min-heap (smallest of upper half accessible)

This ensures the median is always at one of the heap tops.

--- end ---
