// code for an editing double click text



// Load todos from localStorage or initialize an empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to render todos based on the filter
function renderTodos(filter = 'all') {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true; // all
    });

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <div class='parent_div'>
                <div class="circle" onclick="toggleComplete(${index})"></div>
                <div class="image-container" id="image-${index}" onclick="toggleComplete(${index})">
                    <img class="img1" src="./img/true_2.png" alt="Completed" />
                </div>
                <span class="${todo.completed ? 'completed' : 'uncompleted'}" ondblclick="startEdit(${index})">${todo.text}</span>
                <input type="text" class="edit-input" id="edit-input-${index}" style="display: none;" onblur="finishEdit(${index})" onkeydown="handleEditKeydown(event, ${index})">
            </div>
        `;
        todoList.appendChild(li);

        // Show/hide image based on completion status
        const imageContainer = document.getElementById(`image-${index}`);
        if (todo.completed) {
            imageContainer.style.display = 'block';
            li.querySelector('.circle').style.display = 'none'; // Hide the circle
        } else {
            imageContainer.style.display = 'none';
            li.querySelector('.circle').style.display = 'flex'; // Show the circle
        }
    });

    updateTotalCount(); // Update the total count of todos
}

// Function to toggle the completion status of a todo
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed; // Toggle the completed state
    saveTodos(); // Save the updated todos to localStorage
    renderTodos(); // Re-render the list to reflect changes
}

// Function to add a new todo
function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value.trim();
    if (todoText) {
        todos.push({ text: todoText, completed: false });
        todoInput.value = '';
        saveTodos(); // Save the new todo to localStorage
        renderTodos(); // Re-render the list to show the new todo
    } else {
        alert("Please fill the input field");
    }
}

// Function to handle keydown events
function handleKeydown(event) {
    if (event.key === 'Enter') {
        addTodo();
    }
}

// Function to delete a todo
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos(); // Save the updated todos to localStorage
    renderTodos();
}

// Function to start editing a todo
function startEdit(index) {
    const editInput = document.getElementById(`edit-input-${index}`);
    const todoText = todos[index].text;
    editInput.value = todoText;
    editInput.style.display = 'inline';
    editInput.focus();
}

// Function to finish editing a todo
function finishEdit(index) {
    const editInput = document.getElementById(`edit-input-${index}`);
    const newText = editInput.value.trim();
    if (newText) {
        todos[index].text = newText;
        saveTodos(); // Save the updated todos to localStorage
        renderTodos();
    } else {
        // Remove the todo if the edited text is empty
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
    editInput.style.display = 'none';
}

// Function to handle keydown events during editing
function handleEditKeydown(event, index) {
    if (event.key === 'Enter') {
        finishEdit(index);
    } else if (event.key === 'Escape') {
        const editInput = document.getElementById(`edit-input-${index}`);
        editInput.value = todos[index].text; // Revert to original text
        editInput.style.display = 'none';
    }
}

// Function to update the total count of todos
function updateTotalCount() {
    const totalCount = document.getElementById('total-count');
    totalCount.textContent = `${todos.length} item left`;
}

// Function to handle button clicks and toggle active state
function setActiveButton(buttonId) {
    const buttons = ['show-all', 'show-active', 'show-completed', 'clear-completed'];
    buttons.forEach(id => {
        const button = document.getElementById(id);
        if (id === buttonId) {
            button.classList.add('active'); // Add active class to the clicked button
        } else {
            button.classList.remove('active'); // Remove active class from other buttons
        }
    });
}

// Event listeners for filtering todos
document.getElementById('show-all').addEventListener('click', () => {
    renderTodos('all');
    setActiveButton('show-all'); // Set active button
});
document.getElementById('show-active').addEventListener('click', () => {
    renderTodos('active');
    setActiveButton('show-active'); // Set active button
});
document.getElementById('show-completed').addEventListener('click', () => {
    renderTodos('completed');
    setActiveButton('show-completed'); // Set active button
});
document.getElementById('clear-completed').addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos(); // Save the updated todos to localStorage
    renderTodos(); // Re-render the list after clearing completed todos
    setActiveButton('clear-completed'); // Set active button
});

// Render the initial todos from localStorage
renderTodos();