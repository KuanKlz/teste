// JavaScript Example: Reading Entities
// Filterable fields: name, price, duration, default_commission, status
async function fetchServiceEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/69651143a0949a50f8490533/entities/Service`, {
        headers: {
            'api_key': 'a547dada387c430da1c4b71c6a3778de', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, price, duration, default_commission, status
async function updateServiceEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/69651143a0949a50f8490533/entities/Service/${entityId}`, {
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