# Array/Matrix - In-place Rotation

## Problem Description

The Array/Matrix - In-place Rotation pattern is used to rotate a matrix (2D array) by 90 degrees clockwise or counterclockwise without using any additional space proportional to the matrix size. This technique is efficient for modifying matrices in place, reducing memory consumption. It's commonly used in image processing, game development, and matrix manipulation problems.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n²) where n is the matrix dimension |
| Space Complexity | O(1) - rotation done in-place |
| Applicable To | Square matrices (n x n) |
| Operations | Transpose + Reverse rows/columns |
| Common Rotations | 90° clockwise, 90° counter-clockwise, 180° |

### When to Use
- When you need to rotate a matrix 90, 180, or 270 degrees
- Image rotation problems (e.g., rotating an image represented as a pixel matrix)
- Problems requiring matrix transformation without extra space
- When the constraint specifies O(1) extra space
- Matrix pattern recognition problems

## Intuition

The key insight is that a 90-degree rotation can be decomposed into two simpler operations:
1. **Transpose**: Convert rows to columns (matrix[i][j] ↔ matrix[j][i])
2. **Reverse**: Reverse each row (for clockwise) or each column (for counter-clockwise)

The "aha!" moment comes when you visualize what happens:
- Transpose makes the first row become the first column
- Reversing rows then puts the first column at the right side (for clockwise rotation)

For layer-by-layer rotation, think of the matrix as concentric layers (like an onion), rotating each layer's elements in groups of 4.

## Solution Approaches

### Approach 1: Transpose and Reverse (Optimal) ✅ Recommended

#### Algorithm
1. **Transpose** the matrix: swap elements across the diagonal (matrix[i][j] ↔ matrix[j][i])
2. **Reverse** each row to get 90° clockwise rotation
3. For 90° counter-clockwise: reverse rows first, then transpose
4. For 180°: reverse each row, then reverse column order (or transpose twice)

#### Implementation

````carousel
```python
def rotate(matrix):
    """
    Rotate matrix 90 degrees clockwise in-place.
    LeetCode 48 - Rotate Image
    
    Time: O(n^2), Space: O(1)
    """
    n = len(matrix)
    
    # Step 1: Transpose the matrix
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Step 2: Reverse each row
    for i in range(n):
        matrix[i].reverse()
    
    return matrix


def rotate_counter_clockwise(matrix):
    """Rotate matrix 90 degrees counter-clockwise."""
    n = len(matrix)
    
    # Step 1: Reverse each row
    for i in range(n):
        matrix[i].reverse()
    
    # Step 2: Transpose
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    return matrix
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    void rotate(std::vector<std::vector<int>>& matrix) {
        int n = matrix.size();
        
        // Step 1: Transpose the matrix
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                std::swap(matrix[i][j], matrix[j][i]);
            }
        }
        
        // Step 2: Reverse each row
        for (int i = 0; i < n; i++) {
            std::reverse(matrix[i].begin(), matrix[i].end());
        }
    }
    
    void rotateCounterClockwise(std::vector<std::vector<int>>& matrix) {
        int n = matrix.size();
        
        // Step 1: Reverse each row
        for (int i = 0; i < n; i++) {
            std::reverse(matrix[i].begin(), matrix[i].end());
        }
        
        // Step 2: Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                std::swap(matrix[i][j], matrix[j][i]);
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
        
        // Step 1: Transpose the matrix
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
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
function rotate(matrix) {
    const n = matrix.length;
    
    // Step 1: Transpose the matrix
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    // Step 2: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
    
    return matrix;
}

function rotateCounterClockwise(matrix) {
    const n = matrix.length;
    
    // Step 1: Reverse each row
    for (let i = 0; i < n; i++) {
        matrix[i].reverse();
    }
    
    // Step 2: Transpose
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
    
    return matrix;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - each element accessed twice |
| Space | O(1) - in-place rotation |

### Approach 2: Layer-by-Layer Rotation

#### Algorithm
1. Process the matrix layer by layer from outer to inner
2. For each layer, rotate elements in groups of 4
3. Save the top element, move left to top, bottom to left, right to bottom, top (saved) to right
4. Continue for all layers

#### Implementation

````carousel
```python
def rotate_layer_by_layer(matrix):
    """
    Rotate matrix 90 degrees clockwise using layer-by-layer approach.
    
    Time: O(n^2), Space: O(1)
    """
    n = len(matrix)
    
    for layer in range(n // 2):
        first, last = layer, n - 1 - layer
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
    
    return matrix
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    void rotate(std::vector<std::vector<int>>& matrix) {
        int n = matrix.size();
        
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
function rotate(matrix) {
    const n = matrix.length;
    
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
    
    return matrix;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - each element rotated exactly once |
| Space | O(1) - only using temporary variables |

## Complexity Analysis

| Approach | Time | Space | Advantages |
|----------|------|-------|------------|
| Transpose + Reverse | O(n²) | O(1) | Simple, easy to remember |
| Layer-by-Layer | O(n²) | O(1) | More intuitive for some |
| Extra Matrix | O(n²) | O(n²) | Not recommended for in-place constraint |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Rotate Image](https://leetcode.com/problems/rotate-image/) | 48 | Medium | Rotate n x n matrix by 90 degrees clockwise |
| [Determine Whether Matrix Can Be Obtained By Rotation](https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/) | 1886 | Easy | Check if matrix equals target after rotation |
| [Rotate The Matrix](https://leetcode.com/problems/rotate-the-matrix/) | - | Medium | Rotate matrix 90 degrees counter-clockwise |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) | 54 | Medium | Return elements in spiral order |
| [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/) | 59 | Medium | Generate matrix filled in spiral order |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix/) | 867 | Easy | Return transpose of matrix |
| [Flipping an Image](https://leetcode.com/problems/flipping-an-image/) | 832 | Easy | Flip image horizontally and invert |

## Video Tutorial Links

1. **[NeetCode - Rotate Image](https://www.youtube.com/watch?v=fMSJSS7gOj0)** - Clear explanation of transpose + reverse approach
2. **[Back To Back SWE - Rotate Matrix](https://www.youtube.com/watch?v=SA867FvqHrM)** - Layer-by-layer rotation explanation
3. **[Kevin Naughton Jr. - Rotate Image](https://www.youtube.com/watch?v=fMSJSS7gOj0)** - Step-by-step walkthrough
4. **[Nick White - Rotate Image LeetCode 48](https://www.youtube.com/watch?v=SA867FvqHrM)** - Two approaches explained
5. **[Tech With Tim - Matrix Rotation](https://www.youtube.com/watch?v=fMSJSS7gOj0)** - Python implementation focus

## Summary

### Key Takeaways
- **Transpose + Reverse** is the most elegant and memorable approach
- For 90° clockwise: Transpose, then reverse rows
- For 90° counter-clockwise: Reverse rows, then transpose (or transpose then reverse columns)
- For 180°: Reverse rows then reverse columns (or rotate 90° twice)
- **When to apply**: Any matrix rotation problem with O(1) space constraint

### Common Pitfalls
- Forgetting to transpose before reversing (incorrect order gives wrong result)
- Off-by-one errors when using layer-by-layer rotation
- Not handling square matrices (this pattern assumes n x n)
- Modifying the matrix while reading without proper temporary storage
- Using range(n) instead of range(i, n) during transpose (would swap twice, resulting in no change)

### Follow-up Questions
1. **How would you rotate a rectangular matrix (m x n where m ≠ n)?**
   - Cannot rotate in-place; requires O(m×n) extra space for the result

2. **How would you rotate the matrix by 180 degrees?**
   - Method 1: Reverse each row, then reverse column order
   - Method 2: Apply 90° rotation twice

3. **How would you rotate by 270 degrees clockwise?**
   - Same as 90° counter-clockwise: reverse rows, then transpose

4. **Can you do the rotation without modifying the original matrix?**
   - Yes, create a new matrix where `result[j][n-1-i] = matrix[i][j]`

## Pattern Source

[In-place Rotation Pattern](patterns/array-matrix-in-place-rotation.md)
