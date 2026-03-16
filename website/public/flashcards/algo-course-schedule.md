## Course Schedule (Detect Cycle)

**Question:** Determine if prerequisites create a cycle in course graph?

<!-- front -->

---

## Answer: DFS Cycle Detection

### Solution
```python
def canFinish(numCourses, prerequisites):
    # Build graph
    graph = [[] for _ in range(numCourses)]
    for dest, src in prerequisites:
        graph[src].append(dest)
    
    # 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * numCourses
    
    def hasCycle(course):
        if state[course] == 1:  # Currently visiting = cycle
            return True
        if state[course] == 2:  # Already visited = no cycle
            return False
        
        state[course] = 1  # Mark visiting
        
        for next_course in graph[course]:
            if hasCycle(next_course):
                return True
        
        state[course] = 2  # Mark visited
        return False
    
    for course in range(numCourses):
        if hasCycle(course):
            return False
    
    return True
```

### Visual: Cycle Detection States
```
Graph with cycle:        States:
1 → 2 → 3               
↑         ↓             
└──── 4 ←─┘             

0 = unvisited (white)
1 = visiting (gray) ← CYCLE if revisited
2 = visited (black)
```

### ⚠️ Tricky Parts

#### 1. Three States
```python
# 0 (unvisited): Not processed yet
# 1 (visiting): Currently in recursion stack
# 2 (visited): Fully processed, no cycle from here

# If we hit "visiting" again → cycle!
```

#### 2. Graph Direction
```python
# prereqs = [a, b] means "take b before a"
# Edge: b → a

# Must build graph correctly
# graph[src].append(dest)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| DFS | O(V + E) | O(V + E) |
| BFS (Kahn's) | O(V + E) | O(V + E) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong graph direction | src → dest |
| Only 2 states | Need 3 states |
| Not checking all courses | Loop through all |

<!-- back -->
