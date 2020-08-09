
google.charts.load('current', {packages: ['corechart', 'bar']});

const instance = new Datepicker(document.getElementById("datepicker"), {
  format: (d) => {
    var dt = d.getDate().toString()
    var mt = d.getMonth().toString()
    return [
      d.getFullYear(),
      ((mt.length == 1) ? "0"+d.getMonth() : d.getMonth()),
      ((dt.length == 1) ? "0"+d.getDate() : d.getDate()),
    ].join("-");
  },
  first_day_of_week: "sun",
  initial_date: new Date(2019, 08, 06),
});

const instanceEnd = new Datepicker(document.getElementById("datepickerEnd"), {
  format: (d) => {
    var dt = d.getDate().toString()
    var mt = d.getMonth().toString()
    return [
      d.getFullYear(),
      ((mt.length == 1) ? "0"+d.getMonth() : d.getMonth()),
      ((dt.length == 1) ? "0"+d.getDate() : d.getDate()),
    ].join("-");
  },
  first_day_of_week: "sun",
  initial_date: new Date(2019, 08, 06),
});


//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers= ["currencyPair", "time", "Blank", "value"];

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }

  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}

function getDate(jsonReturn, quantity) {

    const ret = [];

    for (var i = 0; i < quantity; i++) {

      ret.push([new Date(jsonReturn[i].time), Number(jsonReturn[i].value)],)

    }

     console.log(ret)
     return ret;
}

function drawAxisTickColors(jsonReturn, quantity) {
      var data = new google.visualization.DataTable();
      data.addColumn('datetime', 'Time of Day');
      data.addColumn('number', 'Value');

      data.addRows(
        getDate(jsonReturn, quantity)
      );

      var options = {
        title: 'NewChangeFX Spot Data Series',
        focusTarget: 'category',
        hAxis: {
          title: 'Date/Time',
          //format: 'yyyy-MM-dd',
          //format: 'h:mm a',
          viewWindow: {
          },
          textStyle: {
            fontSize: 14,
            color: '#053061',
            bold: true,
            italic: false
          },
          titleTextStyle: {
            fontSize: 18,
            color: '#053061',
            bold: true,
            italic: false
          }
        },
        vAxis: {
          title: 'Rate',
          textStyle: {
            fontSize: 18,
            color: '#67001f',
            bold: false,
            italic: false
          },
          titleTextStyle: {
            fontSize: 18,
            color: '#67001f',
            bold: true,
            italic: false
          }
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

    function handleSubmit(){

      const dtStart = document.getElementById("datepicker");
      const dtEnd = document.getElementById("datepickerEnd");
      const currencyPair = document.getElementById("currencyPair");
      const quantity = document.getElementById("quantity");
      const time = document.getElementById("time");
      const endTime = document.getElementById("endTime");

      console.log(dtStart.value)
      console.log(dtEnd.value)
      console.log(currencyPair.value)
      console.log(quantity.value)
      console.log(time.value)
      console.log(endTime.value)

      const data = [{
          "currencyPairs": currencyPair.value,
          "startDate": dtStart.value + " " + time.value,
          "endDate": dtEnd.value + " " + endTime.value,
      }];

      console.log(data)

      fetch('http://api.newchangefx.com/api/data/series/spot', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic SmFzb25TOk11cHBldDY5',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(data),
      })
      .then(response => response.text())
      .then(data => {
          
          google.charts.setOnLoadCallback(drawAxisTickColors(csvJSON(data), quantity.value));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    }
