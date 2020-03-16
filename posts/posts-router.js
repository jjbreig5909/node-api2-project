const express = require('express');
const Posts=require('../data/db.js');

const router = express.Router();

router.get('/', (req,res) =>{
    console.log(req.query);
    Posts.find(req.query)
    .then(posts=>{
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message:'Error getting the posts',
        });
    });
});

router.get('/:id', (req,res)=>{
    Posts.findById(req.params.id)
        .then(post=>{
            if(post) {
                res.status(200).json(post);
            }
            else{
                res
                  .status(404)
                  .json({
                    message: "The post with the specified ID does not exist."
                  });
            }
        })
        .catch(error=>{
            res.status(500).json({
                error: "The post information could not be retrieved"
            });
        });
});

router.get('/:id/comments', (req, res)=>{
    Posts.findPostComments(req.params.id)
        .then(comments=>{
            if(comments){
                res.status(200).json(comments)
            }
            else{
                res
                  .status(404)
                  .json({
                    message: "The post with the specified ID does not exist."
                  });
            }
        })
})


router.post('/', (req,res)=>{
    const postContent=req.body;
    if(postContent.title&&postContent.contents){
        Posts.insert(postContent)
        .then(post=>{
            res.status(201).json(post);
        })
        .catch(error=>{
            res.status(500).json({
              error: "There was an error while saving the post to the database"
            });
        });
    }
    else{
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
});

router.post('/:id/comments', (req,res)=>{
    const commentContent=req.body;
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
        if(commentContent.text){
            Posts.insertComment(commentContent)
            .then(comment=>{
                res.status(201).json(comment);
            });
        }
        else{res
               .status(400)
               .json({
                 errorMessage: "Please provide test for the comment."
               });}
        } else {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        });
        }
    })
    .catch(error=>{
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        })
    }
    );
});


module.exports=router;