---
title: "Day 1: Writing My First Swift Code"
description: "Today I wrote my first real Swift code. Variables, constants, strings, interpolation, properties, methods, numbers, and discovering how Swift encourages clarity."
publishedAt: 2026-06-20
tags: Swift, SwiftUI, Apple Development, iOS Development, Programming, Learning in Public, 100 Days of SwiftUI
coverImage: "./cover.jpg"
coverAlt: "Swift code displayed in a development environment"
---

## The First Lines of Swift

Yesterday was about understanding the roadmap.

Today was about writing code.

Not SwiftUI.

Not iOS applications.

Not user interfaces.

Just Swift.

After spending years building for the web, learning a new programming language feels strangely familiar and completely different at the same time.

Many concepts carry over.

Variables.

Strings.

Numbers.

Functions.

Yet Swift approaches these concepts with a level of clarity that immediately stood out to me.

Rather than trying to do everything, Swift seems focused on helping developers express intent as clearly as possible.

That became obvious within the first few hours.

## Variables and Constants

One of the first concepts introduced was the difference between variables and constants.

```swift
var age = 18

let firstName = "Peter"
let middleName = "Benjamin"
let lastName = "Parker"
```

Values created with `var` can change.

Values created with `let` cannot.

At first, this seemed like a small distinction.

The more I worked with it, the more I understood why Swift encourages it so heavily.

The language wants you to think about which values are actually meant to change.

If something should remain constant, Swift encourages you to make that intention explicit.

It's a simple idea, but it makes code easier to reason about.

## String Interpolation

Once I had some values to work with, the next step was combining them.

```swift
let fullName = "\(firstName) \(middleName) \(lastName)"
```

This creates:

```text
Peter Benjamin Parker
```

Coming from JavaScript, it felt somewhat similar to template literals.

What I liked immediately was how readable it is.

The code closely resembles the final result.

That theme appears throughout Swift.

## Multiline Strings

The next discovery was multiline strings.

```swift
let bio = """
Peter Benjamin Parker is a young photographer and science enthusiast from New York City.

After being bitten by a radioactive spider, he gained extraordinary abilities and became Spider-Man.
"""
```

I ended up liking this feature more than I expected.

The formatting inside the code mirrors the formatting of the final output.

No repeated newline characters.

No awkward string concatenation.

Just text.

As someone who writes a lot of content, that feels surprisingly natural.

## Properties and Methods

One of the most interesting things I learned today was the difference between properties and methods.

Consider this example:

```swift
let name = "Peter Parker"

print(name.count)
```

Output:

```text
12
```

Notice that `count` doesn't use parentheses.

That's because Swift is simply reading information.

Nothing is being transformed.

Nothing is being calculated beyond retrieving a value that already exists.

Now compare that to:

```swift
print(name.uppercased())
```

Output:

```text
PETER PARKER
```

Here we use parentheses.

Why?

Because Swift is doing work.

It takes the original string, creates an uppercase version, and returns the result.

This pattern appears throughout Swift:

- Properties describe data.
- Methods perform work.

Once I understood that distinction, many APIs immediately made more sense.

## Exploring Strings

With that understanding, I started experimenting with Swift's string APIs.

```swift
fullName.count

fullName.lowercased()
fullName.uppercased()

bio.hasPrefix("Peter")
bio.contains("Spider-Man")
bio.hasSuffix("superheroes.")
```

One thing I noticed is how naturally these APIs read.

For example:

```swift
bio.hasPrefix("Peter")
```

reads almost like a sentence.

The same applies to:

```swift
age.isMultiple(of: 3)
```

Swift places a lot of emphasis on readability, and it shows.

## Numbers and Readability

Swift handles whole numbers exactly as you'd expect.

```swift
let million = 1000000
let billion = 1000000000
```

The problem is that large numbers quickly become difficult to read.

Swift solves this with underscores.

```swift
let million = 1_000_000
let billion = 1_000_000_000
```

The underscores don't change the value.

Swift completely ignores them.

They're simply there to help humans read the code.

I also found it interesting that Swift doesn't care where the underscores are placed.

For example:

```swift
let lakh = 1_00_000
let crore = 1_00_00_000
```

These work perfectly as well.

The compiler sees the same number regardless.

## Compound Assignment Operators

Another small but useful concept was compound assignment operators.

Instead of writing:

```swift
var age = 19

age = age + 1
```

Swift allows us to write:

```swift
var age = 19

age += 1
```

Both approaches produce the same result.

The second version is simply shorter and easier to read.

Swift supports several compound assignment operators:

```swift
var number = 10

number += 5
number -= 3
number *= 2
number /= 4
```

These are common throughout Swift code and quickly become second nature.

## Discovering Types

Another concept that stood out was type inference.

Consider these values:

```swift
let a = 1.2
let b = 5
let c = "Hello, Swift!"
```

Without explicitly specifying types, Swift automatically understands them as:

- Double
- Int
- String

You can inspect them directly:

```swift
print(type(of: a))
print(type(of: b))
print(type(of: c))
```

Output:

```text
Double
Int
String
```

This was a useful reminder that Swift is strongly typed while still remaining convenient to work with.

## Arithmetic

I also spent some time experimenting with basic arithmetic.

```swift
let a = 1.2
let b = 1.000000000003

print(a + b)
print(a - b)
print(a * b)
print(a / b)
```

Nothing groundbreaking here.

But every language has its own way of handling numbers, and spending time experimenting helps build intuition.

Sometimes the simplest exercises teach the most.

## What Stood Out Most

The biggest lesson from Day 1 wasn't variables.

Or strings.

Or numbers.

It was how intentional Swift feels.

Many APIs read like English.

Many language features seem designed to prevent mistakes before they happen.

The language consistently encourages clarity over cleverness.

After years of writing JavaScript and TypeScript, that difference was immediately noticeable.

Not necessarily better.

Not necessarily worse.

Just different.

And that's exactly why I'm excited to keep learning.

## Looking Ahead

Today was about foundations.

Variables.

Constants.

Strings.

Numbers.

Types.

Nothing particularly complex.

But every application begins with these building blocks.

Tomorrow the journey continues with more of Swift's core language features.

One day down.

Ninety-nine to go.

## Day 1 Code

The complete code from today's learning session is available here:

- [Fundamentals.swift](./fundamentals.swift)
