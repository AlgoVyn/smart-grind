## DP - Word Break: Comparison

When should you use different approaches for word break?

<!-- front -->

---

### DP vs DFS vs Trie

| Aspect | DP | DFS + Memo | Trie |
|--------|-----|------------|------|
| **Time** | O(n²×m) | Same | O(n²) worst |
| **Space** | O(n) | O(n) stack | O(total chars) |
| **All solutions** | Hard | Natural | Hard |
| **Prefix heavy** | OK | OK | Best |

**Winner**: DP for existence, DFS for all solutions, Trie for prefixes

---

### When to Use Each

**Bottom-up DP:**
- Just need True/False
- Standard interview solution
- Iterative, no stack risk

**DFS + Memo:**
- Need all valid breaks
- More intuitive
- Recursive by nature

**Trie:**
- Many words share prefixes
- Repeated queries on same dict
- Optimize prefix matching

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Just check possible | DP | Clean, fast |
| List all sentences | DFS + Memo | Natural recursion |
| Large dictionary | Trie | Prefix optimization |
| Many queries | Trie + DP | Preprocess dict |

<!-- back -->
