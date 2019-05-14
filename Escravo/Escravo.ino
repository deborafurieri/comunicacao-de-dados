#include <HardwareSerial.h>
#include <ArduinoJson.h>
#define RS485Enable 21   //RS485 Direction control 21

#define receiverLED         26
#define onLED         12
#define transmitterLED 25
#define setPointLED 32

HardwareSerial RS485Serial(1); // RX, TX
int ID;
void setup() {
  ID=1;
  pinMode(RS485Enable, OUTPUT);
  pinMode(onLED, OUTPUT);
  pinMode(receiverLED, OUTPUT);
  pinMode(transmitterLED, OUTPUT);
  pinMode(setPointLED, OUTPUT);
  Serial.begin(115200);
  RS485Serial.begin(1000000, SERIAL_8N1, 16, 17);
  digitalWrite(RS485Enable, LOW);
  digitalWrite(onLED, HIGH);
}

void loop() {
  StaticJsonDocument<200> doc;
  if (RS485Serial.available())
  {
    DeserializationError error = deserializeJson(doc, RS485Serial);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }
  }
    const int slaveID = doc["slaveId"];
    if (slaveID == ID)
    {
      Serial.println("Cheguei");
      int sensorRead = analogRead(34);
      float converted = sensorRead * 3.3 / 4095;
      Serial.println(converted);
      doc["value"] = converted;
      digitalWrite(RS485Enable, HIGH);
      //    digitalWrite(pinLED, HIGH);
      serializeJson(doc, RS485Serial);
      RS485Serial.flush();
      //    digitalWrite(pinLED, LOW);
      digitalWrite(RS485Enable, LOW);
    }
  doc["slaveID"] = 0;
  delay(5);
}
