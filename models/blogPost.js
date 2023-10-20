const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: () => Date.now(),
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: () => Date.now()
    },
    state: {
      type: String,
      required: true
    },
    read_count: {
      type: Number,
      required: true
    },
    reading_time: {
      type: String,
      required: true
    },
    published: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: String,
      required: true
    }
  }
);

module.exports = mongoose.model('Post', postSchema);