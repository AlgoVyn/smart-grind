# Same Tree

## Problem Description

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the corresponding nodes have the same value.

---

## Examples

**Example 1:**

**Input:**
```python
p = [1,2,3], q = [1,2,3]
```

**Output:**
```python
true
```

**Explanation:**
Both trees are identical:
```
    p       q
   1       1
  / \     / \
 2   3   2   3
```

---

**Example 2:**

**Input:**
```python
p = [1,2], q = [1,null,2]
```

**Output:**
```python
false
```

**Explanation:**
The trees are structurally different:
```
    p       q
   1       1
  /         \
 2           2
```

---

**Example 3:**

**Input:**
```python
p = [1,2,1], q = [1,1,2]
```

**Output:**
```python
false
```

**Explanation:**
The trees have the same structure but node values differ at some positions.

---

**Example 4:**

**Input:**
```python
p = [], q = []
```

**Output:**
```python
true
```

**Explanation:**
Two empty trees are considered the same.

---

**Example 5:**

**Input:**
```python
p = [1], q = [2]
```

**Output:**
```python
false
```

**Explanation:**
Both trees have one node, but the values are different.

---

## Constraints

- The number of nodes in both trees is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`.

---

## Solution

### Approach 1: Recursive Depth-First Search (DFS)

The most intuitive approach is to use recursion. For each pair of corresponding nodes:
1. If both nodes are null, they match → return true
2. If one is null and the other is not, they don't match → return false
3. If both nodes have values, check if values match
4. Recursively check left subtrees
5. Recursively check right subtrees

```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        # Both nodes are null - they match
        if not p and not q:
            return True
        # One is null and the other is not - they don't match
        if not p or not q:
            return False
        # Values don't match
        if p.val != q.val:
            return False
        # Recursively check left and right subtrees
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

---

### Approach 2: Iterative Using Stack (or Queue)

We can also solve this iteratively using a stack (DFS) or queue (BFS). We push pairs of corresponding nodes and process them one at a time.

```
from collections import deque

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        queue = deque([(p, q)])
        
        while queue:
            node1, node2 = queue.popleft()
            
            # Both nodes are null - continue
            if not node1 and not node2:
                continue
            # One is null and the other is not - mismatch
            if not node1 or not node2:
                return False
            # Values don't match - mismatch
            if node1.val != node2.val:
                return False
            
            # Add corresponding children pairs to the queue
            queue.append((node1.left, node2.left))
            queue.append((node1.right, node2.right))
        
        return True
```

---

### Approach 3: Iterative BFS Level by Level

Using BFS, we process nodes level by level, comparing corresponding nodes at each level.

```
from collections import deque

class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q:
            return False
            
        queue1, queue2 = deque([p]), deque([q])
        
        while queue1 and queue2:
            node1 = queue1.popleft()
            node2 = queue2.popleft()
            
            if node1.val != node2.val:
                return False
            
            # Add children for next level comparison
            if node1.left and node2.left:
                queue1.append(node1.left)
                queue2.append(node2.left)
            elif node1.left or node2.left:
                return False
                
            if node1.right and node2.right:
                queue1.append(node1.right)
                queue2.append(node2.right)
            elif node1.right or node2.right:
                return False
        
        return len(queue1) == 0 and len(queue2) == 0
```

---

## Explanation

### Recursive Approach (Recommended)
The recursive approach is the most elegant and readable solution. It follows the natural definition of "same tree":
- Two trees are the same if they have the same root value AND their left subtrees are the same AND their right subtrees are the same.
- Base cases handle when nodes are null (both null = match, one null = no match).
- The recursion naturally traverses both trees in sync, comparing nodes at each position.

### Iterative Approach
The iterative approach uses a queue (BFS) or stack (DFS) to process pairs of nodes:
- Start by pushing the root pair onto the queue
- For each pair, check if they match (both null, one null, or different values)
- If they match, push their children pairs onto the queue
- If we process all pairs without mismatch, the trees are the same

### Why Recursion Works Well
- The tree structure is naturally recursive (trees within trees)
- Each node's comparison only depends on its children's comparisons
- The algorithm naturally "unwinds" when it reaches null leaves

---

## Time Complexity

**O(N)** where N is the number of nodes in the tree.

We must visit each node exactly once to compare them, and each comparison is O(1).

---

## Space Complexity

**Recursive Approach:** O(H) for the recursion stack, where H is the height of the tree.
- In the worst case (skewed tree), H = N
- In the best case (balanced tree), H = log N

**Iterative Approach:** O(N) for the queue/stack in the worst case.
- We may need to store up to O(N) node pairs in the queue

---

## Related Problems

1. **[Symmetric Tree](https://leetcode.com/problems/symmetric-tree/)** (LeetCode 101) - Check if a binary tree is symmetric around its center.
2. **[Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/)** (LeetCode 572) - Check if there is a subtree of the other tree.
3. **[Count Univalue Subtrees](https://leetcode.com/problems/count-univalue-subtrees/)** (LeetCode 250) - Count all subtrees that have the same value.
4. **[Flip Equivalent Binary Trees](https://leetcode.com/problems/flip-equivalent-binary-trees/)** (LeetCode 951) - Check if two trees are flip equivalent.
5. **[Merge Two Binary Trees](https://leetcode.com/problems/merge-two-binary-trees/)** (LeetCode 617) - Merge two trees by adding node values.

---

## Video Tutorial Links

- [NeetCode - Same Tree](https://www.youtube.com/watch?v=vBBf9YNsTzw)
- [LeetCode Official Solution](https://leetcode.com/problems/same-tree/solutions/)
- [Take U Forward - Same Tree](https://www.youtube.com/watch?v=BhuvF_2qP6E)

---

## Follow-up Questions

1. **How would you modify the solution to count the number of nodes that differ between two trees?**
   
2. **If the trees are very large, how would you optimize for memory usage?**

3. **How would you check if two trees are the same when the tree nodes might have parent pointers?**

4. **How would you serialize and deserialize trees to check if they're the same efficiently?**

5. **What if you wanted to find the first position where two trees differ?**

