const express = require('express');

const router = express.Router();
router.use(express.json());

const db = require('./userDb');
const pdb = require('../posts/postDb');


router.post('/', validateUser, (req, res) => {
    const newuser = req.body;
    // console.log(newuser)
    db.insert(newuser)
    .then(user => {
        res.status(201).json({ success: true, message: `${newuser.name} added successfully!`, user })
    })
    .catch(err => {
        res.status(500).json({ success: false, message: 'bummer...', err })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const newpost = req.body;
    // console.log(newpost);
    pdb.insert({...newpost, user_id: req.params.id})
    .then(post => {
        res.status(201).json({ success: true, message: `${newpost.text} added successfully!`, post })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ success: false, message: 'bummer...', err })
    })
});

//calling find returns a promise that resolves to an array of all the resources contained in the database.
router.get('/', (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json({ success: true, message: 'Users located!', users })
    })
    .catch(err => {
        res.status(400).json({ success: false, err, message: 'No users here mate!' })
    })
});

router.get('/:id', validateUserId, (req, res) => {
    // console.log(req.user)
    const userfound = req.user
    res.status(200).json({ success: true, message: `${userfound.name} located!`, userfound })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    db.getUserPosts(req.params.id)
    .then(posts => {
        res.status(200).json({ success: true, message: 'Posts located!', posts })
    })
    .catch(err => {
        res.status(400).json({ success: false, err, message: 'No posts here mate!' })
    })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params
    db.remove(id)
    .then(deleted => {
        if(deleted) {
            // console.log(deleted)
            res.status(204).end()
        } else {
            res.status(404).json({ success: false, message: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ success: false, message: "The user could not be removed", err })
    })
});

router.put('/:id', validateUserId, (req, res) => {
    console.log(req.params)
    const { id } = req.params
    const changes = req.body
    db.update(id, changes)
    .then(updated => {
        if(updated){
            res.status(200).json({ success: true, message: `${updated} completed successfully!`, updated })
        }else{
            res.status(404).json({ success: false, message: 'no user found' })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ success: false, message: 'no such luck', err })
    })
});

//custom middleware

function validateUserId(req, res, next) {
    if(req.params && req.params.id) {
        // console.log(req.params)
        db.getById(req.params.id)
        .then(user => {
            if(user){
            req.user = user 
            next()
            }else{
                res.status(400).json({ message: 'Invalid user id!' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'unknown server error validating id', err })
        })
    }
} 

function validateUser(req, res, next) {
    // console.log('im in validateUser')
    if(!req.body){
        res.status(400).json({ message: 'Missing user data' })
    }else if(!req.body.name){
        res.status(400).json({ message: 'Missing required name field' })
    }else{
        next();
    }
};

function validatePost(req, res, next) {
    console.log('inside validatePost')
    const reqbody = Object.keys(req.body).length
    if(!reqbody){
        res.status(400).json({ message: 'Missing post data' })
    }else if(!req.body.text){
        res.status(400).json({ message: 'Missing required text field' })
    }else{
        next();
    }
};

module.exports = router;
