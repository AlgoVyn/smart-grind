# Flashcards: Heap - Scheduling / Minimum Cost (Greedy with Priority Queue) - Framework

## Card 1: Pattern Name & Purpose

**Front:**
What is the "Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)" pattern, and what class of problems does it solve?

**Back:**
A pattern combining greedy algorithms with priority queues to solve optimization problems requiring sequential decision-making. Uses a heap to always select the next best option based on current criteria, making locally optimal choices that lead to globally optimal solutions.

**Tags:** heap, greedy, scheduling, pattern-overview

---

## Card 2: Core Algorithm Steps

**Front:**
What are the 5 key steps in the greedy + heap optimization pattern?

**Back:**
1. **Greedy choice**: At each step, choose what looks best now
2. **Heap maintains candidates**: Efficiently track and update best options
3. **Constraint enforcement**: Use heap size to enforce limits (top K, etc.)
4. **Dynamic updates**: Costs/priorities can change during execution
5. **Optimal substructure**: Greedy + optimal substructure = global optimum

**Tags:** algorithm, steps, greedy-choice

---

## Card 3: Time & Space Complexity

**Front:**
What are the typical time and space complexities for greedy + heap problems?

**Back:**
| Aspect | Complexity |
|--------|------------|
| Time | O(N log K) where K is heap size constraint |
| Space | O(K) for the heap |
| With sorting | O(N log N) including initial sort |

**Tags:** complexity, time, space, analysis

---

## Card 4: When to Use This Pattern

**Front:**
In what scenarios should you apply the greedy + priority queue pattern?

**Back:**
- Scheduling tasks with priorities or deadlines
- Resource allocation problems
- Selecting top/bottom K elements dynamically
- Minimum cost worker selection
- Problems requiring sequential decision-making
- **When greedy choice property holds**: Local optimal leads to global optimal

**Tags:** when-to-use, scenarios, applicability

---

## Card 5: Key Insight

**Front:**
What is the key insight that makes greedy + heap work for optimization problems?

**Back:**
The **greedy choice property** allows making locally optimal choices at each step, and the **heap efficiently maintains** the best candidates. This combination works when problems have:
- **Optimal substructure**: Optimal solution contains optimal subsolutions
- **Greedy choice property**: Local optimal → Global optimal
- **Dynamic candidate set**: Need efficient access to best/worst candidates

**Tags:** key-insight, greedy-choice, optimal-substructure
