var config = {
    apiKey: "AIzaSyCGeKU7C220FlTTdmCejLM9MrsUB8MQ5Ig",
    authDomain: "my-train-schedule-f45d7.firebaseapp.com",
    databaseURL: "https://my-train-schedule-f45d7.firebaseio.com",
    projectId: "my-train-schedule-f45d7",
    storageBucket: "my-train-schedule-f45d7.appspot.com",
    messagingSenderId: "293059558295"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var trainName="";
  var destination="";
  var firstTime;
  var frequency;

$("#btnSubmit").on("click", function(event) {
    event.preventDefault();

// getCurrentTime();

    trainName = $("#name").val().trim();
    destination = $("#destination").val().trim();
    firstTime= $("#firstTime").val().trim();
    frequency = $("#frequency").val().trim();

    var { nextTrain, tMinutesTillTrain } = convert(firstTime, frequency);
  
    
    var newRow = $("<tr>");
    newRow.attr("id","tableRow");
    var newTrainName = $("<td>");
    newTrainName.attr("class","table-data");
    newTrainName.text(trainName);
    var newDestination = $("<td>");
    newDestination.attr("class","table-data");
    newDestination.text(destination);
    var newFrequency = $("<td>");
    newFrequency.attr("class","table-data");
    newFrequency.text(frequency);
    var newNextTrain = $("<td>");
    newNextTrain.attr("class", "table-data");
    newNextTrain.text(nextTrain);
    console.log(nextTrain);
    var newtMinutesTillTrain= $("<td>");
    newtMinutesTillTrain.attr("class", "table-data");
    newtMinutesTillTrain.text(tMinutesTillTrain);
    console.log(tMinutesTillTrain);
   
    newRow.append(newTrainName);
    newRow.append(newDestination);
    newRow.append(newFrequency);
    newRow.append(newNextTrain);
    newRow.append(newtMinutesTillTrain);

    $("#schedContainer").append(newRow);

  
    database.ref().push({
        trainName: trainName,
        destination: destination,
        frequency:frequency,
        firstTime: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      $(".form-control").val("");
      $(newRow).val();
});

database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function(childSnapshot) {
    // Log everything that's coming out of snapshot
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().firstTime;
    var dateAdded = childSnapshot.val().dateAdded;

    var { nextTrain, tMinutesTillTrain } = convert(firstTime, frequency);

    
    // full list of items to the well
    $("#schedContainer").append(
        `
        <tr>
            <td class= "table-data">${trainName}</td>
            <td class= "table-data">${destination}</td>
            <td class= "table-data">${frequency}</td>
            <td class= "table-data">${nextTrain}</td>  
            <td class= "table-data">${tMinutesTillTrain}</td>
         </tr>
        `
   );
//    <td>${childSnapshot.val().dateAdded}</td>
  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  }
);

function convert(firstTime, frequency) {
    var now= moment();
    var firstTimeConverted = moment(firstTime, 'HH:mm').subtract(1, "years");
    // Difference between the times
    var diffTime = now.diff(firstTimeConverted);
    var tempDiffTime = moment.duration(diffTime);
    var timeConverted = tempDiffTime.hours() + ':' + tempDiffTime.minutes();
    console.log("DIFFERENCE IN TIME: " + timeConverted);
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("frequency", frequency);
    console.log("tRemainder", tRemainder);
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = now.add(tMinutesTillTrain, "minutes").format('HH:mm');
    console.log(nextTrain);
    return { nextTrain, tMinutesTillTrain };
}
