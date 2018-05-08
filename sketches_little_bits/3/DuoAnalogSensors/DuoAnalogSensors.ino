// First analog input pin for potentiometer, light sensor, tempature sensor, pressure sensor, etc.
const int analogInPin0 = A1;

// Second analog input pin for potentiometer, light sensor, tempature sensor, pressure sensor, etc.
const int analogInPin1 = A0;

// PWM pin for representing the signal from analogInPin0.
const int analogOutPin0 = 9;

// PWM pin for representing the signal from analogInPin1.
const int analogOutPin1 = 5;

// Digital input pin for button, switch, gate, etc.
const int digitalInPin = 0;

// Digital out pin for representing digitalInPin output;
const int digitalOutPin = 1;

// Current analog sensor value from analogInPin0.
int analogSensorValue0 = 0;

// Current analog sensor value from analogInPin1.
int analogSensorValue1 = 0;

// Current analog sensor value from analogInPin0 converted for analogOutPin0 and serial out.
int outputValue0 = 0;

// Current analog sensor value from analogInPin1 converted for analogOutPin1 and serial out.
int outputValue1 = 0;

// Current digital sensor value from digitalInPin.
boolean digitalInputValue = false;

void setup() {
    // Initialize serial communications at a baud rate of 9600.
    Serial.begin(9600);

    pinMode(digitalInPin, INPUT);
}

void loop() {
    // Read the analog and digital sensor values.
    analogSensorValue0 = analogRead(analogInPin0);
    analogSensorValue1 = analogRead(analogInPin1);
    digitalInputValue = digitalRead(digitalInPin);

    // Scale sensor values to something workable for the analog out pins.
    outputValue0 = map(analogSensorValue0, 0, 1023, 0, 255);
    outputValue1 = map(analogSensorValue1, 0, 1023, 0, 255);

    // Represent analog reading as PWM signal.
    analogWrite(analogOutPin0, analogSensorValue0);
    analogWrite(analogOutPin1, analogSensorValue1);

    // Represent digital input on digital output.
    digitalWrite(digitalOutPin, digitalInputValue);

    // Print space seperated output values to serial out after casting it to a String.
    Serial.println((String)outputValue0 + " " + (String)outputValue1 + " " + (String)digitalInputValue);

    delay(10);
}
