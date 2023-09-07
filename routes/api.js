/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const {getBooks, getBookById, addBook, deleteAllBooks, addComment, deleteBookById} = require('./bookController.js') 

module.exports = function (app) {
  app.route('/api/books')
    .get(getBooks)
    .post(addBook)
    .delete(deleteAllBooks);

  app.route('/api/books/:id')
    .get(getBookById)
    .post(addComment)
    .delete(deleteBookById);
};
