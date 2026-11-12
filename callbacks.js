const https = require('https');

const BASE = 'https://jsonplaceholder.typicode.com';

function getData(url, callback) {
  https.get(url, function (response) {
    let data = '';

    response.on('data', function (part) {
      data = data + part;
    });

    response.on('end', function () {
      try {
        const result = JSON.parse(data);
        callback(null, result);
      } catch (error) {
        callback(error);
      }
    });
  }).on('error', function (error) {
    callback(error);
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

function getSortedPosts(callback) {
  getData(BASE + '/posts', function (error, posts) {
    if (error) {
      callback(error);
      return;
    }

    callback(null, sortPosts(posts));
  });
}

function getSortedComments(callback) {
  getData(BASE + '/comments', function (error, comments) {
    if (error) {
      callback(error);
      return;
    }

    callback(null, sortComments(comments));
  });
}

getSortedPosts(function (error, posts) {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Посты:', posts.slice(0, 3));
});

getSortedComments(function (error, comments) {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Комментарии:', comments.slice(0, 3));
});
