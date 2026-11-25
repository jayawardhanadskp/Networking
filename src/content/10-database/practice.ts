import type { Flashcard, InterviewQA, MCQ } from '../types';

export const quiz: MCQ[] = [
  { q: 'What uniquely identifies each row in a table?', options: ['Foreign key', 'Primary key', 'Index name', 'Schema'], answer: 1, explain: 'The **primary key**.' },
  { q: 'Which is a DML command?', options: ['CREATE', 'GRANT', 'UPDATE', 'COMMIT'], answer: 2, explain: '**UPDATE** changes rows (DML). CREATE = DDL, GRANT = DCL, COMMIT = TCL.' },
  { q: 'Which JOIN returns all rows from the left table, even without a match?', options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'], answer: 1, explain: '**LEFT JOIN** keeps all left rows; unmatched right columns are NULL.' },
  { q: 'What is the difference between DELETE and TRUNCATE?', options: ['No difference', 'DELETE can use WHERE and is logged row by row; TRUNCATE removes all rows quickly', 'TRUNCATE drops the table', 'DELETE removes the table structure'], answer: 1, explain: 'DELETE = selective rows; TRUNCATE = all rows, fast (DDL).' },
  { q: 'Which ACID property ensures transactions do not see each other\'s uncommitted changes?', options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], answer: 2, explain: '**Isolation**.' },
  { q: 'Which isolation level is the strictest?', options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], answer: 3, explain: '**SERIALIZABLE** behaves as if transactions ran one after another.' },
  { q: 'Two transactions each hold a lock the other needs. This is a…', options: ['Dirty read', 'Deadlock', 'Phantom read', 'Commit'], answer: 1, explain: 'A **deadlock**; the DB chooses a victim to roll back.' },
  { q: 'On which columns should you usually create indexes?', options: ['Columns never used in queries', 'Columns often used in WHERE, JOIN and ORDER BY', 'Every column', 'Only text columns'], answer: 1, explain: 'Index what you **search, join and sort** by.' },
  { q: 'Which command removes a privilege?', options: ['DENY ALL', 'REVOKE', 'DROP USER', 'ROLLBACK'], answer: 1, explain: '**REVOKE** removes a previously granted privilege.' },
  { q: 'What does TDE protect?', options: ['Data in transit', 'Data at rest in database files and backups', 'User passwords in the app', 'Network routes'], answer: 1, explain: '**Transparent Data Encryption** encrypts data files at rest.' },
  { q: 'Which Oracle tool is used for backup and recovery?', options: ['RMAN', 'mysqldump', 'pg_dump', 'WSUS'], answer: 0, explain: '**RMAN** (Recovery Manager).' },
  { q: 'Which technology keeps a synchronized standby SQL Server database for HA/DR?', options: ['Always On availability groups', 'TRUNCATE', 'GPO', 'NAT'], answer: 0, explain: 'SQL Server **Always On**; the Oracle equivalent is Data Guard.' },
];

export const flashcards: Flashcard[] = [
  { front: 'Primary key vs foreign key', back: '**PK**: unique identifier of a row. **FK**: column referencing another table\'s PK (referential integrity).', tag: 'definition' },
  { front: 'DDL / DML / DCL / TCL', back: '**DDL** CREATE/ALTER/DROP/TRUNCATE · **DML** SELECT/INSERT/UPDATE/DELETE · **DCL** GRANT/REVOKE · **TCL** COMMIT/ROLLBACK/SAVEPOINT', tag: 'definition' },
  { front: 'WHERE vs HAVING', back: '**WHERE** filters rows before grouping; **HAVING** filters groups after GROUP BY.', tag: 'definition' },
  { front: 'INNER vs LEFT JOIN', back: '**INNER**: only matching rows. **LEFT**: all left rows + matches (NULLs when none).', tag: 'definition' },
  { front: 'ACID', back: '**Atomicity** · **Consistency** · **Isolation** · **Durability**.', tag: 'acronym' },
  { front: 'Isolation levels', back: 'READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE (strictest).', tag: 'fact' },
  { front: 'Deadlock', back: 'Two transactions wait for each other\'s locks; the DB kills one (victim) so the other can continue.', tag: 'definition' },
  { front: 'Index', back: 'B-tree structure for fast lookups. Faster reads, slower writes, more storage. Check with EXPLAIN.', tag: 'definition' },
  { front: 'Role-based DB access', back: 'Privileges → roles → users. Least privilege, no shared admin logins, audit.', tag: 'definition' },
  { front: 'Point-in-time recovery', back: 'Restore full → differential → transaction logs up to a chosen time (STOPAT).', tag: 'definition' },
  { front: 'DB backup tools', back: 'SQL Server BACKUP/RESTORE · Oracle **RMAN** · MySQL `mysqldump`/binlogs · PostgreSQL `pg_dump`/WAL.', tag: 'fact' },
  { front: 'Always On / Data Guard', back: 'SQL Server **Always On** and Oracle **Data Guard**: standby database replicas for HA/DR (not backups).', tag: 'fact' },
];

export const interview: InterviewQA[] = [
  {
    type: 'technical',
    q: 'What is ACID?',
    answer: `ACID describes how reliable transactions work:
- **Atomicity** — all steps succeed or none do. In a fund transfer, if the credit fails, the debit is rolled back.
- **Consistency** — the database always moves between valid states; constraints like "balance ≥ 0" always hold.
- **Isolation** — concurrent transactions don't see each other's uncommitted work; controlled by isolation levels.
- **Durability** — once committed, the change survives a crash, because it is written to the transaction log.

That's why banks use relational databases for ledgers. In my Spring Boot work I used \`@Transactional\` to get the same all-or-nothing behaviour in the service layer.`,
  },
  {
    type: 'technical',
    q: 'What is an index and when would you add one?',
    answer: `An index is a separate data structure, usually a B-tree, that lets the database find rows without scanning the whole table — like the index of a book. I would add indexes on columns frequently used in **WHERE, JOIN and ORDER BY** — for example account number, customer ID or transaction date — after checking the **execution plan** with EXPLAIN.

But indexes have a cost: they slow down inserts and updates and use storage, so we shouldn't index everything. They also need maintenance — rebuilding fragmented indexes and updating statistics.`,
  },
  {
    type: 'technical',
    q: 'How would you back up a production database so you can restore to any point in time?',
    answer: `I would use **database-aware backups**, not just file copies: a regular **full backup** (e.g. weekly), **differential** backups (e.g. nightly), and frequent **transaction log backups** (e.g. every 15 minutes, in the Full recovery model for SQL Server, or archive logs with RMAN for Oracle). That allows **point-in-time recovery**: restore the full, then the latest differential, then the log backups up to the required moment.

Backups would be encrypted, copied off-site and to immutable storage, monitored daily, and **restore-tested** regularly on a separate server. For DR, I would add replication like Always On or Data Guard — but replication is not a replacement for backups.`,
  },
  {
    type: 'technical',
    q: 'How do you manage database users securely?',
    answer: `I follow **least privilege** with **roles**: create roles with only the needed privileges — for example read/write on the application schema for the app, SELECT-only for reporting — and grant roles to users instead of direct privileges.

The application uses a dedicated service account with no admin rights, and its password is stored in a vault, not in plain config files. DBAs use **named personal accounts** with MFA (through PAM), never shared default accounts like 'sa'. I'd enable **auditing** of logins and privilege changes, encrypt connections with TLS and data at rest with TDE, and remove access for leavers through regular access reviews.`,
  },
  {
    type: 'scenario',
    q: 'Users say a report that used to take 1 minute now takes 20 minutes. How do you approach it?',
    answer: `1. Find out **what changed**: new data volume, a new version of the report/query, a recent deployment, or a database/server change.
2. Check **server resources**: CPU, memory, disk I/O, blocking/locks at the time the report runs.
3. Get the **execution plan** (EXPLAIN): is it doing a full table scan? A missing index or out-of-date **statistics** are common causes.
4. Check **index fragmentation** and whether maintenance jobs ran.
5. Work with the DBA/developers to tune the query or add an index — tested in UAT and deployed through change management.
6. Schedule heavy reports outside business hours if possible.`,
  },
  {
    type: 'technical',
    q: 'What is the difference between DELETE, TRUNCATE and DROP?',
    answer: `**DELETE** removes rows — you can use a WHERE clause, it's logged per row and can be rolled back inside a transaction. **TRUNCATE** removes **all** rows very quickly by deallocating pages; it's a DDL command, can't use WHERE and resets identity counters in many databases. **DROP** removes the **whole table** — structure and data. In production I would never run any of these without approval, a backup, and checking the affected rows first.`,
  },
];
