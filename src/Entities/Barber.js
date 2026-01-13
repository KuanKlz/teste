{
  "name": "Barber",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do barbeiro"
    },
    "phone": {
      "type": "string",
      "description": "Telefone do barbeiro"
    },
    "commission_type": {
      "type": "string",
      "enum": [
        "percentage",
        "fixed"
      ],
      "description": "Tipo de comiss\u00e3o: percentual ou valor fixo"
    },
    "commission_value": {
      "type": "number",
      "description": "Valor da comiss\u00e3o (% ou R$)"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active",
      "description": "Status do barbeiro"
    },
    "photo_url": {
      "type": "string",
      "description": "URL da foto do barbeiro"
    }
  },
  "required": [
    "name",
    "commission_type",
    "commission_value"
  ],
  "rls": {
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "read": {
      "$or": [
        {
          "user_condition": {
            "role": "admin"
          }
        },
        {
          "user_condition": {
            "role": "user"
          }
        }
      ]
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
    },
    "write": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}