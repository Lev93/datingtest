/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
const db = require('../util/database');

exports.main = async (req, res, next) => {
  try {
    const {
      lng,
      activeType,
      page,
      sort,
    } = req.body;
    let type = '';
    if (activeType !== 'all') {
      type = `AND type='${activeType}'`;
    }
    let language = lng.toLowerCase();
    if (lng.length > 3) {
      language = lng.split('-')[0];
    }
    const blogs = await db.execute(`SELECT
    posts.id, posts.user_id, posts.date, title, type, posts.text, likes, views, img, name, COUNT(comments.id) AS comments
    FROM posts 
    LEFT JOIN users
    ON posts.user_id = users.id
    LEFT JOIN comments
    ON posts.id = comments.post_id  
    WHERE posts.lng='${language}' ${type}
    GROUP BY posts.id
    ORDER BY ${sort}
    LIMIT ${(page - 1) * 9},9;`);
    res.status(200).json({ blogs: blogs[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      userId,
      html,
      image,
      title,
      category,
      lng,
    } = req.body;
    let language = lng.toLowerCase();
    if (lng.length > 3) {
      language = lng.split('-')[0];
    }
    await db.execute(
      'INSERT INTO posts (user_id, title, type, text, img, lng) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, title, category, html, image, language],
    );
    res.status(200).json({ message: 'success' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.getblog = async (req, res, next) => {
  try {
    const { postId } = req.body;
    await db.execute(`UPDATE posts SET views = views + 1 WHERE id='${postId}'`);
    const blogRaw = await db.execute(`SELECT
    posts.id, user_id, date, title, type, text, likes, views, img, name
    FROM posts 
    LEFT JOIN users
    ON posts.user_id = users.id 
    WHERE posts.id='${postId}';`);
    const blog = blogRaw[0][0];
    const comments = await db.execute(`SELECT
    comments.id, date, text, name, avatar
    FROM comments
    LEFT JOIN users
    ON comments.user_id = users.id 
    WHERE comments.post_id='${blog.id}';`);
    blog.commentsList = comments[0];
    blog.comments = comments[0].length;
    res.status(200).json({ blog });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.getnewblogs = async (req, res, next) => {
  try {
    const { lng } = req.body;
    const blogsRaw = await db.execute(`SELECT
    id, date, title
    FROM posts 
    WHERE lng='${lng}'
    ORDER BY date DESC;`);
    const blogs = blogsRaw[0];
    res.status(200).json({ blogs });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.newcomment = async (req, res, next) => {
  try {
    const { postId, userId, text } = req.body;
    const newComment = await db.execute(
      'INSERT INTO comments (user_id, post_id, text) VALUES (?, ?, ?)',
      [userId, postId, text],
    );
    const comments = await db.execute(`SELECT
    comments.id, date, text, name, avatar
    FROM comments
    LEFT JOIN users
    ON comments.user_id = users.id 
    WHERE comments.id='${newComment[0].insertId}';`);
    res.status(200).json({ comment: comments[0][0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.like = async (req, res, next) => {
  try {
    const { postId, userId } = req.body;
    await db.execute(
      'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
      [userId, postId],
    );
    await db.execute(`UPDATE posts SET likes = likes + 1 WHERE id='${postId}'`);
    res.status(200).json({ message: 'success' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      err.statusCode = 500;
      err.message = 'like';
    } else if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};
