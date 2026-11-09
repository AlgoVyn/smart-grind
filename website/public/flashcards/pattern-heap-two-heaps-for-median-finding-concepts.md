# Flashcard: Two Heaps for Median Finding - Concepts

Why use a max-heap for the lower half instead of another min-heap?

<!-- front -->

The max-heap gives O(1) access to the **largest element of the lower half**, which is the boundary element.

- Lower half: max-heap → largest element at top
- Upper half: min-heap → smallest element at top
- The median sits at or between these two boundary elements

With two min-heaps, you couldn't access the largest of the lower half efficiently.

---

### Card 2: Why does Python require negating values for a max-heap?

Python's `heapq` only implements a min-heap.

To simulate a max-heap:
- Store **negated values**: `heapq.heappush(max_heap, -num)`
- Retrieve: `-max_heap[0]`
- Pop: `-heapq.heappop(max_heap)`

This works because negating reverses the ordering: `-5 < -3 < -1`, so `-5` pops first.

---

### Card 3: What is the "aha!" moment behind the two heaps median pattern?

**Split the data into two halves and maintain their boundary elements.**

Key insights:
1. Lower half in max-heap → largest element accessible
2. Upper half in min-heap → smallest element accessible
3. Keep sizes balanced (differ by at most 1)
4. Median is at the boundary between halves

This transforms the problem from "sort and find middle" to "maintain two heaps."

---

### Card 4: When should you NOT use the two heaps approach?

**Don't use when:**
- Fixed dataset with no insertions (just sort once: O(n log n))
- Only need final median, not running median
- You need to delete arbitrary elements frequently (consider sorted list or TreeSet)
- Memory is constrained and n is small (simpler approaches may suffice)
- Data has known range (counting sort can achieve O(1) insertion)

**Use when:** insertions are interleaved with median queries.

---

### Card 5: How does the two heaps pattern extend to sliding window median?

**Lazy deletion** with a hash map to handle elements leaving the window.

Key additions:
1. **Delayed deletions**: Track elements to remove but not yet removed
2. **Prune function**: Clean up invalid elements from heap tops
3. **Balance function**: Maintain size invariant after additions/removals
4. **Index tracking**: Handle duplicates by storing indices with values

Complexity: O(n log k) for n elements and window size k.

<!-- back -->
