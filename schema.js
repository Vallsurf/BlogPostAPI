"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a restaurant
const blogPostSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    firstName: String,
    lastName: String,

  }

});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the address object
// we're storing in Mongo.
blogPostSchema.virtual("nameString").get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

// // this virtual grabs the most recent grade for a restaurant.
// restaurantSchema.virtual("recentPost").get(function() {
//   const postObj =
//     this.grades.sort((a, b) => {
//       return b.date - a.date;
//     })[0] || {};
//   return gradeObj.grade;
// });

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.nameString
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Posts = mongoose.model("Posts", blogPostSchema);

module.exports = { Posts };
