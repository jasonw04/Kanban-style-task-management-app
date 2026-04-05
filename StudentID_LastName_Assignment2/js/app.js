(function () {
  const h = React.createElement;
  const createRoot = ReactDOM.createRoot;

  function App() {
    // main app state (loads from localStorage)
    const _React$useState = React.useState(window.KanbanUtils.loadState());
    const state = _React$useState[0];
    const setState = _React$useState[1];

    // board modal (create / edit)
    const _React$useState2 = React.useState(null);
    const boardModal = _React$useState2[0];
    const setBoardModal = _React$useState2[1];

    // task modal (create / edit)
    const _React$useState3 = React.useState(null);
    const taskModal = _React$useState3[0];
    const setTaskModal = _React$useState3[1];

    // stores drag info while dragging a task
    const _React$useState4 = React.useState(null);
    const dragData = _React$useState4[0];
    const setDragData = _React$useState4[1];

    // used to highlight where task will drop
    const _React$useState5 = React.useState(null);
    const activeDropZone = _React$useState5[0];
    const setActiveDropZone = _React$useState5[1];

    // save every change to localStorage
    React.useEffect(function () {
      window.KanbanUtils.saveState(state);
    }, [state]);

    // counts for stats panel
    const counts = React.useMemo(function () {
      return window.KanbanUtils.getTaskCounts(state.boards);
    }, [state]);

    function openCreateBoardModal() {
      setBoardModal({ mode: 'create', boardId: null, initialTitle: '' });
    }

    function openEditBoardModal(board) {
      setBoardModal({ mode: 'edit', boardId: board.id, initialTitle: board.title });
    }

    function closeBoardModal() {
      setBoardModal(null);
    }

    function submitBoardModal(title) {
      if (!title) {
        return;
      }

      setState(function (previous) {
        const next = window.KanbanUtils.cloneState(previous);

        // create new board or rename existing
        if (boardModal.mode === 'create') {
          next.boards.push({
            id: window.KanbanUtils.generateId('board'),
            title: title,
            tasks: []
          });
        } else {
          next.boards = next.boards.map(function (board) {
            if (board.id === boardModal.boardId) {
              board.title = title;
            }
            return board;
          });
        }

        return next;
      });

      closeBoardModal();
    }

    function deleteBoard(boardId) {
      const board = state.boards.find(function (item) { return item.id === boardId; });
      if (!board) {
        return;
      }

      // confirm before deleting
      const message = board.tasks.length
        ? 'Delete this board and all tasks inside it?'
        : 'Delete this board?';

      if (!window.confirm(message)) {
        return;
      }

      setState(function (previous) {
        const next = window.KanbanUtils.cloneState(previous);

        next.boards = next.boards.filter(function (item) {
          return item.id !== boardId;
        });

        // always keep at least one board
        if (!next.boards.length) {
          next.boards.push({
            id: window.KanbanUtils.generateId('board'),
            title: 'New Board',
            tasks: []
          });
        }

        return next;
      });
    }

    function openCreateTaskModal(boardId) {
      setTaskModal({ mode: 'create', boardId: boardId, task: null, taskId: null });
    }

    function openEditTaskModal(task, boardId) {
      setTaskModal({ mode: 'edit', boardId: boardId, taskId: task.id, task: task });
    }

    function closeTaskModal() {
      setTaskModal(null);
    }

    function submitTaskModal(formData) {
      const cleaned = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        label: formData.label,
        priority: formData.priority,
        dueDate: formData.dueDate
      };

      // basic check so empty tasks don’t get added
      if (!cleaned.title || !cleaned.description || !cleaned.dueDate) {
        return;
      }

      setState(function (previous) {
        const next = window.KanbanUtils.cloneState(previous);

        next.boards = next.boards.map(function (board) {
          if (board.id !== taskModal.boardId) {
            return board;
          }

          // add or update task
          if (taskModal.mode === 'create') {
            board.tasks.push({
              id: window.KanbanUtils.generateId('task'),
              title: cleaned.title,
              description: cleaned.description,
              label: cleaned.label,
              priority: cleaned.priority,
              createdAt: new Date().toISOString(),
              dueDate: cleaned.dueDate
            });
          } else {
            board.tasks = board.tasks.map(function (task) {
              if (task.id === taskModal.taskId) {
                task.title = cleaned.title;
                task.description = cleaned.description;
                task.label = cleaned.label;
                task.priority = cleaned.priority;
                task.dueDate = cleaned.dueDate;
              }
              return task;
            });
          }

          return board;
        });

        return next;
      });

      closeTaskModal();
    }

    function deleteTask(taskId, boardId) {
      if (!window.confirm('Delete this task?')) {
        return;
      }

      setState(function (previous) {
        const next = window.KanbanUtils.cloneState(previous);

        next.boards = next.boards.map(function (board) {
          if (board.id === boardId) {
            board.tasks = board.tasks.filter(function (task) {
              return task.id !== taskId;
            });
          }
          return board;
        });

        return next;
      });
    }

    function handleDragStart(event, taskId, sourceBoardId, sourceIndex) {
      // save drag info so we know what’s being moved
      const payload = {
        taskId: taskId,
        sourceBoardId: sourceBoardId,
        sourceIndex: sourceIndex
      };

      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(payload));
      setDragData(payload);
    }

    function handleDragEnd() {
      setDragData(null);
      setActiveDropZone(null);
    }

    function handleDragOver(event, zoneId) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      setActiveDropZone(zoneId);
    }

    function handleDragEnter(zoneId) {
      setActiveDropZone(zoneId);
    }

    function handleDragLeave() {
      return null;
    }

    function handleDrop(event, destinationBoardId, destinationIndex) {
      event.preventDefault();

      let payload = dragData;

      // fallback if needed
      if (!payload) {
        try {
          payload = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch (error) {
          payload = null;
        }
      }

      if (!payload) {
        return;
      }

      setState(function (previous) {
        return {
          boards: window.KanbanUtils.moveTask(
            previous.boards,
            payload,
            destinationBoardId,
            destinationIndex
          )
        };
      });

      setDragData(null);
      setActiveDropZone(null);
    }

    function resetSampleData() {
      if (!window.confirm('Reset the app back to the starter sample data?')) {
        return;
      }

      // resets everything back to default
      setState(window.createInitialState());
    }

    return h('div', { className: 'page-shell' }, [
      h('main', { className: 'page-content', key: 'main' }, [
        h(window.KanbanComponents.AppHeader, {
          onAddBoard: openCreateBoardModal,
          onReset: resetSampleData,
          key: 'header'
        }),
        h(window.KanbanComponents.StatsPanel, {
          counts: counts,
          key: 'stats'
        }),
        h('section', { className: 'boards-grid', key: 'boards' },
          state.boards.map(function (board) {
            return h(window.KanbanComponents.BoardColumn, {
              key: board.id,
              board: board,
              activeDropZone: activeDropZone,
              onAddTask: openCreateTaskModal,
              onEditBoard: openEditBoardModal,
              onDeleteBoard: deleteBoard,
              onEditTask: openEditTaskModal,
              onDeleteTask: deleteTask,
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
              onDragOver: handleDragOver,
              onDragEnter: handleDragEnter,
              onDragLeave: handleDragLeave,
              onDrop: handleDrop
            });
          })
        ),
        h('footer', { className: 'app-footer', key: 'footer' }, 'Kanban-style Task Management App')
      ]),
      h(window.KanbanComponents.BoardModal, {
        isOpen: Boolean(boardModal),
        mode: boardModal ? boardModal.mode : 'create',
        initialTitle: boardModal ? boardModal.initialTitle : '',
        onClose: closeBoardModal,
        onSubmit: submitBoardModal,
        key: 'board-modal'
      }),
      h(window.KanbanComponents.TaskModal, {
        isOpen: Boolean(taskModal),
        task: taskModal ? taskModal.task : null,
        onClose: closeTaskModal,
        onSubmit: submitTaskModal,
        key: 'task-modal'
      })
    ]);
  }

  const root = createRoot(document.getElementById('root'));
  root.render(h(App));
})();
