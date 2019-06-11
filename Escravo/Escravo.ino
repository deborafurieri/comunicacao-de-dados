#include <HardwareSerial.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
OneWire oneWire(25);
DallasTemperature sensors(&oneWire);
DeviceAddress sensor1;

const int RelePin = 26; // pino ao qual o Módulo Relé está conectado
float sp; // set point
float hist; // histerese
float tempC;
int b;

#define RS485Enable 21   //RS485 Direction control 21

#define receiverLED         35
#define onLED         12
#define transmitterLED 27
#define setPointLED 32

HardwareSerial RS485Serial(1); // RX, TX
int ID;
void setup() {
  ID = 1;
  pinMode(RS485Enable, OUTPUT);
  pinMode(onLED, OUTPUT);
  pinMode(receiverLED, OUTPUT);
  pinMode(transmitterLED, OUTPUT);
  pinMode(setPointLED, OUTPUT);
  Serial.begin(115200);
  RS485Serial.begin(1000000, SERIAL_8N1, 16, 17);
  digitalWrite(RS485Enable, LOW);
  digitalWrite(onLED, HIGH);

  sp = 26;
  hist = 0;
  b = 0;
  sensors.begin();
  sensors.getDeviceCount();
  pinMode(RelePin, OUTPUT); // seta o pino como saída
  // Localiza e mostra enderecos dos sensores
  Serial.println("Localizando sensores DS18B20...");
  Serial.print("Foram encontrados ");
  Serial.print(sensors.getDeviceCount(), DEC);
  Serial.println(" sensores.");
  if (!sensors.getAddress(sensor1, 0))
    Serial.println("Sensores nao encontrados !");
  // Mostra o endereco do sensor encontrado no barramento
  Serial.println();
  Serial.println();
}

void loop() {
  StaticJsonDocument<200> doc;
  if (RS485Serial.available())
  {
    digitalWrite(receiverLED, HIGH);
    DeserializationError error = deserializeJson(doc, RS485Serial);
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return;
    }
    digitalWrite(receiverLED, LOW);

  }
  const int slaveID = doc["slaveId"];
  if (slaveID == ID)
  {
    sensors.requestTemperatures();
    tempC = sensors.getTempC(sensor1);
    if ((tempC < (sp + hist)) && (b == 0)) {
      digitalWrite(RelePin, HIGH); //aciona o pino
      b = 1;
    }
    if (tempC >= (sp + hist)) {
      digitalWrite(RelePin, LOW); //aciona o pino
    }
    if (tempC < (sp - hist)) {
      b = 0;
    }
    doc["value"] = tempC;
//    serializeJsonPretty(doc, Serial);
    digitalWrite(RS485Enable, HIGH);
    digitalWrite(transmitterLED, HIGH);
    serializeJson(doc, RS485Serial);
    RS485Serial.flush();
    digitalWrite(transmitterLED, LOW);
    digitalWrite(RS485Enable, LOW);
  }
  doc["slaveID"] = 0;
  delay(50);
}
