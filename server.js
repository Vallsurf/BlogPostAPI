const express = require('express'); 

const morgan = require ('morgan');

const app = express (); 

const blogPostRouter = require('./BlogPostRouter');

app.use(morgan('common')); 
app.use(express.json()); 

app.use('/BlogPosts', blogPostRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});