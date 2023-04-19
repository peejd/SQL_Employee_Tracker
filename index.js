const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
var roleId

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: ',m2^Yh-9?f_3G',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

const initialPrompt = [
    {
        type: 'list',
        name: 'wywd',
        message: 'What do you want to do?:',
        choices: ['View All Employees','Add Employee','Update Employee Role','View All Roles','Add Role','View All Departments','Add Department','Quit']
    }
]

const addEmplPrompt = [
  {
    type: 'input',
    name: 'empfirst',
    message: 'Enter their first name:'
  },
  {
    type: 'input',
    name: 'emplast',
    message: 'Enter their last name:'
  },
  {
    type: 'input',
    name: 'emprole',
    message: 'Enter their job title:'
  },
  {
    type: 'input',
    name: 'empmgrfirst',
    message: 'Enter the first name of their manager:'
  },
  {
    type: 'input',
    name: 'empmgrlast',
    message: 'Enter the last name of their manager:'
  }
]

const addRolePrompt = [
  {
    type: 'input',
    name: 'role',
    message: 'What is the name of the role?'
  },
  {
    type: 'input',
    name: 'salary',
    message: 'What is the salary for this role?'
  },
  {
    type: 'input',
    name: 'dept',
    message: 'What is the department for this role?'
  }
]

const addDeptPrompt = [
  {
    type: 'input',
    name: 'dept',
    message: 'What is the name of the department?'
  }
]

const updateEmplPrompt = [
  {
    type: 'input',
    name: 'empfirst',
    message: 'What is the first name of the employee?'
  },
  {
    type: 'input',
    name: 'emplast',
    message: 'What is the first name of the employee?'
  },
  {
    type: 'input',
    name: 'emprole',
    message: 'What is their new role?'
  }
]

function runInquirer () {

  inquirer.prompt(initialPrompt)
    .then((answers) => {
      if    
        (answers.wywd == 'View All Employees') {
          db.query('SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, m.first_name AS manager_first, m.last_name AS manager_last FROM employee e JOIN role r ON r.id = e.role_id JOIN department d ON d.id = r.department_id JOIN employee m ON e.manager_id = m.id ORDER BY e.id', function (err, results) {
          console.table(results);
          runInquirer();
          });
        }
      else if
        (answers.wywd == 'View All Roles') {
          db.query('SELECT * FROM role', function (err, results) {
          console.table(results);
          runInquirer();
          });
        }
      else if
        (answers.wywd == 'View All Departments') {
          db.query('SELECT * FROM department', function (err, results) {
          console.table(results);
          runInquirer();
          });
        }
      else if
        (answers.wywd == 'Add Employee') {
          inquirer.prompt(addEmplPrompt)
          .then((answers) => {
            db.promise().query('SELECT id FROM role WHERE title = ?', answers.emprole, function (err, results) {
            }).then( ([rows,fields]) => {
              roleId = rows[0].id;
              db.promise().query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [answers.empmgrfirst,answers.empmgrlast], function (err, results) {
              }).then( ([rows,fields]) => {
                mgrId = rows[0].id;
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [answers.empfirst, answers.emplast, roleId,mgrId], function (err, results) {
                  if (err) {
                    console.log('Please ensure you have entered valid information and try again')
                    }
                  else {console.log('Employee Added!')};
                runInquirer();
                })
            })
          });
          })
        }
      else if
        (answers.wywd == 'Add Role') {
          inquirer.prompt(addRolePrompt)
          .then((answers) => {
            db.promise().query('SELECT id FROM department WHERE name = ?', answers.dept, function (err, results) {
            }).then( ([rows,fields]) => {
              deptId = rows[0].id;
              db.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)', [answers.role, answers.salary, deptId], function (err, results) {
                if (err) {
                  console.log('Please ensure you have entered valid information and try again')
                }
                else {console.log('Role Added!')};
              runInquirer();
            })
          });
          })
        }
      else if
        (answers.wywd == 'Add Department') {
          inquirer.prompt(addDeptPrompt)
          .then((answers) => {
            db.query('INSERT INTO department (name) VALUES (?)', answers.dept, function (err, results) {
              if (err) {
                console.log('Please ensure you have entered valid information and try again')
              }
              else {console.log('Department Added!')};
            runInquirer();
            });
          })
        }
        else if
        (answers.wywd == 'Update Employee Role') {
          inquirer.prompt(updateEmplPrompt)
          .then((answers) => {
            db.promise().query('SELECT id FROM role WHERE title = ?', answers.emprole, function (err, results) {
            }).then( ([rows,fields]) => {
              roleId = rows[0].id;
            db.query('UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?', [roleId, answers.empfirst, answers.emplast], function (err, results) {
              if (err) {
                console.log('Please ensure you have entered valid information and try again')
              }
              else {console.log('Employee Role Updated!')};
              runInquirer();
            })
          });
          })
        }
        else if
        (answers.wywd == 'Quit') {
          process.exit();
        }
    })
};

runInquirer();