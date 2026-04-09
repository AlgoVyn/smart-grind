## Linked List Reordering/Partitioning: Core Concepts

What are the fundamental principles of the linked list reordering/partitioning pattern?

<!-- front -->

---

### Core Concept

Use **multiple dummy heads to build separate partitions simultaneously**, then connect them at the end. This enables O(n) time, O(1) space reorganization without allocating new nodes.

**Key insight**: By unlinking nodes and re-linking them into separate chains during a single traversal, we can rearrange the entire list in-place while preserving relative order within each partition.

---

### The Partitioning Pattern

```
Original: 1 → 2 → 3 → 4 → 5 → 6 (partition by odd/even position)

Step 1: Create dummies
  odd_dummy → ○     even_dummy → ○

Step 2: Traverse and partition
  Node 1 (odd):  odd_dummy → 1
  Node 2 (even): even_dummy → 2
  Node 3 (odd):  odd_dummy → 1 → 3
  Node 4 (even): even_dummy → 2 → 4
  ...and so on

Step 3: Result after traversal
  odd chain:  1 → 3 → 5
  even chain: 2 → 4 → 6

Step 4: Connect and return
  1 → 3 → 5 → 2 → 4 → 6
```

---

### Why Dummy Heads?

| Without Dummy | With Dummy |
|---------------|------------|
| Handle first element specially | Uniform handling for all elements |
| Complex edge case logic | Simplified code |
| Risk of losing head reference | `dummy.next` always points to result |
| Extra null checks | Cleaner loop structure |

---

### Key Operations

| Operation | Purpose | Critical? |
|-----------|---------|-----------|
| `tail.next = current` | Append node to partition | Yes |
| `tail = tail.next` | Advance tail pointer | Yes |
| `current = current.next` | Move to next node | Yes |
| `tail.next = None` | Terminate final partition | **Critical** |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Odd-Even** | Group by position parity | LeetCode 328 |
| **Value Partition** | < x before >= x | LeetCode 86 |
| **Three-way** | < x, = x, > x | Extended pattern |
| **Reorder L0→Ln** | Reorder to alternating ends | LeetCode 143 |
| **Group by k** | Reverse every k nodes | LeetCode 25 |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Single pass through list |
| **Space** | O(1) | Only pointer variables |
| **Nodes touched** | n | Each node visited once |
| **Pointer updates** | O(n) | Constant work per node |

<!-- back -->
