/* eslint-disable prefer-destructuring */
const db = require('../util/database');

exports.main = async (req, res, next) => {
  try {
    const { userId, lng } = req.body;
    let language = lng;
    if (lng === 'ru-RU') { language = 'ru'; }
    const user = await db.execute(`SELECT id, name, gender, birthday, background, avatar, relationship, lookingfora, city, country_id, languages, interests, workas, education, height, weight, bodytype, eyes, hair, smoking, aboutme, lookingfor, lookingforageless, lookingforagemore, background, lat, lng, online FROM users WHERE id='${userId}'`);
    const photos = await db.execute(`SELECT id, image_url FROM photos WHERE user_id='${userId}'`);
    user[0][0].photos = photos[0];
    if (user[0][0].languages) {
      user[0][0].languages = user[0][0].languages.split(', ');
    } else {
      user[0][0].languages = [];
    }
    if (user[0][0].interests) {
      user[0][0].interests = user[0][0].interests.split(', ');
    } else {
      user[0][0].interests = [];
    }
    if (user[0][0].country_id) {
      const country = await db.execute(`SELECT title_${language} FROM countries WHERE id='${user[0][0].country_id}';`);
      user[0][0].country = country[0][0][`title_${language}`];
    }
    res.status(200).json({ user: user[0][0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { item, option, userId } = req.body;
    if (item === 'coordinates') {
      await db.execute(`UPDATE users SET lat='${option.lat}', lng='${option.lng}' WHERE id='${userId}'`);
    } else {
      await db.execute(`UPDATE users SET ${item}='${option}' WHERE id='${userId}'`);
    }
    res.status(200).json({ message: 'success' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.addphoto = async (req, res, next) => {
  try {
    const { photo, userId } = req.body;
    await db.execute(
      'INSERT INTO photos (image_url, user_id) VALUES (?, ?)',
      [photo, userId],
    );
    const photos = await db.execute(`SELECT id, image_url FROM photos WHERE user_id='${userId}'`);
    res.status(200).json({ photos: photos[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.searchProfile = async (req, res, next) => {
  try {
    const { input, lng, type } = req.body;
    const countries = await db.execute(`SELECT country_id, title_${lng} AS title FROM ${type} WHERE title_${lng} LIKE '${input}%' Limit 5;`);
    res.status(200).json({ countries: countries[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};
