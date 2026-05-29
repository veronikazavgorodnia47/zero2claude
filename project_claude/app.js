// Theme toggle — runs before render to avoid flash
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
document.body.classList.toggle('dark', isDark);
document.body.classList.toggle('light', !isDark);
themeToggle.textContent = isDark ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  document.body.classList.toggle('light', !dark);
  themeToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

const form = document.getElementById('bookmark-form');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const categoryInput = document.getElementById('category');
const list = document.getElementById('bookmark-list');
const emptyMsg = document.getElementById('empty-msg');
const noResults = document.getElementById('no-results');
const countBadge = document.getElementById('count');
const searchInput = document.getElementById('search');
const filterTabs = document.getElementById('filter-tabs');

let activeCategory = 'All';
let editingIndex = null;

const categories = ['Uncategorized', 'Work', 'Personal', 'Reading', 'Tools', 'Other'];

const categoryColors = {
  Work:          { bg: '#e8f0fe', text: '#1a56db' },
  Personal:      { bg: '#fce8f3', text: '#bf125d' },
  Reading:       { bg: '#fef3c7', text: '#92400e' },
  Tools:         { bg: '#d1fae5', text: '#065f46' },
  Other:         { bg: '#ede9fe', text: '#5b21b6' },
  Uncategorized: { bg: '#f0f0f5', text: '#555' },
};

function loadBookmarks() {
  return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

function saveBookmarks(bookmarks) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function getCategories(bookmarks) {
  const cats = [...new Set(bookmarks.map(b => b.category || 'Uncategorized'))];
  return ['All', ...cats];
}

function renderTabs(bookmarks) {
  const cats = getCategories(bookmarks);
  filterTabs.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      editingIndex = null;
      render();
    });
    filterTabs.appendChild(btn);
  });
}

function renderList(bookmarks) {
  const query = searchInput.value.trim().toLowerCase();

  let filtered = activeCategory === 'All'
    ? bookmarks
    : bookmarks.filter(b => (b.category || 'Uncategorized') === activeCategory);

  if (query) filtered = filtered.filter(b => b.title.toLowerCase().includes(query));

  list.innerHTML = '';
  emptyMsg.style.display = 'none';
  noResults.style.display = 'none';

  if (bookmarks.length === 0) {
    emptyMsg.style.display = 'block';
    countBadge.textContent = '';
    return;
  }

  countBadge.textContent = bookmarks.length;

  if (filtered.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  filtered.forEach((bookmark) => {
    const cat = bookmark.category || 'Uncategorized';
    const color = categoryColors[cat] || categoryColors.Uncategorized;
    const actualIndex = bookmarks.indexOf(bookmark);
    const li = document.createElement('li');
    li.className = 'bookmark-item';

    if (editingIndex === actualIndex) {
      const categoryOptions = categories
        .map(c => `<option value="${c}"${c === cat ? ' selected' : ''}>${c}</option>`)
        .join('');

      li.classList.add('editing');
      li.innerHTML = `
        <div class="edit-fields">
          <input class="edit-title" type="text" value="${escapeHTML(bookmark.title)}" placeholder="Title" />
          <input class="edit-url" type="url" value="${escapeHTML(bookmark.url)}" placeholder="https://example.com" />
          <select class="edit-category">${categoryOptions}</select>
        </div>
        <div class="edit-actions">
          <button class="save-btn" data-index="${actualIndex}">Save</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      `;
    } else {
      li.innerHTML = `
        <div class="bookmark-info">
          <div class="bookmark-title-row">
            <span class="bookmark-title">${escapeHTML(bookmark.title)}</span>
            <span class="category-badge" style="background:${color.bg};color:${color.text}">${escapeHTML(cat)}</span>
          </div>
          <a class="bookmark-url" href="${escapeHTML(bookmark.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(bookmark.url)}</a>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-index="${actualIndex}" aria-label="Edit bookmark" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="delete-btn" data-index="${actualIndex}" aria-label="Delete bookmark" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      `;
    }

    list.appendChild(li);
  });
}

function render() {
  const bookmarks = loadBookmarks();
  renderTabs(bookmarks);
  renderList(bookmarks);
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bookmarks = loadBookmarks();
  bookmarks.unshift({
    title: titleInput.value.trim(),
    url: urlInput.value.trim(),
    category: categoryInput.value,
  });
  saveBookmarks(bookmarks);
  form.reset();
  searchInput.value = '';
  activeCategory = 'All';
  editingIndex = null;
  render();
});

list.addEventListener('click', (e) => {
  // Delete
  if (e.target.matches('.delete-btn')) {
    const index = parseInt(e.target.dataset.index);
    const bookmarks = loadBookmarks();
    bookmarks.splice(index, 1);
    saveBookmarks(bookmarks);
    editingIndex = null;
    if (activeCategory !== 'All') {
      const remaining = bookmarks.filter(b => (b.category || 'Uncategorized') === activeCategory);
      if (remaining.length === 0) activeCategory = 'All';
    }
    render();
    return;
  }

  // Enter edit mode
  if (e.target.matches('.edit-btn')) {
    editingIndex = parseInt(e.target.dataset.index);
    render();
    return;
  }

  // Save edit
  if (e.target.matches('.save-btn')) {
    const index = parseInt(e.target.dataset.index);
    const li = e.target.closest('li');
    const newTitle = li.querySelector('.edit-title').value.trim();
    const newUrl = li.querySelector('.edit-url').value.trim();
    const newCategory = li.querySelector('.edit-category').value;

    if (!newTitle || !newUrl) return;

    const bookmarks = loadBookmarks();
    bookmarks[index] = { title: newTitle, url: newUrl, category: newCategory };
    saveBookmarks(bookmarks);
    editingIndex = null;
    render();
    return;
  }

  // Cancel edit
  if (e.target.matches('.cancel-btn')) {
    editingIndex = null;
    render();
  }
});

searchInput.addEventListener('input', render);

render();
