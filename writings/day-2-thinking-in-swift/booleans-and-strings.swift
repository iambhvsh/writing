// MARK: - Booleans

var isMovieGood = false
print(isMovieGood)

let number = 120
print(number.isMultiple(of: 3)) // Returns a Boolean

let name = "Peter Benjamin Parker"
print(name.hasSuffix("Parker")) // Returns a Boolean


// MARK: - Flipping a Boolean

// Step 1: Using the NOT (!) operator
isMovieGood = !isMovieGood
print(isMovieGood) // true

// Step 2: Using the toggle() method
isMovieGood.toggle()
print(isMovieGood) // false


// MARK: - Joining Strings

let firstName = "Taylor"
let lastName = "Swift"
let age = 28

// Step 1: String Concatenation (requires manual conversion)
print("My name is " + firstName + " " + lastName + " and I'm " + String(age) + " years old!")

// Step 2: String Interpolation (recommended Swift approach)
print("My name is \(firstName) \(lastName) and I'm \(age) years old!")


// MARK: - Expressions in String Interpolation

print("5 × 5 = \(5 * 5)")


// MARK: - Checkpoint 1: Celsius to Fahrenheit

print("""
==========================================
              Checkpoint 1
==========================================
""")

// Temperature in Celsius
let tempInCelsius = 23.0

// Convert Celsius to Fahrenheit
let tempInFahrenheit = (tempInCelsius * 9 / 5) + 32

// Display the result
print("""
Temperature in Celsius   : \(tempInCelsius)°C
Temperature in Fahrenheit: \(tempInFahrenheit)°F
""")