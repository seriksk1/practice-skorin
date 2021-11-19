const Student = require("../models/student-model");
const { QueryError } = require("../helpers/errorHandler");
const { HTTP_STATUS } = require("../constants");

const createStudent = async (student) => {
  try {
    return await Student.create({
      ...student,
      photo: `https://robohash.org/${student.name}_${student.group}`,
    });
  } catch (err) {
    throw new QueryError(HTTP_STATUS.NOT_FOUND, "Student not created!");
  }
};

const updateStudent = async (student) => {
  try {
    return await Student.findByIdAndUpdate(student._id, student, { new: true });
  } catch (err) {
    throw new QueryError(HTTP_STATUS.NOT_FOUND, "Student not updated!");
  }
};

const deleteStudent = async (id) => {
  try {
    await Student.findByIdAndDelete(id);
  } catch (err) {
    throw new QueryError(HTTP_STATUS.NOT_FOUND, "Student not deleted!");
  }
};

const getStudentByName = async (name) => {
  try {
    return await Student.findOne({ name });
  } catch (err) {
    throw new QueryError(HTTP_STATUS.NOT_FOUND, "StudentByName not found!");
  }
};

const getStudentById = async (id) => {
  try {
    return await Student.findById(id);
  } catch (err) {
    throw new QueryError(HTTP_STATUS.NOT_FOUND, "StudentById not found!");
  }
};

const getStudents = async () => {
  try {
    return await Student.find({});
  } catch (err) {
    throw new QueryError(HTTP_STATUS.NOT_FOUND, "Students not found!");
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
