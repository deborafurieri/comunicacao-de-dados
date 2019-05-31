const mongoose = require('mongoose');
const Data = mongoose.model('Data');

module.exports.response = (response, callback) => {
  Data.updateMany({ online: true }, { online: false }, (err, raw) => {
    if (err) {
      console.error(err);
      return false;
    }
    for (let res in response) {
      // eslint-disable-next-line no-loop-func
      Data.findOne({ _id: response[res]._id }, (err, $sensor) => {
        let sensor = $sensor;
        if (!sensor) {
          sensor = new Data();
        }
        sensor.slaveId = response.slaveId;
        sensor.setPoint = response.setPoint;
        sensor.value = response.value;
        sensor.online = true;

        sensor.save((err, result) => {
          if (!err) {
              if (callback && typeof (callback) === "function") callback();
              console.log("Sucesso!", sensor);
          } else {
              console.error("Erro: ", err);
          }
        });
      });
    }
  });
}