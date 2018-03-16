
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
  var now= moment();
  var nowFormatted= moment(now).format("hh:mm");
  var trainName="";
  var destination="";
  var firstTime;
  var frequency=0;
  
  console.log(now);

  $("#btnSubmit").on("click", function(event) {
    event.preventDefault();

// getCurrentTime();

    trainName = $("#name").val().trim();
    destination = $("#destination").val().trim();
    firstTime= $("#firstTime").val().trim();
    // firstTimeConverted=moment(firstTime, "HH:mm").subtract(1, "years");
    frequency = $("#frequency").val().trim();

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  
   
    // Difference between the times
    var diffTime = moment(nowFormatted, "minutes").diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
  
    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
  
    // Next Train
    var nextTrain =moment(nowFormatted, "minutes").add(tMinutesTillTrain, "minutes");

    console.log(nextTrain);
  
    
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
    var newtMinutesTillTrain= $("<td>");
    newtMinutesTillTrain.attr("class", "table-data");
    newtMinutesTillTrain.text(tMinutesTillTrain);
   
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

database.ref().on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);
    console.log(childSnapshot.val().firstTime);
    console.log(childSnapshot.val().dateAdded);

    var now= moment();
    var nowFormatted= moment(now).format("hh:mm");

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  

    var diffTime = moment(nowFormatted, "minutes").diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
  
    // Minutes Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    var nextTrain = moment(nowFormatted).add(tMinutesTillTrain, "minutes");


    
    // full list of items to the well
    $("#schedContainer").append(
`
<tr>
    <td class= "table-data">${childSnapshot.val().trainName}</td>
    <td class= "table-data">${childSnapshot.val().destination}</td>
    <td class= "table-data">${childSnapshot.val().frequency}</td>
    <td class= "table-data">${nextTrain}</td>  
    <td class= "table-data">${tMinutesTillTrain}</td>
</tr>
`
   );
//    <td>${childSnapshot.val().dateAdded}</td>
  // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
//   dataRef.ref().orderByChild("firstTime").limitToLast(5).on("child_added", function(snapshot) {

//     // Change the HTML to reflect
//     var addRow= $("<tr>");
//    var addTrainName= $("<td>").html(snapshot.val().trainName);
//    addTrainName.attr("class", "table-data");
//     var addDestination =$("<td>").text(snapshot.val().destination);
//     addDestination.attr("class", "table-data");
//     var addFrequency=$("<td>").text(snapshot.val().frequency);
//     addFrequency.attr("class", "table-data");
//     // $("<td>").text(snapshot.val().firstTime);

//     addRow.append(addTrainName);
//     addRow.append(addDestination);
//     addRow.append(addFrequency);
//     // addRow.append()

//   });


function calcMinutesAway(frequency, firstTime){
    var tFrequency = frequency;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment(currentTime).diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    return nextTrain;
   
}
