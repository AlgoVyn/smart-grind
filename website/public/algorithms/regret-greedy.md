# Regret Greedy

## Category
Greedy Algorithms

## Description

Regret Greedy is a variant of greedy algorithms where decisions are made with the ability to reconsider or adjust based on future information. Unlike pure greedy approaches that make locally optimal choices without looking back, regret greedy evaluates the "regret" or opportunity cost of decisions and may swap or reassign to minimize total regret.

This pattern is particularly useful for assignment and scheduling problems where initial greedy assignments might lead to suboptimal global solutions. By calculating the cost difference (regret) between alternatives and strategically choosing which assignments to reconsider, we can achieve better overall results while maintaining the simplicity and efficiency of greedy approaches.

---

## Concepts

The Regret Greedy pattern relies on fundamental concepts from optimization and decision theory.

### 1. Regret and Opportunity Cost

| Term | Definition | Application |
|------|------------|-------------|
| **Regret** | Cost difference between chosen and best alternative | Quantifies decision quality |
| **Opportunity Cost** | Value of the best foregone alternative | Measures what we give up |
| **Marginal Regret** | Additional regret from a specific choice | Guides which choices to reconsider |

### 2. Exchange Arguments

The theoretical foundation proving greedy approaches work:

| Concept | Description |
|---------|-------------|
| **Exchange Property** | Can always swap to improve without hurting |
| **Optimal Substructure** | Optimal solution contains optimal subsolutions |
| **Greedy Choice Property** | Local optimal leads to global optimal |

### 3. Matroid Theory Connection

| Matroid Property | Implication for Greedy |
|-----------------|------------------------|
| **Hereditary** | Subsets of valid solutions are valid |
| **Exchange** | Can always exchange to maintain optimality |
| **Result** | Greedy produces optimal solution |

### 4. Regret Calculation

```
Regret(A over B) = Cost(A) - Cost(B)
Positive regret → A is worse
Negative regret → A is better
```

---

## Frameworks

Structured approaches for regret greedy problems.

### Framework 1: Two-City Scheduling (Classic Regret Greedy)

```
┌─────────────────────────────────────────────────────────────┐
│  TWO-CITY SCHEDULING                                         │
├─────────────────────────────────────────────────────────────┤
│  Problem: Assign n people to 2 cities, n/2 to each          │
│  costs[i] = [costA, costB] for person i                     │
│  Goal: Minimize total assignment cost                        │
│                                                              │
│  1. For each person, calculate: regret = costA - costB   │
│     (negative regret means A is cheaper)                   │
│  2. Sort all people by regret                               │
│  3. First n/2 people (most negative regret) → City A       │
│  4. Remaining n/2 people → City B                           │
│  5. Sum respective costs                                    │
│                                                              │
│  Key insight: Sorting by regret minimizes opportunity cost  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Assignment problems with fixed quotas per option.

### Framework 2: General Regret Calculation

```
┌─────────────────────────────────────────────────────────────┐
│  GENERAL REGRET GREEDY FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  1. Identify all possible decisions/assignments             │
│  2. For each decision, calculate regret for each option    │
│     regret[i][j] = cost of choosing j for i - best cost    │
│  3. Sort decisions by regret for primary option            │
│  4. Greedily assign in regret order until quotas filled    │
│  5. Return total cost                                        │
│                                                              │
│  Regret guides which items are "least costly" to assign    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Multi-assignment problems with capacity constraints.

### Framework 3: Swap-Based Optimization

```
┌─────────────────────────────────────────────────────────────┐
│  SWAPPING REGRET GREEDY                                      │
├─────────────────────────────────────────────────────────────┤
│  1. Make initial greedy assignment                           │
│  2. Calculate regret for each assigned element               │
│  3. Identify high-regret assignments                         │
│  4. Attempt swaps to reduce total regret:                   │
│     a. For high-regret element A assigned to X             │
│     b. Find element B assigned to Y where swap helps        │
│     c. If cost(A,Y) + cost(B,X) < cost(A,X) + cost(B,Y):  │
│        - Perform swap                                        │
│  5. Repeat until no improving swaps exist                    │
│                                                              │
│  Local search improvement on greedy solution                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When pure greedy needs local optimization refinement.

---

## Forms

Different manifestations of regret-based approaches.

### Form 1: Difference-Based Sorting

Classic two-city scheduling approach.

| Aspect | Details |
|--------|---------|
| **Key operation** | Sort by cost difference |
| **Intuition** | Those with big B savings go to A, vice versa |
| **Complexity** | O(n log n) |
| **Optimality** | Optimal for two-option problems |

### Form 2: Marginal Cost Analysis

Evaluate incremental changes.

| Aspect | Details |
|--------|---------|
| **Key operation** | Calculate marginal regret |
| **Intuition** | Assign based on smallest marginal regret |
| **Application** | Resource allocation, capacity planning |
| **Complexity** | Often O(n log n) with heaps |

### Form 3: Regret Matching

Game theory approach for repeated decisions.

| Aspect | Details |
|--------|---------|
| **Key operation** | Probability proportional to regret |
| **Intuition** | Higher regret → higher switch probability |
| **Application** | Game playing, repeated auctions |
| **Convergence** | Converges to Nash equilibrium |

### Form 4: Opportunistic Swapping

Post-hoc optimization.

| Aspect | Details |
|--------|---------|
| **Key operation** | Local search on greedy solution |
| **Intuition** | Fix suboptimal local decisions |
| **Application** | Vehicle routing, scheduling |
| **Trade-off** | Better solution vs more computation |

---

## Tactics

Specific techniques for regret greedy problems.

### Tactic 1: Two-City Scheduling

Classic regret greedy problem:

```python
def two_city_scheduling(costs):
    """
    Send exactly n/2 people to each city A and B.
    costs[i] = [costA, costB]
    
    Regret approach: sort by opportunity cost.
    """
    n = len(costs)
    # Sort by difference (costA - costB)
    # Negative means cheaper to send to A
    sorted_costs = sorted(costs, key=lambda x: x[0] - x[1])
    
    total = 0
    # First n/2 go to A (cheaper or less regret)
    for i in range(n // 2):
        total += sorted_costs[i][0]
    # Rest go to B
    for i in range(n // 2, n):
        total += sorted_costs[i][1]
    
    return total
```

**Why it works**: Minimizes opportunity cost by sending those with highest B-savings to A.

### Tactic 2: Explicit Regret Calculation

More explicit regret formulation:

```python
def two_city_with_explicit_regret(costs):
    """
    Calculate regret for each decision explicitly.
    Regret = cost difference if we chose wrong city.
    """
    n = len(costs)
    
    # For each person, calculate regret if sent to A vs B
    # regret[i] = costA - costB
    # If regret < 0: prefer A (sending to B causes regret)
    # If regret > 0: prefer B (sending to A causes regret)
    
    people = [(costs[i][0] - costs[i][1], costs[i][0], costs[i][1]) 
              for i in range(n)]
    
    # Sort by regret (those with high B regret should go to A)
    people.sort()
    
    total = 0
    for i in range(n // 2):
        total += people[i][1]  # To A
    for i in range(n // 2, n):
        total += people[i][2]  # To B
    
    return total
```

**Key insight**: Regret sorting implicitly minimizes total regret.

### Tactic 3: General Assignment with Regret

Extended to multiple destinations:

```python
def assignment_with_regret(costs, capacities):
    """
    Assign items to destinations with capacities.
    costs[i][j] = cost to assign item i to destination j
    """
    n = len(costs)
    m = len(capacities)
    
    # Calculate regret for each item-destination pair
    # regret[i][j] = costs[i][j] - min(costs[i])
    
    # Sort items by regret for primary destination
    # Greedily assign, respecting capacities
    
    assignments = [-1] * n
    remaining_cap = capacities[:]
    
    # Create list of (item, best_dest, regret) sorted by regret
    items_with_regret = []
    for i in range(n):
        best = min(costs[i])
        for j in range(m):
            regret = costs[i][j] - best
            items_with_regret.append((regret, i, j, costs[i][j]))
    
    items_with_regret.sort()  # Sort by regret
    
    for regret, item, dest, cost in items_with_regret:
        if assignments[item] == -1 and remaining_cap[dest] > 0:
            assignments[item] = dest
            remaining_cap[dest] -= 1
    
    return assignments
```

**Application**: Multi-facility location, load balancing.

### Tactic 4: Swap Optimization

Improve solution through local search:

```python
def swap_optimize(assignments, costs):
    """
    Optimize assignment through pairwise swaps.
    """
    n = len(assignments)
    improved = True
    
    while improved:
        improved = False
        for i in range(n):
            for j in range(i + 1, n):
                # Check if swapping assignments helps
                old_cost = costs[i][assignments[i]] + costs[j][assignments[j]]
                new_cost = costs[i][assignments[j]] + costs[j][assignments[i]]
                
                if new_cost < old_cost:
                    # Swap
                    assignments[i], assignments[j] = assignments[j], assignments[i]
                    improved = True
    
    return assignments
```

**Benefit**: Escapes local optima from pure greedy.

### Tactic 5: Regret-Aware Scheduling

Time-based regret considerations:

```python
def schedule_with_regret(jobs, resources):
    """
    Schedule jobs to resources minimizing total regret.
    """
    # Regret = opportunity cost of suboptimal assignment
    # Consider time windows, resource capabilities
    
    # Sort by regret (most time-sensitive first)
    jobs_sorted = sorted(jobs, key=lambda j: j.latest_start - j.duration)
    
    schedule = []
    for job in jobs_sorted:
        # Assign to resource with minimum regret
        best_resource = None
        min_regret = float('inf')
        
        for r in resources:
            regret = calculate_regret(job, r)  # Custom function
            if regret < min_regret:
                min_regret = regret
                best_resource = r
        
        schedule.append((job, best_resource))
    
    return schedule
```

---

## Python Templates

### Template 1: Two-City Scheduling

```python
from typing import List


def two_city_sched_cost(costs: List[List[int]]) -> int:
    """
    Two City Scheduling - Classic Regret Greedy problem.
    
    Send exactly n/2 people to city A and n/2 to city B.
    costs[i] = [costA, costB]
    
    Strategy: Sort by cost difference (regret) and assign.
    
    Time: O(n log n)
    Space: O(n) for sorting
    """
    n = len(costs)
    
    # Sort by cost difference (costA - costB)
    # Those with negative difference prefer A
    # Those with positive difference prefer B
    costs.sort(key=lambda x: x[0] - x[1])
    
    total = 0
    # First n/2 go to A (they have lower costA or save more by going to B)
    for i in range(n // 2):
        total += costs[i][0]
    # Rest go to B
    for i in range(n // 2, n):
        total += costs[i][1]
    
    return total
```

### Template 2: General Regret Assignment

```python
def regret_assignment(costs: List[List[int]], quotas: List[int]) -> List[int]:
    """
    Assign items to options with quotas using regret sorting.
    
    costs[i][j] = cost to assign item i to option j
    quotas[j] = maximum items for option j
    
    Returns: assignment[i] = option assigned to item i
    """
    n = len(costs)
    m = len(quotas)
    
    # Calculate regret for each item-option pair
    # Regret = cost - min_cost_for_item
    items_with_regret = []
    
    for i in range(n):
        min_cost = min(costs[i])
        for j in range(m):
            regret = costs[i][j] - min_cost
            items_with_regret.append((regret, i, j, costs[i][j]))
    
    # Sort by regret (ascending)
    items_with_regret.sort()
    
    # Greedily assign
    assignment = [-1] * n
    remaining = quotas[:]
    
    for regret, item, option, cost in items_with_regret:
        if assignment[item] == -1 and remaining[option] > 0:
            assignment[item] = option
            remaining[option] -= 1
    
    return assignment
```

### Template 3: Calculate Total Regret

```python
def calculate_total_regret(costs: List[List[int]], assignment: List[int]) -> int:
    """
    Calculate total regret of an assignment.
    
    Regret = sum of (actual_cost - best_possible_cost) for each item
    """
    total_regret = 0
    
    for i, assigned_option in enumerate(assignment):
        if assigned_option == -1:
            continue  # Unassigned
        actual_cost = costs[i][assigned_option]
        best_cost = min(costs[i])
        total_regret += actual_cost - best_cost
    
    return total_regret
```

### Template 4: Swap Optimization

```python
def optimize_by_swapping(costs: List[List[int]], 
                        assignment: List[int],
                        max_iterations: int = 1000) -> List[int]:
    """
    Optimize assignment through pairwise swaps.
    
    Improves greedy solution through local search.
    """
    n = len(assignment)
    improved = True
    iterations = 0
    
    while improved and iterations < max_iterations:
        improved = False
        iterations += 1
        
        for i in range(n):
            if assignment[i] == -1:
                continue
                
            for j in range(i + 1, n):
                if assignment[j] == -1:
                    continue
                
                # Calculate cost before and after swap
                old_cost = (costs[i][assignment[i]] + 
                         costs[j][assignment[j]])
                new_cost = (costs[i][assignment[j]] + 
                           costs[j][assignment[i]])
                
                if new_cost < old_cost:
                    # Perform swap
                    assignment[i], assignment[j] = assignment[j], assignment[i]
                    improved = True
    
    return assignment
```

### Template 5: Regret-Based Scheduling

```python
def schedule_jobs_with_regret(jobs: List[dict], 
                             resources: List[dict]) -> List[tuple]:
    """
    Schedule jobs to resources based on regret.
    
    Each job has: duration, deadline, resource_requirements
    Each resource has: capacity, capabilities
    """
    def calculate_job_regret(job, resource):
        """Calculate regret of assigning job to resource."""
        # Custom regret calculation
        if resource['capacity'] < job['resource_req']:
            return float('inf')  # Cannot assign
        
        # Time regret: how tight is the schedule
        slack = job['deadline'] - job['duration']
        return max(0, -slack)  # Penalty for tight deadlines
    
    # Sort jobs by deadline (earliest deadline first - EDF)
    jobs_sorted = sorted(enumerate(jobs), 
                        key=lambda x: x[1]['deadline'])
    
    schedule = []
    resource_usage = [0] * len(resources)
    
    for job_idx, job in jobs_sorted:
        # Find resource with minimum regret
        best_resource = None
        min_regret = float('inf')
        
        for r_idx, resource in enumerate(resources):
            regret = calculate_job_regret(job, resource)
            if regret < min_regret:
                min_regret = regret
                best_resource = r_idx
        
        if best_resource is not None:
            schedule.append((job_idx, best_resource))
            resource_usage[best_resource] += job['resource_req']
    
    return schedule
```

---

## When to Use

Use Regret Greedy when you need to solve problems involving:

- **Assignment with quotas**: Fixed number of items per category
- **Scheduling decisions**: Where initial assignments may need revision
- **Resource allocation**: Minimizing opportunity costs
- **Two-sided decisions**: Binary choices with trade-offs
- **Opportunity cost minimization**: Where regret quantifies decision quality

### Comparison with Other Greedy Approaches

| Approach | Strategy | Best For | Optimality |
|----------|----------|----------|------------|
| **Pure Greedy** | Local optimum only | Simple problems | Often suboptimal |
| **Regret Greedy** | Regret minimization | Assignment problems | Often optimal |
| **Local Search** | Iterative improvement | Post-greedy refinement | Local optimum |
| **Dynamic Programming** | Global optimization | Small state space | Optimal |

### When to Choose Regret Greedy

- **Choose Regret Greedy** when:
  - Problem has fixed quotas per option
  - Can define clear regret/opportunity cost metric
  - Need efficient O(n log n) solution
  - Exchange argument applies

- **Consider Alternatives** when:
  - No clear regret metric exists
  - Problem requires global optimization (use DP)
  - Solution quality is critical (use ILP/exact methods)

---

## Algorithm Explanation

### Core Concept

Regret Greedy makes decisions by considering the opportunity cost (regret) of each choice. Instead of purely picking the locally cheapest option, it considers what we give up by that choice and tries to minimize total regret across all decisions.

### Mathematical Foundation

For two-city scheduling, the optimal strategy is to sort by (costA - costB):
- If costA - costB < 0: cheaper to send to A
- If costA - costB > 0: cheaper to send to B
- Sorting ensures those with highest B-savings (or lowest A-cost) go to A

This minimizes: Σ min(costA_i, costB_i) + adjustment for quotas

### Why Sorting by Regret Works

**Exchange Argument**: Suppose we have an optimal solution where person i is in B and person j is in A, but:
- (costA_i - costB_i) < (costA_j - costB_j)

This means i prefers A more than j does. Swapping them:
- Old cost: costB_i + costA_j
- New cost: costA_i + costB_j
- Difference: (costA_i - costB_i) - (costA_j - costB_j) < 0

So swapping reduces cost, contradicting optimality. Therefore, sorted order is optimal.

### Visual Walkthrough

**Two-City Example**:
```
Costs: [[10, 20], [30, 200], [400, 50], [30, 20]]
          A    B    A    B    A    B    A   B

Step 1: Calculate differences (costA - costB)
Person 0: 10 - 20 = -10 (prefers A)
Person 1: 30 - 200 = -170 (strongly prefers A)
Person 2: 400 - 50 = 350 (prefers B)
Person 3: 30 - 20 = 10 (prefers B)

Step 2: Sort by difference
[(-170, P1), (-10, P0), (10, P3), (350, P2)]

Step 3: First n/2=2 to A: P1, P0
        Last 2 to B: P3, P2

Total cost: 30 + 10 + 20 + 50 = 110 ✓

Verify: This is optimal!
```

---

## Practice Problems

### Problem 1: Two City Scheduling

**Problem:** [LeetCode 1029 - Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/)

**Description:** A company is planning to interview `2n` people. Given the costs of flying the i-th person to city A and city B, return the minimum cost to fly every person to a city such that exactly `n` people arrive in each city.

**How to Apply Regret Greedy:**
- Calculate cost difference for each person
- Sort by difference
- First n go to A, rest to B
- O(n log n) optimal solution

---

### Problem 2: Work Assignments

**Problem:** [Maximum Profit in Job Assignment](https://leetcode.com/problems/maximum-profit-in-job-assignment/) (similar problems)

**Description:** Assign workers to jobs to maximize total profit, with constraints on assignments.

**How to Apply:**
- Calculate regret for each worker-job pair
- Sort assignments by regret
- Greedily assign respecting constraints

---

## Video Tutorial Links

### Fundamentals

- [Greedy Algorithms and Exchange Arguments](https://www.youtube.com/watch?v=byHuGrTqvHg) - Theory foundation
- [Two City Scheduling Solution](https://www.youtube.com/watch?v=3uP1Wkuvog4) - LeetCode walkthrough
- [Regret Minimization in Games](https://www.youtube.com/watch?v=AJRGUr5L4Xg) - Advanced theory

### Problem Solutions

- [LeetCode 1029 - Two City Scheduling](https://www.youtube.com/watch?v=vtA2-4q8wh4) - Complete solution
- [Greedy Algorithm Patterns](https://www.youtube.com/watch?v=bC7o8P_Ste4) - Common patterns

---

## Follow-up Questions

### Q1: Why does sorting by cost difference work for Two City Scheduling?

**Answer**: The exchange argument proves it: if any optimal solution doesn't follow this order, we can swap two people and reduce cost. The person with lower (costA - costB) should always be in A if the other is in B, because they save more by being in A relative to B.

### Q2: Can regret greedy solve all assignment problems optimally?

**Answer**: No. Regret greedy works when the problem has matroid structure (hereditary property with exchange). For general assignment problems without this structure, regret greedy provides a good heuristic but not necessarily optimal solution.

### Q3: What's the difference between regret and opportunity cost?

**Answer**: In this context, they're essentially the same:
- **Regret**: How much worse our choice is compared to the best alternative
- **Opportunity cost**: Value of the best alternative we didn't choose

Both measure what we "give up" by our decision.

### Q4: When should I use swap optimization after greedy?

**Answer**: Use local search/swaps when:
- Pure greedy doesn't guarantee optimality
- You have time budget for improvement
- Problem size permits O(n²) or O(n³) post-processing
- The solution space has local structure

### Q5: How does this relate to the matroid greedy algorithm?

**Answer**: Regret greedy is a specific application of matroid greedy. When the feasible solutions form a matroid (independent set system with exchange property), greedy by any weight function (including regret) yields optimal solutions. Two-city scheduling forms a partition matroid.

---

## Summary

Regret Greedy is a powerful pattern for assignment and scheduling problems where opportunity costs guide optimal decision-making. By considering what we give up with each choice, we can often find optimal or near-optimal solutions efficiently.

**Key Takeaways:**

1. **Regret = Opportunity Cost**: Quantifies decision quality
2. **Sorting by Regret**: Often yields optimal assignment
3. **Exchange Argument**: Mathematical proof of optimality
4. **Matroid Structure**: Theoretical foundation
5. **Swap Optimization**: Can improve suboptimal greedy solutions

**When to Use:**
- Assignment problems with quotas
- Binary or multi-option decisions
- Where opportunity costs are well-defined
- Exchange arguments apply

This pattern frequently appears in interview problems (especially Two City Scheduling) and demonstrates the power of combining greedy approaches with careful cost analysis.
