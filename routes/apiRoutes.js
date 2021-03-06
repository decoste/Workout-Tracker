const mongoose = require("mongoose");
const db = require("../models");

module.exports = function(app) {

    //GET last workout
    app.get("/api/workouts/", (req, res)=>{
        db.Workout.aggregate([
            {
                $addFields: {
                    totalDuration: {$sum : "$exercises.duration"}
                }
            },
        ]
        )
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
    });

     //POST a new workout
  app.post("/api/workouts", (req, res) => {
    db.Workout.create(req.body)
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => {
        res.json(err);
      });
  });


    //Add exercise
    app.put("/api/workouts/:id", (req, res) => {
        db.Workout.findOneAndUpdate(
            { _id: req.params.id },
            {
              $push: {
                exercises: [req.body],
              },
            }
          )
          .then((newWorkout) => {
            res.json(newWorkout);
          })
          .catch((err) => {
            res.json(err);
          });
      });
      

    //GET  duration of workout
    app.get("/api/workouts/range", (req, res)=>{
        db.Workout.aggregate([
            {
                $addFields: {
                    totalDuration: {$sum : "$exercises.duration"}
                }
            },
        ])
        .sort({_id:-1})
        .limit(7)
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
    });

};