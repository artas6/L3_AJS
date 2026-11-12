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

function sortPosts(posts) {
  return posts.sort(function (a, b) {
    return b.title.length - a.title.length;
  });
}

function sortComments(comments) {
  return comments.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function selectUserFields(users) {
  return users.map(function (user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone
    };
  });
}

function selectUncompletedTodos(todos) {
  return todos.filter(function (todo) {
    return !todo.completed;
  });
}

async function getSortedPosts() {
  const posts = await getData(BASE + '/posts');
  return sortPosts(posts);
}

async function getSortedComments() {
  const comments = await getData(BASE + '/comments');
  return sortComments(comments);
}

async function getUsers() {
  const users = await getData(BASE + '/users');
  return selectUserFields(users);
}

async function getUncompletedTodos() {
  const todos = await getData(BASE + '/todos');
  return selectUncompletedTodos(todos);
}

async function main() {
  try {
    const posts = await getSortedPosts();
    const comments = await getSortedComments();
    const users = await getUsers();
    const todos = await getUncompletedTodos();

    console.log('Посты:', posts.slice(0, 3));
    console.log('Комментарии:', comments.slice(0, 3));
    console.log('Пользователи:', users.slice(0, 3));
    console.log('Невыполненные задачи:', todos.slice(0, 3));
  } catch (error) {
    console.log(error);
  }
}

main();
