/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const mainRoutes = require('./routes/main');
const communityRoutes = require('./routes/community');
const messagesRoutes = require('./routes/messages');
const blogsRoutes = require('./routes/blogs');
const db = require('./util/database');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/main', mainRoutes);
app.use('/community', communityRoutes);
app.use('/messages', messagesRoutes);
app.use('/blogs', blogsRoutes);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const { data, message } = error;
  res.status(status).json({ message, data });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT);
const io = require('./socket').init(server);

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    console.log(`1-${socket.id}`);
    db.execute(`UPDATE users SET online='1', socket='${socket.id}' WHERE id='${data.userId}'`);
    socket.join(data.userId);
    io.emit('new_online', {
      userId: data.userId,
    });
  });
  socket.on('input', (data) => {
    io.in(data.receiver_id).emit('input_result', {
      input: data.status,
      sender_id: data.sender_id,
    });
  });
  socket.on('disconnect', () => {
    console.log(`2-${socket.id}`);
    if (socket.id) {
      db.execute(`SELECT id FROM users WHERE socket='${socket.id}'`).then((res) => {
        console.log(res[0][0].id);
        io.emit('new_offline', {
          userId: res[0][0].id,
        });
        db.execute(`UPDATE users SET online='0', socket= NULL, last_online=now() WHERE id='${res[0][0].id}'`);
      });
    }
  });
});
