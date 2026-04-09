## Linked List Addition of Numbers: Comparison

How do different approaches for linked list addition compare?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Best For | LeetCode |
|----------|------|-------|----------|----------|
| **Iterative with Dummy** | O(max(n,m)) | O(max(n,m)) | Reverse order lists | #2 |
| **Using Stacks** | O(n+m) | O(n+m) | Forward order lists | #445 |
| **Recursive** | O(max(n,m)) | O(max(n,m)) | Avoiding iteration | - |

**Winner:** Iterative with dummy node for reverse order (cleanest, optimal).

---

### Reverse Order vs Forward Order

| Storage | Processing | Implementation |
|---------|------------|----------------|
| **Reverse (LSB first)** | Direct iteration | Simple loop with dummy node |
| **Forward (MSB first)** | Stack or reverse first | Push to stack, pop to process |

```
Reverse Order:          Forward Order:
2→4→3 (342)            3→4→2 (342)
5→6→4 (465)            4→6→5 (465)
↓                       ↓
Direct iteration       Stack: [3,4,2] [4,6,5]
                       Pop: 2+5, 4+6, 3+4
```

---

### Dummy Node vs No Dummy

| Aspect | Without Dummy | With Dummy |
|--------|---------------|------------|
| Edge case handling | Complex (null checks) | Automatic |
| First node creation | Special logic needed | Same as rest |
| Return value | May need conditional | Always `dummy.next` |
| Code clarity | ❌ Verbose | ✅ Clean |

**Recommendation:** Always use dummy node for linked list construction.

---

### Space Optimization Analysis

| Approach | Space | Can Optimize? |
|----------|-------|---------------|
| Result as new list | O(max(n,m)) | ❌ Required for immutability |
| Reuse input nodes | O(1) | ✅ Possible but mutates input |
| Output to shorter list | O(1) | ✅ In-place if allowed |

**Trade-off:** Space vs immutability. Default to new list unless input modification is explicitly allowed.

---

### Decision Flowchart

```
Input order?
├── Reverse (LSB at head)
│   └── Use: Iterative with dummy node
│   └── Time: O(max(n,m)), Space: O(max(n,m))
│
├── Forward (MSB at head)
│   └── Choose:
│       ├── Stack approach → O(n+m) space
│       └── Reverse → Add → Reverse → O(1) extra space
│
└── Mixed (one each way)
    └── Reverse one or use stacks for both
```

---

### Follow-up Variations

| Variation | Approach Change |
|-----------|-----------------|
| **Subtraction** | Handle borrowing instead of carrying |
| **Multiplication** | O(n×m) nested loops with carry |
| **Very large numbers** | Same approach, linked list scales naturally |
| **Multiple numbers** | Extend to k lists with running sum |

<!-- back -->
