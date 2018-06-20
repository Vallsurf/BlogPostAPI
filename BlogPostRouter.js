const express = require('express');
const morgan = require ('morgan');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models.js'); 

BlogPosts.create('Hello World!','This is the blog post content!', 'By Val Singhal', 'Published May 5th');
BlogPosts.create('Another Hello World!','This is another post !', 'By Val Singhal', 'Published May 7th'); 

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});


router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate']; 
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i]; 
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message); 
			return res.status(400).send(message); 
		}
	}

	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate); 
	return res.status(201).json(post); 

});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate', 'id']; 
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i]; 
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message); 
			return res.status(400).send(message); 
		}
	}

	if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating Blog Post \`${req.params.id}\``);
  BlogPosts.update({
  	id: req.params.id, 
  	title: req.body.title, 
  	content: req.body.content,
  	author: req.body.author, 
  	publishDate: req.body.publishDate 

  });
  res.status(204).end(); 

});


router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id); 
	console.log(`Deleted BlogPost \`${req.params.ID}\``);
	res.status(204).end(); 
});




module.exports = router;