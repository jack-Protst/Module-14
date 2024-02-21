const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to create the initial visualization
function init() {
    // Fetch the data only once
    d3.json(url).then(response => {
        const names = response.names;
        const selector = d3.select("#selDataset");
        
        // Populate the dropdown menu
        names.forEach(name => {
            selector.append("option").text(name).property("value", name);
        });

        const initialSample = names[0];
        updateVisualizations(initialSample, response);
    });
}

// Function to update visualizations
function updateVisualizations(sampleId, data) {
    const samples = data.samples.filter(sample => sample.id === sampleId)[0];
    const metadata = data.metadata.filter(sample => sample.id == sampleId)[0];

    createBarChart(samples);
    createBubbleChart(samples);
    displayDemographicInfo(metadata);
}

// Function to create a bar chart
function createBarChart(sample) {
    const trace1 = {
        x: sample.sample_values.slice(0, 10).reverse(),
        y: sample.otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse(),
        text: sample.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
            color: ['#B19470', '#7DB9B6', '#43766C', '#E96479', '#26577C', '#EAE2B7', '#FCBF49', '#F77F00', '#D62828', '#003049']
        }
    };
    Plotly.newPlot("bar", [trace1]);
}

// Function to create a bubble chart
function createBubbleChart(sample) {
    const trace2 = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: 'Bluered'
        }
    };
    const layout = { title: 'OTU ID'};
    Plotly.newPlot("bubble", [trace2], layout);
}

// Function to display demographic information
function displayDemographicInfo(metadata) {
    const demoDiv = d3.select("#sample-metadata");
    demoDiv.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        demoDiv.append("p").text(`${key}: ${value}`);
    });
}

// Function to handle a change in the selected sample
function optionChanged(newSample) {
    d3.json(url).then(data => {
        updateVisualizations(newSample, data);
    });
}

init();
