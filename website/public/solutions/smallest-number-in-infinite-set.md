# Smallest Number in Infinite Set

## Problem Description

Design a data structure that contains all positive integers starting from 1. Support two operations:

1. `popSmallest()` — Remove and return the smallest number in the set
2. `addBack(num)` — Add a number back to the set if it was previously removed

**Link to problem:** [Smallest Number in Infinite Set - LeetCode 2335](https://leetcode.com/problems/smallest-number-in-infinite-set/)

## Constraints
- `1 <= num <= 1000` for `addBack` operation
- At most `1000` calls to `popSmallest` and `addBack` combined

---

## Pattern: Data Structure Design - Priority Queue

This problem is a classic example of the **Data Structure Design** pattern using a priority queue (min-heap). The pattern involves designing a data structure that efficiently supports multiple operations with different time complexity requirements.

### Core Concept

The fundamental idea is to maintain two data sources:
1. An **infinite sequence** of positive integers (1, 2, 3, ...)
2. A **heap** to store numbers that have been popped and added back

When popping, we check the heap first - if it has elements, the smallest is there. Otherwise, we return the next number from the infinite sequence.

---

## Examples

### Example

**Input:**
```
Operations: ["SmallestInfiniteSet", "addBack", "popSmallest", "popSmallest", "popSmallest", "addBack", "popSmallest", "popSmallest", "popSmallest"]
Arguments: [[], [2], [], [], [], [1], [], [], []]
```

**Output:**
```
[null, null, 1, 2, 3, null, 1, 4, 5]
```

**Explanation:**
1. Create infinite set: {1, 2, 3, ...}
2. addBack(2): Add 2 back → {1, 2, 3, ...}
3. popSmallest(): Return 1 → {2, 3, 4, ...}
4. popSmallest(): Return 2 → {3, 4, 5, ...}
5. popSmallest(): Return 3 → {4, 5, 6, ...}
6. addBack(1): Add 1 back → {1, 4, 5, ...}
7. popSmallest(): Return 1 (from heap) → {4, 5, 6, ...}
8. popSmallest(): Return 4 → {5, 6, 7, ...}
9. popSmallest(): Return 5 → {6, 7, 8, ...}

---

## Intuition

The key insight is recognizing that we have two sources of numbers:
1. Numbers from the infinite sequence that haven't been popped yet
2. Numbers that have been popped and added back

We need a data structure that can efficiently give us the smallest number from both sources.

### Why Use a Heap?

A min-heap (priority queue) provides:
- O(1) access to the minimum element
- O(log n) insertion and removal
- Efficient merging of two data sources

### How It Works

1. **Track the "next" number**: Keep a counter `next` starting at 1
2. **Use a heap**: Store numbers that have been popped and added back
3. **Use a set**: Track which numbers are in the heap to avoid duplicates
4. **On popSmallest()**: If heap has elements, return the smallest. Otherwise, return `next` and increment it.
5. **On addBack(num)**: If num is not in the heap and num < next, add it to the heap.

---

## Multiple Approaches with Code

We'll cover the heap-based approach (optimal) and discuss alternative designs.

---

## Approach 1: Heap-Based Design (Optimal)

This approach uses a min-heap combined with tracking the next available number from the infinite sequence.

### Algorithm Steps

1. Initialize:
   - `heap`: empty min-heap
   - `present`: set to track numbers in heap
   - `next`: 1 (next number from infinite sequence)

2. For `popSmallest()`:
   - If heap is not empty, pop and return the smallest
   - Otherwise, return `next` and increment `next`

3. For `addBack(num)`:
   - If `num >= next` or `num` already in `present`, return (can't add back)
   - Otherwise, push `num` to heap and add to `present`

### Why It Works

The algorithm works because:
- We always prefer returning numbers from the heap (previously popped and added back)
- If heap is empty, we use the next number from the infinite sequence
- The `present` set ensures we don't have duplicates in the heap
- The `next` check ensures we don't add back numbers that are still available in the infinite sequence

### Code Implementation

````carousel
```python
import heapq

class SmallestInfiniteSet:
    def __init__(self):
        """
        Initialize the smallest infinite set.
        
        Design:
        - heap: Min-heap to store numbers added back
        - present: Set to track numbers currently in heap
        - next: Next number to return if heap is empty
        """
        self.heap = []           # Min-heap for added-back numbers
        self.present = set()     # Track numbers in heap for O(1) lookup
        self.next = 1            # Next number from infinite sequence

    def popSmallest(self) -> int:
        """
        Remove and return the smallest number in the set.
        
        Returns:
            The smallest number currently in the set
        """
        if self.heap:
            # Return smallest from heap
            num = heapq.heappop(self.heap)
            self.present.remove(num)
            return num
        else:
            # Return next number from infinite sequence
            num = self.next
            self.next += 1
            return num

    def addBack(self, num: int) -> None:
        """
        Add a number back to the set if it was previously removed.
        
        Args:
            num: The number to add back
            
        Note:
            Only adds if num < next (not in current sequence)
            and not already in heap
        """
        # Can't add back if already in the sequence or in heap
        if num >= self.next or num in self.present:
            return
        
        # Add to heap
        heapq.heappush(self.heap, num)
        self.present.add(num)
```

<!-- slide -->
```cpp
class SmallestInfiniteSet {
public:
    SmallestInfiniteSet() {
        // Min-heap to store numbers added back
        // No direct heap in C++, using priority_queue (max-heap needs negation)
        // For simplicity, using ordered set
    }
    
    int popSmallest() {
        if (!heap.empty()) {
            int num = *heap.begin();
            heap.erase(heap.begin());
            return num;
        }
        return next++;
    }
    
    void addBack(int num) {
        if (num >= next || heap.count(num)) {
            return;
        }
        heap.insert(num);
    }

private:
    std::set<int> heap;  // Sorted set as min-heap
    int next = 1;         // Next number from infinite sequence
};
```

<!-- slide -->
```java
class SmallestInfiniteSet {
    private PriorityQueue<Integer> heap;
    private HashSet<Integer> present;
    private int next;
    
    public SmallestInfiniteSet() {
        // Min-heap to store numbers added back
        heap = new PriorityQueue<>();
        // Set to track numbers in heap
        present = new HashSet<>();
        // Next number from infinite sequence
        next = 1;
    }
    
    public int popSmallest() {
        if (!heap.isEmpty()) {
            int num = heap.poll();
            present.remove(num);
            return num;
        }
        return next++;
    }
    
    public void addBack(int num) {
        // Can't add back if already in the sequence or in heap
        if (num >= next || present.contains(num)) {
            return;
        }
        heap.offer(num);
        present.add(num);
    }
}
```

<!-- slide -->
```javascript
/**
 * Smallest Infinite Set Data Structure
 */
var SmallestInfiniteSet = function() {
    // Min-heap to store numbers added back
    this.heap = [];
    // Set to track numbers in heap
    this.present = new Set();
    // Next number from infinite sequence
    this.next = 1;
};

/**
 * Remove and return the smallest number in the set.
 * @return {number} The smallest number
 */
SmallestInfiniteSet.prototype.popSmallest = function() {
    if (this.heap.length > 0) {
        // Use a simple array as min-heap
        const num = this.heap.shift();
        this.present.delete(num);
        // Re-heapify
        this.heap.sort((a, b) => a - b);
        return num;
    }
    return this.next++;
};

/**
 * Add a number back to the set if it was previously removed.
 * @param {number} num - The number to add back
 */
SmallestInfiniteSet.prototype.addBack = function(num) {
    // Can't add back if already in the sequence or in heap
    if (num >= this.next || this.present.has(num)) {
        return;
    }
    this.heap.push(num);
    this.present.add(num);
    // Maintain min-heap property
    this.heap.sort((a, b) => a - b);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time - popSmallest()** | O(log n) for heap, O(1) for infinite sequence |
| **Time - addBack()** | O(log n) for heap insertion |
| **Space** | O(n) - Heap and set store at most n elements |

---

## Approach 2: Alternative Design with Lazy Generation

This approach uses a boolean array to track which numbers are currently in the set.

### Code Implementation

````carousel
```python
class SmallestInfiniteSet:
    def __init__(self):
        # Boolean array to track numbers in set (up to reasonable limit)
        self.in_set = [True] * 1001
        self.max_num = 1000
        
    def popSmallest(self) -> int:
        # Find smallest number still in set
        for i in range(1, self.max_num + 1):
            if self.in_set[i]:
                self.in_set[i] = False
                return i
        return -1  # Should not happen with constraints
    
    def addBack(self, num: int) -> None:
        if 1 <= num <= self.max_num:
            self.in_set[num] = True
```

<!-- slide -->
```cpp
class SmallestInfiniteSet {
    vector<bool> inSet;
    const int MAX_NUM = 1000;
    
public:
    SmallestInfiniteSet() {
        inSet.resize(MAX_NUM + 1, true);
    }
    
    int popSmallest() {
        for (int i = 1; i <= MAX_NUM; i++) {
            if (inSet[i]) {
                inSet[i] = false;
                return i;
            }
        }
        return -1;
    }
    
    void addBack(int num) {
        if (num >= 1 && num <= MAX_NUM) {
            inSet[num] = true;
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time - popSmallest()** | O(n) - Linear scan worst case |
| **Time - addBack()** | O(1) |
| **Space** | O(n) - Boolean array |

---

## Comparison of Approaches

| Aspect | Heap-Based | Boolean Array |
|--------|------------|---------------|
| **popSmallest()** | O(log n) or O(1) | O(n) worst case |
| **addBack()** | O(log n) | O(1) |
| **Space** | O(n) | O(n) |
| **Scalability** | Excellent | Limited by array size |
| **Recommended** | ✅ Yes | For small constraints |

**Best Approach:** The Heap-Based approach is optimal and recommended.

---

## Why Heap-Based Design is Optimal

The heap-based design is optimal because:

1. **Efficient Operations**: Both operations are O(log n) in worst case
2. **Scalability**: Works with any number of operations (not limited by array size)
3. **Clean Logic**: Separates infinite sequence from added-back numbers
4. **Memory Efficient**: Only stores numbers that have been added back

---

## Related Problems

Based on similar themes (data structure design, heap usage):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design a Stack With Incremental Operation | [Link](https://leetcode.com/problems/design-a-stack-with-incremental-operation/) | Stack with increment operation |
| Random Pick with Weight | [Link](https://leetcode.com/problems/random-pick-with-weight/) | Weighted random selection |
| Seat Reservation Manager | [Link](https://leetcode.com/problems/seat-reservation-manager/) | Seat booking system |

### Pattern Reference

For more detailed explanations of data structure design patterns, see:
- **[Heap/Priority Queue Pattern](/patterns/heap-priority-queue)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Data Structure Design

- [NeetCode - Smallest Number in Infinite Set](https://www.youtube.com/watch?v=9ZBbG3N6XbM) - Clear explanation
- [Heap Data Structure](https://www.youtube.com/watch?v=wpte6x2Zl7Q) - Heap fundamentals
- [Priority Queue Implementation](https://www.youtube.com/watch?v=9X0_S4Z4w3Q) - Priority queue concepts

---

## Follow-up Questions

### Q1: How would you handle very large numbers (beyond 1000)?

**Answer:** Use a hash set instead of a boolean array, and dynamically grow the "next" counter. The heap approach naturally handles this.

---

### Q2: What if you need to support peekSmallest() without removing?

**Answer:** Check the heap first (return heap[0]), otherwise return `next`. Both operations would be O(1) for peek.

---

### Q3: How would you modify to track the largest number instead?

**Answer:** Use a max-heap instead of min-heap, or simply track the largest number separately and return it when appropriate.

---

### Q4: Can you implement this without using a separate set for tracking?

**Answer:** You could push duplicate values to the heap and skip them when popped, but this is less efficient. The set provides O(1) lookup to avoid duplicates.

---

### Q5: How would you handle concurrent access?

**Answer:** Add locking mechanisms (mutexes) for thread safety. In Python, use threading.Lock. In Java, use synchronized blocks or ReentrantLock.

---

### Q6: What are the edge cases to test?

**Answer:**
- Add back the same number multiple times
- Add back numbers in non-sequential order
- Alternate between popSmallest and addBack
- Add back numbers greater than next

---

### Q7: How does this compare to using a balanced BST?

**Answer:** Both provide O(log n) operations. Heaps are slightly faster for priority queue operations, while BSTs support additional operations like finding k-th smallest.

---

## Common Pitfalls

### 1. Duplicate Numbers in Heap
**Issue**: Adding the same number multiple times to the heap.

**Solution**: Use a set (`present`) to track numbers in the heap and check before adding.

### 2. Adding Back Numbers Still in Sequence
**Issue**: Adding back a number that's still available in the infinite sequence.

**Solution**: Check `if num >= next` before adding to prevent this.

### 3. Not Removing from Set
**Issue**: Forgetting to remove from the set when popping from heap.

**Solution**: Always remove the popped number from both heap and set.

### 4. Heap Implementation Differences
**Issue**: Different languages handle heaps differently (Python's heapq is min-heap, C++ priority_queue is max-heap by default).

**Solution**: Be aware of language-specific heap implementations and adjust accordingly.

---

## Summary

The **Smallest Number in Infinite Set** problem demonstrates efficient data structure design:

- **Heap-Based Approach**: Optimal with O(log n) operations
- **Two Data Sources**: Infinite sequence + heap for added-back numbers
- **Set for Deduplication**: Prevents duplicate entries in heap

The key insight is maintaining two sources of numbers: the infinite sequence (tracked by `next`) and numbers added back (stored in heap). This allows efficient O(log n) operations while supporting an infinite set of positive integers.

This problem is an excellent demonstration of how combining simple data structures (heap + set) can create an elegant solution to a seemingly complex problem.

### Pattern Summary

This problem exemplifies the **Data Structure Design** pattern using heaps, characterized by:
- Combining multiple data structures for efficiency
- Tracking state across operations
- Handling edge cases with proper validation

For more details on heap-based patterns, see the **[Heap/Priority Queue Pattern](/patterns/heap-priority-queue)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/smallest-number-in-infinite-set/discuss/) - Community solutions
- [Heap Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/heap-data-structure/) - Comprehensive heap guide
- [Python heapq](https://docs.python.org/3/library/heapq.html) - Python heap implementation
- [Java PriorityQueue](https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html) - Java priority queue
