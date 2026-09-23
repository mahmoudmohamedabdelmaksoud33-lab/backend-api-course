# TaskStore Implementation

## Project Overview

A plain JavaScript `TaskStore` class designed to manage tasks without external dependencies. It supports core CRUD operations, filtering, sorting, status counting, and fetching tasks from an external API.

1. Handling Asynchronous Operations with async/await
   Mechanism: The importFromApi method uses async/await to handle asynchronous HTTP requests cleanly. It pauses execution until the fetch call resolves without blocking the main execution thread.

Error Handling: The operation is wrapped in a try...catch block. If the network request fails or the API returns an error status (e.g., !response.ok), the code catches the error and logs it safely without crashing the application.

2. Data Encapsulation & Array Mutation Protection
   Method Security: The list() method prevents external code from mutating the internal tasks array by returning a shallow copy using the spread operator ([...this.tasks]).

ID Protection: The update() method explicitly checks for and deletes any attempt to modify the id field (delete changes.id), ensuring primary key immutability.

State Integrity: All task array modifications happen strictly through class methods (add, update, remove).

3. Reflection & Learning Challenge
   Key Challenge: Understanding how to cleanly transform raw data fetched from an external API (completed boolean) into the internal task structure (status string) while assigning auto-incremented IDs.

Key Takeaway: Gained hands-on experience in managing internal application state using native JavaScript classes, encapsulation, and error handling.

Name : Mahmoud Mohamed Abdelmaksoud Sayed

## How to run ?

open the terminal in the project directory and run the following command
node taskStore.js
