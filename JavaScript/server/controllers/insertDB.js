const express = require('express');

const  Post = require('../models/post'); // Import model


function insertTag(req, data){

    console.log(data);
    Post.save(
        {
            handle: req.body.handle,
            link: req.body.link,
            text: req.body.text,
            tags: data  
        },
        (errorInCreation) => {
            if (errorInCreation) {
              console.log(errorInCreation);
              res.json({ message: 'Database error. Failed to create user.' });
            } else {
            
                res.json({ message: 'Post added' });
            }
        },
    );
}

module.exports = {insertTag};