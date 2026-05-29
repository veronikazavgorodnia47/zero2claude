const form = document.getElementById('bookmark-form');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const list = document.getElementById('bookmark-list');
const emptyMsg = document.getElementById('empty-msg');
const countBadge = document.getElementById('count');

function loadBookmarks() {
  return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

function saveBookmarks(bookmarks) {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function render() {
  const bookmarks = loadBookmarks();
  list.innerHTML = '';

  if (bookmarks.length === 0) {
    emptyMsg.style.display = 'block';
    countBadge.textContent = '';
  } else {
    emptyMsg.style.display = 'none';
    countBadge.textContent = bookmarks.length;

    bookmarks.forEach((bookmark, index) => {
      const li = document.createElement('li');
      li.className = 'bookmark-item';
      li.innerHTML = `
        <div class="bookmark-info">
          <span class="bookmark-title">${escapeHTML(bookmark.title)}</span>
          <a class="bookmark-url" href="${escapeHTML(bookmark.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(bookmark.url)}</a>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      list.appendChild(li);
    });
  }
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bookmarks = loadBookmarks();
  bookmarks.unshift({ title: titleInput.value.trim(), url: urlInput.value.trim() });
  saveBookmarks(bookmarks);
  form.reset();
  render();
});

list.addEventListener('click', (e) => {
  if (!e.target.matches('.delete-btn')) return;
  const index = parseInt(e.target.dataset.index);
  const bookmarks = loadBookmarks();
  bookmarks.splice(index, 1);
  saveBookmarks(bookmarks);
  render();
});

render();
