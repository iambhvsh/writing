// MARK: - Arrays

var numbers = [1, 33, 4, 56, 678, 889, 6667, 677]
var names = ["Steve Jobs", "Steve Wozniak", "Tim Cook", "Elon Musk"]
var temperatures = [12.3, 34.4, 44.45, 67.6, 56.0]

print("""
Numbers: \(numbers)
Names: \(names)
Temperatures: \(temperatures)
""")

print()

// Accessing array elements

print("""
7th number: \(numbers[6])
1st name: \(names[0])
4th temperature: \(temperatures[3])
""")

print()

// Adding values

numbers.append(69)
names.append("Sundar Pichai")
temperatures.append(56.6)

print(numbers)
print(names)
print(temperatures)

print()

// Empty arrays

var characters = Array<String>()

characters.append("Peter Parker")
characters.append("Gwen Stacy")
characters.append("Sandman")

print(characters)

// Shorthand syntax

characters = [String]()

characters.append("Peter Parker")
characters.append("Gwen Stacy")
characters.append("Sandman")

print(characters)

// Explicit type declaration

var people: [String] = [
    "Joe Biden",
    "Donald Trump"
]

print(people)

print()

// Array operations

print("Count:", characters.count)

characters.remove(at: 2)
print(characters)

characters.removeAll()
print(characters)

characters.append("Gwen Stacy")

print(characters.contains("Gwen Stacy"))
print(characters.contains("Peter Parker"))

print()

// Sorting

let alphabets = ["Z", "N", "A", "P", "W"]
let numericals = [4, 1, 9, 5, 8, 2, 10]

print(alphabets.sorted())
print(numericals.sorted())

// Reversing

print(Array(alphabets.reversed()))

// MARK: - Dictionaries

let singers = [
    [
        "Name": "Elizabeth Woolridge",
        "Nickname": "Lana Del Rey",
        "Username": "@honeymoon"
    ],
    [
        "Name": "Taylor Swift",
        "Nickname": "Taylor",
        "Username": "@taylorswift"
    ]
]

print("""

Name: \(singers[0]["Name", default: "Unknown"])
Nickname: \(singers[0]["Nickname", default: "Unknown"])
Username: \(singers[0]["Username", default: "Unknown"])

""")

let truth = [
    "Swift is bad": false,
    "Swift is fast": true,
    "Swift is easy": true
]

print(truth["Swift is bad", default: false])

// Empty dictionary

var heights = [String: Int]()

heights["James"] = 45
heights["Steve"] = 72

print(heights)


// MARK: - Sets

let favoriteSingers: Set = [
    "Elizabeth Woolridge",
    "Taylor Swift",
    "The Neighbourhood",
    "Dhee",
    "Chinmayi Shripada",
    "Sanjith Hegde"
]

print(favoriteSingers)

var breeds = Set<String>()

breeds.insert("Labrador")
breeds.insert("Labrador")          // Duplicate
breeds.insert("German Shepherd")

print(breeds)

// Sets:
// • Do not preserve insertion order.
// • Automatically remove duplicates.
// • Are generally faster than arrays for lookups.


// MARK: - Enumerations (Enums)

enum Singer: String {
    case elizabethWoolridge = "Elizabeth Woolridge"
    case taylorSwift = "Taylor Swift"
    case chinmayiShripada = "Chinmayi Shripada"
}

print(Singer.elizabethWoolridge)
print(Singer.elizabethWoolridge.rawValue)


// Another enum

enum Weekday {
    case monday
    case tuesday
    case wednesday
    case thursday
    case friday
    case saturday
    case sunday

    // You could also write:
    // case monday, tuesday, wednesday, thursday,
    //      friday, saturday, sunday
}

var day = Weekday.monday

day = .thursday
day = .friday

print(day)