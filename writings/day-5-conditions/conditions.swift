// MARK: - Day 5: Conditions

// ============================================================
// Checking Whether a Condition is True or False
// ============================================================

let favoriteSinger = "Elizabeth Woolridge"

if favoriteSinger == "Elizabeth Woolridge" {
    print("Yes, that's Lana Del Rey.")
} else {
    print("That's another artist.")
}

/*
 Comparison Operators

 ==   Equal to
 !=   Not equal to
 >    Greater than
 <    Less than
 >=   Greater than or equal to
 <=   Less than or equal to
 */


// ============================================================
// Comparing Different Types of Data
// ============================================================

// Numbers

let score = 86

if score >= 80 {
    print("Excellent!")
} else if score >= 40 {
    print("Pass")
} else {
    print("Fail")
}

// Strings

let singerOne = "Elizabeth Woolridge"
let singerTwo = "Taylor Swift"

if singerOne < singerTwo {
    print("\(singerOne) comes first alphabetically.")
} else {
    print("\(singerTwo) comes first alphabetically.")
}

// Booleans

let likesLana = true

if likesLana {
    print("Now Playing: Lana Del Rey")
}


// ============================================================
// Working with Arrays
// ============================================================

var favoriteArtists = [
    "Elizabeth Woolridge",
    "Billie Eilish",
    "Taylor Swift"
]

favoriteArtists.append("Coldplay")

if favoriteArtists.count > 3 {
    favoriteArtists.removeLast()
}

print(favoriteArtists)


// ============================================================
// Checking if a String is Empty
// ============================================================

var playlistName = ""

if playlistName.isEmpty {
    playlistName = "Lana Favorites"
}

print("Playlist: \(playlistName)")


// ============================================================
// Checking Multiple Conditions (AND)
// Both conditions must be true.
// ============================================================

let likesBillie = true

if likesLana && likesBillie {
    print("Perfect playlist!")
} else {
    print("Add a few more favorites.")
}


// ============================================================
// Checking Multiple Conditions (OR)
// Only one condition needs to be true.
// ============================================================

let likesTaylor = false

if likesLana || likesTaylor {
    print("You have at least one favorite artist selected.")
}


// ============================================================
// if, else if and else
// ============================================================

enum Singer {
    case lanaDelRey
    case billieEilish
    case taylorSwift
    case coldplay
}

let currentFavorite = Singer.billieEilish

if currentFavorite == .lanaDelRey {
    print("Elizabeth Woolridge will always be my favorite artist.")
} else if currentFavorite == .billieEilish {
    print("Billie Eilish is my second favorite artist.")
} else if currentFavorite == .taylorSwift {
    print("Taylor Swift is also one of my favorites.")
} else {
    print("I'm always open to discovering new artists.")
}

/*
 Swift checks conditions from top to bottom.

 As soon as one condition is true,
 the remaining conditions are skipped.
 */


// ============================================================
// Combining Multiple Conditions
// ============================================================

let hasAppleMusic = true
let isOnline = true

if hasAppleMusic && isOnline {
    print("Ready to start listening.")
}

if hasAppleMusic || isOnline {
    print("Music is available in some way.")
}


// ============================================================
// Switch Statements
// ============================================================

switch currentFavorite {

case .lanaDelRey:
    print("Now Playing: Lana Del Rey")

case .billieEilish:
    print("Now Playing: Billie Eilish")

case .taylorSwift:
    print("Now Playing: Taylor Swift")

case .coldplay:
    print("Now Playing: Coldplay")
}

/*
 A switch statement is a great choice when you have
 one value with several possible fixed cases.

 Enums work especially well with switch because
 Swift already knows every possible case.

 Since every case is handled,
 a default case isn't needed.
 */


// ============================================================
// Using default
// ============================================================

let albumCount = 5

switch albumCount {

case 1:
    print("One album")

case 2:
    print("Two albums")

default:
    print("More than two albums")
}

/*
 Integers can have many possible values,
 so Swift requires a default case.
 */


// ============================================================
// fallthrough
// ============================================================

/*
 Swift automatically stops after the first matching case.

 Use fallthrough if you want Swift to continue
 executing the next case.

 Example:

 switch currentFavorite {

 case .lanaDelRey:
     print("Playing Lana Del Rey")
     fallthrough

 case .billieEilish:
     print("Playing Billie Eilish")

 case .taylorSwift:
     print("Playing Taylor Swift")

 case .coldplay:
     print("Playing Coldplay")
 }

 If currentFavorite is .lanaDelRey,
 the output will be:

 Playing Lana Del Rey
 Playing Billie Eilish
 */


// ============================================================
// Ternary Conditional Operator
// ============================================================

let hour = 16

let greeting = hour < 12
    ? "Good morning."
    : "Good afternoon."

print(greeting)

/*
 The ternary operator is a shorter way to write
 a simple if / else statement.

 condition ? valueIfTrue : valueIfFalse

 The code above is equivalent to:

 if hour < 12 {
     print("Good morning.")
 } else {
     print("Good afternoon.")
 }

 Use the ternary operator when there are only
 two simple possible outcomes.
 */