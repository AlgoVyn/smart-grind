# Merge K Sorted Lists

## Problem Description

You are given an array of `k` linked-lists `lists`, where each linked-list is sorted in ascending order. Merge all linked-lists into one sorted linked-list and return it.

**Link to problem:** [Merge K Sorted Lists - LeetCode 23](https://leetcode.com/problems/merge-k-sorted-lists/)

## Constraints
- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` is sorted in ascending order
- The sum of all `lists[i].length` will not exceed `10^4`

---

## Pattern: Divide and Conquer + Heap

This problem is a classic example of the **Divide and Conquer + Heap** pattern. The pattern combines efficient data structures (heaps) with algorithmic strategies (divide and conquer) to solve multi-way merge problems.

### Core Concept

The fundamental idea is efficiently selecting the smallest element from multiple sorted sequences:
- **Heap/ Priority Queue**: Always gives access to the minimum element in O(1), with O(log k) insertion/deletion
- **Divide and Conquer**: Pair up lists and merge them recursively
- **Efficiency**: Achieve O(n log k) time complexity

---

## Examples

### Example

**Input:**
```
lists = [[1,4,5],[1,3,4],[2,6]]
```

**Output:**
```
[1,1,2,3,4,4,5,6]
```

**Explanation:**
```
List 1: 1 → 4 → 5
List 2: 1 → 3 → 4
List 3: 2 → 6

Merged: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
```

### Example 2: Empty Input

**Input:**
```
lists = []
```

**Output:**
```
[]
```

### Example 3: Lists with Empty Sublists

**Input:**
```
lists = [[]]
```

**Output:**
```
[]
```

---

## Intuition

The key insight is that we need to efficiently find the smallest current element among k sorted lists:

1. **Heap Approach (Recommended)**: Use a min-heap to always get the smallest element
   - O(n log k) time - n total elements, k heap size
   - O(k) space for heap

2. **Divide and Conquer**: Pair up lists and merge recursively
   - O(n log k) time - same complexity
   - O(log k) space for recursion stack

3. **Brute Force**: Combine all elements and sort
   - O(n log n) time - less optimal for large k

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Heap-Based (Optimal)** - O(n log k) time, O(k) space
2. **Divide and Conquer** - O(n log k) time, O(log k) space
3. **Brute Force** - O(n log n) time, O(n) space

---

## Approach 1: Heap-Based (Optimal)

Use a min-heap to always select the smallest current node from all lists.

### Algorithm Steps

1. Initialize a min-heap and push the head of each non-empty list
2. Create a dummy node for the result
3. While heap is not empty:
   - Pop the smallest node
   - Add it to the merged list
   - If the popped node has a next node, push it to heap
4. Return dummy.next

### Why It Works

The heap always contains the current smallest element from each list. By always extracting the minimum and adding the next element from that list, we maintain the sorted order.

### Code Implementation

````carousel
```python
import heapq
from typing import List, Optional

# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        """
        Merge k sorted linked lists using a min-heap.
        
        Args:
            lists: List of sorted linked list heads
            
        Returns:
            Head of merged sorted linked list
        """
        # Handle empty input
        if not lists:
            return None
        
        # Min-heap: (node_value, list_index, node)
        # Using list_index to break ties and avoid comparison issues
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))
        
        # Dummy node to start the merged list
        dummy = ListNode()
        current = dummy
        
        # Extract smallest node from heap repeatedly
        while heap:
            val, i, node = heapq.heappop(heap)
            current.next = node
            current = current.next
            
            # Push next node from the same list
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        
        return dummy.next
```

<!-- slide -->
```cpp
/**
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
        // Handle empty input
        if (lists.empty()) {
            return nullptr;
        }
        
        // Min-heap with custom comparator
        priority_queue<pair<int, ListNode*>, vector<pair<int, ListNode*>>, greater<pair<int, ListNode*>> > pq;
        
        // Push head of each non-empty list
        for (int i = 0; i < lists.size(); i++) {
            if (lists[i]) {
                pq.push({lists[i]->val, lists[i]});
            }
        }
        
        // Dummy node for result
        ListNode* dummy = new ListNode();
        ListNode* current = dummy;
        
        // Extract minimum and add next
        while (!pq.empty()) {
            auto [val, node] = pq.top();
            pq.pop();
            
            current->next = node;
            current = current->next;
            
            if (node->next) {
                pq.push({node->next->val, node->next});
            }
        }
        
        return dummy->next;
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
        if (lists == null || lists.length == 0) {
            return null;
        }
        
        // Min-heap
        PriorityQueue<ListNode> pq = new PriorityQueue<>(
            (a, b) -> a.val - b.val
        );
        
        // Push head of each non-empty list
        for (ListNode node : lists) {
            if (node != null) {
                pq.offer(node);
            }
        }
        
        // Dummy node for result
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        // Extract minimum and add next
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
var mergeKLists = function(lists) {
    if (!lists || lists.length === 0) {
        return null;
    }
    
    // Min-heap using JavaScript's array with custom comparison
    const heap = [];
    
    // Push head of each non-empty list
    for (let i = 0; i < lists.length; i++) {
        if (lists[i]) {
            heap.push(lists[i]);
        }
    }
    
    // Custom heap push function
    const heapPush = (node) => {
        heap.push(node);
        heap.sort((a, b) => a.val - b.val);
    };
    
    // Custom heap pop function
    const heapPop = () => {
        return heap.shift();
    };
    
    // Dummy node for result
    const dummy = new ListNode();
    let current = dummy;
    
    // Extract minimum and add next
    while (heap.length > 0) {
        const node = heapPop();
        current.next = node;
        current = current.next;
        
        if (node.next) {
            heapPush(node.next);
        }
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - n total nodes, each heap operation is O(log k) |
| **Space** | O(k) - heap holds at most k nodes |

---

## Approach 2: Divide and Conquer

Pair up lists and merge them recursively, similar to merge sort.

### Algorithm Steps

1. If only one list, return it
2. Divide lists into two halves
3. Recursively merge each half
4. Merge the two results using the two-list merge algorithm

### Code Implementation

````carousel
```python
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        """
        Merge using divide and conquer.
        """
        if not lists:
            return None
        
        return self.divide_and_conquer(lists, 0, len(lists) - 1)
    
    def divide_and_conquer(self, lists, left, right):
        if left == right:
            return lists[left]
        if left > right:
            return None
        
        mid = (left + right) // 2
        left_half = self.divide_and_conquer(lists, left, mid)
        right_half = self.divide_and_conquer(lists, mid + 1, right)
        return self.merge_two_lists(left_half, right_half)
    
    def merge_two_lists(self, l1, l2):
        dummy = ListNode()
        current = dummy
        
        while l1 and l2:
            if l1.val < l2.val:
                current.next = l1
                l1 = l1.next
            else:
                current.next = l2
                l2 = l2.next
            current = current.next
        
        current.next = l1 or l2
        return dummy.next
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        return divideAndConquer(lists, 0, lists.size() - 1);
    }
    
private:
    ListNode* divideAndConquer(vector<ListNode*>& lists, int left, int right) {
        if (left == right) return lists[left];
        if (left > right) return nullptr;
        
        int mid = left + (right - left) / 2;
        ListNode* leftHalf = divideAndConquer(lists, left, mid);
        ListNode* rightHalf = divideAndConquer(lists, mid + 1, right);
        return mergeTwoLists(leftHalf, rightHalf);
    }
    
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode* dummy = new ListNode();
        ListNode* current = dummy;
        
        while (l1 && l2) {
            if (l1->val < l2->val) {
                current->next = l1;
                l1 = l1->next;
            } else {
                current->next = l2;
                l2 = l2->next;
            }
            current = current->next;
        }
        
        current->next = l1 ? l1 : l2;
        return dummy->next;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        return divideAndConquer(lists, 0, lists.length - 1);
    }
    
    private ListNode divideAndConquer(ListNode[] lists, int left, int right) {
        if (left == right) return lists[left];
        if (left > right) return null;
        
        int mid = left + (right - left) / 2;
        ListNode leftHalf = divideAndConquer(lists, left, mid);
        ListNode rightHalf = divideAndConquer(lists, mid + 1, right);
        return mergeTwoLists(leftHalf, rightHalf);
    }
    
    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode();
        ListNode current = dummy;
        
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        
        current.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
var mergeKLists = function(lists) {
    if (!lists || lists.length === 0) return null;
    
    const divideAndConquer = (left, right) => {
        if (left === right) return lists[left];
        if (left > right) return null;
        
        const mid = Math.floor((left + right) / 2);
        const leftHalf = divideAndConquer(left, mid);
        const rightHalf = divideAndConquer(mid + 1, right);
        return mergeTwoLists(leftHalf, rightHalf);
    };
    
    const mergeTwoLists = (l1, l2) => {
        const dummy = new ListNode();
        let current = dummy;
        
        while (l1 && l2) {
            if (l1.val < l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }
        
        current.next = l1 || l2;
        return dummy.next;
    };
    
    return divideAndConquer(0, lists.length - 1);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) - each level merges n nodes, log k levels |
| **Space** | O(log k) - recursion stack depth |

---

## Approach 3: Brute Force (Combine and Sort)

Collect all values, sort them, and rebuild the list.

### Code Implementation

````carousel
```python
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeKLists_bruteforce(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        """
        Merge by collecting all values and sorting.
        """
        values = []
        
        # Collect all values
        for head in lists:
            while head:
                values.append(head.val)
                head = head.next
        
        # Sort values
        values.sort()
        
        # Rebuild linked list
        dummy = ListNode()
        current = dummy
        for val in values:
            current.next = ListNode(val)
            current = current.next
        
        return dummy.next
```

<!-- slide -->
```cpp
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        vector<int> values;
        
        // Collect all values
        for (auto list : lists) {
            while (list) {
                values.push_back(list->val);
                list = list->next;
            }
        }
        
        // Sort values
        sort(values.begin(), values.end());
        
        // Rebuild linked list
        ListNode* dummy = new ListNode();
        ListNode* current = dummy;
        for (int val : values) {
            current->next = new ListNode(val);
            current = current->next;
        }
        
        return dummy->next;
    }
};
```

<!-- slide -->
```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        List<Integer> values = new ArrayList<>();
        
        // Collect all values
        for (ListNode head : lists) {
            while (head != null) {
                values.add(head.val);
                head = head.next;
            }
        }
        
        // Sort values
        Collections.sort(values);
        
        // Rebuild linked list
        ListNode dummy = new ListNode();
        ListNode current = dummy;
        for (int val : values) {
            current.next = new ListNode(val);
            current = current.next;
        }
        
        return dummy.next;
    }
}
```

<!-- slide -->
```javascript
var mergeKLists = function(lists) {
    const values = [];
    
    // Collect all values
    for (let head of lists) {
        while (head) {
            values.push(head.val);
            head = head.next;
        }
    }
    
    // Sort values
    values.sort((a, b) => a - b);
    
    // Rebuild linked list
    const dummy = new ListNode();
    let current = dummy;
    for (const val of values) {
        current.next = new ListNode(val);
        current = current.next;
    }
    
    return dummy.next;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - collecting O(n), sorting O(n log n) |
| **Space** | O(n) - storing all values |

---

## Comparison of Approaches

| Aspect | Heap | Divide & Conquer | Brute Force |
|--------|------|------------------|-------------|
| **Time Complexity** | O(n log k) | O(n log k) | O(n log n) |
| **Space Complexity** | O(k) | O(log k) | O(n) |
| **Implementation** | Moderate | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |

**Best Approach:** Heap-based solution is recommended for its simplicity and optimal complexity.

---

## Why Heap-Based is Optimal

The heap-based approach is optimal because:

1. **Efficient Selection**: O(1) access to minimum, O(log k) insertion/deletion
2. **Total Complexity**: O(n log k) - each of n nodes costs log k
3. **Space Efficient**: Only stores k elements in heap
4. **Industry Standard**: Widely used for k-way merge problems

---

## Related Problems

Based on similar themes (k-way merge, heap problems):

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge K Sorted Arrays | [Link](https://leetcode.com/problems/merge-k-sorted-arrays/) | Merge k sorted arrays |
| Smallest Range Covering Elements | [Link](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) | Find smallest range |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge Two Sorted Lists | [Link](https://leetcode.com/problems/merge-two-sorted-lists/) | Merge two sorted lists |
| Kth Smallest Element in a Sorted Matrix | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | K-way merge with heap |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Heap-Based Solutions

- [NeetCode - Merge K Sorted Lists](https://www.youtube.com/watch?v=Lnol-DQC68Q) - Clear explanation
- [Heap Approach Explained](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough

### Divide and Conquer

- [Divide and Conquer Merge](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Recursive approach
- [Merge Sort Concept](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Similar merging strategy

---

## Follow-up Questions

### Q1: How would you handle very large k (e.g., k = 10^4)?

**Answer:** The heap approach handles large k well with O(n log k). The divide and conquer approach also scales similarly. Consider using a size-limited heap or batch processing if memory is a concern.

---

### Q2: What if you need to merge in descending order?

**Answer:** Use a max-heap instead of min-heap, or negate values before pushing to min-heap.

---

### Q3: How would you modify for arrays instead of linked lists?

**Answer:** The algorithm is identical - treat array indices as pointers. The heap stores (value, array_index, element_index).

---

### Q4: Can you achieve O(n) time for fixed k?

**Answer:** With a fixed small k (like k=2 or k=3), you can use a simple O(n) comparison approach without heap overhead.

---

### Q5: How would you handle duplicates across lists?

**Answer:** The algorithm naturally handles duplicates - they all get pushed to heap and extracted in sorted order.

---

### Q6: What edge cases should be tested?

**Answer:**
- All lists empty
- One list containing all elements
- Lists with single elements
- Lists with negative values
- Lists of vastly different lengths

---

### Q7: How would you implement without a heap library?

**Answer:** You can implement a custom binary heap or use the divide-and-conquer approach which doesn't require a heap.

---

### Q8: How would you track which list each node came from?

**Answer:** Store a tuple (value, list_index, node) in the heap. The list_index can be used for tracking.

---

## Common Pitfalls

### 1. Empty Lists
**Issue**: Not handling empty lists in the input

**Solution**: Check for null nodes before pushing to heap

### 2. Heap Comparison
**Issue**: Custom objects may not compare properly in heap

**Solution**: Use tuple (value, index, node) for reliable comparison

### 3. Memory Leaks
**Issue**: Not properly cleaning up dummy nodes

**Solution**: In languages without GC (C++), properly delete or reuse dummy nodes

### 4. Large k Values
**Issue**: Performance degradation with very large k

**Solution:** Consider divide-and-conquer for better cache locality

---

## Summary

The **Merge K Sorted Lists** problem demonstrates powerful algorithmic patterns:

- **Heap-Based**: Optimal O(n log k) with simple implementation
- **Divide and Conquer**: Same complexity with O(log k) space
- **Brute Force**: O(n log n) - simpler but less optimal

The heap-based solution is optimal because it efficiently selects the minimum from k sorted sequences.

### Pattern Summary

This problem exemplifies the **K-Way Merge** pattern using heaps, which is characterized by:
- Maintaining a heap of current elements from each list
- Always extracting the minimum and adding next from same source
- Achieving O(n log k) time complexity

For more details on heap-based patterns, see the **[Heap Pattern](/patterns/heap-k-way-merge)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/merge-k-sorted-lists/discuss/) - Community solutions
- [Heap Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/heap-data-structure/) - Understanding heaps
- [K-Way Merge](https://en.wikipedia.org/wiki/K-way_merge) - Learn about the algorithm
- [Priority Queue](https://www.geeksforgeeks.org/priority-queue-set-1-introduction/) - Implementation details
