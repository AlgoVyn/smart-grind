# Fast & Slow Pointers

## Category
Linked List

## Description

The Fast and Slow Pointers technique (also known as **Floyd's Cycle Detection Algorithm**) uses two pointers moving at different speeds to solve problems involving linked structures and iterative patterns. This elegant technique enables detecting cycles, finding middle elements, and solving various pattern recognition problems in **O(n) time** with **O(1) space**.

---

## When to Use

Use the Fast & Slow Pointers algorithm when you need to solve problems involving:

- **Cycle Detection**: Detecting whether a linked list or sequence has a cycle
- **Finding Middle Element**: Locating the middle of a linked list in one pass
- **Happy Number Detection**: Determining if a number eventually reaches 1
- **Circular Array Problems**: Finding duplicates in circular arrays
- **Linked List Manipulation**: Removing cycles, finding cycle start points

### Comparison with Alternatives

| Technique | Use Case | Time Complexity | Space Complexity | Notes |
|-----------|----------|-----------------|-------------------|-------|
| **Fast & Slow Pointers** | Cycle detection, middle finding | O(n) | O(1) | Single pass, elegant solution |
| **Hash Set** | Cycle detection | O(n) | O(n) | Uses extra memory |
| **Brute Force** | Cycle detection | O(n²) | O(1) | Inefficient, not recommended |
| **Two-pass** | Find middle | O(n) | O(1) | Requires knowing length first |

### When to Choose Fast & Slow Pointers vs Hash Set

- **Choose Fast & Slow Pointers** when:
  - You need O(1) space complexity
  - You're only detecting existence of a cycle (not need to identify nodes)
  - You want an elegant, mathematical approach
  - Finding the middle element is also required

- **Choose Hash Set** when:
  - You need to identify specific nodes in the cycle
  - You need to track all visited nodes
  - The problem requires storing additional information about nodes

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind the Fast & Slow Pointers technique is based on relative speed and modular arithmetic. When two pointers move at different speeds through a cycle, the faster pointer will eventually "lap" the slower pointer because the difference in their positions decreases by one in each iteration.

### How It Works

#### Phase 1: Detect Cycle
1. Initialize both pointers at the start of the linked structure
2. **Slow pointer** moves one step at a time (pointer to `next`)
3. **Fast pointer** moves two steps at a time (pointer to `next.next`)
4. If fast pointer catches up to slow pointer → **cycle exists**
5. If fast pointer reaches end (null) → **no cycle**

#### Phase 2: Find Cycle Start (Optional)
Once a cycle is detected, to find where it starts:
1. Reset one pointer to the head
2. Move both pointers one step at a time
3. Where they meet is the cycle start node
4. **Mathematical proof**: Distance from head to cycle start equals distance from meeting point to cycle start

#### Phase 3: Find Middle
When finding the middle of a linked list:
1. Move both pointers at the same speed ratio (1:2)
2. When fast reaches the end, slow is at the middle
3. For even-length lists, returns the second middle node

### Visual Representation

```
Linked List with Cycle:  1 → 2 → 3 → 4 → 5
                              ↑         ↓
                              ←←←←←←←←←←

Iteration 0:  Slow=1, Fast=1
Iteration 1:  Slow=2, Fast=3
Iteration 2:  Slow=3, Fast=5
Iteration 3:  Slow=4, Fast=2 (enters cycle)
Iteration 4:  Slow=5, Fast=4
Iteration 5:  Slow=1, Fast=3
Iteration 6:  Slow=2, Fast=5
Iteration 7:  Slow=3, Fast=2 ← THEY MEET! Cycle detected!
```

### Why It Works - Mathematical Proof

In a cyclic list with cycle length λ:
- Let μ be the distance from head to cycle start
- After μ iterations, slow enters the cycle at position 0
- Fast is already in the cycle at position (μ mod λ)
- Relative distance between them: λ - (μ mod λ)
- Each iteration reduces this by 1
- They must meet within at most λ iterations

### Key Insights

- **Cycle detection time**: O(μ + λ) where μ is distance to cycle, λ is cycle length
- If fast reaches null, no cycle exists
- When they meet, slow has traveled d steps, fast has traveled 2d steps
- Meeting point is always within the cycle
- The technique works on any iterable with "next" concept

### Limitations

- **Only works for linear traversal**: Cannot detect cycles in graphs with branching
- **Single cycle assumption**: May not work with multiple cycles
- **Requires pointer access**: Needs ability to traverse via "next" pointers
- **Cannot identify all cycle nodes**: Only detects existence and start point

---

## Algorithm Steps

### For Cycle Detection

1. **Initialize pointers**: Set both `slow` and `fast` to the head of the list
2. **Edge case check**: If head is null or has no next, return false (no cycle)
3. **Iterate**: While fast and fast.next exist:
   - Move slow by one: `slow = slow.next`
   - Move fast by two: `fast = fast.next.next`
   - Check if they meet: `if slow == fast`, return true (cycle found)
4. **Terminate**: If loop exits, return false (fast reached end)

### For Finding Cycle Start

1. **Detect cycle** (same as above)
2. **Reset one pointer**: Set slow back to head, keep fast at meeting point
3. **Move together**: Advance both by one step until they meet
4. **Meeting point**: This is the cycle start node

### For Finding Middle

1. **Initialize**: Both pointers at head
2. **Traverse**: While fast and fast.next exist:
   - Move slow by one
   - Fast by two
3. **End condition**: When fast reaches end, slow is at middle
4. **Return**: slow pointer (second middle for even-length lists)

---

## Implementation

### Template Code (Cycle Detection & Related Problems)

````carousel
```python
from typing import Optional, List

class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val: int = 0, next: 'ListNode' = None):
        self.val = val
        self.next = next


def has_cycle(head: Optional[ListNode]) -> bool:
    """
    Detect if a cycle exists in linked list using Floyd's algorithm.
    
    Args:
        head: Head of the linked list
        
    Returns:
        True if cycle exists, False otherwise
        
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next        # Move slow by 1
        fast = fast.next.next   # Move fast by 2
        
        if slow == fast:        # They met - cycle exists!
            return True
    
    return False


def find_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Find the starting node of the cycle if it exists.
    
    Mathematical theorem: Distance from head to cycle start = 
                         Distance from meeting point to cycle start
    
    Args:
        head: Head of the linked list
        
    Returns:
        Node where cycle starts, or None if no cycle
        
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    
    # No cycle found
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle start
    # Move both pointers one step at a time
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow


def find_middle(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Find the middle of the linked list.
    
    When fast reaches end, slow is at middle.
    For even-length lists, returns the second middle node.
    
    Args:
        head: Head of the linked list
        
    Returns:
        Middle node
        
    Time: O(n)
    Space: O(1)
    """
    if not head:
        return None
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow


def is_happy_number(n: int) -> bool:
    """
    Determine if a number is happy.
    
    A happy number is defined by repeatedly replacing the number
    with the sum of squares of its digits, and repeating until
    the number equals 1 (happy), or it loops endlessly in a cycle.
    
    Uses Floyd's cycle detection algorithm!
    
    Args:
        n: Input number
        
    Returns:
        True if happy number, False otherwise
        
    Time: O(log n) - digits reduce logarithmically
    Space: O(1)
    """
    def get_next(num: int) -> int:
        """Calculate sum of squares of digits."""
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    if n <= 0:
        return False
    
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1


def find_duplicate(nums: List[int]) -> int:
    """
    Find the duplicate number in an array of 1 to n.
    
    Treats the array as a linked list where:
    - index i points to nums[i]
    - The duplicate creates a cycle
    
    Uses the fast-slow pointers technique!
    
    Args:
        nums: List of integers with one duplicate
        
    Returns:
        The duplicate number
        
    Time: O(n)
    Space: O(1)
    """
    # Phase 1: Find intersection
    slow = nums[0]
    fast = nums[0]
    
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Phase 2: Find cycle start (the duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow


# Example usage and demonstration
if __name__ == "__main__":
    # Create a linked list with cycle: 1 -> 2 -> 3 -> 4 -> 5
    #                                              ↑        ↓
    #                                              ←←←←←←←←
    
    # Build the list
    node1 = ListNode(1)
    node2 = ListNode(2)
    node3 = ListNode(3)
    node4 = ListNode(4)
    node5 = ListNode(5)
    
    node1.next = node2
    node2.next = node3
    node3.next = node4
    node4.next = node5
    node5.next = node2  # Creates cycle: 5 -> 2
    
    # Test cycle detection
    print("Cycle Detection Test:")
    print(f"  Has cycle: {has_cycle(node1)}")  # True
    print(f"  Cycle starts at node with value: {find_cycle_start(node1).val}")  # 2
    
    # Test middle finding (create list without cycle)
    node_a = ListNode(1)
    node_b = ListNode(2)
    node_c = ListNode(3)
    node_d = ListNode(4)
    node_e = ListNode(5)
    
    node_a.next = node_b
    node_b.next = node_c
    node_c.next = node_d
    node_d.next = node_e
    
    print("\nMiddle Finding Test:")
    print(f"  Middle node: {find_middle(node_a).val}")  # 3
    
    # Test happy number
    print("\nHappy Number Test:")
    print(f"  19 is happy: {is_happy_number(19)}")  # True
    print(f"  2 is happy: {is_happy_number(2)}")    # False
    
    # Test duplicate finding
    print("\nDuplicate Finding Test:")
    print(f"  Duplicate in [1,3,4,2,2]: {find_duplicate([1,3,4,2,2])}")  # 2
```

<!-- slide -->
```cpp
#include <iostream>
#include <unordered_set>
using namespace std;

/**
 * Definition for singly-linked list node.
 */
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

/**
 * Detect if a cycle exists in linked list using Floyd's algorithm.
 * 
 * Time: O(n)
 * Space: O(1)
 */
bool hasCycle(ListNode* head) {
    if (!head || !head->next) return false;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        
        if (slow == fast) return true;
    }
    
    return false;
}

/**
 * Find the starting node of the cycle if it exists.
 * 
 * Mathematical theorem: Distance from head to cycle start = 
 *                      Distance from meeting point to cycle start
 * 
 * Time: O(n)
 * Space: O(1)
 */
ListNode* findCycleStart(ListNode* head) {
    if (!head || !head->next) return nullptr;
    
    // Phase 1: Find meeting point
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) break;
    }
    
    if (!fast || !fast->next) return nullptr;
    
    // Phase 2: Find cycle start
    slow = head;
    while (slow != fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    return slow;
}

/**
 * Find the middle of the linked list.
 * For even-length lists, returns the second middle node.
 * 
 * Time: O(n)
 * Space: O(1)
 */
ListNode* findMiddle(ListNode* head) {
    if (!head) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}

/**
 * Determine if a number is happy using Floyd's algorithm.
 * 
 * Time: O(log n)
 * Space: O(1)
 */
int getNext(int n) {
    int total = 0;
    while (n > 0) {
        int digit = n % 10;
        total += digit * digit;
        n /= 10;
    }
    return total;
}

bool isHappyNumber(int n) {
    if (n <= 0) return false;
    
    int slow = n;
    int fast = getNext(n);
    
    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast == 1;
}

/**
 * Find duplicate in array [1, n] using cycle detection.
 * 
 * Time: O(n)
 * Space: O(1)
 */
int findDuplicate(vector<int>& nums) {
    // Phase 1: Find intersection
    int slow = nums[0];
    int fast = nums[0];
    
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    
    // Phase 2: Find cycle start (duplicate)
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;


int main() {
    // Test cycle detection
    cout << "Cycle Detection Test:" << endl;
    
    // Create list: 1 -> 2 -> 3 -> 4 -> 5 -> 2 (cycle)
    ListNode* n1 = new ListNode(1);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(3);
    ListNode* n4 = new ListNode(4);
    ListNode* n5 = new ListNode(5);
    
    n1->next = n2;
    n2->next = n3;
    n3->next = n4;
    n4->next = n5;
    n5->next = n2;  // Creates cycle
    
    cout << "  Has cycle: " << (hasCycle(n1) ? "true" : "false") << endl;
    cout << "  Cycle starts at: " << findCycleStart(n1)->val << endl;
    
    // Test middle finding
    cout << "\nMiddle Finding Test:" << endl;
    ListNode* m1 = new ListNode(1);
    m1->next = new ListNode(2);
    m1->next->next = new ListNode(3);
    m1->next->next->next = new ListNode(4);
    m1->next->next->next->next = new ListNode(5);
    
    cout << "  Middle: " << findMiddle(m1)->val << endl;
    
    // Test happy number
    cout << "\nHappy Number Test:" << endl;
    cout << "  19 is happy: " << (isHappyNumber(19) ? "true" : "false") << endl;
    cout << "  2 is happy: " << (isHappyNumber(2) ? "true" : "false") << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Definition for singly-linked list node.
 */
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

/**
 * Fast & Slow Pointers implementation in Java.
 */
public class FastSlowPointers {
    
    /**
     * Detect if a cycle exists in linked list using Floyd's algorithm.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) {
            return false;
        }
        
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            
            if (slow == fast) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Find the starting node of the cycle if it exists.
     * 
     * Mathematical theorem: Distance from head to cycle start = 
     *                      Distance from meeting point to cycle start
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public ListNode findCycleStart(ListNode head) {
        if (head == null || head.next == null) {
            return null;
        }
        
        // Phase 1: Find meeting point
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                break;
            }
        }
        
        if (fast == null || fast.next == null) {
            return null;  // No cycle
        }
        
        // Phase 2: Find cycle start
        slow = head;
        while (slow != fast) {
            slow = slow.next;
            fast = fast.next;
        }
        
        return slow;
    }
    
    /**
     * Find the middle of the linked list.
     * For even-length lists, returns the second middle node.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public ListNode findMiddle(ListNode head) {
        if (head == null) {
            return null;
        }
        
        ListNode slow = head;
        ListNode fast = head;
        
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        
        return slow;
    }
    
    /**
     * Determine if a number is happy using Floyd's algorithm.
     * 
     * Time: O(log n)
     * Space: O(1)
     */
    private int getNext(int n) {
        int total = 0;
        while (n > 0) {
            int digit = n % 10;
            total += digit * digit;
            n /= 10;
        }
        return total;
    }
    
    public boolean isHappyNumber(int n) {
        if (n <= 0) {
            return false;
        }
        
        int slow = n;
        int fast = getNext(n);
        
        while (fast != 1 && slow != fast) {
            slow = getNext(slow);
            fast = getNext(getNext(fast));
        }
        
        return fast == 1;
    }
    
    /**
     * Find duplicate in array [1, n] using cycle detection.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public int findDuplicate(int[] nums) {
        // Phase 1: Find intersection
        int slow = nums[0];
        int fast = nums[0];
        
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        
        // Phase 2: Find cycle start (duplicate)
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        
        return slow;
    }
    
    // Test the implementation
    public static void main(String[] args) {
        FastSlowPointers solution = new FastSlowPointers();
        
        // Test cycle detection
        System.out.println("Cycle Detection Test:");
        
        // Create list: 1 -> 2 -> 3 -> 4 -> 5 -> 2 (cycle)
        ListNode n1 = new ListNode(1);
        ListNode n2 = new ListNode(2);
        ListNode n3 = new ListNode(3);
        ListNode n4 = new ListNode(4);
        ListNode n5 = new ListNode(5);
        
        n1.next = n2;
        n2.next = n3;
        n3.next = n4;
        n4.next = n5;
        n5.next = n2;
        
        System.out.println("  Has cycle: " + solution.hasCycle(n1));
        System.out.println("  Cycle starts at: " + solution.findCycleStart(n1).val);
        
        // Test middle finding
        System.out.println("\nMiddle Finding Test:");
        ListNode m1 = new ListNode(1);
        m1.next = new ListNode(2);
        m1.next.next = new ListNode(3);
        m1.next.next.next = new ListNode(4);
        m1.next.next.next.next = new ListNode(5);
        
        System.out.println("  Middle: " + solution.findMiddle(m1).val);
        
        // Test happy number
        System.out.println("\nHappy Number Test:");
        System.out.println("  19 is happy: " + solution.isHappyNumber(19));
        System.out.println("  2 is happy: " + solution.isHappyNumber(2));
        
        // Test duplicate finding
        System.out.println("\nDuplicate Finding Test:");
        int[] nums = {1, 3, 4, 2, 2};
        System.out.println("  Duplicate in [1,3,4,2,2]: " + solution.findDuplicate(nums));
    }
}
```

<!-- slide -->
```javascript
/**
 * Fast & Slow Pointers implementation in JavaScript
 */

/**
 * Definition for singly-linked list node.
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * Detect if a cycle exists in linked list using Floyd's algorithm.
 * 
 * Time: O(n)
 * Space: O(1)
 * @param {ListNode} head - Head of the linked list
 * @returns {boolean} True if cycle exists
 */
function hasCycle(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) return true;
    }
    
    return false;
}

/**
 * Find the starting node of the cycle if it exists.
 * 
 * Mathematical theorem: Distance from head to cycle start = 
 *                      Distance from meeting point to cycle start
 * 
 * Time: O(n)
 * Space: O(1)
 * @param {ListNode} head - Head of the linked list
 * @returns {ListNode|null} Node where cycle starts, or null
 */
function findCycleStart(head) {
    if (!head || !head.next) return null;
    
    // Phase 1: Find meeting point
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) break;
    }
    
    if (!fast || !fast.next) return null;
    
    // Phase 2: Find cycle start
    slow = head;
    while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}

/**
 * Find the middle of the linked list.
 * For even-length lists, returns the second middle node.
 * 
 * Time: O(n)
 * Space: O(1)
 * @param {ListNode} head - Head of the linked list
 * @returns {ListNode|null} Middle node
 */
function findMiddle(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}

/**
 * Calculate sum of squares of digits.
 * @param {number} n - Input number
 * @returns {number} Sum of squares of digits
 */
function getNext(n) {
    let total = 0;
    while (n > 0) {
        const digit = n % 10;
        total += digit * digit;
        n = Math.floor(n / 10);
    }
    return total;
}

/**
 * Determine if a number is happy using Floyd's algorithm.
 * 
 * Time: O(log n)
 * Space: O(1)
 * @param {number} n - Input number
 * @returns {boolean} True if happy number
 */
function isHappyNumber(n) {
    if (n <= 0) return false;
    
    let slow = n;
    let fast = getNext(n);
    
    while (fast !== 1 && slow !== fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    
    return fast === 1;
}

/**
 * Find duplicate in array [1, n] using cycle detection.
 * 
 * Time: O(n)
 * Space: O(1)
 * @param {number[]} nums - Array with one duplicate
 * @returns {number} The duplicate number
 */
function findDuplicate(nums) {
    // Phase 1: Find intersection
    let slow = nums[0];
    let fast = nums[0];
    
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // Phase 2: Find cycle start (duplicate)
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
}


// ============== Example Usage & Testing ==============

// Test cycle detection
console.log("Cycle Detection Test:");

// Create list: 1 -> 2 -> 3 -> 4 -> 5 -> 2 (cycle)
const n1 = new ListNode(1);
const n2 = new ListNode(2);
const n3 = new ListNode(3);
const n4 = new ListNode(4);
const n5 = new ListNode(5);

n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;
n5.next = n2;  // Creates cycle

console.log(`  Has cycle: ${hasCycle(n1)}`);  // true
console.log(`  Cycle starts at node with value: ${findCycleStart(n1).val}`);  // 2

// Test middle finding (create list without cycle)
const m1 = new ListNode(1);
m1.next = new ListNode(2);
m1.next.next = new ListNode(3);
m1.next.next.next = new ListNode(4);
m1.next.next.next.next = new ListNode(5);

console.log("\nMiddle Finding Test:");
console.log(`  Middle node: ${findMiddle(m1).val}`);  // 3

// Test happy number
console.log("\nHappy Number Test:");
console.log(`  19 is happy: ${isHappyNumber(19)}`);  // true
console.log(`  2 is happy: ${isHappyNumber(2)}`);    // false

// Test duplicate finding
console.log("\nDuplicate Finding Test:");
console.log(`  Duplicate in [1,3,4,2,2]: ${findDuplicate([1, 3, 4, 2, 2])}`);  // 2
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Cycle Detection** | O(n) | At most n steps before meeting or reaching end |
| **Find Cycle Start** | O(n) | Additional O(n) to find start point |
| **Find Middle** | O(n) | Single pass to find middle |
| **Happy Number** | O(log n) | Digit count reduces logarithmically |
| **Find Duplicate** | O(n) | Treats array as implicit linked list |

### Detailed Breakdown

- **Cycle Detection**: 
  - If no cycle: fast pointer reaches null in ~n/2 iterations = O(n)
  - If cycle: slow travels μ + λ steps = O(n)
  - Total: O(n)

- **Find Middle**:
  - Fast pointer moves 2x speed, so when it reaches end, slow is at middle
  - Single pass through list = O(n)

- **Happy Number**:
  - Each iteration reduces digit count
  - Max digits for 32-bit int is 10
  - Each number becomes smaller quickly = O(log n)

---

## Space Complexity Analysis

| Operation | Space Complexity | Notes |
|-----------|------------------|-------|
| **All Operations** | O(1) | Only uses two pointers regardless of input size |

### Key Points

- No additional data structures required
- Pointers only, no recursion (could be O(n) if recursive)
- Constant space makes it ideal for memory-constrained environments

---

## Common Variations

### 1. Find Cycle Length

Once cycle start is found, count nodes in cycle:

````carousel
```python
def cycle_length(head):
    """Find the length of the cycle."""
    start = find_cycle_start(head)
    if not start:
        return 0
    
    current = start.next
    length = 1
    
    while current != start:
        length += 1
        current = current.next
    
    return length
```

<!-- slide -->
```cpp
int cycleLength(ListNode* head) {
    ListNode* start = findCycleStart(head);
    if (!start) return 0;
    
    ListNode* current = start->next;
    int length = 1;
    
    while (current != start) {
        length++;
        current = current->next;
    }
    
    return length;
}
```

<!-- slide -->
```java
public int cycleLength(ListNode head) {
    ListNode start = findCycleStart(head);
    if (start == null) return 0;
    
    ListNode current = start.next;
    int length = 1;
    
    while (current != start) {
        length++;
        current = current.next;
    }
    
    return length;
}
```

<!-- slide -->
```javascript
function cycleLength(head) {
    const start = findCycleStart(head);
    if (!start) return 0;
    
    let current = start.next;
    let length = 1;
    
    while (current !== start) {
        length++;
        current = current.next;
    }
    
    return length;
}
```
````

### 2. Remove Cycle from Linked List

````carousel
```python
def remove_cycle(head):
    """Remove cycle from linked list."""
    if not head:
        return head
    
    # Find cycle start
    start = find_cycle_start(head)
    if not start:
        return head
    
    # Find the last node in cycle
    current = start
    while current.next != start:
        current = current.next
    
    # Remove cycle
    current.next = None
    return head
```

<!-- slide -->
```cpp
ListNode* removeCycle(ListNode* head) {
    if (!head) return head;
    
    ListNode* start = findCycleStart(head);
    if (!start) return head;
    
    ListNode* current = start;
    while (current->next != start) {
        current = current->next;
    }
    
    current->next = nullptr;
    return head;
}
```

<!-- slide -->
```java
public ListNode removeCycle(ListNode head) {
    if (head == null) return head;
    
    ListNode start = findCycleStart(head);
    if (start == null) return head;
    
    ListNode current = start;
    while (current.next != start) {
        current = current.next;
    }
    
    current.next = null;
    return head;
}
```

<!-- slide -->
```javascript
function removeCycle(head) {
    if (!head) return head;
    
    const start = findCycleStart(head);
    if (!start) return head;
    
    let current = start;
    while (current.next !== start) {
        current = current.next;
    }
    
    current.next = null;
    return head;
}
```
````

### 3. Middle of Linked List (First Middle for Even)

````carousel
```python
def find_middle_first(head):
    """Find first middle for even-length lists."""
    if not head:
        return None
    
    slow = head
    fast = head.next  # Start from second element
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

<!-- slide -->
```cpp
ListNode* findMiddleFirst(ListNode* head) {
    if (!head) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head->next;  // Start from second element
    
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    return slow;
}
```

<!-- slide -->
```java
public ListNode findMiddleFirst(ListNode head) {
    if (head == null) return null;
    
    ListNode slow = head;
    ListNode fast = head.next;  // Start from second element
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```

<!-- slide -->
```javascript
function findMiddleFirst(head) {
    if (!head) return null;
    
    let slow = head;
    let fast = head.next;  // Start from second element
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```
````

### 4. Nth Node from End

````carousel
```python
def nth_from_end(head, n):
    """Find nth node from end in one pass."""
    if not head or n <= 0:
        return None
    
    slow = head
    fast = head
    
    # Move fast n steps ahead
    for _ in range(n):
        if not fast:
            return None
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

<!-- slide -->
```cpp
ListNode* nthFromEnd(ListNode* head, int n) {
    if (!head || n <= 0) return nullptr;
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    // Move fast n steps ahead
    for (int i = 0; i < n; i++) {
        if (!fast) return nullptr;
        fast = fast->next;
    }
    
    // Move both until fast reaches end
    while (fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    return slow;
}
```

<!-- slide -->
```java
public ListNode nthFromEnd(ListNode head, int n) {
    if (head == null || n <= 0) return null;
    
    ListNode slow = head;
    ListNode fast = head;
    
    // Move fast n steps ahead
    for (int i = 0; i < n; i++) {
        if (fast == null) return null;
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast != null) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
```

<!-- slide -->
```javascript
function nthFromEnd(head, n) {
    if (!head || n <= 0) return null;
    
    let slow = head;
    let fast = head;
    
    // Move fast n steps ahead
    for (let i = 0; i < n; i++) {
        if (!fast) return null;
        fast = fast.next;
    }
    
    // Move both until fast reaches end
    while (fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
```
````

### 5. Palindrome Linked List

````carousel
```python
def is_palindrome(head):
    """Check if linked list is palindrome."""
    if not head or not head.next:
        return True
    
    # Find middle
    slow = head
    fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    prev = None
    current = slow.next
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    # Compare both halves
    left = head
    right = prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    
    return True
```

<!-- slide -->
```cpp
bool isPalindrome(ListNode* head) {
    if (!head || !head->next) return true;
    
    // Find middle
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast->next && fast->next->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // Reverse second half
    ListNode* prev = nullptr;
    ListNode* current = slow->next;
    while (current) {
        ListNode* nextNode = current->next;
        current->next = prev;
        prev = current;
        current = nextNode;
    }
    
    // Compare both halves
    ListNode* left = head;
    ListNode* right = prev;
    while (right) {
        if (left->val != right->val) return false;
        left = left->next;
        right = right->next;
    }
    
    return true;
}
```

<!-- slide -->
```java
public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true;
    
    // Find middle
    ListNode slow = head;
    ListNode fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    ListNode prev = null;
    ListNode current = slow.next;
    while (current != null) {
        ListNode nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    
    // Compare both halves
    ListNode left = head;
    ListNode right = prev;
    while (right != null) {
        if (left.val != right.val) return false;
        left = left.next;
        right = right.next;
    }
    
    return true;
}
```

<!-- slide -->
```javascript
function isPalindrome(head) {
    if (!head || !head.next) return true;
    
    // Find middle
    let slow = head;
    let fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse second half
    let prev = null;
    let current = slow.next;
    while (current) {
        const nextNode = current.next;
        current.next = prev;
        prev = current;
        current = nextNode;
    }
    
    // Compare both halves
    let left = head;
    let right = prev;
    while (right) {
        if (left.val !== right.val) return false;
        left = left.next;
        right = right.next;
    }
    
    return true;
}
```
````

---

## Practice Problems

### Problem 1: Linked List Cycle

**Problem:** [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Description:** Given the head of a linked list, determine if the linked list has a cycle in it.

**How to Apply Fast & Slow Pointers:**
- Initialize both pointers at head
- Move slow by 1, fast by 2
- If they meet → cycle exists
- If fast reaches null → no cycle

---

### Problem 2: Linked List Cycle II

**Problem:** [LeetCode 142 - Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)

**Description:** Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

**How to Apply Fast & Slow Pointers:**
- Phase 1: Detect cycle using standard algorithm
- Phase 2: Reset slow to head, keep fast at meeting point
- Move both by 1 until they meet again
- Meeting point = cycle start

---

### Problem 3: Happy Number

**Problem:** [LeetCode 202 - Happy Number](https://leetcode.com/problems/happy-number/)

**Description:** Write an algorithm to determine if a number n is happy. A happy number is a number where repeatedly summing squares of digits eventually reaches 1.

**How to Apply Fast & Slow Pointers:**
- Treat the digit transformation as "next pointer"
- Use Floyd's algorithm to detect cycle
- If ends at 1 → happy
- If enters cycle without 1 → not happy

---

### Problem 4: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array of integers nums containing (n + 1) integers where each integer is in the range [1, n] inclusive, find the duplicate number.

**How to Apply Fast & Slow Pointers:**
- Treat array as linked list: index i → nums[i]
- Duplicate creates a cycle
- Use cycle detection to find duplicate
- Value range ensures valid indices

---

### Problem 5: Middle of Linked List

**Problem:** [LeetCode 876 - Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)

**Description:** Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.

**How to Apply Fast & Slow Pointers:**
- Standard 1:2 speed ratio
- When fast reaches end, slow is at middle
- Returns second middle for even-length lists

---

### Problem 6: Remove Nth Node From End of List

**Problem:** [LeetCode 19 - Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

**Description:** Given the head of a linked list, remove the nth node from the end and return its head.

**How to Apply Fast & Slow Pointers:**
- Move fast n steps ahead of slow
- Then move both together
- When fast reaches end, slow is at node to delete

---

## Video Tutorial Links

### Fundamentals

- [Floyd's Cycle Detection Algorithm (Take U Forward)](https://www.youtube.com/watch?v=czB7n7omKSM) - Comprehensive introduction
- [Linked List Cycle Detection (NeetCode)](https://www.youtube.com/watch?v=6OrZ4NCAp0U) - Practical implementation
- [Fast & Slow Pointers Pattern (Back to Back SWE)](https://www.youtube.com/watch?v=6GwzqWd6Lss) - Pattern explanation

### Advanced Applications

- [Finding Cycle Start (WilliamFiset)](https://www.youtube.com/watch?v=zbozWoMgKW0) - Mathematical proof
- [Happy Number Problem](https://www.youtube.com/watch?v=pkHsk1L-p8Q) - Application to number theory
- [Find Duplicate Number (Cycle Detection)](https://www.youtube.com/watch?v=wjYnzkAhcNk) - Array as linked list

---

## Follow-up Questions

### Q1: Can Fast & Slow Pointers be used for arrays instead of linked lists?

**Answer:** Yes! The technique works on any data structure where you can define a "next" relationship:
- **Arrays**: Treat index i as pointing to nums[i]
- **Strings**: Use transformation functions (like happy number)
- **Numbers**: Use digit manipulation as "next" pointer

This is exactly how the "Find Duplicate Number" problem works - treating the array indices as pointers.

### Q2: What if the fast pointer moves more than 2 steps?

**Answer:** It can, but there are tradeoffs:
- **Speed 3**: Still O(n) but may meet faster
- **General case**: Works for any speed difference
- **Speed 2 is optimal**: Minimal iterations while guaranteeing meeting if cycle exists

### Q3: How do you find the length of the cycle?

**Answer:** Two approaches:
1. **From meeting point**: Count nodes until you return to start
2. **Mathematical**: λ = 2d - d = d (distance traveled by slow equals cycle length)
3. **Simple**: After finding cycle start, traverse until you return to start, counting nodes

### Q4: Can this technique detect multiple cycles?

**Answer:** The standard algorithm assumes a single cycle. For multiple cycles:
- Would need additional tracking
- Not a common interview problem
- Consider graph algorithms for complex cycle detection

### Q5: Why does the two-pointer technique find the cycle start?

**Answer:** Mathematical proof:
- Let μ = distance from head to cycle start
- Let λ = cycle length
- Let d = distance from cycle start to meeting point
- Slow travels: μ + d
- Fast travels: μ + d + kλ (for some k)
- Since fast = 2 × slow: μ + d + kλ = 2(μ + d)
- Therefore: μ = d
- Distance from head to cycle start equals distance from meeting to cycle start

---

## Summary

The Fast & Slow Pointers technique (Floyd's Cycle Detection Algorithm) is an elegant **O(n) time, O(1) space** solution for detecting cycles and finding middle elements. Key takeaways:

- **Elegant cycle detection**: No extra memory needed
- **Two-phase approach**: First detect cycle, then find start
- **Versatile applications**: Works beyond linked lists
- **Mathematical foundation**: Proven correctness
- **Interview favorite**: Frequently asked in technical interviews

When to use:
- ✅ Cycle detection in linked lists
- ✅ Finding middle element in one pass
- ✅ Happy number problems
- ✅ Finding duplicates in arrays with constraints
- ✅ Palindrome linked list problems

This technique is essential for solving linked list problems efficiently and is a fundamental pattern in competitive programming and technical interviews.

---

## Related Algorithms

- [Two Pointers](./two-pointers.md) - Similar concept, different applications
- [Sliding Window](./sliding-window.md) - Another O(n) traversal pattern
- [Binary Search](./binary-search.md) - Divide and conquer approach
- [Floyd's Algorithm](./floyd-warshall.md) - All-pairs shortest path (different Floyd!)
