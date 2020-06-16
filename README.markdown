**MemoizeObject** is a decorator which memoize methods using their value checksum as a cache key instead of reference ID.

# memoize-object-decorator
A decorator returns memoized method which compares objects and arrays by value.

# Installation
`npm i memoize-object-decorator`

# Usage
```typescript
import { MemoizeObject } from 'memoize-object-decorator';

interface Person {
    name: string;
    age: number;
}

class SomeClass {  
  @MemoizeObject()
  factorial(num: number): number {
    return (num <= 1) ? 1 : num * this.factorial(--num);  
  }

  @MemoizeObject() // for circular structures @MemoizeObject({circular: true})
  getFactorialOfPersonAgeMinusSomething(obj: Person, somethingToSubtract: number): number {
      return this.factorial(obj.age) - somethingToSubtract;
  }
}

const fact: SomeClass = new SomeClass();
const person: Person = {
    name: "John Doe",
    age: 10
}

fact.factorial(10); // 3628800
fact.factorial(10); // 3628800, cache hitted 1 time for factorial(10) and returned 3628800
fact.factorial(15); // 1307674368000, cache hitted 1 time for factorial(10) and returned 3628800

fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 3628790, cache hitted 1 time for factorial(10) and returned 3628800
fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 3628790, cache for fact.getFactorialOfPersonAgeMinusSomething hitted 1 time

person.age = 12;

fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 479001590, cache hitted 1 time for factorial(12) and returned 479001600
fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 479001590, cache for fact.getFactorialOfPersonAgeMinusSomething hitted 1 time
fact.getFactorialOfPersonAgeMinusSomething(person, 20) // 479001580, cache hitted 1 time for factorial(12) and returned 479001600
```

# Comparision with standard lodash memoize function/decorator
```typescript
import { Memoize } from 'lodash-decorators';

interface Person {
    name: string;
    age: number;
}

class SomeClass {  
  @Memoize()
  factorial(num: number): number {
    return (num <= 1) ? 1 : num * this.factorial(--num);  
  }

  @Memoize()
  getFactorialOfPersonAgeMinusSomething(obj: Person, somethingToSubtract: number): number {
      return this.factorial(obj.age) - somethingToSubtract;
  }
}

const fact: SomeClass = new SomeClass();
const person: Person = {
    name: "John Doe",
    age: 10
}

fact.factorial(10); // 3628800
fact.factorial(10); // 3628800, cache hitted 1 time for factorial(10) and returned 3628800
fact.factorial(15); // 1307674368000, cache hitted 1 time for factorial(10) and returned 3628800

fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 3628790, cache hitted 1 time for factorial(10) and returned 3628800
fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 3628790, cache for fact.getFactorialOfPersonAgeMinusSomething hitted 1 time

person.age = 12;

fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 3628790, cache for fact.getFactorialOfPersonAgeMinusSomething hitted 1 time
fact.getFactorialOfPersonAgeMinusSomething(person, 10) // 3628790, cache for fact.getFactorialOfPersonAgeMinusSomething hitted 1 time
fact.getFactorialOfPersonAgeMinusSomething(person, 20) // 3628790, cache for fact.getFactorialOfPersonAgeMinusSomething hitted 1 time
```

# What's going on under the hood?
The decorator takes all of the arguments of memoized method and calculates their unique SHA1 hash which is used as a Map key for cache.<br>
In this way we can track objects and arrays by their values instead of the reference. 

# Important
SHA1 hash calculation process is slow in general, so it is not recommended to use this decorator for methods which takes huge objects or/and arrays as an arguments.