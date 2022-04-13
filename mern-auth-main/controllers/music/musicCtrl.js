const mongoose = require("mongoose");
const music = require("../../models/music");
const User = require("../../models/userModel");

const multer = require('multer');
const { GridFSBucket } = require('mongodb')
const { Readable } = require('stream');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const { getConnection } = require('./getConnexion')

const musicCtrl = {

    //webscrapping
    //fetechMusic: async (req, res) => {},

    likeMusic: async (req, res) => { 
        let x = mongoose.Types.ObjectId(req.params.userId);
        const user = await User.findById(req.params.userId)
        if (!user) {
            res.status(400).json({ msg: "User does not exist." });
        }
        music.findByIdAndUpdate(req.params.musicId, { $push: { likes: x } }, { new: true },
            (err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                }
            })
        return res.status(200).json({ msg: "success!" });
    },
    dislikeMusic: async (req, res) => { 
        let x = mongoose.Types.ObjectId(req.params.userId);
        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(400).json({ msg: "User does not exist." });
        }
        music.findByIdAndUpdate(req.params.musicId, {$push:{dislikes: x } },{ new: true },
            (err, result) => {
                if (err) {
                    return res.status(422).json({ error: err })
                }
            })
        return res.status(200).json({ msg: "success!" });
    },

    fetechMusicByName: async (req, res) => { 
      
        try {
              music.find({ name:"awel-test"}).find(null, function (err, musika) {
                var trackID = mongoose.Types.ObjectId(musika[0].mp3);
                res.set('content-type', 'audio/mp3');
                res.set('accept-ranges', 'bytes');
                const db = getConnection();
      
                let bucket = new mongodb.GridFSBucket(db, {
                  bucketName: 'tracks'
                });
                let downloadStream = bucket.openDownloadStream(trackID);
        
                downloadStream.on('data', (chunk) => {
                    res.write(chunk);
                });
                
                downloadStream.on('error', () => {
                    res.sendStatus(404);
                });
                
                downloadStream.on('end', () => {
                    res.end();
                });
                console.log(musika);
            });
              
            

          } catch(err) {
            return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
          }
          
    },
    DownloadMusic: async (req, res) => { 
        // var result = await music.findOne({  filename:req.params.trackName });
        // console.log(resul)    
        try {
             
              var trackID = new ObjectID(req.params.trackID);
            } catch(err) {
              return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
            }
            res.set('content-type', 'audio/mp3');
            res.set('accept-ranges', 'bytes');
            const db = getConnection();

            let bucket = new mongodb.GridFSBucket(db, {
              bucketName: 'tracks'
            });
          
            let downloadStream = bucket.openDownloadStream(trackID);
          
            downloadStream.on('data', (chunk) => {
              res.write(chunk);
            });
          
            downloadStream.on('error', () => {
              res.sendStatus(404);
            });
          
            downloadStream.on('end', () => {
              res.end();
            });
    },
    UploadMusic: async (req, res) => {

        try {


            const storage = multer.memoryStorage()
            const upload = multer({ storage: storage, limits: { fields: 6, fileSize: 6000000, files: 6, parts: 6 } });
            upload.single('track')(req, res, (err) => {
                if (err) {
                    return res.status(400).json({ message: "Upload Request Validation Failed" });
                } else if (!req.body.name) {
                    return res.status(400).json({ message: "No track name in request body" });
                }

                let trackName = req.body.name;

                // Covert buffer to Readable Stream
                const readableTrackStream = new Readable();
                readableTrackStream.push(req.file.buffer);
                readableTrackStream.push(null);
                const db = getConnection();

                let bucket = new mongodb.GridFSBucket(db, {
                    bucketName: 'tracks',
                });

                let uploadStream = bucket.openUploadStream(trackName);
                this.id = uploadStream.id;
                // console.log(this.id)
                const newMusic = new music({
                    name:req.body.name,
                    artistName: req.body.artistName,
                    genre: req.body.genre,
                    duration: req.body.duration,
                    description: req.body.description,
                    mp3:mongoose.Types.ObjectId(uploadStream.id)
                });
                newMusic.save();
                res.json({
                    msg: "music added !",
    
                    music: { 
                        ...newMusic._doc,
                    }
                });
                readableTrackStream.pipe(uploadStream);

            });
            




            
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }


}; module.exports = musicCtrl;
