# Merge K Sorted Lists

## Category
Heap / Priority Queue

## Description

Merge K Sorted Lists is a classic problem that merges k sorted linked lists into one sorted list. The optimal approach uses a min-heap (priority queue) to always extract the smallest element among the current heads of all lists.

The algorithm works as follows:
1. Initialize a min-heap with the first element from each list
2. Extract the minimum element from heap and add to result
3. Push the next element from the same list into the heap
4. Repeat until heap is empty

Time complexity: O(N log k) where N is total elements and k is number of lists
- Each element is inserted and extracted from heap once: O(N log k)
- Building the initial heap: O(k)

Space complexity: O(k) for the heap plus O(k) for the result list.

Alternative approaches include:
- Divide and conquer (merge pairs of lists recursively)
- Naive approach (merge one list at a time)

---

## When to Use

Use this algorithm when you need to solve problems involving:

- **Multiple Sorted Sequences**: When you need to merge or process multiple sorted arrays/lists efficiently
- **K-way Merge Problems**: When merging k sorted data sources into one sorted output
- **Finding Kth Smallest**: When finding the kth smallest element across multiple sorted structures
- **Priority Queue Applications**: When you need to repeatedly select the minimum/maximum from multiple sources

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Min-Heap / Priority Queue** | O(N log k) | O(k) | General purpose, streaming data |
| **Divide and Conquer** | O(N log k) | O(log k) | Linked lists, recursion-friendly |
| **Naive (merge one by one)** | O(N·k) | O(k) | Only when k is very small |
| **Brute Force** | O(N·k) | O(N) | When heap not available |

### When to Choose Each Approach

- **Choose Min-Heap** when:
  - You need to process elements as they come
  - Memory is a concern (O(k) space)
  - You're working with linked lists or arrays
  - You want the most straightforward solution

- **Choose Divide and Conquer** when:
  - Working with linked lists (can merge in-place)
  - You want to avoid heap overhead
  - Recursion is acceptable
  - k is a power of 2 (optimal pairing)

- **Choose Naive** when:
  - k is very small (k ≤ 2)
  - Simplicity is more important than efficiency
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind the Merge K Sorted Lists algorithm is to **always have access to the smallest current element** from all k lists. By using a min-heap (priority queue), we can efficiently find and extract the minimum among k "pointers" (one per list) in O(log k) time.

### How It Works

#### Min-Heap Approach:

1. **Initialization**: Insert the first node from each of the k lists into the min-heap. Each heap element stores: (value, list_index, node_pointer).

2. **Extraction**: Repeatedly extract the minimum element from the heap - this is guaranteed to be the smallest among all current list heads.

3. **Insertion**: After extracting a node, push the next node from the same list into the heap (if one exists).

4. **Termination**: When the heap becomes empty, all nodes have been processed, and we have a fully merged sorted list.

#### Divide and Conquer Approach:

1. **Pair Up**: Merge lists pairwise (list[0] with list[1], list[2] with list[3], etc.)

2. **Recurse**: Apply the same merging process to the newly merged lists

3. **Base Case**: When only one list remains, return it

### Visual Representation

Given three sorted lists:
```
List 1: 1 → 4 → 7 → 10 → NULL
List 2: 2 → 5 → 8 → NULL
List 3: 3 → 6 → 9 → 11 → NULL
```

Min-Heap operations:
```
Step 1: Heap has [1(list1), 2(list2), 3(list3)] → Extract 1, add 4
Step 2: Heap has [2(list2), 3(list3), 4(list1)] → Extract 2, add 5
Step 3: Heap has [3(list3), 4(list1), 5(list2)] → Extract 3, add 6
... and so on until all merged
```

### Why Min-Heap Works

- The heap always contains exactly k elements (one from each non-empty list)
- The minimum element is always at the top (O(1) access)
- Insertion and extraction are both O(log k)
- Each of the N total elements is processed exactly once

---

## Algorithm Steps

### Min-Heap Approach

1. **Handle edge cases**: If lists is empty or contains only nulls, return null
2. **Initialize heap**: Create a min-heap and add the first node from each non-empty list
3. **Create dummy node**: Use a dummy head to simplify list construction
4. **Process while heap not empty**:
   - Extract minimum from heap
   - Add to result list
   - If extracted node has a next node, push next node to heap
5. **Return**: Return dummy.next (the head of merged list)

### Divide and Conquer Approach

1. **Base case**: If lists is empty, return null; if lists has one element, return it
2. **Pair merging**: While more than one list exists, merge pairs together
3. **Handle odd list**: If odd number of lists, carry over the last unpaired list
4. **Recurse**: Continue until only one list remains

---

## Implementation

### Template Code (Min-Heap Approach)

````carousel
```python
import heapq
from typing import List, Optional

class ListNode:
    """Definition for singly-linked list node"""
    def __init__(self, val: int = 0, next: 'ListNode' = None):
        self.val = val
        self.next = next


def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted linked lists into one sorted list using min-heap.
    
    Args:
        lists: List of sorted linked list heads
        
    Returns:
        Head of merged sorted linked list
        
    Time: O(N log k)
    Space: O(k)
    """
    # Dummy head for easier construction
    dummy = ListNode(-1)
    current = dummy
    
    # Initialize min-heap with (value, list_index, node)
    # list_index is used to break ties
    heap = []
    
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    # Process heap
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = ListNode(val)
        current = current.next
        
        # Push next node from same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next


def merge_k_lists_divide_conquer(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted lists using divide and conquer approach.
    
    Args:
        lists: List of sorted linked list heads
        
    Returns:
        Head of merged sorted linked list
        
    Time: O(N log k)
    Space: O(log k) for recursion stack
    """
    if not lists:
        return None
    
    # Merge two lists at a time
    while len(lists) > 1:
        merged_lists = []
        
        for i in range(0, len(lists) - 1, 2):
            merged = merge_two_lists(lists[i], lists[i + 1])
            merged_lists.append(merged)
        
        # Handle odd number of lists
        if len(lists) % 2 == 1:
            merged_lists.append(lists[-1])
        
        lists = merged_lists
    
    return lists[0]


def merge_two_lists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    """Merge two sorted linked lists"""
    dummy = ListNode(-1)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next


def list_to_linkedlist(arr: List[int]) -> Optional[ListNode]:
    """Convert list to linked list"""
    if not arr:
        return None
    dummy = ListNode(-1)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next


def linkedlist_to_list(node: Optional[ListNode]) -> List[int]:
    """Convert linked list to list"""
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result


# Example usage
if __name__ == "__main__":
    # Create sorted linked lists
    list1 = list_to_linkedlist([1, 4, 7, 10])
    list2 = list_to_linkedlist([2, 5, 8])
    list3 = list_to_linkedlist([3, 6, 9, 11])
    
    lists = [list1, list2, list3]
    
    # Merge using heap
    result = merge_k_lists(lists)
    print("Merged (using heap):", linkedlist_to_list(result))
    # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    
    # Recreate lists for second method
    list1 = list_to_linkedlist([1, 4, 7, 10])
    list2 = list_to_linkedlist([2, 5, 8])
    list3 = list_to_linkedlist([3, 6, 9, 11])
    
    # Merge using divide and conquer
    result = merge_k_lists_divide_conquer([list1, list2, list3])
    print("Merged (divide conquer):", linkedlist_to_list(result))
    # Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    
    # Edge case: empty list
    result = merge_k_lists([])
    print("Empty input:", linkedlist_to_list(result))  # []
    
    # Edge case: one list
    result = merge_k_lists([list_to_linkedlist([1, 2, 3])])
    print("Single list:", linkedlist_to_list(result))  # [1, 2, 3]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

/**
 * Definition for singly-linked list.
 */
struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

/**
 * Merge k sorted linked lists using min-heap (priority queue).
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(k)
 */
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Priority queue with custom comparator for min-heap
        // Stores (value, list_index, node pointer)
        auto cmp = [](const pair<int, ListNode*>& a, const pair<int, ListNode*>& b) {
            return a.first > b.first;  // Min-heap: smallest value at top
        };
        
        priority_queue<pair<int, ListNode*>, vector<pair<int, ListNode*>>, decltype(cmp)> pq(cmp);
        
        // Initialize heap with first node from each list
        for (int i = 0; i < lists.size(); i++) {
            if (lists[i] != nullptr) {
                pq.push({lists[i]->val, lists[i]});
            }
        }
        
        // Dummy head for easier construction
        ListNode dummy(0);
        ListNode* current = &dummy;
        
        // Process heap
        while (!pq.empty()) {
            auto [val, node] = pq.top();
            pq.pop();
            
            current->next = new ListNode(val);
            current = current->next;
            
            // Push next node from same list
            if (node->next != nullptr) {
                pq.push({node->next->val, node->next});
            }
        }
        
        return dummy.next;
    }
    
    /**
     * Merge k sorted lists using divide and conquer.
     * 
     * Time Complexity: O(N log k)
     * Space Complexity: O(log k) for recursion stack
     */
    ListNode* mergeKListsDivideConquer(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        
        while (lists.size() > 1) {
            vector<ListNode*> mergedLists;
            
            for (int i = 0; i < lists.size() - 1; i += 2) {
                ListNode* merged = mergeTwoLists(lists[i], lists[i + 1]);
                mergedLists.push_back(merged);
            }
            
            // Handle odd number of lists
            if (lists.size() % 2 == 1) {
                mergedLists.push_back(lists.back());
            }
            
            lists = mergedLists;
        }
        
        return lists[0];
    }
    
private:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* current = &dummy;
        
        while (l1 && l2) {
            if (l1->val <= l2->val) {
                current->next = l1;
                l1 = l1->next;
            } else {
                current->next = l2;
                l2 = l2->next;
            }
            current = current->next;
        }
        
        current->next = l1 ? l1 : l2;
        return dummy.next;
    }
};

// Helper functions for testing
ListNode* createList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode dummy(0);
    ListNode* current = &dummy;
    for (int val : arr) {
        current->next = new ListNode(val);
        current = current->next;
    }
    return dummy.next;
}

vector<int> toVector(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

int main() {
    Solution solution;
    
    // Create sorted linked lists
    vector<ListNode*> lists = {
        createList({1, 4, 7, 10}),
        createList({2, 5, 8}),
        createList({3, 6, 9, 11})
    };
    
    // Merge using heap
    ListNode* result = solution.mergeKLists(lists);
    cout << "Merged (heap): ";
    for (int val : toVector(result)) cout << val << " ";
    cout << endl;
    // Output: 1 2 3 4 5 6 7 8 9 10 11
    
    // Recreate lists for second method
    lists = {
        createList({1, 4, 7, 10}),
        createList({2, 5, 8}),
        createList({3, 6, 9, 11})
    };
    
    // Merge using divide and conquer
    result = solution.mergeKListsDivideConquer(lists);
    cout << "Merged (divide conquer): ";
    for (int val : toVector(result)) cout << val << " ";
    cout << endl;
    // Output: 1 2 3 4 5 6 7 8 9 10 11
    
    // Edge cases
    vector<ListNode*> emptyLists = {};
    result = solution.mergeKLists(emptyLists);
    cout << "Empty input: " << (toVector(result).empty() ? "empty" : "not empty") << endl;
    
    vector<ListNode*> singleList = {createList({1, 2, 3})};
    result = solution.mergeKLists(singleList);
    cout << "Single list: ";
    for (int val : toVector(result)) cout << val << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Definition for singly-linked list.
 */
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

/**
 * Merge k sorted linked lists using min-heap (priority queue).
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(k)
 */
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Min-heap prioritized by value
        PriorityQueue<ListNode> pq = new PriorityQueue<>(
            (a, b) -> Integer.compare(a.val, b.val)
        );
        
        // Initialize heap with first node from each list
        for (ListNode node : lists) {
            if (node != null) {
                pq.offer(node);
            }
        }
        
        // Dummy head for easier construction
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        // Process heap
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            current.next = new ListNode(node.val);
            current = current.next;
            
            // Push next node from same list
            if (node.next != null) {
                pq.offer(node.next);
            }
        }
        
        return dummy.next;
    }
    
    /**
     * Merge k sorted lists using divide and conquer.
     * 
     * Time Complexity: O(N log k)
     * Space Complexity: O(log k) for recursion stack
     */
    public ListNode mergeKListsDivideConquer(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        
        while (lists.length > 1) {
            ListNode[] mergedLists = new ListNode[(lists.length + 1) / 2];
            
            for (int i = 0; i < lists.length - 1; i += 2) {
                mergedLists[i / 2] = mergeTwoLists(lists[i], lists[i + 1]);
            }
            
            // Handle odd number of lists
            if (lists.length % 2 == 1) {
                mergedLists[mergedLists.length - 1] = lists[lists.length - 1];
            }
            
            lists = mergedLists;
        }
        
        return lists[0];
    }
    
    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
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
    
    // Helper method to create list from array
    static ListNode createList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        for (int val : arr) {
            current.next = new ListNode(val);
            current = current.next;
        }
        return dummy.next;
    }
    
    // Helper method to convert list to array
    static List<Integer> toList(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result;
    }
    
    // Main method for testing
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // Create sorted linked lists
        ListNode[] lists = {
            createList(new int[]{1, 4, 7, 10}),
            createList(new int[]{2, 5, 8}),
            createList(new int[]{3, 6, 9, 11})
        };
        
        // Merge using heap
        ListNode result = solution.mergeKLists(lists);
        System.out.println("Merged (heap): " + toList(result));
        // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        
        // Recreate lists for second method
        lists = new ListNode[]{
            createList(new int[]{1, 4, 7, 10}),
            createList(new int[]{2, 5, 8}),
            createList(new int[]{3, 6, 9, 11})
        };
        
        // Merge using divide and conquer
        result = solution.mergeKListsDivideConquer(lists);
        System.out.println("Merged (divide conquer): " + toList(result));
        // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        
        // Edge cases
        ListNode[] emptyLists = {};
        result = solution.mergeKLists(emptyLists);
        System.out.println("Empty input: " + toList(result));
        
        ListNode[] singleList = {createList(new int[]{1, 2, 3})};
        result = solution.mergeKLists(singleList);
        System.out.println("Single list: " + toList(result));
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
 * Merge k sorted linked lists using min-heap (priority queue).
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(k)
 * 
 * @param {ListNode[]} lists - Array of sorted linked list heads
 * @returns {ListNode|null} - Head of merged sorted linked list
 */
function mergeKLists(lists) {
    // Min-heap using priority queue
    // We'll use a simple array with sorting for clarity
    // In production, use a proper heap implementation
    
    const heap = [];
    
    // Initialize heap with first node from each list
    for (let i = 0; i < lists.length; i++) {
        if (lists[i]) {
            heap.push({ val: lists[i].val, index: i, node: lists[i] });
        }
    }
    
    // Sort to create min-heap behavior
    heap.sort((a, b) => a.val - b.val);
    
    // Dummy head for easier construction
    const dummy = new ListNode(0);
    let current = dummy;
    
    // Process heap
    while (heap.length > 0) {
        // Extract minimum (first element after sort)
        const { val, index, node } = heap.shift();
        
        current.next = new ListNode(val);
        current = current.next;
        
        // Push next node from same list
        if (node.next) {
            heap.push({ 
                val: node.next.val, 
                index: index, 
                node: node.next 
            });
            // Re-sort to maintain min-heap
            heap.sort((a, b) => a.val - b.val);
        }
    }
    
    return dummy.next;
}

/**
 * Merge k sorted lists using divide and conquer approach.
 * 
 * Time Complexity: O(N log k)
 * Space Complexity: O(log k) for recursion stack
 * 
 * @param {ListNode[]} lists - Array of sorted linked list heads
 * @returns {ListNode|null} - Head of merged sorted linked list
 */
function mergeKListsDivideConquer(lists) {
    if (!lists || lists.length === 0) return null;
    if (lists.length === 1) return lists[0];
    
    // Merge pairs iteratively
    while (lists.length > 1) {
        const mergedLists = [];
        
        for (let i = 0; i < lists.length - 1; i += 2) {
            const merged = mergeTwoLists(lists[i], lists[i + 1]);
            mergedLists.push(merged);
        }
        
        // Handle odd number of lists
        if (lists.length % 2 === 1) {
            mergedLists.push(lists[lists.length - 1]);
        }
        
        lists = mergedLists;
    }
    
    return lists[0];
}

/**
 * Merge two sorted linked lists.
 * 
 * @param {ListNode} l1 - First sorted linked list
 * @param {ListNode} l2 - Second sorted linked list
 * @returns {ListNode} - Merged sorted linked list
 */
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (l1 && l2) {
        if (l1.val <= l2.val) {
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
}

/**
 * Helper function to convert array to linked list.
 * 
 * @param {number[]} arr - Input array
 * @returns {ListNode|null} - Linked list head
 */
function arrayToList(arr) {
    if (!arr || arr.length === 0) return null;
    
    const dummy = new ListNode(0);
    let current = dummy;
    
    for (const val of arr) {
        current.next = new ListNode(val);
        current = current.next;
    }
    
    return dummy.next;
}

/**
 * Helper function to convert linked list to array.
 * 
 * @param {ListNode} head - Linked list head
 * @returns {number[]} - Array representation
 */
function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

// Example usage and testing
console.log("=== Merge K Sorted Lists Demo ===\n");

// Create sorted linked lists
const list1 = arrayToList([1, 4, 7, 10]);
const list2 = arrayToList([2, 5, 8]);
const list3 = arrayToList([3, 6, 9, 11]);

// Merge using heap approach
const merged1 = mergeKLists([list1, list2, list3]);
console.log("Merged (heap):", listToArray(merged1));
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

// Recreate lists for second method
const list1b = arrayToList([1, 4, 7, 10]);
const list2b = arrayToList([2, 5, 8]);
const list3b = arrayToList([3, 6, 9, 11]);

// Merge using divide and conquer
const merged2 = mergeKListsDivideConquer([list1b, list2b, list3b]);
console.log("Merged (divide conquer):", listToArray(merged2));
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

// Edge cases
console.log("Empty input:", listToArray(mergeKLists([])));
// Output: []

console.log("Single list:", listToArray(mergeKLists([arrayToList([1, 2, 3])])));
// Output: [1, 2, 3]

console.log("Lists with nulls:", listToArray(mergeKLists([null, arrayToList([1]), null])));
// Output: [1]
```
````

---

## Time Complexity Analysis

| Operation | Min-Heap Approach | Divide and Conquer | Naive Approach |
|-----------|-------------------|-------------------|----------------|
| **Build/Init** | O(k) | O(k) | O(k) |
| **Processing** | O(N log k) | O(N log k) | O(N·k) |
| **Total** | **O(N log k)** | **O(N log k)** | **O(N·k)** |

### Detailed Breakdown

#### Min-Heap Approach:
- **Heap initialization**: O(k) - insert first element from each list
- **Processing N elements**: Each element requires:
  - One heap extract: O(log k)
  - One potential heap insert: O(log k)
  - Total: O(N log k)
- **Overall**: O(N log k) + O(k) = O(N log k)

#### Divide and Conquer:
- **First level**: k/2 merges, each processing ~2N/k elements
- **Second level**: k/4 merges, each processing ~4N/k elements
- **Total levels**: log(k)
- **Overall**: O(N log k)

---

## Space Complexity Analysis

| Approach | Heap/Queue Space | Result Space | Recursion Stack | Total |
|----------|-----------------|--------------|------------------|-------|
| **Min-Heap** | O(k) | O(N) | O(1) | O(N + k) |
| **Divide and Conquer** | O(1) | O(N) | O(log k) | O(N + log k) |
| **Naive** | O(k) | O(N) | O(1) | O(N + k) |

### Key Observations

- **Min-Heap**: Uses O(k) for the priority queue
- **Divide and Conquer**: Uses O(log k) for recursion stack (no heap needed)
- **Result space**: O(N) is required regardless of approach to store the output

---

## Common Variations

### 1. Merge K Sorted Arrays

Instead of linked lists, merge sorted arrays using the same heap-based approach.

````carousel
```python
import heapq

def merge_k_arrays(arrays):
    """Merge k sorted arrays into one sorted array."""
    result = []
    heap = []
    
    # Initialize heap with (value, array_index, element_index)
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
    
    while heap:
        val, i, j = heapq.heappop(heap)
        result.append(val)
        
        # Push next element from same array
        if j + 1 < len(arrays[i]):
            heapq.heappush(heap, (arrays[i][j + 1], i, j + 1))
    
    return result
```
````

### 2. Kth Smallest Element in N Sorted Lists

Find the kth smallest element across k sorted lists without fully merging.

````carousel
```python
import heapq

def kth_smallest(lists, k):
    """Find kth smallest element in k sorted lists."""
    if not lists or k <= 0:
        return None
    
    # Heap stores (value, list_index, element_index)
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    # Extract k-1 elements
    for _ in range(k - 1):
        if not heap:
            return None
        val, i, j = heapq.heappop(heap)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    
    return heap[0][0] if heap else None
```
````

### 3. External Merge Sort

When data is too large to fit in memory, use the heap-based merge for external sorting.

### 4. Stream Merging

Merge infinite or streaming sorted data sources using a persistent heap.

---

## Practice Problems

### Problem 1: Merge K Sorted Lists (Classic)

**Problem:** [LeetCode 23 - Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

**Description:** You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.

**How to Apply:**
- Use min-heap to always extract the smallest current element
- Time complexity: O(N log k) where N = total elements, k = number of lists
- Space: O(k) for the heap

---

### Problem 2: Kth Smallest Element in Sorted Matrix

**Problem:** [LeetCode 378 - Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)

**Description:** Given an n x n matrix where each of the rows and columns is sorted in ascending order, return the kth smallest element in the matrix.

**How to Apply:**
- Treat each row as a sorted list
- Use min-heap to find kth smallest in O(k log n) time
- Alternative: Binary search with count function

---

### Problem 3: Smallest Range Covering Elements from K Lists

**Problem:** [LeetCode 632 - Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/)

**Description:** You have k lists of sorted integers in non-decreasing order. Find the smallest range that contains at least one number from each of the k lists.

**How to Apply:**
- Use min-heap to maintain current window
- Use max-heap or track current maximum
- Slide window using heap operations

---

### Problem 4: Find Median from Data Stream

**Problem:** [LeetCode 295 - Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)

**Description:** Design a data structure that supports adding a num from data stream and finding the median of all elements so far.

**How to Apply:**
- Use two heaps: min-heap for upper half, max-heap for lower half
- Balance heaps to ensure median is at heap tops
- This is a direct application of the k-way merge heap principle

---

### Problem 5: Top K Frequent Elements

**Problem:** [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

**Description:** Given an integer array nums and an integer k, return the k most frequent elements.

**How to Apply:**
- Use heap to efficiently select top k elements
- First count frequencies, then use max-heap to extract k most frequent
- Time: O(N log k) for heap operations

---

## Video Tutorial Links

### Fundamentals

- [Merge K Sorted Lists - LeetCode Solution (Take U Forward)](https://www.youtube.com/watch?v=z5R1R4E6y8I) - Comprehensive explanation with multiple approaches
- [Priority Queue / Min Heap Approach (NeetCode)](https://www.youtube.com/watch?v=3WaxQMELSkw) - Detailed min-heap implementation
- [Divide and Conquer Approach (WilliamFiset)](https://www.youtube.com/watch?v=pmKjNCBelJo) - Alternative approach explanation

### Related Topics

- [Heap Data Structure Complete Guide](https://www.youtube.com/watch?v=11X5tO9A3xE) - Understanding heaps
- [Priority Queue Implementation](https://www.youtube.com/watch?v=EnZFg8jZ6l0) - How priority queues work
- [K-way Merge Pattern](https://www.youtube.com/watch?v=8g1P5z9iT4U) - General k-way merge technique

---

## Follow-up Questions

### Q1: What if some lists are much longer than others?

**Answer:** The min-heap approach handles this naturally. Shorter lists will exhaust their elements sooner, and only the remaining non-empty lists will continue to contribute to the heap. The time complexity remains O(N log k) regardless of list length distribution.

### Q2: Can you do better than O(N log k)?

**Answer:** No, Ω(N log k) is optimal for comparison-based merging because:
- Each element must be compared at least once to determine order
- With k lists, each comparison can only eliminate one candidate
- However, if data has special properties (e.g., bounded integer range), counting sort variants can achieve O(N)

### Q3: How would you handle very large files that don't fit in memory?

**Answer:** Use external merge sort:
1. Split files into chunks that fit in memory
2. Sort each chunk individually
3. Use heap-based k-way merge to merge sorted chunks
4. Write output to disk incrementally

### Q4: What if you need to merge arrays instead of linked lists?

**Answer:** The approach is identical! Simply replace the linked list node access (`node.next`) with array index access (`arr[index + 1]`). The algorithmic complexity remains the same.

### Q5: When should you choose divide and conquer over heap-based approach?

**Answer:** Choose divide and conquer when:
- Working with linked lists (can merge in-place without extra space)
- Memory is very constrained (O(log k) vs O(k) space)
- You want to avoid heap overhead
- The number of lists is a power of 2 (optimal pairing)

---

## Summary

The Merge K Sorted Lists algorithm is a fundamental heap-based problem that demonstrates the power of priority queues for merging multiple sorted sequences. Key takeaways:

- **Min-Heap Approach**: O(N log k) time, O(k) space - most intuitive and commonly used
- **Divide and Conquer**: O(N log k) time, O(log k) space - better for linked lists
- **Core Pattern**: Always extract minimum from k sources using a heap
- **Generalization**: This pattern applies to any k-way merge problem

When to use:
- ✅ Multiple sorted sequences that need merging
- ✅ Finding kth smallest/largest across sorted data
- ✅ Stream processing with multiple sources
- ❌ When data is unsorted (need to sort first)
- ❌ When k = 1 (use simple traversal)

This algorithm is essential for understanding heap-based problem solving and frequently appears in technical interviews and competitive programming.

---

## Related Algorithms

- [Merge Two Sorted Lists](./merge-sorted-lists.md) - Base case for merging
- [Kth Largest Element](./kth-largest.md) - Heap-based selection
- [Top K Elements](./heap-top-k-elements.md) - Heap pattern for selection
- [Sliding Window Median](./sliding-window-median.md) - Advanced heap application
