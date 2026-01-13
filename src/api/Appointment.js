// JavaScript Example: Reading Entities
// Filterable fields: barber_id, barber_name, service_id, service_name, service_price, commission_amount, net_amount, payment_method, client_name, appointment_date, status, notes
async function fetchAppointmentEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/69651143a0949a50f8490533/entities/Appointment`, {
        headers: {
            'api_key': 'a547dada387c430da1c4b71c6a3778de', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: barber_id, barber_name, service_id, service_name, service_price, commission_amount, net_amount, payment_method, client_name, appointment_date, status, notes
async function updateAppointmentEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/69651143a0949a50f8490533/entities/Appointment/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': 'a547dada387c430da1c4b71c6a3778de', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}