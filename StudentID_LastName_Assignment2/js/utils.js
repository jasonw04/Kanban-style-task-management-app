(function () {

  // milliseconds in one day (used for date calculations)
  const DAY_IN_MS = 1000 * 60 * 60 * 24;

  // quick deep copy so we don’t mutate original state
  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  // formats date into something readable
  function formatDate(dateString) {
    if (!dateString) {
      return 'No due date';
    }

    const date = new Date(dateString + 'T00:00:00');
    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // figures out due status based on today
  function getDueStatus(dueDate) {
    if (!dueDate) {
      return { text: 'No Due Date', tone: 'neutral' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate + 'T00:00:00');
    due.setHours(0, 0, 0, 0);

    const difference = Math.floor((due.getTime() - today.getTime()) / DAY_IN_MS);

    if (difference < 0) {
      return { text: 'Overdue', tone: 'danger' };
    }
    if (difference === 0) {
      return { text: 'Due Today', tone: 'warning' };
    }
    if (difference <= 2) {
      return { text: 'Due Soon', tone: 'accent' };
    }
    return { text: 'On Track', tone: 'success' };
  }

  // counts everything for stats panel
  function getTaskCounts(boards) {
    const counts = {
      boards: boards.length,
      tasks: 0,
      overdue: 0,
      dueSoon: 0,
      dueToday: 0,
      labels: {}
    };

    boards.forEach(function (board) {
      board.tasks.forEach(function (task) {
        counts.tasks += 1;

        // count labels
        counts.labels[task.label] = (counts.labels[task.label] || 0) + 1;

        const dueStatus = getDueStatus(task.dueDate).text;

        if (dueStatus === 'Overdue') {
          counts.overdue += 1;
        } else if (dueStatus === 'Due Soon') {
          counts.dueSoon += 1;
        } else if (dueStatus === 'Due Today') {
          counts.dueToday += 1;
        }
      });
    });

    return counts;
  }

  // save state to localStorage
  function saveState(state) {
    localStorage.setItem(window.KANBAN_STORAGE_KEY, JSON.stringify(state));
  }

  // load saved state or fallback to default
  function loadState() {
    const raw = localStorage.getItem(window.KANBAN_STORAGE_KEY);

    if (!raw) {
      return window.createInitialState();
    }

    try {
      const parsed = JSON.parse(raw);

      // basic check to make sure data looks valid
      if (!parsed || !Array.isArray(parsed.boards)) {
        return window.createInitialState();
      }

      return parsed;
    } catch (error) {
      return window.createInitialState();
    }
  }

  // simple unique id generator
  function generateId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  // find board index by id
  function findBoardIndex(boards, boardId) {
    return boards.findIndex(function (board) {
      return board.id === boardId;
    });
  }

  // handles moving tasks (same board or different board)
  function moveTask(boards, dragData, destinationBoardId, destinationIndex) {
    if (!dragData) {
      return boards;
    }

    const nextBoards = cloneState(boards);

    const sourceBoardIndex = findBoardIndex(nextBoards, dragData.sourceBoardId);
    const destinationBoardIndex = findBoardIndex(nextBoards, destinationBoardId);

    if (sourceBoardIndex === -1 || destinationBoardIndex === -1) {
      return boards;
    }

    const sourceBoard = nextBoards[sourceBoardIndex];
    const destinationBoard = nextBoards[destinationBoardIndex];

    const taskIndex = sourceBoard.tasks.findIndex(function (task) {
      return task.id === dragData.taskId;
    });

    if (taskIndex === -1) {
      return boards;
    }

    // remove task from original spot
    const taskToMove = sourceBoard.tasks.splice(taskIndex, 1)[0];

    let safeDestinationIndex = destinationIndex;

    // keep index in valid range
    if (safeDestinationIndex < 0) {
      safeDestinationIndex = 0;
    }
    if (safeDestinationIndex > destinationBoard.tasks.length) {
      safeDestinationIndex = destinationBoard.tasks.length;
    }

    // adjust index when moving within same board
    if (dragData.sourceBoardId === destinationBoardId && taskIndex < safeDestinationIndex) {
      safeDestinationIndex -= 1;
    }

    // insert task in new position
    destinationBoard.tasks.splice(safeDestinationIndex, 0, taskToMove);

    return nextBoards;
  }

  // expose all helpers globally
  window.KanbanUtils = {
    formatDate: formatDate,
    getDueStatus: getDueStatus,
    getTaskCounts: getTaskCounts,
    saveState: saveState,
    loadState: loadState,
    generateId: generateId,
    moveTask: moveTask,
    cloneState: cloneState
  };

})();
