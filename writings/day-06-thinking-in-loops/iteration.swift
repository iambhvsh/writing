// MARK: - Day 6: Loops, continue, break and Checkpoint 3

// ======================================================
// FOR LOOPS
// ======================================================

// Arrays can be looped through one item at a time.
let platforms = ["iOS", "macOS", "tvOS", "iPadOS"]

// 'os' is called the Loop Variable.
// It stores one platform each iteration.
for os in platforms {
    print("Swift works on \(os).")
}

// The code inside {} is called the Loop Body.
// Each complete repetition is called an Iteration.

print()

// ======================================================
// Looping through a Range
// ======================================================

// Closed Range (...)
// Includes both the starting and ending value.
for i in 1...10 {
    print("2 × \(i) = \(2 * i)")
}

print()

// Nested Loops (Loop inside another Loop)
for i in 1...3 {
    print("Table of \(i)")

    for j in 1...10 {
        print("\(i) × \(j) = \(i * j)")
    }

    print()
}

// Another Closed Range example
for i in 1...5 {
    print("Counting 1 through 5: \(i)")
}

print()

// Half-Open Range (..<)
// Includes the first value but NOT the last value.
for i in 1..<5 {
    print("Counting from 1 up to 5: \(i)")
}

// Useful for arrays because array indexes start at 0.

print()

// ======================================================
// Ignoring the Loop Variable
// ======================================================

// Use '_' when you don't need the loop variable.
var lyric = "Haters Gonna"

for _ in 1...5 {
    lyric += " Hate"
}

print(lyric)

print()

// Printing a simple star pattern
var stars = ""

for _ in 1...5 {
    stars += "*"
    print(stars)
}

print()

// ======================================================
// Ranges are also Types
// ======================================================

// A range can be stored inside a constant or variable.
let count = 1...3

for _ in count {
    print("There's no place like home.")
}

print()

// ======================================================
// WHILE LOOPS
// ======================================================

// while loops repeat until the condition becomes false.

var countdown = 10

while countdown > 0 {
    print(countdown)
    countdown -= 1
}

print("Ta Daa!")

print()

// while loops are useful when you DON'T know
// exactly how many times something should repeat.

// Random values
let id = Int.random(in: 1...1000)
let amount = Double.random(in: 0...1)

print("Random ID: \(id)")
print("Random Amount: \(amount)")

print()

// Roll a dice until a 6 appears.
var roll = 0

while roll != 6 {
    roll = Int.random(in: 1...6)
    print("I rolled a \(roll)")
}

print("Finally rolled a 6!")

print()

// ======================================================
// continue
// ======================================================

// continue skips the CURRENT iteration
// and immediately jumps to the next one.

let fileNames = [
    "types.swift",
    "hello.swift",
    "index.html",
    "app.html"
]

var foundHTML = false

for fileName in fileNames {

    // Skip every file that is NOT HTML.
    if fileName.hasSuffix(".html") == false {
        continue
    }

    print("File found: \(fileName)")
    foundHTML = true
}

// If no HTML files were found,
// print one message after the loop finishes.
if foundHTML == false {
    print("No HTML file found!")
}

print()

// ======================================================
// break
// ======================================================

// break exits the ENTIRE loop immediately.

let number1 = 4
let number2 = 9

var multiples = [Int]()

for i in 1...10_000 {

    if i.isMultiple(of: number1) &&
        i.isMultiple(of: number2) {

        multiples.append(i)

        // Stop once we have 10 multiples.
        if multiples.count == 10 {
            break
        }
    }
}

print(multiples)

print()

// ======================================================
// Checkpoint 3 - FizzBuzz
// ======================================================

// Rules:
//
// Multiple of BOTH 3 and 5 -> FizzBuzz
// Multiple of ONLY 3 -> Fizz
// Multiple of ONLY 5 -> Buzz
// Otherwise -> Print the number

for i in 1...100 {

    // IMPORTANT:
    // Always check the most specific condition first.
    // If we checked only 3 first,
    // then 15 would print "Fizz" instead of "FizzBuzz".
    if i.isMultiple(of: 3) && i.isMultiple(of: 5) {
        print("FizzBuzz")
    }
    else if i.isMultiple(of: 3) {
        print("Fizz")
    }
    else if i.isMultiple(of: 5) {
        print("Buzz")
    }
    else {
        print(i)
    }
}