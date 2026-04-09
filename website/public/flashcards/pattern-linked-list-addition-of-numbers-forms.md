## Linked List Addition of Numbers: Forms

What are the different forms and variations of linked list addition problems?

<!-- front -->

---

### Form 1: Basic Addition (Reverse Order)

**Classic LeetCode 2:** Add two numbers stored in reverse order.

```
Input:  (2 -> 4 -> 3) + (5 -> 6 -> 4)
         342              465
Output: 7 -> 0 -> 8
         807
```

**Pattern:** Iterative with dummy node, direct traversal.

---

### Form 2: Forward Order Addition

**LeetCode 445:** Add two numbers stored in forward order.

```
Input:  (7 -> 2 -> 4 -> 3) + (5 -> 6 -> 4)
         7243              465
Output: 7 -> 8 -> 0 -> 7
         7807
```

**Approaches:**
1. **Stack method:** Push to stacks, pop to process, prepend result
2. **Reverse method:** Reverse both, add, reverse result

---

### Form 3: Plus One

**LeetCode 369:** Increment a number represented as linked list by 1.

```
Input:  1 -> 2 -> 3
Output: 1 -> 2 -> 4

Input:  9 -> 9 -> 9
Output: 1 -> 0 -> 0 -> 0  (new head!)
```

**Simplification:** Adding `1` as second list, or special case for all 9s.

---

### Form 4: Multiple List Addition

**Variation:** Add k linked lists together.

```
Approach 1: Pairwise addition
  add(add(l1, l2), l3) ...

Approach 2: Sum all at each position
  total = sum(l[i].val for all lists with nodes at position i)
  carry = total // 10
  digit = total % 10
```

---

### Form 5: Arbitrary Precision Operations

**Related Problems:**

| Problem | LeetCode | Description |
|---------|----------|-------------|
| Add Two Numbers | 2 | Basic reverse order addition |
| Add Two Numbers II | 445 | Forward order addition |
| Plus One Linked List | 369 | Increment by 1 |
| Multiply Strings | 43 | Multiply two large numbers |
| Add Binary | 67 | Add two binary strings |

---

### Form Variations Summary

| Form | Storage | Key Challenge | Solution Pattern |
|------|---------|---------------|------------------|
| Basic | Reverse | None | Direct iteration |
| Forward | Forward | Processing order | Stacks or reverse |
| Plus One | Reverse | All 9s edge case | Special carry handling |
| Multiple | Reverse | k-way merge | Sum at each position |
| Binary | Either | Base-2 arithmetic | `carry = sum // 2` |

<!-- back -->
