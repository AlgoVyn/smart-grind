# Greedy - Sorting Based

## Problem Description

The Sorting Based Greedy pattern involves sorting input data in a specific order that allows making locally optimal choices at each step, leading to a globally optimal solution. This pattern is widely applicable when the optimal solution depends on the order of processing elements.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n log n) due to sorting step |
| Space Complexity | O(1) or O(n) depending on sort |
| Input | Arrays requiring strategic ordering |
| Output | Optimal pairing, assignment, or arrangement |
| Approach | Sort + greedy selection with two pointers |

### When to Use

- Assignment problems with pairing constraints
- Problems where order reveals greedy choice property
- Two-pointer approaches after sorting
- Optimization problems with comparison-based decisions
- Minimizing/maximizing results through strategic ordering

## Intuition

The key insight is that sorting brings structure to the problem, making the greedy choice obvious at each step.

The "aha!" moments:

1. **Sorting reveals structure**: Proper ordering makes optimal choices obvious
2. **Two-pointer technique**: After sorting, use two pointers from ends or start
3. **Greedy after sort**: Once sorted, greedy choices are locally optimal
4. **Pairing strategy**: Match smallest with smallest or largest with smallest
5. **No backtracking needed**: Sorted order ensures optimal substructure

## Solution Approaches

### Approach 1: Assign Cookies ✅ Recommended

#### Algorithm

1. Sort both greed factors and cookie sizes
2. Use two pointers: child at 0, cookie at 0
3. While both pointers in bounds:
   - If cookie >= greed, assign cookie to child (move both pointers)
   - Else, cookie too small (move cookie pointer)
4. Return number of satisfied children

#### Implementation

````carousel
```python
def find_content_children(greed: list[int], cookies: list[int]) -> int:
    """
    Assign cookies to children based on greed factors.
    LeetCode 455 - Assign Cookies
    Time: O(n log n), Space: O(1) or O(n) for sort
    """
    greed.sort()
    cookies.sort()
    
    child = 0
    cookie = 0
    
    while child < len(greed) and cookie < len(cookies):
        if cookies[cookie] >= greed[child]:
            child += 1  # Child satisfied
        cookie += 1  # Move to next cookie
    
    return child


def find_content_children_two_pointer(greed, cookies):
    """
    Alternative with explicit pointer movement.
    """
    greed.sort()
    cookies.sort()
    
    i = j = satisfied = 0
    
    while i < len(greed) and j < len(cookies):
        if cookies[j] >= greed[i]:
            satisfied += 1
            i += 1
        j += 1
    
    return satisfied
```
<!-- slide -->
```cpp
class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());
        
        int child = 0, cookie = 0;
        
        while (child < g.size() && cookie < s.size()) {
            if (s[cookie] >= g[child]) {
                child++;
            }
            cookie++;
        }
        
        return child;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        
        int child = 0, cookie = 0;
        
        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) {
                child++;
            }
            cookie++;
        }
        
        return child;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
function findContentChildren(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    
    let child = 0, cookie = 0;
    
    while (child < g.length && cookie < s.length) {
        if (s[cookie] >= g[child]) {
            child++;
        }
        cookie++;
    }
    
    return child;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - Dominated by sorting |
| Space | O(1) or O(n) - Depends on sort implementation |

### Approach 2: Boats to Save People ✅ Recommended

#### Algorithm

1. Sort people by weight
2. Use two pointers: left at 0 (lightest), right at end (heaviest)
3. While left <= right:
   - If heaviest + lightest <= limit, they share a boat (left++)
   - Heaviest always takes a boat (right--)
   - Increment boat count
4. Return boat count

#### Implementation

````carousel
```python
def num_rescue_boats(people: list[int], limit: int) -> int:
    """
    Minimum boats to save all people.
    LeetCode 881 - Boats to Save People
    Time: O(n log n), Space: O(1) or O(n)
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


def num_rescue_boats_verbose(people, limit):
    """
    Detailed version with comments.
    """
    people.sort()
    
    light = 0
    heavy = len(people) - 1
    boats = 0
    
    while light <= heavy:
        remaining = limit - people[heavy]  # Space left after heaviest
        
        if remaining >= people[light]:
            # Lightest can also fit
            light += 1
        
        # Heavy always goes
        heavy -= 1
        boats += 1
    
    return boats
```
<!-- slide -->
```cpp
class Solution {
public:
    int numRescueBoats(vector<int>& people, int limit) {
        sort(people.begin(), people.end());
        
        int left = 0;
        int right = people.size() - 1;
        int boats = 0;
        
        while (left <= right) {
            if (people[left] + people[right] <= limit) {
                left++;
            }
            right--;
            boats++;
        }
        
        return boats;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int numRescueBoats(int[] people, int limit) {
        Arrays.sort(people);
        
        int left = 0;
        int right = people.length - 1;
        int boats = 0;
        
        while (left <= right) {
            if (people[left] + people[right] <= limit) {
                left++;
            }
            right--;
            boats++;
        }
        
        return boats;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} people
 * @param {number} limit
 * @return {number}
 */
function numRescueBoats(people, limit) {
    people.sort((a, b) => a - b);
    
    let left = 0;
    let right = people.length - 1;
    let boats = 0;
    
    while (left <= right) {
        if (people[left] + people[right] <= limit) {
            left++;
        }
        right--;
        boats++;
    }
    
    return boats;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - Dominated by sorting |
| Space | O(1) or O(n) - Depends on sort implementation |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Sort + Two Pointers | O(n log n) | O(1) | **Recommended** - Most sorting-based greedy |
| Counting Sort | O(n) | O(limit) | When weight range is small |
| DP | O(n²) | O(n) | Not recommended for these problems |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Assign Cookies](https://leetcode.com/problems/assign-cookies/) | 455 | Easy | Match cookies to greed |
| [Boats to Save People](https://leetcode.com/problems/boats-to-save-people/) | 881 | Medium | Pair people optimally |
| [Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/) | 1029 | Medium | Minimize scheduling cost |
| [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) | 1167 | Medium | Huffman coding pattern |
| [Largest Perimeter Triangle](https://leetcode.com/problems/largest-perimeter-triangle/) | 976 | Easy | Triangle inequality |
| [Array Partition I](https://leetcode.com/problems/array-partition-i/) | 561 | Easy | Minimize sum of pairs |

## Video Tutorial Links

1. **[NeetCode - Assign Cookies](https://www.youtube.com/watch?v=JW8fgvoxPTg)** - Two-pointer greedy
2. **[Kevin Naughton Jr. - Boats](https://www.youtube.com/watch?v=3VVSKhZfPbE)** - Detailed explanation
3. **[Nick White - Sorting Greedy](https://www.youtube.com/watch?v=U_D2xNsm9DQ)** - Pattern overview

## Summary

### Key Takeaways

- **Sort first**: Usually O(n log n) but makes greedy obvious
- **Two pointers**: Common technique after sorting
- **Greedy choice**: After sort, local optimal is global optimal
- **Match extremes**: Lightest with heaviest or lightest with lightest
- **Proof**: Exchange argument shows optimality

### Common Pitfalls

- Wrong sort order (ascending vs descending)
- Incorrect pointer movement conditions
- Off-by-one in while loop condition
- Forgetting to sort both arrays when needed
- Modifying input when not allowed
- Using wrong comparison (<= vs <)

### Follow-up Questions

1. **Why is sorting necessary?**
   - Brings structure that makes greedy choice obvious

2. **Can we do better than O(n log n)?**
   - Sometimes with counting sort if range is limited

3. **How to prove greedy is optimal?**
   - Exchange argument: any optimal can be transformed to greedy

4. **What if we can't modify the input?**
   - Create a copy or use different data structure

## Pattern Source

[Greedy - Sorting Based](patterns/greedy-sorting-based.md)
