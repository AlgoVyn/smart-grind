## Linked List - Merging Two Sorted Lists: Core Concepts

What are the fundamental principles of merging two sorted linked lists?

<!-- front -->

---

### Core Concept

**The key insight is to always pick the smaller element from the front of either list and append it to the result. This maintains sorted order while reusing existing nodes for O(1) space complexity.**

The "aha!" moments:

1. **Two-pointer technique**: One pointer for each list, compare and advance
2. **Dummy node**: Simplifies handling the head of the result list
3. **In-place merging**: Reuse existing nodes by rewiring pointers
4. **Appending remainder**: Once one list is exhausted, append the rest of the other
5. **Sorted invariant**: Both input lists are sorted, so merged result remains sorted

---

### Decision Process Visualization

```
List1: 1 → 3 → 5
List2: 2 → 4 → 6

Step 1: Compare 1 vs 2 → Pick 1
Result: 1
List1: 3 → 5
List2: 2 → 4 → 6

Step 2: Compare 3 vs 2 → Pick 2
Result: 1 → 2
List1: 3 → 5
List2: 4 → 6

Step 3: Compare 3 vs 4 → Pick 3
Result: 1 → 2 → 3
List1: 5
List2: 4 → 6

...and so on until one list empties, then append remainder.
```

---

### When to Use This Pattern

| Scenario | Application |
|----------|-------------|
| Combining sorted data sources | Merge logs, sorted streams |
| Merge sort implementation | Divide-and-conquer sorting |
| Union of ordered sequences | Database operations |
| Streaming integration | Real-time ordered data |
| Subroutine for k lists | Building block for complex merges |

---

### Complexity Analysis

| Aspect | Complexity | Explanation |
|--------|-----------|-------------|
| Time | O(n + m) | Each node visited exactly once |
| Space | O(1) auxiliary | Reuses nodes, only pointers |
| Space (recursive) | O(n + m) | Recursion stack depth |
| Comparisons | O(n + m) | One comparison per node |

---

### Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|---------------|-----|
| Forgetting to move `current` | After appending | `current = current.next` |
| Not handling null inputs | Empty lists | Base cases in recursive, checks in iterative |
| Creating new nodes | Unnecessary allocation | Rewire `current.next = l1/l2` |
| Returning `dummy` | Wrong head | Return `dummy.next` |
| Missing remainder append | Loop exits early | `current.next = l1 or l2` after loop |
| Using `<` instead of `<=` | Unstable sort | Use `<=` to preserve order of equals |

---

### Related Patterns

| Pattern | Connection | Extension |
|---------|-----------|-----------|
| Merge k sorted lists | Generalization | Use heap or pairwise merge |
| Sort list | Application | Merge sort for linked lists |
| Add two numbers | Related LL manipulation | Similar pointer handling |
| Intersection of two lists | Related problem | Find common node |

<!-- back -->
