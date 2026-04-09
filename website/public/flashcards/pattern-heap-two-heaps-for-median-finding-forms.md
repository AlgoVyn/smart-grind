# Flashcard: Two Heaps for Median Finding - Forms

## Card 1

--- front ---
What is the classic form of the Two Heaps pattern?

--- back ---
**Find Median from Data Stream (LeetCode 295)**

Operations:
- `addNum(num)`: Add number to data structure
- `findMedian()`: Return median of all numbers seen

Characteristics:
- Only insertions, no deletions
- Running median after each insertion
- O(log n) per insertion, O(1) per query

This is the standard form that all variations build upon.

--- end ---

## Card 2

--- front ---
What is the sliding window form of the median problem?

--- back ---
**Sliding Window Median (LeetCode 480)**

Problem: Find median of each window of size k as it slides through array.

Additional requirements:
- Remove elements that slide out of window
- Lazy deletion with hash map
- Prune invalid elements before computing median

Complexity: O(n log k) time, O(k) space

Key challenge: Efficient element removal from heap.

--- end ---

## Card 3

--- front ---
What variations exist for the two heaps pattern?

--- back ---
**Common Forms:**

1. **Data Stream** - Classic, only insertions
2. **Sliding Window** - Insertions + deletions with lazy deletion
3. **K-th Percentile** - Multiple heaps or order statistic tree
4. **Two Sorted Arrays** - Binary search approach (LeetCode 4)
5. **Real-time Statistics** - Median, plus min/max tracking

**Key distinction:** Static vs dynamic data, and what statistics are needed.

--- end ---

## Card 4

--- front ---
How does the two heaps pattern adapt for other percentiles?

--- back ---
**For arbitrary percentiles (e.g., 25th, 75th):**

Option 1: **Multiple heaps**
- Partition data into more than 2 heaps
- Track multiple boundaries

Option 2: **Order Statistic Tree**
- Augmented BST with subtree sizes
- Select k-th element in O(log n)
- More general, handles any percentile

Option 3: **Counting structure** (for integer data)
- Prefix sums for O(1) percentile queries

--- end ---

## Card 5

--- front ---
What related problems use the two heaps pattern?

--- back ---
| Problem | LeetCode | Key Variation |
|---------|----------|---------------|
| Find Median from Data Stream | 295 | Classic form |
| Sliding Window Median | 480 | With lazy deletion |
| Median of Two Sorted Arrays | 4 | Binary search variant |
| Statistics from Large Sample | 1093 | Counting sort variant |
| The Skyline Problem | 218 | Heap application |

**Recognition pattern:**
- "Running median" or "stream of numbers"
- "Find median in O(1) after each insertion"
- "Sliding window" + "median"

--- end ---
