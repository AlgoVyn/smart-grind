# Heap - K-way Merge

## Problem Description

The K-way Merge pattern is used to merge multiple sorted lists or streams into a single sorted list efficiently. It employs a min-heap (priority queue) to always select the smallest element from the current heads of the lists. This pattern is essential for handling large datasets that don't fit in memory or when merging results from parallel processes.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(N log K) where N is total elements, K is number of lists |
| Space Complexity | O(K) for the heap |
| Input | K sorted lists or arrays |
| Output | Single merged sorted list |
| Approach | Min-heap with list tracking |

### When to Use

- Merging K sorted lists or arrays
- Finding Kth smallest in sorted matrices
- External merge sort operations
- Merging results from parallel processes
- Stream merging from multiple sources
- Multiway file merging

## Intuition

The key insight is that we only need to compare the heads of the K lists at any time, and a heap gives us O(log K) access to the minimum.

The "aha!" moments:

1. **Compare heads only**: Only the head of each list can be the next minimum
2. **Heap for minimum**: Min-heap gives O(log K) access to smallest head
3. **Track list origin**: Store list index to know which list to advance
4. **Lazy loading**: Only load next element when current is consumed
5. **Generalizes 2-way**: Classic merge sort merge is K=2 case

## Solution Approaches

### Approach 1: Standard K-way Merge ✅ Recommended

#### Algorithm

1. Initialize min-heap with first element from each list (store value, list_idx, elem_idx)
2. While heap not empty:
   - Pop smallest element from heap
   - Add to result
   - If there's a next element in that list, push it to heap
3. Return merged result

#### Implementation

````carousel
```python
import heapq

def merge_k_sorted_lists(lists: list[list[int]]) -> list[int]:
    """
    Merge K sorted lists into one sorted list.
    Time: O(N log K), Space: O(K)
    """
    # Min-heap: (value, list_index, element_index)
    heap = []
    
    # Initialize with first element from each non-empty list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    result = []
    
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        
        # If there's a next element in this list, push it
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
    
    return result


# For linked lists (LeetCode 23)
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_sorted_linked_lists(lists: list[ListNode]) -> ListNode:
    """
    LeetCode 23 - Merge k Sorted Lists
    """
    heap = []
    
    # Initialize with head of each list
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```
<!-- slide -->
```cpp
/*
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) {
            return a->val > b->val;
        };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
        
        // Push head of each list
        for (auto list : lists) {
            if (list) pq.push(list);
        }
        
        ListNode dummy(0);
        ListNode* current = &dummy;
        
        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();
            
            current->next = node;
            current = current->next;
            
            if (node->next) {
                pq.push(node->next);
            }
        }
        
        return dummy.next;
    }
};
```
<!-- slide -->
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        
        // Push head of each list
        for (ListNode list : lists) {
            if (list != null) pq.offer(list);
        }
        
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            current.next = node;
            current = current.next;
            
            if (node.next != null) {
                pq.offer(node.next);
            }
        }
        
        return dummy.next;
    }
}
```
<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
    const pq = [];
    
    // Push head of each list
    for (let list of lists) {
        if (list) pq.push(list);
    }
    
    // Simple sort-based min-heap (for production, use proper heap)
    pq.sort((a, b) => a.val - b.val);
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (pq.length > 0) {
        pq.sort((a, b) => a.val - b.val);
        const node = pq.shift();
        
        current.next = node;
        current = current.next;
        
        if (node.next) {
            pq.push(node.next);
        }
    }
    
    return dummy.next;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(N log K) - N elements, each heap operation O(log K) |
| Space | O(K) - Heap size at most K |

### Approach 2: Kth Smallest in Sorted Matrix

Finding Kth smallest using K-way merge pattern.

#### Implementation

````carousel
```python
import heapq

def kth_smallest(matrix: list[list[int]], k: int) -> int:
    """
    Find Kth smallest element in sorted matrix.
    LeetCode 378 - Kth Smallest Element in a Sorted Matrix
    Time: O(k log n), Space: O(n)
    """
    n = len(matrix)
    
    # Min-heap: (value, row, col)
    # Start with first column of each row
    heap = [(matrix[i][0], i, 0) for i in range(n)]
    heapq.heapify(heap)
    
    for _ in range(k - 1):
        val, row, col = heapq.heappop(heap)
        
        # Push next element from same row if exists
        if col + 1 < n:
            heapq.heappush(heap, (matrix[row][col + 1], row, col + 1))
    
    return heap[0][0]


# Binary search approach for same problem
def kth_smallest_binary_search(matrix, k):
    """
    Alternative: Binary search on value range.
    Time: O(n log(max-min)), Space: O(1)
    """
    n = len(matrix)
    
    def count_less_equal(mid):
        """Count elements <= mid in sorted matrix."""
        count = 0
        row, col = n - 1, 0
        
        while row >= 0 and col < n:
            if matrix[row][col] <= mid:
                count += row + 1
                col += 1
            else:
                row -= 1
        
        return count
    
    left, right = matrix[0][0], matrix[n-1][n-1]
    
    while left < right:
        mid = (left + right) // 2
        if count_less_equal(mid) < k:
            left = mid + 1
        else:
            right = mid
    
    return left
```
<!-- slide -->
```cpp
class Solution {
public:
    int kthSmallest(vector<vector<int>>& matrix, int k) {
        int n = matrix.size();
        
        // Min-heap: {value, row, col}
        priority_queue<vector<int>, vector<vector<int>>, greater<>> pq;
        
        for (int i = 0; i < n; i++) {
            pq.push({matrix[i][0], i, 0});
        }
        
        for (int i = 0; i < k - 1; i++) {
            auto curr = pq.top();
            pq.pop();
            
            int row = curr[1], col = curr[2];
            if (col + 1 < n) {
                pq.push({matrix[row][col + 1], row, col + 1});
            }
        }
        
        return pq.top()[0];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        
        // Min-heap: [value, row, col]
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        
        for (int i = 0; i < n; i++) {
            pq.offer(new int[]{matrix[i][0], i, 0});
        }
        
        for (int i = 0; i < k - 1; i++) {
            int[] curr = pq.poll();
            int row = curr[1], col = curr[2];
            
            if (col + 1 < n) {
                pq.offer(new int[]{matrix[row][col + 1], row, col + 1});
            }
        }
        
        return pq.peek()[0];
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
function kthSmallest(matrix, k) {
    const n = matrix.length;
    const pq = [];
    
    for (let i = 0; i < n; i++) {
        pq.push([matrix[i][0], i, 0]);
    }
    pq.sort((a, b) => a[0] - b[0]);
    
    for (let i = 0; i < k - 1; i++) {
        const [val, row, col] = pq.shift();
        
        if (col + 1 < n) {
            pq.push([matrix[row][col + 1], row, col + 1]);
            pq.sort((a, b) => a[0] - b[0]);
        }
    }
    
    return pq[0][0];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(k log n) - k iterations, each heap op O(log n) |
| Space | O(n) - Heap size at most n |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| K-way Merge | O(N log K) | O(K) | **Recommended** - General solution |
| Binary Search | O(n log(max-min)) | O(1) | Matrix Kth smallest |
| Divide and Conquer | O(N log K) | O(log K) | When heap not allowed |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) | 23 | Hard | Classic K-way merge |
| [Kth Smallest Element in Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | 378 | Medium | Matrix K-way merge |
| [Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | 373 | Medium | Two arrays K-way merge |
| [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) | 632 | Hard | Range finding |
| [Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/) | 88 | Easy | K=2 case |
| [Ugly Number II](https://leetcode.com/problems/ugly-number-ii/) | 264 | Medium | K-way merge variant |

## Video Tutorial Links

1. **[NeetCode - Merge K Sorted Lists](https://www.youtube.com/watch?v=q5a5OiGbT6Q)** - Heap approach
2. **[Back To Back SWE - K-way Merge](https://www.youtube.com/watch?v=5xR68UIZeKE)** - Pattern explanation
3. **[Kevin Naughton Jr. - Kth Smallest](https://www.youtube.com/watch?v=0d6GsOJMaWw)** - Matrix problem

## Summary

### Key Takeaways

- **Heap size K**: Only need to track one element from each list
- **Lazy loading**: Only load next element when current consumed
- **Track origin**: Store list index to know which list to advance
- **N log K complexity**: Better than naive O(N log N) for large K
- **Generalizes merge**: 2-way merge is K=2 special case

### Common Pitfalls

- Empty lists in input (check before pushing to heap)
- Not tracking which list an element came from
- Using wrong comparison for heap ordering
- Forgetting to handle null/None elements
- Memory issues with very large K

### Follow-up Questions

1. **What if K is very large?**
   - Consider divide and conquer approach

2. **Can we do better than N log K?**
   - No, must examine all N elements

3. **How to handle streaming data?**
   - K-way merge naturally handles streams

4. **What about external sorting?**
   - K-way merge is core to external merge sort

## Pattern Source

[Heap - K-way Merge](patterns/heap-k-way-merge.md)
