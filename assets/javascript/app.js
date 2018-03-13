
 var config = {
    apiKey: "AIzaSyCGeKU7C220FlTTdmCejLM9MrsUB8MQ5Ig",
    authDomain: "my-train-schedule-f45d7.firebaseapp.com",
    databaseURL: "https://my-train-schedule-f45d7.firebaseio.com",
    projectId: "my-train-schedule-f45d7",
    storageBucket: "",
    messagingSenderId: "293059558295"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName;
  var destination;
  var firstTime;
  var frequency;

  $("#btnSubmit").on("click", function(event) {
    event.preventDefault();
    trainName = $("#name").val().trim();
    destination = $("#destination").val().trim();
    firstTime= $("#firstTime").val().trim();
    frequency = $("#frequency").val().trim();
    
    var newRow = $("<tr>");
    var newTrainName = $("<td>");
    newTrainName.text(trainName);
    var newDestination = $("<td>");
    newDestination.text(destination);
    var newFirstTime = $("<td>");
    newFirstTime .text(firstTime);
    var newFrequency = $("<td>");
    newFrequency.text(frequency);
   
    newRow.append(newTrainName);
    newRow.append(newDestination);
    newRow.append(newFirstTime);
    newRow.append(newFrequency);

    $("#schedContainer").append(newRow);


    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency:frequency,
        firstTime: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $(".form-control").val("");
});

