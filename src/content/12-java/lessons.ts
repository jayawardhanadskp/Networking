import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'oop',
    title: 'The four pillars of OOP',
    analogy:
      'An **ATM** is a great OOP example: you see buttons, not the internal wiring (**encapsulation / abstraction**); a "deposit ATM" is a special kind of ATM (**inheritance**); and "withdraw" works differently for savings and current accounts (**polymorphism**).',
    body: `- **Encapsulation** — keep data **private** inside a class and expose behaviour through methods. The balance can only change through \`deposit()\` / \`withdraw()\`, which check the rules.
- **Abstraction** — show **what** an object does, hide **how**. Use interfaces/abstract classes (e.g. \`PaymentService.pay()\`).
- **Inheritance** — a class **reuses** and extends another (\`SavingsAccount extends Account\`). "is-a" relationship. Java: single class inheritance, many interfaces.
- **Polymorphism** — one interface, many forms. **Overriding** (runtime: \`account.calculateInterest()\` runs the subclass version) and **overloading** (compile time: same method name, different parameters).

\`\`\`
public abstract class Account {
    private BigDecimal balance = BigDecimal.ZERO;   // encapsulated
    public void deposit(BigDecimal amount) {
        if (amount.signum() <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance = balance.add(amount);
    }
    public abstract BigDecimal monthlyInterest();   // abstraction
}
public class SavingsAccount extends Account {       // inheritance
    @Override
    public BigDecimal monthlyInterest() { /* savings rule */ return BigDecimal.ZERO; } // polymorphism
}
\`\`\`

Also good to mention: **composition over inheritance** ("has-a"), and SOLID principles.`,
    visuals: [
      {
        kind: 'fields',
        title: 'OOP pillars with a bank account',
        rows: [
          {
            label: 'Pillar → what it means',
            fields: [
              { text: 'Encapsulation', sub: 'private data + public methods', tone: 'blue' },
              { text: 'Abstraction', sub: 'hide how, show what', tone: 'purple' },
              { text: 'Inheritance', sub: 'is-a, reuse code', tone: 'green' },
              { text: 'Polymorphism', sub: 'one call, many behaviours', tone: 'amber' },
            ],
          },
          {
            label: 'Bank example',
            fields: [
              { text: 'balance is private', tone: 'blue' },
              { text: 'Account.monthlyInterest()', tone: 'purple' },
              { text: 'SavingsAccount extends Account', tone: 'green' },
              { text: 'each account type calculates differently', tone: 'amber' },
            ],
          },
        ],
      },
    ],
    bank: `Even in an admin interview, panels sometimes ask a few developer questions because of your background. Keep answers **short with a bank example** — it shows you can explain technical ideas clearly, which is useful when working with development teams and vendors.`,
    remember: [
      '**Encapsulation** (private data, methods), **Abstraction** (what not how), **Inheritance** (is-a), **Polymorphism** (overriding = runtime, overloading = compile time).',
      'Java: single class inheritance, multiple interfaces.',
      'Prefer composition over inheritance when "has-a".',
    ],
    check: [
      {
        q: 'Method overriding is an example of…',
        options: ['Compile-time polymorphism', 'Runtime polymorphism', 'Encapsulation', 'Composition'],
        answer: 1,
        explain: 'The JVM decides at **runtime** which overridden method to call.',
      },
      {
        q: 'Making fields private and changing them only through methods is…',
        options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Overloading'],
        answer: 1,
        explain: '**Encapsulation** protects the object\'s state.',
      },
    ],
  },
  {
    id: 'interface-abstract',
    title: 'Interface vs abstract class',
    analogy:
      'An **interface** is a **job description**: "must be able to authorise payments" — any company can sign up for many job descriptions. An **abstract class** is a **partly built house**: walls already done (shared code), rooms left for you to finish — and you can only buy one house.',
    body: `| | Interface | Abstract class |
|---|---|---|
| Purpose | A **contract** (what) | A **partial implementation** (shared code) |
| Methods | Abstract; since Java 8 **default** and **static**; Java 9 private | Abstract and concrete |
| Fields | Only \`public static final\` constants | Any fields (state) |
| Constructor | No | Yes |
| Inheritance | A class can implement **many** | A class can extend **only one** |
| Use when | Different classes share a capability (\`Comparable\`, \`PaymentGateway\`) | Related classes share code and state (\`Account\` base) |

In Spring, we usually code to **interfaces** (e.g. \`TransferService\`) so implementations can be swapped and mocked in tests (dependency injection).`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'Interface', icon: '📜', tone: 'blue' },
          { label: 'Abstract class', icon: '🏗️', tone: 'purple' },
        ],
        rows: [
          { label: 'Keyword', values: ['`implements`', '`extends`'] },
          { label: 'How many?', values: ['Many per class', 'Only one per class'] },
          { label: 'State (fields)', values: ['Constants only', 'Yes, instance fields'] },
          { label: 'Constructor', values: ['No', 'Yes'] },
          { label: 'Example', values: ['`interface NotificationSender { void send(Msg m); }`', '`abstract class Account { BigDecimal balance; … }`'] },
        ],
      },
    ],
    bank: `Example: \`interface NotificationSender\` implemented by \`SmsSender\` and \`EmailSender\` (different capabilities, no shared state) vs \`abstract class Account\` extended by \`SavingsAccount\` and \`FixedDepositAccount\` (shared balance logic).`,
    remember: [
      'Interface = **contract**, many per class, constants only, default/static methods since Java 8.',
      'Abstract class = **shared code + state**, constructors, only one per class.',
      'Code to interfaces → easy to swap implementations and test (Spring DI).',
    ],
    check: [
      {
        q: 'How many abstract classes can a Java class extend?',
        options: ['None', 'One', 'Two', 'Unlimited'],
        answer: 1,
        explain: 'Java allows **single** class inheritance.',
      },
      {
        q: 'Since Java 8, interfaces can contain…',
        options: ['Constructors', 'Instance fields', 'Default and static methods', 'Private instance variables'],
        answer: 2,
        explain: 'Java 8 added **default** and **static** methods to interfaces.',
      },
    ],
  },
  {
    id: 'exceptions',
    title: 'Exceptions',
    analogy:
      'Exceptions are like **incident reports**. Some problems you **must plan for** (checked — "the network may be down"), some are **programming mistakes** (unchecked — "you divided by zero"), and some are **disasters** you cannot handle (errors — "the building has no power").',
    body: `Hierarchy: \`Throwable\` → **\`Error\`** (serious JVM problems: \`OutOfMemoryError\`, \`StackOverflowError\` — don't catch) and **\`Exception\`**.
- **Checked exceptions** — subclasses of Exception (not Runtime): \`IOException\`, \`SQLException\`. The compiler forces you to **catch or declare** (\`throws\`).
- **Unchecked exceptions** — \`RuntimeException\` and subclasses: \`NullPointerException\`, \`IllegalArgumentException\`, \`IllegalStateException\`, \`ArithmeticException\`. Usually programming errors or invalid input.

\`\`\`
try (Connection con = dataSource.getConnection();          // try-with-resources:
     PreparedStatement ps = con.prepareStatement(sql)) {    // auto-closed
    ps.setString(1, accountNo);
    ...
} catch (SQLException e) {
    log.error("Balance lookup failed for account {}", mask(accountNo), e);
    throw new BalanceUnavailableException("Try again later", e); // custom, keeps cause
} finally {
    // runs whether or not an exception happened
}
\`\`\`

Good practice: catch **specific** exceptions, never swallow them (empty catch), **log with context but no sensitive data** (no full card numbers/passwords), use custom exceptions (\`InsufficientFundsException\`), keep the original **cause**.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Java exception hierarchy',
        rows: [
          { fields: [{ text: 'Throwable', tone: 'slate' }] },
          {
            fields: [
              { text: 'Error', sub: 'OutOfMemoryError, StackOverflowError — do not catch', tone: 'red' },
              { text: 'Exception', sub: 'recoverable problems', tone: 'blue' },
            ],
          },
          {
            label: 'Under Exception',
            fields: [
              { text: 'Checked', sub: 'IOException, SQLException — must catch or declare', tone: 'amber' },
              { text: 'RuntimeException (unchecked)', sub: 'NullPointer, IllegalArgument, IllegalState', tone: 'green' },
            ],
          },
        ],
      },
    ],
    bank: `Why it matters in a bank: a swallowed exception can hide a **failed transaction**; logging a full card number in an exception message breaks **PCI DSS**. As an admin, you will read **stack traces in logs** to help find whether a problem is the network (e.g. \`ConnectException\`, \`SocketTimeoutException\`), the database (\`SQLException\`) or the code (\`NullPointerException\`).`,
    remember: [
      'Throwable → **Error** (don\'t catch) and **Exception** → **checked** (must handle) vs **RuntimeException** (unchecked).',
      '**try-with-resources** auto-closes; `finally` always runs.',
      'Catch specific, never swallow, log context **without sensitive data**, keep the cause.',
    ],
    check: [
      {
        q: 'Which is a checked exception?',
        options: ['NullPointerException', 'IllegalArgumentException', 'IOException', 'ArithmeticException'],
        answer: 2,
        explain: '**IOException** must be caught or declared. The others are RuntimeExceptions.',
      },
      {
        q: 'What does try-with-resources do?',
        options: ['Retries the code', 'Automatically closes resources (AutoCloseable) after the block', 'Ignores exceptions', 'Runs code in parallel'],
        answer: 1,
        explain: 'Resources declared in try(...) are **closed automatically**.',
      },
    ],
  },
  {
    id: 'collections',
    title: 'Collections',
    analogy:
      '**List** = a queue of customers in order (duplicates allowed). **Set** = a guest list with **no duplicates**. **Map** = a locker room: each **key** (locker number) opens one **value** (the bag).',
    body: `| Interface | Main implementations | Notes |
|---|---|---|
| **List** (ordered, duplicates) | **ArrayList**, LinkedList | ArrayList: fast random access by index. LinkedList: fast add/remove at ends, slow index access. |
| **Set** (no duplicates) | **HashSet**, LinkedHashSet, TreeSet | HashSet: no order, O(1). LinkedHashSet: insertion order. TreeSet: sorted. |
| **Map** (key → value) | **HashMap**, LinkedHashMap, TreeMap, **ConcurrentHashMap** | HashMap: O(1) average, not thread-safe, allows one null key. TreeMap: sorted keys. ConcurrentHashMap: thread-safe, no nulls. |
| **Queue / Deque** | ArrayDeque, PriorityQueue, LinkedList | FIFO, stack, priority order |

Important:
- Objects used as **HashMap keys / in HashSets** must correctly implement **\`equals()\` and \`hashCode()\`** (equal objects → same hash code).
- **Thread safety**: HashMap/ArrayList are not thread-safe → use \`ConcurrentHashMap\`, \`CopyOnWriteArrayList\` or synchronisation.
- Use **immutable** collections (\`List.of()\`) when data should not change.
- **Streams** (Java 8): \`accounts.stream().filter(a -> a.isActive()).map(Account::getBalance).reduce(BigDecimal.ZERO, BigDecimal::add)\`.`,
    visuals: [
      {
        kind: 'compare',
        title: 'Which collection?',
        columns: [
          { label: 'List', icon: '📋', tone: 'blue' },
          { label: 'Set', icon: '🎟️', tone: 'green' },
          { label: 'Map', icon: '🗝️', tone: 'purple' },
        ],
        rows: [
          { label: 'Order', values: ['Yes (index)', 'HashSet no; Linked/Tree yes', 'HashMap no; Linked/Tree yes'] },
          { label: 'Duplicates', values: ['Allowed', 'Not allowed', 'Keys unique; values can repeat'] },
          { label: 'Common class', values: ['ArrayList', 'HashSet', 'HashMap'] },
          { label: 'Bank example', values: ['Transactions in a statement', 'Unique branch codes', 'accountNo → Account cache'] },
        ],
      },
    ],
    bank: `You know caching from **Redis** (your certification!) — a Redis hash or a Java \`ConcurrentHashMap\` cache of exchange rates are both key→value maps. Mention that you understand thread-safety, because bank services handle many concurrent requests.`,
    remember: [
      'List (ordered, duplicates) · Set (unique) · Map (key→value).',
      'ArrayList vs LinkedList; HashMap (O(1), not thread-safe) vs TreeMap (sorted) vs **ConcurrentHashMap** (thread-safe).',
      'Keys need correct **equals() + hashCode()**.',
    ],
    check: [
      {
        q: 'Which collection does not allow duplicate elements?',
        options: ['ArrayList', 'LinkedList', 'HashSet', 'ArrayDeque'],
        answer: 2,
        explain: 'A **Set** stores unique elements.',
      },
      {
        q: 'Which map is safe to use from many threads at once?',
        options: ['HashMap', 'TreeMap', 'ConcurrentHashMap', 'LinkedHashMap'],
        answer: 2,
        explain: '**ConcurrentHashMap** is designed for concurrent access.',
      },
    ],
  },
  {
    id: 'transactional',
    title: 'Spring @Transactional',
    analogy:
      '`@Transactional` is like a **supervisor watching the teller**: "Either the debit AND the credit both happen, or I undo everything." The supervisor stands at the **door of the service** — if you call a method from inside the same room, the supervisor doesn\'t see it (self-invocation trap).',
    body: `\`@Transactional\` makes a method run in a **database transaction**: commit if it finishes, **rollback** if it fails — giving ACID behaviour in the service layer.

\`\`\`
@Service
public class TransferService {
    @Transactional
    public void transfer(String from, String to, BigDecimal amount) {
        Account a = repo.findByIdForUpdate(from);   // lock row
        Account b = repo.findByIdForUpdate(to);
        a.withdraw(amount);                          // throws InsufficientFundsException
        b.deposit(amount);
    }   // commit here, or rollback on RuntimeException
}
\`\`\`

Key facts:
- Works through a **Spring proxy** (AOP). The proxy starts/commits/rolls back.
- **Default rollback**: on **RuntimeException** and **Error** — **not** on checked exceptions. Use \`@Transactional(rollbackFor = Exception.class)\` if needed.
- **Self-invocation**: calling a \`@Transactional\` method from **another method in the same class** bypasses the proxy → no transaction! Call it from another bean.
- Put it on **public** service methods.
- **Propagation**: default \`REQUIRED\` (join existing or create new); \`REQUIRES_NEW\` (always new — e.g. audit log that must save even if the main transaction rolls back).
- **Isolation** level can be set; \`readOnly = true\` for queries.
- Keep transactions **short** (no remote HTTP calls inside if possible) to avoid long locks.`,
    visuals: [
      {
        kind: 'sequence',
        title: 'What the Spring proxy does',
        actors: [
          { id: 'ctl', label: 'Controller', icon: 'monitor' },
          { id: 'px', label: 'Proxy', icon: 'shield', sub: '@Transactional' },
          { id: 'svc', label: 'TransferService', icon: 'server' },
          { id: 'db', label: 'Database', icon: 'db' },
        ],
        steps: [
          { from: 'ctl', to: 'px', label: 'transfer(A, B, 10000)', detail: 'The controller calls the bean — actually a **proxy** created by Spring.', tone: 'blue' },
          { from: 'px', to: 'db', label: 'BEGIN', detail: 'The proxy opens a transaction (propagation REQUIRED).', tone: 'purple' },
          { from: 'px', to: 'svc', label: 'call real method', detail: 'Now the real `transfer()` code runs: debit A, credit B (SQL inside the same transaction).', tone: 'indigo' },
          { from: 'svc', to: 'db', label: 'UPDATE A, UPDATE B', detail: 'Both updates use the same connection/transaction.', tone: 'indigo' },
          { from: 'px', to: 'db', label: 'COMMIT (or ROLLBACK)', detail: 'Method returned normally → **COMMIT**. A **RuntimeException** was thrown → **ROLLBACK** (checked exceptions do NOT roll back by default!).', tone: 'green' },
        ],
      },
    ],
    bank: `This is a perfect bridge question: you have **real experience** with transactions in Spring Boot. Explain a real case — e.g. "In my project, I used @Transactional so an order and its payment record were saved together; I learned that checked exceptions don't roll back by default, so I used rollbackFor."`,
    remember: [
      '`@Transactional` = proxy-based transaction: commit on success, **rollback on RuntimeException/Error** (not checked, unless rollbackFor).',
      '**Self-invocation** bypasses the proxy → no transaction. Use public methods on another bean.',
      'Propagation REQUIRED (default) / REQUIRES_NEW; readOnly for queries; keep transactions short.',
    ],
    check: [
      {
        q: 'By default, @Transactional rolls back on…',
        options: ['Any exception', 'RuntimeException and Error only', 'Checked exceptions only', 'Never'],
        answer: 1,
        explain: 'Default rollback = **unchecked** exceptions and Errors. Use rollbackFor for checked ones.',
      },
      {
        q: 'Method A (no annotation) calls method B (@Transactional) in the same class. What happens?',
        options: ['B runs in a transaction', 'B runs without a transaction because the call bypasses the Spring proxy', 'Spring throws an error', 'Both run in two transactions'],
        answer: 1,
        explain: '**Self-invocation** does not go through the proxy.',
      },
    ],
  },
  {
    id: 'bigdecimal',
    title: 'Why BigDecimal for money',
    analogy:
      '`double` is like measuring money with a **slightly bent ruler**: tiny errors you cannot see — but after millions of transactions, someone\'s account is a few cents wrong. `BigDecimal` is **counting exact coins**.',
    body: `\`float\`/\`double\` store numbers in **binary floating point**, which **cannot represent most decimal fractions exactly** (like 0.1).

\`\`\`
System.out.println(0.1 + 0.2);                 // 0.30000000000000004  ❌

BigDecimal a = new BigDecimal("0.10");          // ✅ use the String constructor
BigDecimal b = new BigDecimal("0.20");
System.out.println(a.add(b));                   // 0.30

new BigDecimal(0.1);   // ❌ 0.1000000000000000055511151231257827…
BigDecimal.valueOf(0.1); // OK (uses the double's string form)
\`\`\`

Rules for money:
- Create from **String** (or \`valueOf\`), never \`new BigDecimal(double)\`.
- BigDecimal is **immutable**: \`total = total.add(x)\` (the result must be assigned).
- Always set **scale and rounding**: \`amount.setScale(2, RoundingMode.HALF_EVEN)\` (banker's rounding) or HALF_UP as the business rule says. \`divide()\` needs a scale/rounding mode or it may throw \`ArithmeticException\` (e.g. 10 / 3).
- Compare with **\`compareTo()\`**, not \`equals()\` — \`new BigDecimal("2.0").equals(new BigDecimal("2.00"))\` is **false** (different scale), but \`compareTo\` returns 0.
- Store in the DB as **DECIMAL/NUMERIC(18,2)** (or more decimals for rates). Alternative: store **long minor units** (cents) where appropriate.`,
    visuals: [
      {
        kind: 'compare',
        columns: [
          { label: 'double', icon: '⚠️', tone: 'red' },
          { label: 'BigDecimal', icon: '✅', tone: 'green' },
        ],
        rows: [
          { label: '0.1 + 0.2', values: ['0.30000000000000004', '0.30'] },
          { label: 'Precision', values: ['Binary approximation', 'Exact decimal'] },
          { label: 'Rounding control', values: ['None (hidden errors)', 'setScale + RoundingMode'] },
          { label: 'Speed', values: ['Very fast', 'Slower (fine for money)'] },
          { label: 'Use for', values: ['Science, graphics', '**Money**, interest, exchange rates'] },
        ],
      },
    ],
    bank: `Interest calculation on millions of savings accounts with \`double\` could create **rounding differences** that do not reconcile with the general ledger — auditors will find it. With BigDecimal + an agreed **rounding mode**, every cent is exact and reproducible.`,
    remember: [
      '`double` cannot represent 0.1 exactly → rounding errors. Use **BigDecimal** for money.',
      'Create from **String**/`valueOf`; immutable; always **setScale + RoundingMode** (e.g. HALF_EVEN); divide needs rounding.',
      'Compare with **compareTo()**, not equals(). DB: DECIMAL/NUMERIC.',
    ],
    check: [
      {
        q: 'Which is the correct way to create a BigDecimal for 0.10?',
        options: ['new BigDecimal(0.10)', 'new BigDecimal("0.10")', '(BigDecimal) 0.10', 'BigDecimal.ZERO + 0.10'],
        answer: 1,
        explain: 'The **String constructor** gives the exact value. new BigDecimal(0.10) copies the double\'s binary error.',
      },
      {
        q: 'new BigDecimal("2.0").equals(new BigDecimal("2.00")) returns…',
        options: ['true', 'false'],
        answer: 1,
        explain: '**equals** compares value and scale. Use **compareTo() == 0** for numeric equality.',
      },
    ],
  },
];
