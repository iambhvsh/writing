// MARK: - Type Annotations

let score: Double = 0
let randomNumber: Int = 566
let fullName: String = "Elizabeth Woolridge Grant"

let luckyNumbers: [Int] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

let lanaAlbums: [String] = [
    "Lust for Life",
    "Born to Die",
    "Ultraviolence",
    "Honeymoon",
    "Chemtrails Over the Country Club"
]

let lanaSongs: Set<String> = [
    "Born to Die",
    "Video Games",
    "Chemtrails Over the Country Club",
    "Margaret",
    "Say Yes To Heaven"
]


// MARK: - Empty Collections

// Empty array of strings
let songs: [String] = []

// Another way to create an empty array
let featuredAlbums = [String]()

// Empty array using type inference
let topFans = [String]()

// Empty dictionary with String keys and Int values
let ages = [String: Int]()


// MARK: - Enumerations (Enums)

enum ThemeColor {
    case red
    case orange
    case blue
    case yellow
}

// Create an enum value
var currentTheme = ThemeColor.blue

// Swift already knows the type, so we can use shorthand syntax
currentTheme = .red


// MARK: - When Should You Use Type Annotations?

/*
 Swift is excellent at inferring types, so you usually don't need
 to write type annotations everywhere.

 Use them when:

 • Creating empty collections.
 • You want a specific type (e.g. Double instead of Int).
 • They make your code easier to understand.

 For example, `score` is declared as Double because scores
 might contain decimal values.
 */


// MARK: - Checkpoint

let singers = [
    "Lana Del Rey",
    "Taylor Swift",
    "Billie Eilish",
    "Lana Del Rey",
    "Joe Keery",
    "Lord Huron",
    "Lord Huron"
]

print("Total singers: \(singers.count)")

let uniqueSingers = Set(singers)

print("Unique singers: \(uniqueSingers.count)")