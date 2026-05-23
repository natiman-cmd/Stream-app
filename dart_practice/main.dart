void main() {
  print('=== Hello World ===');
  print('Hello, World!');
  print('');

  variablesExercise();
  functionsExercise();
  listsExercise();
  classesExercise();
  mapsExercise();
  nullSafetyExercise();
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

// ── 5. Maps ───────────────────────────────────────────────────────────────────
void mapsExercise() {
  print('=== Maps ===');

  // A Map stores key-value pairs
  Map<String, dynamic> movie = {
    'title': 'Interstellar',
    'year': 2014,
    'rating': 8.7,
  };

  print('Title: ${movie['title']}');
  print('Year: ${movie['year']}');
  print('Rating: ${movie['rating']}');

  // Add a new key
  movie['director'] = 'Christopher Nolan';
  print('Director: ${movie['director']}');

  // Loop through all key-value pairs
  print('Full movie info:');
  movie.forEach((key, value) {
    print('  $key: $value');
  });

  // Check if a key exists
  print('Has genre? ${movie.containsKey('genre')}');

  // Map of movie genres to lists of movies
  Map<String, List<String>> catalog = {
    'Action': ['Mad Max', 'John Wick'],
    'Sci-Fi': ['Dune', 'Interstellar'],
    'Drama': ['Oppenheimer'],
  };

  print('Sci-Fi movies: ${catalog['Sci-Fi']}');

  print('');
}

// ── 6. Null Safety ────────────────────────────────────────────────────────────
void nullSafetyExercise() {
  print('=== Null Safety ===');

  // Non-nullable: must always have a value
  String title = 'Inception';
  print('Title: $title');

  // Nullable: can be null, use ? to declare
  String? genre;
  print('Genre before: $genre');

  genre = 'Sci-Fi';
  print('Genre after: $genre');

  // Null-aware operators
  String? director;

  // ?? provides a fallback if the value is null
  String displayDirector = director ?? 'Unknown director';
  print('Director: $displayDirector');

  // ?. safely calls a method only if not null
  String? description;
  print('Length: ${description?.length}');

  // ! asserts the value is not null (use carefully)
  String? knownTitle = 'Dune';
  print('Known title length: ${knownTitle!.length}');

  // Nullable in a class field
  StreamUser user1 = StreamUser(name: 'Alice', subscription: 'Premium');
  StreamUser user2 = StreamUser(name: 'Bob', subscription: null);

  user1.showStatus();
  user2.showStatus();

  print('');
}

class StreamUser {
  String name;
  String? subscription;

  StreamUser({required this.name, required this.subscription});

  void showStatus() {
    String plan = subscription ?? 'Free';
    print('$name is on the $plan plan');
  }
}
