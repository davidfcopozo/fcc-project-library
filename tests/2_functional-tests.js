/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let testId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done) {
    chai.request(server)
      .get('/api/books')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', () => {

      test('Test POST /api/books with title', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({ title: "From test" })
          .end((err, res) => {
            testId = res.body._id
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book object should contain title');
            assert.property(res.body, '_id', 'Book object should contain _id');
            done();
          })
      });

      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
          .post('/api/books')
          .send({ title: "" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });

    });

    suite('GET /api/books => array of books', () => {

      test('Test GET /api/books', (done) => {
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });

      });
    });

    suite('GET /api/books/[id] => book object with [id]', () => {

      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai.request(server)
          .get('/api/books/64fa05b2943e38f307a70a40')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .get(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an array');
            assert.property(res.body, 'comments', 'Books in object should contain comments');
            assert.property(res.body, 'title', 'Books in object should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });

      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', () => {

      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
          .post(`/api/books/${testId}`)
          .send({ comment: "Test from test" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an array');
            assert.property(res.body, 'comments', 'Books in object should contain comments');
            assert.property(res.body, 'commentcount', 'Books in object should contain commentcount');
            assert.property(res.body, 'title', 'Books in object should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', (done) => {
        chai.request(server)
          .post(`/api/books/${testId}`)
          .send({ comment: "" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', (done) => {
        chai.request(server)
          .post('/api/books/64fa05b2943e38f307a70a40')
          .send({ comment: "dsadsa" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });

      });
    });


    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
          .delete(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', (done) => {
        chai.request(server)
          .delete('/api/books/64fa05b2943e38f307a70a40')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });
  });

});
