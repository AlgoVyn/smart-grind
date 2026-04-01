## Title: Merge k Lists Forms

What are the different forms and variations of k-way merge problems?

<!-- front -->

---

### k-Way Merge Variations
| Problem | Input | Modification |
|---------|-------|--------------|
| Merge k lists | Linked lists | Standard |
| Merge k arrays | Arrays | Index tracking |
| Find smallest range | k lists | Track min/max |
| K-way sort | External sort | Chunk + merge |
| Ugly numbers | Generators | Custom heap ordering |

### Merge k Sorted Arrays
```python
def merge_k_arrays(arrays):
    """Merge k sorted arrays (not linked lists)"""
    import heapq
    
    heap = []
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
    
    result = []
    while heap:
        val, arr_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, arr_idx, elem_idx + 1))
    
    return result
```

---

### Smallest Range Covering Elements
```python
def smallest_range(lists):
    """Find smallest range that contains at least one element from each list"""
    import heapq
    
    heap = []
    current_max = float('-inf')
    
    for i, lst in enumerate(lists):
        heapq.heappush(heap, (lst[0], i, 0))
        current_max = max(current_max, lst[0])
    
    result = [float('-inf'), float('inf')]
    
    while len(heap) == len(lists):
        current_min, i, j = heapq.heappop(heap)
        
        # Update best range
        if current_max - current_min < result[1] - result[0]:
            result = [current_min, current_max]
        
        # Move to next element in this list
        if j + 1 < len(lists[i]):
            next_val = lists[i][j + 1]
            heapq.heappush(heap, (next_val, i, j + 1))
            current_max = max(current_max, next_val)
    
    return result
```

---

### External Merge Sort
```python
def external_merge_sort(input_file, output_file, chunk_size):
    """Sort large file using k-way merge"""
    # Phase 1: Create sorted chunks
    chunks = []
    while data := read_chunk(input_file, chunk_size):
        chunk = sorted(data)
        chunk_file = write_to_temp(chunk)
        chunks.append(chunk_file)
    
    # Phase 2: k-way merge
    k = len(chunks)
    heap = []
    
    for i, chunk in enumerate(chunks):
        val = read_next(chunk)
        heapq.heappush(heap, (val, i, chunk))
    
    with open(output_file, 'w') as out:
        while heap:
            val, i, chunk = heapq.heappop(heap)
            out.write(f"{val}\n")
            if next_val := read_next(chunk):
                heapq.heappush(heap, (next_val, i, chunk))
```

<!-- back -->
