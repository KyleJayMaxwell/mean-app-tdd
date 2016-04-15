var express = require('express');
var router = express.Router();
var Student = require('../models/students');

// GET ALL students
router.get('/', function(req, res, next) {
  Student.find({})
    .then(function(students){
      res.status(200).json({
        status: 'success',
        data: students
      })
    })
    .catch(function(err) {
      return next(err);
    });
  // Student.find({}, function(err, students) {
  //   if(err) {
  //     return next(err);
  //   }
  //   res.status(200).json({
  //     status: 'success',
  //     data: students
  //   });
  // });
});

module.exports = router;