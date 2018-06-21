const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Recipes List', function() {

  before(function() {
    return runServer();
  });


  after(function() {
    return closeServer();
  });

  it('it should get current blog posts', function() {
    return chai.request(app)
      .get('/Blogposts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        // because we create three items on app load
        expect(res.body.length).to.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  it('should add a blogpost on POST', function() {
    const newPost = {
    	title: 'testpost', 
    	content: 'more content', 
    	author: 'authoris',
    	publishDate: 'today'
    };
    return chai.request(app)
      .post('/BlogPosts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
      });
  });


  it('should update items on PUT', function() {
    const updateData = {
      title: 'thisisnewtitle', 
      content: 'this is new content',
      author: 'im the author now',
      publishDate: 'newdate' 
    };

    return chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/BlogPosts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/BlogPosts/${updateData.id}`)
          .send(updateData);
      })
      // prove that the PUT request has right status code
      // and returns updated item
      .then(function(res) {
        expect(res).to.have.status(204);
        // expect(res).to.be.json;
        // expect(res.body).to.be.a('object');
        // expect(res.body).to.deep.equal(updateData);
      });
  });


  it('should delete items on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/BlogPosts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/BlogPosts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});