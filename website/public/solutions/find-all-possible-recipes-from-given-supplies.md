# Find All Possible Recipes From Given Supplies

## Problem Description

You have information about n different recipes. You are given a string array recipes and a 2D string array ingredients. The ith recipe has the name recipes[i], and you can create it if you have all the needed ingredients from ingredients[i]. A recipe can also be an ingredient for other recipes, i.e., ingredients[i] may contain a string that is in recipes.

You are also given a string array supplies containing all the ingredients that you initially have, and you have an infinite supply of all of them.

Return a list of all the recipes that you can create. You may return the answer in any order.

Note that two recipes may contain each other in their ingredients.

**LeetCode Link:** [Find All Possible Recipes From Given Supplies - LeetCode 2115](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/)

---

## Examples

### Example 1

**Input:**
```python
recipes = ["bread"]
ingredients = [["yeast","flour"]]
supplies = ["yeast","flour","corn"]
```

**Output:**
```python
["bread"]
```

**Explanation:**
We can create "bread" since we have the ingredients "yeast" and "flour".

---

### Example 2

**Input:**
```python
recipes = ["bread","sandwich"]
ingredients = [["yeast","flour"],["bread","meat"]]
supplies = ["yeast","flour","meat"]
```

**Output:**
```python
["bread","sandwich"]
```

**Explanation:**
We can create "bread" since we have the ingredients "yeast" and "flour".
We can create "sandwich" since we have the ingredient "meat" and can create the ingredient "bread".

---

### Example 3

**Input:**
```python
recipes = ["bread","sandwich","burger"]
ingredients = [["yeast","flour"],["bread","meat"],["sandwich","meat","bread"]]
supplies = ["yeast","flour","meat"]
```

**Output:**
```python
["bread","sandwich","burger"]
```

**Explanation:**
We can create "bread" since we have the ingredients "yeast" and "flour".
We can create "sandwich" since we have the ingredient "meat" and can create the ingredient "bread".
We can create "burger" since we have the ingredient "meat" and can create the ingredients "bread" and "sandwich".

---

## Constraints

- `n == recipes.length == ingredients.length`
- `1 <= n <= 100`
- `1 <= ingredients[i].length, supplies.length <= 100`
- `1 <= recipes[i].length, ingredients[i][j].length, supplies[k].length <= 10`
- `recipes[i], ingredients[i][j], and supplies[k]` consist only of lowercase English letters.
- All the values of recipes and supplies combined are unique.
- Each `ingredients[i]` does not contain any duplicate values.

---

## Pattern: Topological Sort (BFS)

This problem uses **Topological Sort** (Kahn's algorithm) modeled as a graph problem. The key insight is that recipes and ingredients form a dependency graph where supplies have indegree 0. We process items in topological order, treating supplies as starting nodes.

---

## Intuition

The problem can be modeled as a dependency graph where:
- Nodes represent both recipes and ingredients
- Edges represent "dependency" - if recipe A needs ingredient B, there's an edge from B to A

### Key Observations

1. **Supplies as Starting Points**: Supplies are ingredients we already have, so they have "indegree 0" - nothing needs to be satisfied first.

2. **Recipe Dependencies**: A recipe can be made when all its ingredient dependencies are satisfied (i.e., we have those ingredients either as supplies or as completed recipes).

3. **Graph Direction**: Build the graph from ingredient → recipe (if an ingredient is also a recipe, it points to recipes that depend on it).

4. **Topological Order**: Process items in topological order - when we "produce" something, we reduce the indegree of recipes that depend on it.

5. **Cycles**: Recipes involved in cycles cannot be produced because their dependencies never become fully satisfied.

### Algorithm Overview

1. Create a set of supplies for O(1) lookup
2. Build an indegree map for all recipes
3. Build a graph: ingredient → recipes that depend on it
4. Start BFS with all supplies in the queue
5. Process each item: if it's a recipe, add to result
6. Reduce indegree of dependent recipes; add to queue when indegree becomes 0

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Topological Sort (BFS)** - Optimal solution using Kahn's algorithm
2. **DFS with Memoization** - Alternative recursive approach

---

## Approach 1: Topological Sort (BFS) - Optimal

### Algorithm Steps

1. Create a set of supplies for quick lookup
2. Initialize indegree for all recipes to their ingredient count
3. Build graph: if an ingredient is also a recipe, add edge from ingredient to recipe
4. Start with supplies in the queue
5. Process each item: if recipe, add to result
6. For each dependent recipe, decrement indegree; add to queue when 0

### Why It Works

This is a classic topological sort problem. By treating supplies as nodes with indegree 0, we can process the dependency graph in topological order. When we "produce" an item (supply or recipe), we can satisfy dependencies for other recipes.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque, defaultdict

class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        """
        Find all recipes that can be made using topological sort.
        
        Time Complexity: O(N + E) where N is number of recipes and E is total ingredients
        Space Complexity: O(N + E) for graph, indegree map, and queue
        
        Args:
            recipes: List of recipe names
            ingredients: List of ingredient lists for each recipe
            supplies: List of available supplies
            
        Returns:
            List of recipes that can be created
        """
        # Create a set for quick lookup of supplies
        supply_set = set(supplies)
        
        # Create indegree map for recipes
        indegree = {}
        for recipe in recipes:
            indegree[recipe] = 0
        
        # Create graph: ingredient -> list of recipes that depend on it
        graph = defaultdict(list)
        for i, recipe in enumerate(recipes):
            indegree[recipe] = len(ingredients[i])
            for ing in ingredients[i]:
                if ing in indegree:  # if ing is a recipe
                    graph[ing].append(recipe)
        
        # Queue for BFS, start with supplies
        queue = deque(supplies)
        result = []
        
        while queue:
            item = queue.popleft()
            
            # If this item is a recipe, we can create it
            if item in indegree:
                result.append(item)
            
            # Now, reduce indegree for recipes that depend on this item
            if item in graph:
                for rec in graph[item]:
                    indegree[rec] -= 1
                    if indegree[rec] == 0:
                        queue.append(rec)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    vector<string> findAllRecipes(vector<string>& recipes, 
                                   vector<vector<string>>& ingredients, 
                                   vector<string>& supplies) {
        // Create a set for quick lookup of supplies
        unordered_set<string> supplySet(supplies.begin(), supplies.end());
        
        // Create indegree map for recipes
        unordered_map<string, int> indegree;
        for (const string& recipe : recipes) {
            indegree[recipe] = 0;
        }
        
        // Create graph: ingredient -> list of recipes that depend on it
        unordered_map<string, vector<string>> graph;
        for (size_t i = 0; i < recipes.size(); i++) {
            indegree[recipes[i]] = ingredients[i].size();
            for (const string& ing : ingredients[i]) {
                if (indegree.find(ing) != indegree.end()) {  // if ing is a recipe
                    graph[ing].push_back(recipes[i]);
                }
            }
        }
        
        // Queue for BFS, start with supplies
        queue<string> q;
        for (const string& supply : supplies) {
            q.push(supply);
        }
        
        vector<string> result;
        
        while (!q.empty()) {
            string item = q.front();
            q.pop();
            
            // If this item is a recipe, we can create it
            if (indegree.find(item) != indegree.end()) {
                result.push_back(item);
            }
            
            // Reduce indegree for recipes that depend on this item
            if (graph.find(item) != graph.end()) {
                for (const string& rec : graph[item]) {
                    indegree[rec]--;
                    if (indegree[rec] == 0) {
                        q.push(rec);
                    }
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<String> findAllRecipes(String[] recipes, 
                                       String[][] ingredients, 
                                       String[] supplies) {
        // Create a set for quick lookup of supplies
        Set<String> supplySet = new HashSet<>(Arrays.asList(supplies));
        
        // Create indegree map for recipes
        Map<String, Integer> indegree = new HashMap<>();
        for (String recipe : recipes) {
            indegree.put(recipe, 0);
        }
        
        // Create graph: ingredient -> list of recipes that depend on it
        Map<String, List<String>> graph = new HashMap<>();
        for (int i = 0; i < recipes.length; i++) {
            indegree.put(recipes[i], ingredients[i].length);
            for (String ing : ingredients[i]) {
                if (indegree.containsKey(ing)) {  // if ing is a recipe
                    graph.computeIfAbsent(ing, k -> new ArrayList<>()).add(recipes[i]);
                }
            }
        }
        
        // Queue for BFS, start with supplies
        Queue<String> queue = new LinkedList<>(Arrays.asList(supplies));
        List<String> result = new ArrayList<>();
        
        while (!queue.isEmpty()) {
            String item = queue.poll();
            
            // If this item is a recipe, we can create it
            if (indegree.containsKey(item)) {
                result.add(item);
            }
            
            // Reduce indegree for recipes that depend on this item
            if (graph.containsKey(item)) {
                for (String rec : graph.get(item)) {
                    indegree.put(rec, indegree.get(rec) - 1);
                    if (indegree.get(rec) == 0) {
                        queue.add(rec);
                    }
                }
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} recipes
 * @param {string[][]} ingredients
 * @param {string[]} supplies
 * @return {string[]}
 */
var findAllRecipes = function(recipes, ingredients, supplies) {
    // Create a set for quick lookup of supplies
    const supplySet = new Set(supplies);
    
    // Create indegree map for recipes
    const indegree = {};
    for (const recipe of recipes) {
        indegree[recipe] = 0;
    }
    
    // Create graph: ingredient -> list of recipes that depend on it
    const graph = {};
    for (let i = 0; i < recipes.length; i++) {
        indegree[recipes[i]] = ingredients[i].length;
        for (const ing of ingredients[i]) {
            if (ing in indegree) {  // if ing is a recipe
                if (!graph[ing]) graph[ing] = [];
                graph[ing].push(recipes[i]);
            }
        }
    }
    
    // Queue for BFS, start with supplies
    const queue = [...supplies];
    const result = [];
    
    while (queue.length > 0) {
        const item = queue.shift();
        
        // If this item is a recipe, we can create it
        if (item in indegree) {
            result.push(item);
        }
        
        // Reduce indegree for recipes that depend on this item
        if (graph[item]) {
            for (const rec of graph[item]) {
                indegree[rec]--;
                if (indegree[rec] === 0) {
                    queue.push(rec);
                }
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N + E) where N is number of recipes and E is total number of ingredients |
| **Space** | O(N + E) for the graph, indegree map, queue, and result |

---

## Approach 2: DFS with Memoization

### Algorithm Steps

1. Build a recipe-to-ingredients map
2. Use DFS to check if each recipe can be made
3. Memoize results to avoid recomputation
4. Track visited nodes to handle cycles

### Why It Works

We can think of this recursively: a recipe can be made if all its ingredients can be made. By memoizing results, we avoid redundant computation.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        """
        Find all recipes using DFS with memoization.
        """
        supply_set = set(supplies)
        
        # Build recipe to ingredients map
        recipe_ing = {}
        for i, recipe in enumerate(recipes):
            recipe_ing[recipe] = set(ingredients[i])
        
        # Memoization and visited sets
        can_make = {}  # recipe -> bool
        visiting = set()  # for cycle detection
        
        def can_make_recipe(item):
            # Already computed
            if item in can_make:
                return can_make[item]
            
            # Already visited (cycle)
            if item in visiting:
                return False
            
            # It's a supply
            if item in supply_set:
                can_make[item] = True
                return True
            
            # Not a recipe we know
            if item not in recipe_ing:
                can_make[item] = False
                return False
            
            # DFS
            visiting.add(item)
            for ing in recipe_ing[item]:
                if not can_make_recipe(ing):
                    visiting.remove(item)
                    can_make[item] = False
                    return False
            
            visiting.remove(item)
            can_make[item] = True
            return True
        
        result = []
        for recipe in recipes:
            if can_make_recipe(recipe):
                result.append(recipe)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class Solution {
private:
    unordered_set<string> supplySet;
    unordered_map<string, vector<string>> recipeIng;
    unordered_map<string, bool> memo;
    unordered_set<string> visiting;
    
    bool canMake(const string& item) {
        if (memo.find(item) != memo.end()) return memo[item];
        if (visiting.find(item) != visiting.end()) return false;
        if (supplySet.find(item) != supplySet.end()) return memo[item] = true;
        if (recipeIng.find(item) == recipeIng.end()) return memo[item] = false;
        
        visiting.insert(item);
        for (const string& ing : recipeIng[item]) {
            if (!canMake(ing)) {
                visiting.erase(item);
                return memo[item] = false;
            }
        }
        visiting.erase(item);
        return memo[item] = true;
    }
    
public:
    vector<string> findAllRecipes(vector<string>& recipes, 
                                   vector<vector<string>>& ingredients, 
                                   vector<string>& supplies) {
        supplySet = unordered_set<string>(supplies.begin(), supplies.end());
        
        for (size_t i = 0; i < recipes.size(); i++) {
            recipeIng[recipes[i]] = ingredients[i];
        }
        
        vector<string> result;
        for (const string& recipe : recipes) {
            if (canMake(recipe)) {
                result.push_back(recipe);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Set<String> supplySet;
    private Map<String, List<String>> recipeIng;
    private Map<String, Boolean> memo;
    private Set<String> visiting;
    
    private boolean canMake(String item) {
        if (memo.containsKey(item)) return memo.get(item);
        if (visiting.contains(item)) return false;
        if (supplySet.contains(item)) {
            memo.put(item, true);
            return true;
        }
        if (!recipeIng.containsKey(item)) {
            memo.put(item, false);
            return false;
        }
        
        visiting.add(item);
        for (String ing : recipeIng.get(item)) {
            if (!canMake(ing)) {
                visiting.remove(item);
                memo.put(item, false);
                return false;
            }
        }
        visiting.remove(item);
        memo.put(item, true);
        return true;
    }
    
    public List<String> findAllRecipes(String[] recipes, 
                                       String[][] ingredients, 
                                       String[] supplies) {
        supplySet = new HashSet<>(Arrays.asList(supplies));
        
        recipeIng = new HashMap<>();
        for (int i = 0; i < recipes.length; i++) {
            recipeIng.put(recipes[i], Arrays.asList(ingredients[i]));
        }
        
        memo = new HashMap<>();
        visiting = new HashSet<>();
        
        List<String> result = new ArrayList<>();
        for (String recipe : recipes) {
            if (canMake(recipe)) {
                result.add(recipe);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} recipes
 * @param {string[][]} ingredients
 * @param {string[]} supplies
 * @return {string[]}
 */
var findAllRecipes = function(recipes, ingredients, supplies) {
    const supplySet = new Set(supplies);
    
    // Build recipe to ingredients map
    const recipeIng = {};
    for (let i = 0; i < recipes.length; i++) {
        recipeIng[recipes[i]] = new Set(ingredients[i]);
    }
    
    // Memoization and visited sets
    const memo = {};
    const visiting = new Set();
    
    function canMake(item) {
        if (item in memo) return memo[item];
        if (visiting.has(item)) return false;
        if (supplySet.has(item)) return memo[item] = true;
        if (!(item in recipeIng)) return memo[item] = false;
        
        visiting.add(item);
        for (const ing of recipeIng[item]) {
            if (!canMake(ing)) {
                visiting.delete(item);
                return memo[item] = false;
            }
        }
        visiting.delete(item);
        return memo[item] = true;
    }
    
    const result = [];
    for (const recipe of recipes) {
        if (canMake(recipe)) {
            result.push(recipe);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N + E) where N is number of recipes and E is total number of ingredients |
| **Space** | O(N + E) for recursion stack and memoization |

---

## Comparison of Approaches

| Aspect | Topological Sort (BFS) | DFS with Memoization |
|--------|------------------------|---------------------|
| **Time Complexity** | O(N + E) | O(N + E) |
| **Space Complexity** | O(N + E) | O(N + E) |
| **Implementation** | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |
| **Cycle Detection** | Implicit | Explicit |

**Best Approach:** Use Approach 1 (Topological Sort) for the optimal solution. It's more intuitive for this dependency graph problem.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google, Meta
- **Difficulty**: Medium
- **Concepts Tested**: Topological Sort, Graph Theory, Dependency Resolution

### Learning Outcomes

1. **Topological Sort**: Master the classic topological sort algorithm
2. **Dependency Graphs**: Understanding how to model dependencies
3. **Cycle Detection**: Handling circular dependencies
4. **Graph Building**: Converting problem constraints to graph structure

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Classic topological sort |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Topological sort with ordering |
| Minimum Height Trees | [Link](https://leetcode.com/problems/minimum-height-trees/) | Graph center finding |
| Alien Dictionary | [Link](https://leetcode.com/problems/valid-sudoku/) | Topological sort variant |

### Pattern Reference

For more detailed explanations of the Topological Sort pattern, see:
- **[Topological Sort Pattern](/patterns/topological-sort)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Find All Possible Recipes](https://www.youtube.com/watch?v=12BQO8vF5)** - Clear explanation with visual examples
2. **[Topological Sort Tutorial](https://www.youtube.com/watch?v=8G3I4Ocb)** - Understanding topological sort

### Related Concepts

- **[Kahn's Algorithm](https://www.youtube.com/watch?v=0yBsfw)** - BFS-based topological sort
- **[Dependency Resolution](https://www.youtube.com/watch?v=7y2)** - Real-world applications

---

## Follow-up Questions

### Q1: How would you modify the solution to return recipes in a specific order (e.g., alphabetical)?

**Answer:** After getting all possible recipes in topological order, sort the result list alphabetically before returning.

---

### Q2: What if some recipes require a minimum quantity of ingredients (not just presence)?

**Answer:** You'd need to:
- Track ingredient quantities in addition to availability
- Modify indegree to track required quantities
- Decrement by actual quantity when recipe is made
- Use more complex data structures for inventory management

---

### Q3: How would you handle recipes that require time to prepare (like cooking)?

**Answer:** This becomes a scheduling problem:
- Add time constraints to each recipe
- Use priority queue for earliest completion time
- Track when each ingredient becomes available
- Similar to course scheduling with durations

---

### Q4: Can you solve this with parallel processing?

**Answer:** Yes:
- Independent recipes (no dependency between them) can be made simultaneously
- Build a dependency graph and find independent subgraphs
- Process each subgraph in parallel
- Similar to parallel course execution

---

### Q5: How would you find the minimum supplies needed to make a specific recipe?

**Answer:** This is a reverse dependency analysis:
- Start from the target recipe
- Recursively find all dependencies
- Use a set to collect unique required items
- Filter out items that are supplies vs. need to be created

---

## Common Pitfalls

### 1. Building Graph Incorrectly
**Issue**: The graph should map ingredients (that are also recipes) to recipes that depend on them, not the other way around.

**Solution**: Ensure edges go from ingredient → dependent recipe.

### 2. Missing Indegree Initialization
**Issue**: All recipes should be in the indegree map, even those with no dependencies (indegree = 0).

**Solution**: Initialize indegree for all recipes based on their ingredient count.

### 3. Forgetting Supplies are Available
**Issue**: Start with all supplies in the queue, not just recipes with indegree 0.

**Solution**: Initialize the queue with all supplies as starting points.

### 4. Cycle Handling
**Issue**: Recipes in cycles won't be produced because their dependencies never become 0.

**Solution**: The algorithm handles this implicitly - items in cycles never reach indegree 0.

---

## Summary

The **Find All Possible Recipes From Given Supplies** problem demonstrates the power of topological sorting in dependency resolution:

- **Topological Sort**: Process items in dependency order using Kahn's algorithm
- **Graph Modeling**: Convert recipes and ingredients to a directed graph
- **Starting Points**: Treat supplies as nodes with indegree 0

Key takeaways:
1. Model the problem as a dependency graph
2. Use supplies as starting points in the BFS
3. Decrement indegree when dependencies are satisfied
4. Recipes in cycles cannot be produced

This problem is essential for understanding topological sort and its applications in dependency resolution.

### Pattern Summary

This problem exemplifies the **Topological Sort** pattern, characterized by:
- Modeling dependencies as directed graphs
- Processing nodes with indegree 0
- Handling cycles implicitly or explicitly

For more details on this pattern and its variations, see the **[Topological Sort Pattern](/patterns/topological-sort)**.

---

## Additional Resources

- [LeetCode Problem 2115](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) - Official problem page
- [Topological Sort - GeeksforGeeks](https://www.geeksforgeeks.org/topological-sorting/) - Detailed explanation
- [Kahn's Algorithm](https://en.wikipedia.org/wiki/Topological_sorting) - Algorithm reference
- [Pattern: Topological Sort](/patterns/topological-sort) - Comprehensive pattern guide
