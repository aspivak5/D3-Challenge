//bonus 
//bonus 
function makeResponsive(){

    var svgArea = d3.select("body").select("svg");
  
    // Clear SVG is Not Empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
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
            .domain([d3.min(healthData, d => d[chosenXAxis]),
             d3.max(healthData, d => d[chosenXAxis])])
            .range([0, width]);

        return xLinearScale;
    }

    function yScale(healthData, chosenYAxis) {
    // create scales
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenYAxis]),
            d3.max(healthData, d => d[chosenYAxis])])
            .range([height, 0]);

        return yLinearScale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));
        return circlesGroup;
    }

    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis){
        textGroup.transition()
            .duration(1000)
            .attr('x', d => newXScale(d[chosenXAxis]))
            .attr('y', d => newYScale(d[chosenYAxis]));

        return textGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {
    
            if (chosenXAxis === "poverty") {
            var xLabel = "Poverty (%)";
            }
            else if (chosenXAxis === "age") {
            var xLabel = "Age (Median)";
            }
            else {
            var xLabel = "Household Income (Median)";
            }
            if (chosenYAxis === "healthcare") {
            var yLabel = "Lacks Healthcare (%)";
            }
            else if (chosenYAxis === "obesity") {
            var yLabel = "Obese (%)";
            }
            else {
            var yLabel = "Smokes (%)";
            }

            // Initialize Tool Tip
            var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([90, 90])
                .html(function(d) {
                     return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
            });
            // Create Circles Tooltip in the Chart
            circlesGroup.call(toolTip);
            // Create Event Listeners to Display and Hide the Circles Tooltip
            circlesGroup.on("mouseover", function(data) {
                toolTip.show(data, this);
                })
            // onmouseout Event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
            // Create Text Tooltip in the Chart
            textGroup.call(toolTip);
            // Create Event Listeners to Display and Hide the Text Tooltip
            textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
            })
            // onmouseout Event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });
            return circlesGroup;
    }


    // Retrieve data from the CSV file and execute everything below
    d3.csv("assets/data/data.csv").then(function(healthData) {
    

    // parse data
    healthData.forEach(function(data) {
        data.abbr = data.abbr;
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
        data.poverty = +data.poverty;
    });
    console.log(healthData)

    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(healthData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .classed("stateCircle",true)
        .attr("opacity", ".7");

    var textGroup = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append('text')
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .classed('stateText', true)
        .attr('font-size', '10px')
        .text(d=>d.abbr);

    

    // Create group for x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .classed('aText', true)
        .text("Age (Median)");

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .classed('aText', true)
        .text("In Poverty(%)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .classed('aText', true)
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
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

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
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

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
}

  // When Browser Loads, makeResponsive() is Called
  makeResponsive();
  
  // When Browser Window is Resized, makeResponsive() is Called
  d3.select(window).on("resize", makeResponsive);