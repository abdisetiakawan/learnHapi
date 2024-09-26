
---

# LearnHapi Project

This project is a simple Hapi.js application using TypeScript, SQLite, and Type ORM. The project is structured with controllers, entities, and fake data generation for testing purposes.

## Getting Started

### Prerequisites

Before you can run this project, make sure you have the following installed:

- Node.js
- SQLite3 (automatically created when running ‘npm start’)
- REST Client Extension for VSCode

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/abdisetiakawan/learnHapi
```

2. Navigate into the project directory:

```bash
cd learnHapi
```

3. Install all dependencies:

```bash
npm install
```

### Setting Up Database

This project uses SQLite as the database. To set up the database and seed it with fake data, follow these steps:

1. Open the file `src/db/db.ts`.

2. Uncomment the section of the code where fake data is generated (this section is marked for easy identification). It should look something like this:

```typescript
  // uncomment this if you want to create fake data
  // console.log("Creating fake data...".yellow.bold);
  // for (const fun of fakeFuncs) await fun(dataSource);
```

3. After uncommenting the code, run the project to create the fake data:

```bash
npm start
```

4. Once the data has been created, comment the fake data generation block again to avoid recreating the data on every server restart:

```typescript
  // uncomment this if you want to create fake data
  // console.log("Creating fake data...".yellow.bold);
  // for (const fun of fakeFuncs) await fun(dataSource);
```

### Running the Project

To start the project, simply run:

```bash
npm start
```

The application will start running locally.

### API Testing

To test the API endpoints, a `test.http` file has been provided. To use this file for API testing, follow these steps:

1. Install the REST Client extension for VSCode.

2. Open the `test.http` file located in the root directory.

3. Run individual API requests by clicking on the "Send Request" button that appears above each API call.

### Project Structure

The project is structured as follows:

```
src/
├── controllers/
│   ├── auth/
│   │   └── auth.controller.ts
│   ├── posts/
│   │   └── posts.controller.ts
│   └── users/
│       └── users.controller.ts
├── db/
│   ├── entities/
│   │   ├── posts.entity.ts
│   │   ├── sharedProp.entity.ts
│   │   └── users.entity.ts
│   └── db.ts
├── fakeData/
│   ├── index.ts
│   ├── posts.ts
│   └── users.ts
├── auth.ts
├── index.ts
```

### Important Files

- **`src/db/db.ts`**: This file contains the SQLite database setup and the fake data creation logic.
- **`test.http`**: This file contains pre-configured API test requests for quick testing.
- **`src/fakeData/`**: This folder contains scripts to generate fake users and posts data.

### Notes

- After creating the fake data, ensure you comment out the fake data creation code in `db.ts` to avoid duplicate data entries.
- All test requests are available in the `test.http` file for easy testing.

---
