// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Table = require('../app/models/table.model');
const Restaurant = require('../app/models/restaurant');

const chai = require('chai');
// switching to 'expect' as it seems less clumsy
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../server');

const baseTableURL = '/api/tables';

chai.use(chaiHttp);

describe('Tables', () => {
  beforeEach((done) => {
    Table.remove({}, (err) => {
      if(err) console.error(err);
      done();
    });
  });
  describe('/GET all the tables', () => {
    it('it should GET all the tables', (done) => {
      chai.request(server)
          .get(baseTableURL)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Successfully retrieved all tables');
            expect(res.body).to.have.property('tables');
            expect(res.body.tables).to.be.a('array');
            expect(res.body.tables.length).to.be.eql(0);
          done();
          });
    });
  });
  describe('/POST new table', () => {
    it('it should POST a new table', (done) => {
      var fakeObjectID = mongoose.Types.ObjectId();
      var newTablePostData = {
        dining_area: fakeObjectID,
        name: 'P1',
        seats: 8
      };
      chai.request(server)
          .post(baseTableURL)
          .send(newTablePostData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Successfully created new table');
            expect(res.body).to.have.property('table').which.is.an('object');
            expect(res.body.table).to.have.property('dining_area').eql(newTablePostData.dining_area.toString());
            expect(res.body.table).to.have.property('name').eql(newTablePostData.name);
            expect(res.body.table).to.have.property('seats').eql(newTablePostData.seats);
          done();
          });
    });
  });
});
