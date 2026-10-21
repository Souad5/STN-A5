/**
 * Problem Solving: 20 problems in a single file.
 * Run all tests with:  node solution.js
 */

// ===========================================================================
// Problem 1: Staircase
// Row i (1-based) is (n - i) spaces followed by i '#'. No trailing spaces.
// Time O(n^2) for the output size, space O(n^2).
// Note: the problem document's first example shows two leading spaces for n = 4;
// four rows need width 4, so the first row has three (the rule "right-aligned").
// ===========================================================================
/** @param {number} n @return {string} */
var staircase = function (n) {
  const rows = [];
  for (let i = 1; i <= n; i++) {
    rows.push(" ".repeat(n - i) + "#".repeat(i));
  }
  return rows.join("\n");
};

// ===========================================================================
// Problem 2: Grading Students
// Grades below 38 are unchanged. Otherwise, if the next multiple of 5 is less
// than 3 above the grade, round up. Returns a new array.
// ===========================================================================
/** @param {number[]} grades @return {number[]} */
var gradingStudents = function (grades) {
  return grades.map((grade) => {
    if (grade < 38) return grade;
    const nextMultipleOf5 = Math.ceil(grade / 5) * 5;
    return nextMultipleOf5 - grade < 3 ? nextMultipleOf5 : grade;
  });
};

// ===========================================================================
// Problem 3: Time Conversion
// 12AM -> 00, 12PM -> 12, other PM hours + 12, other AM hours unchanged.
// ===========================================================================
/** @param {string} s @return {string} */
var timeConversion = function (s) {
  const period = s.slice(-2).toUpperCase();
  const [hh, mm, ss] = s.slice(0, -2).split(":");
  let hour = Number(hh) % 12; // 12 becomes 0
  if (period === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${mm}:${ss}`;
};

// ===========================================================================
// Problem 4: String Repeat
// n <= 0 returns "". Order of characters is preserved.
// ===========================================================================
/** @param {number} n @param {string} s @return {string} */
var repeatStr = function (n, s) {
  return n > 0 ? s.repeat(n) : "";
};

// ===========================================================================
// Problem 5: Reversed Strings
// Builds a new string from the end to the start; the original is untouched.
// Array.from keeps surrogate pairs (emoji) together.
// ===========================================================================
/** @param {string} str @return {string} */
var solution = function (str) {
  const chars = Array.from(str);
  let reversed = "";
  for (let i = chars.length - 1; i >= 0; i--) reversed += chars[i];
  return reversed;
};

// ===========================================================================
// Problem 6: Sum of Positive
// Only values strictly greater than 0 count. Empty or all non-positive -> 0.
// ===========================================================================
/** @param {number[]} arr @return {number} */
var positiveSum = function (arr) {
  let total = 0;
  for (const value of arr) if (value > 0) total += value;
  return total;
};

// ===========================================================================
// Problem 7: Grasshopper - Summation
// Sum of 1..num using the closed form n(n+1)/2 (O(1)). num < 1 -> 0.
// ===========================================================================
/** @param {number} num @return {number} */
var summation = function (num) {
  return num < 1 ? 0 : (num * (num + 1)) / 2;
};

// ===========================================================================
// Problem 8: Convert a Boolean to a String
// ===========================================================================
/** @param {boolean} b @return {string} */
var booleanToString = function (b) {
  return b ? "true" : "false";
};

// ===========================================================================
// Problem 9: Fizz Buzz
// Check divisibility by 15 (both) first, then 3, then 5. n <= 0 -> [].
// ===========================================================================
/** @param {number} n @return {string[]} */
var fizzBuzz = function (n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
};

// ===========================================================================
// Problem 10: Running Sum of 1D Array
// Prefix sums in one pass; returns a new array. Empty input -> [].
// ===========================================================================
/** @param {number[]} nums @return {number[]} */
var runningSum = function (nums) {
  const result = new Array(nums.length);
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    result[i] = sum;
  }
  return result;
};

// ===========================================================================
// Problem 11: Richest Customer Wealth
// Maximum row sum. Empty input -> 0.
// ===========================================================================
/** @param {number[][]} accounts @return {number} */
var maximumWealth = function (accounts) {
  let max = 0;
  for (const customer of accounts) {
    let wealth = 0;
    for (const balance of customer) wealth += balance;
    if (wealth > max) max = wealth;
  }
  return max;
};

// ===========================================================================
// Problem 12: Remove Duplicates from Sorted Array (in place)
// Two pointers: `write` marks where the next unique value goes. O(n) time,
// O(1) extra space. Returns k, the number of unique values.
// ===========================================================================
/** @param {number[]} nums @return {number} */
var removeDuplicates = function (nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
};

// ===========================================================================
// Problem 13: Contains Duplicate
// A Set gives O(n) time and exits as soon as a repeat is seen.
// ===========================================================================
/** @param {number[]} nums @return {boolean} */
var containsDuplicate = function (nums) {
  const seen = new Set();
  for (const value of nums) {
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
};

// ===========================================================================
// Problem 14: Move Zeroes (in place, void)
// Stable: copy non-zeros forward, then fill the tail with zeros. O(n), O(1).
// ===========================================================================
/** @param {number[]} nums @return {void} */
var moveZeroes = function (nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  for (let i = write; i < nums.length; i++) nums[i] = 0;
};

// ===========================================================================
// Problem 15: Merge Sorted Array (in place, void)
// Fill nums1 from the back with the larger of the two tails, so no valid value
// in nums1 is overwritten before it is used. O(m + n), O(1) extra space.
// ===========================================================================
/** @param {number[]} nums1 @param {number} m @param {number[]} nums2 @param {number} n @return {void} */
var merge = function (nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
    else nums1[k--] = nums2[j--];
  }
};

// ===========================================================================
// Problem 16: 3Sum
// Sort a copy, fix the first value, then two pointers for the other two.
// Skipping repeated values avoids duplicate triplets. O(n^2) time.
// The input array is not modified.
// ===========================================================================
/** @param {number[]} nums @return {number[][]} */
var threeSum = function (nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i] > 0) break; // no way to reach 0 from here on
    if (i > 0 && sorted[i] === sorted[i - 1]) continue;
    let left = i + 1;
    let right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum < 0) left++;
      else if (sum > 0) right--;
      else {
        result.push([sorted[i], sorted[left], sorted[right]]);
        left++;
        right--;
        while (left < right && sorted[left] === sorted[left - 1]) left++;
        while (left < right && sorted[right] === sorted[right + 1]) right--;
      }
    }
  }
  return result;
};

// ===========================================================================
// Problem 17: Plus One
// Walk from the least significant digit; a digit below 9 ends the carry.
// All nines -> a leading 1 followed by zeros. Returns a new array.
// ===========================================================================
/** @param {number[]} digits @return {number[]} */
var plusOne = function (digits) {
  const result = [...digits];
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i] < 9) {
      result[i]++;
      return result;
    }
    result[i] = 0;
  }
  return [1, ...result];
};

// ===========================================================================
// Problem 18: Reverse String (in place, void)
// Two pointers swapping from both ends. O(n) time, O(1) space.
// ===========================================================================
/** @param {string[]} s @return {void} */
var reverseString = function (s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
};

// ===========================================================================
// Problem 19: Length of Last Word
// Scan from the end: skip trailing spaces, then count non-space characters.
// No split, O(n) time, O(1) space. No words -> 0.
// ===========================================================================
/** @param {string} s @return {number} */
var lengthOfLastWord = function (s) {
  let i = s.length - 1;
  while (i >= 0 && s[i] === " ") i--;
  let length = 0;
  while (i >= 0 && s[i] !== " ") {
    length++;
    i--;
  }
  return length;
};

// ===========================================================================
// Problem 20: Longest Common Prefix
// Compare column by column against the first string; stop at the first
// mismatch or when any string ends. Empty array -> "".
// Note: the document's third example says "inter" for ["interspecies",
// "interstellar", "interstate"], but the true longest common prefix is "inters".
// ===========================================================================
/** @param {string[]} strs @return {string} */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) return "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== first[i]) return first.slice(0, i);
    }
  }
  return first;
};

// ===========================================================================
// Tests (run with `node solution.js`; they do not run when the file is imported)
// ===========================================================================
if (require.main === module) {
  const assert = require("node:assert/strict");
  let passed = 0;
  const test = (name, fn) => {
    try {
      fn();
      passed++;
    } catch (err) {
      console.error(`FAIL  ${name}\n      ${err.message.split("\n").join("\n      ")}`);
      process.exitCode = 1;
    }
  };

  test("1 staircase", () => {
    assert.equal(staircase(4), "   #\n  ##\n ###\n####");
    assert.equal(staircase(1), "#");
    assert.equal(staircase(0), "");
    assert.ok(staircase(6).split("\n").every((row) => row === row.trimEnd()));
  });
  test("2 gradingStudents", () => {
    assert.deepEqual(gradingStudents([73, 67, 38, 33]), [75, 67, 40, 33]);
    assert.deepEqual(gradingStudents([84, 29, 57]), [85, 29, 57]);
    assert.deepEqual(gradingStudents([37, 38, 100, 0]), [37, 40, 100, 0]);
    const input = [73];
    gradingStudents(input);
    assert.deepEqual(input, [73]); // input untouched
  });
  test("3 timeConversion", () => {
    assert.equal(timeConversion("07:05:45PM"), "19:05:45");
    assert.equal(timeConversion("12:00:00AM"), "00:00:00");
    assert.equal(timeConversion("12:30:45PM"), "12:30:45");
    assert.equal(timeConversion("01:00:00AM"), "01:00:00");
    assert.equal(timeConversion("11:59:59PM"), "23:59:59");
  });
  test("4 repeatStr", () => {
    assert.equal(repeatStr(3, "ha"), "hahaha");
    assert.equal(repeatStr(0, "hello"), "");
    assert.equal(repeatStr(4, "a"), "aaaa");
    assert.equal(repeatStr(2, ""), "");
  });
  test("5 solution (reverse string)", () => {
    assert.equal(solution("world"), "dlrow");
    assert.equal(solution("hello"), "olleh");
    assert.equal(solution(""), "");
    assert.equal(solution("a"), "a");
  });
  test("6 positiveSum", () => {
    assert.equal(positiveSum([1, -4, 7, 12]), 20);
    assert.equal(positiveSum([-1, -2, 0, -5]), 0);
    assert.equal(positiveSum([]), 0);
  });
  test("7 summation", () => {
    assert.equal(summation(8), 36);
    assert.equal(summation(1), 1);
    assert.equal(summation(100), 5050);
    assert.equal(summation(0), 0);
  });
  test("8 booleanToString", () => {
    assert.equal(booleanToString(true), "true");
    assert.equal(booleanToString(false), "false");
  });
  test("9 fizzBuzz", () => {
    assert.deepEqual(fizzBuzz(5), ["1", "2", "Fizz", "4", "Buzz"]);
    assert.deepEqual(fizzBuzz(15), ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]);
    assert.deepEqual(fizzBuzz(0), []);
    assert.equal(fizzBuzz(30)[29], "FizzBuzz");
  });
  test("10 runningSum", () => {
    assert.deepEqual(runningSum([1, 2, 3, 4]), [1, 3, 6, 10]);
    assert.deepEqual(runningSum([1, 1, 1, 1, 1]), [1, 2, 3, 4, 5]);
    assert.deepEqual(runningSum([]), []);
    assert.deepEqual(runningSum([3, 1, 2, 10, 1]), [3, 4, 6, 16, 17]);
  });
  test("11 maximumWealth", () => {
    assert.equal(maximumWealth([[1, 2, 3], [3, 2, 1]]), 6);
    assert.equal(maximumWealth([[1, 5], [7, 3], [3, 5]]), 10);
    assert.equal(maximumWealth([[2, 8, 7], [7, 1, 3], [1, 9, 5]]), 17);
    assert.equal(maximumWealth([]), 0);
  });
  test("12 removeDuplicates", () => {
    let nums = [1, 1, 2];
    let k = removeDuplicates(nums);
    assert.equal(k, 2);
    assert.deepEqual(nums.slice(0, k), [1, 2]);
    nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
    k = removeDuplicates(nums);
    assert.equal(k, 5);
    assert.deepEqual(nums.slice(0, k), [0, 1, 2, 3, 4]);
    assert.equal(removeDuplicates([]), 0);
    nums = [7];
    assert.equal(removeDuplicates(nums), 1);
  });
  test("13 containsDuplicate", () => {
    assert.equal(containsDuplicate([1, 2, 3, 1]), true);
    assert.equal(containsDuplicate([1, 2, 3, 4]), false);
    assert.equal(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true);
    assert.equal(containsDuplicate([]), false);
  });
  test("14 moveZeroes", () => {
    let nums = [0, 1, 0, 3, 12];
    assert.equal(moveZeroes(nums), undefined);
    assert.deepEqual(nums, [1, 3, 12, 0, 0]);
    nums = [0, 0, 1];
    moveZeroes(nums);
    assert.deepEqual(nums, [1, 0, 0]);
    nums = [1, 2, 3];
    moveZeroes(nums);
    assert.deepEqual(nums, [1, 2, 3]);
    nums = [0];
    moveZeroes(nums);
    assert.deepEqual(nums, [0]);
  });
  test("15 merge", () => {
    let a = [1, 2, 3, 0, 0, 0];
    assert.equal(merge(a, 3, [2, 5, 6], 3), undefined);
    assert.deepEqual(a, [1, 2, 2, 3, 5, 6]);
    a = [1];
    merge(a, 1, [], 0);
    assert.deepEqual(a, [1]);
    a = [0];
    merge(a, 0, [1], 1);
    assert.deepEqual(a, [1]);
    a = [4, 5, 6, 0, 0, 0];
    merge(a, 3, [1, 2, 3], 3);
    assert.deepEqual(a, [1, 2, 3, 4, 5, 6]);
  });
  test("16 threeSum", () => {
    const sortTriplets = (t) => t.map((x) => [...x].sort((p, q) => p - q)).sort();
    assert.deepEqual(sortTriplets(threeSum([-1, 0, 1, 2, -1, -4])), [[-1, -1, 2], [-1, 0, 1]]);
    assert.deepEqual(threeSum([0, 1, 1]), []);
    assert.deepEqual(threeSum([0, 0, 0]), [[0, 0, 0]]);
    assert.deepEqual(threeSum([]), []);
    assert.deepEqual(threeSum([0, 0, 0, 0]), [[0, 0, 0]]); // no duplicate triplets
    const input = [3, -1, -2];
    threeSum(input);
    assert.deepEqual(input, [3, -1, -2]); // input untouched
  });
  test("17 plusOne", () => {
    assert.deepEqual(plusOne([1, 2, 9]), [1, 3, 0]);
    assert.deepEqual(plusOne([4, 3, 2, 1]), [4, 3, 2, 2]);
    assert.deepEqual(plusOne([9, 9, 9]), [1, 0, 0, 0]);
    assert.deepEqual(plusOne([0]), [1]);
    assert.deepEqual(plusOne([9]), [1, 0]);
  });
  test("18 reverseString", () => {
    let s = ["h", "e", "l", "l", "o"];
    assert.equal(reverseString(s), undefined);
    assert.deepEqual(s, ["o", "l", "l", "e", "h"]);
    s = ["H", "a", "n", "n", "a", "h"];
    reverseString(s);
    assert.deepEqual(s, ["h", "a", "n", "n", "a", "H"]);
    s = [];
    reverseString(s);
    assert.deepEqual(s, []);
  });
  test("19 lengthOfLastWord", () => {
    assert.equal(lengthOfLastWord("Hello World"), 5);
    assert.equal(lengthOfLastWord("   fly me   to   the moon  "), 4);
    assert.equal(lengthOfLastWord("luffy is still joyboy"), 6);
    assert.equal(lengthOfLastWord("a"), 1);
    assert.equal(lengthOfLastWord("    "), 0);
    assert.equal(lengthOfLastWord(""), 0);
  });
  test("20 longestCommonPrefix", () => {
    assert.equal(longestCommonPrefix(["flower", "flow", "flight"]), "fl");
    assert.equal(longestCommonPrefix(["dog", "racecar", "car"]), "");
    // The problem document lists "inter" here, but all three words start with "inters".
    assert.equal(longestCommonPrefix(["interspecies", "interstellar", "interstate"]), "inters");
    assert.equal(longestCommonPrefix(["interview", "internet", "interval"]), "inter");
    assert.equal(longestCommonPrefix(["alone"]), "alone");
    assert.equal(longestCommonPrefix(["abc", ""]), "");
    assert.equal(longestCommonPrefix([]), "");
    assert.equal(longestCommonPrefix(["ab", "abc", "ab"]), "ab");
  });

  console.log(`${passed} of 20 problem tests passed`);
}

module.exports = {
  staircase, gradingStudents, timeConversion, repeatStr, solution, positiveSum,
  summation, booleanToString, fizzBuzz, runningSum, maximumWealth, removeDuplicates,
  containsDuplicate, moveZeroes, merge, threeSum, plusOne, reverseString,
  lengthOfLastWord, longestCommonPrefix,
};
