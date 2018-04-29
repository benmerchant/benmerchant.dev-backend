// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Employee = require('../app/models/employee');
const Role = require('../app/models/role');

const chai = require('chai');
chai.use(require('chai-moment'));
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');

const server = require('../server');
const expect = require('chai').expect;


chai.use(chaiHttp);

// parent block
describe('Employees',() => {
  beforeEach((done) => { // empty db before each test
    // how will I be able to test for Mongoose dup_key errors on unique/indexed fields
    Employee.remove({},(err) => {
      if(err) console.error(err);
      done();
    });
  });
  // test the /GET route
  describe('/GET all employees', () => {
    it('it should GET all the employees', (done) => {
      chai.request(server)
          .get('/api/employees')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('employees');
            expect(res.body.employees).to.be.a('array');
            expect(res.body.employees.length).to.be.eql(0);
          done();
        });
    });
  });

  describe('/POST create Employee', () => {
    it('it should not POST an employee without login_number field - Mongoose', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('login_number');
            expect(res.body.error.errors.login_number).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST an employee if login_number contains non-numeric - Mongoose', (done) => {
      const employee = {
        login_number: 'letter',
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('login_number');
            expect(res.body.error.errors.login_number).to.have.property('kind').eql('Number');
          done();
        });
    });
    it('it should not POST an employee without first_name field - Mongoose', (done) => {
      const employee = {
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('first_name');
            expect(res.body.error.errors.first_name).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST an employee without email field - Mongoose', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('email');
            expect(res.body.error.errors.email).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST an employee without last_name field - express-validator', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors).to.have.property('last_name');
            expect(res.body.errors.last_name).to.have.property('msg').eql('Must enter a last name');
          done();
        });
    });
    // not testing (if PW exists, b/c we're checking length already)
    it('it should not POST an employee with password.length > 8 - express-validator', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: '1234567'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors).to.have.property('password');
            expect(res.body.errors.password).to.have.property('msg').eql('Password must be at least 8 characters');
          done();
        });
    });
    it('it should not POST an employee with password.length <= 24 - express-validator', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: '1234567812345678123456780'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errors');
            expect(res.body.errors).to.have.property('password');
            expect(res.body.errors.password).to.have.property('msg').eql('Password must be no more than characters');
          done();
        });
    });
    it('it should not POST an employee without ssn field - Mongoose', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        gender: 'Male',
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('ssn');
            expect(res.body.error.errors.ssn).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST an employee without gender field - Mongoose', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        display_name: 'Jon S',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('gender');
            expect(res.body.error.errors.gender).to.have.property('kind').eql('required');
          done();
        });
    });

    it('it should POST a new employee', (done) => {
      const employee = {
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Employee successfully added');
            expect(res.body).to.have.property('employee');
            expect(res.body.employee).to.have.property('first_name');
            expect(res.body.employee).to.have.property('middle_name');
            expect(res.body.employee).to.have.property('last_name');
            expect(res.body.employee).to.have.property('login_number');
            expect(res.body.employee).to.have.property('pin_num');
            expect(res.body.employee).to.have.property('ssn');
            expect(res.body.employee).to.have.property('gender');
            expect(res.body.employee).to.have.property('email');
            expect(res.body.employee).to.have.property('password');
            // test that password is hashing into something different
            expect(res.body.employee.password).to.not.be.eql(employee.password);
            // fields generated by the API
            expect(res.body.employee).to.have.property('display_name');
            expect(res.body.employee).to.have.property('hire_date');
            // trying to just test if hire_date is of type Date
            // so I'm testing if the current date is w/in 1 minute of employee being saved to db
            expect(res.body.employee.hire_date).to.be.sameMoment(new Date(), 'minute', 'test failed if hire_date equal to today');
          done();
        });
    });
  });
  describe('/GET/:id - retrieve employee', () => {
    it('it should GET one employee by specified _id', (done) => {
      const employee = new Employee({
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
        // we aren't hashing the password, but express validates that anyways not mongoose
      });
      // we know last_name is include, reproduce server side creation of  display_name
      employee.display_name = `${employee.first_name} ${employee.last_name.substring(0,1)}`;
      employee.save((err, employee) => {
        chai.request(server)
            .get(`/api/employees/${employee.id}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('employee');
                expect(res.body.employee).to.have.property('_id').eql(employee.id);
                expect(res.body).to.have.property('msg').eql('Successfully found employee');
              done();
            });
      });
    });
  });
  describe('/PUT/:id - update employee', () => {
    it('it should UPDATE an employee\'s first_name specified by id', (done) => {
      const employee = new Employee({
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
        // we aren't hashing the password, but express validates that anyways not mongoose
      });
      // we know last_name is include, reproduce server side creation of  display_name
      employee.display_name = `${employee.first_name} ${employee.last_name.substring(0,1)}`;
      employee.save((err, employee) => {
        chai.request(server)
            .put(`/api/employees/${employee.id}`)
            .send({first_name: 'KingInTheNorth'})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('employee');
                expect(res.body).to.have.property('msg').eql('Successfully updated employee');
                expect(res.body.employee).to.have.property('first_name').eql('KingInTheNorth');
              done();
            });
      });
    });
    it('it should UPDATE employee - assign role', (done) => {
      const newEmployee = new Employee({
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      });
      newEmployee.display_name = `${newEmployee.first_name} ${newEmployee.last_name.substring(0,1)}`;
      // remove all roles in test db
      Role.remove({},(err) => {
        if(err) console.error(err);
      });
      const newRole = new Role({
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      });
      // create an employee in the db
      newEmployee.save((err, employee) => {
        // create a role in the db
        newRole.save((err, role) => {
          chai.request(server)
              .put(`/api/employees/${employee.id}/assignrole/${role.id}`)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully assingned new role');
                expect(res.body).to.have.property('employee');
                expect(res.body.employee).to.have.property('roles');
                expect(res.body.employee.roles).to.be.an('array');
                expect(res.body.employee.roles.length).to.be.eql(1);
                expect(res.body.employee.roles[0]).to.have.property('_id').eql(role.id);
              done();
            });
        });
      });
    });
    it('it should UPDATE employee - assign role with options other than default', (done) => {
      const newEmployee = new Employee({
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
      });
      newEmployee.display_name = `${newEmployee.first_name} ${newEmployee.last_name.substring(0,1)}`;
      // remove all roles in test db
      Role.remove({},(err) => {
        if(err) console.error(err);
      });
      const newRole = new Role({
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      });
      // create an employee in the db
      newEmployee.save((err, employee) => {
        // create a role in the db
        newRole.save((err, role) => {
          chai.request(server)
              .put(`/api/employees/${employee.id}/assignrole/${role.id}`)
              .send({
                manager_privileges: true,
                granular_pay: 3.00
              })
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully assingned new role');
                expect(res.body).to.have.property('employee');
                expect(res.body.employee).to.have.property('roles');
                expect(res.body.employee.roles).to.be.an('array');
                expect(res.body.employee.roles.length).to.be.eql(1);
                expect(res.body.employee.roles[0]).to.have.property('_id').eql(role.id);
                expect(res.body.employee.roles[0]).to.have.property('manager_privileges').eql(true);
                expect(res.body.employee.roles[0]).to.have.property('rate_of_pay').eql(3.00);
              done();
            });
        });
      });
    });
  });
  describe('/DELETE/:id - remove employee', () => {
    it('it should DELETE an specified by id', (done) => {
      const employee = new Employee({
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming'
        // we aren't hashing the password, but express validates that anyways not mongoose
      });
      // we know last_name is include, reproduce server side creation of  display_name
      employee.display_name = `${employee.first_name} ${employee.last_name.substring(0,1)}`;
      employee.save((err, employee) => {
        chai.request(server)
            .delete(`/api/employees/${employee.id}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully deleted employee');
                expect(res.body).to.have.property('result');
                expect(res.body.result).to.have.property('ok').eql(1);
                expect(res.body.result).to.have.property('n').eql(1);
              done();
            });
      });
    });
  });
});
