const JAVA_STARTER = "public static class Solution\n" +
    "{\n" +
    "    public static int[] solve(int[] nums, int target) {\n" +
    "\n" +
    "    }\n" +
    "}"
const PYTHON_STARTER = "class Solution:\n" +
    "    def twoSum(self, nums, target):\n" +
    "        "
export class User {
    public currLang: string = "java"
    public codes: Map<string, string> = new Map<string, string>()
    constructor(public readonly uniqueId: string, public username: string, public encryptedPassword: string) {
        this.codes.set("python", PYTHON_STARTER)
        this.codes.set("java", JAVA_STARTER)
    }
}

