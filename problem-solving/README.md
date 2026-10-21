# Problem Solving (PS)

All 20 assigned problems are solved in one file, [`solution.js`](solution.js), in JavaScript. Each problem is marked with a comment giving its number and title, with the approach and edge cases noted above the function. Function names and parameters follow the problem set exactly.

## Run the tests

Needs Node 18+ (no dependencies).

```bash
node solution.js
# 20 of 20 problem tests passed
```

The tests run only when the file is executed directly; importing it (`require("./solution.js")`) just gives you the functions.

## Problems

| # | Problem | Function | Approach | Time |
| --- | --- | --- | --- | --- |
| 1 | Staircase | `staircase` | `n - i` spaces plus `i` hashes per row | O(n²) output |
| 2 | Grading Students | `gradingStudents` | round up when the next multiple of 5 is under 3 away and grade >= 38 | O(n) |
| 3 | Time Conversion | `timeConversion` | `hour % 12`, add 12 for PM | O(1) |
| 4 | String Repeat | `repeatStr` | `String.repeat`, 0 or less gives `""` | O(n·len) |
| 5 | Reversed Strings | `solution` | build a new string from the end | O(n) |
| 6 | Sum of Positive | `positiveSum` | add values > 0 | O(n) |
| 7 | Grasshopper Summation | `summation` | closed form n(n+1)/2 | O(1) |
| 8 | Boolean to String | `booleanToString` | ternary | O(1) |
| 9 | Fizz Buzz | `fizzBuzz` | check 15, then 3, then 5 | O(n) |
| 10 | Running Sum | `runningSum` | prefix sum in one pass | O(n) |
| 11 | Richest Customer Wealth | `maximumWealth` | maximum row sum | O(rows·cols) |
| 12 | Remove Duplicates from Sorted Array | `removeDuplicates` | in place, read/write pointers | O(n), O(1) space |
| 13 | Contains Duplicate | `containsDuplicate` | `Set`, early exit | O(n) |
| 14 | Move Zeroes | `moveZeroes` | in place, stable, copy non-zeros then fill zeros | O(n), O(1) space |
| 15 | Merge Sorted Array | `merge` | in place, fill from the back | O(m+n), O(1) space |
| 16 | 3Sum | `threeSum` | sort a copy, two pointers, skip repeats | O(n²) |
| 17 | Plus One | `plusOne` | carry from the last digit, all nines add a digit | O(n) |
| 18 | Reverse String | `reverseString` | in place, two pointers | O(n), O(1) space |
| 19 | Length of Last Word | `lengthOfLastWord` | scan from the end, no split | O(n), O(1) space |
| 20 | Longest Common Prefix | `longestCommonPrefix` | compare column by column | O(total chars) |

The `void` problems (12 returns `k`; 14, 15, 18 return nothing) modify the input in place as required.

## Two errors in the problem document

- **Problem 1:** the first example for `n = 4` shows two spaces before the first `#`. A right-aligned staircase of four rows needs three (`"   #\n  ##\n ###\n####"`), which is what `staircase(4)` returns.
- **Problem 20:** the third example gives `"inter"` for `["interspecies", "interstellar", "interstate"]`, but all three words start with `"inters"`. The code returns the true longest common prefix, `"inters"`.

## Testing

Each problem has the document's examples plus edge cases (empty input, single element, zero, all nines, only spaces, no common prefix, and so on). The in-place functions are also checked to return nothing, and `gradingStudents` and `threeSum` are checked to leave their input unchanged. The harder ones (3Sum, merge, remove duplicates, move zeroes, plus one, time conversion) were also cross-checked against brute-force references on random inputs.
