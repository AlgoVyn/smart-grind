# Copy List With Random Pointer

## Problem Description
A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.
Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.
For example, if there are two nodes X and Y in the original list, where X.random --> Y, then for the corresponding two nodes x and y in the copied list, x.random --> y.
Return the head of the copied linked list.
The linked list is represented in the input/output as a list of n nodes. Each node is represented as a pair of [val, random_index] where:

- val: an integer representing Node.val
- random_index: the index of the node (range from 0 to n-1) that the random pointer points to, or null if it does not point to any node.

Your code will only be given the head of the original linked list.

---

## Examples

**Example 1:**

**Input:**
```python
head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**Output:**
```python
[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**Example 2:**

**Input:**
```python
head = [[1,1],[2,1]]
```

**Output:**
```python
[[1,1],[2,1]]
```

**Example 3:**

**Input:**
```python
head = [[3,null],[3,0],[3,null]]
```

**Output:**
```python
[[3,null],[3,0],[3,null]]
```

---

## Constraints

- `0 <= n <= 1000`
- `-10^4 <= Node.val <= 10^4`
- Node.random is null or is pointing to some node in the linked list.

---

## Solution

```
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head:
            return None
        
        # Step 1: Create a mapping from old nodes to new nodes
        old_to_new = {}
        curr = head
        while curr:
            old_to_new[curr] = Node(curr.val)
            curr = curr.next
        
        # Step 2: Set the next and random pointers for the new nodes
        curr = head
        while curr:
            if curr.next:
                old_to_new[curr].next = old_to_new[curr.next]
            if curr.random:
                old_to_new[curr].random = old_to_new[curr.random]
            curr = curr.next
        
        return old_to_new[head]
```

---

## Explanation
To create a deep copy of a linked list with random pointers, we use a hash map to map each original node to its corresponding new node. This allows us to handle the random pointers correctly without modifying the original list.

1. **First pass**: Traverse the original list and create a new node for each original node, storing the mapping in a dictionary (`old_to_new`). This ensures all new nodes are created without setting any pointers yet.

2. **Second pass**: Traverse the original list again. For each original node, set the `next` and `random` pointers of the corresponding new node using the mapping. Since all new nodes exist in the map, we can safely reference them.

3. **Return the head**: The new head is the mapped node of the original head.

---

## Time Complexity
**O(n)**, where n is the number of nodes, as we traverse the list twice.

---

## Space Complexity
**O(n)**, due to the hash map storing all nodes.
