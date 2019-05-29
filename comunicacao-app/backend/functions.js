const mongoose = require('mongoose');
const Data = mongoose.model('Data');
// const Data = require ('./models/Data');

module.exports.response = (response, callback) => {
  Data.updateMany({ online: true }, { online: false }, (err, raw) => {
    if (err) {
      console.error(err);
      return false;
    }
    for (let res in response) {
      Data.findOne({ serial: response[res]['id'] }, (err, $sensor) => {
        let sensor = $sensor;

        sensor.slaveId = response[res]['configs'][0];
        sensor.setPoint = response[res]['configs'][1];
        sensor.value = response[res]['configs'][2];

        sensor.save((err, result) => {
          if (!err) {
              if (callback && typeof (callback) === "function") callback();
              console.log("Sucesso!");
          } else {
              console.error("Erro: ", err);
          }
        });
      });
    }
  });
}