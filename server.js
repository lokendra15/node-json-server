const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();

const PORT = 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add custom routes for adding, updating, and deleting data
server.post('/posts', (req, res) => {
  const db = router.db;
  const { title, content } = req.body;
  
  // Get the posts collection from the database
  const posts = db.get('posts');

  // Generate a new ID based on the current length of the posts array
  const newPostId = posts.size().value() + 1;

  // Create a new post object
  const newPost = { id: newPostId, title, content };

  // Add the new post to the posts collection
  posts.push(newPost).write();

  // Send the new post as a response
  res.json(newPost);
});

server.put('/posts/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const postIndex = db.posts.findIndex(post => post.id === id);
  if (postIndex !== -1) {
    db.posts[postIndex] = { ...db.posts[postIndex], title, content };
    router.db.write();
    res.json(db.posts[postIndex]);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

server.delete('/posts/:id', (req, res) => {
  const db = router.db;
  const id = parseInt(req.params.id);
  const postIndex = db.posts.findIndex(post => post.id === id);
  if (postIndex !== -1) {
    db.posts.splice(postIndex, 1);
    router.db.write();
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
