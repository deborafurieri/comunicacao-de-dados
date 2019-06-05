#include <HardwareSerial.h>
#include <ArduinoJson.h>
#define RS485Enable 21   //RS485 Direction control 21

#define receiverLED         26
#define onLED         12
#define transmitterLED 25
#define setPointLED 32

HardwareSerial RS485Serial(1); // RX, TX

void setup() {
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
  for (int i = 1; i < 3; i++) {
    StaticJsonDocument<200> doc;
    doc["slaveId"] = i;
    doc["setPoint"] = 24.5;
    doc["value"] = 0.0;
    transmitter(doc);
    //  Serial.println("AAAAAA******");

    bool check = true;
    long timeAGORA = millis();
    while (RS485Serial.available() == 0) {
      if ((millis() - timeAGORA) > 15) {
        check = false;
        break;
      }
    }
    if (check) {
      readRS485();
      //    Serial.println("AAAAAA");
    }
  }
}

void transmitter(StaticJsonDocument<200> doc) {
  digitalWrite(RS485Enable, HIGH);
  digitalWrite(transmitterLED, HIGH);
  serializeJson(doc, RS485Serial);
  RS485Serial.flush();
  digitalWrite(transmitterLED, LOW);
  digitalWrite(RS485Enable, LOW);
}

void readRS485() {
  if (RS485Serial.available())
  {
    digitalWrite(receiverLED, HIGH);
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, RS485Serial);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }
    digitalWrite(receiverLED, LOW);
    serializeJsonPretty(doc, Serial);
    //    Serial.println("Recebido do Slave");
    //    serializeJson(doc, Serial);
  }
  delay(500);
}
