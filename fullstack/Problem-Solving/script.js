// Given a string s, find the length of the longest substring without repeating characters.

var lengthOfLongestSubstring = function (s) {
  let longest = 0;
  let current = 0;
  let map = {};

  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    console.log(char);
    if (map[char]) {
      current = Math.max(current, map[char]);
      console.log(current);
    }

    map[char] = i + 1;
    longest = Math.max(longest, i - current + 1);
    console.log(longest);
  }

  return longest;
};
