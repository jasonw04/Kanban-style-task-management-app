(function () {
  const h = React.createElement;
  const Fragment = React.Fragment;

  // top header section
  function AppHeader(props) {
    return h('header', { className: 'app-header shell-card' }, [
      h('div', { className: 'header-copy', key: 'copy' }, [
        h('p', { className: 'eyebrow', key: 'eyebrow' }, 'ITEC 3020 Assignment 2'),
        h('h1', { key: 'title' }, 'FlowBoard Kanban'),
        h('p', { className: 'subcopy', key: 'subcopy' }, 'Organize tasks, track deadlines and save your work automatically.')
      ]),
      h('div', { className: 'header-actions', key: 'actions' }, [
        h('button', {
          type: 'button',
          className: 'primary-btn',
          onClick: props.onAddBoard,
          key: 'add-board'
        }, '+ New Board'),
        h('button', {
          type: 'button',
          className: 'ghost-btn',
          onClick: props.onReset,
          key: 'reset'
        }, 'Reset Sample Data')
      ])
    ]);
  }

  // stats section at the top
  function StatsPanel(props) {
    const labelEntries = Object.keys(props.counts.labels).sort().map(function (label) {
      return h('div', { className: 'stat-chip', key: label }, [
        h('span', { className: 'chip-name', key: 'name' }, label),
        h('strong', { key: 'value' }, String(props.counts.labels[label]))
      ]);
    });

    return h('section', { className: 'stats-grid' }, [
      h('article', { className: 'stat-card shell-card', key: 'boards' }, [
        h('span', { className: 'stat-title', key: 'title' }, 'Boards'),
        h('strong', { className: 'stat-value', key: 'value' }, String(props.counts.boards))
      ]),
      h('article', { className: 'stat-card shell-card', key: 'tasks' }, [
        h('span', { className: 'stat-title', key: 'title' }, 'Tasks'),
        h('strong', { className: 'stat-value', key: 'value' }, String(props.counts.tasks))
      ]),
      h('article', { className: 'stat-card shell-card', key: 'today' }, [
        h('span', { className: 'stat-title', key: 'title' }, 'Due Today'),
        h('strong', { className: 'stat-value', key: 'value' }, String(props.counts.dueToday))
      ]),
      h('article', { className: 'stat-card shell-card', key: 'soon' }, [
        h('span', { className: 'stat-title', key: 'title' }, 'Due Soon'),
        h('strong', { className: 'stat-value', key: 'value' }, String(props.counts.dueSoon))
      ]),
      h('article', { className: 'stat-card shell-card danger-card', key: 'overdue' }, [
        h('span', { className: 'stat-title', key: 'title' }, 'Overdue'),
        h('strong', { className: 'stat-value', key: 'value' }, String(props.counts.overdue))
      ]),
      h('article', { className: 'stat-card shell-card labels-card', key: 'labels' }, [
        h('span', { className: 'stat-title', key: 'title' }, 'Label Counters'),
        h('div', { className: 'label-chip-wrap', key: 'labels' }, labelEntries.length ? labelEntries : [h('span', { className: 'muted-text', key: 'empty' }, 'No labels yet')])
      ])
    ]);
  }

  // drag and drop target area
  function DropZone(props) {
    const className = props.isActive ? 'drop-zone active' : 'drop-zone';
    return h('div', {
      className: className,
      onDragOver: props.onDragOver,
      onDrop: props.onDrop,
      onDragEnter: props.onDragEnter,
      onDragLeave: props.onDragLeave
    });
  }

  // single task card
  function TaskCard(props) {
    const task = props.task;
    const dueStatus = window.KanbanUtils.getDueStatus(task.dueDate);

    return h('article', {
      className: 'task-card',
      draggable: true,
      onDragStart: function (event) {
        props.onDragStart(event, task.id, props.boardId, props.index);
      },
      onDragEnd: props.onDragEnd
    }, [
      h('div', { className: 'task-topline', key: 'top' }, [
        h('span', { className: 'label-pill', key: 'label' }, task.label),
        h('span', { className: 'priority-pill priority-' + task.priority.toLowerCase(), key: 'priority' }, task.priority)
      ]),
      h('h3', { className: 'task-title', key: 'title' }, task.title),
      h('p', { className: 'task-description', key: 'description' }, task.description),
      h('div', { className: 'task-meta', key: 'meta' }, [
        h('div', { className: 'meta-row', key: 'created' }, [
          h('span', { className: 'meta-label', key: 'label' }, 'Created: '),
          h('span', { key: 'value' }, window.KanbanUtils.formatDate(task.createdAt.slice(0, 10)))
        ]),
        h('div', { className: 'meta-row', key: 'due' }, [
          h('span', { className: 'meta-label', key: 'label' }, 'Due: '),
          h('span', { key: 'value' }, window.KanbanUtils.formatDate(task.dueDate))
        ])
      ]),
      h('div', { className: 'task-footer', key: 'footer' }, [
        h('span', { className: 'status-pill tone-' + dueStatus.tone, key: 'status' }, dueStatus.text),
        h('div', { className: 'task-actions', key: 'actions' }, [
          h('button', {
            type: 'button',
            className: 'mini-btn',
            onClick: function () {
              props.onEdit(task, props.boardId);
            },
            key: 'edit'
          }, 'Edit'),
          h('button', {
            type: 'button',
            className: 'mini-btn danger-btn',
            onClick: function () {
              props.onDelete(task.id, props.boardId);
            },
            key: 'delete'
          }, 'Delete')
        ])
      ])
    ]);
  }

  // one full board column
  function BoardColumn(props) {
    const board = props.board;
    const tasks = board.tasks;

    const children = [
      h('div', { className: 'board-header', key: 'header' }, [
        h('div', { key: 'title-wrap' }, [
          h('h2', { className: 'board-title', key: 'title' }, board.title),
          h('p', { className: 'board-count', key: 'count' }, String(tasks.length) + ' task' + (tasks.length === 1 ? '' : 's'))
        ]),
        h('div', { className: 'board-actions', key: 'buttons' }, [
          h('button', {
            type: 'button',
            className: 'primary-btn',
            onClick: function () { props.onAddTask(board.id); },
            key: 'add-task',
            title: 'Add task'
          }, '+ Task'),
          h('button', {
            type: 'button',
            className: 'icon-btn',
            onClick: function () { props.onEditBoard(board); },
            key: 'rename-board',
            title: 'Rename board'
          }, 'Rename'),
          h('button', {
            type: 'button',
            className: 'icon-btn danger-btn',
            onClick: function () { props.onDeleteBoard(board.id); },
            key: 'delete-board',
            title: 'Delete board'
          }, 'Delete')
        ])
      ])
    ];

    // empty board still needs a drop zone
    if (!tasks.length) {
      children.push(
        h(DropZone, {
          key: 'empty-zone',
          isActive: props.activeDropZone === board.id + '-0',
          onDragOver: function (event) { props.onDragOver(event, board.id + '-0'); },
          onDragEnter: function () { props.onDragEnter(board.id + '-0'); },
          onDragLeave: props.onDragLeave,
          onDrop: function (event) { props.onDrop(event, board.id, 0); }
        }),
        h('div', { className: 'empty-board', key: 'empty' }, 'Drop a task here or add a new one.')
      );
    }

    // add a drop zone before every task
    tasks.forEach(function (task, index) {
      children.push(
        h(DropZone, {
          key: 'drop-before-' + task.id,
          isActive: props.activeDropZone === board.id + '-' + index,
          onDragOver: function (event) { props.onDragOver(event, board.id + '-' + index); },
          onDragEnter: function () { props.onDragEnter(board.id + '-' + index); },
          onDragLeave: props.onDragLeave,
          onDrop: function (event) { props.onDrop(event, board.id, index); }
        }),
        h(TaskCard, {
          key: task.id,
          task: task,
          boardId: board.id,
          index: index,
          onEdit: props.onEditTask,
          onDelete: props.onDeleteTask,
          onDragStart: props.onDragStart,
          onDragEnd: props.onDragEnd
        })
      );
    });

    // last drop zone at the bottom of the board
    children.push(
      h(DropZone, {
        key: 'drop-end',
        isActive: props.activeDropZone === board.id + '-' + tasks.length,
        onDragOver: function (event) { props.onDragOver(event, board.id + '-' + tasks.length); },
        onDragEnter: function () { props.onDragEnter(board.id + '-' + tasks.length); },
        onDragLeave: props.onDragLeave,
        onDrop: function (event) { props.onDrop(event, board.id, tasks.length); }
      })
    );

    return h('section', { className: 'board-column shell-card' }, children);
  }

  // reusable input wrapper
  function FieldGroup(props) {
    return h('label', { className: 'field-group' }, [
      h('span', { className: 'field-label', key: 'label' }, props.label),
      props.children
    ]);
  }

  // board modal for create/edit
  function BoardModal(props) {
    const isOpen = props.isOpen;
    const _React$useState = React.useState(props.initialTitle || '');
    const title = _React$useState[0];
    const setTitle = _React$useState[1];

    // resets the title when modal opens
    React.useEffect(function () {
      if (isOpen) {
        setTitle(props.initialTitle || '');
      }
    }, [isOpen, props.initialTitle]);

    if (!isOpen) {
      return null;
    }

    return h('div', { className: 'modal-backdrop', onClick: props.onClose },
      h('div', {
        className: 'modal-card shell-card',
        onClick: function (event) { event.stopPropagation(); }
      }, [
        h('div', { className: 'modal-header', key: 'header' }, [
          h('h3', { key: 'title' }, props.mode === 'edit' ? 'Rename Board' : 'Create Board'),
          h('button', { type: 'button', className: 'close-btn', onClick: props.onClose, key: 'close' }, '×')
        ]),
        h('form', {
          className: 'modal-form',
          key: 'form',
          onSubmit: function (event) {
            event.preventDefault();
            props.onSubmit(title.trim());
          }
        }, [
          h(FieldGroup, { label: 'Board Title', key: 'field' },
            h('input', {
              type: 'text',
              value: title,
              onChange: function (event) { setTitle(event.target.value); },
              placeholder: 'Enter board title',
              required: true,
              maxLength: 30
            })
          ),
          h('div', { className: 'modal-actions', key: 'actions' }, [
            h('button', { type: 'button', className: 'ghost-btn', onClick: props.onClose, key: 'cancel' }, 'Cancel'),
            h('button', { type: 'submit', className: 'primary-btn', key: 'submit' }, props.mode === 'edit' ? 'Save Changes' : 'Create Board')
          ])
        ])
      ])
    );
  }

  // task modal for create/edit
  function TaskModal(props) {
    const emptyTask = {
      title: '',
      description: '',
      label: '',
      priority: '',
      dueDate: ''
    };

    const _React$useState2 = React.useState(emptyTask);
    const form = _React$useState2[0];
    const setForm = _React$useState2[1];

    // load task values when editing, otherwise clear the form
    React.useEffect(function () {
      if (props.isOpen) {
        if (props.task) {
          setForm({
            title: props.task.title || '',
            description: props.task.description || '',
            label: props.task.label || '',
            priority: props.task.priority || '',
            dueDate: props.task.dueDate || ''
          });
        } else {
          setForm(emptyTask);
        }
      }
    }, [props.isOpen, props.task]);

    if (!props.isOpen) {
      return null;
    }

    // updates one field at a time
    function updateField(fieldName, value) {
      setForm(function (previous) {
        const next = Object.assign({}, previous);
        next[fieldName] = value;
        return next;
      });
    }

    return h('div', { className: 'modal-backdrop', onClick: props.onClose },
      h('div', {
        className: 'modal-card shell-card large-modal',
        onClick: function (event) { event.stopPropagation(); }
      }, [
        h('div', { className: 'modal-header', key: 'header' }, [
          h('h3', { key: 'title' }, props.task ? 'Edit Task' : 'Create Task'),
          h('button', { type: 'button', className: 'close-btn', onClick: props.onClose, key: 'close' }, '×')
        ]),
        h('form', {
          className: 'modal-form',
          key: 'form',
          onSubmit: function (event) {
            event.preventDefault();
            props.onSubmit(form);
          }
        }, [
          h('div', { className: 'form-grid', key: 'grid' }, [
            h(FieldGroup, { label: 'Task Title', key: 'title-group' },
              h('input', {
                type: 'text',
                value: form.title,
                onChange: function (event) { updateField('title', event.target.value); },
                placeholder: 'Enter task title',
                required: true,
                maxLength: 60
              })
            ),
            h(FieldGroup, { label: 'Due Date', key: 'due-group' },
              h('input', {
                type: 'date',
                value: form.dueDate,
                onChange: function (event) { updateField('dueDate', event.target.value); },
                required: true,
                className: form.dueDate ? 'has-value' : 'empty-date'
              })
            ),
            h(FieldGroup, { label: 'Label', key: 'label-group' },
              h('select', {
                value: form.label,
                onChange: function (event) { updateField('label', event.target.value); },
                required: true
              }, [
                h('option', { value: '', disabled: true, hidden: true }, 'Select label'),
              ].concat(
                window.DEFAULT_LABELS.map(function (label) {
                  return h('option', { value: label, key: label }, label);
                })
              ))
            ),
            h(FieldGroup, { label: 'Priority', key: 'priority-group' },
              h('select', {
                value: form.priority,
                onChange: function (event) { updateField('priority', event.target.value); },
                required: true
              }, [
                h('option', { value: '', disabled: true, hidden: true }, 'Select priority'),
              ].concat(
                window.DEFAULT_PRIORITIES.map(function (priority) {
                  return h('option', { value: priority, key: priority }, priority);
                })
              ))
            )
          ]),
          h(FieldGroup, { label: 'Description', key: 'description-group' },
            h('textarea', {
              value: form.description,
              onChange: function (event) { updateField('description', event.target.value); },
              rows: 5,
              placeholder: 'Describe the task clearly so it is easy to continue later.',
              required: true,
              maxLength: 240
            })
          ),
          h('div', { className: 'modal-actions', key: 'actions' }, [
            h('button', { type: 'button', className: 'ghost-btn', onClick: props.onClose, key: 'cancel' }, 'Cancel'),
            h('button', { type: 'submit', className: 'primary-btn', key: 'submit' }, props.task ? 'Save Task' : 'Add Task')
          ])
        ])
      ])
    );
  }

  window.KanbanComponents = {
    AppHeader: AppHeader,
    StatsPanel: StatsPanel,
    BoardColumn: BoardColumn,
    BoardModal: BoardModal,
    TaskModal: TaskModal
  };
})();
