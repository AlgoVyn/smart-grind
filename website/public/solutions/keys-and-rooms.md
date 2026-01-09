# Keys And Rooms

## Problem Description
There are n rooms labeled from 0 to n - 1 and all the rooms are locked except for room 0. Your goal is to visit all the rooms. However, you cannot enter a locked room without having its key.
When you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms.
Given an array rooms where rooms[i] is the set of keys that you can obtain if you visited room i, return true if you can visit all the rooms, or false otherwise.
 
Example 1:

Input: rooms = [[1],[2],[3],[]]
Output: true
Explanation: 
We visit room 0 and pick up key 1.
We then visit room 1 and pick up key 2.
We then visit room 2 and pick up key 3.
We then visit room 3.
Since we were able to visit every room, we return true.

Example 2:

Input: rooms = [[1,3],[3,0,1],[2],[0]]
Output: false
Explanation: We can not enter room number 2 since the only key that unlocks it is in that room.

 
Constraints:

n == rooms.length
2 <= n <= 1000
0 <= rooms[i].length <= 1000
1 <= sum(rooms[i].length) <= 3000
0 <= rooms[i][j] < n
All the values of rooms[i] are unique.
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
This problem can be modeled as a graph where rooms are nodes and keys are directed edges. We need to check if we can visit all rooms starting from room 0.

We use BFS to traverse the graph. Start with room 0 in the queue and mark it as visited. For each room, add its unvisited neighbors (keys) to the queue and mark them visited.

After traversal, check if the number of visited rooms equals the total number of rooms.

Time complexity: O(V + E), where V is the number of rooms and E is the total number of keys, as we visit each room and edge once.
Space complexity: O(V), for the visited set and queue.
