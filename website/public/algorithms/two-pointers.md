# Two Pointers

## Category
Arrays & Strings

## Description

The Two Pointers technique is a powerful algorithmic pattern that uses two pointers to traverse a data structure, typically arrays or strings. By strategically positioning and moving two pointers, we can solve many problems more efficiently than nested loops, often reducing time complexity from O(n²) to O(n).

This technique is particularly effective on sorted arrays and strings, where the directional movement of pointers allows us to systematically explore the search space without backtracking.

---

## When to Use

Use the Two Pointers algorithm when you need to solve problems involving:

- **Sorted Arrays**: Finding pairs that sum to a target value
- **String Manipulation**: Palindrome checking, string reversal
- **Subarray Problems**: Finding subarrays with certain properties
- **Removing Duplicates**: In-place deduplication of sorted arrays
- **Container Problems**: Finding maximum area/volume between boundaries

### Comparison with Alternatives

| Technique | Time Complexity | Space Complexity | Best Use Case |
|-----------|----------------|------------------|---------------|
| **Two Pointers** | O(n) | O(1) | Sorted arrays, pair sum, removing duplicates |
| **Brute Force** | O(n²) | O(1) | Small arrays, when simplicity matters |
| **Hash Map** | O(n) | O(n) | Unsorted arrays, need to track values |
| **Sliding Window** | O(n) | O(1) | Fixed window size problems |

### When to Choose Two Pointers vs Other Techniques

- **Choose Two Pointers** when:
  - The array/string is sorted (or can be sorted)
  - You need O(1) space solution
  - Problem involves searching from both ends
  - You're looking for pairs that satisfy a condition

- **Choose Hash Map** when:
  - Array is unsorted and cannot be modified
  - You need to track frequencies
  - Multiple lookups are needed

- **Choose Sliding Window** when:
  - Problem involves contiguous subarrays
  - Window size varies based on conditions
  - You need to maintain a running sum/product

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind Two Pointers is that by maintaining two pointers at different positions and strategically moving them based on the current state, we can explore all possible solutions in linear time. This works because:

1. **Monotonicity**: In sorted arrays, moving a pointer in one direction always increases or decreases the sum/comparison result predictably
2. **Complementary Search**: Two pointers from opposite ends can cover the entire search space exactly once
3. **In-place Modification**: No additional data structures needed for many transformations

### Types of Two Pointers

#### 1. Opposite Direction (Converging)
- One pointer at the start, one at the end
- Both pointers move toward each other
- **Common problems**: Pair sum, palindrome checking, container with most water

#### 2. Same Direction (Fast-Slow / Sliding)
- Both pointers start at the beginning
- One pointer moves faster (lead pointer)
- **Common problems**: Removing duplicates, cycle detection, partition problems

### How It Works

#### For Two Sum (Sorted Array):
1. Initialize `left` at index 0, `right` at index n-1
2. Calculate `current_sum = arr[left] + arr[right]`
3. If `current_sum == target`: Found the pair!
4. If `current_sum < target`: Move `left` right (need larger sum)
5. If `current_sum > target`: Move `right` left (need smaller sum)
6. Continue until `left >= right`

#### For Removing Duplicates:
1. Use `slow` pointer to track position of last unique element
2. `fast` pointer iterates through entire array
3. When `nums[fast] != nums[slow]`, increment `slow` and copy value

### Visual Representation

**Two Sum - Opposite Direction:**
```
Array: [1, 2, 3, 4, 5, 6, 7, 8, 9], Target: 10

Step 1: L→[1, 2, 3, 4, 5, 6, 7, 8]←R  → Sum = 9 < 10 → Move L
Step 2:   L→[1, 2, 3, 4, 5, 6, 7, 8]←R → Sum = 10 = 10 → Found!
```

**Remove Duplicates - Same Direction:**
```
Array: [1, 1, 1, 2, 2, 3, 3, 3, 4]

slow=0: [1, 1, 1, 2, 2, 3, 3, 3, 4]
         S  F

fast=1: Same as slow, skip
fast=2: Same as slow, skip
fast=3: Different! slow=1, copy 2
        [1, 2, 1, 2, 2, 3, 3, 3, 4]
           S     F

Continue until: [1, 2, 3, 4]
```

### Key Insights

- **Works best on sorted arrays** - monotonicity enables predictable pointer movement
- **Eliminates nested loops** - reduces O(n²) to O(n)
- **Reduces space complexity** to O(1) for most problems
- Both pointers only move forward or toward each other - never restart
- Each element is visited at most once - optimal for linear scan


### Works best on **sorted arrays** - monotonicity enables predictable pointer movement
- **Eliminates nested loops** - reduces O(n²) to O(n)
- **Reduces space complexity** to O(1) for most problems
- Both pointers only move forward or toward each other - never restart
- Each element is visited at most once - optimal for linear scan

---

## Algorithm Steps

### For Two Sum (Sorted Array):

1. **Initialize pointers**: Set `left = 0` (first element), `right = n-1` (last element)
2. **Calculate sum**: Compute `current_sum = arr[left] + arr[right]`
3. **Compare with target**:
   - If `current_sum == target`: Return indices `[left + 1, right + 1]` (1-indexed)
   - If `current_sum < target`: Increment `left` (need larger sum)
   - If `current_sum > target`: Decrement `right` (need smaller sum)
4. **Repeat**: Continue until `left >= right`
5. **No solution**: Return empty array if pointers cross

### For Removing Duplicates:

1. **Handle edge case**: If array is empty, return 0
2. **Initialize slow pointer**: Set `slow = 0` (position of last unique element)
3. **Iterate with fast pointer**: Loop through array with `fast` from 1 to n-1
4. **Check for difference**: If `nums[fast] != nums[slow]`:
   - Increment `slow`: `slow += 1`
   - Copy element: `nums[slow] = nums[fast]`
5. **Return length**: Return `slow + 1` (count of unique elements)

### For Container With Most Water:

1. **Initialize pointers**: `left = 0`, `right = n-1`
2. **Calculate area**: `area = (right - left) * min(heights[left], heights[right])`
3. **Update maximum**: Track maximum area seen
4. **Move shorter line**: Move pointer with smaller height (smaller height limits area)
5. **Repeat**: Continue until pointers meet

---

## Implementation

### Template Code (Two Sum, Remove Duplicates, Container With Most Water)

````carousel
```python
from typing import List, Tuple, Optional


def two_sum(nums: List[int], target: int) -> List[int]:
    """
    Find two numbers in sorted array that add up to target.
    Returns indices of the two numbers (1-indexed).
    
    Args:
        nums: Sorted array of integers (ascending)
        target: Target sum value
        
    Returns:
        List with indices of the two numbers (1-indexed)
        Empty list if no solution found
        
    Time: O(n)
    Space: O(1)
    """
    left = 0
    right = len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return []  # No solution found


def two_sum_all_pairs(nums: List[int], target: int) -> List[List[int]]:
    """
    Find all unique pairs that sum to target.
    Handles duplicate pairs by skipping duplicates after finding a match.
    
    Args:
        nums: Sorted array of integers
        target: Target sum value
        
    Returns:
        List of pairs [num1, num2] that sum to target
        
    Time: O(n)
    Space: O(1) excluding output
    """
    left = 0
    right = len(nums) - 1
    result = []
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            result.append([nums[left], nums[right]])
            left += 1
            right -= 1
            # Skip duplicates on left side
            while left < right and nums[left] == nums[left - 1]:
                left += 1
            # Skip duplicates on right side
            while left < right and nums[right] == nums[right + 1]:
                right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return result


def remove_duplicates(nums: List[int]) -> int:
    """
    Remove duplicates in-place from sorted array.
    Returns the length of array with unique elements.
    
    Args:
        nums: Sorted array (may contain duplicates)
        
    Returns:
        Length of array after removing duplicates
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    slow = 0  # Position of last unique element
    
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    
    return slow + 1


def container_with_most_water(heights: List[int]) -> int:
    """
    Find container that holds most water between two lines.
    
    Args:
        heights: Array of non-negative integers representing heights
        
    Returns:
        Maximum area of water container
        
    Time: O(n)
    Space: O(1)
    """
    left = 0
    right = len(heights) - 1
    max_area = 0
    
    while left < right:
        # Calculate current width and height
        width = right - left
        height = min(heights[left], heights[right])
        
        # Calculate and update area
        area = width * height
        max_area = max(max_area, area)
        
        # Move the shorter line - this is the key insight!
        # Moving taller line can only decrease or maintain area
        # Moving shorter line might find a taller line and increase area
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
    
    return max_area


def is_palindrome(s: str) -> bool:
    """
    Check if string is palindrome using two pointers.
    Ignores non-alphanumeric characters.
    
    Args:
        s: Input string
        
    Returns:
        True if palindrome, False otherwise
        
    Time: O(n)
    Space: O(1)
    """
    left = 0
    right = len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True


def reverse_string(s: List[str]) -> None:
    """
    Reverse string in-place using two pointers.
    
    Args:
        s: List of characters to reverse (modified in-place)
        
    Time: O(n)
    Space: O(1)
    """
    left = 0
    right = len(s) - 1
    
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1


def find_three_sum(nums: List[int], target: int) -> List[List[int]]:
    """
    Find all unique triplets that sum to target.
    Fix one element and use two pointers for remaining two.
    
    Args:
        nums: Sorted array of integers
        target: Target sum value
        
    Returns:
        List of unique triplets
        
    Time: O(n²)
    Space: O(1) excluding output
    """
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        # Skip duplicates for first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        # Two pointers for remaining two elements
        left = i + 1
        right = n - 1
        
        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]
            
            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                
                # Skip duplicates
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif current_sum < target:
                left += 1
            else:
                right -= 1
    
    return result


# Example usage and demonstration
if __name__ == "__main__":
    # Two Sum
    nums = [2, 7, 11, 15]
    target = 9
    print(f"Two Sum: {two_sum(nums, target)}")  # [1, 2]
    
    # All pairs
    nums2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    print(f"All pairs with sum 10: {two_sum_all_pairs(nums2, 10)}")
    # Output: [[1, 9], [2, 8], [3, 7], [4, 6]]
    
    # Remove duplicates
    nums3 = [1, 1, 2, 2, 2, 3, 4, 4, 5]
    length = remove_duplicates(nums3)
    print(f"Unique elements: {nums3[:length]}")
    
    # Container with most water
    heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
    print(f"Max water container: {container_with_most_water(heights)}")
    # Output: 49
    
    # Palindrome check
    print(f"Is 'A man, a plan, a canal: Panama' palindrome: {is_palindrome('A man, a plan, a canal: Panama')}")
    # Output: True
    
    # Reverse string
    s = ["h", "e", "l", "l", "o"]
    reverse_string(s)
    print(f"Reversed: {''.join(s)}")
    # Output: olleh
    
    # Three sum
    nums4 = [-1, 0, 1, 2, -1, -4]
    print(f"Three sum to 0: {find_three_sum(nums4, 0)}")
    # Output: [[-1, -1, 2], [-1, 0, 1]]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

/**
 * Two Pointers technique implementations.
 * 
 * Time Complexity: O(n) for most operations
 * Space Complexity: O(1) - in-place modifications
 */

/**
 * Find two numbers in sorted array that add up to target.
 * Returns indices (1-indexed) of the two numbers.
 */
vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left < right) {
        int current_sum = nums[left] + nums[right];
        
        if (current_sum == target) {
            return {left + 1, right + 1};  // 1-indexed
        } else if (current_sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return {};  // No solution
}

/**
 * Remove duplicates in-place from sorted array.
 * Returns length of array with unique elements.
 */
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int slow = 0;  // Position of last unique element
    
    for (int fast = 1; fast < nums.size(); fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;
}

/**
 * Find container that holds most water.
 */
int maxArea(vector<int>& heights) {
    int left = 0;
    int right = heights.size() - 1;
    int max_area = 0;
    
    while (left < right) {
        int width = right - left;
        int height = min(heights[left], heights[right]);
        int area = width * height;
        
        max_area = max(max_area, area);
        
        // Move the shorter line
        if (heights[left] < heights[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return max_area;
}

/**
 * Check if string is palindrome.
 * Ignores non-alphanumeric characters.
 */
bool isPalindrome(string s) {
    int left = 0;
    int right = s.length() - 1;
    
    while (left < right) {
        // Skip non-alphanumeric
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

/**
 * Reverse string in-place.
 */
void reverseString(vector<char>& s) {
    int left = 0;
    int right = s.size() - 1;
    
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}

/**
 * Find all unique triplets summing to target.
 */
vector<vector<int>> threeSum(vector<int>& nums, int target) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();
    
    for (int i = 0; i < n - 2; i++) {
        // Skip duplicates
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int left = i + 1;
        int right = n - 1;
        
        while (left < right) {
            int current_sum = nums[i] + nums[left] + nums[right];
            
            if (current_sum == target) {
                result.push_back({nums[i], nums[left], nums[right]});
                left++;
                right--;
                
                // Skip duplicates
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (current_sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}


int main() {
    // Two Sum
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << "Two Sum: [" << result[0] << ", " << result[1] << "]" << endl;
    
    // Remove duplicates
    vector<int> nums2 = {1, 1, 2, 2, 2, 3, 4, 4, 5};
    int length = removeDuplicates(nums2);
    cout << "Unique length: " << length << endl;
    
    // Max area
    vector<int> heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << "Max area: " << maxArea(heights) << endl;
    
    // Palindrome
    string s = "A man, a plan, a canal: Panama";
    cout << "Is palindrome: " << (isPalindrome(s) ? "true" : "false") << endl;
    
    // Reverse string
    vector<char> chars = {'h', 'e', 'l', 'l', 'o'};
    reverseString(chars);
    cout << "Reversed: ";
    for (char c : chars) cout << c;
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Two Pointers technique implementations.
 * 
 * Time Complexity: O(n) for most operations
 * Space Complexity: O(1) - in-place modifications
 */
public class TwoPointers {
    
    /**
     * Find two numbers in sorted array that add up to target.
     * Returns indices (1-indexed) of the two numbers.
     */
    public static List<Integer> twoSum(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            
            if (currentSum == target) {
                return Arrays.asList(left + 1, right + 1);  // 1-indexed
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return Collections.emptyList();  // No solution
    }
    
    /**
     * Find all unique pairs that sum to target.
     */
    public static List<List<Integer>> twoSumAllPairs(int[] nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            
            if (currentSum == target) {
                result.add(Arrays.asList(nums[left], nums[right]));
                left++;
                right--;
                
                // Skip duplicates
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        
        return result;
    }
    
    /**
     * Remove duplicates in-place from sorted array.
     * Returns length of array with unique elements.
     */
    public static int removeDuplicates(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        
        int slow = 0;  // Position of last unique element
        
        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }
        
        return slow + 1;
    }
    
    /**
     * Find container that holds most water.
     */
    public static int maxArea(int[] heights) {
        int left = 0;
        int right = heights.length - 1;
        int maxArea = 0;
        
        while (left < right) {
            int width = right - left;
            int height = Math.min(heights[left], heights[right]);
            int area = width * height;
            
            maxArea = Math.max(maxArea, area);
            
            // Move the shorter line
            if (heights[left] < heights[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxArea;
    }
    
    /**
     * Check if string is palindrome.
     * Ignores non-alphanumeric characters.
     */
    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        
        while (left < right) {
            // Skip non-alphanumeric
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            
            if (Character.toLowerCase(s.charAt(left)) != 
                Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            
            left++;
            right--;
        }
        
        return true;
    }
    
    /**
     * Reverse array in-place.
     */
    public static void reverseArray(char[] arr) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left < right) {
            char temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
    
    /**
     * Find all unique triplets summing to target.
     */
    public static List<List<Integer>> threeSum(int[] nums, int target) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();
        int n = nums.length;
        
        for (int i = 0; i < n - 2; i++) {
            // Skip duplicates
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            
            int left = i + 1;
            int right = n - 1;
            
            while (left < right) {
                int currentSum = nums[i] + nums[left] + nums[right];
                
                if (currentSum == target) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;
                    
                    // Skip duplicates
                    while (left < right && nums[left] == nums[left - 1]) left++;
                    while (left < right && nums[right] == nums[right + 1]) right--;
                } else if (currentSum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        // Two Sum
        int[] nums = {2, 7, 11, 15};
        List<Integer> result = twoSum(nums, 9);
        System.out.println("Two Sum: " + result);
        
        // Remove duplicates
        int[] nums2 = {1, 1, 2, 2, 2, 3, 4, 4, 5};
        int length = removeDuplicates(nums2);
        System.out.println("Unique length: " + length);
        
        // Max area
        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println("Max area: " + maxArea(heights));
        
        // Palindrome
        String s = "A man, a plan, a canal: Panama";
        System.out.println("Is palindrome: " + isPalindrome(s));
    }
}
```

<!-- slide -->
```javascript
/**
 * Two Pointers technique implementations.
 * 
 * Time Complexity: O(n) for most operations
 * Space Complexity: O(1) - in-place modifications
 */

/**
 * Find two numbers in sorted array that add up to target.
 * Returns indices (1-indexed) of the two numbers.
 * @param {number[]} nums - Sorted array of integers
 * @param {number} target - Target sum
 * @returns {number[]} Indices (1-indexed) or empty array
 */
function twoSum(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const currentSum = nums[left] + nums[right];
        
        if (currentSum === target) {
            return [left + 1, right + 1];  // 1-indexed
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];  // No solution
}

/**
 * Find all unique pairs that sum to target.
 * @param {number[]} nums - Sorted array of integers
 * @param {number} target - Target sum
 * @returns {number[][]} Array of pairs
 */
function twoSumAllPairs(nums, target) {
    nums.sort((a, b) => a - b);
    const result = [];
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const currentSum = nums[left] + nums[right];
        
        if (currentSum === target) {
            result.push([nums[left], nums[right]]);
            left++;
            right--;
            
            // Skip duplicates
            while (left < right && nums[left] === nums[left - 1]) left++;
            while (left < right && nums[right] === nums[right + 1]) right--;
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return result;
}

/**
 * Remove duplicates in-place from sorted array.
 * @param {number[]} nums - Sorted array (modified in-place)
 * @returns {number} Length of array with unique elements
 */
function removeDuplicates(nums) {
    if (!nums || nums.length === 0) return 0;
    
    let slow = 0;  // Position of last unique element
    
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1;
}

/**
 * Find container that holds most water.
 * @param {number[]} heights - Array of heights
 * @returns {number} Maximum area
 */
function maxArea(heights) {
    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;
    
    while (left < right) {
        const width = right - left;
        const height = Math.min(heights[left], heights[right]);
        const area = width * height;
        
        maxArea = Math.max(maxArea, area);
        
        // Move the shorter line
        if (heights[left] < heights[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}

/**
 * Check if string is palindrome.
 * Ignores non-alphanumeric characters.
 * @param {string} s - Input string
 * @returns {boolean} True if palindrome
 */
function isPalindrome(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Skip non-alphanumeric
        while (left < right && !isAlphaNumeric(s[left])) left++;
        while (left < right && !isAlphaNumeric(s[right])) right--;
        
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

/**
 * Helper function to check if character is alphanumeric
 */
function isAlphaNumeric(char) {
    const code = char.charCodeAt(0);
    return (code >= 48 && code <= 57) ||  // 0-9
           (code >= 65 && code <= 90) ||  // A-Z
           (code >= 97 && code <= 122);   // a-z
}

/**
 * Reverse array in-place.
 * @param {any[]} arr - Array to reverse (modified in-place)
 */
function reverseArray(arr) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}

/**
 * Find all unique triplets summing to target.
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @returns {number[][]} Array of triplets
 */
function threeSum(nums, target) {
    nums.sort((a, b) => a - b);
    const result = [];
    const n = nums.length;
    
    for (let i = 0; i < n - 2; i++) {
        // Skip duplicates
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = n - 1;
        
        while (left < right) {
            const currentSum = nums[i] + nums[left] + nums[right];
            
            if (currentSum === target) {
                result.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
                
                // Skip duplicates
                while (left < right && nums[left] === nums[left - 1]) left++;
                while (left < right && nums[right] === nums[right + 1]) right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}


// Example usage and demonstration
const nums = [2, 7, 11, 15];
console.log('Two Sum:', twoSum(nums, 9));  // [1, 2]

const nums2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log('All pairs with sum 10:', twoSumAllPairs(nums2, 10));
// [[1, 9], [2, 8], [3, 7], [4, 6]]

const nums3 = [1, 1, 2, 2, 2, 3, 4, 4, 5];
console.log('Unique length:', removeDuplicates([...nums3]));  // 5

const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
console.log('Max area:', maxArea(heights));  // 49

console.log('Is palindrome:', isPalindrome('A man, a plan, a canal: Panama'));  // true

const s = ['h', 'e', 'l', 'l', 'o'];
reverseArray(s);
console.log('Reversed:', s.join(''));  // olleh

const nums4 = [-1, 0, 1, 2, -1, -4];
console.log('Three sum to 0:', threeSum(nums4, 0));
// [[-1, -1, 2], [-1, 0, 1]]
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Two Sum (sorted)** | O(n) | Single pass with two pointers |
| **Remove Duplicates** | O(n) | Each element visited once |
| **Container With Most Water** | O(n) | Each element visited at most once |
| **Palindrome Check** | O(n) | Single pass from both ends |
| **Reverse Array** | O(n) | Half the array is swapped |
| **Three Sum** | O(n²) | Fix one element, O(n) two pointers × O(n) fixed elements |

### Detailed Breakdown

- **Two Sum**: Both pointers move monotonically toward each other, each at most n steps → O(n)
- **Remove Duplicates**: Fast pointer traverses entire array once → O(n)
- **Container With Most Water**: Each pointer moves at most n times → O(n)
- **Three Sum**: Outer loop O(n), inner two pointers O(n) → O(n²)

---

## Space Complexity Analysis

| Problem Variant | Space Complexity | Notes |
|-----------------|------------------|-------|
| **Two Sum** | O(1) | Only pointer variables |
| **All Pairs** | O(1) excluding output | Result array not counted |
| **Remove Duplicates** | O(1) | In-place modification |
| **Container With Most Water** | O(1) | Only pointers and max tracking |
| **Three Sum** | O(1) excluding output | Sorting may be in-place |

### Space Optimization Notes

- All implementations use **O(1) extra space** (excluding output)
- Sorting algorithms may use O(n) or O(log n) extra space depending on implementation
- For truly in-place operations, use in-place sorting algorithms

---

## Common Variations

### 1. Opposite Direction (Converging Pointers)

Both pointers start at opposite ends and move toward each other.

**Use Cases:**
- Finding pair that sums to target (sorted array)
- Checking palindrome
- Finding container with most water

````carousel
```python
# Two Sum - Opposite Direction
def two_sum_opposite(nums: list, target: int) -> list:
    left, right = 0, len(nums) - 1
    
    while left < right:
        current = nums[left] + nums[right]
        
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    
    return []
```
````

### 2. Same Direction (Fast-Slow Pointers)

Both pointers start at the beginning, with one moving faster.

**Use Cases:**
- Removing duplicates from sorted array
- Finding cycle in linked list
- Partition problems

````carousel
```python
# Remove Duplicates - Same Direction (Fast-Slow)
def remove_duplicates_fast_slow(nums: list) -> int:
    slow = 0
    
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    
    return slow + 1
```
````

### 3. Sliding Window Variation

Both pointers move in the same direction, maintaining a window.

**Use Cases:**
- Finding subarrays with sum less than K
- Minimum size subarray sum

````carousel
```python
# Sliding Window - Minimum Size Subarray Sum
def min_subarray_len(target: int, nums: list) -> int:
    left = 0
    current_sum = 0
    min_length = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return 0 if min_length == float('inf') else min_length
```
````

### 4. Fixed One Pointer + Two Pointers

Fix one element and use two pointers for the remaining elements.

**Use Cases:**
- 3Sum, 4Sum problems
- Triplet problems

````carousel
```python
# Three Sum - Fixed + Two Pointers
def three_sum(nums: list, target: int) -> list:
    nums.sort()
    result = []
    n = len(nums)
    
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        
        left, right = i + 1, n - 1
        
        while left < right:
            current = nums[i] + nums[left] + nums[right]
            
            if current == target:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
            elif current < target:
                left += 1
            else:
                right -= 1
    
    return result
```
````

---

## Practice Problems

### Problem 1: Valid Palindrome

**Problem:** [LeetCode 125 - Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

**Description:** Given a string `s`, determine if it is a palindrome, considering only alphanumeric characters and ignoring case.

**How to Apply Two Pointers:**
- Use two pointers at start and end
- Skip non-alphanumeric characters
- Compare characters from both ends
- Time: O(n), Space: O(1)

---

### Problem 2: Container With Most Water

**Problem:** [LeetCode 11 - Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

**Description:** Given `n` non-negative integers `height[i]` where each represents a line, find two lines that together with the x-axis form a container that holds the most water.

**How to Apply Two Pointers:**
- Initialize pointers at both ends
- Calculate area using shorter height
- Move the pointer with shorter height (key insight!)
- Track maximum area seen

---

### Problem 3: 3Sum

**Problem:** [LeetCode 15 - 3Sum](https://leetcode.com/problems/3sum/)

**Description:** Given an integer array `nums`, return all unique triplets `[a, b, c]` where `a + b + c = 0`.

**How to Apply Two Pointers:**
- Sort the array first
- Fix one element, use two pointers for remaining two
- Skip duplicates to avoid repeated triplets
- Time: O(n²), Space: O(1) excluding output

---

### Problem 4: Remove Duplicates from Sorted Array

**Problem:** [LeetCode 26 - Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

**Description:** Given a sorted array `nums`, remove duplicates in-place and return the new length.

**How to Apply Two Pointers:**
- Use slow pointer for position of last unique element
- Fast pointer traverses entire array
- Copy when value differs from slow position

---

### Problem 5: Sum of Subarray Minimums

**Problem:** [LeetCode 907 - Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)

**Description:** Given an array of integers `arr`, find the sum of subarray minimums of all subarrays.

**How to Apply Two Pointers (with monotonic stack):**
- For each element, find range where it's the minimum
- Use two pointers/stack to track previous and next smaller elements
- Calculate contribution of each element

---

## Video Tutorial Links

### Fundamentals

- [Two Pointers Technique - Introduction (Take U Forward)](https://www.youtube.com/watch?v=-gjxg6BrN2I) - Comprehensive introduction
- [Two Pointers Pattern (NeetCode)](https://www.youtube.com/watch?v=OnX3fB3Awqk) - Practical implementation guide
- [Two Pointer Approach (WilliamFiset)](https://www.youtube.com/watch?v=a7R1j8hE3pM) - Detailed explanation

### Problem-Specific Tutorials

- [Container With Most Water (LeetCode)](https://www.youtube.com/watch?v=UvR5sWQeDyw) - Intuition and solution
- [3Sum Problem (LeetCode)](https://www.youtube.com/watch?v=jzZsG8n2R9A) - Handling duplicates
- [Valid Palindrome (LeetCode)](https://www.youtube.com/watch?v=jJ3nS4Xj8F4) - String manipulation with two pointers

### Advanced Variations

- [Fast and Slow Pointers - Linked List Cycle](https://www.youtube.com/watch?v=gB0c1u4J5G4) - Cycle detection
- [Sliding Window Technique](https://www.youtube.com/watch?v=Mc1kef3BhVE) - Variable window size

---

## Follow-up Questions

### Q1: Why do we move the shorter line in "Container With Most Water"?

**Answer:** The area is limited by the shorter line (`height = min(left_height, right_height)`). If we move the taller line, the height can only stay the same or decrease (since we're looking for a potentially taller line to increase area). By moving the shorter line, we might find a taller line that could increase the area despite the decreased width.

### Q2: Can Two Pointers work on unsorted arrays?

**Answer:** For pair sum problems, the array must be sorted (or we sort it first). However, for problems like removing duplicates, the array should be sorted. For palindrome checking and string reversal, the data structure (string) doesn't need sorting.

### Q3: What's the difference between Two Pointers and Sliding Window?

**Answer:** 
- **Two Pointers**: Pointers can move independently, often in opposite directions. Used for finding pairs, palindromes, etc.
- **Sliding Window**: Both pointers move in the same direction, maintaining a contiguous window. Used for subarray problems with constraints on window size or content.

### Q4: How does Two Pointers achieve O(n) time complexity?

**Answer:** Each pointer moves at most n times total (not n times per iteration). Since both pointers only move forward or toward each other without backtracking, the total number of movements is O(n), making the overall complexity O(n).

### Q5: Can Two Pointers be combined with other techniques?

**Answer:** Absolutely! Common combinations include:
- **Two Pointers + Hash Map**: For handling duplicates or counting
- **Two Pointers + Binary Search**: For finding positions
- **Two Pointers + Recursion**: For backtracking problems
- **Two Pointers + Sorting**: As preprocessing step

---

## Summary

The Two Pointers technique is an essential algorithmic pattern for solving array and string problems efficiently. Key takeaways:

- **Linear Time**: Reduces O(n²) brute force to O(n) for many problems
- **O(1) Space**: Most implementations use constant extra space
- **Sorted Arrays**: Works best on sorted data due to monotonicity
- **Two Variants**: Opposite direction (converging) and same direction (fast-slow)
- **Versatile**: Can be combined with other techniques

When to use:
- ✅ Finding pairs that satisfy a condition in sorted arrays
- ✅ Removing duplicates from sorted arrays
- ✅ Palindrome checking
- ✅ Container/volume problems
- ❌ Unsorted arrays for pair sum (use hash map instead)
- ❌ When you need to find all possible pairs without sorting first

This pattern is fundamental in competitive programming and technical interviews. Master it along with Sliding Window to handle most array traversal problems efficiently.

---

## Related Algorithms

- [Sliding Window](./sliding-window.md) - Similar pattern, same direction movement
- [Binary Search](./binary-search.md) - When to use pointers with divide and conquer
- [Prefix Sum](./prefix-sum.md) - For range sum queries
- [Fast and Slow Pointers](./fast-slow-pointers.md) - For cycle detection in linked lists
