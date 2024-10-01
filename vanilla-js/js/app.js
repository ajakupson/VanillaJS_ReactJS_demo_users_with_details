document.addEventListener('DOMContentLoaded', () => {
    const userListView = document.getElementById('user-list');
    const userDetailView = document.getElementById('user-detail');
    const userListElement = document.getElementById('users');
    const userInfo = document.getElementById('user-info');
    const searchInput = document.getElementById('search');
    const backButton = document.getElementById('back-button');

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const users = await response.json();
            displayUserList(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const displayUserList = (users) => {
        userListElement.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name;
            li.addEventListener('click', () => {
                navigateToDetail(user.id);
            });
            userListElement.appendChild(li);
        });

        userListView.classList.add('active');
        userDetailView.classList.remove('active');
    };

    const navigateToDetail = async (userId) => {
        try {
            window.history.replaceState({ userId }, '', `${window.location.pathname}#user-${userId}`);

            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            const user = await response.json();
            displayUserDetail(user);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const displayUserDetail = (user) => {
        userListView.classList.remove('active');
        userDetailView.classList.add('active');

        if(!user || Object.keys(user).length === 0) {
            userInfo.innerHTML = '<h2>User not found</h2>';
            return;
          }

        userInfo.innerHTML = `
            <h2>${user.name}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Website:</strong> ${user.website}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>
            <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
        `;
    };

    backButton.addEventListener('click', () => {
        window.history.replaceState({}, '', window.location.pathname);
        userListView.classList.add('active');
        userDetailView.classList.remove('active');
    });

    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const users = await response.json();
            const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
            displayUserList(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });

    const loadPage = async () => {
        const userId = window.location.hash ? window.location.hash.replace('#user-', '') : null;

        if (userId) {
            try {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
                const user = await response.json();
                displayUserDetail(user);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        } else {
            userListView.classList.add('active');
            userDetailView.classList.remove('active');
        }
    };

    fetchUsers();
    loadPage();

    window.addEventListener('popstate', loadPage);
});