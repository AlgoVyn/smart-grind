# Flashcards: Heap - Scheduling / Minimum Cost (Greedy with Priority Queue) - Comparison

## Card 1: Greedy + Heap vs Dynamic Programming

**Front:**
When should you use Greedy + Heap vs Dynamic Programming for optimization problems?

**Back:**
| Greedy + Heap | Dynamic Programming |
|--------------|---------------------|
| Greedy choice property holds | No greedy choice property |
| Locally optimal → Globally optimal | Need to explore all choices |
| O(N log K) time | O(N²) or O(2^N) typically |
| Sequential decisions | Overlapping subproblems |
| Example: Hire K Workers | Example: Knapsack (0/1) |

**Test**: Can you prove local optimal choice leads to global optimal? If yes → Greedy. If no → DP.

**Tags:** vs-dp, comparison, algorithm-choice

---

## Card 2: Max Heap vs Min Heap Selection

**Front:**
When should you use a max heap vs min heap in greedy scheduling problems?

**Back:**
| Use Max Heap | Use Min Heap |
|-------------|--------------|
| Track largest to **remove** (keep K smallest) | Track smallest to **remove** (keep K largest) |
| Find worst performer in selected group | Find best among remaining candidates |
| "Which should I kick out?" | "Which should I pick next?" |
| Example: Remove highest quality worker | Example: IPO (next affordable) |

**Rule**: The heap answers "What do I need to efficiently access?"

**Tags:** max-heap, min-heap, comparison, selection

---

## Card 3: Sort-First vs Pure Heap

**Front:**
Compare "Sort then Heap" vs "Pure Heap" approaches for greedy problems.

**Back:**
| Sort + Heap | Pure Heap |
|------------|-----------|
| O(N log N) preprocessing | O(N log K) overall |
| Single pass through sorted data | May need multiple passes |
| Used when order matters (ratios) | Used when order doesn't matter |
| Example: Hire K Workers (ratio sort) | Example: Find K largest elements |
| More memory (store sorted array) | Less memory if streaming |

**Most greedy problems use Sort + Heap** for correctness

**Tags:** sort-heap, pure-heap, comparison, approach

---

## Card 4: This Pattern vs Standard Heap Problems

**Front:**
How does "Greedy with Priority Queue" differ from standard heap problems like "Find K Largest Elements"?

**Back:**
| Standard Heap | Greedy + Heap |
|------------|---------------|
| Static: Process all data at once | Dynamic: Decisions affect future choices |
| One-shot answer at end | Running minimum/maximum tracked |
| Example: K Largest in array | Example: Min cost changes as we add workers |
| No constraint propagation | Heap size enforces constraints |
| No greedy choice needed | Greedy choice at each step |

**Tags:** vs-heap, standard-heap, comparison

---

## Card 5: Ratio-based vs Absolute Value Selection

**Front:**
Compare ratio-based selection (Hire K Workers) vs absolute value selection (IPO).

**Back:**
| Ratio-Based | Absolute Value |
|------------|----------------|
| Decision depends on **relative** measure | Decision depends on **absolute** threshold |
| Sort by ratio, iterate | Filter by threshold, select max |
| Ratio determines "fairness" or "efficiency" | Value directly determines feasibility |
| All items considered in ratio order | Only items meeting threshold considered |
| Max heap for secondary criteria | Max heap for primary selection |
| Example: quality/wage ratio | Example: capital ≤ current |

**Tags:** ratio, absolute, comparison, selection-criteria
