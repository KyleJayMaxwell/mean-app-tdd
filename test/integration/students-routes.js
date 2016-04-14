process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app');
var should = chai.should();
var testUtilities = require('../utilities');
var testSeed = require('../../src/server/models/seeds/test-seed');
var Student = require('../../src/server/models/students');

chai.use(chaiHttp);


describe('student routes', function() {


  beforeEach(function(done) {
    // drop db
    testUtilities.dropDatabase();
    testSeed.runSeed(done);
  });

  afterEach(function(done) {
    // drop db
    testUtilities.dropDatabase(done);
  });

  describe('/GET students', function() {
    it('should return all students', function(done) {
      chai.request(server)
      .get('/students')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.status.should.equal('success');
        res.body.data.should.be.a('array');
        res.body.data.length.should.equal(1);
        res.body.data[0].firstName.should.equal('Kevin');
        res.body.data[0].lastName.should.equal('Schwartz');
        res.body.data[0].year.should.equal(2001);
        done();
      });
    });
  });

});