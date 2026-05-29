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
  const categories = getCategories(bookmarks);
  filterTabs.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-tab' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderTabs(bookmarks);
      renderList(bookmarks);
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
    li.innerHTML = `
      <div class="bookmark-info">
        <div class="bookmark-title-row">
          <span class="bookmark-title">${escapeHTML(bookmark.title)}</span>
          <span class="category-badge" style="background:${color.bg};color:${color.text}">${escapeHTML(cat)}</span>
        </div>
        <a class="bookmark-url" href="${escapeHTML(bookmark.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(bookmark.url)}</a>
      </div>
      <button class="delete-btn" data-index="${actualIndex}">Delete</button>
    `;
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
  render();
});

list.addEventListener('click', (e) => {
  if (!e.target.matches('.delete-btn')) return;
  const index = parseInt(e.target.dataset.index);
  const bookmarks = loadBookmarks();
  bookmarks.splice(index, 1);
  saveBookmarks(bookmarks);
  if (activeCategory !== 'All') {
    const remaining = bookmarks.filter(b => (b.category || 'Uncategorized') === activeCategory);
    if (remaining.length === 0) activeCategory = 'All';
  }
  render();
});

searchInput.addEventListener('input', render);

render();
