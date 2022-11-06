import java.util.*;
import java.lang.*;
import java.time.*;
import java.io.*;


public class TwoSum
{
    public static void main(String[] args)
    {
        int[] a = Solution.solve({2, 7, 11, 15}, 9);
        if (a != {0, 1})
        {
            throw new Exception("\n-----------------\nTest case failed!\nInput: nums = [2, 7, 11, 15]; target = 9\nExpected output: [0, 1]\nYour output: " + Arrays.toString(a) + "\n-----------------")
        }
    }
}

public static class Solution
{
    public static int[] solve(int[] nums, int target) {

    }
}