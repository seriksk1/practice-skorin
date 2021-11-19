const StudentService = require("../services/student-service");
const { HTTP_STATUS } = require("../constants");

const createStudent = async (req, res, next) => {
  try {
    const body = req.body;
    const newStudent = await StudentService.createStudent(body);
    res.status(HTTP_STATUS.CREATED).json(newStudent);
  } catch (err) {
    next(err);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const body = req.body;
    const updatedStudent = await StudentService.updateStudent(body);
    res.status(HTTP_STATUS.OK).json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await StudentService.deleteStudent(id);
    res.status(HTTP_STATUS.OK).json({
      message: "Student deleted!",
    });
  } catch (err) {
    next(err);
  }
};

const getStudentByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const student = await StudentService.getStudentByName(name);
    res.status(HTTP_STATUS.OK).json(student);
  } catch (err) {
    next(err);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id);
    res.status(HTTP_STATUS.OK).json(student);
  } catch (err) {
    next(err);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const students = await StudentService.getStudents();
    res.status(HTTP_STATUS.OK).json(students);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentByName,
  getStudents,
};
