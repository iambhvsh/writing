// MARK: - Day 7: Functions, Parameters, Return Values, Tuples, and Parameter Labels

// ======================================================
// FUNCTIONS
// ======================================================

// A function groups reusable instructions under a single name.
// Defining a function does NOT run its code.
// You must call it explicitly.

func showWelcome() {
    print("Welcome to my app!")
    print("Thanks for being here.")
}

showWelcome()

print()

// ======================================================
// PARAMETERS
// ======================================================

// Parameters let functions accept input.
// A parameter is the placeholder defined in the function.
// An argument is the actual value passed when calling it.

func printTimesTables(number: Int) {
    for i in 1...12 {
        print("\(i) x \(number) is \(i * number)")
    }
}

printTimesTables(number: 5)

print()

// Functions can accept multiple parameters.
// Arguments must be provided in the same order as parameters.

func printTimesTables(number: Int, end: Int) {
    for i in 1...end {
        print("\(i) x \(number) is \(i * number)")
    }
}

printTimesTables(number: 5, end: 20)

print()

// ======================================================
// RETURN VALUES
// ======================================================

// Use '->' followed by a type to declare what the function returns.
// Use 'return' to send a value back to the caller.

func rollDice() -> Int {
    return Int.random(in: 1...6)
}

let diceResult = rollDice()
print("Dice rolled: \(diceResult)")

print()

// When a function body contains a single expression,
// Swift can infer the return without writing 'return'.

func square(number: Int) -> Int {
    number * number
}

let squared = square(number: 5)
print("5 squared is \(squared)")

print()

// Functions don't always need to return a value.
// 'return' alone exits a function early.

func greet(name: String) {
    if name.isEmpty {
        return
    }
    print("Hello, \(name)!")
}

greet(name: "Bhavesh")
greet(name: "")

print()

// ======================================================
// Putting Functions to Work
// ======================================================

// Checking if two strings contain identical letters (any order).

func areLettersIdentical(string1: String, string2: String) -> Bool {
    string1.sorted() == string2.sorted()
}

print(areLettersIdentical(string1: "abc", string2: "cab"))   // true
print(areLettersIdentical(string1: "hello", string2: "world")) // false

print()

// ======================================================
// TUPLES
// ======================================================

// Tuples return multiple related values from a single function.
// Each element can be named for clarity.

func getUser() -> (firstName: String, lastName: String) {
    ("Taylor", "Swift")
}

let user = getUser()
print("Name: \(user.firstName) \(user.lastName)")

print()

// Accessing tuple values by index (less readable).

func getUserByIndex() -> (String, String) {
    ("Taylor", "Swift")
}

let userByIndex = getUserByIndex()
print(userByIndex.0)
print(userByIndex.1)

print()

// Destructuring a tuple into separate constants.

let (firstName, lastName) = getUser()
print("First: \(firstName), Last: \(lastName)")

print()

// Use '_' to ignore a value you don't need.

let (firstNameOnly, _) = getUser()
print("First name only: \(firstNameOnly)")

print()

// ======================================================
// PARAMETER LABELS
// ======================================================

// External label: used when calling the function.
// Internal name: used inside the function body.

func printTimesTablesLabeled(for number: Int) {
    for i in 1...12 {
        print("\(i) x \(number) is \(i * number)")
    }
}

// Reads like plain English: "print times tables for 5"
printTimesTablesLabeled(for: 5)

print()

// Use '_' to remove the external label entirely.

func isUppercase(_ string: String) -> Bool {
    string == string.uppercased()
}

let result = isUppercase("HELLO")
print("Is uppercase: \(result)")

print()

// ======================================================
// Checkpoint 4
// ======================================================

// Write a function that:
// - Accepts an integer from 1 to 10_000
// - Returns the integer square root of that number
// - Throws an error if no integer square root exists

enum SqrtError: Error {
    case outOfBounds
    case noRoot
}

func integerSqrt(of number: Int) throws -> Int {
    if number < 1 || number > 10_000 {
        throw SqrtError.outOfBounds
    }

    for i in 1...100 {
        if i * i == number {
            return i
        }
    }

    throw SqrtError.noRoot
}

do {
    let root = try integerSqrt(of: 25)
    print("Square root: \(root)")
} catch SqrtError.outOfBounds {
    print("Number must be between 1 and 10,000.")
} catch SqrtError.noRoot {
    print("No integer square root found.")
} catch {
    print("Unexpected error: \(error)")
}
