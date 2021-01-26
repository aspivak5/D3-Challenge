// // @TODO: YOUR CODE HERE!
// // The code for the chart is wrapped inside a function that
// // automatically resizes the chart
// function makeResponsive() {

//     // if the SVG area isn't empty when the browser loads,
//     // remove it and replace it with a resized version of the chart
//     var svgArea = d3.select("body").select("svg");
  
//     // clear svg is not empty
//     if (!svgArea.empty()) {
//       svgArea.remove();
//     }
  
//     // SVG wrapper dimensions are determined by the current width and
//     // height of the browser window.
//     var svgWidth = window.innerWidth;
//     var svgHeight = window.innerHeight;
  
//     var margin = {
//       top: 20,
//       bottom: 100,
//       right:40,
//       left: 100
//     };
  
//     var height = svgHeight - margin.top - margin.bottom;
//     var width = svgHeight - margin.left - margin.right;
  
//     //var chart = d3.select("#scatter").append("div").classed("chart",true)
//     // Append SVG element
//     var svg = d3.select("#scatter")
//       .append("svg")
//       .classed("chart",true)
//       .attr("height", svgHeight)
//       .attr("width", svgWidth);
  
//     // Append group element
//     var chartGroup = svg.append("g")
//       .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
//     // Read CSV
//     d3.csv("./assets/data/data.csv").then(function(healthData) {

//       // parse data
//       healthData.forEach(function(data) {
//         data.abbr = data.abbr;
//         data.age = +data.age;
//         data.smokers = +data.smokes;
//       });
  
//       // create scales
//       var xScale = d3.scaleLinear()
//         .domain([28,d3.max(healthData, d => d.age)+5])
//         .range([0, width]);
  
//       var yScale = d3.scaleLinear()
//         .domain([9,d3.max(healthData, d => d.smokers)+2])
//         .range([height, 0]);
  
//       // create axes
//       var xAxis = d3.axisBottom(xScale);
//       var yAxis = d3.axisLeft(yScale);
  
//       // append axes
//       chartGroup.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(xAxis);
  
//       chartGroup.append("g")
//         .call(yAxis);
  
//       // append circles
//     var circleGroup = chartGroup.selectAll("circle")
//         .data(healthData)
//         .enter()
//         .append("circle")
//         .classed("stateCircle",true)
//         .attr("cx", d => xScale(d.age))
//         .attr("cy", d => yScale(d.smokers))
//         .attr("r", "15")
//         .attr('opacity', '0.8');
//     //add state abbr to cirlces
//     var textGroup = chartGroup.selectAll(".stateText")
//       .data(healthData)
//       .enter()
//       .append('text')
//       .classed('stateText', true)
//       .attr('font-size', '10px')
//       .text(d=>d.abbr)
//       .attr("x", d => xScale(d.age))
//       .attr("y", d => yScale(d.smokers)+2)

//     //add axis labels 
//     chartGroup.append("text")
//     .attr("transform",`translate(${width / 2}, ${height + margin.top + 30})`).text("Age(Median)").classed("aText",true);

//     chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left + 40)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("aText",true)
//     .text("Smokers(%)");

//     //add tooltip
//     var tooltip = d3.tip().attr("class","tooltip")
//     .html(function(d){
//       return `${d.abbr}<br> Smokers: ${d.smokers}% <br> Age: ${d.age}`
//     });

//     chartGroup.call(tooltip);

//     textGroup.on("mouseover",function(d){
//       tooltip.show(d,this);
//     })
//     .on("mouseout",function(d){
//       tooltip.hide(d);
//     })
  
  
//     }).catch(function(error) {
//       console.log(error);
//     });
//   }
//   // When the browser loads, makeResponsive() is called.
//   makeResponsive();
  
//   // When the browser window is resized, makeResponsive() is called.
//   d3.select(window).on("resize", makeResponsive);


//bonus 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".scatter")
  .append("svg")
  .classed("chart",true)
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "smokes";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
      d3.max(healthData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1500)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1500)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1500)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy",d=>newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updateText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){
  textGroup.transition()
      .duration(1000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
  // var xlabel;
  // var ylabel;

  if (chosenXAxis === "age") {
    xlabel = "Median Age:";
  }
  else if (chosenXAxis === "poverty") {
    xlabel = "Poverty (%):";
  }
  else{
    xlabel = "Median Income:";
  }

  if (chosenYAxis === "smokes") {
    ylabel = "Smokers(%):";
  }
  else if (chosenYAxis === "obesity") {
    ylabel = "Obesity (%):";
  }
  else{
    ylabel = "Lack Healthcare (%):";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([-8,0])
    .html(function(d) {
      return `${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`;
    });

 circlesGroup.call(toolTip)

  circlesGroup.on("mouseover", toolTip.show)
    // onmouseout event
    .on("mouseout", toolTip.hide);


  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(healthData, err) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.abbr = data.abbr;
    data.age = +data.age;
    data.smokers = +data.smokes;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.poverty = +data.poverty;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis)

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    //.classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

  var textGroup = chartGroup.selectAll(".stateText")
      .data(healthData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('font-size', '10px')
      .text(d=>d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))

  

  // Create group for two x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("In Poverty(%)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income(Median)");

  // append y axis
  var ylabelsGroup = chartGroup.append('g')
  .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);


  var smokesLabel = ylabelsGroup.append('text')
  .classed('aText', true)
  .classed('active', true)
  .attr('x', 0)
  .attr('y', 0 - 20)
  .attr('dy', '1em')
  .attr('transform', 'rotate(-90)')
  .attr('value', 'smokes')
  .text('Smoker (%)');

  var healthcareLabel = ylabelsGroup.append('text')
  .classed('aText', true)
  .classed('inactive', true)
  .attr('x', 0)
  .attr('y', 0 - 40)
  .attr('dy', '1em')
  .attr('transform', 'rotate(-90)')
  .attr('value', 'healthcare')
  .text('Without Healthcare (%)');

var obesityLabel = ylabelsGroup.append('text')
  .classed('aText', true)
  .classed('inactive', true)
  .attr('x', 0)
  .attr('y', 0 - 60)
  .attr('dy', '1em')
  .attr('transform', 'rotate(-90)')
  .attr('value', 'obesity')
  .text('Obese (%)');
  

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup,chosenYAxis);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, textGroup, yLinearScale,chosenYAxis);

        textGroup = updateText(xLinearScale, chosenXAxis, textGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup,chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel.classed("active", true).classed("inactive", false);
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", true).classed("inactive", false);
          incomeLabel.classed("active", false).classed("inactive", true);
        }
        else {
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", true).classed("inactive",false);
        }

      }
    });

    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale,chosenYAxis);

        textGroup = updateText(xLinearScale, chosenXAxis, textGroup, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup,chosenYAxis);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel.classed("active", true).classed("inactive", false);
          obesityLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
          smokesLabel.classed("active", false).classed("inactive", true);
          obesityLabel.classed("active", true).classed("inactive", false);
          healthcareLabel.classed("active", false).classed("inactive", true);
        }
        else {
          smokesLabel.classed("active", false).classed("inactive", true);
          obesityLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", true).classed("inactive", false);
        }

      }
    });

}).catch(function(error) {
  console.log(error);
});

  