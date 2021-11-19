const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/student-controller");

router.post("/student", StudentController.createStudent);
router.put("/student", StudentController.updateStudent);
router.delete("/student/:id", StudentController.deleteStudent);
router.get("/students/:id", StudentController.getStudentById);
router.get("/students/name/:name", StudentController.getStudentByName);
router.get("/students", StudentController.getStudents);

module.exports = router;
