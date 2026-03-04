# Merge Two Sorted Lists

## Category
Linked List

## Description

Merge Two Sorted Lists is a classic algorithm problem where we combine two **already sorted** linked lists (or arrays) into a single sorted data structure. This is a fundamental operation in merge sort and appears frequently in technical interviews and real-world applications.

The key insight is that since both input lists are sorted, we can efficiently merge them by always selecting the smaller of the two current elements—similar to the merge step in the merge sort algorithm.

---

## When to Use

Use the Merge Two Sorted Lists algorithm when you need to solve problems involving:

- **Combining sorted sequences**: Merging two sorted arrays, lists, or files
- **Merge Sort**: The core merge step in the divide-and-conquer merge sort algorithm
- **External sorting**: When sorting large files that don't fit in memory
- **K-way merge**: Generalizing to merging k sorted sequences using a min-heap
- **Sorted stream combination**: Combining multiple sorted data streams

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Two Pointers (Iterative)** | O(n + m) | O(1) | Two sorted linked lists/arrays |
| **Recursive** | O(n + m) | O(n + m) stack | When recursion is preferred |
| **K-way Merge (Heap)** | O(n log k) | O(k) | k sorted sequences |
| **Naive Concatenation + Sort** | O((n+m) log(n+m)) | O(n + m) | When lists aren't pre-sorted |

### When to Choose Each Approach

- **Choose Two Pointers** when:
  - Working with linked lists (O(1) space is beneficial)
  - Both lists are already sorted
  - Memory is a constraint

- **Choose Recursive** when:
  - Code readability is prioritized
  - Stack overflow isn't a concern for small inputs
  - Implementing merge sort

- **Choose K-way Merge** when:
  - Merging more than two sorted sequences
  - Using a min-heap for optimal element selection

- **Choose Naive + Sort** when:
  - Lists aren't guaranteed to be sorted
  - Simplicity is preferred over efficiency

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind merging two sorted lists is simple: **since both lists are sorted, the smallest remaining element must be at the head of one of the two lists**. By repeatedly picking the smaller head and advancing that list, we build a fully merged sorted result.

This is analogous to shuffling two sorted card decks into one sorted deck—you always pick the smaller of the top two cards.

### How It Works

#### Iterative Approach:

1. **Create a dummy node**: A placeholder node that simplifies edge case handling (empty lists, etc.)
2. **Maintain a tail pointer**: Points to the last node in our merged list
3. **Compare and pick**: At each step, compare the current nodes from both lists
4. **Attach and advance**: Attach the smaller node to the tail and move forward in that list
5. **Handle leftovers**: When one list is exhausted, attach the remaining nodes directly

#### Recursive Approach:

The recursive solution follows the same logic but uses the call stack to maintain state:
- **Base case**: If either list is empty, return the other list
- **Recursive case**: Compare heads, pick the smaller, and recursively merge the remainder

### Visual Representation

```
List 1: 1 -> 2 -> 4 -> NULL
List 2: 1 -> 3 -> 4 -> NULL

Step-by-step merge:
- Compare 1 (list1) vs 1 (list2): pick 1 from list1
- Compare 2 (list1) vs 1 (list2): pick 1 from list2  
- Compare 2 (list1) vs 3 (list2): pick 2 from list1
- Compare 4 (list1) vs 3 (list2): pick 3 from list2
- Compare 4 (list1) vs 4 (list2): pick 4 from list1
- List1 exhausted, attach remaining 4 from list2

Result: 1 -> 1 -> 2 -> 3 -> 4 -> 4 -> NULL
```

### Why the Dummy Node Approach Works

The dummy node eliminates special cases:
- Instead of checking if the merged list is empty before each attachment
- We always attach to the tail (which always exists)
- At the end, we simply return `dummy.next` to skip the placeholder

### Edge Cases to Consider

1. **Both lists empty**: Return null
2. **One list empty**: Return the other list
3. **Lists with single nodes**: Handle correctly
4. **All elements in one list smaller**: The other list gets attached at once
5. **Duplicate values**: Handle equal values consistently (usually pick from first list)

---

## Algorithm Steps

### Building the Merged List

1. **Create dummy node**: `dummy = new ListNode(-1)` (or any placeholder value)
2. **Initialize tail pointer**: `tail = dummy`
3. **While both lists have nodes**:
   - Compare `list1.val` and `list2.val`
   - Attach the smaller node to `tail.next`
   - Move the chosen list's pointer forward
   - Update `tail = tail.next`
4. **After the loop**: One list may still have nodes
   - If `list1` remains: `tail.next = list1`
   - If `list2` remains: `tail.next = list2`
5. **Return the result**: `return dummy.next` (skip the dummy)

### Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| **Iterative Merge** | O(n + m) | O(1) |
| **Recursive Merge** | O(n + m) | O(n + m) stack |
| **Build Input Lists** | O(n + m) | O(n + m) |

---

## Implementation

### Template Code (Iterative Approach)

````carousel
```python
from typing import Optional

class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val: int = 0, next: 'ListNode' = None):
        self.val = val
        self.next = next


def merge_two_lists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    """
    Merge two sorted linked lists into one sorted list.
    
    Args:
        list1: Head of first sorted linked list
        list2: Head of second sorted linked list
        
    Returns:
        Head of the merged sorted linked list
        
    Time: O(n + m)
    Space: O(1)
    """
    # Create dummy node to simplify edge cases
    dummy = ListNode(-1)
    tail = dummy
    
    # Compare and merge nodes from both lists
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    
    # Attach remaining nodes from list1 (if any)
    if list1:
        tail.next = list1
    
    # Attach remaining nodes from list2 (if any)
    if list2:
        tail.next = list2
    
    return dummy.next


# ==================== HELPER FUNCTIONS ====================

def create_linked_list(arr: list) -> Optional[ListNode]:
    """Create a linked list from a Python list."""
    if not arr:
        return None
    dummy = ListNode(0)
    current = dummy
    for val in arr:
        current.next = ListNode(val)
        current = current.next
    return dummy.next


def linked_list_to_list(node: Optional[ListNode]) -> list:
    """Convert a linked list to Python list for display."""
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result


# ==================== RECURSIVE VERSION ====================

def merge_two_lists_recursive(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    """
    Merge two sorted linked lists recursively.
    
    Time: O(n + m)
    Space: O(n + m) due to recursion stack
    """
    # Base case: if either list is empty, return the other
    if not list1:
        return list2
    if not list2:
        return list1
    
    # Compare and pick the smaller head
    if list1.val <= list2.val:
        list1.next = merge_two_lists_recursive(list1.next, list2)
        return list1
    else:
        list2.next = merge_two_lists_recursive(list1, list2.next)
        return list2


# ==================== EXAMPLE USAGE ====================

if __name__ == "__main__":
    # Create two sorted linked lists:
    # List 1: 1 -> 2 -> 4
    # List 2: 1 -> 3 -> 4
    
    list1 = create_linked_list([1, 2, 4])
    list2 = create_linked_list([1, 3, 4])
    
    # Merge them (iterative)
    result = merge_two_lists(list1, list2)
    print("Iterative result:", linked_list_to_list(result))
    
    # Merge them (recursive)
    list1 = create_linked_list([1, 2, 4])
    list2 = create_linked_list([1, 3, 4])
    result_rec = merge_two_lists_recursive(list1, list2)
    print("Recursive result:", linked_list_to_list(result_rec))
    
    # Edge cases
    print("\nEdge case tests:")
    
    # Both empty
    result = merge_two_lists(None, None)
    print(f"Both empty: {linked_list_to_list(result)}")
    
    # One empty
    result = merge_two_lists(create_linked_list([1, 2, 3]), None)
    print(f"Second empty: {linked_list_to_list(result)}")
    
    result = merge_two_lists(None, create_linked_list([1, 2, 3]))
    print(f"First empty: {linked_list_to_list(result)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
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
 * Merge two sorted linked lists into one sorted list.
 * 
 * Time: O(n + m)
 * Space: O(1)
 */
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Create dummy node to simplify edge cases
    ListNode* dummy = new ListNode(-1);
    ListNode* tail = dummy;
    
    // Compare and merge nodes from both lists
    while (list1 != nullptr && list2 != nullptr) {
        if (list1->val <= list2->val) {
            tail->next = list1;
            list1 = list1->next;
        } else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }
    
    // Attach remaining nodes from list1 (if any)
    if (list1 != nullptr) {
        tail->next = list1;
    }
    
    // Attach remaining nodes from list2 (if any)
    if (list2 != nullptr) {
        tail->next = list2;
    }
    
    ListNode* result = dummy->next;
    delete dummy;  // Clean up dummy node
    return result;
}

/**
 * Merge two sorted linked lists recursively.
 * 
 * Time: O(n + m)
 * Space: O(n + m) stack space
 */
ListNode* mergeTwoListsRecursive(ListNode* list1, ListNode* list2) {
    // Base case: if either list is empty, return the other
    if (list1 == nullptr) return list2;
    if (list2 == nullptr) return list1;
    
    // Compare and pick the smaller head
    if (list1->val <= list2->val) {
        list1->next = mergeTwoListsRecursive(list1->next, list2);
        return list1;
    } else {
        list2->next = mergeTwoListsRecursive(list1, list2->next);
        return list2;
    }
}

// ==================== HELPER FUNCTIONS ====================

ListNode* createLinkedList(const vector<int>& arr) {
    if (arr.empty()) return nullptr;
    
    ListNode* dummy = new ListNode(0);
    ListNode* current = dummy;
    
    for (int val : arr) {
        current->next = new ListNode(val);
        current = current->next;
    }
    
    ListNode* result = dummy->next;
    delete dummy;
    return result;
}

vector<int> linkedListToVector(ListNode* node) {
    vector<int> result;
    while (node != nullptr) {
        result.push_back(node->val);
        node = node->next;
    }
    return result;
}

void printLinkedList(ListNode* node) {
    vector<int> vec = linkedListToVector(node);
    cout << "[";
    for (size_t i = 0; i < vec.size(); i++) {
        cout << vec[i];
        if (i < vec.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
}

// ==================== EXAMPLE USAGE ====================

int main() {
    // Create two sorted linked lists:
    // List 1: 1 -> 2 -> 4
    // List 2: 1 -> 3 -> 4
    
    vector<int> arr1 = {1, 2, 4};
    vector<int> arr2 = {1, 3, 4};
    
    ListNode* list1 = createLinkedList(arr1);
    ListNode* list2 = createLinkedList(arr2);
    
    // Merge them (iterative)
    ListNode* result = mergeTwoLists(list1, list2);
    cout << "Iterative result: ";
    printLinkedList(result);
    
    // Merge them (recursive)
    list1 = createLinkedList(arr1);
    list2 = createLinkedList(arr2);
    ListNode* resultRec = mergeTwoListsRecursive(list1, list2);
    cout << "Recursive result: ";
    printLinkedList(resultRec);
    
    // Edge cases
    cout << "\nEdge case tests:" << endl;
    
    // Both empty
    ListNode* empty = mergeTwoLists(nullptr, nullptr);
    cout << "Both empty: ";
    printLinkedList(empty);
    
    // One empty
    ListNode* oneEmpty = mergeTwoLists(createLinkedList({1, 2, 3}), nullptr);
    cout << "Second empty: ";
    printLinkedList(oneEmpty);
    
    oneEmpty = mergeTwoLists(nullptr, createLinkedList({1, 2, 3}));
    cout << "First empty: ";
    printLinkedList(oneEmpty);
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Definition for singly-linked list.
 */
class ListNode {
    int val;
    ListNode next;
    
    ListNode() {}
    
    ListNode(int val) {
        this.val = val;
    }
    
    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Merge two sorted linked lists into one sorted list.
 * 
 * Time: O(n + m)
 * Space: O(1)
 */
public class MergeTwoSortedLists {
    
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Create dummy node to simplify edge cases
        ListNode dummy = new ListNode(-1);
        ListNode tail = dummy;
        
        // Compare and merge nodes from both lists
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        
        // Attach remaining nodes from list1 (if any)
        if (list1 != null) {
            tail.next = list1;
        }
        
        // Attach remaining nodes from list2 (if any)
        if (list2 != null) {
            tail.next = list2;
        }
        
        return dummy.next;
    }
    
    /**
     * Merge two sorted linked lists recursively.
     * 
     * Time: O(n + m)
     * Space: O(n + m) stack space
     */
    public static ListNode mergeTwoListsRecursive(ListNode list1, ListNode list2) {
        // Base case: if either list is empty, return the other
        if (list1 == null) return list2;
        if (list2 == null) return list1;
        
        // Compare and pick the smaller head
        if (list1.val <= list2.val) {
            list1.next = mergeTwoListsRecursive(list1.next, list2);
            return list1;
        } else {
            list2.next = mergeTwoListsRecursive(list1, list2.next);
            return list2;
        }
    }
    
    // ==================== HELPER FUNCTIONS ====================
    
    public static ListNode createLinkedList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        
        for (int val : arr) {
            current.next = new ListNode(val);
            current = current.next;
        }
        
        return dummy.next;
    }
    
    public static void printLinkedList(ListNode node) {
        System.out.print("[");
        boolean first = true;
        while (node != null) {
            if (!first) System.out.print(", ");
            System.out.print(node.val);
            first = false;
            node = node.next;
        }
        System.out.println("]");
    }
    
    // ==================== EXAMPLE USAGE ====================
    
    public static void main(String[] args) {
        // Create two sorted linked lists:
        // List 1: 1 -> 2 -> 4
        // List 2: 1 -> 3 -> 4
        
        int[] arr1 = {1, 2, 4};
        int[] arr2 = {1, 3, 4};
        
        ListNode list1 = createLinkedList(arr1);
        ListNode list2 = createLinkedList(arr2);
        
        // Merge them (iterative)
        ListNode result = mergeTwoLists(list1, list2);
        System.out.print("Iterative result: ");
        printLinkedList(result);
        
        // Merge them (recursive)
        list1 = createLinkedList(arr1);
        list2 = createLinkedList(arr2);
        ListNode resultRec = mergeTwoListsRecursive(list1, list2);
        System.out.print("Recursive result: ");
        printLinkedList(resultRec);
        
        // Edge cases
        System.out.println("\nEdge case tests:");
        
        // Both empty
        ListNode empty = mergeTwoLists(null, null);
        System.out.print("Both empty: ");
        printLinkedList(empty);
        
        // One empty
        ListNode oneEmpty = mergeTwoLists(createLinkedList(new int[]{1, 2, 3}), null);
        System.out.print("Second empty: ");
        printLinkedList(oneEmpty);
        
        oneEmpty = mergeTwoLists(null, createLinkedList(new int[]{1, 2, 3}));
        System.out.print("First empty: ");
        printLinkedList(oneEmpty);
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for singly-linked list.
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Merge two sorted linked lists into one sorted list.
 * 
 * @param {ListNode} list1 - Head of first sorted linked list
 * @param {ListNode} list2 - Head of second sorted linked list
 * @returns {ListNode} Head of the merged sorted linked list
 * 
 * Time: O(n + m)
 * Space: O(1)
 */
function mergeTwoLists(list1, list2) {
    // Create dummy node to simplify edge cases
    const dummy = new ListNode(-1);
    let tail = dummy;
    
    // Compare and merge nodes from both lists
    while (list1 !== null && list2 !== null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    
    // Attach remaining nodes from list1 (if any)
    if (list1 !== null) {
        tail.next = list1;
    }
    
    // Attach remaining nodes from list2 (if any)
    if (list2 !== null) {
        tail.next = list2;
    }
    
    return dummy.next;
}

/**
 * Merge two sorted linked lists recursively.
 * 
 * @param {ListNode} list1 - Head of first sorted linked list
 * @param {ListNode} list2 - Head of second sorted linked list
 * @returns {ListNode} Head of the merged sorted linked list
 * 
 * Time: O(n + m)
 * Space: O(n + m) stack space
 */
function mergeTwoListsRecursive(list1, list2) {
    // Base case: if either list is empty, return the other
    if (list1 === null) return list2;
    if (list2 === null) return list1;
    
    // Compare and pick the smaller head
    if (list1.val <= list2.val) {
        list1.next = mergeTwoListsRecursive(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoListsRecursive(list1, list2.next);
        return list2;
    }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Create a linked list from an array.
 * @param {number[]} arr - Input array
 * @returns {ListNode} Head of the linked list
 */
function createLinkedList(arr) {
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
 * Convert a linked list to an array.
 * @param {ListNode} node - Head of the linked list
 * @returns {number[]} Array representation
 */
function linkedListToArray(node) {
    const result = [];
    while (node !== null) {
        result.push(node.val);
        node = node.next;
    }
    return result;
}

// ==================== EXAMPLE USAGE ====================

// Create two sorted linked lists:
// List 1: 1 -> 2 -> 4
// List 2: 1 -> 3 -> 4

const arr1 = [1, 2, 4];
const arr2 = [1, 3, 4];

const list1 = createLinkedList(arr1);
const list2 = createLinkedList(arr2);

// Merge them (iterative)
const result = mergeTwoLists(list1, list2);
console.log("Iterative result:", linkedListToArray(result));

// Merge them (recursive)
const list1Rec = createLinkedList(arr1);
const list2Rec = createLinkedList(arr2);
const resultRec = mergeTwoListsRecursive(list1Rec, list2Rec);
console.log("Recursive result:", linkedListToArray(resultRec));

// Edge cases
console.log("\nEdge case tests:");

// Both empty
console.log("Both empty:", linkedListToArray(mergeTwoLists(null, null)));

// One empty
console.log("Second empty:", linkedListToArray(mergeTwoLists(createLinkedList([1, 2, 3]), null)));
console.log("First empty:", linkedListToArray(mergeTwoLists(null, createLinkedList([1, 2, 3]))));
```
````

---

## Example

**Input:**
```python
# Create two sorted linked lists:
# List 1: 1 -> 2 -> 4
# List 2: 1 -> 3 -> 4

list1 = create_linked_list([1, 2, 4])
list2 = create_linked_list([1, 3, 4])

# Merge them
result = merge_two_lists(list1, list2)
print(linked_list_to_list(result))
```

**Output:**
```
[1, 1, 2, 3, 4, 4]
```

**Step-by-Step Explanation:**

1. **Initial state**: list1 = [1→2→4], list2 = [1→3→4], merged = []
2. **Compare 1 vs 1**: Equal, pick from list1 → merged = [1], list1 advances to 2
3. **Compare 2 vs 1**: 1 is smaller, pick from list2 → merged = [1, 1], list2 advances to 3
4. **Compare 2 vs 3**: 2 is smaller, pick from list1 → merged = [1, 1, 2], list1 advances to 4
5. **Compare 4 vs 3**: 3 is smaller, pick from list2 → merged = [1, 1, 2, 3], list2 advances to 4
6. **Compare 4 vs 4**: Equal, pick from list1 → merged = [1, 1, 2, 3, 4], list1 exhausted
7. **Attach remaining**: list2 has [4], attach it → merged = [1, 1, 2, 3, 4, 4]

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Pass Merge** | O(n + m) | Each node visited exactly once |
| **Compare Operations** | O(n + m) | At most n + m comparisons |
| **Pointer Updates** | O(n + m) | Each pointer moves forward once |

### Detailed Breakdown

- **Worst Case**: O(n + m) - When elements are interleaved (1 from A, 1 from B, 1 from A, 1 from B...)
- **Best Case**: O(min(n, m)) - When all elements of one list are smaller than the other (only one comparison needed, rest just attached)
- **Average Case**: O(n + m) - Linear time regardless of distribution

---

## Space Complexity Analysis

### Iterative Approach

- **O(1)** extra space (excluding the output list)
- Only pointer variables: dummy, tail, list1, list2
- No recursion stack or additional data structures

### Recursive Approach

- **O(n + m)** stack space for the call stack
- Each recursive call adds a frame
- Maximum depth equals total number of nodes
- Not tail-recursive in most languages

### Array-Based Merge (for reference)

- **O(n + m)** for the output array
- In-place merge variants exist but are complex

---

## Common Variations

### 1. Merge K Sorted Lists

Merging k sorted lists using a min-heap (priority queue).

````carousel
```python
import heapq
from typing import List, Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    """
    Merge k sorted linked lists using a min-heap.
    
    Time: O(N log k) where N is total nodes, k is number of lists
    Space: O(k) for the heap
    """
    dummy = ListNode(-1)
    tail = dummy
    
    # Min-heap: (value, list_index, node)
    heap = []
    
    # Initialize heap with first node from each list
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    # Extract min and add next node from same list
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```
````

### 2. Merge Sort for Linked Lists

Using merge as the core operation in merge sort.

````carousel
```python
def merge_sort_linked_list(head: ListNode) -> ListNode:
    """
    Sort a linked list using merge sort.
    
    Time: O(n log n)
    Space: O(log n) for recursion
    """
    if not head or not head.next:
        return head
    
    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None  # Split the list
    
    # Recursively sort both halves
    left = merge_sort_linked_list(head)
    right = merge_sort_linked_list(mid)
    
    # Merge sorted halves
    return merge_two_lists(left, right)
```
````

### 3. In-Place Array Merge

Merging two sorted arrays in-place (when array1 has extra space).

````carousel
```python
def merge_sorted_arrays_inplace(nums1: list, m: int, nums2: list, n: int) -> None:
    """
    Merge two sorted arrays in-place (modifies nums1).
    
    Time: O(m + n)
    Space: O(1)
    
    Args:
        nums1: First sorted array with extra space
        m: Number of elements in nums1's valid portion
        nums2: Second sorted array
        n: Number of elements in nums2
    """
    # Start from the end to avoid overwriting
    p1, p2, p = m - 1, n - 1, m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
```
````

### 4. Union of Two Sorted Arrays

Finding union of two sorted arrays.

````carousel
```python
def union_sorted_arrays(arr1: list, arr2: list) -> list:
    """
    Find union of two sorted arrays (unique elements).
    
    Time: O(n + m)
    Space: O(n + m) for result
    """
    result = []
    i, j = 0, 0
    
    while i < len(arr1) and j < len(arr2):
        # Skip duplicates in arr1
        while i < len(arr1) - 1 and arr1[i] == arr1[i + 1]:
            i += 1
        # Skip duplicates in arr2
        while j < len(arr2) - 1 and arr2[j] == arr2[j + 1]:
            j += 1
            
        if arr1[i] < arr2[j]:
            result.append(arr1[i])
            i += 1
        elif arr1[i] > arr2[j]:
            result.append(arr2[j])
            j += 1
        else:  # Equal
            result.append(arr1[i])
            i += 1
            j += 1
    
    # Add remaining elements
    while i < len(arr1):
        if not result or arr1[i] != result[-1]:
            result.append(arr1[i])
        i += 1
    
    while j < len(arr2):
        if not result or arr2[j] != result[-1]:
            result.append(arr2[j])
        j += 1
    
    return result
```
````

---

## Practice Problems

### Problem 1: Merge Two Sorted Lists

**Problem:** [LeetCode 21 - Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)

**Description:** Merge two sorted linked lists and return it as a sorted list.

**How to Apply the Technique:**
- Use the two-pointer iterative approach with a dummy node
- Each comparison picks the smaller head
- Attach remaining nodes when one list is exhausted

**Solution Key:** Time O(n + m), Space O(1)

---

### Problem 2: Merge K Sorted Lists

**Problem:** [LeetCode 23 - Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

**Description:** Merge k sorted linked lists and return it as one sorted list.

**How to Apply the Technique:**
- Use a min-heap to efficiently find the smallest element among k lists
- Push first element from each list into heap
- Pop smallest, push next from same list
- Repeat until heap is empty

**Solution Key:** Time O(N log k), Space O(k)

---

### Problem 3: Merge Sorted Array

**Problem:** [LeetCode 88 - Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)

**Description:** Merge nums1 and nums2 into a single array sorted in non-decreasing order.

**How to Apply the Technique:**
- Use three pointers, starting from the end of arrays
- Fill nums1 from the back to avoid overwriting
- Compare elements and place larger one at current position

**Solution Key:** Time O(m + n), Space O(1)

---

### Problem 4: Sort List (Merge Sort)

**Problem:** [LeetCode 148 - Sort List](https://leetcode.com/problems/sort-list/)

**Description:** Sort a linked list in O(n log n) time using constant space complexity.

**How to Apply the Technique:**
- Use merge sort: find middle, split, recursively sort, then merge
- The merge step is exactly the "merge two sorted lists" algorithm
- Combine with in-place splitting using slow/fast pointers

**Solution Key:** Time O(n log n), Space O(log n) for recursion

---

### Problem 5: Intersection of Two Linked Lists

**Problem:** [LeetCode 160 - Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists/)

**Description:** Find the intersection node of two singly linked lists.

**How to Apply the Technique:**
- While not directly merging, this problem uses similar pointer manipulation
- Align longer list by advancing difference, then traverse together
- Understanding merge helps with list manipulation concepts

**Solution Key:** Time O(m + n), Space O(1)

---

## Video Tutorial Links

### Fundamentals

- [Merge Two Sorted Lists - LeetCode (NeetCode)](https://www.youtube.com/watch?v=1K-JSeq-5xs) - Clear explanation with animations
- [Merge Two Sorted Lists - Floyd's Cycle Detection](https://www.youtube.com/watch?v=0B-dF1UkBiI) - Iterative approach walkthrough

### Related Topics

- [Merge Sort Explained](https://www.youtube.com/watch?v=4VqmGXwpJqc) - How merge fits into merge sort
- [K-Way Merge using Heap](https://www.youtube.com/watch?v=3BhbVCX6wNQ) - Generalization to k lists
- [Linked List Merge Sort](https://www.youtube.com/watch?v=3BhbVCX6wNQ) - Practical application

### Advanced

- [In-Place Array Merge](https://www.youtube.com/watch?v=h3R0T2J2jXU) - Merging without extra space
- [External Merge Sort](https://www.youtube.com/watch?v=8NscT_xibble) - For large file sorting

---

## Follow-up Questions

### Q1: Can you implement merge iteratively without a dummy node?

**Answer:** Yes, but it requires handling edge cases separately:

```python
def merge_two_lists_no_dummy(list1, list2):
    # Handle empty cases
    if not list1: return list2
    if not list2: return list1
    
    # Find the smaller head to be the result head
    if list1.val <= list2.val:
        head = list1
        list1 = list1.next
    else:
        head = list2
        list2 = list2.next
    
    tail = head
    
    # Continue merging
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    
    tail.next = list1 or list2
    return head
```

The dummy node approach is preferred for its cleaner handling of edge cases.

### Q2: How would you handle merging with duplicate values?

**Answer:** The iterative approach naturally handles duplicates by using `<=` (or `<` for strict inequality). Using `<=` ensures stability—the first list's element comes first when values are equal.

### Q3: What if the lists are sorted in descending order?

**Answer:** Simply reverse both lists first, apply the merge algorithm, then reverse the result. Alternatively, modify the comparison from `<=` to `>=`.

### Q4: How does this differ from merging arrays vs linked lists?

**Answer:**
- **Arrays**: Can merge from the end to achieve O(1) extra space (no need for dummy node)
- **Linked Lists**: Must use forward traversal with dummy node for O(1) space
- Both have the same O(n + m) time complexity

### Q5: How would you merge more than two sorted lists efficiently?

**Answer:** Use a min-heap (priority queue):
1. Push the first element from each list into the heap
2. Pop the smallest, add it to result, push the next from that list
3. Repeat until heap is empty
4. Time: O(N log k) where N = total elements, k = number of lists

---

## Summary

Merge Two Sorted Lists is a fundamental algorithm that forms the building block for many complex operations. Key takeaways:

- **Core principle**: Always pick the smaller of the two current elements
- **Two-pointer technique**: Efficient O(n + m) time with O(1) space
- **Dummy node pattern**: Simplifies edge case handling
- **Versatile application**: Used in merge sort, k-way merge, and many real-world scenarios

When to use:
- ✅ Combining two sorted sequences
- ✅ Implementing merge sort
- ✅ Merging sorted data streams
- ✅ K-way merge with heap optimization

This algorithm is essential for technical interviews and competitive programming. Master both iterative and recursive approaches, as each has specific use cases and trade-offs.

---

## Related Algorithms

- [Merge Sort](./merge-sort.md) - Uses merge as the combine step
- [K-Way Merge](./k-way-merge.md) - Generalization with priority queue
- [Two Pointers](./two-pointers.md) - Related technique for sorted arrays
- [Linked List](./linked-list-basics.md) - Data structure fundamentals
