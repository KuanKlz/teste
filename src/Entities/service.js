{
  "name": "Service",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome do servi\u00e7o"
    },
    "price": {
      "type": "number",
      "description": "Valor do servi\u00e7o"
    },
    "duration": {
      "type": "number",
      "description": "Dura\u00e7\u00e3o em minutos"
    },
    "default_commission": {
      "type": "number",
      "description": "Comiss\u00e3o padr\u00e3o em percentual"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "default": "active"
    }
  },
  "required": [
    "name",
    "price"
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
    }
  }
}