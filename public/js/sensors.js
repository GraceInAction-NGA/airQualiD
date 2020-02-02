$(async () => {
    $("#addSensorForm button").click(async (e) => {
        const url = '/sensor';
        const data = serializeForm("#addSensorForm");

        hideElement("#addSensorAlerts .alert")

        try {
            await $.post(url, data);
            showElement("#addSensorAlerts .alert-success");
        } catch(err) {
            console.log(err);
            showElement("#addSensorAlerts .alert-danger");
        }
        
        e.preventDefault();
    });

    $("#searchSensorForm button").click(async (e) => {
        const url = '/sensor';
        const data = serializeForm("#searchSensorForm");

        hideElement("#searchSensorAlerts .alert");
        hideElement("#sensorSearchResults");
        $("#sensorSearchResults .results").empty();

        try {
            const res = await $.get(url, data);
            console.log(res);
            
            if (res.length > 0) {
                res.forEach(doc => {
                    const bodyElement = `
                        <p><b>Sensor Name</b> ${doc.sensorName}</p>
                        <p><b>Sensor ID</b> ${doc.sensorID}</p>
                        <p><b>Sensor Type</b> ${doc.sensorType}</p>
                    `;
                    const docElement = createDocElement(bodyElement);
                    $("#sensorSearchResults .results").append(docElement);
                });
            } else {
                const bodyElement = '<p>No Sensor Found</p>'
                const docElement = createDocElement(bodyElement);
                $("#sensorSearchResults .results").append(docElement);
            }

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
const createDocElement = (bodyElement) => `
    <div class="card mb-5">
        <div class="card-body">
            ${bodyElement}
        </div>
    </div>
`;