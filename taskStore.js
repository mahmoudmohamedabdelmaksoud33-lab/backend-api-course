class TaskStore {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }
  add(title, priority, ownerId) {
    if (!title || priority < 1 || priority > 3) {
      throw new Error("Invalid title or priority");
    }

    const newTask = {
      id: this.nextId++,
      title: title,
      status: "todo",
      priority: priority,
      ownerId: ownerId,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  findById(id) {
    return this.tasks.find((task) => task.id === id);
  }

  update(id, changes) {
    const task = this.findById(id);
    if (!task) return null;

    if ("id" in changes) {
      delete changes.id;
    }

    Object.assign(task, changes);
    return task;
  }

  remove(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  list(filter = {}) {
    let result = [...this.tasks];

    if (filter.status) {
      result = result.filter((task) => task.status === filter.status);
    }

    if (filter.ownerId) {
      result = result.filter((task) => task.ownerId === filter.ownerId);
    }

    return result.sort((a, b) => b.priority - a.priority);
  }

  countByStatus() {
    const counts = { todo: 0, doing: 0, done: 0 };

    this.tasks.forEach((task) => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });

    return counts;
  }

  async importFromApi(userId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?userId=${userId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      data.forEach((item) => {
        const status = item.completed ? "done" : "todo";
        const priority = 1;

        this.add(item.title, priority, item.userId);
      });
    } catch (error) {
      console.error("Error importing tasks:", error.message);
    }
  }
}

// --- Demonstration & Testing Code ---
async function runDemo() {
  const store = new TaskStore();

  console.log("--- 1. Adding New Tasks ---");
  store.add("Learn JavaScript", 3, 101);
  store.add("Complete Assignment", 2, 101);
  store.add("Buy Groceries", 1, 102);

  console.log("--- 2. Updating Task ---");
  store.update(1, { status: "doing" });

  console.log("--- 3. Removing Task ---");
  store.remove(3);

  console.log("--- 4. Importing Tasks from API ---");
  await store.importFromApi(1);

  console.log("--- 5. Listing Filtered Tasks ---");
  console.log(store.list({ ownerId: 101 }));

  console.log("--- 6. Count Tasks by Status ---");
  console.log(store.countByStatus());
}

runDemo();
