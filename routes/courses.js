const express = require('express')
const router = express.Router({mergeParams: true})
const {getCourses, getCourse, createCourse, updateCourse, deleteCourse} = require('../controllers/courses')
const advancedResults = require('../middleware/advancedMiddleware')
const { protect, authorize } = require('../middleware/auth')
const Course = require('../models/Course')

router.route('/').get(advancedResults(Course,{
    path: 'bootcamp',
    select: 'name description'
} ),getCourses).post(protect,authorize('publisher', 'admin'),createCourse)



router.route('/:id')
.get(getCourse)
.put(protect,authorize('publisher', 'admin'),updateCourse).delete(protect,authorize('publisher', 'admin'),deleteCourse)
//router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router