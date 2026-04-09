# Flashcards: Heap - Scheduling / Minimum Cost (Greedy with Priority Queue) - Concepts

## Card 1: Greedy Choice Property

**Front:**
What is the "greedy choice property" and why is it essential for this pattern?

**Back:**
The greedy choice property states that a **globally optimal solution can be reached by making locally optimal (greedy) choices** at each step. It's essential because:
- Justifies making immediate best choices without backtracking
- Enables efficient O(N log K) solutions vs exponential brute force
- Must be proven for each problem; not all problems have this property

**Tags:** greedy-choice, property, theory

---

## Card 2: Why Use a Max Heap for "Minimum Cost"

**Front:**
Why does the Minimum Cost to Hire K Workers problem use a **max heap** (not min heap) for qualities?

**Back:**
The max heap tracks the **largest qualities** to potentially remove when exceeding K workers. We want to:
- Keep K workers with smallest qualities (for minimum cost)
- When adding a new worker, if heap > K, remove the **largest quality**
- Max heap efficiently provides the largest element for removal
- In Python, negate values: `heapq.heappush(max_heap, -q)`

**Tags:** max-heap, worker-problem, heap-choice

---

## Card 3: Ratio Sorting Insight

**Front:**
Why sort workers by ratio (wage/quality) in the Minimum Cost to Hire K Workers problem?

**Back:**
Sorting by ratio ascending ensures **fairness constraint** is satisfied:
- Workers are paid proportional to their quality based on the group's ratio
- If we pick ratio `r` as our pay scale, worker with wage/quality ≤ r is fairly compensated
- As we iterate, each ratio becomes a candidate pay scale for a K-worker group
- Lower ratios considered first = more efficient pay scales

**Tags:** ratio-sorting, worker-problem, insight

---

## Card 4: Optimal Substructure

**Front:**
What is "optimal substructure" in the context of greedy heap problems?

**Back:**
**Optimal substructure** means an optimal solution to the problem contains optimal solutions to subproblems:
- After making a greedy choice, remaining subproblem has optimal solution
- Example: After selecting a worker, finding optimal K-1 workers from remaining
- Combined with greedy choice property → guarantees global optimum
- Without it, greedy approach might fail (e.g., some DP problems)

**Tags:** optimal-substructure, theory, proof

---

## Card 5: Two-Heap Technique

**Front:**
What is the "Two-Heap" technique and when is it used?

**Back:**
The Two-Heap technique uses:
- **Min heap** for candidates not yet affordable/selectable
- **Max heap** for currently available/best options

Used when there's a **dynamic threshold** (e.g., capital constraint):
1. Move items from "not available" min-heap to "available" max-heap when threshold met
2. Select best from available max-heap
3. Update threshold, repeat

Example: IPO problem (LeetCode 502)

**Tags:** two-heap, technique, dynamic-threshold
