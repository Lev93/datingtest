/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../util/database');

exports.reg = async (req, res, next) => {
  try {
    const {
      email,
      password,
      name,
      birthday,
      gender,
      lat,
      lng,
    } = req.body;
    const errors = validationResult(req);
    const olduser = await db.execute(`SELECT email FROM users WHERE email='${email}'`);
    if (!errors.isEmpty() || olduser[0].length > 0) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const defaultAvatar = 'https://www.dropbox.com/s/x6d1x470d9ytd0v/default-user-icon-6.jpg?raw=1';
    const defaultBackground = 'https://www.dropbox.com/s/9qjnk4g3farvi5y/banner-2.jpg?raw=1';
    await db.execute(
      'INSERT INTO users (name, email, gender, password, birthday, avatar, lat, lng, background) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, gender, hashedPw, birthday, defaultAvatar, lat, lng, defaultBackground],
    );
    const id = await db.execute(`SELECT id FROM users WHERE email='${email}'`);
    res.status(201).json({ message: 'User created!', userId: id[0][0].id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = (req, res, next) => {
  const { email, password, remember } = req.body;
  let loadedUser;
  db.execute(`SELECT id, email, password FROM users WHERE email='${email}'`)
    .then((user) => {
      if (user[0].length < 1) {
        res.json({ message: 'login.resemailerror' });
      }
      loadedUser = user[0][0];
      return bcrypt.compare(password, user[0][0].password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.json({ message: 'login.respassworderror' });
      }
      const duration = remember ? '8760h' : '1h';
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString(),
        },
        'fdgjfidgjidjgpdjgdfgdgdhggjeiohi',
        { expiresIn: duration },
      );
      res.status(200).json({ token, userId: loadedUser.id.toString(), remember });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getcoordinates = async (req, res, next) => {
  try {
    const { id } = req.body;
    const coordinates = await db.execute(`SELECT lat, lng, city, country_id, lookingfora, lookingforageless, lookingforagemore FROM users WHERE id='${id}'`);
    const newMessages = await db.execute(`SELECT COUNT(*) as new FROM messages WHERE readed = '1' AND
    receiver_id='${id}' AND message != 'request sent'`);

    res.status(200).json({
      lat: coordinates[0][0].lat,
      lng: coordinates[0][0].lng,
      city: coordinates[0][0].city,
      country: coordinates[0][0].country_id,
      lookingfora: coordinates[0][0].lookingfora,
      newMessages: newMessages[0][0].new,
      lookingforagemore: coordinates[0][0].lookingforagemore,
      lookingforageless: coordinates[0][0].lookingforageless,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
