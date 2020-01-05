$(async () => {
    $("#addSensorForm button").click(async (e) => {
        const url = 'http://localhost:3000/sensor';
        const data = serializeForm("#addSensorForm");

        hideElement("#addSensorAlerts .alert")

        try {
            await $.post(url, data);
            showElement("#addSensorAlerts .alert-success");
        } catch(err) {
            showElement("#addSensorAlerts .alert-danger");
        }
        
        e.preventDefault();
    });

    $("#searchSensorForm button").click(async (e) => {
        const url = 'http://localhost:3000/sensor';
        const data = serializeForm("#searchSensorForm");

        hideElement("#searchSensorAlerts .alert");
        hideElement("#sensorSearchResults");
        $("#sensorSearchResults .results").empty();

        try {
            const res = await $.get(url, data);
            res.forEach(doc => {
                const docElement = `<div class="card mb-5">
                    <div class="card-body">
                        <p><b>Sensor Name</b> ${doc.sensorName}</p>
                        <p><b>Sensor ID</b> ${doc.sensorID}</p>
                        <p><b>Sensor Type</b> ${doc.sensorType}</p>
                    </div>
                </div>`;
                $("#sensorSearchResults .results").append(docElement);
            });

            showElement("#sensorSearchResults")
        } catch(err) {
            showElement("#searchSensorAlerts .alert-danger")
        }

        e.preventDefault();
    });
});

/* Helper Functions*/
const hideElement = id => $(id).addClass('d-none');
const showElement = id => $(id).removeClass('d-none');
const serializeForm = id => {
    const formData = $(id).serializeArray();
    return formData.reduce((acc, val) => {
        acc[val.name] = val.value;
        return acc;
    }, {});
}