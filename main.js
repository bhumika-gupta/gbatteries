
const batteries = [
    [1660869761,3.48,3.38,3.30,110],
    [1660869762,3.47,3.38,3.29,110],
    [1660869763,3.45,3.37,3.29,110],
    [1660869764,3.45,3.37,3.28,110],
    [1660869765,3.45,3.37,3.28,110],
    [1660869766,3.46,3.36,3.28,110],
    [1660869767,3.43,3.36,3.30,111],
    [1660869768,3.42,3.36,3.30,110],
    [1660869769,3.41,3.36,3.30,110],
    [1660869770,3.40,3.35,3.30,110],
    [1660869771,3.39,3.35,3.30,110],
    [1660869772,3.38,3.35,3.30,110],
]

function form_discharge() {
    let cellTest = parseInt(document.getElementById('cell').value);
    let timeTwoTest = parseInt(document.getElementById('time2').value);
    let timeOneTest = parseInt(document.getElementById('time1').value);
    
    find_rate_of_discharge(cellTest, timeTwoTest-batteries[0][0], timeOneTest-batteries[0][0]);
    let returnArr = find_rate_of_discharge(cellTest, timeTwoTest-batteries[0][0], timeOneTest-batteries[0][0]);
    let rateOfDischargeFuncString = returnArr[2];
    let rateOfDischarge = returnArr[1];
    var rateOfDischargeString = "Rate of discharge for Cell " + cellTest + ": " + rateOfDischarge + " V/s<br/>";
    document.getElementById("rate-of-discharge").innerHTML = rateOfDischargeFuncString + "<br/>" + rateOfDischargeString + "<br/>";
}

function find_rate_of_discharge(cell, timeTwo, timeOne) {
    var rateOfDischargeFuncString = "<br/>Finding the rate of discharge for Cell " + cell + " between times " + batteries[timeOne][0] + " s and " + batteries[timeTwo][0] + " s...<br/>";
    let voltDifference = (batteries[timeTwo][cell] - batteries[timeOne][cell]).toFixed(3);
    let timeDifference = batteries[timeTwo][0] - batteries[timeOne][0];
    let rateOfDischarge = (voltDifference / timeDifference).toFixed(3);
    
    return [voltDifference, rateOfDischarge, rateOfDischargeFuncString];
}

function find_rate_start_to_finish() {
    var rateStartFinishFuncString = "<br/>Finding the rate of discharge from start to finish...<br/>";
    for (let cellNum = 1; cellNum < 4; cellNum++) {
      returnArray = find_rate_of_discharge(cellNum, batteries.length-1, 0); 
      voltDifference = returnArray[0];
      rateOfDischarge = returnArray[1];
        if (cellNum == 1) { 
            var stringC1Volt = "Cell 1: " + voltDifference + " V<br/>";
        } else if (cellNum == 2) {
            var stringC2Volt = "Cell 2: " + voltDifference + " V<br/>";
        } else if (cellNum == 3) {
            var stringC3Volt = "Cell 3: " + voltDifference + " V<br/>";
        } else { // do nothing
        }
      
        if (cellNum == 1) {
            var stringC1Rate = "Cell 1: " + rateOfDischarge + " V/s<br/>";
        } else if (cellNum == 2) {
            var stringC2Rate = "Cell 2: " + rateOfDischarge + " V/s<br/>";
        } else if (cellNum == 3) {
            var stringC3Rate = "Cell 3: " + rateOfDischarge + " V/s<br/>";
        } else { // do nothing
        }
    } 

    document.getElementById("discharge-start-to-finish").innerHTML = rateStartFinishFuncString + "<br/>Voltage Change: <br/>" + stringC1Volt + stringC2Volt + stringC3Volt + "<br/>Rate of Discharge: <br/>" + stringC1Rate +  stringC2Rate + stringC3Rate + "<br/>";
}

var discOne = [];
var discTwo = [];
var discThree = [];

function find_mismatch(cell) {
  for (let tRow = 0; tRow < (batteries.length-1); tRow++) {
    let v2 = batteries[tRow+1][cell]; 
    let v1 = batteries[tRow][cell];
    //let t2 = batteries[tRow+1][0];
    let t1 = batteries[tRow][0];
    let configString = batteries[tRow][4].toString();

    if ((v2 < v1) && (configString[cell-1] == "1")) { 
        // no error
        if (cell == 1) {
            discOne.push("N");
        } else if (cell == 2) {
            discTwo.push("N");
        } else if (cell == 3) {
            discThree.push("N");
        }    else {
        }
    } else if ((v2 < v1) && (configString[cell-1] == "0")) {
        add_to_mismatched(cell, t1); 
        // error
        if (cell == 1) {
        discOne.push("E");
        } else if (cell == 2) {
        discTwo.push("E");
        } else if (cell == 3) {
        discThree.push("E");
        } else {
        }
    } else if ((v2 >= v1) && (configString[cell-1] == "1")) {
        add_to_mismatched(cell, t1); 
        // error
        if (cell == 1) {
        discOne.push("E");
        } else if (cell == 2) {
        discTwo.push("E");
        } else if (cell == 3) {
        discThree.push("E");
        } else {
        }
    } else if ((v2 >= v1) && (configString[cell-1] == "0")) {
        // no error
        if (cell == 1) {
        discOne.push("N");
        } else if (cell == 2) {
        discTwo.push("N");
        } else if (cell == 3) {
        discThree.push("N");
        } else {
        }
    } else {
    }
    }
    //console.log("length: " + discTwo.length);
    filter_discrepancy(cell, discOne, discTwo, discThree);
    print_mismatched(cell);
  return;
} 

var final_arr1 = [];
var number_arr1 = [];
var final_arr2 = [];
var number_arr2 = [];
var final_arr3 = [];
var number_arr3 = [];

function filter_discrepancy(cell, arr1, arr2, arr3) {
    var window_arr1 = [];
    var window_arr2 = [];
    var window_arr3 = [];
    var window_num_arr1 = [];
    var window_num_arr2 = [];
    var window_num_arr3 = [];

    
    //var test_arr = ["N","E","N","N","N","E","E","E","E","N","E","E","E"];
    if (cell == 1) {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] == "E") {
                window_arr1.push(arr1[i]);
                window_num_arr1.push(1660869761 + i);
                
                //if ((i != (arr1.length-1)) && (arr1[i+1] != "E") && (window_arr1.length < 2))
                if ((i == arr1.length-1) && (arr1[i+1] == "N"))  {
                    // if next element is N and lasted 1 second
                    // empty window array
                    window_arr1 = [];
                    window_num_arr1 = [];
                } else {
                    if ((i != (arr1.length-1)) && arr1[i+1] == "N") {
                        // if next element is N and lasted > 1 second (previous condition)
                        // create a final array and assign it to the current window array
                        number_arr1 = number_arr1.concat(window_num_arr1);
                        final_arr1 = final_arr1.concat(window_arr1);
                        window_arr1 = []; // empty the array 
                        window_num_arr1 = [];
                    } else {
                        // do nothing
                    }
                }
            } else {
                // do nothing
            }
        }
        final_arr1 = final_arr1.concat(window_arr1);
        
        if (number_arr1.length == 0) {
            document.getElementById("mismatch-one-disc").innerHTML = "0 discrepancies for Cell 1.";
        } else {
            document.getElementById("mismatch-one-disc").innerHTML = "Discrepancies after filtering for noise under 2 seconds for Cell 1: " + number_arr1;
        }
    } else if (cell == 2) {
        for (let i = 0; i < arr2.length; i++) {
            
            //console.log(arr2.length);
            if (arr2[i] == "E") {
                
                window_arr2.push(arr2[i]);
                window_num_arr2.push(1660869761 + i);
                
                if ((i != (arr2.length-1)) && (arr2[i+1] != "E") && (window_arr2.length < 2)) {
                    // if next element is N and lasted 1 second
                    // empty window array
                    //console.log(i+1);
                    window_arr2 = [];
                    window_num_arr2 = [];
                    
                } else {
                    //console.log("if next element is N " + i+1);
                    //console.log("arr2 length = " + arr2.length)
                    ////if ((i != (arr2.length-1)) && (arr2[i+1] == "N" || i == arr2.length-1)) 
                    if ((i == arr2.length-1) || (arr2[i+1] == "N")) {
                        //console.log(" i+1 " +i+1);
                        // if next element is N and lasted > 1 second (previous condition)
                        // create a final array and assign it to the current window array
                        number_arr2 = number_arr2.concat(window_num_arr2);
                        final_arr2 = final_arr2.concat(window_arr2);
                        //console.log(window_arr2);
                        window_arr2 = []; // empty the array 
                        window_num_arr2 = [];
                    } else {
                        // do nothing
                        //console.log(number_arr2);
                        //console.log("next is N and E lasted > 1s " + i+1);
                    }
                }
            } else {
                
                // do nothing
            }
        }
        final_arr2 = final_arr2.concat(window_arr2);
        if (number_arr2.length == 0) {
            document.getElementById("mismatch-two-disc").innerHTML = "0 discrepancies for Cell 2.";
        } else {
            document.getElementById("mismatch-two-disc").innerHTML = "Discrepancies after filtering for noise under 2 seconds for Cell 2: " + number_arr2;
        }
    } else if (cell == 3) {
        for (let i = 0; i < arr3.length; i++) {
            if (arr3[i] == "E") {
                window_arr3.push(arr3[i]);
                window_num_arr3.push(1660869761 + i);
                if ((i != (arr3.length-1)) && (arr3[i+1] != "E") && (window_arr3.length < 2)) {
                    // if next element is N and lasted 1 second
                    // empty window array
                    window_arr3 = [];
                    window_num_arr3 = [];
                } else {
                    //if ((i != (arr3.length-1)) && arr3[i+1] == "N") 
                    if ((i == arr2.length-1) || (arr2[i+1] == "N")) {
                        // if next element is N and lasted > 1 second (previous condition)
                        // create a final array and assign it to the current window array
                        number_arr2 = number_arr2.concat(window_num_arr2);
                        final_arr3 = final_arr3.concat(window_arr3);
                        window_arr3 = []; // empty the array 
                        window_num_arr3 = [];
                    } else {
                        // do nothing
                    }
                }
            } else {
                // do nothing
            }
        }
        final_arr3 = final_arr3.concat(window_arr3);

        if (number_arr3.length === 0) {
            document.getElementById("mismatch-three-disc").innerHTML = "0 discrepancies for Cell 3.";
        } else {
            document.getElementById("mismatch-three-disc").innerHTML = "Discrepancies after filtering for noise under 2 seconds for Cell 3: " + number_arr3;
        }
        
    } else {
    }
    
    
    
    //document.getElementById("mismatch-one-disc").innerHTML = "<br/>Mismatched cells for Cell 1 without discrepancies: " + number_arr1;
    //"DISCREPANCY 1 ARRAY: " + final_arr1 + 
    //document.getElementById("mismatch-two-disc").innerHTML = "<br/>Mismatched cells for Cell 2 without discrepancies: " + number_arr2;
    //"DISCREPANCY 2 ARRAY:" + final_arr2  + "<br/>NUM 2: " + number_arr2;
    
    //document.getElementById("mismatch-three-disc").innerHTML = "<br/>Mismatched cells for Cell 3 without discrepancies: " + number_arr3;
    //"DISCREPANCY 3 ARRAY:" + final_arr3 + "<br/>NUM 3: " + number_arr3;

}

var mismatchedOne = [];
var mismatchedTwo = [];
var mismatchedThree = [];

function add_to_mismatched(cell, t1) { 
   if (cell == 1) {
      mismatchedOne.push(t1);
    } else if (cell == 2) {
        mismatchedTwo.push(t1);
    } else if (cell == 3) {
        mismatchedThree.push(t1);
    }
} 

function remove_duplicated_mismatched() {
    return [mismatchedOne.filter((item, index) => mismatchedOne.indexOf(item) === index), mismatchedTwo.filter((item, index) => mismatchedTwo.indexOf(item) === index), mismatchedThree.filter((item, index) => mismatchedThree.indexOf(item) === index)];
}

function print_mismatched(cell) {
    returnArray = remove_duplicated_mismatched();
    mismatchedOne = returnArray[0];
    mismatchedTwo = returnArray[1];
    mismatchedThree = returnArray[2];
    if (cell == 1) {
        var mismatchOneFuncString = "<br/><strong>Voltage behaviour did not match discharge configuration for the following timestamps for Cell 1: </strong>";
        var mismatchOneString = "";
        for (let i = 0; i < mismatchedOne.length; i++) {
            mismatchOneString += mismatchedOne[i] + " ";
            document.getElementById("mismatch-one").innerHTML = mismatchOneFuncString + "<br/>" + mismatchOneString + "<br/>";
      }
    } else if (cell == 2) {
        var mismatchTwoFuncString = "<br/><strong>Voltage behaviour did not match discharge configuration for the following timestamps for Cell 2: </strong>";
        var mismatchTwoString = "";
        for (let i = 0; i < mismatchedTwo.length; i++) {
        mismatchTwoString += mismatchedTwo[i] + " ";
        document.getElementById("mismatch-two").innerHTML = mismatchTwoFuncString + "<br/>" + mismatchTwoString + "<br/>";
      } 
    } else if (cell == 3) {
        var mismatchThreeFuncString = "<br/><strong>Voltage behaviour did not match discharge configuration for the following timestamps for Cell 3: </strong>";
        var mismatchThreeString = "";
        for (let i = 0; i < mismatchedThree.length; i++) {
        mismatchThreeString += mismatchedThree[i] + " ";
        document.getElementById("mismatch-three").innerHTML = mismatchThreeFuncString + "<br/>" + mismatchThreeString + "<br/>";
        }
    } else { // do nothing
    }
}

// INPUT FEATURE NEXT STEPS:
/*function form_num_rows() {
    var numRows = parseInt(document.getElementById("num-row").value);
    
    //var inputData = "";
    var inputData = document.getElementById("input-data");
    for (let i = 0; i < numRows; i++) {
        //console.log(typeof inputData);
        inputData.innerHTML += "<br/><label for=\"data\">Enter an array of data values, separated by commas: </label>" +
        "<input type=\"text\" id=\"data\"></input>";
    }
    inputData.innerHTML += "<input type=\"submit\" value=\"Submit data\"></input>"; 
    return numRows;
}

function get_data(numRow) {
    //numRows = form_num_rows();
    //var numRow = numRow.value;
    console.log(numRow);
    var finalValues = [];
    for (let i = 0; i < numRow; i++) {
        var dataValues = [];
        dataValues.push(document.getElementById('data').value);
        
        
        
    }
    let splittedValues = dataValues.split(',');
        
    finalValues.push(splittedValues);
    console.log("length: " +finalValues.length);
    console.log("array: " + finalValues);
    
    let resultString = "You have entered :";

    document.getElementById("result-data").innerHTML = resultString + finalValues;
} */



function test() {
    var testString = "hello";
    document.getElementById("test-print").innerHTML  = testString;
}
//window.onload = test(); 
window.onload = find_rate_start_to_finish();
//window.onload = find_rate_of_discharge(1, 6, 5);
//window.onload = form_discharge();
//window.onload = form_num_rows();
window.onload = find_mismatch(1);
window.onload = find_mismatch(2);
window.onload = find_mismatch(3);


