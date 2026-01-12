# Greedy - Sorting Based

## Overview

The Greedy - Sorting Based pattern involves sorting the input data in a specific order that allows making locally optimal choices at each step, leading to a globally optimal solution. This pattern is widely applicable when the problem can be solved by arranging elements in a particular sequence and then applying greedy decisions.

When to use this pattern:
- When the optimal solution depends on the order of processing elements
- For assignment problems where pairing elements optimally is key
- In scenarios where sorting reveals the greedy choice property

Benefits:
- Simplifies complex problems by reducing them to sorting and linear passes
- Provides correct solutions for many optimization problems
- Often more intuitive and easier to implement than dynamic programming

## Key Concepts

- **Strategic Sorting**: Sort the array based on a key that enables greedy choices
- **Greedy Selection**: After sorting, make locally optimal decisions
- **Order Matters**: The sorting order is crucial for the correctness of the greedy approach
- **Iterative Processing**: Process elements in the sorted order, making decisions sequentially

## Template

```python
def assign_cookies(greed, cookies):
    """
    Template for assigning cookies to children based on greed factors.
    
    Args:
    greed (List[int]): Greed factors of children
    cookies (List[int]): Sizes of cookies
    
    Returns:
    int: Maximum number of children that can be satisfied
    """
    greed.sort()
    cookies.sort()
    
    child = 0
    cookie = 0
    
    while child < len(greed) and cookie < len(cookies):
        if cookies[cookie] >= greed[child]:
            child += 1
        cookie += 1
    
    return child

def num_rescue_boats(people, limit):
    """
    Template for minimizing boats needed to rescue people.
    
    Args:
    people (List[int]): Weights of people
    limit (int): Maximum weight per boat
    
    Returns:
    int: Minimum number of boats required
    """
    people.sort()
    left = 0
    right = len(people) - 1
    boats = 0
    
    while left <= right:
        # If heaviest and lightest can share a boat
        if people[left] + people[right] <= limit:
            left += 1
        # Heaviest always takes a boat
        right -= 1
        boats += 1
    
    return boats

def find_content_children(greed, cookies):
    """
    Alternative template for content children problem.
    
    Args:
    greed (List[int]): Greed factors
    cookies (List[int]): Cookie sizes
    
    Returns:
    int: Number of content children
    """
    greed.sort()
    cookies.sort()
    
    i = 0  # greed index
    j = 0  # cookies index
    
    while i < len(greed) and j < len(cookies):
        if cookies[j] >= greed[i]:
            i += 1
        j += 1
    
    return i
```

## Example Problems

1. **Assign Cookies (LeetCode 455)**: Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content.

2. **Boats to Save People (LeetCode 881)**: You are given an array people where people[i] is the weight of the ith person, and an infinite number of boats where each boat can carry a maximum weight of limit. Each boat carries at most two people at the same time, provided the sum of the weight of those people is at most limit.

3. **Non-overlapping Intervals (LeetCode 435)**: Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

## Time and Space Complexity

- **Time Complexity**: O(n log n) due to the sorting step, where n is the size of the input arrays.
- **Space Complexity**: O(1) additional space if sorting in-place, or O(n) if creating new sorted arrays.

## Common Pitfalls

- **Wrong Sort Order**: Ensure sorting both arrays in ascending order for assignment problems.
- **Incorrect Pointer Movement**: In two-pointer approaches, move pointers correctly based on conditions.
- **Edge Cases**: Handle empty arrays, single elements, and cases where no assignments are possible.
- **Greedy Validity**: Verify that the greedy approach is valid for the problem; not all problems allow it.
- **Modifying Input**: Be careful if the problem requires preserving original arrays.