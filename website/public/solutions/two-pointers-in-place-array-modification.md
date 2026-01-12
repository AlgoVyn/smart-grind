# Two Pointers - In-place Array Modification

## Overview

The Two Pointers - In-place Array Modification pattern is employed for problems requiring array modifications without extra space, such as removing specific elements, partitioning arrays, or rearranging elements based on conditions. It uses two pointers: one to scan the array and another to track the position for placing valid elements. This pattern ensures O(1) space complexity while achieving linear time.

## Key Concepts

- **Read and Write Pointers**: One pointer reads elements, the other writes valid ones.
- **In-place Operations**: Modify the array directly without additional data structures.
- **Conditional Placement**: Move write pointer only when element meets criteria.
- **Element Swapping**: Swap elements to maintain order or group them.

## Template

```python
def remove_element(nums, val):
    """
    Template for Two Pointers - In-place Array Modification.
    Removes all instances of val from nums in-place.
    """
    write = 0  # Write pointer for valid elements
    
    for read in range(len(nums)):  # Read pointer scans array
        if nums[read] != val:
            nums[write] = nums[read]  # Place valid element
            write += 1  # Move write pointer
    
    return write  # New length of array
```

## Example Problems

1. **Remove Element**: Remove all instances of a given value from an array in-place.
2. **Sort Colors**: Sort an array of 0s, 1s, and 2s in-place using two pointers.
3. **Move Zeroes**: Move all zeroes to the end of the array while maintaining relative order of non-zero elements.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the array length, as each element is processed once.
- **Space Complexity**: O(1), modifying the array in-place without extra space.

## Common Pitfalls

- **Pointer Confusion**: Ensure read and write pointers don't interfere.
- **Order Preservation**: Maintain relative order of elements unless specified otherwise.
- **Edge Cases**: Handle empty arrays or arrays with all elements to remove.
- **Return Values**: Return the correct new length or modified array as required.