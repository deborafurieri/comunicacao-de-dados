#include <HardwareSerial.h>
#include <ArduinoJson.h>
#define RS485Enable 21   //RS485 Direction control 21
#include <WiFiServer.h>
#include <WiFi.h>

WiFiServer sv(555);//Cria o objeto servidor na porta 555
WiFiClient cl;//Cria o objeto cliente.
#define receiverLED         26
#define onLED         12
#define transmitterLED 25
#define setPointLED 32

const byte numChars = 32;
char receivedChars[numChars]; // an array to store the received data
boolean newData = false;
float setPoint = 0.0;
float datasensor = 0.0;

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
  StaticJsonDocument<200> doc;
  WiFi.mode(WIFI_AP);//Define o WiFi como Acess_Point.
  WiFi.softAP("TrabalhoEmerick", "");//Cria a rede de Acess_Point.
  sv.begin();//Inicia o servidor TCP na porta declarada no começo.
}

void loop() {
  for (int i = 1; i < 3; i++) {
    StaticJsonDocument<200> doc;
    doc["slaveId"] = i;
    doc["setPoint"] = setPoint;
    doc["value"] = datasensor;
    if (Serial.available()) {
      StaticJsonDocument<200> doc2;
      DeserializationError error = deserializeJson(doc2, Serial);
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.c_str());
        return;
      }
      setPoint = doc2["setPoint"];
    }
    if (cl.connected())//Detecta se há clientes conectados no servidor.
    {
      if (cl.available() > 0)//Verifica se o cliente conectado tem dados para serem lidos.
      {
        String req = "";
        while (cl.available() > 0)//Armazena cada Byte (letra/char) na String para formar a mensagem recebida.
        {
          char z = cl.read();
          req += z;
        }
        setPoint = req.toFloat();
      }
    }
    else//Se nao houver cliente conectado,
    {
      cl = sv.available();//Disponabiliza o servidor para o cliente se conectar.
      delay(1);
    }
    transmitter(doc);
    bool check = true;
    long timeAGORA = millis();
    while (RS485Serial.available() == 0) {
      if ((millis() - timeAGORA) > 100) {
        check = false;
        break;
      }
    }
    if (check) {
      readRS485();
    }
    delay(500);
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
    datasensor = doc["value"];
    digitalWrite(receiverLED, LOW);
    serializeJson(doc, Serial);
    Serial.println();
    Serial.flush();
  }

}
