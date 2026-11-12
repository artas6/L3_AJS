const https = require('https');

const BASE = 'https://jsonplaceholder.typicode.com';

function getData(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (response) {
      let data = '';

      response.on('data', function (part) {
        data = data + part;
      });

      response.on('end', function () {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', function (error) {
      reject(error);
    });
  });
}

function getUsers() {
  return getData(BASE + '/users').then(function (users) {
    const shortUsers = users.map(function (user) {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone
      };
    });

    return shortUsers;
  });
}

function getUncompletedTodos() {
  return getData(BASE + '/todos').then(function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed;
    });
  });
}

getUsers()
  .then(function (users) {
    console.log('Пользователи:', users.slice(0, 3));
  })
  .catch(function (error) {
    console.log(error);
  });

getUncompletedTodos()
  .then(function (todos) {
    console.log('Невыполненные задачи:', todos.slice(0, 3));
  })
  .catch(function (error) {
    console.log(error);
  });
