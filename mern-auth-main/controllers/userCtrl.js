const User = require("../models/userModel");
const mongoose = require("mongoose");

const userCtrl = {

   
    follow: async (req, res, next) => {
        let x = mongoose.Types.ObjectId(req.params.follwingid);
        User.findByIdAndUpdate(req.params.followId, { $push: { following: x } }, { new: true },
            (err, result) => {
                if (err) {

                    return res.status(422).json({ error: err })
                }
            })
        User.findByIdAndUpdate(x, { $push: { followers: req.params.followId } }, { new: true },
            (err, result) => {
                if (err) {

                    return res.status(422).json({ error: err })
                }
            })
        return res.status(200).json({ msg: "success!" });
    },

    unfollow: async (req, res, next) => {
        let x = mongoose.Types.ObjectId(req.params.follwingid);
        User.findByIdAndUpdate(req.params.followId, { $pull: { following: x } }, { new: true },
            (err, result) => {
                if (err) {

                    return res.status(422).json({ error: err })
                }
            })
        User.findByIdAndUpdate(x, { $pull: { followers: req.params.followId } }, { new: true },
            (err, result) => {
                if (err) {

                    return res.status(422).json({ error: err })
                }
            })
        return res.status(200).json({ msg: "success!" });
    },

    getFollowers: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) {
                res.status(400).json({ msg: "User does not exist." });
            }

            const followers = await Promise.all(
                user.followers.map((followerId) => {
                    return User.findById(followerId);
                })
            );
            let friendList = [];
            followers.map((follower) => {
                const { _id, username } = follower;
                friendList.push({ _id, username });
            });

            res.status(200).json(friendList)
        } catch (err) {
            res.status(500).json(err.message);
        }
    },
    desactivate: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) {
                res.status(400).json({ msg: "User does not exist." });
            }

            else {
                user.delete();
                res.status(200).json("Account has been deleted");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },

    getFollowing: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user) {
                res.status(400).json({ msg: "User does not exist." });
            }
            const following = await Promise.all(
                user.following.map((followerId) => {
                    return User.findById(followerId);
                })
            );


            let friendList = [];
            following.map((follows) => {
                const { _id, username } = follows;
                friendList.push({ _id, username });
            });

            res.status(200).json(friendList)
        } catch (err) {
            res.status(500).json(err.message);
        }
    },

}; module.exports = userCtrl;
