const createChart = (ctx, label, xLabel, yLabel, borderColorArray, multiDataset = false) => {
    const datasets = multiDataset
        ? [
            {
                label: `${label} X`,
                data: [],
                borderColor: borderColorArray[0],
                fill: false,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: `${label} Y`,
                data: [],
                borderColor: borderColorArray[1],
                fill: false,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: `${label} Z`,
                data: [],
                borderColor: borderColorArray[2],
                fill: false,
                borderWidth: 2,
                tension: 0.4
            }
        ]
        : [
            {
                label: label,
                data: [],
                borderColor: borderColorArray[0],
                backgroundColor: borderColorArray[1],
                borderWidth: 2,
                tension: 0.4
            }
        ];

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], 
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xLabel
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
};

const speedTimeChart = createChart(
    document.getElementById('speedTimeChart').getContext('2d'),
    'Speed (m/s)', 'Time (s)', 'Speed (m/s)',
    ['rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)']
);

const temperatureTimeChart = createChart(
    document.getElementById('temperatureTimeChart').getContext('2d'),
    'Temperature (°C)', 'Time (s)', 'Temperature (°C)',
    ['rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)']
);

const humidityTimeChart = createChart(
    document.getElementById('humidityTimeChart').getContext('2d'),
    'Humidity (%)', 'Time (s)', 'Humidity (%)',
    ['rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)']
);

const accelerationTimeChart = createChart(
    document.getElementById('accelerationTimeChart').getContext('2d'),
    'Acceleration (m/s²)', 'Time (ms)', 'Acceleration (m/s²)',
    ['red', 'blue', 'green'],
    true 
);

const socket = new WebSocket('ws://localhost:8081'); // hna badl localhost l ip dyal l raspberry pi

socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);     
    console.log('Data received:', data);

    if (data.speedTime) {
        speedTimeChart.data.labels.push(data.speedTime.time);
        speedTimeChart.data.datasets[0].data.push(data.speedTime.speed);
        speedTimeChart.update();
    }

    if (data.temperatureTime) {
        temperatureTimeChart.data.labels.push(data.temperatureTime.time);
        temperatureTimeChart.data.datasets[0].data.push(data.temperatureTime.temperature);
        temperatureTimeChart.update();
    }

    if (data.humidityTime) {
        humidityTimeChart.data.labels.push(data.humidityTime.time);
        humidityTimeChart.data.datasets[0].data.push(data.humidityTime.humidity);
        humidityTimeChart.update();
    }

    if (data.accelerationTime) {
        accelerationTimeChart.data.labels.push(data.accelerationTime.time);
        accelerationTimeChart.data.datasets[0].data.push(data.accelerationTime.accelerationX);
        accelerationTimeChart.data.datasets[1].data.push(data.accelerationTime.accelerationY);
        accelerationTimeChart.data.datasets[2].data.push(data.accelerationTime.accelerationZ);
        accelerationTimeChart.update();
    }
};

socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
};