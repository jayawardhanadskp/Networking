import type { Section } from '../types';

export const sections: Section[] = [
  {
    id: 'rdbms',
    title: 'Relational databases, tables and keys',
    analogy:
      'A relational database is a set of **ledgers (tables)** that point to each other. The **customer ledger** has a unique customer number (primary key). The **accounts ledger** writes that customer number on each account (foreign key), so you can always find the owner.',
    body: `A **relational database (RDBMS)** stores data in **tables** (rows and columns). Examples: **Oracle, Microsoft SQL Server, MySQL/MariaDB, PostgreSQL, IBM Db2**.

- **Primary key (PK)** — uniquely identifies each row (e.g. \`customer_id\`). Not null, unique.
- **Foreign key (FK)** — a column that refers to a PK in another table → keeps relationships correct (**referential integrity**).
- **Constraints** — NOT NULL, UNIQUE, CHECK (e.g. balance ≥ 0), DEFAULT.
- **Normalisation** — organise data to avoid duplication (1NF, 2NF, 3NF).
- **Schema** — a container/namespace for tables and other objects.

NoSQL databases (MongoDB, Redis, Cassandra) store data as documents, key-value pairs etc. — useful for caching and flexible data, but core banking ledgers use **relational** databases because of strong consistency (ACID).

DBA vs system admin: DBAs manage the database itself; system admins often manage the **servers, storage, backups, OS patches and access** around it.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Two tables linked by a key',
        rows: [
          {
            label: 'CUSTOMER table',
            fields: [
              { text: 'customer_id (PK)', sub: '1001', tone: 'blue', w: 2 },
              { text: 'name', sub: 'K. Perera', tone: 'slate', w: 2 },
              { text: 'nic_no', sub: 'UNIQUE', tone: 'slate', w: 2 },
            ],
          },
          {
            label: 'ACCOUNT table',
            fields: [
              { text: 'account_no (PK)', sub: '100200300', tone: 'green', w: 2 },
              { text: 'customer_id (FK)', sub: '→ 1001', tone: 'blue', w: 2 },
              { text: 'balance', sub: 'DECIMAL(18,2), CHECK ≥ 0', tone: 'amber', w: 2 },
            ],
          },
        ],
        note: 'The FK stops you creating an account for a customer that does not exist (referential integrity).',
      },
    ],
    bank: `Core banking systems run on enterprise RDBMSs (often Oracle, SQL Server or Db2 — it depends on the vendor). Money columns use exact numeric types (**DECIMAL/NUMERIC**), never floating point. As a developer you already used **MySQL** — say so, and explain you understand keys, constraints and JPA mappings.`,
    remember: [
      'RDBMS = tables with rows/columns; examples Oracle, SQL Server, MySQL, PostgreSQL.',
      '**PK** = unique row ID; **FK** = link to another table\'s PK (referential integrity).',
      'Money → **DECIMAL/NUMERIC**, not FLOAT.',
    ],
    check: [
      {
        q: 'What does a foreign key do?',
        options: ['Encrypts a column', 'Links a column to the primary key of another table to keep relationships valid', 'Makes queries faster automatically', 'Stores backups'],
        answer: 1,
        explain: 'A **foreign key** enforces referential integrity between tables.',
      },
      {
        q: 'Which data type is correct for an account balance?',
        options: ['FLOAT', 'DOUBLE', 'DECIMAL(18,2)', 'VARCHAR'],
        answer: 2,
        explain: '**DECIMAL/NUMERIC** stores exact values; floating point causes rounding errors.',
      },
    ],
  },
  {
    id: 'sql',
    title: 'Basic SQL',
    analogy:
      'SQL is the **language you use to ask the ledger clerk** for information: "Show me all accounts in branch 25 with balance over 1 million, sorted by balance."',
    body: `SQL command groups:
| Group | Meaning | Commands |
|---|---|---|
| **DDL** | Data Definition — structure | \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\` |
| **DML** | Data Manipulation — rows | \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\` |
| **DCL** | Data Control — permissions | \`GRANT\`, \`REVOKE\` |
| **TCL** | Transaction Control | \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\` |

\`\`\`
SELECT a.account_no, c.name, a.balance
FROM account a
JOIN customer c ON c.customer_id = a.customer_id
WHERE a.branch_code = '025' AND a.balance > 1000000
ORDER BY a.balance DESC;

SELECT branch_code, COUNT(*) AS accounts, SUM(balance) AS total
FROM account
GROUP BY branch_code
HAVING COUNT(*) > 100;
\`\`\`

- **INNER JOIN** = matching rows in both tables; **LEFT JOIN** = all rows from the left + matches.
- **WHERE** filters rows; **HAVING** filters groups after GROUP BY.
- \`DELETE\` removes rows (can be rolled back, can use WHERE); \`TRUNCATE\` removes **all** rows fast (DDL); \`DROP\` removes the **table**.
- ⚠️ Always use **WHERE** with UPDATE/DELETE — and check with a SELECT first!`,
    visuals: [
      {
        kind: 'flow',
        title: 'How a SELECT is processed (logical order)',
        steps: [
          { label: 'FROM / JOIN', icon: '1', detail: 'Get the tables and join them (account + customer).', tone: 'blue' },
          { label: 'WHERE', icon: '2', detail: 'Keep only rows that match (branch 025, balance > 1,000,000).', tone: 'purple' },
          { label: 'GROUP BY', icon: '3', detail: 'Group rows (e.g. by branch).', tone: 'amber' },
          { label: 'HAVING', icon: '4', detail: 'Keep only groups that match (e.g. more than 100 accounts).', tone: 'red' },
          { label: 'SELECT', icon: '5', detail: 'Choose the columns / calculations to return.', tone: 'teal' },
          { label: 'ORDER BY', icon: '6', detail: 'Sort the result (balance DESC). That is why you cannot use a SELECT alias in WHERE, but you can in ORDER BY.', tone: 'green' },
        ],
      },
    ],
    bank: `Admins often need **read-only** queries for checks or reports (e.g. count of failed jobs, users not logged in for 90 days). In production, **never run UPDATE/DELETE** on bank data yourself without an approved change and a backup — and wrap it in a **transaction** so you can ROLLBACK if the row count is wrong.`,
    remember: [
      '**DDL** (CREATE/ALTER/DROP), **DML** (SELECT/INSERT/UPDATE/DELETE), **DCL** (GRANT/REVOKE), **TCL** (COMMIT/ROLLBACK).',
      'WHERE filters rows, HAVING filters groups; INNER vs LEFT JOIN.',
      'DELETE vs TRUNCATE vs DROP. Always check WHERE before UPDATE/DELETE.',
    ],
    check: [
      {
        q: 'Which SQL command group does GRANT belong to?',
        options: ['DDL', 'DML', 'DCL', 'TCL'],
        answer: 2,
        explain: '**DCL** (Data Control Language): GRANT and REVOKE.',
      },
      {
        q: 'Which clause filters results AFTER grouping?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'FROM'],
        answer: 1,
        explain: '**HAVING** filters groups; WHERE filters rows before grouping.',
      },
      {
        q: 'Which command removes all rows but keeps the table structure, quickly?',
        options: ['DROP TABLE', 'TRUNCATE TABLE', 'DELETE without WHERE (only option)', 'ALTER TABLE'],
        answer: 1,
        explain: '**TRUNCATE** removes all rows fast; DROP removes the table itself.',
      },
    ],
  },
  {
    id: 'acid',
    title: 'Transactions and ACID',
    analogy:
      'A fund transfer is like moving cash between two drawers: take Rs. 10,000 from drawer A **and** put it in drawer B. If anything goes wrong in the middle, you must **put the money back** — never leave it "in the air".',
    body: `A **transaction** is a group of operations that must succeed or fail **together**.

**ACID**:
- **Atomicity** — all or nothing. If one step fails → **ROLLBACK** everything.
- **Consistency** — the database moves from one valid state to another (constraints, rules always hold — e.g. total money stays the same).
- **Isolation** — concurrent transactions do not see each other's half-finished work. Isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE (stronger = fewer anomalies, less concurrency).
- **Durability** — once **COMMITTED**, the data survives crashes (written to the **transaction log** / redo log).

Problems isolation prevents: **dirty reads**, non-repeatable reads, phantom reads, **lost updates**.
**Locks** and **deadlocks**: two transactions wait for each other → the DB kills one (deadlock victim).`,
    visuals: [
      {
        kind: 'sequence',
        title: 'Fund transfer: Rs. 10,000 from A to B',
        actors: [
          { id: 'app', label: 'Banking app', icon: 'server' },
          { id: 'db', label: 'Database', icon: 'db' },
          { id: 'log', label: 'Transaction log', icon: 'disk' },
        ],
        steps: [
          { from: 'app', to: 'db', label: 'BEGIN TRANSACTION', detail: 'Start a transaction. Nothing is final yet.', tone: 'blue' },
          { from: 'app', to: 'db', label: 'UPDATE A: balance − 10,000', detail: 'Debit account A. Other sessions do **not** see this change yet (**isolation**). The row is locked.', tone: 'purple' },
          { from: 'app', to: 'db', label: 'UPDATE B: balance + 10,000', detail: 'Credit account B. If this fails (e.g. account frozen, crash) → **ROLLBACK** and A gets its money back (**atomicity**).', tone: 'purple' },
          { from: 'db', to: 'db', label: 'check constraints', detail: 'Constraints (balance ≥ 0, valid accounts) are checked — the database stays valid (**consistency**).', tone: 'amber' },
          { from: 'app', to: 'db', label: 'COMMIT', detail: 'Both updates become permanent together.', tone: 'green' },
          { from: 'db', to: 'log', label: 'write to log (durable)', detail: 'The commit is written to the **transaction log** before success is returned. Even if the server crashes now, the transfer survives (**durability**).', tone: 'green' },
        ],
      },
    ],
    bank: `ACID is the reason banks trust relational databases for ledgers. The **transaction log** is also what makes **point-in-time restore** possible. In Spring, \`@Transactional\` gives the same all-or-nothing behaviour at the service layer (see the Java module).`,
    remember: [
      '**A**tomicity (all or nothing), **C**onsistency (valid state), **I**solation (no half-finished data visible), **D**urability (committed = permanent).',
      'COMMIT makes changes permanent; ROLLBACK undoes them.',
      'Durability comes from the **transaction log**; deadlocks → one transaction is killed.',
    ],
    check: [
      {
        q: 'The debit succeeds but the credit fails, and the database undoes the debit. Which ACID property is this?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        answer: 0,
        explain: '**Atomicity** — all or nothing.',
      },
      {
        q: 'After COMMIT, the server loses power, but the data is still there after restart. Which property?',
        options: ['Atomicity', 'Isolation', 'Durability', 'Consistency'],
        answer: 2,
        explain: '**Durability** — committed data survives crashes (transaction log).',
      },
    ],
  },
  {
    id: 'indexes',
    title: 'Indexes',
    analogy:
      'An index is like the **index at the back of a book**. To find "subnetting", you don\'t read all 500 pages — you look it up in the index and jump to page 87. But every time you add a page, the index must be updated too.',
    body: `An **index** is a separate structure (usually a **B-tree**) that lets the database **find rows quickly** without scanning the whole table.

- Without an index: **full table scan** — read every row (slow on millions of rows).
- With an index: **index seek** — go directly to the matching rows.
- Primary keys are indexed automatically. Add indexes on columns used often in **WHERE, JOIN and ORDER BY** (e.g. \`account_no\`, \`customer_id\`, \`txn_date\`).
- **Composite index** on (branch_code, txn_date) helps queries filtering by both (column order matters).

**Trade-offs**: indexes **speed up reads** but **slow down writes** (INSERT/UPDATE/DELETE must update the index) and use **disk space**. Too many indexes = bad.

Tools: \`EXPLAIN\` / execution plan to see if a query uses an index. Indexes need **maintenance** (rebuild/reorganise fragmented indexes, update statistics) — often scheduled at night.`,
    visuals: [
      {
        kind: 'compare',
        title: 'Find account 100200300 in 10 million rows',
        columns: [
          { label: 'Full table scan', icon: '🐢', tone: 'red' },
          { label: 'Index seek', icon: '🚀', tone: 'green' },
        ],
        rows: [
          { label: 'How', values: ['Read every row, compare each', 'Walk the B-tree: root → branch → leaf → row'] },
          { label: 'Rows read', values: ['~10,000,000', 'A handful of index pages'] },
          { label: 'Time', values: ['Seconds or more', 'Milliseconds'] },
          { label: 'Cost', values: ['No extra storage', 'Extra storage; slower inserts/updates'] },
          { label: 'Check with', values: ['EXPLAIN shows "ALL" / "Table Scan"', 'EXPLAIN shows index used'] },
        ],
      },
    ],
    bank: `"End-of-day reports suddenly take 3 hours instead of 30 minutes." Possible causes: **missing or fragmented index**, out-of-date **statistics**, a new query without a suitable index, or the server is short of memory/IO. Admin + DBA check execution plans, index maintenance jobs, and server resources.`,
    remember: [
      'Index (B-tree) = fast lookup instead of a **full table scan**.',
      'Index columns used in **WHERE/JOIN/ORDER BY**; PKs are indexed automatically.',
      'Trade-off: faster reads, **slower writes** + storage. Use **EXPLAIN**; maintain indexes and statistics.',
    ],
    check: [
      {
        q: 'What is a downside of adding many indexes to a table?',
        options: ['Reads become slower', 'Inserts/updates become slower and more storage is used', 'Data becomes less secure', 'Backups become impossible'],
        answer: 1,
        explain: 'Every write must also update each index.',
      },
      {
        q: 'Which tool shows whether a query uses an index?',
        options: ['EXPLAIN / execution plan', 'GRANT', 'ipconfig', 'TRUNCATE'],
        answer: 0,
        explain: '**EXPLAIN** (or the execution plan) shows how the database runs the query.',
      },
    ],
  },
  {
    id: 'users-roles',
    title: 'Database users, roles and privileges',
    analogy:
      'In a bank branch, the **teller** can view and post transactions, the **auditor** can only **look** at the books, and only the **manager** can approve special actions. Database roles work the same way.',
    body: `- **User / login** — an identity that can connect to the database.
- **Privilege** — a permission: \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`EXECUTE\`, \`CREATE TABLE\`…
- **Role** — a named group of privileges; grant roles to users (RBAC).

\`\`\`
CREATE ROLE reporting_ro;
GRANT SELECT ON bank.account TO reporting_ro;
GRANT reporting_ro TO report_user;
REVOKE DELETE ON bank.account FROM app_user;
\`\`\`

Good practice:
- **Least privilege**: the application account gets only what it needs (no DROP, no DBA rights).
- **Separate accounts**: application/service accounts, named personal accounts for DBAs (no shared "sa"/"system" logins), read-only accounts for reporting.
- Disable/rename default accounts; strong passwords stored in a **vault**, not in plain config files.
- **Auditing**: log logins, privilege changes and access to sensitive tables.
- **Encryption**: TLS for connections, **TDE** (transparent data encryption) at rest, masking sensitive data in test environments.`,
    visuals: [
      {
        kind: 'fields',
        title: 'Role-based access example',
        rows: [
          {
            label: 'Roles → privileges',
            fields: [
              { text: 'app_rw', sub: 'SELECT, INSERT, UPDATE on app schema', tone: 'blue' },
              { text: 'reporting_ro', sub: 'SELECT only (or on views)', tone: 'green' },
              { text: 'dba_admin', sub: 'full admin — named DBAs only, via PAM', tone: 'red' },
            ],
          },
          {
            label: 'Users → roles',
            fields: [
              { text: 'cbs_app_svc', sub: '→ app_rw', tone: 'blue' },
              { text: 'mis_report', sub: '→ reporting_ro', tone: 'green' },
              { text: 'dba.kasun', sub: '→ dba_admin (MFA)', tone: 'red' },
            ],
          },
        ],
        note: 'No one logs in with a shared "sa"/"SYSTEM" account; every action is traceable to a person or service.',
      },
    ],
    bank: `Auditors check: Who has DBA rights? Are there shared accounts? Are leavers removed? Is access to customer tables logged? In your developer work you configured a DB user for your Spring Boot app — in a bank you would make sure that user has **only** the needed rights on **only** its schema, and its password comes from a **secrets vault**.`,
    remember: [
      'Users get **roles**; roles hold **privileges** (GRANT / REVOKE).',
      '**Least privilege** for app accounts; named personal admin accounts; no shared default logins.',
      'Audit logins & privilege changes; encrypt in transit (TLS) and at rest (TDE).',
    ],
    check: [
      {
        q: 'Which statement gives a role read-only access to a table?',
        options: ['GRANT SELECT ON bank.account TO reporting_ro', 'GRANT ALL ON bank.account TO reporting_ro', 'REVOKE SELECT ON bank.account', 'CREATE TABLE reporting_ro'],
        answer: 0,
        explain: '**GRANT SELECT** gives read-only access.',
      },
      {
        q: 'Why should DBAs avoid using a shared "sa" or "SYSTEM" account?',
        options: ['It is slower', 'Actions cannot be traced to a specific person (no accountability)', 'It cannot run queries', 'It uses more disk'],
        answer: 1,
        explain: 'Shared accounts break **accountability** and auditing.',
      },
    ],
  },
  {
    id: 'db-backup',
    title: 'Database backup and restore',
    analogy:
      'A full backup is a **photo of the ledger on Sunday**. The **transaction log** is the **diary of every entry made since**. To get the ledger as it was on Wednesday at 10:42, you take Sunday\'s photo and **replay the diary** up to 10:42.',
    body: `You cannot just copy database files while the database is running (they may be inconsistent). Use **database-aware** backups:

- **Full** backup — the whole database.
- **Differential** — changes since the last full.
- **Transaction log backups** — every committed change, e.g. every 15 minutes → enables **point-in-time recovery (PITR)**.

Tools: SQL Server (backup/restore, **recovery models**: Simple vs Full), Oracle **RMAN** (+ archive logs), MySQL \`mysqldump\` / binary logs, PostgreSQL \`pg_dump\` / WAL archiving.

**Restore order** (example): last full → latest differential → all log backups after it, up to the chosen time.

**High availability / DR** (not backups!): SQL Server **Always On** availability groups, Oracle **Data Guard**, MySQL/PostgreSQL replication — keep a standby copy at the DR site.

Always: encrypt backups, copy them off-site, monitor jobs, and **test restores** on a separate server.`,
    visuals: [
      {
        kind: 'flow',
        title: 'Restore the DB to Wednesday 10:42 (someone deleted data at 10:45)',
        steps: [
          { label: 'Sunday full', icon: '📦', detail: 'Restore the last **full backup** (Sunday 01:00) WITH NORECOVERY (keep the DB ready for more).', tone: 'blue' },
          { label: 'Tuesday diff', icon: '🧩', detail: 'Restore the **latest differential** before the problem (Tuesday night).', tone: 'purple' },
          { label: 'Log backups', icon: '📜', detail: 'Restore every **transaction log backup** since Tuesday night, in order…', tone: 'amber' },
          { label: 'STOPAT 10:42', icon: '⏱', detail: '…and stop the last log at **10:42**, just before the bad delete at 10:45. (Point-in-time recovery.)', tone: 'red' },
          { label: 'Recover & check', icon: '✅', detail: 'Bring the DB online, verify data with the app team, then follow the change process to put it back into service (often restore to a **separate copy** first and extract the lost rows).', tone: 'green' },
        ],
      },
    ],
    bank: `Core banking databases typically combine **frequent log backups** (small RPO), **replication to the DR site** (Data Guard / Always On), and regular full backups to an **immutable** store. A common interview trap: "Replication is enough, right?" → No — a bad DELETE replicates instantly; you need **point-in-time backups**.`,
    remember: [
      'Full + differential + **transaction log** backups → **point-in-time recovery**.',
      'Restore order: full → latest diff → logs up to the time (STOPAT).',
      'HA/replication (Always On, Data Guard) ≠ backup. Encrypt, store off-site, **test restores**.',
    ],
    check: [
      {
        q: 'Which backups make point-in-time recovery possible?',
        options: ['Only full backups', 'Transaction log backups (with full/diff)', 'VM snapshots only', 'RAID 1'],
        answer: 1,
        explain: '**Log backups** record every change, so you can replay up to a chosen moment.',
      },
      {
        q: 'Someone runs a wrong DELETE on the primary DB, which has a real-time replica at the DR site. Is the replica enough to recover?',
        options: ['Yes, always', 'No — the delete is replicated too; you need point-in-time backups', 'Yes, if the replica is in another city', 'Only on weekends'],
        answer: 1,
        explain: 'Replication copies the mistake. **Backups** give older recovery points.',
      },
    ],
  },
];
