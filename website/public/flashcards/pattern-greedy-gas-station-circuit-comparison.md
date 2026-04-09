# Pattern: Greedy - Gas Station Circuit (Comparison)

---

## Front
Compare **Single Pass vs Two Pass** approaches for Gas Station Circuit.

## Back
| Aspect | Single Pass | Two Pass |
|--------|-------------|----------|
| **Time** | O(n) - one loop | O(n) - two loops (or sum() calls) |
| **Space** | O(1) | O(1) |
| **Clarity** | Moderate - combined logic | Better - separated concerns |
| **Efficiency** | Slightly better (one iteration) | Slightly worse (two iterations) |
| **Use when** | Code golf, interview speed | Teaching, code review, maintainability |

**Single Pass** is recommended for interviews and production.

---

## Front
Compare **Greedy vs Brute Force** for Gas Station Circuit.

## Back
| Aspect | Greedy (O(n)) | Brute Force (O(n²)) |
|--------|---------------|---------------------|
| **Time** | O(n) | O(n²) |
| **Space** | O(1) | O(1) |
| **Approach** | Track cumulative, reset on deficit | Try every start, simulate full circuit |
| **Correctness** | Guaranteed if total feasible | Guaranteed |
| **When to use** | Always | Never (only for understanding) |

**Greedy wins**: Same correctness, exponentially faster.

---

## Front
Compare **Gas Station Circuit** with **Jump Game** pattern.

## Back
| Aspect | Gas Station Circuit | Jump Game |
|--------|---------------------|-----------|
| **Goal** | Find valid starting point | Determine if end is reachable |
| **Movement** | Fixed: i → i+1 (circular) | Variable: i → i + nums[i] |
| **Resource** | Gas balance (can go negative temporarily) | Jump length (always non-negative) |
| **Feasibility check** | Total gas >= total cost | Max reach >= last index |
| **Greedy aspect** | Skip segments on deficit | Extend max reach |

**Similarity**: Both use greedy to avoid rechecking eliminated candidates.

---

## Front
Compare **Gas Station Circuit** with **Kadane's Algorithm**.

## Back
| Aspect | Gas Station Circuit | Kadane's Algorithm |
|--------|---------------------|---------------------|
| **Goal** | Find starting point where cumulative never negative | Find maximum subarray sum |
| **On negative** | Reset start to i+1, reset tank | Reset current sum to 0 (or current element) |
| **Tracking** | Two totals (current_tank + global totals) | Two sums (current_max + global_max) |
| **Result** | Starting index | Maximum sum value |
| **Reset behavior** | Reset tank to 0, skip to next station | Reset current sum, continue from here |

**Key difference**: Gas Station needs to track WHERE to start, Kadane tracks WHAT is the max.

---

## Front
Compare **Gas Station Circuit** vs **Circular Array Sum** problems.

## Back
| Aspect | Gas Station Circuit | Circular Array Max Sum |
|--------|---------------------|------------------------|
| **Structure** | Circular route | Circular array |
| **Constraint** | Cumulative tank never negative | Find max sum subarray |
| **Feasibility** | Must check total gas >= total cost | No feasibility check |
| **Greedy** | Find valid start | Use Kadane's on doubled array or case split |
| **Return type** | Index or -1 | Maximum sum value |

---

## Front
When should you use **Greedy** vs **DP** for circuit/route problems?

## Back
| Use Greedy | Use DP |
|------------|--------|
| Single valid starting point needed | Multiple constraints or choices at each step |
| Cumulative property (sum never negative) | Optimal substructure with overlapping subproblems |
| Local decisions don't affect global optimality | Future choices depend on past state |
| Proof of correctness exists via greedy choice property | No greedy proof possible |

**Gas Station**: Greedy works because deficits are "local" - if you can't reach point B from A, intermediates also fail.

---
