# Search a 2D Matrix

## Problem Description

Write an efficient algorithm that searches for a value in an `m x n` matrix. This matrix has the following properties:

- Integers in each row are sorted from left to right.
- The first integer of each row is greater than the last integer of the previous row.

Return true if target exists in the matrix, otherwise return false.

**Link to problem:** [Search a 2D Matrix - LeetCode 74](https://leetcode.com/problems/search-a-2d-matrix/)

---

## Pattern: Binary Search (2D)

This problem demonstrates applying binary search to a 2D matrix by treating it as a 1D array.

### Core Concept

Use binary search twice:
1. First, find which row contains the target
2. Then, search within that row

Or treat the entire matrix as a 1D array and use a single binary search.

---

## Examples

### Example

**Input:**
```
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
```

**Output:**
```
true
```

**Explanation:** The target 3 is in the first row between 1 and 7.

### Example 2

**Input:**
```
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
```

**Output:**
```
false
```

**Explanation:** 13 is not present in the matrix.

### Example 3

**Input:**
```
matrix = [[1]], target = 1
```

**Output:**
```
true
```

---

## Constraints

- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 100`
- `-10^4 <= matrix[i][j], target <= 10^4`

---

## Intuition

The key insight is that the matrix has two levels of sorting:
1. **Row-wise**: Each row is sorted individually
2. **Column-wise**: The first element of each row is greater than the last element of the previous row

This means we can think of the entire matrix as a single sorted 1D array if we "flatten" it row by row. However, we can be smarter:

- **Approach 1 (Two Binary Searches)**: First find the correct row using binary search on the first column, then search within that row
- **Approach 2 (Single Binary Search)**: Treat the matrix as a 1D array and use binary search with index arithmetic

Both approaches achieve O(log(m*n)) time complexity.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Binary Searches** - O(log m + log n) time
2. **Single Binary Search (Flattened)** - O(log(m*n)) time

---

## Approach 1: Two Binary Searches

This approach performs binary search twice: first to find the correct row, then to find the target within that row.

### Algorithm Steps

1. Handle edge cases (empty matrix)
2. Binary search to find the target row:
   - Use first and last element of each row to determine if target is in that row
   - If target is between row[0] and row[n-1], we've found the row
3. If row found, binary search within that row
4. Return true if found, false otherwise

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        """
        Search in 2D matrix using two binary searches.
        
        Args:
            matrix: 2D matrix with sorted rows
            target: Value to search for
            
        Returns:
            True if target is found, False otherwise
        """
        if not matrix or not matrix[0]:
            return False
        
        m, n = len(matrix), len(matrix[0])
        
        # Binary search for row
        top, bottom = 0, m - 1
        row = -1
        while top <= bottom:
            mid = (top + bottom) // 2
            # Check if target is in this row's range
            if matrix[mid][0] <= target <= matrix[mid][n - 1]:
                row = mid
                break
            elif target < matrix[mid][0]:
                bottom = mid - 1
            else:
                top = mid + 1
        
        if row == -1:
            return False
        
        # Binary search in found row
        left, right = 0, n - 1
        while left <= right:
            mid = (left + right) // 2
            if matrix[row][mid] == target:
                return True
            elif matrix[row][mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        /**
         * Search in 2D matrix using two binary searches.
         */
        if (matrix.empty() || matrix[0].empty()) return false;
        
        int m = matrix.size(), n = matrix[0].size();
        
        // Binary search for row
        int top = 0, bottom = m - 1, row = -1;
        while (top <= bottom) {
            int mid = (top + bottom) / 2;
            // Check if target is in this row's range
            if (matrix[mid][0] <= target && target <= matrix[mid][n-1]) {
                row = mid;
                break;
            } else if (target < matrix[mid][0]) {
                bottom = mid - 1;
            } else {
                top = mid + 1;
            }
        }
        
        if (row == -1) return false;
        
        // Binary search in found row
        int left = 0, right = n - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (matrix[row][mid] == target) return true;
            else if (matrix[row][mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        /**
         * Search in 2D matrix using two binary searches.
         */
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        
        int m = matrix.length, n = matrix[0].length;
        
        // Binary search for row
        int top = 0, bottom = m - 1, row = -1;
        while (top <= bottom) {
            int mid = (top + bottom) / 2;
            // Check if target is in this row's range
            if (matrix[mid][0] <= target && target <= matrix[mid][n-1]) {
                row = mid;
                break;
            } else if (target < matrix[mid][0]) {
                bottom = mid - 1;
            } else {
                top = mid + 1;
            }
        }
        
        if (row == -1) return false;
        
        // Binary search in found row
        int left = 0, right = n - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (matrix[row][mid] == target) return true;
            else if (matrix[row][mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Search in 2D matrix using two binary searches.
 * 
 * @param {number[][]} matrix - 2D matrix with sorted rows
 * @param {number} target - Value to search for
 * @return {boolean} - True if target is found
 */
var searchMatrix = function(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    
    const m = matrix.length, n = matrix[0].length;
    
    // Binary search for row
    let top = 0, bottom = m - 1, row = -1;
    while (top <= bottom) {
        const mid = Math.floor((top + bottom) / 2);
        // Check if target is in this row's range
        if (matrix[mid][0] <= target && target <= matrix[mid][n - 1]) {
            row = mid;
            break;
        } else if (target < matrix[mid][0]) {
            bottom = mid - 1;
        } else {
            top = mid + 1;
        }
    }
    
    if (row === -1) return false;
    
    // Binary search in found row
    let left = 0, right = n - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (matrix[row][mid] === target) return true;
        else if (matrix[row][mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log m + log n) = O(log(m*n)) |
| **Space** | O(1) |

---

## Approach 2: Single Binary Search (Flattened)

This approach treats the entire matrix as a single sorted 1D array and uses binary search with index arithmetic to map 1D indices to 2D coordinates.

### Algorithm Steps

1. Handle edge cases (empty matrix)
2. Set up binary search on indices 0 to m*n - 1
3. For each mid index:
   - Calculate row = mid / n and col = mid % n
   - Compare matrix[row][col] with target
   - Adjust search space accordingly
4. Return true if found, false otherwise

### Why It Works

The matrix has a unique property: if you flatten it row by row, you get a sorted array. This is because:
- Each row is sorted
- The last element of row i is less than the first element of row i+1

This allows us to map any index in [0, m*n) to a valid matrix position.

### Code Implementation

````carousel
```python
class Solution:
    def searchMatrix_flat(self, matrix: List[List[int]], target: int) -> bool:
        """
        Search in 2D matrix using single binary search.
        
        Args:
            matrix: 2D matrix with sorted rows
            target: Value to search for
            
        Returns:
            True if target is found, False otherwise
        """
        if not matrix or not matrix[0]:
            return False
        
        m, n = len(matrix), len(matrix[0])
        left, right = 0, m * n - 1
        
        while left <= right:
            mid = (left + right) // 2
            row = mid // n
            col = mid % n
            
            if matrix[row][col] == target:
                return True
            elif matrix[row][col] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return False
```

<!-- slide -->
```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        /**
         * Search in 2D matrix using single binary search.
         */
        if (matrix.empty() || matrix[0].empty()) return false;
        
        int m = matrix.size(), n = matrix[0].size();
        int left = 0, right = m * n - 1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            int row = mid / n;
            int col = mid % n;
            
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return false;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean searchMatrixSingle(int[][] matrix, int target) {
        /**
         * Search in 2D matrix using single binary search.
         */
        if (matrix.length == 0 || matrix[0].length == 0) return false;
        
        int m = matrix.length, n = matrix[0].length;
        int left = 0, right = m * n - 1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            int row = mid / n;
            int col = mid % n;
            
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] < target) left = mid + 1;
            else right = mid - 1;
        }
        
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * Search in 2D matrix using single binary search.
 * 
 * @param {number[][]} matrix - 2D matrix with sorted rows
 * @param {number} target - Value to search for
 * @return {boolean} - True if target is found
 */
var searchMatrixSingle = function(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    
    const m = matrix.length, n = matrix[0].length;
    let left = 0, right = m * n - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const row = Math.floor(mid / n);
        const col = mid % n;
        
        if (matrix[row][col] === target) return true;
        else if (matrix[row][col] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log(m*n)) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Two Binary Searches | Single Binary Search |
|--------|---------------------|----------------------|
| **Time Complexity** | O(log m + log n) | O(log(m*n)) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Slightly more complex | Simpler, more elegant |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Best For** | Understanding row search | Compact solution |

**Note:** Both approaches have the same time complexity asymptotically. The single binary search is often preferred for its elegance.

---

## Why Binary Search Works for This Problem

Binary search is the optimal approach because:

1. **Double Sorting**: The matrix is sorted both row-wise and column-wise (via first elements)
2. **Predictable Search Space**: We can deterministically eliminate half of the search space
3. **O(log n) Requirement**: Binary search naturally achieves logarithmic time

The key insight is that the matrix's structure allows us to apply binary search at two levels:
- Row level (using first/last elements)
- Column level (within a row)

---

## Related Problems

Based on similar themes (binary search, 2D matrix search):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Standard binary search |
| Peak Index in a Mountain Array | [Link](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Find peak in sorted-rotated array |
| Binary Search | [Link](https://leetcode.com/problems/binary-search/) | Basic binary search |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search a 2D Matrix II | [Link](https://leetcode.com/problems/search-a-2d-matrix-ii/) | Search in partially sorted matrix |
| Find Peak Element | [Link](https://leetcode.com/problems/find-peak-element/) | Find any peak element |
| Search in Rotated Sorted Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Search in rotated sorted array |

### Pattern Reference

For more detailed explanations of the binary search pattern and its variations, see:
- **[Binary Search Pattern](/patterns/binary-search)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search in 2D Matrix

- [NeetCode - Search a 2D Matrix](https://www.youtube.com/watch?v=Zh7cS715HkU) - Clear explanation with visual examples
- [Back to Back SWE - Search a 2D Matrix](https://www.youtube.com/watch?v=Zf00M6MR698) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=7Q7q5hH1q9I) - Official problem solution

### Related Concepts

- [Binary Search Complete Guide](https://www.youtube.com/watch?v=Mo9n3j5xTPA) - Understanding binary search
- [2Dhttps://www.youtube Matrix Search Techniques](.com/watch?v=K0r5S8jT8F4) - Different approaches to 2D search

---

## Follow-up Questions

### Q1: How would you modify the solution if the matrix is not fully sorted (only rows are sorted)?

**Answer:** You would need to use a different approach, such as:
- Staircase search: Start from top-right or bottom-left corner
- Binary search on each row (O(n log m))
- Treat it as a partially sorted matrix problem

---

### Q2: What if the first element of each row is NOT guaranteed to be greater than the last element of the previous row?

**Answer:** This is the "Search a 2D Matrix II" problem. You can use:
- **Staircase search**: Start from top-right, move left if target is smaller, move down if target is larger - O(m+n)
- **Binary search on each row**: O(n log m)

---

### Q3: How would you count the occurrences of the target in the matrix?

**Answer:** After finding the target, you could:
1. Expand outward from that position (if duplicates exist nearby)
2. Use binary search to find the first and last occurrence in the flattened array
3. Use the two-binary-search approach to find all occurrences in each row

---

### Q4: Can you solve this without binary search?

**Answer:** Yes, but it would be less efficient:
- Linear search: O(m*n)
- Staircase search (for sorted columns): O(m+n)
- Binary search on each row: O(n log m)

---

### Q5: How would you modify the solution to find the position (row, col) of the target?

**Answer:** Simply return the row and column indices instead of a boolean. In the single binary search approach, you can calculate row = mid / n and col = mid % n when the target is found.

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty matrix
- Matrix with single element
- Target in first row
- Target in last row
- Target in first column
- Target in last column
- Target not in matrix
- Negative numbers in matrix
- Target smaller than first element
- Target larger than last element

---

## Common Pitfalls

### 1. Off-by-One Errors in Row Search
**Issue:** Using incorrect conditions to determine if target is in a row.

**Solution:** Use `matrix[mid][0] <= target <= matrix[mid][n-1]` to check row boundaries correctly.

### 2. Index Calculation in Flattened Search
**Issue:** Using incorrect formula to convert 1D index to 2D coordinates.

**Solution:** Use `row = mid // n` and `col = mid % n` where n is the number of columns.

### 3. Not Handling Empty Matrix
**Issue:** Not checking for empty matrix before processing.

**Solution:** Always check `if not matrix or not matrix[0]` at the beginning.

### 4. Integer Overflow
**Issue:** When multiplying m * n for large matrices in some languages.

**Solution:** Use long integers or check bounds properly.

---

## Summary

The **Search a 2D Matrix** problem demonstrates binary search in a 2D context:

- **Two Binary Searches**: First find row, then search within row - O(log m + log n)
- **Single Binary Search**: Treat matrix as flattened array - O(log(m*n))
- **Both achieve O(1) space complexity**

The key insight is the matrix's double-sorted property, which allows applying binary search at two levels or treating the entire matrix as a single sorted array.

### Pattern Summary

This problem exemplifies the **Binary Search - 2D Matrix** pattern, which is characterized by:
- Exploiting row-wise and column-wise sorting
- Using index arithmetic to map 1D to 2D
- Achieving O(log n) time complexity
- Applying binary search at multiple levels

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/search-a-2d-matrix/discuss/) - Community solutions and explanations
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [2D Matrix Searching - GeeksforGeeks](https://www.geeksforgeeks.org/search-in-row-wise-and-column-wise-sorted-matrix/) - Understanding 2D search
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
