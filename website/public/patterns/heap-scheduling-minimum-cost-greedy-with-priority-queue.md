# Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)

## Overview

The Heap - Scheduling / Minimum Cost pattern combines greedy algorithms with priority queues to solve optimization problems where decisions must be made at each step to minimize total cost or maximize efficiency. It uses a heap to always select the next best option based on current criteria. This pattern is ideal for scheduling tasks, resource allocation, or any scenario requiring sequential decision-making with cost minimization. The benefits include efficient selection of the optimal choice at each step, leading to globally optimal solutions for problems with the greedy choice property.

## Key Concepts

- **Greedy Choice Property**: At each step, choose the option that looks best at that moment.
- **Priority Queue**: Maintains elements ordered by priority (e.g., cost, time).
- **Cost Calculation**: Update costs or states after each selection.
- **Termination Condition**: Continue until all tasks are scheduled or resources are allocated.

## Template

```python
import heapq

def minimum_cost_scheduling(tasks):
    """
    Schedule tasks to minimize total cost.
    tasks: List of tuples (cost, time) or similar
    """
    # Min-heap for costs
    heap = []
    
    # Initialize with first task or base case
    total_cost = 0
    
    for task in tasks:
        # Example: Add task cost to heap
        heapq.heappush(heap, task[0])  # Assuming task[0] is cost
        
        # If heap size exceeds some limit (e.g., number of workers), remove most expensive
        if len(heap) > k:  # k is some constraint
            total_cost += heapq.heappop(heap)
    
    # Add remaining costs
    while heap:
        total_cost += heapq.heappop(heap)
    
    return total_cost

# More specific example: Minimize cost to hire K workers
def min_cost_to_hire_workers(costs, k):
    heap = []
    for cost in costs:
        heapq.heappush(heap, -cost)  # Max-heap for largest costs
        if len(heap) > k:
            heapq.heappop(heap)
    
    # Sum the smallest k costs (negated back)
    return -sum(heap)
```

## Example Problems

1. **Minimum Cost to Hire K Workers**: Select K workers with minimum total cost from a pool.
2. **Task Scheduler**: Schedule tasks with cooldown periods to minimize total time.
3. **Reorganize String**: Rearrange characters so no two identical are adjacent, minimizing changes.

## Time and Space Complexity

- **Time Complexity**: O(N log K) for heap operations, where N is the number of elements and K is the heap size constraint.
- **Space Complexity**: O(K) for the heap, as it maintains a limited number of elements.

## Common Pitfalls

- **Greedy Validity**: Ensure the problem satisfies the greedy choice property; not all problems do.
- **Heap Type**: Choose min-heap or max-heap based on whether you want smallest or largest priority.
- **Constraint Handling**: Properly enforce constraints like the number of selections or resource limits.
- **Cost Updates**: If costs change dynamically, ensure the heap reflects current priorities.