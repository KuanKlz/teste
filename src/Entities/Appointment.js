{
  "name": "Appointment",
  "type": "object",
  "properties": {
    "barber_id": {
      "type": "string",
      "description": "ID do barbeiro"
    },
    "barber_name": {
      "type": "string",
      "description": "Nome do barbeiro"
    },
    "service_id": {
      "type": "string",
      "description": "ID do servi\u00e7o"
    },
    "service_name": {
      "type": "string",
      "description": "Nome do servi\u00e7o"
    },
    "service_price": {
      "type": "number",
      "description": "Valor do servi\u00e7o"
    },
    "commission_amount": {
      "type": "number",
      "description": "Valor da comiss\u00e3o calculada"
    },
    "net_amount": {
      "type": "number",
      "description": "Valor l\u00edquido da barbearia"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "cash",
        "card",
        "pix"
      ],
      "description": "Forma de pagamento"
    },
    "client_name": {
      "type": "string",
      "description": "Nome do cliente (opcional)"
    },
    "appointment_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora do atendimento"
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "cancelled"
      ],
      "default": "completed"
    },
    "notes": {
      "type": "string",
      "description": "Observa\u00e7\u00f5es"
    }
  },
  "required": [
    "barber_id",
    "service_id",
    "service_price",
    "commission_amount",
    "payment_method",
    "appointment_date"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {
      "user_condition": {
        "role": "admin"
      }
    },
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}