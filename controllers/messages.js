/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
const db = require('../util/database');
const io = require('../socket');

exports.main = async (req, res, next) => {
  try {
    const { userId, second_user_id } = req.body;
    console.log(req.body)
    if (second_user_id) {
      const test = await db.execute(`SELECT 
      first_user_id, second_user_id FROM contacts 
      WHERE first_user_id='${userId}' AND second_user_id='${second_user_id}';`);
      if (test[0].length === 0) {
        await db.execute(
          'INSERT INTO contacts (first_user_id, second_user_id, status) VALUES (?, ?, ?), (?, ?, ?)',
          [userId, second_user_id, 'request sent', second_user_id, userId, 'request waiting'],
        );
        await db.execute(
          'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
          [userId, second_user_id, 'request sent'],
        );
      }
    }
    const contacts = await db.execute(`SELECT
        first_user_id, second_user_id, contact_created_at, status, name, 
        avatar, online, last_online, MAX(message_id) AS message_contact,
        MAX(message_created_at) as date, 
        SUM (CASE WHEN sender_id = first_user_id THEN 0
          ELSE readed 
          END ) AS new_messages
        FROM contacts 
        LEFT JOIN users
        ON contacts.second_user_id = users.id
        Left JOIN messages
        ON contacts.first_user_id = messages.sender_id AND contacts.second_user_id = messages.receiver_id 
        OR contacts.second_user_id = messages.sender_id AND contacts.first_user_id = messages.receiver_id 
        WHERE first_user_id='${userId}' AND status='active'
        GROUP BY first_user_id, second_user_id
        ORDER BY date DESC;`);
    const ids = contacts[0].map((el) => el.message_contact).join(', ');
    if (ids.length > 0) {
      const messages = await db.execute(`SELECT message FROM messages WHERE message_id IN (${ids}) ORDER BY message_created_at DESC;`);
      for (let i = 0; i < contacts[0].length; i += 1) {
        contacts[0][i].last_message = messages[0][i].message;
      }
    }
    console.log(contacts[0])
    res.status(200).json({ contacts: contacts[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.messages = async (req, res, next) => {
  try {
    const { userId, second_user_id } = req.body;
    const messages = await db.execute(`SELECT * FROM messages 
    WHERE sender_id=${userId} AND receiver_id =${second_user_id} OR 
    sender_id=${second_user_id} AND receiver_id =${userId}
    ORDER BY message_created_at
    LIMIT 100;
    ;`);
    await db.execute(`UPDATE messages SET readed='0' WHERE receiver_id=${userId} AND sender_id=${second_user_id}`);
    res.status(200).json({ messages: messages[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.changestatus = async (req, res, next) => {
  try {
    const { first_user_id, second_user_id, newstatus } = req.body;
    await db.execute(`
    UPDATE contacts SET status='${newstatus}' 
    WHERE first_user_id='${first_user_id}' and second_user_id='${second_user_id}'`);
    await db.execute(`
    UPDATE contacts SET status='${newstatus}' 
    WHERE first_user_id='${second_user_id}' and second_user_id='${first_user_id}'`);
    let insertedMessage;
    if (newstatus === 'declined') {
      insertedMessage = await db.execute(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [first_user_id, second_user_id, 'requestDeclined'],
      );
    } else if (newstatus === 'active') {
      insertedMessage = await db.execute(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [first_user_id, second_user_id, 'requestAccepted'],
      );
    } else if (newstatus === 'blocked') {
      insertedMessage = await db.execute(
        'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
        [first_user_id, second_user_id, 'blocked'],
      );
    }
    const newMessage = await db.execute(`SELECT * FROM messages WHERE message_id=${insertedMessage[0].insertId};`);
    io.getIO().in(second_user_id).emit('new_msg', {
      action: 'create',
      message: { ...newMessage[0][0] },
    });
    res.status(200).json({ message: newMessage[0][0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.newmessage = async (req, res, next) => {
  try {
    const { sender_id, receiver_id, message } = req.body;
    const insertedMessage = await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message],
    );
    const newMessage = await db.execute(`SELECT * FROM messages WHERE message_id=${insertedMessage[0].insertId};`);
    io.getIO().in(receiver_id).emit('new_msg', {
      action: 'create',
      message: { ...newMessage[0][0] },
    });
    res.status(200).json({ message: newMessage[0][0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.filter = async (req, res, next) => {
  try {
    const { userId, filter } = req.body;
    let status = `AND status = '${filter}'`;
    let having = '';
    if (filter === 'all') status = '';
    if (filter === 'unread') {
      status = "AND status='active'";
      having = 'HAVING new_messages >= 1';
    }
    const contacts = await db.execute(`SELECT
    first_user_id, second_user_id, contact_created_at, status, name, 
    avatar, online, last_online, MAX(message_id) AS message_contact,
    MAX(message_created_at) as date, 
    SUM (CASE WHEN sender_id = first_user_id THEN 0
      ELSE readed 
      END ) AS new_messages
    FROM contacts 
    LEFT JOIN users
    ON contacts.second_user_id = users.id
    Left JOIN messages
    ON contacts.first_user_id = messages.sender_id AND contacts.second_user_id = messages.receiver_id 
    OR contacts.second_user_id = messages.sender_id AND contacts.first_user_id = messages.receiver_id 
    WHERE first_user_id='${userId}' ${status}
    GROUP BY first_user_id, second_user_id
     ${having}
    ORDER BY date DESC;`);
    const ids = contacts[0].map((el) => el.message_contact).join(', ');
    if (ids.length > 0) {
      const messages = await db.execute(`SELECT message FROM messages WHERE message_id IN (${ids}) ORDER BY message_created_at DESC;`);
      for (let i = 0; i < contacts[0].length; i += 1) {
        contacts[0][i].last_message = messages[0][i].message;
      }
    }
    res.status(200).json({ contacts: contacts[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};

exports.searchContacts = async (req, res, next) => {
  try {
    const { userId, searchValue } = req.body;
    const contacts = await db.execute(`SELECT
    first_user_id, second_user_id, contact_created_at, status, name, 
    avatar, online, last_online, MAX(message_id) AS message_contact,
    MAX(message_created_at) as date, 
    SUM (CASE WHEN sender_id = first_user_id THEN 0
      ELSE readed 
      END ) AS new_messages
    FROM contacts 
    LEFT JOIN users
    ON contacts.second_user_id = users.id
    Left JOIN messages
    ON contacts.first_user_id = messages.sender_id AND contacts.second_user_id = messages.receiver_id 
    OR contacts.second_user_id = messages.sender_id AND contacts.first_user_id = messages.receiver_id 
    WHERE first_user_id='${userId}'
    GROUP BY first_user_id, second_user_id
    HAVING name LIKE '%${searchValue}%'
    ORDER BY date DESC;`);
    const ids = contacts[0].map((el) => el.message_contact).join(', ');
    if (ids.length > 0) {
      const messages = await db.execute(`SELECT message FROM messages WHERE message_id IN (${ids}) ORDER BY message_created_at DESC;`);
      for (let i = 0; i < contacts[0].length; i += 1) {
        contacts[0][i].last_message = messages[0][i].message;
      }
    }
    res.status(200).json({ contacts: contacts[0] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message = 'networkProblems';
    }
    next(err);
  }
};
