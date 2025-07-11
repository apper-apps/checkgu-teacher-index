import studentData from "@/services/mockData/students.json";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

let students = [...studentData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id), 0) + 1,
      attendanceRate: Math.floor(Math.random() * 20) + 80, // Random attendance 80-100%
      overallGrade: "B+"
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay(300);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(200);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
return true;
  },

  async importStudents(file, onProgress) {
    await delay(500);
    
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const importedStudents = [];
            const skippedStudents = [];
            let processed = 0;
            
            for (const row of results.data) {
              // Check if student already exists
              const existingStudent = students.find(s => 
                s.studentId === row.studentId || 
                (s.name === row.name && s.guardianEmail === row.guardianEmail)
              );
              
              if (existingStudent) {
                skippedStudents.push(row);
              } else {
                const newStudent = {
                  Id: Math.max(...students.map(s => s.Id), 0) + 1,
                  name: row.name,
                  studentId: row.studentId,
                  classId: parseInt(row.classId),
                  className: row.className || `Class ${row.classId}`,
                  guardianName: row.guardianName,
                  guardianPhone: row.guardianPhone,
                  guardianEmail: row.guardianEmail,
                  attendanceRate: Math.floor(Math.random() * 20) + 80,
                  overallGrade: "B+",
                  notes: row.notes || ""
                };
                
                students.push(newStudent);
                importedStudents.push(newStudent);
              }
              
              processed++;
              const progress = Math.round((processed / results.data.length) * 100);
              onProgress(progress);
              
              await delay(50); // Simulate processing time
            }
            
            resolve({
              imported: importedStudents.length,
              skipped: skippedStudents.length,
              total: results.data.length
            });
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        }
      });
    });
  },

  async exportStudentsCSV(studentsData) {
    await delay(300);
    
    const csvData = studentsData.map(student => ({
      name: student.name,
      studentId: student.studentId,
      className: student.className,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      guardianEmail: student.guardianEmail,
      attendanceRate: student.attendanceRate,
      overallGrade: student.overallGrade,
      notes: student.notes || ""
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  async exportStudentsPDF(studentsData) {
    await delay(400);
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Student Performance Report", 20, 20);
    
    // Add generation date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Prepare table data
    const tableColumns = [
      "Name", "Student ID", "Class", "Guardian", "Attendance", "Grade", "Notes"
    ];
    
    const tableRows = studentsData.map(student => [
      student.name,
      student.studentId,
      student.className,
      student.guardianName,
      `${student.attendanceRate}%`,
      student.overallGrade,
      student.notes || "N/A"
    ]);
    
    // Add table
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [74, 144, 226],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });
    
    // Save the PDF
    doc.save(`students_report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};