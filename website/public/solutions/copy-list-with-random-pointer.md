# Copy List With Random Pointer

## Problem Description

A linked list of length `n` is given such that each node contains an additional `random` pointer, which could point to any node in the list, or `null`.

Construct a deep copy of the list. The deep copy should consist of exactly `n` brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the `next` and `random` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.

For example, if there are two nodes X and Y in the original list, where X.random --> Y, then for the corresponding two nodes x and y in the copied list, x.random --> y.

Return the head of the copied linked list.

**Link to problem:** [Copy List with Random Pointer - LeetCode 138](https://leetcode.com/problems/copy-list-with-random-pointer/)

---

## Pattern: Hash Map for Deep Copy with Complex Pointers

This problem demonstrates the **Hash Map for Deep Copy** pattern. The challenge is handling the random pointers that can point to any node in the list, including forward and backward references.

### Core Concept

The fundamental idea is using a **hash map** to establish a one-to-one mapping between original nodes and their copies:
- **First pass**: Create all new nodes and store the mapping
- **Second pass**: Connect pointers using the mapping to resolve references

---

## Examples

### Example

**Input:**
```
head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**Output:**
```
[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

### Example 2

**Input:**
```
head = [[1,1],[2,1]]
```

**Output:**
```
[[1,1],[2,1]]
```

### Example 3

**Input:**
```
head = [[3,null],[3,0],[3,null]]
```

**Output:**
```
[[3,null],[3,0],[3,null]]
```

---

## Constraints

- `0 <= n <= 1000`
- `-10^4 <= Node.val <= 10^4`
- `Node.random` is null or is pointing to some node in the linked list.

---

## Intuition

The key insight is that we need to create a **complete copy** of the list without modifying the original. The challenge is handling the random pointers that can reference any node.

### Why Two-Pass Approach Works

1. **First pass**: Create all new nodes first. This ensures every node we might need to reference actually exists.
2. **Second pass**: Connect the pointers. Since all nodes exist in our map, we can safely reference them.
3. **Hash map**: Provides O(1) lookup to find the corresponding new node for any original node.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Hash Map (Two-pass)** - O(n) time, O(n) space
2. **Interleaving Nodes** - O(n) time, O(1) space
3. **Recursive with Memoization** - O(n) time, O(n) space

---

## Approach 1: Hash Map (Two-pass) - Optimal

This is the most intuitive and commonly used approach.

### Algorithm Steps

1. **First pass**: Traverse the original list and create a new node for each node, storing the mapping in a hash map.
2. **Second pass**: Traverse again and set the `next` and `random` pointers using the hash map.
3. Return the head of the copied list (from the map).

### Code Implementation

````carousel
```python
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

<!-- slide -->
```cpp
/*
// Definition for a Node.
class Node {
public:
    int val;
    Node* next;
    Node* random;
    
    Node(int _val) {
        val = _val;
        next = NULL;
        random = NULL;
    }
};

class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return NULL;
        
        // Step 1: Create mapping
        unordered_map<Node*, Node*> oldToNew;
        Node* curr = head;
        while (curr) {
            oldToNew[curr] = new Node(curr->val);
            curr = curr->next;
        }
        
        // Step 2: Set pointers
        curr = head;
        while (curr) {
            if (curr->next) {
                oldToNew[curr]->next = oldToNew[curr->next];
            }
            if (curr->random) {
                oldToNew[curr]->random = oldToNew[curr->random];
            }
            curr = curr->next;
        }
        
        return oldToNew[head];
    }
};
```

<!-- slide -->
```java
/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;
    Node(int val) {
        this.val = val;
    }
}
*/

class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        
        // Step 1: Create mapping
        Map<Node, Node> oldToNew = new HashMap<>();
        Node curr = head;
        while (curr != null) {
            oldToNew.put(curr, new Node(curr.val));
            curr = curr.next;
        }
        
        // Step 2: Set pointers
        curr = head;
        while (curr != null) {
            if (curr.next != null) {
                oldToNew.get(curr).next = oldToNew.get(curr.next);
            }
            if (curr.random != null) {
                oldToNew.get(curr).random = oldToNew.get(curr.random);
            }
            curr = curr.next;
        }
        
        return oldToNew.get(head);
    }
}
```

<!-- slide -->
```javascript
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = (val===undefined ? 0 : val);
 *    this.next = (next===undefined ? null : next);
 *    this.random = (random===undefined ? null : random);
 * };
 */

var copyRandomList = function(head) {
    if (!head) return null;
    
    // Step 1: Create mapping
    const oldToNew = new Map();
    let curr = head;
    while (curr) {
        oldToNew.set(curr, new Node(curr.val));
        curr = curr.next;
    }
    
    // Step 2: Set pointers
    curr = head;
    while (curr) {
        if (curr.next) {
            oldToNew.get(curr).next = oldToNew.get(curr.next);
        }
        if (curr.random) {
            oldToNew.get(curr).random = oldToNew.get(curr.random);
        }
        curr = curr.next;
    }
    
    return oldToNew.get(head);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the list |
| **Space** | O(n) - Hash map storing all nodes |

---

## Approach 2: Interleaving Nodes (O(1) Space)

This approach interleaves the new nodes with the original nodes to avoid using extra space for the hash map.

### Algorithm Steps

1. **Create copies**: For each original node, create a new node and insert it right after the original node.
2. **Set random pointers**: For each original node, set the random pointer of the copy to be the next node of the original's random pointer's copy.
3. **Separate lists**: Extract the copied nodes to form the new list.

### Code Implementation

````carousel
```python
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head:
            return None
        
        # Step 1: Create copies and interleave
        curr = head
        while curr:
            new_node = Node(curr.val)
            new_node.next = curr.next
            curr.next = new_node
            curr = new_node.next
        
        # Step 2: Set random pointers
        curr = head
        while curr:
            if curr.random:
                curr.next.random = curr.random.next
            curr = curr.next.next
        
        # Step 3: Separate the lists
        curr = head
        new_head = head.next
        while curr:
            new_node = curr.next
            curr.next = new_node.next
            if new_node.next:
                new_node.next = new_node.next.next
            curr = curr.next
        
        return new_head
```

<!-- slide -->
```cpp
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return NULL;
        
        // Step 1: Create copies and interleave
        Node* curr = head;
        while (curr) {
            Node* newNode = new Node(curr->val);
            newNode->next = curr->next;
            curr->next = newNode;
            curr = newNode->next;
        }
        
        // Step 2: Set random pointers
        curr = head;
        while (curr) {
            if (curr->random) {
                curr->next->random = curr->random->next;
            }
            curr = curr->next->next;
        }
        
        // Step 3: Separate the lists
        curr = head;
        Node* newHead = head->next;
        while (curr) {
            Node* newNode = curr->next;
            curr->next = newNode->next;
            if (newNode->next) {
                newNode->next = newNode->next->next;
            }
            curr = curr->next;
        }
        
        return newHead;
    }
};
```

<!-- slide -->
```java
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        
        // Step 1: Create copies and interleave
        Node curr = head;
        while (curr != null) {
            Node newNode = new Node(curr.val);
            newNode.next = curr.next;
            curr.next = newNode;
            curr = newNode.next;
        }
        
        // Step 2: Set random pointers
        curr = head;
        while (curr != null) {
            if (curr.random != null) {
                curr.next.random = curr.random.next;
            }
            curr = curr.next.next;
        }
        
        // Step 3: Separate the lists
        curr = head;
        Node newHead = head.next;
        while (curr != null) {
            Node newNode = curr.next;
            curr.next = newNode.next;
            if (newNode.next != null) {
                newNode.next = newNode.next.next;
            }
            curr = curr.next;
        }
        
        return newHead;
    }
}
```

<!-- slide -->
```javascript
var copyRandomList = function(head) {
    if (!head) return null;
    
    // Step 1: Create copies and interleave
    let curr = head;
    while (curr) {
        const newNode = new Node(curr.val);
        newNode.next = curr.next;
        curr.next = newNode;
        curr = newNode.next;
    }
    
    // Step 2: Set random pointers
    curr = head;
    while (curr) {
        if (curr.random) {
            curr.next.random = curr.random.next;
        }
        curr = curr.next.next;
    }
    
    // Step 3: Separate the lists
    curr = head;
    const newHead = head.next;
    while (curr) {
        const newNode = curr.next;
        curr.next = newNode.next;
        if (newNode.next) {
            newNode.next = newNode.next.next;
        }
        curr = curr.next;
    }
    
    return newHead;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Three passes through the list |
| **Space** | O(1) - No extra data structures used |

---

## Approach 3: Recursive with Memoization

This approach uses recursion with memoization to avoid redundant work.

### Code Implementation

````carousel
```python
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random

class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        def dfs(node):
            if not node:
                return None
            if node in self.cache:
                return self.cache[node]
            
            new_node = Node(node.val)
            self.cache[node] = new_node
            
            new_node.next = dfs(node.next)
            new_node.random = dfs(node.random)
            
            return new_node
        
        self.cache = {}
        return dfs(head)
```

<!-- slide -->
```cpp
class Solution {
public:
    Node* copyRandomList(Node* head) {
        unordered_map<Node*, Node*> cache;
        
        function<Node*(Node*)> dfs = [&](Node* node) -> Node* {
            if (!node) return NULL;
            if (cache.count(node)) return cache[node];
            
            Node* newNode = new Node(node->val);
            cache[node] = newNode;
            
            newNode->next = dfs(node->next);
            newNode->random = dfs(node->random);
            
            return newNode;
        };
        
        return dfs(head);
    }
};
```

<!-- slide -->
```java
class Solution {
    public Node copyRandomList(Node head) {
        Map<Node, Node> cache = new HashMap<>();
        
        return dfs(head, cache);
    }
    
    private Node dfs(Node node, Map<Node, Node> cache) {
        if (node == null) return null;
        if (cache.containsKey(node)) return cache.get(node);
        
        Node newNode = new Node(node.val);
        cache.put(node, newNode);
        
        newNode.next = dfs(node.next, cache);
        newNode.random = dfs(node.random, cache);
        
        return newNode;
    }
}
```

<!-- slide -->
```javascript
var copyRandomList = function(head) {
    const cache = new Map();
    
    function dfs(node) {
        if (!node) return null;
        if (cache.has(node)) return cache.get(node);
        
        const newNode = new Node(node.val);
        cache.set(node, newNode);
        
        newNode.next = dfs(node.next);
        newNode.random = dfs(node.random);
        
        return newNode;
    }
    
    return dfs(head);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node processed once |
| **Space** | O(n) - Recursion stack + cache |

---

## Comparison of Approaches

| Aspect | Hash Map | Interleaving | Recursive |
|--------|----------|--------------|-----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) | O(n) |
| **Implementation** | Simple | Complex | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Modifies Original** | No | Temporarily | No |

**Best Approach:** Hash map is the most readable. Interleaving is best for O(1) space.

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Clone Graph | [Link](https://leetcode.com/problems/clone-graph/) | Similar deep copy problem |
| Clone Binary Tree | [Link](https://leetcode.com/problems/clone-binary-tree/) | Clone tree with random pointers |
| Clone N-ary Tree | [Link](https://leetcode.com/problems/clone-n-ary-tree/) | Generalize to N-ary tree |

---

## Video Tutorial Links

- [NeetCode - Copy List with Random Pointer](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Official solution
- [Approach Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Detailed walkthrough
- [Interleaving Method](https://www.youtube.com/watch?v=0lGNeO7xW7k) - O(1) space solution

---

## Follow-up Questions

### Q1: Can you solve it with O(1) space?

**Answer:** Yes! The interleaving nodes approach (Approach 2) achieves O(1) extra space by modifying the original list temporarily.

---

### Q2: How would you handle a doubly linked list with random pointers?

**Answer:** The same approach works - just also set the `prev` pointer in addition to `next` and `random`.

---

### Q3: What if the list has cycles in random pointers?

**Answer:** The hash map approach handles this naturally. For the interleaving approach, you need to be careful to detect and handle cycles.

---

## Common Pitfalls

### 1. Forgetting to Handle Null
**Issue:** Not checking for null pointers before accessing them.

**Solution:** Always check if `random` or `next` is null before following.

### 2. Not Creating All Nodes First
**Issue:** Trying to set pointers before all nodes exist.

**Solution:** Use the two-pass approach or interleaving method.

### 3. Modifying Original List
**Issue:** Accidentally modifying the original list.

**Solution:** Be careful with the interleaving approach to restore the original.

---

## Summary

The **Copy List with Random Pointer** problem demonstrates three approaches:
- **Hash Map**: Simple and readable, O(n) space
- **Interleaving**: Space-efficient, O(1) space
- **Recursive**: Clean but uses recursion stack

The key insight is using a mapping to establish relationships between original and copied nodes.
