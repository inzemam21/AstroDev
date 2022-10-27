
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/Bootcamp')
const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')

//@desc    Get all Coursee
//@route   GET /api/v1/courses
//@route   GET /api/v1/bootcamps/courses/:bootcampid/courses
//@access  Public
exports.getCourses =asyncHandler(async (req, res, next) => {

  //Select Fields
  if(req.params.bootcampId) {
     const courses = Course.find({bootcamp: req.params.bootcampId})
    res.status(200).json({success: true, data: courses})
  } else {
    res.status(200).json(res.advancedResults)
  }
   
})

//@desc    Get single Course
//@route   GET /api/v1/courses/:id
//@access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {

        const course = await Course.findById(req.params.id).populate({
            path: 'bootcamp',
            select: 'name description'
        })
    
        if(!course){
            return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true, data: course
        })
      
    })

//@desc    Create new Course
//@route   POST /api/v1/bootcamps/:bootcampId/courses
//@access  Private
exports.createCourse =asyncHandler( async (req, res, next) => {
req.body.bootcamp = req.params.bootcampId
const bootcamp = await Bootcamp.findById(req.params.bootcampId)

if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcamId}`, 404))
}


 //make sure user user is bootcamp owner
 if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp`))
}

const course = await Course.create(req.body)
res.status(200).json({
    success: true, data: course
})
   
})

//@desc    Create new courses
//@route   PUT /api/v1/courses/:id
//@access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

        let course = await Course.findById(req.params.id)

        if(!course){
            return res.status(400).json({ msg: "Not Found"}) 
        }

        //make sure user user is bootcamp owner
 if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course`))
}
    
        course = await Course.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true

        })
        res.status(200).json({
            success: true,
            data: course
        })
      
})

//@desc    Create new Bootcamp
//@route   Delete /api/v1/bootcamps/:id
//@access  Private
exports.deleteCourse =asyncHandler(async (req, res, next) => {
 
        const course = await Course.findById(req.params.id)

        if(!course){
            return res.status(400).json({ msg: "Not Found"}) 
        }

        //make sure user user is bootcamp owner
 if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete a course from bootcamp`))
}
    
        res.status(200).json({
            success: true,
            data: {}
        })
      
})

//@desc    Get bootcamps within a radius
//@route   Delete /api/v1/bootcamps/radius/:zipcode/:distance
//@access  Private
exports.getBootcampsRadius =asyncHandler(async (req, res, next) => {
 
    const {zipcode, distance} = req.params

    //get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //calc radius using radius
    //divides dist by the radius of earth
    //earth radius = 3963 
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [ [lng, lat], radius]}}
    })


    res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
    })
  
})