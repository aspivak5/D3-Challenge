// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 20,
      bottom: 80,
      right:10,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgHeight - margin.left - margin.right;
  
    //var chart = d3.select("#scatter").append("div").classed("chart",true)
    // Append SVG element
    var svg = d3.select("#scatter")
      .append("svg")
      .classed("chart",true)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("./assets/data/data.csv").then(function(healthData) {

      // parse data
      healthData.forEach(function(data) {
        data.abbr = data.abbr;
        data.age = +data.age;
        data.smokers = +data.smokes;
      });
  
      // create scales
      var xScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.age)*0.9,d3.max(healthData, d => d.age)*1.1])
        .range([0, width]);
  
      var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.smokers)*0.7,d3.max(healthData, d => d.smokers)*1.1])
        .range([height, 0]);
  
      // create axes
      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);
  
      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
  
      chartGroup.append("g")
        .call(yAxis);
  
      // append circles
    var circleGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .classed("stateCircle",true)
        .attr("cx", d => xScale(d.age))
        .attr("cy", d => yScale(d.smokers))
        .attr("r", "15")
        .attr('opacity', '0.8');
    //add state abbr to cirlces
    var textGroup = chartGroup.selectAll(".stateText")
      .data(healthData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('font-size', '10px')
      .text(d=>d.abbr)
      .attr("x", d => xScale(d.age))
      .attr("y", d => yScale(d.smokers)+2)

    //add axis labels 
    chartGroup.append("text")
    .attr("transform",`translate(${width / 2}, ${height + margin.top + 30})`)
    .text("Age (Median)")
    .classed("aText",true);

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left +5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText",true)
    .text("Smokers (%)");

    //add tooltip
    var tooltip = d3.tip().attr("class","tooltip")
    .html(function(d){
      return `${d.abbr}<br> Smokers: ${d.smokers}% <br> Age: ${d.age}`
    });

    chartGroup.call(tooltip);

    textGroup.on("mouseover",function(d){
      tooltip.show(d,this);
    })
    .on("mouseout",function(d){
      tooltip.hide(d);
    })
  
  
    }).catch(function(error) {
      console.log(error);
    });
  }
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);



  