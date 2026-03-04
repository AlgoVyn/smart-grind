# Combinations

## Category
Backtracking

## Description

A **combination** is a selection of k elements from a set of n elements where the order doesn't matter. This is a fundamental problem in combinatorics and appears frequently in algorithmic interviews and competitive programming.

For example, choosing 2 elements from {1, 2, 3, 4} gives us: {1,2}, {1,3}, {1,4}, {2,3}, {2,4}, {3,4} — note that {2,1} is the same as {1,2} since order doesn't matter in combinations.

The mathematical notation for the number of ways to choose k elements from n is **C(n,k)** or **"n choose k"**, calculated as:

$$C(n, k) = \frac{n!}{k!(n-k)!}$$

This is also called the **binomial coefficient**.

---

## When to Use

Use the Combinations algorithm when you need to solve problems involving:

- **Generating all possible selections** from a set where order doesn't matter
- **Enumerating all subsets** of a specific size
- **Search-space exploration** where you need to try all possible groupings
- **Optimization problems** requiring evaluation of all combinations
- **Counting problems** involving selections from groups

### Comparison with Related Patterns

| Problem Type | Use Combinations When | Use Permutations When | Use Subset Pattern When |
|--------------|----------------------|----------------------|------------------------|
| **Order matters** | ❌ No | ✅ Yes | N/A |
| **Selecting k from n** | ✅ Yes | ✅ Yes | ❌ No |
| **All elements used** | ❌ No | Sometimes | ✅ Yes |
| **Example** | Choosing committee members | Arranging winners | Power set generation |

### When to Choose Different Approaches

- **Combinations (n choose k)**: When selecting items where {A,B} = {B,A}
  - Example: Choosing lottery numbers, forming teams
  
- **Permutations**: When order matters
  - Example: Ranking winners, arranging seating
  
- **Backtracking for Subsets**: When you need ALL subsets (power set)
  - Example: Generating all possible combinations of toppings

---

## Algorithm Explanation

### Core Concept

The key insight behind generating combinations is **systematic exploration with pruning**. We use **backtracking** to build combinations incrementally, exploring all valid paths while avoiding duplicates.

### How It Works

#### The Backtracking Approach:

1. **Start with an empty combination**
2. **At each position**, try adding each remaining element (in order)
3. **Recurse** to fill the remaining positions
4. **Backtrack** (remove the last element) to try other possibilities
5. **Base case**: When the combination reaches size k, add it to results

#### Why This Avoids Duplicates:

By always passing the **next index** (not the previous index + 1) to the recursive call, we ensure we never revisit elements we've already considered. This creates a tree where:
- Each path represents one unique combination
- No two paths can produce the same set

#### Visual Representation

For n=4, k=2, the recursion tree looks like:

```
Start: []
│
├── Choose 1: [1]
│   ├── Choose 2: [1,2] → ✅ Add to result
│   ├── Choose 3: [1,3] → ✅ Add to result  
│   └── Choose 4: [1,4] → ✅ Add to result
│
├── Choose 2: [2]
│   ├── Choose 3: [2,3] → ✅ Add to result
│   └── Choose 4: [2,4] → ✅ Add to result
│
├── Choose 3: [3]
│   └── Choose 4: [3,4] → ✅ Add to result
│
└── (Choose 4 would be skipped - not enough elements left)
```

### Mathematical Foundation

The algorithm generates exactly C(n,k) combinations because:
- At the first position: n choices
- At the second position: n-1 choices
- ...
- At the kth position: n-k+1 choices

Total paths = n × (n-1) × ... × (n-k+1) / k! = C(n,k)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize** an empty result array and an empty current combination array

2. **Define the recursive helper function** with parameters:
   - `start`: the index to start choosing from
   - `path`: the current combination being built

3. **Check base case**: 
   - If `len(path) == k`, add a copy of `path` to results
   - Return to backtrack

4. **Iterate through available elements**:
   - For each index i from `start` to `n-1`:
     - Add element `i+1` (or `nums[i]`) to `path`
     - Recurse with `i + 1` as the new start
     - Remove the last element from `path` (backtrack)

5. **Optimize with pruning** (optional):
   - Skip branches where not enough elements remain
   - Condition: `n - i >= k - len(path)`

### Key Implementation Details

- **Always make a copy** when adding to result: `result.append(path[:])` in Python
- **Use 1-indexed elements** for classic "combinations from 1 to n" problems
- **Sort input** if there are duplicates, then skip duplicates in the loop

---

## Implementation

### Template Code (Backtracking)

````carousel
```python
from typing import List

def combine(n: int, k: int) -> List[List[int]]:
    """
    Generate all k-combinations from 1 to n.
    
    Time Complexity: O(C(n,k) * k)
    Space Complexity: O(k) for recursion stack + O(C(n,k) * k) for result
    
    Args:
        n: Total number of elements (1 to n)
        k: Size of each combination
    
    Returns:
        List of all k-combinations
    """
    result = []
    
    def backtrack(start: int, path: List[int]) -> None:
        # Base case: combination is complete
        if len(path) == k:
            result.append(path[:])  # Append a copy!
            return
        
        # Pruning: not enough elements left
        # We need (k - len(path)) more elements
        # Available: n - i elements starting from index i
        for i in range(start, n):
            # Check if enough elements remaining
            if n - i < k - len(path):
                break
            
            path.append(i + 1)  # Add element (1-indexed)
            backtrack(i + 1, path)  # Move to next index
            path.pop()  # Backtrack
    
    backtrack(0, [])
    return result


# Example usage
if __name__ == "__main__":
    n, k = 4, 2
    result = combine(n, k)
    print(f"Combinations of {k} from 1 to {n}:")
    for combo in result:
        print(combo)
    # Output: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Generate all k-combinations from 1 to n.
 * 
 * Time Complexity: O(C(n,k) * k)
 * Space Complexity: O(k) for recursion stack + O(C(n,k) * k) for result
 */
class Combinations {
private:
    vector<vector<int>> result;
    int n, k;
    
    void backtrack(int start, vector<int>& path) {
        // Base case: combination is complete
        if (path.size() == k) {
            result.push_back(path);
            return;
        }
        
        // Pruning: optimize by limiting iterations
        for (int i = start; i < n; i++) {
            // Check if enough elements remain
            if (n - i < k - path.size()) break;
            
            path.push_back(i + 1);  // Add element (1-indexed)
            backtrack(i + 1, path); // Recurse
            path.pop_back();        // Backtrack
        }
    }
    
public:
    vector<vector<int>> combine(int n, int k) {
        this->n = n;
        this->k = k;
        result.clear();
        vector<int> path;
        backtrack(0, path);
        return result;
    }
};

int main() {
    Combinations sol;
    int n = 4, k = 2;
    
    vector<vector<int>> result = sol.combine(n, k);
    
    cout << "Combinations of " << k << " from 1 to " << n << ":" << endl;
    for (const auto& combo : result) {
        cout << "[";
        for (int i = 0; i < combo.size(); i++) {
            cout << combo[i] << (i < combo.size() - 1 ? ", " : "");
        }
        cout << "]" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

/**
 * Generate all k-combinations from 1 to n.
 * 
 * Time Complexity: O(C(n,k) * k)
 * Space Complexity: O(k) for recursion stack + O(C(n,k) * k) for result
 */
public class Combinations {
    private List<List<Integer>> result;
    private int n, k;
    
    private void backtrack(int start, List<Integer> path) {
        // Base case: combination is complete
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        // Pruning: optimize by limiting iterations
        for (int i = start; i < n; i++) {
            // Check if enough elements remain
            if (n - i < k - path.size()) break;
            
            path.add(i + 1);  // Add element (1-indexed)
            backtrack(i + 1, path);  // Recurse
            path.remove(path.size() - 1);  // Backtrack
        }
    }
    
    public List<List<Integer>> combine(int n, int k) {
        this.n = n;
        this.k = k;
        this.result = new ArrayList<>();
        backtrack(0, new ArrayList<>());
        return result;
    }
    
    public static void main(String[] args) {
        Combinations sol = new Combinations();
        int n = 4, k = 2;
        
        List<List<Integer>> result = sol.combine(n, k);
        
        System.out.println("Combinations of " + k + " from 1 to " + n + ":");
        for (List<Integer> combo : result) {
            System.out.println(combo);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Generate all k-combinations from 1 to n.
 * 
 * Time Complexity: O(C(n,k) * k)
 * Space Complexity: O(k) for recursion stack + O(C(n,k) * k) for result
 * 
 * @param {number} n - Total number of elements (1 to n)
 * @param {number} k - Size of each combination
 * @returns {number[][]} - List of all k-combinations
 */
function combine(n, k) {
    const result = [];
    
    /**
     * Backtracking helper function
     * @param {number} start - Starting index
     * @param {number[]} path - Current combination
     */
    function backtrack(start, path) {
        // Base case: combination is complete
        if (path.length === k) {
            result.push([...path]);  // Push a copy
            return;
        }
        
        // Pruning: optimize by limiting iterations
        for (let i = start; i < n; i++) {
            // Check if enough elements remain
            if (n - i < k - path.length) break;
            
            path.push(i + 1);  // Add element (1-indexed)
            backtrack(i + 1, path);  // Recurse
            path.pop();  // Backtrack
        }
    }
    
    backtrack(0, []);
    return result;
}

// Example usage
const n = 4, k = 2;
const result = combine(n, k);

console.log(`Combinations of ${k} from 1 to ${n}:`);
result.forEach(combo => console.log(JSON.stringify(combo)));
// Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
```
````

---

### Handling Duplicates (Important Variation)

When the input contains duplicate elements, we need to handle them carefully:

````carousel
```python
from typing import List

def combine_with_duplicates(nums: List[int], k: int) -> List[List[int]]:
    """
    Generate all unique k-combinations from array with duplicates.
    
    Key: Sort first, then skip duplicates during iteration.
    """
    nums.sort()  # Sort to group duplicates
    result = []
    
    def backtrack(start: int, path: List[int]) -> None:
        if len(path) == k:
            result.append(path[:])
            return
        
        for i in range(start, len(nums)):
            # Skip duplicates: if this is same as previous, skip
            if i > start and nums[i] == nums[i - 1]:
                continue
            
            # Pruning: not enough elements
            if len(nums) - i < k - len(path):
                break
            
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result


# Example
if __name__ == "__main__":
    nums = [1, 2, 2, 3, 3]
    k = 3
    result = combine_with_duplicates(nums, k)
    print(f"Unique combinations of {k} from {nums}:")
    for combo in result:
        print(combo)
    # Output: [[1,2,2], [1,2,3], [1,3,3], [2,2,3], [2,3,3]]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class CombinationsWithDuplicates {
private:
    vector<vector<int>> result;
    
    void backtrack(vector<int>& nums, int start, vector<int>& path, int k) {
        if (path.size() == k) {
            result.push_back(path);
            return;
        }
        
        for (int i = start; i < nums.size(); i++) {
            // Skip duplicates
            if (i > start && nums[i] == nums[i - 1]) continue;
            
            // Pruning
            if (nums.size() - i < k - path.size()) break;
            
            path.push_back(nums[i]);
            backtrack(nums, i + 1, path, k);
            path.pop_back();
        }
    }
    
public:
    vector<vector<int>> combine(vector<int> nums, int k) {
        sort(nums.begin(), nums.end());
        result.clear();
        vector<int> path;
        backtrack(nums, 0, path, k);
        return result;
    }
};

int main() {
    CombinationsWithDuplicates sol;
    vector<int> nums = {1, 2, 2, 3, 3};
    int k = 3;
    
    auto result = sol.combine(nums, k);
    cout << "Unique combinations of " << k << " from array:" << endl;
    for (const auto& combo : result) {
        cout << "[";
        for (int i = 0; i < combo.size(); i++) {
            cout << combo[i] << (i < combo.size() - 1 ? ", " : "");
        }
        cout << "]" << endl;
    }
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationsWithDuplicates {
    private List<List<Integer>> result;
    
    private void backtrack(int[] nums, int start, List<Integer> path, int k) {
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        
        for (int i = start; i < nums.length; i++) {
            // Skip duplicates
            if (i > start && nums[i] == nums[i - 1]) continue;
            
            // Pruning
            if (nums.length - i < k - path.size()) break;
            
            path.add(nums[i]);
            backtrack(nums, i + 1, path, k);
            path.remove(path.size() - 1);
        }
    }
    
    public List<List<Integer>> combine(int[] nums, int k) {
        Arrays.sort(nums);
        result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), k);
        return result;
    }
    
    public static void main(String[] args) {
        CombinationsWithDuplicates sol = new CombinationsWithDuplicates();
        int[] nums = {1, 2, 2, 3, 3};
        int k = 3;
        
        List<List<Integer>> result = sol.combine(nums, k);
        System.out.println("Unique combinations of " + k + " from array:");
        for (List<Integer> combo : result) {
            System.out.println(combo);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Generate all unique k-combinations from array with duplicates
 * @param {number[]} nums - Input array with duplicates
 * @param {number} k - Size of each combination
 * @returns {number[][]} - List of unique combinations
 */
function combineWithDuplicates(nums, k) {
    nums.sort((a, b) => a - b);  // Sort to group duplicates
    const result = [];
    
    function backtrack(start, path) {
        if (path.length === k) {
            result.push([...path]);
            return;
        }
        
        for (let i = start; i < nums.length; i++) {
            // Skip duplicates
            if (i > start && nums[i] === nums[i - 1]) continue;
            
            // Pruning
            if (nums.length - i < k - path.length) break;
            
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}

// Example
const nums = [1, 2, 2, 3, 3];
const k = 3;
const result = combineWithDuplicates(nums, k);
console.log(`Unique combinations of ${k} from [${nums}]:`);
result.forEach(combo => console.log(JSON.stringify(combo)));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Generating all combinations** | O(C(n,k) × k) | Must visit each combination, each takes O(k) to copy |
| **Recursive calls** | O(C(n,k)) | Each unique combination triggers one base case |
| **Backtracking overhead** | O(n) per path | Tree depth is at most k |

### Detailed Breakdown

- **C(n,k) combinations** are generated, where C(n,k) = n! / (k!(n-k)!)
- **Each combination takes O(k)** to copy into the result array
- **Total**: O(C(n,k) × k)

### Examples

| n | k | C(n,k) | Total Operations |
|---|---|--------|------------------|
| 4 | 2 | 6 | 12 |
| 10 | 3 | 120 | 360 |
| 20 | 10 | 184,756 | 1,847,560 |
| 30 | 15 | 155,117,520 | 2.3 billion |

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Recursion stack** | O(k) | Maximum depth of recursion tree |
| **Current path** | O(k) | Stores current combination |
| **Result storage** | O(C(n,k) × k) | Stores all combinations |
| **Total** | O(C(n,k) × k) | Dominated by result storage |

### Space Optimization

If you only need to **process** combinations one at a time (not store all):

- **Iterative approach**: Use mathematical formula to generate next combination
- **Memory**: O(k) only
- **Use case**: When memory is limited or combinations are too many to store

---

## Common Variations

### 1. Iterative Combination Generation

Generate combinations mathematically without recursion:

````carousel
```python
def combine_iterative(n, k):
    """
    Iterative approach using lexicographic ordering.
    Next combination: find rightmost element that can be incremented.
    """
    result = []
    combo = list(range(1, k + 1))  # First combination: [1, 2, ..., k]
    
    while True:
        result.append(combo[:])
        
        # Find rightmost element that can be incremented
        i = k - 1
        while i >= 0 and combo[i] == n - k + i + 1:
            i -= 1
        
        if i < 0:
            break  # All combinations generated
        
        # Increment this element and reset subsequent ones
        combo[i] += 1
        for j in range(i + 1, k):
            combo[j] = combo[j - 1] + 1
    
    return result
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<vector<int>> combineIterative(int n, int k) {
    vector<vector<int>> result;
    vector<int> combo(k);
    
    // First combination: [1, 2, ..., k]
    for (int i = 0; i < k; i++) {
        combo[i] = i + 1;
    }
    
    while (true) {
        result.push_back(combo);
        
        // Find rightmost element that can be incremented
        int i = k - 1;
        while (i >= 0 && combo[i] == n - k + i + 1) {
            i--;
        }
        
        if (i < 0) break;  // All combinations generated
        
        // Increment and reset subsequent
        combo[i]++;
        for (int j = i + 1; j < k; j++) {
            combo[j] = combo[j - 1] + 1;
        }
    }
    
    return result;
}

int main() {
    int n = 4, k = 2;
    auto result = combineIterative(n, k);
    
    cout << "Combinations of " << k << " from 1 to " << n << ":" << endl;
    for (const auto& combo : result) {
        cout << "[" << combo[0] << ", " << combo[1] << "]" << endl;
    }
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

public class IterativeCombinations {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        int[] combo = new int[k];
        
        // First combination: [1, 2, ..., k]
        for (int i = 0; i < k; i++) {
            combo[i] = i + 1;
        }
        
        while (true) {
            // Add current combination
            List<Integer> current = new ArrayList<>();
            for (int num : combo) current.add(num);
            result.add(current);
            
            // Find rightmost element that can be incremented
            int i = k - 1;
            while (i >= 0 && combo[i] == n - k + i + 1) {
                i--;
            }
            
            if (i < 0) break;  // All combinations generated
            
            // Increment and reset subsequent
            combo[i]++;
            for (int j = i + 1; j < k; j++) {
                combo[j] = combo[j - 1] + 1;
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
function combineIterative(n, k) {
    const result = [];
    const combo = Array.from({ length: k }, (_, i) => i + 1);
    
    while (true) {
        result.push([...combo]);
        
        // Find rightmost element that can be incremented
        let i = k - 1;
        while (i >= 0 && combo[i] === n - k + i + 1) {
            i--;
        }
        
        if (i < 0) break;
        
        // Increment and reset subsequent
        combo[i]++;
        for (let j = i + 1; j < k; j++) {
            combo[j] = combo[j - 1] + 1;
        }
    }
    
    return result;
}
```
````

### 2. Combination Sum (Unlimited Elements)

Find all combinations that sum to a target (elements can be reused):

````carousel
```python
def combination_sum(candidates: list, target: int) -> list:
    """
    Find all unique combinations that sum to target.
    Each number may be used unlimited times.
    """
    result = []
    candidates.sort()  # Sort for pruning
    
    def backtrack(start: int, target: int, path: list):
        if target == 0:
            result.append(path[:])
            return
        if target < 0:
            return
        
        for i in range(start, len(candidates)):
            # Pruning: if current is too big, all subsequent are too big
            if candidates[i] > target:
                break
            
            path.append(candidates[i])
            backtrack(i, target - candidates[i], path)  # i, not i+1 (can reuse)
            path.pop()
    
    backtrack(0, target, [])
    return result
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class CombinationSum {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> path;
        sort(candidates.begin(), candidates.end());
        backtrack(candidates, 0, target, path, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& candidates, int start, int target, 
                   vector<int>& path, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(path);
            return;
        }
        if (target < 0) return;
        
        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > target) break;
            path.push_back(candidates[i]);
            backtrack(candidates, i, target - candidates[i], path, result);
            path.pop_back();
        }
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, int target,
                          List<Integer> path, List<List<Integer>> result) {
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        if (target < 0) return;
        
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > target) break;
            path.add(candidates[i]);
            backtrack(candidates, i, target - candidates[i], path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
function combinationSum(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    
    function backtrack(start, target, path) {
        if (target === 0) {
            result.push([...path]);
            return;
        }
        if (target < 0) return;
        
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > target) break;
            path.push(candidates[i]);
            backtrack(i, target - candidates[i], path);
            path.pop();
        }
    }
    
    backtrack(0, target, []);
    return result;
}
```
````

### 3. Combination Sum II (Each Element Once)

Find all unique combinations that sum to target (each element used once):

````carousel
```python
def combination_sum2(candidates: list, target: int) -> list:
    """
    Find all unique combinations that sum to target.
    Each number can be used at most once.
    """
    result = []
    candidates.sort()  # Sort to handle duplicates
    
    def backtrack(start: int, target: int, path: list):
        if target == 0:
            result.append(path[:])
            return
        if target < 0:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates at same level
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            
            if candidates[i] > target:
                break
            
            path.append(candidates[i])
            backtrack(i + 1, target - candidates[i], path)  # i+1, not reuse
            path.pop()
    
    backtrack(0, target, [])
    return result
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class CombinationSum2 {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        vector<vector<int>> result;
        vector<int> path;
        sort(candidates.begin(), candidates.end());
        backtrack(candidates, 0, target, path, result);
        return result;
    }
    
private:
    void backtrack(vector<int>& candidates, int start, int target,
                   vector<int>& path, vector<vector<int>>& result) {
        if (target == 0) {
            result.push_back(path);
            return;
        }
        if (target < 0) return;
        
        for (int i = start; i < candidates.size(); i++) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            if (candidates[i] > target) break;
            
            path.push_back(candidates[i]);
            backtrack(candidates, i + 1, target - candidates[i], path, result);
            path.pop_back();
        }
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CombinationSum2 {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(candidates, 0, target, new ArrayList<>(), result);
        return result;
    }
    
    private void backtrack(int[] candidates, int start, int target,
                          List<Integer> path, List<List<Integer>> result) {
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }
        if (target < 0) return;
        
        for (int i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            if (candidates[i] > target) break;
            
            path.add(candidates[i]);
            backtrack(candidates, i + 1, target - candidates[i], path, result);
            path.remove(path.size() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    const result = [];
    
    function backtrack(start, target, path) {
        if (target === 0) {
            result.push([...path]);
            return;
        }
        if (target < 0) return;
        
        for (let i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            if (candidates[i] > target) break;
            
            path.push(candidates[i]);
            backtrack(i + 1, target - candidates[i], path);
            path.pop();
        }
    }
    
    backtrack(0, target, []);
    return result;
}
```
````

### 4. Letter Combinations of Phone Number

Classic problem using combinations pattern:

````carousel
```python
def letter_combinations(digits: str) -> list:
    """
    Given digits 2-9, return all possible letter combinations.
    Similar to generating combinations from multiple sets.
    """
    if not digits:
        return []
    
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(index: int, path: list):
        if index == len(digits):
            result.append(''.join(path))
            return
        
        letters = mapping[digits[index]]
        for letter in letters:
            path.append(letter)
            backtrack(index + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
using namespace std;

class LetterCombinations {
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        
        mapping = {
            {'2', "abc"}, {'3', "def"}, {'4', "ghi"}, {'5', "jkl"},
            {'6', "mno"}, {'7', "pqrs"}, {'8', "tuv"}, {'9', "wxyz"}
        };
        
        vector<string> result;
        string path;
        backtrack(digits, 0, path, result);
        return result;
    }
    
private:
    unordered_map<char, string> mapping;
    
    void backtrack(const string& digits, int index, string& path, vector<string>& result) {
        if (index == digits.size()) {
            result.push_back(path);
            return;
        }
        
        string letters = mapping[digits[index]];
        for (char letter : letters) {
            path.push_back(letter);
            backtrack(digits, index + 1, path, result);
            path.pop_back();
        }
    }
};
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class LetterCombinations {
    private static final Map<Character, String> mapping = new HashMap<>();
    static {
        mapping.put('2', "abc");
        mapping.put('3', "def");
        mapping.put('4', "ghi");
        mapping.put('5', "jkl");
        mapping.put('6', "mno");
        mapping.put('7', "pqrs");
        mapping.put('8', "tuv");
        mapping.put('9', "wxyz");
    }
    
    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits == null || digits.isEmpty()) return result;
        
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }
    
    private void backtrack(String digits, int index, StringBuilder path, List<String> result) {
        if (index == digits.length()) {
            result.add(path.toString());
            return;
        }
        
        String letters = mapping.get(digits.charAt(index));
        for (char letter : letters.toCharArray()) {
            path.append(letter);
            backtrack(digits, index + 1, path, result);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

<!-- slide -->
```javascript
function letterCombinations(digits) {
    if (!digits) return [];
    
    const mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
    
    const result = [];
    
    function backtrack(index, path) {
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }
        
        const letters = mapping[digits[index]];
        for (const letter of letters) {
            path.push(letter);
            backtrack(index + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}
```
````

---

## Practice Problems

### Problem 1: Combinations

**Problem:** [LeetCode 77 - Combinations](https://leetcode.com/problems/combinations/)

**Description:** Given two integers n and k, return all possible combinations of k numbers chosen from 1 to n.

**How to Apply This Technique:**
- This is the classic combinations problem
- Use the backtracking template directly
- Start with empty path, try adding elements from 1 to n
- Ensure each combination is sorted (handled by backtracking order)

---

### Problem 2: Subsets

**Problem:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

**Description:** Given an integer array nums of unique elements, return all possible subsets (the power set).

**How to Apply This Technique:**
- Similar to combinations, but generate ALL sizes (0 to n)
- At each index, we have two choices: include or exclude current element
- This creates 2^n subsets

---

### Problem 3: Combination Sum

**Problem:** [LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

**Description:** Given an array of distinct integers candidates and a target integer, return all unique combinations where the chosen numbers sum to target. Each number may be chosen unlimited times.

**How to Apply This Technique:**
- Use backtracking with modification: pass `i` instead of `i+1` to allow reuse
- Sort candidates first for pruning (if candidates[i] > target, break)
- Important: Make a copy when adding to result

---

### Problem 4: Combination Sum II

**Problem:** [LeetCode 40 - Combination Sum II](https://leetcode.com/problems/combination-sum-ii/)

**Description:** Given a collection of candidate numbers and a target, find all unique combinations where the candidate numbers sum to target. Each number may be used once.

**How to Apply This Technique:**
- Sort candidates to handle duplicates
- Skip duplicates at same recursion level
- Pass `i+1` to prevent reusing same element
- Apply pruning: if candidates[i] > remaining target, break

---

### Problem 5: Letter Combinations of a Phone Number

**Problem:** [LeetCode 17 - Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/)

**Description:** Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.

**How to Apply This Technique:**
- Classic backtracking problem similar to combinations
- At each digit position, try all possible letters
- Recurse to next digit position
- Base case: when index equals digits length

---

## Video Tutorial Links

### Fundamentals

- [Combinations - Backtracking Pattern (NeetCode)](https://www.youtube.com/watch?v=q0s6m7AiM7w) - Clear explanation of backtracking approach
- [LeetCode 77 Combinations Explained (Tech With Nikola)](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Step-by-step solution walkthrough
- [Backtracking Algorithm - Combination Pattern (Back To Back SWE)](https://www.youtube.com/watch?v=DKC2sStG3-U) - Deep dive into backtracking patterns

### Related Topics

- [Subsets Problem - Power Set Generation (NeetCode)](https://www.youtube.com/watch?v=REOH22Xwdkk) - Understanding the subsets variation
- [Combination Sum (NeetCode)](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Unlimited reuse variations
- [Permutations vs Combinations (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=77N5K-8hpfM) - Understanding the difference

### Advanced

- [Optimizing Backtracking with Pruning](https://www.youtube.com/watch?v=Zq4upTEaIog) - Pruning techniques explained
- [Handling Duplicates in Backtracking](https://www.youtube.com/watch?v=0OghtN5M6lc) - Skip duplicates technique

---

## Follow-up Questions

### Q1: How does the backtracking approach avoid generating duplicate combinations?

**Answer:** The backtracking approach naturally avoids duplicates by:
1. **Always processing elements in order**: We only consider elements from index `start` onwards
2. **Incrementing start in recursion**: After choosing element at index i, next call uses `i+1`
3. **No backward movement**: Once we move past an element, we never return to it

This creates a tree where each unique path corresponds to exactly one combination.

---

### Q2: What is the difference between combinations and permutations?

**Answer:** 

| Aspect | Combinations | Permutations |
|--------|--------------|---------------|
| **Order** | Doesn't matter | Matters |
| **Notation** | C(n,k) or nCk | P(n,k) or nPk |
| **Formula** | n! / (k!(n-k)!) | n! / (n-k)! |
| **Example** | {1,2} = {2,1} | [1,2] ≠ [2,1] |
| **Use case** | Selecting team members | Arranging winners |

In code: permutations need a `used` array, combinations just need a `start` index.

---

### Q3: How do you handle the "out of memory" problem for large C(n,k)?

**Answer:** Several strategies:

1. **Process one at a time**: Use iterative generator pattern, don't store all
2. **Lazy evaluation**: Yield combinations instead of returning list
3. **Pruning**: Add more aggressive pruning conditions
4. **Iterative formula**: Use mathematical approach to generate next without recursion
5. **Streaming**: Process and consume combinations immediately

---

### Q4: Why do we make a copy when adding to result?

**Answer:** In Python (and similar in other languages), we add `path[:]` or `path.copy()` because:

- `path` is a **reference** to the list
- If we add `path` directly, all entries in `result` would point to the same list
- At the end, `result` would contain multiple copies of the final state of `path`

Example of the bug:
```python
# Wrong!
result.append(path)  # All entries point to same list

# Correct!
result.append(path[:])  # Copy of current state
```

---

### Q5: Can you generate combinations using iteration instead of recursion?

**Answer:** Yes! The iterative approach uses **lexicographic ordering**:

1. Start with first combination: [1, 2, ..., k]
2. To get next combination:
   - Find rightmost element that can be incremented
   - Increment it
   - Reset all following elements to be consecutive

This is more memory-efficient (O(k) instead of O(k) recursion stack) but conceptually more complex.

---

## Summary

The Combinations algorithm using **backtracking** is a fundamental technique for generating all k-selections from n elements. Key takeaways:

- **Backtracking pattern**: Build incrementally, recurse, then backtrack
- **Avoid duplicates**: Always process elements in sorted order with increasing indices
- **Time complexity**: O(C(n,k) × k) - must generate all combinations
- **Space complexity**: O(k) for recursion + O(C(n,k) × k) for storage
- **Pruning**: Skip branches where not enough elements remain

When to use:
- ✅ Problems requiring enumeration of all selections
- ✅ Combination sum and subset problems
- ✅ When you need to try all possible groupings
- ❌ When order matters (use permutations instead)
- ❌ When you need only count, not enumerate (use mathematical formula)

Master this pattern because it forms the foundation for many backtracking problems in technical interviews!

---

## Related Algorithms

- [Permutations](./permutations.md) - When order matters
- [Subset Generation](./subsets.md) - Generate all subsets (power set)
- [Combination Sum](./combination-sum.md) - Sum to target with combinations
- [Backtracking Template](./backtracking.md) - General backtracking patterns
