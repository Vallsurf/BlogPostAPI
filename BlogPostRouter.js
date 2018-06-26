const express = require('express');
const morgan = require ('morgan');
const router = express.Router();
const mongoose = require("mongoose");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//const {BlogPosts} = require('./models.js'); 
const { Posts } = require("./schema");
mongoose.Promise = global.Promise;

// BlogPosts.create('Hello World!','This is the blog post content!', 'By Val Singhal', 'Published May 5th');
// BlogPosts.create('Another Hello World!','This is another post !', 'By Val Singhal', 'Published May 7th'); 

router.get('/', (req, res) => {
      Posts
        .find()
        .then(posts => {
        	res.json({
           		blogposts: posts.map(
           			(post) => post.serialize())
           			});
           	}
           )
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
        });
});

router.get('/:id', (req, res) => {
      Posts
        .findById(req.params.id)
    	.then(posts => res.json(posts.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
        });
});


router.post('/', (req, res) => {
	const requiredFields = ['title', 'content', 'author']; 
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i]; 
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message); 
			return res.status(400).send(message); 
		}
	}

	Posts.create({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  })
	.then(post => res.status(201).json(post.serialize()))
	.catch(err => {
		console.error(err);
		res.status(500).json({ message: "Internal Server Error"});
	});

	// const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate); 
	// return res.status(201).json(post); 

});


router.put('/:id', (req, res) => {
	  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ["title", "author", "content"];	

	updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Posts
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});
	

router.delete('/:id', (req, res) => {
	const message = `Deleted Blogpost ${req.params.id}`; 
	Posts.findByIdAndRemove(req.params.id)
	.then(post => res.status(400).json({message: message}))
	.catch(err => res.status(500).json({ message: "Internal server error" }));
});




module.exports = router;