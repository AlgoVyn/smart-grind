## Greedy - Sorting Based: Core Concepts

What is the sorting-based greedy pattern and what are the key solution strategies?

<!-- front -->

---

### Fundamental Definition

**Pattern:** Sort input data to reveal structure that makes greedy choices obvious at each step, leading to globally optimal solutions.

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) - dominated by sorting |
| Space Complexity | O(1) or O(n) depending on sort |
| Input | Arrays requiring strategic ordering |
| Output | Optimal pairing, assignment, or arrangement |

---

### Key Insight: Sorting Reveals Structure

```
Before sorting: [3, 1, 4, 1, 5] - structure is hidden
After sorting:  [1, 1, 3, 4, 5] - patterns emerge

Greedy choice becomes obvious:
- Pair smallest with smallest? → [1,1], [3,4], [5]
- Pair extremes? → [1,5], [1,4], [3]
- Sequential assignment? → 1→1, 1→3, etc.
```

**Critical observation:** Once sorted, the locally optimal choice at each step becomes globally optimal due to the revealed ordering.

---

### The "Aha!" Moments

1. **Sorting reveals structure**: Proper ordering makes optimal choices obvious without exhaustive search

2. **Two-pointer technique**: After sorting, use two pointers from ends or start to efficiently find pairs

3. **Greedy after sort**: Once sorted, greedy choices are locally optimal because ordering ensures no better alternative was skipped

4. **Pairing strategy**: Match smallest with smallest (cookies) OR lightest with heaviest (boats) depending on problem

5. **No backtracking needed**: Sorted order ensures optimal substructure - each greedy choice leaves a smaller subproblem

---

### When to Apply

- **Assignment problems**: Matching resources to requirements (cookies, workers)
- **Pairing constraints**: Two elements must satisfy a condition together (boats, two sum)
- **Order-dependent decisions**: Strategic ordering reveals the greedy choice property
- **Minimization/Maximization**: Optimizing results through strategic element ordering
- **Two-pointer eligible**: After sorting, two pointers can efficiently find solution

---

### Proof of Optimality: Exchange Argument

```
Theorem: Sorting-based greedy yields optimal solution.

Proof sketch for Boats to Save People:
1. Let greedy pair (lightest, heaviest) when possible.
2. Consider any optimal solution OPT.
3. If OPT also pairs (lightest, heaviest), done for this pair.
4. If OPT doesn't pair them:
   - Case A: Lightest paired with someone else
   - Case B: Heaviest alone (or with different partner)
5. Exchange argument: Swapping partners in OPT doesn't 
   increase boat count - greedy choice is at least as good.
6. By induction on remaining people, greedy is optimal.
```

<!-- back -->
