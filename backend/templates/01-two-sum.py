import classPlaceholder
if __name__ == "__main__":
    solution = classPlaceholder.Solution()
    a = solution.twoSum([2,7,11,15], 9)
    if a != [0, 1]:
        raise Exception("\n\nTest case failed!\nInput: nums = [2, 7, 11, 15]; target = 9\nExpected output: [0, 1]\nYour output: " + str(a))
    b = solution.twoSum([3,2,4], 6)
    if b != [1, 2]:
        raise Exception("\n\nTest case failed!\nnput: nums = [3, 2, 4; target = 6\nExpected output: [1, 2]\nYour output: " + str(b))
    c = solution.twoSum([3,3], 6)
    if c != [0, 1]:
        raise Exception("\n\nTest case failed!\nnput: nums = [3, 3]; target = 6\nExpected output: [0, 1]\nYour output: " + str(c))
