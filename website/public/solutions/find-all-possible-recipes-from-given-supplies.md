# Find All Possible Recipes From Given Supplies

## Problem Description

You have information about n different recipes. You are given a string array recipes and a 2D string array ingredients. The ith recipe has the name recipes[i], and you can create it if you have all the needed ingredients from ingredients[i]. A recipe can also be an ingredient for other recipes, i.e., ingredients[i] may contain a string that is in recipes.
You are also given a string array supplies containing all the ingredients that you initially have, and you have an infinite supply of all of them.
Return a list of all the recipes that you can create. You may return the answer in any order.
Note that two recipes may contain each other in their ingredients.

## Constraints

- n == recipes.length == ingredients.length
- 1 <= n <= 100
- 1 <= ingredients[i].length, supplies.length <= 100
- 1 <= recipes[i].length, ingredients[i][j].length, supplies[k].length <= 10
- recipes[i], ingredients[i][j], and supplies[k] consist only of lowercase English letters.
- All the values of recipes and supplies combined are unique.
- Each ingredients[i] does not contain any duplicate values.

## Example 1

**Input:**
```python
recipes = ["bread"], ingredients = [["yeast","flour"]], supplies = ["yeast","flour","corn"]
```

**Output:**
```python
["bread"]
```

**Explanation:**
We can create "bread" since we have the ingredients "yeast" and "flour".

## Example 2

**Input:**
```python
recipes = ["bread","sandwich"], ingredients = [["yeast","flour"],["bread","meat"]], supplies = ["yeast","flour","meat"]
```

**Output:**
```python
["bread","sandwich"]
```

**Explanation:**
We can create "bread" since we have the ingredients "yeast" and "flour".
We can create "sandwich" since we have the ingredient "meat" and can create the ingredient "bread".

## Example 3

**Input:**
```python
recipes = ["bread","sandwich","burger"], ingredients = [["yeast","flour"],["bread","meat"],["sandwich","meat","bread"]], supplies = ["yeast","flour","meat"]
```

**Output:**
```python
["bread","sandwich","burger"]
```

**Explanation:**
We can create "bread" since we have the ingredients "yeast" and "flour".
We can create "sandwich" since we have the ingredient "meat" and can create the ingredient "bread".
We can create "burger" since we have the ingredient "meat" and can create the ingredients "bread" and "sandwich".

## Solution

```python
from typing import List

class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        from collections import deque, defaultdict
        
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
            if item in indegree:  # it's a recipe
                result.append(item)
            # Now, reduce indegree for recipes that depend on this item
            if item in graph:
                for rec in graph[item]:
                    indegree[rec] -= 1
                    if indegree[rec] == 0:
                        queue.append(rec)
        
        return result
```

## Explanation

This problem can be solved using topological sorting with BFS (Kahn's algorithm), modeling recipes and their dependencies as a graph.

### Step-by-Step Explanation:

1. **Model the problem as a graph:**
   - Each recipe has an indegree equal to the number of its ingredients.
   - Build a graph where each ingredient (that is also a recipe) points to the recipes that depend on it.
   - Supplies are treated as nodes with indegree 0.

2. **BFS traversal:**
   - Start a queue with all supplies.
   - For each item dequeued:
     - If it's a recipe, add it to the result (since all its dependencies are satisfied).
     - For each recipe that depends on this item, decrement its indegree.
     - If a recipe's indegree becomes 0, add it to the queue.

3. **Edge cases:**
   - Recipes with no dependencies (all ingredients are supplies) will be added immediately if their indegree is 0.
   - Cycles are handled implicitly; recipes in cycles won't be produced if dependencies aren't met.

### Time Complexity:

O(N + E), where N is the number of recipes and E is the total number of ingredients across all recipes, as we process each recipe and ingredient once.

### Space Complexity:

O(N + E), for the graph, indegree map, queue, and result list.
