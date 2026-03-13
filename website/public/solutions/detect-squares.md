# Detect Squares

## Problem Description

You are given a stream of points on the X-Y plane. Design an algorithm that:

- Adds new points from the stream into a data structure. Duplicate points are allowed and should be treated as different points.
- Given a query point, counts the number of ways to choose three points from the data structure such that the three points and the query point form an axis-aligned square with positive area.

An axis-aligned square is a square whose edges are all the same length and are either parallel or perpendicular to the x-axis and y-axis.

Implement the DetectSquares class:

- `DetectSquares()` Initializes the object with an empty data structure.
- `void add(int[] point)` Adds a new point point = [x, y] to the data structure.
- `int count(int[] point)` Counts the number of ways to form axis-aligned squares with point point = [x, y] as described above.

**Link to problem:** [Detect Squares - LeetCode 2013](https://leetcode.com/problems/detect-squares/)

## Constraints
- `point.length == 2`
- `0 <= x, y <= 1000`
- At most 3000 calls in total will be made to add and count.

---

## Pattern: Hash Map with Coordinate Tracking

This problem demonstrates the **Hash Map with Coordinate Tracking** pattern. The pattern uses nested hash maps to efficiently track point frequencies and find valid squares.

### Core Concept

- **Point Storage**: Store points with their frequencies
- **Square Detection**: Use diagonal property to find third corner
- **Count Multiplication**: Account for duplicate points

---

## Examples

### Example

**Input:**
```
["DetectSquares", "add", "add", "add", "count", "count", "add", "count"]
[[], [[3, 10]], [[11, 2]], [[3, 2]], [[11, 10]], [[14, 8]], [[11, 2]], [[11, 10]]]
```

**Output:**
```
[null, null, null, null, 1, 0, null, 2]
```

**Explanation:**
- add([3, 10]): Add point (3,10)
- add([11, 2]): Add point (11,2)
- add([3, 2]): Add point (3,2)
- count([11, 10]): Query (11,10). Square can be formed with (11,2), (3,2), (3,10) → 1 way
- count([14, 8]): No square possible → 0
- add([11, 2]): Add another point (11,2)
- count([11, 10]): Now 2 ways - using first (11,2) and second (11,2)

### Example 2

**Input:**
```
["DetectSquares", "add", "add", "add", "add", "add", "count"]
[[], [[5, 10]], [[10, 5]], [[5, 10]], [[10, 5]], [[5, 10]], [[10, 5]]]
```

**Output:**
```
[null, null, null, null, null, null, 4]
```

**Explanation:**
- After adding duplicates, we have 2 copies of (5,10) and 2 copies of (10,5)
- count([10,10]): Can form squares with any combination → 2 × 2 = 4 ways

---

## Intuition

The key insight for finding axis-aligned squares:

1. **Square Property**: For a query point Q(x, y), if we pick another point P(x', y'), then:
   - Third corner: (x', y) - same x as P, same y as Q
   - Fourth corner: (x, y') - same x as Q, same y as P
   
2. **Valid Square Check**: Both third and fourth corners must exist, and |x - x'| == |y - y'|

3. **Count Multiplication**: If there are multiple copies of points, multiply their frequencies

### Why Hash Map Works

- **O(1) Lookup**: Quickly check if a point exists
- **Frequency Tracking**: Handle duplicate points correctly
- **Efficient Iteration**: Scan through possible x or y coordinates

---

## Multiple Approaches with Code

We'll cover one main approach:

1. **Hash Map with Frequency (Optimal)** - O(n) per query, O(n) space

---

## Approach 1: Hash Map with Frequency (Optimal)

This is the standard approach using nested hash maps to store point frequencies.

### Algorithm Steps

1. Store points in a nested hash map: points[x][y] = frequency
2. For add(point): Increment the frequency at that coordinate
3. For count(query):
   - For each x-coordinate in points (different from query.x):
     - Check if (x, query.y) exists (forms horizontal line with query)
     - Calculate side length: |x - query.x|
     - Find corresponding y: query.y ± side_length
     - Check if both required corners exist
     - Multiply frequencies: points[query.x][y'] × points[x][query.y]
   - Sum all valid squares

### Why It Works

The algorithm exploits the geometry of axis-aligned squares. For a query point Q and potential corner P, we can uniquely determine the other two corners. By checking all possible P coordinates, we find all valid squares.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.points = defaultdict(lambda: defaultdict(int))

    def add(self, point: List[int]) -> None:
        x, y = point
        self.points[x][y] += 1

    def count(self, point: List[int]) -> int:
        qx, qy = point
        res = 0
        
        # Iterate through all x coordinates different from qx
        for x in self.points:
            if x == qx:
                continue
            # Check if (x, qy) exists
            if qy not in self.points[x]:
                continue
            # Side length
            d = abs(x - qx)
            # Check both possible y positions for the square
            y1 = qy + d
            y2 = qy - d
            
            # Check if both corners exist
            if y1 in self.points[qx] and y2 in self.points[x]:
                res += self.points[qx][y1] * self.points[x][qy] * self.points[qx][y2]
            elif y1 in self.points[qx] and y1 in self.points[x]:
                res += self.points[qx][y1] * self.points[x][qy]
            elif y2 in self.points[qx] and y2 in self.points[x]:
                res += self.points[qx][y2] * self.points[x][qy]
        
        return res
```

<!-- slide -->
```cpp
class DetectSquares {
private:
    unordered_map<int, unordered_map<int, int>> points;
    
public:
    DetectSquares() {
    }
    
    void add(vector<int> point) {
        int x = point[0], y = point[1];
        points[x][y]++;
    }
    
    int count(vector<int> point) {
        int qx = point[0], qy = point[1];
        int res = 0;
        
        for (auto& [x, yMap] : points) {
            if (x == qx) continue;
            
            if (yMap.find(qy) == yMap.end()) continue;
            
            int d = abs(x - qx);
            int y1 = qy + d;
            int y2 = qy - d;
            
            // Check various combinations
            if (points[qx].find(y1) != points[qx].end() && 
                yMap.find(y1) != yMap.end()) {
                res += points[qx][y1] * yMap[qy];
            }
            if (points[qx].find(y2) != points[qx].end() && 
                yMap.find(y2) != yMap.end()) {
                res += points[qx][y2] * yMap[qy];
            }
        }
        
        return res;
    }
};
```

<!-- slide -->
```java
class DetectSquares {
    Map<Integer, Map<Integer, Integer>> points;
    
    public DetectSquares() {
        points = new HashMap<>();
    }
    
    public void add(int[] point) {
        int x = point[0], y = point[1];
        points.computeIfAbsent(x, k -> new HashMap<>()).merge(y, 1, Integer::sum);
    }
    
    public int count(int[] point) {
        int qx = point[0], qy = point[1];
        int res = 0;
        
        for (Map.Entry<Integer, Map<Integer, Integer>> xEntry : points.entrySet()) {
            int x = xEntry.getKey();
            if (x == qx) continue;
            
            Map<Integer, Integer> yMap = xEntry.getValue();
            if (!yMap.containsKey(qy)) continue;
            
            int d = Math.abs(x - qx);
            int y1 = qy + d;
            int y2 = qy - d;
            
            // Check both vertical positions
            if (points.get(qx).containsKey(y1) && yMap.containsKey(y1)) {
                res += points.get(qx).get(y1) * yMap.get(qy);
            }
            if (points.get(qx).containsKey(y2) && yMap.containsKey(y2)) {
                res += points.get(qx).get(y2) * yMap.get(qy);
            }
        }
        
        return res;
    }
}
```

<!-- slide -->
```javascript
var DetectSquares = function() {
    this.points = new Map();
};

/**
 * @param {number[]} point
 * @return {void}
 */
DetectSquares.prototype.add = function(point) {
    const [x, y] = point;
    if (!this.points.has(x)) {
        this.points.set(x, new Map());
    }
    const yMap = this.points.get(x);
    yMap.set(y, (yMap.get(y) || 0) + 1);
};

/**
 * @param {number[]} point
 * @return {number}
 */
DetectSquares.prototype.count = function(point) {
    const [qx, qy] = point;
    let res = 0;
    
    for (const [x, yMap] of this.points) {
        if (x === qx) continue;
        
        if (!yMap.has(qy)) continue;
        
        const d = Math.abs(x - qx);
        const y1 = qy + d;
        const y2 = qy - d;
        
        // Check both possible y positions
        if (this.points.has(qx) && yMap.has(y1)) {
            res += (this.points.get(qx).get(y1) || 0) * yMap.get(qy);
        }
        if (this.points.has(qx) && yMap.has(y2)) {
            res += (this.points.get(qx).get(y2) || 0) * yMap.get(qy);
        }
    }
    
    return res;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (add)** | O(1) - single hash map insert |
| **Time (count)** | O(n) - iterate through unique x coordinates |
| **Space** | O(n) - where n is unique points |

---

## Approach 2: Array-Based Storage (Alternative)

An alternative approach using 2D arrays instead of hash maps. This works well given the coordinate constraints.

### Algorithm Steps

1. Use a 2D array `count[1001][1001]` to store point frequencies
2. For add(point): Increment count[x][y]
3. For count(query): Iterate through all possible x coordinates and check valid squares
4. Same geometric logic as Approach 1

### Code Implementation

````carousel
```python
class DetectSquares:
    def __init__(self):
        self.count = [[0] * 1001 for _ in range(1001)]
        self.x_coords = set()

    def add(self, point: List[int]) -> None:
        x, y = point
        self.count[x][y] += 1
        self.x_coords.add(x)

    def count(self, point: List[int]) -> int:
        qx, qy = point
        res = 0
        
        for x in self.x_coords:
            if x == qx:
                continue
            if self.count[x][qy] == 0:
                continue
            
            d = abs(x - qx)
            y1, y2 = qy + d, qy - d
            
            # Check both possible y positions
            if 0 <= y1 <= 1000 and self.count[qx][y1] > 0:
                res += self.count[qx][y1] * self.count[x][qy]
            if 0 <= y2 <= 1000 and self.count[qx][y2] > 0:
                res += self.count[qx][y2] * self.count[x][qy]
        
        return res
```
````

### Complexity Analysis

- **Time (add)**: O(1)
- **Time (count)**: O(n) where n is unique x coordinates
- **Space**: O(1001²) = O(1) fixed space due to constraints

---

## Comparison of Approaches

| Approach | Time (add) | Time (count) | Space | Best For |
|----------|------------|--------------|-------|----------|
| Hash Map | O(1) | O(n) | O(n) | Sparse points, large coordinates |
| Array | O(1) | O(n) | O(1) | Dense points, small coordinates |

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Rectangle Overlap | [Link](https://leetcode.com/problems/rectangle-overlap/) | Rectangle intersection |
| Find Square | [Link](https://leetcode.com/problems/find-square/) | Find square in matrix |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Max Points on a Line | [Link](https://leetcode.com/problems/max-points-on-a-line/) | Collinear points |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Problem Solutions

- [NeetCode - Detect Squares](https://www.youtube.com/watch?v=2rS5LKxtuqw) - Clear explanation with examples
- [Detect Squares Solution](https://www.youtube.com/watch?v=cH5GhBWp52U) - Detailed walkthrough

### Geometry Concepts

- [Axis-Aligned Squares](https://www.youtube.com/watch?v=3K6Cq3iKtPA) - Square properties
- [Hash Map Techniques](https://www.youtube.com/watch?v=quFQWopIGFQ) - Hash map patterns

---

## Follow-up Questions

### Q1: How do duplicate points affect the count?

**Answer:** Each duplicate point is treated as a separate point. If there are k copies of point A and m copies of point B that can form a square with query Q, there are k × m ways to form that square.

---

### Q2: What if we need to handle very large coordinate values?

**Answer:** The hash map approach works regardless of coordinate size. The constraints (0 <= x, y <= 1000) are small enough that even an array-based solution would work.

---

### Q3: How would you optimize for many count() calls with few add() calls?

**Answer:** You could precompute more data structures, but the current approach is already efficient given the constraints (max 3000 calls total).

---

### Q4: Can you form multiple squares with the same side length?

**Answer:** Yes, for a given query point and side length, there can be multiple valid squares at different positions. The algorithm checks all possibilities.

---

### Q5: What edge cases should be tested?

**Answer:**
- No points added yet
- Only one point added
- All points form a line (no squares)
- Multiple duplicate points
- Points at the boundaries (0 and 1000)
- Very large number of points

---

## Common Pitfalls

### 1. Missing Square Validation
**Issue:** Not checking if both required corners exist.

**Solution:** Verify both (query.x, y') and (x, query.y) exist before counting.

### 2. Not Handling Duplicate Points
**Issue:** Treating each point as unique.

**Solution:** Multiply frequencies: freq1 × freq2 × freq3.

### 3. Wrong Side Length Calculation
**Issue:** Using Manhattan distance instead of geometric distance.

**Solution:** Side length is |x - qx|, which equals |y - qy| for valid squares.

### 4. Iterating All Points
**Issue:** Checking all points instead of just different x coordinates.

**Solution:** Only iterate x coordinates different from query.x.

### 5. Not Checking Both Y Positions
**Issue:** Missing squares above or below the query point.

**Solution:** Check both qy + d and qy - d.

---

## Summary

The **Detect Squares** problem demonstrates the **Hash Map with Coordinate Tracking** pattern:

- **Hash Map Approach**: O(n) per query, O(n) space

The key insight is using the geometric properties of axis-aligned squares: for a query point Q and potential corner P, the other two corners are uniquely determined. By tracking point frequencies, we correctly count squares with duplicate points.

This problem is an excellent demonstration of how to combine geometric reasoning with hash-based data structures.

### Pattern Summary

This problem exemplifies the **Hash Map with Coordinate Tracking** pattern, characterized by:
- Nested hash maps for 2D coordinate storage
- Frequency tracking for duplicates
- Geometric constraints for validation
- Efficient lookup operations

For more details on this pattern and its variations, see the **[Hash Map Patterns](/patterns/hashmap)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/detect-squares/discuss/) - Community solutions
- [Hash Map - GeeksforGeeks](https://www.geeksforgeeks.org/hashing-data-structure/) - Understanding hash maps
- [Geometry in Programming](https://www.geeksforgeeks.org/geometry-and-computational-geometry/) - Geometric algorithms
