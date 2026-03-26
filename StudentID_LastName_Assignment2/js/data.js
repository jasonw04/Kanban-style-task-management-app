(function () {
  function createTask(id, title, description, label, priority, dueDate) {
    return {
      id: id,
      title: title,
      description: description,
      label: label,
      priority: priority,
      createdAt: new Date().toISOString(),
      dueDate: dueDate
    };
  }

  window.KANBAN_STORAGE_KEY = 'itec3020_assignment2_kanban_app';

  window.DEFAULT_LABELS = ['Feature', 'Design', 'Bug', 'Content'];
  window.DEFAULT_PRIORITIES = ['Low', 'Medium', 'High'];

  window.createInitialState = function createInitialState() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const inThreeDays = new Date(today);
    inThreeDays.setDate(today.getDate() + 3);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return {
      boards: [
        {
          id: 'board-' + Date.now() + '-todo',
          title: 'To Do',
          tasks: [
            createTask('task-' + Date.now() + '-1', 'Plan landing page copy', 'Write the main hero text and supporting call-to-action copy for the homepage.', 'Content', 'Medium', tomorrow.toISOString().slice(0, 10)),
            createTask('task-' + Date.now() + '-2', 'Fix card spacing', 'Tighten the spacing in the project cards so the layout feels more balanced.', 'Design', 'High', inThreeDays.toISOString().slice(0, 10))
          ]
        },
        {
          id: 'board-' + Date.now() + '-progress',
          title: 'In Progress',
          tasks: [
            createTask('task-' + Date.now() + '-3', 'Build board drag logic', 'Implement drag-and-drop behavior for moving tasks between boards and reordering them.', 'Feature', 'High', nextWeek.toISOString().slice(0, 10))
          ]
        },
        {
          id: 'board-' + Date.now() + '-done',
          title: 'Done',
          tasks: [
            createTask('task-' + Date.now() + '-4', 'Create starter layout', 'Set up the base header, stats, board grid, and modal structure.', 'Feature', 'Low', today.toISOString().slice(0, 10))
          ]
        }
      ]
    };
  };
})();
