# Linked List Cycle

## Problem Description

Given the head of a linked list, determine if the linked list has a cycle in it.

A **cycle** exists in a linked list if some node can be reached again by continuously following the next pointer. Internally, a cycle is caused by a node whose `next` pointer points to a previous node in the list.

The problem asks us to return `true` if there is a cycle in the linked list. Otherwise, return `false`.

---

## Examples

**Example 1:**

**Input:**
```python
head = [3,2,0,-4], pos = 1
```

**Output:**
```python
true
```

**Explanation:** There is a cycle in the linked list where the tail connects to the 1st node (0-indexed). The cycle starts at node with value `2`.

---

**Example 2:**

**Input:**
```python
head = [1], pos = -1
```

**Output:**
```python
false
```

**Explanation:** The linked list has no cycle.

---

**Example 3:**

**Input:**
```python
head = [1,2], pos = 0
```

**Output:**
```python
true
```

**Explanation:** The cycle connects the last node back to the first node (value `1`).

---

## Constraints

- The number of nodes in the list is in the range `[0, 10^4]`.
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` if no cycle exists in the list.

---

## Solution

### Approach 1: Hash Set (Brute Force)

**Intuition:**
The simplest approach is to traverse the linked list while keeping track of all visited nodes. If we encounter a node that we've already seen, then there's a cycle in the list.

**Algorithm:**
1. Create an empty set to store visited nodes.
2. Traverse the linked list starting from the head.
3. For each node, check if it's already in the set:
   - If yes, return `true` (cycle detected).
   - If no, add the node to the set and continue to the next node.
4. If we reach the end of the list (null), return `false` (no cycle).

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        visited = set()
        
        while head:
            if head in visited:
                return True
            visited.add(head)
            head = head.next
        
        return False
```

---

### Approach 2: Floyd's Cycle Detection Algorithm (Optimal)

**Intuition:**
This is the optimal approach using the two-pointer technique (also known as the "tortoise and hare" algorithm). The idea is to use two pointers moving at different speeds:
- **Slow pointer** moves one step at a time.
- **Fast pointer** moves two steps at a time.

If there's a cycle in the linked list, the fast pointer will eventually meet the slow pointer inside the cycle. If there's no cycle, the fast pointer will reach the end of the list (null).

**Algorithm:**
1. Initialize two pointers, `slow` and `fast`, both starting at the head.
2. Traverse the linked list with the two pointers:
   - Move `slow` one step forward (`slow = slow.next`).
   - Move `fast` two steps forward (`fast = fast.next.next`).
   - If `slow == fast`, return `true` (cycle detected).
3. If `fast` reaches `null` or `fast.next` reaches `null`, return `false` (no cycle).

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        if not head or not head.next:
            return False
        
        slow = head
        fast = head
        
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            
            if slow == fast:
                return True
        
        return False
```

---

## Proof: Why Slow and Fast Pointer Meet

### Mathematical Proof

Let us prove that if a cycle exists, the slow and fast pointers will eventually meet.

**Definitions:**
- Let `μ` be the number of nodes before the cycle starts (non-cyclic part length).
- Let `λ` be the length of the cycle.
- Let `n` be the total number of steps taken by the slow pointer when it first enters the cycle.

**When the slow pointer enters the cycle:**
- The slow pointer has traveled `μ + n` steps.
- At this point, the fast pointer has traveled `2(μ + n)` steps.

**Position analysis:**
- The slow pointer is at position `(μ + n) mod λ` within the cycle.
- The fast pointer is at position `2(μ + n) mod λ` within the cycle.

**Relative distance:**
- The distance between them in the cycle is:
  ```
  D = 2(μ + n) - (μ + n) = μ + n
  ```
- In terms of cycle positions, the distance is `D mod λ = (μ + n) mod λ`.

**Key Insight:**
Each time both pointers move, the distance between them **increases by 1** (from the fast pointer's perspective, it's gaining 1 step on the slow pointer within the cycle).

**Proof by contradiction/induction:**

1. **Base Case:** After `k` steps in the cycle, the distance between pointers is `(μ + n) mod λ + k (mod λ)`.

2. **Inductive Step:** After `λ` iterations, the distance becomes:
   ```
   (μ + n) mod λ + λ ≡ (μ + n) mod λ (mod λ)
   ```
   
3. **Eventual Meeting:** Since the distance increases by 1 each iteration and is bounded by `λ`, the pointers must meet within at most `λ` iterations after the slow pointer enters the cycle.

**Simpler Intuitive Proof:**

Consider the cycle as a circular track. The fast pointer gains 1 position on the slow pointer each full iteration. Since the track has finite length `λ`, the fast pointer must eventually lap the slow pointer.

| Step | Slow Position | Fast Position | Distance |
|------|---------------|---------------|----------|
| 0    | x             | x             | 0        |
| 1    | x+1           | x+2           | 1        |
| 2    | x+2           | x+4           | 2        |
| ...  | ...           | ...           | ...      |
| k    | x+k           | x+2k          | k        |

When `k = λ`, the fast pointer has gained exactly `λ` positions, meaning it has completed one full extra lap and is back at the same position as the slow pointer.

**Q.E.D.** The slow and fast pointers will always meet if a cycle exists.

---

## Explanation

### Hash Set Approach:
1. **Space Usage:** O(n) where n is the number of nodes.
2. **Time Complexity:** O(n) - each node is visited exactly once.
3. **Trade-off:** Simple to understand and implement, but uses extra space proportional to the list size.

### Floyd's Cycle Detection (Optimal):
1. **Space Usage:** O(1) - constant extra space.
2. **Time Complexity:** O(n) - each node is visited at most once.
3. **Trade-off:** More optimal in terms of space, requires careful pointer manipulation.

The key insight of Floyd's algorithm is that by moving at different speeds, the two pointers will eventually meet if there's a cycle, without needing to store any visited information.

---

## Time Complexity

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Hash Set | O(n) - visits each node once | O(n) - stores all visited nodes |
| Floyd's Cycle Detection | O(n) - visits each node at most once | O(1) - constant extra space |

Where `n` is the number of nodes in the linked list.

---

## Related Problems

- [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) - Find the node where the cycle begins.
- [Happy Number](https://leetcode.com/problems/happy-number/) - Uses similar cycle detection concept with number transformation.
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/) - Uses Floyd's cycle detection to find the duplicate.
- [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/) - Apply cycle detection in an array context.
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/) - Uses two-pointer technique with different speeds.

---

## Video Tutorial Links

- [NeetCode - Linked List Cycle](https://www.youtube.com/watch?v=IVd1k1uINbA)
- [Fraz - Detect Cycle in Linked List](https://www.youtube.com/watch?v=vcvakYp2C2k)
- [WilliamFiset - Floyd's Cycle Detection Algorithm](https://www.youtube.com/watch?v=MFOAbp4V6C8)
- [BackToBackSWE - Detect Cycle in Linked List](https://www.youtube.com/watch?v=9oK4LVjE7uQ)

---

## Follow-up Questions

1. **How would you find the starting node of the cycle?**
   - Once the slow and fast pointers meet, reset one pointer to the head and move both at the same speed. They will meet at the start of the cycle. This is the solution to "Linked List Cycle II".

2. **Can you detect a cycle using recursion?**
   - Yes, you can use DFS with a visited set, but this uses O(n) space for the call stack. Floyd's algorithm is more optimal.

3. **What if the linked list has multiple cycles?**
   - In a singly linked list, there can be at most one cycle (multiple "tails" would create multiple cycles, but they would merge at some point).

4. **How would you count the number of nodes in the cycle?**
   - After finding a meeting point, keep one pointer fixed and move the other until it returns to the same node, counting the steps.

5. **How would you remove the cycle from the linked list?**
   - First, find the start of the cycle. Then, find the node just before the start in the cycle. Set its `next` pointer to `null` to break the cycle.

6. **Can you detect a cycle in a doubly linked list?**
   - Yes, but you need to check both `next` and `prev` pointers. However, in a properly implemented doubly linked list with circular references, the cycle would be bidirectional.

7. **What are the edge cases to consider?**
   - Empty list (head is null)
   - Single node without cycle
   - Single node with self-loop
   - Cycle at the head
   - Cycle at the tail

8. **How would you modify the solution to work with a very large linked list that might cause stack overflow with recursion?**
   - Use the iterative Floyd's cycle detection algorithm, which avoids recursion entirely.

9. **What if you want to find the length of the cycle?**
   - After detecting the cycle, keep one pointer stationary and move the other until it returns, counting the number of steps taken.

10. **How would you handle this problem in a concurrent environment where nodes might be added/removed?**
    - This becomes a much harder problem. You might need to use atomic operations or locks, or use a different approach entirely like versioned pointers.

