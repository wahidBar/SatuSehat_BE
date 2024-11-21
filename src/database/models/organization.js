// Encounter.js
module.exports = {
    resourceType: 'Encounter',
    id: 'string',
    identifier: [{
        system: 'string',
        value: 'string'
    }],
    status: 'string',
    class: {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
        code: 'string',
        display: 'string'
    },
    subject: {
        reference: 'string',
        display: 'string'
    },
    participant: [{
        type: [{
            coding: [{
                system: 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                code: 'string',
                display: 'string'
            }]
        }],
        individual: {
            reference: 'string',
            display: 'string'
        }
    }],
    period: {
        start: 'string'
    },
    location: [{
        location: {
            reference: 'string',
            display: 'string'
        },
        extension: [{
            url: 'https://fhir.kemkes.go.id/r4/StructureDefinition/ServiceClass',
            extension: [{
                url: 'value',
                valueCodeableConcept: {
                    coding: [{
                        system: 'http://terminology.kemkes.go.id/CodeSystem/locationServiceClass-Outpatient',
                        code: 'string',
                        display: 'string'
                    }]
                }
            }]
        }]
    }],
    statusHistory: [{
        status: 'string',
        period: {
            start: 'string',
            end: 'string'
        }
    }],
    serviceProvider: {
        reference: 'string'
    }
};
