# Relative Ranks

## Problem Description

You are given an integer array `score` of size `n` where `score[i]` is the score of the ith athlete. Return an array `answer` of size `n` where:

- `answer[i]` is the rank of the ith athlete.
- The top three athletes get medals: "Gold Medal", "Silver Medal", "Bronze Medal".
- For the remaining positions, just give the position number as a string.

**Link to problem:** [Relative Ranks - LeetCode 506](https://leetcode.com/problems/relative-ranks/)

---

## Intuition

The key insight for this problem is that we need to assign ranks based on score values while preserving the original positions of athletes in the input array.

### Key Observations

1. **Sorting by Score**: If we sort scores in descending order, the highest score gets rank 1, second highest gets rank 2, and so on.

2. **Tracking Original Indices**: After sorting, we lose the original positions. We need to track which score came from which original index.

3. **Special Cases for Top 3**: The problem requires special medal names for the top three athletes instead of numeric ranks.

### Why Sort?

The most straightforward approach is to sort because ranking inherently requires knowing the relative ordering of all scores. By sorting in descending order and tracking original indices, we can directly assign ranks based on sorted position.

### Algorithm Overview

1. Create pairs of (score, original_index)
2. Sort these pairs in descending order by score
3. Iterate through sorted pairs and assign ranks
4. Use special medal names for positions 1-3, numeric strings for the rest

---

## Pattern: Sorting and Mapping

This problem demonstrates using sorting with index mapping.

### Core Concept

Sort scores in descending order while tracking original indices. Assign ranks based on sorted order.

---

## Examples

### Example

**Input:**
```
score = [5, 4, 3, 2, 1]
```

**Output:**
```
["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"]
```

---

## Constraints

- `n == score.length`
- `1 <= n <= 10^4`
- `0 <= score[i] <= 10^6`

---

## Approach

## Approach 1: Sorting (Optimal)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findRelativeRanks(self, score: List[int]) -> List[str]:
        # Create list of (score, index) pairs sorted by score
        sorted_scores = sorted([(s, i) for i, s in enumerate(score)], reverse=True)
        
        answer = [''] * len(score)
        
        for rank, (s, i) in enumerate(sorted_scores):
            if rank == 0:
                answer[i] = "Gold Medal"
            elif rank == 1:
                answer[i] = "Silver Medal"
            elif rank == 2:
                answer[i] = "Bronze Medal"
            else:
                answer[i] = str(rank + 1)
        
        return answer
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<string> findRelativeRanks(vector<int>& score) {
        vector<pair<int, int>> sorted;
        for (int i = 0; i < score.size(); i++) {
            sorted.push_back({score[i], i});
        }
        sort(sorted.begin(), sorted.end(), greater<pair<int,int>>());
        
        vector<string> answer(score.size());
        
        for (int rank = 0; rank < sorted.size(); rank++) {
            int idx = sorted[rank].second;
            if (rank == 0) answer[idx] = "Gold Medal";
            else if (rank == 1) answer[idx] = "Silver Medal";
            else if (rank == 2) answer[idx] = "Bronze Medal";
            else answer[idx] = to_string(rank + 1);
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String[] findRelativeRanks(int[] score) {
        Integer[] idx = new Integer[score.length];
        for (int i = 0; i < score.length; i++) idx[i] = i;
        
        Arrays.sort(idx, (a, b) -> score[b] - score[a]);
        
        String[] answer = new String[score.length];
        
        for (int rank = 0; rank < score.length; rank++) {
            int i = idx[rank];
            if (rank == 0) answer[i] = "Gold Medal";
            else if (rank == 1) answer[i] = "Silver Medal";
            else if (rank == 2) answer[i] = "Bronze Medal";
            else answer[i] = String.valueOf(rank + 1);
        }
        
        return answer;
    }
}
```

<!-- slide -->
```javascript
var findRelativeRanks = function(score) {
    const sorted = score.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
    
    const answer = new Array(score.length);
    
    sorted.forEach(([s, i], rank) => {
        if (rank === 0) answer[i] = "Gold Medal";
        else if (rank === 1) answer[i] = "Silver Medal";
        else if (rank === 2) answer[i] = "Bronze Medal";
        else answer[i] = String(rank + 1);
    });
    
    return answer;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) |
| **Space** | O(n) |

---

## Approach 2: Hash Map / Priority Queue

### Algorithm Steps

1. **Create a copy of scores** and sort in descending order to determine ranks
2. **Use a hash map** to store rank for each unique score
3. **Map back** to original positions

### Why It Works

This approach uses a hash map to store the rank for each unique score value, then maps back to the original positions.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findRelativeRanks(self, score: List[int]) -> List[str]:
        # Create a sorted copy of scores
        sorted_scores = sorted(score, reverse=True)
        
        # Create rank map
        rank_map = {}
        for i, s in enumerate(sorted_scores):
            if i == 0:
                rank_map[s] = "Gold Medal"
            elif i == 1:
                rank_map[s] = "Silver Medal"
            elif i == 2:
                rank_map[s] = "Bronze Medal"
            else:
                rank_map[s] = str(i + 1)
        
        # Map back to original positions
        return [rank_map[s] for s in score]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<string> findRelativeRanks(vector<int>& score) {
        // Create sorted copy
        vector<int> sorted = score;
        sort(sorted.begin(), sorted.end(), greater<int>());
        
        unordered_map<int, string> rankMap;
        for (int i = 0; i < sorted.size(); i++) {
            if (i == 0) rankMap[sorted[i]] = "Gold Medal";
            else if (i == 1) rankMap[sorted[i]] = "Silver Medal";
            else if (i == 2) rankMap[sorted[i]] = "Bronze Medal";
            else rankMap[sorted[i]] = to_string(i + 1);
        }
        
        vector<string> answer;
        for (int s : score) {
            answer.push_back(rankMap[s]);
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String[] findRelativeRanks(int[] score) {
        // Create sorted copy
        int[] sorted = score.clone();
        Arrays.sort(sorted);
        
        HashMap<Integer, String> rankMap = new HashMap<>();
        for (int i = sorted.length - 1; i >= 0; i--) {
            int rank = sorted.length - i;
            if (rank == 1) rankMap.put(sorted[i], "Gold Medal");
            else if (rank == 2) rankMap.put(sorted[i], "Silver Medal");
            else if (rank == 3) rankMap.put(sorted[i], "Bronze Medal");
            else rankMap.put(sorted[i], String.valueOf(rank));
        }
        
        String[] answer = new String[score.length];
        for (int i = 0; i < score.length; i++) {
            answer[i] = rankMap.get(score[i]);
        }
        
        return answer;
    }
}
```

<!-- slide -->
```javascript
var findRelativeRanks = function(score) {
    // Create sorted copy
    const sorted = [...score].sort((a, b) => b - a);
    
    const rankMap = {};
    for (let i = 0; i < sorted.length; i++) {
        if (i === 0) rankMap[sorted[i]] = "Gold Medal";
        else if (i === 1) rankMap[sorted[i]] = "Silver Medal";
        else if (i === 2) rankMap[sorted[i]] = "Bronze Medal";
        else rankMap[sorted[i]] = String(i + 1);
    }
    
    return score.map(s => rankMap[s]);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) |
| **Space** | O(n) |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Sorting Approaches

- [NeetCode - Relative Ranks](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Clear explanation with examples
- [Sorting with Index Tracking](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding the technique

---

## Follow-up Questions

### Q1: Can we solve this without sorting?

**Answer:** We could use a max-heap to repeatedly extract the largest element, but that would be O(n log n) which is the same as sorting.

---

### Q2: How would you handle ties differently?

**Answer:** The problem assumes all scores are unique. For ties, you would need to define tie-breaking rules and could use a secondary sort or track original positions.

---

### Q3: What if we needed top K athletes only?

**Answer:** We could use a min-heap of size K to maintain only the top K, achieving O(n log K) time.

---

### Q4: How does this relate to the "Rank Transform of an Array" problem?

**Answer:** That's a similar problem where you assign ranks based on sorted order, but without the medal special case.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Rank Transform of an Array | [Link](https://leetcode.com/problems/rank-transform-of-an-array/) | Without medals |
| Maximum Profit in Job Scheduling | [Link](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) | Similar sorting |

---

## Common Pitfalls

### 1. Index Mapping
**Issue**: Not tracking original indices after sorting.

**Solution**: Create tuple (score, original_index) and sort by score.

### 2. Medal String
**Issue**: Using wrong medal names or case.

**Solution**: Use exact strings: "Gold Medal", "Silver Medal", "Bronze Medal".

### 3. Zero-based vs One-based
**Issue**: Returning wrong rank numbers.

**Solution**: Remember to add 1 to rank for positions 4+.

### 4. Array Size
**Issue**: Not initializing answer array to correct size.

**Solution**: Create answer array of same length as input.

---

## Summary

The **Relative Ranks** problem demonstrates **Sorting with Index Mapping**:
- Sort scores in descending order while tracking original indices
- Assign medal names to top 3, position numbers to rest
- O(n log n) time complexity due to sorting
- O(n) space for storing sorted results

This problem is a straightforward application of sorting that can be solved in a single pass after sorting. The key is maintaining the mapping between original positions and sorted positions.

### Pattern Summary

This problem exemplifies the **Sorting with Index Mapping** pattern, which is characterized by:
- Creating tuples of (value, original_index)
- Sorting by value while preserving original index information
- Using the sorted order to assign results to original positions

This pattern is commonly used in ranking and ordering problems where you need to assign positions based on values while maintaining original indices.
