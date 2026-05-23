void main() {
  print('=== Hello World ===');
  print('Hello, World!');
  print('');

  variablesExercise();
  functionsExercise();
  listsExercise();
  classesExercise();
}

// ── 1. Variables ─────────────────────────────────────────────────────────────
void variablesExercise() {
  print('=== Variables ===');

  String name = 'Dart';
  int year = 2026;
  double version = 3.10;
  bool isAwesome = true;

  print('Language: $name');
  print('Year: $year');
  print('Version: $version');
  print('Awesome? $isAwesome');

  // var lets Dart infer the type
  var greeting = 'Hello from var!';
  print(greeting);

  // final can only be set once
  final String appName = 'StreamApp';
  print('App: $appName');

  print('');
}

// ── 2. Functions ─────────────────────────────────────────────────────────────
void functionsExercise() {
  print('=== Functions ===');

  print(add(3, 4));
  print(greet('World'));
  print(multiply(5, 6));

  print('');
}

int add(int a, int b) {
  return a + b;
}

String greet(String name) {
  return 'Hello, $name!';
}

// Arrow function shorthand
int multiply(int a, int b) => a * b;

// ── 3. Lists ──────────────────────────────────────────────────────────────────
void listsExercise() {
  print('=== Lists ===');

  List<String> movies = ['Inception', 'Interstellar', 'Dune'];

  print('All movies: $movies');
  print('First movie: ${movies[0]}');
  print('Total movies: ${movies.length}');

  movies.add('Oppenheimer');
  print('After adding: $movies');

  movies.remove('Dune');
  print('After removing: $movies');

  // Loop through list
  print('Movie list:');
  for (String movie in movies) {
    print('  - $movie');
  }

  print('');
}

// ── 4. Classes ────────────────────────────────────────────────────────────────
void classesExercise() {
  print('=== Classes ===');

  Movie movie1 = Movie(title: 'Inception', year: 2010, rating: 8.8);
  Movie movie2 = Movie(title: 'Dune', year: 2021, rating: 8.0);

  movie1.describe();
  movie2.describe();

  print('Is Inception highly rated? ${movie1.isHighlyRated()}');
  print('Is Dune highly rated? ${movie2.isHighlyRated()}');
}

class Movie {
  String title;
  int year;
  double rating;

  Movie({required this.title, required this.year, required this.rating});

  void describe() {
    print('$title ($year) — Rating: $rating');
  }

  bool isHighlyRated() => rating >= 8.5;
}
