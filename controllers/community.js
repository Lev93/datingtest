/* eslint-disable prefer-destructuring */
const db = require('../util/database');

exports.user = async (req, res, next) => {
  try {
    const { userId, lng } = req.body;
    const user = await db.execute(`SELECT name, gender, birthday, background, avatar, relationship, lookingfora, city, country_id, languages, interests, workas, education, height, weight, bodytype, eyes, hair, smoking, aboutme, lookingfor, lookingforageless, lookingforagemore, background, lat, lng, online, last_online FROM users WHERE id='${userId}'`);
    if (!user[0][0]) {
      const error = new Error('userNotExist');
      error.statusCode = 422;
      throw error;
    }
    const photos = await db.execute(`SELECT id, image_url FROM photos WHERE user_id='${userId}'`);
    user[0][0].photos = photos[0];
    const blogs = await db.execute(`SELECT id, title, img FROM posts WHERE user_id='${userId}' ORDER BY date LIMIT 3`);
    user[0][0].blogs = blogs[0];
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
      const country = await db.execute(`SELECT title_${lng.toLowerCase()} FROM countries WHERE id='${user[0][0].country_id}';`);
      user[0][0].country = country[0][0][`title_${lng.toLowerCase()}`];
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

exports.search = async (req, res, next) => {
  try {
    const users = await db.execute('SELECT id, name, birthday, avatar FROM users LIMIT 24');
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

exports.advancedsearch = async (req, res, next) => {
  try {
    const { parameters, page, sort } = req.body;
    let users;
    if (parameters === '') {
      users = await db.execute(`SELECT id, name, birthday, avatar, city, last_online FROM users ORDER BY ${sort} LIMIT ${(page - 1) * 48},48`);
    } else {
      users = await db.execute(`SELECT id, name, birthday, avatar, city, last_online FROM users WHERE ${parameters} ORDER BY ${sort} LIMIT ${(page - 1) * 48},48`);
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

exports.mapsearch = async (req, res, next) => {
  try {
    const {
      parameters,
      distance,
      lng,
      lat,
    } = req.body;
    const users = await db.execute(`SELECT id, name, birthday, avatar, lat, lng, (
      6373 * acos (
        cos ( radians(${lat}) )
        * cos( radians( lat ) )
        * cos( radians( lng ) - radians(${lng}) )
        + sin ( radians(${lat}) )
        * sin( radians( lat ) )
      )
    ) AS distance
    FROM users WHERE ${parameters} HAVING distance < ${distance}`);
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

exports.quickmatch = async (req, res, next) => {
  try {
    const {
      userId,
      city,
      country,
      lat,
      lng,
      lookingfora,
      from,
      to,
      language,
    } = req.body;
    let sex = 'female';
    if (lookingfora === 'man') {
      sex = 'male';
    }
    const usersRaw = await db.execute(`SELECT users.id, avatar, name, gender, birthday, 
    relationship, lookingfora, city, country_id, languages, interests, workas, education, height,
    weight, bodytype, eyes, hair, smoking, aboutme, lookingfor, lookingforageless, 
    lookingforagemore, lat, lng,  (
      6373 * acos (
        cos ( radians('${lat}') )
        * cos( radians( lat ) )
        * cos( radians( lng ) - radians('${lng}') )
        + sin ( radians('${lat}') )
        * sin( radians( lat ) )
        )
      ) AS distance, title_${language.toLowerCase()} AS country,
      (CASE WHEN status = 'request waiting' AND city = '${city}' THEN 20
      WHEN city = '${city}' THEN 10
      WHEN status = 'request waiting' THEN 10
      WHEN country_id = '${country}' THEN 5
          ELSE 0 
          END ) AS matches
      FROM (SELECT * FROM contacts WHERE first_user_id = '${userId}') AS contacts
      RIGHT JOIN users ON contacts.second_user_id = users.id
      RIGHT JOIN countries ON users.country_id = countries.id
      WHERE 
      first_user_id IS NULL AND gender = '${sex}' AND birthday BETWEEN '${to}' AND '${from}'
      ORDER BY matches DESC, distance
      LIMIT 12;
      `);
    if (usersRaw[0].length === 0) {
      res.status(201).json({
        noUsers: true,
      });
    } else {
      const users = usersRaw[0];
      const usersId = users.map((user) => user.id);
      const photos = await db.execute(`SELECT user_id, image_url FROM photos WHERE user_id IN (${usersId.join(',')});`);
      for (let i = 0; i < users.length; i += 1) {
        users[i].photos = photos[0].filter(
          (photo) => photo.user_id === users[i].id,
        ).map((photo) => photo.image_url);
        if (users[i].languages) {
          users[i].languages = users[i].languages.split(', ');
        } else {
          users[i].languages = [];
        }
        if (users[i].interests) {
          users[i].interests = users[i].interests.split(', ');
        } else {
          users[i].interests = [];
        }
      }
      res.status(201).json({
        users,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.quickmatchnext = async (req, res, next) => {
  try {
    const {
      userId,
      secondUser,
      type,
      city,
      country,
      lat,
      lng,
      lookingfora,
      from,
      to,
      language,
      usersLength,
    } = req.body;
    if (type === 'like') {
      await db.execute(
        'INSERT INTO contacts (first_user_id, second_user_id, status) VALUES (?, ?, ?), (?, ?, ?)',
        [userId, secondUser, 'request sent', secondUser, userId, 'request waiting'],
      );
      await db.execute(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [userId, secondUser, 'request sent'],
      );
    } else {
      await db.execute(
        'INSERT INTO contacts (first_user_id, second_user_id, status) VALUES (?, ?, ?), (?, ?, ?)',
        [userId, secondUser, 'declined', secondUser, userId, 'declined'],
      );
      await db.execute(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [userId, secondUser, 'requestDeclined'],
      );
    }
    let newUser = '';
    if (usersLength === 12) {
      let sex = 'female';
      if (lookingfora === 'man') {
        sex = 'male';
      }
      const userRaw = await db.execute(`SELECT users.id, avatar, name, gender, birthday, 
      relationship, lookingfora, city, country_id, languages, interests, workas, education, height,
      weight, bodytype, eyes, hair, smoking, aboutme, lookingfor, lookingforageless, 
      lookingforagemore, lat, lng,  (
        6373 * acos (
          cos ( radians('${lat}') )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians('${lng}') )
          + sin ( radians('${lat}') )
          * sin( radians( lat ) )
          )
        ) AS distance, title_${language.toLowerCase()} AS country,
        (CASE WHEN status = 'request waiting' AND city = '${city}' THEN 20
        WHEN city = '${city}' THEN 10
        WHEN status = 'request waiting' THEN 10
        WHEN country_id = '${country}' THEN 5
            ELSE 0 
            END ) AS matches
        FROM (SELECT * FROM contacts WHERE first_user_id = '${userId}') AS contacts
        RIGHT JOIN users ON contacts.second_user_id = users.id
        RIGHT JOIN countries ON users.country_id = countries.id
        WHERE first_user_id = '${userId}' AND status='request waiting' AND gender = '${sex}' AND birthday BETWEEN '${to}' AND '${from}'
        OR first_user_id IS NULL AND gender = '${sex}' AND birthday BETWEEN '${to}' AND '${from}'
        ORDER BY matches DESC, distance
        LIMIT 11,1;
        `);
      newUser = userRaw[0][0];
      const photos = await db.execute(`SELECT image_url FROM photos WHERE user_id='${userId}'`);
      newUser.photos = photos[0].map((photo) => photo.image_url);
      if (newUser.languages) {
        newUser.languages = newUser.languages.split(', ');
      } else {
        newUser.languages = [];
      }
      if (newUser.interests) {
        newUser.interests = newUser.interests.split(', ');
      } else {
        newUser.interests = [];
      }
      if (newUser.country_id) {
        const countryName = await db.execute(`SELECT title_${lng.toLowerCase()} FROM countries WHERE id='${newUser.country_id}';`);
        newUser.country = countryName[0][0][`title_${lng.toLowerCase()}`];
      }
    }
    res.status(201).json({
      newUser,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};
