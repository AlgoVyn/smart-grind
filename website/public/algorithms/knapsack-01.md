# 0/1 Knapsack

## Category
Dynamic Programming

## Description

The 0/1 Knapsack is a classic dynamic programming problem where we have **n items**, each with a **weight** and a **value**. Given a knapsack with capacity **W**, we need to select items such that the total weight doesn't exceed W while maximizing the total value. Each item can only be taken once (0 or 1 time).

This problem demonstrates fundamental dynamic programming concepts including optimal substructure and overlapping subproblems, making it essential for understanding DP fundamentals.

---

## When to Use

Use the 0/1 Knapsack algorithm when you need to solve problems involving:

- **Resource Allocation**: Limited capacity with items to choose from
- **Binary Choice Problems**: Every item has a "take it or leave it" decision
- **Optimization with Constraints**: Maximize value under weight/cost constraints
- **Selection Problems**: Choose subset of items that maximize total value

### Comparison with Alternatives

| Algorithm | Use Case | Time Complexity | Space Complexity |
|-----------|----------|-----------------|------------------|
| **0/1 Knapsack (DP)** | Exactly one of each item | O(n × W) | O(n × W) or O(W) |
| **Unbounded Knapsack** | Unlimited copies of each item | O(n × W) | O(W) |
| **Fractional Knapsack** | Can take fractions of items | O(n log n) | O(n) |
| **Greedy** | Fractional, not 0/1 | O(n log n) | O(n) |

### When to Choose 0/1 Knapsack vs Other Variations

- **Choose 0/1 Knapsack** when:
  - Each item can be taken at most once
  - You need exact optimization (not approximation)
  - The problem explicitly states "each item can be used once"

- **Choose Unbounded Knapsack** when:
  - You can use each item unlimited times
  - Coin change problems (minimum/maximum coins)

- **Choose Fractional Knapsack** when:
  - You can take fractions of items
  - Real-world scenarios like cutting gold bars

---

## Algorithm Explanation

### Core Concept

The key insight behind 0/1 Knapsack is that for each item, we have a **binary choice**: either include it in the knapsack or don't. This creates a decision tree of possibilities, but we can optimize using dynamic programming by building solutions from smaller subproblems.

The **optimal substructure** property means that the optimal solution for n items can be built from optimal solutions of n-1 items. The **overlapping subproblems** property means we can reuse previously computed results.

### How It Works

#### DP Table Approach:

1. Create a 2D DP table where `dp[i][w]` represents the maximum value using the first `i` items with knapsack capacity `w`
2. For each item `i` (from 1 to n) and each capacity `w` (from 0 to W):
   - **Don't include** item i-1: `dp[i][w] = dp[i-1][w]`
   - **Include** item i-1 (if it fits): `dp[i][w] = dp[i-1][w - weight[i-1]] + value[i-1]`
   - Take the maximum of both choices
3. The answer is `dp[n][W]`

#### Space-Optimized Approach:

We can use a 1D DP array by iterating capacity in **reverse order** (from W to weight[i]). This ensures we don't use the same item twice, because when going backwards, we reference values from the previous iteration that haven't been updated yet.

### Visual Representation

For items: values = [60, 100, 120], weights = [10, 20, 30], capacity = 50

```
DP Table (rows = items considered, cols = capacity):
         0   10   20   30   40   50
Items=0:  0    0    0    0    0    0
Items=1:  0   60   60   60   60   60    ← only item 0 fits
Items=2:  0   60  100  160  160  160   ← items 0+1
Items=3:  0   60  100  160  220  220   ← items 1+2 (optimal!)

Optimal selection: Items 2 and 3 (weights 20+30=50, values 100+120=220)
```

### Why Reverse Iteration for Space Optimization?

When using 1D DP, iterating forward would allow using the same item multiple times:
- Forward: `dp[w] = max(dp[w], dp[w - weight] + value)` - dp[w-weight] is UPDATED in current iteration
- Backward: `dp[w] = max(dp[w], dp[w - weight] + value)` - dp[w-weight] is from PREVIOUS iteration

---

## Algorithm Steps

### Building the DP Table

1. **Initialize**: Create dp array of size (n+1) × (W+1) filled with 0
2. **Iterate through items**: For i from 1 to n
3. **Iterate through capacities**: For w from 0 to W
4. **Make decision**: 
   - If `weights[i-1] ≤ w`: `dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])`
   - Else: `dp[i][w] = dp[i-1][w]`
5. **Return**: `dp[n][W]`

### Space-Optimized Version

1. **Initialize**: Create dp array of size (W+1) filled with 0
2. **Iterate through items**: For each item i from 0 to n-1
3. **Iterate capacities backwards**: For w from W down to weights[i]
4. **Update**: `dp[w] = max(dp[w], dp[w - weights[i]] + values[i])`
5. **Return**: `dp[W]`

---

## Implementation

### Template Code (0/1 Knapsack)

````carousel
```python
from typing import List, Tuple

def knapsack_01(values: List[int], weights: List[int], capacity: int) -> int:
    """
    0/1 Knapsack - maximize value with weight constraint.
    
    Each item can only be taken once (0 or 1 time).
    
    Args:
        values: List of values for each item
        weights: List of weights for each item  
        capacity: Maximum weight capacity of knapsack
    
    Returns:
        Maximum value that can be achieved
    
    Time Complexity: O(n * W)
    Space Complexity: O(n * W)
    """
    if not values or not weights or capacity <= 0:
        return 0
    
    n = len(values)
    
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    # Build the DP table
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't include item i-1
            dp[i][w] = dp[i - 1][w]
            
            # Include item i-1 if it fits
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                )
    
    return dp[n][capacity]


def knapsack_01_space_optimized(values: List[int], weights: List[int], capacity: int) -> int:
    """
    Space-optimized 0/1 Knapsack using 1D DP array.
    
    Time Complexity: O(n * W)
    Space Complexity: O(W)
    """
    if not values or not weights or capacity <= 0:
        return 0
    
    n = len(values)
    
    # dp[w] = max value achievable with capacity w
    dp = [0] * (capacity + 1)
    
    # Process each item
    for i in range(n):
        # Iterate backwards to avoid using same item twice
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(
                dp[w],
                dp[w - weights[i]] + values[i]
            )
    
    return dp[capacity]


def knapsack_with_items(values: List[int], weights: List[int], capacity: int) -> Tuple[int, List[int]]:
    """
    0/1 Knapsack that also returns which items were selected.
    
    Returns:
        Tuple of (max_value, list_of_selected_item_indices)
    """
    n = len(values)
    
    # dp[i][w] = max value using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    # Track which items were selected
    selected = [[False] * (capacity + 1) for _ in range(n + 1)]
    
    # Build the DP table
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't include item i-1
            dp[i][w] = dp[i - 1][w]
            
            # Include item i-1 if it fits
            if weights[i - 1] <= w:
                include_value = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                if include_value > dp[i - 1][w]:
                    dp[i][w] = include_value
                    selected[i][w] = True
    
    # Backtrack to find selected items
    items_selected = []
    w = capacity
    for i in range(n, 0, -1):
        if selected[i][w]:
            items_selected.append(i - 1)
            w -= weights[i - 1]
    
    return dp[n][capacity], items_selected


# Example usage and demonstration
if __name__ == "__main__":
    values = [60, 100, 120]
    weights = [10, 20, 30]
    capacity = 50
    
    print("=" * 60)
    print("0/1 Knapsack Problem")
    print("=" * 60)
    print(f"Items: {list(zip(values, weights))}")
    print(f"Knapsack capacity: {capacity}")
    print()
    
    # Standard DP approach
    result = knapsack_01(values, weights, capacity)
    print(f"Maximum value (2D DP): {result}")
    
    # Space-optimized approach
    result_opt = knapsack_01_space_optimized(values, weights, capacity)
    print(f"Maximum value (1D DP): {result_opt}")
    
    # With item selection
    max_value, items = knapsack_with_items(values, weights, capacity)
    print(f"\nSelected items: {items}")
    print(f"Selected values: {[values[i] for i in items]}")
    print(f"Selected weights: {[weights[i] for i in items]}")
    print(f"Total value: {sum(values[i] for i in items)}")
    print(f"Total weight: {sum(weights[i] for i in items)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * 0/1 Knapsack - maximize value with weight constraint.
 * 
 * Each item can only be taken once (0 or 1 time).
 * 
 * Time Complexity: O(n * W)
 * Space Complexity: O(n * W)
 */
int knapsack01(const vector<int>& values, const vector<int>& weights, int capacity) {
    int n = values.size();
    if (n == 0 || capacity <= 0) return 0;
    
    // dp[i][w] = max value using first i items with capacity w
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    // Build the DP table
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            // Don't include item i-1
            dp[i][w] = dp[i - 1][w];
            
            // Include item i-1 if it fits
            if (weights[i - 1] <= w) {
                dp[i][w] = max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

/**
 * Space-optimized 0/1 Knapsack using 1D DP array.
 * 
 * Time Complexity: O(n * W)
 * Space Complexity: O(W)
 */
int knapsack01Optimized(const vector<int>& values, const vector<int>& weights, int capacity) {
    int n = values.size();
    if (n == 0 || capacity <= 0) return 0;
    
    // dp[w] = max value achievable with capacity w
    vector<int> dp(capacity + 1, 0);
    
    // Process each item
    for (int i = 0; i < n; i++) {
        // Iterate backwards to avoid using same item twice
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

/**
 * 0/1 Knapsack that also returns which items were selected.
 */
pair<int, vector<int>> knapsack01WithItems(const vector<int>& values, 
                                            const vector<int>& weights, 
                                            int capacity) {
    int n = values.size();
    
    // dp[i][w] = max value using first i items with capacity w
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    
    // Track decisions
    vector<vector<bool>> take(n + 1, vector<bool>(capacity + 1, false));
    
    // Build the DP table
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            // Don't include item i-1
            dp[i][w] = dp[i - 1][w];
            
            // Include item i-1 if it fits
            if (weights[i - 1] <= w) {
                int includeValue = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                if (includeValue > dp[i - 1][w]) {
                    dp[i][w] = includeValue;
                    take[i][w] = true;
                }
            }
        }
    }
    
    // Backtrack to find selected items
    vector<int> selected;
    int w = capacity;
    for (int i = n; i > 0; i--) {
        if (take[i][w]) {
            selected.push_back(i - 1);
            w -= weights[i - 1];
        }
    }
    
    return {dp[n][capacity], selected};
}


int main() {
    vector<int> values = {60, 100, 120};
    vector<int> weights = {10, 20, 30};
    int capacity = 50;
    
    cout << "=" << 60 << endl;
    cout << "0/1 Knapsack Problem" << endl;
    cout << "=" << 60 << endl;
    cout << "Items: ";
    for (int i = 0; i < values.size(); i++) {
        cout << "(" << values[i] << ", " << weights[i] << ") ";
    }
    cout << endl;
    cout << "Knapsack capacity: " << capacity << endl << endl;
    
    // Standard DP approach
    int result = knapsack01(values, weights, capacity);
    cout << "Maximum value (2D DP): " << result << endl;
    
    // Space-optimized approach
    int resultOpt = knapsack01Optimized(values, weights, capacity);
    cout << "Maximum value (1D DP): " << resultOpt << endl;
    
    // With item selection
    auto [maxValue, items] = knapsack01WithItems(values, weights, capacity);
    cout << "\nSelected items: ";
    for (int idx : items) cout << idx << " ";
    cout << endl;
    
    cout << "Selected values: ";
    for (int idx : items) cout << values[idx] << " ";
    cout << endl;
    
    cout << "Total value: " << maxValue << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * 0/1 Knapsack - maximize value with weight constraint.
 * 
 * Each item can only be taken once (0 or 1 time).
 * 
 * Time Complexity: O(n * W)
 * Space Complexity: O(n * W)
 */
public class Knapsack01 {
    
    /**
     * 0/1 Knapsack using 2D DP table.
     */
    public static int knapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        if (n == 0 || capacity <= 0) return 0;
        
        // dp[i][w] = max value using first i items with capacity w
        int[][] dp = new int[n + 1][capacity + 1];
        
        // Build the DP table
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                // Don't include item i-1
                dp[i][w] = dp[i - 1][w];
                
                // Include item i-1 if it fits
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        dp[i][w],
                        dp[i - 1][w - weights[i - 1]] + values[i - 1]
                    );
                }
            }
        }
        
        return dp[n][capacity];
    }
    
    /**
     * Space-optimized 0/1 Knapsack using 1D DP array.
     * 
     * Time Complexity: O(n * W)
     * Space Complexity: O(W)
     */
    public static int knapsackOptimized(int[] values, int[] weights, int capacity) {
        int n = values.length;
        if (n == 0 || capacity <= 0) return 0;
        
        // dp[w] = max value achievable with capacity w
        int[] dp = new int[capacity + 1];
        
        // Process each item
        for (int i = 0; i < n; i++) {
            // Iterate backwards to avoid using same item twice
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        
        return dp[capacity];
    }
    
    /**
     * 0/1 Knapsack that also returns which items were selected.
     * 
     * @return int[] array where index 0 is max value, index 1 is array of selected items
     */
    public static Object[] knapsackWithItems(int[] values, int[] weights, int capacity) {
        int n = values.length;
        
        // dp[i][w] = max value using first i items with capacity w
        int[][] dp = new int[n + 1][capacity + 1];
        
        // Track decisions
        boolean[][] take = new boolean[n + 1][capacity + 1];
        
        // Build the DP table
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                // Don't include item i-1
                dp[i][w] = dp[i - 1][w];
                
                // Include item i-1 if it fits
                if (weights[i - 1] <= w) {
                    int includeValue = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                    if (includeValue > dp[i - 1][w]) {
                        dp[i][w] = includeValue;
                        take[i][w] = true;
                    }
                }
            }
        }
        
        // Backtrack to find selected items
        java.util.List<Integer> selected = new java.util.ArrayList<>();
        int w = capacity;
        for (int i = n; i > 0; i--) {
            if (take[i][w]) {
                selected.add(i - 1);
                w -= weights[i - 1];
            }
        }
        
        return new Object[]{dp[n][capacity], selected};
    }
    
    public static void main(String[] args) {
        int[] values = {60, 100, 120};
        int[] weights = {10, 20, 30};
        int capacity = 50;
        
        System.out.println("=".repeat(60));
        System.out.println("0/1 Knapsack Problem");
        System.out.println("=".repeat(60));
        
        System.out.print("Items: ");
        for (int i = 0; i < values.length; i++) {
            System.out.print("(" + values[i] + ", " + weights[i] + ") ");
        }
        System.out.println();
        System.out.println("Knapsack capacity: " + capacity);
        System.out.println();
        
        // Standard DP approach
        int result = knapsack(values, weights, capacity);
        System.out.println("Maximum value (2D DP): " + result);
        
        // Space-optimized approach
        int resultOpt = knapsackOptimized(values, weights, capacity);
        System.out.println("Maximum value (1D DP): " + resultOpt);
        
        // With item selection
        Object[] resultWithItems = knapsackWithItems(values, weights, capacity);
        int maxValue = (int) resultWithItems[0];
        @SuppressWarnings("unchecked")
        java.util.List<Integer> items = (java.util.List<Integer>) resultWithItems[1];
        
        System.out.println("\nSelected items: " + items);
        System.out.println("Total value: " + maxValue);
    }
}
```

<!-- slide -->
```javascript
/**
 * 0/1 Knapsack - maximize value with weight constraint.
 * 
 * Each item can only be taken once (0 or 1 time).
 * 
 * Time Complexity: O(n * W)
 * Space Complexity: O(n * W)
 */

/**
 * 0/1 Knapsack using 2D DP table.
 * @param {number[]} values - Array of values for each item
 * @param {number[]} weights - Array of weights for each item
 * @param {number} capacity - Maximum weight capacity
 * @returns {number} Maximum value achievable
 */
function knapsack01(values, weights, capacity) {
    const n = values.length;
    if (n === 0 || capacity <= 0) return 0;
    
    // dp[i][w] = max value using first i items with capacity w
    const dp = Array.from({ length: n + 1 }, () => 
        Array(capacity + 1).fill(0)
    );
    
    // Build the DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // Don't include item i-1
            dp[i][w] = dp[i - 1][w];
            
            // Include item i-1 if it fits
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

/**
 * Space-optimized 0/1 Knapsack using 1D DP array.
 * 
 * Time Complexity: O(n * W)
 * Space Complexity: O(W)
 * @param {number[]} values - Array of values for each item
 * @param {number[]} weights - Array of weights for each item
 * @param {number} capacity - Maximum weight capacity
 * @returns {number} Maximum value achievable
 */
function knapsack01Optimized(values, weights, capacity) {
    const n = values.length;
    if (n === 0 || capacity <= 0) return 0;
    
    // dp[w] = max value achievable with capacity w
    const dp = Array(capacity + 1).fill(0);
    
    // Process each item
    for (let i = 0; i < n; i++) {
        // Iterate backwards to avoid using same item twice
        for (let w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

/**
 * 0/1 Knapsack that also returns which items were selected.
 * @returns {{maxValue: number, selectedItems: number[]}}
 */
function knapsack01WithItems(values, weights, capacity) {
    const n = values.length;
    
    // dp[i][w] = max value using first i items with capacity w
    const dp = Array.from({ length: n + 1 }, () => 
        Array(capacity + 1).fill(0)
    );
    
    // Track decisions
    const take = Array.from({ length: n + 1 }, () => 
        Array(capacity + 1).fill(false)
    );
    
    // Build the DP table
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            // Don't include item i-1
            dp[i][w] = dp[i - 1][w];
            
            // Include item i-1 if it fits
            if (weights[i - 1] <= w) {
                const includeValue = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                if (includeValue > dp[i - 1][w]) {
                    dp[i][w] = includeValue;
                    take[i][w] = true;
                }
            }
        }
    }
    
    // Backtrack to find selected items
    const selectedItems = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
        if (take[i][w]) {
            selectedItems.push(i - 1);
            w -= weights[i - 1];
        }
    }
    
    return { maxValue: dp[n][capacity], selectedItems };
}


// Example usage and demonstration
const values = [60, 100, 120];
const weights = [10, 20, 30];
const capacity = 50;

console.log("=".repeat(60));
console.log("0/1 Knapsack Problem");
console.log("=".repeat(60));
console.log(`Items: [${values.map((v, i) => `(${v}, ${weights[i]})`).join(', ')}]`);
console.log(`Knapsack capacity: ${capacity}`);
console.log();

// Standard DP approach
const result = knapsack01(values, weights, capacity);
console.log(`Maximum value (2D DP): ${result}`);

// Space-optimized approach
const resultOpt = knapsack01Optimized(values, weights, capacity);
console.log(`Maximum value (1D DP): ${resultOpt}`);

// With item selection
const { maxValue, selectedItems } = knapsack01WithItems(values, weights, capacity);
console.log(`\nSelected items: [${selectedItems.join(', ')}]`);
console.log(`Selected values: [${selectedItems.map(i => values[i]).join(', ')}]`);
console.log(`Total value: ${maxValue}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Standard DP** | O(n × W) | Two nested loops |
| **Space-Optimized** | O(n × W) | Same as standard |
| **Reconstruction** | O(n × W) | Need full table for backtracking |

### Detailed Breakdown

- **Outer loop**: iterates through n items
- **Inner loop**: iterates through W capacities
- **Total**: n × W state transitions

### Complexity Factors

- **n (number of items)**: Typically up to 10³-10⁴
- **W (capacity)**: Typically up to 10⁴-10⁵
- **n × W**: Product determines feasibility

---

## Space Complexity Analysis

| Approach | Space Complexity | Description |
|----------|-----------------|-------------|
| **2D DP Table** | O(n × W) | Stores all subproblem solutions |
| **1D DP Array** | O(W) | Only stores current row |

### Space Optimization Trade-offs

- **2D → 1D**: Reduces space but loses ability to reconstruct solution
- **For reconstruction**: Keep a separate `keep` boolean table

---

## Common Variations

### 1. Unbounded Knapsack

Each item can be used unlimited times.

````carousel
```python
def unbounded_knapsack(values, weights, capacity):
    """
    Unbounded Knapsack - each item can be used multiple times.
    Time: O(n * W), Space: O(W)
    """
    n = len(values)
    dp = [0] * (capacity + 1)
    
    # Iterate forward (not backward) to allow reuse
    for w in range(capacity + 1):
        for i in range(n):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]
```
````

### 2. Minimum Knapsack (Coin Change)

Find minimum items to reach a target value.

````carousel
```python
def min_items_to_reach_target(values, weights, target):
    """
    Minimum items to reach exact value with given weights.
    Similar to coin change (minimum coins).
    """
    W = target
    n = len(values)
    dp = [float('inf')] * (W + 1)
    dp[0] = 0
    
    for i in range(n):
        for w in range(weights[i], W + 1):
            dp[w] = min(dp[w], dp[w - weights[i]] + 1)
    
    return dp[W] if dp[W] != float('inf') else -1
```
````

### 3. Knapsack with Item Weights as Costs

When you want to minimize cost while achieving minimum value threshold.

````carousel
```python
def knapsack_min_cost_for_value(values, weights, min_value):
    """
    Find minimum total weight to achieve at least min_value.
    """
    n = len(values)
    total_value = sum(values)
    W = total_value
    
    # dp[v] = minimum weight to achieve value v
    dp = [float('inf')] * (W + 1)
    dp[0] = 0
    
    for i in range(n):
        for v in range(W, values[i] - 1, -1):
            dp[v] = min(dp[v], dp[v - values[i]] + weights[i])
    
    # Find minimum weight for at least min_value
    result = min(dp[min_value:])
    return result if result != float('inf') else -1
```
````

### 4. Multiple Knapsacks

Multiple knapsacks with equal or different capacities.

### 5. 0/1 Knapsack with Groups

Items are in groups, pick at most one from each group.

---

## Practice Problems

### Problem 1: Classic 0/1 Knapsack

**Problem:** [LeetCode 416 - Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Description:** Given a non-empty array of positive integers, determine if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**How to Apply 0/1 Knapsack:**
- This is a subset sum problem, which is a special case of 0/1 knapsack
- Target sum = total_sum / 2
- Each number can only be used once (0 or 1)
- Use DP where dp[w] = true if sum w is achievable

---

### Problem 2: Bounded Knapsack

**Problem:** [LeetCode 474 - Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes/)

**Description:** Given an array of binary strings, find the maximum number of strings that can be formed with at most m '0's and m '1's.

**How to Apply 0/1 Knapsack:**
- This is a 2-dimensional knapsack problem
- Two constraints: zeros and ones
- Each string has cost (zeros, ones) and value = 1
- Use 2D DP: dp[i][j] = max strings using i zeros and j ones

---

### Problem 3: Value Optimization

**Problem:** [LeetCode 1049 - Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/)

**Description:** Given an array of stone weights, split them into two groups to minimize the difference between the two groups' weights.

**How to Apply 0/1 Knapsack:**
- Total sum S, target = S/2
- Equivalent to finding subset with sum closest to S/2
- This is subset sum (0/1 knapsack variation)
- Answer = S - 2 * (max achievable sum ≤ S/2)

---

### Problem 4: Counting Variations

**Problem:** [LeetCode 494 - Target Sum](https://leetcode.com/problems/target-sum/)

**Description:** You are given an array of integers and a target. You can assign + or - sign to each element. Count the number of ways to get the target.

**How to Apply 0/1 Knapsack:**
- Transform to subset sum problem
- (Sum of positive) - (Sum of negative) = target
- Sum of positive = (target + total_sum) / 2
- Count number of subsets achieving this sum

---

### Problem 5: Space-Constrained Selection

**Problem:** [LeetCode 818 - Race Car](https://leetcode.com/problems/race-car/)

**Description:** Your car has target position. You can accelerate (A) or reverse (R). Find minimum instructions to reach target.

**How to Apply 0/1 Knapsack:**
- Use DP where state represents position
- Each action has cost (instructions) and moves car
- Similar decision-making to knapsack

---

## Video Tutorial Links

### Fundamentals

- [0/1 Knapsack - Introduction (Take U Forward)](https://www.youtube.com/watch?v=bUS_aZtvHB4) - Comprehensive introduction
- [Knapsack Problem Explained (WilliamFiset)](https://www.youtube.com/watch?v=8LusJ5-jhfs) - Detailed explanation with visualizations
- [DP for Beginners (NeetCode)](https://www.youtube.com/watch?v=nqlNzOcnCfs) - Dynamic programming fundamentals

### Implementation Tutorials

- [0/1 Knapsack Code Implementation](https://www.youtube.com/watch?v=oTTzNMHMU7A) - Step-by-step coding
- [Space Optimization Explained](https://www.youtube.com/watch?v=PO5ll7WVzSE) - 2D to 1D DP
- [Knapsack Variations](https://www.youtube.com/watch?v=LawbG3U3j8U) - Common variations

### Advanced Topics

- [Multiple Knapsack](https://www.youtube.com/watch?v=pT m9tO59g) - Multiple capacity constraints
- [DP on Trees + Knapsack](https://www.youtube.com/watch?v=o5XK-7kX8Y) - Tree DP applications
- [Knapsack with Complexity Analysis](https://www.youtube.com/watch?v=YV3EbB3Y7Xk) - Interview-focused

---

## Follow-up Questions

### Q1: What's the difference between 0/1 Knapsack and Unbounded Knapsack?

**Answer:** In 0/1 Knapsack, each item can be used at most once. In Unbounded Knapsack, each item can be used unlimited times. The key difference is in the iteration direction:
- 0/1: Iterate capacity backwards (w → weights[i])
- Unbounded: Iterate capacity forwards (w → capacity)

### Q2: How do you reconstruct the selected items in 0/1 Knapsack?

**Answer:** You have two options:
1. **Maintain a keep table**: Track decisions (keep[i][w] = true if item i is included)
2. **2D DP only**: Use the dp table to backtrack from dp[n][W]

### Q3: What if the capacity W is very large (e.g., 10⁹)?

**Answer:** When n × W is too large, consider:
1. **Meet-in-the-middle**: Split items into two halves, compute all subset possibilities
2. **Greedy approximation**: For fractional knapsack (if fractions allowed)
3. **Pseudo-polynomial**: DP only works when W is reasonably small

### Q4: Can 0/1 Knapsack be solved recursively?

**Answer:** Yes, using memoization:
- Recurrence: `knapsack(i, w) = max(knapsack(i-1, w), knapsack(i-1, w-weight[i]) + value[i])`
- Base case: `i == 0 or w == 0` returns 0
- Time: O(n × W), Space: O(n × W) + O(n) stack

### Q5: How do you handle negative weights or values?

**Answer:** Standard knapsack assumes non-negative values. For negative:
- Shift all values to positive by adding offset
- Use different DP formulation (minimization instead of maximization)
- Or transform the problem conceptually

---

## Summary

The 0/1 Knapsack is a fundamental dynamic programming problem that demonstrates key DP concepts. Key takeaways:

- **Binary choice**: Each item is either taken (1) or not taken (0)
- **Optimal substructure**: Build solutions from smaller subproblems
- **Overlapping subproblems**: Reuse computed results efficiently
- **Two implementations**: 2D DP (O(n×W) space) or 1D DP (O(W) space)
- **Backward iteration**: Critical for space-optimized version to avoid reusing items

When to use:
- ✅ Resource allocation with capacity constraints
- ✅ Binary selection problems
- ✅ Subset optimization problems
- ❌ When items can be used multiple times (use Unbounded Knapsack)
- ❌ When fractions are allowed (use Fractional Knapsack with greedy)

This problem is essential for competitive programming and technical interviews, serving as a foundation for understanding more complex dynamic programming problems.

---

## Related Algorithms

- [Unbounded Knapsack](./unbounded-knapsack.md) - Unlimited item usage
- [Longest Common Subsequence](./lcs.md) - Similar DP approach
- [Coin Change](./coin-change.md) - Unbounded variation
- [Subset Sum](./subset-sum.md) - Special case of knapsack
