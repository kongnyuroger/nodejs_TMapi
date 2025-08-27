const tasks = [
  {
    id: 1,
    title: "Finish project proposal",
    description: "Write and submit the draft for the new project proposal.",
    status: "in-progress", // pending | in-progress | completed
    priority: "high", // low | medium | high
    dueDate: "2025-09-01",
    assignedTo: "Alice",
    tags: ["work", "writing"]
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Milk, bread, eggs, and vegetables.",
    status: "pending",
    priority: "medium",
    dueDate: "2025-08-29",
    assignedTo: "Roger",
    tags: ["personal", "shopping"]
  },
  {
    id: 3,
    title: "Prepare presentation",
    description: "Create slides for the Node.js workshop.",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-09-05",
    assignedTo: "John",
    tags: ["work", "nodejs"]
  },
  {
    id: 4,
    title: "Call plumber",
    description: "Fix leaking sink in the kitchen.",
    status: "pending",
    priority: "low",
    dueDate: "2025-09-02",
    assignedTo: "Roger",
    tags: ["home", "repairs"]
  },
  {
    id: 5,
    title: "Study async/await",
    description: "Go through async/await exercises in Node.js.",
    status: "completed",
    priority: "medium",
    dueDate: "2025-08-25",
    assignedTo: "Ruga",
    tags: ["study", "nodejs"]
  }
];

export default tasks;
