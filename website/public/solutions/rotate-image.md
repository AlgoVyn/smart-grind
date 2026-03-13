# Rotate Image

## Problem Description

You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).

You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.

**Link to problem:** [Rotate Image - LeetCode 48](https://leetcode.com/problems/rotate-image/)

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `matrix = [[1,2,3],[4,5,6],[7,8,9]]` | `[[7,4,1],[8,5,2],[9,6,3]]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]` | `[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]` |

## Constraints

- `n == matrix.length == matrix[i].length`
- `1 <= n <= 20`
- `-1000 <= matrix[i][j] <= 1000`

---

## Pattern: Matrix Rotation In-Place

This problem demonstrates the **Matrix Rotation** pattern, which uses a combination of matrix transpose and row/column reversal to achieve 90-degree rotation without extra space.

### Core Concept

Rotating a matrix 90° clockwise can be achieved through two simple operations:

1. **Transpose**: Swap `matrix[i][j]` with `matrix[j][i]` (across the main diagonal)
2. **Reverse each row**: Reverse the order of elements in each row

### Why This Works

Visualizing a 90° clockwise rotation:

```
Original:          After Transpose:    After Row Reverse:
[1, 2, 3]          [1, 4, 7]          [7, 4, 1]
[4, 5, 6]    →     [2, 5, 8]     →    [8, 5, 2]
[7, 8, 9]          [3, 6, 9]          [9, 6, 3]
```

The key insight is that rotating 90° clockwise is equivalent to:
1. Reflecting across the main diagonal (transpose)
2. Flipping horizontally (reverse each row)

---

## Intuition

### Alternative Approaches

1. **Four-Way Swap**: Swap elements in groups of four (more complex but truly in-place)
2. **Transpose + Reverse**: Transpose then reverse rows (simpler, commonly used)
3. **Reverse + Transpose**: Reverse rows then transpose (also works)

### Why Transpose + Reverse Works

For a 90° clockwise rotation:
- Element at position `[i][j]` moves to `[j][n-1-i]`
- Transpose: `[i][j]` → `[j][i]`
- Row reverse: `[j][i]` → `[j][n-1-i]`

This two-step process achieves the rotation efficiently.

---

## Multiple Approaches with Code

## Approach 1: Transpose + Reverse Rows (Optimal)

This is the most common and elegant solution. First transpose the matrix, then reverse each row.

````carousel
```python
class Solution:
    def rotate(self, matrix: list[list[int]]) -> None:
        """
        Rotate the matrix 90 degrees clockwise in-place.
        
        Args:
            matrix: n x n 2D matrix to rotate
            
        Returns:
            None (modifies matrix in-place)
        """
        n = len(matrix)
        
        # Step 1: Transpose the matrix (swap across main diagonal)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        
        # Step 2: Reverse each row
        for row in matrix:
            row.reverse()
```
<!-- slide -->
```cpp
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        
        // Step 1: Transpose the matrix (swap across main diagonal)
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                swap(matrix[i][j], matrix[j][i]);
            }
        }
        
        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            reverse(matrix[i].begin(), matrix[i].end());
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        
        // Step 1: Transpose the matrix (swap across main diagonal)
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        
        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            int left = 0, right = n - 1;
            while (left < right) {
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;
                left++;
                right--;
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length;
    
    // Step 1: Transpose the matrix (swap across main diagonal)
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) - visiting each element once |
| **Space** | O(1) - in-place modification |

---

## Approach 2: Four-Way Swap (Layer by Layer)

This approach swaps elements in groups of four, working layer by layer from outside to inside.

````carousel
```python
class Solution:
    def rotate_four_way(self, matrix: list[list[int]]) -> None:
        """
        Rotate using four-way swap method.
        
        Args:
            matrix: n x n 2D matrix to rotate
            
        Returns:
            None (modifies matrix in-place)
        """
        n = len(matrix)
        
        # Process layer by layer
        for layer in range(n // 2):
            first = layer
            last = n - 1 - layer
            
            for i in range(first, last):
                offset = i - first
                
                # Save top
                top = matrix[first][i]
                
                # Left -> Top
                matrix[first][i] = matrix[last - offset][first]
                
                # Bottom -> Left
                matrix[last - offset][first] = matrix[last][last - offset]
                
                # Right -> Bottom
                matrix[last][last - offset] = matrix[i][last]
                
                # Top -> Right
                matrix[i][last] = top
```
<!-- slide -->
```cpp
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        
        // Process layer by layer
        for (int layer = 0; layer < n / 2; layer++) {
            int first = layer;
            int last = n - 1 - layer;
            
            for (int i = first; i < last; i++) {
                int offset = i - first;
                
                // Save top
                int top = matrix[first][i];
                
                // Left -> Top
                matrix[first][i] = matrix[last - offset][first];
                
                // Bottom -> Left
                matrix[last - offset][first] = matrix[last][last - offset];
                
                // Right -> Bottom
                matrix[last][last - offset] = matrix[i][last];
                
                // Top -> Right
                matrix[i][last] = top;
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        
        // Process layer by layer
        for (int layer = 0; layer < n / 2; layer++) {
            int first = layer;
            int last = n - 1 - layer;
            
            for (int i = first; i < last; i++) {
                int offset = i - first;
                
                // Save top
                int top = matrix[first][i];
                
                // Left -> Top
                matrix[first][i] = matrix[last - offset][first];
                
                // Bottom -> Left
                matrix[last - offset][first] = matrix[last][last - offset];
                
                // Right -> Bottom
                matrix[last][last - offset] = matrix[i][last];
                
                // Top -> Right
                matrix[i][last] = top;
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length;
    
    // Process layer by layer
    for (let layer = 0; layer < n / 2; layer++) {
        const first = layer;
        const last = n - 1 - layer;
        
        for (let i = first; i < last; i++) {
            const offset = i - first;
            
            // Save top
            const top = matrix[first][i];
            
            // Left -> Top
            matrix[first][i] = matrix[last - offset][first];
            
            // Bottom -> Left
            matrix[last - offset][first] = matrix[last][last - offset];
            
            // Right -> Bottom
            matrix[last][last - offset] = matrix[i][last];
            
            // Top -> Right
            matrix[i][last] = top;
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) - visiting each element once |
| **Space** | O(1) - only using a temp variable |

---

## Approach 3: Reverse + Transpose

This is the reverse of Approach 1 - first reverse rows, then transpose.

````carousel
```python
class Solution:
    def rotate_reverse(self, matrix: list[list[int]]) -> None:
        """
        Rotate using reverse then transpose.
        
        Args:
            matrix: n x n 2D matrix to rotate
            
        Returns:
            None (modifies matrix in-place)
        """
        n = len(matrix)
        
        # Step 1: Reverse rows (flip vertically)
        matrix.reverse()
        
        # Step 2: Transpose
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
```
<!-- slide -->
```cpp
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        
        // Step 1: Reverse rows (flip vertically)
        reverse(matrix.begin(), matrix.end());
        
        // Step 2: Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                swap(matrix[i][j], matrix[j][i]);
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        
        // Step 1: Reverse rows (flip vertically)
        int left = 0, right = n - 1;
        while (left < right) {
            int[] temp = matrix[left];
            matrix[left] = matrix[right];
            matrix[right] = temp;
            left++;
            right--;
        }
        
        // Step 2: Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length;
    
    // Step 1: Reverse rows (flip vertically)
    matrix.reverse();
    
    // Step 2: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
};
```
````

### Complexity Analysis

| Complexity | Value |
|------------|-------|
| **Time** | O(n²) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| **Transpose + Reverse** | O(n²) | O(1) | Most commonly used |
| **Four-Way Swap** | O(n²) | O(1) | More complex, true in-place |
| **Reverse + Transpose** | O(n²) | O(1) | Alternative to Approach 1 |

**Best Approach:** Transpose + Reverse Rows (Approach 1) is the most readable and commonly used in interviews.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Very frequently asked in technical interviews
- **Companies**: Google, Meta, Apple, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts**: Matrix manipulation, in-place algorithms

### Key Insights

1. **Two-Step Process**: Rotation = Transpose + Reversal
2. **In-Place**: Always aim for O(1) space
3. **Pattern Recognition**: This pattern applies to other matrix transformations

---

## Related Problems

### Same Pattern (Matrix Operations)

| Problem | LeetCode Link | Difficulty |
|---------|---------------|-------------|
| Rotate Array | [Link](https://leetcode.com/problems/rotate-array/) | Medium |
| Spiral Matrix | [Link](https://leetcode.com/problems/spiral-matrix/) | Medium |
| Transpose Matrix | [Link](https://leetcode.com/problems/transpose-matrix/) | Easy |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Flipping an Image | [Link](https://leetcode.com/problems/flipping-an-image/) | Easy | Matrix reversal |
| Rotate String | [Link](https://leetcode.com/problems/rotate-string/) | Easy | String rotation |
| Diagonal Traverse | [Link](https://leetcode.com/problems/diagonal-traverse/) | Medium | Matrix traversal |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Rotate Image](https://www.youtube.com/watch?v=fMSJko7pzp4)** - Clear visual explanation
2. **[LeetCode Official Solution](https://www.youtube.com/watch?v=9EXsX3b--qI)** - Official walkthrough
3. **[In-Place Matrix Rotation](https://www.youtube.com/watch?v=Sa5r8FjxJrA)** - Detailed explanation

### Additional Resources

- **[Matrix Rotation - GeeksforGeeks](https://www.geeksforgeeks.org/inplace-rotate-square-matrix-by-90-degrees/)** - Comprehensive guide
- **[Matrix Transpose - Wikipedia](https://en.wikipedia.org/wiki/Transpose)** - Mathematical background

---

## Follow-up Questions

### Q1: How would you rotate the matrix 180 degrees?

**Answer:** Apply the 90° rotation twice, or reverse both rows and columns. First reverse each row, then reverse the order of rows.

---

### Q2: How would you rotate counter-clockwise instead of clockwise?

**Answer:** Either (1) transpose then reverse columns, or (2) reverse then transpose. The key is swapping the order of operations.

---

### Q3: What if you need to rotate by any arbitrary angle?

**Answer:** For arbitrary angles, you'd need trigonometry and likely cannot do it in-place. Use rotation matrices and create a new result matrix.

---

### Q4: How would you handle non-square matrices?

**Answer:** The problem constraints specify n x n matrices. For non-square matrices, rotation by 90° would change dimensions, so you'd need to handle the dimension swap explicitly.

---

### Q5: Can you do this with only one pass through the matrix?

**Answer:** The four-way swap approach essentially does one pass, visiting each element exactly once. However, you still need two operations (swap and potentially transpose).

---

## Common Pitfalls

### 1. Transpose vs Reverse Confusion
**Issue:** Confusing which operation comes first.

**Solution:** Remember: transpose + reverse rows = clockwise rotation.

### 2. Off-by-One Errors
**Issue:** Using wrong range in loops.

**Solution:** In transpose, use `range(i + 1, n)` to avoid redundant swaps.

### 3. Modifying Original Matrix
**Issue:** Creating copies defeats the in-place requirement.

**Solution:** Always modify the input matrix directly without creating new ones.

### 4. Not Reversing Each Row
**Issue:** Only transposing without reversing.

**Solution:** Remember both steps are necessary for 90° rotation.

---

## Summary

The **Rotate Image** problem is a classic matrix manipulation problem:

- **Transpose + Reverse**: The key to 90° clockwise rotation
- **In-Place**: Achieved with O(1) space
- **Pattern**: Applies to various matrix transformations

Key takeaways:
1. Understand the relationship between transpose and rotation
2. Practice the two-step process: transpose, then reverse
3. The four-way swap is an elegant alternative for true in-place rotation
4. This pattern extends to 180° and 270° rotations

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/rotate-image/discuss/)
- [Matrix Rotation - GeeksforGeeks](https://www.geeksforgeeks.org/inplace-rotate-square-matrix-by-90-degrees/)
- [Pattern: Matrix Rotation](/patterns/matrix-rotation)
