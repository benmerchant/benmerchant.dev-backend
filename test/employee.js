// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Employee = require('../app/models/employee');

const chai = require('chai');
chai.use(require('chai-moment'));
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');

const server = require('../server');
const should = chai.should();


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
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('employees');
            res.body.employees.should.be.a('array');
            res.body.employees.length.should.be.eql(0);
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
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('login_number');
            res.body.error.errors.login_number.should.have.property('kind').eql('required');
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
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('login_number');
            res.body.error.errors.login_number.should.have.property('kind').eql('Number');
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
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('first_name');
            res.body.error.errors.first_name.should.have.property('kind').eql('required');
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
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('email');
            res.body.error.errors.email.should.have.property('kind').eql('required');
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
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('last_name');
            res.body.errors.last_name.should.have.property('msg').eql('Must enter a last name');
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
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('password');
            res.body.errors.password.should.have.property('msg').eql('Password must be at least 8 characters');
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
            res.should.have.status(422);
            res.body.should.be.an('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('password');
            res.body.errors.password.should.have.property('msg').eql('Password must be no more than characters');
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
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('ssn');
            res.body.error.errors.ssn.should.have.property('kind').eql('required');
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
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('gender');
            res.body.error.errors.gender.should.have.property('kind').eql('required');
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
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('msg').eql('Employee successfully added');
            res.body.should.have.property('employee');
            res.body.employee.should.have.property('first_name');
            res.body.employee.should.have.property('middle_name');
            res.body.employee.should.have.property('last_name');
            res.body.employee.should.have.property('login_number');
            res.body.employee.should.have.property('pin_num');
            res.body.employee.should.have.property('ssn');
            res.body.employee.should.have.property('gender');
            res.body.employee.should.have.property('email');
            res.body.employee.should.have.property('password');
            // test that password is hashing into something different
            res.body.employee.password.should.not.be.eql(employee.password);
            // fields generated by the API
            res.body.employee.should.have.property('display_name');
            res.body.employee.should.have.property('hire_date');
            // trying to just test if hire_date is of type Date
            // so I'm testing if the current date is w/in 1 minute of employee being saved to db
            res.body.employee.hire_date.should.be.sameMoment(new Date(), 'minute', 'test failed if hire_date equal to today');
          done();
        });
    });
  });
});
