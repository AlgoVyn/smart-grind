## Backtracking - Parentheses Generation: Comparison

When should you use different approaches?

<!-- front -->

---

### Backtracking vs DP vs Formula

| Aspect | Backtracking | DP | Formula |
|--------|--------------|-----|---------|
| **Goal** | Generate all | Generate all | Count only |
| **Time** | O(4^n/√n) | Same | O(n) or O(1) |
| **Space** | O(n) | O(n × Catalan) | O(1) |
| **Use** | Standard | Alternative | Just need count |

**Winner**: Backtracking for generation, Catalan formula for count

---

### When to Use Each

**Backtracking:**
- Generate all valid combinations
- Interview standard
- Clean, intuitive code

**DP:**
- Alternative approach
- Build from smaller cases
- Educational value

**Catalan Formula:**
- Just need the count
- O(1) with precomputed table
- Mathematical solution

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Generate all | Backtracking | Clean, standard |
| Just count | Catalan formula | Instant result |
| Alternative | DP | Different perspective |

<!-- back -->
