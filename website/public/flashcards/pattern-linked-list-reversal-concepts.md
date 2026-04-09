## Linked List - In-Place Reversal: Core Concepts

What are the fundamental principles of reversing a linked list in-place?

<!-- front -->

---

### Core Concept

Use **three pointers (prev, curr, next) to iteratively reverse links**, changing each node's next pointer to point to its predecessor.

**Key insight**: Process nodes one by one, storing the next node before breaking the link, then reverse the direction.

---

### The Pattern

```
Original: 1 → 2 → 3 → 4 → 5

Step 1: prev=None, curr=1, next=2
  Store next: next = curr.next (2)
  Reverse: curr.next = prev (None)
  Move: prev = curr (1), curr = next (2)
  Result: 1 ← None, 2 → 3 → 4 → 5

Step 2: prev=1, curr=2, next=3
  Store: next = 3
  Reverse: curr.next = 1
  Move: prev = 2, curr = 3
  Result: 2 → 1 → None, 3 → 4 → 5

Step 3: prev=2, curr=3, next=4
  ...continue pattern

Final: 5 → 4 → 3 → 2 → 1 → None ✓

Return prev (new head = 5)
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Reverse List** | Full reversal | Reverse Linked List |
| **Reverse K Group** | Reverse every k nodes | Reverse Nodes in K-Group |
| **Reverse Between** | Reverse sublist | Reverse Linked List II |
| **Palindrome Check** | Check if list is palindrome | Palindrome Linked List |
| **Reorder List** | Reorder: L0→Ln→L1→Ln-1... | Reorder List |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Single pass through list |
| **Space** | O(1) | Only three pointers |
| **Recursive** | O(n) time, O(n) space | Stack for recursion |
| **Iterative** | O(n) time, O(1) space | Preferred |

<!-- back -->
