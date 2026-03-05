# Array/Matrix - Spiral Traversal

## Problem Description

The Array/Matrix - Spiral Traversal pattern is used to traverse a matrix in a clockwise spiral order, starting from the top-left corner and moving outward layer by layer. This technique is useful for problems requiring matrix traversal in a specific order, such as printing matrix elements, generating spiral patterns, or processing layers of a 2D grid.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(m × n) - visits each element once |
| Space Complexity | O(1) excluding output, O(m×n) for output |
| Input | m x n matrix of any dimensions |
| Output | List of elements in spiral order |
| Directions | Right → Down → Left → Up (clockwise) |

### When to Use
- When you need to traverse a matrix in spiral/layer order
- Problems involving boundary shrinking or layer-by-layer processing
- Generating spiral patterns or matrices
- Problems requiring sequential processing from outside to inside
- Image processing tasks that work on borders first

## Intuition

The key insight is to maintain four boundaries (top, bottom, left, right) that shrink as we traverse each layer. We traverse in four directions and update the boundaries after completing each direction.

The "aha!" moments:
1. **Four boundaries** define the current "layer" we're traversing
2. After traversing a direction, we **shrink** the corresponding boundary
3. We must check boundary conditions **before** the left and up traversals to avoid duplicates
4. The traversal continues while `top <= bottom` and `left <= right`

## Solution Approaches

### Approach 1: Boundary Shrinkage (Optimal) ✅ Recommended

#### Algorithm
1. Initialize four boundaries: `top=0`, `bottom=m-1`, `left=0`, `right=n-1`
2. Traverse right along the top row, then increment `top`
3. Traverse down along the right column, then decrement `right`
4. Check if `top <= bottom`, then traverse left along bottom row, decrement `bottom`
5. Check if `left <= right`, then traverse up along left column, increment `left`
6. Repeat until all elements are visited

#### Implementation

````carousel
```python
def spiral_order(matrix):
    """
    Return elements of matrix in spiral order.
    LeetCode 54 - Spiral Matrix
    
    Time: O(m*n), Space: O(1) excluding output
    """
    if not matrix or not matrix[0]:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse right along top row
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Traverse down along right column
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        # Traverse left along bottom row (if still valid)
        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        # Traverse up along left column (if still valid)
        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<int> spiralOrder(std::vector<std::vector<int>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return {};
        }
        
        std::vector<int> result;
        int top = 0, bottom = matrix.size() - 1;
        int left = 0, right = matrix[0].size() - 1;
        
        while (top <= bottom && left <= right) {
            // Traverse right along top row
            for (int col = left; col <= right; col++) {
                result.push_back(matrix[top][col]);
            }
            top++;
            
            // Traverse down along right column
            for (int row = top; row <= bottom; row++) {
                result.push_back(matrix[row][right]);
            }
            right--;
            
            // Traverse left along bottom row (if still valid)
            if (top <= bottom) {
                for (int col = right; col >= left; col--) {
                    result.push_back(matrix[bottom][col]);
                }
                bottom--;
            }
            
            // Traverse up along left column (if still valid)
            if (left <= right) {
                for (int row = bottom; row >= top; row--) {
                    result.push_back(matrix[row][left]);
                }
                left++;
            }
        }
        
        return result;
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        if (matrix == null || matrix.length == 0) {
            return result;
        }
        
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        
        while (top <= bottom && left <= right) {
            // Traverse right along top row
            for (int col = left; col <= right; col++) {
                result.add(matrix[top][col]);
            }
            top++;
            
            // Traverse down along right column
            for (int row = top; row <= bottom; row++) {
                result.add(matrix[row][right]);
            }
            right--;
            
            // Traverse left along bottom row (if still valid)
            if (top <= bottom) {
                for (int col = right; col >= left; col--) {
                    result.add(matrix[bottom][col]);
                }
                bottom--;
            }
            
            // Traverse up along left column (if still valid)
            if (left <= right) {
                for (int row = bottom; row >= top; row--) {
                    result.add(matrix[row][left]);
                }
                left++;
            }
        }
        
        return result;
    }
}
```
<!-- slide -->
```javascript
function spiralOrder(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }
    
    const result = [];
    let top = 0, bottom = matrix.length - 1;
    let left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Traverse right along top row
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++;
        
        // Traverse down along right column
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--;
        
        // Traverse left along bottom row (if still valid)
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--;
        }
        
        // Traverse up along left column (if still valid)
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++;
        }
    }
    
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) - each element visited exactly once |
| Space | O(1) auxiliary, O(m×n) for result |

### Approach 2: Generate Spiral Matrix II (Constructing a Spiral Matrix)

This approach generates an n x n matrix filled with numbers from 1 to n² in spiral order.

#### Implementation

````carousel
```python
def generate_matrix(n):
    """
    Generate n x n matrix filled with 1 to n^2 in spiral order.
    LeetCode 59 - Spiral Matrix II
    
    Time: O(n^2), Space: O(n^2) for result
    """
    matrix = [[0] * n for _ in range(n)]
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        # Fill top row
        for col in range(left, right + 1):
            matrix[top][col] = num
            num += 1
        top += 1
        
        # Fill right column
        for row in range(top, bottom + 1):
            matrix[row][right] = num
            num += 1
        right -= 1
        
        # Fill bottom row
        if top <= bottom:
            for col in range(right, left - 1, -1):
                matrix[bottom][col] = num
                num += 1
            bottom -= 1
        
        # Fill left column
        if left <= right:
            for row in range(bottom, top - 1, -1):
                matrix[row][left] = num
                num += 1
            left += 1
    
    return matrix
```
<!-- slide -->
```cpp
#include <vector>

class Solution {
public:
    std::vector<std::vector<int>> generateMatrix(int n) {
        std::vector<std::vector<int>> matrix(n, std::vector<int>(n));
        int top = 0, bottom = n - 1;
        int left = 0, right = n - 1;
        int num = 1;
        
        while (top <= bottom && left <= right) {
            // Fill top row
            for (int col = left; col <= right; col++) {
                matrix[top][col] = num++;
            }
            top++;
            
            // Fill right column
            for (int row = top; row <= bottom; row++) {
                matrix[row][right] = num++;
            }
            right--;
            
            // Fill bottom row
            if (top <= bottom) {
                for (int col = right; col >= left; col--) {
                    matrix[bottom][col] = num++;
                }
                bottom--;
            }
            
            // Fill left column
            if (left <= right) {
                for (int row = bottom; row >= top; row--) {
                    matrix[row][left] = num++;
                }
                left++;
            }
        }
        
        return matrix;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[][] generateMatrix(int n) {
        int[][] matrix = new int[n][n];
        int top = 0, bottom = n - 1;
        int left = 0, right = n - 1;
        int num = 1;
        
        while (top <= bottom && left <= right) {
            // Fill top row
            for (int col = left; col <= right; col++) {
                matrix[top][col] = num++;
            }
            top++;
            
            // Fill right column
            for (int row = top; row <= bottom; row++) {
                matrix[row][right] = num++;
            }
            right--;
            
            // Fill bottom row
            if (top <= bottom) {
                for (int col = right; col >= left; col--) {
                    matrix[bottom][col] = num++;
                }
                bottom--;
            }
            
            // Fill left column
            if (left <= right) {
                for (int row = bottom; row >= top; row--) {
                    matrix[row][left] = num++;
                }
                left++;
            }
        }
        
        return matrix;
    }
}
```
<!-- slide -->
```javascript
function generateMatrix(n) {
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    let top = 0, bottom = n - 1;
    let left = 0, right = n - 1;
    let num = 1;
    
    while (top <= bottom && left <= right) {
        // Fill top row
        for (let col = left; col <= right; col++) {
            matrix[top][col] = num++;
        }
        top++;
        
        // Fill right column
        for (let row = top; row <= bottom; row++) {
            matrix[row][right] = num++;
        }
        right--;
        
        // Fill bottom row
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                matrix[bottom][col] = num++;
            }
            bottom--;
        }
        
        // Fill left column
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                matrix[row][left] = num++;
            }
            left++;
        }
    }
    
    return matrix;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - fills n² cells |
| Space | O(n²) for the result matrix |

## Complexity Analysis

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Boundary Shrinkage | O(m×n) | O(1) aux | **Recommended** - traversing any matrix |
| Generate Spiral | O(n²) | O(n²) | Creating spiral pattern matrices |
| Recursive Layer | O(m×n) | O(min(m,n)) | Alternative recursive approach |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) | 54 | Medium | Return elements in spiral order |
| [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/) | 59 | Medium | Generate n x n spiral matrix |
| [Spiral Matrix III](https://leetcode.com/problems/spiral-matrix-iii/) | 885 | Medium | Walk in spiral grid from start position |
| [Spiral Matrix IV](https://leetcode.com/problems/spiral-matrix-iv/) | 2326 | Medium | Build spiral matrix from linked list |
| [Rotate Image](https://leetcode.com/problems/rotate-image/) | 48 | Medium | Rotate matrix 90 degrees clockwise |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/) | 498 | Medium | Return diagonal order of elements |

## Video Tutorial Links

1. **[NeetCode - Spiral Matrix](https://www.youtube.com/watch?v=BJnMZNwUk1M)** - Boundary shrinkage approach
2. **[Back To Back SWE - Spiral Matrix](https://www.youtube.com/watch?v=BJnMZNwUk1M)** - Layer by layer explanation
3. **[Kevin Naughton Jr. - Spiral Order](https://www.youtube.com/watch?v=BJnMZNwUk1M)** - Clean implementation
4. **[Nick White - LeetCode 54](https://www.youtube.com/watch?v=BJnMZNwUk1M)** - Step-by-step walkthrough
5. **[Techdose - Spiral Matrix Traversal](https://www.youtube.com/watch?v=BJnMZNwUk1M)** - Multiple approaches

## Summary

### Key Takeaways
- **Four boundaries** (top, bottom, left, right) shrink after each direction traversal
- **Always check conditions** before left and up traversals to avoid duplicates
- **Process order**: Right → Down → Left → Up (clockwise spiral)
- **When to apply**: Any matrix traversal requiring layer-by-layer or spiral order processing

### Common Pitfalls
- Forgetting to check `top <= bottom` and `left <= right` before left/up traversals causes duplicates
- Incorrect boundary updates (remember to update after each direction, not all at once)
- Off-by-one errors in loop ranges (use inclusive ranges carefully)
- Not handling empty matrices (always check at the beginning)
- Updating boundaries in wrong order (update after completing each direction)

### Follow-up Questions
1. **How would you traverse in counter-clockwise spiral order?**
   - Change direction order to: Down → Right → Up → Left, or adjust boundary updates

2. **How would you traverse layer by layer but not in spiral order?**
   - Process each layer completely before moving to next layer (four nested loops per layer)

3. **What if you need to start from the center and spiral outward?**
   - Pre-calculate center, then use direction vectors with step counting

4. **How would you handle 3D spiral traversal?**
   - Extend to six boundaries (add front/back) and six directions

## Pattern Source

[Spiral Traversal Pattern](patterns/array-matrix-spiral-traversal.md)
