// JavaScript Example: Reading Entities
// Filterable fields: name, phone, commission_type, commission_value, status, photo_url
async function fetchBarberEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/69651143a0949a50f8490533/entities/Barber`, {
        headers: {
            'api_key': 'a547dada387c430da1c4b71c6a3778de', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, phone, commission_type, commission_value, status, photo_url
async function updateBarberEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/69651143a0949a50f8490533/entities/Barber/${entityId}`, {
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