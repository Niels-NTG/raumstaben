// Analog input pin for potentiometer, light sensor, tempature sensor, pressure sensor, etc.
const int analogInPin = A1;

// PWM pin for representing the signal from analogInPin.
const int analogOutPin = 9;

// Current analog sensor value.
int sensorValue = 0;

// Current analog sensor value converted for analogOutPin and serial out.
int outputValue = 0;

void setup() {
    // Initialize serial communications at a baud rate of 9600.
    Serial.begin(9600);
}

void loop() {
    // Read the analog sensor value.
    sensorValue = analogRead(analogInPin);

    // Scale sensorValue to something workable for analogOutPin.
    outputValue = map(sensorValue, 0, 1023, 0, 255);

    // Represent analog reading as PWM signal.
    analogWrite(analogOutPin, outputValue);

    // Print outputValue to serial out after casting it to a String.
    Serial.println((String)outputValue);

    delay(2);
}
