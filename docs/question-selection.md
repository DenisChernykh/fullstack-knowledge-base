# Отбор вопросов по частотности

Дата среза: 2026-08-14. Частотность означает повторяемость темы в независимых interview-источниках, а не вероятность конкретного вопроса в Уралэнергосбыте. Вакансии используются только как проверка релевантности стека. Проектные исходники не являются основанием включения.

- `very-high`: минимум три независимые source families.
- `high`: минимум две независимые source families.
- Несколько страниц одного издателя считаются одной family.
- Официальная документация проверяет техническую точность, но не повышает frequency.

## Каталог source families

| ID | Источник |
| --- | --- |
| `roadmap-rest` | [Roadmap.sh: REST API questions](https://roadmap.sh/questions/rest-api) |
| `roadmap-node` | [Roadmap.sh: Node.js questions](https://roadmap.sh/questions/nodejs) |
| `roadmap-backend` | [Roadmap.sh: Backend questions](https://roadmap.sh/questions/backend) |
| `backend-bank` | [Back-End Developer Interview Questions](https://github.com/arialdomartini/Back-End-Developer-Interview-Questions) |
| `backend-guide` | [Complete Node.js Backend Interview Guide](https://easyinterview.me/blogs/the-interview-questions-that-matter/complete-nodejs-backend-developer-interview-guide) |
| `node-guide` | [Node.js Interview Questions 2026](https://stackinterview.abhijeetkushwaha.dev/guides/nodejs-interview-questions-2026) |
| `candidate-reports` | [Публичный отчёт о Node/Nest interview](https://www.reddit.com/r/nestjs/comments/1qy8cb2/interview_experience/) |
| `nest-guide-a` | [NestJS Interview Questions](https://devencyclopedia.com/blog/nestjs-interview-questions) |
| `nest-guide-b` | [NestJS interview guide](https://www.tutorialslogic.com/interview-questions/nestjs) |
| `assessment-sql` | [HackerRank SQL Basic](https://www.hackerrank.com/skills-directory/sql_basic) |
| `sql-guide` | [Database Interview Questions](https://pages.hackerrank.com/blog/database-interview-questions-you-should-know) |
| `oop-bank-a` | [OOP Interview Questions](https://perfectnotes.org/interview-questions/oop/top-50-oop-interview-questions) |
| `oop-bank-b` | [OOP Interview Questions and Answers](https://interviewkickstart.com/blogs/interview-questions/oops-interview-questions-2) |
| `oop-bank-c` | [OOP and Design Patterns Interview Questions](https://www.geeksforgeeks.org/interview-prep/design-patterns-best-practices-interview-questions-oops/) |
| `security-guide` | [Backend Interview Questions 2026](https://mortit.com/blog/backend-developer-interview-questions) |
| `employer-guide` | [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) |
| `assessment-platform` | [HackerRank interview question types](https://support.hackerrank.com/articles/9999244916-question-types-in-hackerrank-interviews) |
| `ops-guide` | [Backend development interview preparation](https://www.coursera.org/resources/back-end-development-interview-prep-guide) |
| `docker-interview` | [Docker Interview Questions](https://www.interviewbit.com/docker-interview-questions/) |
| `git-interview` | [Git Interview Questions](https://www.indeed.com/career-advice/interviewing/git-interview-questions) |
| `linux-interview` | [Linux Interview Questions](https://www.coursera.org/articles/linux-interview-questions) |
| `market-signal` | [Fullstack React/Nest vacancy sample](https://hh.ru/vacancy/130120613) |

## Матрица 76 вопросов

| Карточка | Frequency | Selection sources | Неделя |
| --- | --- | --- | --- |
| [HTTP-01](../questions/http-api/HTTP-01.md) | very-high | `roadmap-rest`, `roadmap-backend`, `backend-guide` | TOP-40 |
| [HTTP-02](../questions/http-api/HTTP-02.md) | very-high | `roadmap-rest`, `roadmap-backend`, `backend-guide` | TOP-40 |
| [HTTP-03](../questions/http-api/HTTP-03.md) | very-high | `roadmap-rest`, `roadmap-backend`, `backend-guide` | TOP-40 |
| [HTTP-04](../questions/http-api/HTTP-04.md) | very-high | `roadmap-rest`, `roadmap-backend`, `backend-guide` | TOP-40 |
| [HTTP-05](../questions/http-api/HTTP-05.md) | very-high | `roadmap-rest`, `roadmap-backend`, `backend-guide` | TOP-40 |
| [HTTP-06](../questions/http-api/HTTP-06.md) | high | `roadmap-rest`, `backend-guide` | extended |
| [HTTP-07](../questions/http-api/HTTP-07.md) | high | `roadmap-rest`, `backend-guide` | extended |
| [HTTP-08](../questions/http-api/HTTP-08.md) | high | `roadmap-rest`, `backend-guide` | extended |
| [NODE-01](../questions/node/NODE-01.md) | high | `roadmap-node`, `node-guide` | extended |
| [NODE-02](../questions/node/NODE-02.md) | very-high | `roadmap-node`, `node-guide`, `candidate-reports` | TOP-40 |
| [NODE-03](../questions/node/NODE-03.md) | very-high | `roadmap-node`, `node-guide`, `candidate-reports` | TOP-40 |
| [NODE-04](../questions/node/NODE-04.md) | very-high | `roadmap-node`, `node-guide`, `candidate-reports` | TOP-40 |
| [NODE-05](../questions/node/NODE-05.md) | very-high | `roadmap-node`, `node-guide`, `candidate-reports` | TOP-40 |
| [NODE-06](../questions/node/NODE-06.md) | high | `roadmap-node`, `node-guide` | extended |
| [NODE-07](../questions/node/NODE-07.md) | high | `roadmap-node`, `node-guide` | extended |
| [NEST-01](../questions/nestjs/NEST-01.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | extended |
| [NEST-02](../questions/nestjs/NEST-02.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | TOP-40 |
| [NEST-03](../questions/nestjs/NEST-03.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | TOP-40 |
| [NEST-04](../questions/nestjs/NEST-04.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | TOP-40 |
| [NEST-05](../questions/nestjs/NEST-05.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | TOP-40 |
| [NEST-06](../questions/nestjs/NEST-06.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | TOP-40 |
| [NEST-07](../questions/nestjs/NEST-07.md) | high | `nest-guide-a`, `nest-guide-b` | extended |
| [NEST-08](../questions/nestjs/NEST-08.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | extended |
| [NEST-09](../questions/nestjs/NEST-09.md) | very-high | `nest-guide-a`, `nest-guide-b`, `candidate-reports` | TOP-40 |
| [SQL-01](../questions/sql-postgresql/SQL-01.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-02](../questions/sql-postgresql/SQL-02.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-03](../questions/sql-postgresql/SQL-03.md) | high | `assessment-sql`, `backend-bank` | extended |
| [SQL-04](../questions/sql-postgresql/SQL-04.md) | high | `assessment-sql`, `backend-bank` | extended |
| [SQL-05](../questions/sql-postgresql/SQL-05.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-06](../questions/sql-postgresql/SQL-06.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | extended |
| [SQL-07](../questions/sql-postgresql/SQL-07.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-08](../questions/sql-postgresql/SQL-08.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-09](../questions/sql-postgresql/SQL-09.md) | high | `assessment-sql`, `backend-bank` | extended |
| [SQL-10](../questions/sql-postgresql/SQL-10.md) | high | `assessment-sql`, `backend-bank` | TOP-40 |
| [SQL-11](../questions/sql-postgresql/SQL-11.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-12](../questions/sql-postgresql/SQL-12.md) | high | `assessment-sql`, `backend-bank` | TOP-40 |
| [SQL-13](../questions/sql-postgresql/SQL-13.md) | high | `assessment-sql`, `backend-bank` | extended |
| [SQL-14](../questions/sql-postgresql/SQL-14.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | TOP-40 |
| [SQL-15](../questions/sql-postgresql/SQL-15.md) | very-high | `assessment-sql`, `backend-bank`, `sql-guide` | extended |
| [OOP-01](../questions/oop-design/OOP-01.md) | very-high | `oop-bank-a`, `oop-bank-b`, `oop-bank-c` | TOP-40 |
| [OOP-02](../questions/oop-design/OOP-02.md) | very-high | `oop-bank-a`, `oop-bank-b`, `oop-bank-c` | extended |
| [OOP-03](../questions/oop-design/OOP-03.md) | very-high | `oop-bank-a`, `oop-bank-b`, `oop-bank-c` | extended |
| [OOP-04](../questions/oop-design/OOP-04.md) | very-high | `oop-bank-a`, `oop-bank-b`, `oop-bank-c` | TOP-40 |
| [OOP-05](../questions/oop-design/OOP-05.md) | high | `oop-bank-a`, `oop-bank-b` | extended |
| [OOP-06](../questions/oop-design/OOP-06.md) | very-high | `oop-bank-a`, `oop-bank-b`, `oop-bank-c` | TOP-40 |
| [OOP-07](../questions/oop-design/OOP-07.md) | high | `oop-bank-a`, `oop-bank-b` | extended |
| [OOP-08](../questions/oop-design/OOP-08.md) | very-high | `oop-bank-a`, `oop-bank-b`, `oop-bank-c` | TOP-40 |
| [OOP-09](../questions/oop-design/OOP-09.md) | high | `oop-bank-a`, `oop-bank-b` | extended |
| [OOP-10](../questions/oop-design/OOP-10.md) | high | `oop-bank-a`, `oop-bank-b` | extended |
| [ARCH-01](../questions/backend-architecture/ARCH-01.md) | high | `backend-bank`, `backend-guide` | TOP-40 |
| [ARCH-02](../questions/backend-architecture/ARCH-02.md) | very-high | `backend-bank`, `backend-guide`, `roadmap-backend` | TOP-40 |
| [ARCH-03](../questions/backend-architecture/ARCH-03.md) | very-high | `backend-bank`, `backend-guide`, `roadmap-backend` | TOP-40 |
| [ARCH-04](../questions/backend-architecture/ARCH-04.md) | very-high | `backend-bank`, `backend-guide`, `roadmap-backend` | extended |
| [ARCH-05](../questions/backend-architecture/ARCH-05.md) | high | `backend-bank`, `backend-guide` | extended |
| [ARCH-06](../questions/backend-architecture/ARCH-06.md) | very-high | `backend-bank`, `backend-guide`, `roadmap-backend` | TOP-40 |
| [SEC-01](../questions/security-auth/SEC-01.md) | very-high | `backend-bank`, `security-guide`, `employer-guide` | TOP-40 |
| [SEC-02](../questions/security-auth/SEC-02.md) | very-high | `backend-bank`, `security-guide`, `employer-guide` | TOP-40 |
| [SEC-03](../questions/security-auth/SEC-03.md) | high | `backend-bank`, `security-guide` | extended |
| [SEC-04](../questions/security-auth/SEC-04.md) | high | `backend-bank`, `security-guide` | extended |
| [SEC-05](../questions/security-auth/SEC-05.md) | very-high | `backend-bank`, `security-guide`, `employer-guide` | TOP-40 |
| [SEC-06](../questions/security-auth/SEC-06.md) | high | `backend-bank`, `security-guide` | extended |
| [SEC-07](../questions/security-auth/SEC-07.md) | high | `backend-bank`, `security-guide` | extended |
| [TEST-01](../questions/testing/TEST-01.md) | very-high | `employer-guide`, `backend-bank`, `assessment-platform` | TOP-40 |
| [TEST-02](../questions/testing/TEST-02.md) | very-high | `employer-guide`, `backend-bank`, `assessment-platform` | TOP-40 |
| [TEST-03](../questions/testing/TEST-03.md) | high | `employer-guide`, `backend-bank` | extended |
| [TEST-04](../questions/testing/TEST-04.md) | high | `employer-guide`, `backend-bank` | extended |
| [TEST-05](../questions/testing/TEST-05.md) | high | `employer-guide`, `backend-bank` | extended |
| [OPS-01](../questions/operations/OPS-01.md) | high | `git-interview`, `backend-guide` | TOP-40 |
| [OPS-02](../questions/operations/OPS-02.md) | high | `linux-interview`, `backend-guide` | extended |
| [OPS-03](../questions/operations/OPS-03.md) | high | `docker-interview`, `ops-guide` | TOP-40 |
| [OPS-04](../questions/operations/OPS-04.md) | high | `docker-interview`, `backend-guide` | extended |
| [OPS-05](../questions/operations/OPS-05.md) | high | `docker-interview`, `ops-guide` | extended |
| [OPS-06](../questions/operations/OPS-06.md) | high | `ops-guide`, `backend-guide` | TOP-40 |
| [OPS-07](../questions/operations/OPS-07.md) | high | `docker-interview`, `backend-guide` | extended |
| [OPS-08](../questions/operations/OPS-08.md) | high | `docker-interview`, `backend-guide` | extended |
| [OPS-09](../questions/operations/OPS-09.md) | high | `backend-bank`, `backend-guide` | extended |

## Намеренно исключено

Outbox, CQRS, fencing, advisory locks, AsyncLocalStorage, signed cache invalidation, OCI provenance, partial-deploy state machines, exactly-once, сложные rollout strategies и отдельная теория ports/adapters не входят в каноническую базу. Они могут встретиться на глубоком senior-интервью, но не вытесняют основы в недельной подготовке.
