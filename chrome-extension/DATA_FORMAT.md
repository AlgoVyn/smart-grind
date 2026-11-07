# SmartGrind Data Formats

This document describes the data formats used by the SmartGrind Chrome extension for LeetCode problem ratings and tags.

## ratings.txt

The `ratings.txt` file contains problem ratings and metadata for LeetCode problems. It is a tab-separated values (TSV) file with the following columns:

1. **Rating** (float): The difficulty rating of the problem, typically ranging from 0 to 3000
2. **ID** (string): The LeetCode problem ID
3. **Title** (string): The full title of the problem
4. **Title Slug** (string): The URL slug for the problem (used in LeetCode URLs)
5. **Contest Slug** (string): The contest identifier if the problem is from a contest
6. **Problem Index** (string): The problem index within a contest
7. **Tags** (string): Comma-separated list of problem tags (e.g., "Array,Hash Table")

### Example
```
1373.0925554699925	1	Two Sum	two-sum			Array,Hash Table
1709.8964904074933	2	Add Two Numbers	add-two-numbers			Linked List,Math,Recursion
```

### Usage
- The extension loads this file to display ratings on LeetCode problem pages
- Ratings are used to replace the default "Easy/Medium/Hard" difficulty labels
- The popup uses this data to filter and select random problems based on rating ranges

## tags.txt

The `tags.txt` file contains a list of all available LeetCode problem tags, one tag per line.

### Example
```
Array
String
Hash Table
Dynamic Programming
Math
Binary Search
```

### Usage
- Used by the popup to populate the tag selection dropdown
- Allows users to filter random problem selection by specific topics
- Tags are matched against the tags in `ratings.txt` for filtering

## Data Sources

- **ratings.txt**: Contains community-sourced difficulty ratings for LeetCode problems
- **tags.txt**: Derived from LeetCode's official problem tags

## File Locations

These files are stored as web-accessible resources in the extension and can be accessed via:
- `chrome.runtime.getURL('ratings.txt')`
- `chrome.runtime.getURL('tags.txt')`

## Update Process

To update the data files:
1. Obtain updated ratings and tags from reliable sources
2. Ensure the TSV format is maintained for ratings.txt
3. Update the files in the extension directory
4. **Bump the extension version in manifest.json** — both the content script and the popup cache the parsed datasets in `chrome.storage.local` keyed by the extension version; without a version bump existing users keep the stale data indefinitely
5. Test the extension to ensure proper loading and functionality

## Storage Layout

The extension uses two storage areas:

- **`chrome.storage.sync`** — small user settings only: `minRating`, `maxRating`, `selectedTag`.
- **`chrome.storage.local`** — everything that grows or is derived from the bundled datasets:
  - `ratingsCache` / `datasetCache` — `{ version, data }` objects; `version` is the extension version that produced them, and a mismatch triggers a re-parse of the bundled files.
  - `solvedProblems` — array of `{ slug, solvedAt }`.
  - `openedProblems` — array of `{ slug, openedAt }`, pruned by the content script once a problem is solved.

  The solved/opened collections deliberately do **not** live in `chrome.storage.sync`: sync enforces an 8,192-byte per-item quota, which overflows silently at roughly 100–150 entries. If you find legacy `solvedProblems`/`openedProblems` arrays in `chrome.storage.sync` (including the old string-array format), both scripts migrate them to `chrome.storage.local` on first read.