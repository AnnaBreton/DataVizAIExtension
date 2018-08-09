let xInput;
let xInput2 = [];
let myTitle;
let userAPI = "";

var SODEXTitleVal = "TestTitle";
var SODEXInitialPathVal;
var SODEXFileTypesVal = new Array();
SODEXFileTypesVal[0] = "*.*";
var SODEXFriendlyFilePrefixVal = "All files";
var SODEXAllowMultipleSelectionVal = true;
var SODEXChooseDirectoryVal = false;
var SODEXPromptVal = "OK";

// File save EX dialog
var SSDEXTitleVal = "TestTitle";
var SSDEXInitialPathVal;
var SSDEXFileTypesVal = new Array();
SSDEXFileTypesVal[0] = "*.*";
var SSDEXDefaultNameVal = "test.txt"
var SSDEXFriendlyFilePrefixVal = "All files";
var SSDEXPromptVal = "Save";
var SSDEXNameFieldLabelVal = "File name:";

let svg = d3.select('svg')
    .attr("id", "visualization")
    .attr("xmlns", "http://www.w3.org/2000/svg");
margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
let x1 = d3.scaleBand().padding(0.05); //keys

let y = d3.scaleLinear().rangeRound([height, 0]);
let z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#e2ab08"]);

//Draw Function
function draw(data, DisplayField) {



    keys = Object.keys(data);                                                  // with the JSON data, we use the built in Object.keys method to get the keys from the object
    console.log("KEYS " + keys )
    values =  Object.values(data);
    console.log("VALUES " + values )

    x0.domain([DisplayField]);                                                 // now with the JSON data, we grab the display field which can be found in the rest services directory
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);

    y.domain([0, d3.max([data], function (d) {
        return d3.max(keys, function (key) {
            return d[key];
        });
    })]).nice();


    //------------------bar graph stuff----------------
    g.append("g")
        .selectAll("g")
        .data([data])
        .enter().append("g")
        .attr("id", "visualization")
        .attr("xmlns", "http://www.w3.org/2000/svg", "xmlns: svg=", "http://www.w3.org/2000/svg")
        .attr("transform", function () {
            return "translate( 1,0)";
        })

        .selectAll("rect")
        .data(function (d) {
            //console.log("RECT" + keys.map(function (key) {
               // return {key: key, value: d[key]}
            //}));
            return keys.map(function (key) {
                return {key: key, value: d[key]};
            });
        })

        .enter().append("rect")                                     //The width of each bar
        .attr("x", function (d) {
            return (x1(d.key));
        })

        .attr("y", function (d) {                                 //This draws the height of the bars
            return y(d.value);                                     //This is our final scaled value that we'll use for drawing our bars
        })

        .attr("width", x1.bandwidth())                             //Returns the height of each bar
        .attr("height", function (d) {
            return height - y(d.value);
        })

        .style("stroke", "black")                                   //Color fill
        .attr("fill", function (d) {
            return z(d.key);
        })

    console.log("values " + Object.values(data));
    for (let attr in data)
        console.log("draw()- key:" + attr + ", value: " + data[attr]);


  //  var ourvalues = Object.values(data)+ '';

//    ourvalues.split(/\s*,\s*/).forEach(function(DataValues) {
    /*
        console.log("Our individual data values " + DataValues);
        let z1 = d3.scaleOrdinal().range([DataValues])
        //console.log("Z1 " + );

        g.append("text")
            .attr("x", x0)
            .attr("y",  -200)
            .attr("dy", "0.32em")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .text( function() {
                return(DataValues)
            });
    });
*/

    //-------------------label and legend stuff--------------------------

    g.append("g")                                                    //title
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", width / 2)
        .attr("y", y(y.ticks()) + .5)
        .attr("dy", "0.0em")
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .style("font-size", "20px")
        .text(myTitle);

    g.append("g")                                                    //Display Field label on chart
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")                                                    //Y-Axis text on chart
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks()) + .5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Y-Axis");
    let legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z)
        .style("stroke", "black");

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });
    /*

    bars.append("text")
        .attr("class", "label")
        //y position of the label is halfway down the bar
        .attr("y", function (d) {
            return y(d.name) + y.rangeBand() / 2 + 4;
        })
        //x position is 3 pixels to the right of the bar
        .attr("x", function (d) {
            return x(d.value) + 3;
        })
        .text(function (d) {
            return d.value;
        });
        */
}

require(["dojo/dom", "dojo/on", "esri/tasks/query", "esri/tasks/QueryTask", "dojo/domReady!"],
    function (dom, on, Query, QueryTask) {
        on(dom.byId("execute"), "click", execute);

        function execute() {                                               //execute function takes user API input and process the data
            let queryTask = new QueryTask(userAPI);
            let query = new Query();
            query.returnGeometry = false;
            query.outFields = xInput2;
            query.text = dom.byId("DisplayField").value;
            console.log("getting ready to execute query");
            queryTask.execute(query, showResults2);
            console.log("executed query");
        }

        function showResults2(results) {
            let resultItems = {};                                         // create an empty object that will be used to pass the json data to Draw
            let resultCount = results.features.length;                    // get number of items the rest api returned
            //console.log("result count " + resultCount);
            let featureAttributes;
            for (let i = 0; i < resultCount; i++) {
                featureAttributes = results.features[i].attributes;
                for (let attr in featureAttributes) {
                    resultItems[attr] = Number(featureAttributes[attr]);  // this takes the JSON name and value and creates the equivalent object.
                }
            }
            draw(resultItems, dom.byId("DisplayField").value);
            // dom.byId("info").innerHTML = resultItems;
        }
    }
);

//----------------------------------------------------------------------------------------------------
//----------------------------------------UPDATE CHART------------------------------------------------
//----------------------------------------------------------------------------------------------------
function UpdateChart() {

    let svg = d3.select('svg')
            .attr("id", "visualization")
            .attr("xmlns", "http://www.w3.org/2000/svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
    let x1 = d3.scaleBand().padding(0.05); //keys
    let y = d3.scaleLinear().rangeRound([height, 0]);
    let z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#e2ab08"]);

    function draw(data, DisplayField) {
        for (let attr in data)
            keys = Object.keys(data);

        x0.domain([DisplayField]);
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);

        y.domain([0, d3.max([data], function (d) {
            return d3.max(keys, function (key) {
                return d[key];
            });
        })]).nice();

        g.append("g")
            .selectAll("g")
            .data([data])
            .enter().append("g")
            .attr("id", "visualization")
            .attr("xmlns", "http://www.w3.org/2000/svg", "xmlns: svg=", "http://www.w3.org/2000/svg")
            .attr("transform", function () {
                return "translate( 1,0)";
            })
            .selectAll("rect")
            .data(function (d) {
                return keys.map(function (key) {
                    return {key: key, value: d[key]};
                });
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return (x1(d.key));
            })

            .attr("y", function (d) {
                return y(d.value);
            })

            .attr("width", x1.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            })

            .style("stroke", "black")
            .attr("fill", function (d) {
                return z(d.key);
            });

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", width / 2)
            .attr("y", y(y.ticks()) + .5)
            .attr("dy", "0.0em")
            .attr("text-anchor", "middle")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .style("font-size", "20px")
            .text(myTitle);

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks()) + .5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Y-Axis");
        let legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });
        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z)
            .style("stroke", "black");
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")

            .text(function (d) {
                return d;
            });
    }

//------------------------------- Update data query section ------------------------------------------------------------->

    require(["dojo/dom", "dojo/on", "esri/tasks/query", "esri/tasks/QueryTask", "dojo/domReady!"],
        function (dom, on, Query, QueryTask) {
            on(dom.byId("execute"), "click", execute);

            function execute() {
                let queryTask = new QueryTask(userAPI);
                let query = new Query();
                query.returnGeometry = false;
                query.outFields = xInput2;
                query.text = dom.byId("DisplayField").value;
                queryTask.execute(query, showResults2);
            }

            function showResults2(results) {
                let resultItems = {};
                let resultCount = results.features.length;
                let featureAttributes;
                for (let i = 0; i < resultCount; i++) {
                    featureAttributes = results.features[i].attributes;
                    for (let attr in featureAttributes) {
                        resultItems[attr] = Number(featureAttributes[attr]);
                    }
                }
                draw(resultItems, dom.byId("DisplayField").value);
                dom.byId("info").innerHTML = resultItems;
            }
        }
    )
}

function clearChart() {
    svg.select("*").remove();
}

function clearText() {
    svg.selectAll("text").remove();
    svg.selectAll("line").remove();
}

function writeTitle() {
    myTitle = document.getElementById("title").value;
}


//function for getting x-axis values
function xValues() {
    xInput = document.getElementById("xUserInput").value;
    xInput2 = xInput.split(",");
    //console.log("xinput values" + xInput2);
}

//function for getting REST API
function APIValue() {
    userAPI = document.getElementById("APIInput").value;
    console.log(" API input " + userAPI);
}

//-------------------------------------------------------------------------------- Download ¯\_(ツ)_/¯ should append svg element instead of hard coding
d3.select("#download").on("click", function () {
var result = window.cep.fs.showSaveDialogEx(SSDEXTitleVal,
    SSDEXInitialPathVal,
    SSDEXFileTypesVal,
    SSDEXDefaultNameVal,
    SSDEXFriendlyFilePrefixVal,
    SSDEXPromptVal,
    SSDEXNameFieldLabelVal);
var targetFilePath = result.data;
var writeResult = window.cep.fs.writeFile(targetFilePath, "<svg xmlns=\"http://www.w3.org/2000/svg\">" + d3.select("svg").html() + "</svg>");
if (0 != writeResult.err){
    alert("failed to write a file at the destination:" + targetFilePath + ", error code:" + writeResult.err);
}
});
/*
d3.select("#download").on("click", function () {
    d3.select(this)
        .attr("href", 'data:application/octet-stream;base64,' + btoa("<svg xmlns=\"http://www.w3.org/2000/svg\">" + d3.select("svg").html() + "</svg>"))
        .attr("download", "viz.svg")
});
*/
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------Return ArcGIS Service Content-------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------

require(["dojo/dom", "dojo/on", "dojo/dom-class", "dojo/_base/json", "dojo/_base/array", "dojo/string", "esri/request", "dojo/domReady!"],
    function (dom, on, domClass, dojoJson, array, dojoString, esriRequest) {

    dom.byId("APIInput").value = "";
    dom.byId("content").value = "";

    //handle the execute button's click event
    on(dom.byId("execute"), "click", getContent);

    function getContent() {

        var contentDiv = dom.byId("content");
        contentDiv.value = "";
        domClass.remove(contentDiv, "failure");
        dom.byId("status").innerHTML = "Downloading...";

        //get the url and setup a proxy
        var url = dom.byId("APIInput").value;

        if (url.length === 0) {
            alert("Please enter a URL");
            return;
        }

        var requestHandle = esriRequest({
            "url": url,
            "content": {
                "f": "json"
            },
            "callbackParamName": "callback"
        });
        requestHandle.then(requestSucceeded, requestFailed);
    }

    function requestSucceeded(response, io) {
        var fieldInfo, pad;
        pad = dojoString.pad;

        //toJson converts the given JavaScript object
        //and its properties and values into simple text
        dojoJson.toJsonIndentStr = "  ";
        //console.log("response as text:\n", dojoJson.toJson(response, true));
        dom.byId("status").innerHTML = "";

        //show field names and aliases
        if (response.hasOwnProperty("fields")) {
            //console.log("got some fields");
            fieldInfo = array.map(response.fields, function (f) {
                return pad("Field:", 8, " ", true) + pad(f.name, 25, " ", true) +
                    pad("Alias:", 8, " ", true) + pad(f.alias, 25, " ", true) +
                    pad("Type:", 8, " ", true) + pad(f.type, 25, " ", true);
            });
            dom.byId("content").value = fieldInfo.join("\n");
        } else {
            dom.byId("content").value = "No field info found. Please double-check the URL.";
        }
    }

    function requestFailed(error, io) {
        domClass.add(dom.byId("content"), "failure");
        dojoJson.toJsonIndentStr = " ";
        dom.byId("content").value = dojoJson.toJson(error, true);
    }
});