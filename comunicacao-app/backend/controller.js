const mongoose = require('mongoose');
const Data = mongoose.model('Data');

module.exports.findData = (req, res) => {
  Data.find({ slaveId: 1 }, (err, data) => {
    res.json(data);
    console.log('data', data);
  });
}

module.exports.update = (req, res) => {
  Data.findOne({ serial: 1 }, (err, sensor) => {

    if (sensor) {
      sensor.slaveId = req.body.slaveId;
      sensor.setPoint = req.body.setPoint;
      sensor.value = req.body.value;

      if(sensor.setPoint != req.body.setPoint){
        sensor.setPoint = req.body.setPoint;

        res.io.emit('action', {
            action : 1,
            message : {
              addressee : 1,
              configs : [sensor.setPoint]
            }
        });
      }
      sensor.save((err, result) => {
        if (!err) {
          res.json({ msg: 'Sensor atualizado.', error: 0 });
        } else {
          res.json({ msg: err, error: 1 });
        }
      });
    }
  });
}