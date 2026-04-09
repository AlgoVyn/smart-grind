# Flashcard: Two Heaps for Median Finding - Comparison

## Card 1

--- front ---
Compare: Two Heaps vs Sorted List for median finding

--- back ---
| Aspect | Two Heaps | Sorted List |
|--------|-----------|-------------|
| Insert | O(log n) | O(n) - insert + shift |
| Find Median | O(1) | O(1) - direct index |
| Space | O(n) | O(n) |
| Use When | Streaming data, frequent insertions | Small n, simple implementation |

**Winner:** Two Heaps for streams, Sorted List for static or small data.

--- end ---

## Card 2

--- front ---
Compare: Two Heaps vs Order Statistic Tree for median finding

--- back ---
| Aspect | Two Heaps | Order Statistic Tree |
|--------|-----------|---------------------|
| Insert | O(log n) | O(log n) |
| Find Median | O(1) | O(log n) or O(1) with augmentation |
| Delete | Hard (lazy deletion) | Easy O(log n) |
| Select k-th | Not supported | O(log n) |
| Available | All languages | C++ PBDS, custom implementation |

**Winner:** Order Statistic Tree for arbitrary deletions/select, Two Heaps for simple median streaming.

--- end ---

## Card 3

--- front ---
Compare: Standard Two Heaps vs Two Heaps with Lazy Deletion

--- back ---
| Aspect | Standard | With Lazy Deletion |
|--------|----------|-------------------|
| Use Case | Data stream (only adds) | Sliding window (adds + removes) |
| Insert | O(log n) | O(log n) |
| Remove | Not supported | O(log n) amortized |
| Complexity | Simple | Complex (pruning, hash map) |
| Space | O(n) | O(k) for window size k |

**Standard:** LeetCode 295 (Find Median from Data Stream)
**Lazy Deletion:** LeetCode 480 (Sliding Window Median)

--- end ---

## Card 4

--- front ---
When would you use counting sort instead of two heaps for median?

--- back ---
**Use counting sort when:**
- Data range is small and known (e.g., 0-100)
- You need O(1) insertion and median query
- Data consists of integers

**Trade-off:**
- Two Heaps: O(log n) time, works for any comparable data
- Counting Sort: O(1) time, O(range) space, integers only

**Example:** If numbers are in range [0, 100], use array of size 101.

--- end ---

## Card 5

--- front ---
Compare C++, Java, and Python implementations of two heaps

--- back ---
| Language | Max-Heap | Min-Heap | Syntax |
|----------|----------|----------|--------|
| **C++** | `priority_queue<int>` | `priority_queue<int, vector<int>, greater<int>>` | `.top()`, `.push()`, `.pop()` |
| **Java** | `PriorityQueue<>(Collections.reverseOrder())` | `PriorityQueue<>()` | `.peek()`, `.offer()`, `.poll()` |
| **Python** | `heapq` with negation `[-x]` | `heapq` | `[0]` peek, `.heappush()`, `.heappop()` |

**Python note:** Only min-heap native; negate values for max-heap.
**C++ note:** Default is max-heap; specify comparator for min-heap.

--- end ---
