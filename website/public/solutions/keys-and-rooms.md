# Keys and Rooms

## Problem Description

There are `n` rooms labeled from `0` to `n - 1`, and all the rooms are locked except for room `0`. Your goal is to visit all the rooms. However, you cannot enter a locked room without having its key.

When you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms.

Given an array `rooms` where `rooms[i]` is the set of keys you can obtain if you visited room `i`, return `true` if you can visit all the rooms, or `false` otherwise.

### Example 1

**Input:** `rooms = [[1],[2],[3],[]]`

**Output:** `true`

**Explanation:**
- Visit room 0 and pick up key 1.
- Visit room 1 and pick up key 2.
- Visit room 2 and pick up key 3.
- Visit room 3.
- Since we were able to visit every room, we return `true`.

### Example 2

**Input:** `rooms = [[1,3],[3,0,1],[2],[0]]`

**Output:** `false`

**Explanation:** We cannot enter room 2 since the only key that unlocks it is in that room.

## Constraints

- `n == rooms.length`
- `2 <= n <= 1000`
- `0 <= rooms[i].length <= 1000`
- `1 <= sum(rooms[i].length) <= 3000`
- `0 <= rooms[i][j] < n`
- All the values of `rooms[i]` are unique.

## Solution

```python
from typing import List
from collections import deque

class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        n = len(rooms)
        visited = set()
        q = deque([0])
        visited.add(0)
        
        while q:
            curr = q.popleft()
            for key in rooms[curr]:
                if key not in visited:
                    visited.add(key)
                    q.append(key)
        
        return len(visited) == n
```

## Explanation

This problem can be modeled as a graph traversal where:
- Rooms are nodes.
- Keys represent directed edges from the current room to the room the key unlocks.

### Algorithm (BFS)

1. Start with room 0 in the queue and mark it as visited.
2. While the queue is not empty:
   - Dequeue the current room.
   - For each key in the current room:
     - If the corresponding room hasn't been visited, mark it as visited and enqueue it.
3. After traversal, check if all rooms have been visited.

### Alternative: DFS

A depth-first search approach would work equally well:

```python
def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
    visited = set()
    
    def dfs(room):
        if room in visited:
            return
        visited.add(room)
        for key in rooms[room]:
            dfs(key)
    
    dfs(0)
    return len(visited) == len(rooms)
```

## Complexity Analysis

- **Time Complexity:** O(V + E) — we visit each room (V) and process each key (E) once.
- **Space Complexity:** O(V) — for the visited set and queue/stack.
