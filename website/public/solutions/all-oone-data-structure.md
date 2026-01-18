# All O`one Data Structure

## Problem Description
Design a data structure that supports all following operations in **O(1) average time complexity**:

1. `inc(key)`: Inserts a new key with value 1. Or increments an existing key by 1.
2. `dec(key)`: Decrements an existing key by 1. If the key's value is 1, remove it from the data structure.
3. `getMaxKey()`: Returns one of the keys with maximal value.
4. `getMinKey()`: Returns one of the keys with minimal value.

This is **LeetCode Problem #432** and is classified as a Hard difficulty problem. It tests your understanding of advanced data structure design and complexity analysis.

### Detailed Problem Statement
- Keys are strings
- Values are positive integers
- When dec(key) reduces value to 0, the key is removed
- getMaxKey() and getMinKey() return any key with max/min value (if structure is empty, return "")

### Key Constraints
| Constraint | Description |
|------------|-------------|
| `1 <= key.length <= 10` | Key length is small |
| `inc`, `dec`, `getMaxKey`, and `getMinKey` will be called at most `2 * 10^5` times | Performance requirements |

---

## Examples

### Example 1:
```python
# Initialize AllOne
ao = AllOne()

ao.inc("hello")       # Adds "hello":1
ao.inc("hello")       # "hello":2
ao.getMaxKey()        # "hello"
ao.getMinKey()        # "hello"
ao.inc("leet")        # Adds "leet":1
ao.getMaxKey()        # "hello"
ao.getMinKey()        # "leet"
```

### Example 2:
```python
ao = AllOne()

ao.inc("a")
ao.inc("b")
ao.inc("b")
ao.inc("c")
ao.inc("c")
ao.inc("c")
ao.dec("b")           # "b":1
ao.dec("b")           # "b" is removed
ao.getMinKey()        # "a"
ao.dec("a")           # "a" is removed
ao.getMinKey()        # ""
ao.getMaxKey()        # "c"
```

---

## Intuition
To achieve O(1) average time complexity for all operations, we need a combination of:

1. **Hash Map (Dictionary)**: For O(1) access to key-value pairs
2. **Doubly Linked List of Buckets**: Each bucket contains keys with the same count
3. **Hash Map from Count to Bucket**: For O(1) access to buckets by count

Key insight: Each bucket in the doubly linked list contains all keys with a specific count, allowing efficient movement of keys between buckets.

---

## Solution Approaches

### Approach 1: Doubly Linked List of Buckets + Hash Maps (Optimal) ✅ Recommended
This approach uses a bucket doubly linked list combined with two hash maps for O(1) average time operations.

```python
class Bucket:
    def __init__(self, count=0):
        self.count = count
        self.keys = set()
        self.prev = None
        self.next = None

class AllOne:
    def __init__(self):
        # key -> count
        self.key_count = {}
        # count -> Bucket
        self.count_bucket = {}
        # Doubly linked list dummy head and tail
        self.head = Bucket()
        self.tail = Bucket()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_bucket_after(self, new_bucket, prev_bucket):
        # Add new_bucket between prev_bucket and prev_bucket.next
        new_bucket.prev = prev_bucket
        new_bucket.next = prev_bucket.next
        prev_bucket.next.prev = new_bucket
        prev_bucket.next = new_bucket

    def _remove_bucket(self, bucket):
        # Remove bucket from linked list
        bucket.prev.next = bucket.next
        bucket.next.prev = bucket.prev
        bucket.prev = None
        bucket.next = None

    def inc(self, key: str) -> None:
        if key in self.key_count:
            old_count = self.key_count[key]
            new_count = old_count + 1
            self.key_count[key] = new_count
            
            old_bucket = self.count_bucket[old_count]
            old_bucket.keys.remove(key)
            
            # Create new bucket if not exists
            if new_count not in self.count_bucket:
                new_bucket = Bucket(new_count)
                self.count_bucket[new_count] = new_bucket
                self._add_bucket_after(new_bucket, old_bucket)
            
            self.count_bucket[new_count].keys.add(key)
            
            # Remove old bucket if it's empty
            if not old_bucket.keys:
                del self.count_bucket[old_count]
                self._remove_bucket(old_bucket)
        else:
            # New key, count = 1
            self.key_count[key] = 1
            if 1 not in self.count_bucket:
                new_bucket = Bucket(1)
                self.count_bucket[1] = new_bucket
                self._add_bucket_after(new_bucket, self.head)
            self.count_bucket[1].keys.add(key)

    def dec(self, key: str) -> None:
        if key not in self.key_count:
            return
            
        old_count = self.key_count[key]
        new_count = old_count - 1
        
        old_bucket = self.count_bucket[old_count]
        old_bucket.keys.remove(key)
        
        if new_count == 0:
            del self.key_count[key]
        else:
            self.key_count[key] = new_count
            if new_count not in self.count_bucket:
                new_bucket = Bucket(new_count)
                self.count_bucket[new_count] = new_bucket
                self._add_bucket_after(new_bucket, old_bucket.prev)
            self.count_bucket[new_count].keys.add(key)
            
        # Remove old bucket if it's empty
        if not old_bucket.keys:
            del self.count_bucket[old_count]
            self._remove_bucket(old_bucket)

    def getMaxKey(self) -> str:
        if self.tail.prev == self.head:
            return ""
        bucket = self.tail.prev
        # Return any key from the bucket
        return next(iter(bucket.keys))

    def getMinKey(self) -> str:
        if self.head.next == self.tail:
            return ""
        bucket = self.head.next
        return next(iter(bucket.keys))
```

#### How It Works
1. **Bucket Class**: Represents keys with the same count, includes prev/next pointers
2. **Key-Count Map**: Direct access to a key's count
3. **Count-Bucket Map**: Direct access to bucket by count
4. **Doubly Linked List**: Maintains buckets in order of count for O(1) min/max access
5. **Operations**:
   - `inc`: Move key to next count bucket, create if needed
   - `dec`: Move key to previous count bucket or remove if count becomes 0
   - `getMaxKey`: Return key from bucket before dummy tail
   - `getMinKey`: Return key from bucket after dummy head

---

## Complexity Analysis

### Time Complexity
| Operation | Time Complexity |
|-----------|-----------------|
| `inc` | O(1) average |
| `dec` | O(1) average |
| `getMaxKey` | O(1) |
| `getMinKey` | O(1) |

### Space Complexity
- O(n) where n is the number of unique keys

### Why It's Average O(1)
- Each key moves between buckets at most O(n) times
- Each key insertion/deletion involves O(1) linked list operations
- Amortized over all operations, average time per operation is O(1)

---

## Edge Cases and Common Pitfalls

### Edge Cases
1. **Decrementing a key with count 1**: Should remove the key from the structure
2. **Operations on empty structure**: getMaxKey() and getMinKey() return ""
3. **Multiple keys with same count**: Operations should handle bucket with multiple keys
4. **Incrementing a key to a new max/min count**: Should handle bucket creation
5. **Large number of operations**: Up to 2 * 10^5 calls

### Common Mistakes
1. **Not handling the case when a bucket becomes empty**
2. **Forgetting to update both hash maps during operations**
3. **Incorrect linked list manipulation leading to broken structure**
4. **Not handling decrement to count 0 properly**

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Asked in senior-level and system design interviews
- **Companies**: Google, Facebook, Microsoft, Amazon, ByteDance
- **Difficulty**: Hard, tests advanced data structure design
- **Variations**: Leads to problems with similar bucket-based approaches

### Learning Outcomes
1. **Advanced Data Structure Design**: Combine hash maps and linked lists
2. **Bucket-based Design**: Group elements by count for efficiency
3. **Complexity Analysis**: Understand amortized vs worst-case time complexity
4. **System Design Thinking**: Design for multiple conflicting requirements

---

## Related Problems

### Same Pattern (Bucket-based)
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [LFU Cache](/solutions/lfu-cache.md) | 460 | Hard | Least frequently used cache |
| [LRU Cache](/solutions/lru-cache.md) | 146 | Medium | Least recently used cache |
| [Design Skiplist](/solutions/design-skiplist.md) | 1206 | Hard | Advanced skip list |

### Similar Concepts
| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Design Underground System](/solutions/design-underground-system.md) | 1396 | Medium | Tracking average times |
| [Design Twitter](/solutions/design-twitter.md) | 355 | Medium | Social media feed design |
| [Implement Trie](/solutions/implement-trie-prefix-tree.md) | 208 | Medium | Prefix tree structure |

---

## Video Tutorial Links

### Recommended Tutorials
1. **[All O`one Data Structure - LeetCode Hard](https://www.youtube.com/watch?v=zgcLO0EymKQ)**
   - Detailed explanation of bucket approach
   - Step-by-step walkthrough of all operations
   - Visual demonstration of linked list manipulations

2. **[LeetCode 432 - AllOne Data Structure](https://www.youtube.com/watch?v=S6IfqDXWa10)**
   - Implementation details in Python
   - Time and space complexity analysis
   - Common mistakes and how to avoid them

3. **[Data Structures: Doubly Linked List](https://www.youtube.com/watch?v=JdQeNxWCguQ)**
   - Visual explanation of doubly linked list operations
   - Foundation for understanding bucket linking

### Additional Resources
- **[Doubly Linked List - GeeksforGeeks](https://www.geeksforgeeks.org/doubly-linked-list/)** - Comprehensive guide
- **[Amortized Analysis - Wikipedia](https://en.wikipedia.org/wiki/Amortized_analysis)** - Complexity analysis
- **[LeetCode Discuss](https://leetcode.com/problems/all-oone-data-structure/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level
1. **What data structures are used and why?**
   - Hash maps for O(1) lookups, doubly linked list of buckets for O(1) min/max

2. **Why use buckets of keys with the same count?**
   - Allows efficient movement of keys between counts

3. **What do getMaxKey() and getMinKey() return if structure is empty?**
   - Empty string ("")

### Intermediate Level
4. **How would you modify the solution to track all keys with max/min value?**
   - Currently it returns any key from the bucket; you could return all if needed

5. **What if keys can have very large lengths?**
   - Current implementation handles any key lengths, as it's just storing strings

6. **What's the worst-case time complexity for inc or dec?**
   - O(1) amortized; in rare cases could be O(n) if many buckets are created and destroyed

### Advanced Level
7. **How would you implement this with a different data structure?**
   - Using a balanced BST might simplify, but would complicate O(1) time

8. **What if you need to support additional operations like getNthMaxKey()?**
   - Might need to track more information about bucket order

9. **How does this compare to using a priority queue?**
   - Priority queues are O(log n) per operation, not O(1) average

### Practical Implementation Questions
10. **How would you test this implementation?**
    - Test all edge cases, sequence of operations, and performance

11. **What if you need to handle concurrent operations?**
    - Add locks or use thread-safe data structures

12. **How would you optimize for memory usage?**
    - Reuse bucket objects instead of creating new ones

---

## Summary
The **All O`one Data Structure** problem is an advanced data structure design problem that requires:

1. **Combination of Hash Maps and Linked Lists**: For O(1) access and manipulation
2. **Bucket-based Organization**: Grouping keys by count for efficient movement
3. **Doubly Linked List Operations**: For maintaining order of counts
4. **Amortized O(1) Time Complexity**: Average time per operation is O(1)

This approach is commonly used in scenarios where you need to track counts of elements with fast access to min/max values, such as in word frequency counters, analytics systems, and distributed cache designs.
