$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDHC37y1b_4xgrcMReA_Z1xUcnRv4WX9nE",
    authDomain: "train-sched-82437.firebaseapp.com",
    databaseURL: "https://train-sched-82437.firebaseio.com",
    projectId: "train-sched-82437",
    storageBucket: "train-sched-82437.appspot.com",
    messagingSenderId: 386564285996
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Capture Button Click
  $("#addTrain").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    var trainName = $("#trainName")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var firstTrain = $("#firstTrain")
      .val()
      .trim();
    var freq = $("#interval")
      .val()
      .trim();

    // handling the push
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: freq
    });
  });

  // Firebase watcher + initial loader
  database.ref().on(
    "child_added",
    function(childSnapshot) {
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;

      // First Time (pushed back 1 year to make sure it comes before current time)
      var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(
        1,
        "years"
      );

      // Current Time
      var currentTime = moment();

      // Difference between the times
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");

      // Time apart (remainder)
      var tRemainder = diffTime % newFreq;

      // Minute(s) Until Train
      var tMinutesTillTrain = newFreq - tRemainder;

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var catchTrain = moment(nextTrain).format("HH:mm");

      // Display On Page
      $("#all-display").append(
        " <tr><td>" +
          newTrain +
          " </td><td>" +
          newLocation +
          " </td><td>" +
          newFreq +
          " </td><td>" +
          catchTrain +
          " </td><td>" +
          tMinutesTillTrain +
          " </td></tr>"
      );

      // Clear input fields
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;
    },
    //Handle errors
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
});
