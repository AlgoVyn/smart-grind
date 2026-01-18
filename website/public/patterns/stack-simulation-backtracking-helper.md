# Stack - Simulation / Backtracking Helper

## Overview

The Stack Simulation/Backtracking Helper pattern uses a stack to simulate recursive processes or backtracking algorithms iteratively. This is particularly useful for tree traversals, maze solving, undo operations, or any scenario where you need to explore paths and potentially backtrack. It converts recursive algorithms to iterative ones, avoiding recursion depth limits and stack overflow issues.

This pattern should be used when:
- Converting recursive algorithms to iterative for better performance
- Implementing undo/redo functionality
- Simulating depth-first search or backtracking
- Traversing trees or graphs iteratively

Benefits include:
- Avoids recursion stack overflow for deep structures
- Better control over memory usage
- Can be paused and resumed (useful for large computations)
- Often more efficient in languages with high recursion overhead

## Key Concepts

- **State Management**: Push current state (position, choices, etc.) onto stack
- **Backtracking**: Pop from stack to return to previous state
- **Iteration Control**: Use while loop with stack emptiness check
- **State Representation**: Store all necessary information in stack elements
- **Termination Conditions**: Define when to stop exploring a path

## Template

```python
def iterative_backtracking_simulation(start_state):
    # Stack to hold states to explore
    stack = [start_state]
    # Set to track visited states (if needed)
    visited = set()
    
    while stack:
        # Pop current state
        current = stack.pop()
        
        # Check if current state is goal
        if is_goal(current):
            return current
        
        # Mark as visited if applicable
        if current in visited:
            continue
        visited.add(current)
        
        # Generate next possible states
        for next_state in get_next_states(current):
            # Push valid next states onto stack
            if is_valid(next_state):
                stack.append(next_state)
    
    # No solution found
    return None
```

## Example Problems

1. **Binary Tree Inorder Traversal** (LeetCode 94): Implement iterative inorder traversal using stack.
2. **Validate Binary Search Tree** (LeetCode 98): Check if binary tree is valid BST using iterative approach.
3. **Simplify Path** (LeetCode 71): Simplify Unix-style file path using stack for directory navigation.

## Time and Space Complexity

- **Time Complexity**: O(n) for tree traversals, O(b^d) for general backtracking where b is branching factor and d is depth
- **Space Complexity**: O(h) for trees (h = height), O(b^d) worst case for backtracking

## Common Pitfalls

- Forgetting to handle null or invalid states
- Not properly managing visited states leading to infinite loops
- Incorrect order of pushing states (should push in reverse order for correct traversal)
- Not checking stack emptiness before popping
- Edge cases: empty input, single element, deeply nested structures