// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Role = require('../app/models/role');
const Employee = require('../app/models/employee');

const chai = require('chai');
// switching to 'expect' as it seems less clumsy
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../server');


chai.use(chaiHttp);

describe('Roles', () => {
  beforeEach((done) => {
    Role.remove({},(err) => {
      if(err) console.error(err);
      done();
    });
  });
  // test the /GET route
  describe('/GET all roles', () => {
    it('it should GET all the roles', (done) => {
      chai.request(server)
          .get('/api/roles')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('roles');
            expect(res.body.roles).to.be.an('array');
            expect(res.body.roles.length).to.be.eql(0);
          done();
        });
    });
  });
  // test /POST route
  describe('/POST create new role', () => {
    it('it should not POST a new role without name field - Mongoose', (done) => {
      const role = {
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('name');
            expect(res.body.error.errors.name).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a new role without salaried field - Mongoose', (done) => {
      const role = {
        name: 'Server',
        granular_pay: 2.50,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('salaried');
            expect(res.body.error.errors.salaried).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a new role without granular_pay field - Mongoose', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('granular_pay');
            expect(res.body.error.errors.granular_pay).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a new role if granular_pay not a number - Mongoose', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        granular_pay: 'NaN its a String',
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('granular_pay');
            expect(res.body.error.errors.granular_pay).to.have.property('kind').eql('Number');
          done();
        });
    });
    it('it should not POST a new role without manager_privileges field - Mongoose', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        granular_pay: 2.50
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('manager_privileges');
            expect(res.body.error.errors.manager_privileges).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a new role', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      };
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Role successfully created');
            expect(res.body).to.have.property('role');
            expect(res.body.role).to.have.property('name');
            expect(res.body.role).to.have.property('salaried');
            expect(res.body.role).to.have.property('granular_pay');
            expect(res.body.role).to.have.property('manager_privileges');
          done();
        });
    });
  });
  describe('/GET/:id - retrieve one role', () => {
    it('it should GET one role by _id', (done) => {
      const role = new Role({
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      });
      role.save((err, role) => {
        chai.request(server)
            .get(`/api/roles/${role.id}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('msg').eql('Successfully located role');
              expect(res.body).to.have.property('role');
              expect(res.body.role).to.have.property('_id').eql(role.id);
            done();
          });
      });
    });
  });
  describe('/DELETE/:id - delete one role', () => {
    it('it should DELETE one role by _id', (done) => {
      const role = new Role({
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      });
      role.save((err, result) => {
        chai.request(server)
            .delete(`/api/roles/${role.id}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('msg').eql('Successfully deleted role');
              expect(res.body).to.have.property('result');
              expect(res.body.result).to.have.property('ok').eql(1);
              expect(res.body.result).to.have.property('n').eql(1);
            done();
          });
      });
    });
    // this is testing two things technically, but previous tests let us know
    // that assigning roles works. I can't think of another way to do this.
    // the employee and the role both need to exist in the DB for a true test
    it('it should not DELETE a role that is assigned to an employee', (done) => {
      Employee.remove({},(err) => { // remove any employees in db
        if(err) console.error(err);
      });
      const newEmployee = new Employee({
        first_name: 'Jon',
        middle_name: 'Aegon',
        last_name: 'Snow',
        login_number: 123456,
        pin_num: 1234,
        ssn: 333224444,
        gender: 'Male',
        email: 'whitewolf@winterfell.gov',
        password: 'w1nt3rI$coming',
        birth_date: new Date(1985, 12, 25)
      });
      newEmployee.display_name = `${newEmployee.first_name} ${newEmployee.last_name.substring(0,1)}`;

      const newRole = new Role({
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      });
      newEmployee.save((err, employee) => {
        newRole.save((err,role) => {
          // need to assign the role to the employee first
          chai.request(server)
              .put(`/api/employees/${employee.id}/assignrole/${role.id}`)
              .end((err, res) => {
                if(err) console.error(err);
                // we already tested this above, but might as well here too
                expect(res).to.have.status(200);
                // call the delete role route
                chai.request(server)
                    .delete(`/api/roles/${role.id}`)
                    .end((err, res) => {
                      expect(res).to.have.status(409);
                      expect(res.body).to.have.property('msg').eql('Cannot delete role, assigned to employees');
                      expect(res.body).to.have.property('employees').which.is.an('array');
                      expect(res.body.employees.length).to.be.gt(0);
                      done();
                    });
              });
        });
      });
    });
  });
});
