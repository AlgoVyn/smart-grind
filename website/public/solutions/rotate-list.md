# Rotate List

## Problem Description

Given the head of a linked list, rotate the list to the right by `k` places.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5]`<br>`k = 2` | `[4,5,1,2,3]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `head = [0,1,2]`<br>`k = 4` | `[2,0,1]` |

### Constraints

- The number of nodes in the list is in the range `[0, 500]`.
- `-100 <= Node.val <= 100`
- `0 <= k <= 2 * 10^9`

---

## Solution

```python
def rotateRight(head, k):
    if not head or not head.next:
        return head
    
    # Find length and tail
    n = 1
    tail = head
    while tail.next:
        tail = tail.next
        n += 1
    
    k %= n
    if k == 0:
        return head
    
    # Connect tail to head
    tail.next = head
    
    # Find new tail: (n - k - 1)th node
    steps = n - k - 1
    new_tail = head
    for _ in range(steps):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    return new_head
```

---

## Explanation

This problem rotates a linked list to the right by k places. It first computes the effective rotation (`k mod n`), then reconnects the list to form the rotated version.

### Approach

1. **Handle Edge Cases:** If the list is empty or has one node, return head.

2. **Compute Length and Connect Tail to Head:**
   - Traverse to find the length `n` and the tail.
   - Connect `tail.next = head` to form a cycle.

3. **Adjust k:** Set `k = k % n`. If `k == 0`, return head.

4. **Find New Head and Tail:**
   - The new tail is the `(n - k - 1)`th node from the start.
   - Traverse `steps = n - k - 1` to find `new_tail`.
   - New head is `new_tail.next`.
   - Set `new_tail.next = None` to break the cycle.

5. **Return New Head:** Return `new_head`.

### Time Complexity

- O(n), where n is the number of nodes, as we traverse the list up to twice.

### Space Complexity

- O(1), using only a few pointers.
