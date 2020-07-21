/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
const db = require('../util/database');

exports.main = async (req, res, next) => {
  try {
    const {
      userId,
      lat,
      lng,
      language,
    } = req.body;
    const info = await db.execute('SELECT gender, online, Count(gender) AS totalmembers FROM users GROUP BY gender, online');
    const lastRegisteredUsers = await db.execute('SELECT id, name, birthday, avatar FROM users ORDER BY created_at DESC LIMIT 20');
    let users;
    if (userId) {
      const user = await db.execute(`SELECT lat, lng FROM users WHERE id='${userId}'`);
      users = await db.execute(`SELECT id, name, birthday, avatar, lat, lng, (
        6373 * acos (
          cos ( radians(${user[0][0].lat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${user[0][0].lng}) )
          + sin ( radians(${user[0][0].lat}) )
          * sin( radians( lat ) )
        )
      ) AS distance
      FROM users HAVING distance < 10`);
    } else {
      users = await db.execute(`SELECT id, name, birthday, avatar, lat, lng, (
        6373 * acos (
          cos ( radians(${lat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${lng}) )
          + sin ( radians(${lat}) )
          * sin( radians( lat ) )
        )
      ) AS distance
      FROM users HAVING distance < 10`);
    }
    const blogs = await db.execute(`SELECT
    id, date, title, type, img
    FROM posts 
    WHERE lng='${language}'
    ORDER BY id DESC
    LIMIT 12;`);
    res.status(201).json({
      info: info[0],
      lastRegisteredUsers: lastRegisteredUsers[0],
      users: users[0],
      blogs: blogs[0],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.map = async (req, res, next) => {
  try {
    const { userId, lat, lng } = req.body;
    let users;
    if (userId) {
      const user = await db.execute(`SELECT lat, lng FROM users WHERE id='${userId}'`);
      users = await db.execute(`SELECT id, name, birthday, avatar, lat, lng, (
        6373 * acos (
          cos ( radians(${user[0][0].lat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${user[0][0].lng}) )
          + sin ( radians(${user[0][0].lat}) )
          * sin( radians( lat ) )
        )
      ) AS distance
      FROM users HAVING distance < 10`);
    } else {
      users = await db.execute(`SELECT id, name, birthday, avatar, lat, lng, (
        6373 * acos (
          cos ( radians(${lat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${lng}) )
          + sin ( radians(${lat}) )
          * sin( radians( lat ) )
        )
      ) AS distance
      FROM users HAVING distance < 10`);
    }
    res.status(201).json({
      users: users[0],
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};
