// MARK: - Variables and Constants

var age = 18

let firstName = "Peter"
let middleName = "Benjamin"
let lastName = "Parker"

let million = 1_000_000
let billion = 1_000_000_000

// MARK: - Strings

let fullName = "\(firstName) \(middleName) \(lastName)"

let bio = """
\(fullName) is a young photographer and science enthusiast from New York City. After being bitten by a radioactive spider, he gained extraordinary abilities including superhuman strength, agility, and the ability to cling to walls. He uses these powers to protect people as Spider-Man.

Guided by the lesson that "with great power comes great responsibility," Peter dedicates his life to helping others despite the challenges he faces. Balancing his personal life with his duties as Spider-Man, he has become one of Marvel's most beloved and enduring superheroes.
"""

// MARK: - Basic Information
print("Basic Information")

print("""
Name: \(fullName)
Age: \(age)

Bio:
\(bio)
""")

print()

// MARK: - String Character Counts

print("String Character Counts")

print("""
Full Name: \(fullName.count)
Bio: \(bio.count)
""")

print()

// MARK: - String Conversion

print("String Conversion")

print("""
Lowercase: \(fullName.lowercased())
Uppercase: \(fullName.uppercased())
""")

print()

// MARK: - String Search

print("String Search")

print("""
Starts with "Peter": \(bio.hasPrefix("Peter"))
Contains "challenges he faces": \(bio.contains("challenges he faces"))
Ends with "superheroes.": \(bio.hasSuffix("superheroes."))
""")

print()

// MARK: - Numbers

print("Numbers")

print("""
Million: \(million)
Billion: \(billion)
""")

print()

// MARK: - Multiples

print("Multiples")

print("""
Is \(age) a multiple of 2? \(age.isMultiple(of: 2))
Is \(age) a multiple of 6? \(age.isMultiple(of: 6fun))
Is \(age) a multiple of \(age)? \(age.isMultiple(of: age))
""")

print()

// MARK: - Arithmetic

let a = 1.2
let b = 1.000000000003

print("Arithmetic")

print("""
\(a) + \(b) = \(a + b)
\(a) - \(b) = \(a - b)
\(a) * \(b) = \(a * b)
\(a) / \(b) = \(a / b)
""")

print()

// MARK: - Type Inference

let c = 5
let d = "Hello, Swift!"

print("Data Types")

print("""
a: \(type(of: a))
b: \(type(of: b))
c: \(type(of: c))
d: \(type(of: d))
""")