import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'Which OOP principle hides internal data behind methods?', options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Overloading'], answer: 1, explain: '**Encapsulation**.' },
  { q: 'Two methods with the same name but different parameters in one class is…', options: ['Overriding', 'Overloading', 'Inheritance', 'Abstraction'], answer: 1, explain: '**Overloading** — compile-time polymorphism.' },
  { q: 'Which can have a constructor?', options: ['Interface', 'Abstract class', 'Both', 'Neither'], answer: 1, explain: 'An **abstract class** can have constructors; interfaces cannot.' },
  { q: 'Which exception type must be caught or declared?', options: ['Unchecked', 'Checked', 'Error', 'All'], answer: 1, explain: '**Checked** exceptions are enforced by the compiler.' },
  { q: 'Which is NOT a RuntimeException?', options: ['NullPointerException', 'IllegalStateException', 'SQLException', 'ArithmeticException'], answer: 2, explain: '**SQLException** is a checked exception.' },
  { q: 'Which List implementation gives fastest random access by index?', options: ['LinkedList', 'ArrayList', 'TreeSet', 'HashMap'], answer: 1, explain: '**ArrayList** is backed by an array → O(1) get(index).' },
  { q: 'What must you implement correctly for objects used as HashMap keys?', options: ['toString()', 'equals() and hashCode()', 'compareTo() only', 'clone()'], answer: 1, explain: '**equals() and hashCode()** must be consistent.' },
  { q: 'Which propagation is the default for @Transactional?', options: ['REQUIRES_NEW', 'REQUIRED', 'NEVER', 'SUPPORTS'], answer: 1, explain: '**REQUIRED** — join the current transaction or create one.' },
  { q: 'Why might @Transactional not work when calling a method in the same class?', options: ['Spring does not support it at all', 'Self-invocation bypasses the Spring proxy', 'The DB is down', 'Methods must be static'], answer: 1, explain: 'Calls inside the same object do not pass through the **proxy**.' },
  { q: 'What does System.out.println(0.1 + 0.2) print in Java?', options: ['0.3', '0.30', '0.30000000000000004', '0.2999'], answer: 2, explain: 'Binary floating point → **0.30000000000000004**.' },
  { q: 'Which rounding mode is known as "banker\'s rounding"?', options: ['HALF_UP', 'HALF_EVEN', 'CEILING', 'DOWN'], answer: 1, explain: '**HALF_EVEN** rounds .5 to the nearest even digit, reducing cumulative bias.' },
  { q: 'Which method should you use to check if two BigDecimal amounts are numerically equal?', options: ['==', 'equals()', 'compareTo() == 0', 'hashCode()'], answer: 2, explain: '**compareTo** ignores scale (2.0 vs 2.00).' },
];

export const flashcards: Flashcard[] = [
  { front: '4 OOP pillars', back: '**Encapsulation** · **Abstraction** · **Inheritance** · **Polymorphism**.', tag: 'definition' },
  { front: 'Overriding vs overloading', back: '**Overriding**: subclass redefines a method (runtime). **Overloading**: same name, different parameters (compile time).', tag: 'definition' },
  { front: 'Interface vs abstract class', back: '**Interface**: contract, many per class, constants only, default/static methods. **Abstract class**: shared code + state, constructor, single inheritance.', tag: 'definition' },
  { front: 'Checked vs unchecked', back: '**Checked** (IOException, SQLException): must catch/declare. **Unchecked** (RuntimeException: NPE, IllegalArgument).', tag: 'definition' },
  { front: 'try-with-resources', back: '`try (Resource r = ...) { }` — auto-closes AutoCloseable resources (Java 7+).', tag: 'definition' },
  { front: 'List / Set / Map', back: '**List**: ordered, duplicates. **Set**: unique. **Map**: key → value.', tag: 'definition' },
  { front: 'HashMap vs TreeMap vs ConcurrentHashMap', back: '**HashMap**: O(1), unordered, not thread-safe. **TreeMap**: sorted keys. **ConcurrentHashMap**: thread-safe.', tag: 'definition' },
  { front: 'equals / hashCode contract', back: 'If a.equals(b) then a.hashCode() == b.hashCode(). Required for HashMap keys and HashSet.', tag: 'fact' },
  { front: '@Transactional rollback rule', back: 'Rolls back on **RuntimeException and Error** by default; not on checked exceptions unless `rollbackFor`.', tag: 'fact' },
  { front: 'Self-invocation trap', back: 'Calling a @Transactional method from the same class bypasses the proxy → no transaction.', tag: 'fact' },
  { front: 'Propagation REQUIRED vs REQUIRES_NEW', back: '**REQUIRED** (default): join or create. **REQUIRES_NEW**: suspend current, always start a new transaction.', tag: 'definition' },
  { front: 'Why BigDecimal for money', back: 'double cannot represent decimals like 0.1 exactly. BigDecimal = exact, with scale + RoundingMode. Create from String; compare with compareTo.', tag: 'fact' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'Explain the four pillars of OOP with a banking example.',
    answer: `- **Encapsulation**: an Account keeps its balance private; it can only change through deposit() and withdraw(), which check the rules.
- **Abstraction**: other code calls account.monthlyInterest() without knowing how it's calculated.
- **Inheritance**: SavingsAccount and FixedDepositAccount extend Account and reuse its common code.
- **Polymorphism**: calling monthlyInterest() on a list of Accounts runs a different calculation for each account type (method overriding), and overloading lets the same method name accept different parameters.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between an interface and an abstract class?',
    answer: `An **interface** defines a **contract** — what a class can do. A class can implement many interfaces. Interfaces have no instance state or constructors; since Java 8 they can have default and static methods.

An **abstract class** is a **partial implementation** — it can have fields, constructors and concrete methods, but a class can extend only one. I use an interface for a capability shared by unrelated classes, like a NotificationSender implemented by SMS and email senders, and an abstract class when related classes share code and state, like an Account base class. In Spring, I code to interfaces so implementations can be swapped and mocked.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between checked and unchecked exceptions?',
    answer: `**Checked exceptions** — like IOException and SQLException — are checked by the compiler; you must catch them or declare them with throws. They represent expected, recoverable problems like a failed network call.

**Unchecked exceptions** extend RuntimeException — like NullPointerException or IllegalArgumentException — and usually mean a programming error or invalid input; the compiler doesn't force handling.

**Errors** like OutOfMemoryError are serious JVM problems that we normally don't catch. Good practice: catch specific exceptions, never swallow them, keep the original cause, and log useful context without sensitive data like card numbers.`,
  },
  {
    type: 'technical',
    q: 'How does @Transactional work in Spring?',
    answer: `Spring wraps the bean in a **proxy**. When a @Transactional method is called from another bean, the proxy starts a transaction, runs the method, and **commits** if it completes or **rolls back** if a **RuntimeException or Error** is thrown. Checked exceptions don't roll back by default unless I use rollbackFor.

Two common pitfalls: **self-invocation** — calling the method from inside the same class bypasses the proxy so there's no transaction — and putting long remote calls inside a transaction, which holds database locks. The default propagation is REQUIRED; REQUIRES_NEW is useful for things like audit logs that must be saved even if the main transaction fails. I used this in my projects for operations that had to save multiple records together.`,
    tips: ['Give one real example from your own project.'],
  },
  {
    type: 'technical',
    q: 'Why should we use BigDecimal instead of double for money?',
    answer: `Because double uses **binary floating point**, which can't represent most decimal fractions exactly — 0.1 + 0.2 gives 0.30000000000000004. Over millions of banking transactions those tiny errors add up and won't reconcile with the ledger.

**BigDecimal** stores exact decimal values. For money I create it from a String or valueOf, always set the **scale and rounding mode** — for example setScale(2, RoundingMode.HALF_EVEN) — remember it's immutable so I assign the result of add(), compare amounts with compareTo() rather than equals(), and store values in the database as DECIMAL/NUMERIC.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between ArrayList and LinkedList? HashMap and ConcurrentHashMap?',
    answer: `**ArrayList** is backed by a dynamic array: very fast random access by index, but inserting or removing in the middle shifts elements. **LinkedList** is a doubly linked list: fast add/remove at the ends, but slow index access. In practice ArrayList is the default choice.

**HashMap** gives O(1) average lookups but is **not thread-safe**. **ConcurrentHashMap** is designed for many threads at once without locking the whole map, and it doesn't allow null keys or values — useful for shared caches in a multi-threaded service. Keys in both must implement equals() and hashCode() correctly.`,
  },
];
