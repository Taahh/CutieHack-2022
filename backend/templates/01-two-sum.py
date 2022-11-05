import classPlaceholder
if __name__ == "__main__":
    solution = classPlaceholder.Solution()
    a, b, c = solution.twoSum([2,7,11,15], 9), solution.twoSum([3,2,4], 6), solution.twoSum([3,3], 6)
    if a != [0, 1]:
        raise Exception("\n\nIncorrect output. Expected: [0, 1] for input [2, 7, 11, 15] and target 9")
    if b != [1, 2]:
        raise Exception("\n\nIncorrect output. Expected: [1, 2] for input [3, 2, 4] and target 6")
    if c != [0, 1]:
        raise Exception("\n\nIncorrect output. Expected: [0, 1] for input [3, 3] and target 6")
