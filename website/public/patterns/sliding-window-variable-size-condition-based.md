# Sliding Window - Variable Size (Condition-Based)

## Overview

The Variable Size Sliding Window pattern solves problems where the window size is not fixed but dynamically adjusts based on a condition. Unlike fixed-size windows where we slide by a constant amount, variable-size windows expand and contract to satisfy specific constraints. This pattern is powerful for problems involving subarrays/substrings with specific properties.

The key characteristic is that **both window boundaries are adjustable**, allowing the window to grow or shrink based on the problem's conditions rather than a predetermined size.

---

## Problem Statement

Given an array/string and a condition that defines a valid window, find the optimal subarray/substring that satisfies the condition. The window size varies dynamically as we expand the right boundary and contract the left boundary.

### Input Format

- `arr`: An array of integers (or string of characters)
- `condition`: A predicate function or value that defines a valid window

### Output Format

- For minimum/maximum subarray length: An integer representing the optimal window size
- For counting subarrays: A count of valid subarrays
- For maximum/minimum sum: The optimal sum value
- For finding subarray: The actual subarray itself

### Constraints

- `1 ≤ len(arr) ≤ 10^5` (typical upper bound)
- Time complexity target: **O(n)** (single or double pass)
- Space complexity target: **O(1)** or **O(k)** extra

---

## Examples

### Example 1: Minimum Size Subarray Sum

**Input:**
```
arr = [2, 3, 1, 2, 4, 3], target = 7
```

**Output:**
```
2
```

**Explanation:**
- Subarray [4, 3] has sum 7 and length 2
- This is the minimum length subarray that achieves sum >= 7

---

### Example 2: Longest Substring with K Distinct Characters

**Input:**
```
s = "aaabbbcccddd", k = 3
```

**Output:**
```
6 (substring "cccddd" or similar)
```

**Explanation:**
- The longest substring with exactly 3 distinct characters has length 6

---

### Example 3: Count Subarrays with Maximum Minus Minimum Equals K

**Input:**
```
arr = [1, 2, 3, 4, 5], k = 2
```

**Output:**
```
4
```

**Explanation:**
- Valid subarrays: [1,2], [2,3], [3,4], [4,5] (each has max-min=2)

---

### Example 4: Fruits Into Baskets

**Input:**
```
fruits = ['A', 'B', 'C', 'B', 'B', 'C', 'A', 'A', 'B']
```

**Output:**
```
5 (fruits: C, B, B, C, A)
```

**Explanation:**
- Maximum fruits collected with at most 2 types of baskets

---

### Example 5: Longest Substring Without Repeating Characters

**Input:**
```
s = "abcabcbb"
```

**Output:**
```
3 (substring "abc" or "bca" or "cab")
```

**Explanation:**
- The longest substring without repeating characters has length 3

---

## Intuition

The key insight behind the variable-size sliding window pattern is **two-pointer technique** combined with **state tracking**.

### Why It Works

Consider finding the minimum size subarray with sum >= target:

**Naive Approach (O(n×k)):**
```python
for i in range(n):
    for j in range(i, n):
        if sum(arr[i:j+1]) >= target:
            update_min_length(j - i + 1)
```

**Variable Window Approach (O(n)):**
- Expand the right pointer to increase the window sum
- Contract the left pointer when the condition is satisfied
- Track the minimum size during the process

### Key Observations

1. **Monotonicity**: As we expand the window, the sum increases; as it we shrink, the sum decreases
2. **Two Pointers**: Left and right pointers define the current window
3. **State Maintenance**: We track necessary information (sum, counts, min/max) as the window changes
4. **Optimal Substructure**: If a window [l, r] is valid, all larger windows starting at l are also valid

---

## Multiple Approaches with Code

We'll cover the main approaches for variable-size sliding windows:

1. **Minimum Window Size** - Find smallest window satisfying condition
2. **Maximum Window Size** - Find largest window satisfying condition
3. **Count Valid Subarrays** - Count all windows satisfying condition
4. **Longest Substring with K Distinct** - Classic character-based problem
5. **Subarray Sum Equals K** - Using hashmap for exact sum

---

### Approach 1: Minimum Window Size (Sum >= Target)

This approach finds the smallest subarray whose sum is at least a target value.

#### Algorithm Steps

1. Initialize left pointer and current sum
2. Expand right pointer, adding elements to sum
3. While current sum >= target, update minimum length and shrink from left
4. Continue until right reaches the end

#### Code Implementation

````carousel
```python
from typing import List

class MinimumWindowSize:
    """
    Find minimum size subarray with sum >= target.
    Time: O(n), Space: O(1)
    """
    
    @staticmethod
    def min_subarray_len(target: int, arr: List[int]) -> int:
        """
        Returns the length of the smallest contiguous subarray with sum >= target.
        Returns 0 if no such subarray exists.
        
        Args:
            target: The target sum
            arr: Input array of positive integers
            
        Returns:
            Minimum length of subarray with sum >= target
        """
        if not arr or target <= 0:
            return 0
        
        left = 0
        current_sum = 0
        min_length = float('inf')
        
        for right in range(len(arr)):
            current_sum += arr[right]
            
            # Shrink window from left while condition is satisfied
            while current_sum >= target:
                min_length = min(min_length, right - left + 1)
                current_sum -= arr[left]
                left += 1
        
        return min_length if min_length != float('inf') else 0
    
    @staticmethod
    def min_subarray_len_with_sum(arr: List[int], target: int) -> List[int]:
        """
        Returns the actual subarray with minimum length and sum >= target.
        
        Args:
            arr: Input array
            target: Target sum
            
        Returns:
            The subarray [start, end] indices, or empty list if not found
        """
        if not arr or target <= 0:
            return []
        
        left = 0
        current_sum = 0
        min_length = float('inf')
        result = []
        
        for right in range(len(arr)):
            current_sum += arr[right]
            
            while current_sum >= target:
                window_len = right - left + 1
                if window_len < min_length:
                    min_length = window_len
                    result = [left, right]
                current_sum -= arr[left]
                left += 1
        
        return result
    
    @staticmethod
    def min_subarray_len_positive_negative(arr: List[int], target: int) -> int:
        """
        Handles arrays with both positive and negative numbers using prefix sums.
        
        Args:
            arr: Input array (may contain negative numbers)
            target: Target sum
            
        Returns:
            Minimum length of subarray with sum >= target
        """
        from collections import defaultdict
        
        prefix_sum = 0
        prefix_map = defaultdict(list)
        prefix_map[0].append(-1)  # Prefix sum 0 at index -1
        min_length = float('inf')
        
        for i, num in enumerate(arr):
            prefix_sum += num
            
            # Need prefix_sum - prefix_map[needed] >= target
            # So prefix_map[needed] <= prefix_sum - target
            needed = prefix_sum - target
            
            if needed in prefix_map:
                # Find earliest index with prefix_sum - target
                earliest = prefix_map[needed][0]
                min_length = min(min_length, i - earliest)
            
            prefix_map[prefix_sum].append(i)
        
        return min_length if min_length != float('inf') else 0


# Convenience functions
def min_subarray_length(target: int, arr: List[int]) -> int:
    """Find minimum size subarray with sum >= target."""
    return MinimumWindowSize.min_subarray_len(target, arr)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
#include <unordered_map>
#include <list>

class MinimumWindowSize {
public:
    /**
     * Find minimum size subarray with sum >= target.
     * Time: O(n), Space: O(1)
     * Works for arrays with positive integers only.
     */
    static int minSubarrayLen(int target, const std::vector<int>& arr) {
        if (arr.empty() || target <= 0) {
            return 0;
        }
        
        int left = 0;
        int currentSum = 0;
        int minLength = INT_MAX;
        
        for (int right = 0; right < arr.size(); right++) {
            currentSum += arr[right];
            
            while (currentSum >= target) {
                minLength = std::min(minLength, right - left + 1);
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength == INT_MAX ? 0 : minLength;
    }
    
    /**
     * Returns the actual subarray indices [start, end].
     */
    static std::vector<int> minSubarrayLenWithIndices(int target, const std::vector<int>& arr) {
        if (arr.empty() || target <= 0) {
            return {};
        }
        
        int left = 0;
        int currentSum = 0;
        int minLength = INT_MAX;
        int start = 0, end = 0;
        
        for (int right = 0; right < arr.size(); right++) {
            currentSum += arr[right];
            
            while (currentSum >= target) {
                int windowLen = right - left + 1;
                if (windowLen < minLength) {
                    minLength = windowLen;
                    start = left;
                    end = right;
                }
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength == INT_MAX ? std::vector<int>{} : std::vector<int>{start, end};
    }
    
    /**
     * Handles arrays with both positive and negative numbers.
     */
    static int minSubarrayLenWithNegatives(int target, const std::vector<int>& arr) {
        std::unordered_map<int, int> prefixMap;
        prefixMap[0] = -1;  // Prefix sum 0 at index -1
        int prefixSum = 0;
        int minLength = INT_MAX;
        
        for (int i = 0; i < arr.size(); i++) {
            prefixSum += arr[i];
            
            int needed = prefixSum - target;
            if (prefixMap.find(needed) != prefixMap.end()) {
                minLength = std::min(minLength, i - prefixMap[needed]);
            }
            
            // Store only the first (earliest) occurrence
            if (prefixMap.find(prefixSum) == prefixMap.end()) {
                prefixMap[prefixSum] = i;
            }
        }
        
        return minLength == INT_MAX ? 0 : minLength;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class MinimumWindowSize {
    
    /**
     * Find minimum size subarray with sum >= target.
     * Time: O(n), Space: O(1)
     */
    public static int minSubarrayLen(int target, int[] arr) {
        if (arr == null || arr.length == 0 || target <= 0) {
            return 0;
        }
        
        int left = 0;
        int currentSum = 0;
        int minLength = Integer.MAX_VALUE;
        
        for (int right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum >= target) {
                minLength = Math.min(minLength, right - left + 1);
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
    
    /**
     * Returns the actual subarray indices [start, end].
     */
    public static int[] minSubarrayLenWithIndices(int target, int[] arr) {
        if (arr == null || arr.length == 0 || target <= 0) {
            return new int[]{};
        }
        
        int left = 0;
        int currentSum = 0;
        int minLength = Integer.MAX_VALUE;
        int start = 0, end = 0;
        
        for (int right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum >= target) {
                int windowLen = right - left + 1;
                if (windowLen < minLength) {
                    minLength = windowLen;
                    start = left;
                    end = right;
                }
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength == Integer.MAX_VALUE ? new int[]{} : new int[]{start, end};
    }
    
    /**
     * Handles arrays with negative numbers using prefix sum and hashmap.
     */
    public static int minSubarrayLenWithNegatives(int target, int[] arr) {
        Map<Integer, Integer> prefixMap = new HashMap<>();
        prefixMap.put(0, -1);  // Prefix sum 0 at index -1
        int prefixSum = 0;
        int minLength = Integer.MAX_VALUE;
        
        for (int i = 0; i < arr.length; i++) {
            prefixSum += arr[i];
            
            int needed = prefixSum - target;
            if (prefixMap.containsKey(needed)) {
                minLength = Math.min(minLength, i - prefixMap.get(needed));
            }
            
            // Store only the first (earliest) occurrence
            if (!prefixMap.containsKey(prefixSum)) {
                prefixMap.put(prefixSum, i);
            }
        }
        
        return minLength == Integer.MAX_VALUE ? 0 : minLength;
    }
}
```

<!-- slide -->
```javascript
class MinimumWindowSize {
    
    /**
     * Find minimum size subarray with sum >= target.
     * Time: O(n), Space: O(1)
     */
    static minSubarrayLen(target, arr) {
        if (!arr || arr.length === 0 || target <= 0) {
            return 0;
        }
        
        let left = 0;
        let currentSum = 0;
        let minLength = Infinity;
        
        for (let right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum >= target) {
                minLength = Math.min(minLength, right - left + 1);
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength === Infinity ? 0 : minLength;
    }
    
    /**
     * Returns the actual subarray indices [start, end].
     */
    static minSubarrayLenWithIndices(target, arr) {
        if (!arr || arr.length === 0 || target <= 0) {
            return [];
        }
        
        let left = 0;
        let currentSum = 0;
        let minLength = Infinity;
        let [start, end] = [0, 0];
        
        for (let right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum >= target) {
                const windowLen = right - left + 1;
                if (windowLen < minLength) {
                    minLength = windowLen;
                    [start, end] = [left, right];
                }
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength === Infinity ? [] : [start, end];
    }
    
    /**
     * Handles arrays with negative numbers.
     */
    static minSubarrayLenWithNegatives(target, arr) {
        const prefixMap = new Map();
        prefixMap.set(0, -1);
        let prefixSum = 0;
        let minLength = Infinity;
        
        for (let i = 0; i < arr.length; i++) {
            prefixSum += arr[i];
            
            const needed = prefixSum - target;
            if (prefixMap.has(needed)) {
                minLength = Math.min(minLength, i - prefixMap.get(needed));
            }
            
            if (!prefixMap.has(prefixSum)) {
                prefixMap.set(prefixSum, i);
            }
        }
        
        return minLength === Infinity ? 0 : minLength;
    }
}

// Convenience functions
function minSubarrayLength(target, arr) {
    return MinimumWindowSize.minSubarrayLen(target, arr);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most twice (once by right, once by left) |
| **Space** | O(1) - Only a few variables used |

---

### Approach 2: Maximum Window Size (Longest Valid Subarray)

This approach finds the largest subarray satisfying a given condition.

#### Algorithm Steps

1. Initialize left pointer to maintain window
2. Track necessary state (sum, count, etc.)
3. Expand right pointer
4. When condition is violated, shrink from left until valid again
5. Track maximum window size at each valid state

#### Code Implementation

````carousel
```python
from typing import List, Dict, Set
from collections import defaultdict

class MaximumWindowSize:
    """
    Find maximum size subarray satisfying a condition.
    Time: O(n), Space: O(1) or O(k)
    """
    
    @staticmethod
    def longest_substring_k_distinct(s: str, k: int) -> int:
        """
        Find the length of the longest substring with at most k distinct characters.
        
        Args:
            s: Input string
            k: Maximum number of distinct characters
            
        Returns:
            Length of longest valid substring
        """
        if not s or k <= 0:
            return 0
        
        char_count = defaultdict(int)
        left = 0
        distinct = 0
        max_length = 0
        
        for right, char in enumerate(s):
            char_count[char] += 1
            if char_count[char] == 1:
                distinct += 1
            
            # Shrink window when too many distinct characters
            while distinct > k:
                char_count[s[left]] -= 1
                if char_count[s[left]] == 0:
                    distinct -= 1
                left += 1
            
            max_length = max(max_length, right - left + 1)
        
        return max_length
    
    @staticmethod
    def longest_substring_exactly_k_distinct(s: str, k: int) -> int:
        """
        Find the length of the longest substring with exactly k distinct characters.
        """
        if not s or k <= 0:
            return 0
        
        return (MaximumWindowSize.longest_substring_k_distinct(s, k) -
                MaximumWindowSize.longest_substring_k_distinct(s, k - 1))
    
    @staticmethod
    def longest_substring_without_repeating(s: str) -> int:
        """
        Find the length of the longest substring without repeating characters.
        
        Args:
            s: Input string
            
        Returns:
            Length of longest substring without repeats
        """
        if not s:
            return 0
        
        char_index = {}  # Stores the most recent index of each character
        left = 0
        max_length = 0
        
        for right, char in enumerate(s):
            # If character is repeated and in current window, move left pointer
            if char in char_index and char_index[char] >= left:
                left = char_index[char] + 1
            
            char_index[char] = right
            max_length = max(max_length, right - left + 1)
        
        return max_length
    
    @staticmethod
    def longest_substring_at_most_k_distinct(s: str, k: int) -> int:
        """
        Find the length of the longest substring with at most k distinct characters.
        Alternative implementation.
        """
        if not s or k <= 0:
            return 0
        
        max_length = 0
        left = 0
        char_count = defaultdict(int)
        distinct = 0
        
        for right in range(len(s)):
            char = s[right]
            char_count[char] += 1
            if char_count[char] == 1:
                distinct += 1
            
            while distinct > k:
                char_count[s[left]] -= 1
                if char_count[s[left]] == 0:
                    distinct -= 1
                left += 1
            
            max_length = max(max_length, right - left + 1)
        
        return max_length
    
    @staticmethod
    def max_fruits_into_baskets(fruits: List[str]) -> int:
        """
        Maximum fruits collected with at most 2 types of baskets.
        Similar to longest substring with 2 distinct characters.
        
        Args:
            fruits: List of fruit types
            
        Returns:
            Maximum number of fruits
        """
        if not fruits:
            return 0
        
        fruit_count = defaultdict(int)
        left = 0
        max_fruits = 0
        
        for right, fruit in enumerate(fruits):
            fruit_count[fruit] += 1
            
            # Shrink window when more than 2 types
            while len(fruit_count) > 2:
                fruit_count[fruits[left]] -= 1
                if fruit_count[fruits[left]] == 0:
                    del fruit_count[fruits[left]]
                left += 1
            
            max_fruits = max(max_fruits, right - left + 1)
        
        return max_fruits


# Convenience functions
def longest_substring_k_distinct(s: str, k: int) -> int:
    """Find longest substring with at most k distinct characters."""
    return MaximumWindowSize.longest_substring_k_distinct(s, k)

def longest_substring_without_repeating(s: str) -> int:
    """Find longest substring without repeating characters."""
    return MaximumWindowSize.longest_substring_without_repeating(s)
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <climits>

class MaximumWindowSize {
public:
    /**
     * Find the length of the longest substring with at most k distinct characters.
     */
    static int longestSubstringKDistinct(const std::string& s, int k) {
        if (s.empty() || k <= 0) {
            return 0;
        }
        
        std::unordered_map<char, int> charCount;
        int left = 0;
        int distinct = 0;
        int maxLength = 0;
        
        for (int right = 0; right < s.size(); right++) {
            charCount[s[right]]++;
            if (charCount[s[right]] == 1) {
                distinct++;
            }
            
            while (distinct > k) {
                charCount[s[left]]--;
                if (charCount[s[left]] == 0) {
                    distinct--;
                }
                left++;
            }
            
            maxLength = std::max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Find the length of the longest substring without repeating characters.
     */
    static int longestSubstringWithoutRepeating(const std::string& s) {
        if (s.empty()) {
            return 0;
        }
        
        std::unordered_map<char, int> charIndex;
        int left = 0;
        int maxLength = 0;
        
        for (int right = 0; right < s.size(); right++) {
            char c = s[right];
            
            // If character is in current window, move left pointer
            if (charIndex.find(c) != charIndex.end() && charIndex[c] >= left) {
                left = charIndex[c] + 1;
            }
            
            charIndex[c] = right;
            maxLength = std::max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Maximum fruits collected with at most 2 types of baskets.
     */
    static int maxFruitsIntoBaskets(const std::vector<std::string>& fruits) {
        if (fruits.empty()) {
            return 0;
        }
        
        std::unordered_map<std::string, int> fruitCount;
        int left = 0;
        int maxFruits = 0;
        
        for (int right = 0; right < fruits.size(); right++) {
            fruitCount[fruits[right]]++;
            
            while (fruitCount.size() > 2) {
                fruitCount[fruits[left]]--;
                if (fruitCount[fruits[left]] == 0) {
                    fruitCount.erase(fruits[left]);
                }
                left++;
            }
            
            maxFruits = std::max(maxFruits, right - left + 1);
        }
        
        return maxFruits;
    }
    
    /**
     * Find longest substring with exactly k distinct characters.
     */
    static int longestSubstringExactlyKDistinct(const std::string& s, int k) {
        if (s.empty() || k <= 0) {
            return 0;
        }
        return longestSubstringKDistinct(s, k) - longestSubstringKDistinct(s, k - 1);
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class MaximumWindowSize {
    
    /**
     * Find the length of the longest substring with at most k distinct characters.
     */
    public static int longestSubstringKDistinct(String s, int k) {
        if (s == null || s.isEmpty() || k <= 0) {
            return 0;
        }
        
        Map<Character, Integer> charCount = new HashMap<>();
        int left = 0;
        int distinct = 0;
        int maxLength = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            charCount.put(c, charCount.getOrDefault(c, 0) + 1);
            if (charCount.get(c) == 1) {
                distinct++;
            }
            
            while (distinct > k) {
                char leftChar = s.charAt(left);
                charCount.put(leftChar, charCount.get(leftChar) - 1);
                if (charCount.get(leftChar) == 0) {
                    distinct--;
                }
                left++;
            }
            
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Find the length of the longest substring without repeating characters.
     */
    public static int longestSubstringWithoutRepeating(String s) {
        if (s == null || s.isEmpty()) {
            return 0;
        }
        
        Map<Character, Integer> charIndex = new HashMap<>();
        int left = 0;
        int maxLength = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            
            if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
                left = charIndex.get(c) + 1;
            }
            
            charIndex.put(c, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Maximum fruits collected with at most 2 types of baskets.
     */
    public static int maxFruitsIntoBaskets(String[] fruits) {
        if (fruits == null || fruits.length == 0) {
            return 0;
        }
        
        Map<String, Integer> fruitCount = new HashMap<>();
        int left = 0;
        int maxFruits = 0;
        
        for (int right = 0; right < fruits.length; right++) {
            String fruit = fruits[right];
            fruitCount.put(fruit, fruitCount.getOrDefault(fruit, 0) + 1);
            
            while (fruitCount.size() > 2) {
                String leftFruit = fruits[left];
                fruitCount.put(leftFruit, fruitCount.get(leftFruit) - 1);
                if (fruitCount.get(leftFruit) == 0) {
                    fruitCount.remove(leftFruit);
                }
                left++;
            }
            
            maxFruits = Math.max(maxFruits, right - left + 1);
        }
        
        return maxFruits;
    }
    
    /**
     * Find longest substring with exactly k distinct characters.
     */
    public static int longestSubstringExactlyKDistinct(String s, int k) {
        if (s == null || s.isEmpty() || k <= 0) {
            return 0;
        }
        return longestSubstringKDistinct(s, k) - longestSubstringKDistinct(s, k - 1);
    }
}
```

<!-- slide -->
```javascript
class MaximumWindowSize {
    
    /**
     * Find the length of the longest substring with at most k distinct characters.
     */
    static longestSubstringKDistinct(s, k) {
        if (!s || s.length === 0 || k <= 0) {
            return 0;
        }
        
        const charCount = new Map();
        let left = 0;
        let distinct = 0;
        let maxLength = 0;
        
        for (let right = 0; right < s.length; right++) {
            const char = s[right];
            charCount.set(char, (charCount.get(char) || 0) + 1);
            if (charCount.get(char) === 1) {
                distinct++;
            }
            
            while (distinct > k) {
                const leftChar = s[left];
                charCount.set(leftChar, charCount.get(leftChar) - 1);
                if (charCount.get(leftChar) === 0) {
                    distinct--;
                }
                left++;
            }
            
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Find the length of the longest substring without repeating characters.
     */
    static longestSubstringWithoutRepeating(s) {
        if (!s || s.length === 0) {
            return 0;
        }
        
        const charIndex = new Map();
        let left = 0;
        let maxLength = 0;
        
        for (let right = 0; right < s.length; right++) {
            const char = s[right];
            
            if (charIndex.has(char) && charIndex.get(char) >= left) {
                left = charIndex.get(char) + 1;
            }
            
            charIndex.set(char, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Maximum fruits collected with at most 2 types of baskets.
     */
    static maxFruitsIntoBaskets(fruits) {
        if (!fruits || fruits.length === 0) {
            return 0;
        }
        
        const fruitCount = new Map();
        let left = 0;
        let maxFruits = 0;
        
        for (let right = 0; right < fruits.length; right++) {
            const fruit = fruits[right];
            fruitCount.set(fruit, (fruitCount.get(fruit) || 0) + 1);
            
            while (fruitCount.size > 2) {
                const leftFruit = fruits[left];
                fruitCount.set(leftFruit, fruitCount.get(leftFruit) - 1);
                if (fruitCount.get(leftFruit) === 0) {
                    fruitCount.delete(leftFruit);
                }
                left++;
            }
            
            maxFruits = Math.max(maxFruits, right - left + 1);
        }
        
        return maxFruits;
    }
    
    /**
     * Find longest substring with exactly k distinct characters.
     */
    static longestSubstringExactlyKDistinct(s, k) {
        if (!s || s.length === 0 || k <= 0) {
            return 0;
        }
        return this.longestSubstringKDistinct(s, k) - this.longestSubstringKDistinct(s, k - 1);
    }
}

// Convenience functions
function longestSubstringKDistinct(s, k) {
    return MaximumWindowSize.longestSubstringKDistinct(s, k);
}

function longestSubstringWithoutRepeating(s) {
    return MaximumWindowSize.longestSubstringWithoutRepeating(s);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed at most twice |
| **Space** | O(k) - Hashmap stores at most k distinct characters |

---

### Approach 3: Count Valid Subarrays

This approach counts all subarrays satisfying a given condition.

#### Algorithm Steps

1. Use two pointers (left, right) to define the window
2. Track the condition state as the window changes
3. For each right position, count how many left positions form a valid window
4. Move right and update state accordingly

#### Code Implementation

````carousel
```python
from typing import List
from collections import deque, defaultdict

class CountValidSubarrays:
    """
    Count the number of subarrays satisfying a given condition.
    Time: O(n), Space: O(1) or O(n)
    """
    
    @staticmethod
    def count_subarrays_with_sum_k(arr: List[int], k: int) -> int:
        """
        Count subarrays with sum exactly k.
        Uses prefix sum hashmap.
        
        Args:
            arr: Input array
            k: Target sum
            
        Returns:
            Number of subarrays with sum exactly k
        """
        prefix_count = defaultdict(int)
        prefix_count[0] = 1  # Empty prefix
        prefix_sum = 0
        count = 0
        
        for num in arr:
            prefix_sum += num
            count += prefix_count[prefix_sum - k]
            prefix_count[prefix_sum] += 1
        
        return count
    
    @staticmethod
    def count_subarrays_max_minus_min_leq_k(arr: List[int], k: int) -> int:
        """
        Count subarrays where max - min <= k.
        Uses two deques to track max and min.
        
        Args:
            arr: Input array
            k: Maximum allowed difference between max and min
            
        Returns:
            Number of valid subarrays
        """
        from collections import deque
        
        max_dq = deque()  # Decreasing deque for max
        min_dq = deque()  # Increasing deque for min
        count = 0
        left = 0
        
        for right in range(len(arr)):
            # Update max deque
            while max_dq and arr[max_dq[-1]] < arr[right]:
                max_dq.pop()
            max_dq.append(right)
            
            # Update min deque
            while min_dq and arr[min_dq[-1]] > arr[right]:
                min_dq.pop()
            min_dq.append(right)
            
            # Shrink window until condition is satisfied
            while left <= right and arr[max_dq[0]] - arr[min_dq[0]] > k:
                if max_dq[0] == left:
                    max_dq.popleft()
                if min_dq[0] == left:
                    min_dq.popleft()
                left += 1
            
            # All subarrays ending at right and starting at [left, right] are valid
            count += right - left + 1
        
        return count
    
    @staticmethod
    def count_subarrays_with_ones(arr: List[int]) -> int:
        """
        Count subarrays consisting of all 1's.
        For binary array with only 0s and 1s.
        
        Args:
            arr: Binary array (0s and 1s)
            
        Returns:
            Number of subarrays with all 1s
        """
        count = 0
        consecutive_ones = 0
        
        for num in arr:
            if num == 1:
                consecutive_ones += 1
                count += consecutive_ones
            else:
                consecutive_ones = 0
        
        return count
    
    @staticmethod
    def count_subarrays_less_than_k(arr: List[int], k: int) -> int:
        """
        Count subarrays where all elements are less than k.
        Uses sliding window approach.
        
        Args:
            arr: Input array
            k: Maximum value allowed
            
        Returns:
            Number of subarrays where all elements < k
        """
        count = 0
        left = 0
        
        for right in range(len(arr)):
            # Expand right, but if arr[right] >= k, reset
            while left <= right and arr[right] >= k:
                left = right + 1
            
            # All subarrays ending at right and starting at [left, right] are valid
            count += right - left + 1
        
        return count
    
    @staticmethod
    def count_subarrays_with_at_most_k_distinct(arr: List[int], k: int) -> int:
        """
        Count subarrays with at most k distinct integers.
        Uses sliding window.
        
        Args:
            arr: Input array
            k: Maximum number of distinct integers
            
        Returns:
            Number of valid subarrays
        """
        from collections import defaultdict
        
        count_freq = defaultdict(int)
        left = 0
        count = 0
        distinct = 0
        
        for right in range(len(arr)):
            num = arr[right]
            if count_freq[num] == 0:
                distinct += 1
            count_freq[num] += 1
            
            while distinct > k:
                left_num = arr[left]
                count_freq[left_num] -= 1
                if count_freq[left_num] == 0:
                    distinct -= 1
                left += 1
            
            count += right - left + 1
        
        return count


# Convenience functions
def count_subarrays_with_sum_k(arr: List[int], k: int) -> int:
    """Count subarrays with sum exactly k."""
    return CountValidSubarrays.count_subarrays_with_sum_k(arr, k)

def count_subarrays_max_minus_min(arr: List[int], k: int) -> int:
    """Count subarrays where max - min <= k."""
    return CountValidSubarrays.count_subarrays_max_minus_min_leq_k(arr, k)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <deque>
#include <algorithm>

class CountValidSubarrays {
public:
    /**
     * Count subarrays with sum exactly k.
     * Uses prefix sum hashmap.
     */
    static int countSubarraysWithSumK(const std::vector<int>& arr, int k) {
        std::unordered_map<int, int> prefixCount;
        prefixCount[0] = 1;  // Empty prefix
        int prefixSum = 0;
        int count = 0;
        
        for (int num : arr) {
            prefixSum += num;
            int needed = prefixSum - k;
            if (prefixCount.find(needed) != prefixCount.end()) {
                count += prefixCount[needed];
            }
            prefixCount[prefixSum]++;
        }
        
        return count;
    }
    
    /**
     * Count subarrays where max - min <= k.
     * Uses two deques.
     */
    static int countSubarraysMaxMinusMin(const std::vector<int>& arr, int k) {
        std::deque<int> maxDq;  // Decreasing deque for max
        std::deque<int> minDq;  // Increasing deque for min
        int count = 0;
        int left = 0;
        
        for (int right = 0; right < arr.size(); right++) {
            // Update max deque
            while (!maxDq.empty() && arr[maxDq.back()] < arr[right]) {
                maxDq.pop_back();
            }
            maxDq.push_back(right);
            
            // Update min deque
            while (!minDq.empty() && arr[minDq.back()] > arr[right]) {
                minDq.pop_back();
            }
            minDq.push_back(right);
            
            // Shrink window until condition is satisfied
            while (left <= right && arr[maxDq.front()] - arr[minDq.front()] > k) {
                if (maxDq.front() == left) {
                    maxDq.pop_front();
                }
                if (minDq.front() == left) {
                    minDq.pop_front();
                }
                left++;
            }
            
            // All subarrays ending at right are valid
            count += right - left + 1;
        }
        
        return count;
    }
    
    /**
     * Count subarrays consisting of all 1's (binary array).
     */
    static int countSubarraysWithOnes(const std::vector<int>& arr) {
        int count = 0;
        int consecutiveOnes = 0;
        
        for (int num : arr) {
            if (num == 1) {
                consecutiveOnes++;
                count += consecutiveOnes;
            } else {
                consecutiveOnes = 0;
            }
        }
        
        return count;
    }
    
    /**
     * Count subarrays with at most k distinct integers.
     */
    static int countSubarraysAtMostKDistinct(const std::vector<int>& arr, int k) {
        std::unordered_map<int, int> countFreq;
        int left = 0;
        int count = 0;
        int distinct = 0;
        
        for (int right = 0; right < arr.size(); right++) {
            int num = arr[right];
            if (countFreq[num] == 0) {
                distinct++;
            }
            countFreq[num]++;
            
            while (distinct > k) {
                int leftNum = arr[left];
                countFreq[leftNum]--;
                if (countFreq[leftNum] == 0) {
                    distinct--;
                }
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class CountValidSubarrays {
    
    /**
     * Count subarrays with sum exactly k.
     */
    public static int countSubarraysWithSumK(int[] arr, int k) {
        Map<Integer, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0, 1);  // Empty prefix
        int prefixSum = 0;
        int count = 0;
        
        for (int num : arr) {
            prefixSum += num;
            int needed = prefixSum - k;
            if (prefixCount.containsKey(needed)) {
                count += prefixCount.get(needed);
            }
            prefixCount.put(prefixSum, prefixCount.getOrDefault(prefixSum, 0) + 1);
        }
        
        return count;
    }
    
    /**
     * Count subarrays where max - min <= k.
     */
    public static int countSubarraysMaxMinusMin(int[] arr, int k) {
        Deque<Integer> maxDq = new ArrayDeque<>();  // Decreasing deque
        Deque<Integer> minDq = new ArrayDeque<>();  // Increasing deque
        int count = 0;
        int left = 0;
        
        for (int right = 0; right < arr.length; right++) {
            // Update max deque
            while (!maxDq.isEmpty() && arr[maxDq.peekLast()] < arr[right]) {
                maxDq.pollLast();
            }
            maxDq.addLast(right);
            
            // Update min deque
            while (!minDq.isEmpty() && arr[minDq.peekLast()] > arr[right]) {
                minDq.pollLast();
            }
            minDq.addLast(right);
            
            // Shrink window until condition is satisfied
            while (left <= right && arr[maxDq.peekFirst()] - arr[minDq.peekFirst()] > k) {
                if (maxDq.peekFirst() == left) {
                    maxDq.pollFirst();
                }
                if (minDq.peekFirst() == left) {
                    minDq.pollFirst();
                }
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
    
    /**
     * Count subarrays consisting of all 1's.
     */
    public static int countSubarraysWithOnes(int[] arr) {
        int count = 0;
        int consecutiveOnes = 0;
        
        for (int num : arr) {
            if (num == 1) {
                consecutiveOnes++;
                count += consecutiveOnes;
            } else {
                consecutiveOnes = 0;
            }
        }
        
        return count;
    }
    
    /**
     * Count subarrays with at most k distinct integers.
     */
    public static int countSubarraysAtMostKDistinct(int[] arr, int k) {
        Map<Integer, Integer> countFreq = new HashMap<>();
        int left = 0;
        int count = 0;
        int distinct = 0;
        
        for (int right = 0; right < arr.length; right++) {
            int num = arr[right];
            if (countFreq.getOrDefault(num, 0) == 0) {
                distinct++;
            }
            countFreq.put(num, countFreq.getOrDefault(num, 0) + 1);
            
            while (distinct > k) {
                int leftNum = arr[left];
                countFreq.put(leftNum, countFreq.get(leftNum) - 1);
                if (countFreq.get(leftNum) == 0) {
                    distinct--;
                }
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
class CountValidSubarrays {
    
    /**
     * Count subarrays with sum exactly k.
     */
    static countSubarraysWithSumK(arr, k) {
        const prefixCount = new Map();
        prefixCount.set(0, 1);
        let prefixSum = 0;
        let count = 0;
        
        for (const num of arr) {
            prefixSum += num;
            const needed = prefixSum - k;
            if (prefixCount.has(needed)) {
                count += prefixCount.get(needed);
            }
            prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
        }
        
        return count;
    }
    
    /**
     * Count subarrays where max - min <= k.
     */
    static countSubarraysMaxMinusMin(arr, k) {
        const maxDq = [];  // Decreasing deque for max
        const minDq = [];  // Increasing deque for min
        let count = 0;
        let left = 0;
        
        for (let right = 0; right < arr.length; right++) {
            // Update max deque
            while (maxDq.length > 0 && arr[maxDq[maxDq.length - 1]] < arr[right]) {
                maxDq.pop();
            }
            maxDq.push(right);
            
            // Update min deque
            while (minDq.length > 0 && arr[minDq[minDq.length - 1]] > arr[right]) {
                minDq.pop();
            }
            minDq.push(right);
            
            // Shrink window until condition is satisfied
            while (left <= right && arr[maxDq[0]] - arr[minDq[0]] > k) {
                if (maxDq[0] === left) {
                    maxDq.shift();
                }
                if (minDq[0] === left) {
                    minDq.shift();
                }
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
    
    /**
     * Count subarrays consisting of all 1's.
     */
    static countSubarraysWithOnes(arr) {
        let count = 0;
        let consecutiveOnes = 0;
        
        for (const num of arr) {
            if (num === 1) {
                consecutiveOnes++;
                count += consecutiveOnes;
            } else {
                consecutiveOnes = 0;
            }
        }
        
        return count;
    }
    
    /**
     * Count subarrays with at most k distinct integers.
     */
    static countSubarraysAtMostKDistinct(arr, k) {
        const countFreq = new Map();
        let left = 0;
        let count = 0;
        let distinct = 0;
        
        for (let right = 0; right < arr.length; right++) {
            const num = arr[right];
            if (countFreq.get(num) === undefined || countFreq.get(num) === 0) {
                distinct++;
            }
            countFreq.set(num, (countFreq.get(num) || 0) + 1);
            
            while (distinct > k) {
                const leftNum = arr[left];
                countFreq.set(leftNum, countFreq.get(leftNum) - 1);
                if (countFreq.get(leftNum) === 0) {
                    distinct--;
                }
                left++;
            }
            
            count += right - left + 1;
        }
        
        return count;
    }
}

// Convenience functions
function countSubarraysWithSumK(arr, k) {
    return CountValidSubarrays.countSubarraysWithSumK(arr, k);
}

function countSubarraysMaxMinusMin(arr, k) {
    return CountValidSubarrays.countSubarraysMaxMinusMin(arr, k);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is processed once (or constant times) |
| **Space** | O(k) or O(n) - Depends on state tracking requirements |

---

### Approach 4: Subarray Sum Equals K (Extended)

This approach handles exact sum queries using prefix sums.

#### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class SubarraySumEqualsK:
    """
    Find subarrays with sum exactly k.
    Multiple approaches for different scenarios.
    """
    
    @staticmethod
    def subarray_sum_k(arr: List[int], k: int) -> int:
        """
        Count subarrays with sum exactly k.
        Uses prefix sum hashmap.
        
        Args:
            arr: Input array (can contain negative numbers)
            k: Target sum
            
        Returns:
            Number of subarrays with sum exactly k
        """
        prefix_count = defaultdict(int)
        prefix_count[0] = 1  # Empty prefix
        prefix_sum = 0
        count = 0
        
        for num in arr:
            prefix_sum += num
            count += prefix_count[prefix_sum - k]
            prefix_count[prefix_sum] += 1
        
        return count
    
    @staticmethod
    def subarray_sum_k_positive_only(arr: List[int], k: int) -> int:
        """
        Count subarrays with sum exactly k.
        Optimized for positive integers only.
        
        Args:
            arr: Input array (positive integers only)
            k: Target sum
            
        Returns:
            Number of subarrays with sum exactly k
        """
        count = 0
        current_sum = 0
        left = 0
        
        for right in range(len(arr)):
            current_sum += arr[right]
            
            while current_sum > k and left <= right:
                current_sum -= arr[left]
                left += 1
            
            if current_sum == k:
                count += 1
        
        return count
    
    @staticmethod
    def subarray_sum_k_range(arr: List[int], k: int) -> List[List[int]]:
        """
        Find all subarrays with sum exactly k.
        
        Args:
            arr: Input array
            k: Target sum
            
        Returns:
            List of [start, end] pairs for all valid subarrays
        """
        prefix_map = defaultdict(list)
        prefix_map[0].append(-1)
        prefix_sum = 0
        result = []
        
        for i, num in enumerate(arr):
            prefix_sum += num
            needed = prefix_sum - k
            
            if needed in prefix_map:
                for start in prefix_map[needed]:
                    result.append([start + 1, i])
            
            prefix_map[prefix_sum].append(i)
        
        return result
    
    @staticmethod
    def minimum_size_subarray_k(arr: List[int], k: int) -> int:
        """
        Find minimum size subarray with sum exactly k.
        For positive integers only.
        
        Args:
            arr: Input array (positive integers)
            k: Target sum
            
        Returns:
            Minimum length of subarray with sum exactly k, or -1 if not found
        """
        if not arr or k <= 0:
            return -1
        
        left = 0
        current_sum = 0
        min_length = float('inf')
        
        for right in range(len(arr)):
            current_sum += arr[right]
            
            while current_sum >= k and left <= right:
                if current_sum == k:
                    min_length = min(min_length, right - left + 1)
                current_sum -= arr[left]
                left += 1
        
        return min_length if min_length != float('inf') else -1
    
    @staticmethod
    def subarray_sum_k_with_at_most_k_distinct(arr: List[int], k: int, max_distinct: int) -> int:
        """
        Count subarrays with sum exactly k and at most max_distinct elements.
        
        Args:
            arr: Input array
            k: Target sum
            max_distinct: Maximum number of distinct elements
            
        Returns:
            Number of valid subarrays
        """
        from collections import defaultdict
        
        count = 0
        prefix_sum = 0
        prefix_count = defaultdict(int)
        prefix_count[0] = 1
        
        for i, num in enumerate(arr):
            prefix_sum += num
            
            # Need prefix_sum - prev_sum = k
            # So prev_sum = prefix_sum - k
            needed = prefix_sum - k
            if needed in prefix_count:
                # Check distinct count for subarray [needed+1, i]
                subarray = arr[needed + 1: i + 1]
                if len(set(subarray)) <= max_distinct:
                    count += prefix_count[needed]
            
            prefix_count[prefix_sum] += 1
        
        return count


# Convenience functions
def subarray_sum_k(arr: List[int], k: int) -> int:
    """Count subarrays with sum exactly k."""
    return SubarraySumEqualsK.subarray_sum_k(arr, k)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <climits>
#include <list>

class SubarraySumEqualsK {
public:
    /**
     * Count subarrays with sum exactly k.
     * Uses prefix sum hashmap.
     */
    static int subarraySumK(const std::vector<int>& arr, int k) {
        std::unordered_map<int, int> prefixCount;
        prefixCount[0] = 1;  // Empty prefix
        int prefixSum = 0;
        int count = 0;
        
        for (int num : arr) {
            prefixSum += num;
            int needed = prefixSum - k;
            if (prefixCount.find(needed) != prefixCount.end()) {
                count += prefixCount[needed];
            }
            prefixCount[prefixSum]++;
        }
        
        return count;
    }
    
    /**
     * Count subarrays with sum exactly k (positive integers only).
     */
    static int subarraySumKPositive(const std::vector<int>& arr, int k) {
        int count = 0;
        int currentSum = 0;
        int left = 0;
        
        for (int right = 0; right < arr.size(); right++) {
            currentSum += arr[right];
            
            while (currentSum > k && left <= right) {
                currentSum -= arr[left];
                left++;
            }
            
            if (currentSum == k) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * Find all subarrays with sum exactly k.
     */
    static std::vector<std::vector<int>> subarraySumKAll(const std::vector<int>& arr, int k) {
        std::unordered_map<int, std::list<int>> prefixMap;
        prefixMap[0].push_back(-1);
        int prefixSum = 0;
        std::vector<std::vector<int>> result;
        
        for (int i = 0; i < arr.size(); i++) {
            prefixSum += arr[i];
            int needed = prefixSum - k;
            
            if (prefixMap.find(needed) != prefixMap.end()) {
                for (int start : prefixMap[needed]) {
                    result.push_back({start + 1, i});
                }
            }
            
            prefixMap[prefixSum].push_back(i);
        }
        
        return result;
    }
    
    /**
     * Find minimum size subarray with sum exactly k (positive integers only).
     */
    static int minSizeSubarrayK(const std::vector<int>& arr, int k) {
        if (arr.empty() || k <= 0) {
            return -1;
        }
        
        int left = 0;
        int currentSum = 0;
        int minLength = INT_MAX;
        
        for (int right = 0; right < arr.size(); right++) {
            currentSum += arr[right];
            
            while (currentSum >= k && left <= right) {
                if (currentSum == k) {
                    minLength = std::min(minLength, right - left + 1);
                }
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength == INT_MAX ? -1 : minLength;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class SubarraySumEqualsK {
    
    /**
     * Count subarrays with sum exactly k.
     */
    public static int subarraySumK(int[] arr, int k) {
        Map<Integer, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0, 1);
        int prefixSum = 0;
        int count = 0;
        
        for (int num : arr) {
            prefixSum += num;
            int needed = prefixSum - k;
            if (prefixCount.containsKey(needed)) {
                count += prefixCount.get(needed);
            }
            prefixCount.put(prefixSum, prefixCount.getOrDefault(prefixSum, 0) + 1);
        }
        
        return count;
    }
    
    /**
     * Count subarrays with sum exactly k (positive integers only).
     */
    public static int subarraySumKPositive(int[] arr, int k) {
        int count = 0;
        int currentSum = 0;
        int left = 0;
        
        for (int right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum > k && left <= right) {
                currentSum -= arr[left];
                left++;
            }
            
            if (currentSum == k) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * Find all subarrays with sum exactly k.
     */
    public static List<int[]> subarraySumKAll(int[] arr, int k) {
        Map<Integer, List<Integer>> prefixMap = new HashMap<>();
        prefixMap.put(0, new ArrayList<>(Arrays.asList(-1)));
        int prefixSum = 0;
        List<int[]> result = new ArrayList<>();
        
        for (int i = 0; i < arr.length; i++) {
            prefixSum += arr[i];
            int needed = prefixSum - k;
            
            if (prefixMap.containsKey(needed)) {
                for (int start : prefixMap.get(needed)) {
                    result.add(new int[]{start + 1, i});
                }
            }
            
            prefixMap.computeIfAbsent(prefixSum, x -> new ArrayList<>()).add(i);
        }
        
        return result;
    }
    
    /**
     * Find minimum size subarray with sum exactly k (positive integers only).
     */
    public static int minSizeSubarrayK(int[] arr, int k) {
        if (arr == null || arr.length == 0 || k <= 0) {
            return -1;
        }
        
        int left = 0;
        int currentSum = 0;
        int minLength = Integer.MAX_VALUE;
        
        for (int right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum >= k && left <= right) {
                if (currentSum == k) {
                    minLength = Math.min(minLength, right - left + 1);
                }
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength == Integer.MAX_VALUE ? -1 : minLength;
    }
}
```

<!-- slide -->
```javascript
class SubarraySumEqualsK {
    
    /**
     * Count subarrays with sum exactly k.
     */
    static subarraySumK(arr, k) {
        const prefixCount = new Map();
        prefixCount.set(0, 1);
        let prefixSum = 0;
        let count = 0;
        
        for (const num of arr) {
            prefixSum += num;
            const needed = prefixSum - k;
            if (prefixCount.has(needed)) {
                count += prefixCount.get(needed);
            }
            prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1);
        }
        
        return count;
    }
    
    /**
     * Count subarrays with sum exactly k (positive integers only).
     */
    static subarraySumKPositive(arr, k) {
        let count = 0;
        let currentSum = 0;
        let left = 0;
        
        for (let right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum > k && left <= right) {
                currentSum -= arr[left];
                left++;
            }
            
            if (currentSum === k) {
                count++;
            }
        }
        
        return count;
    }
    
    /**
     * Find all subarrays with sum exactly k.
     */
    static subarraySumKAll(arr, k) {
        const prefixMap = new Map();
        prefixMap.set(0, [-1]);
        let prefixSum = 0;
        const result = [];
        
        for (let i = 0; i < arr.length; i++) {
            prefixSum += arr[i];
            const needed = prefixSum - k;
            
            if (prefixMap.has(needed)) {
                for (const start of prefixMap.get(needed)) {
                    result.push([start + 1, i]);
                }
            }
            
            if (!prefixMap.has(prefixSum)) {
                prefixMap.set(prefixSum, []);
            }
            prefixMap.get(prefixSum).push(i);
        }
        
        return result;
    }
    
    /**
     * Find minimum size subarray with sum exactly k (positive integers only).
     */
    static minSizeSubarrayK(arr, k) {
        if (!arr || arr.length === 0 || k <= 0) {
            return -1;
        }
        
        let left = 0;
        let currentSum = 0;
        let minLength = Infinity;
        
        for (let right = 0; right < arr.length; right++) {
            currentSum += arr[right];
            
            while (currentSum >= k && left <= right) {
                if (currentSum === k) {
                    minLength = Math.min(minLength, right - left + 1);
                }
                currentSum -= arr[left];
                left++;
            }
        }
        
        return minLength === Infinity ? -1 : minLength;
    }
}

// Convenience functions
function subarraySumK(arr, k) {
    return SubarraySumEqualsK.subarraySumK(arr, k);
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through array |
| **Space** | O(n) - Hashmap stores prefix sums |

---

## General Code Templates

### Template 1: Minimum Window Size

````carousel
```python
from typing import List, Callable

def min_window_size(arr: List[int], condition: Callable) -> int:
    """
    Find minimum size subarray satisfying a condition.
    
    Args:
        arr: Input array
        condition: Function that takes (left, right, arr) and returns boolean
        
    Returns:
        Minimum length of subarray satisfying condition
    """
    left = 0
    min_length = float('inf')
    
    for right in range(len(arr)):
        # Expand window by moving right
        
        # Shrink window from left while condition is satisfied
        while left <= right and condition(left, right):
            min_length = min(min_length, right - left + 1)
            left += 1
    
    return min_length if min_length != float('inf') else 0
```

<!-- slide -->
```cpp
#include <vector>
#include <functional>

int minWindowSize(const std::vector<int>& arr, 
                  std::function<bool(int, int)> condition) {
    int left = 0;
    int minLength = INT_MAX;
    
    for (int right = 0; right < arr.size(); right++) {
        // Expand window
        
        while (left <= right && condition(left, right)) {
            minLength = std::min(minLength, right - left + 1);
            left++;
        }
    }
    
    return minLength == INT_MAX ? 0 : minLength;
}
```

<!-- slide -->
```java
import java.util.function.*;

public int minWindowSize(int[] arr, BiFunction<Integer, Integer, Boolean> condition) {
    int left = 0;
    int minLength = Integer.MAX_VALUE;
    
    for (int right = 0; right < arr.length; right++) {
        // Expand window
        
        while (left <= right && condition.apply(left, right)) {
            minLength = Math.min(minLength, right - left + 1);
            left++;
        }
    }
    
    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}
```

<!-- slide -->
```javascript
function minWindowSize(arr, condition) {
    let left = 0;
    let minLength = Infinity;
    
    for (let right = 0; right < arr.length; right++) {
        // Expand window
        
        while (left <= right && condition(left, right)) {
            minLength = Math.min(minLength, right - left + 1);
            left++;
        }
    }
    
    return minLength === Infinity ? 0 : minLength;
}
```
````

### Template 2: Maximum Window Size

````carousel
```python
from typing import List, Callable

def max_window_size(arr: List[int], condition: Callable) -> int:
    """
    Find maximum size subarray satisfying a condition.
    
    Args:
        arr: Input array
        condition: Function that takes (left, right, arr) and returns boolean
        
    Returns:
        Maximum length of subarray satisfying condition
    """
    left = 0
    max_length = 0
    
    for right in range(len(arr)):
        # Expand window by moving right
        
        # Shrink window from left while condition is violated
        while left <= right and not condition(left, right):
            left += 1
        
        # Update max length if condition is satisfied
        if condition(left, right):
            max_length = max(max_length, right - left + 1)
    
    return max_length
```

<!-- slide -->
```cpp
#include <vector>
#include <functional>

int maxWindowSize(const std::vector<int>& arr,
                 std::function<bool(int, int)> condition) {
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < arr.size(); right++) {
        // Expand window
        
        while (left <= right && !condition(left, right)) {
            left++;
        }
        
        if (condition(left, right)) {
            maxLength = std::max(maxLength, right - left + 1);
        }
    }
    
    return maxLength;
}
```

<!-- slide -->
```java
import java.util.function.*;

public int maxWindowSize(int[] arr, BiFunction<Integer, Integer, Boolean> condition) {
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < arr.length; right++) {
        // Expand window
        
        while (left <= right && !condition.apply(left, right)) {
            left++;
        }
        
        if (condition.apply(left, right)) {
            maxLength = Math.max(maxLength, right - left + 1);
        }
    }
    
    return maxLength;
}
```

<!-- slide -->
```javascript
function maxWindowSize(arr, condition) {
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < arr.length; right++) {
        // Expand window
        
        while (left <= right && !condition(left, right)) {
            left++;
        }
        
        if (condition(left, right)) {
            maxLength = Math.max(maxLength, right - left + 1);
        }
    }
    
    return maxLength;
}
```
````

### Template 3: Count Valid Subarrays

````carousel
```python
from typing import List, Callable

def count_valid_subarrays(arr: List[int], condition: Callable) -> int:
    """
    Count all subarrays satisfying a condition.
    
    Args:
        arr: Input array
        condition: Function that takes (left, right, arr) and returns boolean
        
    Returns:
        Number of subarrays satisfying condition
    """
    left = 0
    count = 0
    
    for right in range(len(arr)):
        # Expand window by moving right
        
        # Shrink window from left while condition is violated
        while left <= right and not condition(left, right):
            left += 1
        
        # All subarrays ending at right and starting at [left, right] are valid
        if condition(left, right):
            count += right - left + 1
    
    return count
```

<!-- slide -->
```cpp
#include <vector>
#include <functional>

long long countValidSubarrays(const std::vector<int>& arr,
                              std::function<bool(int, int)> condition) {
    int left = 0;
    long long count = 0;
    
    for (int right = 0; right < arr.size(); right++) {
        // Expand window
        
        while (left <= right && !condition(left, right)) {
            left++;
        }
        
        if (condition(left, right)) {
            count += right - left + 1;
        }
    }
    
    return count;
}
```

<!-- slide -->
```java
import java.util.function.*;

public long countValidSubarrays(int[] arr, BiFunction<Integer, Integer, Boolean> condition) {
    int left = 0;
    long count = 0;
    
    for (int right = 0; right < arr.length; right++) {
        // Expand window
        
        while (left <= right && !condition.apply(left, right)) {
            left++;
        }
        
        if (condition.apply(left, right)) {
            count += right - left + 1;
        }
    }
    
    return count;
}
```

<!-- slide -->
```javascript
function countValidSubarrays(arr, condition) {
    let left = 0;
    let count = 0;
    
    for (let right = 0; right < arr.length; right++) {
        // Expand window
        
        while (left <= right && !condition(left, right)) {
            left++;
        }
        
        if (condition(left, right)) {
            count += right - left + 1;
        }
    }
    
    return count;
}
```
````

---

## Comparison of Approaches

| Approach | Use Case | Time | Space | Key Insight |
|----------|----------|------|-------|-------------|
| **Minimum Window Size** | Find smallest valid window | O(n) | O(1) | Shrink when condition met |
| **Maximum Window Size** | Find largest valid window | O(n) | O(k) | Shrink when condition violated |
| **Count Valid Subarrays** | Count all valid windows | O(n) | O(1) | Add right-left+1 for each right |
| **Prefix Sum + Hashmap** | Exact sum queries | O(n) | O(n) | Use prefix sum complement |
| **Two Deques** | Track max/min in window | O(n) | O(k) | Maintain monotonic deques |

---

## Related Problems

### LeetCode Problems

| Problem | Difficulty | Description |
|---------|------------|-------------|
| **[209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)** | Medium | Minimum size subarray with sum >= target |
| **[3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)** | Medium | Longest substring without repeating characters |
| **[340. Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/)** | Medium | Longest substring with at most k distinct characters |
| **[904. Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/)** | Medium | Maximum fruits with 2 types |
| **[930. Binary Subarrays With Sum](https://leetcode.com/problems/binary-subarrays-with-sum/)** | Medium | Count subarrays with exact sum (binary) |
| **[992. Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/)** | Hard | Count subarrays with exactly k distinct |
| **[424. Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/)** | Medium | Longest substring with same chars after k replacements |
| **[1248. Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/)** | Medium | Count subarrays with exactly k odd numbers |
| **[1004. Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)** | Medium | Maximum consecutive ones after flipping k zeros |
| **[1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/)** | Medium | Longest subarray with max-min <= limit |
| **[159. Longest Substring with At Most Two Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/)** | Medium | Special case of k distinct characters |
| **[76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)** | Hard | Minimum window containing all characters |
| **[567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)** | Medium | Check if s2 contains permutation of s1 |

### Related Patterns

- **[Fixed Size Sliding Window](sliding-window-fixed-size-subarray-calculation.md)** - Basic sliding window with fixed size
- **[Monotonic Queue for Max/Min](sliding-window-monotonic-queue-for-max-min.md)** - Track extrema in sliding windows
- **[Two Pointers](two-pointers-converging-sorted-array-target-sum.md)** - Related array traversal technique
- **[Prefix Sum](prefix-sum-technique.md)** - Related technique for sum queries

---

## Video Tutorial Links

### Fundamentals

- [Minimum Size Subarray Sum - LeetCode 209 (NeetCode)](https://www.youtube.com/watch?v=oveCT41xEe0) - Comprehensive explanation
- [Longest Substring Without Repeating Characters - LeetCode 3](https://www.youtube.com/watch?v=wiFfO4e1Xh4) - Detailed walkthrough
- [Variable Size Sliding Window (Take U Forward)](https://www.youtube.com/watch?v=mkj8mS5p7cE) - Pattern explanation
- [Sliding Window Pattern (WilliamFiset)](https://www.youtube.com/watch?v=MK_Z7CnF7yU) - Algorithmic foundation

### Advanced Topics

- [Subarrays with K Different Integers - LeetCode 992](https://www.youtube.com/watch?v=agkyC7YHCXw) - Advanced counting
- [Fruit Into Baskets - LeetCode 904](https://www.youtube.com/watch?v=yDEOvE4KjKg) - Real-world application
- [Longest Repeating Character Replacement - LeetCode 424](https://www.youtube.com/watch?v=gL30j68C8V4) - Character frequency approach
- [Count Number of Nice Subarrays - LeetCode 1248](https://www.youtube.com/watch?v=3W2BmZ7U3AQ) - Odd/even counting

### Practice

- [14 Sliding Window Problems (NeetCode)](https://www.youtube.com/watch?v=MK-Z4hV-gM) - Practice problems
- [Sliding Window Masterclass (Take U Forward)](https://www.youtube.com/playlist?list=PLzjZaW71k84Q9A1X6DdGDGD8tmOKVMbdM) - Comprehensive playlist
- [Top Sliding Window Problems (Grind75)](https://www.youtube.com/playlist?list=PL6W8B3bX1l8l6w2X) - Top problems ranked

---

## Follow-up Questions

### Q1: When should I use prefix sum vs sliding window?

**Answer:**
- **Prefix Sum**: Use when you need exact sum queries, have negative numbers, or need to count subarrays with specific sums
- **Sliding Window**: Use when array has only positive numbers and you need min/max window size

Example:
```python
# Prefix sum for arrays with negatives
def subarray_sum_k(arr, k):
    prefix = defaultdict(int)
    prefix[0] = 1
    curr = 0
    for num in arr:
        curr += num
        count += prefix[curr - k]
        prefix[curr] += 1

# Sliding window for positive only
def min_size_subarray(arr, target):
    left = 0
    curr = float('inf')
    for right in range(len(arr)):
        curr += arr[right]
        while curr >= target:
            min_len = min(min_len, right - left + 1)
            curr -= arr[left]
            left += 1
```

---

### Q2: How do I handle the condition check efficiently?

**Answer:** Maintain state incrementally rather than recomputing:

```python
# Instead of recomputing sum each time:
while condition_recomputed(left, right):
    # ...

# Maintain state:
current_sum = 0
for right in range(n):
    current_sum += arr[right]  # Add new element
    
    while condition_violated(left, right):
        current_sum -= arr[left]  # Remove element
        left += 1
```

---

### Q3: How do I count subarrays with exactly K distinct instead of at most K?

**Answer:** Use the formula:
```
count(exactly K) = count(at most K) - count(at most K-1)
```

```python
def count_exactly_k_distinct(arr, k):
    return count_at_most_k_distinct(arr, k) - count_at_most_k_distinct(arr, k - 1)
```

---

### Q4: What's the difference between shrinking when condition is met vs violated?

**Answer:**
- **Shrink when met**: Used for minimum size - shrink to find smallest valid
- **Shrink when violated**: Used for maximum size - shrink to restore validity

```python
# Minimum size (shrink when met)
while sum >= target:
    min_len = min(min_len, right - left + 1)
    sum -= arr[left]
    left += 1

# Maximum size (shrink when violated)
while sum < target:
    left += 1
    # update max/min deques as needed
```

---

### Q5: How do I handle multiple conditions?

**Answer:** Combine conditions or track multiple states:

```python
# For multiple AND conditions
def is_valid(left, right):
    return condition1(left, right) and condition2(left, right)

# Track multiple states
current_sum = 0
current_min = float('inf')
current_max = 0
```

---

### Q6: What if the array is circular?

**Answer:** Duplicate the array and only consider windows starting within original bounds:

```python
def longest_circular_subarray(arr, condition):
    if len(arr) == 0:
        return 0
    
    extended = arr + arr
    max_length = 0
    left = 0
    
    for right in range(2 * len(arr)):
        # Process extended array
        
        # Only consider windows that start within original bounds
        if right - left + 1 > len(arr):
            left += 1
        
        if condition(left, right):
            max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

### Q7: How do I track multiple frequencies (for character problems)?

**Answer:** Use a hashmap for character counts:

```python
from collections import defaultdict

def longest_substring_k_distinct(s, k):
    char_count = defaultdict(int)
    left = 0
    max_length = 0
    
    for right, char in enumerate(s):
        char_count[char] += 1
        
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1
        
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

---

### Q8: What are common edge cases?

**Answer:** Common edge cases to handle:

1. **Empty array**: Return 0 or empty result
2. **Single element**: Check condition on single element
3. **All elements satisfy condition**: Handle efficiently
4. **No elements satisfy condition**: Return 0 or -1
5. **K = 0 or K = length**: Special handling needed
6. **Negative numbers**: May require prefix sum approach
7. **Large numbers**: Use appropriate data types

```python
def handle_edge_cases(arr, k):
    if not arr:
        return 0
    
    if len(arr) == 1:
        return 1 if condition(0, 0) else 0
    
    # ... rest of algorithm
```

---

### Q9: How do I debug variable window issues?

**Answer:** Add debug prints:

```python
def debug_variable_window(arr, target):
    left = 0
    min_len = float('inf')
    
    for right in range(len(arr)):
        print(f"Right: {right}, Element: {arr[right]}")
        
        while left <= right:
            window_sum = sum(arr[left:right+1])
            print(f"  Window [{left}, {right}]: sum={window_sum}")
            
            if window_sum >= target:
                min_len = min(min_len, right - left + 1)
                print(f"  Valid! Updated min_len to {min_len}")
                left += 1
            else:
                break
    
    return min_len if min_len != float('inf') else 0
```

---

### Q10: How do I optimize for multiple queries?

**Answer:** Precompute prefix sums for O(1) range queries:

```python
class SubarrayQuerier:
    def __init__(self, arr):
        self.prefix = [0]
        for num in arr:
            self.prefix.append(self.prefix[-1] + num)
    
    def range_sum(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]
    
    def count_subarrays_with_sum_k(self, k):
        # Use prefix sums for counting
        pass
```

---

### Q11: What's the space complexity and can it be optimized?

**Answer:**
- **Minimum/Maximum window size**: O(1) space
- **Counting with hashmap**: O(n) space for prefix counts
- **Character frequency**: O(k) space for distinct characters
- **Max/Min tracking**: O(k) space for deques

Space optimization tips:
- Reuse arrays instead of creating new ones
- Use in-place updates when possible
- Use efficient data structures (ArrayDeque vs LinkedList)

---

### Q12: How do I extend this to 2D arrays?

**Answer:** Use nested sliding windows or prefix sum 2D:

```python
def max_submatrix_sum_k(matrix, k):
    rows = len(matrix)
    cols = len(matrix[0])
    
    # Build prefix sum matrix
    prefix = [[0] * (cols + 1) for _ in range(rows + 1)]
    for i in range(rows):
        for j in range(cols):
            prefix[i + 1][j + 1] = (prefix[i][j + 1] + 
                                   prefix[i + 1][j] - 
                                   prefix[i][j] + 
                                   matrix[i][j])
    
    # Apply sliding window on row pairs
    for top in range(rows):
        for bottom in range(top, rows):
            # Use 1D sliding window on columns
            curr = [prefix[bottom + 1][col + 1] - prefix[top][col + 1] 
                   for col in range(cols)]
            # ... apply 1D sliding window on curr
```

---

### Q13: How do I handle streaming data?

**Answer:** Process in chunks with window state:

```python
class StreamingWindow:
    def __init__(self, condition):
        self.condition = condition
        self.window = []
        self.left = 0
    
    def add(self, value):
        self.window.append(value)
        
        while self.window and not self.condition(self.window):
            self.window.pop(0)
    
    def get_result(self):
        return self.window if self.condition(self.window) else []
```

---

### Q14: How do I combine with other patterns?

**Answer:** Variable window often combines with:

1. **Monotonic deques**: Track max/min while window changes
2. **Binary search**: Find optimal K using window check
3. **DP**: For complex conditions on subarrays
4. **Prefix sums**: For exact sum queries with negatives

```python
# Binary search + sliding window
def minimum_size_subarray(arr, target):
    def can_achieve(k):
        # Check if any subarray of size k has sum >= target
        window_sum = sum(arr[:k])
        if window_sum >= target:
            return True
        for i in range(k, len(arr)):
            window_sum += arr[i] - arr[i - k]
            if window_sum >= target:
                return True
        return False
    
    # Binary search on k
    left, right = 1, len(arr)
    while left < right:
        mid = (left + right) // 2
        if can_achieve(mid):
            right = mid
        else:
            left = mid + 1
    
    return left if can_achieve(left) else 0
```

---

### Q15: What are performance benchmarks?

**Answer:** Typical performance:

| Problem Type | Time | Space | Scale |
|--------------|------|-------|-------|
| Min window (positive) | O(n) | O(1) | 10^5 |
| Max window (distinct) | O(n) | O(k) | 10^5 |
| Count subarrays (prefix) | O(n) | O(n) | 10^5 |
| Complex conditions | O(n×c) | O(k) | 10^5 |

Where c = number of conditions tracked simultaneously.

---

## Summary

The Variable Size Sliding Window pattern is powerful for problems where:
1. Window size is not fixed
2. Condition defines validity
3. Optimal window needs to be found

Key takeaways:
- Use two pointers (left, right)
- Track state incrementally
- Shrink window appropriately based on condition
- Time complexity is typically O(n)
- Space complexity is O(1) or O(k)

Practice with the related problems to master this pattern!
