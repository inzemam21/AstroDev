const express = require('express')
const router = express.Router()
const advancedResults = require('../middleware/advancedMiddleware')
const {getBootcamp, getBootcamps, deleteBootcamp, 
updateBootcamp, createBootcamp, getBootcampsRadius, bootcampPhotoUpload} = require('../controllers/bootcamps')
const CourseRouter = require('./courses')
const Bootcamp = require('../models/Bootcamp')
const { protect, authorize } = require('../middleware/auth')

router.use('/:bootcampId/courses', CourseRouter)

router.route('/:id/photo').put( protect,authorize('publisher', 'admin'), bootcampPhotoUpload)
router.route('/radius/:zipcode/:distance').get(getBootcampsRadius)

router.route('/')
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
     .post(protect,authorize('publisher', 'admin'),createBootcamp)

router.route('/:id')
       .get(getBootcamp)
        .put(protect,authorize('publisher', 'admin'),updateBootcamp)
         .delete(protect,authorize('publisher', 'admin'),deleteBootcamp)

module.exports = router